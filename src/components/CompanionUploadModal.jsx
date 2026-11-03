import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { X, Smartphone, CheckCircle2, RefreshCw, Clock, Wifi, AlertCircle } from 'lucide-react';

const POLL_INTERVAL_MS = 2000;

/**
 * Fase 3 · Modal "Capturar con mi celular" (lado PC).
 * Crea una sesión temporal, muestra el QR y consulta cada 2 s si el celular ya envió un archivo.
 *
 * Props:
 *  - kind: 'image' | 'model'
 *  - authHeaders: { headers, params } del panel
 *  - onReceive(file): se llama una vez por cada archivo nuevo { url, fileType, originalName }
 *  - onClose()
 */
export default function CompanionUploadModal({ kind = 'image', authHeaders, onReceive, onClose }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('creating'); // creating | waiting | connected | received | expired | error
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(null);
  const [receivedCount, setReceivedCount] = useState(0);
  const seenIdsRef = useRef(new Set());
  const onReceiveRef = useRef(onReceive);
  onReceiveRef.current = onReceive;

  const createSession = useCallback(async () => {
    setStatus('creating');
    setError('');
    seenIdsRef.current = new Set();
    try {
      const res = await axios.post(
        '/api/v1/upload/companion/session',
        { kind, origin: window.location.origin },
        authHeaders
      );
      setSession(res.data);
      setStatus('waiting');
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'No se pudo generar el código QR. Revisa tu conexión.');
    }
  }, [kind, authHeaders]);

  useEffect(() => {
    createSession();
  }, [createSession]);

  // Consulta periódica del estado de la sesión
  useEffect(() => {
    if (!session?.token || status === 'expired' || status === 'error') return undefined;
    let stopped = false;

    const poll = async () => {
      try {
        const res = await axios.get(`/api/v1/upload/companion/session/${session.token}`, authHeaders);
        if (stopped) return;
        const { files = [], status: remoteStatus } = res.data;
        const fresh = files.filter((f) => !seenIdsRef.current.has(f.id));
        fresh.forEach((f) => {
          seenIdsRef.current.add(f.id);
          onReceiveRef.current?.(f);
        });
        if (fresh.length) setReceivedCount((c) => c + fresh.length);
        setStatus((prev) => {
          if (remoteStatus === 'received' || prev === 'received') return 'received';
          if (remoteStatus === 'connected') return 'connected';
          return prev;
        });
      } catch (err) {
        if (stopped) return;
        if (err.response?.status === 404) setStatus('expired');
        // Errores de red transitorios: se reintenta en el siguiente ciclo
      }
    };

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [session?.token, status, authHeaders]);

  // Cuenta regresiva
  useEffect(() => {
    if (!session?.expiresAt) return undefined;
    const tick = () => {
      const ms = new Date(session.expiresAt).getTime() - Date.now();
      setRemaining(Math.max(0, ms));
      if (ms <= 0) setStatus('expired');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.expiresAt]);

  // Cerrar sesión en el servidor al desmontar
  useEffect(() => {
    const token = session?.token;
    return () => {
      if (token) axios.delete(`/api/v1/upload/companion/session/${token}`, authHeaders).catch(() => {});
    };
  }, [session?.token, authHeaders]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const minutes = remaining != null ? Math.floor(remaining / 60000) : null;
  const seconds = remaining != null ? Math.floor((remaining % 60000) / 1000) : null;
  const isModel = kind === 'model';

  const steps = [
    { id: 'waiting', label: 'Escanea el QR con la cámara de tu celular' },
    { id: 'connected', label: isModel ? 'Elige tu archivo .GLB / .USDZ' : 'Toma la foto del platillo' },
    { id: 'received', label: 'Aparece aquí automáticamente' }
  ];
  const stepIndex = status === 'received' ? 2 : status === 'connected' ? 1 : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="companion-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/25 shadow-2xl shadow-amber-500/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl" aria-hidden="true" />

        <div className="relative p-5 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 id="companion-modal-title" className="text-base font-black text-white">Capturar con mi celular</h2>
              <p className="text-xs text-slate-400">{isModel ? 'Envía tu modelo 3D' : 'Toma la foto y aparece aquí'} sin cables ni correos</p>
            </div>
          </div>
          <button type="button" id="companion-modal-close" onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative px-5 pb-5">
          {/* QR / estados */}
          <div className="relative mx-auto w-60 h-60 rounded-3xl bg-white p-3 shadow-xl flex items-center justify-center">
            {status === 'creating' && <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" />}

            {session?.qrDataUrl && status !== 'creating' && (
              <img
                src={session.qrDataUrl}
                alt="Código QR para subir desde el celular"
                className={`w-full h-full transition-all duration-500 ${status === 'expired' || status === 'received' ? 'opacity-15 blur-[2px]' : ''}`}
              />
            )}

            {status === 'received' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-[fadeIn_0.4s_ease-out]">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <p className="mt-2 text-sm font-black text-slate-900">¡Recibido!</p>
                <p className="text-[11px] text-slate-600 px-6">{receivedCount > 1 ? `${receivedCount} archivos recibidos` : 'Ya está en el formulario'}</p>
              </div>
            )}

            {status === 'expired' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2">
                <Clock className="w-10 h-10 text-slate-500" />
                <p className="text-sm font-bold text-slate-800">Código expirado</p>
                <button type="button" id="companion-regenerate" onClick={createSession} className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Generar nuevo
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2 px-4">
                <AlertCircle className="w-10 h-10 text-rose-500" />
                <p className="text-xs text-slate-700">{error}</p>
                <button type="button" onClick={createSession} className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Reintentar
                </button>
              </div>
            )}
          </div>

          {/* Estado de conexión */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs">
            {status === 'waiting' && (
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Esperando al celular...
              </span>
            )}
            {status === 'connected' && (
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <Wifi className="w-3.5 h-3.5" /> Celular conectado · esperando archivo
              </span>
            )}
            {status === 'received' && <span className="text-emerald-300 font-bold">Puedes enviar otro desde el celular o cerrar esta ventana</span>}
            {remaining != null && status !== 'expired' && status !== 'received' && (
              <span className="font-mono text-slate-500">· {minutes}:{String(seconds).padStart(2, '0')}</span>
            )}
          </div>

          {/* Pasos */}
          <ol className="mt-4 space-y-2">
            {steps.map((step, i) => {
              const done = i < stepIndex || status === 'received';
              const active = i === stepIndex && status !== 'received';
              return (
                <li
                  key={step.id}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl border text-xs transition-all duration-300 ${
                    done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : active
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 ${
                      done ? 'bg-emerald-500 text-slate-950' : active ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="font-semibold">{step.label}</span>
                </li>
              );
            })}
          </ol>

          {session?.mobileUrl && status !== 'expired' && (
            <p className="mt-3 text-[10px] text-slate-500 text-center break-all">
              ¿No puedes escanear? Abre en el celular: <span className="text-slate-400 font-mono">{session.mobileUrl}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

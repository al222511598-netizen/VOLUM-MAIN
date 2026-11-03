import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Camera, Image as ImageIcon, Box, CheckCircle2, AlertCircle, Monitor, RefreshCw, Clock } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';

/**
 * Fase 3 · Página móvil de captura (se abre al escanear el QR del panel en la PC).
 * No requiere login: el token del QR es la credencial temporal (10 min).
 */
export default function CompanionUploadPage() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | uploading | done | expired | error
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState('');
  const [lastFile, setLastFile] = useState(null);
  const [sentCount, setSentCount] = useState(0);
  const [remaining, setRemaining] = useState(null);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const modelInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Capturar para Volum-Menu';
    let cancelled = false;
    axios
      .get(`/api/v1/upload/companion/${token}`)
      .then((res) => {
        if (cancelled) return;
        setSession(res.data);
        setState('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setState(err.response?.status === 404 ? 'expired' : 'error');
        setError(err.response?.data?.message || 'No se pudo conectar con el servidor.');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Cuenta regresiva de la sesión
  useEffect(() => {
    if (!session?.expiresAt) return undefined;
    const tick = () => {
      const ms = new Date(session.expiresAt).getTime() - Date.now();
      setRemaining(Math.max(0, ms));
      if (ms <= 0) setState((s) => (s === 'uploading' ? s : 'expired'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.expiresAt]);

  // Liberar URL de vista previa local
  useEffect(() => () => preview && preview.startsWith('blob:') && URL.revokeObjectURL(preview), [preview]);

  const isModel = session?.kind === 'model';

  const handleFile = async (file) => {
    if (!file) return;
    setError('');

    const name = file.name?.toLowerCase() || '';
    if (isModel) {
      if (!name.endsWith('.glb') && !name.endsWith('.usdz')) {
        setError('Selecciona un archivo 3D con extensión .glb o .usdz.');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError('El modelo 3D supera el límite de 25 MB.');
        return;
      }
      setPreview('');
    } else {
      if (!file.type.startsWith('image/')) {
        setError('Selecciona una fotografía (JPG, PNG o WEBP).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError('La foto supera el límite de 15 MB.');
        return;
      }
      setPreview(URL.createObjectURL(file));
    }

    setState('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`/api/v1/upload/companion/${token}/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      setLastFile({ ...res.data.file, localName: file.name });
      setSentCount((c) => c + 1);
      setState('done');
      if (navigator.vibrate) navigator.vibrate(60);
    } catch (err) {
      if (err.response?.status === 404) {
        setState('expired');
      } else {
        setState('ready');
      }
      setError(err.response?.data?.message || 'No se pudo enviar el archivo. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      [cameraInputRef, galleryInputRef, modelInputRef].forEach((r) => {
        if (r.current) r.current.value = '';
      });
    }
  };

  const minutes = remaining != null ? Math.floor(remaining / 60000) : null;
  const seconds = remaining != null ? Math.floor((remaining % 60000) / 1000) : null;

  return (
    <main className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Halo ambiental */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-amber-500/15 blur-3xl" aria-hidden="true" />

      <header className="relative px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30">
            V
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-bold">Volum-Menu</p>
            <p className="text-xs text-slate-400">{session?.restaurantName || 'Captura móvil'}</p>
          </div>
        </div>
        {remaining != null && state !== 'expired' && (
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-400" />
            {minutes}:{String(seconds).padStart(2, '0')}
          </span>
        )}
      </header>

      <section className="relative flex-1 px-5 pb-8 flex flex-col">
        <h1 className="text-2xl font-black leading-tight mt-2">
          {isModel ? 'Envía tu modelo 3D' : 'Toma la foto del platillo'}
        </h1>
        <p className="text-sm text-slate-400 mt-1.5 flex items-center gap-1.5">
          <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
          Aparecerá al instante en el formulario de tu computadora.
        </p>

        {error && (
          <div role="alert" className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {state === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Conectando con tu panel...</p>
          </div>
        )}

        {state === 'expired' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Clock className="w-7 h-7 text-slate-500" />
            </div>
            <p className="text-lg font-bold">Este código QR expiró</p>
            <p className="text-sm text-slate-400 max-w-xs">
              Por seguridad cada código dura 10 minutos. Pulsa "Capturar con mi celular" otra vez en tu computadora para generar uno nuevo.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <p className="text-sm text-slate-400">Revisa tu conexión a internet y vuelve a escanear el código.</p>
            <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-slate-800 text-sm font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        )}

        {state === 'uploading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            {preview ? (
              <img src={preview} alt="Foto seleccionada" className="w-56 h-56 object-cover rounded-3xl border border-amber-500/40 shadow-2xl shadow-amber-500/10" />
            ) : (
              <div className="w-40 h-40 rounded-3xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center">
                <Box className="w-14 h-14 text-emerald-400 animate-pulse" />
              </div>
            )}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-amber-300 font-bold">{progress < 100 ? 'Enviando...' : 'Optimizando en el servidor...'}</span>
                <span className="font-mono text-slate-400">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {state === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            {lastFile?.fileType !== 'model_3d' && lastFile?.url ? (
              <div className="relative">
                <img src={getMediaUrl(lastFile.url)} alt="Foto enviada" className="w-52 h-52 object-cover rounded-3xl border border-emerald-500/40 shadow-2xl" />
                <CheckCircle2 className="absolute -bottom-3 -right-3 w-10 h-10 text-emerald-400 bg-slate-950 rounded-full" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
            )}
            <div>
              <p className="text-xl font-black">¡Listo! Revisa tu computadora</p>
              <p className="text-sm text-slate-400 mt-1">
                {lastFile?.localName ? `"${lastFile.localName}" ` : 'El archivo '}ya se colocó en el formulario del platillo.
              </p>
              {sentCount > 1 && <p className="text-xs text-slate-500 mt-1">{sentCount} archivos enviados en esta sesión</p>}
            </div>
            <button
              type="button"
              id="companion-send-another"
              onClick={() => {
                setState('ready');
                setPreview('');
              }}
              className="mt-2 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Enviar otro {isModel ? 'modelo' : 'archivo'}
            </button>
          </div>
        )}

        {state === 'ready' && (
          <div className="flex-1 flex flex-col justify-end gap-3 mt-8">
            {isModel ? (
              <button
                type="button"
                id="companion-pick-model"
                onClick={() => modelInputRef.current?.click()}
                className="w-full py-5 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-transform"
              >
                <Box className="w-6 h-6" />
                Elegir archivo .GLB / .USDZ
              </button>
            ) : (
              <>
                <button
                  type="button"
                  id="companion-take-photo"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-5 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-transform"
                >
                  <Camera className="w-6 h-6" />
                  Tomar foto ahora
                </button>
                <button
                  type="button"
                  id="companion-pick-gallery"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full py-4 rounded-3xl bg-slate-900 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  Elegir de la galería
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-1">
                  Tip: luz natural, plato centrado y fondo limpio. La foto se convierte a WebP HD automáticamente.
                </p>
              </>
            )}
            {isModel && (
              <p className="text-[11px] text-slate-500 text-center">
                Exporta el escaneo desde Scaniverse o Polycam y selecciónalo aquí (máx. 25 MB).
              </p>
            )}
          </div>
        )}

        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <input ref={galleryInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <input ref={modelInputRef} type="file" accept=".glb,.usdz,model/gltf-binary,model/vnd.usdz+zip" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </section>
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radio, AlertTriangle, FileText, CheckCircle2, X, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function SystemBroadcastBanner({ restaurantId, user }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [blockingPolicy, setBlockingPolicy] = useState(null);
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [submittingAck, setSubmittingAck] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);

  // Detección de sesión fantasma
  const isGhostSession = new URLSearchParams(window.location.search).get('ghost') === 'true';

  useEffect(() => {
    loadBroadcasts();
  }, [restaurantId]);

  const loadBroadcasts = async () => {
    try {
      const res = await axios.get(`${API_URL}/superadmin/broadcasts/client`, {
        params: { restaurantId }
      });

      if (res.data.success && res.data.broadcasts) {
        setBroadcasts(res.data.broadcasts);

        // Detectar si hay alguna política obligatoria pendiente de firma
        const pendingMandatory = res.data.broadcasts.find(
          b => b.requiresAcknowledgment && !b.hasAcknowledged
        );
        if (pendingMandatory) {
          setBlockingPolicy(pendingMandatory);
        }
      }
    } catch (err) {
      // Si la ruta no responde no bloqueamos al usuario
    }
  };

  const handleAcceptPolicy = async () => {
    if (!blockingPolicy || !restaurantId || !user) return;
    try {
      setSubmittingAck(true);
      await axios.post(`${API_URL}/superadmin/broadcasts/client/${blockingPolicy.id}/ack`, {
        restaurantId,
        userId: user._id || user.id,
        userEmail: user.email
      });

      setBlockingPolicy(null);
      loadBroadcasts();
    } catch (err) {
      alert('Error registrando aceptación legal.');
    } finally {
      setSubmittingAck(false);
    }
  };

  // Filtrar avisos tipo banner que no hayan sido descartados
  const bannerBroadcasts = broadcasts.filter(
    b => !b.requiresAcknowledgment && !dismissedIds.includes(b.id)
  );

  return (
    <>
      {/* Cintillo de Modo Fantasma de Desarrolladores */}
      {isGhostSession && (
        <div className="bg-purple-950/90 border-b border-purple-500/40 text-purple-200 px-4 py-2 text-xs flex items-center justify-between font-mono sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="font-bold">SESIÓN DE SOPORTE ACTIVA (Ghost Mode SuperAdmin)</span>
            <span className="text-purple-300/80 hidden sm:inline">— Acceso de diagnóstico registrado en auditoría.</span>
          </div>
          <button
            onClick={() => window.close()}
            className="px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-white text-[11px] font-sans"
          >
            Salir de Soporte
          </button>
        </div>
      )}

      {/* Banners Informativos y de Servicio */}
      {bannerBroadcasts.map((b) => (
        <div
          key={b.id}
          className={`px-4 py-2.5 text-xs flex items-center justify-between border-b transition-all ${
            b.priority === 'critical' || b.type === 'alert'
              ? 'bg-red-500/15 border-red-500/30 text-red-300'
              : b.type === 'maintenance'
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-1 mr-3">
            {b.type === 'maintenance' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            ) : b.type === 'feature' ? (
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <Radio className="w-4 h-4 shrink-0 text-blue-400" />
            )}
            <div>
              <span className="font-bold mr-2">[{b.title}]</span>
              <span>{b.message}</span>
            </div>
            {b.actionUrl && (
              <a
                href={b.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline font-semibold ml-2 text-white hover:text-emerald-300"
              >
                <span>{b.actionText || 'Ver más'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => setDismissedIds([...dismissedIds, b.id])}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Descartar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* MODAL BLOQUEANTE DE ACTUALIZACIÓN DE POLÍTICAS (El requerimiento del usuario!) */}
      {blockingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
          <div className="bg-[#0D1322] border-2 border-emerald-500/40 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Aviso Legal Obligatorio {blockingPolicy.policyVersion}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{blockingPolicy.title}</h2>
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              <p className="whitespace-pre-line">{blockingPolicy.message}</p>
            </div>

            {/* Legal Acceptance Checkbox */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={acceptChecked}
                  onChange={(e) => setAcceptChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700 focus:ring-0"
                />
                <span className="text-slate-300">
                  He leído y acepto los nuevos términos y políticas de uso de <strong>Volum-Menu</strong>.
                  Entiendo que esta aceptación queda registrada con mi dirección IP y firma digital.
                </span>
              </label>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAcceptPolicy}
              disabled={!acceptChecked || submittingAck}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submittingAck ? 'Registrando firma...' : 'Aceptar y Continuar al Panel'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

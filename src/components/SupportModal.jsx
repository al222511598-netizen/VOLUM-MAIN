import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LifeBuoy,
  X,
  Camera,
  RefreshCw,
  Box,
  CreditCard,
  Settings,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'photo_upload',
    label: 'Fotografía / Video',
    desc: 'Problema al subir o actualizar fotos de platillos',
    Icon: Camera,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    id: 'menu_sync',
    label: 'Sincronización Comensal',
    desc: 'Los cambios guardados no se reflejan en el menú público',
    Icon: RefreshCw,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  },
  {
    id: '3d_model',
    label: 'Modelos 3D y WebAR',
    desc: 'Error al escanear, calibrar o proyectar en realidad aumentada',
    Icon: Box,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'billing',
    label: 'Plan y Facturación',
    desc: 'Dudas sobre días de prueba, cobro o cambio de suscripción',
    Icon: CreditCard,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    id: 'configuration',
    label: 'Configuración y Mesas',
    desc: 'Duda con croquis de mesas, PIN o identidad de marca',
    Icon: Settings,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
  },
  {
    id: 'other',
    label: 'Otro / Sugerencia',
    desc: 'Reportar otro problema técnico o sugerir una mejora',
    Icon: MessageSquare,
    color: 'text-slate-300 bg-slate-800 border-slate-700'
  }
];

export default function SupportModal({ isOpen, onClose, restaurant, user, token }) {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [category, setCategory] = useState('photo_upload');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Cargar tickets del restaurante al abrir pestaña de historial
  useEffect(() => {
    if (isOpen && activeTab === 'history' && token) {
      fetchTickets();
    }
  }, [isOpen, activeTab, token]);

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const res = await axios.get('/api/v1/support/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setTickets(res.data.tickets || []);
      }
    } catch (err) {
      console.warn('Error cargando tickets de soporte:', err.message);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setSubmitError('Por favor describe brevemente el título del problema.');
      return;
    }
    if (!message.trim()) {
      setSubmitError('Por favor detalla qué ocurrió para que podamos ayudarte.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        category,
        subject: subject.trim(),
        message: message.trim(),
        screenshotUrl: '',
        contactName: user?.name || restaurant?.name || 'Gerente',
        contactEmail: user?.email || '',
        clientContext: includeDiagnostics ? {
          currentPath: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
          browser: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
          appVersion: '1.0.0'
        } : {}
      };

      const res = await axios.post('/api/v1/support/ticket', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setSubmitSuccess(`¡Ticket ${res.data.ticket?.ticketCode || ''} enviado con éxito! Nuestro equipo técnico ha sido notificado por correo.`);
        setSubject('');
        setMessage('');
        // Recargar historial si cambia de pestaña
        fetchTickets();
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error al enviar el reporte. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Centro de Ayuda y Reportes</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 uppercase">
                  Soporte Activo
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {restaurant?.name || 'Tu Restaurante'} • Respuesta directa del equipo fundador a tu correo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas: Nuevo Reporte vs Historial */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/80">
          <button
            type="button"
            onClick={() => { setActiveTab('new'); setSubmitSuccess(null); }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'new'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Reportar Problema o Duda</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mis Reportes ({tickets.length})</span>
          </button>
        </div>

        {/* Contenido: Pestaña 1 (Nuevo Reporte) */}
        {activeTab === 'new' && (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 flex items-start gap-3 text-xs animate-slideDown">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">{submitSuccess}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-1">
                    Recibirás la respuesta en <strong>{user?.email || 'tu correo registrado'}</strong>.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 flex items-center gap-2.5 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Selector de Categoría de la Incidencia */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                ¿Qué tipo de problema o duda tienes?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  const Icon = cat.Icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-400'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border shrink-0 ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">
                          {cat.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Título / Asunto Breve */}
            <div>
              <label htmlFor="support-subject" className="text-xs font-bold text-slate-300 block mb-1">
                Título o resumen breve <span className="text-rose-400">*</span>
              </label>
              <input
                id="support-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={150}
                placeholder="Ej: La foto del corte Ribeye no termina de cargar..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>

            {/* Descripción Detallada */}
            <div>
              <label htmlFor="support-message" className="text-xs font-bold text-slate-300 block mb-1">
                ¿Qué ocurrió exactamente? Describe los pasos <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={2500}
                placeholder="Cuéntanos qué intentaste hacer, qué mensaje de error apareció o cómo podemos ayudarte a resolverlo..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
                required
              />
              <span className="text-[10px] text-slate-500 block text-right mt-1">
                {message.length} / 2500 caracteres
              </span>
            </div>

            {/* Checkbox de Diagnóstico Técnico Automático */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs">
              <input
                type="checkbox"
                id="include-diagnostics"
                checked={includeDiagnostics}
                onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="include-diagnostics" className="text-[11px] text-slate-400 cursor-pointer leading-relaxed">
                Incluir automáticamente información técnica de diagnóstico (versión de navegador, resolución y ruta activa) para que los ingenieros puedan reproducir el problema de inmediato.
              </label>
            </div>

            {/* Botones de Acción */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando al equipo...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Reporte</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Contenido: Pestaña 2 (Historial de Reportes) */}
        {activeTab === 'history' && (
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-3">
            {isLoadingTickets ? (
              <div className="p-10 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
                <p className="text-xs font-bold">Cargando tus reportes...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-10 text-center bg-slate-950/40 border border-slate-800 rounded-3xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-200">No tienes reportes pendientes</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Todos tus sistemas operan al 100%. Si experimentas alguna duda o falla técnica, crea un reporte en la pestaña anterior.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tickets.map((t) => {
                  const cat = CATEGORIES.find(c => c.id === t.category);
                  const Icon = cat?.Icon || Info;
                  return (
                    <div
                      key={t._id}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {t.ticketCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          t.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : t.status === 'in_progress'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {t.status === 'resolved' ? '✓ Solucionado' : t.status === 'in_progress' ? '⚙️ En Revisión' : '⏳ Abierto'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {t.message}
                        </p>
                      </div>

                      {t.adminResponse && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 space-y-0.5">
                          <strong className="block text-[10px] uppercase text-emerald-400 font-bold">Respuesta del Equipo Técnico:</strong>
                          <span>{t.adminResponse}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                        <span className="flex items-center gap-1">
                          <Icon className="w-3 h-3 text-slate-400" />
                          <span>{cat?.label || t.category}</span>
                        </span>
                        <span>{new Date(t.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Send,
  HelpCircle,
  Smartphone,
  Globe
} from 'lucide-react';
import { ADMIN_THEMES, getSavedAdminThemeKey } from '../config/adminThemePalettes';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function FloatingFeedbackWidget() {
  const location = useLocation();

  // En el menú del comensal (/r/:slug), vistas directas WebAR y capturas móviles, NUNCA mostrar la bola flotante de error
  const isDinerOrCaptureRoute =
    location.pathname.startsWith('/r/') ||
    location.pathname.startsWith('/demo/ar') ||
    location.pathname.startsWith('/m/');

  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('bug'); // 'bug' | 'suggestion'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium'); // 'low' | 'medium' | 'high' | 'critical'
  const [category, setCategory] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);
  const [showTechDetails, setShowTechDetails] = useState(false);

  // Sincronización con el tema seleccionado en la consola (Dark Luxury, Blanco Puro, etc.)
  const [themeKey, setThemeKey] = useState(() => getSavedAdminThemeKey());

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && ADMIN_THEMES[e.detail]) {
        setThemeKey(e.detail);
      }
    };
    window.addEventListener('volum-admin-theme-change', handleThemeChange);
    return () => window.removeEventListener('volum-admin-theme-change', handleThemeChange);
  }, []);

  const currentTheme = ADMIN_THEMES[themeKey] || ADMIN_THEMES.dark_luxury;
  const isLight = Boolean(currentTheme.isLight);

  const fileInputRef = useRef(null);

  // Ocultar el tooltip inicial después de 7 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  // Soporte para pegar capturas de pantalla con Ctrl+V directamente en el modal
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setScreenshotFile(file);
            const previewUrl = URL.createObjectURL(file);
            setScreenshotPreview(previewUrl);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (isDinerOrCaptureRoute) {
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('La imagen no debe superar los 15 MB.');
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) {
      setErrorMessage('Por favor describe el detalle o sugerencia con al menos 5 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title || (type === 'bug' ? 'Detalle reportado en pantalla' : 'Nueva sugerencia'));
      formData.append('description', description.trim());
      formData.append('severity', severity);
      formData.append('category', category);

      // Contexto técnico automático
      const contextData = {
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
      formData.append('context', JSON.stringify(contextData));

      // Reportante
      const reporterData = {
        name: name.trim() || 'Usuario de Volum',
        email: email.trim(),
        userType: window.location.pathname.startsWith('/app') ? 'admin' : 'visitor'
      };
      formData.append('reporter', JSON.stringify(reporterData));

      if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
      }

      const response = await axios.post(`${API_BASE_URL}/api/v1/feedback`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 3200);
      } else {
        setErrorMessage(response.data.message || 'No se pudo enviar el reporte.');
      }
    } catch (err) {
      console.error('Error enviando feedback:', err);
      setErrorMessage(
        err.response?.data?.message || 'Error de conexión al enviar el reporte. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setErrorMessage('');
    setDescription('');
    setTitle('');
    handleRemoveScreenshot();
  };

  return (
    <>
      {/* =========================================================================
          BOTÓN FLOTANTE DISCRETO (Soporte & Sugerencias)
          ========================================================================= */}
      <div className="fixed bottom-4 right-4 z-40 group flex items-center gap-2">
        {/* Tooltip silencioso: solo aparece sutilmente al pasar el cursor */}
        <div
          className={`pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-md whitespace-nowrap border ${
            isLight
              ? 'bg-white text-slate-700 border-slate-200 shadow-slate-200/50'
              : 'bg-slate-900 text-slate-300 border-slate-800 shadow-black/40'
          }`}
        >
          <span>Soporte & Sugerencias</span>
        </div>

        {/* Botón Circular Minimalista y No Invasivo */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 border opacity-75 hover:opacity-100 ${
            isOpen
              ? isLight
                ? 'bg-slate-900 text-white border-slate-900 opacity-100'
                : 'bg-white text-slate-950 border-white opacity-100'
              : isLight
              ? 'bg-white/90 text-slate-600 border-slate-250 hover:text-amber-600 hover:border-amber-400'
              : 'bg-slate-900/85 text-slate-400 border-slate-800 hover:text-amber-400 hover:border-amber-500/50'
          }`}
          title="Soporte y Sugerencias"
          aria-label="Abrir asistente de soporte y sugerencias"
        >
          {isOpen ? (
            <X className="w-3.5 h-3.5 transition-transform" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* =========================================================================
          MODAL INTERACTIVO DE REPORTE Y SUGERENCIA (ADAPTADO AL TEMA DE LA CONSOLA)
          ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
                : 'bg-slate-900/95 border-slate-800 text-white shadow-2xl'
            }`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header del Modal */}
            <div
              className={`p-4 sm:p-5 border-b flex items-center justify-between ${
                isLight
                  ? 'bg-slate-50/80 border-slate-200'
                  : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
                    type === 'bug'
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  }`}
                >
                  {type === 'bug' ? <Bug className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className={`text-sm sm:text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <span>{type === 'bug' ? 'Reportar Error o Detalle' : 'Enviar Sugerencia'}</span>
                  </h2>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Tu reporte se envía directo con foto y datos técnicos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Aviso informativo de Correo Vinculado */}
            <div className={`px-4 sm:px-5 py-2.5 border-b text-[11px] flex items-center gap-2 ${
              isLight ? 'bg-amber-50/70 border-amber-100 text-amber-950' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}>
              <Send className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1 truncate">
                <span>Vinculado a: </span>
                <strong className="font-mono text-amber-600 dark:text-amber-400">soporte@volum.menu</strong>
                <span className={`text-[10px] ml-1.5 hidden sm:inline ${isLight ? 'text-amber-800/80' : 'text-amber-400/70'}`}>(o en FEEDBACK_RECIPIENT_EMAIL)</span>
              </div>
            </div>

            {/* Contenido / Formulario */}
            {isSuccess ? (
              <div className="p-8 text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>¡Reporte Enviado con Éxito!</h3>
                <p className={`text-xs max-w-sm mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Gracias por ayudarnos a perfeccionar Volum. Nuestro equipo recibió tu mensaje junto con la captura y ya estamos trabajando en ello.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 font-medium">Esta ventana se cerrará automáticamente...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
                {/* Selector de Tipo: Error vs Sugerencia */}
                <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl border ${
                  isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <button
                    type="button"
                    onClick={() => setType('bug')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      type === 'bug'
                        ? 'bg-rose-500/20 text-rose-600 border border-rose-500/40 shadow-sm'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5 text-rose-500" />
                    <span>Hay un Error / Bug</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('suggestion')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      type === 'suggestion'
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Tengo una Sugerencia</span>
                  </button>
                </div>

                {/* Severidad (solo si es Bug) */}
                {type === 'bug' && (
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      ¿Qué tan grave es el problema?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSeverity('low')}
                        className={`p-2 rounded-xl text-center border font-semibold transition-all ${
                          severity === 'low'
                            ? 'bg-blue-500/20 text-blue-600 border-blue-500/40 shadow-sm'
                            : isLight
                            ? 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="block font-bold">Leve</span>
                        <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Detalle visual</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSeverity('medium')}
                        className={`p-2 rounded-xl text-center border font-semibold transition-all ${
                          severity === 'medium'
                            ? 'bg-amber-500/20 text-amber-600 border-amber-500/40 shadow-sm'
                            : isLight
                            ? 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="block font-bold">Medio</span>
                        <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Funciona regular</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSeverity('critical')}
                        className={`p-2 rounded-xl text-center border font-semibold transition-all ${
                          severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-600 border-rose-500/40 shadow-sm'
                            : isLight
                            ? 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="block font-bold">Grave</span>
                        <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Bloquea la acción</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Título opcional */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Título o resumen corto (opcional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      type === 'bug'
                        ? 'Ej: El botón de ordenar no responde en el teléfono...'
                        : 'Ej: Sería genial poder ordenar platos por precio...'
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/60'
                    }`}
                  />
                </div>

                {/* Descripción del Error / Sugerencia */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Descripción del problema o idea <span className="text-amber-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Mínimo 5 caracteres</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      type === 'bug'
                        ? 'Describe qué pasó, qué intentabas hacer y qué apareció en pantalla...'
                        : 'Cuéntanos qué función o mejora te gustaría ver en Volum y cómo te ayudaría...'
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl transition-colors resize-none leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500'
                        : 'bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/60'
                    }`}
                  />
                </div>

                {/* Adjuntar Foto / Captura de Pantalla */}
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Foto o Captura de Pantalla (Recomendado)
                  </label>

                  {screenshotPreview ? (
                    <div className={`relative rounded-2xl overflow-hidden p-2 flex items-center justify-between gap-3 border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={screenshotPreview}
                          alt="Previsualización"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className={`font-bold truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {screenshotFile?.name || 'Captura pegada'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {screenshotFile ? `${(screenshotFile.size / 1024 / 1024).toFixed(2)} MB` : 'Desde el portapapeles'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className={`p-2 rounded-xl transition-colors ${
                          isLight
                            ? 'bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-600'
                            : 'bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400'
                        }`}
                        title="Quitar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all group ${
                        isLight
                          ? 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-amber-500'
                          : 'border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 hover:border-amber-500/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors ${
                        isLight
                          ? 'bg-slate-200 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-600'
                          : 'bg-slate-800/80 text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-400'
                      }`}>
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className={`font-bold transition-colors ${
                        isLight ? 'text-slate-800 group-hover:text-amber-600' : 'text-slate-300 group-hover:text-amber-300'
                      }`}>
                        Toca aquí para seleccionar una captura o foto
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        O pega una captura directamente con <kbd className={`px-1.5 py-0.5 rounded border ${
                          isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>Ctrl + V</kbd>
                      </p>
                    </div>
                  )}
                </div>

                {/* Datos de Contacto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Tu Nombre (opcional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Carlos Méndez"
                      className={`w-full px-3 py-2 rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isLight
                          ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/60'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Tu Correo (para responderte)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className={`w-full px-3 py-2 rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                        isLight
                          ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/60'
                      }`}
                    />
                  </div>
                </div>

                {/* Contexto técnico auto-detectado (Pill colapsable) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="text-[10px] text-slate-400 hover:text-amber-500 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    <span>
                      {showTechDetails ? 'Ocultar datos técnicos del sistema' : 'Ver datos técnicos auto-detectados (URL, pantalla)'}
                    </span>
                  </button>

                  {showTechDetails && (
                    <div className={`mt-2 p-2.5 rounded-xl border text-[10px] space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800/80 text-slate-400'
                    }`}>
                      <p className="truncate">
                        <strong className={isLight ? 'text-slate-800' : 'text-slate-300'}>Pantalla actual:</strong> {window.location.pathname}
                      </p>
                      <p>
                        <strong className={isLight ? 'text-slate-800' : 'text-slate-300'}>Resolución:</strong> {window.innerWidth} x {window.innerHeight} px
                      </p>
                    </div>
                  )}
                </div>

                {/* Mensaje de Error */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Botones del Footer */}
                <div className={`pt-2 flex items-center justify-end gap-2.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className={`px-4 py-2.5 rounded-xl font-bold transition-colors ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className={`px-5 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg ${
                      type === 'bug'
                        ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando reporte...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{type === 'bug' ? 'Enviar Reporte de Error' : 'Enviar Sugerencia'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

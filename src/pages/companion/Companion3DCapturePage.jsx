import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  Info,
  Maximize2,
  Box,
  Trash2,
  Zap,
  Sliders,
  RotateCw
} from 'lucide-react';

const FOODIE_TIPS = [
  'Los comensales que interactúan con platillos en 3D tienen hasta un 30% más de probabilidad de ordenar.',
  'La luz natural difusa resalta los brillos naturales de salsas y glaseados.',
  'Evita fondos con patrones saturados para que la IA aísle perfectamente el plato.',
  'La vista cenital (90°) permite a la IA calcular el volumen exacto de las porciones.'
];

export default function Companion3DCapturePage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState('');

  // Modo de captura: 'multiview' (3 fotos) | 'single' (1 foto)
  const [mode, setMode] = useState('multiview');

  // Ranura actualmente activa para el disparo
  const [activeSlot, setActiveSlot] = useState('front'); // 'front' | 'angle' | 'top' | 'single'

  // Fotos capturadas (archivos File reales)
  const [photos, setPhotos] = useState({
    front: null,
    angle: null,
    top: null,
    single: null
  });

  const [previews, setPreviews] = useState({
    front: '',
    angle: '',
    top: '',
    single: ''
  });

  // Cámara en vivo con WebRTC (getUserMedia)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (trasera) | 'user'
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedFeedback, setCapturedFeedback] = useState('');

  // Estado del proceso: 'capture' | 'uploading' | 'processing' | 'ready' | 'failed' | 'expired'
  const [processState, setProcessState] = useState('capture');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const [generatedModelUrl, setGeneratedModelUrl] = useState('');
  const [dishDiameterCm, setDishDiameterCm] = useState(25);
  const [calibrating, setCalibrating] = useState(false);

  // Inputs ocultos para subida de galería
  const galleryInputRefs = {
    single: useRef(null),
    front: useRef(null),
    angle: useRef(null),
    top: useRef(null)
  };

  // 1. Cargar información de la sesión companion
  useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      try {
        setLoadingSession(true);
        const res = await axios.get(`/api/v1/ai3d/companion-session/${token}`);
        if (cancelled) return;
        setSession(res.data.session);

        if (res.data.session.modelStatus === 'processing') {
          setProcessState('processing');
          setProgress(res.data.session.tripoProgress || 25);
        } else if (res.data.session.modelStatus === 'ready') {
          setProcessState('ready');
          setProgress(100);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) {
          setProcessState('expired');
        } else {
          setError(err.response?.data?.message || 'No se pudo conectar con la sesión de escaneo móvil.');
        }
      } finally {
        if (!cancelled) setLoadingSession(false);
      }
    };

    fetchSession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // 2. Temporizador de expiración (15 min)
  useEffect(() => {
    if (!session?.expiresAt) return;

    const updateTimer = () => {
      const ms = session.expiresAt - Date.now();
      if (ms <= 0) {
        setRemainingTime('Expirado');
        if (processState === 'capture') setProcessState('expired');
        return;
      }
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      setRemainingTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session?.expiresAt, processState]);

  // 3. Rotación de tips mientras procesa
  useEffect(() => {
    if (processState !== 'processing') return;
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % FOODIE_TIPS.length);
    }, 4500);
    return () => clearInterval(tipInterval);
  }, [processState]);

  // 4. Polling cuando está en estado 'processing'
  useEffect(() => {
    if (processState !== 'processing' || !session?.dishId) return;

    let pollInterval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/v1/ai3d/status/${session.dishId}`, {
          headers: { 'x-companion-token': token }
        });

        if (res.data.success) {
          setProgress(res.data.progress || 35);
          if (res.data.modelStatus === 'ready') {
            setProcessState('ready');
            setGeneratedModelUrl(res.data.modelGlbUrl || res.data.dish?.modelGlbUrl);
            setDishDiameterCm(res.data.dish?.dishDiameterCm || 25);
            clearInterval(pollInterval);
          } else if (res.data.modelStatus === 'failed') {
            setProcessState('failed');
            setError(res.data.error || 'La generación 3D no pudo completarse. Intenta con mejor iluminación.');
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error('Error en polling de status 3D:', err);
      }
    }, 2800);

    return () => clearInterval(pollInterval);
  }, [processState, session?.dishId, token]);

  // 5. Iniciar y Detener Cámara en Vivo
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async (facing = facingMode) => {
    stopCamera();
    setCameraLoading(true);
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no admite cámara en vivo WebRTC. Puedes subir fotos desde tu galería.');
      }

      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (_) {}
      }

      setCameraActive(true);
      setFacingMode(facing);
    } catch (err) {
      console.warn('Error al iniciar cámara:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Permiso denegado. Permite el acceso a la cámara en tu navegador para ver la cámara en vivo.'
          : 'No se pudo activar la cámara en vivo. Puedes subir fotos desde tu galería.'
      );
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  // Iniciar cámara al entrar a modo captura
  useEffect(() => {
    if (processState === 'capture') {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [processState]);

  // Al cambiar de modo (1 foto vs 3 fotos), ajustar la ranura activa
  useEffect(() => {
    if (mode === 'single') {
      setActiveSlot('single');
    } else {
      if (!photos.front) setActiveSlot('front');
      else if (!photos.angle) setActiveSlot('angle');
      else if (!photos.top) setActiveSlot('top');
      else setActiveSlot('front');
    }
  }, [mode]);

  // Manejar captura de imagen desde el visor de cámara en vivo
  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video || !cameraActive) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    // Efecto de flash y retroalimentación háptica
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 120);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(40); } catch (_) {}
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `${session?.dishName || 'platillo'}-${activeSlot}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      handlePhotoSelect(activeSlot, file);

      // Flujo asistido: avanza automáticamente a la siguiente ranura
      if (mode === 'multiview') {
        if (activeSlot === 'front') {
          setCapturedFeedback('¡Foto frontal capturada! Ahora inclina a 45°');
          setActiveSlot('angle');
        } else if (activeSlot === 'angle') {
          setCapturedFeedback('¡Foto diagonal capturada! Ahora apunta desde arriba');
          setActiveSlot('top');
        } else if (activeSlot === 'top') {
          setCapturedFeedback('¡Las 3 fotos están listas para el 3D!');
        }
        setTimeout(() => setCapturedFeedback(''), 3000);
      } else {
        setCapturedFeedback('¡Fotografía lista!');
        setTimeout(() => setCapturedFeedback(''), 2500);
      }
    }, 'image/jpeg', 0.95);
  };

  // Alternar entre cámara trasera y delantera
  const toggleFacingMode = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(next);
  };

  // Selección manual de archivo (ej. galería)
  const handlePhotoSelect = (slotKey, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG o WEBP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('La imagen es demasiado pesada (máximo 20 MB).');
      return;
    }

    setError('');
    const previewUrl = URL.createObjectURL(file);

    setPhotos((prev) => ({ ...prev, [slotKey]: file }));
    setPreviews((prev) => {
      if (prev[slotKey] && prev[slotKey].startsWith('blob:')) {
        URL.revokeObjectURL(prev[slotKey]);
      }
      return { ...prev, [slotKey]: previewUrl };
    });
  };

  const handleRemovePhoto = (slotKey) => {
    setPhotos((prev) => ({ ...prev, [slotKey]: null }));
    setPreviews((prev) => {
      if (prev[slotKey] && prev[slotKey].startsWith('blob:')) {
        URL.revokeObjectURL(prev[slotKey]);
      }
      return { ...prev, [slotKey]: '' };
    });
    setActiveSlot(slotKey);
  };

  // Validar si las fotos necesarias están completas
  const isReadyToGenerate = () => {
    if (mode === 'single') {
      return !!photos.single;
    }
    return !!(photos.front && photos.angle && photos.top);
  };

  // Iniciar la generación 3D
  const handleStartGeneration = async () => {
    if (!isReadyToGenerate() || !session?.dishId) return;

    stopCamera();
    setError('');
    setProcessState('uploading');
    setStatusMessage('Subiendo fotografías en alta definición...');
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('mode', mode);

      if (mode === 'single') {
        formData.append('files', photos.single);
      } else {
        formData.append('files', photos.front);
        formData.append('files', photos.angle);
        formData.append('files', photos.top);
      }

      const res = await axios.post(`/api/v1/ai3d/generate/${session.dishId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-companion-token': token
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 20) / progressEvent.total);
          setProgress(percent);
        }
      });

      if (res.data.success) {
        setProcessState('processing');
        setProgress(25);
        setStatusMessage('Reconstruyendo volumen y texturas fotogramétricas...');
      } else {
        setProcessState('capture');
        setError(res.data.message || 'Error al iniciar la generación 3D.');
      }
    } catch (err) {
      setProcessState('capture');
      const msg = err.response?.data?.message || 'Error al enviar fotografías. Comprueba tu conexión.';
      setError(msg);
    }
  };

  // Calibrar diámetro 1:1
  const handleCalibrate = async (newCm) => {
    setDishDiameterCm(newCm);
    if (!session?.dishId) return;
    try {
      setCalibrating(true);
      await axios.patch(
        `/api/v1/ai3d/calibrate/${session.dishId}`,
        { dishDiameterCm: newCm },
        { headers: { 'x-companion-token': token } }
      );
    } catch (err) {
      console.warn('Error al calibrar:', err);
    } finally {
      setCalibrating(false);
    }
  };

  // Render: Loading
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <h2 className="text-base font-semibold text-white">Conectando con Volum-Menu...</h2>
        <p className="text-xs text-slate-500 mt-1">Verificando sesión segura de escaneo</p>
      </div>
    );
  }

  // Render: Expirado
  if (processState === 'expired') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sesión Móvil Expirada</h2>
        <p className="text-sm text-slate-400 max-w-xs mb-6">
          Por seguridad, los códigos temporales duran 15 minutos. Abre el panel en tu computadora y genera uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Canvas invisible para congelar fotos en alta resolución */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Móvil */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wider uppercase text-amber-400">Escanear en 3D</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Móvil
              </span>
            </div>
            <h1 className="text-sm font-semibold text-white truncate max-w-[190px]">
              {session?.dishName || 'Escaneo de Platillo'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {remainingTime && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{remainingTime}</span>
            </div>
          )}
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-lg mx-auto w-full p-4 flex flex-col gap-4">
        {/* Banner de Intentos Restantes */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
          <span className="text-slate-400">Escaneos del platillo:</span>
          <span className="font-semibold text-amber-400">
            Intento {Math.min((session?.attempts || 0) + 1, session?.maxAttempts || 3)} de {session?.maxAttempts || 3}
          </span>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ESTADO 1: CAPTURA DE FOTOGRAFÍAS */}
        {/* ======================================================== */}
        {processState === 'capture' && (
          <>
            {/* Selector de Modo: 1 Foto vs 3 Fotos */}
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex gap-1">
              <button
                type="button"
                onClick={() => setMode('multiview')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'multiview'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Estudio 3D (3 Fotos)</span>
                <span className="text-[10px] bg-slate-950/20 px-1 rounded-sm">Recomendado</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'single'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Express (1 Foto)</span>
              </button>
            </div>

            {/* VISOR DE CÁMARA EN VIVO CON SILUETA DE PLATO SUPERPUESTA */}
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Elemento de Video en Vivo */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  cameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Efecto de Flash Blanco al Disparar */}
              {isFlashing && (
                <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-100" />
              )}

              {/* Vista si la cámara está apagada o cargando */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 z-0">
                  {cameraLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-slate-300">Iniciando cámara en vivo...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 max-w-xs">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Camera className="w-7 h-7" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {cameraError || 'Activa la cámara para apuntar directamente a tu platillo con la silueta guía.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Activar Cámara en Vivo</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CAPA DE GUÍA SUPERPUESTA A LA CÁMARA */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
                {/* Indicador de Ángulo Activo y Control de Cámara */}
                <div className="flex items-center justify-between gap-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>
                      {mode === 'single'
                        ? 'Foto Única (Ángulo 45°)'
                        : activeSlot === 'front'
                        ? 'Paso 1 de 3: Vista Frontal (0°)'
                        : activeSlot === 'angle'
                        ? 'Paso 2 de 3: Vista Diagonal (45°)'
                        : 'Paso 3 de 3: Vista Cenital (90°)'}
                    </span>
                  </div>

                  {cameraActive && (
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <button
                        type="button"
                        onClick={toggleFacingMode}
                        className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white active:scale-90 shadow-md"
                        title="Cambiar cámara trasera / delantera"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* SILUETA DE PLATO OVALADO SUPERPUESTA AL VIDEO */}
                <div className="relative self-center flex items-center justify-center my-auto">
                  <div className="w-56 h-36 sm:w-64 sm:h-44 rounded-full border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-center">
                    <div className="w-44 h-26 sm:w-52 sm:h-32 rounded-full border border-dashed border-amber-300/50 flex items-center justify-center bg-amber-500/5">
                      <span className="text-[11px] font-bold text-amber-200 tracking-wide drop-shadow-md text-center px-2">
                        Centra el plato aquí
                      </span>
                    </div>
                    {/* Mirillas de encuadre en los 4 ejes */}
                    <div className="absolute top-0 w-4 h-1 bg-amber-400 rounded-full" />
                    <div className="absolute bottom-0 w-4 h-1 bg-amber-400 rounded-full" />
                    <div className="absolute left-0 h-4 w-1 bg-amber-400 rounded-full" />
                    <div className="absolute right-0 h-4 w-1 bg-amber-400 rounded-full" />
                  </div>
                </div>

                {/* Barra Inferior del Visor: Mensaje / Feedback */}
                <div className="self-center mb-16">
                  {capturedFeedback ? (
                    <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{capturedFeedback}</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] text-slate-200 border border-slate-800 shadow-md">
                      {mode === 'single'
                        ? '📐 Inclina el celular 45° mirando el platillo'
                        : activeSlot === 'front'
                        ? '🍽️ Coloca el celular a la altura de la mesa (0°)'
                        : activeSlot === 'angle'
                        ? '📐 Inclina el celular a 45° (vista comensal)'
                        : '⬆️ Apunta desde arriba del plato perpendicular (90°)'}
                    </div>
                  )}
                </div>
              </div>

              {/* BOTÓN OBTURADOR (DISPARADOR ESTILO CÁMARA NATIVA) */}
              {cameraActive && (
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center z-20 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handleCaptureFrame}
                    className="w-16 h-16 rounded-full border-4 border-white/90 bg-amber-500 hover:bg-amber-400 active:scale-90 transition-transform shadow-2xl shadow-black/80 flex items-center justify-center p-1"
                    aria-label="Tomar fotografía"
                  >
                    <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center text-slate-950">
                      <Camera className="w-7 h-7 stroke-[2.2]" />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* BARRA DE MINIATURAS DE FOTOS CAPTURADAS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fotografías del Escaneo:</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {mode === 'single'
                    ? photos.single ? '1 de 1 lista' : '0 de 1'
                    : `${[photos.front, photos.angle, photos.top].filter(Boolean).length} de 3 listas`}
                </span>
              </div>

              {mode === 'single' ? (
                <MiniSlotCard
                  slotKey="single"
                  label="Ángulo 45°"
                  preview={previews.single}
                  isActive={activeSlot === 'single'}
                  onActivate={() => setActiveSlot('single')}
                  onRemove={() => handleRemovePhoto('single')}
                  galleryRef={galleryInputRefs.single}
                  onSelect={(file) => handlePhotoSelect('single', file)}
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <MiniSlotCard
                    slotKey="front"
                    slotNum="1"
                    label="Frente (0°)"
                    preview={previews.front}
                    isActive={activeSlot === 'front'}
                    onActivate={() => setActiveSlot('front')}
                    onRemove={() => handleRemovePhoto('front')}
                    galleryRef={galleryInputRefs.front}
                    onSelect={(file) => handlePhotoSelect('front', file)}
                  />
                  <MiniSlotCard
                    slotKey="angle"
                    slotNum="2"
                    label="Diagonal (45°)"
                    preview={previews.angle}
                    isActive={activeSlot === 'angle'}
                    onActivate={() => setActiveSlot('angle')}
                    onRemove={() => handleRemovePhoto('angle')}
                    galleryRef={galleryInputRefs.angle}
                    onSelect={(file) => handlePhotoSelect('angle', file)}
                  />
                  <MiniSlotCard
                    slotKey="top"
                    slotNum="3"
                    label="Cenital (90°)"
                    preview={previews.top}
                    isActive={activeSlot === 'top'}
                    onActivate={() => setActiveSlot('top')}
                    onRemove={() => handleRemovePhoto('top')}
                    galleryRef={galleryInputRefs.top}
                    onSelect={(file) => handlePhotoSelect('top', file)}
                  />
                </div>
              )}
            </div>

            {/* Consejos Fotográficos Breves */}
            <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>💡 Iluminación natural pareja sin sombras duras.</span>
              <span>🍽️ No gires el plato entre fotos.</span>
            </div>

            {/* Botón CTA de Generación */}
            <button
              type="button"
              disabled={!isReadyToGenerate()}
              onClick={handleStartGeneration}
              className={`w-full py-4 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
                isReadyToGenerate()
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-98 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isReadyToGenerate()
                  ? '✨ Generar Modelo 3D'
                  : mode === 'single'
                  ? 'Toma 1 foto para continuar'
                  : 'Completa las 3 fotos para continuar'}
              </span>
            </button>
          </>
        )}

        {/* ======================================================== */}
        {/* ESTADO 2: PROCESAMIENTO / GENERACIÓN EN VIVO */}
        {/* ======================================================== */}
        {(processState === 'uploading' || processState === 'processing') && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fadeIn">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold font-mono text-amber-400">{progress}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-white">
                {processState === 'uploading' ? 'Cargando Imágenes...' : 'Generando Modelo 3D'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xs">
                {statusMessage || 'Calculando volumen y texturas del platillo...'}
              </p>
            </div>

            {/* Barra de Progreso Lineal */}
            <div className="w-full max-w-xs bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Tarjeta de Tips Culinarios Rotativos */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 max-w-xs text-left space-y-1.5 shadow-lg">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>¿Sabías qué?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{FOODIE_TIPS[tipIndex]}"
              </p>
            </div>

            <p className="text-[11px] text-slate-500">
              Este proceso suele tomar entre 40 y 90 segundos. Puedes mantener esta pantalla abierta o consultarla en tu computadora.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* ESTADO 3: MODELO 3D COMPLETADO */}
        {/* ======================================================== */}
        {processState === 'ready' && (
          <div className="flex-1 flex flex-col items-center text-center space-y-5 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">¡Escaneo Exitoso!</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Modelo 3D Generado y Calibrado</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                El platillo ya está listo en tu menú digital y sincronizado automáticamente con la computadora.
              </p>
            </div>

            {/* Previsualización 3D Interactiva */}
            {generatedModelUrl && (
              <div className="w-full aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden relative shadow-2xl">
                <model-viewer
                  src={generatedModelUrl}
                  ar
                  ar-modes="webxr quick-look"
                  camera-controls
                  auto-rotate
                  shadow-intensity="1.2"
                  exposure="1.1"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs text-amber-400 pointer-events-none">
                  <Box className="w-3.5 h-3.5" />
                  <span>Escala 1:1 ({dishDiameterCm} cm)</span>
                </div>
              </div>
            )}

            {/* Calibrador de Tamaño Rápido */}
            <div className="w-full bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ajustar diámetro real del plato:</span>
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">{dishDiameterCm} cm</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Bebida', cm: 12 },
                  { label: 'Postre', cm: 16 },
                  { label: 'Plato', cm: 25 },
                  { label: 'Pizza', cm: 35 }
                ].map((item) => (
                  <button
                    key={item.cm}
                    type="button"
                    disabled={calibrating}
                    onClick={() => handleCalibrate(item.cm)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
                      dishDiameterCm === item.cm
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] opacity-75">{item.cm}cm</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setProcessState('capture');
                setPhotos({ front: null, angle: null, top: null, single: null });
                setPreviews({ front: '', angle: '', top: '', single: '' });
                startCamera(facingMode);
              }}
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Escanear de Nuevo o Ajustar Fotos</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* ESTADO 4: FALLÓ LA GENERACIÓN */}
        {/* ======================================================== */}
        {processState === 'failed' && (
          <div className="flex-1 flex flex-col items-center text-center p-6 space-y-5 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">No se pudo reconstruir el 3D</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">{error}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs text-slate-300 space-y-2 max-w-xs">
              <span className="font-semibold text-amber-400">Consejos para reintentar:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                <li>Toma las fotos con mayor luz ambiental (no a contraluz).</li>
                <li>Asegúrate de que el platillo esté centrado en la silueta.</li>
                <li>No recortes los bordes del plato en ninguna de las tomas.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setProcessState('capture');
                setError('');
                startCamera(facingMode);
              }}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tomar Nuevas Fotografías</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Mini tarjeta de ranura fotográfica
function MiniSlotCard({
  slotKey,
  slotNum,
  label,
  preview,
  isActive,
  onActivate,
  onRemove,
  galleryRef,
  onSelect
}) {
  return (
    <div
      onClick={onActivate}
      className={`relative p-2 rounded-2xl border cursor-pointer transition-all ${
        isActive
          ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      <input
        type="file"
        ref={galleryRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0])}
      />

      <div className="aspect-square rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center mb-1.5">
        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-rose-300 border border-rose-500/30"
              title="Eliminar"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600">
            <Camera className="w-5 h-5 stroke-[1.5]" />
            {slotNum && <span className="text-[9px] font-mono mt-0.5">#{slotNum}</span>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-white truncate">{label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            galleryRef.current?.click();
          }}
          className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          title="Subir de galería"
        >
          <ImageIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

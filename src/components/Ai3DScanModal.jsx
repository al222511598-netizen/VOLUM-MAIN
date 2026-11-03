import loadModelViewer from '../utils/loadModelViewer';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X,
  Sparkles,
  Smartphone,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
  Box,
  Sliders,
  Copy,
  ExternalLink,
  Camera,
  Trash2,
  Zap,
  ArrowRight,
  ChevronDown,
  Maximize2,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_SCALES = [
  { label: 'Bebida / Vaso', cm: 12, desc: 'Cocteles, café, cervezas' },
  { label: 'Postre', cm: 16, desc: 'Pasteles, repostería' },
  { label: 'Plato Fuerte', cm: 25, desc: 'Cortes, pastas, ensaladas' },
  { label: 'Plato Grande / Pizza', cm: 35, desc: 'Pizzas, fuentes para compartir' }
];

// Precargar model-viewer al montar modal de escaneo
export default function Ai3DScanModal({
  isOpen,
  dish,
  dishes = [],
  authHeaders,
  onSuccess,
  onClose,
  onUpsell
}) {

  // Detección de dispositivo móvil
  const isMobileDevice = typeof window !== 'undefined' && (
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  );

  // Soporte para alternar de platillo dentro del modal
  const [selectedDishId, setSelectedDishId] = useState(dish?._id || null);
  const currentDish = (dishes && dishes.find((d) => d._id === selectedDishId)) || dish || {};

  // Sincronizar platillo seleccionado cuando cambie la prop dish
  useEffect(() => {
    if (dish?._id && dish._id !== selectedDishId) {
      setSelectedDishId(dish._id);
    }
  }, [dish?._id]);

  // Pestaña principal:
  // En móvil: 'camera' (Cámara de este celular) | 'desktop_upload' (Elegir de rollo) | 'calibrate'
  // En PC: 'mobile_qr' (Escanear con QR) | 'desktop_upload' (Subir de PC) | 'camera' | 'calibrate'
  const [activeTab, setActiveTab] = useState(isMobileDevice ? 'camera' : 'mobile_qr');

  // Estado del QR companion
  const [companionSession, setCompanionSession] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Modo de captura: 'multiview' (3 fotos) | 'single' (1 foto)
  const [scanMode, setScanMode] = useState('multiview');
  const [activeSlot, setActiveSlot] = useState('front'); // 'front' | 'angle' | 'top' | 'single'

  const [capturedFiles, setCapturedFiles] = useState({
    single: null,
    front: null,
    angle: null,
    top: null
  });
  const [capturedPreviews, setCapturedPreviews] = useState({
    single: '',
    front: '',
    angle: '',
    top: ''
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

  // Estado del procesamiento: 'idle' | 'uploading' | 'processing' | 'ready' | 'failed'
  const [processState, setProcessState] = useState(currentDish?.modelStatus === 'processing' ? 'processing' : 'idle');
  const [progress, setProgress] = useState(currentDish?.tripoProgress || 0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  // Modelo y Calibración
  const [currentModelUrl, setCurrentModelUrl] = useState(currentDish?.modelGlbUrl || '');
  const [diameterCm, setDiameterCm] = useState(currentDish?.dishDiameterCm || 25);
  const [savingScale, setSavingScale] = useState(false);
  const [scaleSavedToast, setScaleSavedToast] = useState(false);

  // Intentos
  const attempts = currentDish?.generationAttempts || 0;
  const maxAttempts = currentDish?.maxAttempts || 3;
  const isAttemptsExceeded = attempts >= maxAttempts && !currentDish?.modelGlbUrl;

  // 1. Cargar o crear sesión de QR / Móvil al abrir o cambiar de platillo
  useEffect(() => {
    let cancelled = false;

    const initCompanionToken = async () => {
      try {
        setLoadingQr(true);
        const res = await axios.post(
          `/api/v1/ai3d/companion-token/${currentDish._id}`,
          {},
          authHeaders
        );
        if (cancelled) return;
        setCompanionSession(res.data);
      } catch (err) {
        if (cancelled) return;
        console.warn('Error al generar token companion:', err);
      } finally {
        if (!cancelled) setLoadingQr(false);
      }
    };

    if (isOpen && currentDish?._id) {
      setCurrentModelUrl(currentDish.modelGlbUrl || '');
      setDiameterCm(currentDish.dishDiameterCm || 25);
      setProcessState(currentDish.modelStatus === 'processing' ? 'processing' : 'idle');
      setProgress(currentDish.tripoProgress || 0);
      initCompanionToken();
    }

    return () => {
      cancelled = true;
    };
  }, [isOpen, currentDish?._id, authHeaders]);

  // 2. Control de Cámara en Vivo (iniciar / detener)
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
        throw new Error('Navegador sin soporte de video WebRTC. Puedes usar la subida de fotos.');
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
      console.warn('Error al activar cámara:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Permiso de cámara no concedido en el navegador.'
          : 'No se pudo activar la cámara en vivo.'
      );
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  // Ajustar ranura activa al cambiar entre 1 y 3 fotos
  useEffect(() => {
    if (scanMode === 'single') {
      setActiveSlot('single');
    } else {
      if (!capturedFiles.front) setActiveSlot('front');
      else if (!capturedFiles.angle) setActiveSlot('angle');
      else if (!capturedFiles.top) setActiveSlot('top');
      else setActiveSlot('front');
    }
  }, [scanMode]);

  // 3. Capturar frame desde el video en vivo
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

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 120);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(40); } catch (_) {}
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `${currentDish.name || 'platillo'}-${activeSlot}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      handleFileSelect(activeSlot, file);

      // Flujo asistido
      if (scanMode === 'multiview') {
        if (activeSlot === 'front') {
          setCapturedFeedback('¡Frontal tomada! Ahora inclina a 45°');
          setActiveSlot('angle');
        } else if (activeSlot === 'angle') {
          setCapturedFeedback('¡Diagonal tomada! Ahora apunta desde arriba');
          setActiveSlot('top');
        } else if (activeSlot === 'top') {
          setCapturedFeedback('¡Las 3 fotos listas!');
        }
        setTimeout(() => setCapturedFeedback(''), 3000);
      } else {
        setCapturedFeedback('¡Fotografía lista!');
        setTimeout(() => setCapturedFeedback(''), 2500);
      }
    }, 'image/jpeg', 0.95);
  };

  const toggleFacingMode = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(next);
  };

  // 4. Polling de avance en vivo
  useEffect(() => {
    if (!isOpen || !currentDish?._id || (processState !== 'processing' && !companionSession)) return;

    let pollId = setInterval(async () => {
      try {
        const res = await axios.get(`/api/v1/ai3d/status/${currentDish?._id}`, authHeaders);
        if (res.data.success) {
          const { modelStatus, progress: currentProg, dish: updatedDish } = res.data;

          if (modelStatus === 'processing') {
            setProcessState('processing');
            setProgress(currentProg || 35);
            setStatusMessage('Reconstruyendo volumen y texturas fotogramétricas...');
          } else if (modelStatus === 'ready') {
            setProcessState('ready');
            setProgress(100);
            setCurrentModelUrl(updatedDish?.modelGlbUrl || res.data.modelGlbUrl);
            setDiameterCm(updatedDish?.dishDiameterCm || 25);
            onSuccess?.(updatedDish || currentDish);
            clearInterval(pollId);
          } else if (modelStatus === 'failed') {
            setProcessState('failed');
            setError(res.data.error || 'La generación 3D no pudo completarse. Revisa la iluminación.');
            clearInterval(pollId);
          }
        }
      } catch (err) {
        console.warn('Polling status error:', err);
      }
    }, 2500);

    return () => clearInterval(pollId);
  }, [isOpen, processState, companionSession, currentDish?._id, authHeaders, onSuccess]);

  // Manejar selección de archivos
  const handleFileSelect = (slot, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido (JPG, PNG o WEBP).');
      return;
    }
    setError('');
    const prevUrl = URL.createObjectURL(file);
    setCapturedFiles((prev) => ({ ...prev, [slot]: file }));
    setCapturedPreviews((prev) => ({ ...prev, [slot]: prevUrl }));
  };

  const handleRemoveFile = (slot) => {
    setCapturedFiles((prev) => ({ ...prev, [slot]: null }));
    setCapturedPreviews((prev) => ({ ...prev, [slot]: '' }));
    setActiveSlot(slot);
  };

  // Validar si las fotos necesarias están completas
  const isReadyToStart = () => {
    if (scanMode === 'single') {
      return !!capturedFiles.single;
    }
    return !!(capturedFiles.front && capturedFiles.angle && capturedFiles.top);
  };

  // Enviar fotos para procesar
  const handleStartGeneration = async () => {
    stopCamera();
    setError('');
    setProcessState('uploading');
    setProgress(15);
    setStatusMessage('Cargando fotografías para reconstruir el modelo...');

    try {
      const formData = new FormData();
      formData.append('mode', scanMode);

      if (scanMode === 'single') {
        if (!capturedFiles.single) {
          setError('Debes tomar o seleccionar 1 fotografía en ángulo.');
          setProcessState('idle');
          return;
        }
        formData.append('files', capturedFiles.single);
      } else {
        if (!capturedFiles.front || !capturedFiles.angle || !capturedFiles.top) {
          setError('Debes tomar las 3 fotografías (Frente, 45° y Cenital).');
          setProcessState('idle');
          return;
        }
        formData.append('files', capturedFiles.front);
        formData.append('files', capturedFiles.angle);
        formData.append('files', capturedFiles.top);
      }

      const res = await axios.post(`/api/v1/ai3d/generate/${currentDish._id}`, formData, {
        headers: {
          ...authHeaders?.headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setProcessState('processing');
        setProgress(25);
        setStatusMessage('Calculando relieve, mallas 3D y texturas...');
      }
    } catch (err) {
      setProcessState('failed');
      const msg = err.response?.data?.message || 'Error al iniciar el escaneo 3D.';
      setError(msg);
      if (err.response?.data?.needsUpsell) {
        onUpsell?.();
      }
    }
  };

  // Guardar calibración de escala métrica 1:1
  const handleSaveCalibration = async (newCm) => {
    const cmValue = Number(newCm) || diameterCm;
    try {
      setSavingScale(true);
      const res = await axios.patch(
        `/api/v1/ai3d/calibrate/${currentDish._id}`,
        { dishDiameterCm: cmValue },
        authHeaders
      );
      if (res.data.success) {
        setDiameterCm(cmValue);
        setScaleSavedToast(true);
        setTimeout(() => setScaleSavedToast(false), 2500);
        onSuccess?.(res.data.dish);
      }
    } catch (err) {
      console.error('Error al guardar calibración:', err);
    } finally {
      setSavingScale(false);
    }
  };

  const copyCompanionLink = () => {
    if (!companionSession?.companionUrl) return;
    navigator.clipboard.writeText(companionSession.companionUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const openMobileAssistant = () => {
    if (!companionSession?.companionUrl) return;
    window.location.href = companionSession.companionUrl;
  };

  if (!isOpen || !dish) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
    >
      {/* Canvas invisible para congelar fotos */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera del Modal */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                  Escanear en 3D
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Escala Real 1:1
                </span>
              </div>

              {/* Selector de Platillos si hay lista */}
              {dishes && dishes.length > 1 ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-slate-400">Platillo:</span>
                  <div className="relative inline-block">
                    <select
                      value={selectedDishId}
                      onChange={(e) => setSelectedDishId(e.target.value)}
                      className="text-xs font-bold text-amber-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 pr-6 appearance-none cursor-pointer focus:outline-none focus:border-amber-500"
                    >
                      {dishes.map((d) => (
                        <option key={d._id} value={d._id} className="bg-slate-900 text-white">
                          {d.name} {d.is3D ? '★ (3D)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1.5 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                  Platillo: <strong className="text-slate-200">{currentDish.name}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <span>Intentos:</span>
              <strong className={attempts >= maxAttempts ? 'text-rose-400' : 'text-amber-400'}>
                {attempts}/{maxAttempts}
              </strong>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pestañas Dinámicas según el Dispositivo */}
        <div className="px-5 pt-3 pb-0 bg-slate-900/50 border-b border-slate-800/80 flex gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'camera'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cámara en Vivo</span>
          </button>

          {!isMobileDevice && (
            <button
              type="button"
              onClick={() => setActiveTab('mobile_qr')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'mobile_qr'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Escanear con Celular (QR)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('desktop_upload')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'desktop_upload'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isMobileDevice ? 'Elegir de Galería' : 'Subir Fotos de PC'}</span>
          </button>

          {(currentModelUrl || currentDish.is3D) && (
            <button
              type="button"
              onClick={() => setActiveTab('calibrate')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'calibrate'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Calibrar Escala 1:1 ({diameterCm} cm)</span>
            </button>
          )}
        </div>

        {/* Contenido Dinámico con Scroll */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Mensaje de Error */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Toast de Guardado de Escala */}
          {scaleSavedToast && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Escala métrica 1:1 guardada en el menú digital.</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 1: CÁMARA EN VIVO CON SILUETA SUPERPUESTA */}
          {/* ======================================================== */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {/* Selector de Modo */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo de Escaneo:</span>
                </span>
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setScanMode('multiview')}
                    className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                      scanMode === 'multiview'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Estudio 3D (3 Fotos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScanMode('single')}
                    className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                      scanMode === 'single'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Express (1 Foto)
                  </button>
                </div>
              </div>

              {/* VISOR DE CÁMARA EN VIVO */}
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {isFlashing && (
                  <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-100" />
                )}

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
                          <span>Activar Cámara</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* SILUETA Y RETÍCULA SUPERPUESTA A LA CÁMARA */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
                  {/* Barra Superior */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>
                        {scanMode === 'single'
                          ? 'Foto Única (Ángulo 45°)'
                          : activeSlot === 'front'
                          ? 'Paso 1 de 3: Frente (0°)'
                          : activeSlot === 'angle'
                          ? 'Paso 2 de 3: Diagonal (45°)'
                          : 'Paso 3 de 3: Cenital (90°)'}
                      </span>
                    </div>

                    {cameraActive && (
                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <button
                          type="button"
                          onClick={toggleFacingMode}
                          className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white active:scale-90 shadow-md"
                          title="Cambiar cámara"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Silueta central de plato */}
                  <div className="relative self-center flex items-center justify-center my-auto">
                    <div className="w-56 h-36 sm:w-64 sm:h-44 rounded-full border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-center">
                      <div className="w-44 h-26 sm:w-52 sm:h-32 rounded-full border border-dashed border-amber-300/50 flex items-center justify-center bg-amber-500/5">
                        <span className="text-[11px] font-bold text-amber-200 tracking-wide drop-shadow-md text-center px-2">
                          Centra el plato aquí
                        </span>
                      </div>
                      <div className="absolute top-0 w-4 h-1 bg-amber-400 rounded-full" />
                      <div className="absolute bottom-0 w-4 h-1 bg-amber-400 rounded-full" />
                      <div className="absolute left-0 h-4 w-1 bg-amber-400 rounded-full" />
                      <div className="absolute right-0 h-4 w-1 bg-amber-400 rounded-full" />
                    </div>
                  </div>

                  {/* Barra Inferior del Visor */}
                  <div className="self-center mb-16">
                    {capturedFeedback ? (
                      <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{capturedFeedback}</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] text-slate-200 border border-slate-800 shadow-md">
                        {scanMode === 'single'
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

                {/* BOTÓN OBTURADOR */}
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

              {/* Tiras de Miniaturas */}
              <div className="space-y-2">
                {scanMode === 'single' ? (
                  <ModalMiniSlot
                    label="Fotografía (45°)"
                    preview={capturedPreviews.single}
                    isActive={activeSlot === 'single'}
                    onActivate={() => setActiveSlot('single')}
                    onRemove={() => handleRemoveFile('single')}
                    onSelect={(file) => handleFileSelect('single', file)}
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <ModalMiniSlot
                      slotNum="1"
                      label="Frente (0°)"
                      preview={capturedPreviews.front}
                      isActive={activeSlot === 'front'}
                      onActivate={() => setActiveSlot('front')}
                      onRemove={() => handleRemoveFile('front')}
                      onSelect={(file) => handleFileSelect('front', file)}
                    />
                    <ModalMiniSlot
                      slotNum="2"
                      label="Diagonal (45°)"
                      preview={capturedPreviews.angle}
                      isActive={activeSlot === 'angle'}
                      onActivate={() => setActiveSlot('angle')}
                      onRemove={() => handleRemoveFile('angle')}
                      onSelect={(file) => handleFileSelect('angle', file)}
                    />
                    <ModalMiniSlot
                      slotNum="3"
                      label="Cenital (90°)"
                      preview={capturedPreviews.top}
                      isActive={activeSlot === 'top'}
                      onActivate={() => setActiveSlot('top')}
                      onRemove={() => handleRemoveFile('top')}
                      onSelect={(file) => handleFileSelect('top', file)}
                    />
                  </div>
                )}
              </div>

              {/* Botón CTA Generar */}
              <button
                type="button"
                disabled={!isReadyToStart() || processState === 'uploading' || processState === 'processing'}
                onClick={handleStartGeneration}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isReadyToStart()
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                {processState === 'uploading' || processState === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Generando Modelo 3D ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isReadyToStart() ? 'Generar Modelo 3D' : 'Captura las fotos para continuar'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 2: ESCANEAR CON CELULAR (QR EN PC) */}
          {/* ======================================================== */}
          {activeTab === 'mobile_qr' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center shadow-inner">
                  {loadingQr ? (
                    <div className="w-44 h-44 flex flex-col items-center justify-center text-slate-500">
                      <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-2" />
                      <span className="text-xs">Generando código seguro...</span>
                    </div>
                  ) : companionSession?.qrCodeDataUrl ? (
                    <div className="relative group p-2 bg-white rounded-2xl shadow-xl">
                      <img
                        src={companionSession.qrCodeDataUrl}
                        alt="Código QR de escaneo móvil"
                        className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-rose-400">
                      Error al generar QR.
                    </div>
                  )}

                  <span className="text-[11px] text-slate-400 mt-2.5">
                    Apunta con la cámara de tu teléfono iPhone o Android
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">
                      Cómo funciona:
                    </h3>
                    <ol className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                        <span>Escanea el QR para abrir la cámara con silueta en tu teléfono.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                        <span>Centra el plato dentro de la silueta ovalada para tomar las fotos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                        <span>El modelo 3D aparecerá aquí automáticamente.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={copyCompanionLink}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-xs text-slate-200 font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{copiedUrl ? '¡Enlace copiado!' : 'Copiar enlace móvil directo'}</span>
                    </button>

                    {companionSession?.companionUrl && (
                      <a
                        href={companionSession.companionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-[11px] text-amber-400 hover:underline flex items-center justify-center gap-1 mt-1"
                      >
                        <span>Abrir en una nueva pestaña</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${processState === 'processing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs text-slate-300">
                    {processState === 'processing'
                      ? `Generando modelo 3D (${progress}%)...`
                      : 'Esperando fotografías desde el celular...'}
                  </span>
                </div>
                {processState === 'processing' && (
                  <span className="text-xs font-mono font-bold text-amber-400">{progress}%</span>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 3: SUBIR FOTOS DESDE ARCHIVOS / GALERÍA */}
          {/* ======================================================== */}
          {activeTab === 'desktop_upload' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex gap-1">
                <button
                  type="button"
                  onClick={() => setScanMode('multiview')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    scanMode === 'multiview'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Estudio 3D (3 Fotos)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode('single')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    scanMode === 'single'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Modo Rápido (1 Foto)</span>
                </button>
              </div>

              {scanMode === 'single' ? (
                <DesktopDropzone
                  label="Fotografía del Platillo (Ángulo 45°)"
                  sublabel="Procura que se vea el relieve y vajilla completa"
                  preview={capturedPreviews.single}
                  onSelect={(file) => handleFileSelect('single', file)}
                  onRemove={() => handleRemoveFile('single')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DesktopDropzone
                    label="1. Frente (0°)"
                    sublabel="A nivel del plato"
                    preview={capturedPreviews.front}
                    onSelect={(file) => handleFileSelect('front', file)}
                    onRemove={() => handleRemoveFile('front')}
                  />
                  <DesktopDropzone
                    label="2. Diagonal (45°)"
                    sublabel="Perspectiva comensal"
                    preview={capturedPreviews.angle}
                    onSelect={(file) => handleFileSelect('angle', file)}
                    onRemove={() => handleRemoveFile('angle')}
                  />
                  <DesktopDropzone
                    label="3. Cenital (90°)"
                    sublabel="Desde arriba"
                    preview={capturedPreviews.top}
                    onSelect={(file) => handleFileSelect('top', file)}
                    onRemove={() => handleRemoveFile('top')}
                  />
                </div>
              )}

              <button
                type="button"
                disabled={!isReadyToStart() || processState === 'uploading' || processState === 'processing'}
                onClick={handleStartGeneration}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40"
              >
                {processState === 'uploading' || processState === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Generando Modelo 3D ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isReadyToStart() ? 'Generar Modelo 3D' : 'Selecciona las fotos para continuar'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 4: CALIBRADOR MÉTRICO 1:1 */}
          {/* ======================================================== */}
          {activeTab === 'calibrate' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-400">Calibración Métrica 1:1 Estricta:</span> Indica el diámetro real del plato para que al proyectarse en la mesa del comensal mediante Realidad Aumentada (WebAR) aparezca a escala idéntica a la cocina.
              </div>

              {currentModelUrl && (
                <div className="w-full aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                  <model-viewer
                    src={currentModelUrl}
                    camera-controls
                    auto-rotate
                    shadow-intensity="1.2"
                    exposure="1.1"
                    scale={`${(diameterCm / 100).toFixed(3)} ${(diameterCm / 100).toFixed(3)} ${(diameterCm / 100).toFixed(3)}`}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-amber-400 font-mono">
                    <Box className="w-3.5 h-3.5" />
                    <span>Diámetro actual: {diameterCm} cm</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_SCALES.map((item) => (
                  <button
                    key={item.cm}
                    type="button"
                    disabled={savingScale}
                    onClick={() => handleSaveCalibration(item.cm)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      diameterCm === item.cm
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-sm font-mono text-amber-400 font-bold mt-0.5">{item.cm} cm</div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ajuste manual preciso:</span>
                  <span className="font-mono font-bold text-amber-400">{diameterCm} cm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={diameterCm}
                  onChange={(e) => setDiameterCm(Number(e.target.value))}
                  onMouseUp={() => handleSaveCalibration(diameterCm)}
                  onTouchEnd={() => handleSaveCalibration(diameterCm)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 cm (Shot / Copa)</span>
                  <span>25 cm (Estándar)</span>
                  <span>80 cm (Banquete)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Volum 3D Engine · Escala Real 1:1
          </span>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

// Mini slot para el modal
function ModalMiniSlot({
  slotNum,
  label,
  preview,
  isActive,
  onActivate,
  onRemove,
  onSelect
}) {
  const fileInputRef = useRef(null);

  return (
    <div
      onClick={onActivate}
      className={`p-2 rounded-2xl border cursor-pointer transition-all ${
        isActive
          ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/10'
          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0])}
      />

      <div className="aspect-square rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center mb-1.5">
        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-3 h-3 stroke-[3]" />
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
            <Camera className="w-4 h-4 stroke-[1.5]" />
            {slotNum && <span className="text-[9px] font-mono mt-0.5">#{slotNum}</span>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="font-bold text-white truncate">{label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="text-slate-400 hover:text-amber-400"
          title="Subir archivo"
        >
          <ImageIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// Subcomponente de zona de carga en desktop
function DesktopDropzone({ label, sublabel, preview, onSelect, onRemove }) {
  const inputRef = useRef(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="p-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-amber-500/60 bg-slate-950/60 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative min-h-[140px] group"
    >
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0])}
      />

      {preview ? (
        <div className="w-full h-full relative">
          <img src={preview} alt={label} className="w-full h-24 object-cover rounded-xl" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-rose-300 border border-rose-500/30"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white leading-tight">{label}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{sublabel}</p>
        </>
      )}
    </div>
  );
}

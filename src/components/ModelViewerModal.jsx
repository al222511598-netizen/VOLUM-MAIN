import loadModelViewer from '../utils/loadModelViewer';
import { getMediaUrl } from '../utils/media';
import React, { useRef, useState, useEffect } from 'react';
import { X, Box, Sparkles, Smartphone, Eye, RotateCw, ShieldCheck, AlertCircle, Lightbulb, ZoomIn, ZoomOut, RotateCcw, Maximize2, ShoppingBag } from 'lucide-react';
import AllergenBadge from './AllergenBadge';

const MODEL_VIEWER_TRANSLATIONS = {
  es: {
    close3D: 'Cerrar visor 3D',
    loading3D: 'Cargando textura 3D de alta definición...',
    scale1to1: 'Escala Real 1:1 Anclada',
    viewOriginalSize: 'Ver tamaño original',
    viewOriginalSizeTitle: 'Centrar y volver al tamaño 1:1 original',
    pinchZoom: 'Pellizca para zoom o gira',
    rotate360: 'Gira 360°',
    projectTable: 'Proyectar en tu mesa (WebAR 1:1)',
    physicalZoomTitle: 'Zoom Físico Real:',
    physicalZoomDesc: 'El platillo aparecerá a tamaño real sobre tu mesa. Para ver cada detalle, acerca físicamente tu teléfono como si estuvieras en el plato.',
    allergens: 'Alérgenos:',
    arNotAvailable: 'Cámara de Realidad Aumentada no disponible',
    closeArNotice: 'Cerrar aviso de realidad aumentada',
    arNoticeDesc: 'Tu teléfono no tiene activos los sensores de Realidad Aumentada (Google ARCore) para proyectar con cámara sobre la mesa.',
    arNoticeComfort: '¡No te preocupes! Puedes girar en 360°, acercar y examinar cada detalle de este platillo con tus dedos directamente aquí en tu pantalla.',
    understoodScreen: 'Entendido, explorar en pantalla'
  },
  en: {
    close3D: 'Close 3D viewer',
    loading3D: 'Loading high-definition 3D texture...',
    scale1to1: 'Locked 1:1 Real Scale',
    viewOriginalSize: 'View original size',
    viewOriginalSizeTitle: 'Center and reset to 1:1 original size',
    pinchZoom: 'Pinch to zoom or rotate',
    rotate360: 'Rotate 360°',
    projectTable: 'Project on your table (WebAR 1:1)',
    physicalZoomTitle: 'Real Physical Zoom:',
    physicalZoomDesc: 'The dish will appear at real life size on your table. To inspect every detail, move your phone closer as if you were right at the dish.',
    allergens: 'Allergens:',
    arNotAvailable: 'Augmented Reality camera unavailable',
    closeArNotice: 'Close AR notice',
    arNoticeDesc: 'Your phone does not have Augmented Reality sensors (Google ARCore) active to project with the camera onto the table.',
    arNoticeComfort: 'Don’t worry! You can rotate 360°, zoom in, and inspect every detail of this dish using your fingers right here on your screen.',
    understoodScreen: 'Got it, explore on screen'
  },
  fr: {
    close3D: 'Fermer le visualiseur 3D',
    loading3D: 'Chargement de la texture 3D haute définition...',
    scale1to1: 'Échelle Réelle 1:1 Verrouillée',
    viewOriginalSize: 'Voir taille originale',
    viewOriginalSizeTitle: 'Centrer et rétablir la taille 1:1 originale',
    pinchZoom: 'Pincer pour zoomer ou tourner',
    rotate360: 'Pivoter à 360°',
    projectTable: 'Projeter sur votre table (WebAR 1:1)',
    physicalZoomTitle: 'Zoom Physique Réel :',
    physicalZoomDesc: 'Le plat apparaîtra à taille réelle sur votre table. Pour inspecter chaque détail, approchez physiquement votre téléphone comme si vous étiez devant l’assiette.',
    allergens: 'Allergènes :',
    arNotAvailable: 'Caméra de Réalité Augmentée non disponible',
    closeArNotice: 'Fermer l’avis de réalité augmentée',
    arNoticeDesc: 'Votre téléphone n’a pas les capteurs de Réalité Augmentée (Google ARCore) actifs pour projeter avec la caméra sur la table.',
    arNoticeComfort: 'Ne vous inquiétez pas ! Vous pouvez pivoter à 360°, zoomer et examiner chaque détail de ce plat avec vos doigts directement sur votre écran.',
    understoodScreen: 'Compris, explorer à l’écran'
  }
};

export default function ModelViewerModal({ dish, onClose, themeColor = '#D97706', lang = 'es', onAddToCart = null }) {
  const t = MODEL_VIEWER_TRANSLATIONS[lang] || MODEL_VIEWER_TRANSLATIONS.es;
  const modelViewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArFallbackNotice, setShowArFallbackNotice] = useState(false);

  useEffect(() => {
    // Bloquear scroll de la página al abrir el visor
    document.body.style.overflow = 'hidden';
    loadModelViewer();
    
    // Soporte para tecla Escape (escape-routes)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    // Detectar si el intento de RA falló en el dispositivo
    const handleArStatus = (event) => {
      if (event.detail.status === 'failed') {
        setShowArFallbackNotice(true);
      }
    };

    mv.addEventListener('ar-status', handleArStatus);
    return () => {
      mv.removeEventListener('ar-status', handleArStatus);
    };
  }, []);

  const handleLaunchAR = async () => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Detección preventiva real: si es iOS requiere USDZ, en Android requiere WebXR con ARCore activo
    let isArSupported = false;
    if (isIOS) {
      isArSupported = Boolean(iosSrc);
    } else if (window.navigator?.xr?.isSessionSupported) {
      try {
        isArSupported = await window.navigator.xr.isSessionSupported('immersive-ar');
      } catch (e) {
        isArSupported = false;
      }
    }

    // Si el dispositivo no tiene soporte nativo de cámara AR, mostrar notificación amigable sin salir a Play Store
    if (!isArSupported) {
      setShowArFallbackNotice(true);
      return;
    }

    try {
      if (typeof mv.activateAR === 'function') {
        mv.activateAR();
      } else {
        setShowArFallbackNotice(true);
      }
    } catch (err) {
      console.warn('Error al activar Realidad Aumentada:', err);
      setShowArFallbackNotice(true);
    }
  };

  const handleResetOriginalScale = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    mv.fieldOfView = 'auto';
    mv.cameraOrbit = 'auto auto auto';
    mv.cameraTarget = 'auto auto auto';
    if (typeof mv.jumpCameraToGoal === 'function') {
      mv.jumpCameraToGoal();
    }
    if (typeof mv.resetTurntableRotation === 'function') {
      mv.resetTurntableRotation();
    }
  };

  if (!dish) return null;

  // Escala fija 1:1 en iOS QuickLook (#allowsContentScaling=0)
  const iosSrc = dish.modelUsdzUrl 
    ? (dish.modelUsdzUrl.includes('#') ? dish.modelUsdzUrl.replace(/#allowsContentScaling=[01]/, '#allowsContentScaling=0') : `${dish.modelUsdzUrl}#allowsContentScaling=0`)
    : '';

  // Modelo GLB (fallback a modelo stock si no hay uno personalizado aún)
  const glbSrc = getMediaUrl(dish.modelGlbUrl || '/models/olives-dish.glb');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="model-viewer-dish-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn"
    >
      <div className="relative w-full h-full md:h-[90vh] max-w-2xl bg-slate-900 md:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Barra superior de control */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/90 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Box className="w-4 h-4" />
            </span>
            <div>
              <h2 id="model-viewer-dish-name" className="text-base font-bold text-white leading-tight line-clamp-1 font-playfair">
                {dish.name}
              </h2>
              <span className="text-xs font-semibold text-emerald-400 tabular-nums font-outfit">
                ${dish.price} {dish.currency || 'MXN'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
            aria-label={t.close3D}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área del Visor 3D y WebAR */}
        <div className="relative flex-1 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
          
          {/* Indicador de carga */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-0">
              <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-medium tracking-wide font-outfit">
                {t.loading3D}
              </p>
            </div>
          )}

          {/* Componente oficial de Google model-viewer anclado a Escala Real 1:1 */}
          <model-viewer
            ref={modelViewerRef}
            src={glbSrc}
            ios-src={iosSrc}
            ar
            ar-modes="webxr quick-look"
            ar-scale="fixed"
            scale={dish.scale || (dish.dishDiameterCm ? `${(dish.dishDiameterCm / 100).toFixed(3)} ${(dish.dishDiameterCm / 100).toFixed(3)} ${(dish.dishDiameterCm / 100).toFixed(3)}` : undefined)}
            camera-controls
            touch-action="pan-y"
            auto-rotate
            auto-rotate-delay="1000"
            rotation-per-second="20deg"
            shadow-intensity={dish.shadowIntensity || "1.2"}
            shadow-softness={dish.shadowSoftness || "0.7"}
            exposure="1.15"
            environment-image="neutral"
            poster={dish.imageUrl || ''}
            alt={`Modelo 3D de ${dish.name}`}
            onLoad={() => setIsLoading(false)}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Slot de aviso mientras carga en AR */}
            <div slot="ar-prompt" className="hidden" />
          </model-viewer>

          {/* Badge informativo de escala 1:1 métrica anclada */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs shadow-lg pointer-events-none font-outfit">
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.scale1to1}</span>
          </div>

          {/* Botón Inferior: Ver tamaño original del platillo */}
          <div className="absolute bottom-4 left-4 z-20">
            <button
              type="button"
              onClick={handleResetOriginalScale}
              className="px-3.5 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 active:scale-95 text-xs text-amber-400 font-bold border border-amber-500/40 backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all font-outfit"
              title={t.viewOriginalSizeTitle}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.viewOriginalSize}</span>
            </button>
          </div>

          {/* Indicador de Rotación 360 */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-slate-300 text-xs shadow-lg pointer-events-none font-outfit">
            <RotateCw className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">{t.pinchZoom}</span>
            <span className="sm:hidden">{t.rotate360}</span>
          </div>
        </div>

        {/* Notificación Frontal Amigable si el dispositivo no soporta cámara de Realidad Aumentada */}
        {showArFallbackNotice && (
          <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md p-5 rounded-3xl bg-slate-900 border-2 border-amber-500/70 shadow-2xl">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                  <span>{t.arNotAvailable}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArFallbackNotice(false)}
                  className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-white bg-slate-800 flex items-center justify-center transition-colors"
                  aria-label={t.closeArNotice}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t.arNoticeDesc}
                <strong className="text-amber-300 block mt-2 text-xs">
                  {t.arNoticeComfort}
                </strong>
              </p>

              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowArFallbackNotice(false)}
                  className="w-full py-2.5 px-4 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center"
                >
                  {t.understoodScreen}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Panel inferior con botón de proyección WebAR */}
        <div className="p-5 bg-slate-900 border-t border-slate-800/80 flex flex-col gap-3 z-10">
          
          {/* Botón directo de agregar al pedido desde WebAR */}
          {onAddToCart && dish.isAvailable !== false && (
            <button
              type="button"
              onClick={() => {
                onAddToCart(dish, 1, '');
                onClose();
              }}
              className="w-full py-3 px-4 min-h-[44px] rounded-2xl bg-slate-950 border border-amber-500/60 hover:border-amber-400 text-amber-400 hover:text-white font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Agregar al Pedido • ${dish.price} {dish.currency || 'MXN'}</span>
            </button>
          )}

          {/* Botón principal de Realidad Aumentada */}
          <button
            onClick={handleLaunchAR}
            style={{ backgroundColor: themeColor }}
            className="w-full py-3.5 px-6 min-h-[44px] rounded-2xl text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <Smartphone className="w-5 h-5 text-slate-950" />
            <span>{t.projectTable}</span>
          </button>

          {/* Explicación de zoom físico real */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong className="text-slate-300">{t.physicalZoomTitle}</strong> {t.physicalZoomDesc}
            </p>
          </div>

          {/* Alérgenos y descripción expandible */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
              <span className="text-xs font-semibold text-slate-400 mr-1">{t.allergens}</span>
              {dish.allergens.map((alg) => (
                <AllergenBadge key={alg} type={alg} size="sm" lang={lang} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

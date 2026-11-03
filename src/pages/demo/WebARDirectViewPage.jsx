import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Sparkles, Smartphone, RotateCw, ArrowLeft, CheckCircle2, ChevronRight, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const DEMO_DISHES = {
  avocado: {
    id: 'avocado',
    name: 'Aguacate Hass & Tartar',
    category: 'Especialidades',
    price: '$260 MXN',
    description: 'Medio aguacate madurado en punto óptimo con tartar de salmón fresco, flor de sal y brotes botánicos.',
    modelUrl: '/models/avocado.glb',
    realScale: 'Porción 1:1 escala real 12 cm',
    badge: 'Especialidad 100% AR'
  },
  grill: {
    id: 'grill',
    name: 'Corte a la Leña & Carbón Vivo',
    category: 'Cortes Finos',
    price: '$890 MXN',
    description: 'Corte sellado al fuego directo sobre carbón de encino al rojo vivo con mantequilla clarificada y sal en grano.',
    modelUrl: '/models/coals-grill-clean.glb',
    realScale: '30 cm de diámetro en asador',
    badge: 'Corte Prime'
  },
  olives: {
    id: 'olives',
    name: 'Tapas Mediterráneas de Autor',
    category: 'Cocina de Mercado',
    price: '$340 MXN',
    description: 'Selección de aceitunas maceradas en hierbas de olor, aceite de oliva virgen extra y plato cerámico artesanal.',
    modelUrl: '/models/olives-dish.glb',
    realScale: 'Plato individual 18 cm',
    badge: 'Entrada Fresca'
  }
};

export default function WebARDirectViewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dishKey = searchParams.get('dish') || 'avocado';
  const customModel = searchParams.get('model');
  const customName = searchParams.get('name');
  const customPrice = searchParams.get('price');

  const currentDish = DEMO_DISHES[dishKey] || (customModel ? {
    id: 'custom',
    name: customName || 'Platillo 3D',
    category: 'Especialidad',
    price: customPrice || '',
    description: 'Visualización volumétrica 1:1 en Realidad Aumentada sin descargar aplicaciones.',
    modelUrl: customModel,
    realScale: 'Escala 1:1 calibrada',
    badge: 'Volum-Menu 3D'
  } : DEMO_DISHES.avocado);

  const modelViewerRef = useRef(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [arError, setArError] = useState(false);

  useEffect(() => {
    // Dynamic import of model-viewer if not yet loaded in window
    if (!customElements.get('model-viewer')) {
      import('@google/model-viewer');
    }
  }, []);

  useEffect(() => {
    const el = modelViewerRef.current;
    if (!el) return;

    const handleLoad = () => setIsLoadingModel(false);
    const handleError = () => setIsLoadingModel(false);
    const handleArStatus = (event) => {
      if (event.detail.status === 'failed') {
        setArError(true);
      }
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    el.addEventListener('ar-status', handleArStatus);

    if (el.loaded) {
      setIsLoadingModel(false);
    }

    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      el.removeEventListener('ar-status', handleArStatus);
    };
  }, [currentDish.modelUrl]);

  const sceneViewerIntentUrl = useMemo(() => {
    return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
      currentDish.modelUrl
    )}&title=${encodeURIComponent(
      currentDish.name
    )}&mode=ar_preferred&resizable=false#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
  }, [currentDish.modelUrl, currentDish.name]);

  const handleLaunchAR = (e) => {
    if (e) e.preventDefault();
    setArError(false);
    if (modelViewerRef.current && typeof modelViewerRef.current.activateAR === 'function') {
      try {
        modelViewerRef.current.activateAR();
      } catch (err) {
        console.warn('Error en activateAR, recurriendo a intent:', err);
        window.location.href = sceneViewerIntentUrl;
      }
    } else {
      window.location.href = sceneViewerIntentUrl;
    }
  };

  const handleZoomIn = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    if (typeof mv.zoom === 'function') {
      mv.zoom(1);
    }
    try {
      const fov = mv.getFieldOfView ? mv.getFieldOfView() : 45;
      mv.fieldOfView = `${Math.max(12, fov - 8)}deg`;
    } catch (e) {}
  };

  const handleZoomOut = () => {
    const mv = modelViewerRef.current;
    if (!mv) return;
    if (typeof mv.zoom === 'function') {
      mv.zoom(-1);
    }
    try {
      const fov = mv.getFieldOfView ? mv.getFieldOfView() : 45;
      mv.fieldOfView = `${Math.min(80, fov + 8)}deg`;
    } catch (e) {}
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

  const handleSelectDish = (key) => {
    setIsLoadingModel(true);
    setArError(false);
    setSearchParams({ dish: key });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* Barra Superior Minimalista */}
      <header className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-20 sticky top-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Volum-Menu</span>
        </Link>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WebAR en Vivo</span>
        </div>
      </header>

      {/* Visor 3D Interactivo Full-Screen */}
      <main className="flex-1 relative flex items-center justify-center min-h-[50vh] sm:min-h-[55vh] bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        
        {/* Loading Spinner */}
        {isLoadingModel && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs text-center p-4">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-300">Cargando modelo 3D volumétrico...</p>
            <span className="text-[10px] text-slate-500 mt-1">Texturas PBR a escala real</span>
          </div>
        )}

        <model-viewer
          ref={modelViewerRef}
          key={currentDish.modelUrl}
          src={currentDish.modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="fixed"
          scale={currentDish.scale || undefined}
          ar-placement="floor"
          camera-controls
          touch-action="none"
          auto-rotate
          auto-rotate-delay="300"
          rotation-per-second="25deg"
          shadow-intensity="1.8"
          shadow-softness="0.5"
          exposure="1.15"
          onLoad={() => setIsLoadingModel(false)}
          onError={() => setIsLoadingModel(false)}
          style={{ width: '100%', height: '100%', minHeight: '380px' }}
        >
        </model-viewer>

        {/* Tip flotante de rotación 360 */}
        <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-300">
          <RotateCw className="w-3 h-3 text-amber-400" />
          <span>Gira con tu dedo en 360°</span>
        </div>

        {/* Escala métrica */}
        <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-amber-300">
          <Box className="w-3 h-3 text-amber-400" />
          <span>{currentDish.realScale}</span>
        </div>

        {/* Botón Inferior: Ver tamaño original del platillo */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            type="button"
            onClick={handleResetOriginalScale}
            className="px-3.5 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 active:scale-95 text-xs text-amber-400 font-bold border border-amber-500/40 backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
            title="Centrar y volver al tamaño 1:1 original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver tamaño original</span>
          </button>
        </div>

        {/* Botón Inferior: Ver tamaño original del platillo */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            type="button"
            onClick={handleResetOriginalScale}
            className="px-3.5 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 active:scale-95 text-xs text-amber-400 font-bold border border-amber-500/40 backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
            title="Centrar y volver al tamaño 1:1 calibrado"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver tamaño original</span>
          </button>
        </div>
      </main>

      {/* Ficha Inferior de Acción y Selector de Platillos */}
      <footer className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl z-20 space-y-4">
        
        {/* Selector Rápido de Platillos Demo */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(DEMO_DISHES).map(([key, dish]) => {
            const isSelected = dishKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectDish(key)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{dish.name.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Datos del Platillo Actual */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {currentDish.category}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {currentDish.badge}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
              {currentDish.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {currentDish.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg sm:text-xl font-black text-amber-400 block">
              {currentDish.price}
            </span>
            <span className="text-[10px] text-slate-400 block">Precio carta</span>
          </div>
        </div>

        {/* Indicador de ayuda para cámara AR */}
        <div className="text-center text-[11px] text-amber-400/90 font-medium flex items-center justify-center gap-1.5 bg-amber-500/10 py-1.5 px-3 rounded-xl border border-amber-500/20">
          <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Al tocar el botón se encenderá tu cámara para colocar el plato en tu mesa</span>
        </div>

        {/* BOTÓN PRINCIPAL: PROYECTAR EN MESA EN REALIDAD AUMENTADA VIA WEBXR */}
        <button
          type="button"
          onClick={handleLaunchAR}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer animate-pulse text-center"
        >
          <Smartphone className="w-5 h-5 text-slate-950 shrink-0" />
          <span>PROYECTAR EN MI MESA (AR 1:1)</span>
        </button>

        {/* Botón secundario alternativo: Google Scene Viewer Intent */}
        <div className="flex flex-col gap-2 pt-1">
          <a
            href={sceneViewerIntentUrl}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <span>Opción 2: Abrir con Google Scene Viewer</span>
          </a>

          {/* Consejo de resolución para el mensaje 'No se puede ver en tu espacio' */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 text-left">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>¿Aparece "No se puede ver en tu espacio"?</span>
            </div>
            <p className="leading-relaxed">
              1. Mueve tu celular lentamente apuntando hacia una mesa o suelo con luz para que los sensores detecten la superficie plana.<br />
              2. En Android, verifica en <em>Ajustes &gt; Aplicaciones &gt; Servicios de Google Play para RA &gt; Permisos</em> que la <strong>Cámara</strong> esté permitida.
            </p>
          </div>
        </div>

        {/* Enlace al Menú Completo */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
          <span>¿Quieres ver la carta completa del restaurante?</span>
          <Link
            to="/r/la-terraza?mesa=1&zona=Terraza"
            className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
          >
            <span>Ver Carta Demo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </footer>

    </div>
  );
}

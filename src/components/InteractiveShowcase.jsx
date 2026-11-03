import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Bell,
  Sliders,
  Utensils,
  Box,
  Sparkles,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  X,
  CreditCard,
  QrCode,
  Flame,
  Volume2,
  VolumeX,
  ArrowRight,
  Shield,
  Palette,
  Type,
  Layers,
  Gift,
  Music,
  Bot,
  RefreshCw,
  LayoutGrid,
  List,
  Film,
  Plus
} from 'lucide-react';
import PhoneSimulator from './PhoneSimulator';

// Paletas Gastronómicas de Autor Oficiales de Volum-Menu
const SHOWCASE_PALETTES = {
  'obsidiana-oro': {
    id: 'obsidiana-oro',
    name: 'Obsidiana & Oro Imperial',
    tag: 'Alta Cocina & Steakhouse',
    primary: '#EAB308',
    secondary: '#090D16',
    surface: '#020617',
    accent: '#F59E0B'
  },
  'borgona-roble': {
    id: 'borgona-roble',
    name: 'Borgoña & Roble Cava',
    tag: 'Enogourmet & Cortes Selectos',
    primary: '#BE123C',
    secondary: '#0C0A09',
    surface: '#1C1917',
    accent: '#FB7185'
  },
  'esmeralda-bronce': {
    id: 'esmeralda-bronce',
    name: 'Esmeralda & Bronce Botánico',
    tag: 'Terraza, Frescura & Mixología',
    primary: '#059669',
    secondary: '#06120D',
    surface: '#021811',
    accent: '#34D399'
  },
  'zafiro-noir': {
    id: 'zafiro-noir',
    name: 'Zafiro & Mármol Noir',
    tag: 'Marisquería & Barra Fría',
    primary: '#2563EB',
    secondary: '#080C14',
    surface: '#0F172A',
    accent: '#38BDF8'
  },
  'brasa-carbon': {
    id: 'brasa-carbon',
    name: 'Brasa & Carbón Steakhouse',
    tag: 'Parrilla, Fuego & Asador',
    primary: '#E11D48',
    secondary: '#0F0F10',
    surface: '#18181B',
    accent: '#F97316'
  },
  'terra-canela': {
    id: 'terra-canela',
    name: 'Terra & Canela Bistro',
    tag: 'Bistro Rústico & Repostería',
    primary: '#D97706',
    secondary: '#120E0A',
    surface: '#1E1712',
    accent: '#FBBF24'
  }
};

// Familias Tipográficas Gastronómicas de Autor
const GASTRONOMIC_FONTS = [
  { id: 'sans', name: 'Inter / Sans Clásico', tag: 'Moderno y Ultra-Legible' },
  { id: 'playfair', name: 'Playfair Display (Serif)', tag: 'Alta Cocina & Fine Dining' },
  { id: 'lora', name: 'Lora Editorial', tag: 'Bistro Contemporáneo & Cava' },
  { id: 'outfit', name: 'Outfit Bold', tag: 'Street Gourmet & Smokehouse' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', tag: 'Minimal & Barra Fría' }
];

// Texturas y Acabados de Superficie
const SURFACE_TEXTURES = [
  { id: 'none', label: 'Liso Puro', desc: 'Color plano minimalista' },
  { id: 'grain', label: 'Grano Analógico', desc: 'Textura orgánica papel' },
  { id: 'slate', label: 'Pizarra Ahumada', desc: 'Atmósfera asadores' },
  { id: 'marble', label: 'Mármol Sutil', desc: 'Lujo discreto' }
];

// Geometría de Tarjetas de Platillo
const CARD_GEOMETRIES = [
  { id: 'rounded', label: 'Curva Pill iOS', desc: 'Bordes redondeados contemporáneos' },
  { id: 'subtle', label: 'Bistro Suave', desc: 'Esquinas redondeadas equilibradas' },
  { id: 'sharp', label: 'Luxury Recto', desc: 'Líneas rectas y afiladas' }
];

// Modos de Vista Predeterminados
const VIEW_MODES = [
  { id: 'grid', label: 'Cuadrícula 2 Columnas', icon: LayoutGrid, desc: 'Visual con fotos grandes' },
  { id: 'compact', label: 'Lista Bistro Compacta', icon: List, desc: 'Lectura rápida de sala' },
  { id: 'feed', label: 'Feed Reels', icon: Film, desc: 'Stories inmersivas' }
];

// Presets de Banner Promocional
const BANNER_PRESETS = [
  {
    id: 'happy_hour',
    label: 'Horario Feliz 2x1',
    text: 'Bebidas 2x1 en Terraza (Horario Feliz 18h a 20h)',
    badgeText: 'HAPPY HOUR',
    icon: 'flame'
  },
  {
    id: 'chef_special',
    label: 'Especial del Chef',
    text: 'Corte Insignia del Chef: Wagyu A5 con Maridaje',
    badgeText: 'ESPECIAL',
    icon: 'sparkles'
  },
  {
    id: 'live_music',
    label: 'Noche de Música',
    text: 'Jueves de Música en Vivo & Jazz Session',
    badgeText: 'EVENTO',
    icon: 'music'
  },
  {
    id: 'courtesy_dessert',
    label: 'Cortesía de la Casa',
    text: 'Postre de Autor de Cortesía en Cuentas Mayores a $800',
    badgeText: 'CORTESÍA',
    icon: 'gift'
  }
];

// Categorías del Menú de La Terraza (Restaurante Beta)
const LA_TERRAZA_CATEGORIES = [
  { id: 'cat-3d', name: '⭐ Especialidades 3D' },
  { id: 'cortes', name: 'Cortes & Parrilla' },
  { id: 'bebidas', name: 'Bebidas & Coctelería' },
  { id: 'postres', name: 'Postres de Autor' }
];

// Platillos Oficiales de La Terraza (Restaurante Beta / Demo)
const LA_TERRAZA_DISHES = [
  {
    id: 'dish-wagyu',
    name: 'Burger Wagyu Suprema & Trufa Negra',
    description: '220g de carne Wagyu A5 a la parrilla de carbón, queso cheddar añejo fundido, cebolla caramelizada al oporto y mayonesa de trufa negra en pan brioche artesanal.',
    price: 365,
    currency: 'MXN',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    is3D: true,
    categoryId: 'cat-3d',
    isAvailable: true
  },
  {
    id: 'dish-coulant',
    name: 'Tarta Coulant de Chocolate Belga 70%',
    description: 'Pastel tibio de chocolate amargo con centro líquido fluyente, tierra de avellanas tostadas y quenelle de helado artesanal de vainilla bourbon.',
    price: 210,
    currency: 'MXN',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    is3D: true,
    categoryId: 'postres',
    isAvailable: true
  },
  {
    id: 'dish-nogada',
    name: 'Chile en Nogada Tradicional de Temporada',
    description: 'Platillo histórico poblano: chile poblano relleno de picadillo agridulce con frutas y piñón rosa, bañado en nogada fresca de nuez de Castilla y granada.',
    price: 430,
    currency: 'MXN',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    is3D: true,
    categoryId: 'cat-3d',
    isAvailable: true
  },
  {
    id: 'dish-ribeye',
    name: 'Ribeye Prime Cut 400g a las Brasas',
    description: 'Corte grueso de alta jugosidad sellado en horno Josper a 400°C con mantequilla clarificada de hierbas finas y papas cambray rústicas.',
    price: 690,
    currency: 'MXN',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    is3D: false,
    categoryId: 'cortes',
    isAvailable: true
  },
  {
    id: 'dish-mezcalita',
    name: 'Mezcalita de Maracuyá y Cardamomo',
    description: 'Mezcal espadín artesanal oaxaqueño, pulpa natural de maracuyá, infusión de cardamomo y escarchado de sal de gusano con chile piquín.',
    price: 195,
    currency: 'MXN',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    is3D: false,
    categoryId: 'bebidas',
    isAvailable: true
  },
  {
    id: 'dish-agua',
    name: 'Agua Mineral de Manantial (600ml)',
    description: 'Agua mineralizada con gas servida en vaso con rodaja de limón Eureka.',
    price: 55,
    currency: 'MXN',
    imageUrl: null,
    is3D: false,
    categoryId: 'bebidas',
    isAvailable: true
  },
  {
    id: 'dish-refresco',
    name: 'Refresco Clásico de Cola (355ml)',
    description: 'Servido con hielo y rodaja de limón Eureka.',
    price: 50,
    currency: 'MXN',
    imageUrl: null,
    is3D: false,
    categoryId: 'bebidas',
    isAvailable: true
  }
];

export default function InteractiveShowcase({ activeBrandPalette }) {
  // Rol activo: 'diner' (comensal) | 'waiter' (mesero) | 'manager' (dueño)
  const [activeRole, setActiveRole] = useState('manager');

  // Estados de Personalización del Dueño / Gerente
  const [currentPaletteKey, setCurrentPaletteKey] = useState('obsidiana-oro');
  const palette = SHOWCASE_PALETTES[currentPaletteKey] || SHOWCASE_PALETTES['obsidiana-oro'];
  const [currentFont, setCurrentFont] = useState('sans');
  const [currentTexture, setCurrentTexture] = useState('none');
  const [currentCardRadius, setCurrentCardRadius] = useState('rounded');
  const [defaultViewMode, setDefaultViewMode] = useState('grid');

  // Servicios en mesa y Asistencia
  const [enableTableAssistance, setEnableTableAssistance] = useState(true);
  const [enableAiAssistant, setEnableAiAssistant] = useState(true);

  // Banner Promocional
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerPresetId, setBannerPresetId] = useState('happy_hour');
  const selectedBannerPreset = BANNER_PRESETS.find((p) => p.id === bannerPresetId) || BANNER_PRESETS[0];

  // Control de Platillos del Catálogo
  const [dishes, setDishes] = useState(LA_TERRAZA_DISHES);

  // Sincronizar automáticamente con la paleta de autor si se recibe activeBrandPalette
  useEffect(() => {
    if (!activeBrandPalette?.id) return;
    if (activeBrandPalette.id === 'nordic') {
      setCurrentPaletteKey('terra-canela');
      setCurrentFont('playfair');
    } else if (activeBrandPalette.id === 'neobrutalism') {
      setCurrentPaletteKey('brasa-carbon');
      setCurrentFont('jakarta');
    } else if (activeBrandPalette.id === 'obsidian') {
      setCurrentPaletteKey('obsidiana-oro');
      setCurrentFont('playfair');
    }
  }, [activeBrandPalette?.id]);

  const isLight = activeBrandPalette?.isLight || false;
  const isObsidian = activeBrandPalette?.id === 'obsidian';

  // Tokens dinámicos de sección según la paleta activa
  const sectionBgClass = isLight ? 'bg-[#F8F6F0]' : isObsidian ? 'bg-[#121113]' : 'bg-[#050505]';
  const sectionBorderClass = isLight ? 'border-[#191919]/10' : isObsidian ? 'border-[#C87A51]/20' : 'border-[#222222]';
  const headingFontClass = isLight ? 'font-playfair font-serif' : isObsidian ? 'font-playfair font-serif' : 'font-jakarta font-sans';
  const textPrimaryClass = isLight ? 'text-[#191919]' : isObsidian ? 'text-[#F0ECE1]' : 'text-white';
  const textMutedClass = isLight ? 'text-[#666666]' : isObsidian ? 'text-[#9E9B93]' : 'text-[#888888]';
  const badgeClass = isLight
    ? 'bg-[#2D4030]/10 border border-[#2D4030]/25 text-[#2D4030]'
    : isObsidian
    ? 'bg-[#C87A51]/15 border border-[#C87A51]/40 text-[#E8A87C]'
    : 'bg-orange-500/10 border border-orange-500/30 text-orange-400';
  const primaryAccentHex = activeBrandPalette?.primaryHex || (isLight ? '#2D4030' : isObsidian ? '#C87A51' : '#FF4D00');

  // Clases de tarjetas para el panel del Gerente y controles
  const cardBgClass = isLight
    ? 'bg-white border border-[#191919]/10 text-[#191919] shadow-sm'
    : isObsidian
    ? 'bg-[#1C1A1E] border border-[#C87A51]/25 text-[#F0ECE1] shadow-2xl'
    : 'bg-[#111111] border border-[#222222] text-white shadow-2xl';

  const cardSubtleClass = isLight
    ? 'bg-[#F8F6F0] border border-[#191919]/10 text-[#191919]'
    : isObsidian
    ? 'bg-[#141216] border border-[#C87A51]/20 text-[#F0ECE1]'
    : 'bg-[#0a0a0a] border border-[#222222] text-white';

  const itemSelectedClass = isLight
    ? 'bg-[#F1EFEA] border-[#2D4030] shadow-sm ring-1 ring-[#2D4030]'
    : isObsidian
    ? 'bg-[#141216] border-[#C87A51] shadow-md ring-1 ring-[#C87A51]'
    : 'bg-slate-950 border-amber-500 shadow-md ring-1 ring-amber-500/40';

  const itemUnselectedClass = isLight
    ? 'bg-white border-[#191919]/10 hover:border-[#191919]/25 hover:bg-[#FAF8F3] text-[#191919]'
    : isObsidian
    ? 'bg-[#141216]/60 border-[#C87A51]/20 hover:border-[#C87A51]/40 text-[#F0ECE1]'
    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-white';

  const dividerClass = isLight ? 'border-[#191919]/10' : isObsidian ? 'border-[#C87A51]/20' : 'border-slate-800';

  // Solicitudes activas en tiempo real (Sincronización Comensal <-> Mesero)
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 'req-init',
      table: '2',
      zone: 'Terraza',
      type: 'bill_card',
      label: 'Pedir la Cuenta (Terminal Bancaria)',
      createdAt: Date.now() - 45000,
      status: 'pending'
    }
  ]);

  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [dinerToast, setDinerToast] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Temporizador para cronómetro en tiempo real
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Campanilla de servicio doble ding-dong sintetizada con Web Audio API
  const playServiceChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Ding (A5 880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Dong (E5 659.25Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.22);
      gain2.gain.setValueAtTime(0.26, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 1.2);
    } catch {
      // Ignorar restricciones de audio del navegador
    }
  };

  // Comensal pulsa "Llamar Mesero"
  const handleDinerCallWaiter = () => {
    const newReq = {
      id: `req-${Date.now()}`,
      table: '1',
      zone: 'Terraza Principal',
      type: 'waiter',
      label: 'Llamada de Mesero a Mesa',
      createdAt: Date.now(),
      status: 'pending'
    };

    setServiceRequests((prev) => [newReq, ...prev.filter((r) => r.table !== '1')]);
    setHasNewAlert(true);
    playServiceChime();

    setDinerToast('Llamada enviada a la estación de meseros (Mesa 1 • Terraza). Revisa la pestaña "Mesero" arriba.');
    setTimeout(() => setDinerToast(null), 5000);
  };

  // Mesero marca atendido
  const handleResolveRequest = (id) => {
    setServiceRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const formatElapsedTime = (timestamp) => {
    const secs = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    return `${mins}m ${secs % 60}s`;
  };

  // Objeto de restaurante para alimentar a PhoneSimulator de forma 100% reactiva
  const simulatorRestaurant = {
    name: 'Restaurante Gourmet La Terraza 3D',
    description: 'Experiencia gastronómica contemporánea de autor con maridaje y proyección en Realidad Aumentada 1:1.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    theme: {
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      surfaceColor: palette.surface,
      fontFamily: currentFont,
      texture: currentTexture,
      cardRadius: currentCardRadius
    },
    settings: {
      defaultViewMode: defaultViewMode,
      enableTableAssistance: enableTableAssistance,
      aiAssistant: { enabled: enableAiAssistant },
      announcementBanner: {
        enabled: bannerEnabled,
        text: selectedBannerPreset.text,
        icon: selectedBannerPreset.icon,
        badgeText: selectedBannerPreset.badgeText
      }
    },
    subscription: {
      plan: 'experience_3d'
    }
  };

  const availableDishesCount = dishes.filter((d) => d.isAvailable).length;

  return (
    <section id="demo" className={`py-20 px-3 sm:px-6 lg:px-8 ${sectionBgClass} border-y ${sectionBorderClass} relative transition-colors duration-300`}>
      
      {/* Resplandor ambiental de fondo dinámico encapsulado para permitir sticky sin clipping */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[450px] rounded-full blur-[170px] opacity-20 transition-all duration-700"
          style={{ backgroundColor: palette.primary }}
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* ENCABEZADO DE LA SECCIÓN (Texto Exacto del Compañero en Vercel) */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${badgeClass} text-xs font-bold uppercase tracking-wider font-outfit`}>
            <Box className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
            <span>SIMULADOR INTERACTIVO EN TIEMPO REAL</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black ${textPrimaryClass} tracking-tight leading-tight ${headingFontClass}`}>
            Pruébalo en vivo: Lo que tú configuras, el comensal lo ve al instante
          </h2>

          <p className={`text-xs sm:text-sm ${textMutedClass} leading-relaxed font-outfit max-w-2xl mx-auto`}>
            Interactúa con el simulador: cambia el color, activa un banner promocional o pon un platillo agotado. El comensal lo verá reflejado en tiempo real en la pantalla de la derecha.
          </p>
        </div>

        {/* SELECTOR DE PERSPECTIVA (COMENSAL / MESERO / DUEÑO) */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl ${cardBgClass} backdrop-blur-md`}>
          
          <div className={`grid grid-cols-3 w-full sm:w-auto gap-1.5 p-1 rounded-xl ${cardSubtleClass}`}>
            
            {/* 1. Comensal */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('diner');
                setHasNewAlert(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'diner'
                  ? isLight
                    ? 'bg-[#2D4030] text-white font-black shadow-md'
                    : isObsidian
                    ? 'bg-gradient-to-r from-[#C87A51] to-[#E8A87C] text-[#121113] font-black shadow-md'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md'
                  : `${textMutedClass} hover:${textPrimaryClass}`
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Comensal</span>
            </button>

            {/* 2. Mesero */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('waiter');
                setHasNewAlert(false);
              }}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'waiter'
                  ? isLight
                    ? 'bg-[#2D4030] text-white font-black shadow-md'
                    : isObsidian
                    ? 'bg-gradient-to-r from-[#C87A51] to-[#E8A87C] text-[#121113] font-black shadow-md'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md'
                  : `${textMutedClass} hover:${textPrimaryClass}`
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Mesero</span>

              {serviceRequests.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  hasNewAlert
                    ? 'bg-rose-500 text-white animate-bounce shadow-md shadow-rose-500/50'
                    : 'bg-amber-500/30 text-amber-300'
                }`}>
                  {serviceRequests.length}
                </span>
              )}
            </button>

            {/* 3. Dueño / Gerente */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('manager');
                setHasNewAlert(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'manager'
                  ? isLight
                    ? 'bg-[#2D4030] text-white font-black shadow-md'
                    : isObsidian
                    ? 'bg-gradient-to-r from-[#C87A51] to-[#E8A87C] text-[#121113] font-black shadow-md'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md'
                  : `${textMutedClass} hover:${textPrimaryClass}`
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Dueño / Gerente</span>
            </button>

          </div>

          {/* Control de Audio Chime */}
          <div className={`flex items-center gap-3 text-xs ${textMutedClass} w-full sm:w-auto justify-between sm:justify-end px-2`}>
            <span className="text-[11px] hidden md:inline">
              {activeRole === 'diner' && 'Pulsa "Llamar Mesero" abajo para probar la llamada en sala'}
              {activeRole === 'waiter' && 'Consola táctil con campanilla sonora en tiempo real'}
              {activeRole === 'manager' && 'Ajusta colores, fuentes, banners y platillos en vivo'}
            </span>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg ${cardSubtleClass} ${textMutedClass} hover:${textPrimaryClass} transition-colors flex items-center gap-1.5`}
              title={isMuted ? 'Activar sonido de campana' : 'Silenciar sonido'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />}
              <span className="text-[10px] font-mono">{isMuted ? 'Mudo' : 'Audio ON'}</span>
            </button>
          </div>

        </div>

        {/* =============================================================== */}
        {/* VISTA 1: EL COMENSAL (FOCALIZADO 1:1 CON EL MENÚ BETA)         */}
        {/* =============================================================== */}
        {activeRole === 'diner' && (
          <div className="flex flex-col items-center animate-fadeIn">
            
            {/* Contenedor Superior (Exacto al diseño de la referencia visual) */}
            <div className="relative w-full max-w-[420px] p-4 sm:p-5 rounded-[40px] bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-sm">
              
              {/* Barra de Título y Estado del Simulador */}
              <div className="flex items-center justify-between mb-3 px-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulador en Tiempo Real</span>
                </span>
                
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sincronizado 1:1</span>
                </span>
              </div>

              {/* Toast de Alerta al pulsar Llamar Mesero */}
              {dinerToast && (
                <div className="mb-3 p-3 rounded-2xl bg-slate-900 border border-amber-500/60 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-scaleUp">
                  <Bell className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                  <span className="flex-1 leading-tight">{dinerToast}</span>
                </div>
              )}

              {/* Componente PhoneSimulator Oficial con datos de La Terraza */}
              <PhoneSimulator
                restaurant={simulatorRestaurant}
                dishes={dishes.filter((d) => d.isAvailable)}
                categories={LA_TERRAZA_CATEGORIES}
                onCallWaiter={handleDinerCallWaiter}
              />

            </div>

          </div>
        )}

        {/* =============================================================== */}
        {/* VISTA 2: EL MESERO (CONSOLA DE SERVICIO EN SALA & BARRA)        */}
        {/* =============================================================== */}
        {activeRole === 'waiter' && (
          <div className="animate-fadeIn max-w-4xl mx-auto space-y-4">
            
            <div className="rounded-[36px] bg-slate-900 border-2 border-slate-800 p-5 sm:p-7 shadow-2xl space-y-5">
              
              {/* Barra Superior de la Consola */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                    <Bell className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${textPrimaryClass} flex items-center gap-2`}>
                      <span>Estación de Meseros & Barra</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Consola en Vivo
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pantalla táctil de barra o celular del personal con campanilla audible en tiempo real.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const tables = ['1', '3', '7', '12'];
                    const randomTable = tables[Math.floor(Math.random() * tables.length)];
                    const simReq = {
                      id: `req-${Date.now()}`,
                      table: randomTable,
                      zone: 'Terraza Principal',
                      type: 'waiter',
                      label: 'Llamada de Mesero a Mesa',
                      createdAt: Date.now(),
                      status: 'pending'
                    };
                    setServiceRequests((prev) => [simReq, ...prev.filter((r) => r.table !== randomTable)]);
                    playServiceChime();
                  }}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-all shadow flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simular Otra Mesa</span>
                </button>
              </div>

              {/* Tarjetas de Solicitudes de Mesa */}
              {serviceRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {serviceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-3 shadow-lg flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-sm">
                            M{req.table}
                          </div>
                          <div>
                            <span className="text-xs font-black text-white block">Mesa {req.table}</span>
                            <span className="text-[10px] text-slate-400 block">{req.zone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          <span>{formatElapsedTime(req.createdAt)}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Solicitud:</span>
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          {req.type === 'waiter' ? (
                            <>
                              <Bell className="w-3.5 h-3.5 text-amber-400" />
                              <span>{req.label}</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{req.label}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleResolveRequest(req.id)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Marcar Atendido (Liberar)</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Todas las mesas atendidas</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Ve a la <strong>"Vista Comensal"</strong> y pulsa <strong>"Llamar Mesero"</strong> para ver cómo aparece inmediatamente una nueva tarjeta aquí con campanilla audible.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Acceso protegido con código PIN de 4 dígitos para tu personal de servicio.</span>
              </div>

            </div>

          </div>
        )}

        {/* =============================================================== */}
        {/* VISTA 3: EL DUEÑO / GERENTE (PANEL CON PREVIEW EN VIVO)        */}
        {/* =============================================================== */}
        {activeRole === 'manager' && (
          <div className="animate-fadeIn max-w-7xl mx-auto space-y-6">
            
            {/* Cabecera del Panel de Control */}
            <div className={`p-5 rounded-3xl ${cardBgClass} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base text-slate-950 shadow-md transition-colors"
                  style={{ backgroundColor: palette.primary }}
                >
                  V
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Panel de Control • Modo Demostración</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      En Vivo
                    </span>
                  </h3>
                  <p className={`text-xs ${textMutedClass}`}>
                    Modifica cualquier opción a continuación y observa el teléfono sincronizarse al instante sin alterar la base de datos.
                  </p>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-xl ${cardSubtleClass} text-[11px] ${textMutedClass} flex items-center gap-1.5 self-start sm:self-auto`}>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sandbox Seguro (0% Modificaciones en R2)</span>
              </div>
            </div>

            {/* Layout en 2 Columnas: Cockpit a la Izquierda + Teléfono Sticky a la Derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              
              {/* COLUMNA IZQUIERDA: OPCIONES DE MODIFICACIÓN DEL GERENTE */}
              <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                
                {/* 1. Atmósfera y Paleta de Color Gastronómica */}
                <div className={`p-5 rounded-3xl ${cardBgClass} space-y-4`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${dividerClass}`}>
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Atmósfera Visual & Paleta de Autor</h4>
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono font-bold">
                      {palette.name}
                    </span>
                  </div>

                  <p className={`text-xs ${textMutedClass}`}>
                    Selecciona una paleta de color para vestir instantáneamente la carta del comensal:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(SHOWCASE_PALETTES).map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setCurrentPaletteKey(pal.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          currentPaletteKey === pal.id ? itemSelectedClass : itemUnselectedClass
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-6 h-6 rounded-full border border-white/20 shadow-sm shrink-0"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <div className="truncate">
                            <span className={`text-xs font-bold ${textPrimaryClass} block truncate`}>{pal.name}</span>
                            <span className={`text-[10px] ${textMutedClass} block truncate`}>{pal.tag}</span>
                          </div>
                        </div>

                        {currentPaletteKey === pal.id && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Tipografía Gastronómica de Autor */}
                <div className={`p-5 rounded-3xl ${cardBgClass} space-y-4`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${dividerClass}`}>
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Tipografía Gastronómica</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Fuente activa: <strong className="text-white">{currentFont}</strong>
                    </span>
                  </div>

                  <p className={`text-xs ${textMutedClass}`}>
                    Define la personalidad del menú según el estilo de tu cocina:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {GASTRONOMIC_FONTS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setCurrentFont(font.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          currentFont === font.id ? itemSelectedClass : itemUnselectedClass
                        }`}
                      >
                        <div className="truncate">
                          <span className={`text-xs font-bold ${textPrimaryClass} block truncate`}>{font.name}</span>
                          <span className={`text-[10px] ${textMutedClass} block truncate`}>{font.tag}</span>
                        </div>
                        {currentFont === font.id && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Textura de Fondo y Geometría de Tarjetas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Textura */}
                  <div className={`p-4 rounded-3xl ${cardBgClass} space-y-3`}>
                    <div className={`flex items-center gap-2 pb-1.5 border-b ${dividerClass}`}>
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Textura de Fondo</h4>
                    </div>
                    <div className="space-y-1.5">
                      {SURFACE_TEXTURES.map((tex) => (
                        <button
                          key={tex.id}
                          type="button"
                          onClick={() => setCurrentTexture(tex.id)}
                          className={`w-full p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            currentTexture === tex.id ? itemSelectedClass : itemUnselectedClass
                          }`}
                        >
                          <div>
                            <span className="block">{tex.label}</span>
                            <span className="text-[10px] text-slate-500">{tex.desc}</span>
                          </div>
                          {currentTexture === tex.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Geometría de Tarjetas */}
                  <div className={`p-4 rounded-3xl ${cardBgClass} space-y-3`}>
                    <div className={`flex items-center gap-2 pb-1.5 border-b ${dividerClass}`}>
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Geometría de Tarjetas</h4>
                    </div>
                    <div className="space-y-1.5">
                      {CARD_GEOMETRIES.map((geom) => (
                        <button
                          key={geom.id}
                          type="button"
                          onClick={() => setCurrentCardRadius(geom.id)}
                          className={`w-full p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            currentCardRadius === geom.id ? itemSelectedClass : itemUnselectedClass
                          }`}
                        >
                          <div>
                            <span className="block">{geom.label}</span>
                            <span className="text-[10px] text-slate-500">{geom.desc}</span>
                          </div>
                          {currentCardRadius === geom.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 4. Modo de Vista Predeterminado del Menú */}
                <div className={`p-5 rounded-3xl ${cardBgClass} space-y-3`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${dividerClass}`}>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Modo de Vista Predeterminado</h4>
                    </div>
                    <span className="text-[11px] text-slate-400">Cómo abre la carta al escanear QR</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {VIEW_MODES.map((mode) => {
                      const IconComp = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setDefaultViewMode(mode.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                            defaultViewMode === mode.id ? itemSelectedClass : itemUnselectedClass
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <IconComp className={`w-4 h-4 ${defaultViewMode === mode.id ? 'text-amber-400' : 'text-slate-400'}`} />
                            {defaultViewMode === mode.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold ${textPrimaryClass} block`}>{mode.label}</span>
                            <span className={`text-[10px] ${textMutedClass} block`}>{mode.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Banner de Anuncios Promocionales */}
                <div className={`p-5 rounded-3xl ${cardBgClass} space-y-4`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${dividerClass}`}>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Banner de Promociones / Novedades</h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBannerEnabled(!bannerEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                        bannerEnabled ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-slate-950 shadow transform transition-transform ${
                          bannerEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className={`text-xs ${textMutedClass}`}>
                    Comunica promociones, maridajes o eventos en la parte superior del menú móvil:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {BANNER_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        disabled={!bannerEnabled}
                        onClick={() => setBannerPresetId(preset.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                          !bannerEnabled
                            ? 'opacity-40 cursor-not-allowed bg-slate-950/20 border-slate-800'
                            : bannerPresetId === preset.id
                            ? itemSelectedClass
                            : itemUnselectedClass
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300">
                            {preset.badgeText}
                          </span>
                          {bannerPresetId === preset.id && bannerEnabled && (
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <span className={`text-xs font-bold ${textPrimaryClass} line-clamp-1`}>{preset.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Servicios y Asistencia Digital en Mesa */}
                <div className={`p-5 rounded-3xl ${cardBgClass} space-y-4`}>
                  <div className={`flex items-center gap-2 pb-2 border-b ${dividerClass}`}>
                    <Bot className="w-4 h-4 text-amber-400" />
                    <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Servicios & Asistencia Digital</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Botón Llamar Mesero */}
                    <div className={`p-3.5 rounded-2xl ${cardSubtleClass} flex items-center justify-between gap-3`}>
                      <div>
                        <span className={`text-xs font-bold ${textPrimaryClass} block`}>Botón "Llamar Mesero"</span>
                        <span className={`text-[10px] ${textMutedClass} block`}>Barra fija inferior en mesa</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnableTableAssistance(!enableTableAssistance)}
                        className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                          enableTableAssistance ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-slate-950 shadow transform transition-transform ${
                            enableTableAssistance ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Botón Asistente IA */}
                    <div className={`p-3.5 rounded-2xl ${cardSubtleClass} flex items-center justify-between gap-3`}>
                      <div>
                        <span className={`text-xs font-bold ${textPrimaryClass} block`}>Asistente Sommelier IA</span>
                        <span className={`text-[10px] ${textMutedClass} block`}>Botón flotante con recomendaciones</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnableAiAssistant(!enableAiAssistant)}
                        className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                          enableAiAssistant ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-slate-950 shadow transform transition-transform ${
                            enableAiAssistant ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                  </div>
                </div>

                {/* 7. Catálogo de Platillos en Vivo (La Terraza Beta) */}
                <div className={`p-5 rounded-3xl ${cardBgClass} space-y-4`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b ${dividerClass}`}>
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-amber-400" />
                      <h4 className={`text-xs font-bold ${textPrimaryClass} uppercase tracking-wider`}>Control de Platillos en Vivo</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">
                        {availableDishesCount} de {dishes.length} activos
                      </span>
                      <button
                        type="button"
                        onClick={() => setDishes((prev) => prev.map((d) => ({ ...d, isAvailable: true })))}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                      >
                        Activar Todos
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs ${textMutedClass}`}>
                    Pausa o reactiva platillos en 1 clic. El cambio se refleja en la carta del comensal sin reimpresión:
                  </p>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    {dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          dish.isAvailable
                            ? isLight
                              ? 'bg-[#FBF9F5] border-[#191919]/10'
                              : isObsidian
                              ? 'bg-[#141216] border-[#C87A51]/20'
                              : 'bg-slate-950 border-slate-800/80'
                            : isLight
                            ? 'bg-[#F1EFEA]/60 border-[#191919]/5 opacity-60'
                            : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {dish.imageUrl ? (
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                              <Utensils className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${textPrimaryClass} truncate block`}>{dish.name}</span>
                              {dish.is3D && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-amber-500/20 text-amber-300 shrink-0">
                                  3D AR
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-amber-400 font-mono">
                              ${dish.price} {dish.currency}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold hidden sm:inline ${dish.isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {dish.isAvailable ? 'Disponible' : 'Agotado'}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setDishes((prev) =>
                                prev.map((d) => (d.id === dish.id ? { ...d, isAvailable: !d.isAvailable } : d))
                              );
                            }}
                            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                              dish.isAvailable ? 'bg-emerald-500' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-slate-950 shadow transform transition-transform ${
                                dish.isAvailable ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-3 rounded-2xl ${cardSubtleClass} text-[11px] ${textMutedClass} flex items-center gap-2`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sincronización instantánea en vivo con WebSockets y Server-Sent Events en producción.</span>
                  </div>
                </div>

                {/* Llamado a la Acción para Contratar */}
                <div className={`p-5 rounded-3xl ${isLight ? 'bg-white border border-[#2D4030]/20' : isObsidian ? 'bg-[#1C1A1E] border border-[#C87A51]/30' : 'bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <div>
                    <h5 className={`text-xs font-bold ${textPrimaryClass}`}>¿Listo para transformar la experiencia de tu restaurante?</h5>
                    <p className={`text-[11px] ${textMutedClass} mt-0.5`}>
                      Digitaliza tu carta con Realidad Aumentada 1:1, terminal de meseros y panel administrativo completo.
                    </p>
                  </div>

                  <a
                    href="#precios"
                    className={`py-2.5 px-5 rounded-xl ${isLight ? 'bg-[#2D4030] hover:bg-[#1f2d22] text-white' : isObsidian ? 'bg-[#C87A51] hover:bg-[#b0653f] text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'} font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0`}
                  >
                    <span>Ver Planes y Precios</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

              {/* COLUMNA DERECHA: TELÉFONO EN TIEMPO REAL (STICKY QUE ACOMPAÑA EL SCROLL) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24 self-start order-1 lg:order-2">
                <div className={`w-full max-w-[420px] p-4 sm:p-5 rounded-[40px] ${cardBgClass} backdrop-blur-sm`}>
                  
                  <div className="flex items-center justify-between mb-3 px-3">
                    <span className={`text-xs font-bold ${textPrimaryClass} flex items-center gap-1.5`}>
                      <Smartphone className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                      <span>Carta del Comensal en Vivo</span>
                    </span>
                    
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Sincronizado 0s</span>
                    </span>
                  </div>

                  {/* PhoneSimulator que reacciona a todos los cambios del Dueño */}
                  <PhoneSimulator
                    restaurant={simulatorRestaurant}
                    dishes={dishes.filter((d) => d.isAvailable)}
                    categories={LA_TERRAZA_CATEGORIES}
                    onCallWaiter={handleDinerCallWaiter}
                  />

                </div>

                <p className={`text-[11px] ${textMutedClass} text-center mt-3 max-w-xs`}>
                  Cada cambio de color, tipografía, banner o platillo a la izquierda se refleja de inmediato en esta vista.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}

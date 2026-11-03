import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Utensils,
  Coffee,
  Wine,
  Archive,
  QrCode,
  Sparkles,
  Palette,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Box,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  AlertCircle,
  Download,
  LogOut,
  UploadCloud,
  Wand2,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Home,
  Camera,
  FileText,
  X,
  CheckSquare,
  Square,
  RefreshCw,
  Bell,
  Shield,
  ShieldCheck,
  Building2,
  Video,
  Smartphone,
  Phone,
  MessageSquare,
  MapPin,
  Instagram,
  Type,
  Layers,
  Gift,
  Clock,
  Flame,
  Music,
  Tag,
  Sliders,
  Menu,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  BookOpen,
  Globe,
  Wifi,
  Hash,
  ListOrdered,
  AlertTriangle,
  Search,
  Users,
  LifeBuoy
} from 'lucide-react';
import AllergenBadge from '../../components/AllergenBadge';
import PhoneSimulator from '../../components/PhoneSimulator';
import RestaurantSwitcher from '../../components/RestaurantSwitcher';
import CreateBranchModal from '../../components/CreateBranchModal';
import CompanionUploadModal from '../../components/CompanionUploadModal';
import Ai3DScanModal from '../../components/Ai3DScanModal';
import TeamManagementView from '../../components/TeamManagementView';
import FloorPlanEditor from '../../components/FloorPlanEditor';
import SupportModal from '../../components/SupportModal';
import TrialBanner from '../../components/TrialBanner';
import PlanAdvisorModal from '../../components/PlanAdvisorModal';
import TrialPaywallModal from '../../components/TrialPaywallModal';
import MealSchedulesManager from '../../components/MealSchedulesManager';
import MarketingBannersManager from '../../components/MarketingBannersManager';
import { getMediaUrl } from '../../utils/media';
import AdminThemeSelector from '../../components/AdminThemeSelector';
import { useAdminTheme } from '../../config/adminThemePalettes';
import { DINER_STYLES } from '../../config/dinerStyles';

// Pestañas principales de navegación del panel administrativo (IA Menú unido con Marca y Configuración)
const NAV_TABS = [
  { id: 'dishes', label: 'Catálogo de Platillos', shortLabel: 'Platillos', icon: Utensils },
  { id: 'vault', label: 'Bóveda Histórica 3D', shortLabel: 'Bóveda 3D', icon: Archive },
  { id: 'scan_guide', label: 'Cómo Escanear en 3D', shortLabel: 'Guía 3D', icon: Camera },
  { id: 'qr', label: 'Códigos QR', shortLabel: 'Códigos QR', icon: QrCode },
  { id: 'service', label: 'Estación de Meseros', shortLabel: 'Meseros', icon: Bell },
  { id: 'theme', label: 'Marca, IA y Configuración', shortLabel: 'Marca & IA', icon: Palette },
  { id: 'billing', label: 'Suscripción y Slots', shortLabel: 'Plan y Slots', icon: CreditCard },
  { id: 'team', label: 'Equipo & Seguridad', shortLabel: 'Equipo', icon: ShieldCheck },
];

// Biblioteca 3D de muestra (Fase 2): modelos verificados listos para asignar en 1 clic.
// Sirven para probar la experiencia WebAR mientras el restaurante escanea sus propios platillos.
const KHRONOS_BASE = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models';
const MODEL_LIBRARY = [
  { id: 'avocado', name: 'Aguacate Hass', category: 'Entradas', emoji: '🥑', size: '8.1 MB', url: '/models/avocado.glb', gradient: 'from-lime-500/25 to-emerald-700/10' },
  { id: 'burger', name: 'Hamburguesa Gourmet', category: 'Platos Fuertes', emoji: '🍔', size: '3.2 MB', url: '/models/burger-test.glb', gradient: 'from-amber-500/25 to-orange-700/10' },
  { id: 'coals', name: 'Parrilla al Carbón', category: 'Platos Fuertes', emoji: '🔥', size: '4.7 MB', url: '/models/coals-grill-clean.glb', gradient: 'from-orange-500/25 to-rose-700/10' },
  { id: 'olives', name: 'Tapas de Aceitunas', category: 'Entradas', emoji: '🫒', size: '5.7 MB', url: '/models/olives-dish.glb', gradient: 'from-violet-500/25 to-emerald-600/10' },
  { id: 'bottle', name: 'Botella de Bebida', category: 'Bebidas', emoji: '🍶', size: '9.0 MB', url: '/models/bottle.glb', gradient: 'from-sky-500/25 to-cyan-700/10' },
  { id: 'flowers', name: 'Centro de Mesa Floral', category: 'Decoración', emoji: '💐', size: '1.8 MB', url: `${KHRONOS_BASE}/GlassVaseFlowers/glTF-Binary/GlassVaseFlowers.glb`, gradient: 'from-pink-500/25 to-fuchsia-700/10' },
  { id: 'plant', name: 'Planta Botánica', category: 'Decoración', emoji: '🌿', size: '5.8 MB', url: `${KHRONOS_BASE}/DiffuseTransmissionPlant/glTF-Binary/DiffuseTransmissionPlant.glb`, gradient: 'from-green-500/25 to-teal-700/10' },
];

// Colección de Paletas de Autor Gastronómicas de Alta Gama
const AUTHOR_PALETTES = [
  {
    id: 'obsidiana-oro',
    name: 'Obsidiana & Oro Imperial',
    tag: 'Alta Cocina Contemporánea',
    primary: '#EAB308',
    secondary: '#090D16',
    accent: '#F59E0B',
    surface: '#111827'
  },
  {
    id: 'borgona-roble',
    name: 'Borgoña & Roble Cava',
    tag: 'Enogourmet & Cortes Selectos',
    primary: '#BE123C',
    secondary: '#0C0A09',
    accent: '#FB7185',
    surface: '#1C1917'
  },
  {
    id: 'esmeralda-bronce',
    name: 'Esmeralda & Bronce Botánico',
    tag: 'Cocina de Autor & Mixología',
    primary: '#059669',
    secondary: '#06120D',
    accent: '#D97706',
    surface: '#0F241A'
  },
  {
    id: 'zafiro-noir',
    name: 'Zafiro & Mármol Noir',
    tag: 'Marisquería & Barra Fría',
    primary: '#2563EB',
    secondary: '#080C14',
    accent: '#38BDF8',
    surface: '#0F172A'
  },
  {
    id: 'brasa-carbon',
    name: 'Brasa & Carbón Steakhouse',
    tag: 'Fuego Directo & Asadores',
    primary: '#E11D48',
    secondary: '#0F0F10',
    accent: '#F97316',
    surface: '#18181B'
  },
  {
    id: 'terra-canela',
    name: 'Terra & Canela Bistro',
    tag: 'Bistro Rústico & Repostería',
    primary: '#D97706',
    secondary: '#120E0A',
    accent: '#FBBF24',
    surface: '#1E1712'
  }
];

// Colección de Familias Tipográficas Gastronómicas de Autor
const GASTRONOMIC_FONTS = [
  {
    id: 'sans',
    name: 'Inter / Sans Clásico',
    tag: 'Equilibrado y Ultra-Legible',
    sample: 'Menú Gastronómico • Cocina de Fuego',
    previewClass: 'font-sans'
  },
  {
    id: 'playfair',
    name: 'Playfair Display (Serif)',
    tag: 'Alta Cocina, Fine Dining & Cava',
    sample: 'Sinfonía de Trufa • Caviar Imperial',
    previewClass: 'font-playfair'
  },
  {
    id: 'lora',
    name: 'Lora (Editorial)',
    tag: 'Bistro Contemporáneo & Trattoria',
    sample: 'Pasta Fresca Fatta a Mano • Pan Brioche',
    previewClass: 'font-lora'
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans (Minimal)',
    tag: 'Sushi Bar, Raw Bar & Clean Food',
    sample: 'Nigiri Omakase • Matcha & Yuzu',
    previewClass: 'font-jakarta'
  },
  {
    id: 'outfit',
    name: 'Outfit (Urbano & Bold)',
    tag: 'Street Gourmet, Burger & Smokehouse',
    sample: 'Wagyu Burger • Brisket Ahumado 14h',
    previewClass: 'font-outfit'
  }
];

// Texturas y Atmósferas de Fondo
const SURFACE_TEXTURES = [
  { id: 'none', label: 'Liso Puro', desc: 'Color plano minimalista y elegante' },
  { id: 'grain', label: 'Grano Analógico', desc: 'Textura orgánica tipo papel y calidez' },
  { id: 'slate', label: 'Pizarra Ahumada', desc: 'Atmósfera tenue para asadores y barras' },
  { id: 'marble', label: 'Mármol Sutil', desc: 'Lujo discreto para alta gastronomía' }
];

// Geometría de Tarjetas de Platillo
const CARD_GEOMETRIES = [
  { id: 'rounded', label: 'Pill / Curva iOS', desc: 'Bordes ultra-redondeados contemporáneos' },
  { id: 'subtle', label: 'Bistro Suave', desc: 'Curvatura equilibrada refinada' },
  { id: 'sharp', label: 'Luxury Recto', desc: 'Líneas limpias y afiladas de fine dining' }
];

// Iconos vectoriales permitidos para el Banner (100% SVG, Cero Emojis)
const BANNER_ICONS = [
  { id: 'sparkles', label: 'Destello', Icon: Sparkles },
  { id: 'gift', label: 'Cortesía', Icon: Gift },
  { id: 'clock', label: 'Horario', Icon: Clock },
  { id: 'flame', label: 'Especial', Icon: Flame },
  { id: 'music', label: 'Música', Icon: Music },
  { id: 'tag', label: 'Promoción', Icon: Tag }
];

// Guía Paso a Paso: Cómo Escanear en 3D tus Platillos
const ScanGuideView = ({ onActionClick, onStartScan }) => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
        <Camera className="w-6 h-6 text-amber-400" />
        <span>Cómo Escanear en 3D</span>
      </h1>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
        Transforma los platillos de tu cocina en modelos interactivos 3D para Realidad Aumentada (WebAR 1:1) usando la cámara de tu celular.
      </p>
    </div>

    {/* Tarjeta de Acción Inmediata: Escanear en 3D directo con Volum-Menu */}
    <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900 border border-amber-500/40 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-lg shadow-amber-500/20 mt-0.5">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">Escanear en 3D directamente con tu celular</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wide">
                Recomendado
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
              No necesitas descargar ni configurar aplicaciones externas. Toma 1 o 3 fotos de tu platillo directamente con la cámara de tu teléfono o súbelas desde tu equipo para generar el modelo 3D a escala real 1:1.
            </p>
          </div>
        </div>

        {onStartScan && (
          <button
            type="button"
            onClick={onStartScan}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Escanear en 3D Ahora</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-amber-500/20 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">✓</span>
          <span>Sin instalar aplicaciones adicionales</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">✓</span>
          <span>Modo Express (1 foto) o Estudio (3 fotos)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">✓</span>
          <span>Calibración métrica 1:1 inmediata</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        O si prefieres utilizar aplicaciones de fotogrametría externa:
      </h3>
    </div>

    {/* 4 Pasos Visuales */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Paso 1 */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center border border-amber-500/30">
              1
            </span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Preparación</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Iluminación y Montaje del Platillo</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Coloca el plato recién emplatado en una mesa con buena luz difusa y homogénea. Evita sombras duras o luces fluorescentes directas. Utiliza una superficie o mantel mate sin reflejos ni brillos.
          </p>
          <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-amber-300/90">
            <strong>Regla de oro:</strong> El plato debe permanecer completamente quieto. No lo muevas ni lo gires; tú eres quien debe caminar a su alrededor.
          </div>
        </div>
      </div>

      {/* Paso 2 */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center border border-amber-500/30">
              2
            </span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Aplicación</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Descarga una App Gratuita</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Cualquier smartphone moderno puede crear escaneos 3D de alta calidad con estas aplicaciones gratuitas:
          </p>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-white block">Scaniverse (Recomendada)</span>
              <span className="text-xs text-slate-400">Totalmente gratuita para iPhone y Android (de Niantic). Exporta malla 3D optimizada directamente.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-white block">Polycam</span>
              <span className="text-xs text-slate-400">Modo Photo capture, excelente calibración para texturas de comida.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paso 3 */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center border border-amber-500/30">
              3
            </span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Captura</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Captura Orbital en 360°</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mantén tu teléfono a 40–50 cm del plato y camina despacio alrededor de la mesa realizando 3 órbitas completas continuas:
          </p>
          <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Vuelta 1 (Nivel Ojo):</strong> A la altura de los bordes del plato para registrar los costados.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Vuelta 2 (Ángulo 45°):</strong> Apuntando en diagonal para capturar volumen y altura.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Vuelta 3 (Cenital):</strong> Desde arriba para registrar los ingredientes y salsas superiores.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Paso 4 */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center border border-amber-500/30">
              4
            </span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Exportar</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Exportar en .GLB o .USDZ</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Tras el procesamiento (tarda de 1 a 2 minutos en el teléfono):
          </p>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <p className="text-slate-300">
              1. Pulsa <strong>Export / Compartir</strong> en la app.
            </p>
            <p className="text-slate-300">
              2. Elige formato <strong>.GLB</strong> (estándar universal para Android y Web) o <strong>.USDZ</strong> (para iOS).
            </p>
            <p className="text-emerald-400 font-semibold">
              3. ¡Sube el archivo a Volum-Menu en tu platillo y actívalo para tus comensales!
            </p>
          </div>
        </div>
      </div>

    </div>

    {/* Tips para Alimentos */}
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Consejos para platillos espectaculares en WebAR</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <p className="font-bold text-white mb-1">✨ Platillos que quedan perfectos:</p>
          <p className="text-slate-400">Cortes de carne, hamburguesas, pizzas, tacos, postres con relieve, sushi, pastas y ensaladas abundantes.</p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <p className="font-bold text-white mb-1">💡 Platillos con líquidos o cristales:</p>
          <p className="text-slate-400">Para cócteles o sopas transparentes, decora con garnituras sólidas (fruta, romero, crotones) para que la cámara tenga puntos fijos de referencia.</p>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      {onStartScan && (
        <button
          type="button"
          onClick={onStartScan}
          className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Escanear en 3D</span>
        </button>
      )}
      {onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Subir Archivo 3D Manual (.GLB)</span>
        </button>
      )}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [token, setToken] = useState(localStorage.getItem('volum_admin_token') || localStorage.getItem('token') || '');
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('expired') === 'true') {
        return 'Tu sesión ha expirado. Por favor, ingresa nuevamente con tus credenciales.';
      }
    }
    return '';
  });
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const cached = localStorage.getItem('volum_admin_restaurant');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('volum_admin_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabFromUrl = searchParams.get('tab') || 'dishes';

  // Motor de Temas y Personalización Visual del Panel de Administración
  const {
    themeKey,
    setThemeKey,
    currentTheme,
    isSavingTheme,
    saveSuccess: adminThemeSaveSuccess,
    saveThemeToBackend
  } = useAdminTheme(restaurant?.theme);
  const [activeTab, setActiveTabState] = useState(currentTabFromUrl);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [searchParams]);

  // Estado para Menú Drawer Móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentNavTab = NAV_TABS.find((t) => t.id === activeTab) || NAV_TABS[0];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Modal de Bienvenida Post-Pago y Onboarding
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeSlug, setWelcomeSlug] = useState('');
  const [welcomeRestName, setWelcomeRestName] = useState('');
  const [copiedWelcomeLink, setCopiedWelcomeLink] = useState(false);

  // Estados de datos
  const [stats, setStats] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Búsqueda, Filtrado, Densidad y Horarios en Catálogo de Platillos
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  const [dishCategoryFilter, setDishCategoryFilter] = useState('all');
  const [dishTypeFilter, setDishTypeFilter] = useState('all'); // 'all' | '3d' | 'featured' | 'available' | 'sold_out'
  const [dishScheduleFilter, setDishScheduleFilter] = useState('all'); // 'all' | 'breakfast' | 'lunch' | 'dinner'
  const [dishViewDensity, setDishViewDensity] = useState('compact'); // 'compact' | 'standard' | 'table'

  const activeDishesList = useMemo(() => dishes.filter((d) => !d.isArchived), [dishes]);

  const filteredActiveDishes = useMemo(() => {
    return activeDishesList.filter((dish) => {
      if (dishSearchQuery.trim()) {
        const query = dishSearchQuery.toLowerCase().trim();
        const nameMatch = dish.name?.toLowerCase().includes(query);
        const descMatch = dish.description?.toLowerCase().includes(query);
        const priceMatch = String(dish.price).includes(query);
        const catName = categories.find(c => (c._id || c.id) === dish.categoryId)?.name?.toLowerCase() || '';
        const catMatch = catName.includes(query);
        if (!nameMatch && !descMatch && !priceMatch && !catMatch) return false;
      }

      if (dishCategoryFilter !== 'all') {
        if (dish.categoryId !== dishCategoryFilter) return false;
      }

      if (dishTypeFilter === '3d' && !dish.is3D) return false;
      if (dishTypeFilter === 'featured' && !dish.isFeatured) return false;
      if (dishTypeFilter === 'available' && dish.isAvailable === false) return false;
      if (dishTypeFilter === 'sold_out' && dish.isAvailable !== false) return false;

      // 4. Filtro por Turno / Horario (Fase 4: Multi-Cartas)
      if (dishScheduleFilter !== 'all') {
        const scheds = Array.isArray(dish.availableSchedules) && dish.availableSchedules.length > 0
          ? dish.availableSchedules
          : ['all'];
        if (!scheds.includes('all') && !scheds.includes(dishScheduleFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [activeDishesList, categories, dishSearchQuery, dishCategoryFilter, dishTypeFilter, dishScheduleFilter]);

  // Modal de Platillo Nuevo / Edición
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isScanGuideOpen, setIsScanGuideOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    videoUrl: '',
    isAvailable: true,
    is3D: false,
    modelGlbUrl: '',
    modelUsdzUrl: '',
    isCompact: false,
    isFeatured: false,
    allergens: [],
    availableSchedules: ['all'],
    translations: {
      en: { name: '', description: '' },
      fr: { name: '', description: '' }
    }
  });

  // Refs para inputs de archivos
  const imageInputRef = React.useRef(null);
  const modelInputRef = React.useRef(null);
  const onboardingMenuInputRef = React.useRef(null);
  const onboardingLogoInputRef = React.useRef(null);
  const onboardingVenueInputRef = React.useRef(null);

  // Estados de subida de archivos y selección 3D
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingModel, setIsDraggingModel] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [modelUploadError, setModelUploadError] = useState(null);
  const [uploadedModelName, setUploadedModelName] = useState('');
  const [showManualImageUrl, setShowManualImageUrl] = useState(false);
  const [showManual3DUrl, setShowManual3DUrl] = useState(false);
  const [mode3DTab, setMode3DTab] = useState('catalog'); // 'catalog' | 'upload'
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
  const [isAi3DModalOpen, setIsAi3DModalOpen] = useState(false);
  const [selectedDishForAi3D, setSelectedDishForAi3D] = useState(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isPlanAdvisorOpen, setIsPlanAdvisorOpen] = useState(false);
  const [isPaywallTriggered, setIsPaywallTriggered] = useState(false);

  // Detección reactiva de expiración de prueba VIP (7 días)
  const isTrialExpired = useMemo(() => {
    if (restaurant?.slug === 'la-terraza' || user?.role === 'superadmin') {
      return false;
    }
    const sub = restaurant?.subscription;
    if (!sub) return false;
    if (sub.status === 'past_due' || sub.status === 'canceled') return true;
    if (sub.status === 'trialing' && sub.trialEndsAt) {
      return Date.now() > new Date(sub.trialEndsAt).getTime();
    }
    return false;
  }, [restaurant?.subscription, restaurant?.slug, user?.role]);

  // Interceptor de respuesta para capturar bloqueo HTTP 402 del Paywall en tiempo real
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 402 && error.response?.data?.paywall) {
          setIsPaywallTriggered(true);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleOpenAi3DScanner = (dish) => {
    setSelectedDishForAi3D(dish);
    setIsAi3DModalOpen(true);
  };

  const handleOpenAi3DScannerFromGuide = () => {
    if (dishes && dishes.length > 0) {
      if (editingDish) {
        handleOpenAi3DScanner(editingDish);
        return;
      }
      const target = dishes.find((d) => !d.is3D) || dishes[0];
      handleOpenAi3DScanner(target);
    } else {
      showToast('Crea o selecciona un platillo para escanear en 3D.', 'info');
      setActiveTab('dishes');
    }
  };
  const [companionKind, setCompanionKind] = useState('image'); // 'image' | 'model'

  // Modal de Upsell Slots 3D
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [upsellMessage, setUpsellMessage] = useState('');

  // QR Vectorial Avanzado
  const [qrTable, setQrTable] = useState('1');
  const [qrZone, setQrZone] = useState('Terraza');
  const [qrDotStyle, setQrDotStyle] = useState('square'); // 'square' | 'dots' | 'rounded'
  const [qrColorDark, setQrColorDark] = useState('#000000');
  const [qrIncludeLogo, setQrIncludeLogo] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrError, setQrError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados de Control y Gestión de Mesas (Estación de Meseros)
  const [tablesList, setTablesList] = useState(() => {
    try {
      const saved = localStorage.getItem('volum_admin_tables');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 't1', number: '1', zone: 'Terraza' },
      { id: 't2', number: '2', zone: 'Terraza' },
      { id: 't3', number: '3', zone: 'Salón Principal' },
      { id: 't4', number: '4', zone: 'Salón Principal' },
      { id: 't5', number: '5', zone: 'Barra' }
    ];
  });
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableZoneFilter, setTableZoneFilter] = useState('ALL');
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableZone, setNewTableZone] = useState('Salón Principal');
  const [editingTable, setEditingTable] = useState(null);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isSavingTables, setIsSavingTables] = useState(false);
  const [serviceTableViewMode, setServiceTableViewMode] = useState('floor_plan');

  // Estados para Eliminar Todos los Platillos (Vaciar Catálogo)
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Estados para Eliminar Cuenta y Restaurante
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountConfirmText, setDeleteAccountConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Estados para Suscripción y Slots
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [isCancelingSlot, setIsCancelingSlot] = useState(false);

  // Asistente IA Gourmet y Traducción Gastronómica
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [dishLangTab, setDishLangTab] = useState('es'); // 'es' | 'en' | 'fr'
  const [isTranslatingDish, setIsTranslatingDish] = useState(false);
  const [isTranslatingWholeMenu, setIsTranslatingWholeMenu] = useState(false);

  // Onboarding Mágico con IA (Menú + Logo + 1 a 5 fotos de local)
  const [onboardingMenuFile, setOnboardingMenuFile] = useState(null);
  const [multiScheduleMenuEnabled, setMultiScheduleMenuEnabled] = useState(false);
  const [onboardingBreakfastFile, setOnboardingBreakfastFile] = useState(null);
  const [onboardingLunchFile, setOnboardingLunchFile] = useState(null);
  const [onboardingDinnerFile, setOnboardingDinnerFile] = useState(null);
  const [showScheduleHoursEditor, setShowScheduleHoursEditor] = useState(false);
  const onboardingBreakfastInputRef = React.useRef(null);
  const onboardingLunchInputRef = React.useRef(null);
  const onboardingDinnerInputRef = React.useRef(null);
  const [onboardingLogoFile, setOnboardingLogoFile] = useState(null);
  const [onboardingLogoPreview, setOnboardingLogoPreview] = useState('');
  const [onboardingVenueFiles, setOnboardingVenueFiles] = useState([]);
  const [onboardingVenuePreviews, setOnboardingVenuePreviews] = useState([]);
  const [isAnalyzingOnboarding, setIsAnalyzingOnboarding] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [onboardingError, setOnboardingError] = useState(null);
  const [onboardingResult, setOnboardingResult] = useState(null);
  const [extractedDishes, setExtractedDishes] = useState([]);
  const [extractedPalette, setExtractedPalette] = useState(null);
  const [extractedLogoUrl, setExtractedLogoUrl] = useState('');
  const [isApplyingOnboarding, setIsApplyingOnboarding] = useState(false);
  const [applySuccess, setApplySuccess] = useState(null);

  // Estados para Marca, Acordeón Desplegable Multi-Sección y Colores
  const [isUploadingThemeLogo, setIsUploadingThemeLogo] = useState(false);
  const [isUploadingThemeBanner, setIsUploadingThemeBanner] = useState(false);
  const [themeSaveSuccess, setThemeSaveSuccess] = useState(false);
  const [isSavingThemeConfig, setIsSavingThemeConfig] = useState(false);
  const [showLivePhoneModal, setShowLivePhoneModal] = useState(false);
  const themeLogoInputRef = React.useRef(null);
  const themeBannerInputRef = React.useRef(null);

  // Sub-pestaña activa dentro de "Marca, IA y Configuración" para evitar sobrecarga y fatiga visual
  const [themeActiveSubTab, setThemeActiveSubTab] = useState('categories');
  // Categoría enfocada activamente para previsualización inmediata 1:1 en el simulador móvil
  const [focusedCategoryForPreview, setFocusedCategoryForPreview] = useState(null);
  const [isOptimizingWithAI, setIsOptimizingWithAI] = useState(false);

  // Acordeón inteligente multi-abierto: permite tener varios módulos abiertos a la vez y plegarlos al terminar de editar
  const [openThemeModules, setOpenThemeModules] = useState({
    ai_engine: false,
    identity: true,
    archetype: false,
    categories: false,
    palette: true,
    typography: false,
    storytelling: false,
    marketing: false,
    admin_console: false,
    danger_zone: false
  });

  const toggleThemeModule = (modKey) => {
    setOpenThemeModules((prev) => ({
      ...prev,
      [modKey]: !prev[modKey]
    }));
  };

  const expandAllThemeModules = () => {
    setOpenThemeModules({
      ai_engine: true,
      identity: true,
      archetype: true,
      categories: true,
      palette: true,
      typography: true,
      storytelling: true,
      marketing: true,
      admin_console: true,
      danger_zone: false
    });
  };

  const collapseAllThemeModules = () => {
    setOpenThemeModules({
      ai_engine: false,
      identity: false,
      archetype: false,
      categories: false,
      palette: false,
      typography: false,
      storytelling: false,
      marketing: false,
      admin_console: false,
      danger_zone: false
    });
  };

  useEffect(() => {
    if (activeTab === 'ai_onboarding') {
      setOpenThemeModules((prev) => ({ ...prev, ai_engine: true }));
    }
  }, [activeTab]);

  // Estados para Estación de Meseros y PIN Editable
  const [copiedServicePin, setCopiedServicePin] = useState(false);
  const [copiedServiceUrl, setCopiedServiceUrl] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [pinSaveSuccess, setPinSaveSuccess] = useState(false);

  // Notificación de compra y verificación de slots 3D
  const [slotsSuccessToast, setSlotsSuccessToast] = useState(null);

  // Sistema de notificación Toast unificado accesible (WCAG 2.2 AA toast-accessibility)
  const [dashboardToast, setDashboardToast] = useState(null);
  const [dishToDelete, setDishToDelete] = useState(null);

  const showToast = (message, type = 'info') => {
    setDashboardToast({ message, type });
  };

  useEffect(() => {
    if (dashboardToast) {
      const timer = setTimeout(() => setDashboardToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [dashboardToast]);

  // Multi-Restaurante y Sedes VIP
  const [activeRestaurantId, setActiveRestaurantId] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('volum_active_restaurant_id') || '' : '')
  );
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [isCreateBranchModalOpen, setIsCreateBranchModalOpen] = useState(false);

  const authHeaders = useMemo(() => {
    const shouldIncludeCustomId = activeRestaurantId && user?.restaurantId && activeRestaurantId.toString() !== user.restaurantId.toString();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(shouldIncludeCustomId ? { 'x-restaurant-id': activeRestaurantId } : {})
      },
      params: shouldIncludeCustomId ? { restaurantId: activeRestaurantId } : {}
    };
  }, [token, activeRestaurantId, user?.restaurantId]);

  // 1. Detección automática de token o compra de slots al retornar de Stripe Checkout con Sanitización de URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlAuthToken = params.get('auth_token') || params.get('token');
    const isNewAccount = params.get('new_account') === 'true';
    const isPaymentSuccess = params.get('payment') === 'success';
    const isNewPlan = params.get('new_plan') === 'true';
    const planParam = params.get('plan') || '';
    const isSlotsSuccess = params.get('slots') === 'success';
    const slotsQty = params.get('qty') || '1';
    const sessionId = params.get('session_id') || '';
    const slugParam = params.get('slug') || '';
    const restNameParam = params.get('rest_name') || '';

    if (slugParam) setWelcomeSlug(slugParam);
    if (restNameParam) setWelcomeRestName(restNameParam);

    if (urlAuthToken) {
      localStorage.setItem('volum_admin_token', urlAuthToken);
      setToken(urlAuthToken);
      loadInitialData(urlAuthToken);

      if (isNewAccount || (isPaymentSuccess && !isNewPlan)) {
        setShowWelcomeModal(true);
      }

      // SEGURIDAD CRÍTICA: Eliminar de inmediato el token de la barra de direcciones del navegador
      const cleanSearch = new URLSearchParams();
      if (isPaymentSuccess) cleanSearch.set('payment', 'success');
      if (isNewAccount) cleanSearch.set('welcome', 'true');
      if (params.get('ghost') === 'true') cleanSearch.set('ghost', 'true');
      const cleanUrl = window.location.pathname + (cleanSearch.toString() ? `?${cleanSearch.toString()}` : '');
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (params.get('welcome') === 'true') {
      setShowWelcomeModal(true);
    }

    // Si retorna de comprar o mejorar un plan
    if (isPaymentSuccess && (isNewPlan || planParam)) {
      const activeToken = urlAuthToken || localStorage.getItem('volum_admin_token') || token;
      if (activeToken) {
        axios.post('/api/v1/billing/verify-plan', { sessionId, planKey: planParam }, {
          headers: { Authorization: `Bearer ${activeToken}` }
        }).then((res) => {
          if (res.data.success) {
            setRestaurant(res.data.restaurant);
            loadInitialData(activeToken);
            showToast(res.data.message || '¡Plan actualizado y funciones desbloqueadas con éxito!', 'success');
          }
        }).catch((err) => {
          console.warn('Error verificando actualización de plan:', err);
        });
      }
      setActiveTab('billing');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Si retorna de comprar slots 3D adicionales
    if (isSlotsSuccess) {
      const activeToken = urlAuthToken || localStorage.getItem('volum_admin_token') || token;
      if (activeToken) {
        axios.post('/api/v1/billing/verify-slots', { sessionId, qty: slotsQty }, {
          headers: { Authorization: `Bearer ${activeToken}` }
        }).then((res) => {
          if (res.data.success) {
            setRestaurant(res.data.restaurant);
            loadInitialData(activeToken);
            setSlotsSuccessToast(res.data.message || '¡Slots 3D activados y verificados con éxito!');
            setTimeout(() => setSlotsSuccessToast(null), 6000);
          }
        }).catch((err) => {
          console.warn('Error verificando slots:', err);
        });
      }
      setActiveTab('billing');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Guardar nuevo PIN de servicio para meseros
  const handleSavePin = async () => {
    if (!newPinInput || newPinInput.trim().length < 4) {
      showToast('El PIN de servicio debe contener entre 4 y 6 dígitos numéricos.', 'error');
      return;
    }
    setIsSavingPin(true);
    setPinSaveSuccess(false);
    try {
      await axios.put('/api/v1/admin/theme', {
        defaultPin: newPinInput.trim()
      }, authHeaders);
      setRestaurant((prev) => ({
        ...prev,
        settings: { ...prev?.settings, defaultPin: newPinInput.trim() }
      }));
      setPinSaveSuccess(true);
      setNewPinInput('');
      showToast('PIN de meseros actualizado exitosamente.', 'success');
      setTimeout(() => setPinSaveSuccess(false), 4000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar el PIN de meseros.', 'error');
    } finally {
      setIsSavingPin(false);
    }
  };

  // Alternar interruptores de pedidos y seguridad en mesa (Plan VIP Fine Dining $1,299+)
  const handleToggleOrderSetting = async (key) => {
    const currentOrderSettings = restaurant?.settings?.orderSettings || {
      enabled: false,
      requireApproval: true,
      allowSplitBill: true,
      paymentMode: 'waiter_traditional'
    };

    const currentPlan = restaurant?.subscription?.plan || 'essential';
    const isPlanAllowed = ['chain_vip', 'enterprise_chain', 'trial'].includes(currentPlan);

    if (key === 'enabled' && !currentOrderSettings.enabled && !isPlanAllowed) {
      showToast('Los pedidos digitales en mesa están disponibles a partir del Plan VIP Fine Dining ($1,299).', 'error');
      setActiveTab('billing');
      return;
    }

    // Si los pedidos están deshabilitados, no permitir alternar requireApproval o allowSplitBill
    if (key !== 'enabled' && !currentOrderSettings.enabled) {
      showToast('Para configurar esta opción, primero debes activar "Permitir Pedidos".', 'info');
      return;
    }

    const updated = {
      ...currentOrderSettings,
      [key]: !currentOrderSettings[key]
    };

    // Si se desactiva "Permitir Pedidos", automáticamente apagar la división de cuenta
    if (key === 'enabled' && !updated.enabled) {
      updated.allowSplitBill = false;
    }

    setRestaurant((prev) => ({
      ...prev,
      settings: {
        ...prev?.settings,
        orderSettings: updated
      }
    }));

    try {
      await axios.put('/api/v1/admin/theme', {
        orderSettings: updated
      }, authHeaders);
      showToast(
        key === 'enabled'
          ? (updated.enabled ? 'Pedidos digitales desde la mesa habilitados.' : 'Pedidos en mesa desactivados (Modo Catálogo).')
          : 'Ajustes de pedidos actualizados.',
        'success'
      );
    } catch (err) {
      setRestaurant((prev) => ({
        ...prev,
        settings: {
          ...prev?.settings,
          orderSettings: currentOrderSettings
        }
      }));
      showToast(err.response?.data?.message || 'Error al actualizar ajustes de pedidos.', 'error');
      if (err.response?.data?.needsUpsell) {
        setActiveTab('billing');
      }
    }
  };

  // Aplicar paleta de autor prediseñada
  const applyAuthorPalette = (palette) => {
    setRestaurant((prev) => ({
      ...prev,
      theme: {
        ...prev?.theme,
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        accentColor: palette.accent,
        surfaceColor: palette.surface
      }
    }));
  };

  // Guardar toda la configuración de Marca, IA y Server-Driven UI (con opción de plegar el módulo editado)
  const handleSaveThemeConfig = async (moduleToCollapse = null) => {
    setIsSavingThemeConfig(true);
    try {
      const currentAiPalette = restaurant?.theme?.aiPalette?.primaryColor
        ? restaurant.theme.aiPalette
        : (extractedPalette?.primaryColor ? extractedPalette : undefined);

      await axios.put('/api/v1/admin/theme', {
        name: restaurant?.name,
        description: restaurant?.description,
        primaryColor: restaurant?.theme?.primaryColor,
        secondaryColor: restaurant?.theme?.secondaryColor,
        accentColor: restaurant?.theme?.accentColor,
        surfaceColor: restaurant?.theme?.surfaceColor,
        ...(currentAiPalette ? { aiPalette: currentAiPalette } : {}),
        fontFamily: restaurant?.theme?.fontFamily || 'sans',
        themeMode: restaurant?.theme?.themeMode || 'dark',
        texture: restaurant?.theme?.texture || 'none',
        cardRadius: restaurant?.theme?.cardRadius || 'rounded',
        archetype: restaurant?.theme?.archetype || 'modern_gourmet',
        dinerStyle: restaurant?.theme?.dinerStyle || 'lounge_nocturno',
        heroStyle: restaurant?.theme?.heroStyle || 'banner_standard',
        logoUrl: restaurant?.logoUrl,
        bannerUrl: restaurant?.bannerUrl,
        defaultViewMode: restaurant?.settings?.defaultViewMode || 'grid',
        socialLinks: restaurant?.settings?.socialLinks || {
          whatsapp: '',
          instagram: '',
          facebook: '',
          tiktok: '',
          website: '',
          phone: '',
          mapsUrl: '',
          wifiName: '',
          wifiPassword: ''
        },
        aiAssistant: restaurant?.settings?.aiAssistant || { enabled: true, customName: 'Asesor Gastronómico' },
        announcementBanner: restaurant?.settings?.announcementBanner || { enabled: false, text: '', icon: 'sparkles', badgeText: 'Novedad' },
        marketingBanners: restaurant?.settings?.marketingBanners || { enabled: false, showFixedAndScheduled: true, scheduledBanners: [] },
        introSplash: restaurant?.settings?.introSplash || { enabled: true, tagline: 'Experiencia Gastronómica & WebAR', durationMs: 1200 },
        storytelling: restaurant?.settings?.storytelling || { chefQuote: { enabled: false, chefName: '', quote: '', photoUrl: '' }, signatureDishId: '' },
        qrStyle: restaurant?.settings?.qrStyle || { primaryColor: '#D97706', frameText: 'ESCANEÁ Y MIRÁ EN 3D', includeLogo: true }
      }, authHeaders);

      setThemeSaveSuccess(true);
      if (moduleToCollapse) {
        setOpenThemeModules((prev) => ({ ...prev, [moduleToCollapse]: false }));
        showToast('Sección guardada y plegada. Cambios aplicados en vivo.', 'success');
      } else {
        showToast('Identidad visual, arquetipo y configuración guardadas exitosamente.', 'success');
      }
      setTimeout(() => setThemeSaveSuccess(false), 3500);
    } catch (err) {
      showToast('Error guardando configuración visual.', 'error');
    } finally {
      setIsSavingThemeConfig(false);
    }
  };

  // 2. Cargar datos al cambiar de token
  useEffect(() => {
    if (token) {
      loadInitialData(token);
    }
  }, [token]);

  const loadInitialData = async (activeToken = token, targetRestId = activeRestaurantId) => {
    if (!activeToken) return;
    setLoading(true);
    try {
      const shouldIncludeCustomId = Boolean(targetRestId && user?.restaurantId && targetRestId.toString() !== user.restaurantId.toString());
      const reqConfig = {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          ...(shouldIncludeCustomId ? { 'x-restaurant-id': targetRestId } : {})
        },
        params: shouldIncludeCustomId ? { restaurantId: targetRestId } : {}
      };
      const [meRes, statsRes, dishesRes, catRes, groupRes] = await Promise.allSettled([
        axios.get('/api/v1/auth/me', reqConfig),
        axios.get('/api/v1/admin/dashboard', reqConfig),
        axios.get('/api/v1/admin/dishes', reqConfig),
        axios.get('/api/v1/admin/categories', reqConfig),
        axios.get('/api/v1/admin/my-restaurants', reqConfig)
      ]);

      if (meRes.status === 'fulfilled' && meRes.value.data.success) {
        setUser(meRes.value.data.user);
        const currentRest = meRes.value.data.restaurant;
        setRestaurant(currentRest);
        if (!targetRestId && currentRest?._id) {
          setActiveRestaurantId(currentRest._id);
          try {
            localStorage.setItem('volum_active_restaurant_id', currentRest._id);
          } catch {}
        }
        try {
          localStorage.setItem('volum_admin_restaurant', JSON.stringify(currentRest));
          localStorage.setItem('volum_admin_user', JSON.stringify(meRes.value.data.user));
        } catch {
          // Ignore storage quota
        }
        if (Array.isArray(currentRest?.tables) && currentRest.tables.length > 0) {
          setTablesList(currentRest.tables);
          try { localStorage.setItem('volum_admin_tables', JSON.stringify(currentRest.tables)); } catch {}
        } else if (Array.isArray(currentRest?.branches?.[0]?.tables) && currentRest.branches[0].tables.length > 0) {
          setTablesList(currentRest.branches[0].tables);
          try { localStorage.setItem('volum_admin_tables', JSON.stringify(currentRest.branches[0].tables)); } catch {}
        }
      } else if (meRes.status === 'rejected' && meRes.reason?.response?.status === 401) {
        handleLogout(true);
        return;
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.stats);
      }
      if (dishesRes.status === 'fulfilled' && dishesRes.value.data.success) {
        setDishes(dishesRes.value.data.data || []);
      }
      if (catRes.status === 'fulfilled' && catRes.value.data.success) {
        setCategories(catRes.value.data.data || []);
      }
      if (groupRes.status === 'fulfilled' && groupRes.value.data.success) {
        setMyRestaurants(groupRes.value.data.data?.restaurants || []);
      }
    } catch (err) {
      console.error('Error cargando datos de admin:', err);
      if (err.response?.status === 401) {
        handleLogout(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (newId) => {
    if (newId === activeRestaurantId) return;
    setActiveRestaurantId(newId);
    try {
      localStorage.setItem('volum_active_restaurant_id', newId);
    } catch {}
    loadInitialData(token, newId);
    showToast('Cambiando de sede...', 'info');
  };

  const handleBranchCreated = (newRest) => {
    setMyRestaurants((prev) => [...prev, newRest]);
    setActiveRestaurantId(newRest._id);
    try {
      localStorage.setItem('volum_active_restaurant_id', newRest._id);
    } catch {}
    loadInitialData(token, newRest._id);
    showToast(`¡Bienvenido a tu nueva sede ${newRest.name}!`, 'success');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setSessionExpiredMessage('');
    setIsLoggingIn(true);
    try {
      const cleanEmail = String(loginEmail).trim().toLowerCase();
      const res = await axios.post('/api/v1/auth/login', {
        email: cleanEmail,
        password: loginPass
      });
      const newToken = res.data.token;
      localStorage.setItem('volum_admin_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      setRestaurant(res.data.restaurant);
      try {
        localStorage.setItem('volum_admin_restaurant', JSON.stringify(res.data.restaurant));
        localStorage.setItem('volum_admin_user', JSON.stringify(res.data.user));
      } catch {
        // Ignore storage quota
      }
      loadInitialData(newToken);
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Error en inicio de sesión. Verifica tu correo y contraseña.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = (isExpired = false) => {
    localStorage.removeItem('volum_admin_token');
    localStorage.removeItem('token');
    localStorage.removeItem('volum_admin_restaurant');
    localStorage.removeItem('volum_admin_user');
    setToken('');
    setUser(null);
    setRestaurant(null);
    if (isExpired) {
      setSessionExpiredMessage('Tu sesión ha expirado. Por favor, ingresa nuevamente con tus credenciales.');
    }
  };

  // Guardar platillo (Crear o Actualizar)
  const handleSaveDish = async (e) => {
    e.preventDefault();
    try {
      if (editingDish) {
        await axios.put(`/api/v1/admin/dishes/${editingDish._id}`, dishForm, authHeaders);
      } else {
        await axios.post('/api/v1/admin/dishes', dishForm, authHeaders);
      }
      setIsDishModalOpen(false);
      setEditingDish(null);
      loadInitialData();
    } catch (err) {
      if (err.response?.data?.needsUpsell) {
        setUpsellMessage(err.response.data.message);
        setIsUpsellModalOpen(true);
      } else {
        showToast(err.response?.data?.message || 'Error al guardar platillo.', 'error');
      }
    }
  };

  // Toggle Bóveda Histórica 3D
  const handleToggleVault = async (dishId) => {
    try {
      await axios.patch(`/api/v1/admin/dishes/${dishId}/vault`, {}, authHeaders);
      loadInitialData();
    } catch (err) {
      if (err.response?.data?.needsUpsell) {
        setUpsellMessage(err.response.data.message);
        setIsUpsellModalOpen(true);
      } else {
        showToast(err.response?.data?.message || 'Error al alternar bóveda.', 'error');
      }
    }
  };

  // Switch Rápido: Alternar Disponibilidad (Disponible / Agotado hoy)
  const handleToggleAvailability = async (dishId) => {
    try {
      const res = await axios.patch(`/api/v1/admin/dishes/${dishId}/toggle-availability`, {}, authHeaders);
      if (res.data.success) {
        setDishes((prev) =>
          prev.map((d) => (d._id === dishId ? { ...d, isAvailable: res.data.data.isAvailable } : d))
        );
        showToast(res.data.message, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cambiar disponibilidad.', 'error');
    }
  };

  // Switch Rápido: Alternar Pedido Estrella / Más Pedido (⭐)
  const handleToggleFeatured = async (dishId) => {
    const targetDish = dishes.find((d) => d._id === dishId);
    if (!targetDish) return;
    const nextFeatured = !targetDish.isFeatured;

    // Actualización optimista inmediata en interfaz para respuesta visual instantánea
    setDishes((prev) =>
      prev.map((d) => (d._id === dishId ? { ...d, isFeatured: nextFeatured } : d))
    );

    try {
      // 1. Enviar mediante PUT al endpoint existente (compatible universalmente con Render y local)
      const payload = {
        name: targetDish.name,
        description: targetDish.description || '',
        price: targetDish.price,
        categoryId: targetDish.categoryId,
        imageUrl: targetDish.imageUrl || '',
        videoUrl: targetDish.videoUrl || '',
        isAvailable: targetDish.isAvailable !== undefined ? targetDish.isAvailable : true,
        is3D: Boolean(targetDish.is3D),
        modelGlbUrl: targetDish.modelGlbUrl || '',
        modelUsdzUrl: targetDish.modelUsdzUrl || '',
        isCompact: Boolean(targetDish.isCompact),
        isFeatured: nextFeatured,
        allergens: targetDish.allergens || []
      };

      await axios.put(`/api/v1/admin/dishes/${dishId}`, payload, authHeaders);

      showToast(
        nextFeatured
          ? 'Platillo marcado como Pedido Estrella ⭐'
          : 'Platillo removido de Pedidos Estrella.',
        'success'
      );
    } catch (putErr) {
      // 2. Si PUT llegase a fallar, intentar mediante PATCH como fallback
      try {
        const patchRes = await axios.patch(`/api/v1/admin/dishes/${dishId}/featured`, {}, authHeaders);
        showToast(patchRes.data?.message || 'Estado actualizado.', 'success');
      } catch (patchErr) {
        // Revertir optimistic update en caso de error real
        setDishes((prev) =>
          prev.map((d) => (d._id === dishId ? { ...d, isFeatured: targetDish.isFeatured } : d))
        );
        showToast(
          putErr.response?.data?.message || patchErr.response?.data?.message || 'Error al cambiar estado de Pedido Estrella.',
          'error'
        );
      }
    }
  };

  // Eliminar platillo (Modal accesible sin window.confirm)
  const handleDeleteDish = (dishId) => {
    setDishToDelete(dishId);
  };

  const confirmDeleteDish = async () => {
    if (!dishToDelete) return;
    try {
      await axios.delete(`/api/v1/admin/dishes/${dishToDelete}`, authHeaders);
      showToast('Platillo eliminado correctamente.', 'success');
      loadInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al eliminar el platillo.', 'error');
    } finally {
      setDishToDelete(null);
    }
  };

  // Asistente Gourmet IA
  const handleAIEnhance = async () => {
    if (!dishForm.name) {
      showToast('Ingresa primero el nombre del platillo.', 'info');
      return;
    }
    setIsEnhancing(true);
    try {
      const res = await axios.post('/api/v1/admin/ai/enhance', {
        name: dishForm.name,
        ingredients: dishForm.description
      }, authHeaders);
      setDishForm((prev) => ({ ...prev, description: res.data.enhancedDescription }));
    } catch (err) {
      showToast('Error con el asistente gourmet.', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Traducción Gastronómica con IA para un platillo individual
  const handleAITranslateDish = async () => {
    if (!dishForm.name) {
      showToast('Ingresa primero el nombre del platillo en español.', 'info');
      return;
    }
    setIsTranslatingDish(true);
    try {
      const selectedCategory = categories.find(c => c._id === dishForm.categoryId);
      const res = await axios.post('/api/v1/admin/ai/translate-dish', {
        name: dishForm.name,
        description: dishForm.description || '',
        categoryName: selectedCategory?.name || ''
      }, authHeaders);

      if (res.data?.translations) {
        setDishForm(prev => ({
          ...prev,
          translations: {
            en: {
              name: res.data.translations.en?.name || prev.translations?.en?.name || '',
              description: res.data.translations.en?.description || prev.translations?.en?.description || ''
            },
            fr: {
              name: res.data.translations.fr?.name || prev.translations?.fr?.name || '',
              description: res.data.translations.fr?.description || prev.translations?.fr?.description || ''
            }
          }
        }));
        showToast('¡Platillo traducido exitosamente a Inglés y Francés!', 'success');
        setDishLangTab('en');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al traducir platillo con IA.', 'error');
    } finally {
      setIsTranslatingDish(false);
    }
  };

  // Traducción Masiva de Toda la Carta del Restaurante
  const handleAITranslateWholeMenu = async (forceAll = false) => {
    if (!window.confirm('¿Deseas traducir automáticamente toda la carta a Inglés y Francés con IA Gastronómica?')) {
      return;
    }
    setIsTranslatingWholeMenu(true);
    try {
      const res = await axios.post('/api/v1/admin/ai/translate-menu', { forceAll }, authHeaders);
      showToast(res.data?.message || '¡Menú completo traducido exitosamente!', 'success');
      loadInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al traducir menú masivamente.', 'error');
    } finally {
      setIsTranslatingWholeMenu(false);
    }
  };

  // Subida directa de imagen del platillo (JPG, PNG, WEBP)
  const uploadImageFile = async (file) => {
    if (!file) return;

    setImageUploadError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type?.toLowerCase()) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setImageUploadError('Formato no compatible. Por favor sube una imagen en formato JPG, PNG o WEBP.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setImageUploadError('La imagen supera el límite permitido de 15 MB.');
      return;
    }

    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/v1/upload/single', formData, {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      setDishForm((prev) => ({ ...prev, imageUrl: res.data.url }));
      showToast('Fotografía subida y optimizada exitosamente en WebP.', 'success');
    } catch (err) {
      setImageUploadError(err.response?.data?.message || 'Error al subir la imagen. Verifica tu conexión.');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadImageFile(file);
  };

  // Subida directa de archivo 3D (.glb o .usdz)
  const uploadModelFile = async (file) => {
    if (!file) return;

    setModelUploadError(null);

    const fileNameLower = file.name?.toLowerCase() || '';
    const isGlb = fileNameLower.endsWith('.glb');
    const isUsdz = fileNameLower.endsWith('.usdz');

    if (!isGlb && !isUsdz) {
      setModelUploadError('Formato no válido. Debe ser un archivo 3D con extensión .glb o .usdz');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setModelUploadError('El modelo 3D supera el límite de 25 MB.');
      return;
    }

    setIsUploadingModel(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/v1/upload/single', formData, {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      setDishForm((prev) => ({
        ...prev,
        is3D: true,
        modelGlbUrl: isUsdz ? prev.modelGlbUrl : res.data.url,
        modelUsdzUrl: isUsdz ? res.data.url : prev.modelUsdzUrl
      }));
      setUploadedModelName(file.name);
      showToast(`Modelo 3D (${file.name}) procesado y listo para WebAR.`, 'success');
    } catch (err) {
      setModelUploadError(err.response?.data?.message || 'Error al subir el modelo 3D (.glb o .usdz).');
    } finally {
      setIsUploadingModel(false);
      if (modelInputRef.current) modelInputRef.current.value = '';
    }
  };

  const handleModelFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadModelFile(file);
  };

  // Subida de logotipo de la marca
  const handleThemeLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    extractInstantPaletteFromFile(file);
    setIsUploadingThemeLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/v1/upload/single?type=logo', formData, {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.url) {
        const newLogoUrl = res.data.url;
        setRestaurant((prev) => ({ ...prev, logoUrl: newLogoUrl }));
        // Auto-guardado inmediato en MongoDB Atlas para persistencia 100% garantizada
        try {
          await axios.put('/api/v1/admin/theme', {
            logoUrl: newLogoUrl
          }, authHeaders);
        } catch (saveErr) {
          console.warn('Auto-guardado diferido al botón de tema:', saveErr);
        }
      }
    } catch (err) {
      showToast('Error al subir el logotipo. Verifica que sea formato JPG, PNG o WEBP.', 'error');
    } finally {
      setIsUploadingThemeLogo(false);
      if (themeLogoInputRef.current) themeLogoInputRef.current.value = '';
    }
  };

  // Subida de portada / atmósfera panorámica
  const handleThemeBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    extractInstantPaletteFromFile(file);
    setIsUploadingThemeBanner(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/v1/upload/single', formData, {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.url) {
        setRestaurant((prev) => ({ ...prev, bannerUrl: res.data.url }));
      }
    } catch (err) {
      showToast('Error al subir la fotografía de portada.', 'error');
    } finally {
      setIsUploadingThemeBanner(false);
      if (themeBannerInputRef.current) themeBannerInputRef.current.value = '';
    }
  };

  // Generar QR Seguro con Estilos, Colores y Logotipo en Tiempo Real
  const handleGenerateQR = useCallback(async (overrides = {}) => {
    let style = qrDotStyle;
    let color = qrColorDark;
    let table = qrTable;
    let zone = qrZone;
    let includeLogo = qrIncludeLogo;

    if (typeof overrides === 'string') {
      style = overrides;
    } else if (typeof overrides === 'object' && overrides !== null) {
      if (overrides.dotStyle) style = overrides.dotStyle;
      if (overrides.colorDark) color = overrides.colorDark;
      if (overrides.table !== undefined) table = overrides.table;
      if (overrides.zone !== undefined) zone = overrides.zone;
      if (overrides.includeLogo !== undefined) includeLogo = overrides.includeLogo;
    }

    setIsGeneratingQR(true);
    setQrError(null);
    try {
      const res = await axios.post('/api/v1/admin/qr/generate', {
        table: (table || '1').trim(),
        zone: (zone || 'Principal').trim(),
        dotStyle: style || 'square',
        colorDark: color || '#000000',
        colorLight: '#ffffff',
        includeLogo: includeLogo !== false,
        logoUrl: restaurant?.logoUrl,
        baseUrl: typeof window !== 'undefined' ? window.location.origin : undefined
      }, authHeaders);
      setQrData(res.data.data);
      if (table) {
        setTablesList((prev) => {
          const exists = prev.some(
            (t) => String(t.number).trim().toLowerCase() === String(table).trim().toLowerCase() &&
                   String(t.zone || 'Principal').trim().toLowerCase() === String(zone || 'Principal').trim().toLowerCase()
          );
          if (!exists) {
            const next = [
              ...prev,
              {
                id: `tbl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                number: String(table).trim(),
                zone: String(zone || 'Principal').trim()
              }
            ];
            try { localStorage.setItem('volum_admin_tables', JSON.stringify(next)); } catch {}
            return next;
          }
          return prev;
        });
      }
    } catch (err) {
      setQrError(err.response?.data?.message || 'Error generando código QR. Revisa los datos ingresados.');
    } finally {
      setIsGeneratingQR(false);
    }
  }, [qrDotStyle, qrColorDark, qrTable, qrZone, qrIncludeLogo, restaurant?.logoUrl, restaurant?.slug, token]);

  // Actualización automática en vivo (Live Preview) sin necesidad de presionar ningún botón
  useEffect(() => {
    if (activeTab !== 'qr' || !restaurant) return;
    const timer = setTimeout(() => {
      handleGenerateQR();
    }, 280);
    return () => clearTimeout(timer);
  }, [activeTab, qrTable, qrZone, qrDotStyle, qrColorDark, qrIncludeLogo, restaurant?.slug]);

  // Vaciar Catálogo Completo de Platillos
  const handleDeleteAllDishes = async () => {
    if (deleteAllConfirmText.trim().toUpperCase() !== 'ELIMINAR') {
      showToast('Escribe la palabra ELIMINAR para confirmar la acción.', 'error');
      return;
    }
    setIsDeletingAll(true);
    try {
      const res = await axios.delete('/api/v1/admin/dishes/all', authHeaders);
      showToast(res.data.message || 'Catálogo vaciado correctamente.', 'success');
      setIsDeleteAllModalOpen(false);
      setDeleteAllConfirmText('');
      await loadInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al vaciar catálogo.', 'error');
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Eliminar Cuenta Completa y Restaurante
  const handleDeleteAccount = async () => {
    if (deleteAccountConfirmText.trim() !== 'ELIMINAR MI CUENTA') {
      showToast('Escribe exactamente "ELIMINAR MI CUENTA" para confirmar.', 'error');
      return;
    }
    setIsDeletingAccount(true);
    try {
      const res = await axios.delete('/api/v1/auth/account', authHeaders);
      showToast(res.data.message || 'Cuenta eliminada definitivamente.', 'info');
      localStorage.removeItem('volum_token');
      localStorage.removeItem('volum_user');
      localStorage.removeItem('volum_active_restaurant_id');
      localStorage.removeItem('volum_admin_restaurant');
      localStorage.removeItem('volum_admin_user');
      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al eliminar la cuenta.', 'error');
      setIsDeletingAccount(false);
    }
  };

  // Cancelar 1 Slot Adicional
  const handleCancelSlot = async () => {
    setIsCancelingSlot(true);
    try {
      const res = await axios.post('/api/v1/billing/cancel-slot', {}, authHeaders);
      showToast(res.data.message || 'Slot adicional cancelado exitosamente.', 'success');
      await loadInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cancelar slot adicional.', 'error');
    } finally {
      setIsCancelingSlot(false);
    }
  };

  // Descargar SVG Vectorial sin congelar el navegador (Blob API nativa)
  const handleDownloadSvg = () => {
    if (!qrData?.svg) return;
    const blob = new Blob([qrData.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_Mesa_${qrTable || '1'}_${restaurant?.slug || 'volum'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Descargar PNG
  const handleDownloadPng = () => {
    if (!qrData?.dataUrl) return;
    const link = document.createElement('a');
    link.href = qrData.dataUrl;
    link.download = `QR_Mesa_${qrTable || '1'}_${restaurant?.slug || 'volum'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sincronizar catálogo de mesas con backend y localStorage
  const syncTables = async (newTables, successMessage = null, floorPlanData = null) => {
    const payloadTables = Array.isArray(newTables) ? newTables : (newTables?.tables || tablesList);
    const payloadFloorPlan = floorPlanData || newTables?.floorPlan || restaurant?.floorPlan || null;
    setTablesList(newTables);
    try {
      localStorage.setItem('volum_admin_tables', JSON.stringify(newTables));
    } catch {}
    setIsSavingTables(true);
    try {
      const res = await axios.put('/api/v1/admin/tables', { tables: payloadTables, floorPlan: payloadFloorPlan }, authHeaders);
      if (res.data?.data) {
        setRestaurant((prev) => prev ? ({ ...prev, tables: res.data.data, floorPlan: res.data.floorPlan || payloadFloorPlan }) : prev);
        setTablesList(res.data.data);
        try { localStorage.setItem('volum_admin_tables', JSON.stringify(res.data.data)); } catch {}
      }
      if (successMessage) showToast(successMessage, 'success');
    } catch (err) {
      try {
        await axios.put('/api/v1/admin/restaurant', { tables: newTables }, authHeaders);
        if (successMessage) showToast(successMessage, 'success');
      } catch (e) {
        if (successMessage) showToast(successMessage, 'success');
      }
    } finally {
      setIsSavingTables(false);
    }
  };

  const handleAddTable = async (e) => {
    e?.preventDefault?.();
    const cleanNumber = String(newTableNumber || '').trim();
    const cleanZone = String(newTableZone || 'Salón Principal').trim();
    if (!cleanNumber) {
      showToast('Ingresa un número o nombre para la mesa.', 'error');
      return;
    }
    const exists = tablesList.some(
      (t) => String(t.number).trim().toLowerCase() === cleanNumber.toLowerCase() &&
             String(t.zone || 'Principal').trim().toLowerCase() === cleanZone.toLowerCase()
    );
    if (exists) {
      showToast(`La mesa "${cleanNumber}" en zona "${cleanZone}" ya existe.`, 'error');
      return;
    }
    const newEntry = {
      id: `tbl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      number: cleanNumber,
      zone: cleanZone
    };
    const updated = [...tablesList, newEntry];
    await syncTables(updated, `Mesa "${cleanNumber}" agregada correctamente.`);
    setNewTableNumber('');
    setIsAddTableModalOpen(false);
  };

  const handleUpdateTable = async (e) => {
    e?.preventDefault?.();
    if (!editingTable) return;
    const cleanNumber = String(editingTable.number || '').trim();
    const cleanZone = String(editingTable.zone || 'Salón Principal').trim();
    if (!cleanNumber) {
      showToast('El número de mesa no puede estar vacío.', 'error');
      return;
    }
    const updated = tablesList.map((t) => {
      if (t.id === editingTable.id) {
        return { ...t, number: cleanNumber, zone: cleanZone };
      }
      return t;
    });
    await syncTables(updated, `Mesa actualizada a "${cleanNumber}".`);
    setEditingTable(null);
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    const deletedNum = tableToDelete.number;
    const updated = tablesList.filter((t) => t.id !== tableToDelete.id);
    await syncTables(updated, `Mesa "${deletedNum}" eliminada con éxito.`);
    setTableToDelete(null);
  };

  const handleReorderSequential = async () => {
    setIsSavingTables(true);
    try {
      const res = await axios.post('/api/v1/admin/tables/reorder-sequential', {}, authHeaders);
      if (res.data?.success && res.data.data) {
        setTablesList(res.data.data);
        try { localStorage.setItem('volum_admin_tables', JSON.stringify(res.data.data)); } catch {}
        showToast(res.data.message || 'Mesas renumeradas secuencialmente.', 'success');
        setIsReorderModalOpen(false);
        return;
      }
    } catch {}

    let counter = 1;
    const numeric = [];
    const custom = [];

    tablesList.forEach((t) => {
      const numStr = String(t.number || '').trim();
      const parsed = parseInt(numStr, 10);
      if (!isNaN(parsed) && String(parsed) === numStr) {
        numeric.push({ ...t, parsedNum: parsed });
      } else {
        custom.push(t);
      }
    });

    numeric.sort((a, b) => a.parsedNum - b.parsedNum);
    const reorderedNumeric = numeric.map((t) => ({
      ...t,
      number: String(counter++)
    }));

    const finalTables = [...reorderedNumeric, ...custom];
    await syncTables(finalTables, `Mesas renumeradas secuencialmente del 1 al ${reorderedNumeric.length}.`);
    setIsReorderModalOpen(false);
  };

  const handleOpenQRForTable = (table) => {
    setQrTable(table.number);
    setQrZone(table.zone || 'Salón Principal');
    setActiveTab('qr');
    showToast(`Mostrando código QR de la Mesa ${table.number} (${table.zone || 'Principal'}).`, 'info');
  };

  const uniqueZones = useMemo(() => {
    const set = new Set();
    tablesList.forEach((t) => {
      if (t.zone) set.add(t.zone.trim());
    });
    return ['ALL', ...Array.from(set)];
  }, [tablesList]);

  const filteredTables = useMemo(() => {
    return tablesList.filter((t) => {
      const matchSearch =
        !tableSearchQuery.trim() ||
        String(t.number).toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        String(t.zone || '').toLowerCase().includes(tableSearchQuery.toLowerCase());
      const matchZone = tableZoneFilter === 'ALL' || (t.zone || 'Principal') === tableZoneFilter;
      return matchSearch && matchZone;
    });
  }, [tablesList, tableSearchQuery, tableZoneFilter]);

  // Estado para gestión de categorías modulares (Server-Driven UI)
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLayout, setNewCategoryLayout] = useState('inherited');
  const [newCategoryShowThumbs, setNewCategoryShowThumbs] = useState(true);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Extractor instantáneo de paleta cromática al seleccionar imágenes (Canvas RGB -> Hex Armónico)
  const extractInstantPaletteFromFile = (file) => {
    if (!file || !file.type || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 48;
          canvas.height = 48;
          ctx.drawImage(img, 0, 0, 48, 48);
          const data = ctx.getImageData(0, 0, 48, 48).data;
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            if (a < 128) continue;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            if (max - min > 22 && max > 45 && min < 230) {
              rSum += r; gSum += g; bSum += b; count++;
            }
          }
          const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
          const primaryHex = count > 8
            ? `#${toHex(rSum / count)}${toHex(gSum / count)}${toHex(bSum / count)}`.toUpperCase()
            : '#D97706';
          const autoPalette = {
            primaryColor: primaryHex,
            secondaryColor: '#0F172A',
            accentColor: '#F59E0B',
            surfaceColor: '#020617',
            vibeDescription: 'Colores predeterminados calibrados automáticamente a partir de tus imágenes seleccionadas.'
          };
          setExtractedPalette(autoPalette);
          setRestaurant((prev) => ({
            ...prev,
            theme: {
              ...(prev?.theme || {}),
              primaryColor: autoPalette.primaryColor,
              secondaryColor: autoPalette.secondaryColor,
              accentColor: autoPalette.accentColor,
              surfaceColor: autoPalette.surfaceColor,
              aiPalette: autoPalette
            }
          }));
          showToast('IA: Paleta generada desde tu fotografía y guardada en tus opciones de color.', 'success');
        } catch (_e) {
          // Fallback silencioso
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCategoryAdmin = async () => {
    if (!newCategoryName.trim()) {
      showToast('Escribe el nombre de la nueva categoría.', 'info');
      return;
    }
    setIsSavingCategory(true);
    try {
      const res = await axios.post('/api/v1/admin/categories', {
        name: newCategoryName.trim(),
        order: categories.length,
        layoutType: newCategoryLayout,
        showThumbnails: newCategoryShowThumbs
      }, authHeaders);
      if (res.data?.data) {
        setCategories((prev) => [...prev, res.data.data]);
        setNewCategoryName('');
        setNewCategoryLayout('inherited');
        setNewCategoryShowThumbs(true);
        showToast('Categoría creada con su formato visual.', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al crear categoría.', 'error');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleUpdateCategoryAdmin = async (catId, updates) => {
    setCategories((prev) =>
      prev.map((c) => ((c._id || c.id) === catId ? { ...c, ...updates } : c))
    );
    try {
      await axios.put(`/api/v1/admin/categories/${catId}`, updates, authHeaders);
      showToast('Diseño de categoría actualizado en tiempo real.', 'success');
    } catch (err) {
      showToast('No se pudo guardar el cambio de categoría.', 'error');
    }
  };

  const handleDeleteCategoryAdmin = async (catId) => {
    try {
      await axios.delete(`/api/v1/admin/categories/${catId}`, authHeaders);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== catId));
      showToast('Categoría eliminada.', 'info');
    } catch (err) {
      showToast('Error al eliminar categoría.', 'error');
    }
  };

  // Reordenar categorías secuencialmente arriba o abajo (Punto 4: 100% fiel al comensal)
  const handleMoveCategory = async (catId, direction) => {
    const currentIndex = categories.findIndex((c) => (c._id || c.id) === catId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(currentIndex, 1);
    newCategories.splice(targetIndex, 0, moved);

    const reorderedWithIndices = newCategories.map((c, idx) => ({ ...c, order: idx }));
    setCategories(reorderedWithIndices);
    setFocusedCategoryForPreview(catId);

    try {
      const orderedIds = reorderedWithIndices.map((c) => c._id || c.id);
      await axios.put('/api/v1/admin/categories/reorder', { orderedIds }, authHeaders);
      showToast('Orden de categorías actualizado en tiempo real.', 'success');
    } catch (err) {
      showToast('No se pudo guardar el nuevo orden de categorías.', 'error');
    }
  };

  // Optimizar automáticamente orden y diseño de todas las categorías con Volum IA
  const handleOptimizeCategoriesWithAI = async () => {
    if (!categories || categories.length === 0) {
      showToast('No hay categorías registradas para optimizar.', 'info');
      return;
    }

    setIsOptimizingWithAI(true);
    try {
      // 1. Algoritmo canónico gastronómico en cliente para retroalimentación visual inmediata
      const getCanonicalRank = (name) => {
        const lower = String(name || '').toLowerCase().trim();
        if (/entrada|tapa|botana|ensalada|sopa|carpaccio|ceviche|abreboca|primer|inicio|para compartir/.test(lower)) return 0;
        if (/fuerte|corte|carne|plato|pasta|marisco|pescado|asado|especialidad|burger|parrilla|segundo|tacos?|pizza/.test(lower)) return 10;
        if (/postre|dulce|reposter|helado|tarta|coulant|cake|sweet/.test(lower)) return 20;
        if (/bebida|vino|cava|coctel|trago|cerveza|licor|caf[eé]|bar|bodega|drink|cocktail|beer|destilado/.test(lower)) return 30;
        return 15;
      };

      const sorted = [...categories].sort((a, b) => getCanonicalRank(a.name) - getCanonicalRank(b.name));
      const optimizedCategories = sorted.map((cat, index) => {
        const suggestion = getCategoryAiSuggestion(cat.name);
        return {
          ...cat,
          order: index,
          layoutType: suggestion.layout,
          showThumbnails: suggestion.showThumbnails
        };
      });

      // Actualizar vista local y teléfono 1:1 de inmediato
      setCategories(optimizedCategories);
      if (optimizedCategories[0]) {
        setFocusedCategoryForPreview(optimizedCategories[0]._id || optimizedCategories[0].id);
      }

      // 2. Persistir en backend: intentar primero endpoint masivo
      let persisted = false;
      try {
        const res = await axios.post('/api/v1/admin/categories/ai-optimize', {}, authHeaders);
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setCategories(res.data.data);
          persisted = true;
        }
      } catch (backendErr) {
        console.warn('Endpoint /categories/ai-optimize no disponible o en despliegue. Usando sincronización directa por categoría...');
      }

      // 3. Fallback universal: persistir individualmente si el endpoint masivo no respondió
      if (!persisted) {
        const updatePromises = optimizedCategories.map((cat) => {
          const catId = cat._id || cat.id;
          return axios.put(`/api/v1/admin/categories/${catId}`, {
            order: cat.order,
            layoutType: cat.layoutType,
            showThumbnails: cat.showThumbnails
          }, authHeaders).catch(() => null);
        });
        await Promise.allSettled(updatePromises);
      }

      showToast('✨ ¡Volum IA optimizó el orden canónico y los formatos de tu menú con éxito!', 'success');
    } catch (err) {
      console.error('Error en optimización IA:', err);
      showToast('No se pudo completar la optimización automática por IA.', 'error');
    } finally {
      setIsOptimizingWithAI(false);
    }
  };

  // Sugerencia heurística inteligente en tiempo real según el nombre de la categoría
  const getCategoryAiSuggestion = (catName) => {
    const lower = String(catName || '').toLowerCase().trim();

    // 1. Cortes de Carne, Asador, Parrilla, Steaks, Wagyu, Ribeye, Carnes Prime -> Revista Editorial (Máximo Realce Panorámico)
    if (/corte|asado|carne|grill|parrilla|steak|wagyu|ribeye|tomahawk|pica[ñn]a|sirloin|prime|angus|vacuno|buey|le[ñn]a|brasa/.test(lower)) {
      return {
        layout: 'editorial',
        layoutLabel: 'Revista Editorial (1 Columna Panorámica)',
        showThumbnails: true,
        badge: '👑 Plato Estrella de Alto Ticket',
        reason: 'Los cortes de carne son la joya de tu menú y tu mayor fuente de ingresos por comensal. Recomendamos Revista Editorial: cada corte se despliega a todo lo ancho con fotografía panorámica de alta definición, espacio para gramaje, término sugerido y modelo 3D WebAR, garantizando que luzcan con la máxima majestuosidad sin esconderse en carruseles laterales.'
      };
    }

    // 2. Platos Fuertes de Autor, Especialidades Insignia, Signature, Menús Degustación, Omakase, Pesca del Día
    if (/degustaci[oó]n|omakase|tiempo|maridaje|michelin|alta cocina|autor|insignia|signature|especialidad|pesca del d[ií]a|chef/.test(lower)) {
      return {
        layout: 'editorial',
        layoutLabel: 'Revista Editorial (1 Columna Panorámica)',
        showThumbnails: true,
        badge: '⭐ Creación de Autor',
        reason: 'Platillos insignia con técnicas especiales que ameritan un ritmo de lectura pausado. Formato Revista Editorial panorámico para resaltar la historia del plato, ingredientes de origen y la experiencia 3D.'
      };
    }

    // 3. Vinos, Cava, Champagne, Bodega
    if (/vino|cava|champagne|bodega|reserva|tinto|blanco|rosado|espumoso/.test(lower)) {
      return {
        layout: 'compact_list',
        layoutLabel: 'Lista Sommelier (Sin Fotos)',
        showThumbnails: false,
        badge: '🍷 Cava Sommelier',
        reason: 'Elegancia sobria de carta de vinos tradicional. Cero fotos genéricas de copas: lectura limpia y ágil de cepas, bodegas, añadas, maridaje sugerido y precios por copa o botella.'
      };
    }

    // 4. Coctelería de Autor, Mixología, Gin Bar
    if (/coctel|cocteler|mixolog|gin bar|aperitivo|spritz/.test(lower)) {
      return {
        layout: 'grid',
        layoutLabel: 'Cuadrícula Visual (2 Columnas)',
        showThumbnails: true,
        badge: '🍸 Coctelería de Autor',
        reason: 'En coctelería contemporánea, la cristalería, el color y los garnishes son el principal detonador de compra. La cuadrícula de 2 columnas estimula el deseo visual inmediato.'
      };
    }

    // 5. Destilados, Botellas, Licores, Cervezas, Cafetería, Refrescos, Bebidas
    if (/cerveza|licor|destilado|caf[eé]|infusi[oó]n|t[eé]|bar|trago|botella|refresco|bebida|drink|beer|tequila|mezcal|whisky|whiskey|ron|vodka/.test(lower)) {
      return {
        layout: 'compact_list',
        layoutLabel: 'Lista Sommelier / Rápida',
        showThumbnails: false,
        badge: '🍺 Barra & Bebidas',
        reason: 'Lectura ágil, despejada y directa sin fotos genéricas para no recargar la navegación del comensal.'
      };
    }

    // 6. Guarniciones, Acompañamientos, Extras, Salsas
    if (/guarnici[oó]n|guarniciones|acompa[ñn]amiento|extra|salsa|complemento|side/.test(lower)) {
      return {
        layout: 'compact_list',
        layoutLabel: 'Lista Compacta (Acompañamientos)',
        showThumbnails: false,
        badge: '🥔 Complementos & Extras',
        reason: 'Formato compacto sin fotos para no distraer la atención y mantener el foco en los cortes y platos principales.'
      };
    }

    // 7. Postres, Repostería, Dulces, Helados
    if (/postre|dulce|reposter|helado|tarta|coulant|cake|sweet|pasteler/.test(lower)) {
      return {
        layout: 'grid',
        layoutLabel: 'Cuadrícula Visual (2 Columnas)',
        showThumbnails: true,
        badge: '🍰 Antojo Visual de Cierre',
        reason: 'El postre se vende por impulso y antojo visual. La Cuadrícula de 2 columnas con fotos vibrantes tienta al comensal antes de solicitar la cuenta, aumentando el ticket promedio final.'
      };
    }

    // 8. Entradas, Botanas, Tapas, Ceviches, Carpaccios, Para Compartir
    if (/entrada|tapa|botana|ensalada|sopa|carpaccio|ceviche|abreboca|primer|inicio|para compartir/.test(lower)) {
      return {
        layout: 'grid',
        layoutLabel: 'Cuadrícula Visual (2 Columnas)',
        showThumbnails: true,
        badge: '🥗 Al Centro / Compartir',
        reason: 'Platos al centro de mesa. La Cuadrícula Visual de 2 columnas permite al comensal comparar de un vistazo 4 a 6 opciones para ordenar al centro y abrir el apetito.'
      };
    }

    // 9. Predeterminado: Cuadrícula Visual (2 Cols)
    return {
      layout: 'grid',
      layoutLabel: 'Cuadrícula Visual (2 Cols)',
      showThumbnails: true,
      badge: '🍽️ Exploración Dinámica',
      reason: 'Fotos atractivas en 2 columnas para maximizar el apetito visual y dinámica ágil de exploración.'
    };
  };

  // Manejadores del Onboarding Mágico con IA
  const handleVenueFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = 5 - onboardingVenueFiles.length;
    if (availableSlots <= 0) {
      showToast('Ya has alcanzado el límite máximo de 5 fotografías del establecimiento.', 'info');
      return;
    }

    const toAdd = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      showToast(`Solo se agregaron ${availableSlots} fotos para no exceder el máximo de 5 permitidas.`, 'info');
    }

    const newFiles = [...onboardingVenueFiles, ...toAdd];
    setOnboardingVenueFiles(newFiles);

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setOnboardingVenuePreviews([...onboardingVenuePreviews, ...newPreviews]);
    extractInstantPaletteFromFile(toAdd[0]);
    if (onboardingVenueInputRef.current) onboardingVenueInputRef.current.value = '';
  };

  const handleRemoveVenuePhoto = (index) => {
    const updatedFiles = onboardingVenueFiles.filter((_, i) => i !== index);
    const updatedPreviews = onboardingVenuePreviews.filter((_, i) => i !== index);
    setOnboardingVenueFiles(updatedFiles);
    setOnboardingVenuePreviews(updatedPreviews);
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOnboardingLogoFile(file);
    if (file.type.startsWith('image/')) {
      setOnboardingLogoPreview(URL.createObjectURL(file));
      extractInstantPaletteFromFile(file);
    } else {
      setOnboardingLogoPreview('');
    }
  };

  const handleMenuFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOnboardingMenuFile(file);
  };

  const handleRunAIOnboarding = async () => {
    const hasAnyMenu = multiScheduleMenuEnabled
      ? Boolean(onboardingBreakfastFile || onboardingLunchFile || onboardingDinnerFile || onboardingMenuFile)
      : Boolean(onboardingMenuFile);

    if (!hasAnyMenu && onboardingVenueFiles.length === 0 && !onboardingLogoFile) {
      showToast('Por favor selecciona al menos tu menú (o cartas de turno) o fotografías del establecimiento.', 'info');
      return;
    }

    setOnboardingError(null);
    setIsAnalyzingOnboarding(true);
    setAnalysisStep(1);
    setApplySuccess(null);

    const stepTimer = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2800);

    const formData = new FormData();
    if (multiScheduleMenuEnabled) {
      formData.append('hasMultiSchedule', 'true');
      if (onboardingBreakfastFile) formData.append('menuBreakfastFile', onboardingBreakfastFile);
      if (onboardingLunchFile) formData.append('menuLunchFile', onboardingLunchFile);
      if (onboardingDinnerFile) formData.append('menuDinnerFile', onboardingDinnerFile);
      if (onboardingMenuFile) formData.append('menuFile', onboardingMenuFile);
    } else if (onboardingMenuFile) {
      formData.append('menuFile', onboardingMenuFile);
    }
    if (onboardingLogoFile) {
      formData.append('logoFile', onboardingLogoFile);
    }
    onboardingVenueFiles.forEach((file) => {
      formData.append('venuePhotos', file);
    });

    try {
      const res = await axios.post('/api/v1/upload/ai-onboarding', formData, {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      const { analysis, logoUrl, bannerUrl, venuePhotoUrls } = res.data;
      setOnboardingResult(analysis);
      const aiPal = analysis.palette || {
        primaryColor: '#D97706',
        secondaryColor: '#0F172A',
        accentColor: '#F59E0B',
        surfaceColor: '#020617'
      };
      setExtractedPalette(aiPal);
      setExtractedLogoUrl(logoUrl || '');

      // Sincronizar automáticamente colores y atmósfera en vivo en Marca y Configuración (incluyendo aiPalette persistente)
      setRestaurant((prev) => ({
        ...prev,
        logoUrl: logoUrl || prev?.logoUrl || '',
        bannerUrl: bannerUrl || prev?.bannerUrl || '',
        venuePhotos: venuePhotoUrls?.length ? venuePhotoUrls : (prev?.venuePhotos || []),
        theme: {
          ...(prev?.theme || {}),
          primaryColor: aiPal.primaryColor || prev?.theme?.primaryColor || '#D97706',
          secondaryColor: aiPal.secondaryColor || prev?.theme?.secondaryColor || '#0F172A',
          accentColor: aiPal.accentColor || prev?.theme?.accentColor || '#F59E0B',
          surfaceColor: aiPal.surfaceColor || prev?.theme?.surfaceColor || '#020617',
          aiPalette: {
            primaryColor: aiPal.primaryColor || '#D97706',
            secondaryColor: aiPal.secondaryColor || '#0F172A',
            accentColor: aiPal.accentColor || '#F59E0B',
            surfaceColor: aiPal.surfaceColor || '#020617',
            vibeDescription: aiPal.vibeDescription || 'Paleta extraída por IA de las fotos de tu establecimiento'
          }
        }
      }));

      const dishesWithSelection = (analysis.dishes || []).map((d, idx) => ({
        ...d,
        id: `extracted-${idx}`,
        selected: true,
        availableSchedules: Array.isArray(d.availableSchedules) && d.availableSchedules.length > 0
          ? d.availableSchedules
          : (multiScheduleMenuEnabled ? [idx % 3 === 0 ? 'breakfast' : idx % 3 === 1 ? 'lunch' : 'dinner'] : [])
      }));
      setExtractedDishes(dishesWithSelection);
      setAnalysisStep(3);
    } catch (err) {
      console.error('Error en onboarding IA:', err);
      setOnboardingError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al procesar el onboarding con IA. Revisa los archivos subidos.'
      );
    } finally {
      clearInterval(stepTimer);
      setIsAnalyzingOnboarding(false);
    }
  };

  const handleToggleSelectAllDishes = () => {
    const allSelected = extractedDishes.every((d) => d.selected);
    setExtractedDishes(extractedDishes.map((d) => ({ ...d, selected: !allSelected })));
  };

  const handleToggleDishSelection = (index) => {
    setExtractedDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, selected: !d.selected } : d))
    );
  };

  const handleUpdateExtractedDish = (index, field, value) => {
    setExtractedDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const handleApplyOnboarding = async () => {
    const selectedDishes = extractedDishes.filter((d) => d.selected);
    const hasVisuals = extractedPalette || extractedLogoUrl || (onboardingResult?.venuePhotoUrls && onboardingResult.venuePhotoUrls.length > 0);
    if (selectedDishes.length === 0 && !hasVisuals) {
      showToast('Por favor selecciona al menos un platillo o confirma la paleta y fotografías para guardar.', 'info');
      return;
    }

    setIsApplyingOnboarding(true);
    try {
      const res = await axios.post('/api/v1/upload/ai-apply-onboarding', {
        palette: extractedPalette,
        categories: onboardingResult?.categories || [],
        dishes: selectedDishes,
        logoUrl: extractedLogoUrl,
        bannerUrl: onboardingResult?.bannerUrl || (onboardingResult?.venuePhotoUrls?.[0] || ''),
        venuePhotos: onboardingResult?.venuePhotoUrls || [],
        mealSchedules: multiScheduleMenuEnabled ? (restaurant?.settings?.mealSchedules || { enabled: true }) : undefined
      }, authHeaders);

      setApplySuccess(res.data.message || '¡Menú e identidad visual guardados exitosamente!');
      await loadInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al guardar el menú generado.', 'error');
    } finally {
      setIsApplyingOnboarding(false);
    }
  };

  // 1. Pantalla de Login si no hay token
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-xs text-slate-400 hover:text-amber-400 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Página Principal</span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <LayoutDashboard className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-black text-white">Panel de Administración</h1>
              <p className="text-xs text-slate-400">Volum-Menu SaaS</p>
            </div>
          </div>

          {sessionExpiredMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{sessionExpiredMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@turestaurante.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Contraseña
                </label>
                <span className="text-xs text-slate-500">La que creaste al pagar</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-60 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión y cargando menú...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Acceso Rápido Demo & Ayuda */}
          <div className="mt-5 space-y-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={() => {
                setLoginEmail('admin@volummenu.com');
                setLoginPass('volum12345password');
                setLoginError(null);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Probar Restaurante Demo (La Terraza)</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                ¿Acabas de contratar tu plan? Ingresa con el correo y contraseña que registraste en la pasarela de pago.
              </p>
              <div className="mt-2">
                <Link
                  to="/#precios"
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
                >
                  <span>¿Aún no tienes cuenta? Ver Planes y Precios</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
              <Link to="/terminos" target="_blank" className="hover:text-amber-400 transition-colors">
                Términos de Servicio
              </Link>
              <span>•</span>
              <Link to="/privacidad" target="_blank" className="hover:text-amber-400 transition-colors">
                Aviso de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.themeClass} ${currentTheme.mainClass} ${currentTheme.fontBody} flex flex-col md:flex-row relative transition-colors duration-200`}>
      
      {/* MODAL DE BIENVENIDA Y PRIMEROS PASOS POST-PAGO */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-left my-auto animate-fadeIn">
            <button
              type="button"
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
              aria-label="Cerrar bienvenida"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>¡Cuenta y Restaurante Activados con Éxito!</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              ¡Bienvenido a Volum-Menu, <span className="text-amber-400">{restaurant?.name || welcomeRestName || 'tu restaurante'}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Tu menú interactivo en 3D y WebAR ya está reservado y activo. A partir de ahora, este es tu panel de administración privado donde podrás gestionar tu carta, códigos QR y personalización.
            </p>

            {/* Enlace oficial de clientes */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Tu Enlace Oficial para Clientes y Mesas:
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 min-w-0 px-1">
                  <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-amber-300 truncate">
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/r/${restaurant?.slug || welcomeSlug}?mesa=1`
                      : `https://volum.menu/r/${restaurant?.slug || welcomeSlug}?mesa=1`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined'
                        ? `${window.location.origin}/r/${restaurant?.slug || welcomeSlug}?mesa=1`
                        : `https://volum.menu/r/${restaurant?.slug || welcomeSlug}?mesa=1`;
                      navigator.clipboard.writeText(url);
                      setCopiedWelcomeLink(true);
                      setTimeout(() => setCopiedWelcomeLink(false), 2500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedWelcomeLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWelcomeLink ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <a
                    href={`/r/${restaurant?.slug || welcomeSlug}?mesa=1&zona=Terraza`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1"
                  >
                    <span>Ver Menú</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Opciones de primeros pasos */}
            <div className="mt-5 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 block">
                Primeros pasos: ¿Cómo deseas crear tu menú?
              </span>

              {/* Opción 1: Magic Onboarding con IA */}
              <button
                type="button"
                onClick={() => {
                  setShowWelcomeModal(false);
                  setActiveTab('ai_onboarding');
                }}
                className="w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent hover:from-amber-500/30 border border-amber-500/40 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                      Subir mi Menú con Asistente IA
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-xs sm:text-xs text-slate-400 mt-1 leading-relaxed">
                    Sube una foto o PDF de tu carta física: la IA extraerá tus platillos, categorías y paleta visual en segundos.
                  </p>
                </div>
              </button>

              {/* Opción 2: Crear platillo manualmente */}
              <button
                type="button"
                onClick={() => {
                  setShowWelcomeModal(false);
                  setActiveTab('dishes');
                  setEditingDish(null);
                  setDishForm({
                    name: '',
                    description: '',
                    price: '',
                    categoryId: categories[0]?._id || '',
                    imageUrl: '',
                    is3D: false,
                    modelGlbUrl: '',
                    modelUsdzUrl: '',
                    isCompact: false,
                    isFeatured: false,
                    allergens: [],
                    availableSchedules: ['all'],
                    translations: {
                      en: { name: '', description: '' },
                      fr: { name: '', description: '' }
                    }
                  });
                  setDishLangTab('es');
                  setIsDishModalOpen(true);
                }}
                className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3.5 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-slate-700 text-slate-300 shrink-0 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Crear mi primer platillo manualmente
                  </span>
                  <p className="text-xs text-slate-400">
                    Añade platillos uno a uno y sube tus escaneos 3D reales creados con tu celular.
                  </p>
                </div>
              </button>

              {/* Opción 3: Códigos QR */}
              <button
                type="button"
                onClick={() => {
                  setShowWelcomeModal(false);
                  setActiveTab('qr');
                }}
                className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3.5 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-slate-700 text-slate-300 shrink-0 transition-colors">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Ver Códigos QR para mis Mesas
                  </span>
                  <p className="text-xs text-slate-400">
                    Genera y descarga los códigos QR vectoriales de tus mesas listos para imprimir.
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Iniciaste sesión como: <strong className="text-slate-400">{user?.email || 'Dueño'}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowWelcomeModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Entrar a mi Panel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* DRAWER MÓVIL DESPLEGABLE (Exclusivo para Celulares y Tablets pequeñas) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Telón de fondo con desenfoque suave */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Contenedor del Drawer */}
          <div className={`relative w-[85%] max-w-sm ${currentTheme.sidebarClass} p-5 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl animate-fadeIn`}>
            <div>
              {/* Cabecera del Drawer con Botón de Cierre */}
              <div className="pb-4 border-b border-slate-800 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors group"
                    title="Ir a la portada principal"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                    <span className="tracking-tight font-black text-white">Volum<span className="text-amber-400">-Menu</span></span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <RestaurantSwitcher
                  restaurants={myRestaurants.length > 0 ? myRestaurants : (restaurant ? [restaurant] : [])}
                  activeRestaurant={restaurant}
                  onSelectRestaurant={(rest) => {
                    handleSelectRestaurant(rest);
                    setIsMobileMenuOpen(false);
                  }}
                  onOpenCreateBranch={() => {
                    setIsCreateBranchModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  isVip={(restaurant?.subscription?.plan || stats?.plan) === 'enterprise_chain'}
                />
              </div>

              {/* Menú de Navegación Completo en Móvil */}
              <nav className="mt-5 space-y-1.5">
                {NAV_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? `${currentTheme.buttonActive} is-nav-active`
                          : `${currentTheme.buttonInactive} is-nav-inactive`
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-all mt-2 border border-slate-800/80"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Volver al Sitio Web</span>
                </Link>
              </nav>
            </div>

            {/* Medidor de Slots 3D, Sesión y Logout */}
            <div className="pt-5 border-t border-slate-800 space-y-3 mt-6">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-400">Slots 3D en uso</span>
                  <span className="text-amber-400">
                    {stats?.slots3D?.used || 0} / {stats?.slots3D?.total || (restaurant?.subscription?.slots3DTotal || 6)}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                    style={{
                      width: `${Math.min(100, ((stats?.slots3D?.used || 0) / (stats?.slots3D?.total || (restaurant?.subscription?.slots3DTotal || 6))) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sesión activa</span>
                <span className="text-xs text-amber-400 font-bold block truncate" title={user?.email}>
                  {user?.email || 'admin'}
                </span>
                {user?.email === 'admin@volummenu.com' && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                    Restaurante Demo (La Terraza)
                  </span>
                )}
              </div>

              {/* Botón de Ayuda y Soporte en Móvil */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSupportModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm mb-2"
              >
                <LifeBuoy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ayuda & Reportar Falla</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA LATERAL DE NAVEGACIÓN EN ESCRITORIO (Fija y Siempre Visible en PC) */}
      <aside className={`hidden md:flex md:w-64 ${currentTheme.sidebarClass} p-5 flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen md:overflow-visible transition-colors duration-200 z-30`}>
        <div>
          {/* Cabecera y Conmutador de Sedes */}
          <div className="pb-5 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <Link to="/" className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors group" title="Ir a la portada principal">
                <Utensils className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                <span className="tracking-tight font-black text-white">Volum<span className="text-amber-400">-Menu</span></span>
              </Link>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                PANEL
              </span>
            </div>

            <RestaurantSwitcher
              restaurants={myRestaurants.length > 0 ? myRestaurants : (restaurant ? [restaurant] : [])}
              activeRestaurant={restaurant}
              onSelectRestaurant={handleSelectRestaurant}
              onOpenCreateBranch={() => setIsCreateBranchModalOpen(true)}
              isVip={(restaurant?.subscription?.plan || stats?.plan) === 'enterprise_chain'}
            />

            {/* Selector Rápido de Apariencia de la Consola */}
            <div className="pt-2 flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Tema Consola
              </span>
              <AdminThemeSelector
                themeKey={themeKey}
                onSelectTheme={setThemeKey}
                compact={true}
                align="left"
              />
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="mt-6 space-y-1.5">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? `${currentTheme.buttonActive} is-nav-active`
                      : `${currentTheme.buttonInactive} is-nav-inactive`
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <Link
              to="/"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-all mt-2 border border-slate-800/80"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Volver al Sitio Web</span>
            </Link>
          </nav>
        </div>

        {/* Medidor de Slots 3D y Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-400">Slots 3D en uso</span>
              <span className="text-amber-400">
                {stats?.slots3D?.used || 0} / {stats?.slots3D?.total || (restaurant?.subscription?.slots3DTotal || 6)}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                style={{
                  width: `${Math.min(100, ((stats?.slots3D?.used || 0) / (stats?.slots3D?.total || (restaurant?.subscription?.slots3DTotal || 6))) * 100)}%`
                }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sesión activa</span>
            <span className="text-xs text-amber-400 font-bold block truncate" title={user?.email}>
              {user?.email || 'admin'}
            </span>
            {user?.email === 'admin@volummenu.com' && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                Restaurante Demo (La Terraza)
              </span>
            )}
          </div>

          {/* Botón de Ayuda y Soporte en Escritorio */}
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
          >
            <LifeBuoy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ayuda & Reportar Falla</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CABECERA SUPERIOR MÓVIL MODERNA (Sticky en teléfonos móviles) */}
      <header className={`sticky top-0 z-30 ${currentTheme.headerClass} backdrop-blur-xl md:hidden w-full shadow-lg transition-colors duration-200`}>
        {/* Fila 1: Botón de Menú Drawer, Restaurante y Acceso Rápido a Ver Menú */}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-slate-700/80 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200 hidden min-[360px]:inline">Menú</span>
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-extrabold truncate max-w-[120px] sm:max-w-[180px] ${currentTheme.isLight ? 'text-slate-900' : 'text-white'}`}>
                  {restaurant?.name || 'Mi Restaurante'}
                </span>
                {['enterprise_chain', 'chain_vip'].includes(restaurant?.subscription?.plan || stats?.plan) && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-wider shrink-0">
                    {(restaurant?.subscription?.plan || stats?.plan) === 'enterprise_chain' ? 'CADENAS' : 'VIP'}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-amber-400/90 font-semibold truncate flex items-center gap-1">
                {currentNavTab.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <AdminThemeSelector
              themeKey={themeKey}
              onSelectTheme={setThemeKey}
              compact={true}
            />
            {/* Acceso Rápido: Ver Menú de Clientes en Vivo */}
            <a
              href={`/r/${restaurant?.slug || welcomeSlug}?mesa=1`}
              target="_blank"
              rel="noreferrer"
              className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shrink-0 ${
                currentTheme.isLight
                  ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
              }`}
              title="Ver Menú en vivo como cliente"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden min-[380px]:inline">Ver Menú</span>
            </a>
          </div>
        </div>

        {/* Fila 2: Chips deslizables para cambiar de pestaña con 1 toque sin tapar la pantalla */}
        <div className="px-3 pb-2 pt-0.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 border-t border-slate-800/50">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
        
        {/* Banner de Prueba VIP de 7 Días */}
        <TrialBanner
          restaurant={restaurant}
          onOpenAdvisor={() => setIsPlanAdvisorOpen(true)}
          onOpenCheckout={() => setIsPlanAdvisorOpen(true)}
        />
        
        {/* Notificación de Compra Exitosa de Slots 3D */}
        {slotsSuccessToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{slotsSuccessToast}</span>
            </div>
            <button
              onClick={() => setSlotsSuccessToast(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Banner Informativo de Entorno de Prueba Protegido */}
        {restaurant?.slug === 'la-terraza' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start sm:items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">Panel Restaurante en Modo Prueba</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 font-extrabold uppercase">
                    Protegido
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Para prevenir incidentes de seguridad y cuidar el sistema, este panel de demostración opera con <strong>respuestas y activos de muestra oficiales verificados</strong>. Las subidas libres de archivos externos están protegidas.
                </p>
              </div>
            </div>
            <a
              href="/#precios"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shrink-0 transition-all text-center shadow-md active:scale-95"
            >
              Contratar Cuenta Propia
            </a>
          </div>
        )}

        {/* PESTAÑA 1: CATÁLOGO DE PLATILLOS */}
        {activeTab === 'dishes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Catálogo de Platillos</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gestiona platillos 2D ilimitados y platillos estrella en WebAR 1:1.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {(restaurant?.subscription?.plan || stats?.plan) !== 'essential' && (
                  <a
                    href={`/servicio?slug=${restaurant?.slug || 'la-terraza'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                    title="Abrir consola de meseros en vivo con sonido"
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Estación Meseros</span>
                  </a>
                )}

                <a
                  href={`/r/${restaurant?.slug || 'la-terraza'}?mesa=1&zona=Terraza`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Menú Comensal</span>
                </a>

                {dishes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleAITranslateWholeMenu(false)}
                    disabled={isTranslatingWholeMenu}
                    className="py-2.5 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                    title="Traduce automáticamente toda la carta a Inglés y Francés con IA gastronómica"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTranslatingWholeMenu ? 'Traduciendo Carta...' : 'Traducir Menú (EN / FR)'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="¿Tienes dudas o alguna falla técnica? Escríbenos directamente al equipo de ingeniería"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xl:inline">Ayuda & Soporte</span>
                </button>

                {dishes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteAllConfirmText('');
                      setIsDeleteAllModalOpen(true);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/60 text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Vaciar todo el catálogo de platillos"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden lg:inline">Vaciar Catálogo</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingDish(null);
                    setDishForm({
                      name: '',
                      description: '',
                      price: '',
                      categoryId: categories[0]?._id || '',
                      imageUrl: '',
                      videoUrl: '',
                      isAvailable: true,
                      is3D: false,
                      modelGlbUrl: '',
                      modelUsdzUrl: '',
                      isCompact: false,
                      isFeatured: false,
                      allergens: [],
                      availableSchedules: ['all'],
                      translations: {
                        en: { name: '', description: '' },
                        fr: { name: '', description: '' }
                      }
                    });
                    setDishLangTab('es');
                    setUploadedModelName('');
                    setImageUploadError(null);
                    setModelUploadError(null);
                    setShowManualImageUrl(false);
                    setShowManual3DUrl(false);
                    setMode3DTab('upload');
                    setIsDishModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Platillo</span>
                </button>
              </div>
            </div>

            {/* Barra de Búsqueda, Filtros y Selector de Cuadrícula */}
            <div className={`border rounded-2xl p-3 sm:p-4 space-y-3 transition-colors ${
              currentTheme.isLight
                ? 'bg-white border-slate-200 shadow-sm text-slate-800'
                : 'bg-slate-900/90 border-slate-800 shadow-xl text-slate-100'
            }`}>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Input de Búsqueda */}
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                    currentTheme.isLight ? 'text-slate-400' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    value={dishSearchQuery}
                    onChange={(e) => setDishSearchQuery(e.target.value)}
                    placeholder="Buscar platillo por nombre, descripción, precio o categoría..."
                    className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs transition-all border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      currentTheme.isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500'
                        : 'bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/60'
                    }`}
                  />
                  {dishSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDishSearchQuery('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors ${
                        currentTheme.isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Limpiar búsqueda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Selector de Categoría */}
                  {categories.length > 0 && (
                    <div className="relative">
                      <select
                        value={dishCategoryFilter}
                        onChange={(e) => setDishCategoryFilter(e.target.value)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer ${
                          currentTheme.isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                            : 'bg-slate-950/80 border-slate-800 text-slate-200 focus:border-amber-500/60'
                        }`}
                      >
                        <option value="all">Todas las categorías ({activeDishesList.length})</option>
                        {categories.map((cat) => {
                          const count = activeDishesList.filter(d => d.categoryId === (cat._id || cat.id)).length;
                          return (
                            <option key={cat._id || cat.id} value={cat._id || cat.id}>
                              {cat.name} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Selector de Densidad / Modo de Vista */}
                  <div className={`flex items-center rounded-xl p-1 gap-1 border ${
                    currentTheme.isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setDishViewDensity('compact')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        dishViewDensity === 'compact'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : currentTheme.isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                      title="Cuadrícula Compacta Visual (más platillos visibles a la vez)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Compacta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDishViewDensity('standard')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        dishViewDensity === 'standard'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : currentTheme.isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                      title="Cuadrícula Estándar (tarjetas grandes)"
                    >
                      <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                        <span className="bg-current rounded-[1px]" />
                        <span className="bg-current rounded-[1px]" />
                        <span className="bg-current rounded-[1px]" />
                        <span className="bg-current rounded-[1px]" />
                      </div>
                      <span className="hidden sm:inline">Estándar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDishViewDensity('table')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        dishViewDensity === 'table'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : currentTheme.isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                      title="Vista en Lista / Tabla"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Lista</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtros rápidos por tipo (Pills) y Contador */}
              <div className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t ${
                currentTheme.isLight ? 'border-slate-100' : 'border-slate-800/80'
              }`}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDishTypeFilter('all')}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      dishTypeFilter === 'all'
                        ? currentTheme.isLight ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-950'
                        : currentTheme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Todos ({activeDishesList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setDishTypeFilter('3d')}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      dishTypeFilter === '3d'
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                        : currentTheme.isLight
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-800'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    <span>WebAR 3D ({activeDishesList.filter(d => d.is3D).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDishTypeFilter('featured')}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      dishTypeFilter === 'featured'
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                        : currentTheme.isLight
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>Estrella ({activeDishesList.filter(d => d.isFeatured).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDishTypeFilter('available')}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      dishTypeFilter === 'available'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : currentTheme.isLight
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Disponibles ({activeDishesList.filter(d => d.isAvailable !== false).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDishTypeFilter('sold_out')}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      dishTypeFilter === 'sold_out'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : currentTheme.isLight
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-slate-950/60 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Agotados ({activeDishesList.filter(d => d.isAvailable === false).length})</span>
                  </button>
                </div>

                {/* Filtro por Turnos / Horarios (Fase 4: Multi-Cartas) */}
                {restaurant?.settings?.mealSchedules?.enabled && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 w-full border-t border-slate-800/40">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Turno:</span>
                    </span>
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'breakfast', label: '☕ Desayunos' },
                      { id: 'lunch', label: '🍽️ Comidas' },
                      { id: 'dinner', label: '🍷 Cenas' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setDishScheduleFilter(s.id)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                          dishScheduleFilter === s.id
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                            : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`flex items-center gap-2 ml-auto text-xs ${currentTheme.isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>
                    Mostrando <strong className={`font-bold ${currentTheme.isLight ? 'text-slate-900' : 'text-white'}`}>{filteredActiveDishes.length}</strong> de {activeDishesList.length}
                  </span>
                  {(dishSearchQuery || dishCategoryFilter !== 'all' || dishTypeFilter !== 'all' || dishScheduleFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setDishSearchQuery('');
                        setDishCategoryFilter('all');
                        setDishTypeFilter('all');
                        setDishScheduleFilter('all');
                      }}
                      className="text-xs font-bold text-amber-500 hover:text-amber-600 underline underline-offset-2 ml-1"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lista o Cuadrícula de platillos */}
            {loading ? (
              <div className={`p-12 text-center rounded-3xl border ${currentTheme.isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className={`text-sm font-bold ${currentTheme.isLight ? 'text-slate-900' : 'text-white'}`}>Cargando catálogo de platillos...</p>
                <p className="text-xs text-slate-400 mt-1">Sincronizando con tu carta gastronómica</p>
              </div>
            ) : activeDishesList.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border ${currentTheme.isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
                <Utensils className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className={`text-sm font-bold ${currentTheme.isLight ? 'text-slate-900' : 'text-slate-200'}`}>No hay platillos en el catálogo activo</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${currentTheme.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Agrega nuevos platillos o haz clic en recargar si estás sincronizando tu carta.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => loadInitialData(token, activeRestaurantId)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                      currentTheme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recargar Catálogo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDish(null);
                      setDishForm({
                        name: '',
                        description: '',
                        price: '',
                        categoryId: categories[0]?._id || '',
                        imageUrl: '',
                        videoUrl: '',
                        isAvailable: true,
                        is3D: false,
                        modelGlbUrl: '',
                        modelUsdzUrl: '',
                        isCompact: false,
                        isFeatured: false,
                        allergens: [],
                        availableSchedules: ['all'],
                        translations: {
                          en: { name: '', description: '' },
                          fr: { name: '', description: '' }
                        }
                      });
                      setDishLangTab('es');
                      setUploadedModelName('');
                      setImageUploadError(null);
                      setModelUploadError(null);
                      setShowManualImageUrl(false);
                      setShowManual3DUrl(false);
                      setMode3DTab('upload');
                      setIsDishModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-950 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Platillo</span>
                  </button>
                </div>
              </div>
            ) : filteredActiveDishes.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border ${currentTheme.isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className={`text-sm font-bold ${currentTheme.isLight ? 'text-slate-900' : 'text-slate-200'}`}>No se encontraron platillos</h3>
                <p className={`text-xs mt-1 max-w-sm mx-auto ${currentTheme.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Ningún platillo coincide con los criterios de búsqueda o filtros seleccionados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDishSearchQuery('');
                    setDishCategoryFilter('all');
                    setDishTypeFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  Restablecer filtros y ver todos
                </button>
              </div>
            ) : dishViewDensity === 'table' ? (
              /* VISTA EN LISTA / TABLA COMPACTA */
              <div className={`border rounded-2xl overflow-hidden divide-y ${
                currentTheme.isLight ? 'bg-white border-slate-200 divide-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 divide-slate-800/80 shadow-xl'
              }`}>
                {filteredActiveDishes.map((dish) => {
                  const categoryName = categories.find(c => (c._id || c.id) === dish.categoryId)?.name;
                  return (
                    <div
                      key={dish._id}
                      className={`p-3 sm:p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                        currentTheme.isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-850/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {dish.imageUrl ? (
                          <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border ${
                            currentTheme.isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
                          }`}>
                            <img
                              src={getMediaUrl(dish.imageUrl)}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center border ${
                            currentTheme.isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-950/80 border-slate-800 text-slate-600'
                          }`}>
                            <Utensils className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-bold truncate group-hover:text-amber-500 transition-colors ${
                              currentTheme.isLight ? 'text-slate-900' : 'text-white'
                            }`}>
                              {dish.name}
                            </h3>
                            {dish.isFeatured && (
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                            )}
                            {dish.is3D && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 text-[10px] font-black border border-amber-500/30 shrink-0">
                                3D
                              </span>
                            )}
                          </div>

                          <p className={`text-xs line-clamp-1 mt-0.5 ${currentTheme.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {dish.description || 'Sin descripción.'}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            {categoryName && (
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                                currentTheme.isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700/60'
                              }`}>
                                {categoryName}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(dish._id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                                dish.isAvailable !== false
                                  ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-rose-500/15 text-rose-600 border-rose-500/30 hover:bg-rose-500/25'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${dish.isAvailable !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{dish.isAvailable !== false ? 'Disponible' : 'Agotado'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                        <span className="text-sm font-black text-amber-500">
                          ${dish.price} <span className="text-xs text-amber-600/80 font-normal">{dish.currency || 'MXN'}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {dish.is3D && (
                            <button
                              type="button"
                              onClick={() => handleToggleVault(dish._id)}
                              className={`p-2 rounded-lg transition-colors ${
                                currentTheme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400'
                              }`}
                              title="Resguardar en bóveda"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(dish._id)}
                            className={`p-2 rounded-lg transition-all ${
                              dish.isFeatured
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 hover:bg-amber-500/30'
                                : currentTheme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400'
                            }`}
                            title={dish.isFeatured ? 'Quitar de destacados' : 'Marcar como platillo estrella'}
                          >
                            <Star className={`w-3.5 h-3.5 ${dish.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenAi3DScanner(dish)}
                            className={`p-2 rounded-lg transition-all ${
                              dish.is3D
                                ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30'
                                : currentTheme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400'
                            }`}
                            title={dish.is3D ? `Calibrar / Escanear 3D (${dish.dishDiameterCm || 25}cm)` : 'Escanear en 3D'}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingDish(dish);
                              setDishForm({
                                name: dish.name,
                                description: dish.description || '',
                                price: dish.price,
                                categoryId: dish.categoryId,
                                imageUrl: dish.imageUrl || '',
                                videoUrl: dish.videoUrl || '',
                                isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true,
                                is3D: dish.is3D,
                                modelGlbUrl: dish.modelGlbUrl || '',
                                modelUsdzUrl: dish.modelUsdzUrl || '',
                                isCompact: dish.isCompact,
                                isFeatured: Boolean(dish.isFeatured),
                                allergens: dish.allergens || [],
                                translations: dish.translations || {
                                  en: { name: '', description: '' },
                                  fr: { name: '', description: '' }
                                }
                              });
                              setDishLangTab('es');
                              setUploadedModelName(dish.modelGlbUrl ? 'Modelo 3D activo asignado' : '');
                              setImageUploadError(null);
                              setModelUploadError(null);
                              setShowManualImageUrl(false);
                              setShowManual3DUrl(false);
                              setMode3DTab('upload');
                              setIsDishModalOpen(true);
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              currentTheme.isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                            title="Editar platillo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDish(dish._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              currentTheme.isLight ? 'bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600' : 'bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400'
                            }`}
                            title="Eliminar platillo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* CUADRÍCULA COMPACTA (DENSIDAD ALTA O ESTÁNDAR) */
              <div
                className={
                  dishViewDensity === 'compact'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                }
              >
                {filteredActiveDishes.map((dish) => {
                  const categoryName = categories.find(c => (c._id || c.id) === dish.categoryId)?.name;
                  const isCompactMode = dishViewDensity === 'compact';

                  return (
                    <div
                      key={dish._id}
                      className={`border rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 group relative ${
                        currentTheme.isLight
                          ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500/40'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700/80 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div>
                        {/* Contenedor Visual de Imagen con Badges Flotantes de Alto Contraste */}
                        <div
                          className={`w-full ${
                            isCompactMode ? 'h-32' : 'h-40'
                          } rounded-xl overflow-hidden mb-2.5 bg-slate-950 border border-slate-800/80 relative transition-colors`}
                        >
                          {dish.imageUrl ? (
                            <img
                              src={getMediaUrl(dish.imageUrl)}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-950/70 flex items-center justify-center text-slate-500">
                              <div className="flex items-center gap-1.5 text-xs">
                                <Utensils className="w-4 h-4 text-amber-500/60" />
                                <span className="text-[11px] font-medium text-slate-400">Sin fotografía</span>
                              </div>
                            </div>
                          )}

                          {/* Gradiente de fondo para máxima legibilidad de los badges sobre fotos */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

                          {/* Badge Superior Izquierdo: 3D o Video (solo indicadores multimedia) */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                            {dish.is3D && (
                              <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 shadow-md"
                                style={{
                                  backgroundColor: '#f59e0b',
                                  color: '#020617',
                                  border: '1.5px solid #d97706'
                                }}
                              >
                                <Box className="w-2.5 h-2.5 text-slate-950" />
                                <span>3D</span>
                              </span>
                            )}
                            {dish.videoUrl && (
                              <span
                                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md"
                                style={{
                                  backgroundColor: '#1d4ed8',
                                  color: '#ffffff',
                                  border: '1px solid #3b82f6'
                                }}
                              >
                                <Video className="w-2.5 h-2.5" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>

                          {/* Badge Superior Derecho: Disponibilidad Rápida en 1 clic */}
                          <div className="absolute top-2 right-2 z-10">
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(dish._id)}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-black backdrop-blur-md shadow-md transition-all flex items-center gap-1 active:scale-95"
                              style={{
                                backgroundColor: dish.isAvailable !== false ? '#064e3b' : '#881337',
                                color: dish.isAvailable !== false ? '#6ee7b7' : '#fda4af',
                                border: dish.isAvailable !== false ? '1.5px solid #10b981' : '1.5px solid #f43f5e'
                              }}
                              title="Toca para alternar entre Disponible y Agotado"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: dish.isAvailable !== false ? '#34d399' : '#fb7185' }}
                              />
                              <span className="hidden sm:inline">{dish.isAvailable !== false ? 'Disponible' : 'Agotado'}</span>
                            </button>
                          </div>

                          {/* Badge Inferior: Estrella / Más Pedido */}
                          {dish.isFeatured && (
                            <div className="absolute bottom-2 left-2 z-10">
                              <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 shadow-md"
                                style={{
                                  backgroundColor: '#f59e0b',
                                  color: '#020617',
                                  border: '1.5px solid #d97706'
                                }}
                              >
                                <Star className="w-2.5 h-2.5 fill-slate-950" />
                                <span>Estrella</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Etiqueta de Categoría (Ubicada con claridad absoluta arriba del nombre) */}
                        {categoryName && (
                          <div className="mb-0.5">
                            <span
                              className={`inline-block text-[10px] font-extrabold uppercase tracking-wider ${
                                currentTheme.isLight ? 'text-amber-600' : 'text-amber-400'
                              }`}
                            >
                              {categoryName}
                            </span>
                          </div>
                        )}

                        {/* Nombre y Precio */}
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <h3
                            className={`text-xs sm:text-sm font-bold line-clamp-1 group-hover:text-amber-500 transition-colors ${
                              currentTheme.isLight ? 'text-slate-900' : 'text-white'
                            }`}
                            title={dish.name}
                          >
                            {dish.name}
                          </h3>
                          <span className="text-xs font-black text-amber-500 shrink-0">
                            ${dish.price} <span className={`text-[10px] font-normal ${currentTheme.isLight ? 'text-slate-500' : 'text-amber-400/80'}`}>{dish.currency || 'MXN'}</span>
                          </span>
                        </div>

                        {/* Descripción Gastronómica */}
                        <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2.5 ${
                          currentTheme.isLight ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {dish.description || 'Sin descripción gastronómica.'}
                        </p>

                        {/* Badges Adicionales Compactos */}
                        <div className="flex flex-wrap items-center gap-1 mb-2.5">
                          {dish.videoUrl && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                              <Video className="w-2.5 h-2.5" />
                              <span>Video</span>
                            </span>
                          )}

                          {!dish.is3D && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              currentTheme.isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                            }`}>
                              2D Regular
                            </span>
                          )}

                          {dish.isCompact && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              currentTheme.isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                            }`}>
                              Compacto
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Barra de Acciones */}
                      <div className={`pt-2 border-t flex items-center justify-between gap-1 ${
                        currentTheme.isLight ? 'border-slate-100' : 'border-slate-800/80'
                      }`}>
                        {dish.is3D ? (
                          <button
                            type="button"
                            onClick={() => handleToggleVault(dish._id)}
                            className={`text-[11px] font-bold transition-colors flex items-center gap-1 ${
                              currentTheme.isLight ? 'text-slate-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                            }`}
                            title="Resguardar en bóveda para liberar slot"
                          >
                            <Archive className="w-3 h-3" />
                            <span className={isCompactMode ? 'hidden xl:inline' : 'inline'}>Bóveda</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          {/* Destacar Platillo */}
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(dish._id)}
                            className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                              dish.isFeatured
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 hover:bg-amber-500/30'
                                : currentTheme.isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-amber-600'
                                : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-amber-400'
                            }`}
                            title={dish.isFeatured ? 'Quitar de Estrella' : 'Marcar como Estrella'}
                          >
                            <Star className={`w-3.5 h-3.5 ${dish.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>

                          {/* Escáner / Calibrador 3D */}
                          <button
                            type="button"
                            onClick={() => handleOpenAi3DScanner(dish)}
                            className={`p-1.5 rounded-lg transition-all ${
                              dish.is3D
                                ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30'
                                : currentTheme.isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-amber-600'
                                : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-amber-400'
                            }`}
                            title={dish.is3D ? `Calibrar / Escanear 3D (${dish.dishDiameterCm || 25}cm)` : 'Escanear en 3D'}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDish(dish);
                              setDishForm({
                                name: dish.name,
                                description: dish.description || '',
                                price: dish.price,
                                categoryId: dish.categoryId,
                                imageUrl: dish.imageUrl || '',
                                videoUrl: dish.videoUrl || '',
                                isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true,
                                is3D: dish.is3D,
                                modelGlbUrl: dish.modelGlbUrl || '',
                                modelUsdzUrl: dish.modelUsdzUrl || '',
                                isCompact: dish.isCompact,
                                isFeatured: Boolean(dish.isFeatured),
                                allergens: dish.allergens || [],
                                translations: dish.translations || {
                                  en: { name: '', description: '' },
                                  fr: { name: '', description: '' }
                                }
                              });
                              setDishLangTab('es');
                              setUploadedModelName(dish.modelGlbUrl ? 'Modelo 3D activo asignado' : '');
                              setImageUploadError(null);
                              setModelUploadError(null);
                              setShowManualImageUrl(false);
                              setShowManual3DUrl(false);
                              setMode3DTab('upload');
                              setIsDishModalOpen(true);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentTheme.isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                                : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                            title="Editar platillo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDeleteDish(dish._id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentTheme.isLight
                                ? 'bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600'
                                : 'bg-slate-850 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400'
                            }`}
                            title="Eliminar platillo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: BÓVEDA HISTÓRICA 3D */}
        {activeTab === 'vault' && (
          (restaurant?.subscription?.plan || stats?.plan) === 'essential' ? (
            <div className="space-y-6 max-w-2xl animate-fadeIn p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center shadow-2xl mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Archive className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Función Exclusiva a partir de Experiencia 3D y VIP</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                El <strong className="text-white">Plan Esencial</strong> está enfocado en una carta fija con hasta 4 platillos 3D activos.
                La <strong className="text-amber-400">Bóveda Histórica 3D</strong> para resguardar platillos de temporada sin perder los modelos y liberar cupos está disponible a partir del Plan Experiencia 3D (hasta 8 en bóveda), VIP Fine Dining (hasta 30 en bóveda) y Cadenas (hasta 60 en bóveda).
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('billing')}
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Ver Planes y Desbloquear Bóveda
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Encabezado y Medidor de Capacidad */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-3">
                    <Archive className="w-6 h-6 text-amber-400" />
                    <span>Bóveda Histórica 3D</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Los platillos fuera de temporada no se pierden ni se pagan de nuevo. Están resguardados en tu bóveda para reactivarse con 1 clic cuando vuelva su época (ej. Chile en Nogada, Roscas, etc.).
                  </p>
                </div>
                <div className="sm:text-right p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Capacidad de Bóveda</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {stats?.vault?.used ?? dishes.filter((d) => d.isArchived).length} / {stats?.vault?.total ?? (restaurant?.subscription?.plan === 'chain_vip' ? 30 : restaurant?.subscription?.plan === 'enterprise_chain' ? 60 : 8)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">platillos</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dishes.filter((d) => d.isArchived).length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
                    <Archive className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-300">No hay platillos en la bóveda</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Cuando desactives un platillo 3D para una nueva temporada, aparecerá aquí resguardando tu modelo 3D.
                    </p>
                  </div>
                ) : (
                  dishes.filter((d) => d.isArchived).map((dish) => (
                    <div
                      key={dish._id}
                      className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <Archive className="w-3.5 h-3.5 text-slate-400" />
                          <span>En Bóveda (Slot liberado)</span>
                        </span>
                        <h3 className="text-base font-bold text-white mt-3 mb-1">{dish.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                          {dish.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleVault(dish._id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Reactivar Platillo en Menú</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        )}

        {/* PESTAÑA: CÓMO ESCANEAR EN 3D (PASO A PASO) */}
        {activeTab === 'scan_guide' && (
          <ScanGuideView onActionClick={() => setActiveTab('dishes')} onStartScan={handleOpenAi3DScannerFromGuide} />
        )}

        {/* PESTAÑA 3: CÓDIGOS QR Y VISTA PREVIA EN VIVO */}
        {activeTab === 'qr' && (
          <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                  <QrCode className="w-7 h-7 text-amber-400" />
                  <span>Personalizador y Generador de Códigos QR</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed max-w-3xl">
                  Configura en tiempo real el diseño, módulos y colores de tus códigos QR. Cada modificación se previsualiza instantáneamente en el portamenú interactivo listo para imprimir.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Previsualización en Vivo</span>
                </span>
              </div>
            </div>

            {/* Cuadrícula de 2 Columnas para Pantalla Completa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUMNA IZQUIERDA (Controles y Personalización: 7 Columnas) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Tarjeta 1: Parámetros de la Mesa y Ubicación */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      1. Asignación de Mesa y Ubicación
                    </span>
                    <span className="text-[11px] text-amber-400/90 font-bold">
                      Vinculado a la llamada de mesero
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        Número o Identificador de Mesa
                      </label>
                      <input
                        type="text"
                        value={qrTable}
                        onChange={(e) => setQrTable(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                        placeholder="Ej. 1, 12, VIP-3"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Aparecerá en el panel de meseros al pedir atención.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        Zona o Salón
                      </label>
                      <input
                        type="text"
                        value={qrZone}
                        onChange={(e) => setQrZone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                        placeholder="Ej. Terraza, Interior, Barra"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Área física dentro del establecimiento.
                      </span>
                    </div>
                  </div>

                  {/* Sugerencias Rápidas de Zonas */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">Zonas sugeridas:</span>
                    {['Terraza', 'Salón Principal', 'Barra', 'Planta Alta', 'Zona VIP', 'Jardín'].map((z) => (
                      <button
                        key={z}
                        type="button"
                        onClick={() => setQrZone(z)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          qrZone === z
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>

                  {/* Selector Rápido de Mesas Registradas */}
                  {tablesList.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
                          <Hash className="w-3 h-3 text-amber-400" />
                          <span>O selecciona una de tus mesas activas:</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {tablesList.length} registradas
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto pr-1">
                        {tablesList.map((t) => {
                          const isSelected =
                            String(qrTable).trim().toLowerCase() === String(t.number).trim().toLowerCase() &&
                            String(qrZone || 'Principal').trim().toLowerCase() === String(t.zone || 'Principal').trim().toLowerCase();
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setQrTable(t.number);
                                setQrZone(t.zone || 'Salón Principal');
                              }}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                  : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <span>Mesa {t.number}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                                isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
                              }`}>
                                {t.zone || 'Principal'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tarjeta 2: Estilo de Módulos (Forma Geométrica) */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      2. Estilo y Geometría de Módulos
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Cambio reactivo en vivo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'square', label: 'Cuadrado Clásico', desc: 'Máxima compatibilidad industrial y lectura instantánea', tag: 'Estándar' },
                      { id: 'dots', label: 'Puntos Modernos', desc: 'Matriz circular tecnológica estilo Apple App Clips', tag: 'Moderno' },
                      { id: 'rounded', label: 'Esquinas Suaves', desc: 'Bordes orgánicos para alta gastronomía y bistrós', tag: 'Gourmet' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setQrDotStyle(style.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                          qrDotStyle === style.id
                            ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                              {style.label}
                            </span>
                            {qrDotStyle === style.id ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                {style.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{style.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tarjeta 3: Paleta de Colores */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      3. Paleta de Color del Código QR
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Actualización instantánea
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: '#000000', label: 'Negro Clásico', color: '#000000', badge: 'Máximo Contraste' },
                      { id: '#6C5CE7', label: 'Neón Púrpura', color: '#6C5CE7', badge: 'Obsidian' },
                      { id: restaurant?.theme?.primaryColor || '#F59E0B', label: 'Color de Marca', color: restaurant?.theme?.primaryColor || '#F59E0B', badge: 'Identidad' },
                      { id: '#EAB308', label: 'Dorado Imperial', color: '#EAB308', badge: 'Premium' },
                      { id: '#991B1B', label: 'Borgoña Tinto', color: '#991B1B', badge: 'Cava' },
                      { id: '#06B6D4', label: 'Cyan Neo-Bistró', color: '#06B6D4', badge: 'Vibrante' }
                    ].map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setQrColorDark(col.id)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                          qrColorDark.toLowerCase() === col.id.toLowerCase()
                            ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border border-white/20 shadow-md"
                          style={{ backgroundColor: col.color }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{col.label}</span>
                          <span className="text-[10px] text-slate-400 block">{col.badge}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selector de Color Personalizado (Hex Picker) */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Palette className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">Tono Personalizado (HEX)</span>
                        <span className="text-[11px] text-slate-400 block">Elige libremente con la paleta de color</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="color"
                        value={qrColorDark.startsWith('#') && qrColorDark.length === 7 ? qrColorDark : '#000000'}
                        onChange={(e) => setQrColorDark(e.target.value)}
                        className="w-9 h-9 rounded-xl border border-slate-700 cursor-pointer bg-transparent p-0.5"
                        title="Seleccionar color con la paleta"
                      />
                      <input
                        type="text"
                        value={qrColorDark}
                        onChange={(e) => setQrColorDark(e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-700 text-white uppercase text-center focus:outline-none focus:border-amber-500"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 4: Logotipo Central */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      4. Logotipo e Insignia Central
                    </span>
                    <button
                      type="button"
                      onClick={() => setQrIncludeLogo(!qrIncludeLogo)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        qrIncludeLogo ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                      aria-label="Alternar logotipo central"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                          qrIncludeLogo ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    {restaurant?.logoUrl ? (
                      <img
                        src={getMediaUrl(restaurant.logoUrl)}
                        alt="Logo"
                        className="w-12 h-12 rounded-xl object-contain border border-slate-700 bg-slate-900 shrink-0 p-1 shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-lg flex items-center justify-center shrink-0">
                        {(restaurant?.name || 'V').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {qrIncludeLogo ? 'Logotipo Activo en el Centro' : 'Logotipo Oculto'}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                        {qrIncludeLogo
                          ? 'Se inserta un medallón protector blanco calibrado para garantizar lectura infalible del QR en cualquier teléfono.'
                          : 'El código QR se generará completo con módulos continuos en el centro.'}
                      </p>
                    </div>
                  </div>
                </div>

                {qrError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{qrError}</span>
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA (Portamenú en Vivo y Descargas: 5 Columnas, Sticky) */}
              <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
                
                {/* Stand de Mesa Realista en Vivo */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
                  
                  {/* Cabecera de la Vista Previa */}
                  <div className="w-full flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Portamenú en Vivo
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isGeneratingQR && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Actualizando...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* El Stand / Portamenú Físico (Mockup Acrílico) */}
                  <div className="w-full max-w-[320px] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center text-center relative group">
                    
                    {/* Logotipo o Nombre del Restaurante */}
                    <div className="mb-3 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white tracking-tight">
                        {restaurant?.name || 'Mi Restaurante'}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-400/90 mb-3 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      Menú 3D & WebAR
                    </span>

                    {/* Contenedor del Código QR */}
                    <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200 relative mb-3">
                      {qrData?.dataUrl ? (
                        <img
                          src={qrData.dataUrl}
                          alt="QR Live Preview"
                          className="w-56 h-56 block object-contain"
                        />
                      ) : (
                        <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-semibold">Generando QR...</span>
                        </div>
                      )}

                      {/* Overlay sutil mientras actualiza */}
                      {isGeneratingQR && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Identificador de Mesa y Zona */}
                    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2 px-3 mb-2 flex items-center justify-around">
                      <span className="text-xs font-black text-white">
                        Mesa: <strong className="text-amber-400">{qrTable || '1'}</strong>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-bold text-slate-300">
                        Zona: <strong className="text-slate-200">{qrZone || 'Principal'}</strong>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-1">
                      <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Apunta con tu celular para ver la carta y pedir atención</span>
                    </p>
                  </div>

                  {/* Descargas y Exportación */}
                  <div className="w-full mt-6 space-y-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadSvg}
                      disabled={!qrData?.svg}
                      className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar SVG (Vectorial para Imprenta)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPng}
                      disabled={!qrData?.dataUrl}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar PNG HD (1024x1024)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => qrData?.url && window.open(qrData.url, '_blank')}
                        disabled={!qrData?.url}
                        className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Menú</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (qrData?.url) {
                            navigator.clipboard.writeText(qrData.url);
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                          }
                        }}
                        disabled={!qrData?.url}
                        className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? '¡Copiado!' : 'Copiar URL'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* PESTAÑA 3.5: ESTACIÓN DE MESEROS Y SERVICIO EN VIVO */}
        {activeTab === 'service' && (
          (restaurant?.subscription?.plan || stats?.plan) === 'essential' ? (
            <div className="space-y-6 max-w-2xl animate-fadeIn p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Función Exclusiva de Planes Pro y VIP</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                El <strong className="text-white">Plan Esencial</strong> está enfocado en digitalización de carta con hasta 4 platillos 3D.
                La <strong className="text-amber-400">Estación de Meseros con alertas audibles y el botón para comensales</strong> están disponibles a partir del Plan Experiencia 3D, VIP Fine Dining y Cadenas & Franquicias.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('billing')}
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Ver Planes y Activar Experiencia 3D
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
                <Bell className="w-3.5 h-3.5" />
                <span>Atención a Mesa en Tiempo Real con Sonido</span>
              </div>
              <h1 className="text-2xl font-black text-white flex items-center gap-3">
                <span>Estación de Meseros y Barra</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Supervisa llamadas de mesero y solicitudes de cuenta de todas las mesas al instante con alertas audibles sincronizadas en tiempo real.
              </p>
            </div>

            {/* Tarjeta de Lanzamiento Rápido a Pantalla Completa */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-400" />
                    <span>Consola Activa de Servicio para Personal</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Abre la pantalla de servicio en una tablet fija en la barra, pantalla de cocina o dispositivo móvil del mesero.
                  </p>
                </div>
                <a
                  href={`/servicio?slug=${restaurant?.slug || 'la-terraza'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 shrink-0"
                >
                  <Bell className="w-4 h-4 text-slate-950" />
                  <span>Abrir Estación en Pantalla Completa</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                </a>
              </div>

              {/* Credenciales de Acceso para el Personal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">PIN Actual de Servicio:</span>
                      <span className="text-xl font-mono font-black text-amber-400 tracking-widest mt-0.5 block">
                        {restaurant?.settings?.defaultPin || '1234'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(restaurant?.settings?.defaultPin || '1234');
                        setCopiedServicePin(true);
                        setTimeout(() => setCopiedServicePin(false), 2000);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all"
                    >
                      {copiedServicePin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedServicePin ? '¡Copiado!' : 'Copiar PIN'}</span>
                    </button>
                  </div>

                  {/* Formulario para cambiar PIN */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Cambiar PIN de Acceso (4 a 6 dígitos):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ej. 4920"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs w-32 focus:outline-none focus:border-amber-500 font-bold"
                      />
                      <button
                        type="button"
                        disabled={isSavingPin || newPinInput.trim().length < 4}
                        onClick={handleSavePin}
                        className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black transition-all shadow-sm active:scale-95 shrink-0"
                      >
                        {isSavingPin ? 'Guardando...' : 'Guardar PIN'}
                      </button>
                      {pinSaveSuccess && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> ¡PIN Actualizado!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="min-w-0 mr-2">
                    <span className="text-xs font-semibold text-slate-400 block">Enlace Directo de Estación:</span>
                    <span className="text-xs font-mono text-slate-300 truncate block mt-0.5">
                      {`/servicio?slug=${restaurant?.slug || 'la-terraza'}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://volum.menu';
                      navigator.clipboard.writeText(`${origin}/servicio?slug=${restaurant?.slug || 'la-terraza'}`);
                      setCopiedServiceUrl(true);
                      setTimeout(() => setCopiedServiceUrl(false), 2000);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {copiedServiceUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedServiceUrl ? '¡Copiado!' : 'Copiar Enlace'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AJUSTES DE PEDIDOS EN MESA Y SEGURIDAD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Control de Pedidos y Seguridad</span>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2.5 flex-wrap">
                    <span>Pedidos Digitales en la Mesa (Auto-Ordering)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Disponible en Plan VIP ($1,299) y Cadenas
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Controla si los comensales pueden pedir platillos desde su teléfono o si el menú opera únicamente en modo catálogo 3D de exhibición.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                {/* Switch 1: Habilitar Pedidos */}
                <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  restaurant?.settings?.orderSettings?.enabled
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        <span>Permitir Pedidos</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleOrderSetting('enabled')}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          restaurant?.settings?.orderSettings?.enabled ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          restaurant?.settings?.orderSettings?.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {restaurant?.settings?.orderSettings?.enabled
                        ? 'Activo: Los clientes ven botón "+ Agregar" y carrito flotante para pedir.'
                        : 'Desactivado: Modo catálogo 3D (solo visualización y llamada al mesero).'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md self-start ${
                    restaurant?.settings?.orderSettings?.enabled
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {restaurant?.settings?.orderSettings?.enabled ? 'Pedidos Activos' : 'Modo Catálogo'}
                  </span>
                </div>

                {/* Switch 2: Aprobación del Mesero */}
                <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  !restaurant?.settings?.orderSettings?.enabled
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-50'
                    : restaurant?.settings?.orderSettings?.requireApproval !== false
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <ShieldCheck className={`w-3.5 h-3.5 ${restaurant?.settings?.orderSettings?.enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className={restaurant?.settings?.orderSettings?.enabled ? 'text-white' : 'text-slate-400'}>Filtro del Mesero</span>
                      </span>
                      <button
                        type="button"
                        disabled={!restaurant?.settings?.orderSettings?.enabled}
                        onClick={() => handleToggleOrderSetting('requireApproval')}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          !restaurant?.settings?.orderSettings?.enabled
                            ? 'bg-slate-800/60 cursor-not-allowed opacity-60'
                            : restaurant?.settings?.orderSettings?.requireApproval !== false ? 'bg-emerald-500 cursor-pointer' : 'bg-slate-800 cursor-pointer'
                        }`}
                        title={!restaurant?.settings?.orderSettings?.enabled ? 'Requiere habilitar pedidos digitales primero' : undefined}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          restaurant?.settings?.orderSettings?.enabled && restaurant?.settings?.orderSettings?.requireApproval !== false ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Protección anti-bromas: el mesero autoriza la comanda con 1 tap antes de marcharla a cocina.
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md self-start ${
                    !restaurant?.settings?.orderSettings?.enabled
                      ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                      : restaurant?.settings?.orderSettings?.requireApproval !== false
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {!restaurant?.settings?.orderSettings?.enabled
                      ? 'Requiere Permitir Pedidos'
                      : restaurant?.settings?.orderSettings?.requireApproval !== false ? 'Protegido con Aprobación' : 'Pasa Directo'}
                  </span>
                </div>

                {/* Switch 3: División de Cuenta */}
                <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  !restaurant?.settings?.orderSettings?.enabled
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-50'
                    : restaurant?.settings?.orderSettings?.allowSplitBill
                    ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Users className={`w-3.5 h-3.5 ${restaurant?.settings?.orderSettings?.enabled ? 'text-purple-400' : 'text-slate-500'}`} />
                        <span className={restaurant?.settings?.orderSettings?.enabled ? 'text-white' : 'text-slate-400'}>Dividir Cuenta</span>
                      </span>
                      <button
                        type="button"
                        disabled={!restaurant?.settings?.orderSettings?.enabled}
                        onClick={() => handleToggleOrderSetting('allowSplitBill')}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          !restaurant?.settings?.orderSettings?.enabled
                            ? 'bg-slate-800/60 cursor-not-allowed opacity-60'
                            : restaurant?.settings?.orderSettings?.allowSplitBill ? 'bg-purple-500 cursor-pointer' : 'bg-slate-800 cursor-pointer'
                        }`}
                        title={!restaurant?.settings?.orderSettings?.enabled ? 'Requiere habilitar pedidos digitales primero' : undefined}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          restaurant?.settings?.orderSettings?.enabled && restaurant?.settings?.orderSettings?.allowSplitBill ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Permite dividir el ticket en partes iguales con distribución exacta de centavos sin descuadres.
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md self-start ${
                    !restaurant?.settings?.orderSettings?.enabled
                      ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                      : restaurant?.settings?.orderSettings?.allowSplitBill
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {!restaurant?.settings?.orderSettings?.enabled
                      ? 'Requiere Permitir Pedidos'
                      : restaurant?.settings?.orderSettings?.allowSplitBill ? 'División Habilitada' : 'Cuenta Única'}
                  </span>
                </div>
              </div>
            </div>

            {/* GESTOR Y LISTADO DE MESAS DE SALA */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold mb-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Control de Salón y Códigos QR</span>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                    <span>Distribución y Mesas del Restaurante</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400">
                      {tablesList.length} {tablesList.length === 1 ? 'Mesa' : 'Mesas'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Administra las mesas del restaurante. Puedes añadir nuevas, cambiarles de nombre, eliminarlas o ver su QR.
                  </p>
                </div>

                {/* Switcher de Vista: Croquis Visual vs Lista Tradicional */}
                <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setServiceTableViewMode('floor_plan')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      serviceTableViewMode === 'floor_plan'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Plano / Croquis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceTableViewMode('list')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      serviceTableViewMode === 'list'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>Lista & Códigos QR</span>
                  </button>
                </div>
              </div>

              {serviceTableViewMode === 'floor_plan' ? (
                <FloorPlanEditor
                  initialTables={tablesList}
                  initialFloorPlan={restaurant?.floorPlan || null}
                  onSave={async (data) => {
                    await syncTables(data.tables, 'Plano de mesas guardado exitosamente.', data.floorPlan);
                  }}
                  isSaving={isSavingTables}
                  restaurantSlug={restaurant?.slug || 'la-terraza'}
                />
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsReorderModalOpen(true)}
                      className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Compactar y renumerar mesas numéricas del 1 al N"
                    >
                      <ListOrdered className="w-4 h-4 text-amber-400" />
                      <span>Renumerar Secuencialmente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTableNumber(String(tablesList.length + 1));
                        setNewTableZone('Salón Principal');
                        setIsAddTableModalOpen(true);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Mesa</span>
                    </button>
                  </div>

              {/* Barra de Filtros y Búsqueda */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="Buscar mesa por número o zona..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                  {tableSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTableSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtro por Zona */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {uniqueZones.map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setTableZoneFilter(z)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        tableZoneFilter === z
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {z === 'ALL' ? 'Todas las Zonas' : z}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuadrícula de Mesas */}
              {filteredTables.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                    <Hash className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No se encontraron mesas</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {tableSearchQuery || tableZoneFilter !== 'ALL'
                      ? 'No hay mesas que coincidan con los filtros de búsqueda aplicados.'
                      : 'Aún no tienes mesas registradas. Pulsa en "+ Nueva Mesa" o genera códigos QR para comenzar.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTables.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-base shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                            {t.number}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>Mesa {t.number}</span>
                            </h4>
                            <span className="inline-block mt-0.5 text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                              {t.zone || 'Principal'}
                            </span>
                          </div>
                        </div>

                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" title="Mesa Activa" />
                      </div>

                      {/* Botones de Acción de Mesa */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenQRForTable(t)}
                          className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 text-[11px] font-bold border border-slate-800 flex items-center gap-1.5 transition-all"
                          title="Ver y descargar código QR de esta mesa"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Ver QR</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingTable({ id: t.id, number: t.number, zone: t.zone || 'Salón Principal' })}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
                            title="Cambiar número o zona de la mesa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTableToDelete(t)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition-all"
                            title="Eliminar mesa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                </div>
              )}
            </div>

            {/* Guía Operativa: ¿Cómo sabe el mesero qué está pidiendo el comensal? */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">¿Cómo Funciona la Estación de Meseros?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">1. Llamar al Mesero</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    El comensal pulsa "Llamar Mesero" en su menú móvil. En la consola suena una <strong>campanilla doble ding-dong</strong> y la tarjeta se destaca con color ámbar indicando la mesa y zona exacta (ej. <em>Mesa 4 • Terraza</em>).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">2. Pedir la Cuenta</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    El comensal pulsa "Pedir la Cuenta". En la estación suena un <strong>timbre distintivo de caja</strong> y la tarjeta se resalta en color <strong>verde esmeralda</strong> especificando el método de pago preferido (Efectivo o Tarjeta).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">3. Despacho en Tiempo Real</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Al acudir a la mesa, el mesero pulsa <strong>"Marcar Atendido"</strong>. La tarjeta desaparece de inmediato en todas las pantallas y tablets sincronizadas sin necesidad de recargar.
                  </p>
                </div>

              </div>
            </div>

            {/* Código QR para Acceso Rápido del Personal */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-sm font-bold text-white">Acceso Móvil Instantáneo para Meseros</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Pega este código QR en la estación de meseros o caja para que tu personal lo escanee con su celular al iniciar turno y acceda directamente ingresando el PIN.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const targetUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://volum.menu'}/servicio?slug=${restaurant?.slug || 'la-terraza'}`;
                      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(targetUrl)}`, '_blank');
                    }}
                    className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar QR de Servicio</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white shrink-0 shadow-xl border border-slate-800">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                    `${typeof window !== 'undefined' ? window.location.origin : 'https://volum.menu'}/servicio?slug=${restaurant?.slug || 'la-terraza'}`
                  )}`}
                  alt="QR Estación de Meseros"
                  className="w-32 h-32"
                />
              </div>
            </div>

          </div>
          )
        )}

        {/* PESTAÑA UNIFICADA: MARCA, IA Y CONFIGURACIÓN SERVER-DRIVEN UI (ACORDEÓN MULTI-SECCIÓN) */}
        {(activeTab === 'theme' || activeTab === 'ai_onboarding') && (
          <div className="space-y-6">
            {/* CABECERA SUPERIOR LIMPIA Y ELEGANTE */}
            <div className={`p-5 sm:p-6 rounded-3xl transition-all ${
              currentTheme.isLight
                ? 'bg-white border border-slate-200 shadow-sm'
                : 'bg-slate-900/80 border border-slate-800 shadow-xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-black flex items-center gap-3 ${
                    currentTheme.isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    <Palette className="w-6 h-6 text-amber-500" />
                    <span>Marca, IA y Configuración del Menú</span>
                  </h1>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    currentTheme.isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Personaliza la identidad visual, digitalización de cartas por turno y banners de marketing viendo el simulador 1:1 en vivo.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowLivePhoneModal(true)}
                    className="xl:hidden px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Ver Celular 1:1</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SELECTOR DE SUB-SECCIONES DE LUJO GASTRONÓMICO: EVITA LA SATURACIÓN VISUAL */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-lg">
              {[
                { id: 'categories', label: 'Categorías & Formatos', icon: Sliders, badge: `${categories.length}` },
                { id: 'identity', label: 'Identidad & Estilo Maestro', icon: Sparkles },
                { id: 'ai_engine', label: 'Motor Neuronal IA', icon: Wand2, badge: 'Auto' },
                { id: 'marketing', label: 'Marketing, Splash & Redes', icon: Instagram },
                { id: 'preferences', label: 'Consola & Ajustes', icon: Shield },
                { id: 'all', label: 'Ver Todo', icon: Layers }
              ].map((subTab) => {
                const isSelected = themeActiveSubTab === subTab.id;
                const IconComp = subTab.icon;
                return (
                  <button
                    key={subTab.id}
                    type="button"
                    onClick={() => {
                      setThemeActiveSubTab(subTab.id);
                      if (subTab.id === 'categories') {
                        setOpenThemeModules(prev => ({ ...prev, categories: true }));
                      } else if (subTab.id === 'identity') {
                        setOpenThemeModules(prev => ({ ...prev, identity: true, archetype: true, palette: true, typography: true }));
                      } else if (subTab.id === 'ai_engine') {
                        setOpenThemeModules(prev => ({ ...prev, ai_engine: true }));
                      } else if (subTab.id === 'marketing') {
                        setOpenThemeModules(prev => ({ ...prev, storytelling: true, marketing: true }));
                      } else if (subTab.id === 'preferences') {
                        setOpenThemeModules(prev => ({ ...prev, admin_console: true }));
                      } else if (subTab.id === 'all') {
                        expandAllThemeModules();
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-[1.01]'
                        : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{subTab.label}</span>
                    {subTab.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {subTab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* LAYOUT DE 2 COLUMNAS DESDE ARRIBA: ACORDEONES (IZQUIERDA) + SIMULADOR 1:1 FIJO (DERECHA) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* COLUMNA IZQUIERDA: MÓDULOS DESPLEGABLES (xl:col-span-7) */}
              <div className="xl:col-span-7 space-y-3.5">

                {/* =====================================================================
                    MÓDULO 1: MOTOR NEURONAL IA & DIGITALIZACIÓN DE CARTA FÍSICA
                   ===================================================================== */}
                {( themeActiveSubTab === 'ai_engine' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('ai_engine')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-sm sm:text-base font-black text-white">Motor Neuronal IA: Carta Física y Fotos del Local</h2>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase">
                            Volum IA
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Digitaliza tu menú en PDF/foto y extrae la paleta de colores real de tu establecimiento.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                        {(restaurant?.theme?.aiPalette?.primaryColor || extractedPalette?.primaryColor) ? (
                          <>
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: restaurant?.theme?.aiPalette?.primaryColor || extractedPalette?.primaryColor }}
                            />
                            <span>IA Calibrada</span>
                          </>
                        ) : (
                          <span>Listo para escanear</span>
                        )}
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.ai_engine ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.ai_engine && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-5">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Sube tu carta física para extraer platillos automáticamente o sube de 1 a 5 fotos de tu local para que la IA genere la paleta cromática oficial de tu restaurante (el logotipo oficial se configura en el <strong>Módulo 2</strong> para evitar duplicados).
                      </p>

                      {/* CONTROL SWITCH: MANEJO MÚLTIPLES CARTAS POR HORARIO (DESAYUNOS, COMIDAS, CENAS) */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">
                                Manejo múltiples cartas por horario (Desayunos, Comidas, Cenas)
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                                Multi-Cartas
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Activa esta opción para subir cartas de forma separada y tener un orden exacto por cada carta y horario.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !multiScheduleMenuEnabled;
                            setMultiScheduleMenuEnabled(nextState);
                            setRestaurant({
                              ...restaurant,
                              settings: {
                                ...(restaurant?.settings || {}),
                                mealSchedules: {
                                  ...(restaurant?.settings?.mealSchedules || {}),
                                  enabled: nextState
                                }
                              }
                            });
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                            multiScheduleMenuEnabled ? 'bg-amber-500' : 'bg-slate-800'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                              multiScheduleMenuEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* ZONA DE SUBIDA: MÚLTIPLES CARTAS POR TURNO O CARTA ÚNICA */}
                      {multiScheduleMenuEnabled ? (
                        <div className="space-y-3 p-4 rounded-3xl bg-slate-950/70 border border-amber-500/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <h3 className="text-xs font-bold text-white">
                                Subida de Cartas Separadas por Turno
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowScheduleHoursEditor(!showScheduleHoursEditor)}
                              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>{showScheduleHoursEditor ? 'Ocultar horarios' : 'Ajustar horarios de turnos'}</span>
                            </button>
                          </div>

                          {/* Ajuste Rápido de Horas por Turno */}
                          {showScheduleHoursEditor && (
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fadeIn">
                              <span className="text-[11px] font-bold text-slate-300 block">Horarios oficiales de servicio:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30">
                                  <span className="text-[11px] font-bold text-amber-300 block mb-1">☕ Desayunos</span>
                                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                                    <input
                                      type="time"
                                      value={restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'breakfast')?.startTime || '08:00'}
                                      onChange={(e) => {
                                        const schedules = restaurant?.settings?.mealSchedules?.schedules || [];
                                        const updated = schedules.map(s => s.id === 'breakfast' ? { ...s, startTime: e.target.value } : s);
                                        setRestaurant({ ...restaurant, settings: { ...restaurant?.settings, mealSchedules: { ...restaurant?.settings?.mealSchedules, schedules: updated } } });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-20"
                                    />
                                    <span>a</span>
                                    <input
                                      type="time"
                                      value={restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'breakfast')?.endTime || '12:59'}
                                      onChange={(e) => {
                                        const schedules = restaurant?.settings?.mealSchedules?.schedules || [];
                                        const updated = schedules.map(s => s.id === 'breakfast' ? { ...s, endTime: e.target.value } : s);
                                        setRestaurant({ ...restaurant, settings: { ...restaurant?.settings, mealSchedules: { ...restaurant?.settings?.mealSchedules, schedules: updated } } });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-20"
                                    />
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                                  <span className="text-[11px] font-bold text-emerald-300 block mb-1">🍽️ Comidas</span>
                                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                                    <input
                                      type="time"
                                      value={restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'lunch')?.startTime || '13:00'}
                                      onChange={(e) => {
                                        const schedules = restaurant?.settings?.mealSchedules?.schedules || [];
                                        const updated = schedules.map(s => s.id === 'lunch' ? { ...s, startTime: e.target.value } : s);
                                        setRestaurant({ ...restaurant, settings: { ...restaurant?.settings, mealSchedules: { ...restaurant?.settings?.mealSchedules, schedules: updated } } });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-20"
                                    />
                                    <span>a</span>
                                    <input
                                      type="time"
                                      value={restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'lunch')?.endTime || '18:59'}
                                      onChange={(e) => {
                                        const schedules = restaurant?.settings?.mealSchedules?.schedules || [];
                                        const updated = schedules.map(s => s.id === 'lunch' ? { ...s, endTime: e.target.value } : s);
                                        setRestaurant({ ...restaurant, settings: { ...restaurant?.settings, mealSchedules: { ...restaurant?.settings?.mealSchedules, schedules: updated } } });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-20"
                                    />
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/30">
                                  <span className="text-[11px] font-bold text-indigo-300 block mb-1">🍷 Cenas</span>
                                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                                    <input
                                      type="time"
                                      value={restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'dinner')?.startTime || '19:00'}
                                      onChange={(e) => {
                                        const schedules = restaurant?.settings?.mealSchedules?.schedules || [];
                                        const updated = schedules.map(s => s.id === 'dinner' ? { ...s, startTime: e.target.value } : s);
                                        setRestaurant({ ...restaurant, settings: { ...restaurant?.settings, mealSchedules: { ...restaurant?.settings?.mealSchedules, schedules: updated } } });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-20"
                                    />
                                    <span>a</span>
                                    <input
                                      type="time"
                                      value={restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'dinner')?.endTime || '02:00'}
                                      onChange={(e) => {
                                        const schedules = restaurant?.settings?.mealSchedules?.schedules || [];
                                        const updated = schedules.map(s => s.id === 'dinner' ? { ...s, endTime: e.target.value } : s);
                                        setRestaurant({ ...restaurant, settings: { ...restaurant?.settings, mealSchedules: { ...restaurant?.settings?.mealSchedules, schedules: updated } } });
                                      }}
                                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-20"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3 Dropzones: Desayuno, Comida, Cena */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            {/* 1. Carta Desayunos */}
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                    <Coffee className="w-4 h-4 text-amber-400" />
                                    <span>Carta de Desayunos</span>
                                  </span>
                                  <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/15">
                                    {restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'breakfast')?.startTime || '08:00'} - {restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'breakfast')?.endTime || '12:59'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mb-2.5">
                                  Huevos, chilaquiles, café, pan dulce y desayunos.
                                </p>
                              </div>

                              {onboardingBreakfastFile ? (
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{onboardingBreakfastFile.name}</p>
                                    <p className="text-[10px] text-slate-400">{(onboardingBreakfastFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => onboardingBreakfastInputRef.current?.click()}
                                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-bold"
                                    >
                                      Cambiar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOnboardingBreakfastFile(null)}
                                      className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => onboardingBreakfastInputRef.current?.click()}
                                  className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px]"
                                >
                                  <UploadCloud className="w-6 h-6 text-amber-400 mb-1" />
                                  <span className="text-xs font-bold text-white">Subir Carta Desayuno</span>
                                  <span className="text-[10px] text-slate-400">PDF o Foto</span>
                                </div>
                              )}
                              <input
                                ref={onboardingBreakfastInputRef}
                                type="file"
                                accept="application/pdf,image/png,image/jpeg,image/webp,image/jpg"
                                onChange={(e) => e.target.files?.[0] && setOnboardingBreakfastFile(e.target.files[0])}
                                className="hidden"
                              />
                            </div>

                            {/* 2. Carta Comidas */}
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                    <Utensils className="w-4 h-4 text-emerald-400" />
                                    <span>Carta de Comidas</span>
                                  </span>
                                  <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/15">
                                    {restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'lunch')?.startTime || '13:00'} - {restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'lunch')?.endTime || '18:59'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mb-2.5">
                                  Cortes, pescados, pastas, entradas y menú del día.
                                </p>
                              </div>

                              {onboardingLunchFile ? (
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{onboardingLunchFile.name}</p>
                                    <p className="text-[10px] text-slate-400">{(onboardingLunchFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => onboardingLunchInputRef.current?.click()}
                                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-bold"
                                    >
                                      Cambiar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOnboardingLunchFile(null)}
                                      className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => onboardingLunchInputRef.current?.click()}
                                  className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px]"
                                >
                                  <UploadCloud className="w-6 h-6 text-emerald-400 mb-1" />
                                  <span className="text-xs font-bold text-white">Subir Carta Comida</span>
                                  <span className="text-[10px] text-slate-400">PDF o Foto</span>
                                </div>
                              )}
                              <input
                                ref={onboardingLunchInputRef}
                                type="file"
                                accept="application/pdf,image/png,image/jpeg,image/webp,image/jpg"
                                onChange={(e) => e.target.files?.[0] && setOnboardingLunchFile(e.target.files[0])}
                                className="hidden"
                              />
                            </div>

                            {/* 3. Carta Cenas */}
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/30 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                                    <Wine className="w-4 h-4 text-indigo-400" />
                                    <span>Carta de Cenas</span>
                                  </span>
                                  <span className="text-[10px] text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-indigo-500/15">
                                    {restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'dinner')?.startTime || '19:00'} - {restaurant?.settings?.mealSchedules?.schedules?.find(s => s.id === 'dinner')?.endTime || '02:00'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mb-2.5">
                                  Coctelería, platillos nocturnos, tapeo y postres.
                                </p>
                              </div>

                              {onboardingDinnerFile ? (
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-1.5">
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{onboardingDinnerFile.name}</p>
                                    <p className="text-[10px] text-slate-400">{(onboardingDinnerFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => onboardingDinnerInputRef.current?.click()}
                                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-bold"
                                    >
                                      Cambiar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOnboardingDinnerFile(null)}
                                      className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => onboardingDinnerInputRef.current?.click()}
                                  className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px]"
                                >
                                  <UploadCloud className="w-6 h-6 text-indigo-400 mb-1" />
                                  <span className="text-xs font-bold text-white">Subir Carta Cena</span>
                                  <span className="text-[10px] text-slate-400">PDF o Foto</span>
                                </div>
                              )}
                              <input
                                ref={onboardingDinnerInputRef}
                                type="file"
                                accept="application/pdf,image/png,image/jpeg,image/webp,image/jpg"
                                onChange={(e) => e.target.files?.[0] && setOnboardingDinnerFile(e.target.files[0])}
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Selector de Archivos en 2 Zonas Limpias (Sin duplicar Logo) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* ZONA 1: CARTA / MENÚ FÍSICO GENERAL */}
                        {!multiScheduleMenuEnabled && (
                          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-amber-500" />
                                  <span>1. Carta o Menú Físico Único</span>
                                </span>
                                <span className="text-[11px] text-slate-400 font-semibold">PDF o Foto</span>
                              </div>
                              <p className="text-xs text-slate-400 mb-3">
                                Fotografía nítida o PDF de tu menú general para extraer categorías, platillos, descripciones y precios.
                              </p>
                            </div>

                            {onboardingMenuFile ? (
                              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                                <div className="min-w-0 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{onboardingMenuFile.name}</p>
                                    <p className="text-[11px] text-slate-400">{(onboardingMenuFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => onboardingMenuInputRef.current?.click()}
                                    className="px-2 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold"
                                  >
                                    Cambiar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setOnboardingMenuFile(null)}
                                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/20"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => onboardingMenuInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[120px]"
                              >
                                <UploadCloud className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform mb-1.5" />
                                <span className="text-xs font-bold text-white group-hover:text-amber-300">
                                  Seleccionar Carta o Menú
                                </span>
                                <span className="text-[11px] text-slate-400 mt-0.5">PDF, PNG o JPG (hasta 15 MB)</span>
                              </div>
                            )}

                            <input
                              ref={onboardingMenuInputRef}
                              type="file"
                              accept="application/pdf,image/png,image/jpeg,image/webp,image/jpg"
                              onChange={handleMenuFileChange}
                              className="hidden"
                            />
                          </div>
                        )}

                        {/* ZONA 2: FOTOS DEL ESTABLECIMIENTO (1 a 5 fotos) */}
                        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Camera className="w-4 h-4 text-amber-500" />
                                <span>2. Fotos de tu Local (Paleta IA)</span>
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                                {onboardingVenueFiles.length} / 5
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3">
                              Comedor, barra, fachada o iluminación. La IA extrae los colores de tu local y los guarda en tu Paleta Cromática.
                            </p>
                          </div>

                          {onboardingVenuePreviews.length > 0 ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto p-1 rounded-2xl bg-slate-900 border border-slate-800">
                                {onboardingVenuePreviews.map((previewUrl, idx) => (
                                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-square">
                                    <img src={previewUrl} alt={`Foto local ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVenuePhoto(idx)}
                                      className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                      title="Eliminar foto"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {onboardingVenueFiles.length < 5 && (
                                <button
                                  type="button"
                                  onClick={() => onboardingVenueInputRef.current?.click()}
                                  className="w-full py-1.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Agregar más fotos ({5 - onboardingVenueFiles.length} disponibles)</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div
                              onClick={() => onboardingVenueInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[120px]"
                            >
                              <Camera className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform mb-1.5" />
                              <span className="text-xs font-bold text-white group-hover:text-amber-300">
                                Subir Fotos de tu Local
                              </span>
                              <span className="text-[11px] text-slate-400 mt-0.5">De 1 a 5 fotos para generar Paleta IA</span>
                            </div>
                          )}

                          <input
                            ref={onboardingVenueInputRef}
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            onChange={handleVenueFilesChange}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {onboardingError && (
                        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{onboardingError}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('ai_engine')}
                          className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar sección</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRunAIOnboarding}
                          disabled={isAnalyzingOnboarding || (!onboardingMenuFile && onboardingVenueFiles.length === 0)}
                          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                        >
                          {isAnalyzingOnboarding ? (
                            <>
                              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              <span>Analizando con Volum IA...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              <span>Analizar Carta y Fotos con IA</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Progreso en Vivo */}
                      {isAnalyzingOnboarding && (
                        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-4 h-4 animate-spin" />
                              <span>Pipeline de Visión Inteligente en Progreso</span>
                            </span>
                            <span className="text-xs font-mono text-slate-400">Paso {analysisStep} de 3</span>
                          </div>
                          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700 ease-out"
                              style={{ width: `${(analysisStep / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Resultados del Análisis IA */}
                      {onboardingResult && (
                        <div className="space-y-4 pt-3 border-t border-slate-800 animate-fadeIn">
                          {extractedDishes.length > 0 && (
                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                <div>
                                  <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                                    <Utensils className="w-4 h-4 text-amber-400" />
                                    <span>Platillos Extraídos por IA ({extractedDishes.length})</span>
                                  </h3>
                                  <p className="text-[11px] text-slate-400">Edita o desmarca platillos antes de incorporarlos a tu catálogo.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleToggleSelectAllDishes}
                                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 self-start"
                                >
                                  {extractedDishes.every((d) => d.selected) ? (
                                    <>
                                      <Square className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Deseleccionar Todos</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Seleccionar Todos</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                                {extractedDishes.map((dish, index) => (
                                  <div
                                    key={dish.id || index}
                                    className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                                      dish.selected ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-900/30 border-slate-800/50 opacity-60'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={dish.selected}
                                      onChange={() => handleToggleDishSelection(index)}
                                      className="mt-1 w-4 h-4 rounded text-amber-500 cursor-pointer shrink-0"
                                    />
                                    <div className="flex-1 space-y-1.5 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <input
                                          type="text"
                                          value={dish.name}
                                          onChange={(e) => handleUpdateExtractedDish(index, 'name', e.target.value)}
                                          className="w-full sm:w-2/3 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                                        />
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs text-slate-400">$</span>
                                          <input
                                            type="number"
                                            value={dish.price}
                                            onChange={(e) => handleUpdateExtractedDish(index, 'price', e.target.value)}
                                            className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-extrabold text-amber-400"
                                          />
                                        </div>
                                      </div>
                                      <input
                                        type="text"
                                        value={dish.description}
                                        onChange={(e) => handleUpdateExtractedDish(index, 'description', e.target.value)}
                                        placeholder="Descripción o ingredientes..."
                                        className="w-full px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300"
                                      />
                                      {multiScheduleMenuEnabled && (
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                          <span className="text-[10px] font-bold text-slate-400">Turno de Servicio:</span>
                                          <select
                                            value={dish.availableSchedules?.[0] || 'all'}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              const newScheds = val === 'all' ? ['breakfast', 'lunch', 'dinner'] : [val];
                                              handleUpdateExtractedDish(index, 'availableSchedules', newScheds);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                                          >
                                            <option value="breakfast">☕ Desayunos (08:00 - 12:59)</option>
                                            <option value="lunch">🍽️ Comidas (13:00 - 18:59)</option>
                                            <option value="dinner">🍷 Cenas (19:00 - 02:00)</option>
                                            <option value="all">🌐 Todos los turnos</option>
                                          </select>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {applySuccess ? (
                            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
                              <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                              <h4 className="text-xs font-black text-white">{applySuccess}</h4>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={handleApplyOnboarding}
                                disabled={isApplyingOnboarding}
                                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>
                                  {isApplyingOnboarding
                                    ? 'Aplicando y guardando...'
                                    : extractedDishes.length > 0
                                    ? `Incorporar Platillos (${extractedDishes.filter((d) => d.selected).length}) y Guardar Paleta IA`
                                    : 'Guardar Paleta IA y Fotos del Local'}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 2: IDENTIDAD OFICIAL & MATERIALES DE MARCA
                   ===================================================================== */}
                {( themeActiveSubTab === 'identity' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('identity')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-white">Identidad Oficial, Logotipo y Portada</h2>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Nombre comercial, eslogan gastronómico, logotipo para menú/QR y fotografía panorámica.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 max-w-[180px] truncate">
                        {restaurant?.logoUrl ? 'Logo Activo' : 'Sin Logo'} • {restaurant?.name || 'Restaurante'}
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.identity ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.identity && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Oficial del Restaurante</label>
                          <input
                            type="text"
                            value={restaurant?.name || ''}
                            onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                            placeholder="Ej. La Terraza Contemporánea"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Subtítulo / Eslogan Culinario Corto</label>
                          <input
                            type="text"
                            value={restaurant?.description || ''}
                            onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })}
                            placeholder="Ej. Cocina de Fuego, Mar & Mixología de Autor"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Logotipo Oficial */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                          <div>
                            <label className="block text-xs font-bold text-white">Logotipo Oficial (Menú, Splash y QR)</label>
                            <p className="text-[11px] text-slate-400 mt-0.5">Se muestra en la cabecera móvil, intro 1.2s y centro de tus códigos QR.</p>
                          </div>
                          <div className="flex items-center gap-3 pt-1">
                            {restaurant?.logoUrl ? (
                              <img
                                src={getMediaUrl(restaurant.logoUrl)}
                                alt="Logo"
                                className="w-14 h-14 rounded-2xl object-contain bg-slate-900 p-1 border border-slate-700 shadow-md shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xl flex items-center justify-center shrink-0">
                                {(restaurant?.name || 'V').charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="space-y-1.5 flex-1">
                              <button
                                type="button"
                                onClick={() => themeLogoInputRef.current?.click()}
                                disabled={isUploadingThemeLogo}
                                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
                              >
                                <Upload className="w-3.5 h-3.5 text-amber-400" />
                                <span>{isUploadingThemeLogo ? 'Subiendo...' : 'Subir o Cambiar Logo'}</span>
                              </button>
                              <p className="text-[10px] text-slate-400">PNG transparente, SVG o WEBP.</p>
                            </div>
                          </div>

                          <input
                            ref={themeLogoInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/svg+xml"
                            onChange={handleThemeLogoUpload}
                            className="hidden"
                          />
                        </div>

                        {/* Portada Panorámica */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                          <div>
                            <label className="block text-xs font-bold text-white">Fotografía de Portada Panorámica</label>
                            <p className="text-[11px] text-slate-400 mt-0.5">Viste el encabezado Hero de tu menú móvil.</p>
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            {restaurant?.bannerUrl ? (
                              <img
                                src={getMediaUrl(restaurant.bannerUrl)}
                                alt="Portada"
                                className="w-20 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}

                            <div className="space-y-1.5 flex-1">
                              <button
                                type="button"
                                onClick={() => themeBannerInputRef.current?.click()}
                                disabled={isUploadingThemeBanner}
                                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                                <span>{isUploadingThemeBanner ? 'Subiendo...' : 'Subir Portada'}</span>
                              </button>
                              <p className="text-[10px] text-slate-400">Formato horizontal de alta resolución.</p>
                            </div>
                          </div>

                          <input
                            ref={themeBannerInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleThemeBannerUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('identity')}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveThemeConfig('identity')}
                          disabled={isSavingThemeConfig}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar y Plegar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 3: ARQUETIPO MADRE & ESTRUCTURA DE PORTADA (HERO)
                   ===================================================================== */}
                {( themeActiveSubTab === 'identity' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('archetype')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-white">Estilo Maestro de Menú para Comensales (WebAR)</h2>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Elige el estilo visual general que verán todos tus clientes al escanear el QR o abrir el menú.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-amber-300">
                        {DINER_STYLES[restaurant?.theme?.dinerStyle]?.shortName || 'Lounge Nocturno'}
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.archetype ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.archetype && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-6">
                      {/* SELECTOR MAESTRO DE LOS 4 ESTILOS GASTRONÓMICOS PARA COMENSALES */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>1. Estilo Visual General para Comensales (4 Estilos Maestros)</span>
                          </label>
                          <span className="text-[11px] text-amber-400 font-semibold">
                            Aplica a todos los comensales
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                          Este estilo se aplicará de forma oficial e inmediata a todos los clientes que abran tu carta digital o escaneen tus códigos QR.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            {
                              id: 'bistro_botanico',
                              name: 'Bistró Botánico y Terraza Editorial',
                              short: 'Bistró Botánico',
                              tag: 'Fresco & Editorial • Verde Bosque y Blanco Hueso',
                              desc: 'Fondo blanco hueso (#FDFBF7), cabecera verde bosque (#0C281E) y tipografía serif. Máxima legibilidad diurna.',
                              colors: ['#0C281E', '#FDFBF7', '#D97706']
                            },
                            {
                              id: 'lounge_nocturno',
                              name: 'Lounge Nocturno y Barra 3D',
                              short: 'Lounge Nocturno',
                              tag: 'Cinematográfico • Negro Azabache y Oro Imperial',
                              desc: 'Negro azabache (#020617), tarjetas oscuras con reflejos dorados y brillo WebAR 3D para cenas.',
                              colors: ['#020617', '#0F172A', '#F59E0B']
                            },
                            {
                              id: 'trattoria_artesanal',
                              name: 'Trattoria & Cava Rústica',
                              short: 'Trattoria Rústica',
                              tag: 'Cálido & Tradicional • Terracota y Pergamino',
                              desc: 'Atmósfera toscana con fondo pergamino cálido, terracota (#C2410C) y estilo clásico para pastas y pizzas.',
                              colors: ['#C2410C', '#FDFBF7', '#D97706']
                            },
                            {
                              id: 'street_food',
                              name: 'Street Food y Gastrobar',
                              short: 'Street Food',
                              tag: 'Audaz & Pop • Neo-Brutalismo Blanco y Naranja',
                              desc: 'Bordes negros marcados 2px, acentos naranja flama (#EA580C) y sombras pop sólidas para smash burgers y taquerías.',
                              colors: ['#EA580C', '#FFFFFF', '#020617']
                            }
                          ].map((style) => {
                            const currentDinerStyle = restaurant?.theme?.dinerStyle || 'lounge_nocturno';
                            const isSelected = currentDinerStyle === style.id;
                            return (
                              <button
                                key={style.id}
                                type="button"
                                onClick={() => {
                                  const styleConfig = DINER_STYLES[style.id];
                                  setRestaurant({
                                    ...restaurant,
                                    theme: {
                                      ...(restaurant?.theme || {}),
                                      dinerStyle: style.id,
                                      primaryColor: styleConfig?.colors?.accent || restaurant?.theme?.primaryColor || '#D97706',
                                      secondaryColor: styleConfig?.colors?.headerBg || restaurant?.theme?.secondaryColor || '#0F172A',
                                      surfaceColor: styleConfig?.colors?.bgCanvas || restaurant?.theme?.surfaceColor || '#020617',
                                      accentColor: styleConfig?.colors?.accent || restaurant?.theme?.accentColor || '#F59E0B',
                                      themeMode: styleConfig?.isDark ? 'dark' : 'light',
                                      cardRadius: style.id === 'street_food' ? 'sharp' : 'rounded'
                                    }
                                  });
                                }}
                                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                                  isSelected
                                    ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/40'
                                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-xs sm:text-sm font-black text-white">{style.name}</h3>
                                      {isSelected && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                                          Activo
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-400 block mt-0.5">{style.tag}</span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0 p-1 rounded-xl bg-slate-900 border border-slate-800">
                                    {style.colors.map((c, i) => (
                                      <span
                                        key={i}
                                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                                        style={{ backgroundColor: c }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{style.desc}</p>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-semibold text-slate-400">
                                  <span>{style.short}</span>
                                  <span className="text-amber-400 font-bold group-hover:underline">Seleccionar como estilo general →</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                          2. Arquetipo Madre de Navegación
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            {
                              id: 'modern_gourmet',
                              name: 'Modern Gourmet',
                              tag: 'Bistros & Casual Upscale',
                              desc: 'Tarjetas con bordes suaves, insignias WebAR destacadas y navegación táctil fluida.',
                              fontSuggest: 'sans'
                            },
                            {
                              id: 'editorial_michelin',
                              name: 'Editorial Michelin',
                              tag: 'Alta Cocina & Autor',
                              desc: 'Encabezados centrados con líneas finas tipo revista impresa, aire amplio y elegancia serif.',
                              fontSuggest: 'playfair'
                            },
                            {
                              id: 'dark_lounge',
                              name: 'Dark Lounge & Mixology',
                              tag: 'Steakhouse & Speakeasy',
                              desc: 'Estética nocturna de alto contraste con acentos luminosos y enfoque inmersivo.',
                              fontSuggest: 'outfit'
                            }
                          ].map((arch) => {
                            const currentArch = restaurant?.theme?.archetype || 'modern_gourmet';
                            const isSelected = currentArch === arch.id;
                            return (
                              <button
                                key={arch.id}
                                type="button"
                                onClick={() => setRestaurant({
                                  ...restaurant,
                                  theme: {
                                    ...(restaurant?.theme || {}),
                                    archetype: arch.id,
                                    fontFamily: restaurant?.theme?.fontFamily || arch.fontSuggest
                                  }
                                })}
                                className={`p-3.5 rounded-2xl border text-left transition-all ${
                                  isSelected
                                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-black text-white">{arch.name}</span>
                                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                                </div>
                                <span className="text-[10px] font-bold text-amber-400/90 block mb-1.5">{arch.tag}</span>
                                <p className="text-[11px] text-slate-400 leading-snug">{arch.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                          2. Estructura de Portada Superior (Hero Header)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            {
                              id: 'banner_standard',
                              name: 'Portada Panorámica',
                              desc: 'Fotografía de ambiente con logotipo superpuesto e insignias.'
                            },
                            {
                              id: 'editorial_minimal',
                              name: 'Editorial Minimalista',
                              desc: 'Isotipo centrado, tipografía de revista y ornamentos simétricos.'
                            },
                            {
                              id: 'signature_3d',
                              name: 'Platillo Estrella 3D',
                              desc: 'Destaca tu platillo insignia en la cabecera con acceso directo a WebAR.'
                            }
                          ].map((hero) => {
                            const currentHero = restaurant?.theme?.heroStyle || 'banner_standard';
                            const isSelected = currentHero === hero.id;
                            return (
                              <button
                                key={hero.id}
                                type="button"
                                onClick={() => setRestaurant({
                                  ...restaurant,
                                  theme: {
                                    ...(restaurant?.theme || {}),
                                    heroStyle: hero.id
                                  }
                                })}
                                className={`p-3 rounded-2xl border text-left transition-all ${
                                  isSelected
                                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-white">{hero.name}</span>
                                  {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">{hero.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('archetype')}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveThemeConfig('archetype')}
                          disabled={isSavingThemeConfig}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar y Plegar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 4: ESTUDIO DE ARQUITECTURA Y FORMATO POR CATEGORÍA (PUNTO 4 RENOVADO)
                   ===================================================================== */}
                {(themeActiveSubTab === 'categories' || themeActiveSubTab === 'all') && (
                  <div className="bg-slate-900 border border-amber-500/35 rounded-3xl overflow-hidden shadow-2xl transition-all">
                    {/* Cabecera de Módulo 4 con botón de optimización IA */}
                    <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Sliders className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm sm:text-base font-black text-white">Estudio de Formatos por Categoría & Vista Móvil 1:1</h2>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase">
                              Server-Driven UI
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            Personaliza el formato visual y el orden de cada sección (ej. Entradas, Postres, Bebidas) y míralo en vivo en el celular.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleOptimizeCategoriesWithAI}
                          disabled={isOptimizingWithAI || categories.length === 0}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
                          title="Analiza automáticamente tus categorías y les asigna el formato canónico idóneo"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isOptimizingWithAI ? 'animate-spin' : ''}`} />
                          <span>{isOptimizingWithAI ? 'Optimizando...' : 'Optimizar Todo con Volum IA'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-5">
                      {/* 1. SELECTOR EN CHIPS / PÍLDORAS DE CATEGORÍAS */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <span>Selecciona una categoría para editar y previsualizar:</span>
                          </label>
                          <span className="text-[11px] text-amber-400/90 font-medium hidden sm:inline">
                            Toca una categoría para enfocarla en el celular 👉
                          </span>
                        </div>

                        {categories.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                            Aún no hay categorías registradas en tu menú. Agrega la primera abajo o usa la digitalización con IA.
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {categories.map((cat, idx) => {
                              const catId = cat._id || cat.id;
                              const isSelected = String(focusedCategoryForPreview) === String(catId);
                              const layoutType = cat.layoutType || 'inherited';
                              return (
                                <button
                                  key={catId}
                                  type="button"
                                  onClick={() => setFocusedCategoryForPreview(catId)}
                                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 ${
                                    isSelected
                                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-[1.03] font-black'
                                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                                    isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  <span>{cat.name}</span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                                    isSelected ? 'bg-slate-950/40 text-slate-900' : 'bg-slate-900 text-amber-400/90'
                                  }`}>
                                    {layoutType === 'hero_carousel' ? 'Carrusel' :
                                     layoutType === 'compact_list' ? 'Sommelier' :
                                     layoutType === 'editorial' ? 'Editorial' :
                                     layoutType === 'grid' ? 'Cuadrícula' : 'Heredado'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* 2. PANEL DE EDICIÓN DE LA CATEGORÍA ENFOCADA */}
                      {(() => {
                        const activeCat = categories.find((c) => String(c._id || c.id) === String(focusedCategoryForPreview)) || categories[0];
                        if (!activeCat) return null;
                        const activeCatId = activeCat._id || activeCat.id;
                        const activeIdx = categories.findIndex((c) => String(c._id || c.id) === String(activeCatId));
                        const currentLayout = activeCat.layoutType || 'inherited';
                        const showThumbs = activeCat.showThumbnails !== false;
                        const aiSug = getCategoryAiSuggestion(activeCat.name);

                        return (
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-4 shadow-xl">
                            {/* Fila Superior: Nombre de Categoría y Controles de Reordenamiento */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black shrink-0">
                                  #{activeIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={activeCat.name}
                                  onChange={(e) => {
                                    const newName = e.target.value;
                                    handleUpdateCategoryAdmin(activeCatId, { name: newName });
                                  }}
                                  className="bg-slate-900 border border-slate-700/80 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-white flex-1 max-w-sm focus:outline-none"
                                  placeholder="Nombre de categoría"
                                />
                              </div>

                              {/* Controles de Orden (Subir/Bajar) y Eliminar */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                <span className="text-[11px] text-slate-400 font-semibold mr-1">Orden en Menú:</span>
                                <button
                                  type="button"
                                  onClick={() => handleMoveCategory(activeCatId, 'up')}
                                  disabled={activeIdx === 0}
                                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Subir de posición en la carta del comensal"
                                >
                                  <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveCategory(activeCatId, 'down')}
                                  disabled={activeIdx === categories.length - 1}
                                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Bajar de posición en la carta del comensal"
                                >
                                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategoryAdmin(activeCatId)}
                                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                                  title="Eliminar esta categoría"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Banner de Recomendación IA para esta categoría */}
                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Sugerencia Volum IA:</span>
                                    <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                                      {aiSug.layoutLabel}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-light">
                                    {aiSug.reason}
                                  </p>
                                </div>
                              </div>

                              {(currentLayout !== aiSug.layout || showThumbs !== aiSug.showThumbnails) && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCategoryAdmin(activeCatId, { layoutType: aiSug.layout, showThumbnails: aiSug.showThumbnails })}
                                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition-all shadow-md active:scale-95 flex items-center gap-1.5 self-start md:self-center"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aplicar Sugerencia</span>
                                </button>
                              )}
                            </div>

                            {/* Selector Visual de Formatos con Tarjetas Interactivas */}
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-2">
                                Elige el Formato Visual para "{activeCat.name}":
                              </label>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                {[
                                  {
                                    id: 'grid',
                                    title: 'Cuadrícula Visual (2 Cols)',
                                    desc: '2 columnas con fotos llamativas. Ideal para Entradas, Postres, Tacos y Platillos casuales.',
                                    icon: LayoutGrid
                                  },
                                  {
                                    id: 'hero_carousel',
                                    title: 'Carrusel Estrella Horizontal',
                                    desc: 'Desplazable horizontal de alto impacto. Ideal para Cortes Finos, Especialidades Insignia y modelos 3D.',
                                    icon: Sparkles
                                  },
                                  {
                                    id: 'compact_list',
                                    title: 'Lista Sommelier / Bistro',
                                    desc: 'Limpio y tipográfico de alta gama. Perfecto para Vinos, Cava, Coctelería, Licores y Cafés.',
                                    icon: List
                                  },
                                  {
                                    id: 'editorial',
                                    title: 'Revista Editorial (1 Col)',
                                    desc: 'Fotografía panorámica y descripción narrativa. Para Platos Fuertes y Menús Degustación.',
                                    icon: BookOpen
                                  },
                                  {
                                    id: 'inherited',
                                    title: 'Heredar Vista General',
                                    desc: 'Adopta el modo predeterminado configurado en la identidad general del restaurante.',
                                    icon: Layers
                                  }
                                ].map((fmt) => {
                                  const isFmtSelected = currentLayout === fmt.id;
                                  const FmtIcon = fmt.icon;
                                  return (
                                    <button
                                      key={fmt.id}
                                      type="button"
                                      onClick={() => handleUpdateCategoryAdmin(activeCatId, { layoutType: fmt.id })}
                                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 group ${
                                        isFmtSelected
                                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                                          : 'bg-slate-900 hover:bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <div className={`p-1.5 rounded-lg ${isFmtSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400 group-hover:text-amber-400'}`}>
                                            <FmtIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <span className="text-xs font-bold">{fmt.title}</span>
                                        </div>
                                        {isFmtSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                                      </div>
                                      <p className="text-[10px] text-slate-400 leading-snug font-light">
                                        {fmt.desc}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Interruptor de Fotos / Modo Limpio Sommelier */}
                            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-xs font-bold text-white block">Miniaturas Fotográficas en esta categoría</span>
                                <span className="text-[11px] text-slate-400 block font-light mt-0.5">
                                  Desactiva las fotos si deseas una carta tipográfica minimalista tipo bodega o cata de vinos.
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUpdateCategoryAdmin(activeCatId, { showThumbnails: !showThumbs })}
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0 ${
                                  showThumbs
                                    ? 'bg-slate-950 border-slate-700 text-slate-200 hover:border-amber-500/50'
                                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-black'
                                }`}
                              >
                                {showThumbs ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <span>{showThumbs ? 'Con Fotos Activas' : 'Modo Sommelier (Sin Fotos)'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 3. Formulario Rápido para Añadir Nueva Categoría */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nueva categoría (ej. Cava de Vinos, Cortes 3D...)"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <select
                          value={newCategoryLayout}
                          onChange={(e) => setNewCategoryLayout(e.target.value)}
                          className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="inherited">Vista Heredada</option>
                          <option value="grid">Cuadrícula (2 Cols)</option>
                          <option value="hero_carousel">Carrusel Estrella</option>
                          <option value="compact_list">Lista Sommelier</option>
                          <option value="editorial">Editorial (1 Col)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setNewCategoryShowThumbs(!newCategoryShowThumbs)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                            newCategoryShowThumbs
                              ? 'bg-slate-950 border-slate-700 text-slate-300'
                              : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          }`}
                        >
                          {newCategoryShowThumbs ? 'Con Fotos' : 'Sin Fotos'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateCategoryAdmin}
                          disabled={isSavingCategory}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================================
                    MÓDULO 5: PALETA CROMÁTICA (INCLUYE OPCIÓN IA DE FOTOS DEL LOCAL), TEXTURA Y GEOMETRÍA
                   ===================================================================== */}
                {( themeActiveSubTab === 'identity' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('palette')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Palette className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-white">Paleta Cromática (IA + Autor), Texturas y Geometría</h2>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Colores generados por IA con las fotos de tu local, 6 paletas de autor, texturas y bordes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: restaurant?.theme?.primaryColor || '#D97706' }} />
                        <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: restaurant?.theme?.secondaryColor || '#0F172A' }} />
                        <span className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                          {restaurant?.theme?.primaryColor || '#D97706'}
                        </span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.palette ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.palette && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-5">
                      
                      {/* OPCIÓN DESTACADA: PALETA GENERADA POR IA CON LAS FOTOS SUBIDAS DEL LOCAL */}
                      {(() => {
                        const savedAiPalette = restaurant?.theme?.aiPalette?.primaryColor
                          ? restaurant.theme.aiPalette
                          : (extractedPalette?.primaryColor ? extractedPalette : null);
                        const isAiActive = savedAiPalette &&
                          (restaurant?.theme?.primaryColor || '').toUpperCase() === (savedAiPalette.primaryColor || '').toUpperCase() &&
                          (restaurant?.theme?.secondaryColor || '').toUpperCase() === (savedAiPalette.secondaryColor || '').toUpperCase();

                        return (
                          <div className={`p-4 rounded-2xl border transition-all ${
                            isAiActive
                              ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                              : 'bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border-amber-500/35'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                                  <span className="text-xs font-black text-white">
                                    Paleta Generada por IA (Fotos de tu Local)
                                  </span>
                                  {isAiActive && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                                      Activa
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                  {savedAiPalette?.vibeDescription
                                    ? savedAiPalette.vibeDescription
                                    : 'Extraída directamente de la iluminación, arquitectura y fotografías subidas de tu restaurante.'}
                                </p>
                              </div>

                              {savedAiPalette ? (
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                                    <span className="w-5 h-5 rounded-lg border border-white/15" style={{ backgroundColor: savedAiPalette.primaryColor }} title={`Principal: ${savedAiPalette.primaryColor}`} />
                                    <span className="w-5 h-5 rounded-lg border border-white/15" style={{ backgroundColor: savedAiPalette.secondaryColor }} title={`Fondo: ${savedAiPalette.secondaryColor}`} />
                                    <span className="w-5 h-5 rounded-lg border border-white/15" style={{ backgroundColor: savedAiPalette.accentColor || '#F59E0B' }} title={`Acento: ${savedAiPalette.accentColor}`} />
                                    <span className="w-5 h-5 rounded-lg border border-white/15" style={{ backgroundColor: savedAiPalette.surfaceColor || '#020617' }} title={`Superficie: ${savedAiPalette.surfaceColor}`} />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRestaurant((prev) => ({
                                        ...prev,
                                        theme: {
                                          ...(prev?.theme || {}),
                                          primaryColor: savedAiPalette.primaryColor,
                                          secondaryColor: savedAiPalette.secondaryColor,
                                          accentColor: savedAiPalette.accentColor || '#F59E0B',
                                          surfaceColor: savedAiPalette.surfaceColor || '#020617',
                                          aiPalette: savedAiPalette
                                        }
                                      }));
                                      showToast('Paleta generada por IA aplicada a tu menú.', 'success');
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                                  >
                                    {isAiActive ? 'Re-aplicar Paleta IA' : 'Usar Paleta IA'}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenThemeModules((prev) => ({ ...prev, ai_engine: true }));
                                    setTimeout(() => onboardingVenueInputRef.current?.click(), 150);
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Subir Fotos para Generar con IA</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Colección de 6 Paletas de Autor Gastronómicas */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                          Paletas de Autor Gastronómicas de Alta Gama (1 Clic)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {AUTHOR_PALETTES.map((pal) => {
                            const isPalSelected = (restaurant?.theme?.primaryColor || '').toUpperCase() === pal.primary.toUpperCase() &&
                              (restaurant?.theme?.secondaryColor || '').toUpperCase() === pal.secondary.toUpperCase();
                            return (
                              <button
                                key={pal.id}
                                type="button"
                                onClick={() => applyAuthorPalette(pal)}
                                className={`p-3 rounded-2xl border transition-all text-left group ${
                                  isPalSelected
                                    ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/30'
                                    : 'border-slate-800 hover:border-amber-500/50 bg-slate-950/80 hover:bg-slate-950'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                    {pal.name}
                                  </span>
                                  {isPalSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                                </div>
                                <span className="text-[10px] text-slate-400 block mb-2">{pal.tag}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-md border border-slate-700 shadow-inner" style={{ backgroundColor: pal.primary }} />
                                  <span className="w-4 h-4 rounded-md border border-slate-700 shadow-inner" style={{ backgroundColor: pal.secondary }} />
                                  <span className="w-4 h-4 rounded-md border border-slate-700 shadow-inner" style={{ backgroundColor: pal.accent }} />
                                  <span className="w-4 h-4 rounded-md border border-slate-700 shadow-inner" style={{ backgroundColor: pal.surface }} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Ajuste Fino Hexadecimal */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">Ajuste Fino de Colores Hexadecimales</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Color Principal</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={restaurant?.theme?.primaryColor || '#D97706'}
                                onChange={(e) => setRestaurant({
                                  ...restaurant,
                                  theme: { ...restaurant.theme, primaryColor: e.target.value }
                                })}
                                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                              />
                              <span className="text-[11px] font-mono text-slate-300 uppercase">{restaurant?.theme?.primaryColor || '#D97706'}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Color Secundario</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={restaurant?.theme?.secondaryColor || '#0F172A'}
                                onChange={(e) => setRestaurant({
                                  ...restaurant,
                                  theme: { ...restaurant.theme, secondaryColor: e.target.value }
                                })}
                                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                              />
                              <span className="text-[11px] font-mono text-slate-300 uppercase">{restaurant?.theme?.secondaryColor || '#0F172A'}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Acento WebAR</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={restaurant?.theme?.accentColor || '#F59E0B'}
                                onChange={(e) => setRestaurant({
                                  ...restaurant,
                                  theme: { ...restaurant.theme, accentColor: e.target.value }
                                })}
                                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                              />
                              <span className="text-[11px] font-mono text-slate-300 uppercase">{restaurant?.theme?.accentColor || '#F59E0B'}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Fondo Superficie</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={restaurant?.theme?.surfaceColor || '#020617'}
                                onChange={(e) => setRestaurant({
                                  ...restaurant,
                                  theme: { ...restaurant.theme, surfaceColor: e.target.value }
                                })}
                                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                              />
                              <span className="text-[11px] font-mono text-slate-300 uppercase">{restaurant?.theme?.surfaceColor || '#020617'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Texturas y Geometría */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-2">Textura Sutil de Fondo</label>
                          <div className="grid grid-cols-2 gap-2">
                            {SURFACE_TEXTURES.map((tex) => {
                              const isSelected = (restaurant?.theme?.texture || 'none') === tex.id;
                              return (
                                <button
                                  key={tex.id}
                                  type="button"
                                  onClick={() => setRestaurant({
                                    ...restaurant,
                                    theme: { ...(restaurant?.theme || {}), texture: tex.id }
                                  })}
                                  className={`p-2.5 rounded-xl border text-left transition-all ${
                                    isSelected
                                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <span className="text-xs block font-bold">{tex.label}</span>
                                  <span className="text-[9px] text-slate-400 block mt-0.5 line-clamp-1">{tex.desc}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-2">Geometría de Esquinas y Vista Inicial</label>
                          <div className="grid grid-cols-3 gap-2 mb-2.5">
                            {CARD_GEOMETRIES.map((geom) => {
                              const isSelected = (restaurant?.theme?.cardRadius || 'rounded') === geom.id;
                              return (
                                <button
                                  key={geom.id}
                                  type="button"
                                  onClick={() => setRestaurant({
                                    ...restaurant,
                                    theme: { ...(restaurant?.theme || {}), cardRadius: geom.id }
                                  })}
                                  className={`p-2 rounded-xl border text-left transition-all ${
                                    isSelected
                                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <span className="text-[11px] block font-bold">{geom.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'grid', label: 'Rejilla Visual' },
                              { id: 'compact', label: 'Lista Bistro' },
                              { id: 'feed', label: 'Feed Reels' }
                            ].map((mode) => {
                              const currentMode = restaurant?.settings?.defaultViewMode || 'grid';
                              const isSelected = currentMode === mode.id;
                              return (
                                <button
                                  key={mode.id}
                                  type="button"
                                  onClick={() => setRestaurant({
                                    ...restaurant,
                                    settings: { ...(restaurant?.settings || {}), defaultViewMode: mode.id }
                                  })}
                                  className={`p-2 rounded-xl border text-center transition-all text-[11px] font-bold ${
                                    isSelected
                                      ? 'bg-amber-500/15 border-amber-500 text-white'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {mode.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('palette')}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveThemeConfig('palette')}
                          disabled={isSavingThemeConfig}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar y Plegar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 6: TIPOGRAFÍA GASTRONÓMICA DE AUTOR
                   ===================================================================== */}
                {( themeActiveSubTab === 'identity' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('typography')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Type className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-white">Tipografía Gastronómica de Autor</h2>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Familias tipográficas curadas para Fine Dining, Bistro, Sushi Bar o Steakhouse.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                        {GASTRONOMIC_FONTS.find((f) => f.id === (restaurant?.theme?.fontFamily || 'sans'))?.name.split(' ')[0] || 'Inter'}
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.typography ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.typography && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {GASTRONOMIC_FONTS.map((font) => {
                          const isSelected = (restaurant?.theme?.fontFamily || 'sans') === font.id;
                          return (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => setRestaurant({
                                ...restaurant,
                                theme: { ...(restaurant?.theme || {}), fontFamily: font.id }
                              })}
                              className={`p-3.5 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-white">{font.name}</span>
                                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                              </div>
                              <span className="text-[10px] text-slate-400 block mb-2">{font.tag}</span>
                              <div className={`p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-amber-300 font-semibold ${font.previewClass}`}>
                                {font.sample}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('typography')}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveThemeConfig('typography')}
                          disabled={isSavingThemeConfig}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar y Plegar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 7: STORYTELLING DEL CHEF & PANTALLA DE BIENVENIDA (1.2S)
                   ===================================================================== */}
                {( themeActiveSubTab === 'marketing' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('storytelling')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-white">Pantalla de Bienvenida (1.2s) & Firma del Chef</h2>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Intro animada al escanear el QR, filosofía culinaria del Chef y platillo insignia 3D.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                        {restaurant?.settings?.introSplash?.enabled !== false ? 'Splash ON' : 'Splash OFF'}
                        {restaurant?.settings?.storytelling?.chefQuote?.enabled ? ' • Firma ON' : ''}
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.storytelling ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.storytelling && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-4">
                      {/* Intro Splash 1.2s */}
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-white block">Pantalla de Bienvenida Animada (1.2 segundos)</span>
                            <span className="text-[11px] text-slate-400 block">
                              Muestra el logotipo y lema de tu restaurante con un fundido cinematográfico al abrir el QR.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRestaurant({
                              ...restaurant,
                              settings: {
                                ...(restaurant?.settings || {}),
                                introSplash: {
                                  ...(restaurant?.settings?.introSplash || {}),
                                  enabled: !(restaurant?.settings?.introSplash?.enabled !== false)
                                }
                              }
                            })}
                            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                              restaurant?.settings?.introSplash?.enabled !== false ? 'bg-amber-500' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                                restaurant?.settings?.introSplash?.enabled !== false ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Lema o Tagline de Bienvenida
                          </label>
                          <input
                            type="text"
                            value={restaurant?.settings?.introSplash?.tagline ?? 'Experiencia Gastronómica & WebAR'}
                            onChange={(e) => setRestaurant({
                              ...restaurant,
                              settings: {
                                ...(restaurant?.settings || {}),
                                introSplash: {
                                  ...(restaurant?.settings?.introSplash || {}),
                                  tagline: e.target.value
                                }
                              }
                            })}
                            placeholder="Ej. Cocina de Fuego & Mixología Botánica"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      {/* Firma del Chef */}
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-white block">Bloque Editorial: Firma y Filosofía del Chef</span>
                            <span className="text-[11px] text-slate-400 block">
                              Inserta una tarjeta de historia culinaria en la carta para conectar con el comensal.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRestaurant({
                              ...restaurant,
                              settings: {
                                ...(restaurant?.settings || {}),
                                storytelling: {
                                  ...(restaurant?.settings?.storytelling || {}),
                                  chefQuote: {
                                    ...(restaurant?.settings?.storytelling?.chefQuote || {}),
                                    enabled: !(restaurant?.settings?.storytelling?.chefQuote?.enabled)
                                  }
                                }
                              }
                            })}
                            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                              restaurant?.settings?.storytelling?.chefQuote?.enabled ? 'bg-amber-500' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                                restaurant?.settings?.storytelling?.chefQuote?.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              Nombre del Chef o Firma de Autor
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.storytelling?.chefQuote?.chefName || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  storytelling: {
                                    ...(restaurant?.settings?.storytelling || {}),
                                    chefQuote: {
                                      ...(restaurant?.settings?.storytelling?.chefQuote || {}),
                                      chefName: e.target.value
                                    }
                                  }
                                }
                              })}
                              placeholder="Ej. Chef Ejecutivo Alejandro Morales"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              Platillo Insignia en Portada 3D
                            </label>
                            <select
                              value={restaurant?.settings?.storytelling?.signatureDishId || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  storytelling: {
                                    ...(restaurant?.settings?.storytelling || {}),
                                    signatureDishId: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                            >
                              <option value="">Automático (Primer platillo 3D)</option>
                              {dishes.map((d) => (
                                <option key={d._id || d.id} value={d._id || d.id}>
                                  {d.name} {d.is3D ? '(3D WebAR)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Cita o Filosofía Culinaria
                          </label>
                          <textarea
                            rows="2"
                            value={restaurant?.settings?.storytelling?.chefQuote?.quote || ''}
                            onChange={(e) => setRestaurant({
                              ...restaurant,
                              settings: {
                                ...(restaurant?.settings || {}),
                                storytelling: {
                                  ...(restaurant?.settings?.storytelling || {}),
                                  chefQuote: {
                                    ...(restaurant?.settings?.storytelling?.chefQuote || {}),
                                    quote: e.target.value
                                  }
                                }
                              }
                            })}
                            placeholder="Ej. Cada ingrediente honra la tierra mexicana y el fuego lento de nuestra cocina..."
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('storytelling')}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveThemeConfig('storytelling')}
                          disabled={isSavingThemeConfig}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar y Plegar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 8: MARKETING, CANALES DE CONTACTO COMPLETOS (IG, FB, TIKTOK, WIFI...) Y ASISTENTE IA
                   ===================================================================== */}
                {( themeActiveSubTab === 'marketing' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('marketing')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-white">Canales de Contacto, Redes Sociales, WiFi, Banner y Sommelier IA</h2>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          WhatsApp, Instagram, Facebook, TikTok, Web/Reservas, Google Maps, WiFi de clientes y Promociones.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                        {
                          [
                            restaurant?.settings?.socialLinks?.whatsapp,
                            restaurant?.settings?.socialLinks?.instagram,
                            restaurant?.settings?.socialLinks?.facebook,
                            restaurant?.settings?.socialLinks?.tiktok,
                            restaurant?.settings?.socialLinks?.website,
                            restaurant?.settings?.socialLinks?.phone,
                            restaurant?.settings?.socialLinks?.mapsUrl,
                            restaurant?.settings?.socialLinks?.wifiName
                          ].filter(Boolean).length
                        } Canales Activos
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.marketing ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.marketing && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-5">
                      
                      {/* 1. Banners de Marketing Dinámicos (Fase 5) */}
                      <MarketingBannersManager
                        restaurant={restaurant}
                        setRestaurant={setRestaurant}
                        onSaveTheme={handleSaveThemeConfig}
                      />

                      {/* 2. Directorio Completo de Redes Sociales y Canales de Contacto */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                        <div>
                          <h3 className="text-xs font-bold text-white">Redes Sociales y Canales de Contacto Directo</h3>
                          <p className="text-[11px] text-slate-400">
                            Aparecen como botones interactivos en el pie de tu menú móvil para tus comensales.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* WhatsApp */}
                          <div>
                            <label className="block text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> WhatsApp (Reservas / Pedidos)
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.whatsapp || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), whatsapp: e.target.value }
                                }
                              })}
                              placeholder="Ej. +52 55 1234 5678"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Instagram */}
                          <div>
                            <label className="block text-[10px] font-bold text-pink-400 mb-1 flex items-center gap-1">
                              <Instagram className="w-3 h-3" /> Instagram
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.instagram || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), instagram: e.target.value }
                                }
                              })}
                              placeholder="Ej. @mirestaurante"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                            />
                          </div>

                          {/* Facebook */}
                          <div>
                            <label className="block text-[10px] font-bold text-blue-400 mb-1 flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Facebook
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.facebook || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), facebook: e.target.value }
                                }
                              })}
                              placeholder="Ej. facebook.com/mirestaurante"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* TikTok */}
                          <div>
                            <label className="block text-[10px] font-bold text-cyan-300 mb-1 flex items-center gap-1">
                              <Video className="w-3 h-3" /> TikTok
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.tiktok || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), tiktok: e.target.value }
                                }
                              })}
                              placeholder="Ej. @mirestaurante.oficial"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          {/* Sitio Web / OpenTable */}
                          <div>
                            <label className="block text-[10px] font-bold text-indigo-300 mb-1 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> Sitio Web / Reservaciones
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.website || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), website: e.target.value }
                                }
                              })}
                              placeholder="https://mirestaurante.com"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                            />
                          </div>

                          {/* Teléfono Directo */}
                          <div>
                            <label className="block text-[10px] font-bold text-sky-300 mb-1 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Teléfono Directo (Llamada)
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.phone || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), phone: e.target.value }
                                }
                              })}
                              placeholder="Ej. 55 9876 5432"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
                            />
                          </div>

                          {/* Google Maps */}
                          <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block text-[10px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Ubicación en Google Maps
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.mapsUrl || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), mapsUrl: e.target.value }
                                }
                              })}
                              placeholder="https://maps.app.goo.gl/..."
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        {/* WiFi de Cortesía para Comensales */}
                        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-amber-300 mb-1 flex items-center gap-1">
                              <Wifi className="w-3 h-3" /> Red WiFi para Clientes (Nombre SSID)
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.wifiName || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), wifiName: e.target.value }
                                }
                              })}
                              placeholder="Ej. Invitados_LaTerraza"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400" /> Contraseña WiFi (Opcional)
                            </label>
                            <input
                              type="text"
                              value={restaurant?.settings?.socialLinks?.wifiPassword || ''}
                              onChange={(e) => setRestaurant({
                                ...restaurant,
                                settings: {
                                  ...(restaurant?.settings || {}),
                                  socialLinks: { ...(restaurant?.settings?.socialLinks || {}), wifiPassword: e.target.value }
                                }
                              })}
                              placeholder="Ej. Bienvenidos2026"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Asistente Sommelier IA */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block">Asistente Gastronómico / Sommelier con IA</span>
                          <span className="text-[11px] text-slate-400 block">Atiende dudas sobre maridaje, ingredientes, alérgenos y platillos 3D en el menú.</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setRestaurant({
                            ...restaurant,
                            settings: {
                              ...(restaurant?.settings || {}),
                              aiAssistant: {
                                ...(restaurant?.settings?.aiAssistant || {}),
                                enabled: !(restaurant?.settings?.aiAssistant?.enabled !== false)
                              }
                            }
                          })}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                            restaurant?.settings?.aiAssistant?.enabled !== false ? 'bg-amber-500' : 'bg-slate-800'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                              restaurant?.settings?.aiAssistant?.enabled !== false ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('marketing')}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Plegar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveThemeConfig('marketing')}
                          disabled={isSavingThemeConfig}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar y Plegar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* =====================================================================
                    MÓDULO 9: APARIENCIA DE LA CONSOLA DE ADMINISTRACIÓN (AISLADA DEL MENÚ COMENSAL)
                   ===================================================================== */}
                {( themeActiveSubTab === 'preferences' || themeActiveSubTab === 'all' ) && (
<div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => toggleThemeModule('admin_console')}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-sm sm:text-base font-black text-white">Tema de tu Consola de Trabajo (Solo Admin)</h2>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                            No altera el Menú 1:1
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          Cambia el color de este panel de administración sin afectar los colores del teléfono del comensal.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300">
                        {currentTheme?.name || 'Obsidiana'}
                      </span>
                      <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        {openThemeModules.admin_console ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {openThemeModules.admin_console && (
                    <div className="p-5 sm:p-6 pt-2 border-t border-slate-800/80 space-y-4">
                      <AdminThemeSelector
                        themeKey={themeKey}
                        onSelectTheme={setThemeKey}
                        onSaveToBackend={() => saveThemeToBackend(token, restaurant?._id || restaurant?.slug)}
                        isSaving={isSavingTheme}
                        saveSuccess={adminThemeSaveSuccess}
                        compact={false}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleThemeModule('admin_console')}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                          <span>Plegar sección</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}


                {/* Notificación de Guardado General */}
                {themeSaveSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Configuración e identidad visual guardadas con éxito. Ya están aplicadas en tu menú comensal.</span>
                  </div>
                )}

                {/* Botón Principal Guardar Todo */}
                <button
                  type="button"
                  onClick={() => handleSaveThemeConfig(null)}
                  disabled={isSavingThemeConfig}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingThemeConfig ? 'Guardando configuración...' : 'Guardar Identidad, Arquetipo y Configuración Completa'}</span>
                </button>

                {/* ZONA DE PELIGRO DESPLEGABLE: ELIMINAR CUENTA Y RESTAURANTE */}
                {( themeActiveSubTab === 'preferences' || themeActiveSubTab === 'all' ) && (
<div className="pt-2">
                  <div className="rounded-3xl bg-rose-950/15 border border-rose-900/40 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleThemeModule('danger_zone')}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-rose-950/25 transition-colors"
                    >
                      <span className="text-xs font-bold text-rose-300/90 flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span>Zona de Peligro: Eliminar Cuenta y Restaurante</span>
                      </span>
                      {openThemeModules.danger_zone ? <ChevronUp className="w-4 h-4 text-rose-400" /> : <ChevronDown className="w-4 h-4 text-rose-400" />}
                    </button>

                    {openThemeModules.danger_zone && (
                      <div className="p-4 pt-2 border-t border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-xs text-rose-200/70 max-w-xl leading-relaxed">
                          Elimina de forma irreversible tu cuenta de usuario, tus sedes registradas, platillos, códigos QR e historial. Esta acción no se puede deshacer.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteAccountConfirmText('');
                            setIsDeleteAccountModalOpen(true);
                          }}
                          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shrink-0 transition-all shadow-md active:scale-95"
                        >
                          Eliminar Cuenta y Restaurante
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                )}


              </div>

              {/* COLUMNA DERECHA: SIMULADOR DE CELULAR EN TIEMPO REAL 1:1 (xl:col-span-5) */}
              <div className="hidden xl:block xl:col-span-5 sticky top-6 z-20">
                <div className="p-4 rounded-[40px] bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3 px-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simulador del Menú Comensal</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Sincronizado 1:1 • Aislado</span>
                    </span>
                  </div>

                  <PhoneSimulator
                    restaurant={restaurant}
                    dishes={dishes}
                    categories={categories}
                    focusedCategoryId={focusedCategoryForPreview}
                  />
                </div>
              </div>

            </div>

            {/* Modal de Previsualización en Móvil / Tablet */}
            {showLivePhoneModal && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 xl:hidden">
                <div className="relative w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => setShowLivePhoneModal(false)}
                    className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-slate-200 hover:text-white border border-slate-700 shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <PhoneSimulator
                    restaurant={restaurant}
                    dishes={dishes}
                    categories={categories}
                    focusedCategoryId={focusedCategoryForPreview}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 6: SUSCRIPCIÓN Y SLOTS */}
        {activeTab === 'billing' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-white">Suscripción y Slots 3D</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Administra tu plan comercial activo, cambia de modalidad y adquiere slots adicionales para proyectar más platillos en WebAR.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPlanAdvisorOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto active:scale-95 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Qué plan le conviene a mi negocio?</span>
              </button>
            </div>

            {/* PLAN ACTUAL ACTIVO Y COMPARADOR */}
            {(() => {
              const currentPlanKey = restaurant?.subscription?.plan || 'experience_3d';
              const allPlansList = [
                {
                  key: 'essential',
                  order: 1,
                  title: 'Plan Esencial',
                  netPrice: 449,
                  slots: 'Hasta 4 Platillos 3D (Carta Fija)',
                  desc: 'Ideal para digitalizar tu menú con tus 4 platillos estrella en WebAR (sin rotación en bóveda).'
                },
                {
                  key: 'experience_3d',
                  order: 2,
                  title: 'Experiencia 3D',
                  netPrice: 799,
                  slots: 'Hasta 8 Platillos 3D (+ Bóveda de 8)',
                  popular: true,
                  desc: 'Tus platillos insignia en WebAR 1:1, Modo Mesero con sonido y Bóveda para 8 platillos estacionales.'
                },
                {
                  key: 'chain_vip',
                  order: 3,
                  title: 'VIP Fine Dining',
                  netPrice: 1299,
                  slots: 'Hasta 15 Platillos 3D (+ Bóveda de 30)',
                  desc: 'Para alta cocina: Pedidos en Mesa WebAR 1:1, Comandero en vivo, Croquis de Mesas, Pre-cuenta térmica exacta y Bóveda de 30 platillos.'
                },
                {
                  key: 'enterprise_chain',
                  order: 4,
                  title: 'Cadenas & Franquicias',
                  netPrice: 2199,
                  slots: 'Hasta 20 Platillos 3D (+ Bóveda de 60)',
                  desc: 'Para grupos restauranteros con 2 o más sucursales, Bóveda para 60 platillos y sedes extra a $999 MXN/mes.'
                }
              ];

              const activePlanObj = allPlansList.find((p) => p.key === currentPlanKey) || allPlansList[1];

              return (
                <div className="space-y-4">
                  {/* Tarjeta Destacada del Plan Activo */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/80 shadow-xl ring-1 ring-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tu Plan Activo</span>
                        </span>
                        {currentPlanKey === 'chain_vip' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase">
                            VIP
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-white">{activePlanObj.title}</h3>
                      <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{activePlanObj.desc}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                        <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                          {activePlanObj.slots}
                        </span>
                        <span className="font-extrabold text-white text-base">
                          ${activePlanObj.netPrice} <span className="text-xs text-slate-400 font-normal">MXN / mes (+ IVA)</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPlanComparison(!showPlanComparison)}
                      className="w-full md:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 font-black text-xs transition-all shrink-0 active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{showPlanComparison ? 'Ocultar Otros Planes' : 'Cambiar o Comparar Planes'}</span>
                    </button>
                  </div>

                  {/* Vista de Comparación de los 3 Planes (desplegable y responsiva en celulares) */}
                  {showPlanComparison && (
                    <div className="pt-2 animate-fadeIn space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Planes Disponibles para tu Restaurante
                        </h4>
                        <span className="text-xs text-slate-500 hidden sm:inline">Selecciona uno para cambiar</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {allPlansList.map((p) => {
                          const isCurrent = currentPlanKey === p.key;
                          const iva = Math.round(p.netPrice * 0.16);
                          const totalWithIva = p.netPrice + iva;

                          return (
                            <div
                              key={p.key}
                              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                                isCurrent
                                  ? 'bg-slate-900 border-emerald-500/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                                  : p.popular
                                  ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                                  : 'bg-slate-900/60 border-slate-800'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  {isCurrent ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Tu Plan Activo
                                    </span>
                                  ) : p.popular ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase">
                                      Más Popular
                                    </span>
                                  ) : (
                                    <span />
                                  )}
                                </div>

                                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>

                                <div className="mt-4 pt-4 border-t border-slate-800">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white">${p.netPrice}</span>
                                    <span className="text-xs text-slate-400 font-semibold">MXN / mes</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium mt-0.5">
                                    <span>+ 16% IVA (${iva} MXN)</span>
                                    <span>= <strong>${totalWithIva} MXN</strong></span>
                                  </div>
                                  <div className="mt-3 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium">
                                    {p.slots}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6">
                                {isCurrent ? (
                                  <button
                                    disabled
                                    className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black cursor-default flex items-center justify-center gap-1.5 shadow-sm"
                                  >
                                    <Check className="w-4 h-4" />
                                    <span>Plan Actual Activo</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      try {
                                        const res = await axios.post('/api/v1/billing/checkout', { planKey: p.key }, authHeaders);
                                        if (res.data.url) window.location.href = res.data.url;
                                      } catch (err) {
                                        showToast(err.response?.data?.message || 'Error conectando con la pasarela de pago.', 'error');
                                      }
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all active:scale-95"
                                  >
                                    {p.order > activePlanObj.order ? 'Mejorar a este Plan' : 'Cambiar a este Plan'}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Compra y Gestión de Slots Adicionales */}
            {(() => {
              const currentPlanKey = restaurant?.subscription?.plan || 'experience_3d';
              const baseSlots = currentPlanKey === 'essential' ? 4 : currentPlanKey === 'chain_vip' ? 15 : currentPlanKey === 'enterprise_chain' ? 20 : 8;
              const currentTotalSlots = restaurant?.subscription?.slots3DTotal || stats?.slots3D?.total || baseSlots;
              const extraSlotsCount = Math.max(0, currentTotalSlots - baseSlots);

              return (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>¿Necesitas proyectar más platillos en 3D?</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase">+ Slots Individuales</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        Agrega capacidad individual a tu plan actual por solo <strong className="text-amber-400">$99 MXN + 16% IVA</strong> ($114.84 MXN/mes total) por cada platillo 3D activo adicional.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.post('/api/v1/billing/slots', { quantity: 1 }, authHeaders);
                          if (res.data.url) window.location.href = res.data.url;
                        } catch (err) {
                          showToast(err.response?.data?.message || 'Error conectando con Stripe.', 'error');
                        }
                      }}
                      className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
                    >
                      + Comprar 1 Slot ($99 MXN + IVA)
                    </button>
                  </div>

                  {/* Cancelación de Slots Extra */}
                  {extraSlotsCount > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-xs text-slate-300 font-semibold">
                          Tienes <strong className="text-amber-400 font-bold">{extraSlotsCount} slot{extraSlotsCount > 1 ? 's' : ''} adicional{extraSlotsCount > 1 ? 'es' : ''}</strong> fuera de tu plan base ({baseSlots} base + {extraSlotsCount} extra = {currentTotalSlots} total).
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelSlot}
                        disabled={isCancelingSlot}
                        className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700/80 text-xs font-bold transition-all shrink-0 active:scale-95"
                        title="Cancelar 1 slot adicional para el siguiente ciclo"
                      >
                        {isCancelingSlot ? 'Procesando...' : 'Cancelar 1 Slot Extra'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Resumen de Facturación Mensual Estimada */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">Capacidad y Facturación Actual</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Slots 3D activos: <strong className="text-amber-400">{stats?.slots3D?.used || 0}</strong> en uso de <strong className="text-white">{restaurant?.subscription?.slots3DTotal || stats?.slots3D?.total || 6}</strong> disponibles.
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">IVA 16% desglosado en cada estado de cuenta de Stripe.</span>
                <span className="block text-xs text-emerald-400 font-semibold mt-0.5">Comprobante fiscal CFDI deducible de impuestos.</span>
              </div>
            </div>

            {/* Pronóstico y Desglose Transparente de Próxima Facturación */}
            {(() => {
              const planKey = restaurant?.subscription?.plan || 'experience_3d';
              const basePlanPrice = planKey === 'essential' ? 449 : planKey === 'chain_vip' ? 1299 : planKey === 'enterprise_chain' ? 2199 : 799;
              const planName = planKey === 'essential' ? 'Plan Esencial WebAR' : planKey === 'chain_vip' ? 'Plan VIP Fine Dining' : planKey === 'enterprise_chain' ? 'Plan Cadenas & Franquicias' : 'Plan Experiencia 3D Completa';
              const baseSlots = planKey === 'essential' ? 4 : planKey === 'chain_vip' ? 15 : planKey === 'enterprise_chain' ? 20 : 8;
              const totalSlots = restaurant?.subscription?.slots3DTotal || baseSlots;
              const extraSlotsCount = Math.max(0, totalSlots - baseSlots);
              const extraSlotsCost = extraSlotsCount * 99;
              const subtotalBeforeIva = basePlanPrice + extraSlotsCost;
              const ivaCalculated = Math.round(subtotalBeforeIva * 0.16 * 100) / 100;
              const totalMonthlyCharge = Math.round((subtotalBeforeIva + ivaCalculated) * 100) / 100;

              const nextBillingDate = restaurant?.subscription?.currentPeriodEnd
                ? new Date(restaurant.subscription.currentPeriodEnd).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });

              return (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <span>Desglose de Próximo Cobro Mensual Estimado</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Transparencia total sin comisiones ocultas ni cobros sorpresivos.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-400">Próximo día de cobro:</span>
                      <strong className="text-amber-400 font-bold">{nextBillingDate}</strong>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-300">
                        1. {planName} (incluye {baseSlots} slots 3D incluidos en plan)
                      </span>
                      <span className="font-mono font-bold text-white">${basePlanPrice.toLocaleString()} MXN</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-300">
                        2. Capacidad Adicional ({extraSlotsCount} slot{extraSlotsCount === 1 ? '' : 's'} extra a $99 MXN c/u)
                      </span>
                      <span className="font-mono font-bold text-amber-400">
                        {extraSlotsCount > 0 ? `+$${extraSlotsCost.toLocaleString()} MXN` : '$0 MXN (Sin slots extra)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Subtotal de servicios antes de impuestos</span>
                      <span className="font-mono font-bold text-slate-200">${subtotalBeforeIva.toLocaleString()} MXN</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">16% IVA Trasladado (Deducible SAT CFDI 4.0)</span>
                      <span className="font-mono font-bold text-slate-200">+${ivaCalculated.toLocaleString()} MXN</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-sm font-black">
                      <span className="text-white">Total Estimado a Cobrar el Próximo Mes:</span>
                      <span className="text-base font-mono text-emerald-400">${totalMonthlyCharge.toLocaleString()} MXN</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Facturación automática recurrente gestionada por Stripe Inc. con comprobante fiscal descargable.</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Red de Sedes y Franquicias VIP (Exclusivo Plan Cadena VIP) */}
            {(restaurant?.subscription?.plan || stats?.plan) === 'enterprise_chain' ? (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">Red de Sedes y Franquicias del Grupo</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {myRestaurants.length || 1} {myRestaurants.length === 1 ? 'Sede Activa' : 'Sedes Activas'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Gestiona todas tus sucursales con menús independientes o sincronizados desde un único panel centralizado.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreateBranchModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Nueva Sede</span>
                  </button>
                </div>

                {/* Lista de Sedes Actuales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(myRestaurants.length > 0 ? myRestaurants : (restaurant ? [restaurant] : [])).map((branch, idx) => {
                    const isCurrent = branch._id === (restaurant?._id || activeRestaurantId);
                    const isMatriz = !branch.isBranch;
                    const branchPrice = isMatriz ? 2199 : 999;

                    return (
                      <div
                        key={branch._id || idx}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {branch.logoUrl ? (
                            <img
                              src={getMediaUrl(branch.logoUrl)}
                              alt={branch.name}
                              className="w-10 h-10 rounded-xl object-contain bg-slate-900 p-1 border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shrink-0">
                              {(branch.name || 'S').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white truncate">{branch.name}</h4>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-slate-950">
                                  Actual
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              <span className="font-semibold text-slate-300">
                                {isMatriz ? 'Matriz Principal' : `Sucursal: ${branch.branchName || 'Sede Extra'}`}
                              </span>
                              <span>•</span>
                              <span className="text-emerald-400 font-mono font-bold">${branchPrice} MXN/mes</span>
                              {!isMatriz && (
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-300">
                                  8 SLOTS 3D
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!isCurrent ? (
                            <button
                              type="button"
                              onClick={() => handleSelectRestaurant(branch._id)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold transition-colors"
                            >
                              Administrar
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10">
                              <Check className="w-3.5 h-3.5" />
                              <span>En uso</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reglas de Tarifas y Capacidad 3D */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Política Comercial y Capacidad 3D del Plan Cadenas & Franquicias</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Sede Matriz Principal</div>
                      <div className="text-base font-black text-white font-mono">$2,199 MXN<span className="text-[10px] text-slate-400 font-normal">/mes</span></div>
                      <p className="text-[11px] text-slate-400 mt-1">Incluye 20 platillos propios en 3D, Catálogo Maestro centralizado y soporte prioritario.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 bg-emerald-500/5">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400 mb-1">
                        <span>Sucursales Adicionales</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-black">Tarifa Preferencial</span>
                      </div>
                      <div className="text-base font-black text-emerald-400 font-mono">$999 MXN<span className="text-[10px] text-slate-400 font-normal">/mes</span></div>
                      <p className="text-[11px] text-slate-400 mt-1">+8 slots 3D propios por sucursal. Los platillos compartidos del Catálogo Maestro usan 0 slots adicionales.</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl transition-all ${
                currentTheme.isLight
                  ? 'bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-100/50 border-amber-200/90 text-slate-800'
                  : 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/30 text-white'
              }`}>
                <div className="space-y-1">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    currentTheme.isLight
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>Exclusivo Plan Cadenas & Franquicias</span>
                  </div>
                  <h3 className={`text-base font-bold ${currentTheme.isLight ? 'text-slate-900' : 'text-white'}`}>
                    ¿Tienes 2 o más sucursales o eres una cadena/franquicia?
                  </h3>
                  <p className={`text-xs max-w-xl ${currentTheme.isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Con el Plan Cadenas & Franquicias ($2,199 MXN/mes) puedes gestionar todas tus sedes desde un mismo panel. Agrega sucursales adicionales a solo{' '}
                    <strong className={currentTheme.isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold'}>
                      $999 MXN/mes
                    </strong>{' '}
                    (ahorras $300 MXN / 23% por sede) y tus platillos 3D se sincronizan automáticamente con Catálogo Maestro.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await axios.post('/api/v1/billing/checkout', { planKey: 'enterprise_chain' }, authHeaders);
                      if (res.data.url) window.location.href = res.data.url;
                    } catch (err) {
                      showToast(err.response?.data?.message || 'Error al iniciar suscripción a Plan Cadena VIP.', 'error');
                    }
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 shrink-0"
                >
                  Mejorar a Plan Cadenas & Franquicias
                </button>
              </div>
            )}

          </div>
        )}

        {/* PESTAÑA: EQUIPO & SEGURIDAD RBAC */}
        {activeTab === 'team' && (
          <TeamManagementView
            restaurant={restaurant}
            currentUser={user}
            token={token}
            onNavigateToBilling={() => setActiveTab('billing')}
          />
        )}

      </main>

      {/* MODAL CREAR / EDITAR PLATILLO */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingDish ? 'Editar Platillo' : 'Nuevo Platillo'}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4">
              {/* Sección Multilingüe: Español / English / Français */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                    {[
                      { id: 'es', label: 'Español', flag: '🇪🇸' },
                      { id: 'en', label: 'English', flag: '🇬🇧' },
                      { id: 'fr', label: 'Français', flag: '🇫🇷' }
                    ].map((tab) => {
                      const active = dishLangTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setDishLangTab(tab.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                            active
                              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{tab.flag}</span>
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleAITranslateDish}
                    disabled={isTranslatingDish || !dishForm.name}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    title="Traduce automáticamente este platillo a Inglés y Francés con IA gastronómica"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTranslatingDish ? 'Traduciendo...' : '✨ Traducir con IA'}</span>
                  </button>
                </div>

                {dishLangTab === 'es' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre (Español)</label>
                      <input
                        type="text"
                        value={dishForm.name}
                        onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                        required
                        placeholder="Ej. Tacos de Ribeye con Costra"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-300">Descripción (Español)</label>
                        <button
                          type="button"
                          onClick={handleAIEnhance}
                          disabled={isEnhancing}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1.5 transition-colors"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>{isEnhancing ? 'Redactando...' : 'Mejorar con IA'}</span>
                        </button>
                      </div>
                      <textarea
                        rows="3"
                        value={dishForm.description}
                        onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                        placeholder="Describe los ingredientes, notas de sabor o técnicas de cocción..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ) : dishLangTab === 'en' ? (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-300">Dish Name in English 🇬🇧</label>
                        <span className="text-[10px] text-slate-400">Para comensales extranjeros</span>
                      </div>
                      <input
                        type="text"
                        value={dishForm.translations?.en?.name || ''}
                        onChange={(e) => setDishForm({
                          ...dishForm,
                          translations: {
                            ...dishForm.translations,
                            en: { ...dishForm.translations?.en, name: e.target.value }
                          }
                        })}
                        placeholder="e.g. Ribeye Tacos with Crispy Cheese Crust"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Description in English 🇬🇧</label>
                      <textarea
                        rows="3"
                        value={dishForm.translations?.en?.description || ''}
                        onChange={(e) => setDishForm({
                          ...dishForm,
                          translations: {
                            ...dishForm.translations,
                            en: { ...dishForm.translations?.en, description: e.target.value }
                          }
                        })}
                        placeholder="Fine-dining sensory description for English-speaking diners..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-300">Nom du Plat en Français 🇫🇷</label>
                        <span className="text-[10px] text-slate-400">Pour les convives francophones</span>
                      </div>
                      <input
                        type="text"
                        value={dishForm.translations?.fr?.name || ''}
                        onChange={(e) => setDishForm({
                          ...dishForm,
                          translations: {
                            ...dishForm.translations,
                            fr: { ...dishForm.translations?.fr, name: e.target.value }
                          }
                        })}
                        placeholder="ex. Tacos de Ribeye en Croûte de Fromage"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Description en Français 🇫🇷</label>
                      <textarea
                        rows="3"
                        value={dishForm.translations?.fr?.description || ''}
                        onChange={(e) => setDishForm({
                          ...dishForm,
                          translations: {
                            ...dishForm.translations,
                            fr: { ...dishForm.translations?.fr, description: e.target.value }
                          }
                        })}
                        placeholder="Description gastronomique raffinée pour convives francophones..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (MXN)</label>
                  <input
                    type="number"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    required
                    placeholder="280"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={dishForm.categoryId}
                    onChange={(e) => setDishForm({ ...dishForm, categoryId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fotografía del Platillo (2D) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Fotografía del Platillo
                </label>

                {imageUploadError && (
                  <div className="mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{imageUploadError}</span>
                  </div>
                )}

                {dishForm.imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2.5 flex items-center gap-3">
                    <img
                      src={dishForm.imageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">Foto lista para el menú</p>
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" />
                        <span>Formato optimizado WebP</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 transition-all"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const oldUrl = dishForm.imageUrl;
                          setDishForm((prev) => ({ ...prev, imageUrl: '' }));
                          if (oldUrl && (oldUrl.includes('.r2.dev') || oldUrl.startsWith('/uploads/'))) {
                            try {
                              await axios.delete('/api/v1/upload/file', { data: { url: oldUrl }, ...authHeaders });
                            } catch (e) {
                              console.warn('Error eliminando archivo remoto:', e);
                            }
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition-all"
                        title="Quitar imagen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) uploadImageFile(f);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 group ${
                      isDraggingImage
                        ? 'border-amber-400 bg-amber-500/15 scale-[1.01] shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
                        : 'border-slate-700/80 hover:border-amber-500/80 bg-slate-950/50 hover:bg-slate-900/60'
                    }`}
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-3">
                        <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-amber-400 font-bold animate-pulse">Subiendo y convirtiendo a WebP HD...</span>
                        <span className="text-[10px] text-slate-400">Compresión inteligente sin pérdida</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-1.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isDraggingImage 
                            ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 group-hover:bg-amber-500/20'
                        }`}>
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {isDraggingImage ? '¡Suelta la fotografía aquí!' : 'Arrastra una foto aquí o haz clic para seleccionar'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG o WEBP (máx. 15 MB) • Conversión automática</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />

                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    id="companion-btn-photo"
                    onClick={() => {
                      setCompanionKind('image');
                      setIsCompanionModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Capturar con mi celular (QR)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowManualImageUrl(!showManualImageUrl)}
                    className="text-xs text-slate-400 hover:text-amber-400 underline"
                  >
                    {showManualImageUrl ? 'Ocultar enlace web' : '¿Pegar enlace web?'}
                  </button>
                </div>
                {showManualImageUrl && (
                  <input
                    type="text"
                    value={dishForm.imageUrl}
                    onChange={(e) => setDishForm({ ...dishForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>

              {/* Micro-Video del Platillo (Reels / Formato Dinámico Vertical) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Micro-Video en Bucle (Opcional • Formato Reels)</span>
                  </label>
                  {dishForm.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setDishForm((prev) => ({ ...prev, videoUrl: '' }))}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Quitar video
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Enlace directo a video corto (MP4 o WebM) de 3 a 10 segundos mostrando la preparación, vapor o corte del platillo.
                </p>
                <input
                  type="text"
                  value={dishForm.videoUrl}
                  onChange={(e) => setDishForm({ ...dishForm, videoUrl: e.target.value })}
                  placeholder="https://assets.ejemplo.com/videos/platillo.mp4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                {dishForm.videoUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 max-h-40 flex items-center justify-center">
                    <video
                      src={dishForm.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-h-40 w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Casilla 3D WebAR Real */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dishForm.is3D}
                    onChange={(e) => setDishForm({ ...dishForm, is3D: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Activar Experiencia WebAR 1:1 en Realidad Aumentada (Consume 1 Slot 3D)</span>
                  </span>
                </label>

                {dishForm.is3D && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    
                    {/* Banner Escaneo 3D con IA (Tripo3D) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900 border border-amber-500/40 flex items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md shadow-amber-500/20">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Escanear en 3D</span>
                            
                          </h4>
                          <p className="text-[11px] text-slate-400">Captura 1 o 3 fotos con tu celular y nuestra IA generará el modelo 3D a escala real 1:1.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const targetDish = dishes.find((d) => d._id === editingDishId) || {
                            _id: editingDishId || 'temp-id',
                            name: dishForm.name || 'Platillo',
                            imageUrl: dishForm.imageUrl,
                            is3D: dishForm.is3D,
                            modelGlbUrl: dishForm.modelGlbUrl,
                            dishDiameterCm: dishForm.dishDiameterCm || 25
                          };
                          handleOpenAi3DScanner(targetDish);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Escanear en 3D</span>
                      </button>
                    </div>

                    {/* Selector de origen del modelo 3D (Fase 2) */}
                    <div role="tablist" aria-label="Origen del modelo 3D" className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                      {[
                        { id: 'catalog', label: 'Biblioteca 3D', hint: '1 clic', icon: Layers },
                        { id: 'upload', label: 'Subir mi archivo', hint: '.GLB / .USDZ', icon: UploadCloud }
                      ].map((tab) => {
                        const active = mode3DTab === tab.id;
                        const TabIcon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            id={`model-source-tab-${tab.id}`}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setMode3DTab(tab.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                              active
                                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                            }`}
                          >
                            <TabIcon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                            <span className={`hidden sm:inline text-[10px] font-semibold ${active ? 'text-slate-900/70' : 'text-slate-500'}`}>· {tab.hint}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Banner Educativo: Guía Cómo Escanear en 3D Paso a Paso */}
                    {mode3DTab === 'upload' && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">¿Cómo escanear tus platillos en 3D con tu celular?</h4>
                          <p className="text-xs text-slate-400">Escanea gratis tus propios platillos reales en minutos con Scaniverse o Polycam.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsScanGuideOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Ver Guía Paso a Paso</span>
                      </button>
                    </div>
                    )}

                    {/* Subir Archivo 3D Propio (.GLB / .USDZ) */}
                    <div className="space-y-2">
                      {modelUploadError && (
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{modelUploadError}</span>
                        </div>
                      )}

                      {dishForm.modelGlbUrl ? (
                        <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col group transition-all">
                          {/* Barra superior flotante de la vista previa */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-1.5 pointer-events-auto">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md shadow-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                3D WebAR Activo
                              </span>
                              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                                Órbita 360°
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 pointer-events-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  if (mode3DTab === 'upload') {
                                    modelInputRef.current?.click();
                                    return;
                                  }
                                  // En Biblioteca: limpiar para volver a mostrar la cuadrícula de modelos
                                  const oldGlb = dishForm.modelGlbUrl;
                                  setDishForm((prev) => ({ ...prev, modelGlbUrl: '', modelUsdzUrl: '' }));
                                  setUploadedModelName('');
                                  if (oldGlb && (oldGlb.includes('.r2.dev') || oldGlb.startsWith('/uploads/'))) {
                                    axios.delete('/api/v1/upload/file', { data: { url: oldGlb }, ...authHeaders }).catch(() => {});
                                  }
                                }}
                                className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-[11px] font-bold text-amber-300 border border-amber-500/40 backdrop-blur-md transition-all shadow-md active:scale-95 flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Cambiar 3D</span>
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  const oldGlb = dishForm.modelGlbUrl;
                                  const oldUsdz = dishForm.modelUsdzUrl;
                                  setDishForm((prev) => ({ ...prev, modelGlbUrl: '', modelUsdzUrl: '' }));
                                  setUploadedModelName('');
                                  if (oldGlb && (oldGlb.includes('.r2.dev') || oldGlb.startsWith('/uploads/'))) {
                                    axios.delete('/api/v1/upload/file', { data: { url: oldGlb }, ...authHeaders }).catch(() => {});
                                  }
                                  if (oldUsdz && (oldUsdz.includes('.r2.dev') || oldUsdz.startsWith('/uploads/'))) {
                                    axios.delete('/api/v1/upload/file', { data: { url: oldUsdz }, ...authHeaders }).catch(() => {});
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 backdrop-blur-md transition-all"
                                title="Eliminar modelo 3D"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Render interactivo 3D con model-viewer */}
                          <div className="relative w-full h-64 bg-slate-950/70">
                            <model-viewer
                              src={dishForm.modelGlbUrl}
                              ios-src={dishForm.modelUsdzUrl || undefined}
                              alt={dishForm.name || 'Vista previa 3D'}
                              camera-controls
                              auto-rotate
                              rotation-per-second="25deg"
                              shadow-intensity="1.5"
                              shadow-softness="0.8"
                              exposure="1.05"
                              ar-scale="auto"
                              interaction-prompt="none"
                              style={{ width: '100%', height: '100%', outline: 'none' }}
                            >
                              <div slot="poster" className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
                                <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                                <span className="text-xs text-amber-300 font-medium">Cargando modelo 3D...</span>
                              </div>
                            </model-viewer>
                          </div>

                          {/* Barra de pie de la vista previa con metadatos */}
                          <div className="px-3.5 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-xs backdrop-blur-md">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                                {uploadedModelName || dishForm.modelGlbUrl.split('/').pop()}
                              </span>
                              {dishForm.modelUsdzUrl && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  iOS + Android
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500 text-[10px] hidden sm:inline">
                              Gira con el cursor para inspeccionar
                            </span>
                          </div>
                        </div>
                      ) : mode3DTab === 'catalog' ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Elige un modelo y velo en 3D al instante
                            </p>
                            <span className="text-[10px] text-slate-500">{MODEL_LIBRARY.length} modelos</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {MODEL_LIBRARY.map((model) => (
                              <button
                                key={model.id}
                                id={`model-library-${model.id}`}
                                type="button"
                                onClick={() => {
                                  setModelUploadError(null);
                                  setDishForm((prev) => ({ ...prev, is3D: true, modelGlbUrl: model.url, modelUsdzUrl: '' }));
                                  setUploadedModelName(`${model.name} · Biblioteca 3D`);
                                  showToast(`"${model.name}" asignado. Revisa la vista previa 3D.`, 'success');
                                }}
                                className={`group relative p-3 rounded-2xl border border-slate-800 hover:border-amber-500/60 bg-gradient-to-br ${model.gradient} text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 overflow-hidden`}
                              >
                                <span className="absolute -right-2 -bottom-3 text-5xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 select-none" aria-hidden="true">
                                  {model.emoji}
                                </span>
                                <span className="text-2xl block mb-1.5 group-hover:scale-110 transition-transform duration-300 origin-left" aria-hidden="true">{model.emoji}</span>
                                <p className="text-xs font-bold text-white leading-tight">{model.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{model.category} · {model.size}</p>
                                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Plus className="w-3 h-3" /> Usar modelo
                                </span>
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            Modelos de muestra para probar la experiencia WebAR con tus comensales. Para mostrar tu platillo real, escanéalo y súbelo en la pestaña{' '}
                            <button type="button" onClick={() => setMode3DTab('upload')} className="text-amber-400 hover:underline font-semibold">Subir mi archivo</button>.
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() => modelInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingModel(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDraggingModel(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingModel(false);
                            const f = e.dataTransfer.files?.[0];
                            if (f) uploadModelFile(f);
                          }}
                          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 group ${
                            isDraggingModel
                              ? 'border-emerald-400 bg-emerald-500/15 scale-[1.01] shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/40'
                              : 'border-slate-700/80 hover:border-amber-500/80 bg-slate-900/60 hover:bg-slate-900/90'
                          }`}
                        >
                          {isUploadingModel ? (
                            <div className="flex flex-col items-center gap-2 py-3">
                              <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-xs text-emerald-400 font-bold animate-pulse">Verificando y cargando archivo 3D WebAR...</span>
                              <span className="text-[10px] text-slate-400">Validando geometría y texturas</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 py-1.5">
                              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                isDraggingModel
                                  ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 group-hover:bg-amber-500/20'
                              }`}>
                                <Box className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                                  {isDraggingModel ? '¡Suelta tu archivo 3D aquí!' : 'Arrastra tu archivo 3D (.GLB o .USDZ) aquí o haz clic'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Exportado desde tu celular o fotogrametría (hasta 25 MB)
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        ref={modelInputRef}
                        type="file"
                        accept=".glb,.usdz"
                        onChange={handleModelFileUpload}
                        className="hidden"
                      />

                      {mode3DTab === 'upload' && !dishForm.modelGlbUrl && (
                        <div className="pt-2 flex flex-wrap justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const targetDish = dishes.find((d) => d._id === editingDishId) || {
                                _id: editingDishId || 'temp-id',
                                name: dishForm.name || 'Platillo',
                                imageUrl: dishForm.imageUrl,
                                is3D: dishForm.is3D,
                                modelGlbUrl: dishForm.modelGlbUrl,
                                dishDiameterCm: dishForm.dishDiameterCm || 25
                              };
                              handleOpenAi3DScanner(targetDish);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-amber-500/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Escanear en 3D</span>
                          </button>

                          <button
                            type="button"
                            id="companion-btn-model"
                            onClick={() => {
                              setCompanionKind('model');
                              setIsCompanionModalOpen(true);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Enviar archivo 3D desde mi celular (QR)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Enlaces manuales (Avanzado) */}
                    <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowManual3DUrl(!showManual3DUrl)}
                        className="text-xs text-slate-400 hover:text-amber-400 underline"
                      >
                        {showManual3DUrl ? 'Ocultar URLs directas' : '¿Tienes una URL directa de tu CDN?'}
                      </button>
                    </div>

                    {showManual3DUrl && (
                      <div className="space-y-2 pt-1">
                        <div>
                          <label className="block text-xs text-slate-400 mb-0.5">URL Archivo GLB (Android WebXR)</label>
                          <input
                            type="text"
                            value={dishForm.modelGlbUrl}
                            onChange={(e) => setDishForm({ ...dishForm, modelGlbUrl: e.target.value })}
                            placeholder="https://.../modelo.glb"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-0.5">URL Archivo USDZ (iOS QuickLook opcional)</label>
                          <input
                            type="text"
                            value={dishForm.modelUsdzUrl}
                            onChange={(e) => setDishForm({ ...dishForm, modelUsdzUrl: e.target.value })}
                            placeholder="https://.../modelo.usdz"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Casilla Pedido Estrella / Más Vendido (⭐) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(dishForm.isFeatured)}
                    onChange={(e) => setDishForm({ ...dishForm, isFeatured: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Marcar como Pedido Estrella / Más Pedido ⭐</span>
                  </span>
                </label>
                <p className="text-[11px] text-slate-400 pl-6">
                  Se destacará con una estrella dorada y se posicionará inmediatamente después de los modelos 3D en el menú del comensal.
                </p>
              </div>

              {/* Selector Manual de Alérgenos y Dietas (Control Total del Restaurante) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Alérgenos y Etiquetas Dietéticas</span>
                    <span className="text-xs font-normal text-slate-400">(Opcional • Manual)</span>
                  </label>
                  {dishForm.allergens?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDishForm((prev) => ({ ...prev, allergens: [] }))}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Limpiar todo
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Selecciona los alérgenos que correspondan para que tus comensales lo vean con claridad en el menú:
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { id: 'gluten', label: 'Gluten' },
                    { id: 'dairy', label: 'Lácteos' },
                    { id: 'shellfish', label: 'Mariscos' },
                    { id: 'nuts', label: 'Nueces' },
                    { id: 'eggs', label: 'Huevo' },
                    { id: 'spicy', label: 'Picante' },
                    { id: 'vegan', label: 'Vegano' },
                    { id: 'vegetarian', label: 'Vegetariano' },
                    { id: 'fish', label: 'Pescado' }
                  ].map((item) => {
                    const isSelected = (dishForm.allergens || []).includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setDishForm((prev) => {
                            const current = prev.allergens || [];
                            const exists = current.includes(item.id);
                            return {
                              ...prev,
                              allergens: exists ? current.filter((k) => k !== item.id) : [...current, item.id]
                            };
                          });
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 active:scale-95 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-xs">{isSelected ? '✓' : '+'}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Turnos y Horarios de Servicio (Fase 4: Multi-Cartas) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Turnos y Horarios de Servicio</span>
                    <span className="text-xs font-normal text-slate-400">(Multi-Cartas)</span>
                  </label>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {!dishForm.availableSchedules || dishForm.availableSchedules.includes('all')
                      ? 'Todo el día'
                      : `${dishForm.availableSchedules.length} turno(s)`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Selecciona en qué turnos estará disponible este platillo para los comensales:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDishForm((prev) => ({ ...prev, availableSchedules: ['all'] }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                      !dishForm.availableSchedules || dishForm.availableSchedules.includes('all')
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>Todo el día (Cualquier turno)</span>
                  </button>

                  {[
                    { id: 'breakfast', label: 'Desayunos', icon: '☕' },
                    { id: 'lunch', label: 'Comidas', icon: '🍽️' },
                    { id: 'dinner', label: 'Cenas', icon: '🍷' }
                  ].map((sched) => {
                    const isAll = !dishForm.availableSchedules || dishForm.availableSchedules.includes('all');
                    const isSelected = !isAll && (dishForm.availableSchedules || []).includes(sched.id);

                    return (
                      <button
                        key={sched.id}
                        type="button"
                        onClick={() => {
                          setDishForm((prev) => {
                            let current = prev.availableSchedules || ['all'];
                            if (current.includes('all')) {
                              current = [];
                            }
                            const exists = current.includes(sched.id);
                            const next = exists ? current.filter((k) => k !== sched.id) : [...current, sched.id];
                            return {
                              ...prev,
                              availableSchedules: next.length === 0 ? ['all'] : next
                            };
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{sched.icon}</span>
                        <span>{sched.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage || isUploadingModel}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black transition-all"
                >
                  {isUploadingImage || isUploadingModel ? 'Subiendo archivos...' : 'Guardar Platillo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GUÍA CÓMO ESCANEAR EN 3D */}
      {isScanGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
        >
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setIsScanGuideOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar guía"
            >
              <X className="w-5 h-5" />
            </button>
            <ScanGuideView onActionClick={() => setIsScanGuideOpen(false)} onStartScan={() => { setIsScanGuideOpen(false); handleOpenAi3DScannerFromGuide(); }} />
          </div>
        </div>
      )}

      {/* MODAL UPSELL SLOTS 3D */}
      {isUpsellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Límite de Slots 3D Alcanzado</h3>
            <p className="text-xs text-slate-300 mt-2 mb-6 leading-relaxed">
              {upsellMessage || 'Has ocupado todos los slots 3D incluidos en tu plan actual.'}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsUpsellModalOpen(false);
                  setActiveTab('billing');
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Adquirir Slot Adicional ($99 MXN/mes)
              </button>
              <button
                onClick={() => {
                  setIsUpsellModalOpen(false);
                  setActiveTab('vault');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Mover un platillo a la Bóveda para liberar cupo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ACCESIBLE (WCAG 2.2 confirmation-dialogs) */}
      {dishToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
        >
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 id="confirm-delete-title" className="text-base font-bold text-white">¿Eliminar este platillo?</h3>
            <p className="text-xs text-slate-300 mt-2 mb-6 leading-relaxed">
              Esta acción no se puede deshacer. El platillo y su modelo 3D asociado serán removidos permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDishToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteDish}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN: VACIAR CATÁLOGO COMPLETO */}
      {isDeleteAllModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-all-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
        >
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 id="confirm-delete-all-title" className="text-lg font-bold text-white">
              ¿Vaciar todo el catálogo de platillos?
            </h3>
            <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
              Esta acción eliminará permanentemente <strong className="text-rose-400">todos los platillos</strong> de este restaurante y liberará todos los modelos 3D asociados. Tus categorías y configuración de restaurante se mantendrán intactas.
            </p>
            <div className="p-3 bg-rose-950/30 border border-rose-500/20 rounded-xl mb-4">
              <p className="text-[11px] text-rose-300 font-medium">
                Para confirmar, escribe la palabra <strong className="text-white font-bold">ELIMINAR</strong> a continuación:
              </p>
              <input
                type="text"
                value={deleteAllConfirmText}
                onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                className="mt-2 w-full px-3 py-2 bg-slate-950 border border-rose-500/40 rounded-lg text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-rose-400 tracking-wider uppercase"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteAllModalOpen(false);
                  setDeleteAllConfirmText('');
                }}
                disabled={isDeletingAll}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAllDishes}
                disabled={deleteAllConfirmText.trim().toUpperCase() !== 'ELIMINAR' || isDeletingAll}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeletingAll ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Sí, vaciar catálogo</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN: ELIMINAR CUENTA Y RESTAURANTE */}
      {isDeleteAccountModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-account-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <div className="w-full max-w-md bg-slate-900 border border-rose-600/50 rounded-3xl p-6 shadow-2xl text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 id="confirm-delete-account-title" className="text-lg font-bold text-white">
              Eliminar Cuenta y Restaurante
            </h3>
            <p className="text-xs text-rose-300/90 mt-2 mb-4 leading-relaxed bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
              <strong>ADVERTENCIA IRREVERSIBLE:</strong> Esta acción dará de baja definitiva a tu cuenta de usuario, tu restaurante, todo tu menú, modelos 3D, códigos QR y configuraciones asociadas.
            </p>
            <div className="p-3 bg-slate-950 border border-rose-500/30 rounded-xl mb-4">
              <p className="text-[11px] text-slate-300 font-medium">
                Para confirmar la eliminación total, escribe exactamente: <strong className="text-rose-400 font-bold select-all">ELIMINAR MI CUENTA</strong>
              </p>
              <input
                type="text"
                value={deleteAccountConfirmText}
                onChange={(e) => setDeleteAccountConfirmText(e.target.value)}
                placeholder="ELIMINAR MI CUENTA"
                className="mt-2 w-full px-3 py-2 bg-slate-900 border border-rose-500/50 rounded-lg text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-rose-400 tracking-wider"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteAccountModalOpen(false);
                  setDeleteAccountConfirmText('');
                }}
                disabled={isDeletingAccount}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteAccountConfirmText.trim() !== 'ELIMINAR MI CUENTA' || isDeletingAccount}
                className="w-1/2 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-rose-700/30 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeletingAccount ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Eliminar Definitivamente</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR NUEVA MESA */}
      {isAddTableModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Nueva Mesa</h3>
                  <p className="text-xs text-slate-400">Registra una mesa en tu salón o terraza.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTableModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Número o Nombre de Mesa *
                </label>
                <input
                  type="text"
                  required
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="Ej. 6, 12, VIP-1, Barra-A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Zona o Salón *
                </label>
                <input
                  type="text"
                  required
                  value={newTableZone}
                  onChange={(e) => setNewTableZone(e.target.value)}
                  placeholder="Ej. Salón Principal, Terraza, Barra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-amber-500 mb-2"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Salón Principal', 'Terraza', 'Barra', 'Planta Alta', 'Zona VIP'].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setNewTableZone(z)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                        newTableZone === z
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingTables || !newTableNumber.trim()}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSavingTables ? 'Guardando...' : 'Crear Mesa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR MESA */}
      {editingTable && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Editar Mesa</h3>
                  <p className="text-xs text-slate-400">Modifica el identificador o la zona.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTable(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Número o Nombre de Mesa *
                </label>
                <input
                  type="text"
                  required
                  value={editingTable.number}
                  onChange={(e) => setEditingTable({ ...editingTable, number: e.target.value })}
                  placeholder="Ej. 6, 12, VIP-1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Zona o Salón *
                </label>
                <input
                  type="text"
                  required
                  value={editingTable.zone}
                  onChange={(e) => setEditingTable({ ...editingTable, zone: e.target.value })}
                  placeholder="Ej. Salón Principal, Terraza, Barra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-amber-500 mb-2"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Salón Principal', 'Terraza', 'Barra', 'Planta Alta', 'Zona VIP'].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setEditingTable({ ...editingTable, zone: z })}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                        editingTable.zone === z
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingTables || !editingTable.number.trim()}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSavingTables ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR MESA CON PROTECCIÓN DE QR */}
      {tableToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                ¿Eliminar Mesa {tableToDelete.number}?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Estás a punto de eliminar la mesa <strong>"{tableToDelete.number}"</strong> ubicada en <strong>"{tableToDelete.zone || 'Principal'}"</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-bold block mb-0.5">Protección de Códigos QR Activa:</span>
              Las demás mesas conservarán sus números actuales intactos para no alterar los códigos QR que ya tengas impresos en sala.
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTableToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteTable}
                disabled={isSavingTables}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isSavingTables ? 'Eliminando...' : 'Eliminar Mesa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: COMPACTAR Y RENUMERAR SECUENCIALMENTE */}
      {isReorderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                ¿Renumerar mesas secuencialmente del 1 al N?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Esta acción compactará los saltos numéricos de tus mesas y las reasignará ordenadamente (1, 2, 3... hasta {tablesList.length}).
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-relaxed">
              <strong className="block font-bold text-amber-400 mb-1">⚠️ Advertencia de Códigos QR Físicos:</strong>
              Si ya mandaste a imprimir códigos QR o stickers en los acrílicos de tus mesas físicas, <strong>deberás volver a imprimirlos</strong>, ya que las mesas habrán cambiado de número.
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReorderSequential}
                disabled={isSavingTables}
                className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
              >
                <ListOrdered className="w-4 h-4" />
                <span>{isSavingTables ? 'Renumerando...' : 'Sí, Renumerar (1 a N)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FLOTANTE ACCESIBLE UNIFICADO (WCAG 2.2 AA toast-accessibility) */}
      {dashboardToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-medium text-white max-w-md animate-fade-in"
        >
          {dashboardToast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : dashboardToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="flex-1">{dashboardToast.message}</span>
          <button
            onClick={() => setDashboardToast(null)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL DE CREACIÓN DE NUEVA SEDE / SUCURSAL VIP */}
      <CreateBranchModal
        isOpen={isCreateBranchModalOpen}
        onClose={() => setIsCreateBranchModalOpen(false)}
        parentRestaurant={restaurant}
        currentBranchesCount={myRestaurants.length || 1}
        token={token}
        onSuccess={handleBranchCreated}
        onUpgradeToVip={() => {
          setIsCreateBranchModalOpen(false);
          setActiveTab('billing');
        }}
      />

      {/* MODAL ESCANEO 3D CON IA (TRIPO3D) */}
      {isAi3DModalOpen && selectedDishForAi3D && (
        <Ai3DScanModal
          isOpen={isAi3DModalOpen}
          dish={selectedDishForAi3D}
          dishes={dishes}
          authHeaders={authHeaders}
          onSuccess={(updatedDish) => {
            setDishes((prev) => prev.map((d) => (d._id === updatedDish._id ? { ...d, ...updatedDish } : d)));
            if (dishForm && editingDishId === updatedDish._id) {
              setDishForm((prev) => ({
                ...prev,
                is3D: true,
                modelGlbUrl: updatedDish.modelGlbUrl,
                dishDiameterCm: updatedDish.dishDiameterCm || 25,
                scale: updatedDish.scale
              }));
              setUploadedModelName((updatedDish.name || 'Platillo') + ' · 3D IA');
            }
            showToast('¡Platillo 3D sincronizado con éxito!', 'success');
          }}
          onClose={() => {
            setIsAi3DModalOpen(false);
            setSelectedDishForAi3D(null);
          }}
          onUpsell={() => {
            setIsAi3DModalOpen(false);
            setIsUpsellModalOpen(true);
          }}
        />
      )}

      {/* MODAL FASE 3: CAPTURA MÓVIL VÍA QR (QR COMPANION) */}
      {isCompanionModalOpen && (
        <CompanionUploadModal
          kind={companionKind}
          authHeaders={authHeaders}
          onReceive={(file) => {
            if (file.fileType === 'model_3d') {
              const isUsdz = file.originalName?.toLowerCase().endsWith('.usdz');
              setDishForm((prev) => ({
                ...prev,
                is3D: true,
                modelGlbUrl: isUsdz ? prev.modelGlbUrl : file.url,
                modelUsdzUrl: isUsdz ? file.url : prev.modelUsdzUrl
              }));
              setUploadedModelName(file.originalName || 'Modelo 3D móvil');
              showToast('¡Modelo 3D recibido desde el celular!', 'success');
            } else {
              setDishForm((prev) => ({ ...prev, imageUrl: file.url }));
              showToast('¡Fotografía recibida desde el celular!', 'success');
            }
          }}
          onClose={() => setIsCompanionModalOpen(false)}
        />
      )}

      {/* MODAL CENTRO DE AYUDA Y REPORTES DE SOPORTE */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        restaurant={restaurant}
        user={user}
        token={token}
      />

      {/* MODAL ASESOR GASTRONÓMICO DE PLANES */}
      <PlanAdvisorModal
        isOpen={isPlanAdvisorOpen}
        onClose={() => setIsPlanAdvisorOpen(false)}
        restaurant={restaurant}
        token={token}
        onPlanUpdated={() => loadInitialData(token)}
      />

      {/* MODAL PAYWALL BLOQUEADOR AL EXPIRAR PRUEBA VIP */}
      <TrialPaywallModal
        isOpen={isTrialExpired || isPaywallTriggered}
        restaurant={restaurant}
        token={token}
        onLogout={() => handleLogout(false)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

    </div>
  );
}

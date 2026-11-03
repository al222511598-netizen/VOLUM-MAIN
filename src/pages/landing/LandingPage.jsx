import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Smartphone,
  Check,
  X,
  ShieldCheck,
  Box,
  QrCode,
  ArrowRight,
  ChevronDown,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Calculator,
  HelpCircle,
  Mail,
  Send,
  Building2,
  Wand2,
  Palette,
  Star,
  Flame,
  Award,
  Clock,
  Lock,
  Loader2,
  LogIn,
  Rocket,
  Laptop,
  RotateCw,
  CheckCircle2,
  TrendingUp,
  Timer,
  Zap,
  Menu,
  ExternalLink,
  Sliders,
  RefreshCw,
  Copy,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import InteractiveShowcase from '../../components/InteractiveShowcase';
import PhoneSimulator from '../../components/PhoneSimulator';
import { BRAND_PALETTES, useBrandPalette } from '../../config/brandPalettes';
import loadModelViewer from '../../utils/loadModelViewer';

const COMPARISON_DISHES = {
  avocado: {
    id: 'avocado',
    category: 'ESPECIALIDADES',
    name: 'Aguacate Hass & Tartar',
    price: '$260 MXN',
    scale: 'Porción 1:1 escala real 12 cm',
    impact: '+31% en platillos frescos y entradas',
    description: 'Medio aguacate madurado en punto óptimo con tartar de salmón fresco, flor de sal y brotes botánicos.',
    image: '/images/nordic-bistro-banner.jpg',
    modelUrl: '/models/avocado.glb',
    badge: 'Porción 1:1 escala real 12 cm',
    features: [
      { label: 'Escala Métrica Calibrada', value: 'Porción 1:1 escala real 12 cm' },
      { label: 'Impacto en Ventas', value: '+31% en platillos frescos y entradas' },
      { label: 'Proyección WebAR', value: 'Compatible con iOS Safari y Android Chrome.' }
    ]
  },
  grill: {
    id: 'grill',
    category: 'CORTES FINOS',
    name: 'Corte a la Leña & Carbón Vivo',
    price: '$890 MXN',
    scale: '30 cm de diámetro en asador',
    impact: '+28% en cortes y ticket promedio',
    description: 'Corte sellado al fuego directo sobre carbón de encino al rojo vivo con mantequilla clarificada y sal en grano.',
    image: '/images/hero-steak-banner.jpg',
    modelUrl: '/models/coals-grill-clean.glb',
    badge: '30 cm de diámetro en asador',
    features: [
      { label: 'Escala Métrica Calibrada', value: '30 cm de diámetro en asador' },
      { label: 'Impacto en Ventas', value: '+28% en cortes y ticket promedio' },
      { label: 'Proyección WebAR', value: 'Compatible con iOS Safari y Android Chrome.' }
    ]
  },
  olives: {
    id: 'olives',
    category: 'COCINA DE MERCADO',
    name: 'Tapas Mediterráneas de Autor',
    price: '$340 MXN',
    scale: 'Plato individual 18 cm',
    impact: '+24% en entradas y aperitivos',
    description: 'Selección de aceitunas maceradas en hierbas de olor, aceite de oliva virgen extra y plato cerámico artesanal.',
    image: '/images/obsidian-cocktail-banner.jpg',
    modelUrl: '/models/olives-dish.glb',
    badge: 'Plato individual 18 cm',
    features: [
      { label: 'Escala Métrica Calibrada', value: 'Plato individual 18 cm' },
      { label: 'Impacto en Ventas', value: '+24% en entradas y aperitivos' },
      { label: 'Proyección WebAR', value: 'Compatible con iOS Safari y Android Chrome.' }
    ]
  }
};

const PLAN_DATA = {
  essential: {
    key: 'essential',
    name: 'Plan Esencial',
    tagline: 'Tus 4 platillos estrella escaneados en 3D con tu celular',
    monthlyPrice: 449,
    annualMonthlyPrice: 374,
    annualTotalPrice: 4490,
    setupFee: 0,
    slots: 'Hasta 4 Platillos 3D (Carta Fija)',
    badge: 'Inicio Gastronómico'
  },
  experience_3d: {
    key: 'experience_3d',
    name: 'Experiencia 3D',
    tagline: 'Tus platillos insignia digitalizados a tamaño real 1:1',
    monthlyPrice: 799,
    annualMonthlyPrice: 665,
    annualTotalPrice: 7990,
    setupFee: 0,
    slots: 'Hasta 8 Platillos 3D (+ Bóveda de 8)',
    badge: 'Más Popular'
  },
  chain_vip: {
    key: 'chain_vip',
    name: 'VIP Fine Dining',
    tagline: 'Para restaurantes insignia, alta cocina y rotación estacional',
    monthlyPrice: 1299,
    annualMonthlyPrice: 1080,
    annualTotalPrice: 12990,
    setupFee: 0,
    slots: 'Hasta 15 Platillos 3D (+ Bóveda de 30)',
    badge: 'Restaurante Insignia'
  },
  enterprise_chain: {
    key: 'enterprise_chain',
    name: 'Cadenas & Franquicias',
    tagline: 'Para grupos restauranteros con 2 o más sucursales',
    monthlyPrice: 2199,
    annualMonthlyPrice: 1832,
    annualTotalPrice: 21990,
    setupFee: 0,
    slots: 'Hasta 20 Platillos 3D (+ Bóveda de 60)',
    badge: 'Grupos & Franquicias'
  }
};

export default function LandingPage() {
  // Estado persistente para la Paleta de Marca activa (Nordic Bistro, Deep Obsidian, Neobrutalism)
  const { selectedPaletteKey, setSelectedPaletteKey, currentPalette } = useBrandPalette();
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  // Precargar el motor WebAR @google/model-viewer para la seccion de comparacion interactiva
  useEffect(() => {
    loadModelViewer();
  }, []);

  // Cerrar dropdown de paletas al hacer click fuera o presionar Escape
  useEffect(() => {
    if (!paletteDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('#palette-picker-container')) {
        setPaletteDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setPaletteDropdownOpen(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [paletteDropdownOpen]);

  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'annual'

  // Menú móvil drawer (Imágenes 1 y 2)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demostración móvil interactiva (Imágenes 3 y 4)
  const [mobileDemoTab, setMobileDemoTab] = useState('console'); // 'console' | 'phone'
  const [burgerAvailable, setBurgerAvailable] = useState(true);
  const [ribeyeDiscounted, setRibeyeDiscounted] = useState(false);
  const [tableCallActive, setTableCallActive] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const playMobileChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
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
    } catch (e) {
      // Ignorar restricciones de audio del navegador
    }
  };

  const mobileDemoCategories = useMemo(() => [
    { id: 'cat-3d', name: 'Platillos 3D' },
    { id: 'cortes', name: 'Cortes Finos' },
    { id: 'bebidas', name: 'Coctelería' }
  ], []);

  const mobileDemoDishes = useMemo(() => [
    {
      id: 'dish-wagyu',
      name: 'Burger Wagyu Suprema & Trufa',
      description: '220g de carne Wagyu A5 a la parrilla de carbón, queso cheddar añejo fundido, cebolla caramelizada al oporto y mayonesa de trufa negra.',
      price: 365,
      currency: 'MXN',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      is3D: true,
      categoryId: 'cat-3d',
      isAvailable: burgerAvailable
    },
    {
      id: 'dish-nogada',
      name: 'Chile en Nogada Tradicional',
      description: 'Receta de autor poblana con picadillo agridulce, piñón rosa y granada fresca.',
      price: 430,
      currency: 'MXN',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      is3D: true,
      categoryId: 'cat-3d',
      isAvailable: true
    },
    {
      id: 'dish-ribeye',
      name: 'Ribeye Prime Cut 400g',
      description: 'Corte grueso de alta jugosidad sellado al fuego directo de carbón de encino.',
      price: ribeyeDiscounted ? 590 : 690,
      currency: 'MXN',
      imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      is3D: true,
      categoryId: 'cortes',
      isAvailable: true
    },
    {
      id: 'dish-negroni',
      name: 'Smoked Negroni Clásico',
      description: 'Gin infusionado con botánicos alpinos, vermouth rojo artesanal y Campari.',
      price: 240,
      currency: 'MXN',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      is3D: false,
      categoryId: 'bebidas',
      isAvailable: true
    }
  ], [burgerAvailable, ribeyeDiscounted]);

  const mobileDemoRestaurant = useMemo(() => ({
    name: 'RESTAURANTE GOURMET LA TERRAZA 3D',
    tableNumber: '4',
    zone: 'Terraza Principal',
    theme: {
      primaryColor: currentPalette.primaryHex,
      secondaryColor: currentPalette.isLight ? '#FAF8F5' : '#0F172A',
      accentColor: currentPalette.primaryHex,
      surfaceColor: currentPalette.isLight ? '#FFFFFF' : '#020617',
      fontFamily: currentPalette.fontHeading === 'font-playfair' ? 'playfair' : 'jakarta',
      texture: 'none',
      cardRadius: 'rounded'
    },
    settings: {
      defaultViewMode: 'compact',
      tableAssistance: { enabled: true, showFloatingButton: true }
    }
  }), [currentPalette]);

  // Modal de Pago / Suscripción y Prueba VIP
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanKey, setSelectedPlanKey] = useState('chain_vip');
  const [modalMode, setModalMode] = useState('trial'); // 'trial' (7 días gratis sin tarjeta) | 'direct_pay' (pago directo con tarjeta)
  const [checkoutForm, setCheckoutForm] = useState({
    restaurantName: '',
    contactName: '',
    email: '',
    phone: '',
    password: ''
  });

  const openTrialModal = (planKey = 'chain_vip') => {
    setSelectedPlanKey(planKey);
    setModalMode('trial');
    setCheckoutError('');
    setCheckoutModalOpen(true);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Cerrar modal de checkout con tecla Escape y bloquear scroll de fondo (WCAG 2.2 modal-accessibility)
  useEffect(() => {
    if (!checkoutModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isProcessingPayment) {
        setCheckoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [checkoutModalOpen, isProcessingPayment]);

  const openCheckout = (planKey) => {
    setSelectedPlanKey(planKey);
    setModalMode('direct_pay');
    setCheckoutError('');
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!checkoutForm.password || checkoutForm.password.length < 6) {
      setCheckoutError('Por favor crea una contraseña de al menos 6 caracteres para tu panel.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api/v1`;
      const res = await fetch(`${apiUrl}/billing/public-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planKey: selectedPlanKey,
          billingPeriod,
          restaurantName: checkoutForm.restaurantName,
          contactName: checkoutForm.contactName,
          email: checkoutForm.email,
          phone: checkoutForm.phone,
          password: checkoutForm.password,
          isTrial: modalMode === 'trial',
          origin: typeof window !== 'undefined' ? window.location.origin : 'https://volum.menu'
        })
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (data.token) {
          localStorage.setItem('volum_admin_token', data.token);
        }
        window.location.href = data.url;
      } else {
        setCheckoutError(data.message || 'No se pudo generar la sesión de pago. Por favor intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en checkout:', err);
      setCheckoutError('Error al conectar con la pasarela de pago. Verifica tu conexión.');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  // Estado para la calculadora interactiva de ROI
  const [tablesCount, setTablesCount] = useState(16);
  const [averageTicket, setAverageTicket] = useState(380);
  const [dailyTurns, setDailyTurns] = useState(3);
  const [selectedComparisonDish, setSelectedComparisonDish] = useState('avocado');
  const [comparisonViewMode, setComparisonViewMode] = useState('3d'); // '3d' | '2d'
  const [linkCopied, setLinkCopied] = useState(false);
  const comparisonViewerRef = useRef(null);

  const handleZoomIn = () => {
    if (comparisonViewerRef.current && typeof comparisonViewerRef.current.zoom === 'function') {
      comparisonViewerRef.current.zoom(1);
    }
  };

  const handleZoomOut = () => {
    if (comparisonViewerRef.current && typeof comparisonViewerRef.current.zoom === 'function') {
      comparisonViewerRef.current.zoom(-1);
    }
  };

  const handleResetZoom = () => {
    if (comparisonViewerRef.current) {
      try {
        comparisonViewerRef.current.cameraOrbit = '0deg 75deg 105%';
        comparisonViewerRef.current.fieldOfView = 'auto';
        if (typeof comparisonViewerRef.current.resetTurntableRotation === 'function') {
          comparisonViewerRef.current.resetTurntableRotation();
        }
      } catch (e) {
        // Ignorar
      }
    }
  };


  // Acordeón de Preguntas Frecuentes
  const [openFaq, setOpenFaq] = useState(null);

  // Formulario de contacto
  const [contactName, setContactName] = useState('');
  const [contactRestaurant, setContactRestaurant] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Cálculos de la calculadora de ROI
  const monthlyCustomers = tablesCount * dailyTurns * 30;
  const currentMonthlyRevenue = monthlyCustomers * averageTicket;
  const extraRevenueWith3D = Math.round(currentMonthlyRevenue * 0.22); // +22% aumento de ticket
  const newMonthlyRevenue = currentMonthlyRevenue + extraRevenueWith3D;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contacto Volum-Menu: ${contactRestaurant || 'Nuevo Restaurante'}`);
    const body = encodeURIComponent(`Hola Volum-Menu,\n\nMi nombre es: ${contactName}\nRestaurante: ${contactRestaurant}\n\nMensaje:\n${contactMsg}\n\nContacto enviado desde la web.`);
    window.location.href = `mailto:volum.menu.oficial@gmail.com?subject=${subject}&body=${body}`;
    setContactSent(true);
  };

  const faqs = [
    {
      q: '¿Mis clientes necesitan descargar alguna aplicación para ver la comida en 3D?',
      a: 'No, absolutamente nada. Tus comensales solo apuntan la cámara de su teléfono al código QR de la mesa y el menú abre al instante en Safari (iPhone) o Chrome (Android) en menos de medio segundo.'
    },
    {
      q: '¿Cómo funciona la proyección a tamaño real sobre la mesa?',
      a: 'Nuestra tecnología bloquea la escala métrica real de cada platillo. Esto significa que si tu corte o hamburguesa mide 14 cm de diámetro en la cocina, se proyectará con exactamente 14 cm sobre el mantel de la mesa. El cliente no puede deformar el tamaño con los dedos; si quiere ver los detalles, acerca físicamente su teléfono como si tuviera el plato servido.'
    },
    {
      q: '¿Cómo funciona la gestión de Múltiples Sucursales en el Plan Cadenas & Franquicias?',
      a: 'Con el Plan Cadenas & Franquicias y un Catálogo Maestro centralizado puedes administrar todas las ubicaciones de tu grupo o franquicia. Creas los platillos una sola vez y decides con una casilla en qué sucursales activarlos, permitiendo precios independientes por zona y códigos PIN independientes para cada establecimiento.'
    },
    {
      q: '¿Cómo digitalizan mis platillos en 3D?',
      a: 'Es muy sencillo: puedes escanearlos tú mismo con tu propio celular siguiendo un video tutorial de 2 minutos, o si prefieres, nuestro equipo especializado acude a tu restaurante para fotografiar y digitalizar tus platillos estrella con acabado fotorrealista.'
    },
    {
      q: '¿Qué pasa si un cliente tiene un celular sin Realidad Aumentada?',
      a: 'El sistema lo detecta automáticamente. En teléfonos que no cuenten con soporte de Realidad Aumentada, la pantalla abre un visor interactivo en 360° donde el comensal puede girar e inspeccionar el platillo con sus dedos en pantalla completa.'
    },
    {
      q: '¿Qué es la Bóveda de Platillos de Temporada y cómo funciona?',
      a: 'Es una biblioteca permanente incluida a partir del plan Experiencia 3D y VIP. Si ofreces platillos estacionales (como un Chile en Nogada en septiembre o un postre navideño en diciembre), al terminar su época los resguardas en tu bóveda liberando cupos para nuevos platillos. Cuando vuelva su época, los reactivas con un solo clic sin perder los modelos ni pagar de nuevo por digitalizarlos.'
    },
    {
      q: '¿Qué pasa si quiero digitalizar platillos adicionales a los de mi plan?',
      a: 'Puedes agregar platillos 3D extra a tu cuenta en cualquier momento por solo $99 MXN al mes por cada platillo adicional, manteniendo platillos regulares en 2D de forma totalmente ilimitada.'
    }
  ];

  return (
    <div
      className={`min-h-screen ${currentPalette.themeClass} ${currentPalette.fontBody} ${currentPalette.textPrimary} ${currentPalette.sectionBg} selection:bg-amber-500 selection:text-slate-950 overflow-x-clip w-full relative transition-colors duration-300`}
      style={{
        '--theme-accent': currentPalette.primaryHex,
        '--theme-dot': currentPalette.dot
      }}
    >
      
      {/* 1. NAVBAR SUPERIOR RESPONSIVO */}
      <header className={`sticky top-0 z-50 ${currentPalette.navBg} backdrop-blur-xl transition-colors duration-300 w-full`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          
          {/* Logo Volum & Volum-Menu: Al presionar el logo de la V lleva a Volum-Main */}
          <Link
            to="/volum-main"
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
            title="Ir a Volum-Main (Quiénes Somos, Servicios, Misión y Contacto)"
            id="nav-logo-volum-main"
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all aspect-square relative"
              style={{
                backgroundColor: currentPalette.primaryHex,
                boxShadow: `0 8px 20px -4px ${currentPalette.primaryHex}45`
              }}
            >
              V
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-amber-400 text-[10px] font-black py-0.5 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-amber-500/40 pointer-events-none z-50">
                Volum-Main ↗
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`font-extrabold text-lg sm:text-xl tracking-tight leading-tight ${currentPalette.logoText}`}>
                Volum<span className={currentPalette.textAccent}>-Menu</span>
              </span>
              <span className={`hidden sm:block text-xs tracking-widest uppercase font-semibold ${currentPalette.textMuted} leading-tight`}>
                Menús 3D & Realidad Aumentada
              </span>
            </div>
          </Link>

          {/* Enlaces de navegación central (Estilo exacto de la primera foto del compañero) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-medium">
            <a href="#demo" className={`${currentPalette.navLink} transition-colors`}>Simulador en Vivo</a>
            <a href="#visor-3d" className={`${currentPalette.navLink} transition-colors`}>Visor 3D WebAR</a>
            <a href="#metricas" className={`${currentPalette.navLink} transition-colors`}>Métricas</a>
            <a href="#calculadora" className={`${currentPalette.navLink} transition-colors`}>Calculadora ROI</a>
            <a href="#precios" className={`${currentPalette.navLink} transition-colors`}>Planes</a>
            <a href="#faq" className={`${currentPalette.navLink} transition-colors`}>FAQ</a>
          </nav>

          {/* Acciones & Selector de Paleta de Marca */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative" id="palette-picker-container">
            
            {/* Botón Entrar / Iniciar Sesión */}
            <Link
              to="/app"
              className={`py-2 px-3 sm:px-3.5 rounded-full ${currentPalette.loginBtn} text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 whitespace-nowrap shadow-sm`}
              title="Iniciar Sesión en el Panel de Administración"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" style={{ color: currentPalette.primaryHex }} />
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Entrar</span>
            </Link>

            {/* Botón selector de Paleta de Marca (En móvil muestra solo el ícono para no saturar; en desktop muestra nombre) */}
            <button
              type="button"
              onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
              className={`py-2 px-2.5 sm:px-3.5 rounded-full ${currentPalette.paletteBtn} text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap`}
              aria-label="Seleccionar Paleta de Marca"
            >
              <Palette className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="hidden sm:inline">{currentPalette.name}</span>
            </button>

            {/* Dropdown flotante de Paleta de Marca (Identico al diseño de referencia) */}
            {paletteDropdownOpen && (
              <div className={`absolute right-0 top-full mt-2 w-72 sm:w-80 ${currentPalette.cardBg} rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn text-left`}>
                <div className={`flex items-center justify-between pb-3 border-b ${currentPalette.sectionBorder} mb-3`}>
                  <span className={`text-xs font-black tracking-wider uppercase ${currentPalette.textMuted}`}>
                    PALETA DE MARCA
                  </span>
                  <button
                    type="button"
                    onClick={() => setPaletteDropdownOpen(false)}
                    className={`p-1 rounded-lg ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}
                    aria-label="Cerrar selector de paleta"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {Object.values(BRAND_PALETTES).map((pal) => {
                    const isSelected = selectedPaletteKey === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          setSelectedPaletteKey(pal.id);
                          setPaletteDropdownOpen(false);
                        }}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all text-left ${
                          isSelected
                            ? 'text-white shadow-lg'
                            : currentPalette.isLight ? 'bg-[#F1EFEA] hover:bg-[#EAE6DF] text-[#191919] border border-[#191919]/10' : currentPalette.isLight ? 'bg-[#F1EFEA] hover:bg-[#EAE6DF] text-[#191919] border border-[#191919]/10' : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-800/50'
                        }`}
                        style={isSelected ? { backgroundColor: pal.primaryHex, boxShadow: `0 10px 25px -5px ${pal.primaryHex}40` } : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-5 h-5 rounded-full shrink-0 border border-white/20 shadow-inner"
                            style={{ backgroundColor: pal.dot }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold leading-tight truncate">
                              {pal.name}
                            </span>
                            <span className={`text-[10px] leading-tight truncate mt-0.5 ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                              {pal.tagline}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-white shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enlace Iniciar Sesión */}
            <Link
              to="/login"
              className={`hidden md:inline-flex py-2 px-3 text-xs font-bold ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}
            >
              Iniciar Sesión
            </Link>

            {/* Botón Ver Menú Demo */}
            <Link
              to="/r/la-terraza?mode=showcase"
              target="_blank"
              className="hidden sm:inline-flex py-2 px-3.5 sm:px-4 rounded-full text-white text-xs font-bold transition-all items-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: currentPalette.primaryHex,
                boxShadow: `0 8px 20px -4px ${currentPalette.primaryHex}45`
              }}
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span>Ver Menú Demo</span>
            </Link>

            {/* Botón Prueba 7 Días Gratis */}
            <button
              type="button"
              onClick={() => openTrialModal('chain_vip')}
              className="hidden sm:inline-flex py-2 px-4 rounded-full text-slate-950 text-xs font-black transition-all items-center gap-1.5 shadow-md active:scale-95 bg-amber-400 hover:bg-amber-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Prueba 7 Días Gratis</span>
            </button>

            {/* Botón Hamburguesa para Móvil (Idéntico a Imagen 1) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} ${currentPalette.textPrimary} hover:opacity-80 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95`}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* MENÚ MÓVIL DESPLEGABLE / DRAWER OVERLAY (Idéntico a Imagen 2) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-md flex flex-col justify-start animate-fadeIn">
          <div className={`w-full ${currentPalette.cardBg} border-b ${currentPalette.sectionBorder} shadow-2xl p-5 space-y-6 max-h-screen overflow-y-auto`}>
            
            {/* Cabecera del Drawer (Logo + Paleta + Cerrar X) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/20">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md"
                  style={{ backgroundColor: currentPalette.primaryHex }}
                >
                  V
                </div>
                <div>
                  <span className={`font-black text-base tracking-tight block ${currentPalette.logoText}`}>
                    VOLUM.
                  </span>
                  <span className={`text-[10px] tracking-wider uppercase font-bold block ${currentPalette.textMuted}`}>
                    WEBAR 1:1 GASTRONÓMICO
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaletteDropdownOpen(!paletteDropdownOpen);
                  }}
                  className={`p-2 rounded-xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} ${currentPalette.textPrimary}`}
                  aria-label="Cambiar Paleta de Marca"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2 rounded-xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} ${currentPalette.textPrimary}`}
                  aria-label="Cerrar menú"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Enlaces del Drawer (Idénticos a Imagen 2) */}
            <nav className="flex flex-col space-y-4 text-sm font-bold">
              <a
                href="#demo-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-1 ${currentPalette.textPrimary} hover:${currentPalette.textAccent} transition-colors`}
              >
                Simulador en Vivo
              </a>
              <a
                href="#visor-3d"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-1 ${currentPalette.textPrimary} hover:${currentPalette.textAccent} transition-colors`}
              >
                Demostración 3D
              </a>
              <a
                href="#metricas"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-1 ${currentPalette.textPrimary} hover:${currentPalette.textAccent} transition-colors`}
              >
                Métricas de Negocio
              </a>
              <a
                href="#calculadora"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-1 ${currentPalette.textPrimary} hover:${currentPalette.textAccent} transition-colors`}
              >
                Calculadora ROI
              </a>
              <a
                href="#precios"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-1 ${currentPalette.textPrimary} hover:${currentPalette.textAccent} transition-colors`}
              >
                Planes
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-1 ${currentPalette.textPrimary} hover:${currentPalette.textAccent} transition-colors`}
              >
                Preguntas Frecuentes
              </a>
            </nav>

            <div className={`pt-4 border-t ${currentPalette.sectionBorder}`}>
              <Link
                to="/r/la-terraza?mode=showcase"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full py-3.5 px-5 rounded-2xl ${currentPalette.buttonPrimary} font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-center`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Ver Menú Demo en Vivo</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 2. HERO DE ALTO IMPACTO CON ESTILO GASTRONÓMICO DE AUTOR */}
      <section className="relative pt-20 pb-24 px-5 sm:px-8 overflow-hidden transition-colors duration-300">
        {/* Imagen de fondo culinaria con viñeta y gradiente dinámico */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${currentPalette.heroImage}')` }}
        />
        <div className={`absolute inset-0 z-0 bg-gradient-to-b ${currentPalette.heroOverlay} pointer-events-none transition-all duration-500`} />

        {/* Resplandor cálido de fondo */}
        <div
          className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
          style={{ backgroundColor: currentPalette.primaryHex }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge Eslogan & Prueba Gratis */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider shadow-sm transition-colors`}>
              <Box className="w-4 h-4 shrink-0" style={{ color: currentPalette.primaryHex }} />
              <span>REALIDAD AUMENTADA 1:1 EN MESAS</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ 7 DÍAS DE PRUEBA VIP GRATIS • SIN TARJETA</span>
            </div>
          </div>

          {/* Titular Principal */}
          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight leading-[1.12] transition-colors`}>
            Tus platillos insignia en la mesa{' '}
            <span
              className={
                currentPalette.isLight
                  ? 'text-[#2D4030] italic font-serif'
                  : currentPalette.id === 'obsidian'
                  ? 'text-[#E8A87C]'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400'
              }
            >
              del cliente antes de ordenar.
            </span>
          </h1>

          <p className={`mt-7 text-base sm:text-xl ${currentPalette.textMuted} max-w-3xl mx-auto leading-relaxed transition-colors`}>
            Menú interactivo en WebAR para restaurantes de alta gama. Proyecta tus platillos insignia a escala real 1:1 en Safari y Chrome. Sin descargas. Aumenta el ticket promedio y el consumo de platillos de alto margen.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openTrialModal('chain_vip')}
              className="w-full sm:w-auto py-4 px-9 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-2xl transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Comenzar Prueba VIP Gratis (7 Días)</span>
            </button>

            <a
              href="#demo"
              className={`w-full sm:w-auto py-4 px-8 rounded-full ${currentPalette.buttonSecondary} font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm`}
            >
              <Box className="w-4 h-4" />
              <span>Ver Menú Demo en Vivo</span>
            </a>

            <a
              href="#calculadora"
              className={`w-full sm:w-auto py-4 px-6 rounded-full ${currentPalette.buttonSecondary} font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm`}
            >
              <Calculator className="w-4 h-4 shrink-0" style={{ color: currentPalette.primaryHex }} />
              <span>Calcular ROI</span>
            </a>
          </div>

          {/* Sellos de valor clave */}
          <div className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-10 border-t ${currentPalette.sectionBorder}`}>
            <div className={`p-4 rounded-2xl ${currentPalette.cardBg} transition-colors`}>
              <span className={`text-2xl sm:text-3xl font-black ${currentPalette.textPrimary}`}>&lt; 350 ms</span>
              <p className={`text-xs ${currentPalette.textMuted} font-medium mt-1`}>Apertura ultra rápida</p>
            </div>
            <div className={`p-4 rounded-2xl ${currentPalette.cardBg} transition-colors`}>
              <span className="text-2xl sm:text-3xl font-black" style={{ color: currentPalette.primaryHex }}>100% Real</span>
              <p className={`text-xs ${currentPalette.textMuted} font-medium mt-1`}>Escala métrica 1:1</p>
            </div>
            <div className={`p-4 rounded-2xl ${currentPalette.cardBg} transition-colors`}>
              <span className={`text-2xl sm:text-3xl font-black ${currentPalette.textPrimary}`}>0 Apps</span>
              <p className={`text-xs ${currentPalette.textMuted} font-medium mt-1`}>Safari y Chrome nativo</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. DEMO INTERACTIVA: MULTIRROL 3 EN 1 EN PC Y VISTA LIGERA OPTIMIZADA EN MÓVIL */}
      
      {/* VERSIÓN ESCRITORIO (PC / LAPTOP): Simulador Interactivo 3 en 1 Completo */}
      <div id="demo" className="hidden md:block">
        <InteractiveShowcase activeBrandPalette={currentPalette} />
      </div>

      {/* VERSIÓN MÓVIL (CELULARES): CONSOLA INTERACTIVA Y CARTA EN VIVO (Idéntico a Imágenes 3 y 4) */}
      <section id="demo-mobile" className={`block md:hidden py-12 px-4 sm:px-6 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Selector de Pestañas: Consola vs Ver Celular (Idéntico a Imagen 3 y 4) */}
          <div className="flex items-center justify-center">
            <div className={`p-1.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} grid grid-cols-2 gap-1 w-full max-w-xs text-xs font-bold shadow-inner`}>
              <button
                type="button"
                onClick={() => setMobileDemoTab('console')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileDemoTab === 'console'
                    ? `${currentPalette.buttonPrimary} shadow-md`
                    : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Consola</span>
              </button>
              
              <button
                type="button"
                onClick={() => setMobileDemoTab('phone')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileDemoTab === 'phone'
                    ? `${currentPalette.buttonPrimary} shadow-md`
                    : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Ver Celular</span>
              </button>
            </div>
          </div>

          {/* VISTA 1: CONSOLA DE CONTROL EN VIVO (Idéntico a Imagen 3) */}
          {mobileDemoTab === 'console' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Tarjeta Principal de la Consola */}
              <div className={`p-5 rounded-3xl ${currentPalette.cardBg} border ${currentPalette.sectionBorder} shadow-2xl space-y-4`}>
                
                {/* Cabecera */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex, border: `1px solid ${currentPalette.primaryHex}35` }}
                  >
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-sm sm:text-base font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight leading-tight`}>
                      CONSOLA DE CONTROL EN VIVO
                    </h3>
                    <p className={`text-[11px] ${currentPalette.textMuted} leading-tight mt-0.5`}>
                      Simula cambios como administrador del restaurante
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SSE &lt; 35MS</span>
                    </div>
                  </div>
                </div>

                <div className={`border-t ${currentPalette.sectionBorder} pt-3 space-y-3`}>
                  
                  {/* Control 1: Disponibilidad Burger Wagyu */}
                  <div className={`p-3.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} space-y-2`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${currentPalette.textPrimary}`}>
                        Disponibilidad: Burger Wagyu
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        burgerAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {burgerAvailable ? 'En Existencia' : 'Agotado'}
                      </span>
                    </div>
                    <p className={`text-[11px] ${currentPalette.textMuted}`}>
                      Evita que comensales pidan platillos sin inventario en cocina.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBurgerAvailable(!burgerAvailable);
                        setUserInteracted(true);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                        burgerAvailable
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 active:scale-95'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 active:scale-95'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{burgerAvailable ? 'Marcar Agotado' : 'Marcar En Existencia'}</span>
                    </button>
                  </div>

                  {/* Control 2: Precio Dinámico Ribeye */}
                  <div className={`p-3.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} space-y-2`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${currentPalette.textPrimary}`}>
                        Precio Dinámico: Ribeye Prime 400g
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ribeyeDiscounted ? '$590 MXN' : '$690 MXN'}
                      </span>
                    </div>
                    <p className={`text-[11px] ${currentPalette.textMuted}`}>
                      Modifica precios instantáneamente sin reimprimir cartas.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRibeyeDiscounted(!ribeyeDiscounted);
                        setUserInteracted(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                    >
                      <span className="font-mono font-bold">$</span>
                      <span>{ribeyeDiscounted ? 'Restaurar Precio ($690)' : 'Descuento $590'}</span>
                    </button>
                  </div>

                  {/* Control 3: Llamada de Mesa a Meseros */}
                  <div className={`p-3.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} space-y-2`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold ${currentPalette.textPrimary}`}>
                        Llamada de Mesa a Meseros
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Mesa 4
                      </span>
                    </div>
                    <p className={`text-[11px] ${currentPalette.textMuted}`}>
                      Prueba la alerta acústica y visual para los meseros en sala.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setTableCallActive(true);
                        setUserInteracted(true);
                        playMobileChime();
                        setTimeout(() => setTableCallActive(false), 4000);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                        tableCallActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                          : `${currentPalette.buttonSecondary}`
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
                      <span>{tableCallActive ? '¡Mesa 4 Llamando a Sala!' : 'Probar Llamada'}</span>
                    </button>
                  </div>

                </div>

                {/* Pie de la Consola: Estado + Botón de Ver Celular */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className={currentPalette.textMuted}>
                        {userInteracted ? 'Cambios sincronizados' : 'Esperando interacción del usuario...'}
                      </span>
                    </div>
                    {userInteracted && (
                      <button
                        type="button"
                        onClick={() => {
                          setBurgerAvailable(true);
                          setRibeyeDiscounted(false);
                          setTableCallActive(false);
                          setUserInteracted(false);
                        }}
                        className={`text-[11px] font-bold ${currentPalette.textAccent} hover:underline cursor-pointer`}
                      >
                        Reiniciar demo
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileDemoTab('phone')}
                    className={`w-full py-3.5 px-5 rounded-2xl ${currentPalette.buttonPrimary} font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Ver cambios en el teléfono simulado →</span>
                  </button>
                </div>

              </div>

              {/* Tarjeta de Acceso a Menú Completo */}
              <div className={`p-4 rounded-3xl ${currentPalette.cardBg} border ${currentPalette.sectionBorder} text-center space-y-2 shadow-lg`}>
                <h4 className={`text-xs font-bold ${currentPalette.textPrimary}`}>
                  ¿Quieres ver el Menú de La Terraza completo?
                </h4>
                <p className={`text-[11px] ${currentPalette.textMuted} max-w-xs mx-auto leading-relaxed`}>
                  Abre la experiencia real en pantalla completa o escanea con tu móvil.
                </p>
                <div className="pt-1">
                  <Link
                    to="/r/la-terraza?mesa=4&zona=Terraza"
                    target="_blank"
                    className={`inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl ${currentPalette.buttonSecondary} font-bold text-xs transition-all shadow-sm active:scale-95`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir La Terraza</span>
                  </Link>
                </div>
              </div>

            </div>
          )}

          {/* VISTA 2: VER CELULAR (Idéntico a Imagen 4) */}
          {mobileDemoTab === 'phone' && (
            <div className="space-y-3 animate-fadeIn flex flex-col items-center">
              
              {/* Botón de Regreso a la Consola */}
              <button
                type="button"
                onClick={() => setMobileDemoTab('console')}
                className={`w-full max-w-[380px] py-2.5 px-4 rounded-xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} ${currentPalette.textPrimary} font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm`}
              >
                <Sliders className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
                <span>← Regresar a la Consola de Control</span>
              </button>

              {/* Toast si se pulsó Probar Llamada */}
              {tableCallActive && (
                <div className="w-full max-w-[380px] p-3 rounded-2xl bg-amber-500/20 border border-amber-500/60 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-scaleUp">
                  <Bell className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                  <span className="flex-1 leading-tight">¡Campana activada! Mesero en camino a Mesa 4.</span>
                </div>
              )}

              {/* Teléfono PhoneSimulator con los datos sincronizados */}
              <div className={`w-full max-w-[380px] p-2.5 sm:p-4 rounded-[40px] ${currentPalette.cardBg} border ${currentPalette.sectionBorder} shadow-2xl backdrop-blur-sm`}>
                <PhoneSimulator
                  restaurant={mobileDemoRestaurant}
                  dishes={mobileDemoDishes}
                  categories={mobileDemoCategories}
                  onCallWaiter={() => {
                    playMobileChime();
                    setTableCallActive(true);
                    setTimeout(() => setTableCallActive(false), 3000);
                  }}
                />
              </div>

              <p className={`text-[11px] ${currentPalette.textMuted} text-center max-w-xs mt-1`}>
                Los cambios que realizas en la <strong>Consola</strong> se reflejan en tiempo real aquí.
              </p>

            </div>
          )}

        </div>
      </section>

      {/* 3. COMPARATIVA "FOTO TRADICIONAL VS MODELO VOLUMÉTRICO 1:1" (Texto Exacto del Compañero en Vercel) */}
      <section id="visor-3d" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider`}>
              <Box className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>LA DIFERENCIA DEL MENÚ 3D EN SALA</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
              Compáralo tú mismo: Foto tradicional vs. Modelo Volumétrico 1:1
            </h2>
            <p className={`text-sm ${currentPalette.textMuted} mt-2 max-w-2xl mx-auto`}>
              Los comensales ya no confían en fotos planas que no muestran la porción real. El 3D elimina la duda y acelera la decisión de compra.
            </p>
          </div>

          {/* 3 Tarjetas de Platillos Seleccionables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(COMPARISON_DISHES).map((dish) => {
              const isSelected = selectedComparisonDish === dish.id;
              return (
                <div
                  key={dish.id}
                  onClick={() => setSelectedComparisonDish(dish.id)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? `border-2 shadow-2xl scale-[1.02] ${currentPalette.cardBg}`
                      : `${currentPalette.cardBg} opacity-80 hover:opacity-100`
                  }`}
                  style={isSelected ? { borderColor: currentPalette.primaryHex, boxShadow: `0 10px 25px -5px ${currentPalette.primaryHex}35` } : undefined}
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-black shadow-sm"
                      style={{ backgroundColor: currentPalette.primaryHex, color: '#FFFFFF' }}
                    >
                      {dish.price}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90 drop-shadow">
                        {dish.scale}
                      </span>
                      <h4 className="font-black text-base drop-shadow">{dish.name}</h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className={`text-xs ${currentPalette.textMuted} line-clamp-2`}>
                      {dish.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/20 text-xs font-bold">
                      <span style={{ color: currentPalette.primaryHex }}>Ver modelo 3D</span>
                      <span className={`text-[11px] ${isSelected ? 'font-black' : currentPalette.textMuted}`} style={isSelected ? { color: currentPalette.primaryHex } : undefined}>
                        {isSelected ? '✓ Seleccionado' : 'Probar'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visor interactivo en vivo del platillo seleccionado con Código QR para Móvil */}
          {(() => {
            const activeDish = COMPARISON_DISHES[selectedComparisonDish] || COMPARISON_DISHES.avocado;
            const arLaunchUrl = `/demo/ar?dish=${activeDish.id}`;
            const qrTargetUrl = typeof window !== 'undefined'
              ? `${window.location.origin}${arLaunchUrl}`
              : `https://volum.menu${arLaunchUrl}`;
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrTargetUrl)}&color=000000&bgcolor=ffffff&qzone=1`;

            return (
              <div className={`p-6 sm:p-9 rounded-[32px] ${currentPalette.cardBg} border ${currentPalette.sectionBorder} grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-2xl transition-colors duration-300`}>
                
                {/* LADO IZQUIERDO: Ficha técnica detallada + Código QR para Móvil */}
                <div className="lg:col-span-5 space-y-6 text-left flex flex-col justify-between h-full">
                  
                  {/* Encabezado: Categoría y Precio */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest font-mono" style={{ color: currentPalette.primaryHex }}>
                        {activeDish.category || 'ESPECIALIDADES'}
                      </span>
                      <span className={`text-xl sm:text-2xl font-black ${currentPalette.fontHeading} ${currentPalette.textPrimary}`}>
                        {activeDish.price}
                      </span>
                    </div>

                    <h3 className={`text-2xl sm:text-3xl font-black ${currentPalette.fontHeading} ${currentPalette.textPrimary} tracking-tight uppercase`}>
                      {activeDish.name}
                    </h3>

                    <p className={`text-xs sm:text-sm ${currentPalette.textMuted} leading-relaxed`}>
                      {activeDish.description}
                    </p>
                  </div>

                  {/* 3 Bullets con CheckCircle */}
                  <div className={`space-y-3 py-4 border-y ${currentPalette.sectionBorder}`}>
                    {activeDish.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                        <span className="leading-snug">
                          <strong className={`${currentPalette.textPrimary} font-bold mr-1.5`}>{feat.label}:</strong>
                          <span className={currentPalette.textMuted}>{feat.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tarjeta de Código QR para Celular (Idéntica a la captura del compañero) */}
                  <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} flex flex-col sm:flex-row items-center gap-4 shadow-lg`}>
                    
                    {/* Código QR en contenedor blanco de alto contraste */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-2xl p-2 shrink-0 shadow-md flex items-center justify-center border-2 border-white">
                      <img
                        src={qrImageUrl}
                        alt={`QR para escanear ${activeDish.name}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Información y botones de acción */}
                    <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                      
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider" style={{ borderColor: `${currentPalette.primaryHex}50`, color: currentPalette.primaryHex }}>
                        <Smartphone className="w-3 h-3" />
                        <span>ESCANEAR CON TU CELULAR</span>
                      </div>

                      <h4 className={`text-sm sm:text-base font-bold ${currentPalette.textPrimary} leading-tight`}>
                        Prueba el Menú 3D en tu Mesa
                      </h4>

                      <p className={`text-[11px] ${currentPalette.textMuted} leading-tight`}>
                        Apunta la cámara de tu teléfono para abrir la carta demo interactiva con Realidad Aumentada sin instalar apps.
                      </p>

                      <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        {/* Botón Copiar link */}
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(qrTargetUrl);
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 2500);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl ${currentPalette.buttonSecondary} text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm`}
                        >
                          {linkCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar link</span>
                            </>
                          )}
                        </button>

                        {/* Botón Abrir en nueva pestaña */}
                        <a
                          href={qrTargetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 text-white"
                          style={{ backgroundColor: currentPalette.primaryHex }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir en nueva pestaña</span>
                        </a>
                      </div>

                    </div>

                  </div>

                </div>

                {/* LADO DERECHO: Visor Interactivo 3D Volumétrico 1:1 vs Foto Tradicional 2D */}
                <div className={`lg:col-span-7 rounded-3xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} overflow-hidden flex flex-col shadow-2xl relative`}>
                  
                  {/* Barra Superior del Visor: Pestañas 3D / 2D y Label de Rotación */}
                  <div className={`px-4 py-3 border-b ${currentPalette.sectionBorder} flex items-center justify-between gap-3 bg-black/30 backdrop-blur-md`}>
                    
                    {/* Selector de Modos: 3D Volumétrico 1:1 vs Foto Tradicional 2D */}
                    <div className="inline-flex items-center p-1 rounded-xl bg-black/50 border border-slate-700/50 gap-1">
                      <button
                        type="button"
                        onClick={() => setComparisonViewMode('3d')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          comparisonViewMode === '3d'
                            ? 'text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        style={comparisonViewMode === '3d' ? { backgroundColor: currentPalette.primaryHex } : undefined}
                      >
                        3D Volumétrico 1:1
                      </button>
                      <button
                        type="button"
                        onClick={() => setComparisonViewMode('2d')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          comparisonViewMode === '2d'
                            ? 'text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        style={comparisonViewMode === '2d' ? { backgroundColor: currentPalette.primaryHex } : undefined}
                      >
                        Foto Tradicional 2D
                      </button>
                    </div>

                    {/* Indicador de Rotación */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <RotateCw className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
                      <span className="hidden sm:inline">Gira con tu mouse o dedo</span>
                      <span className="sm:hidden">Gira 360°</span>
                    </div>

                  </div>

                  {/* Cuerpo del Visor */}
                  <div className="h-[420px] sm:h-[480px] w-full relative bg-gradient-to-b from-black/80 via-black/50 to-black/90 flex items-center justify-center overflow-hidden">
                    
                    {comparisonViewMode === '3d' ? (
                      <>
                        {/* Chip Flotante Superior: Nombre del platillo */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-slate-700/60 text-xs font-bold shadow-lg" style={{ color: currentPalette.primaryHex }}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{activeDish.name} • Modelo 3D Gastronómico</span>
                        </div>

                        {/* Controles Flotantes Verticales de Zoom (Lado Derecho) */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={handleZoomIn}
                            title="Acercar modelo"
                            className="w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white border border-slate-700/80 flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleZoomOut}
                            title="Alejar modelo"
                            className="w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white border border-slate-700/80 flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleResetZoom}
                            title="Restablecer tamaño original 1:1"
                            className="w-9 h-9 rounded-full bg-black/80 hover:bg-black border border-slate-700/80 flex flex-col items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer text-[10px] font-black"
                            style={{ color: currentPalette.primaryHex }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="text-[9px] leading-none mt-0.5">1:1</span>
                          </button>
                        </div>

                        {/* Model-Viewer */}
                        <model-viewer
                          ref={comparisonViewerRef}
                          key={activeDish.id}
                          src={activeDish.modelUrl}
                          alt={activeDish.name}
                          ar
                          ar-modes="webxr scene-viewer quick-look"
                          ar-scale="fixed"
                          camera-controls
                          auto-rotate
                          shadow-intensity="1.5"
                          shadow-softness="0.5"
                          style={{ width: '100%', height: '100%' }}
                        ></model-viewer>

                        {/* Barra Flotante Inferior de Controles */}
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                          
                          <div className="flex items-center gap-2 pointer-events-auto">
                            <span className="py-1 px-3 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md border border-slate-800">
                              <RotateCw className="w-3 h-3 text-amber-400" />
                              <span>Pellizca para zoom o gira</span>
                            </span>

                            <button
                              type="button"
                              onClick={handleResetZoom}
                              className="py-1 px-3 rounded-full bg-black/80 hover:bg-black backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md border border-slate-800 cursor-pointer active:scale-95 transition-all"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-400" />
                              <span>Ver tamaño original</span>
                            </button>
                          </div>

                          {/* Botón Ver en tu mesa (WebAR) */}
                          <a
                            href={arLaunchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="pointer-events-auto py-1.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xl active:scale-95 cursor-pointer text-white transition-all"
                            style={{ backgroundColor: currentPalette.primaryHex }}
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>Ver en tu mesa (WebAR)</span>
                          </a>

                        </div>
                      </>
                    ) : (
                      /* Vista 2D: Foto Tradicional Plana */
                      <div className="w-full h-full relative group">
                        <img
                          src={activeDish.image}
                          alt={`Fotografía 2D de ${activeDish.name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 flex flex-col justify-between p-6">
                          
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-slate-300 text-xs font-bold border border-slate-700/80">
                              Foto Tradicional Plana 2D
                            </span>
                            <span className="text-white font-black text-sm px-3 py-1 rounded-full bg-black/80 border border-slate-700">
                              {activeDish.price}
                            </span>
                          </div>

                          <div className="space-y-3 bg-black/75 backdrop-blur-md p-4 rounded-2xl border border-slate-800 max-w-md">
                            <h4 className="text-white font-bold text-sm">
                              Limitación de la Fotografía Plana
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              La fotografía tradicional no transmite la escala real ni la profundidad. El comensal duda de la porción real hasta que el plato llega a su mesa.
                            </p>
                            <button
                              type="button"
                              onClick={() => setComparisonViewMode('3d')}
                              className="py-1.5 px-3.5 rounded-lg text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                              style={{ backgroundColor: currentPalette.primaryHex }}
                            >
                              <Box className="w-3.5 h-3.5" />
                              <span>Cambiar a Modelo Volumétrico 1:1</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* 4. MÉTRICAS REALES COMPROBADAS (Texto Exacto del Compañero en Vercel) */}
      <section id="metricas" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider`}>
              <TrendingUp className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>MÉTRICAS REALES COMPROBADAS</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
              Rentabilidad Medible para tu Restaurante
            </h2>
            <p className={`text-sm ${currentPalette.textMuted} mt-2 max-w-2xl mx-auto`}>
              Los datos de restaurantes que ya usan Volum-Menu demuestran el impacto directo en métricas operativas y comerciales clave.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Consumo Promedio */}
            <div className={`p-6 rounded-3xl ${currentPalette.cardBg} flex flex-col justify-between space-y-4 transition-colors`}>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex, border: `1px solid ${currentPalette.primaryHex}40` }}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-3xl sm:text-4xl font-black font-playfair" style={{ color: currentPalette.primaryHex }}>
                  +22%
                </div>
                <h3 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Consumo Promedio</h3>
              </div>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Los clientes piden con más certeza cuando ven el tamaño real 1:1 del platillo.
              </p>
            </div>

            {/* Card 2: Tiempo de Decisión */}
            <div className={`p-6 rounded-3xl ${currentPalette.cardBg} flex flex-col justify-between space-y-4 transition-colors`}>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex, border: `1px solid ${currentPalette.primaryHex}40` }}>
                  <Timer className="w-4 h-4" />
                </div>
                <div className={`text-3xl sm:text-4xl font-black font-playfair ${currentPalette.textPrimary}`}>
                  -4.2 min
                </div>
                <h3 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Tiempo de Decisión</h3>
              </div>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Menos dudas sobre porciones e ingredientes agilizan la rotación de mesas.
              </p>
            </div>

            {/* Card 3: Devolución por Expectativa */}
            <div className={`p-6 rounded-3xl ${currentPalette.cardBg} flex flex-col justify-between space-y-4 transition-colors`}>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex, border: `1px solid ${currentPalette.primaryHex}40` }}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-3xl sm:text-4xl font-black font-playfair" style={{ color: currentPalette.primaryHex }}>
                  0%
                </div>
                <h3 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Devolución por Expectativa</h3>
              </div>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Cero quejas de "pensé que era más grande". Lo que ven en AR es lo que reciben.
              </p>
            </div>

            {/* Card 4: Carga Inmediata */}
            <div className={`p-6 rounded-3xl ${currentPalette.cardBg} flex flex-col justify-between space-y-4 transition-colors`}>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex, border: `1px solid ${currentPalette.primaryHex}40` }}>
                  <Zap className="w-4 h-4" />
                </div>
                <div className={`text-3xl sm:text-4xl font-black font-playfair ${currentPalette.textPrimary}`}>
                  &lt; 350ms
                </div>
                <h3 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Carga Inmediata</h3>
              </div>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Optimizado para redes móviles lentas. Abre al instante sin descargar apps.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALCULADORA INTERACTIVA DE GANANCIAS (ROI) (Texto Exacto del Compañero en Vercel) */}
      <section id="calculadora" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider`}>
              <Calculator className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>CALCULADORA DE RETORNO</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
              Calcula el beneficio económico mensual para tu local
            </h2>
            <p className={`text-sm ${currentPalette.textMuted} mt-2 max-w-2xl mx-auto`}>
              Ajusta las variables de tu establecimiento y proyecta el incremento en facturación mensual con Volum-Menu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            
            {/* Control Deslizante (Sliders) */}
            <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl ${currentPalette.cardBg} space-y-6 transition-colors`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-xs font-bold ${currentPalette.textPrimary}`}>Mesas en Sala y Terraza</label>
                  <span className="text-sm font-black" style={{ color: currentPalette.primaryHex }}>{tablesCount} mesas</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="60"
                  value={tablesCount}
                  onChange={(e) => setTablesCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer"
                  style={{ accentColor: currentPalette.primaryHex }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-xs font-bold ${currentPalette.textPrimary}`}>Ticket Promedio Actual (MXN)</label>
                  <span className="text-sm font-black" style={{ color: currentPalette.primaryHex }}>${averageTicket} MXN</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="1800"
                  step="20"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer"
                  style={{ accentColor: currentPalette.primaryHex }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-xs font-bold ${currentPalette.textPrimary}`}>Turnos / Rotación Diaria de Mesas</label>
                  <span className="text-sm font-black" style={{ color: currentPalette.primaryHex }}>{dailyTurns} turnos/día</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={dailyTurns}
                  onChange={(e) => setDailyTurns(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer"
                  style={{ accentColor: currentPalette.primaryHex }}
                />
              </div>

              <div className={`pt-4 border-t ${currentPalette.sectionBorder} grid grid-cols-2 gap-4 text-center`}>
                <div className={`p-3 rounded-2xl ${currentPalette.cardSubtleBg}`}>
                  <span className={`text-[11px] ${currentPalette.textMuted} block`}>Clientes/mes aprox.</span>
                  <span className={`text-sm font-bold ${currentPalette.textPrimary}`}>{monthlyCustomers.toLocaleString()} comensales</span>
                </div>
                <div className={`p-3 rounded-2xl ${currentPalette.cardSubtleBg}`}>
                  <span className={`text-[11px] ${currentPalette.textMuted} block`}>Facturación base</span>
                  <span className={`text-sm font-bold ${currentPalette.textPrimary}`}>${(currentMonthlyRevenue).toLocaleString()} MXN</span>
                </div>
              </div>
            </div>

            {/* Resultado Proyectado */}
            <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl ${currentPalette.cardRecommended} text-center space-y-6 transition-colors`}>
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: currentPalette.primaryHex }}>
                Beneficio Extra Estimado al Mes
              </span>

              <div>
                <span className="text-4xl sm:text-5xl font-black tracking-tight block" style={{ color: currentPalette.primaryHex }}>
                  +${extraRevenueWith3D.toLocaleString()}
                </span>
                <span className={`text-xs ${currentPalette.textMuted} mt-1 block`}>MXN mensuales adicionales estimados</span>
              </div>

              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} text-left space-y-2 text-xs`}>
                <div className="flex justify-between">
                  <span className={currentPalette.textMuted}>Nueva facturación est.:</span>
                  <span className={`font-bold ${currentPalette.textPrimary}`}>${newMonthlyRevenue.toLocaleString()} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className={currentPalette.textMuted}>Aumento conservador:</span>
                  <span className="font-bold text-emerald-500">+22% por mesa</span>
                </div>
              </div>

              <a
                href="#precios"
                className={`w-full py-3.5 px-6 rounded-full ${currentPalette.buttonPrimary} font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95`}
              >
                <span>Elegir Plan y Comenzar</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CÓMO FUNCIONA EN 3 PASOS */}
      <section id="como-funciona" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider`}>
              <RotateCw className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>SIN COMPLICACIONES</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
              ¿Cómo Funciona Volum-Menu en tu Restaurante?
            </h2>
            <p className={`text-sm ${currentPalette.textMuted} mt-2 max-w-2xl mx-auto`}>
              Implementación inmediata en 3 sencillos pasos, sin modificar tu flujo de cocina ni comprar hardware costoso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-3xl ${currentPalette.cardBg} space-y-4 relative transition-colors`}>
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-sm" style={{ backgroundColor: currentPalette.primaryHex, color: '#ffffff' }}>
                1
              </span>
              <h3 className={`text-lg font-bold ${currentPalette.textPrimary}`}>Digitalizamos tus Platillos</h3>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Sube tu menú en PDF y selecciona tus platillos estrella para escanearlos en 3D fácilmente con la cámara de tu celular.
              </p>
            </div>

            <div className={`p-8 rounded-3xl ${currentPalette.cardBg} space-y-4 relative transition-colors`}>
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-sm" style={{ backgroundColor: currentPalette.primaryHex, color: '#ffffff' }}>
                2
              </span>
              <h3 className={`text-lg font-bold ${currentPalette.textPrimary}`}>Colocas el QR en Mesas</h3>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Te entregamos plantillas listas para imprimir o soportes acrílicos con tu código QR único. El comensal solo apunta su teléfono sin descargar apps.
              </p>
            </div>

            <div className={`p-8 rounded-3xl ${currentPalette.cardBg} space-y-4 relative transition-colors`}>
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-sm" style={{ backgroundColor: currentPalette.primaryHex, color: '#ffffff' }}>
                3
              </span>
              <h3 className={`text-lg font-bold ${currentPalette.textPrimary}`}>Ventas y Rotación Aceleradas</h3>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed`}>
                Tus clientes proyectan la comida sobre el mantel a escala 1:1, deciden en segundos y ordenan con confianza los platillos de mayor margen de ganancia.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. PRECIOS Y MATRIZ EXHAUSTIVA DE CARACTERÍSTICAS (Texto Exacto del Compañero en Vercel) */}
      <section id="precios" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider`}>
              <CreditCard className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>INVERSIÓN CLARA Y TRANSPARENTE</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
              Planes de Suscripción Diseñados para tu Escala
            </h2>
            <p className={`text-sm ${currentPalette.textMuted} mt-2 max-w-2xl mx-auto`}>
              Sin costos ocultos ni comisiones por platillo. Factura deducible con IVA desglosado.
            </p>

            {/* Selector de Período Mensual vs Pago Anual */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <div className={`p-1.5 rounded-full ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} flex items-center gap-1 text-xs font-bold`}>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`py-1.5 px-4 rounded-full transition-all ${
                    billingPeriod === 'monthly'
                      ? `${currentPalette.buttonPrimary} shadow-sm`
                      : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                  }`}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('annual')}
                  className={`py-1.5 px-4 rounded-full transition-all flex items-center gap-1.5 ${
                    billingPeriod === 'annual'
                      ? `${currentPalette.buttonPrimary} shadow-sm`
                      : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                  }`}
                >
                  <span>Pago Anual Único</span>
                  <span className="py-0.5 px-1.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white">
                    Ahorra 2 meses
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner VIP Trial Destacado */}
          <div className="max-w-4xl mx-auto p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/5 border border-amber-500/40 text-center shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" /> 7 Días de Prueba VIP Gratis Incluidos
            </div>
            <h4 className={`text-xl sm:text-2xl font-black ${currentPalette.textPrimary}`}>
              Comienza Hoy con el Plan VIP Fine Dining (15 Platillos 3D) sin Tarjeta
            </h4>
            <p className={`text-xs ${currentPalette.textMuted} mt-1.5 max-w-2xl mx-auto leading-relaxed`}>
              Prueba la experiencia WebAR 1:1, pedidos de mesa, multi-cartas por turno y banners con cuenta regresiva durante 7 días. <strong>No pedimos tarjeta de crédito para iniciar</strong>. Elige tu plan definitivo al finalizar tu prueba según tu restaurante.
            </p>
            <div className="pt-3.5">
              <button
                type="button"
                onClick={() => openTrialModal('chain_vip')}
                className="py-2.5 px-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Iniciar Mi Prueba Gratis de 7 Días</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Planes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* PLAN 1: ESENCIAL */}
            <div className={`rounded-3xl p-6 sm:p-8 ${currentPalette.cardBg} flex flex-col justify-between transition-colors`}>
              <div className="space-y-4">
                <span className={`text-xs font-bold ${currentPalette.textMuted} uppercase tracking-wider block`}>
                  Para cafeterías y locales ágiles
                </span>
                <h3 className={`text-2xl font-black ${currentPalette.textPrimary}`}>Plan Esencial</h3>
                
                <div>
                  <span className={`text-3xl sm:text-4xl font-black ${currentPalette.textPrimary}`}>
                    ${billingPeriod === 'annual' ? '4,490' : '449'}
                  </span>
                  <span className={`text-xs ${currentPalette.textMuted} ml-1`}>
                    {billingPeriod === 'annual' ? 'MXN + IVA/año ($374/mes)' : 'MXN + IVA/mes'}
                  </span>
                </div>

                <div className={`pt-4 border-t ${currentPalette.sectionBorder} space-y-2.5 text-xs`}>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-bold ${currentPalette.textPrimary}`}>Hasta 4 platillos en 3D / WebAR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Platillos 2D tradicionales ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-semibold ${currentPalette.textPrimary}`}>Multi-Cartas por Turno (Desayunos, Comidas, Cenas)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Buscador predictivo y vista TPV compacta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Código QR inteligente para mesas</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => openTrialModal('essential')}
                  className="w-full py-3 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  Probar 7 Días Gratis
                </button>
                <button
                  type="button"
                  onClick={() => openCheckout('essential')}
                  className={`w-full text-center text-[11px] ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors cursor-pointer`}
                >
                  O contratar directo (${billingPeriod === 'annual' ? '$4,490' : '$449'} MXN)
                </button>
              </div>
            </div>

            {/* PLAN 2: EXPERIENCIA 3D (RECOMENDADO) */}
            <div className={`rounded-3xl p-6 sm:p-8 ${currentPalette.cardRecommended} flex flex-col justify-between relative transition-colors scale-105 z-10`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider block text-amber-400">
                    Más Popular
                  </span>
                  <span className="py-0.5 px-2.5 rounded-full text-[10px] font-black uppercase text-slate-950 bg-amber-400 shadow-sm">
                    Recomendado
                  </span>
                </div>

                <h3 className={`text-2xl font-black ${currentPalette.textPrimary}`}>Experiencia 3D</h3>
                
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-amber-400">
                    ${billingPeriod === 'annual' ? '7,990' : '799'}
                  </span>
                  <span className={`text-xs ${currentPalette.textMuted} ml-1`}>
                    {billingPeriod === 'annual' ? 'MXN + IVA/año ($665/mes)' : 'MXN + IVA/mes'}
                  </span>
                </div>

                <div className={`pt-4 border-t ${currentPalette.sectionBorder} space-y-2.5 text-xs`}>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-bold ${currentPalette.textPrimary}`}>Hasta 8 platillos en 3D / WebAR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Platillos 2D ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-semibold ${currentPalette.textPrimary}`}>Banners de Marketing Dinámicos & Happy Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Modo Mesero con alertas acústicas en sala</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Llamadas a mesa y cuenta express</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Multi-Cartas por Turno (Desayunos, Comidas, Cenas)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => openTrialModal('experience_3d')}
                  className="w-full py-3.5 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-xl cursor-pointer"
                >
                  Probar 7 Días Gratis
                </button>
                <button
                  type="button"
                  onClick={() => openCheckout('experience_3d')}
                  className={`w-full text-center text-[11px] ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors cursor-pointer`}
                >
                  O contratar directo (${billingPeriod === 'annual' ? '$7,990' : '$799'} MXN)
                </button>
              </div>
            </div>

            {/* PLAN 3: VIP FINE DINING (RESTAURANTE INSIGNIA) */}
            <div className={`rounded-3xl p-6 sm:p-8 ${currentPalette.cardBg} flex flex-col justify-between transition-colors border-2 border-amber-500/40`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${currentPalette.textMuted} uppercase tracking-wider block`}>
                    Alta cocina & insignia
                  </span>
                  <span className="py-0.5 px-2 rounded-full text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 border border-amber-500/30">
                    Incluido en Trial
                  </span>
                </div>

                <h3 className={`text-2xl font-black ${currentPalette.textPrimary}`}>VIP Fine Dining</h3>
                
                <div>
                  <span className={`text-3xl sm:text-4xl font-black ${currentPalette.textPrimary}`}>
                    ${billingPeriod === 'annual' ? '12,990' : '1,299'}
                  </span>
                  <span className={`text-xs ${currentPalette.textMuted} ml-1`}>
                    {billingPeriod === 'annual' ? 'MXN + IVA/año ($1,080/mes)' : 'MXN + IVA/mes'}
                  </span>
                </div>

                <div className={`pt-4 border-t ${currentPalette.sectionBorder} space-y-2.5 text-xs`}>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-bold ${currentPalette.textPrimary}`}>Hasta 15 platillos en 3D / WebAR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Bóveda para hasta 30 platillos estacionales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-semibold ${currentPalette.textPrimary}`}>Banners con Cuenta Regresiva en Tiempo Real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Auto-pedidos en mesa desde WebAR 1:1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={currentPalette.textPrimary}>Comandero en vivo y división matemática de cuenta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className={`font-semibold ${currentPalette.textPrimary}`}>Centro de Ayuda con reporte prioritario a Gmail</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => openTrialModal('chain_vip')}
                  className="w-full py-3.5 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-xl cursor-pointer"
                >
                  Iniciar Prueba VIP Gratis (7 Días)
                </button>
                <button
                  type="button"
                  onClick={() => openCheckout('chain_vip')}
                  className={`w-full text-center text-[11px] ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors cursor-pointer`}
                >
                  O contratar directo (${billingPeriod === 'annual' ? '$12,990' : '$1,299'} MXN)
                </button>
              </div>
            </div>

          </div>

          {/* Banner 4to Plan: Cadenas & Franquicias */}
          <div className={`p-5 sm:p-6 rounded-3xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} flex flex-col md:flex-row items-center justify-between gap-5 max-w-4xl mx-auto shadow-sm transition-all`}>
            <div className="space-y-1.5 text-center md:text-left min-w-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-black uppercase tracking-wider block text-amber-400">
                  Red de Franquicias & Multi-Sucursal
                </span>
                <span className="py-0.5 px-2 rounded-full text-[10px] font-black uppercase text-slate-950 bg-amber-400 shadow-sm">
                  20 Platillos 3D Base
                </span>
              </div>
              <h4 className={`text-base sm:text-lg font-black ${currentPalette.textPrimary}`}>
                ¿Cuentas con 2 o más sucursales?
              </h4>
              <p className={`text-xs ${currentPalette.textMuted} leading-relaxed max-w-xl`}>
                El <strong>Plan Cadenas & Franquicias</strong> incluye 20 platillos 3D base, Catálogo Maestro centralizado y agrega sedes adicionales con tarifa preferencial a solo <strong className="text-amber-400">$999 MXN + IVA/mes</strong> cada una (ahorras un 23% frente a planes individuales).
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => openTrialModal('enterprise_chain')}
                className="py-3 px-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all shadow-md whitespace-nowrap"
              >
                Probar 7 Días para Cadenas
              </button>
              <button
                type="button"
                onClick={() => openCheckout('enterprise_chain')}
                className={`py-2.5 px-4 rounded-full ${currentPalette.buttonSecondary} text-xs font-bold cursor-pointer active:scale-95 transition-all whitespace-nowrap`}
              >
                Contratar (${billingPeriod === 'annual' ? '$21,990' : '$2,199'} MXN)
              </button>
            </div>
          </div>

          {/* Banner de Platillos y Slots Adicionales */}
          <div className={`p-4 sm:p-6 rounded-3xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto`}>
            <div className="space-y-1 text-center sm:text-left">
              <span className={`text-xs font-bold ${currentPalette.textPrimary} block`}>¿Necesitas más platillos en 3D?</span>
              <p className={`text-xs ${currentPalette.textMuted}`}>
                Puedes ampliar tu menú agregando platillos 3D adicionales en cualquier momento por solo <strong className="text-amber-400">$99 MXN + IVA/mes</strong> por platillo extra.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openTrialModal('chain_vip')}
              className="py-2.5 px-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shrink-0 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              Iniciar Prueba Gratis
            </button>
          </div>

        </div>
      </section>

      {/* 8. SECCIÓN DE CONTACTO DIRECTO */}
      <section id="contacto" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: currentPalette.primaryHex }}>Atención Personalizada</span>
            <h2 className={`text-3xl sm:text-4xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} mt-1`}>¿Tienes Preguntas o Necesitas Asesoría?</h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textMuted} mt-2 max-w-md mx-auto`}>
              Escríbenos directamente y un especialista te responderá hoy mismo para orientarte sobre la mejor opción para tu restaurante.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 ${currentPalette.cardBg} rounded-3xl p-6 sm:p-10 shadow-xl items-center`}>
            
            {/* Información de contacto directo */}
            <div className={`md:col-span-5 space-y-5 text-left border-b md:border-b-0 md:border-r ${currentPalette.sectionBorder} pb-6 md:pb-0 md:pr-6`}>
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}15`, color: currentPalette.primaryHex }}>
                  <Mail className="w-6 h-6" />
                </span>
                <div>
                  <h4 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Correo Oficial</h4>
                  <a
                    href="mailto:volum.menu.oficial@gmail.com"
                    className="text-xs font-semibold hover:underline break-all"
                    style={{ color: currentPalette.primaryHex }}
                  >
                    volum.menu.oficial@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}15`, color: currentPalette.primaryHex }}>
                  <Clock className="w-6 h-6" />
                </span>
                <div>
                  <h4 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Horario de Atención</h4>
                  <p className={`text-xs ${currentPalette.textMuted}`}>Lunes a Viernes de 9:00 a 18:00 hrs (CDMX)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}15`, color: currentPalette.primaryHex }}>
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h4 className={`text-sm font-bold ${currentPalette.textPrimary}`}>Respuesta Inmediata</h4>
                  <p className={`text-xs ${currentPalette.textMuted}`}>Te contactamos en menos de 2 horas hábiles</p>
                </div>
              </div>
            </div>

            {/* Formulario rápido */}
            <form onSubmit={handleContactSubmit} className="md:col-span-7 space-y-4">
              <div>
                <label className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1.5`}>Tu Nombre o Encargado</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ej. Chef Roberto Méndez"
                  className={`w-full px-4 py-3 rounded-2xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1.5`}>Nombre del Restaurante o Local</label>
                <input
                  type="text"
                  required
                  value={contactRestaurant}
                  onChange={(e) => setContactRestaurant(e.target.value)}
                  placeholder="Ej. La Terraza Gourmet"
                  className={`w-full px-4 py-3 rounded-2xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1.5`}>¿Qué te gustaría saber o consultar?</label>
                <textarea
                  required
                  rows="3"
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Cuéntanos cuántas mesas tienes o qué dudas tienes sobre la digitalización..."
                  className={`w-full px-4 py-3 rounded-2xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all resize-none`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 px-6 rounded-full ${currentPalette.buttonPrimary} font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all`}
              >
                <Send className="w-4 h-4" />
                <span>{contactSent ? '¡Mensaje Enviado con Éxito!' : 'Enviar Mensaje a un Especialista'}</span>
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* 9. PREGUNTAS FRECUENTES (FAQ) EN ACORDEÓN */}
      <section id="faq" className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold uppercase tracking-wider`}>
              <HelpCircle className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>RESOLVEMOS TUS DUDAS</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
              Preguntas Frecuentes
            </h2>
            <p className={`text-sm ${currentPalette.textMuted} mt-2`}>
              Todo lo que necesitas saber antes de modernizar tu menú con Realidad Aumentada.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl transition-all duration-200 border overflow-hidden ${currentPalette.cardBg}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className={`text-sm font-bold ${currentPalette.textPrimary}`}>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      style={{ color: currentPalette.primaryHex }}
                    />
                  </button>

                  {isOpen && (
                    <div className={`px-5 pb-5 pt-1 text-xs ${currentPalette.textMuted} leading-relaxed border-t border-slate-700/10`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. LLAMADO A LA ACCIÓN FINAL (BANNER DE ADQUISICIÓN) */}
      <section className={`py-20 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} relative overflow-hidden transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="p-3 rounded-2xl inline-flex mb-6 shadow-sm" style={{ backgroundColor: `${currentPalette.primaryHex}15`, color: currentPalette.primaryHex }}>
            <Award className="w-8 h-8" />
          </span>

          <h2 className={`text-3xl sm:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
            Lleva la Experiencia de tu Restaurante al Siguiente Nivel
          </h2>

          <p className={`mt-4 text-sm sm:text-base ${currentPalette.textMuted} max-w-2xl mx-auto leading-relaxed`}>
            Digitaliza tus platillos estrella en Realidad Aumentada, sorprende a cada comensal y eleva tus ventas desde esta misma semana.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#precios"
              className={`w-full sm:w-auto py-4 px-10 rounded-full ${currentPalette.buttonPrimary} font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95`}
            >
              <span>Elegir mi Plan y Comenzar</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/r/la-terraza?mode=showcase"
              target="_blank"
              className={`w-full sm:w-auto py-4 px-7 rounded-full ${currentPalette.buttonSecondary} font-bold text-xs transition-all flex items-center justify-center gap-2`}
            >
              <Eye className="w-4 h-4" style={{ color: currentPalette.primaryHex }} />
              <span>Ver Menú de Ejemplo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER ESTRUCTURADO MULTI-COLUMNA (ESTILO OFICIAL) */}
      <footer className={`pt-16 pb-12 px-5 sm:px-8 border-t ${currentPalette.sectionBorder} ${currentPalette.footerBg} text-xs transition-colors duration-300`}>
        <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b ${currentPalette.sectionBorder}`}>
          {/* Columna 1: Marca y Misión */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/volum-main" className="flex items-center gap-2.5 group w-fit" title="Conoce Volum-Main (Empresa Matriz)">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all"
                style={{
                  backgroundColor: currentPalette.primaryHex,
                  boxShadow: `0 6px 16px -4px ${currentPalette.primaryHex}45`
                }}
              >
                V
              </div>
              <span className={`font-extrabold text-base tracking-tight ${currentPalette.logoText}`}>
                Volum<span className={currentPalette.textAccent}>-Menu</span>
              </span>
            </Link>
            <p className={`text-xs ${currentPalette.textMuted} leading-relaxed max-w-sm`}>
              Plataforma de menús interactivos en WebAR para restaurantes de alto nivel. Desarrollado por <strong>Volum Technologies</strong>.
            </p>
            <div className="pt-1">
              <a
                href="mailto:volum.menu.oficial@gmail.com"
                className={`inline-flex items-center gap-2 text-xs font-medium ${currentPalette.textAccent} hover:underline transition-colors`}
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>volum.menu.oficial@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Plataforma */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${currentPalette.textPrimary}`}>Plataforma</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#demo" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Simulador WebAR</a>
              </li>
              <li>
                <Link to="/servicio?slug=la-terraza" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Servicio a Mesa (Mesero)</Link>
              </li>
              <li>
                <a href="#calculadora" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Calculadora de Retorno ROI</a>
              </li>
              <li>
                <a href="#precios" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Planes de Suscripción</a>
              </li>
              <li>
                <Link to="/r/la-terraza?mode=showcase" target="_blank" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Carta Demo en Vivo</Link>
              </li>
              <li>
                <Link to="/volum-main" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors flex items-center gap-1 text-amber-400 font-semibold`}>
                  <span>Quiénes Somos (Volum-Main)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal y Soporte */}
          <div className="md:col-span-4 space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${currentPalette.textPrimary}`}>Legal y Soporte</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacidad" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Aviso de Privacidad</Link>
              </li>
              <li>
                <Link to="/terminos" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Términos del Servicio</Link>
              </li>
              <li>
                <a href="#faq" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Preguntas Frecuentes</a>
              </li>
              <li>
                <a href="#contacto" className={`${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors`}>Contacto Comercial</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className={`max-w-6xl mx-auto pt-6 flex items-center justify-center sm:justify-end text-xs ${currentPalette.textMuted}`}>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`font-semibold ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-lg hover:opacity-80 active:scale-95`}
            aria-label="Subir al inicio de la página"
          >
            <span>Subir al Inicio</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </footer>

      {/* MODAL DE CHECKOUT / PAGO DIRECTO DE PLAN (CONSERVA LA PALETA DE MARCA SELECCIONADA) */}
      {checkoutModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => !isProcessingPayment && setCheckoutModalOpen(false)}
        >
          <div
            className={`${currentPalette.cardBg} border ${currentPalette.sectionBorder} rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl relative my-auto sm:my-8 text-left overflow-hidden animate-fadeIn transition-colors duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del modal fija arriba con botón cerrar siempre visible */}
            <div className={`p-5 sm:p-6 border-b ${currentPalette.sectionBorder} flex items-start justify-between gap-4 ${currentPalette.cardBg} shrink-0 z-10`}>
              <div className="min-w-0">
                <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full ${currentPalette.badgeClass} text-xs font-black uppercase tracking-wider mb-2`}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: currentPalette.primaryHex }} />
                  <span>{PLAN_DATA[selectedPlanKey]?.badge || 'Suscripción'}</span>
                </div>
                <h3
                  id="checkout-modal-title"
                  className={`text-xl sm:text-2xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} leading-tight`}
                >
                  {modalMode === 'trial' ? 'Comienza tu Prueba VIP de 7 Días' : `Contratar ${PLAN_DATA[selectedPlanKey]?.name}`}
                </h3>
                <p className={`text-xs ${currentPalette.textMuted} mt-1 line-clamp-1`}>
                  {PLAN_DATA[selectedPlanKey]?.tagline}
                </p>
              </div>

              {/* Botón cerrar siempre visible con touch target adecuado */}
              <button
                type="button"
                onClick={() => !isProcessingPayment && setCheckoutModalOpen(false)}
                className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl ${currentPalette.buttonSecondary} transition-all shrink-0 shadow-sm active:scale-95 cursor-pointer`}
                aria-label="Cerrar modal de pago"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido scrolleable para que en pantallas pequeñas nunca se corte */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">

              {/* Pestañas de Modo: Prueba VIP 7 Días vs Pago Directo */}
              <div className={`p-1.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} grid grid-cols-2 gap-1 text-xs font-bold`}>
                <button
                  type="button"
                  onClick={() => setModalMode('trial')}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'trial'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prueba VIP 7 Días (Sin Tarjeta)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('direct_pay')}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'direct_pay'
                      ? `${currentPalette.buttonPrimary} font-black shadow-md`
                      : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pago Directo con Tarjeta</span>
                </button>
              </div>

              {modalMode === 'trial' ? (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Acceso Total VIP por 7 Días • Sin Tarjeta de Crédito</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Inicias con el <strong>Plan VIP Fine Dining (15 platillos 3D activos)</strong>, WebAR 1:1, pedidos de mesa y comandero en vivo. Cero cobros automáticos. Al finalizar tus 7 días podrás elegir el plan que mejor se adapte a tu restaurante.
                  </p>
                </div>
              ) : null}

              {/* Selector rápido de Plan dentro del modal */}
              <div className={`p-1.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs font-bold`}>
                {Object.values(PLAN_DATA).map((planOption) => {
                  const isActivePlan = selectedPlanKey === planOption.key;
                  return (
                    <button
                      key={planOption.key}
                      type="button"
                      onClick={() => setSelectedPlanKey(planOption.key)}
                      className={`py-2 px-2 rounded-xl transition-all text-center truncate cursor-pointer ${
                        isActivePlan
                          ? `${currentPalette.buttonPrimary} font-black shadow-sm`
                          : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                      }`}
                    >
                      {planOption.key === 'essential'
                        ? 'Esencial'
                        : planOption.key === 'experience_3d'
                        ? 'Experiencia 3D'
                        : planOption.key === 'chain_vip'
                        ? 'VIP Dining'
                        : 'Cadenas'}
                    </button>
                  );
                })}
              </div>

              {/* Resumen de Precio y Período */}
              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold ${currentPalette.textMuted}`}>Modalidad de pago:</span>
                  <div className={`inline-flex p-1 rounded-xl ${currentPalette.cardBg} border ${currentPalette.sectionBorder} text-xs font-bold`}>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod('monthly')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        billingPeriod === 'monthly'
                          ? `${currentPalette.buttonPrimary} font-black shadow-sm`
                          : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                      }`}
                    >
                      Mensual
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod('annual')}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        billingPeriod === 'annual'
                          ? `${currentPalette.buttonPrimary} font-black shadow-sm`
                          : `${currentPalette.textMuted} hover:${currentPalette.textPrimary}`
                      }`}
                    >
                      <span>Anual</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-black">
                        -2 meses
                      </span>
                    </button>
                  </div>
                </div>

                {(() => {
                  const plan = PLAN_DATA[selectedPlanKey];
                  const subtotal = billingPeriod === 'monthly'
                    ? (plan?.monthlyPrice || 0)
                    : (plan?.annualTotalPrice || Math.round((plan?.monthlyPrice || 0) * 10));
                  const iva = +(subtotal * 0.16).toFixed(2);
                  const total = +(subtotal + iva).toFixed(2);

                  return (
                    <div className={`border-t ${currentPalette.sectionBorder} pt-3 space-y-2`}>
                      <div className={`flex items-center justify-between text-xs ${currentPalette.textMuted}`}>
                        <span>Subtotal {billingPeriod === 'monthly' ? 'Mensual' : 'Anual'}:</span>
                        <span className={`font-bold ${currentPalette.textPrimary}`}>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: currentPalette.primaryHex }}>
                        <span>IVA Trasladado (16% deducible):</span>
                        <span className="font-bold">+${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold">
                        <span>Activación de plataforma:</span>
                        <span className="font-bold">$0.00 MXN (Gratis)</span>
                      </div>
                      <div className={`flex items-baseline justify-between pt-2 border-t ${currentPalette.sectionBorder}`}>
                        <div>
                          <span className={`text-xs font-bold ${currentPalette.textPrimary}`}>Total a pagar:</span>
                          {billingPeriod === 'annual' && (
                            <div className="text-xs text-emerald-500 font-semibold">Incluye 2 meses de regalo</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-black ${currentPalette.fontHeading}`} style={{ color: currentPalette.primaryHex }}>
                            ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                          </div>
                          <span className={`text-xs ${currentPalette.textMuted} font-medium`}>
                            {billingPeriod === 'monthly' ? 'cargo recurrente mensual' : 'cargo recurrente anual'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className={`mt-3 pt-3 border-t ${currentPalette.sectionBorder} flex items-center gap-2 text-xs ${currentPalette.textPrimary} font-medium`}>
                  <Check className="w-4 h-4 shrink-0" style={{ color: currentPalette.primaryHex }} />
                  <span>Incluye <strong>{PLAN_DATA[selectedPlanKey]?.slots}</strong></span>
                </div>
              </div>

              {/* Error si ocurre */}
              {checkoutError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 font-medium">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Formulario de Checkout */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="checkout-restaurant-name" className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1`}>
                    Nombre de tu Restaurante *
                  </label>
                  <input
                    id="checkout-restaurant-name"
                    name="restaurantName"
                    autoComplete="organization"
                    type="text"
                    required
                    value={checkoutForm.restaurantName}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, restaurantName: e.target.value })
                    }
                    placeholder="Ej. La Parrilla de San Juan"
                    className={`w-full px-3.5 py-2.5 rounded-xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-contact-name" className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1`}>
                      Tu Nombre *
                    </label>
                    <input
                      id="checkout-contact-name"
                      name="contactName"
                      autoComplete="name"
                      type="text"
                      required
                      value={checkoutForm.contactName}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, contactName: e.target.value })
                      }
                      placeholder="Ej. Carlos Mendoza"
                      className={`w-full px-3.5 py-2.5 rounded-xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1`}>
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      autoComplete="tel"
                      type="tel"
                      required
                      value={checkoutForm.phone}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                      }
                      placeholder="Ej. 55 1234 5678"
                      className={`w-full px-3.5 py-2.5 rounded-xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-email" className={`block text-xs font-bold ${currentPalette.textPrimary} mb-1`}>
                    Correo Electrónico de Facturación y Cuenta *
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, email: e.target.value })
                    }
                    placeholder="admin@turestaurante.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="checkout-password" className={`block text-xs font-bold ${currentPalette.textPrimary}`}>
                      Crear Contraseña para tu Cuenta *
                    </label>
                    <span className={`text-xs ${currentPalette.textMuted}`}>Mínimo 6 caracteres</span>
                  </div>
                  <div className="relative">
                    <input
                      id="checkout-password"
                      name="password"
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={checkoutForm.password}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, password: e.target.value })
                      }
                      placeholder="••••••••••••"
                      className={`w-full pl-3.5 pr-12 py-2.5 rounded-xl ${currentPalette.inputBg} text-xs font-medium outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors p-1 cursor-pointer`}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs mt-1.5 flex items-center gap-1.5 font-medium" style={{ color: currentPalette.primaryHex }}>
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Esta será tu contraseña para acceder a tu panel de admin.</span>
                  </p>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className={`w-full py-4 rounded-xl font-black text-xs shadow-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95 cursor-pointer ${
                      modalMode === 'trial'
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : `${currentPalette.buttonPrimary}`
                    }`}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{modalMode === 'trial' ? 'Activando tu acceso VIP...' : 'Conectando con pasarela de pago...'}</span>
                      </>
                    ) : modalMode === 'trial' ? (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Iniciar Mi Prueba VIP de 7 Días Gratis</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Continuar al Pago Seguro con Tarjeta</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/r/la-terraza?mode=showcase"
                    target="_blank"
                    className={`w-full py-2.5 rounded-xl ${currentPalette.buttonSecondary} font-bold text-xs flex items-center justify-center gap-2 transition-all text-center`}
                  >
                    <Eye className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
                    <span>¿Prefieres ver el Menú de Prueba primero? Haz clic aquí</span>
                  </Link>
                </div>

                <div className={`pt-2 flex flex-col items-center justify-center gap-1.5 text-xs ${currentPalette.textMuted} text-center`}>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Cobro seguro procesado vía Stripe. Puedes cancelar en cualquier momento.</span>
                  </div>
                  <p className={`text-xs ${currentPalette.textMuted}`}>
                    Al continuar, aceptas nuestros{' '}
                    <Link
                      to="/terminos"
                      target="_blank"
                      className="font-bold underline hover:opacity-80"
                      style={{ color: currentPalette.primaryHex }}
                    >
                      Términos de Servicio
                    </Link>{' '}
                    y{' '}
                    <Link
                      to="/privacidad"
                      target="_blank"
                      className="font-bold underline hover:opacity-80"
                      style={{ color: currentPalette.primaryHex }}
                    >
                      Aviso de Privacidad
                    </Link>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

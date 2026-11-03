import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Sparkles,
  Box,
  Globe,
  ChevronRight,
  Utensils,
  AlertCircle,
  List,
  LayoutGrid,
  X,
  Coffee,
  Wine,
  Pizza,
  Fish,
  Beef,
  Cake,
  Soup,
  Sandwich,
  Video,
  Film,
  Bot,
  Send,
  MessageSquare,
  Phone,
  Instagram,
  MapPin,
  CheckCircle2,
  Gift,
  Clock,
  Flame,
  Music,
  Tag,
  Star,
  ShoppingBag,
  Leaf,
  Wheat
} from 'lucide-react';
import ModelViewerModal from '../../components/ModelViewerModal';
import TableAssistanceBar from '../../components/TableAssistanceBar';
import TableCartModal from '../../components/TableCartModal';
import DigitalReceiptModal from '../../components/DigitalReceiptModal';
import AllergenBadge from '../../components/AllergenBadge';
import DishDetailModal from '../../components/DishDetailModal';
import { DINER_STYLES, DEFAULT_DINER_STYLE_ID } from '../../config/dinerStyles';
import { getMediaUrl } from '../../utils/media';
import MealScheduleSelector from '../../components/MealScheduleSelector';
import MarketingBannersDisplay from '../../components/MarketingBannersDisplay';
import { getCurrentSchedule, isDishInSchedule, isCategoryInSchedule } from '../../utils/mealSchedules';

// Helper de iconos vectoriales SVG para banner (Regla estricta: Cero Emojis)
const AnnouncementIcon = ({ iconType, className = 'w-3.5 h-3.5' }) => {
  switch (iconType) {
    case 'gift': return <Gift className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'flame': return <Flame className={className} />;
    case 'music': return <Music className={className} />;
    case 'tag': return <Tag className={className} />;
    default: return <Sparkles className={className} />;
  }
};

const getFontClass = (font) => {
  switch (font) {
    case 'playfair': return 'font-playfair';
    case 'lora': return 'font-lora';
    case 'jakarta': return 'font-jakarta';
    case 'outfit': return 'font-outfit';
    case 'cormorant': return 'font-cormorant';
    default: return 'font-sans';
  }
};

const getTextureClass = (texture) => {
  switch (texture) {
    case 'grain': return 'texture-grain';
    case 'slate': return 'texture-slate';
    case 'marble': return 'texture-marble';
    default: return '';
  }
};

const getCardRadiusClass = (radius) => {
  switch (radius) {
    case 'sharp': return 'rounded-none';
    case 'subtle': return 'rounded-xl';
    default: return 'rounded-2xl';
  }
};

// Glifo vectorial SVG inteligente para platillos que no tienen fotografía aún (Regla no-emoji-icons)
const DishCategoryIcon = ({ categoryName = '', dishName = '', className = 'w-7 h-7 text-amber-400/80' }) => {
  const text = `${categoryName || ''} ${dishName || ''}`.toLowerCase();
  if (text.includes('carne') || text.includes('corte') || text.includes('asado') || text.includes('bife') || text.includes('ribeye') || text.includes('chorizo') || text.includes('picaña') || text.includes('arrachera') || text.includes('vacio')) {
    return <Beef className={className} aria-hidden="true" />;
  }
  if (text.includes('sopa') || text.includes('crema') || text.includes('caldo') || text.includes('consomé')) {
    return <Soup className={className} aria-hidden="true" />;
  }
  if (text.includes('pasta') || text.includes('pizza') || text.includes('spaghetti') || text.includes('lasagna') || text.includes('ravioli')) {
    return <Pizza className={className} aria-hidden="true" />;
  }
  if (text.includes('marisco') || text.includes('pescado') || text.includes('atun') || text.includes('atún') || text.includes('salmon') || text.includes('salmón') || text.includes('camaron') || text.includes('camarón')) {
    return <Fish className={className} aria-hidden="true" />;
  }
  if (text.includes('hamburguesa') || text.includes('burger') || text.includes('sandwich') || text.includes('baguette') || text.includes('torta') || text.includes('panini')) {
    return <Sandwich className={className} aria-hidden="true" />;
  }
  if (text.includes('postre') || text.includes('dulce') || text.includes('helado') || text.includes('cacao') || text.includes('chocolate') || text.includes('pastel') || text.includes('flan') || text.includes('coulant')) {
    return <Cake className={className} aria-hidden="true" />;
  }
  if (text.includes('coctel') || text.includes('cóctel') || text.includes('mixologia') || text.includes('vino') || text.includes('cerveza') || text.includes('drink') || text.includes('licor') || text.includes('bebida')) {
    return <Wine className={className} aria-hidden="true" />;
  }
  if (text.includes('cafe') || text.includes('café') || text.includes('infusion') || text.includes('te') || text.includes('té') || text.includes('latte')) {
    return <Coffee className={className} aria-hidden="true" />;
  }
  return <Utensils className={className} aria-hidden="true" />;
};

// Formatea el texto de la IA eliminando asteriscos crudos y aplicando tipografía limpia
const renderFormattedMessage = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <span key={lIdx} className="block h-1.5" />;
    }

    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
    const content = isBullet ? trimmed.replace(/^[•-]\s*/, '') : trimmed;

    // Detectar **texto** y convertirlo en <strong> sin asteriscos
    const parts = content.split(/(\*\*[^*]+\*\*)/g);

    const rendered = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanBold = part.slice(2, -2).trim();
        return (
          <strong key={pIdx} className="font-bold text-inherit tracking-normal">
            {cleanBold}
          </strong>
        );
      }
      // Limpiar cualquier asterisco suelto restante
      const clean = part.replace(/\*/g, '');
      return <span key={pIdx}>{clean}</span>;
    });

    if (isBullet) {
      return (
        <div key={lIdx} className="flex items-start gap-2 mb-2 last:mb-0">
          <span className="font-bold shrink-0 mt-0.5 opacity-80">•</span>
          <span className="flex-1 text-inherit">{rendered}</span>
        </div>
      );
    }

    return (
      <p key={lIdx} className="mb-2 last:mb-0 text-inherit">
        {rendered}
      </p>
    );
  });
};

const UI_TRANSLATIONS = {
  es: {
    backToVolum: '← Volum-Menu',
    loadingText: 'Cargando experiencia gastronómica...',
    menuUnavailable: 'Carta no disponible',
    backToHome: 'Volver al Inicio',
    announcementBadge: 'Novedad',
    searchPlaceholder: 'Buscar platillo, corte o ingrediente...',
    compactView: 'Vista Lista Compacta',
    gridView: 'Vista Cuadrícula 2 Columnas',
    feedView: 'Modo Feed Reels (Formato vertical dinámico)',
    dishes3D: 'Platillos 3D',
    featuredDishes: 'Más Populares',
    featuredBadge: 'Más Pedido',
    featuredSectionTitle: 'Platillos Más Populares',
    popularSectionTitle: 'Platillos Más Populares',
    featuredSectionSubtitle: 'Favoritos aclamados por nuestros comensales y especialidades más solicitadas',
    all: 'Todos',
    noDishesTitle: 'No encontramos platillos con ese criterio',
    noDishesSubtitle: 'Intenta otra palabra clave o desactiva los filtros.',
    soldOut: 'Agotado',
    soldOutToday: 'Agotado hoy',
    soldOutKitchen: 'Agotado por hoy en cocina',
    notAvailableToday: 'No disponible hoy',
    tapForDetails: 'Toca para ver detalles',
    view3D: 'Ver 3D',
    view3DAR: '3D AR',
    view3D1to1: '3D 1:1',
    info: 'Info',
    reels: 'Reels',
    video: 'Video',
    webarActive: 'Experiencia WebAR 1:1 Activa',
    allergensTitle: 'Información de Alérgenos:',
    allergensCount: (n) => `${n} alérgenos`,
    exploreWebAR: 'Explorar en Realidad Aumentada (WebAR 1:1)',
    closeDetails: 'Cerrar detalle',
    specialty: 'Especialidad',
    specialtyDefault: 'Especialidad preparada al momento con ingredientes frescos de la más alta calidad.',
    aiAssistantDefaultName: 'Asesor Gastronómico',
    aiOfficialMenu: (restName) => `Carta oficial de ${restName} • Verificado`,
    aiDisclaimer: 'Respuestas basadas en los ingredientes y alérgenos de nuestra carta. En alergias severas, avisa a tu mesero.',
    aiChips: [
      '¿Qué platillos me recomiendas?',
      '¿Tienen opciones vegetarianas o sin lácteos?',
      '¿Cuáles platillos tienen experiencia 3D?',
      '¿Qué postre me sugieres?'
    ],
    aiWelcome: (restName, asstName) => `Bienvenido a ${restName || 'nuestra mesa'}. Soy tu ${asstName}. Pregúntame qué pedir, alérgenos o platillos en 3D.`,
    aiThinking: 'Consultando la carta con Volum IA...',
    aiInputPlaceholder: 'Pregunta sobre ingredientes, maridaje o platos...',
    aiErrorDefault: 'No pude obtener una respuesta en este momento. Por favor consúltalo con tu mesero.',
    aiErrorFallback: 'Disculpa la molestia, hubo un inconveniente al consultar la carta. Por favor consúltalo con tu mesero en mesa.',
    interactiveMenuBy: 'Menú interactivo 3D por',
    activateForRestaurant: 'Actívalo para tu restaurante',
    howToGetThere: 'Cómo Llegar'
  },
  en: {
    backToVolum: '← Volum-Menu',
    loadingText: 'Loading dining experience...',
    menuUnavailable: 'Menu not available',
    backToHome: 'Back to Home',
    announcementBadge: 'News',
    searchPlaceholder: 'Search dish, cut, or ingredient...',
    compactView: 'Compact List View',
    gridView: '2-Column Grid View',
    feedView: 'Reels Feed Mode (Dynamic vertical layout)',
    dishes3D: '3D Dishes',
    featuredDishes: 'Most Popular',
    featuredBadge: 'Bestseller',
    featuredSectionTitle: 'Most Popular Dishes',
    popularSectionTitle: 'Most Popular Dishes',
    featuredSectionSubtitle: 'Acclaimed customer favorites and most requested specialties',
    all: 'All',
    noDishesTitle: 'No dishes found matching this criteria',
    noDishesSubtitle: 'Try another keyword or clear active filters.',
    soldOut: 'Sold out',
    soldOutToday: 'Sold out today',
    soldOutKitchen: 'Sold out for today in kitchen',
    notAvailableToday: 'Not available today',
    tapForDetails: 'Tap to view details',
    view3D: 'View 3D',
    view3DAR: '3D AR',
    view3D1to1: '3D 1:1',
    info: 'Info',
    reels: 'Reels',
    video: 'Video',
    webarActive: 'WebAR 1:1 Experience Active',
    allergensTitle: 'Allergen Information:',
    allergensCount: (n) => `${n} allergens`,
    exploreWebAR: 'Explore in Augmented Reality (WebAR 1:1)',
    closeDetails: 'Close details',
    specialty: 'Specialty',
    specialtyDefault: 'Specialty prepared on the spot with the highest quality fresh ingredients.',
    aiAssistantDefaultName: 'Dining Advisor',
    aiOfficialMenu: (restName) => `Official menu of ${restName} • Verified`,
    aiDisclaimer: 'Answers based on the ingredients and allergens in our menu. For severe allergies, notify your server.',
    aiChips: [
      'What dishes do you recommend?',
      'Do you have vegetarian or dairy-free options?',
      'Which dishes have a 3D experience?',
      'What dessert do you suggest?'
    ],
    aiWelcome: (restName, asstName) => `Welcome to ${restName || 'our table'}. I am your ${asstName}. Ask me about recommendations, allergens, or 3D dishes.`,
    aiThinking: 'Consulting menu with Volum AI...',
    aiInputPlaceholder: 'Ask about ingredients, pairing, or dishes...',
    aiErrorDefault: 'Could not obtain an answer right now. Please ask your server.',
    aiErrorFallback: 'Sorry for the inconvenience, there was an issue querying the menu. Please consult your server.',
    interactiveMenuBy: 'Interactive 3D menu by',
    activateForRestaurant: 'Activate it for your restaurant',
    howToGetThere: 'Directions'
  },
  fr: {
    backToVolum: '← Volum-Menu',
    loadingText: 'Chargement de l’expérience gastronomique...',
    menuUnavailable: 'Menu non disponible',
    backToHome: 'Retour à l’accueil',
    announcementBadge: 'Nouveauté',
    searchPlaceholder: 'Rechercher un plat, viande ou ingrédient...',
    compactView: 'Vue Liste Compacte',
    gridView: 'Vue Grille 2 Colonnes',
    feedView: 'Mode Reels (Format vertical dynamique)',
    dishes3D: 'Plats 3D',
    featuredDishes: 'Plus Populaires',
    featuredBadge: 'Plus Demandé',
    featuredSectionTitle: 'Plats les Plus Populaires',
    popularSectionTitle: 'Plats les Plus Populaires',
    featuredSectionSubtitle: 'Les créations les plus appréciées et favorites de nos convives',
    all: 'Tous',
    noDishesTitle: 'Aucun plat trouvé pour cette recherche',
    noDishesSubtitle: 'Essayez un autre mot-clé ou désactivez les filtres.',
    soldOut: 'Épuisé',
    soldOutToday: 'Épuisé aujourd’hui',
    soldOutKitchen: 'Épuisé pour aujourd’hui en cuisine',
    notAvailableToday: 'Non disponible aujourd’hui',
    tapForDetails: 'Appuyez pour voir les détails',
    view3D: 'Voir 3D',
    view3DAR: '3D AR',
    view3D1to1: '3D 1:1',
    info: 'Info',
    reels: 'Reels',
    video: 'Vidéo',
    webarActive: 'Expérience WebAR 1:1 Active',
    allergensTitle: 'Informations sur les Allergènes :',
    allergensCount: (n) => `${n} allergènes`,
    exploreWebAR: 'Explorer en Réalité Augmentée (WebAR 1:1)',
    closeDetails: 'Fermer le détail',
    specialty: 'Spécialité',
    specialtyDefault: 'Spécialité fraîchement préparée avec des ingrédients de première qualité.',
    aiAssistantDefaultName: 'Conseiller Culinaire',
    aiOfficialMenu: (restName) => `Menu officiel de ${restName} • Vérifié`,
    aiDisclaimer: 'Réponses basées sur les ingrédients et allergènes de notre carte. Pour allergies sévères, prévenez votre serveur.',
    aiChips: [
      'Quels plats me recommandez-vous ?',
      'Avez-vous des options végétariennes ou sans produits laitiers ?',
      'Quels plats ont une expérience 3D ?',
      'Quel dessert me suggérez-vous ?'
    ],
    aiWelcome: (restName, asstName) => `Bienvenue chez ${restName || 'notre table'}. Je suis votre ${asstName}. Demandez-moi des recommandations, allergènes ou plats en 3D.`,
    aiThinking: 'Consultation du menu avec Volum IA...',
    aiInputPlaceholder: 'Posez une question sur les ingrédients, accords ou plats...',
    aiErrorDefault: 'Impossible d’obtenir une réponse pour le moment. Veuillez demander à votre serveur.',
    aiErrorFallback: 'Désolé pour le désagrément, une erreur est survenue. Veuillez consulter votre serveur.',
    interactiveMenuBy: 'Menu interactif 3D par',
    activateForRestaurant: 'Activez-le pour votre restaurant',
    howToGetThere: 'Comment s’y rendre'
  }
};

export default function DinerMenuPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const mesaParam = searchParams.get('mesa') || '';
  const zonaParam = searchParams.get('zona') || 'Principal';
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('volum_preferred_lang') : null;
  const langParam = searchParams.get('lang') || (storedLang && ['es', 'en', 'fr'].includes(storedLang) ? storedLang : 'es');
  const modeParam = searchParams.get('mode') || '';
  const isShowcaseMode = modeParam === 'showcase' || !mesaParam;

  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [bannerLoadError, setBannerLoadError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScheduleId, setSelectedScheduleId] = useState('all');
  const [only3DFilter, setOnly3DFilter] = useState(false);
  const [onlyFeaturedFilter, setOnlyFeaturedFilter] = useState(false);
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'vegan', 'gluten_free', 'spicy'
  const [currentStyleId, setCurrentStyleId] = useState(() => {
    const urlStyle = searchParams.get('style');
    if (urlStyle && DINER_STYLES[urlStyle]) return urlStyle;
    return DEFAULT_DINER_STYLE_ID;
  });
  const baseStyle = DINER_STYLES[currentStyleId] || DINER_STYLES[DEFAULT_DINER_STYLE_ID];
  const currentStyle = useMemo(() => {
    const theme = menuData?.restaurant?.theme;
    if (!theme) return baseStyle;

    const customPrimary = theme.primaryColor;
    const customSecondary = theme.secondaryColor;
    const customAccent = theme.accentColor || customPrimary;
    const customSurface = theme.surfaceColor;

    if (!customPrimary && !customSecondary && !customAccent && !customSurface) {
      return baseStyle;
    }

    const isColorLight = (c) => {
      if (!c || typeof c !== 'string') return false;
      const hex = c.replace('#', '');
      if (hex.length < 6) return false;
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 165;
    };

    const isDark = baseStyle.isDark;
    const activeAccent = customAccent || baseStyle.colors.accent;
    const activePrimary = customPrimary || activeAccent;
    const isAccentLight = isColorLight(activeAccent);

    // Armonía visual: Si el estilo comensal es claro (street_food, bistro_botanico, trattoria),
    // el lienzo SIEMPRE se mantiene claro para no crear un fondo oscuro con tarjetas blancas.
    const resolvedBgCanvas = isDark
      ? (customSurface || baseStyle.colors.bgCanvas)
      : (customSurface && isColorLight(customSurface) ? customSurface : baseStyle.colors.bgCanvas);

    const resolvedCardBg = isDark
      ? (customSurface === '#020617' ? '#0F172A' : (customSurface || '#0F172A'))
      : baseStyle.colors.cardBg;

    const resolvedTitlePrice = activeAccent || activePrimary || baseStyle.colors.titlePrice;

    return {
      ...baseStyle,
      colors: {
        ...baseStyle.colors,
        accent: activeAccent,
        accentText: isAccentLight ? '#020617' : '#FFFFFF',
        titlePrice: resolvedTitlePrice,
        headerBg: isDark ? (customSecondary || baseStyle.colors.headerBg) : baseStyle.colors.headerBg,
        bottomBarBg: isDark ? (customSecondary || baseStyle.colors.bottomBarBg) : baseStyle.colors.bottomBarBg,
        bgCanvas: resolvedBgCanvas,
        cardBg: resolvedCardBg,
        cardBorder: isDark
          ? (baseStyle.colors.cardBorder || 'rgba(255,255,255,0.12)')
          : baseStyle.colors.cardBorder
      }
    };
  }, [currentStyleId, menuData?.restaurant?.theme, baseStyle]);
  const [currentLang, setCurrentLang] = useState(langParam);

  // Turno que está actualmente en servicio según la hora del comensal (Fase 4: Multi-cartas)
  const currentServiceSchedule = useMemo(() => {
    const schedules = menuData?.restaurant?.settings?.mealSchedules?.schedules;
    if (!schedules || !menuData?.restaurant?.settings?.mealSchedules?.enabled) return null;
    return getCurrentSchedule(schedules);
  }, [menuData?.restaurant?.settings?.mealSchedules]);

  // Sincronización automática de turno al cargar menú
  useEffect(() => {
    if (menuData?.restaurant?.settings?.mealSchedules?.enabled) {
      const schedules = menuData.restaurant.settings.mealSchedules.schedules || [];
      const autoSwitch = menuData.restaurant.settings.mealSchedules.autoSwitch !== false;
      const current = getCurrentSchedule(schedules);
      if (autoSwitch && current) {
        setSelectedScheduleId(current.id);
      } else if (schedules.length > 0 && selectedScheduleId === 'all') {
        setSelectedScheduleId(schedules[0].id);
      }
    }
  }, [menuData?.restaurant?.settings?.mealSchedules]);

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.es;

  // Sincronizar idioma si cambia en la URL
  useEffect(() => {
    if (langParam && ['es', 'en', 'fr'].includes(langParam) && langParam !== currentLang) {
      setCurrentLang(langParam);
    }
  }, [langParam]);

  // Modo de visualización: 'compact' (bistro ágil), 'grid' (cuadrícula), 'feed' (reels vertical dinámico)
  const [viewMode, setViewMode] = useState('compact');
  // Si es null, respeta el diseño híbrido por categoría (Server-Driven UI); si el comensal pulsa un botón, fuerza esa vista
  const [userForcedViewMode, setUserForcedViewMode] = useState(null);
  // Pantalla de bienvenida (Splash Screen animada)
  const [showIntroSplash, setShowIntroSplash] = useState(false);
  const [splashFadingOut, setSplashFadingOut] = useState(false);
  const splashShownRef = useRef(false);

  // Platillo abierto en ficha detallada (drawer modal)
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);

  // Modal 3D WebAR activo
  const [active3DDish, setActive3DDish] = useState(null);

  // Asistente Gastronómico con IA
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const chatBottomRef = useRef(null);

  // Estado de Sesión de Mesa y Carrito Digital
  const [tableSession, setTableSession] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [dinerName, setDinerName] = useState(() => {
    return localStorage.getItem('volum_diner_name') || 'Comensal';
  });
  const [dishOrderQty, setDishOrderQty] = useState(1);
  const [dishOrderNotes, setDishOrderNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderToast, setOrderToast] = useState(null);

  const handleChangeDinerName = (newName) => {
    setDinerName(newName);
    localStorage.setItem('volum_diner_name', newName);
  };

  const handleAddToCart = (dish, qty = 1, notes = '') => {
    // Validación de turno de servicio en Multi-Cartas (Fase 4)
    if (menuData?.restaurant?.settings?.mealSchedules?.enabled && currentServiceSchedule) {
      const isAllowedNow = isDishInSchedule(dish, currentServiceSchedule.id);
      if (!isAllowedNow) {
        setOrderToast(`"${dish.name}" solo está disponible en su horario de servicio. Nuestro turno actual es ${currentServiceSchedule.name}.`);
        setTimeout(() => setOrderToast(null), 4500);
        return;
      }
    }

    const quantity = Math.max(1, qty);
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.dishId === dish._id && item.notes === (notes || '').trim());
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity
        };
        return next;
      }
      return [...prev, {
        dishId: dish._id,
        name: dish.name,
        price: Number(dish.price) || 0,
        quantity,
        notes: (notes || '').trim(),
        dinerName
      }];
    });

    setOrderToast(`"${dish.name}" agregado a tu comanda.`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleUpdateCartQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    if (selectedDishDetail) {
      setDishOrderQty(1);
      setDishOrderNotes('');
    }
  }, [selectedDishDetail]);

  // Sincronización de Sesión de Mesa Efímera
  const activeTable = mesaParam;
  useEffect(() => {
    const isOrderEnabled = menuData?.restaurant?.settings?.orderSettings?.enabled;
    if (!slug || !activeTable || !isOrderEnabled || isShowcaseMode) return;

    let isMounted = true;
    const initSession = async () => {
      try {
        const storedToken = localStorage.getItem(`volum_session_${slug}_${activeTable}`);
        const res = await axios.post(`/api/v1/sessions/init/${slug}/${activeTable}`, {
          dinerName,
          token: storedToken
        });
        if (isMounted && res.data.success) {
          setTableSession(res.data.session);
          if (res.data.sessionToken) {
            localStorage.setItem(`volum_session_${slug}_${activeTable}`, res.data.sessionToken);
          }
        }
      } catch (err) {
        if (err.response?.data?.reason === 'SESSION_EXPIRED') {
          localStorage.removeItem(`volum_session_${slug}_${activeTable}`);
          try {
            const retryRes = await axios.post(`/api/v1/sessions/init/${slug}/${activeTable}`, { dinerName });
            if (isMounted && retryRes.data.success) {
              setTableSession(retryRes.data.session);
              if (retryRes.data.sessionToken) {
                localStorage.setItem(`volum_session_${slug}_${activeTable}`, retryRes.data.sessionToken);
              }
            }
          } catch (e) {
            console.warn('Error inicializando sesión de mesa:', e.message);
          }
        }
      }
    };

    initSession();

    const timer = setInterval(async () => {
      const currentToken = localStorage.getItem(`volum_session_${slug}_${activeTable}`);
      if (!currentToken) return;
      try {
        const statusRes = await axios.get(`/api/v1/sessions/status/${slug}/${activeTable}?token=${currentToken}`);
        if (isMounted && statusRes.data.success) {
          setTableSession(statusRes.data.session);
        }
      } catch (e) {
        // silencioso
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [slug, activeTable, menuData?.restaurant?.settings?.orderSettings?.enabled, dinerName]);

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmittingOrder(true);
    try {
      const storedToken = localStorage.getItem(`volum_session_${slug}_${activeTable}`);
      const res = await axios.post(`/api/v1/sessions/order/${slug}/${activeTable}`, {
        sessionToken: storedToken,
        dinerName,
        items: cartItems
      });

      if (res.data.success) {
        setCartItems([]);
        if (res.data.order) {
          setTableSession(prev => {
            const currentOrders = prev?.orders ? [...prev.orders, res.data.order] : [res.data.order];
            return {
              ...(prev || {}),
              orders: currentOrders,
              totalAmount: res.data.totalAmount || (prev?.totalAmount || 0)
            };
          });
        }
        setOrderToast(res.data.message || 'Comanda enviada exitosamente.');
        setTimeout(() => setOrderToast(null), 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al enviar el pedido. Intenta nuevamente.';
      setOrderToast(msg);
      setTimeout(() => setOrderToast(null), 4000);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Manejo reactivo de cambio de idioma sincronizado con URL y backend
  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
    try {
      localStorage.setItem('volum_preferred_lang', newLang);
    } catch {}
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', newLang);
    setSearchParams(newParams, { replace: true });
    fetchMenu(newLang);
  };

  // Accesibilidad: Cerrar modales con tecla Escape (WCAG 2.2 escape-routes)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isAIAssistantOpen) setIsAIAssistantOpen(false);
        else if (active3DDish) setActive3DDish(null);
        else if (selectedDishDetail) setSelectedDishDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active3DDish, selectedDishDetail, isAIAssistantOpen]);

  useEffect(() => {
    setLogoLoadError(false);
  }, [menuData?.restaurant?.logoUrl]);

  useEffect(() => {
    setBannerLoadError(false);
  }, [menuData?.restaurant?.bannerUrl]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAskingAI]);

  // Cargar menú público
  const fetchMenu = async (language) => {
    const langToUse = language || currentLang || 'es';
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/v1/menu/${slug}?lang=${langToUse}&_t=${Date.now()}`);
      const data = res.data.data;
      setMenuData(data);
      
      // Sincronizar estilo visual gastronómico configurado por el restaurante o vía URL
      const urlStyle = searchParams.get('style');
      const configuredStyle = data?.restaurant?.theme?.dinerStyle;

      if (urlStyle && DINER_STYLES[urlStyle]) {
        setCurrentStyleId(urlStyle);
      } else if (configuredStyle && DINER_STYLES[configuredStyle]) {
        setCurrentStyleId(configuredStyle);
      }

      // Aplicar modo de vista configurado por el restaurante si está definido
      if (data?.restaurant?.settings?.defaultViewMode) {
        setViewMode(data.restaurant.settings.defaultViewMode);
      }

      // Activar Splash Screen de bienvenida en la primera carga si el restaurante la tiene habilitada
      if (!splashShownRef.current && data?.restaurant?.settings?.introSplash?.enabled) {
        splashShownRef.current = true;
        setShowIntroSplash(true);
        const duration = Math.max(900, Math.min(3500, Number(data.restaurant.settings.introSplash.durationMs) || 1400));
        setTimeout(() => setSplashFadingOut(true), duration - 350);
        setTimeout(() => {
          setShowIntroSplash(false);
          setSplashFadingOut(false);
        }, duration);
      }

      // Inicializar bienvenida del Asistente Gastronómico en el idioma seleccionado
      const curT = UI_TRANSLATIONS[langToUse] || UI_TRANSLATIONS.es;
      const assistantName = data?.restaurant?.settings?.aiAssistant?.customName || curT.aiAssistantDefaultName;
      setAiMessages([
        {
          role: 'assistant',
          text: curT.aiWelcome(data?.restaurant?.name, assistantName)
        }
      ]);
    } catch (err) {
      const curT = UI_TRANSLATIONS[langToUse] || UI_TRANSLATIONS.es;
      setError(err.response?.data?.message || curT.menuUnavailable);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchMenu(currentLang);
    }
  }, [slug, currentLang]);

  // Consulta al Asistente IA
  const handleSendAIMessage = async (textToSend) => {
    const query = (textToSend || aiInput).trim();
    if (!query || isAskingAI) return;

    // Extraer los últimos mensajes para contexto sin redundancia
    const recentHistory = aiMessages
      .filter((_, idx) => idx > 0)
      .slice(-4)
      .map((m) => ({ role: m.role, text: m.text }));

    setAiInput('');
    setAiMessages((prev) => [...prev, { role: 'user', text: query }]);
    setIsAskingAI(true);

    try {
      const res = await axios.post(`/api/v1/menu/${slug}/ask-ai`, {
        question: query,
        history: recentHistory,
        lang: currentLang
      });
      if (res.data?.success && res.data?.data?.answer) {
        setAiMessages((prev) => [...prev, { role: 'assistant', text: res.data.data.answer }]);
      } else {
        setAiMessages((prev) => [
          ...prev,
          { role: 'assistant', text: t.aiErrorDefault }
        ]);
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: err.response?.data?.message || t.aiErrorFallback
        }
      ]);
    } finally {
      setIsAskingAI(false);
    }
  };

  // Algoritmo de jerarquía gastronómica solicitado:
  // 1º Platillos 3D / WebAR arriba de todo
  // 2º Pedidos Estrella / Más Comprados-Pedidos (isFeatured) inmediatamente después de los 3D
  // 3º Resto de platillos (respetando orden de catálogo o alfabético)
  const sortDishesByHierarchy = (list) => {
    return [...list].sort((a, b) => {
      // 1. Platillos 3D primero
      if (a.is3D && !b.is3D) return -1;
      if (!a.is3D && b.is3D) return 1;

      // 2. Pedidos Estrella inmediatamente después de los 3D
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 3. Orden predeterminado del restaurante o alfabético
      if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
        return a.order - b.order;
      }
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  // Filtrado reactivo en memoria (en milisegundos) con ordenamiento jerárquico estricto
  const filteredDishes = useMemo(() => {
    if (!menuData || !menuData.dishes) return [];

    const list = menuData.dishes.filter((dish) => {
      // Filtro de turnos y franjas horarias (Fase 4: Multi-Cartas)
      if (menuData?.restaurant?.settings?.mealSchedules?.enabled && selectedScheduleId !== 'all') {
        if (!isDishInSchedule(dish, selectedScheduleId)) {
          return false;
        }
      }

      // Filtro 3D
      if (only3DFilter && !dish.is3D) return false;

      // Filtro Pedidos Estrella
      if (onlyFeaturedFilter && !dish.isFeatured) return false;

      // Filtro de categoría
      if (selectedCategory !== 'all' && String(dish.categoryId) !== String(selectedCategory)) {
        return false;
      }

      // Filtro de Dieta y Alérgenos (Página 4 del PDF)
      if (dietFilter === 'vegan') {
        const isV = dish.isVegan || (Array.isArray(dish.allergens) && dish.allergens.includes('vegan'));
        if (!isV) return false;
      }
      if (dietFilter === 'gluten_free') {
        const isGF = dish.isGlutenFree || (Array.isArray(dish.allergens) && !dish.allergens.includes('gluten'));
        if (!isGF) return false;
      }
      if (dietFilter === 'spicy') {
        const isSpicy = (dish.spicyLevel && dish.spicyLevel > 0) || (Array.isArray(dish.allergens) && dish.allergens.includes('spicy'));
        if (!isSpicy) return false;
      }

      // Filtro de búsqueda predictiva por nombre, descripción e ingredientes
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = (dish.name || '').toLowerCase().includes(query);
        const matchDesc = (dish.description || '').toLowerCase().includes(query);
        const matchIngr = Array.isArray(dish.ingredients)
          ? dish.ingredients.some(i => (i || '').toLowerCase().includes(query))
          : String(dish.ingredients || '').toLowerCase().includes(query);
        return matchName || matchDesc || matchIngr;
      }

      return true;
    });

    return sortDishesByHierarchy(list);
  }, [menuData, searchQuery, selectedCategory, selectedScheduleId, only3DFilter, onlyFeaturedFilter, dietFilter]);

  // Lista de platillos estrella para contador y filtros
  const featuredDishesList = useMemo(() => {
    if (!menuData?.dishes) return [];
    return sortDishesByHierarchy(menuData.dishes.filter((d) => d.isFeatured));
  }, [menuData]);

  // Categorías filtradas por franja horaria / multi-cartas (Fase 4 - Hook ubicado antes de early returns para evitar error #310)
  const activeCategories = useMemo(() => {
    const cats = menuData?.categories;
    if (!cats) return [];
    if (!menuData?.restaurant?.settings?.mealSchedules?.enabled || selectedScheduleId === 'all') {
      return cats;
    }
    return cats.filter((cat) => isCategoryInSchedule(cat, selectedScheduleId));
  }, [menuData?.categories, menuData?.restaurant?.settings?.mealSchedules, selectedScheduleId]);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-slate-400 font-medium tracking-wide">
          {t.loadingText}
        </p>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">{t.menuUnavailable}</h1>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          {error && error !== t.menuUnavailable
            ? error
            : 'No pudimos conectar con la carta de este restaurante. Verifica que el enlace sea correcto o intenta de nuevo en unos momentos.'}
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
        >
          {t.backToHome}
        </Link>
      </div>
    );
  }

  const { restaurant, categories } = menuData;
  const theme = restaurant.theme || {};
  const primaryColor = theme.primaryColor || '#D97706';
  const secondaryColor = theme.secondaryColor || '#0F172A';
  const accentColor = theme.accentColor || '#F59E0B';
  const isColorTooLight = (c) => {
    if (!c || typeof c !== 'string') return false;
    const hex = c.replace('#', '');
    if (hex.length < 6) return false;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 165;
  };
  const surfaceColor = isColorTooLight(theme.surfaceColor) ? '#020617' : (theme.surfaceColor || '#020617');
  const archetype = theme.archetype || 'modern_gourmet';
  const heroStyle = theme.heroStyle || (archetype === 'editorial_michelin' ? 'editorial_minimal' : 'banner_standard');
  const announcement = restaurant.settings?.announcementBanner || {};
  const introSplash = restaurant.settings?.introSplash || {};
  const storytelling = restaurant.settings?.storytelling || {};
  const chefQuote = storytelling.chefQuote || {};

  const fontClass = getFontClass(theme.fontFamily || (archetype === 'editorial_michelin' ? 'playfair' : 'sans'));
  const textureClass = getTextureClass(theme.texture);
  const cardRadiusClass = getCardRadiusClass(theme.cardRadius || (archetype === 'editorial_michelin' ? 'sharp' : 'rounded'));

  // Platillo insignia para el hero 3D o spotlight
  const signatureDish = menuData.dishes.find((d) => String(d.id) === String(storytelling.signatureDishId)) ||
    menuData.dishes.find((d) => d.is3D) ||
    menuData.dishes[0];

  // Resolver qué formato visual debe usar una categoría específica
  const getCategoryLayout = (cat) => {
    if (userForcedViewMode) return userForcedViewMode;
    const rawLayout = cat?.layoutType || 'inherited';
    if (rawLayout !== 'inherited') return rawLayout;
    if (viewMode === 'feed') return 'feed';
    if (archetype === 'editorial_michelin' && !restaurant.settings?.defaultViewMode) return 'editorial';
    return viewMode === 'compact' ? 'compact_list' : 'grid';
  };

  // Agrupación de platillos por categoría respetando fielmente la jerarquía del restaurante
  const categoryGroups = (() => {
    if (!activeCategories) return [];
    const groups = activeCategories
      .map((cat) => ({
        category: cat,
        dishes: sortDishesByHierarchy(filteredDishes.filter((d) => String(d.categoryId) === String(cat.id || cat._id)))
      }))
      .filter((group) => group.dishes.length > 0);

    // Platillos sin categoría asignada (fallback seguro)
    const uncategorizedDishes = filteredDishes.filter(
      (d) => !categories.some((c) => String(c.id || c._id) === String(d.categoryId))
    );
    if (uncategorizedDishes.length > 0) {
      groups.push({
        category: { id: 'general', name: t.specialty, layoutType: 'inherited', showThumbnails: true },
        dishes: sortDishesByHierarchy(uncategorizedDishes)
      });
    }

    // Ordenamiento canónico: Respeta con 100% de fidelidad el orden definido en la administración (cat.order)
    return groups.sort((a, b) => (a.category.order ?? 0) - (b.category.order ?? 0));
  })();

  const renderChefQuoteBlock = (keySuffix = 'main') => {
    if (!chefQuote.enabled || !chefQuote.quote) return null;
    return (
      <div
        key={`chef-quote-${keySuffix}`}
        className={`my-5 p-5 sm:p-6 border relative overflow-hidden shadow-xl ${cardRadiusClass}`}
        style={{
          background: `linear-gradient(135deg, ${secondaryColor}ee 0%, ${surfaceColor}f5 100%)`,
          borderColor: `${primaryColor}45`
        }}
      >
        <div
          className="absolute -top-6 -right-4 text-7xl font-serif opacity-15 select-none pointer-events-none"
          style={{ color: primaryColor }}
        >
          “
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {chefQuote.photoUrl && (
            <img
              src={getMediaUrl(chefQuote.photoUrl)}
              alt={chefQuote.chefName || 'Chef'}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 shrink-0 shadow-lg"
              style={{ borderColor: primaryColor }}
            />
          )}
          <div className="space-y-1.5">
            <span
              className="inline-block text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: accentColor }}
            >
              Filosofía & Autor
            </span>
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-light">
              “{chefQuote.quote}”
            </p>
            {chefQuote.chefName && (
              <p className="text-xs font-bold tracking-wide pt-0.5" style={{ color: primaryColor }}>
                — {chefQuote.chefName}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDishesForLayout = (dishesList, cat) => {
    const layout = getCategoryLayout(cat);
    const showThumb = cat ? cat.showThumbnails !== false : true;
    const catName = cat?.name || t.specialty;

    if (layout === 'hero_carousel') {
      return (
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 pt-0.5">
          {dishesList.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDishDetail(dish)}
              style={{
                backgroundColor: currentStyle.colors.cardBg,
                borderColor: currentStyle.colors.cardBorder,
                color: currentStyle.colors.textBody,
                boxShadow: currentStyle.id === 'street_food'
                  ? `4px 4px 0px ${currentStyle.colors.accent || '#EA580C'}`
                  : undefined
              }}
              className={`snap-start shrink-0 w-[260px] sm:w-[290px] group cursor-pointer border ${currentStyle.cardStyle || cardRadiusClass} p-3 transition-all flex flex-col justify-between shadow-xl ${
                dish.isAvailable === false ? 'opacity-75' : ''
              }`}
            >
              <div
                className="relative w-full h-44 rounded-xl overflow-hidden mb-2.5 border shadow-sm transition-colors"
                style={{
                  backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC',
                  borderColor: currentStyle.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
                }}
              >
                {dish.imageUrl ? (
                  <img
                    src={getMediaUrl(dish.imageUrl)}
                    alt={dish.name}
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC'
                    }}
                  >
                    <DishCategoryIcon
                      categoryName={catName}
                      dishName={dish.name}
                      className={`w-12 h-12 ${currentStyle.isDark ? 'text-amber-400/90' : 'text-slate-400'}`}
                    />
                  </div>
                )}
                {dish.isAvailable === false ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[10px] font-black uppercase shadow">
                    {t.soldOut}
                  </span>
                ) : dish.is3D ? (
                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/25 text-[10px] font-black text-white flex items-center gap-1 shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>3D AR</span>
                  </span>
                ) : null}
                {dish.isFeatured && (
                  <span className={`absolute top-2 right-2 ${currentStyle.badgeStyle || 'px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black'} flex items-center gap-1 shadow-lg`}>
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{dish.badge || t.featuredBadge}</span>
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      style={{
                        fontFamily: currentStyle.fonts.heading,
                        color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice
                      }}
                      className="text-sm font-black leading-snug line-clamp-1"
                    >
                      {dish.name}
                    </h3>
                    <span style={{ color: currentStyle.colors.titlePrice || currentStyle.colors.accent }} className="text-sm font-black shrink-0 tabular-nums">
                      ${dish.price}
                    </span>
                  </div>
                  {dish.description && (
                    <p style={{ color: currentStyle.colors.textSecondary }} className="text-xs line-clamp-2 mt-1 font-light leading-relaxed">
                      {dish.description}
                    </p>
                  )}
                </div>

                <div
                  className="mt-3 pt-2 border-t flex items-center justify-between gap-2"
                  style={{ borderColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.2)' }}
                >
                  <span className="text-[11px] font-medium opacity-70" style={{ color: currentStyle.colors.textSecondary }}>{dish.currency || 'MXN'}</span>
                  {dish.is3D ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive3DDish(dish);
                      }}
                      style={{
                        backgroundColor: currentStyle.colors.accent,
                        color: currentStyle.colors.accentText,
                        borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                        borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
                        boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.view3D}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold flex items-center gap-0.5" style={{ color: currentStyle.colors.accent }}>
                      <span>{t.info}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'editorial') {
      return (
        <div className="space-y-4">
          {dishesList.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDishDetail(dish)}
              className={`group cursor-pointer p-4 sm:p-5 border transition-all ${currentStyle.cardStyle || cardRadiusClass} ${
                dish.isAvailable === false ? 'opacity-70' : ''
              }`}
              style={{
                backgroundColor: currentStyle.colors.cardBg,
                borderColor: currentStyle.colors.cardBorder,
                color: currentStyle.colors.textBody,
                boxShadow: currentStyle.id === 'street_food'
                  ? `4px 4px 0px ${currentStyle.colors.accent || '#EA580C'}`
                  : undefined
              }}
            >
              {showThumb && (
                <div
                  className="relative w-full h-48 sm:h-56 overflow-hidden rounded-xl mb-3.5 border transition-colors"
                  style={{
                    backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC',
                    borderColor: currentStyle.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
                  }}
                >
                  {dish.imageUrl ? (
                    <img
                      src={getMediaUrl(dish.imageUrl)}
                      alt={dish.name}
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center transition-colors"
                      style={{
                        backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC'
                      }}
                    >
                      <DishCategoryIcon
                        categoryName={catName}
                        dishName={dish.name}
                        className={`w-14 h-14 mb-2 ${currentStyle.isDark ? 'text-amber-400/90' : 'text-slate-400'}`}
                      />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${currentStyle.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Corte de Autor • Formato Panorámico
                      </span>
                    </div>
                  )}
                  {dish.is3D && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive3DDish(dish);
                      }}
                      style={{
                        backgroundColor: currentStyle.colors.accent,
                        color: currentStyle.colors.accentText,
                        borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                        borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
                        boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                      }}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xl hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.view3D1to1}</span>
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-baseline justify-between gap-3 border-b border-dotted pb-1.5" style={{ borderColor: currentStyle.colors.cardBorder }}>
                <div className="flex items-center gap-2">
                  <h3
                    style={{
                      fontFamily: currentStyle.fonts.heading,
                      color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice
                    }}
                    className="text-base font-bold tracking-wide transition-colors"
                  >
                    {dish.name}
                  </h3>
                  {dish.isFeatured && (
                    <span className={currentStyle.badgeStyle || 'px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shrink-0 shadow-sm'}>
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{dish.badge || t.featuredBadge}</span>
                    </span>
                  )}
                </div>
                <span style={{ color: currentStyle.colors.titlePrice || currentStyle.colors.accent }} className="text-base font-black shrink-0 tabular-nums">
                  ${dish.price} <span className="text-xs font-normal opacity-70">{dish.currency}</span>
                </span>
              </div>
              {dish.description && (
                <p style={{ color: currentStyle.colors.textSecondary }} className="text-xs sm:text-sm mt-2 font-light italic leading-relaxed">
                  {dish.description}
                </p>
              )}
              {dish.allergens && dish.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {dish.allergens.map((alg) => (
                    <AllergenBadge key={alg} type={alg} size="sm" lang={currentLang} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'compact_list' || layout === 'compact') {
      return (
        <div className="space-y-2.5">
          {dishesList.map((dish) => {
            // Si la categoría tiene desactivadas las miniaturas (ej. Vinos, Bebidas, Cafés), renderizar fila tipográfica limpia sin cajas grises
            if (!showThumb) {
              return (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDishDetail(dish)}
                  style={{
                    backgroundColor: currentStyle.colors.cardBg,
                    borderColor: currentStyle.colors.cardBorder,
                    color: currentStyle.colors.textBody,
                    boxShadow: currentStyle.id === 'street_food'
                      ? `3px 3px 0px ${currentStyle.colors.accent || '#EA580C'}`
                      : undefined
                  }}
                  className={`group cursor-pointer border hover:shadow-md ${currentStyle.cardStyle || cardRadiusClass} px-3.5 py-2.5 transition-all flex items-center justify-between gap-3 ${
                    dish.isAvailable === false ? 'opacity-65' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: currentStyle.colors.accent }}
                      />
                      <h3
                        style={{
                          fontFamily: currentStyle.fonts.heading,
                          color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice
                        }}
                        className="text-sm font-bold truncate transition-colors"
                      >
                        {dish.name}
                      </h3>
                      {dish.isFeatured && (
                        <span className={`px-1.5 py-0.5 rounded ${currentStyle.badgeStyle || 'bg-amber-500 text-slate-950'} text-[10px] font-black flex items-center gap-0.5 shrink-0 shadow-sm`}>
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{t.featuredBadge}</span>
                        </span>
                      )}
                      <div
                        className="flex-1 border-b border-dotted mx-1 hidden sm:block opacity-40"
                        style={{ borderColor: currentStyle.colors.cardBorder }}
                      />
                    </div>
                    {dish.description && (
                      <p
                        style={{ color: currentStyle.colors.textSecondary }}
                        className="text-xs line-clamp-1 mt-0.5 pl-3.5 font-light"
                      >
                        {dish.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {dish.is3D && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive3DDish(dish);
                        }}
                        style={{
                          backgroundColor: `${currentStyle.colors.accent}1A`,
                          borderColor: `${currentStyle.colors.accent}4D`,
                          color: currentStyle.colors.accent
                        }}
                        className="px-2 py-0.5 rounded-lg border text-[11px] font-black flex items-center gap-1"
                      >
                        <Box className="w-3 h-3" />
                        <span>3D</span>
                      </button>
                    )}
                    <span style={{ color: currentStyle.colors.titlePrice || currentStyle.colors.accent }} className="text-sm font-extrabold tabular-nums">
                      ${dish.price} <span className="text-[11px] font-semibold" style={{ color: currentStyle.colors.textSecondary }}>{dish.currency}</span>
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={dish.id}
                onClick={() => setSelectedDishDetail(dish)}
                style={{
                  backgroundColor: currentStyle.colors.cardBg,
                  borderColor: currentStyle.colors.cardBorder,
                  color: currentStyle.colors.textBody,
                  boxShadow: currentStyle.id === 'street_food'
                    ? `3px 3px 0px ${currentStyle.colors.accent || '#EA580C'}`
                    : undefined
                }}
                className={`group cursor-pointer active:scale-[0.99] border transition-all duration-150 flex items-stretch gap-3.5 p-3 ${currentStyle.cardStyle || 'rounded-2xl shadow-md'} ${
                  dish.isAvailable === false ? 'opacity-75' : ''
                }`}
              >
                {/* 1. Foto miniatura 100% Despejada (Aspect-square 96px) */}
                <div
                  className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border transition-colors"
                  style={{
                    backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC',
                    borderColor: currentStyle.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
                  }}
                >
                  {dish.imageUrl ? (
                    <img
                      src={getMediaUrl(dish.imageUrl)}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center select-none group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC'
                      }}
                    >
                      <DishCategoryIcon
                        categoryName={catName}
                        dishName={dish.name}
                        className={`w-8 h-8 ${currentStyle.isDark ? 'text-amber-400/90' : 'text-slate-400'}`}
                      />
                    </div>
                  )}

                  {/* Micro-glifo translúcido 3D en la esquina superior izquierda de la foto */}
                  {dish.isAvailable === false ? (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center p-1">
                      <span className="px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[9px] font-black uppercase text-center">
                        {t.soldOut}
                      </span>
                    </div>
                  ) : dish.is3D ? (
                    <span
                      style={{
                        backgroundColor: 'rgba(2, 6, 23, 0.75)',
                        borderColor: `${currentStyle.colors.accent}90`,
                        color: currentStyle.colors.accent
                      }}
                      className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md border backdrop-blur-md text-[10px] font-black flex items-center gap-1 shadow-md"
                    >
                      <Box className="w-3 h-3" />
                      <span>3D</span>
                    </span>
                  ) : dish.videoUrl ? (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-blue-300 text-[10px] font-bold flex items-center gap-0.5 shadow">
                      <Video className="w-2.5 h-2.5" />
                      <span>{t.video}</span>
                    </span>
                  ) : null}
                </div>

                {/* 2. Columna de Información con Jerarquía de Innovación */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Fila Superior: Micro-Etiqueta de Especialidad + Precio destacado */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      {dish.isFeatured ? (
                        <span
                          className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                            currentStyle.id === 'street_food'
                              ? 'bg-[#EAB308] text-[#020617] border-[#020617]'
                              : currentStyle.id === 'trattoria_artesanal'
                                ? 'bg-[#7C2D12] text-white border-[#7C2D12]'
                                : currentStyle.id === 'bistro_botanico'
                                  ? 'bg-[#0C281E] text-[#FDFBF7] border-[#0C281E]'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          }`}
                        >
                          {dish.badge || t.featuredBadge}
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-bold tracking-wider uppercase opacity-60"
                          style={{ color: currentStyle.colors.textSecondary }}
                        >
                          {catName}
                        </span>
                      )}

                      {/* Precio con puntaje tipográfico fuerte */}
                      <span
                        style={{ color: currentStyle.colors.titlePrice || currentStyle.colors.accent }}
                        className="text-sm sm:text-base font-black shrink-0 tabular-nums ml-auto"
                      >
                        ${dish.price} <span className="text-[10px] font-bold opacity-75">{dish.currency || 'MXN'}</span>
                      </span>
                    </div>

                    {/* Título de Platillo sin asfixia */}
                    <h3
                      style={{
                        fontFamily: currentStyle.fonts.heading,
                        color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice
                      }}
                      className="text-sm sm:text-base font-bold leading-snug line-clamp-2 transition-colors"
                    >
                      {dish.name}
                    </h3>

                    {/* Descripción con peso tipográfico equilibrado */}
                    {dish.description && (
                      <p
                        style={{ color: currentStyle.colors.textSecondary }}
                        className="text-xs line-clamp-2 mt-1 font-light leading-relaxed"
                      >
                        {dish.description}
                      </p>
                    )}
                  </div>

                  {/* Fila Inferior: Micro-chips de Alérgenos + Botón 3D Protagonista */}
                  <div
                    className="flex items-center justify-between pt-1.5 mt-2 border-t"
                    style={{ borderColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.2)' }}
                  >
                    <div className="flex flex-wrap items-center gap-1 min-w-0 pr-1">
                      {dish.isAvailable === false ? (
                        <span className="text-xs text-rose-500 font-bold">{t.notAvailableToday}</span>
                      ) : dish.allergens && dish.allergens.length > 0 ? (
                        dish.allergens.slice(0, 3).map((alg) => (
                          <AllergenBadge key={alg} type={alg} size="sm" lang={currentLang} />
                        ))
                      ) : (
                        <span
                          className="text-[11px] font-medium opacity-60 truncate"
                          style={{ color: currentStyle.colors.textSecondary }}
                        >
                          {t.tapForDetails}
                        </span>
                      )}
                    </div>

                    {/* Botón de Interacción 3D WebAR o Flecha de Navegación */}
                    {dish.is3D ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive3DDish(dish);
                        }}
                        style={{
                          backgroundColor: currentStyle.colors.accent,
                          color: currentStyle.colors.accentText,
                          borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                          borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
                          boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                        }}
                        className="px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-sm hover:brightness-105"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.view3D}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-0.5 text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: currentStyle.colors.textSecondary }}>
                        <span className="text-[10px] hidden xs:inline">{t.info}</span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Default: MODO CUADRÍCULA VISUAL DE 2 COLUMNAS ('grid')
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {dishesList.map((dish) => (
          <div
            key={dish.id}
            onClick={() => setSelectedDishDetail(dish)}
            style={{
              backgroundColor: currentStyle.colors.cardBg,
              borderColor: currentStyle.colors.cardBorder,
              color: currentStyle.colors.textBody,
              boxShadow: currentStyle.id === 'street_food'
                ? `4px 4px 0px ${currentStyle.colors.accent || '#EA580C'}`
                : undefined
            }}
            className={`group cursor-pointer active:scale-[0.98] transition-all duration-150 flex flex-col justify-between p-2.5 sm:p-3 ${currentStyle.cardStyle || 'rounded-2xl border shadow-md'} ${
              dish.isAvailable === false ? 'opacity-75' : ''
            }`}
          >
            {/* Contenedor de Fotografía Limpia y Cuadrada con micro-indicador AR no invasivo */}
            {showThumb && (
              <div
                className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 border shadow-sm transition-colors"
                style={{
                  backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC',
                  borderColor: currentStyle.isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'
                }}
              >
                {dish.imageUrl ? (
                  <img
                    src={getMediaUrl(dish.imageUrl)}
                    alt={dish.name}
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center select-none group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: currentStyle.isDark ? '#020617' : '#F8FAFC'
                    }}
                  >
                    <DishCategoryIcon
                      categoryName={catName}
                      dishName={dish.name}
                      className={`w-10 h-10 ${currentStyle.isDark ? 'text-amber-400/90' : 'text-slate-400'}`}
                    />
                  </div>
                )}

                {/* Micro-píldora translúcida 3D WebAR en esquina superior izquierda (no tapa el platillo) */}
                {dish.isAvailable === false ? (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/60 text-rose-200 text-[9px] font-black uppercase shadow">
                    {t.soldOut}
                  </span>
                ) : dish.is3D ? (
                  <span
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/25 text-[10px] font-black text-white flex items-center gap-1 shadow-md"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                    <span>3D</span>
                  </span>
                ) : dish.videoUrl ? (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-blue-950/80 backdrop-blur-md border border-blue-400/50 text-blue-200 text-[9px] font-bold flex items-center gap-1 shadow">
                    <Video className="w-2.5 h-2.5 text-blue-300" />
                    <span>{t.video}</span>
                  </span>
                ) : null}

                {/* Micro-estrella en esquina superior derecha si es destacado */}
                {dish.isFeatured && (
                  <span
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center shadow-md"
                    title={dish.badge || t.featuredBadge}
                  >
                    <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                  </span>
                )}
              </div>
            )}

            {/* Bloque Informativo sin recortes agresivos */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Micro-etiqueta de Especialidad / Destacado si aplica */}
                {dish.isFeatured && (
                  <div className="mb-1">
                    <span
                      className={`inline-block ${currentStyle.badgeStyle || 'px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-slate-950'}`}
                    >
                      {dish.badge || t.featuredBadge}
                    </span>
                  </div>
                )}

                {/* Título del Platillo con tipografía temática */}
                <h3
                  style={{
                    fontFamily: currentStyle.fonts.heading,
                    color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice
                  }}
                  className="text-xs sm:text-sm font-extrabold line-clamp-2 leading-snug tracking-tight"
                >
                  {dish.name}
                </h3>

                {/* Descripción apetitosa */}
                {dish.description && (
                  <p
                    style={{ color: currentStyle.colors.textSecondary }}
                    className="text-[11px] sm:text-xs line-clamp-1 mt-0.5 font-light leading-relaxed"
                  >
                    {dish.description}
                  </p>
                )}

                {/* Micro-chips de alérgenos (hasta 2 visibles para no saturar la tarjeta de 2 columnas) */}
                {dish.allergens && dish.allergens.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {dish.allergens.slice(0, 2).map((alg) => (
                      <AllergenBadge key={alg} type={alg} size="sm" lang={currentLang} />
                    ))}
                    {dish.allergens.length > 2 && (
                      <span
                        className="text-[9px] font-bold opacity-60"
                        style={{ color: currentStyle.colors.textSecondary }}
                      >
                        +{dish.allergens.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Fila Inferior: Precio + Botón de Experiencia 3D Innovador */}
              <div
                className="flex items-center justify-between mt-2.5 pt-2 border-t"
                style={{ borderColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.2)' }}
              >
                <div>
                  <span
                    style={{ color: currentStyle.colors.titlePrice || currentStyle.colors.accent }}
                    className="text-xs sm:text-sm font-black tabular-nums tracking-tight"
                  >
                    ${dish.price}
                  </span>
                  <span className="text-[10px] font-semibold opacity-70 ml-0.5" style={{ color: currentStyle.colors.textSecondary }}>
                    {dish.currency || 'MXN'}
                  </span>
                </div>

                {dish.is3D ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive3DDish(dish);
                    }}
                    style={{
                      backgroundColor: currentStyle.colors.accent,
                      color: currentStyle.colors.accentText,
                      borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                      borderWidth: currentStyle.id === 'street_food' ? '1.5px' : '0px',
                      boxShadow: currentStyle.id === 'street_food' ? '1.5px 1.5px 0px #020617' : undefined
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-sm active:scale-95 hover:brightness-105 shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{t.view3D}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-0.5 text-[10px] font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: currentStyle.colors.textSecondary }}>
                    <span>{t.info}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen pb-32 transition-colors duration-300 ${fontClass} ${textureClass}`}
      style={{
        backgroundColor: currentStyle.colors.bgCanvas,
        color: currentStyle.colors.textBody || (currentStyle.isDark ? '#F1F5F9' : '#020617'),
        fontFamily: currentStyle.fonts.body || 'inherit'
      }}
    >
      {/* 0. SPLASH SCREEN DE BIENVENIDA DE MARCA (1.2s - Server-Driven UI) */}
      {showIntroSplash && (
        <div
          onClick={() => setShowIntroSplash(false)}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 cursor-pointer ${
            splashFadingOut ? 'opacity-0' : 'opacity-100'
          } ${fontClass} ${textureClass}`}
          style={{
            backgroundColor: surfaceColor,
            backgroundImage: `radial-gradient(circle at 50% 35%, ${primaryColor}35 0%, ${surfaceColor} 75%)`
          }}
        >
          <div className="relative mb-5">
            <div
              className="absolute -inset-4 rounded-full blur-2xl opacity-40 animate-pulse"
              style={{ backgroundColor: primaryColor }}
            />
            {restaurant.logoUrl && !logoLoadError ? (
              <img
                src={getMediaUrl(restaurant.logoUrl)}
                alt={restaurant.name}
                className="relative w-24 h-24 rounded-3xl object-contain bg-slate-900/90 border-2 p-2 shadow-2xl"
                style={{ borderColor: `${primaryColor}80` }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: `${primaryColor}20`,
                  borderColor: `${primaryColor}80`,
                  color: accentColor
                }}
                className="relative w-24 h-24 rounded-3xl border-2 flex items-center justify-center font-black text-4xl shadow-2xl bg-slate-900"
              >
                {(restaurant.name || 'V').trim().charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <span
            className="text-[10px] font-black uppercase tracking-[0.3em] mb-1.5"
            style={{ color: accentColor }}
          >
            {mesaParam ? `Mesa ${mesaParam} • ${zonaParam}` : 'Experiencia Gastronómica'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight max-w-md">
            {restaurant.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mt-2 font-light italic">
            {introSplash.tagline || restaurant.description || 'Bienvenido a nuestra carta interactiva'}
          </p>
          <div className="mt-6 w-28 h-0.5 rounded-full overflow-hidden bg-slate-800">
            <div
              className="h-full animate-pulse"
              style={{ backgroundColor: primaryColor, width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* 1. Header Adaptativo según Estilo Activo (Server-Driven UI & Theme Master) */}
      {heroStyle === 'editorial_minimal' ? (
        <div
          className="relative w-full pt-14 pb-6 px-4 border-b transition-colors"
          style={{
            backgroundColor: currentStyle.colors.headerBg,
            borderColor: currentStyle.colors.cardBorder,
            backgroundImage: `radial-gradient(circle at 50% 0%, ${currentStyle.colors.accent}18 0%, transparent 70%)`
          }}
        >
          <div className="absolute top-3 left-3 z-10">
            <Link
              to="/"
              style={{
                backgroundColor: currentStyle.id === 'trattoria_artesanal'
                  ? 'rgba(255, 255, 255, 0.95)'
                  : currentStyle.id === 'street_food'
                    ? '#FFFFFF'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'rgba(12, 40, 30, 0.92)'
                      : 'rgba(15, 23, 42, 0.85)',
                borderColor: currentStyle.id === 'trattoria_artesanal'
                  ? 'rgba(194, 65, 12, 0.4)'
                  : currentStyle.id === 'street_food'
                    ? '#020617'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'rgba(217, 119, 6, 0.4)'
                      : 'rgba(255, 255, 255, 0.2)',
                color: currentStyle.id === 'trattoria_artesanal'
                  ? '#7C2D12'
                  : currentStyle.id === 'street_food'
                    ? '#020617'
                    : currentStyle.id === 'bistro_botanico'
                      ? '#FDFBF7'
                      : '#E2E8F0'
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>{t.backToVolum}</span>
            </Link>
          </div>
          <div
            style={{
              backgroundColor: currentStyle.id === 'trattoria_artesanal'
                ? 'rgba(255, 255, 255, 0.95)'
                : currentStyle.id === 'street_food'
                  ? '#FFFFFF'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'rgba(12, 40, 30, 0.92)'
                    : 'rgba(2, 6, 23, 0.85)',
              borderColor: currentStyle.id === 'trattoria_artesanal'
                ? 'rgba(194, 65, 12, 0.4)'
                : currentStyle.id === 'street_food'
                  ? '#020617'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'rgba(217, 119, 6, 0.4)'
                    : 'rgba(255, 255, 255, 0.2)'
            }}
            className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full border text-xs shadow-md"
          >
            <button
              type="button"
              onClick={() => handleLanguageChange('es')}
              style={{
                backgroundColor: currentLang === 'es' ? currentStyle.colors.accent : 'transparent',
                color: currentLang === 'es' ? currentStyle.colors.accentText : (currentStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : currentStyle.id === 'street_food' ? '#020617' : '#94A3B8')
              }}
              className="px-2 py-0.5 rounded-full font-bold transition-all"
            >
              ES
            </button>
            <span style={{ color: currentStyle.colors.textSecondary }} className="text-[10px]">|</span>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              style={{
                backgroundColor: currentLang === 'en' ? currentStyle.colors.accent : 'transparent',
                color: currentLang === 'en' ? currentStyle.colors.accentText : (currentStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : currentStyle.id === 'street_food' ? '#020617' : '#94A3B8')
              }}
              className="px-2 py-0.5 rounded-full font-bold transition-all"
            >
              EN
            </button>
          </div>

          <div className="max-w-xl mx-auto text-center flex flex-col items-center">
            {restaurant.logoUrl && !logoLoadError && (
              <img
                src={getMediaUrl(restaurant.logoUrl)}
                alt={restaurant.name}
                onError={() => setLogoLoadError(true)}
                className="w-12 h-12 rounded-full object-contain border p-1 mb-3"
                style={{
                  borderColor: currentStyle.colors.accent,
                  backgroundColor: currentStyle.colors.cardBg
                }}
              />
            )}
            <h1
              style={{
                color: currentStyle.colors.headerText,
                fontFamily: currentStyle.fonts.heading
              }}
              className="text-2xl sm:text-3xl font-bold tracking-wide"
            >
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-3 my-2.5 w-40">
              <div className="flex-1 h-px" style={{ backgroundColor: `${currentStyle.colors.accent}50` }} />
              <Sparkles className="w-3 h-3" style={{ color: currentStyle.colors.accent }} />
              <div className="flex-1 h-px" style={{ backgroundColor: `${currentStyle.colors.accent}50` }} />
            </div>
            {restaurant.description && (
              <p
                style={{
                  color: currentStyle.colors.headerSubtitle,
                  fontFamily: currentStyle.fonts.body
                }}
                className="text-xs sm:text-sm max-w-md italic font-light leading-relaxed"
              >
                {restaurant.description}
              </p>
            )}
          </div>
        </div>
      ) : heroStyle === 'signature_3d' && signatureDish ? (
        <div
          className="relative w-full overflow-hidden border-b pt-12 pb-5 px-4 transition-colors"
          style={{
            backgroundColor: currentStyle.colors.headerBg,
            borderColor: currentStyle.colors.cardBorder
          }}
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(circle at 70% 30%, ${currentStyle.colors.accent}55 0%, ${currentStyle.colors.headerBg} 80%)`
            }}
          />
          <div className="absolute top-3 left-3 z-10">
            <Link
              to="/"
              style={{
                backgroundColor: currentStyle.id === 'trattoria_artesanal'
                  ? 'rgba(255, 255, 255, 0.95)'
                  : currentStyle.id === 'street_food'
                    ? '#FFFFFF'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'rgba(12, 40, 30, 0.92)'
                      : 'rgba(15, 23, 42, 0.85)',
                borderColor: currentStyle.id === 'trattoria_artesanal'
                  ? 'rgba(194, 65, 12, 0.4)'
                  : currentStyle.id === 'street_food'
                    ? '#020617'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'rgba(217, 119, 6, 0.4)'
                      : 'rgba(255, 255, 255, 0.2)',
                color: currentStyle.id === 'trattoria_artesanal'
                  ? '#7C2D12'
                  : currentStyle.id === 'street_food'
                    ? '#020617'
                    : currentStyle.id === 'bistro_botanico'
                      ? '#FDFBF7'
                      : '#E2E8F0'
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md"
            >
              <span>{t.backToVolum}</span>
            </Link>
          </div>
          <div
            style={{
              backgroundColor: currentStyle.id === 'trattoria_artesanal'
                ? 'rgba(255, 255, 255, 0.95)'
                : currentStyle.id === 'street_food'
                  ? '#FFFFFF'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'rgba(12, 40, 30, 0.92)'
                    : 'rgba(2, 6, 23, 0.85)',
              borderColor: currentStyle.id === 'trattoria_artesanal'
                ? 'rgba(194, 65, 12, 0.4)'
                : currentStyle.id === 'street_food'
                  ? '#020617'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'rgba(217, 119, 6, 0.4)'
                    : 'rgba(255, 255, 255, 0.2)'
            }}
            className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full border text-xs shadow-md"
          >
            <button
              type="button"
              onClick={() => handleLanguageChange('es')}
              style={{
                backgroundColor: currentLang === 'es' ? currentStyle.colors.accent : 'transparent',
                color: currentLang === 'es' ? currentStyle.colors.accentText : (currentStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : currentStyle.id === 'street_food' ? '#020617' : '#94A3B8')
              }}
              className="px-2 py-0.5 rounded-full font-bold transition-all"
            >
              ES
            </button>
            <span style={{ color: currentStyle.colors.textSecondary }} className="text-[10px]">|</span>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              style={{
                backgroundColor: currentLang === 'en' ? currentStyle.colors.accent : 'transparent',
                color: currentLang === 'en' ? currentStyle.colors.accentText : (currentStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : currentStyle.id === 'street_food' ? '#020617' : '#94A3B8')
              }}
              className="px-2 py-0.5 rounded-full font-bold transition-all"
            >
              EN
            </button>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-center sm:text-left space-y-1.5 max-w-md">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${currentStyle.badgeStyle}`}
              >
                <Box className="w-3 h-3" />
                <span>Creación Insignia de {restaurant.name}</span>
              </div>
              <h1
                style={{
                  color: currentStyle.colors.headerText,
                  fontFamily: currentStyle.fonts.heading
                }}
                className="text-xl sm:text-2xl font-black leading-tight"
              >
                {signatureDish.name}
              </h1>
              <p
                style={{
                  color: currentStyle.colors.headerSubtitle,
                  fontFamily: currentStyle.fonts.body
                }}
                className="text-xs line-clamp-2 font-light"
              >
                {signatureDish.description || restaurant.description}
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <span style={{ color: currentStyle.colors.titlePrice }} className="text-base font-black">
                  ${signatureDish.price} <span className="text-xs opacity-75">{signatureDish.currency || 'MXN'}</span>
                </span>
                {signatureDish.is3D ? (
                  <button
                    type="button"
                    onClick={() => setActive3DDish(signatureDish)}
                    style={{
                      backgroundColor: currentStyle.colors.accent,
                      color: currentStyle.colors.accentText
                    }}
                    className="px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>{t.view3D1to1}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedDishDetail(signatureDish)}
                    style={{
                      backgroundColor: currentStyle.colors.accent,
                      color: currentStyle.colors.accentText
                    }}
                    className="px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <span>{t.tapForDetails}</span>
                  </button>
                )}
              </div>
            </div>

            {signatureDish.imageUrl && (
              <div
                onClick={() => signatureDish.is3D ? setActive3DDish(signatureDish) : setSelectedDishDetail(signatureDish)}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 shrink-0 shadow-2xl cursor-pointer relative group"
                style={{ borderColor: currentStyle.colors.accent }}
              >
                <img
                  src={getMediaUrl(signatureDish.imageUrl)}
                  alt={signatureDish.name}
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Portada Estándar Panorámica Dinámica con Integración Total de Estilo */
        <div
          className="relative w-full h-52 md:h-64 overflow-hidden border-b transition-colors"
          style={{
            backgroundColor: currentStyle.colors.headerBg,
            borderColor: currentStyle.colors.cardBorder
          }}
        >
          {!bannerLoadError && (restaurant.bannerUrl || restaurant.venuePhotos?.[0]) ? (
            <img
              src={
                (restaurant.bannerUrl && getMediaUrl(restaurant.bannerUrl)) ||
                (restaurant.venuePhotos && restaurant.venuePhotos[0] && getMediaUrl(restaurant.venuePhotos[0]))
              }
              alt={restaurant.name}
              onError={() => setBannerLoadError(true)}
              className={`w-full h-full object-cover scale-105 transition-opacity ${
                currentStyle.id === 'trattoria_artesanal'
                  ? 'opacity-30'
                  : currentStyle.id === 'street_food'
                    ? 'opacity-20'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'opacity-40 brightness-75'
                      : 'brightness-70'
              }`}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: currentStyle.id === 'trattoria_artesanal'
                  ? 'radial-gradient(circle at 50% 30%, rgba(194, 65, 12, 0.08) 0%, #FDFBF7 85%)'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.25) 0%, #0C281E 85%)'
                    : currentStyle.id === 'street_food'
                      ? 'radial-gradient(circle at 50% 30%, rgba(234, 88, 12, 0.1) 0%, #FFFFFF 85%)'
                      : `radial-gradient(circle at 50% 30%, ${currentStyle.colors.accent}30 0%, #020617 85%)`
              }}
            />
          )}

          {/* Gradiente de integración según estilo */}
          <div
            className="absolute inset-0"
            style={{
              background: currentStyle.id === 'trattoria_artesanal'
                ? 'linear-gradient(to top, #FDFBF7 55%, rgba(253, 251, 247, 0.88) 85%, rgba(253, 251, 247, 0.4) 100%)'
                : currentStyle.id === 'street_food'
                  ? 'linear-gradient(to top, #FFFFFF 55%, rgba(255, 255, 255, 0.90) 85%, rgba(255, 255, 255, 0.45) 100%)'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'linear-gradient(to top, #0C281E 50%, rgba(12, 40, 30, 0.85) 85%, rgba(12, 40, 30, 0.45) 100%)'
                    : 'linear-gradient(to top, #020617 40%, rgba(2, 6, 23, 0.85) 80%, transparent 100%)'
            }}
          />
          
          {/* Enlace para volver a la página web corporativa */}
          <div className="absolute top-3 left-3 z-10">
            <Link
              to="/"
              style={{
                backgroundColor: currentStyle.id === 'trattoria_artesanal'
                  ? 'rgba(255, 255, 255, 0.95)'
                  : currentStyle.id === 'street_food'
                    ? '#FFFFFF'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'rgba(12, 40, 30, 0.92)'
                      : 'rgba(15, 23, 42, 0.85)',
                borderColor: currentStyle.id === 'trattoria_artesanal'
                  ? 'rgba(194, 65, 12, 0.4)'
                  : currentStyle.id === 'street_food'
                    ? '#020617'
                    : currentStyle.id === 'bistro_botanico'
                      ? 'rgba(217, 119, 6, 0.4)'
                      : 'rgba(255, 255, 255, 0.2)',
                color: currentStyle.id === 'trattoria_artesanal'
                  ? '#7C2D12'
                  : currentStyle.id === 'street_food'
                    ? '#020617'
                    : currentStyle.id === 'bistro_botanico'
                      ? '#FDFBF7'
                      : '#E2E8F0'
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>{t.backToVolum}</span>
            </Link>
          </div>

          {/* Selector de idioma oficial ES | EN */}
          <div
            style={{
              backgroundColor: currentStyle.id === 'trattoria_artesanal'
                ? 'rgba(255, 255, 255, 0.95)'
                : currentStyle.id === 'street_food'
                  ? '#FFFFFF'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'rgba(12, 40, 30, 0.92)'
                    : 'rgba(2, 6, 23, 0.85)',
              borderColor: currentStyle.id === 'trattoria_artesanal'
                ? 'rgba(194, 65, 12, 0.4)'
                : currentStyle.id === 'street_food'
                  ? '#020617'
                  : currentStyle.id === 'bistro_botanico'
                    ? 'rgba(217, 119, 6, 0.4)'
                    : 'rgba(255, 255, 255, 0.2)'
            }}
            className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full border text-xs shadow-md"
          >
            <button
              type="button"
              onClick={() => handleLanguageChange('es')}
              style={{
                backgroundColor: currentLang === 'es' ? currentStyle.colors.accent : 'transparent',
                color: currentLang === 'es' ? currentStyle.colors.accentText : (currentStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : currentStyle.id === 'street_food' ? '#020617' : '#94A3B8')
              }}
              className="px-2 py-0.5 rounded-full font-bold transition-all"
            >
              ES
            </button>
            <span style={{ color: currentStyle.colors.textSecondary }} className="text-[10px]">|</span>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              style={{
                backgroundColor: currentLang === 'en' ? currentStyle.colors.accent : 'transparent',
                color: currentLang === 'en' ? currentStyle.colors.accentText : (currentStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : currentStyle.id === 'street_food' ? '#020617' : '#94A3B8')
              }}
              className="px-2 py-0.5 rounded-full font-bold transition-all"
            >
              EN
            </button>
          </div>

          {/* Información centrada del restaurante con tipografía y badges del estilo */}
          <div className="absolute bottom-3 left-0 right-0 px-4 flex flex-col items-center text-center">
            {restaurant.logoUrl && !logoLoadError ? (
              <img
                src={getMediaUrl(restaurant.logoUrl)}
                alt={restaurant.name || 'Logo'}
                style={{
                  borderColor: currentStyle.colors.accent,
                  backgroundColor: currentStyle.colors.cardBg
                }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-contain border-2 shadow-xl mb-1.5 p-1"
                onError={() => setLogoLoadError(true)}
              />
            ) : (
              <div
                style={{
                  backgroundColor: `${currentStyle.colors.accent}25`,
                  borderColor: currentStyle.colors.accent,
                  color: currentStyle.colors.accent
                }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex items-center justify-center font-black text-2xl shadow-xl mb-1.5"
              >
                {(restaurant.name || 'V').trim().charAt(0).toUpperCase()}
              </div>
            )}

            <h1
              style={{
                color: currentStyle.colors.headerText,
                fontFamily: currentStyle.fonts.heading
              }}
              className="text-lg md:text-2xl font-black tracking-tight"
            >
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p
                style={{
                  color: currentStyle.colors.headerSubtitle,
                  fontFamily: currentStyle.fonts.body
                }}
                className="text-xs md:text-xs max-w-md line-clamp-1 mt-0.5 font-light"
              >
                {restaurant.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Banners de Marketing Dinámicos (Fase 5): Soporta Fijo + Programado con Cuenta Regresiva */}
      <MarketingBannersDisplay
        settings={restaurant.settings}
        primaryColor={primaryColor}
        accentColor={accentColor}
        cardRadiusClass={cardRadiusClass}
        isDark={currentStyle.isDark}
        textColor={currentStyle.colors.dishTitle || (currentStyle.isDark ? '#F8FAFC' : '#0F172A')}
      />

      {/* 2. Controles de Búsqueda, Selector de Vista y Filtros (Totalmente adaptados al estilo activo) */}
      <div
        className="sticky top-0 z-30 px-4 py-2.5 shadow-md backdrop-blur-md transition-colors border-b"
        style={{
          backgroundColor: currentStyle.isDark ? 'rgba(2, 6, 23, 0.96)' : currentStyle.id === 'street_food' ? '#FFFFFF' : 'rgba(253, 251, 247, 0.98)',
          borderBottomColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.2)'
        }}
      >
        <div className="max-w-3xl mx-auto space-y-2">
          
          {/* Buscador predictivo en vivo + Selector de Vista */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search
                className="w-4 h-4 absolute left-3 pointer-events-none"
                style={{ color: currentStyle.colors.textSecondary }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder || "Buscar en la carta"}
                style={{
                  backgroundColor: currentStyle.colors.searchBg || '#FFFFFF',
                  borderColor: currentStyle.colors.searchBorder || '#E5E7EB',
                  color: currentStyle.colors.textBody || '#020617',
                  fontFamily: currentStyle.fonts.body
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Selector de Vista (Lista Compacta vs Cuadrícula 2 Col vs Reels) */}
            <div
              className="flex rounded-xl p-0.5 shrink-0 border"
              style={{
                backgroundColor: currentStyle.colors.searchBg || '#FFFFFF',
                borderColor: currentStyle.colors.searchBorder || '#E5E7EB'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setViewMode('compact');
                  setUserForcedViewMode(userForcedViewMode === 'compact_list' ? null : 'compact_list');
                }}
                style={{
                  backgroundColor: (userForcedViewMode === 'compact_list' || (!userForcedViewMode && viewMode === 'compact'))
                    ? currentStyle.colors.accent
                    : 'transparent',
                  color: (userForcedViewMode === 'compact_list' || (!userForcedViewMode && viewMode === 'compact'))
                    ? currentStyle.colors.accentText
                    : currentStyle.colors.textSecondary
                }}
                className="p-1.5 rounded-lg transition-all flex items-center justify-center font-bold"
                title={t.compactView}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('grid');
                  setUserForcedViewMode(userForcedViewMode === 'grid' ? null : 'grid');
                }}
                style={{
                  backgroundColor: (userForcedViewMode === 'grid' || (!userForcedViewMode && viewMode === 'grid'))
                    ? currentStyle.colors.accent
                    : 'transparent',
                  color: (userForcedViewMode === 'grid' || (!userForcedViewMode && viewMode === 'grid'))
                    ? currentStyle.colors.accentText
                    : currentStyle.colors.textSecondary
                }}
                className="p-1.5 rounded-lg transition-all flex items-center justify-center font-bold"
                title={t.gridView}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('feed');
                  setUserForcedViewMode('feed');
                }}
                style={{
                  backgroundColor: viewMode === 'feed' ? currentStyle.colors.accent : 'transparent',
                  color: viewMode === 'feed' ? currentStyle.colors.accentText : currentStyle.colors.textSecondary
                }}
                className="p-1.5 rounded-lg transition-all flex items-center justify-center font-bold"
                title={t.feedView}
              >
                <Film className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de Multi-Cartas por Turnos y Horarios (Fase 4) */}
          {menuData?.restaurant?.settings?.mealSchedules?.enabled && (
            <div className="w-full">
              <MealScheduleSelector
                schedules={menuData.restaurant.settings.mealSchedules.schedules}
                activeScheduleId={selectedScheduleId}
                currentServiceScheduleId={currentServiceSchedule?.id}
                onSelectSchedule={(schedId) => setSelectedScheduleId(schedId)}
                isDark={currentStyle.isDark}
              />

              {/* Banner informativo si el comensal explora una carta fuera del turno en servicio */}
              {currentServiceSchedule &&
                selectedScheduleId !== currentServiceSchedule.id &&
                selectedScheduleId !== 'all' && (
                  <div className="mx-2 my-2 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-200">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Estás explorando la Carta de <strong>{menuData.restaurant.settings.mealSchedules.schedules?.find(s => s.id === selectedScheduleId)?.name}</strong> (Horario de servicio: {menuData.restaurant.settings.mealSchedules.schedules?.find(s => s.id === selectedScheduleId)?.startTime} a {menuData.restaurant.settings.mealSchedules.schedules?.find(s => s.id === selectedScheduleId)?.endTime}).
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedScheduleId(currentServiceSchedule.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 active:scale-95 transition-all self-start sm:self-auto shadow-md"
                    >
                      Ver turno actual ({currentServiceSchedule.name})
                    </button>
                  </div>
              )}
            </div>
          )}

          {/* Chips de Filtro Rápido: Vegano, Sin gluten, Picante */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setDietFilter('all')}
              style={{
                backgroundColor: dietFilter === 'all' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                color: dietFilter === 'all' ? currentStyle.colors.accentText : currentStyle.colors.chipInactiveText,
                borderColor: dietFilter === 'all' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
              }}
              className="px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 active:scale-95 shadow-sm"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'vegan' ? 'all' : 'vegan')}
              style={{
                backgroundColor: dietFilter === 'vegan' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                color: dietFilter === 'vegan' ? currentStyle.colors.accentText : currentStyle.colors.chipInactiveText,
                borderColor: dietFilter === 'vegan' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
              }}
              className="px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <Leaf className="w-3 h-3 text-emerald-500" />
              <span>Vegano</span>
            </button>
            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'gluten_free' ? 'all' : 'gluten_free')}
              style={{
                backgroundColor: dietFilter === 'gluten_free' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                color: dietFilter === 'gluten_free' ? currentStyle.colors.accentText : currentStyle.colors.chipInactiveText,
                borderColor: dietFilter === 'gluten_free' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
              }}
              className="px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <Wheat className="w-3 h-3 text-amber-500" />
              <span>Sin gluten</span>
            </button>
            <button
              type="button"
              onClick={() => setDietFilter(dietFilter === 'spicy' ? 'all' : 'spicy')}
              style={{
                backgroundColor: dietFilter === 'spicy' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                color: dietFilter === 'spicy' ? currentStyle.colors.accentText : currentStyle.colors.chipInactiveText,
                borderColor: dietFilter === 'spicy' ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
              }}
              className="px-2.5 py-1 rounded-full text-xs font-bold border transition-all shrink-0 active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Picante</span>
            </button>
          </div>

          {/* Categorías fijas y filtro de 3D con scroll suave adaptadas al estilo */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            
            {/* Botón especial 'Solo 3D' */}
            <button
              onClick={() => {
                setOnly3DFilter(!only3DFilter);
                if (!only3DFilter) setOnlyFeaturedFilter(false);
              }}
              style={{
                backgroundColor: only3DFilter ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                color: only3DFilter ? currentStyle.colors.accentText : (currentStyle.isDark ? currentStyle.colors.accent : currentStyle.colors.titlePrice),
                borderColor: only3DFilter ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
              }}
              className="shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: only3DFilter ? currentStyle.colors.accentText : currentStyle.colors.accent }} />
              <span>{t.dishes3D}</span>
            </button>

            {/* Botón especial 'Pedidos Estrella' ⭐ */}
            {featuredDishesList.length > 0 && (
              <button
                onClick={() => {
                  setOnlyFeaturedFilter(!onlyFeaturedFilter);
                  if (!onlyFeaturedFilter) setOnly3DFilter(false);
                }}
                style={{
                  backgroundColor: onlyFeaturedFilter ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                  color: onlyFeaturedFilter ? currentStyle.colors.accentText : (currentStyle.isDark ? currentStyle.colors.accent : currentStyle.colors.titlePrice),
                  borderColor: onlyFeaturedFilter ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
                }}
                className="shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border active:scale-95"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{t.featuredDishes}</span>
                <span
                  className="text-[10px] px-1 rounded font-mono font-bold"
                  style={{
                    backgroundColor: onlyFeaturedFilter ? 'rgba(0,0,0,0.15)' : `${currentStyle.colors.accent}25`,
                    color: onlyFeaturedFilter ? currentStyle.colors.accentText : currentStyle.colors.accent
                  }}
                >
                  {featuredDishesList.length}
                </span>
              </button>
            )}

            {/* Todas las categorías */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setOnly3DFilter(false);
                setOnlyFeaturedFilter(false);
              }}
              style={{
                backgroundColor: (selectedCategory === 'all' && !only3DFilter && !onlyFeaturedFilter)
                  ? currentStyle.colors.accent
                  : currentStyle.colors.chipInactiveBg,
                color: (selectedCategory === 'all' && !only3DFilter && !onlyFeaturedFilter)
                  ? currentStyle.colors.accentText
                  : currentStyle.colors.chipInactiveText,
                borderColor: (selectedCategory === 'all' && !only3DFilter && !onlyFeaturedFilter)
                  ? currentStyle.colors.accent
                  : currentStyle.colors.chipInactiveBorder
              }}
              className="shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95"
            >
              {t.all} ({menuData.dishes.length})
            </button>

            {/* Píldoras de Categorías */}
            {activeCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id && !only3DFilter && !onlyFeaturedFilter;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOnly3DFilter(false);
                    setOnlyFeaturedFilter(false);
                  }}
                  style={{
                    backgroundColor: isSelected ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBg,
                    color: isSelected ? currentStyle.colors.accentText : currentStyle.colors.chipInactiveText,
                    borderColor: isSelected ? currentStyle.colors.accent : currentStyle.colors.chipInactiveBorder
                  }}
                  className="shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95"
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Listado de Platillos (Arquitectura Modular Híbrida por Categoría + Reels) */}
      <main className="max-w-3xl mx-auto px-4 pt-4">
        {filteredDishes.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800/80 my-4">
            <Utensils className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">{t.noDishesTitle}</p>
            <p className="text-xs text-slate-500 mt-1">{t.noDishesSubtitle}</p>
          </div>
        ) : viewMode !== 'feed' ? (
          <div className="space-y-7">
            {categoryGroups.map((group, idx) => (
              <React.Fragment key={group.category.id || idx}>
                {/* 1. SECCIÓN DE CATEGORÍA NORMAL (Si idx === 0, son los Modelos 3D arriba de todo) */}
                <section className="space-y-3">
                  {/* Cabecera de Categoría estilizada según el Estilo Activo y Arquetipo */}
                  {archetype === 'editorial_michelin' ? (
                    <div className="text-center py-2">
                      <h2
                        style={{
                          color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice,
                          fontFamily: currentStyle.fonts.heading
                        }}
                        className="text-base sm:text-lg font-bold tracking-[0.18em] uppercase"
                      >
                        {group.category.name}
                      </h2>
                      <div
                        className="w-16 h-px mx-auto mt-1.5"
                        style={{ backgroundColor: currentStyle.colors.accent || primaryColor }}
                      />
                    </div>
                  ) : archetype === 'dark_lounge' ? (
                    <div
                      className="flex items-center justify-between border-l-4 pl-3 py-0.5"
                      style={{ borderColor: currentStyle.colors.accent || primaryColor }}
                    >
                      <h2
                        style={{
                          color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice,
                          fontFamily: currentStyle.fonts.heading
                        }}
                        className="text-sm sm:text-base font-black uppercase tracking-wider"
                      >
                        {group.category.name}
                      </h2>
                      <span
                        className="text-[11px] font-mono"
                        style={{ color: currentStyle.colors.textSecondary }}
                      >
                        {group.dishes.length} opciones
                      </span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-between pb-1.5 border-b"
                      style={{ borderColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.2)' }}
                    >
                      <h2
                        style={{
                          color: currentStyle.colors.dishTitle || currentStyle.colors.titlePrice,
                          fontFamily: currentStyle.fonts.heading
                        }}
                        className="text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-2"
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: currentStyle.colors.accent || primaryColor }} />
                        <span>{group.category.name}</span>
                      </h2>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: currentStyle.colors.textSecondary }}
                      >
                        {group.dishes.length}
                      </span>
                    </div>
                  )}

                  {renderDishesForLayout(group.dishes, group.category)}
                </section>

                {/* Intercalar Bloque de Storytelling / Firma del Chef después de la primera categoría */}
                {idx === 0 && renderChefQuoteBlock('after-first')}
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* MODO 3: FEED REELS VERTICAL (Estilo TikTok / Instagram) */
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-[74vh] sm:h-[80vh] overflow-y-scroll snap-y snap-mandatory rounded-3xl border border-slate-800/80 shadow-2xl no-scrollbar space-y-4">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="h-full w-full snap-start relative rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between p-4 sm:p-5 select-none border border-slate-800"
                >
                  {/* Fondo Multimedia: Video en bucle o Imagen de alta calidad */}
                  {dish.videoUrl ? (
                    <video
                      src={getMediaUrl(dish.videoUrl)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : dish.imageUrl ? (
                    <img
                      src={getMediaUrl(dish.imageUrl)}
                      alt={dish.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                      <DishCategoryIcon
                        categoryName={categories.find((c) => c.id === dish.categoryId)?.name}
                        dishName={dish.name}
                        className="w-20 h-20 text-amber-400/40"
                      />
                    </div>
                  )}

                  {/* Degradado protector para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/60 pointer-events-none" />

                  {/* Cabecera superior del Reel */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/70 text-xs font-bold text-amber-300">
                      {categories.find((c) => c.id === dish.categoryId)?.name || t.specialty}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {dish.isAvailable === false && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-lg">
                          {t.soldOutToday}
                        </span>
                      )}
                      {dish.videoUrl && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>{t.reels}</span>
                        </span>
                      )}
                      {dish.is3D && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-lg">
                          <Box className="w-3.5 h-3.5" />
                          <span>{t.view3D1to1}</span>
                        </span>
                      )}
                      {dish.isFeatured && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                          <span>{t.featuredBadge}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pie inferior con datos del platillo y acciones */}
                  <div className="relative z-10 flex items-end justify-between gap-3 pt-4">
                    <div className="flex-1 min-w-0 pr-2">
                      <h2 className="text-lg sm:text-xl font-black text-white drop-shadow-md leading-tight mb-1">
                        {dish.name}
                      </h2>
                      
                      <p className="text-xs text-slate-200 drop-shadow font-light line-clamp-2 mb-2 leading-relaxed">
                        {dish.description || t.specialtyDefault}
                      </p>

                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span style={{ color: primaryColor }} className="text-xl font-black tabular-nums drop-shadow-md">
                          ${dish.price}
                        </span>
                        <span className="text-xs font-bold text-slate-300 drop-shadow">
                          {dish.currency || 'MXN'}
                        </span>
                      </div>

                      {dish.allergens && dish.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dish.allergens.map((alg) => (
                            <AllergenBadge key={alg} type={alg} size="sm" lang={currentLang} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botones de acción flotantes a la derecha */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      {dish.is3D && (
                        <button
                          type="button"
                          onClick={() => setActive3DDish(dish)}
                          style={{
                            backgroundColor: currentStyle.colors.accent,
                            color: currentStyle.colors.accentText,
                            borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                            borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
                            boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                          }}
                          className="w-12 h-12 rounded-2xl font-black flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform"
                          title={t.view3D}
                        >
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          <span className="text-[9px] font-black uppercase mt-0.5 leading-none">{t.view3DAR}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedDishDetail(dish)}
                        className="w-12 h-12 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white font-bold flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform"
                        title={t.tapForDetails}
                      >
                        <Utensils className="w-4 h-4 text-amber-400" />
                        <span className="text-[9px] font-bold uppercase mt-0.5 leading-none">{t.info}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. Barra de Asistencia a Mesa o Modo Showcase */}
      {isShowcaseMode ? (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl py-2.5 px-4 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-white tracking-wide">
                  Menú Demo Interactivo 1:1
                </p>
                <p className="text-[10px] text-slate-400">
                  Explorá los platillos en Realidad Aumentada
                </p>
              </div>
            </div>
            {restaurant.settings?.socialLinks?.whatsapp ? (
              <a
                href={`https://wa.me/${restaurant.settings.socialLinks.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría más información o hacer una reservación.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <span>WhatsApp</span>
              </a>
            ) : (
              <span className="py-1 px-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                WebAR Activo
              </span>
            )}
          </div>
        </div>
      ) : restaurant.settings?.enableTableAssistance ? (
        <TableAssistanceBar
          slug={slug}
          initialTable={mesaParam}
          initialZone={zonaParam}
          primaryColor={primaryColor}
          lang={currentLang}
          orderSettings={restaurant.settings?.orderSettings || {}}
          cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
          cartTotal={cartItems.reduce((acc, it) => acc + (it.price * it.quantity), 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenReceipt={() => setIsReceiptModalOpen(true)}
          styleConfig={currentStyle}
        />
      ) : null}

      {/* 5. Modal WebAR 1:1 */}
      {active3DDish && (
        <ModelViewerModal
          dish={active3DDish}
          onClose={() => setActive3DDish(null)}
          themeColor={primaryColor}
          lang={currentLang}
          onAddToCart={restaurant.settings?.orderSettings?.enabled ? (dish, qty, notes) => handleAddToCart(dish, qty, notes) : null}
        />
      )}

      {/* 6. Modal / Bottom Sheet Oficial de Detalle de Platillo (PDF v3 Páginas 8-12) */}
      <DishDetailModal
        isOpen={Boolean(selectedDishDetail)}
        onClose={() => setSelectedDishDetail(null)}
        dish={selectedDishDetail}
        styleConfig={currentStyle}
        currentLang={currentLang}
        onToggleLang={(lang) => handleLanguageChange(lang)}
        isOrderMode={Boolean(restaurant.settings?.orderSettings?.enabled)}
        currency={restaurant.currency || 'MXN'}
        onAddToCart={handleAddToCart}
        onOpen3D={(dish) => setActive3DDish(dish)}
        tableNumber={mesaParam || '1'}
        tableZone={zonaParam || 'Principal'}
        onRequestWaiter={() => {
          if (slug && activeTable) {
            axios.post(`/api/v1/service/request/${slug}`, {
              table: activeTable,
              zone: zonaParam,
              type: 'waiter'
            }).catch(console.warn);
            setOrderToast('Solicitud de mesero enviada a barra.');
            setTimeout(() => setOrderToast(null), 3000);
          }
        }}
      />

      {/* 7. Botón Flotante del Asistente Gastronómico IA (FAB Circular 1:1 con Simulador) */}
      {/* 7. Botón Flotante del Asistente Gastronómico IA */}
      {restaurant.settings?.aiAssistant?.enabled !== false && (
        <button
          type="button"
          onClick={() => setIsAIAssistantOpen(true)}
          style={{
            backgroundColor: currentStyle.colors.accent || '#D97706',
            color: currentStyle.colors.accentText || '#020617',
            borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
            borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
            boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
          }}
          className="fixed bottom-14 right-4 z-40 w-11 h-11 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
          title={restaurant.settings?.aiAssistant?.customName || t.aiAssistantDefaultName}
          aria-label={restaurant.settings?.aiAssistant?.customName || t.aiAssistantDefaultName}
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* 8. Modal Drawer del Asistente Gastronómico con IA */}
      {isAIAssistantOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAIAssistantOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: currentStyle.colors.cardBg || (currentStyle.isDark ? '#0F172A' : '#FFFFFF'),
              borderColor: currentStyle.colors.cardBorder || (currentStyle.isDark ? '#1E293B' : '#E2E8F0'),
              color: currentStyle.colors.textBody || (currentStyle.isDark ? '#F1F5F9' : '#020617')
            }}
            className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[80vh] flex flex-col animate-slideUp font-sans antialiased ${
              currentStyle.id === 'street_food'
                ? 'border-2 border-[#020617] shadow-[6px_6px_0px_#EA580C]'
                : currentStyle.id === 'trattoria_artesanal'
                ? 'border border-[#C2410C]/60 shadow-xl'
                : 'border shadow-2xl'
            }`}
          >
            {/* Cabecera del Chat */}
            <div
              style={{
                backgroundColor: currentStyle.colors.headerBg || (currentStyle.isDark ? '#020617' : '#FFFFFF'),
                borderBottomColor: currentStyle.colors.cardBorder || (currentStyle.isDark ? '#1E293B' : '#E2E8F0')
              }}
              className="p-4 border-b flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: currentStyle.colors.accent,
                    color: currentStyle.colors.accentText,
                    borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                    borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px'
                  }}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{
                      color: currentStyle.colors.headerText || (currentStyle.isDark ? '#FFFFFF' : '#020617'),
                      fontFamily: currentStyle.fonts.heading || 'inherit'
                    }}
                    className="text-sm font-black flex items-center gap-1.5"
                  >
                    <span>{restaurant.settings?.aiAssistant?.customName || t.aiAssistantDefaultName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p
                    className="text-[11px] opacity-75"
                    style={{ color: currentStyle.colors.headerSubtitle || currentStyle.colors.textSecondary || '#94A3B8' }}
                  >
                    {t.aiOfficialMenu(restaurant.name)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAIAssistantOpen(false)}
                style={{
                  backgroundColor: currentStyle.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  color: currentStyle.colors.headerText || (currentStyle.isDark ? '#FFFFFF' : '#020617')
                }}
                className="p-2 rounded-xl hover:opacity-80 transition-colors"
                aria-label={t.closeDetails}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso de Alérgenos Responsable */}
            <div
              style={{
                backgroundColor: `${currentStyle.colors.accent}1A`,
                borderColor: `${currentStyle.colors.accent}33`,
                color: currentStyle.isDark ? currentStyle.colors.accent : currentStyle.colors.titlePrice
              }}
              className="px-4 py-2 border-b text-[11px] font-medium flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{t.aiDisclaimer}</span>
            </div>

            {/* Sugerencias Rápidas */}
            <div
              style={{
                backgroundColor: currentStyle.colors.searchBg || (currentStyle.isDark ? 'rgba(2,6,23,0.4)' : '#F8FAFC'),
                borderBottomColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.2)'
              }}
              className="p-3 border-b flex items-center gap-2 overflow-x-auto no-scrollbar font-sans"
            >
              {t.aiChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendAIMessage(chip)}
                  disabled={isAskingAI}
                  style={{
                    backgroundColor: currentStyle.colors.chipInactiveBg || (currentStyle.isDark ? '#1E293B' : '#FFFFFF'),
                    color: currentStyle.colors.chipInactiveText || (currentStyle.isDark ? '#CBD5E1' : '#334155'),
                    borderColor: currentStyle.colors.chipInactiveBorder || '#E2E8F0',
                    borderWidth: currentStyle.id === 'street_food' ? '1.5px' : '1px'
                  }}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Historial de Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[220px]">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    style={
                      msg.role === 'user'
                        ? {
                            backgroundColor: currentStyle.colors.accent,
                            color: currentStyle.colors.accentText,
                            borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                            borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
                            boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                          }
                        : {
                            backgroundColor: currentStyle.colors.cardBg || (currentStyle.isDark ? '#020617' : '#FFFFFF'),
                            borderColor: currentStyle.colors.cardBorder || '#E2E8F0',
                            color: currentStyle.colors.textBody || (currentStyle.isDark ? '#E2E8F0' : '#0F172A'),
                            borderWidth: currentStyle.id === 'street_food' ? '2px' : '1px'
                          }
                    }
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed tracking-normal shadow-md ${
                      msg.role === 'user' ? 'rounded-br-none font-semibold' : 'rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderFormattedMessage(msg.text) : msg.text}
                  </div>
                </div>
              ))}

              {isAskingAI && (
                <div className="flex justify-start">
                  <div
                    style={{
                      backgroundColor: currentStyle.colors.cardBg || (currentStyle.isDark ? '#020617' : '#FFFFFF'),
                      borderColor: currentStyle.colors.cardBorder || '#E2E8F0',
                      color: currentStyle.colors.accent
                    }}
                    className="border rounded-2xl rounded-bl-none p-3 text-xs flex items-center gap-2"
                  >
                    <div
                      className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: currentStyle.colors.accent, borderTopColor: 'transparent' }}
                    />
                    <span>{t.aiThinking}</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input de Pregunta */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAIMessage();
              }}
              style={{
                backgroundColor: currentStyle.colors.headerBg || (currentStyle.isDark ? '#020617' : '#FFFFFF'),
                borderTopColor: currentStyle.colors.cardBorder || (currentStyle.isDark ? '#1E293B' : '#E2E8F0')
              }}
              className="p-3 border-t flex items-center gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={t.aiInputPlaceholder}
                disabled={isAskingAI}
                style={{
                  backgroundColor: currentStyle.colors.searchBg || (currentStyle.isDark ? '#0F172A' : '#F1F5F9'),
                  borderColor: currentStyle.colors.searchBorder || '#E2E8F0',
                  color: currentStyle.colors.textBody || (currentStyle.isDark ? '#FFFFFF' : '#020617'),
                  borderWidth: currentStyle.id === 'street_food' ? '2px' : '1px'
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isAskingAI || !aiInput.trim()}
                style={{
                  backgroundColor: currentStyle.colors.accent,
                  color: currentStyle.colors.accentText,
                  borderColor: currentStyle.id === 'street_food' ? '#020617' : undefined,
                  borderWidth: currentStyle.id === 'street_food' ? '2px' : '0px',
                  boxShadow: currentStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                }}
                className="p-2.5 rounded-xl disabled:opacity-50 transition-all font-black flex items-center justify-center shrink-0 shadow-md active:scale-95"
                aria-label="Enviar pregunta"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 9. Enlaces Sociales, Canales de Contacto y Ubicación + Loop Viral */}
      <footer className="mt-16 text-center px-4 space-y-4">
        {restaurant.settings?.socialLinks && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {restaurant.settings.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${restaurant.settings.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {restaurant.settings.socialLinks.instagram && (
                <a
                  href={restaurant.settings.socialLinks.instagram.startsWith('http') ? restaurant.settings.socialLinks.instagram : `https://instagram.com/${restaurant.settings.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
              {restaurant.settings.socialLinks.facebook && (
                <a
                  href={restaurant.settings.socialLinks.facebook.startsWith('http') ? restaurant.settings.socialLinks.facebook : `https://facebook.com/${restaurant.settings.socialLinks.facebook.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              )}
              {restaurant.settings.socialLinks.tiktok && (
                <a
                  href={restaurant.settings.socialLinks.tiktok.startsWith('http') ? restaurant.settings.socialLinks.tiktok : `https://tiktok.com/@${restaurant.settings.socialLinks.tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>TikTok</span>
                </a>
              )}
              {restaurant.settings.socialLinks.website && (
                <a
                  href={restaurant.settings.socialLinks.website.startsWith('http') ? restaurant.settings.socialLinks.website : `https://${restaurant.settings.socialLinks.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web / Reservas</span>
                </a>
              )}
              {restaurant.settings.socialLinks.phone && (
                <a
                  href={`tel:${restaurant.settings.socialLinks.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-600 text-slate-200 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Llamar</span>
                </a>
              )}
              {restaurant.settings.socialLinks.mapsUrl && (
                <a
                  href={restaurant.settings.socialLinks.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 text-xs font-bold shadow-md"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.howToGetThere}</span>
                </a>
              )}
            </div>

            {(restaurant.settings.socialLinks.wifiName || restaurant.settings.socialLinks.wifiPassword) && (
              <div
                style={{
                  backgroundColor: currentStyle.colors.cardBg || '#FFFFFF',
                  borderColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.3)',
                  color: currentStyle.colors.textBody || '#020617'
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[11px] shadow-sm"
              >
                <span className="font-bold" style={{ color: currentStyle.colors.accent }}>WiFi Clientes:</span>
                {restaurant.settings.socialLinks.wifiName && (
                  <span>Red: <strong style={{ color: currentStyle.colors.dishTitle }}>{restaurant.settings.socialLinks.wifiName}</strong></span>
                )}
                {restaurant.settings.socialLinks.wifiPassword && (
                  <span>• Clave: <strong className="font-mono" style={{ color: currentStyle.colors.dishTitle }}>{restaurant.settings.socialLinks.wifiPassword}</strong></span>
                )}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            backgroundColor: currentStyle.colors.cardBg || (currentStyle.isDark ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF'),
            borderColor: currentStyle.colors.cardBorder || 'rgba(148, 163, 184, 0.3)',
            color: currentStyle.colors.textSecondary || '#64748B'
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: currentStyle.colors.accent }} aria-hidden="true" />
          <span>{t.interactiveMenuBy}</span>
          <Link to="/" className="font-bold hover:underline" style={{ color: currentStyle.colors.titlePrice || currentStyle.colors.accent }}>
            Volum-Menu
          </Link>
          <span>—</span>
          <Link to="/" className="font-semibold underline hover:opacity-80" style={{ color: currentStyle.colors.textBody }}>
            {t.activateForRestaurant}
          </Link>
        </div>
      {/* Modal de Pre-Cuenta y Ticket Digital Clásico (solo si pedidos digitales están activos) */}
      <DigitalReceiptModal
        isOpen={Boolean(isReceiptModalOpen && restaurant?.settings?.orderSettings?.enabled)}
        onClose={() => setIsReceiptModalOpen(false)}
        restaurantName={restaurant?.name || 'Restaurante'}
        restaurantLogo={restaurant?.logoUrl ? getMediaUrl(restaurant.logoUrl) : ''}
        tableNumber={mesaParam || '1'}
        orders={tableSession?.orders || []}
        currency={restaurant?.currency || 'MXN'}
        primaryColor={primaryColor}
        lang={currentLang}
        styleConfig={currentStyle}
        onRequestBill={(method = 'card') => {
          if (slug && activeTable) {
            axios.post(`/api/v1/service/request/${slug}`, {
              table: activeTable,
              zone: zonaParam,
              type: 'bill',
              paymentMethod: method || 'card'
            }).catch(console.warn);
            setOrderToast(method === 'cash' ? 'Solicitud de cuenta en efectivo enviada al mesero.' : 'Solicitud de cuenta con tarjeta enviada al mesero.');
            setTimeout(() => setOrderToast(null), 4000);
          }
        }}
      />

      {/* Modal de Carrito Colaborativo de Mesa con Confirmación y Rondas */}
      <TableCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={mesaParam || '1'}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmittingOrder}
        previousOrders={tableSession?.orders || []}
        dinerName={dinerName}
        onChangeDinerName={handleChangeDinerName}
        currency={restaurant?.currency || 'MXN'}
        primaryColor={primaryColor}
        lang={currentLang}
        orderSettings={restaurant?.settings?.orderSettings || {}}
        onOpenReceipt={() => setIsReceiptModalOpen(true)}
      />

      {/* Notificación Flotante con Botón de Acceso Inmediato al Pedido */}
      {orderToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs animate-slideUp">
          <div className="flex items-center gap-2.5 text-white min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">{orderToast}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              setOrderToast(null);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ver Pedido</span>
          </button>
        </div>
      )}

    </footer>

    </div>
  );
}

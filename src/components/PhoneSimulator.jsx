import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Box,
  LayoutGrid,
  List,
  Film,
  Globe,
  Gift,
  Clock,
  Flame,
  Music,
  Tag,
  Wifi,
  Battery,
  Bot,
  Search,
  Utensils,
  Beef,
  Soup,
  Pizza,
  Fish,
  Sandwich,
  Cake,
  Wine,
  Coffee,
  ChevronRight,
  Star,
  Bell
} from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { DINER_STYLES } from '../config/dinerStyles';
import MarketingBannersDisplay from './MarketingBannersDisplay';

// Helper de iconos vectoriales SVG sin emojis
const AnnouncementIcon = ({ iconType, className = 'w-3 h-3' }) => {
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
    case 'sharp': return 'rounded-none border-t border-b sm:rounded-none';
    case 'subtle': return 'rounded-xl';
    default: return 'rounded-2xl';
  }
};

// Glifo vectorial culinario cuando el platillo aún no tiene fotografía (1:1 con DinerMenuPage)
const DishCategoryIcon = ({ categoryName = '', dishName = '', className = 'w-7 h-7 text-amber-400/90' }) => {
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

const SAMPLE_DISHES = [
  {
    id: 'sample-1',
    name: 'Ribeye Prime a las Brasas',
    description: 'Corte sellado al carbón con guarnición de romero fresco.',
    price: 495,
    currency: 'MXN',
    is3D: true,
    categoryId: 'cat-1'
  },
  {
    id: 'sample-2',
    name: 'Burger Wagyu & Trufa',
    description: 'Carne wagyu con queso cheddar fundido y pan brioche.',
    price: 290,
    currency: 'MXN',
    is3D: true,
    categoryId: 'cat-2'
  },
  {
    id: 'sample-3',
    name: 'Tarta Coulant de Chocolate',
    description: 'Pastel tibio de cacao con centro fundido y helado.',
    price: 185,
    currency: 'MXN',
    is3D: true,
    categoryId: 'cat-3'
  },
  {
    id: 'sample-4',
    name: 'Burrata & Jitomate Heirloom',
    description: 'Queso burrata fresco con reducción balsámica y albahaca.',
    price: 220,
    currency: 'MXN',
    is3D: false,
    categoryId: 'cat-4'
  }
];

// Helper para generar platillos muestra altamente realistas según la categoría cuando no hay platillos cargados
const getMockDishesForCategory = (catName = '', catId = 'cat-1') => {
  const lower = String(catName || '').toLowerCase();
  if (/vino|cava|bodega|coctel|cocteler|mixolog|cerveza|licor|destilado|caf[eé]|bar|trago|botella|refresco|bebida/.test(lower)) {
    return [
      { id: `mock-${catId}-1`, name: 'Vino Tinto Gran Reserva (Copa)', description: 'Tempranillo añejado 18 meses en barrica de roble francés con notas de mora.', price: 210, currency: 'MXN', categoryId: catId, is3D: false },
      { id: `mock-${catId}-2`, name: 'Mezcalita de la Pasión Ahumada', description: 'Mezcal espadín artesanal con pulpa natural de maracuyá y sal de gusano.', price: 175, currency: 'MXN', categoryId: catId, is3D: false },
      { id: `mock-${catId}-3`, name: 'Carajillo Shakeado Especial', description: 'Licor 43 batido en coctelera con doble carga de café espresso de altura.', price: 160, currency: 'MXN', categoryId: catId, is3D: false }
    ];
  }
  if (/postre|dulce|reposter|helado|tarta|coulant/.test(lower)) {
    return [
      { id: `mock-${catId}-1`, name: 'Coulant de Cacao 70% & Frutos Rojos', description: 'Pastel tibio de chocolate amargo con centro fundido y helado de vainilla.', price: 165, currency: 'MXN', categoryId: catId, is3D: true },
      { id: `mock-${catId}-2`, name: 'Cheesecake Vasco Caramelizado', description: 'Tarta rústica horneada a alta temperatura con compota de frutos del bosque.', price: 145, currency: 'MXN', categoryId: catId, is3D: false }
    ];
  }
  if (/entrada|tapa|botana|ensalada|sopa|carpaccio|ceviche/.test(lower)) {
    return [
      { id: `mock-${catId}-1`, name: 'Tártara de Atún Aleta Azul & Trufa', description: 'Cubos frescos de atún marinados en ponzu cítrico con aguacate tatemado.', price: 240, currency: 'MXN', categoryId: catId, is3D: true },
      { id: `mock-${catId}-2`, name: 'Burrata & Jitomate Heirloom', description: 'Queso burrata fresco con reducción balsámica, pesto y albahaca morada.', price: 195, currency: 'MXN', categoryId: catId, is3D: false }
    ];
  }
  return [
    { id: `mock-${catId}-1`, name: `${catName} Especial de la Casa`, description: 'Preparación insignia a la parrilla con guarnición fresca y sal marina.', price: 340, currency: 'MXN', categoryId: catId, is3D: true },
    { id: `mock-${catId}-2`, name: `${catName} Tradicional`, description: 'Receta de autor elaborada al momento con ingredientes prémium de temporada.', price: 275, currency: 'MXN', categoryId: catId, is3D: false }
  ];
};

export default function PhoneSimulator({
  restaurant,
  dishes = [],
  categories = [],
  focusedCategoryId = null,
  onCallWaiter
}) {
  const [activeTabMode, setActiveTabMode] = useState(
    restaurant?.settings?.defaultViewMode || 'grid'
  );

  useEffect(() => {
    if (restaurant?.settings?.defaultViewMode) {
      setActiveTabMode(restaurant.settings.defaultViewMode);
    }
  }, [restaurant?.settings?.defaultViewMode]);

  const [selectedCatId, setSelectedCatId] = useState('all');

  // Si desde el panel de administración se selecciona una categoría específica (Punto 4), enfocarla en el teléfono
  useEffect(() => {
    if (focusedCategoryId) {
      setSelectedCatId(focusedCategoryId);
    }
  }, [focusedCategoryId]);

  const [only3D, setOnly3D] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [bannerLoadError, setBannerLoadError] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userForcedMode, setUserForcedMode] = useState(null);
  const [showSimSplash, setShowSimSplash] = useState(false);
  const prevSplashEnabled = React.useRef(Boolean(restaurant?.settings?.introSplash?.enabled));

  const theme = restaurant?.theme || {};
  const activeDinerStyle = DINER_STYLES[theme.dinerStyle] || DINER_STYLES.lounge_nocturno;
  const isDark = activeDinerStyle.isDark;
  const baseColors = activeDinerStyle.colors;

  // Reactividad inmediata con la Paleta Cromática (IA + Autor) y controles Hex del panel
  const primaryColor = theme.primaryColor || baseColors.accent;
  const secondaryColor = theme.secondaryColor || baseColors.headerBg;
  const accentColor = theme.accentColor || primaryColor;
  const surfaceColor = theme.surfaceColor || baseColors.bgCanvas;

  const isColorLight = (c) => {
    if (!c || typeof c !== 'string') return false;
    const hex = c.replace('#', '');
    if (hex.length < 6) return false;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 165;
  };

  const isAccentLight = isColorLight(accentColor);

  const resolvedBgCanvas = isDark
    ? surfaceColor
    : (isColorLight(surfaceColor) ? surfaceColor : baseColors.bgCanvas);

  const resolvedCardBg = isDark
    ? (surfaceColor === '#020617' ? '#0F172A' : (surfaceColor || '#0F172A'))
    : baseColors.cardBg;

  const colors = {
    ...baseColors,
    accent: accentColor,
    accentText: isAccentLight ? '#020617' : '#FFFFFF',
    headerBg: isDark ? secondaryColor : baseColors.headerBg,
    bgCanvas: resolvedBgCanvas,
    cardBg: resolvedCardBg,
    titlePrice: accentColor || primaryColor || baseColors.titlePrice,
    cardBorder: isDark ? `${accentColor}35` : baseColors.cardBorder,
    dishTitle: isDark ? '#F8FAFC' : (baseColors.dishTitle || '#0F172A'),
    bottomBarBg: isDark ? (secondaryColor || '#0F172A') : baseColors.bottomBarBg
  };
  const fonts = activeDinerStyle.fonts;
  const archetype = theme.archetype || (activeDinerStyle?.id === 'bistro_botanico' ? 'editorial_michelin' : activeDinerStyle?.id === 'lounge_nocturno' ? 'dark_lounge' : 'modern_gourmet');
  const heroStyle = theme.heroStyle || (archetype === 'editorial_michelin' ? 'editorial_minimal' : 'banner_standard');
  const fontFamily = theme.fontFamily || (archetype === 'editorial_michelin' ? 'playfair' : 'sans');
  const texture = theme.texture || 'none';
  const cardRadius = theme.cardRadius || (archetype === 'editorial_michelin' ? 'sharp' : 'rounded');
  const announcement = restaurant?.settings?.announcementBanner || {};
  const introSplash = restaurant?.settings?.introSplash || {};
  const storytelling = restaurant?.settings?.storytelling || {};
  const chefQuote = storytelling.chefQuote || {};

  // Mostrar previsualización automática de 1.3s cuando se activa el Splash Screen en el panel
  useEffect(() => {
    const isNowEnabled = Boolean(introSplash.enabled);
    if (isNowEnabled && !prevSplashEnabled.current) {
      setShowSimSplash(true);
      const t = setTimeout(() => setShowSimSplash(false), 1400);
      prevSplashEnabled.current = isNowEnabled;
      return () => clearTimeout(t);
    }
    prevSplashEnabled.current = isNowEnabled;
  }, [introSplash.enabled]);

  const fontClass = getFontClass(fontFamily);
  const textureClass = getTextureClass(texture);
  const cardRadiusClass = getCardRadiusClass(cardRadius);

  // Lista de categorías para el simulador
  const categoriesList = categories && categories.length > 0
    ? categories
    : [
        { id: 'cat-1', name: 'Cortes & Parrilla', layoutType: 'hero_carousel', showThumbnails: true },
        { id: 'cat-2', name: 'Especialidades', layoutType: 'grid', showThumbnails: true },
        { id: 'cat-3', name: 'Postres', layoutType: 'grid', showThumbnails: true },
        { id: 'cat-4', name: 'Bebidas & Cava', layoutType: 'compact_list', showThumbnails: false }
      ];

  // Platillos para el simulador: si el restaurante tiene reales, los usa; si no, muestra platos muestra
  const sourceDishes = dishes && dishes.length > 0 ? dishes : SAMPLE_DISHES;
  const signatureDish = sourceDishes.find((d) => String(d.id || d._id) === String(storytelling.signatureDishId)) ||
    sourceDishes.find((d) => d.is3D) ||
    sourceDishes[0];

  // Jerarquía gastronómica: 1º 3D, 2º Pedidos Estrella, 3º resto
  const sortSimDishes = (list) => {
    return [...list].sort((a, b) => {
      if (a.is3D && !b.is3D) return -1;
      if (!a.is3D && b.is3D) return 1;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  };

  const hasFeaturedDishes = sourceDishes.some((d) => d.isFeatured);

  const getSimCatLayout = (cat) => {
    if (userForcedMode) return userForcedMode;
    const raw = cat?.layoutType || 'inherited';
    if (raw !== 'inherited') return raw;
    if (activeTabMode === 'feed') return 'feed';
    if (archetype === 'editorial_michelin' && !restaurant?.settings?.defaultViewMode) return 'editorial';
    return activeTabMode === 'compact' ? 'compact_list' : 'grid';
  };

  // Construcción de grupos de categorías respetando el foco y proveyendo platillos muestra si la categoría está vacía
  const simCategoryGroups = categoriesList
    .map((cat) => {
      const catId = cat.id || cat._id;
      let catDishes = sourceDishes.filter((d) => String(d.categoryId || d.category) === String(catId));
      if (catDishes.length === 0) {
        catDishes = getMockDishesForCategory(cat.name, catId);
      }

      // Filtrado por buscador o filtros secundarios en el simulador
      let filtered = catDishes.filter((dish) => {
        if (only3D && !dish.is3D) return false;
        if (onlyFeatured && !dish.isFeatured) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (dish.name || '').toLowerCase().includes(q);
          const matchDesc = (dish.description || '').toLowerCase().includes(q);
          return matchName || matchDesc;
        }
        return true;
      });

      return {
        category: cat,
        dishes: sortSimDishes(filtered).slice(0, 4)
      };
    })
    .filter((g) => {
      if (selectedCatId !== 'all') {
        const cId = g.category.id || g.category._id;
        return String(cId) === String(selectedCatId);
      }
      return g.dishes.length > 0;
    });

  const focusedCat = selectedCatId !== 'all'
    ? categoriesList.find((c) => String(c.id || c._id) === String(selectedCatId))
    : null;

  const renderSimChefQuote = () => {
    if (!chefQuote.enabled || !chefQuote.quote) return null;
    return (
      <div
        className={`my-2.5 p-2.5 border relative overflow-hidden shadow-md ${cardRadiusClass}`}
        style={{
          background: `linear-gradient(135deg, ${secondaryColor}ee 0%, ${surfaceColor}f5 100%)`,
          borderColor: `${primaryColor}50`
        }}
      >
        <div className="flex items-center gap-2">
          {chefQuote.photoUrl && (
            <img
              src={getMediaUrl(chefQuote.photoUrl)}
              alt={chefQuote.chefName || 'Chef'}
              className="w-8 h-8 rounded-full object-cover border shrink-0"
              style={{ borderColor: primaryColor }}
            />
          )}
          <div className="min-w-0">
            <span className="block text-[7px] font-black uppercase tracking-[0.18em]" style={{ color: accentColor }}>
              Filosofía & Autor
            </span>
            <p className="text-[9px] text-slate-200 italic line-clamp-2 leading-snug">
              “{chefQuote.quote}”
            </p>
            {chefQuote.chefName && (
              <span className="block text-[8px] font-bold mt-0.5" style={{ color: primaryColor }}>
                — {chefQuote.chefName}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSimCategoryDishes = (dishesList, cat) => {
    const layout = getSimCatLayout(cat);
    const showThumb = cat ? cat.showThumbnails !== false : true;
    const catName = cat?.name || 'Especialidad';

    if (layout === 'hero_carousel') {
      return (
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
          {dishesList.map((dish) => (
            <div
              key={dish.id || dish._id}
              className={`shrink-0 w-[195px] overflow-hidden border p-2 flex flex-col justify-between transition-all ${cardRadiusClass}`}
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px',
                boxShadow: activeDinerStyle.id === 'street_food' ? `3px 3px 0px ${colors.accent || "#EA580C"}` : '0 4px 6px -1px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div
                className="relative h-24 w-full rounded-xl overflow-hidden mb-1.5 border"
                style={{
                  backgroundColor: isDark ? '#020617' : '#F1F5F9',
                  borderColor: colors.cardBorder
                }}
              >
                {dish.imageUrl ? (
                  <img src={getMediaUrl(dish.imageUrl)} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
                    <DishCategoryIcon categoryName={catName} dishName={dish.name} className="w-7 h-7 text-amber-500" />
                  </div>
                )}
                {dish.is3D && (
                  <span
                    className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md border text-[7px] font-black flex items-center gap-0.5 shadow backdrop-blur-sm"
                    style={{
                      backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: colors.accent,
                      color: colors.accent
                    }}
                  >
                    <Box className="w-2 h-2" />
                    <span>3D 1:1</span>
                  </span>
                )}
                {dish.isFeatured && (
                  <span
                    className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[7px] font-black flex items-center gap-0.5 shadow"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.accentText
                    }}
                  >
                    <Star className="w-2 h-2 fill-current" />
                    <span>Top</span>
                  </span>
                )}
              </div>
              <div>
                <h4
                  className="text-[10px] font-bold line-clamp-1"
                  style={{
                    color: colors.dishTitle || colors.titlePrice,
                    fontFamily: fonts.heading
                  }}
                >
                  {dish.name}
                </h4>
                <div
                  className="mt-1 pt-1 border-t flex items-center justify-between"
                  style={{ borderColor: colors.cardBorder }}
                >
                  <span style={{ color: colors.titlePrice || colors.accent }} className="text-[10px] font-black tabular-nums">
                    ${dish.price} <span className="text-[7px]" style={{ color: colors.textSecondary }}>{dish.currency || 'MXN'}</span>
                  </span>
                  {dish.is3D && (
                    <span
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.accentText,
                        border: activeDinerStyle.id === 'street_food' ? '1px solid #020617' : undefined
                      }}
                      className="px-1.5 py-0.5 rounded text-[7px] font-black"
                    >
                      Ver AR
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
        <div className="space-y-2.5">
          {dishesList.map((dish) => (
            <div
              key={dish.id || dish._id}
              className={`p-2.5 border overflow-hidden transition-all ${cardRadiusClass}`}
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px',
                boxShadow: activeDinerStyle.id === 'street_food' ? `4px 4px 0px ${colors.accent || "#EA580C"}` : '0 4px 6px -1px rgba(0, 0, 0, 0.08)'
              }}
            >
              {showThumb && (
                <div
                  className="relative h-28 w-full rounded-xl overflow-hidden mb-2 border"
                  style={{
                    backgroundColor: isDark ? '#020617' : '#F1F5F9',
                    borderColor: colors.cardBorder
                  }}
                >
                  {dish.imageUrl ? (
                    <img src={getMediaUrl(dish.imageUrl)} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent text-center p-2">
                      <DishCategoryIcon categoryName={catName} dishName={dish.name} className="w-8 h-8 text-amber-500 mb-1" />
                      <span className="text-[7px] font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Corte Insignia • Formato Panorámico</span>
                    </div>
                  )}
                  {dish.is3D && (
                    <span
                      className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md border text-[7px] font-black flex items-center gap-1 shadow backdrop-blur-sm"
                      style={{
                        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: colors.accent,
                        color: colors.accent
                      }}
                    >
                      <Box className="w-2.5 h-2.5" />
                      <span>3D Real 1:1</span>
                    </span>
                  )}
                  {dish.isFeatured && (
                    <span
                      className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[7px] font-black flex items-center gap-0.5 shadow"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.accentText
                      }}
                    >
                      <Star className="w-2 h-2 fill-current" />
                      <span>Plato Estrella</span>
                    </span>
                  )}
                </div>
              )}

              <div
                className="flex items-baseline justify-between gap-2 border-b border-dotted pb-1.5"
                style={{ borderColor: colors.cardBorder }}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <h4
                    className="text-[11px] font-black tracking-wide truncate"
                    style={{
                      color: colors.dishTitle || colors.titlePrice,
                      fontFamily: fonts.heading
                    }}
                  >
                    {dish.name}
                  </h4>
                  {dish.isFeatured && !showThumb && (
                    <span
                      className="px-1 py-0.2 rounded text-[6px] font-black shrink-0"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.accentText
                      }}
                    >
                      Top
                    </span>
                  )}
                </div>
                <span style={{ color: colors.titlePrice || colors.accent }} className="text-[11px] font-black shrink-0 tabular-nums">
                  ${dish.price} <span className="text-[7px] font-normal" style={{ color: colors.textSecondary }}>{dish.currency || 'MXN'}</span>
                </span>
              </div>
              {dish.description && (
                <p
                  className="text-[8px] italic line-clamp-2 mt-1 font-light leading-relaxed"
                  style={{ color: colors.textSecondary }}
                >
                  {dish.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }
    if (layout === 'compact_list' || layout === 'compact') {
      return (
        <div className="space-y-1.5">
          {dishesList.map((dish) => {
            if (!showThumb) {
              return (
                <div
                  key={dish.id || dish._id}
                  className={`px-2.5 py-1.5 border flex items-center justify-between gap-2 transition-all ${cardRadiusClass}`}
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px'
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
                      <div className="flex items-center gap-1 min-w-0">
                        <h4
                          className="text-[10px] font-bold truncate"
                          style={{
                            color: colors.dishTitle || colors.titlePrice,
                            fontFamily: fonts.heading
                          }}
                        >
                          {dish.name}
                        </h4>
                        {dish.isFeatured && (
                          <span
                            className="px-1 py-0.2 rounded text-[6px] font-black flex items-center gap-0.5 shrink-0"
                            style={{
                              backgroundColor: colors.accent,
                              color: colors.accentText
                            }}
                          >
                            <Star className="w-1.5 h-1.5 fill-current" />
                            <span>Top</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {dish.description && (
                      <p className="text-[8px] truncate pl-3 font-light" style={{ color: colors.textSecondary }}>
                        {dish.description}
                      </p>
                    )}
                  </div>
                  <span style={{ color: colors.titlePrice || colors.accent }} className="text-[10px] font-black tabular-nums shrink-0">
                    ${dish.price}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={dish.id || dish._id}
                className={`p-2 border flex items-center justify-between gap-2 shadow-sm transition-all ${cardRadiusClass}`}
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px',
                  boxShadow: activeDinerStyle.id === 'street_food' ? `3px 3px 0px ${colors.accent || "#EA580C"}` : undefined
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border"
                    style={{
                      backgroundColor: isDark ? '#020617' : '#F1F5F9',
                      borderColor: colors.cardBorder
                    }}
                  >
                    {dish.imageUrl ? (
                      <img src={getMediaUrl(dish.imageUrl)} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
                        <DishCategoryIcon categoryName={catName} dishName={dish.name} className="w-5 h-5 text-amber-500" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-[10px] font-bold truncate leading-snug"
                      style={{
                        color: colors.dishTitle || colors.titlePrice,
                        fontFamily: fonts.heading
                      }}
                    >
                      {dish.name}
                    </h4>
                    <p className="text-[8px] truncate font-light mt-0.5" style={{ color: colors.textSecondary }}>
                      {dish.description || catName}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span style={{ color: colors.titlePrice || colors.accent }} className="text-[10px] font-black tabular-nums">
                    ${dish.price} <span className="text-[7px] font-semibold" style={{ color: colors.textSecondary }}>{dish.currency || 'MXN'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Default: 'grid'
    return (
      <div className="grid grid-cols-2 gap-2">
        {dishesList.map((dish) => (
          <div
            key={dish.id || dish._id}
            className={`overflow-hidden border p-2.5 flex flex-col justify-between shadow-sm transition-all ${cardRadiusClass}`}
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
              borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px',
              boxShadow: activeDinerStyle.id === 'street_food' ? `3px 3px 0px ${colors.accent || "#EA580C"}` : '0 2px 5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {showThumb && (
              <div
                className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 border shadow-inner transition-colors" style={{ backgroundColor: isDark ? '#0A101D' : '#F8FAFC', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }}
              >
                {dish.imageUrl ? (
                  <img src={getMediaUrl(dish.imageUrl)} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isDark ? '#020617' : '#F8FAFC'
                    }}
                  >
                    <DishCategoryIcon
                      categoryName={catName}
                      dishName={dish.name}
                      className={`w-10 h-10 ${isDark ? 'text-amber-400' : 'text-slate-400'}`}
                    />
                  </div>
                )}
                {dish.is3D && (
                  <span
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/25 text-[8px] font-black text-white flex items-center gap-1 shadow-lg"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>3D</span>
                  </span>
                )}
                {dish.isFeatured && (
                  <span
                    className={`absolute top-1.5 right-1.5 ${activeDinerStyle.badgeStyle || 'px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[7px] font-black'} flex items-center gap-0.5 shadow-sm`}
                  >
                    <Star className="w-2 h-2 fill-current" />
                    <span>Top</span>
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h4
                  className="text-[11px] font-bold line-clamp-1 leading-snug"
                  style={{
                    color: colors.dishTitle || colors.titlePrice,
                    fontFamily: fonts.heading
                  }}
                >
                  {dish.name}
                </h4>
                {dish.description && (
                  <p className="text-[8px] line-clamp-1 mt-0.5 font-light" style={{ color: colors.textSecondary }}>
                    {dish.description}
                  </p>
                )}
              </div>
              <div
                className="mt-2 pt-1.5 border-t flex items-center justify-between gap-1"
                style={{ borderColor: colors.cardBorder }}
              >
                <span style={{ color: colors.titlePrice || colors.accent }} className="text-[10px] font-black tabular-nums">
                  ${dish.price} <span className="text-[7px] font-normal" style={{ color: colors.textSecondary }}>{dish.currency || 'MXN'}</span>
                </span>
                {dish.is3D ? (
                  <button
                    type="button"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.accentText,
                      borderColor: activeDinerStyle.id === 'street_food' ? '#020617' : undefined,
                      borderWidth: activeDinerStyle.id === 'street_food' ? '1.5px' : '0px',
                      boxShadow: activeDinerStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                    }}
                    className="px-2 py-0.5 rounded-lg text-[8px] font-black flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                  >
                    <Sparkles className="w-2 h-2 fill-current" />
                    <span>Ver 3D</span>
                  </button>
                ) : (
                  <span className="text-[8px] font-semibold flex items-center gap-0.5" style={{ color: colors.accent }}>
                    <span>Info</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="phone-simulator-viewport flex flex-col items-center">
      {/* Contenedor Mockup iPhone */}
      <div
        className="relative w-[320px] sm:w-[340px] rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] border border-slate-700/80"
        style={{
          background: 'linear-gradient(to bottom, #334155, #1e293b, #020617)',
          borderColor: 'rgba(51, 65, 85, 0.8)'
        }}
      >
        
        {/* Reflejos laterales metálicos */}
        <div className="absolute inset-y-16 -left-0.5 w-1 bg-slate-500/30 rounded-r" />
        <div className="absolute inset-y-24 -right-0.5 w-1 bg-slate-500/30 rounded-l" />

        {/* Pantalla Interna */}
        <div
          className={`relative w-full h-[660px] rounded-[38px] overflow-hidden flex flex-col transition-colors duration-300 ${fontClass} ${textureClass}`} style={{ backgroundColor: colors.bgCanvas }}
        >
          {/* PREVIEW SPLASH SCREEN DENTRO DEL SIMULADOR */}
          {showSimSplash && (
            <div
              onClick={() => setShowSimSplash(false)}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-5 text-center cursor-pointer animate-fadeIn"
              style={{
                backgroundColor: surfaceColor,
                backgroundImage: `radial-gradient(circle at 50% 35%, ${primaryColor}40 0%, ${surfaceColor} 75%)`
              }}
            >
              {restaurant?.logoUrl && !logoLoadError ? (
                <img
                  src={getMediaUrl(restaurant.logoUrl)}
                  alt={restaurant?.name || 'Logo'}
                  className="w-16 h-16 rounded-2xl object-contain bg-slate-900 border-2 p-1.5 shadow-2xl mb-3"
                  style={{ borderColor: primaryColor }}
                />
              ) : (
                <div
                  style={{ backgroundColor: `${primaryColor}20`, borderColor: primaryColor, color: accentColor }}
                  className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-2xl shadow-2xl mb-3 bg-slate-900"
                >
                  {(restaurant?.name || 'V').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-[8px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: accentColor }}>
                Mesa 1 • Bienvenido
              </span>
              <h3 className="text-base font-black text-white">{restaurant?.name || 'Mi Restaurante'}</h3>
              <p className="text-[10px] text-slate-300 italic mt-1 line-clamp-2">
                {introSplash.tagline || restaurant?.description || 'Experiencia Gastronómica 3D'}
              </p>
              <span className="mt-4 px-2.5 py-0.5 rounded-full bg-white/10 text-[8px] text-slate-300">
                Splash de bienvenida (1.2s)
              </span>
            </div>
          )}

          {/* Barra de Estado iOS (Notch / Isla Dinámica) */}
          <div className="sticky top-0 z-30 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md">
            <span>12:30</span>
            {/* Isla Dinámica */}
            <div className="w-20 h-4.5 bg-black rounded-full flex items-center justify-end px-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Contenido scrolleable de la carta */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-20">
            
            {/* Cabecera / Portada Adaptativa según heroStyle (Server-Driven UI) */}
            {heroStyle === 'editorial_minimal' ? (
              <div
                className="relative w-full pt-8 pb-3.5 px-3 border-b text-center shrink-0 transition-colors"
                style={{
                  backgroundColor: colors.headerBg,
                  borderColor: colors.cardBorder,
                  backgroundImage: `radial-gradient(circle at 50% 0%, ${colors.accent}20 0%, transparent 75%)`
                }}
              >
                <div
                  className="absolute top-2 left-2.5 z-10 px-2 py-0.5 rounded-full border text-[8px] font-bold shadow-sm"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    color: colors.dishTitle || colors.headerText
                  }}
                >
                  ← Volum-Menu
                </div>
                <div
                  className="absolute top-2 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-bold shadow-sm"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    color: colors.dishTitle || colors.headerText
                  }}
                >
                  <Globe className="w-2 h-2" style={{ color: colors.accent }} />
                  <span>ES</span>
                </div>
                <h2
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: colors.headerText,
                    fontFamily: fonts.heading
                  }}
                >
                  {restaurant?.name || 'Mi Restaurante'}
                </h2>
                <div className="flex items-center gap-2 my-1.5 w-24 mx-auto">
                  <div className="flex-1 h-px" style={{ backgroundColor: `${colors.accent}50` }} />
                  <Sparkles className="w-2.5 h-2.5" style={{ color: colors.accent }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: `${colors.accent}50` }} />
                </div>
                {restaurant?.description && (
                  <p
                    className="text-[9px] italic line-clamp-1 font-light"
                    style={{
                      color: colors.headerSubtitle,
                      fontFamily: fonts.body
                    }}
                  >
                    {restaurant.description}
                  </p>
                )}
              </div>
            ) : heroStyle === 'signature_3d' && signatureDish ? (
              <div
                className="relative w-full pt-8 pb-3 px-3 border-b border-slate-800/80 shrink-0 overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 80% 30%, ${primaryColor}45 0%, ${surfaceColor} 85%)`
                }}
              >
                <div className="absolute top-2 left-2.5 z-10 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[8px] font-bold text-slate-200">
                  ← Volum-Menu
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[7px] font-black uppercase">
                      <Box className="w-2 h-2" /> Platillo Insignia 3D
                    </span>
                    <h2 className="text-xs font-black truncate mt-1" style={{ color: colors.headerText || colors.dishTitle || '#FFFFFF', fontFamily: fonts.heading }}>{signatureDish.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ color: primaryColor }} className="text-[10px] font-black">
                        ${signatureDish.price}
                      </span>
                      <span
                        style={{ backgroundColor: primaryColor }}
                        className="px-2 py-0.5 rounded-lg text-[8px] font-black text-slate-950"
                      >
                        Proyectar 1:1
                      </span>
                    </div>
                  </div>
                  {signatureDish.imageUrl && (
                    <img
                      src={getMediaUrl(signatureDish.imageUrl)}
                      alt={signatureDish.name}
                      className="w-14 h-14 rounded-xl object-cover border shrink-0"
                      style={{ borderColor: primaryColor }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div
                className="relative w-full h-44 overflow-hidden border-b transition-colors shrink-0"
                style={{
                  backgroundColor: colors.headerBg,
                  borderColor: colors.cardBorder
                }}
              >
                {!bannerLoadError && (restaurant?.bannerUrl || restaurant?.venuePhotos?.[0]) ? (
                  <img
                    src={
                      (restaurant?.bannerUrl && getMediaUrl(restaurant.bannerUrl)) ||
                      (restaurant?.venuePhotos && restaurant.venuePhotos[0] && getMediaUrl(restaurant.venuePhotos[0]))
                    }
                    alt={restaurant?.name || 'Portada'}
                    onError={() => setBannerLoadError(true)}
                    className={`w-full h-full object-cover scale-105 transition-opacity ${
                      activeDinerStyle.id === 'trattoria_artesanal'
                        ? 'opacity-30'
                        : activeDinerStyle.id === 'street_food'
                          ? 'opacity-20'
                          : activeDinerStyle.id === 'bistro_botanico'
                            ? 'opacity-40 brightness-75'
                            : 'brightness-70'
                    }`}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: activeDinerStyle.id === 'trattoria_artesanal'
                        ? 'radial-gradient(circle at 50% 30%, rgba(194, 65, 12, 0.08) 0%, #FDFBF7 85%)'
                        : activeDinerStyle.id === 'bistro_botanico'
                          ? 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.25) 0%, #0C281E 85%)'
                          : activeDinerStyle.id === 'street_food'
                            ? 'radial-gradient(circle at 50% 30%, rgba(234, 88, 12, 0.1) 0%, #FFFFFF 85%)'
                            : `radial-gradient(circle at 50% 30%, ${colors.accent}30 0%, #020617 85%)`
                    }}
                  />
                )}

                {/* Gradiente de integración vertical 1:1 con comensal */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: activeDinerStyle.id === 'trattoria_artesanal'
                      ? 'linear-gradient(to top, #FDFBF7 55%, rgba(253, 251, 247, 0.88) 85%, rgba(253, 251, 247, 0.4) 100%)'
                      : activeDinerStyle.id === 'street_food'
                        ? 'linear-gradient(to top, #FFFFFF 55%, rgba(255, 255, 255, 0.90) 85%, rgba(255, 255, 255, 0.45) 100%)'
                        : activeDinerStyle.id === 'bistro_botanico'
                          ? 'linear-gradient(to top, #0C281E 50%, rgba(12, 40, 30, 0.85) 85%, rgba(12, 40, 30, 0.45) 100%)'
                          : 'linear-gradient(to top, #020617 40%, rgba(2, 6, 23, 0.85) 80%, transparent 100%)'
                  }}
                />

                {/* Botón superior Volum-Menu (1:1 con comensal) */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    style={{
                      backgroundColor: activeDinerStyle.id === 'trattoria_artesanal'
                        ? 'rgba(255, 255, 255, 0.95)'
                        : activeDinerStyle.id === 'street_food'
                          ? '#FFFFFF'
                          : activeDinerStyle.id === 'bistro_botanico'
                            ? 'rgba(12, 40, 30, 0.92)'
                            : 'rgba(15, 23, 42, 0.85)',
                      borderColor: activeDinerStyle.id === 'trattoria_artesanal'
                        ? 'rgba(194, 65, 12, 0.4)'
                        : activeDinerStyle.id === 'street_food'
                          ? '#020617'
                          : activeDinerStyle.id === 'bistro_botanico'
                            ? 'rgba(217, 119, 6, 0.4)'
                            : 'rgba(255, 255, 255, 0.2)',
                      color: activeDinerStyle.id === 'trattoria_artesanal'
                        ? '#7C2D12'
                        : activeDinerStyle.id === 'street_food'
                          ? '#020617'
                          : activeDinerStyle.id === 'bistro_botanico'
                            ? '#FDFBF7'
                            : '#E2E8F0'
                    }}
                    className="px-2 py-0.5 rounded-full border text-[8px] font-bold shadow-sm inline-block"
                  >
                    ← Volum-Menu
                  </span>
                </div>

                {/* Badge selector de idioma (1:1 con comensal) */}
                <div
                  style={{
                    backgroundColor: activeDinerStyle.id === 'trattoria_artesanal'
                      ? 'rgba(255, 255, 255, 0.95)'
                      : activeDinerStyle.id === 'street_food'
                        ? '#FFFFFF'
                        : activeDinerStyle.id === 'bistro_botanico'
                          ? 'rgba(12, 40, 30, 0.92)'
                          : 'rgba(2, 6, 23, 0.85)',
                    borderColor: activeDinerStyle.id === 'trattoria_artesanal'
                      ? 'rgba(194, 65, 12, 0.4)'
                      : activeDinerStyle.id === 'street_food'
                        ? '#020617'
                        : activeDinerStyle.id === 'bistro_botanico'
                          ? 'rgba(217, 119, 6, 0.4)'
                          : 'rgba(255, 255, 255, 0.2)'
                  }}
                  className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] shadow-sm"
                >
                  <span
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.accentText
                    }}
                    className="px-1.5 py-0.2 rounded-full font-bold"
                  >
                    ES
                  </span>
                  <span style={{ color: colors.textSecondary }} className="text-[8px]">|</span>
                  <span
                    style={{
                      color: activeDinerStyle.id === 'trattoria_artesanal' ? '#7A5C4A' : activeDinerStyle.id === 'street_food' ? '#020617' : '#94A3B8'
                    }}
                    className="px-1 py-0.2 font-bold"
                  >
                    EN
                  </span>
                </div>

                {/* Identidad central del restaurante */}
                <div className="absolute bottom-2.5 left-0 right-0 px-4 flex flex-col items-center text-center">
                  {restaurant?.logoUrl && !logoLoadError ? (
                    <img
                      src={getMediaUrl(restaurant.logoUrl)}
                      alt={restaurant?.name || 'Logo'}
                      onError={() => setLogoLoadError(true)}
                      style={{
                        borderColor: colors.accent,
                        backgroundColor: colors.cardBg
                      }}
                      className="w-12 h-12 rounded-2xl object-contain border-2 shadow-xl mb-1 p-1"
                    />
                  ) : (
                    <div
                      style={{
                        backgroundColor: `${colors.accent}25`,
                        borderColor: colors.accent,
                        color: colors.accent
                      }}
                      className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-lg shadow-xl mb-1 bg-slate-900/90 backdrop-blur"
                    >
                      {(restaurant?.name || 'V').trim().charAt(0).toUpperCase()}
                    </div>
                  )}

                  <h2
                    style={{
                      color: colors.headerText,
                      fontFamily: fonts.heading
                    }}
                    className="text-base font-black tracking-tight line-clamp-1"
                  >
                    {restaurant?.name || 'Mi Restaurante'}
                  </h2>
                  {restaurant?.description && (
                    <p
                      style={{
                        color: colors.headerSubtitle,
                        fontFamily: fonts.body
                      }}
                      className="text-[9px] line-clamp-1 mt-0.5 font-light"
                    >
                      {restaurant.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Banners de Marketing Dinámicos (Fase 5) */}
            <div className="px-1 mt-1">
              <MarketingBannersDisplay
                settings={restaurant?.settings}
                primaryColor={primaryColor}
                accentColor={accentColor}
                cardRadiusClass={cardRadiusClass}
                isCompact={true}
                isDark={isDark}
                textColor={colors.dishTitle || (isDark ? '#F8FAFC' : '#0F172A')}
              />
            </div>

            {/* Barra de Búsqueda y Switch de Modo */}
            <div className="px-3 mt-2.5 flex items-center gap-1.5">
              <div
                className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] transition-colors"
                style={{
                  backgroundColor: colors.searchBg,
                  borderColor: colors.searchBorder,
                  color: colors.textSecondary
                }}
              >
                <Search className="w-3 h-3 shrink-0" style={{ color: colors.textSecondary }} />
                <span className="truncate">Buscar platillo o ingrediente...</span>
              </div>

              {/* Botones de cambio de vista: Lista, Cuadrícula, Feed */}
              <div
                className="flex items-center p-0.5 rounded-xl border shrink-0 transition-colors"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabMode('compact');
                    setUserForcedMode(userForcedMode === 'compact_list' ? null : 'compact_list');
                  }}
                  className="p-1 rounded-lg transition-all"
                  style={{
                    backgroundColor: (userForcedMode === 'compact_list' || (!userForcedMode && activeTabMode === 'compact')) ? colors.accent : 'transparent',
                    color: (userForcedMode === 'compact_list' || (!userForcedMode && activeTabMode === 'compact')) ? colors.accentText : colors.textSecondary
                  }}
                  title="Vista Lista"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabMode('grid');
                    setUserForcedMode(userForcedMode === 'grid' ? null : 'grid');
                  }}
                  className="p-1 rounded-lg transition-all"
                  style={{
                    backgroundColor: (userForcedMode === 'grid' || (!userForcedMode && activeTabMode === 'grid')) ? colors.accent : 'transparent',
                    color: (userForcedMode === 'grid' || (!userForcedMode && activeTabMode === 'grid')) ? colors.accentText : colors.textSecondary
                  }}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabMode('feed');
                    setUserForcedMode('feed');
                  }}
                  className="p-1 rounded-lg transition-all"
                  style={{
                    backgroundColor: activeTabMode === 'feed' ? colors.accent : 'transparent',
                    color: activeTabMode === 'feed' ? colors.accentText : colors.textSecondary
                  }}
                  title="Vista Reels"
                >
                  <Film className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Filtros de Dieta (Vegano, Sin gluten, Picante - 1:1 con comensal) */}
            <div className="px-3 mt-1.5 flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0.5">
              <button
                type="button"
                className="px-2 py-0.5 rounded-full text-[8px] font-bold border transition-all"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentText,
                  borderColor: activeDinerStyle.id === 'street_food' ? '#020617' : colors.accent,
                  borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px'
                }}
              >
                Todos
              </button>
              <button
                type="button"
                className="px-2 py-0.5 rounded-full text-[8px] font-semibold border flex items-center gap-1 transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.textSecondary,
                  borderColor: colors.cardBorder
                }}
              >
                <span className="text-emerald-500 font-bold">🌱</span>
                <span>Vegano</span>
              </button>
              <button
                type="button"
                className="px-2 py-0.5 rounded-full text-[8px] font-semibold border flex items-center gap-1 transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.textSecondary,
                  borderColor: colors.cardBorder
                }}
              >
                <span className="text-amber-500 font-bold">🌾</span>
                <span>Sin gluten</span>
              </button>
              <button
                type="button"
                className="px-2 py-0.5 rounded-full text-[8px] font-semibold border flex items-center gap-1 transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.textSecondary,
                  borderColor: colors.cardBorder
                }}
              >
                <span className="text-rose-500 font-bold">🌶️</span>
                <span>Picante</span>
              </button>
            </div>

            {/* Píldoras de Categorías (1:1 con comensal) */}
            <div className="px-3 mt-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
              <button
                type="button"
                onClick={() => { setOnly3D(!only3D); if (!only3D) setOnlyFeatured(false); }}
                className="shrink-0 px-2.5 py-1 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1 border"
                style={only3D ? {
                  backgroundColor: colors.accent,
                  color: colors.accentText,
                  borderColor: activeDinerStyle.id === 'street_food' ? '#020617' : colors.accent,
                  borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px'
                } : {
                  backgroundColor: colors.chipInactiveBg,
                  color: colors.chipInactiveText,
                  borderColor: colors.chipInactiveBorder
                }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Platillos 3D</span>
              </button>

              {hasFeaturedDishes && (
                <button
                  type="button"
                  onClick={() => { setOnlyFeatured(!onlyFeatured); if (!onlyFeatured) setOnly3D(false); }}
                  className="shrink-0 px-2.5 py-1 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1 border"
                  style={onlyFeatured ? {
                    backgroundColor: colors.accent,
                    color: colors.accentText,
                    borderColor: activeDinerStyle.id === 'street_food' ? '#020617' : colors.accent,
                    borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px'
                  } : {
                    backgroundColor: colors.chipInactiveBg,
                    color: colors.chipInactiveText,
                    borderColor: colors.chipInactiveBorder
                  }}
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Más Populares</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => { setSelectedCatId('all'); setOnly3D(false); setOnlyFeatured(false); }}
                className="shrink-0 px-2.5 py-1 rounded-xl text-[9px] transition-all border font-bold"
                style={(selectedCatId === 'all' && !only3D && !onlyFeatured) ? {
                  backgroundColor: colors.accent,
                  color: colors.accentText,
                  borderColor: activeDinerStyle.id === 'street_food' ? '#020617' : colors.accent,
                  borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px'
                } : {
                  backgroundColor: colors.chipInactiveBg,
                  color: colors.chipInactiveText,
                  borderColor: colors.chipInactiveBorder
                }}
              >
                Todos ({sourceDishes.length})
              </button>

              {categoriesList.map((cat) => {
                const catId = cat.id || cat._id;
                const isSelected = String(selectedCatId) === String(catId) && !only3D && !onlyFeatured;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => { setSelectedCatId(catId); setOnly3D(false); setOnlyFeatured(false); }}
                    className="shrink-0 px-2.5 py-1 rounded-xl text-[9px] transition-all border whitespace-nowrap font-medium"
                    style={isSelected ? {
                      backgroundColor: colors.accent,
                      color: colors.accentText,
                      borderColor: activeDinerStyle.id === 'street_food' ? '#020617' : colors.accent,
                      borderWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px',
                      fontWeight: 'bold'
                    } : {
                      backgroundColor: colors.chipInactiveBg,
                      color: colors.chipInactiveText,
                      borderColor: colors.chipInactiveBorder
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Renderizado Híbrido de Platillos por Categoría */}
            <div className="px-3 mt-2.5">
              {/* Badge dinámico cuando se está previsualizando una categoría específica desde el panel */}
              {focusedCat && (
                <div className="mb-2 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-between text-[9px] font-bold text-amber-300 shadow-sm">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">Vista 1:1: {focusedCat.name}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[7px] text-amber-200 uppercase shrink-0">
                    {focusedCat.layoutType === 'hero_carousel' ? 'Carrusel' :
                     focusedCat.layoutType === 'compact_list' ? 'Sommelier' :
                     focusedCat.layoutType === 'editorial' ? 'Editorial' : 'Cuadrícula'}
                  </span>
                </div>
              )}

              {simCategoryGroups.length === 0 ? (
                <div
                  className="p-6 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-[10px] text-slate-400"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    borderColor: '#1e293b',
                    color: '#94a3b8'
                  }}
                >
                  <Utensils className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                  <span>Sin platillos en esta categoría</span>
                </div>
              ) : activeTabMode !== 'feed' ? (
                <div className="space-y-3.5">
                  {simCategoryGroups.map((group, idx) => (
                    <React.Fragment key={group.category.id || group.category._id || idx}>
                      <div className="space-y-1.5">
                        {archetype === 'editorial_michelin' ? (
                          <div className="text-center py-0.5">
                            <span
                              className="text-[9px] font-bold uppercase tracking-[0.18em]"
                              style={{
                                color: colors.dishTitle || colors.titlePrice,
                                fontFamily: fonts.heading
                              }}
                            >
                              {group.category.name}
                            </span>
                            <div className="w-10 h-px mx-auto mt-0.5" style={{ backgroundColor: colors.accent }} />
                          </div>
                        ) : archetype === 'dark_lounge' ? (
                          <div className="flex items-center justify-between border-l-2 pl-2" style={{ borderColor: colors.accent }}>
                            <span
                              className="text-[9px] font-black uppercase tracking-wider"
                              style={{
                                color: colors.dishTitle || colors.titlePrice,
                                fontFamily: fonts.heading
                              }}
                            >
                              {group.category.name}
                            </span>
                            <span className="text-[8px] font-mono" style={{ color: colors.textSecondary }}>{group.dishes.length}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between pb-0.5 border-b" style={{ borderColor: colors.cardBorder }}>
                            <span
                              className="text-[10px] font-extrabold flex items-center gap-1.5"
                              style={{
                                color: colors.dishTitle || colors.titlePrice,
                                fontFamily: fonts.heading
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                              <span>{group.category.name}</span>
                            </span>
                            <span className="text-[8px] font-semibold" style={{ color: colors.textSecondary }}>{group.dishes.length}</span>
                          </div>
                        )}
                        {renderSimCategoryDishes(group.dishes, group.category)}
                      </div>
                      {idx === 0 && renderSimChefQuote()}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                /* MODO FEED REELS */
                <div className="h-64 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-end p-3">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${primaryColor}30 0%, #020617 90%)`
                    }}
                  />
                  <div className="relative z-10 space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black inline-block">
                      {sourceDishes[0]?.badge || "DESTACADO"}
                    </span>
                    <h4 className="text-xs font-black text-white">{sourceDishes[0]?.name || 'Especialidad de la Casa'}</h4>
                    <span style={{ color: primaryColor }} className="text-xs font-black">
                      ${sourceDishes[0]?.price || 240} {sourceDishes[0]?.currency || 'MXN'}
                    </span>
                  </div>
                </div>
              )}

              {/* Pie de Canales de Contacto y Redes en Simulador 1:1 */}
              {restaurant?.settings?.socialLinks && (
                <div className="mt-4 pt-2.5 border-t border-slate-800/70 text-center space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    {restaurant.settings.socialLinks.whatsapp && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-[8px] font-bold text-emerald-400">
                        WhatsApp
                      </span>
                    )}
                    {restaurant.settings.socialLinks.instagram && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-pink-500/30 text-[8px] font-bold text-pink-400">
                        Instagram
                      </span>
                    )}
                    {restaurant.settings.socialLinks.facebook && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-blue-500/30 text-[8px] font-bold text-blue-400">
                        Facebook
                      </span>
                    )}
                    {restaurant.settings.socialLinks.tiktok && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-[8px] font-bold text-cyan-300">
                        TikTok
                      </span>
                    )}
                    {restaurant.settings.socialLinks.website && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-amber-500/30 text-[8px] font-bold text-amber-300">
                        Web / Reservas
                      </span>
                    )}
                    {restaurant.settings.socialLinks.phone && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[8px] font-bold text-slate-300">
                        Llamar
                      </span>
                    )}
                    {restaurant.settings.socialLinks.mapsUrl && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-amber-500/30 text-[8px] font-bold text-amber-400">
                        Ubicación
                      </span>
                    )}
                  </div>
                  {(restaurant.settings.socialLinks.wifiName || restaurant.settings.socialLinks.wifiPassword) && (
                    <div className="text-[7px] text-slate-400">
                      <span className="text-amber-400 font-bold">WiFi: </span>
                      <span>{restaurant.settings.socialLinks.wifiName || 'Clientes'}</span>
                      {restaurant.settings.socialLinks.wifiPassword && (
                        <span> • Clave: <strong className="font-mono" style={{ color: colors.dishTitle || (isDark ? '#FFFFFF' : '#020617') }}>{restaurant.settings.socialLinks.wifiPassword}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botón flotante simulado Asistente IA (FAB Circular 1:1) */}
          {restaurant?.settings?.aiAssistant?.enabled !== false && (
            <div className="absolute bottom-11 right-3 z-20">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl border border-amber-300/40 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950"
              >
                <Bot className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Barra de asistencia de mesa acoplada abajo (1:1 con comensal) */}
          {restaurant?.subscription?.plan !== 'essential' && restaurant?.settings?.enableTableAssistance !== false && (
            <div
              className="absolute bottom-0 inset-x-0 p-2.5 backdrop-blur-md border-t flex items-center justify-between text-[10px] z-20 transition-colors"
              style={{
                backgroundColor: colors.bottomBarBg || (isDark ? '#020617' : '#FFFFFF'),
                borderTopColor: colors.cardBorder,
                borderTopWidth: activeDinerStyle.id === 'street_food' ? '2px' : '1px'
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
                <div className="leading-tight">
                  <span
                    className="font-bold text-[10px] block"
                    style={{ color: colors.bottomBarText || (isDark ? '#F1F5F9' : '#020617') }}
                  >
                    Mesa 1
                  </span>
                  <span className="text-[8px] opacity-70 block" style={{ color: colors.bottomBarText || (isDark ? '#94A3B8' : '#52606D') }}>
                    Terraza
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onCallWaiter}
                  className="px-3 py-1.5 rounded-xl text-[9px] font-black shadow-md active:scale-95 transition-transform cursor-pointer flex items-center gap-1.5"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.accentText,
                    border: activeDinerStyle.id === 'street_food' ? '2px solid #020617' : undefined,
                    boxShadow: activeDinerStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                  }}
                >
                  <Bell className="w-3 h-3" />
                  <span>Llamar Mesero</span>
                </button>
              </div>
            </div>
          )}

          {/* Indicador inferior de barra de inicio iOS */}
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full pointer-events-none z-30"
            style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' }}
          />
        </div>
      </div>

      {/* Nota inferior del simulador + Botón probar Splash si está activo */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Vista interactiva 1:1 en tiempo real</span>
        </span>
        {introSplash.enabled && (
          <button
            type="button"
            onClick={() => {
              setShowSimSplash(true);
              setTimeout(() => setShowSimSplash(false), 1400);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-[11px] text-amber-300 font-bold transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>Probar Intro (1.2s)</span>
          </button>
        )}
      </div>
    </div>
  );
}

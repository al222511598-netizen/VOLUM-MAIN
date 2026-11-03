/**
 * DEFINICIÓN OFICIAL DE LOS 4 ESTILOS MAESTROS DE MENÚ PARA COMENSALES
 * Basado en: Análisis de Menús Digitales por Tipo de Cliente (Versión 3, Octubre 2026)
 * Estándar WCAG AA de contraste verificado.
 */

export const DINER_STYLES = {
  bistro_botanico: {
    id: 'bistro_botanico',
    number: 1,
    name: 'Bistró Botánico y Terraza Editorial',
    shortName: 'Bistró Botánico',
    tagline: 'Fresco y editorial: verde bosque, blanco hueso y ámbar',
    types: 'Restaurante de autor, cocina de huerto, contemporánea, mariscos finos, cafetería y brunch',
    isDark: false,
    
    // Paleta de Color Oficial (Página 8)
    colors: {
      bgCanvas: '#FDFBF7',         // Fondo de pantalla blanco hueso
      headerBg: '#0C281E',         // Cabecera verde bosque profundo
      headerText: '#FDFBF7',       // Texto en cabecera
      headerSubtitle: '#8FA89B',
      accent: '#D97706',           // Ámbar para botones clave y chips activos
      accentText: '#020617',       // Negro azabache para WCAG AA (6.33:1)
      titlePrice: '#0C281E',       // Verde bosque para títulos y precios
      dishTitle: '#0C281E',        // Verde bosque para nombres de platillos
      textBody: '#0C281E',
      textSecondary: '#52606D',    // Gris editorial
      cardBg: '#FFFFFF',           // Tarjeta blanca limpia
      cardBorder: '#E5E7EB',       // Borde suave
      searchBg: '#FFFFFF',
      searchBorder: '#E5E7EB',
      bottomBarBg: '#0C281E',      // Barra inferior verde bosque
      bottomBarText: '#FDFBF7',
      chipInactiveBg: '#FFFFFF',
      chipInactiveBorder: '#E5E7EB',
      chipInactiveText: '#52606D',
    },

    // Tipografías Oficiales
    fonts: {
      heading: "'Lora', serif",
      body: "'Inter', sans-serif",
      headingClass: 'font-serif font-bold',
      bodyClass: 'font-sans'
    },

    // Identidad Visual y Tarjetas
    cardStyle: 'rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-all',
    cardImageAspect: 'aspect-[4/3] rounded-t-2xl object-cover',
    badgeStyle: 'bg-[#0C281E] text-[#FDFBF7] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm',
    actionBtnStyle: 'font-bold rounded-xl hover:brightness-105 active:scale-95 shadow-sm',
  },

  lounge_nocturno: {
    id: 'lounge_nocturno',
    number: 2,
    name: 'Lounge Nocturno y Barra 3D',
    shortName: 'Lounge Nocturno',
    tagline: 'Cinematográfico: negro azabache, tarjetas de cristal y acento oro imperial',
    types: 'Coctelería, steakhouse nocturno, clubs, cocina japonesa y nikkei, restaurantes de hotel',
    isDark: true,

    // Paleta de Color Oficial (Página 9)
    colors: {
      bgCanvas: '#020617',         // Negro azabache
      headerBg: '#020617',
      headerText: '#F3F4F6',
      headerSubtitle: '#94A3B8',
      accent: '#F59E0B',           // Oro imperial (9.39:1 con negro)
      accentText: '#020617',
      titlePrice: '#F59E0B',       // Oro para precios
      dishTitle: '#F3F4F6',        // Blanco perla para nombres de platillo
      textBody: '#E2E8F0',
      textSecondary: '#94A3B8',
      cardBg: '#0F172A',           // Cristal / Slate oscuro
      cardBorder: 'rgba(245, 158, 11, 0.25)', // Borde dorado sutil
      searchBg: '#0B0F19',
      searchBorder: 'rgba(245, 158, 11, 0.3)',
      bottomBarBg: '#0F172A',
      bottomBarText: '#F3F4F6',
      chipInactiveBg: '#0B0F19',
      chipInactiveBorder: 'rgba(148, 163, 184, 0.2)',
      chipInactiveText: '#94A3B8',
      glowCyan: '#22D3EE'
    },

    // Tipografías Oficiales
    fonts: {
      heading: "'Cinzel', serif",
      body: "'Inter', sans-serif",
      headingClass: 'font-serif tracking-widest uppercase font-semibold',
      bodyClass: 'font-sans'
    },

    // Identidad Visual y Tarjetas Glassmorphism
    cardStyle: 'rounded-3xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl shadow-black/80 hover:border-amber-500/40 transition-all',
    cardImageAspect: 'aspect-[4/3] rounded-t-3xl object-cover',
    badgeStyle: 'bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-md',
    actionBtnStyle: 'font-black rounded-2xl hover:brightness-110 active:scale-95 shadow-lg',
  },

  trattoria_artesanal: {
    id: 'trattoria_artesanal',
    number: 3,
    name: 'Trattoria y Horno Artesanal',
    shortName: 'Trattoria Artesanal',
    tagline: 'Cálido y artesanal: terracota y cobre sobre blanco hueso, marcos finos',
    types: 'Pizzería de masa madre, trattorias italianas, panaderías rústicas, cafeterías clásicas',
    isDark: false,

    // Paleta de Color Oficial (Página 10)
    colors: {
      bgCanvas: '#FDFBF7',         // Blanco hueso
      headerBg: '#FDFBF7',
      headerText: '#7C2D12',       // Terracota intenso
      headerSubtitle: '#7A5C4A',
      accent: '#C2410C',           // Cobre artesanal
      accentText: '#FFFFFF',       // Blanco cumple WCAG AA (5.18:1)
      titlePrice: '#C2410C',       // Cobre
      dishTitle: '#7C2D12',        // Terracota
      textBody: '#3B1A0B',         // Marrón tostado legible
      textSecondary: '#7A5C4A',
      cardBg: '#FDFBF7',
      cardBorder: '#C2410C',       // Marco fino artesanal
      searchBg: '#FFFFFF',
      searchBorder: 'rgba(194, 65, 12, 0.35)',
      bottomBarBg: '#FDFBF7',      // Barra blanco hueso artesanal
      bottomBarText: '#7C2D12',
      bottomBarSecondaryText: '#7A5C4A',
      chipInactiveBg: '#FFFFFF',
      chipInactiveBorder: 'rgba(194, 65, 12, 0.25)',
      chipInactiveText: '#7A5C4A',
    },

    // Tipografías Oficiales
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Outfit', sans-serif",
      headingClass: 'font-serif font-bold italic',
      bodyClass: 'font-sans'
    },

    // Identidad Visual y Tarjetas Artesanales
    cardStyle: 'rounded-xl border bg-[#FDFBF7] shadow-none transition-all',
    cardImageAspect: 'aspect-[4/3] rounded-t-xl object-cover',
    badgeStyle: 'bg-[#7C2D12] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm',
    actionBtnStyle: 'font-bold rounded-xl active:scale-95 shadow-sm',
  },

  street_food: {
    id: 'street_food',
    number: 4,
    name: 'Street Food y Gastrobar',
    shortName: 'Street Food',
    tagline: 'Audaz y juvenil: negro azabache, naranja flama y amarillo eléctrico',
    types: 'Hamburgueserías smash, taquerías gourmet, cervecerías, gastrobars, food trucks',
    isDark: false,

    // Paleta de Color Oficial Neo-Brutalism & Street Food (Página 11)
    colors: {
      bgCanvas: '#FFFFFF',         // Blanco fondo limpio
      headerBg: '#FFFFFF',         // Blanco limpio neo-brutalista
      headerText: '#020617',       // Negro contundente
      headerSubtitle: '#52606D',
      accent: '#EA580C',           // Naranja flama
      accentText: '#FFFFFF',       // Blanco nítido sobre naranja
      titlePrice: '#EA580C',       // Naranja flama
      dishTitle: '#020617',        // Negro contundente
      textBody: '#020617',
      textSecondary: '#52606D',
      cardBg: '#FFFFFF',
      cardBorder: '#020617',       // Borde negro marcado 2px
      searchBg: '#FFFFFF',
      searchBorder: '#020617',
      bottomBarBg: '#FFFFFF',      // Barra blanca limpia con acento naranja y borde negro
      bottomBarText: '#020617',
      bottomBarSecondaryText: '#52606D',
      chipInactiveBg: '#FFFFFF',
      chipInactiveBorder: '#020617',
      chipInactiveText: '#020617',
      yellowTag: '#EAB308',        // Amarillo eléctrico
    },

    // Tipografías Oficiales
    fonts: {
      heading: "'Plus Jakarta Sans', sans-serif",
      body: "'Inter', sans-serif",
      headingClass: 'font-sans font-extrabold tracking-tight uppercase',
      bodyClass: 'font-sans'
    },

    // Identidad Visual Brutalista / Pop
    cardStyle: 'rounded-2xl border-2 border-[#020617] bg-white transition-all',
    cardImageAspect: 'aspect-[4/3] rounded-t-xl object-cover border-b-2 border-[#020617]',
    badgeStyle: 'bg-[#EAB308] text-[#020617] text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg border border-[#020617] shadow-sm',
    actionBtnStyle: 'text-[#020617] font-black rounded-xl border-2 border-[#020617] shadow-[2px_2px_0px_#020617] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  }
};

export const DEFAULT_DINER_STYLE_ID = 'lounge_nocturno';

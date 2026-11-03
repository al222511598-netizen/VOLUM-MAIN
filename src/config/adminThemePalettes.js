import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export const ADMIN_THEME_STORAGE_KEY = 'volum_admin_palette';

export const ADMIN_THEMES = {
  dark_luxury: {
    id: 'dark_luxury',
    name: 'Dark Luxury Gastronomy',
    shortName: 'Dark Luxury',
    tagline: 'Alta Cocina Nocturna, Cristal y Oro Gastronómico',
    isLight: false,
    baseMode: 'dark',
    themeClass: 'theme-dark-luxury admin-theme-dark',
    fontHeading: 'font-playfair',
    fontBody: 'font-sans',
    primaryHex: '#D97706',
    accentHex: '#F59E0B',
    bgCanvas: '#020617',
    bgSidebar: '#0B0F17',
    bgCard: '#0F172A',
    bgCardSubtle: '#1E293B',
    bgInput: '#020617',
    border: 'border-slate-800',
    borderSubtle: 'border-slate-800/80',
    borderFocus: 'focus:border-amber-500',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    textAccent: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    buttonPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
    buttonActive: 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black',
    buttonInactive: 'text-slate-400 hover:bg-slate-800/80 hover:text-white',
    sidebarClass: 'bg-slate-950 border-r border-slate-800 text-slate-300',
    headerClass: 'bg-slate-900/95 border-b border-slate-800 text-slate-200',
    mainClass: 'bg-slate-950 text-slate-100',
    cardClass: 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-xl',
    cardSubtleClass: 'bg-slate-950 border border-slate-800 text-slate-200',
    inputClass: 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none',
    dotHex: '#D97706'
  },
  light_pure: {
    id: 'light_pure',
    name: 'Pure Minimalist White',
    shortName: 'Blanco Puro',
    tagline: 'Luz Diurna, Claridad Nívea y Estilo Apple / Notion',
    isLight: true,
    baseMode: 'light',
    themeClass: 'theme-pure-white admin-theme-light',
    fontHeading: 'font-jakarta',
    fontBody: 'font-sans',
    primaryHex: '#0284C7',
    accentHex: '#0284C7',
    bgCanvas: '#F8FAFC',
    bgSidebar: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#F1F5F9',
    bgInput: '#FFFFFF',
    border: 'border-slate-200',
    borderSubtle: 'border-slate-200/90',
    borderFocus: 'focus:border-sky-600',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    textAccent: 'text-sky-600',
    badgeClass: 'bg-sky-50 border-sky-200 text-sky-700 font-bold',
    buttonPrimary: 'bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-600/20',
    buttonSecondary: 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm',
    buttonActive: 'bg-sky-600 text-white shadow-md shadow-sky-600/20 font-bold',
    buttonInactive: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    sidebarClass: 'bg-white border-r border-slate-200 text-slate-700 shadow-sm',
    headerClass: 'bg-white/95 border-b border-slate-200 text-slate-800 shadow-sm',
    mainClass: 'bg-slate-50 text-slate-900',
    cardClass: 'bg-white border border-slate-200 text-slate-900 shadow-sm',
    cardSubtleClass: 'bg-slate-50 border border-slate-200 text-slate-800',
    inputClass: 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:outline-none shadow-sm',
    dotHex: '#0284C7'
  },
  glass_obsidian: {
    id: 'glass_obsidian',
    name: 'Glassmorphism Frosted Obsidian',
    shortName: 'Frosted Obsidian',
    tagline: 'Cristal Ahumado al 15%, Fondo Negro Obsidiana y Neón Púrpura',
    isLight: false,
    baseMode: 'dark',
    themeClass: 'theme-glass-obsidian admin-theme-dark',
    fontHeading: 'font-space',
    fontBody: 'font-inter',
    primaryHex: '#6C5CE7',
    accentHex: '#A29BFE',
    bgCanvas: '#000000',
    bgSidebar: 'rgba(12, 14, 24, 0.65)',
    bgCard: 'rgba(22, 23, 38, 0.55)',
    bgCardSubtle: 'rgba(10, 11, 20, 0.7)',
    bgInput: 'rgba(18, 20, 32, 0.8)',
    border: 'border-white/12',
    borderSubtle: 'border-white/5',
    borderFocus: 'focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    textAccent: 'text-[#A29BFE]',
    badgeClass: 'bg-[#6C5CE7]/20 border-[#6C5CE7]/45 text-[#A29BFE] font-bold backdrop-blur-md',
    buttonPrimary: 'bg-gradient-to-r from-[#6C5CE7] to-[#5844D6] hover:from-[#7D6EF0] hover:to-[#6C5CE7] text-white font-bold shadow-lg shadow-[#6C5CE7]/35 border border-white/20',
    buttonSecondary: 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 backdrop-blur-md',
    buttonActive: 'bg-gradient-to-r from-[#6C5CE7]/35 to-[#5844D6]/20 border border-[#6C5CE7]/70 text-white font-bold shadow-md shadow-[#6C5CE7]/30 backdrop-blur-md',
    buttonInactive: 'text-slate-400 hover:bg-white/5 hover:text-white',
    sidebarClass: 'bg-[#0B0D18]/70 backdrop-blur-2xl border-r border-white/10 text-slate-300 shadow-2xl',
    headerClass: 'bg-[#0B0D18]/85 backdrop-blur-2xl border-b border-white/10 text-slate-100 shadow-lg',
    mainClass: 'bg-[#000000] text-slate-100',
    cardClass: 'bg-white/[0.05] backdrop-blur-2xl border border-white/12 text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.6)]',
    cardSubtleClass: 'bg-white/[0.025] backdrop-blur-md border border-white/5 text-slate-200',
    inputClass: 'bg-slate-950/70 backdrop-blur-md border border-white/12 text-white placeholder-slate-400 focus:border-[#6C5CE7] focus:outline-none',
    dotHex: '#6C5CE7'
  },
  neobrutalism_urban: {
    id: 'neobrutalism_urban',
    name: 'Neo-Brutalism & Street Food',
    shortName: 'Street Brutalism',
    tagline: 'Burgers & Gastrobar Urbano: Bordes Marcados y Naranja Flama',
    isLight: true,
    baseMode: 'light',
    themeClass: 'theme-admin-neobrutalism admin-theme-light',
    fontHeading: 'font-jakarta',
    fontBody: 'font-sans',
    primaryHex: '#FF4D00',
    accentHex: '#FBBF24',
    bgCanvas: '#FFFBEB',
    bgSidebar: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#FEF3C7',
    bgInput: '#FFFFFF',
    border: 'border-2 border-slate-900',
    borderSubtle: 'border-2 border-slate-900/80',
    borderFocus: 'focus:border-black focus:ring-2 focus:ring-black',
    textPrimary: 'text-slate-950',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    badgeClass: 'bg-[#FF4D00] text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]',
    buttonPrimary: 'bg-[#FF4D00] hover:bg-[#E04400] text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    buttonSecondary: 'bg-white hover:bg-amber-50 text-slate-950 font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]',
    buttonActive: 'bg-[#FFE600] text-slate-950 font-black border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]',
    buttonInactive: 'text-slate-800 hover:bg-amber-100/80 hover:text-slate-950 font-bold border-2 border-transparent transition-all',
    sidebarClass: 'bg-white border-r-2 border-slate-900 text-slate-900 shadow-[4px_0px_0px_rgba(15,23,42,0.08)]',
    headerClass: 'bg-white border-b-2 border-slate-900 text-slate-950 shadow-sm',
    mainClass: 'bg-[#FFFBEB] text-slate-950',
    cardClass: 'bg-white border-2 border-slate-900 text-slate-950 shadow-[4px_4px_0px_#0F172A]',
    cardSubtleClass: 'bg-[#FEF3C7] border-2 border-slate-900 text-slate-950 shadow-[3px_3px_0px_#0F172A]',
    inputClass: 'bg-white border-2 border-slate-900 text-slate-950 placeholder-slate-400 focus:border-black focus:outline-none shadow-[2px_2px_0px_#000]',
    dotHex: '#FF4D00'
  },
  midnight_velvet: {
    id: 'midnight_velvet',
    name: 'Midnight Velvet & Ruby Lounge',
    shortName: 'Borgoña & Cava',
    tagline: 'Cavas de Vino, Carnes Maduradas y Coctelería de Autor',
    isLight: false,
    baseMode: 'dark',
    themeClass: 'theme-midnight-velvet admin-theme-dark',
    fontHeading: 'font-cormorant',
    fontBody: 'font-sans',
    primaryHex: '#BE185D',
    accentHex: '#FB7185',
    bgCanvas: '#0F080E',
    bgSidebar: '#170D16',
    bgCard: '#221321',
    bgCardSubtle: '#2F1A2D',
    bgInput: '#120A11',
    border: 'border-[#5A2545]/45',
    borderSubtle: 'border-[#5A2545]/30',
    borderFocus: 'focus:border-pink-500',
    textPrimary: 'text-[#FDF2F8]',
    textSecondary: 'text-[#F472B6]',
    textMuted: 'text-[#A89BA7]',
    textAccent: 'text-pink-400',
    badgeClass: 'bg-pink-500/15 border-pink-500/30 text-pink-300 font-bold',
    buttonPrimary: 'bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-md shadow-pink-600/30',
    buttonSecondary: 'bg-[#2F1A2D] hover:bg-[#3E233C] text-[#FDF2F8] border-[#5A2545]',
    buttonActive: 'bg-pink-600 text-white shadow-md shadow-pink-600/30 font-bold',
    buttonInactive: 'text-[#F472B6]/80 hover:bg-[#2F1A2D] hover:text-[#FDF2F8]',
    sidebarClass: 'bg-[#170D16] border-r border-[#5A2545]/40 text-[#F472B6]',
    headerClass: 'bg-[#170D16]/95 border-b border-[#5A2545]/40 text-[#FDF2F8]',
    mainClass: 'bg-[#0F080E] text-[#FDF2F8]',
    cardClass: 'bg-[#221321] border border-[#5A2545]/45 text-[#FDF2F8] shadow-2xl',
    cardSubtleClass: 'bg-[#170D16] border border-[#5A2545]/35 text-[#FDF2F8]',
    inputClass: 'bg-[#120A11] border border-[#5A2545]/60 text-white placeholder-[#8F7C8D] focus:border-pink-500 focus:outline-none',
    dotHex: '#BE185D'
  },
  cyber_titanium: {
    id: 'cyber_titanium',
    name: 'Cyber Titanium & Neo-Bistro',
    shortName: 'Cyber Titanium',
    tagline: 'Dark Kitchens, Cristal Ahumado y Neón Cian',
    isLight: false,
    baseMode: 'dark',
    themeClass: 'theme-cyber-titanium admin-theme-dark',
    fontHeading: 'font-jakarta',
    fontBody: 'font-sans',
    primaryHex: '#06B6D4',
    accentHex: '#8B5CF6',
    bgCanvas: '#030712',
    bgSidebar: '#080E1A',
    bgCard: '#0F172A',
    bgCardSubtle: '#1E293B',
    bgInput: '#050B14',
    border: 'border-cyan-500/30',
    borderSubtle: 'border-cyan-500/20',
    borderFocus: 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400',
    textPrimary: 'text-white',
    textSecondary: 'text-cyan-200/80',
    textMuted: 'text-slate-400',
    textAccent: 'text-cyan-400',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    buttonSecondary: 'bg-[#0F172A] hover:bg-[#1E293B] text-cyan-200 border-cyan-500/30',
    buttonActive: 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)] font-black',
    buttonInactive: 'text-slate-400 hover:bg-[#1E293B] hover:text-cyan-200',
    sidebarClass: 'bg-[#080E1A] border-r border-cyan-500/25 text-cyan-100',
    headerClass: 'bg-[#080E1A]/95 border-b border-cyan-500/25 text-white',
    mainClass: 'bg-[#030712] text-white',
    cardClass: 'bg-[#0F172A]/90 border border-cyan-500/30 text-white shadow-[0_4px_25px_rgba(6,182,212,0.1)] backdrop-blur-md',
    cardSubtleClass: 'bg-[#080E1A] border border-cyan-500/20 text-slate-200',
    inputClass: 'bg-[#050B14] border border-cyan-500/40 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none',
    dotHex: '#06B6D4'
  }
};

// Compatibilidad retroactiva: si el usuario tenía seleccionado nordic_warm, mapear automáticamente a glass_obsidian
ADMIN_THEMES.nordic_warm = ADMIN_THEMES.glass_obsidian;

export const ADMIN_THEME_LIST = [
  ADMIN_THEMES.dark_luxury,
  ADMIN_THEMES.light_pure,
  ADMIN_THEMES.glass_obsidian,
  ADMIN_THEMES.neobrutalism_urban,
  ADMIN_THEMES.midnight_velvet,
  ADMIN_THEMES.cyber_titanium
];

export function getSavedAdminThemeKey() {
  if (typeof window === 'undefined') return 'dark_luxury';
  try {
    const saved = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
    if (saved && ADMIN_THEMES[saved]) {
      return saved;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return 'dark_luxury';
}

export function useAdminTheme(restaurantTheme = null) {
  const [themeKey, setThemeKeyState] = useState(() => getSavedAdminThemeKey());
  const [customHex, setCustomHex] = useState('#D97706');
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sincronizar inicialmente si el restaurante ya trae un adminThemeKey guardado en MongoDB
  useEffect(() => {
    if (restaurantTheme?.adminThemeKey && ADMIN_THEMES[restaurantTheme.adminThemeKey]) {
      const saved = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
      if (!saved) {
        setThemeKeyState(restaurantTheme.adminThemeKey);
      }
    }
  }, [restaurantTheme]);

  const setThemeKey = useCallback((newKey) => {
    if (!ADMIN_THEMES[newKey]) return;
    setThemeKeyState(newKey);
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, newKey);
      window.dispatchEvent(new CustomEvent('volum-admin-theme-change', { detail: newKey }));
    } catch (e) {
      // Ignore storage error
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === ADMIN_THEME_STORAGE_KEY && e.newValue && ADMIN_THEMES[e.newValue]) {
        setThemeKeyState(e.newValue);
      }
    };
    const handleCustom = (e) => {
      if (e.detail && ADMIN_THEMES[e.detail]) {
        setThemeKeyState(e.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('volum-admin-theme-change', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('volum-admin-theme-change', handleCustom);
    };
  }, []);

  const currentTheme = useMemo(() => {
    return ADMIN_THEMES[themeKey] || ADMIN_THEMES.dark_luxury;
  }, [themeKey]);

  // Guardar permanentemente el tema exclusivo de la consola Admin en MongoDB sin alterar el menú del comensal
  const saveThemeToBackend = useCallback(async (token) => {
    if (!token) return { success: false, error: 'No token' };
    setIsSavingTheme(true);
    setSaveSuccess(false);
    try {
      const selected = ADMIN_THEMES[themeKey] || ADMIN_THEMES.dark_luxury;
      await axios.put('/api/v1/admin/theme', {
        adminThemeKey: selected.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return { success: true };
    } catch (err) {
      console.error('Error guardando tema en MongoDB:', err);
      return { success: false, error: err };
    } finally {
      setIsSavingTheme(false);
    }
  }, [themeKey]);

  return {
    themeKey,
    setThemeKey,
    currentTheme,
    customHex,
    setCustomHex,
    isSavingTheme,
    saveSuccess,
    saveThemeToBackend
  };
}

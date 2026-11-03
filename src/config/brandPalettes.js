import { useState, useEffect, useCallback } from 'react';

export const BRAND_PALETTE_STORAGE_KEY = 'volum_brand_palette';

export const BRAND_PALETTES = {
  nordic: {
    id: 'nordic',
    name: 'Nordic Bistro',
    tagline: 'Editorial & Botánico',
    dot: '#2D4030',
    primaryHex: '#2D4030',
    secondaryHex: '#D89B00',
    accentHex: '#D89B00',
    heroImage: '/images/nordic-bistro-banner.jpg',
    heroOverlay: 'from-[#F8F6F0]/90 via-[#F8F6F0]/70 to-[#F8F6F0]',
    isLight: true,
    fontHeading: 'font-playfair',
    fontBody: 'font-sans',
    themeClass: 'theme-nordic',
    headingCase: 'normal-case',
    // Navbar
    navBg: 'bg-[#F8F6F0]/90 border-b border-[#191919]/10 text-[#191919]',
    navLink: 'text-[#555555] hover:text-[#191919]',
    logoText: 'text-[#191919]',
    logoAccent: 'text-[#2D4030]',
    loginBtn: 'bg-white hover:bg-slate-100 border border-[#191919]/15 text-[#191919]',
    paletteBtn: 'bg-white hover:bg-slate-100 border border-[#191919]/15 text-[#191919]',
    ctaBtn: 'bg-[#2D4030] hover:bg-[#1f2d22] text-white shadow-md shadow-[#2D4030]/20',
    // Sections & Cards
    sectionBg: 'bg-[#F8F6F0]',
    sectionBorder: 'border-[#191919]/10',
    cardBg: 'bg-white border border-[#191919]/10 text-[#191919] shadow-sm',
    cardSubtleBg: 'bg-[#F1EFEA] border border-[#191919]/10 text-[#191919]',
    cardRecommended: 'bg-white border-2 border-[#2D4030] shadow-md text-[#191919]',
    textPrimary: 'text-[#191919]',
    textMuted: 'text-[#666666]',
    textAccent: 'text-[#2D4030]',
    badgeClass: 'bg-[#2D4030]/10 border border-[#2D4030]/25 text-[#2D4030]',
    buttonPrimary: 'bg-[#2D4030] hover:bg-[#1f2d22] text-white shadow-md shadow-[#2D4030]/20',
    buttonSecondary: 'bg-white hover:bg-slate-50 border border-[#191919]/15 text-[#191919]',
    inputBg: 'bg-[#F1EFEA] border border-[#191919]/15 text-[#191919] placeholder-[#999999] focus:border-[#2D4030]',
    checkColor: 'text-[#2D4030]',
    dotClass: 'bg-[#2D4030] text-white',
    footerBg: 'bg-[#F8F6F0] border-t border-[#191919]/10 text-[#666666]'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Deep Obsidian',
    tagline: 'Lujo Nocturno & Cobre',
    dot: '#C87A51',
    primaryHex: '#C87A51',
    secondaryHex: '#9E5B37',
    accentHex: '#E8A87C',
    heroImage: '/images/obsidian-cocktail-banner.jpg',
    heroOverlay: 'from-[#121113]/95 via-[#121113]/85 to-[#121113]',
    isLight: false,
    fontHeading: 'font-playfair',
    fontBody: 'font-outfit',
    themeClass: 'theme-obsidian',
    headingCase: 'uppercase tracking-wider',
    // Navbar
    navBg: 'bg-[#121113]/90 border-b border-[#C87A51]/20 text-[#F0ECE1]',
    navLink: 'text-[#9E9B93] hover:text-[#F0ECE1]',
    logoText: 'text-[#F0ECE1]',
    logoAccent: 'text-[#E8A87C]',
    loginBtn: 'bg-[#1C1A1E] hover:bg-[#252228] border border-[#C87A51]/30 text-[#F0ECE1]',
    paletteBtn: 'bg-[#1C1A1E] hover:bg-[#252228] border border-[#C87A51]/30 text-[#F0ECE1]',
    ctaBtn: 'bg-[#C87A51] hover:bg-[#b0653f] text-white shadow-lg shadow-[#C87A51]/25',
    // Sections & Cards
    sectionBg: 'bg-[#121113]',
    sectionBorder: 'border-[#C87A51]/20',
    cardBg: 'bg-[#1C1A1E] border border-[#C87A51]/25 text-[#F0ECE1] shadow-2xl',
    cardSubtleBg: 'bg-[#161418] border border-[#C87A51]/20 text-[#F0ECE1]',
    cardRecommended: 'bg-[#1C1A1E] border-2 border-[#C87A51] shadow-xl shadow-[#C87A51]/20 text-[#F0ECE1]',
    textPrimary: 'text-[#F0ECE1]',
    textMuted: 'text-[#9E9B93]',
    textAccent: 'text-[#E8A87C]',
    badgeClass: 'bg-[#C87A51]/15 border border-[#C87A51]/40 text-[#E8A87C]',
    buttonPrimary: 'bg-[#C87A51] hover:bg-[#b0653f] text-white shadow-lg shadow-[#C87A51]/25',
    buttonSecondary: 'bg-[#1C1A1E] hover:bg-[#252228] border border-[#C87A51]/30 text-[#F0ECE1]',
    inputBg: 'bg-[#161418] border border-[#C87A51]/30 text-[#F0ECE1] placeholder-[#777777] focus:border-[#C87A51]',
    checkColor: 'text-[#E8A87C]',
    dotClass: 'bg-[#C87A51] text-white',
    footerBg: 'bg-[#121113] border-t border-[#C87A51]/20 text-[#9E9B93]'
  },
  neobrutalism: {
    id: 'neobrutalism',
    name: 'Neobrutalism',
    tagline: 'High-Contrast Tech',
    dot: '#FF4D00',
    primaryHex: '#FF4D00',
    secondaryHex: '#CC3E00',
    accentHex: '#FF7700',
    heroImage: '/images/hero-steak-banner.jpg',
    heroOverlay: 'from-[#050505]/95 via-[#050505]/85 to-[#050505]',
    isLight: false,
    fontHeading: 'font-jakarta',
    fontBody: 'font-sans',
    themeClass: 'theme-neobrutalism',
    headingCase: 'normal-case',
    // Navbar
    navBg: 'bg-[#050505]/90 border-b border-[#222222] text-white',
    navLink: 'text-slate-300 hover:text-white',
    logoText: 'text-white',
    logoAccent: 'text-orange-500',
    loginBtn: 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200',
    paletteBtn: 'bg-[#12141a] hover:bg-[#1a1e27] border border-slate-800 text-slate-200',
    ctaBtn: 'bg-[#FF4D00] hover:bg-[#e04400] text-white shadow-lg shadow-orange-500/30',
    // Sections & Cards
    sectionBg: 'bg-[#050505]',
    sectionBorder: 'border-[#222222]',
    cardBg: 'bg-[#111111] border border-[#222222] text-white shadow-2xl',
    cardSubtleBg: 'bg-[#0a0a0a] border border-[#222222] text-white',
    cardRecommended: 'bg-[#111111] border-2 border-orange-500 shadow-xl shadow-orange-500/20 text-white',
    textPrimary: 'text-white',
    textMuted: 'text-[#888888]',
    textAccent: 'text-orange-400',
    badgeClass: 'bg-orange-500/10 border border-orange-500/30 text-orange-400',
    buttonPrimary: 'bg-[#FF4D00] hover:bg-[#e04400] text-white shadow-lg shadow-orange-500/30',
    buttonSecondary: 'bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-white',
    inputBg: 'bg-[#0a0a0a] border border-[#222222] text-white placeholder-slate-500 focus:border-orange-500',
    checkColor: 'text-orange-400',
    dotClass: 'bg-[#FF4D00] text-white',
    footerBg: 'bg-[#050505] border-t border-[#222222] text-[#888888]'
  }
};

export function getSavedPaletteKey() {
  if (typeof window === 'undefined') return 'neobrutalism';
  try {
    const saved = localStorage.getItem(BRAND_PALETTE_STORAGE_KEY);
    if (saved && BRAND_PALETTES[saved]) {
      return saved;
    }
  } catch (e) {
    // Ignore storage access errors
  }
  return 'neobrutalism';
}

export function useBrandPalette() {
  const [selectedPaletteKey, setSelectedPaletteKeyState] = useState(() => getSavedPaletteKey());

  const setSelectedPaletteKey = useCallback((newKey) => {
    if (!BRAND_PALETTES[newKey]) return;
    setSelectedPaletteKeyState(newKey);
    try {
      localStorage.setItem(BRAND_PALETTE_STORAGE_KEY, newKey);
      window.dispatchEvent(new CustomEvent('volum-palette-change', { detail: newKey }));
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === BRAND_PALETTE_STORAGE_KEY && e.newValue && BRAND_PALETTES[e.newValue]) {
        setSelectedPaletteKeyState(e.newValue);
      }
    };
    const handleCustom = (e) => {
      if (e.detail && BRAND_PALETTES[e.detail]) {
        setSelectedPaletteKeyState(e.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('volum-palette-change', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('volum-palette-change', handleCustom);
    };
  }, []);

  const currentPalette = BRAND_PALETTES[selectedPaletteKey] || BRAND_PALETTES.neobrutalism;

  return {
    selectedPaletteKey,
    setSelectedPaletteKey,
    currentPalette
  };
}

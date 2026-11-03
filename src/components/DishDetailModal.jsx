import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Box, Video, ShoppingBag, Plus, Minus, Flame, Wheat, Leaf, Sparkles, Check } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import AllergenBadge from './AllergenBadge';

/**
 * MODAL / BOTTOM SHEET DE DETALLE DE PLATILLO
 * Cumple fielmente las especificaciones de las páginas 8 a 12 del PDF.
 * Soporta Modo Catálogo (Consulta / WebAR) y Modo Pedido Activo (Comanda / Notas).
 */
export default function DishDetailModal({
  isOpen,
  onClose,
  dish,
  styleConfig,
  currentLang = 'es',
  onToggleLang,
  isOrderMode = false,
  currency = 'MXN',
  onAddToCart,
  onOpen3D,
  tableNumber = '1',
  tableZone = 'Principal',
  onRequestWaiter
}) {
  const [quantity, setQuantity] = useState(1);
  const [chefNotes, setChefNotes] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setChefNotes('');
      setAddedToast(false);
      // Evitar scroll del fondo
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, dish]);

  if (!isOpen || !dish) return null;

  const colors = styleConfig?.colors || {};
  const fonts = styleConfig?.fonts || {};
  const isDark = styleConfig?.isDark ?? true;

  const t = {
    es: {
      close: 'Cerrar',
      back: 'Regresar',
      descTitle: 'Descripción editorial',
      ingredientsTitle: 'Ingredientes',
      allergensTitle: 'Alérgenos y sellos',
      chefNotesPlaceholder: 'Notas al chef (ej: sin cebolla, término medio)...',
      addToOrder: 'Agregar al pedido',
      view3D: 'Ver en 3D (Web-AR)',
      viewReel: 'Ver reel gastronómico',
      addedSuccess: '¡Agregado a tu pedido!',
      waiter: 'Mesero',
      spicyLevel: 'Nivel de Picante',
      specialty: 'Especialidad',
      table: 'Mesa',
    },
    en: {
      close: 'Close',
      back: 'Back',
      descTitle: 'Chef Description',
      ingredientsTitle: 'Ingredients',
      allergensTitle: 'Allergens & Badges',
      chefNotesPlaceholder: 'Notes for the chef (e.g. no onions, medium rare)...',
      addToOrder: 'Add to order',
      view3D: 'View in 3D (WebAR)',
      viewReel: 'Watch Food Reel',
      addedSuccess: 'Added to your order!',
      waiter: 'Waiter',
      spicyLevel: 'Spiciness Level',
      specialty: 'Specialty',
      table: 'Table',
    }
  }[currentLang] || {};

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(dish, quantity, chefNotes);
      setAddedToast(true);
      setTimeout(() => {
        setAddedToast(false);
        onClose();
      }, 1000);
    }
  };

  // Badge contextual según estilo
  const badgeLabel = dish.badge || (dish.isFeatured ? 'DESTACADO' : 'ESPECIALIDAD');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop con desenfoque cinematográfico */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor Modal / Bottom Sheet */}
      <div
        className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col no-scrollbar transition-transform duration-300 ease-out border"
        style={{
          backgroundColor: colors.cardBg || (isDark ? '#0F172A' : '#FFFFFF'),
          borderColor: colors.cardBorder || (isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'),
          fontFamily: fonts.body || 'inherit',
          color: colors.textBody || (isDark ? '#F1F5F9' : '#020617')
        }}
      >
        {/* Barra superior flotante con Botón Atrás y Selector ES | EN */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 backdrop-blur-md bg-opacity-80 border-b border-white/5"
          style={{ backgroundColor: colors.headerBg ? `${colors.headerBg}E6` : undefined }}
        >
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
              color: colors.headerText || (isDark ? '#FFFFFF' : '#020617')
            }}
            title={t.back}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Selector de Idioma ES | EN oficial del PDF */}
          <div className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full border border-white/20"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: colors.headerText || (isDark ? '#FFFFFF' : '#020617')
            }}
          >
            <button
              type="button"
              onClick={() => onToggleLang && onToggleLang('es')}
              className={`px-2 py-0.5 rounded-full transition-colors ${currentLang === 'es' ? 'bg-amber-500 text-slate-950 font-black' : 'opacity-70 hover:opacity-100'}`}
            >
              ES
            </button>
            <span className="opacity-40">|</span>
            <button
              type="button"
              onClick={() => onToggleLang && onToggleLang('en')}
              className={`px-2 py-0.5 rounded-full transition-colors ${currentLang === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'opacity-70 hover:opacity-100'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Portada Multimedia: Fotografía de Alta Definición */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-900 shrink-0 overflow-hidden">
          {dish.imageUrl ? (
            <img
              src={getMediaUrl(dish.imageUrl)}
              alt={dish.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600 gap-2">
              <Box className="w-12 h-12" />
              <span className="text-xs uppercase font-bold tracking-widest">FOTO DEL PLATILLO</span>
            </div>
          )}

          {/* Sombra de protección degradada */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Badge Destacado Oficial (Páginas 8-11) */}
          <div className="absolute bottom-3 left-4">
            <span className={styleConfig?.badgeStyle || 'px-3 py-1 rounded-full text-xs font-bold'}>
              {badgeLabel}
            </span>
          </div>

          {/* Botón flotante para abrir en WebAR 3D si existe */}
          {dish.is3D && (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpen3D) onOpen3D(dish);
              }}
              style={{ backgroundColor: colors.accent || '#D97706', color: colors.accentText || '#020617' }}
              className="absolute bottom-3 right-4 px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xl active:scale-95 transition-all"
            >
              <Box className="w-4 h-4" />
              <span>{t.view3D}</span>
            </button>
          )}
        </div>

        {/* Cuerpo de la Información */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Nombre y Precio */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2
                className={`text-xl sm:text-2xl font-black leading-tight mb-1`}
                style={{
                  fontFamily: fonts.heading || 'inherit',
                  color: colors.dishTitle || colors.titlePrice || (isDark ? '#F3F4F6' : '#0C281E')
                }}
              >
                {dish.name}
              </h2>
              {dish.portion && (
                <span className="text-xs font-medium opacity-70">
                  {dish.portion}
                </span>
              )}
              {dish.availableSchedules && !dish.availableSchedules.includes('all') && (
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {dish.availableSchedules.map((sId) => {
                    const label = sId === 'breakfast' ? '☕ Desayunos' : sId === 'lunch' ? '🍽️ Comidas' : sId === 'dinner' ? '🍷 Cenas' : sId;
                    return (
                      <span
                        key={sId}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <span
                className="text-2xl sm:text-3xl font-black tabular-nums"
                style={{ color: colors.titlePrice || colors.accent || '#D97706' }}
              >
                ${dish.price}
              </span>
              <span className="block text-[11px] font-bold opacity-60 uppercase">
                {currency}
              </span>
            </div>
          </div>

          {/* 1. Descripción Editorial */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5">
              {t.descTitle}
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              {dish.description || 'Una creación gastronómica cuidadosamente elaborada con ingredientes seleccionados y maridaje de autor.'}
            </p>
          </div>

          {/* 2. Lista de Ingredientes Desglosados */}
          {dish.ingredients && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5">
                {t.ingredientsTitle}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80 italic">
                {Array.isArray(dish.ingredients) ? dish.ingredients.join(', ') : dish.ingredients}
              </p>
            </div>
          )}

          {/* 3. Alérgenos y Sellos */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
              {t.allergensTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {dish.isVegan && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>Vegano</span>
                </span>
              )}
              {dish.isGlutenFree && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Wheat className="w-3 h-3 text-amber-400" />
                  <span>Gluten Free</span>
                </span>
              )}
              {dish.spicyLevel > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>{t.spicyLevel}: {'🌶️'.repeat(Math.min(3, dish.spicyLevel))}</span>
                </span>
              )}
              {Array.isArray(dish.allergens) && dish.allergens.map((alg) => (
                <AllergenBadge key={alg} type={alg} lang={currentLang} />
              ))}
              {!dish.isVegan && !dish.isGlutenFree && (!dish.allergens || dish.allergens.length === 0) && (
                <span className="text-xs opacity-60 italic">Sin alérgenos declarados</span>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* MODO A: PEDIDO ACTIVO (Comanda Digital - Mockup Página 12)       */}
          {/* ============================================================== */}
          {isOrderMode ? (
            <div className="pt-4 border-t border-white/10 space-y-3.5">
              {/* Notas al chef */}
              <div>
                <input
                  type="text"
                  value={chefNotes}
                  onChange={(e) => setChefNotes(e.target.value)}
                  placeholder={t.chefNotesPlaceholder}
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors"
                  style={{
                    backgroundColor: isDark ? '#020617' : '#FFFFFF',
                    borderColor: colors.searchBorder || (isDark ? '#334155' : '#CBD5E1'),
                    color: colors.textBody || (isDark ? '#FFFFFF' : '#020617')
                  }}
                />
              </div>

              {/* Selector de Cantidad + Botón Agregar al Pedido */}
              <div className="flex items-center gap-3">
                {/* Selector - 1 + */}
                <div
                  className="flex items-center rounded-2xl border px-2 py-1 shrink-0"
                  style={{
                    backgroundColor: isDark ? '#020617' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#E2E8F0'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm active:scale-95 transition-transform"
                    style={{ color: colors.textBody || '#FFFFFF' }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-black tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm active:scale-95 transition-transform"
                    style={{ color: colors.textBody || '#FFFFFF' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Botón Agregar al Pedido con estilo del tema */}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={addedToast}
                  style={{
                    backgroundColor: colors.accent || '#D97706',
                    color: colors.accentText || '#020617'
                  }}
                  className={`flex-1 py-3 px-4 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${styleConfig?.actionBtnStyle || 'rounded-2xl shadow-lg'}`}
                >
                  {addedToast ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.addedSuccess}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.addToOrder} • ${(dish.price * quantity).toFixed(2)} {currency}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* MODO B: CATÁLOGO / CONSULTA (Mockups Páginas 8 a 11)           */
            /* ============================================================== */
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              {dish.is3D ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpen3D) onOpen3D(dish);
                  }}
                  style={{
                    backgroundColor: colors.accent || '#D97706',
                    color: colors.accentText || '#020617'
                  }}
                  className={`w-full py-3.5 px-4 text-sm font-black flex items-center justify-center gap-2 ${styleConfig?.actionBtnStyle || 'rounded-2xl shadow-lg'}`}
                >
                  <Box className="w-5 h-5" />
                  <span>{t.view3D}</span>
                </button>
              ) : dish.videoUrl ? (
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: colors.accent || '#D97706',
                    color: colors.accentText || '#020617'
                  }}
                  className={`w-full py-3.5 px-4 text-sm font-black flex items-center justify-center gap-2 ${styleConfig?.actionBtnStyle || 'rounded-2xl shadow-lg'}`}
                >
                  <Video className="w-5 h-5" />
                  <span>{t.viewReel}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: colors.accent || '#D97706',
                    color: colors.accentText || '#020617'
                  }}
                  className={`w-full py-3.5 px-4 text-sm font-black flex items-center justify-center gap-2 ${styleConfig?.actionBtnStyle || 'rounded-2xl shadow-lg'}`}
                >
                  <span>{t.back}</span>
                </button>
              )}
            </div>
          )}

          {/* Barra inferior integrada de Mesa • Zona y Mesero */}
          <div
            className="rounded-2xl p-3 flex items-center justify-between text-xs font-semibold shadow-inner mt-4"
            style={{
              backgroundColor: colors.bottomBarBg || (isDark ? '#020617' : '#0C281E'),
              color: colors.bottomBarText || '#FFFFFF'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.table} {tableNumber} • {tableZone}</span>
            </div>
            {onRequestWaiter && (
              <button
                type="button"
                onClick={onRequestWaiter}
                style={{
                  backgroundColor: colors.accent || '#D97706',
                  color: colors.accentText || '#020617'
                }}
                className="px-3 py-1 rounded-xl font-bold text-xs active:scale-95 transition-transform"
              >
                {t.waiter}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

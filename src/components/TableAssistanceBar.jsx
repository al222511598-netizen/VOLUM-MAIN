import React, { useState, useEffect } from 'react';
import { Bell, Receipt, CheckCircle2, AlertCircle, ShoppingBag, Clock } from 'lucide-react';
import axios from 'axios';

const ASSISTANCE_TRANSLATIONS = {
  es: {
    table: 'Mesa',
    zone: 'Principal',
    callWaiter: 'Llamar Mesero',
    requestBill: 'Pedir Cuenta',
    indicateTableError: 'Por favor indica el número de tu mesa.',
    waiterSuccess: 'Notificación enviada. Tu mesero se aproxima a la mesa.',
    waiterCalling: 'Llamando al mesero...',
    connectionError: 'No se pudo conectar con el servicio. Intenta de nuevo.'
  },
  en: {
    table: 'Table',
    zone: 'Main',
    callWaiter: 'Call Server',
    requestBill: 'Request Bill',
    indicateTableError: 'Please indicate your table number.',
    waiterSuccess: 'Server notified. They will be with you shortly.',
    waiterCalling: 'Calling server...',
    connectionError: 'Could not connect to service. Please try again.'
  },
  fr: {
    table: 'Table',
    zone: 'Principale',
    callWaiter: 'Appeler Serveur',
    requestBill: 'Demander l’Addition',
    indicateTableError: 'Veuillez indiquer votre numéro de table.',
    waiterSuccess: 'Serveur prévenu. Il arrive à votre table.',
    waiterCalling: 'Appel en cours...',
    connectionError: 'Impossible de joindre le service. Veuillez réessayer.'
  }
};

export default function TableAssistanceBar({
  slug,
  initialTable = '',
  initialZone = 'Principal',
  primaryColor = '#D97706',
  lang = 'es',
  orderSettings = {},
  cartCount = 0,
  cartTotal = 0,
  onOpenCart = null,
  onOpenReceipt = null,
  styleConfig = null
}) {
  const t = ASSISTANCE_TRANSLATIONS[lang] || ASSISTANCE_TRANSLATIONS.es;
  const [table, setTable] = useState(initialTable || '1');
  const [zone, setZone] = useState(initialZone || t.zone);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (initialTable) setTable(initialTable);
  }, [initialTable]);

  useEffect(() => {
    if (initialZone) setZone(initialZone);
  }, [initialZone]);

  // Llamar al mesero directamente con 1 toque sin pantallas intermedias
  const handleDirectCallWaiter = async () => {
    if (!String(table).trim()) {
      setToastMessage({ type: 'error', text: t.indicateTableError });
      return;
    }

    setIsCallingWaiter(true);
    try {
      const response = await axios.post(`/api/v1/service/request/${slug}`, {
        table,
        zone,
        type: 'waiter',
        paymentMethod: 'any'
      });

      setToastMessage({
        type: 'success',
        text: response.data.message || t.waiterSuccess
      });

      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    } catch (error) {
      setToastMessage({
        type: 'error',
        text: error.response?.data?.message || t.connectionError
      });
      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    } finally {
      setIsCallingWaiter(false);
    }
  };

  // Abrir directamente el Ticket de consumo con opciones de Efectivo / Tarjeta
  const handleOpenBillTicket = () => {
    if (onOpenReceipt) {
      onOpenReceipt();
    }
  };

  return (
    <>
      {/* Toast de notificación flotante accesible */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md transition-all duration-300 animate-slideDown"
        >
          <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100'
              : 'bg-rose-950/95 border-rose-500/50 text-rose-100'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
            )}
            <p className="text-xs font-bold leading-snug">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* Barra Inferior Fija para Móviles con Safe-Area (Adaptativa al estilo activo) */}
      <nav
        aria-label="Asistencia en mesa"
        className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl px-3 sm:px-4 py-2 pb-safe shadow-2xl select-none transition-colors border-t"
        style={{
          backgroundColor: styleConfig?.colors?.bottomBarBg || '#020617',
          borderColor: styleConfig?.colors?.cardBorder || 'rgba(255,255,255,0.1)',
          borderTopWidth: styleConfig?.id === 'street_food' ? '2px' : '1px',
          color: styleConfig?.colors?.bottomBarText || '#F3F4F6'
        }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          
          {/* Indicador de Mesa y Zona */}
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            <span
              className="w-2 h-2 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: styleConfig?.colors?.accent || '#10B981' }}
            />
            <div className="truncate text-left leading-tight">
              <span
                className="text-[11px] font-black block truncate"
                style={{
                  color: styleConfig?.colors?.bottomBarText || '#F3F4F6',
                  fontFamily: styleConfig?.fonts?.heading || 'inherit'
                }}
              >
                {t.table} {table}
              </span>
              <span
                className="text-[9px] font-medium truncate block"
                style={{ color: styleConfig?.colors?.bottomBarSecondaryText || styleConfig?.colors?.textSecondary || '#94A3B8' }}
              >
                {zone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Si pedidos están habilitados: Botón Carrito */}
            {orderSettings?.enabled && onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                style={{
                  backgroundColor: styleConfig?.isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: styleConfig?.colors?.accent || '#D97706',
                  borderWidth: styleConfig?.id === 'street_food' ? '2px' : '1px',
                  color: styleConfig?.colors?.textBody || '#FFFFFF'
                }}
                className="py-1.5 px-2.5 sm:px-3 min-h-[38px] rounded-2xl border font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" style={{ color: styleConfig?.colors?.accent || '#D97706' }} />
                <span className="text-[11px] font-bold hidden xs:inline" style={{ color: styleConfig?.colors?.accent }}>Pedido</span>
                {cartCount > 0 && (
                  <span
                    style={{ backgroundColor: styleConfig?.colors?.accent, color: styleConfig?.colors?.accentText }}
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-black"
                  >
                    {cartCount}
                  </span>
                )}
                {cartTotal > 0 && (
                  <span
                    className="font-mono text-xs font-black"
                    style={{ color: styleConfig?.colors?.accent || '#D97706' }}
                  >
                    ${cartTotal.toFixed(0)}
                  </span>
                )}
              </button>
            )}

            {/* Botón: Llamar Mesero */}
            <button
              type="button"
              onClick={handleDirectCallWaiter}
              disabled={isCallingWaiter}
              style={
                !orderSettings?.enabled
                  ? {
                      backgroundColor: styleConfig?.colors?.accent || primaryColor || "#D97706",
                      color: styleConfig?.colors?.accentText || "#020617",
                      borderColor: styleConfig?.id === "street_food" ? "#020617" : undefined,
                      borderWidth: styleConfig?.id === "street_food" ? "2px" : "0px",
                      boxShadow: styleConfig?.id === "street_food" ? "2px 2px 0px #020617" : undefined
                    }
                  : {
                      backgroundColor: styleConfig?.isDark
                        ? "rgba(30, 41, 59, 0.85)"
                        : styleConfig?.id === "trattoria_artesanal"
                          ? "#FFF9F5"
                          : styleConfig?.id === "bistro_botanico"
                            ? "rgba(255, 255, 255, 0.12)"
                            : "#FFFFFF",
                      borderColor: styleConfig?.colors?.cardBorder || "#334155",
                      borderWidth: styleConfig?.id === "street_food" ? "2px" : "1px",
                      boxShadow: styleConfig?.id === "street_food" ? "2px 2px 0px #020617" : undefined,
                      color: styleConfig?.isDark
                        ? "#E2E8F0"
                        : styleConfig?.id === "trattoria_artesanal"
                          ? styleConfig?.colors?.dishTitle
                          : styleConfig?.id === "bistro_botanico"
                            ? "#FDFBF7"
                            : "#020617"
                    }
              }
              className={`py-1.5 px-3.5 min-h-[38px] rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md disabled:opacity-50 ${
                !orderSettings?.enabled
                  ? "font-black shadow-amber-500/20 hover:brightness-105"
                  : "border"
              }`}
              title="Llamar al mesero a la mesa"
            >
              {isCallingWaiter ? (
                <Clock
                  className="w-3.5 h-3.5 animate-spin"
                  style={{
                    color: !orderSettings?.enabled
                      ? (styleConfig?.colors?.accentText || "#020617")
                      : (styleConfig?.colors?.accent || "#F59E0B")
                  }}
                />
              ) : (
                <Bell
                  className="w-3.5 h-3.5"
                  style={{
                    color: !orderSettings?.enabled
                      ? (styleConfig?.colors?.accentText || "#020617")
                      : (styleConfig?.colors?.accent || "#F59E0B")
                  }}
                />
              )}
              <span className="text-[11px] sm:text-xs">{isCallingWaiter ? 'Llamando...' : t.callWaiter}</span>
            </button>

            {/* Botón: Pedir Cuenta (Solo visible cuando los pedidos digitales están habilitados) */}
            {orderSettings?.enabled && (
              <button
                type="button"
                onClick={handleOpenBillTicket}
                style={{
                  backgroundColor: styleConfig?.colors?.accent || primaryColor || '#D97706',
                  color: styleConfig?.colors?.accentText || '#020617',
                  borderColor: styleConfig?.id === 'street_food' ? '#020617' : undefined,
                  borderWidth: styleConfig?.id === 'street_food' ? '2px' : '0px',
                  boxShadow: styleConfig?.id === 'street_food' ? '2px 2px 0px #020617' : undefined
                }}
                className="py-1.5 px-3.5 min-h-[38px] rounded-2xl font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-lg hover:brightness-105"
                title="Ver ticket de consumo y pedir cuenta"
              >
                <Receipt className="w-3.5 h-3.5" style={{ color: styleConfig?.colors?.accentText || '#020617' }} />
                <span className="text-[11px] sm:text-xs">{t.requestBill}</span>
              </button>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}

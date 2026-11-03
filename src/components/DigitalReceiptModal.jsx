import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Share2,
  Users,
  CheckCircle2,
  CreditCard,
  Banknote,
  Minus,
  Plus,
  Percent,
  Receipt,
  Clock
} from 'lucide-react';
import { calculateSplitBill, formatTicketWhatsAppMessage } from '../utils/billSplitter';
import { printThermalReceipt } from '../utils/printReceipt';

const RECEIPT_TRANSLATIONS = {
  es: {
    modalTitle: (num) => `Ticket de Mesa ${num}`,
    preBill: 'Pre-cuenta de consumo',
    consumptionProof: 'Comprobante de Consumo • Pre-Cuenta',
    table: 'MESA',
    folio: 'FOLIO',
    date: 'Fecha:',
    time: 'Hora:',
    qty: 'CANT',
    description: 'DESCRIPCIÓN',
    amount: 'IMPORTE',
    noItems: 'Sin platillos registrados aún en esta mesa.',
    subtotal: 'Subtotal Consumo:',
    suggestedTip: (pct) => `Propina Sugerida (${pct}%):`,
    noTip: 'Sin propina',
    taxesIncluded: 'Impuestos (IVA 16%):',
    taxesIncludedHint: 'Incluido en precios',
    grandTotal: 'TOTAL A PAGAR:',
    splitTitle: (count) => `División (${count} personas):`,
    perPerson: 'c/u',
    requestedPaymentMethod: 'Forma de Pago Solicitada:',
    thankYou: '¡Muchas gracias por su preferencia!',
    pleasureToServe: (rest) => `Fue un placer atenderle en ${rest}.`,
    simplifiedProof: 'Comprobante simplificado no fiscal • Generado con Volum-Menu',
    requestedNotice: (method) => `Cuenta en ${method} solicitada. Tu mesero se dirige a la mesa.`,
    requestPaymentHeader: 'Solicitar cobro al mesero:',
    inCash: 'En Efectivo',
    withCard: 'Con Tarjeta',
    suggestedTipHeader: 'Propina Sugerida:',
    splitToolPrompt: '¿Desean dividir la cuenta?',
    splitToolHide: 'Ocultar calculadora de división',
    peopleCount: 'Número de personas:',
    eachPays: 'Le toca a cada uno:',
    printTicket: 'Imprimir Ticket',
    shareWhatsApp: 'Enviar a WhatsApp'
  },
  en: {
    modalTitle: (num) => `Table ${num} Bill`,
    preBill: 'Dining summary / Pre-bill',
    consumptionProof: 'Dining Summary • Pre-Bill',
    table: 'TABLE',
    folio: 'RECEIPT',
    date: 'Date:',
    time: 'Time:',
    qty: 'QTY',
    description: 'DESCRIPTION',
    amount: 'AMOUNT',
    noItems: 'No items ordered at this table yet.',
    subtotal: 'Consumption Subtotal:',
    suggestedTip: (pct) => `Suggested Tip (${pct}%):`,
    noTip: 'No tip',
    taxesIncluded: 'Taxes (VAT 16%):',
    taxesIncludedHint: 'Included in prices',
    grandTotal: 'TOTAL TO PAY:',
    splitTitle: (count) => `Split (${count} guests):`,
    perPerson: 'each',
    requestedPaymentMethod: 'Requested Payment Method:',
    thankYou: 'Thank you for your visit!',
    pleasureToServe: (rest) => `It was our pleasure to serve you at ${rest}.`,
    simplifiedProof: 'Simplified dining receipt • Generated with Volum-Menu',
    requestedNotice: (method) => `Bill in ${method} requested. Your server is on their way.`,
    requestPaymentHeader: 'Request bill from server:',
    inCash: 'In Cash',
    withCard: 'With Card',
    suggestedTipHeader: 'Suggested Tip:',
    splitToolPrompt: 'Would you like to split the bill?',
    splitToolHide: 'Hide bill split calculator',
    peopleCount: 'Number of guests:',
    eachPays: 'Each person pays:',
    printTicket: 'Print Receipt',
    shareWhatsApp: 'Send to WhatsApp'
  },
  fr: {
    modalTitle: (num) => `Addition Table ${num}`,
    preBill: 'Aperçu de consommation',
    consumptionProof: 'Note de Table • Pré-Addition',
    table: 'TABLE',
    folio: 'NOTE',
    date: 'Date :',
    time: 'Heure :',
    qty: 'QTÉ',
    description: 'DÉSIGNATION',
    amount: 'MONTANT',
    noItems: 'Aucun plat commandé pour l’instant sur cette table.',
    subtotal: 'Sous-total Consommation :',
    suggestedTip: (pct) => `Pourboire Suggéré (${pct}%):`,
    noTip: 'Sans pourboire',
    taxesIncluded: 'Taxes (TVA 16%) :',
    taxesIncludedHint: 'Inclus dans les prix',
    grandTotal: 'TOTAL À RÉGLER :',
    splitTitle: (count) => `Partage (${count} personnes) :`,
    perPerson: 'par pers.',
    requestedPaymentMethod: 'Mode de Règlement Demandé :',
    thankYou: 'Merci infiniment pour votre visite !',
    pleasureToServe: (rest) => `Un grand plaisir de vous accueillir chez ${rest}.`,
    simplifiedProof: 'Reçu simplifié non fiscal • Généré par Volum-Menu',
    requestedNotice: (method) => `Addition en ${method} demandée. Votre serveur arrive.`,
    requestPaymentHeader: 'Demander l’addition au serveur :',
    inCash: 'En Espèces',
    withCard: 'Par Carte',
    suggestedTipHeader: 'Pourboire Suggéré :',
    splitToolPrompt: 'Désirez-vous partager l’addition ?',
    splitToolHide: 'Masquer la calculatrice de partage',
    peopleCount: 'Nombre de personnes :',
    eachPays: 'Montant par convive :',
    printTicket: 'Imprimer le Ticket',
    shareWhatsApp: 'Partager sur WhatsApp'
  }
};

export default function DigitalReceiptModal({
  isOpen,
  onClose,
  restaurantName = 'Restaurante',
  tableNumber = '1',
  orders = [],
  currency = 'MXN',
  primaryColor = '#D97706',
  onRequestBill = null,
  lang = 'es',
  styleConfig = null
}) {
  const t = RECEIPT_TRANSLATIONS[lang] || RECEIPT_TRANSLATIONS.es;
  const [tipPercent, setTipPercent] = useState(10);
  const [splitCount, setSplitCount] = useState(1);
  const [showSplitTool, setShowSplitTool] = useState(false);
  const [billRequestedMethod, setBillRequestedMethod] = useState(null); // 'cash' | 'card' | null

  const colors = styleConfig?.colors || {};
  const isStreetFood = styleConfig?.id === 'street_food';
  const isTrattoria = styleConfig?.id === 'trattoria_artesanal';
  const isBistro = styleConfig?.id === 'bistro_botanico';
  const isDark = styleConfig?.isDark ?? true;

  // Consolidar todos los platillos ordenados en rondas
  const consolidatedItems = useMemo(() => {
    const map = {};
    (orders || []).forEach(ord => {
      if (ord.status !== 'rejected') {
        (ord.items || []).forEach(it => {
          const key = `${it.name}_${it.price}`;
          if (!map[key]) {
            map[key] = {
              name: it.name,
              price: Number(it.price) || 0,
              quantity: 0,
              notes: it.notes || ''
            };
          }
          map[key].quantity += (Number(it.quantity) || 1);
        });
      }
    });
    return Object.values(map);
  }, [orders]);

  const baseSubtotal = useMemo(() => {
    return consolidatedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  }, [consolidatedItems]);

  const splitCalculation = useMemo(() => {
    return calculateSplitBill(baseSubtotal, splitCount, tipPercent);
  }, [baseSubtotal, splitCount, tipPercent]);

  if (!isOpen) return null;

  const handlePrint = () => {
    printThermalReceipt('thermal-receipt-printable', {
      title: `Ticket - Table ${tableNumber}`,
      restaurantName,
      tableNumber
    });
  };

  const handleShareWhatsApp = () => {
    const text = formatTicketWhatsAppMessage({
      restaurantName,
      tableNumber,
      orders,
      baseTotal: splitCalculation.baseTotal,
      tipPercent: splitCalculation.tipPercent,
      tipAmount: splitCalculation.tipAmount,
      grandTotal: splitCalculation.grandTotal,
      currency,
      splitDetails: showSplitTool && splitCount > 1 ? splitCalculation : null
    });
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleRequestPayment = (method = 'card') => {
    setBillRequestedMethod(method);
    if (onRequestBill) {
      onRequestBill(method);
    }
  };

  const locale = lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'es-MX';
  const currentDate = new Date().toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
      <div
        role="dialog"
        aria-modal="true"
        style={{
          backgroundColor: colors.cardBg || (isDark ? '#0F172A' : '#FFFFFF'),
          borderColor: colors.cardBorder || (isDark ? '#1E293B' : '#E2E8F0'),
          color: colors.textBody || (isDark ? '#F1F5F9' : '#020617'),
          boxShadow: isStreetFood ? `6px 6px 0px ${colors.accent || '#EA580C'}` : undefined
        }}
        className={`w-full max-w-sm sm:max-w-md rounded-3xl flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:rounded-none ${
          isStreetFood
            ? 'border-2 border-[#020617]'
            : isTrattoria
            ? 'border border-[#C2410C]/60 shadow-xl'
            : 'border shadow-2xl'
        }`}
      >
        {/* Cabecera del Modal (Oculta al imprimir) */}
        <div
          style={{
            backgroundColor: colors.headerBg || (isDark ? '#020617' : '#FFFFFF'),
            borderBottomColor: colors.cardBorder || (isDark ? '#1E293B' : '#E2E8F0')
          }}
          className="p-4 border-b flex items-center justify-between print:hidden"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-md"
              style={{
                backgroundColor: colors.accent || primaryColor,
                color: colors.accentText || '#020617',
                borderColor: isStreetFood ? '#020617' : undefined,
                borderWidth: isStreetFood ? '2px' : '0px'
              }}
            >
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2
                style={{
                  color: colors.headerText || (isDark ? '#FFFFFF' : '#020617'),
                  fontFamily: styleConfig?.fonts?.heading || 'inherit'
                }}
                className="text-sm font-black"
              >
                {t.modalTitle(tableNumber)}
              </h2>
              <span
                className="text-[11px] opacity-75"
                style={{ color: colors.headerSubtitle || colors.textSecondary || '#94A3B8' }}
              >
                {t.preBill}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              color: colors.headerText || (isDark ? '#FFFFFF' : '#020617')
            }}
            className="p-1.5 rounded-full hover:opacity-80 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 print:p-0 print:overflow-visible">
          
          {/* TICKET DE PAPEL TÉRMICO CLÁSICO 1:1 CON FORMATO POS */}
          <div
            id="thermal-receipt-printable"
            style={{
              backgroundColor: isTrattoria ? '#FDFBF7' : '#FFFFFF',
              borderColor: isStreetFood ? '#020617' : isTrattoria ? '#C2410C' : '#E5E7EB',
              borderWidth: isStreetFood ? '2px' : '1px'
            }}
            className="text-slate-950 rounded-2xl p-5 sm:p-6 shadow-2xl border font-sans text-xs select-none print:shadow-none print:border-none print:p-2 print:text-black print:rounded-none relative"
          >
            {/* Cabecera del Ticket */}
            <div className="text-center pb-3 border-b-2 border-stone-900 space-y-1">
              <h3 className="text-lg font-black uppercase tracking-wider text-black">
                {restaurantName}
              </h3>
              <p className="text-[10px] uppercase font-bold text-stone-600 tracking-widest">
                {t.consumptionProof}
              </p>

              {/* Insignia de Mesa y Folio */}
              <div className="inline-flex items-center gap-2 px-3 py-1 mt-1 rounded-lg border border-stone-800 bg-stone-50 font-bold text-xs text-stone-900">
                <span className="font-black text-black">{t.table} {tableNumber}</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-stone-700">{t.folio} #TK-{String(tableNumber).padStart(2, '0')}-{new Date().getMinutes()}{new Date().getSeconds()}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1 font-medium px-1">
                <span>{t.date} {currentDate}</span>
                <span>{t.time} {currentTime}</span>
              </div>
            </div>

            {/* Encabezado de Columnas */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-stone-900 border-b border-stone-800 py-1.5 px-0.5 mt-1">
              <span className="w-10">{t.qty}</span>
              <span className="flex-1 text-left px-1">{t.description}</span>
              <span className="w-16 text-right">{t.amount}</span>
            </div>

            {/* Desglose de Platillos */}
            <div className="py-2 space-y-2 border-b border-stone-300">
              {consolidatedItems.length === 0 ? (
                <div className="py-3 text-center text-stone-500 italic text-[11px]">
                  {t.noItems}
                </div>
              ) : (
                consolidatedItems.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-baseline justify-between">
                      <span className="w-10 font-black text-stone-900">{item.quantity}x</span>
                      <span className="flex-1 px-1 text-stone-950 font-semibold leading-snug">
                        {item.name}
                      </span>
                      <span className="w-16 text-right font-black font-mono text-stone-950 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    {item.notes && (
                      <div className="pl-10 text-[10px] text-stone-600 italic font-medium">
                        ↳ Note: {item.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Subtotales y Propinas */}
            <div className="py-2 space-y-1 text-xs">
              <div className="flex items-center justify-between text-stone-800">
                <span className="font-medium">{t.subtotal}</span>
                <span className="font-mono font-bold">${splitCalculation.baseTotal.toFixed(2)}</span>
              </div>

              {splitCalculation.tipPercent > 0 && (
                <div className="flex items-center justify-between text-stone-800">
                  <span className="font-medium">{t.suggestedTip(splitCalculation.tipPercent)}</span>
                  <span className="font-mono font-bold">+${splitCalculation.tipAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-stone-500 italic">
                <span>{t.taxesIncluded}</span>
                <span>{t.taxesIncludedHint}</span>
              </div>
            </div>

            {/* Total General con Doble Borde POS */}
            <div className="border-t-2 border-b-2 border-stone-900 py-2.5 my-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-black uppercase text-black tracking-wide">
                  {t.grandTotal}
                </span>
                <span className="text-xl font-black text-black font-mono">
                  ${splitCalculation.grandTotal.toFixed(2)} <span className="text-xs font-bold">{currency}</span>
                </span>
              </div>
            </div>

            {/* Si división está activa: Desglose por persona en el ticket */}
            {showSplitTool && splitCount > 1 && (
              <div className="py-2 border-b border-dashed border-stone-400 text-[11px] space-y-0.5">
                <div className="flex items-center justify-between font-bold text-stone-800">
                  <span>{t.splitTitle(splitCount)}</span>
                  <span className="font-mono font-black">${splitCalculation.shares[0]?.formattedAmount || '0.00'} {t.perPerson}</span>
                </div>
              </div>
            )}

            {/* Estado de pago o solicitud */}
            {billRequestedMethod && (
              <div className="py-1.5 border-b border-dashed border-stone-400 flex items-center justify-between text-[11px] font-bold text-stone-800">
                <span>{t.requestedPaymentMethod}</span>
                <span className="uppercase">{billRequestedMethod === 'cash' ? t.inCash : t.withCard}</span>
              </div>
            )}

            {/* Pie de Ticket & Código de Barras Decorativo POS */}
            <div className="text-center pt-3 text-[10px] text-stone-600 space-y-1">
              <p className="font-bold text-stone-800">{t.thankYou}</p>
              <p className="text-[9.5px]">{t.pleasureToServe(restaurantName)}</p>
              
              <div className="pt-2 font-mono text-[13px] tracking-widest text-stone-800 select-none">
                |||| | ||||| || |||||| | ||||| ||| ||| |
                <div className="text-[9px] tracking-normal font-sans text-stone-500 mt-0.5">
                  *TK-{tableNumber}-{Math.round(splitCalculation.grandTotal)}*
                </div>
              </div>

              <div className="pt-1 text-[8.5px] text-stone-400 uppercase tracking-wider">
                {t.simplifiedProof}
              </div>
            </div>
          </div>

          {/* ACCIONES Y FORMA DE PAGO EN EL TICKET (Ocultos en impresión) */}
          <div className="space-y-3 print:hidden">

            {/* Notificación si ya se pidió la cuenta */}
            {billRequestedMethod && (
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center gap-2.5 text-xs text-emerald-200 animate-slideDown">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {t.requestedNotice(billRequestedMethod === 'cash' ? t.inCash : t.withCard)}
                </span>
              </div>
            )}

            {/* Botones Claros: Pedir Cuenta en Efectivo o en Tarjeta */}
            <div className="space-y-1.5">
              <span
                className="text-[11px] font-bold block"
                style={{ color: colors.textSecondary || (isDark ? '#CBD5E1' : '#475569') }}
              >
                {t.requestPaymentHeader}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRequestPayment('cash')}
                  style={
                    billRequestedMethod === 'cash'
                      ? {
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          borderColor: isStreetFood ? '#020617' : '#059669',
                          borderWidth: isStreetFood ? '2px' : '1px',
                          boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
                        }
                      : {
                          backgroundColor: colors.searchBg || (isDark ? '#020617' : '#FFFFFF'),
                          color: '#059669',
                          borderColor: isStreetFood ? '#020617' : '#10B981',
                          borderWidth: isStreetFood ? '2px' : '1px',
                          boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
                        }
                  }
                  className="py-3 px-3 rounded-2xl border font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <Banknote className="w-4 h-4" />
                  <span>{t.inCash}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestPayment('card')}
                  style={
                    billRequestedMethod === 'card'
                      ? {
                          backgroundColor: colors.accent || '#8B5CF6',
                          color: colors.accentText || '#FFFFFF',
                          borderColor: isStreetFood ? '#020617' : undefined,
                          borderWidth: isStreetFood ? '2px' : '0px',
                          boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
                        }
                      : {
                          backgroundColor: colors.searchBg || (isDark ? '#020617' : '#FFFFFF'),
                          color: colors.accent || '#8B5CF6',
                          borderColor: isStreetFood ? '#020617' : (colors.accent || '#8B5CF6'),
                          borderWidth: isStreetFood ? '2px' : '1px',
                          boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
                        }
                  }
                  className="py-3 px-3 rounded-2xl border font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t.withCard}</span>
                </button>
              </div>
            </div>

            {/* Selector de Propina Sugerida */}
            <div
              style={{
                backgroundColor: colors.searchBg || (isDark ? '#020617' : '#FFFFFF'),
                borderColor: colors.cardBorder || (isDark ? '#1E293B' : '#E2E8F0'),
                borderWidth: isStreetFood ? '2px' : '1px',
                boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
              }}
              className="p-3 rounded-2xl border space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className="font-bold flex items-center gap-1"
                  style={{ color: colors.textSecondary || (isDark ? '#94A3B8' : '#64748B') }}
                >
                  <Percent className="w-3 h-3" style={{ color: colors.accent || '#F59E0B' }} />
                  <span>{t.suggestedTipHeader}</span>
                </span>
                <span className="font-mono font-bold" style={{ color: colors.titlePrice || colors.accent || '#F59E0B' }}>
                  {tipPercent > 0 ? `+${splitCalculation.tipAmount.toFixed(2)} ${currency}` : t.noTip}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercent(pct)}
                    style={
                      tipPercent === pct
                        ? {
                            backgroundColor: colors.accent || '#F59E0B',
                            color: colors.accentText || '#020617',
                            borderColor: isStreetFood ? '#020617' : undefined,
                            borderWidth: isStreetFood ? '2px' : '0px',
                            boxShadow: isStreetFood ? '1.5px 1.5px 0px #020617' : undefined
                          }
                        : {
                            backgroundColor: colors.chipInactiveBg || (isDark ? '#0B0F19' : '#F8FAFC'),
                            color: colors.chipInactiveText || (isDark ? '#94A3B8' : '#64748B'),
                            borderColor: isStreetFood ? '#020617' : (colors.chipInactiveBorder || '#E2E8F0'),
                            borderWidth: isStreetFood ? '1.5px' : '1px'
                          }
                    }
                    className="py-1.5 rounded-xl text-xs font-bold transition-all border"
                  >
                    {pct === 0 ? '0%' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Herramienta Opcional de División de Cuenta */}
            <div
              style={{
                backgroundColor: colors.searchBg || (isDark ? '#020617' : '#FFFFFF'),
                borderColor: colors.cardBorder || (isDark ? '#1E293B' : '#E2E8F0'),
                borderWidth: isStreetFood ? '2px' : '1px',
                boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
              }}
              className="p-3 rounded-2xl border space-y-2"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowSplitTool(!showSplitTool)}
                  style={{ color: colors.accent || '#F59E0B' }}
                  className="text-xs font-bold flex items-center gap-1.5 hover:opacity-80"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{showSplitTool ? t.splitToolHide : t.splitToolPrompt}</span>
                </button>
              </div>

              {showSplitTool && (
                <div
                  className="pt-2 border-t space-y-2 animate-fadeIn"
                  style={{ borderColor: colors.cardBorder || 'rgba(148, 163, 184, 0.2)' }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: colors.textSecondary || (isDark ? '#94A3B8' : '#64748B') }}
                    >
                      {t.peopleCount}
                    </span>
                    <div
                      style={{
                        backgroundColor: colors.cardBg || (isDark ? '#0F172A' : '#F1F5F9'),
                        borderColor: colors.cardBorder || '#E2E8F0',
                        borderWidth: isStreetFood ? '2px' : '1px'
                      }}
                      className="flex items-center gap-2 px-2 py-1 rounded-xl border"
                    >
                      <button
                        type="button"
                        onClick={() => setSplitCount(c => Math.max(1, c - 1))}
                        style={{ backgroundColor: colors.accent, color: colors.accentText }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span
                        className="w-6 text-center text-xs font-black tabular-nums"
                        style={{ color: colors.textBody || (isDark ? '#FFFFFF' : '#020617') }}
                      >
                        {splitCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSplitCount(c => Math.min(20, c + 1))}
                        style={{ backgroundColor: colors.accent, color: colors.accentText }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: colors.cardBg || (isDark ? '#0F172A' : '#F1F5F9'),
                      borderColor: colors.cardBorder || '#E2E8F0',
                      borderWidth: isStreetFood ? '2px' : '1px'
                    }}
                    className="p-2.5 rounded-xl border text-xs flex items-center justify-between font-bold text-emerald-500"
                  >
                    <span>{t.eachPays}</span>
                    <span className="font-mono text-sm">
                      ${splitCalculation.shares[0]?.formattedAmount || '0.00'} {currency}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones de Imprimir y Compartir */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  borderColor: isStreetFood ? '#020617' : (isDark ? '#334155' : '#CBD5E1'),
                  borderWidth: isStreetFood ? '2px' : '1px',
                  boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
                }}
                className="py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border active:scale-95"
                title="Imprimir ticket térmico en 1 sola hoja"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printTicket}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  borderColor: isStreetFood ? '#020617' : undefined,
                  borderWidth: isStreetFood ? '2px' : '0px',
                  boxShadow: isStreetFood ? '2px 2px 0px #020617' : undefined
                }}
                className="py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                title="Enviar ticket a WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shareWhatsApp}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

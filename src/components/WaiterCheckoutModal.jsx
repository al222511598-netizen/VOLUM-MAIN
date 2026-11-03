import React, { useState, useMemo } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Printer,
  CheckCircle2,
  Clock,
  Users,
  Utensils,
  Receipt,
  Calculator,
  Percent,
  Check,
  AlertCircle
} from 'lucide-react';
import { calculateSplitBill } from '../utils/billSplitter';
import { printThermalReceipt } from '../utils/printReceipt';

export default function WaiterCheckoutModal({
  isOpen,
  onClose,
  tableNumber = '1',
  tableSession = null,
  restaurantName = 'Restaurante',
  restaurantLogo = '',
  currency = 'MXN',
  primaryColor = '#D97706',
  onConfirmPaymentAndLiberate,
  isClosing = false
}) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [tipPercent, setTipPercent] = useState(10);
  const [receivedCashInput, setReceivedCashInput] = useState('');

  // Consolidar todos los platillos
  const consolidatedItems = useMemo(() => {
    const map = {};
    (tableSession?.orders || []).forEach(ord => {
      if (ord.status !== 'rejected') {
        (ord.items || []).forEach(it => {
          const key = `${it.name}_${it.price}`;
          if (!map[key]) {
            map[key] = {
              name: it.name,
              price: Number(it.price) || 0,
              quantity: 0
            };
          }
          map[key].quantity += (Number(it.quantity) || 1);
        });
      }
    });
    return Object.values(map);
  }, [tableSession]);

  const baseTotal = useMemo(() => {
    return tableSession?.totalAmount || consolidatedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  }, [tableSession, consolidatedItems]);

  const tipAmount = useMemo(() => {
    return (baseTotal * tipPercent) / 100;
  }, [baseTotal, tipPercent]);

  const grandTotal = useMemo(() => {
    return baseTotal + tipAmount;
  }, [baseTotal, tipAmount]);

  const receivedCashNumber = useMemo(() => {
    const num = parseFloat(receivedCashInput);
    return isNaN(num) ? 0 : num;
  }, [receivedCashInput]);

  const changeToReturn = useMemo(() => {
    if (paymentMethod !== 'cash') return 0;
    return Math.max(0, receivedCashNumber - grandTotal);
  }, [paymentMethod, receivedCashNumber, grandTotal]);

  const isExactOrSufficient = useMemo(() => {
    if (paymentMethod !== 'cash') return true;
    return receivedCashNumber >= grandTotal;
  }, [paymentMethod, receivedCashNumber, grandTotal]);

  if (!isOpen) return null;

  const handleQuickCash = (amount) => {
    if (amount === 'exact') {
      setReceivedCashInput(grandTotal.toFixed(2));
    } else {
      setReceivedCashInput(String(amount));
    }
  };

  const handlePrint = () => {
    printThermalReceipt('waiter-thermal-receipt', {
      title: `Ticket - Mesa ${tableNumber}`,
      restaurantName,
      tableNumber
    });
  };

  const handleFinalize = () => {
    if (onConfirmPaymentAndLiberate) {
      onConfirmPaymentAndLiberate(tableNumber, {
        paymentMethod,
        tipAmount: Number(tipAmount.toFixed(2)),
        receivedCash: paymentMethod === 'cash' ? receivedCashNumber : grandTotal,
        changeToReturn: Number(changeToReturn.toFixed(2))
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white"
      >
        {/* Cabecera (Oculta al imprimir) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              <Receipt className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Cobro y Cierre de Mesa {tableNumber}</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                {tableSession?.diners?.length || 1} comensales • {(tableSession?.orders || []).length} rondas marchadas
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 print:p-0">
          
          {/* Tarjeta de Resumen de Cuenta */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 print:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Consumo de Alimentos y Bebidas:</span>
              <span className="font-mono font-bold text-white text-sm">
                ${baseTotal.toFixed(2)} {currency}
              </span>
            </div>

            {/* Selector de Propina */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Percent className="w-3 h-3 text-amber-400" />
                <span>Propina:</span>
              </span>
              <div className="flex items-center gap-1">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercent(pct)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      tipPercent === pct
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-base font-black pt-2 border-t border-slate-800">
              <span className="text-white">Total a Cobrar:</span>
              <span className="font-mono text-xl text-amber-400">
                ${grandTotal.toFixed(2)} {currency}
              </span>
            </div>
          </div>

          {/* Método de Cobro */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 print:hidden">
            <label className="block text-xs font-bold text-slate-300">
              Forma de Pago del Comensal:
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-purple-950/50 border-purple-500 text-purple-200 shadow-md ring-2 ring-purple-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>Terminal Bancaria / Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-3 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>Efectivo</span>
              </button>
            </div>

            {/* Calculadora de Cambio para Efectivo */}
            {paymentMethod === 'cash' && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calculadora de Cambio:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Monto total: ${grandTotal.toFixed(2)}</span>
                </div>

                {/* Billetes rápidos */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => handleQuickCash('exact')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs shrink-0"
                  >
                    Exacto
                  </button>
                  {[100, 200, 500, 1000].map(bill => (
                    <button
                      key={bill}
                      type="button"
                      onClick={() => handleQuickCash(bill)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold shrink-0"
                    >
                      ${bill}
                    </button>
                  ))}
                </div>

                {/* Input de Efectivo Recibido */}
                <div>
                  <label htmlFor="received-cash-input" className="block text-[11px] text-slate-400 mb-1">
                    Dinero entregado por el cliente:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm font-bold">$</span>
                    <input
                      id="received-cash-input"
                      type="number"
                      step="0.5"
                      value={receivedCashInput}
                      onChange={(e) => setReceivedCashInput(e.target.value)}
                      placeholder={grandTotal.toFixed(2)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Visualización de Cambio */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isExactOrSufficient
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-rose-950/40 border-rose-500/40'
                }`}>
                  <span className="text-xs font-bold text-slate-300">
                    {isExactOrSufficient ? 'Cambio a devolver al cliente:' : 'Falta dinero:'}
                  </span>
                  <span className={`text-xl font-mono font-black ${
                    isExactOrSufficient ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    ${isExactOrSufficient ? changeToReturn.toFixed(2) : (grandTotal - receivedCashNumber).toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Térmico Oculto en Pantalla / Visible solo en Impresión o Vista Previa */}
          <div
            id="waiter-thermal-receipt"
            className="bg-white text-slate-950 rounded-2xl p-5 sm:p-6 shadow-xl border border-stone-200 select-none print:shadow-none print:border-none print:p-2 print:text-black print:rounded-none relative font-sans"
          >
            {/* Cabecera del Ticket */}
            <div className="text-center pb-3 border-b-2 border-stone-900 space-y-1">
              <h3 className="text-lg font-black uppercase tracking-wider text-black">
                {restaurantName}
              </h3>
              <p className="text-[10px] uppercase font-bold text-stone-600 tracking-widest">
                Ticket de Cierre de Cuenta • Control de Caja
              </p>

              {/* Insignia de Mesa y Folio */}
              <div className="inline-flex items-center gap-2 px-3 py-1 mt-1 rounded-lg border border-stone-800 bg-stone-50 font-bold text-xs text-stone-900">
                <span className="font-black text-black">MESA {tableNumber}</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-stone-700">FOLIO #TK-{String(tableNumber).padStart(2, '0')}-{new Date().getMinutes()}{new Date().getSeconds()}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1 font-medium px-1">
                <span>Fecha: {currentDate}</span>
                <span>Hora: {currentTime}</span>
              </div>
            </div>

            {/* Encabezado de Columnas */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-stone-900 border-b border-stone-800 py-1.5 px-0.5 mt-1">
              <span className="w-10">CANT</span>
              <span className="flex-1 text-left px-1">DESCRIPCIÓN</span>
              <span className="w-16 text-right">IMPORTE</span>
            </div>

            {/* Desglose de Platillos */}
            <div className="py-2 space-y-2 border-b border-stone-300">
              {consolidatedItems.map((it, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="w-10 font-black text-stone-900">{it.quantity}x</span>
                    <span className="flex-1 px-1 text-stone-950 font-semibold leading-snug">
                      {it.name}
                    </span>
                    <span className="w-16 text-right font-black font-mono text-stone-950 shrink-0">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                  {it.notes && (
                    <div className="pl-10 text-[10px] text-stone-600 italic font-medium">
                      ↳ Nota: {it.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Subtotales y Propinas */}
            <div className="py-2 space-y-1 text-xs">
              <div className="flex items-center justify-between text-stone-800">
                <span className="font-medium">Subtotal Consumo:</span>
                <span className="font-mono font-bold">${baseTotal.toFixed(2)}</span>
              </div>

              {tipAmount > 0 && (
                <div className="flex items-center justify-between text-stone-800">
                  <span className="font-medium">Propina ({tipPercent}%):</span>
                  <span className="font-mono font-bold">+${tipAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-stone-500 italic">
                <span>Impuestos (IVA 16%):</span>
                <span>Incluido en precios</span>
              </div>
            </div>

            {/* Total General con Doble Borde POS */}
            <div className="border-t-2 border-b-2 border-stone-900 py-2.5 my-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-black uppercase text-black tracking-wide">
                  TOTAL PAGADO:
                </span>
                <span className="text-xl font-black text-black font-mono">
                  ${grandTotal.toFixed(2)} <span className="text-xs font-bold">{currency}</span>
                </span>
              </div>
            </div>

            {/* Desglose de Liquidación y Método de Pago */}
            <div className="py-2 border-b border-dashed border-stone-400 text-xs space-y-1">
              <div className="flex items-center justify-between text-stone-800">
                <span className="font-bold">Forma de Pago:</span>
                <span className="font-black uppercase">
                  {paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta / Terminal Bancaria'}
                </span>
              </div>

              {paymentMethod === 'cash' && receivedCashNumber > 0 && (
                <>
                  <div className="flex items-center justify-between text-stone-700">
                    <span>Efectivo Recibido:</span>
                    <span className="font-mono font-bold">${receivedCashNumber.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-black text-stone-900">
                    <span>Cambio Entregado:</span>
                    <span className="font-mono">${changeToReturn.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Pie de Ticket & Código de Barras Decorativo POS */}
            <div className="text-center pt-3 text-[10px] text-stone-600 space-y-1">
              <p className="font-bold text-stone-800">¡Muchas gracias por su preferencia!</p>
              <p className="text-[9.5px]">Esperamos verle pronto de nuevo.</p>

              <div className="pt-2 font-mono text-[13px] tracking-widest text-stone-800 select-none">
                |||| | ||||| || |||||| | ||||| ||| ||| |
                <div className="text-[9px] tracking-normal font-sans text-stone-500 mt-0.5">
                  *TK-{tableNumber}-{Math.round(grandTotal)}*
                </div>
              </div>

              <div className="pt-1 text-[8.5px] text-stone-400 uppercase tracking-wider">
                Comprobante de consumo simplificado • Generado con Volum-Menu
              </div>
            </div>
          </div>

        </div>

        {/* Botonera Inferior (Oculta al imprimir) */}
        <div className="p-4 border-t border-slate-800/90 bg-slate-950/80 space-y-2.5 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Imprimir Ticket</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs"
            >
              Cancelar
            </button>
          </div>

          <button
            type="button"
            onClick={handleFinalize}
            disabled={isClosing || (paymentMethod === 'cash' && !isExactOrSufficient)}
            style={{ backgroundColor: isExactOrSufficient ? primaryColor : '#475569' }}
            className="w-full py-3.5 px-4 rounded-2xl text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
          >
            {isClosing ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-slate-950" />
                <span>Cerrando y Liberando Mesa...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Marcar Pagado y Liberar Mesa {tableNumber}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

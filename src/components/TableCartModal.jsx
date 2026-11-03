import React, { useState } from 'react';
import {
  ShoppingBag,
  Utensils,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  Users,
  Sparkles,
  Clock,
  AlertCircle,
  ChefHat,
  CheckCircle2,
  Receipt,
  Edit2
} from 'lucide-react';

const CART_TRANSLATIONS = {
  es: {
    tableOrder: (num) => `Comanda de Mesa ${num}`,
    live: 'En Vivo',
    yourName: 'Tu nombre',
    you: 'Tú',
    changeName: 'Cambiar tu nombre en la mesa',
    toSend: (n) => `Por Enviar (${n})`,
    alreadySent: (n) => `Ya Marchado (${n})`,
    newRound: (n) => `Nueva Ronda a Ordenar (${n})`,
    clearCart: 'Vaciar carrito',
    cartReady: 'Tu carrito está listo',
    cartReadyHint: 'Explora el menú y toca "+ Agregar al Pedido" en los platillos o modelos 3D que desees ordenar.',
    note: 'Nota:',
    deleteItem: 'Eliminar del pedido',
    pastRounds: (n) => `Rondas Ya Marchadas (${n})`,
    round: (n) => `Ronda #${n}`,
    statusKitchen: 'Aprobado / Cocina',
    statusPending: 'Confirmando con mesero',
    statusCanceled: 'Cancelado',
    currentRoundSubtotal: 'Ronda actual:',
    previousTotalSubtotal: 'Consumo anterior acumulado:',
    grandTotalLabel: 'Total acumulado de Mesa:',
    viewReceiptSplit: 'Ver Pre-Cuenta y Dividir Ticket',
    sendToKitchen: 'Confirmar Pedido a Cocina',
    sendForApproval: 'Enviar Comanda para Aprobación',
    sending: 'Enviando Comanda...',
    approvalNotice: 'Tu mesero revisará y confirmará tu comanda físicamente en sala para marcharla.',
    confirmTitle: '¿Confirmar Pedido a Cocina?',
    confirmDesc: (table, n) => `Estás a punto de enviar la comanda de la Mesa ${table} con ${n} platillo(s).`,
    currentRoundTotal: 'Total de esta ronda:',
    confirmReview: 'Revisar / Modificar',
    confirmSend: '✓ Sí, Enviar Pedido'
  },
  en: {
    tableOrder: (num) => `Table ${num} Order`,
    live: 'Live',
    yourName: 'Your name',
    you: 'You',
    changeName: 'Change your name at the table',
    toSend: (n) => `To Send (${n})`,
    alreadySent: (n) => `Already Sent (${n})`,
    newRound: (n) => `New Round to Order (${n})`,
    clearCart: 'Clear cart',
    cartReady: 'Your cart is ready',
    cartReadyHint: 'Explore the menu and tap "+ Add to Order" on dishes or 3D models you wish to order.',
    note: 'Note:',
    deleteItem: 'Remove from order',
    pastRounds: (n) => `Past Rounds Ordered (${n})`,
    round: (n) => `Round #${n}`,
    statusKitchen: 'Approved / Kitchen',
    statusPending: 'Confirming with server',
    statusCanceled: 'Canceled',
    currentRoundSubtotal: 'Current round:',
    previousTotalSubtotal: 'Previous consumption:',
    grandTotalLabel: 'Table Grand Total:',
    viewReceiptSplit: 'View Bill & Split Ticket',
    sendToKitchen: 'Confirm Order to Kitchen',
    sendForApproval: 'Send Order for Approval',
    sending: 'Sending Order...',
    approvalNotice: 'Your server will verify and approve your order at table before firing to kitchen.',
    confirmTitle: 'Confirm Order to Kitchen?',
    confirmDesc: (table, n) => `You are about to send Table ${table}'s order with ${n} item(s).`,
    currentRoundTotal: 'This round total:',
    confirmReview: 'Review / Edit',
    confirmSend: '✓ Yes, Send Order'
  },
  fr: {
    tableOrder: (num) => `Commande Table ${num}`,
    live: 'En Direct',
    yourName: 'Votre nom',
    you: 'Vous',
    changeName: 'Modifier votre nom à table',
    toSend: (n) => `À Envoyer (${n})`,
    alreadySent: (n) => `Déjà Envoyé (${n})`,
    newRound: (n) => `Nouvelle Commande (${n})`,
    clearCart: 'Vider le panier',
    cartReady: 'Votre panier est prêt',
    cartReadyHint: 'Explorez la carte et appuyez sur "+ Ajouter à la commande" sur les plats ou modèles 3D.',
    note: 'Note :',
    deleteItem: 'Supprimer de la commande',
    pastRounds: (n) => `Commandes Déjà Envoyées (${n})`,
    round: (n) => `Tournée #${n}`,
    statusKitchen: 'Validé / Cuisine',
    statusPending: 'En attente du serveur',
    statusCanceled: 'Annulé',
    currentRoundSubtotal: 'Tournée actuelle :',
    previousTotalSubtotal: 'Consommations précédentes :',
    grandTotalLabel: 'Total Table Cumulé :',
    viewReceiptSplit: 'Voir l’Addition & Partager',
    sendToKitchen: 'Confirmer la Commande en Cuisine',
    sendForApproval: 'Envoyer pour Validation',
    sending: 'Envoi en cours...',
    approvalNotice: 'Votre serveur validera physiquement la commande à table avant son envoi en cuisine.',
    confirmTitle: 'Confirmer l’Envoi en Cuisine ?',
    confirmDesc: (table, n) => `Vous êtes sur le point d'envoyer la commande pour la Table ${table} avec ${n} plat(s).`,
    currentRoundTotal: 'Total de cette tournée :',
    confirmReview: 'Vérifier / Modifier',
    confirmSend: '✓ Oui, Envoyer la Commande'
  }
};

export default function TableCartModal({
  isOpen,
  onClose,
  tableNumber,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
  isSubmitting = false,
  previousOrders = [],
  dinerName = 'Comensal',
  onChangeDinerName,
  currency = 'MXN',
  primaryColor = '#D97706',
  orderSettings = {},
  onOpenReceipt = null,
  lang = 'es'
}) {
  const t = CART_TRANSLATIONS[lang] || CART_TRANSLATIONS.es;
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(dinerName);
  const [modalTab, setModalTab] = useState('current'); // 'current' | 'history'
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!isOpen) return null;

  const currentSubtotal = cartItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const previousTotal = previousOrders.reduce((acc, ord) => {
    if (ord.status !== 'rejected') return acc + (ord.subtotal || 0);
    return acc;
  }, 0);

  const grandTotal = currentSubtotal + previousTotal;

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim() && onChangeDinerName) {
      onChangeDinerName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp sm:animate-scaleUp"
      >
        {/* Cabecera del Modal */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingBag className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>{t.tableOrder(tableNumber)}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {t.live}
                </span>
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder={t.yourName}
                      autoFocus
                      className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-bold w-28 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>{t.you}: <strong className="text-white">{dinerName}</strong></span>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-500 hover:text-amber-400 p-0.5 ml-1 transition-colors"
                      title={t.changeName}
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Pestañas: Por Enviar vs Ya Marchadas */}
        {previousOrders.length > 0 && (
          <div className="px-5 pt-3 pb-0 bg-slate-950/50">
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab('current')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'current'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.toSend(cartItems.reduce((acc, it) => acc + it.quantity, 0))}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('history')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === 'history'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>{t.alreadySent(previousOrders.length)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Contenido scrolleable del Carrito */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. Platillos en el Carrito Actual (Por enviar) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>{t.newRound(cartItems.reduce((acc, it) => acc + it.quantity, 0))}</span>
              </span>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.clearCart}</span>
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                <Sparkles className="w-8 h-8 text-amber-500/40 mx-auto" />
                <h4 className="text-sm font-bold text-white">{t.cartReady}</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {t.cartReadyHint}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item, idx) => (
                  <div
                    key={`${item.dishId || item.name}_${idx}`}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded-md bg-slate-900 border border-slate-800">
                          {item.dinerName || dinerName}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 mt-0.5 block">
                        ${(item.price * item.quantity).toFixed(2)} {currency}
                      </span>
                      {item.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5 truncate">
                          {t.note} {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, Math.max(0, item.quantity - 1))}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                      title={t.deleteItem}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Rondas Anteriores ya Marchadas */}
          {previousOrders.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.pastRounds(previousOrders.length)}</span>
              </span>

              <div className="space-y-2">
                {previousOrders.map((ord, oIdx) => {
                  const isApproved = ord.status === 'approved' || ord.status === 'preparing' || ord.status === 'ready' || ord.status === 'delivered';
                  const isPending = ord.status === 'pending_approval';
                  const isRejected = ord.status === 'rejected';

                  return (
                    <div
                      key={ord._id || ord.orderNumber || oIdx}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-slate-300">
                          {ord.orderNumber || t.round(oIdx + 1)}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isPending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {isApproved && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {isPending && <Clock className="w-2.5 h-2.5" />}
                          {isRejected && <AlertCircle className="w-2.5 h-2.5" />}
                          <span>
                            {isApproved ? t.statusKitchen : isPending ? t.statusPending : t.statusCanceled}
                          </span>
                        </span>
                      </div>

                      <div className="space-y-1 pl-1">
                        {ord.items?.map((it, iIdx) => (
                          <div key={iIdx} className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{it.quantity}x {it.name} {it.dinerName ? `(${it.dinerName})` : ''}</span>
                            <span className="font-mono font-bold text-slate-300">
                              ${(it.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Resumen de Totales y Botón Enviar */}
        <div className="p-5 border-t border-slate-800/90 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.currentRoundSubtotal}</span>
            <span className="font-mono font-bold text-white">${currentSubtotal.toFixed(2)} {currency}</span>
          </div>

          {previousTotal > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t.previousTotalSubtotal}</span>
              <span className="font-mono font-bold text-slate-300">${previousTotal.toFixed(2)} {currency}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-slate-800">
            <span className="text-white">{t.grandTotalLabel}</span>
            <span className="font-mono text-lg font-black text-amber-400">
              ${grandTotal.toFixed(2)} {currency}
            </span>
          </div>

          {/* Botón de Ver Pre-Cuenta y Dividir Ticket */}
          {(previousTotal > 0 || grandTotal > 0) && onOpenReceipt && (
            <button
              type="button"
              onClick={() => {
                onOpenReceipt();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.viewReceiptSplit}</span>
            </button>
          )}

          {/* Botón de Enviar Pedido con Confirmación Anti-Accidentes */}
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting || cartItems.length === 0}
            style={{ backgroundColor: primaryColor }}
            className="w-full py-3.5 px-4 rounded-2xl text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t.sending}</span>
              </>
            ) : (
              <>
                <Utensils className="w-4 h-4 text-slate-950" />
                <span>
                  {orderSettings.requireApproval !== false
                    ? t.sendForApproval
                    : t.sendToKitchen}
                </span>
              </>
            )}
          </button>

          {orderSettings.requireApproval !== false && (
            <p className="text-[10px] text-center text-slate-500">
              🛡️ {t.approvalNotice}
            </p>
          )}
        </div>
      </div>

      {/* Modal de Confirmación de Comanda (Anti-Accidentes) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-playfair">{t.confirmTitle}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.confirmDesc(tableNumber, cartItems.reduce((acc, it) => acc + it.quantity, 0))}
              </p>
            </div>

            <div className="max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              {cartItems.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-slate-200 font-bold">{it.quantity}x {it.name}</span>
                    {it.notes && <span className="text-[10px] text-slate-400 block truncate">{t.note} {it.notes}</span>}
                  </div>
                  <span className="font-mono text-amber-400 font-bold shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-white">
                <span>{t.currentRoundTotal}</span>
                <span className="font-mono text-emerald-400 font-black">
                  ${currentSubtotal.toFixed(2)} {currency}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                {t.confirmReview}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  if (onSubmitOrder) onSubmitOrder();
                }}
                disabled={isSubmitting}
                className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? t.sending : t.confirmSend}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

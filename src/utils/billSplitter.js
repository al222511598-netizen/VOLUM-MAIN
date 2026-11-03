/**
 * Algoritmo de División con Remanente (Penny Rounding / Largest Remainder)
 * Divide un total en centavos enteros entre N comensales garantizando suma exacta al 100%.
 */
export function calculateSplitBill(totalAmount, numPeople = 1, tipPercent = 0) {
  const people = Math.max(1, parseInt(numPeople, 10) || 1);
  const baseTotal = Math.round(Math.max(0, Number(totalAmount) || 0) * 100) / 100;
  const tipAmount = Math.round(((baseTotal * Math.max(0, Number(tipPercent) || 0)) / 100) * 100) / 100;
  const grandTotalCents = Math.round((baseTotal + tipAmount) * 100);
  const grandTotal = grandTotalCents / 100;

  const baseCents = Math.floor(grandTotalCents / people);
  const remainderCents = grandTotalCents % people;

  const shares = [];
  let calculatedSumCents = 0;

  for (let i = 0; i < people; i++) {
    const personCents = baseCents + (i < remainderCents ? 1 : 0);
    calculatedSumCents += personCents;
    shares.push({
      personIndex: i + 1,
      label: `Comensal ${i + 1}`,
      amount: personCents / 100,
      formattedAmount: (personCents / 100).toFixed(2)
    });
  }

  return {
    baseTotal: Number(baseTotal.toFixed(2)),
    tipPercent: Number(tipPercent) || 0,
    tipAmount: Number(tipAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    numPeople: people,
    shares,
    exactSumMatches: calculatedSumCents === grandTotalCents
  };
}

/**
 * Genera el texto formateado para compartir el desglose o ticket en WhatsApp
 */
export function formatTicketWhatsAppMessage({
  restaurantName = 'Restaurante',
  tableNumber = '1',
  orders = [],
  baseTotal = 0,
  tipPercent = 0,
  tipAmount = 0,
  grandTotal = 0,
  currency = 'MXN',
  splitDetails = null
}) {
  let msg = `🧾 *${restaurantName.toUpperCase()}*\n`;
  msg += `📍 *Mesa ${tableNumber}* — Pre-Cuenta Digital\n`;
  msg += `📅 ${new Date().toLocaleDateString()} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
  msg += `─────────────────────────\n`;

  // Desglose de platillos
  const itemsMap = {};
  (orders || []).forEach(ord => {
    if (ord.status !== 'rejected') {
      (ord.items || []).forEach(it => {
        const key = `${it.name}_${it.price}`;
        if (!itemsMap[key]) {
          itemsMap[key] = { name: it.name, price: it.price, quantity: 0 };
        }
        itemsMap[key].quantity += (it.quantity || 1);
      });
    }
  });

  Object.values(itemsMap).forEach(item => {
    const totalLine = (item.price * item.quantity).toFixed(2);
    msg += `${item.quantity}x ${item.name} — $${totalLine} ${currency}\n`;
  });

  msg += `─────────────────────────\n`;
  msg += `Subtotal: $${Number(baseTotal).toFixed(2)} ${currency}\n`;
  if (tipAmount > 0) {
    msg += `Propina sugerida (${tipPercent}%): $${Number(tipAmount).toFixed(2)} ${currency}\n`;
  }
  msg += `*TOTAL A PAGAR: $${Number(grandTotal).toFixed(2)} ${currency}*\n`;

  if (splitDetails && splitDetails.numPeople > 1) {
    msg += `\n👥 *División equitativa (${splitDetails.numPeople} comensales):*\n`;
    splitDetails.shares.forEach(s => {
      msg += `• ${s.label}: *$${s.formattedAmount} ${currency}*\n`;
    });
  }

  msg += `─────────────────────────\n`;
  msg += `✨ _Generado con Volum-Menu — Experiencia Gastronómica 3D_`;

  return msg;
}

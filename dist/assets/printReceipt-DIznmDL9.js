function m(e,p={}){const{title:s="Ticket de Venta",restaurantName:d="",tableNumber:a=""}=p;let o="";if(typeof e=="string"){const i=document.getElementById(e);i?o=i.innerHTML:o=e}else e&&e.innerHTML&&(o=e.innerHTML);if(!o||o.trim()===""){console.warn("[printThermalReceipt] No se encontró contenido para imprimir."),window.print();return}const r=document.getElementById("volum-pos-print-frame");r&&r.remove();const t=document.createElement("iframe");t.id="volum-pos-print-frame",t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0px",t.style.height="0px",t.style.border="none",t.style.visibility="hidden",document.body.appendChild(t);const n=t.contentWindow.document;n.open(),n.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${s} ${a?`- Mesa ${a}`:""}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0mm !important;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 76mm;
            max-width: 76mm;
            margin: 0 auto !important;
            padding: 4mm 2mm;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 11px;
            line-height: 1.35;
            -webkit-font-smoothing: antialiased;
          }
          /* Ocultar botones e interactivos */
          button, .print\\:hidden, .no-print {
            display: none !important;
          }
          /* Clases mono para cifras numéricas tabulares */
          .mono, .font-mono, [data-mono] {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
          }
          /* Asegurar contraste y alineaciones */
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          .items-center { align-items: center; }
          .items-baseline { align-items: baseline; }
          .font-medium { font-weight: 500; }
          .font-semibold { font-weight: 600; }
          .font-bold, strong { font-weight: 700; }
          .font-black { font-weight: 900; }
          .uppercase { text-transform: uppercase; }
          .tracking-wider { letter-spacing: 0.05em; }
          .tracking-widest { letter-spacing: 0.1em; }
          
          /* Divisores térmicos nítidos */
          .border-b { border-bottom: 1px solid #111111; }
          .border-t { border-top: 1px solid #111111; }
          .border-dashed { border-style: dashed !important; border-color: #555555 !important; }
          .border-double { border-top: 3px double #000000; border-bottom: 3px double #000000; }
          
          /* Espaciados térmicos controlados */
          .space-y-1 > * + * { margin-top: 3px; }
          .space-y-1\\.5 > * + * { margin-top: 4px; }
          .space-y-2 > * + * { margin-top: 6px; }
          .py-1 { padding-top: 3px; padding-bottom: 3px; }
          .py-1\\.5 { padding-top: 4px; padding-bottom: 4px; }
          .py-2 { padding-top: 6px; padding-bottom: 6px; }
          .pb-2 { padding-bottom: 6px; }
          .pb-3 { padding-bottom: 8px; }
          .pt-1 { padding-top: 3px; }
          .pt-2 { padding-top: 6px; }
          .pt-3 { padding-top: 8px; }
          .my-2 { margin-top: 6px; margin-bottom: 6px; }
          .mb-1 { margin-bottom: 3px; }
          .mb-2 { margin-bottom: 6px; }
          
          /* Tipografía y tamaños */
          .text-\\[10px\\] { font-size: 10px; }
          .text-\\[11px\\] { font-size: 11px; }
          .text-xs { font-size: 11px; }
          .text-sm { font-size: 13px; }
          .text-base { font-size: 14px; }
          .text-lg { font-size: 16px; }
          .text-xl { font-size: 18px; }
          
          /* Color forzado a tinta térmica negra pura */
          .text-stone-900, .text-slate-900, .text-slate-950, .text-stone-950, .text-black { color: #000000 !important; }
          .text-stone-700, .text-stone-600, .text-stone-500, .text-slate-600, .text-slate-500 { color: #222222 !important; }
          
          /* Insignias de Mesa y Folio */
          .pos-meta-badge {
            border: 1px solid #000000;
            border-radius: 4px;
            padding: 3px 6px;
            margin: 4px 0;
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
          }
          
          .pos-cut-line {
            text-align: center;
            font-size: 9px;
            color: #444444;
            letter-spacing: 2px;
            margin: 8px 0 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="pos-ticket-container">
          ${o}
        </div>
      </body>
    </html>
  `),n.close(),setTimeout(()=>{try{t.contentWindow.focus(),t.contentWindow.print()}catch(i){console.error("[printThermalReceipt] Falló iframe.print, ejecutando fallback:",i),window.print()}finally{setTimeout(()=>{t&&t.parentNode&&t.parentNode.removeChild(t)},1500)}},250)}export{m as p};

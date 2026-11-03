import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { DINER_STYLES } from '../config/dinerStyles';

/**
 * SELECTOR FLOTANTE DE ESTILOS GASTRONÓMICOS (MULTI-ESTILO)
 * Permite al comensal, dueño o evaluador alternar entre los 4 Estilos Maestros del PDF en tiempo real.
 * Diseñado como Bottom-Sheet / Modal centrado responsivo para móviles y escritorio.
 */
export default function DinerStyleSelector({ currentStyleId, onSelectStyle }) {
  const [isOpen, setIsOpen] = useState(false);

  // Evitar scroll en el fondo cuando el selector está abierto en móvil
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const stylesList = Object.values(DINER_STYLES);
  const activeStyle = DINER_STYLES[currentStyleId] || stylesList[1]; // default Lounge Nocturno

  return (
    <>
      {/* Botón flotante píldora: Visible en pantalla sin tapar el input ni la barra inferior */}
      <div className="fixed bottom-20 left-3 z-40 sm:bottom-auto sm:top-3 sm:left-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border shadow-xl transition-all active:scale-95 text-xs font-bold"
          style={{
            backgroundColor: activeStyle.colors.headerBg ? `${activeStyle.colors.headerBg}EE` : 'rgba(15,23,42,0.85)',
            color: activeStyle.colors.headerText || '#FFFFFF',
            borderColor: activeStyle.id === 'street_food' ? '#020617' : 'rgba(255,255,255,0.2)',
            borderWidth: activeStyle.id === 'street_food' ? '2px' : '1px',
            boxShadow: activeStyle.id === 'street_food' ? '2px 2px 0px #020617' : undefined
          }}
          title="Cambiar Estilo Visual del Menú"
        >
          <Palette className="w-3.5 h-3.5" style={{ color: activeStyle.colors.accent }} />
          <span className="hidden sm:inline">Estilo:</span>
          <span className="font-black" style={{ color: activeStyle.colors.accent }}>{activeStyle.shortName}</span>
        </button>
      </div>

      {/* Modal Centrado / Bottom Sheet Adaptativo en Móvil y Escritorio */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-5 text-white space-y-3.5 max-h-[85vh] flex flex-col animate-slideUp"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Seleccionar Estilo Gastronómico
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar selector de estilo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed shrink-0">
              Elige el concepto visual adaptado para la experiencia del comensal:
            </p>

            <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              {stylesList.map((st) => {
                const isSelected = st.id === currentStyleId;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      onSelectStyle(st.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 shadow-lg ring-1 ring-amber-500/30'
                        : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Indicador visual de color */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-inner"
                      style={{
                        backgroundColor: st.colors.headerBg,
                        color: st.colors.headerText,
                        borderColor: st.colors.accent
                      }}
                    >
                      {st.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-black text-white truncate">
                          {st.name}
                        </span>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-amber-500 text-slate-950 shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold mt-0.5 line-clamp-1" style={{ color: st.colors.accent }}>
                        {st.tagline}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-light">
                        {st.types}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

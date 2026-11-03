import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  Sparkles,
  Layers,
  ExternalLink
} from 'lucide-react';
import { getMediaUrl } from '../utils/media';

export default function RestaurantSwitcher({
  restaurants = [],
  activeRestaurant,
  onSelectRestaurant,
  onOpenCreateBranch,
  isVip = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const totalBranches = restaurants.length || 1;
  const isSecondBranchNext = totalBranches === 1;

  if (!isVip && restaurants.length <= 1) {
    const planName = activeRestaurant?.subscription?.plan === 'essential' ? 'Plan Esencial' : activeRestaurant?.subscription?.plan === 'chain_vip' ? 'VIP Fine Dining' : 'Experiencia 3D';
    return (
      <div className="w-full p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {activeRestaurant?.logoUrl ? (
            <img
              src={getMediaUrl(activeRestaurant.logoUrl)}
              alt="Logo"
              className="w-9 h-9 rounded-xl object-contain bg-slate-900 p-0.5 border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow">
              {(activeRestaurant?.name || 'V').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-xs font-black text-white truncate">
              {activeRestaurant?.name || 'Mi Restaurante'}
            </h3>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 block mt-0.5 w-fit">
              {planName}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      {/* Botón Principal del Conmutador */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2.5 text-left group shadow-inner"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {activeRestaurant?.logoUrl ? (
            <img
              src={getMediaUrl(activeRestaurant.logoUrl)}
              alt="Logo"
              className="w-9 h-9 rounded-xl object-contain bg-slate-900 p-0.5 border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow">
              {(activeRestaurant?.name || 'V').charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-white truncate group-hover:text-amber-300 transition-colors">
                {activeRestaurant?.name || 'Mi Restaurante'}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                activeRestaurant?.isBranch
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {activeRestaurant?.isBranch ? (activeRestaurant?.branchName || 'Sucursal') : 'Sede Matriz'}
              </span>
              {isVip && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  VIP
                </span>
              )}
            </div>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Menú Desplegable Flotante */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-scaleUp min-w-[240px]">
          
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800/80 mb-1">
            <span>Sedes del Grupo ({totalBranches})</span>
            {isVip && <span className="text-amber-400">Multi-Sede Activo</span>}
          </div>

          {/* Lista de Sedes */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 [scrollbar-width:thin]">
            {restaurants.map((rest) => {
              const isActive = (activeRestaurant?._id || activeRestaurant?.id) === (rest._id || rest.id);
              return (
                <button
                  key={rest._id || rest.id}
                  type="button"
                  onClick={() => {
                    onSelectRestaurant(rest._id || rest.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left flex items-center justify-between gap-2 transition-all ${
                    isActive
                      ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {rest.logoUrl ? (
                      <img
                        src={getMediaUrl(rest.logoUrl)}
                        alt="Logo"
                        className="w-7 h-7 rounded-lg object-contain bg-slate-950 p-0.5 border border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                        {(rest.name || 'V').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">
                        {rest.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {rest.isBranch ? `Sede: ${rest.branchName || 'Sucursal'}` : 'Matriz Principal'}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Separador y Botón Añadir Sucursal */}
          {isVip ? (
            <div className="pt-1.5 border-t border-slate-800/80 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenCreateBranch();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-between gap-2 transition-all group"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Añadir Sede / Sucursal</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  $999 MXN/mes
                </span>
              </button>
            </div>
          ) : (
            <div className="pt-1.5 border-t border-slate-800/80 mt-1 px-1">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300/90 text-center font-semibold">
                Sedes adicionales: Exclusivo Plan Cadenas & Franquicias
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

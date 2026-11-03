import React, { useState } from 'react';
import {
  X,
  Building2,
  Copy,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  FileText,
  DollarSign
} from 'lucide-react';
import axios from 'axios';

export default function CreateBranchModal({
  isOpen,
  onClose,
  parentRestaurant,
  currentBranchesCount = 1,
  token,
  onSuccess,
  onUpgradeToVip
}) {
  const [branchName, setBranchName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [cloneMenu, setCloneMenu] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isVip = parentRestaurant?.subscription?.plan === 'enterprise_chain';

  if (!isVip) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vip-locked-modal-title"
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      >
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative my-auto animate-scaleUp text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
            <Building2 className="w-7 h-7" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider mb-2">
            Exclusivo Plan Cadenas & Franquicias
          </span>

          <h2 id="vip-locked-modal-title" className="text-xl font-black text-white mb-2">
            Gestión de Sedes y Sucursales
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            La creación de sucursales adicionales con sincronización de carta está reservada exclusivamente para el <strong>Plan Cadenas & Franquicias</strong>. Mejora tu plan para habilitar nuevas sedes con tarifa preferencial de <strong>$999 MXN/mes</strong> (ahorras un 23% / $300 MXN al mes por cada sucursal).
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onUpgradeToVip) onUpgradeToVip();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Planes y Activar Plan Cadenas</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si es la 2da sede: 80% OFF ($259/mes). Si es la 3ra en adelante: $499/mes
  const isSecondBranch = currentBranchesCount === 1;
  const price = 999;
  const discountLabel = '23% de Descuento ($300 OFF)';

  const handleNameChange = (e) => {
    const val = e.target.value;
    setBranchName(val);
    if (!slugManuallyEdited && parentRestaurant?.slug) {
      const cleanBranch = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      setSlug(`${parentRestaurant.slug}-${cleanBranch}`.replace(/-+$/, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName.trim() || !slug.trim()) {
      setErrorMessage('Por favor ingresa el nombre de la sede y el enlace web.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const authHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-restaurant-id': parentRestaurant?._id
        }
      };

      const res = await axios.post('/api/v1/admin/branches', {
        branchName: branchName.trim(),
        slug: slug.trim(),
        cloneMenuFromRestaurantId: cloneMenu ? parentRestaurant?._id : null
      }, authHeaders);

      if (res.data.success) {
        onSuccess(res.data.data.restaurant);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error al crear la sucursal. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-branch-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-auto animate-scaleUp">
        
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 id="create-branch-modal-title" className="text-lg sm:text-xl font-black text-white">
              Añadir Nueva Sede / Sucursal
            </h2>
            <p className="text-xs text-slate-400">
              Expande tu red gastronómica bajo tu misma cuenta maestra VIP.
            </p>
          </div>
        </div>

        {/* Badge de Tarifa con Descuento */}
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{isSecondBranch ? '2da Sede del Grupo' : 'Sucursal Adicional'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {discountLabel}
                </span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Modelos 3D sincronizados con Catálogo Maestro + slots para platillos únicos de esta sede.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 pl-3">
            <span className="text-base font-black text-amber-400 block">${price}</span>
            <span className="text-[10px] text-slate-400">MXN / mes</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre de la Sede */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre o Ubicación de la Sede
            </label>
            <input
              type="text"
              value={branchName}
              onChange={handleNameChange}
              placeholder="Ej. Polanco, Roma Norte, Zona Rosa, Valle Oriente"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              required
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Se mostrará como: <strong>{parentRestaurant?.name || 'Restaurante'} - {branchName || 'Sede'}</strong>
            </span>
          </div>

          {/* Enlace Web / Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Identificador Web (Enlace de la carta)
            </label>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-400 focus-within:border-amber-500">
              <span className="text-slate-500 select-none shrink-0 font-mono">volum.menu/r/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                  setSlugManuallyEdited(true);
                }}
                placeholder="rydr-polanco"
                className="w-full bg-transparent text-white font-mono focus:outline-none ml-0.5"
                required
              />
            </div>
          </div>

          {/* Opción de Clonación de Carta */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Configuración Inicial de la Carta
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCloneMenu(true)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  cloneMenu
                    ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Clonar Catálogo</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Copia categorías, platillos, alérgenos y modelos 3D de la matriz al instante.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCloneMenu(false)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  !cloneMenu
                    ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-white">Carta en Blanco</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Comienza desde cero para una marca o concepto gastronómico diferente.
                </p>
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando Sede...' : `Crear Sede ($${price} MXN/mes)`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

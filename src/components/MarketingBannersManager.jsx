import React, { useState } from 'react';
import {
  Sparkles, Clock, Flame, Music, Tag, Gift, Percent, Calendar,
  Plus, Trash2, Edit3, Check, X, Eye, HelpCircle, Layers,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { MarketingBannerIcon } from './MarketingBannersDisplay';
import { isBannerActiveNow, getCountdownTimeRemaining } from '../utils/marketingBanners';

const AVAILABLE_ICONS = [
  { id: 'sparkles', label: 'Destacado' },
  { id: 'clock', label: 'Horario' },
  { id: 'flame', label: 'Fuego / Oferta' },
  { id: 'music', label: 'Música / Banda' },
  { id: 'percent', label: 'Descuento' },
  { id: 'tag', label: 'Etiqueta' },
  { id: 'gift', label: 'Regalo / 2x1' },
  { id: 'calendar', label: 'Evento' }
];

const DAYS_OF_WEEK = [
  { day: 1, label: 'Lun', name: 'Lunes' },
  { day: 2, label: 'Mar', name: 'Martes' },
  { day: 3, label: 'Mié', name: 'Miércoles' },
  { day: 4, label: 'Jue', name: 'Jueves' },
  { day: 5, label: 'Vie', name: 'Viernes' },
  { day: 6, label: 'Sáb', name: 'Sábado' },
  { day: 0, label: 'Dom', name: 'Domingo' }
];

const COLOR_THEMES = [
  { id: 'primary', label: 'Marca', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50' },
  { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  { id: 'rose', label: 'Rosa / Pasión', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50' },
  { id: 'indigo', label: 'Índigo', bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/50' }
];

const MarketingBannersManager = ({ restaurant, setRestaurant, onSaveTheme }) => {
  const [activeTab, setActiveTab] = useState('scheduled'); // 'fixed' | 'scheduled'
  const [editingBanner, setEditingBanner] = useState(null); // null o banner object
  const [isNewBanner, setIsNewBanner] = useState(false);

  const announcementBanner = restaurant?.settings?.announcementBanner || {
    enabled: false,
    text: '',
    icon: 'sparkles',
    badgeText: 'Novedad'
  };

  const marketingBanners = restaurant?.settings?.marketingBanners || {
    enabled: false,
    showFixedAndScheduled: true,
    scheduledBanners: []
  };

  const scheduledBanners = Array.isArray(marketingBanners.scheduledBanners)
    ? marketingBanners.scheduledBanners
    : [];

  // Actualizar banner fijo
  const updateFixedBanner = (updates) => {
    setRestaurant({
      ...restaurant,
      settings: {
        ...(restaurant?.settings || {}),
        announcementBanner: {
          ...announcementBanner,
          ...updates
        }
      }
    });
  };

  // Actualizar configuración global de marketing
  const updateMarketingSettings = (updates) => {
    setRestaurant({
      ...restaurant,
      settings: {
        ...(restaurant?.settings || {}),
        marketingBanners: {
          ...marketingBanners,
          ...updates
        }
      }
    });
  };

  // Guardar un banner programado (crear o editar)
  const handleSaveBanner = (bannerToSave) => {
    let updatedList;
    if (isNewBanner) {
      updatedList = [...scheduledBanners, { ...bannerToSave, id: Date.now().toString() }];
    } else {
      updatedList = scheduledBanners.map(b => (b.id === bannerToSave.id ? bannerToSave : b));
    }

    updateMarketingSettings({ scheduledBanners: updatedList });
    setEditingBanner(null);
    setIsNewBanner(false);
  };

  // Eliminar banner programado
  const handleDeleteBanner = (id) => {
    const updatedList = scheduledBanners.filter(b => b.id !== id);
    updateMarketingSettings({ scheduledBanners: updatedList });
  };

  // Alternar estado activo de un banner
  const handleToggleBannerActive = (id) => {
    const updatedList = scheduledBanners.map(b => (b.id === id ? { ...b, active: !b.active } : b));
    updateMarketingSettings({ scheduledBanners: updatedList });
  };

  // Plantillas de 1-clic para promociones instantáneas
  const handleAddHappyHourTemplate = () => {
    const template = {
      id: Date.now().toString(),
      title: 'Happy Hour 2x1 en mixología y cervezas artesanales',
      badgeText: '2x1',
      icon: 'gift',
      type: 'standard',
      scheduleType: 'recurring',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      startTime: '18:00',
      endTime: '20:00',
      active: true,
      colorTheme: 'primary'
    };
    updateMarketingSettings({
      enabled: true,
      scheduledBanners: [...scheduledBanners, template]
    });
  };

  const handleAddCountdownTemplate = () => {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(21, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;

    const template = {
      id: Date.now().toString(),
      title: 'Noche de Jazz en Vivo & Degustación de Vinos',
      badgeText: 'Evento',
      icon: 'music',
      type: 'countdown',
      targetDateTime: localIso,
      countdownCompletedText: '¡En Vivo Ahora!',
      active: true,
      colorTheme: 'rose'
    };
    updateMarketingSettings({
      enabled: true,
      scheduledBanners: [...scheduledBanners, template]
    });
  };

  // Iniciar creación de nuevo banner
  const handleStartNewBanner = () => {
    const defaultTarget = new Date();
    defaultTarget.setDate(defaultTarget.getDate() + 2);
    defaultTarget.setHours(21, 0, 0, 0);

    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${defaultTarget.getFullYear()}-${pad(defaultTarget.getMonth() + 1)}-${pad(defaultTarget.getDate())}T${pad(defaultTarget.getHours())}:${pad(defaultTarget.getMinutes())}`;

    setEditingBanner({
      id: Date.now().toString(),
      title: 'Bebidas 2x1 en mixología de autor',
      badgeText: '2x1',
      icon: 'gift',
      type: 'standard', // 'standard' | 'countdown'
      scheduleType: 'recurring',
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '18:00',
      endTime: '20:00',
      targetDateTime: localIso,
      countdownCompletedText: '¡En Vivo Ahora!',
      active: true,
      colorTheme: 'primary'
    });
    setIsNewBanner(true);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Banners de Marketing & Promociones Dinámicas</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configura anuncios fijos institucionales, ofertas por día/hora (ej. Happy Hour) y eventos con cuenta regresiva.
              </p>
            </div>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'scheduled'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Promociones & Eventos ({scheduledBanners.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fixed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'fixed'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Banner Fijo</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PESTAÑA 1: BANNER PRINCIPAL FIJO */}
      {/* ========================================================= */}
      {activeTab === 'fixed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <span className="text-xs font-bold text-white block">Activar Banner Fijo Permanente</span>
              <span className="text-[11px] text-slate-400">
                Se muestra siempre en el menú móvil para comunicar avisos generales, WiFi o bienvenida.
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateFixedBanner({ enabled: !announcementBanner.enabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                announcementBanner.enabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                  announcementBanner.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Texto del Anuncio Fijo
              </label>
              <input
                type="text"
                value={announcementBanner.text}
                onChange={(e) => updateFixedBanner({ text: e.target.value })}
                placeholder="Ej. Bienvenidos a La Terraza Gourmet — Disfruta nuestra carta WebAR 3D"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Insignia Corta (Badge)
                </label>
                <input
                  type="text"
                  value={announcementBanner.badgeText}
                  onChange={(e) => updateFixedBanner({ badgeText: e.target.value })}
                  placeholder="Ej. Aviso, WiFi, Cortesía"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Icono Vectorial (Lucide)
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AVAILABLE_ICONS.map(({ id, label }) => {
                    const isSelected = (announcementBanner.icon || 'sparkles') === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => updateFixedBanner({ icon: id })}
                        title={label}
                        className={`p-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <MarketingBannerIcon iconType={id} className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: BANNERS PROGRAMADOS & EVENTOS */}
      {/* ========================================================= */}
      {activeTab === 'scheduled' && (
        <div className="space-y-5">
          {/* Controles Maestros de Banners Dinámicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Motor de Banners Dinámicos</span>
                <span className="text-[11px] text-slate-400">
                  Activa promociones por turnos y cuentas regresivas.
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateMarketingSettings({ enabled: !marketingBanners.enabled })}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  marketingBanners.enabled ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                    marketingBanners.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Mostrar Fijo + Programado</span>
                <span className="text-[11px] text-slate-400">
                  Permite tener dos banners activos a la vez en pantalla.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateMarketingSettings({
                    showFixedAndScheduled: !marketingBanners.showFixedAndScheduled
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  marketingBanners.showFixedAndScheduled ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                    marketingBanners.showFixedAndScheduled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Barra de acción: Agregar Banner */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs font-semibold text-slate-300">
              Promociones Configuradas ({scheduledBanners.length})
            </span>
            <button
              type="button"
              onClick={handleStartNewBanner}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Promoción o Evento</span>
            </button>
          </div>

          {/* Lista de Banners Programados */}
          {scheduledBanners.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 space-y-3">
              <Clock className="w-9 h-9 text-amber-500/60 mx-auto" />
              <div>
                <p className="text-sm font-bold text-white">No hay promociones ni eventos programados aún</p>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Crea ofertas dinámicas para franjas horarias (ej. Happy Hour 18 a 20 h) o eventos con cronómetro de cuenta regresiva en vivo.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleStartNewBanner}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear Nueva Promoción</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddHappyHourTemplate}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Usar Plantilla Happy Hour 2x1</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddCountdownTemplate}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                >
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  <span>+ Usar Plantilla Noche de Jazz (Cronómetro)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {scheduledBanners.map((banner) => {
                const isActiveNow = isBannerActiveNow(banner);
                const isCountdown = banner.type === 'countdown';

                return (
                  <div
                    key={banner.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isActiveNow
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : banner.active
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
                        <MarketingBannerIcon iconType={banner.icon} className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                            {banner.badgeText || (isCountdown ? 'Evento' : 'Promo')}
                          </span>

                          <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                            {banner.title}
                          </span>

                          {isActiveNow && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                              ● En Vivo Ahora
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          {isCountdown ? (
                            <span>
                              ⏳ Fecha evento:{' '}
                              <strong className="text-slate-300">
                                {banner.targetDateTime ? new Date(banner.targetDateTime).toLocaleString() : 'No definida'}
                              </strong>
                            </span>
                          ) : (
                            <span>
                              🕒 Horario:{' '}
                              <strong className="text-slate-300">
                                {banner.startTime || '00:00'} a {banner.endTime || '23:59'} h
                              </strong>{' '}
                              ({banner.daysOfWeek?.length === 7 ? 'Todos los días' : `${banner.daysOfWeek?.length || 0} días`})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleBannerActive(banner.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          banner.active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title={banner.active ? 'Pausar promoción' : 'Activar promoción'}
                      >
                        {banner.active ? 'Activo' : 'Pausado'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingBanner({ ...banner });
                          setIsNewBanner(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL / FORMULARIO DESPLEGABLE: CREAR / EDITAR BANNER */}
      {/* ========================================================= */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isNewBanner ? 'Nueva Promoción o Evento' : 'Editar Promoción'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de Tipo: Oferta Recurrente vs Evento Cuenta Regresiva */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Tipo de Banner
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner({ ...editingBanner, type: 'standard' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    editingBanner.type === 'standard'
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold text-amber-300">🕒 Oferta por Horario</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Happy Hour, 2x1, días específicos (ej. miércoles de alitas).
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingBanner({ ...editingBanner, type: 'countdown' })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    editingBanner.type === 'countdown'
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold text-amber-300">⏳ Evento con Cronómetro</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Música en vivo, DJ, cena especial con cuenta regresiva.
                  </span>
                </button>
              </div>
            </div>

            {/* Texto del Banner */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Texto del Anuncio
              </label>
              <input
                type="text"
                value={editingBanner.title}
                onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                placeholder={
                  editingBanner.type === 'countdown'
                    ? 'Ej. Banda de Jazz en Vivo este Viernes en Terraza'
                    : 'Ej. Bebidas 2x1 en mixología de autor de 18:00 a 20:00 h'
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Insignia Corta
                </label>
                <input
                  type="text"
                  value={editingBanner.badgeText}
                  onChange={(e) => setEditingBanner({ ...editingBanner, badgeText: e.target.value })}
                  placeholder="Ej. 2x1, En Vivo, 20% OFF"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Tema de Color
                </label>
                <select
                  value={editingBanner.colorTheme || 'primary'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, colorTheme: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {COLOR_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Icono Vectorial */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Icono Vectorial (SVG Lucide)
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {AVAILABLE_ICONS.map(({ id, label }) => {
                  const isSelected = editingBanner.icon === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEditingBanner({ ...editingBanner, icon: id })}
                      title={label}
                      className={`p-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <MarketingBannerIcon iconType={id} className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuración Específica: Si es Countdown */}
            {editingBanner.type === 'countdown' ? (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Configuración de Cuenta Regresiva</span>
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Fecha y Hora del Evento
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editingBanner.targetDateTime
                        ? typeof editingBanner.targetDateTime === 'string'
                          ? editingBanner.targetDateTime.substring(0, 16)
                          : new Date(editingBanner.targetDateTime).toISOString().substring(0, 16)
                        : ''
                    }
                    onChange={(e) => setEditingBanner({ ...editingBanner, targetDateTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Texto al Iniciar el Evento (Lapso en vivo)
                  </label>
                  <input
                    type="text"
                    value={editingBanner.countdownCompletedText || '¡En Vivo Ahora!'}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, countdownCompletedText: e.target.value })
                    }
                    placeholder="¡En Vivo Ahora!"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              /* Configuración Específica: Si es Standard (Días y Horarios) */
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Días y Franja Horaria de la Promoción</span>
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Días de la Semana
                  </label>
                  <div className="flex items-center gap-1 flex-wrap">
                    {DAYS_OF_WEEK.map(({ day, label }) => {
                      const days = Array.isArray(editingBanner.daysOfWeek) ? editingBanner.daysOfWeek : [];
                      const isSelected = days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = isSelected
                              ? days.filter(d => d !== day)
                              : [...days, day];
                            setEditingBanner({ ...editingBanner, daysOfWeek: newDays });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      value={editingBanner.startTime || '18:00'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, startTime: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Hora Fin (Soporta medianoche)
                    </label>
                    <input
                      type="time"
                      value={editingBanner.endTime || '20:00'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, endTime: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Acción del Modal */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveBanner(editingBanner)}
                disabled={!editingBanner.title?.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Banner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingBannersManager;

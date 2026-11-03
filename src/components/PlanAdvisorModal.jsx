import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  Sparkles,
  Crown,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Info,
  Clock,
  Check,
  Layers,
  Flame,
  Utensils
} from 'lucide-react';

const BUSINESS_TYPES = [
  { id: 'cafeteria', label: 'Cafetería / Panadería', emoji: '☕', desc: 'Especialidad, repostería, bistró ágil' },
  { id: 'taqueria', label: 'Taquería / Street Food', emoji: '🌮', desc: 'Tacos gourmet, antojitos, alta rotación' },
  { id: 'pizzeria', label: 'Pizzería / Trattoria', emoji: '🍕', desc: 'Pizzas al leño, pastas artesanales' },
  { id: 'steakhouse', label: 'Asador / Steakhouse', emoji: '🥩', desc: 'Cortes finos, ahumados, parrilla' },
  { id: 'mariscos', label: 'Mariscos / Raw Bar', emoji: '🦐', desc: 'Ceviches, marisquerías de autor' },
  { id: 'bar_cocktail', label: 'Bar / Coctelería', emoji: '🍸', desc: 'Mixología premium, lounge, cervecería' },
  { id: 'fine_dining', label: 'Fine Dining / Autor', emoji: '🍷', desc: 'Alta cocina, mantel largo, degustación' },
  { id: 'other', label: 'Otro Restaurante', emoji: '🍽️', desc: 'Menú tradicional o internacional' }
];

const ALL_PLANS = {
  essential: {
    key: 'essential',
    name: 'Plan Esencial WebAR',
    monthlyPrice: 449,
    annualMonthlyPrice: 374,
    badge: 'Opción Ágil',
    slots3D: 4,
    vaultCapacity: 0,
    teamCapacity: 3,
    loses: [
      'Bajas de 15 a 4 platillos 3D activos en WebAR 1:1.',
      'Se retira la Bóveda Histórica 3D (no podrás guardar recetas estacionales).',
      'Sin pantalla de comandero de cocina (KDS) en tiempo real.',
      'Sin croquis interactivo de mesas para meseros.',
      'Sin pedidos directos en la mesa (auto-ordering).'
    ],
    keeps: [
      'Menú digital responsive para smartphones de comensales.',
      '4 platillos estrella permanentes en WebAR 1:1 escala real.',
      'Generador ilimitado de códigos QR para mesas y barra.',
      'Traductor gastronómico automático a inglés y francés.'
    ]
  },
  experience_3d: {
    key: 'experience_3d',
    name: 'Plan Experiencia 3D Completa',
    monthlyPrice: 799,
    annualMonthlyPrice: 665,
    badge: 'Más Popular Gastronómico',
    slots3D: 8,
    vaultCapacity: 8,
    teamCapacity: 10,
    loses: [
      'Bajas de 15 a 8 platillos 3D activos en WebAR 1:1.',
      'Bóveda reducida de 30 a 8 platillos históricos.',
      'Sin pantalla de comandero de cocina (KDS) en tiempo real.',
      'Sin pedidos directos comensal a cocina (auto-ordering).'
    ],
    keeps: [
      '8 platillos estrella en WebAR 1:1 escala real.',
      'Bóveda histórica de 8 platillos para rotar recetas de temporada.',
      'Consola de llamada y asistencia a meseros en vivo con sonido.',
      'Hasta 10 colaboradores con PIN de servicio y roles de equipo.'
    ]
  },
  chain_vip: {
    key: 'chain_vip',
    name: 'Plan VIP Fine Dining',
    monthlyPrice: 1299,
    annualMonthlyPrice: 1080,
    badge: 'Tu Plan VIP de Prueba (100% Completo)',
    slots3D: 15,
    vaultCapacity: 30,
    teamCapacity: 25,
    loses: [],
    keeps: [
      '¡Conservas el 100% de lo que probaste en tu semana VIP de prueba!',
      '15 platillos en WebAR 1:1 escala real de máxima fidelidad.',
      '30 espacios en Bóveda Histórica 3D para menús de temporada.',
      'Comandero digital de cocina (KDS) en tiempo real.',
      'Consola de meseros con croquis interactivo de sala.',
      'Pedidos digitales en la mesa (auto-ordering) y división de cuenta.',
      'Hasta 25 miembros de equipo con PIN y multi-restaurante sedes.'
    ]
  }
};

export default function PlanAdvisorModal({
  isOpen,
  onClose,
  restaurant,
  token,
  onPlanUpdated
}) {
  const currentBusinessType = restaurant?.subscription?.businessType || 'other';
  const [selectedType, setSelectedType] = useState(currentBusinessType);
  const [selectedPlanKey, setSelectedPlanKey] = useState('chain_vip');
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'annual'
  const [recommendationData, setRecommendationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Cargar recomendación al abrir el modal o cambiar el tipo de restaurante
  useEffect(() => {
    if (!isOpen) return;
    const fetchRecommendation = async () => {
      setIsLoading(true);
      setActionError(null);
      try {
        const res = await axios.get('/api/v1/admin/business-profile', {
          params: { businessType: selectedType },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.data?.success) {
          setRecommendationData(res.data);
          const recPlan = res.data.recommendation?.recommendedPlan || 'experience_3d';
          setSelectedPlanKey(recPlan);
        }
      } catch (err) {
        console.warn('Error al cargar recomendación:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [isOpen, selectedType, token]);

  if (!isOpen) return null;

  const currentPlanObj = ALL_PLANS[selectedPlanKey] || ALL_PLANS.chain_vip;
  const recommendedPlanKey = recommendationData?.recommendation?.recommendedPlan || 'chain_vip';
  const price = billingPeriod === 'annual' ? currentPlanObj.annualMonthlyPrice : currentPlanObj.monthlyPrice;

  // Manejar cambio de tipo de negocio
  const handleSelectBusinessType = async (typeId) => {
    setSelectedType(typeId);
    try {
      if (token) {
        await axios.post('/api/v1/admin/business-profile', {
          businessType: typeId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.warn('No se pudo guardar giro:', err);
    }
  };

  // Redirigir a Stripe Checkout
  const handleProceedToCheckout = async () => {
    setIsCheckoutLoading(true);
    setActionError(null);
    try {
      const res = await axios.post('/api/v1/billing/checkout', {
        planKey: selectedPlanKey,
        billingPeriod: billingPeriod
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setActionError('No se recibió enlace de pago de Stripe. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error al iniciar checkout:', err);
      setActionError(err.response?.data?.message || 'Error al conectar con la pasarela de pago.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Cabecera del Asesor */}
        <div className="relative bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Asesor Gastronómico de Planes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Durante tu prueba gratuita de 7 días disfrutaste del <strong>Plan VIP Fine Dining completo</strong>.
              Selecciona el giro de tu restaurante para conocer la mejor recomendación y revisar exactamente
              qué funciones se conservarían o retirarían si eliges otro plan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* PASO 1: Selector de Giro Gastronómico */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              1. ¿Qué tipo de restaurante o negocio gastronómico manejas?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BUSINESS_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleSelectBusinessType(type.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[82px] ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/70 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{type.emoji}</span>
                      {isSelected && (
                        <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-black ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {type.label}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {type.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: Selector de Planes y Conmutador Mensual/Anual */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                  2. Compara y elige tu plan
                </label>
                <span className="text-xs text-slate-400">
                  El plan recomendado para tu giro está resaltado con estrella.
                </span>
              </div>

              {/* Selector Mensual / Anual */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingPeriod === 'annual'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Anual</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300">
                    2 meses gratis
                  </span>
                </button>
              </div>
            </div>

            {/* Tarjetas de Planes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(ALL_PLANS).map((plan) => {
                const isSelected = selectedPlanKey === plan.key;
                const isRecommended = recommendedPlanKey === plan.key;
                const planPrice = billingPeriod === 'annual' ? plan.annualMonthlyPrice : plan.monthlyPrice;

                return (
                  <button
                    key={plan.key}
                    type="button"
                    onClick={() => setSelectedPlanKey(plan.key)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-500 shadow-xl ring-2 ring-amber-500/40'
                        : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        {isRecommended ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Recomendado
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {plan.badge}
                          </span>
                        )}

                        {isSelected && (
                          <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-white">{plan.name}</h3>

                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">${planPrice}</span>
                        <span className="text-xs text-slate-400">MXN / mes</span>
                      </div>

                      <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 space-y-1 text-[11px] text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Slots 3D activos:</span>
                          <strong className="text-amber-400 font-bold">{plan.slots3D} platillos</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Bóveda histórica:</span>
                          <strong className="text-white font-bold">
                            {plan.vaultCapacity > 0 ? `${plan.vaultCapacity} espacios` : 'Sin bóveda'}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Equipo:</span>
                          <span className="text-white font-semibold">{plan.teamCapacity} miembros</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                      <span
                        className={`text-[11px] font-bold block text-center py-1.5 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-700/60 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Plan Seleccionado' : 'Seleccionar'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 3: TRANSPARENCIA TOTAL — QUÉ SE QUITA Y QUÉ SE CONSERVA */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Info className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs sm:text-sm font-black text-white">
                Transparencia de Cambio de Plan vs Tu Prueba VIP Actual
              </h4>
            </div>

            {/* SECCIÓN 1: LO QUE SE QUITA (DOWNGRADE NOTICE) */}
            {currentPlanObj.loses.length > 0 ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Lo que se retiraría de tu menú si eliges el {currentPlanObj.name}:</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {currentPlanObj.loses.map((loseItem, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-rose-200 leading-relaxed">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                      <span>{loseItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-black text-amber-300">
                    ¡Con el Plan VIP Fine Dining conservas el 100% de todo!
                  </h5>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Mantienes exactamente todas las funciones, tus 15 platillos en WebAR 1:1, los 30 espacios de bóveda,
                    el croquis interactivo de meseros y el comandero KDS en vivo sin ninguna restricción.
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: LO QUE CONSERVAS */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lo que conservas y obtienes con este plan:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
                {currentPlanObj.keeps.map((keepItem, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-emerald-100 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{keepItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {actionError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{actionError}</span>
            </div>
          )}
        </div>

        {/* Pie del Modal con Botón de Contratación */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white">
                ${price} MXN
              </span>
              <span className="text-xs text-slate-400">
                / {billingPeriod === 'annual' ? 'mes (facturado anualmente)' : 'mes'} (+ IVA)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Contratación segura con Stripe • Cancela o cambia de plan en cualquier momento
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Seguir en mi Prueba VIP
            </button>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={isCheckoutLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50"
            >
              {isCheckoutLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Conectando con Stripe...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Contratar {currentPlanObj.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

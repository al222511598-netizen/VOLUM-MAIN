import React, { useState } from 'react';
import axios from 'axios';
import {
  Lock,
  Crown,
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  LogOut,
  LifeBuoy,
  ShieldCheck,
  Check
} from 'lucide-react';

const PAYWALL_PLANS = [
  {
    key: 'essential',
    name: 'Plan Esencial WebAR',
    monthlyPrice: 449,
    annualMonthlyPrice: 374,
    badge: 'Ágil y Económico',
    slots: '4 platillos en 3D',
    highlight: 'Ideal para cafeterías y bistrós rápidos'
  },
  {
    key: 'experience_3d',
    name: 'Plan Experiencia 3D Completa',
    monthlyPrice: 799,
    annualMonthlyPrice: 665,
    badge: 'Más Popular Gastronómico',
    isPopular: true,
    slots: '8 platillos 3D + Bóveda',
    highlight: 'Ideal para taquerías, pizzerías y bares'
  },
  {
    key: 'chain_vip',
    name: 'Plan VIP Fine Dining',
    monthlyPrice: 1299,
    annualMonthlyPrice: 1080,
    badge: 'Tu Plan de Prueba (Conserva el 100%)',
    isVip: true,
    slots: '15 platillos 3D + Bóveda 30',
    highlight: 'Cortes finos, mariscos, croquis y comandero KDS'
  }
];

export default function TrialPaywallModal({
  isOpen,
  restaurant,
  token,
  onLogout,
  onOpenSupport
}) {
  const [selectedPlanKey, setSelectedPlanKey] = useState(
    restaurant?.subscription?.recommendedPlan || 'experience_3d'
  );
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const currentPlan = PAYWALL_PLANS.find((p) => p.key === selectedPlanKey) || PAYWALL_PLANS[1];
  const price = billingPeriod === 'annual' ? currentPlan.annualMonthlyPrice : currentPlan.monthlyPrice;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/v1/billing/checkout', {
        planKey: selectedPlanKey,
        billingPeriod
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError('No se recibió la sesión de Stripe. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error al generar checkout de desbloqueo:', err);
      setError(err.response?.data?.message || 'Error al conectar con el procesador de pagos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Cabecera Paywall */}
        <div className="relative bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/50 p-6 sm:p-7 border-b border-slate-800 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Prueba Gratuita VIP Finalizada
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Desbloquea el Menú de tu Restaurante
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            Tu prueba de <strong>7 días con Plan VIP</strong> ha concluido. Esperamos que hayas comprobado cómo
            la tecnología WebAR 1:1 y las comandas digitales transforman tu servicio. Elige tu plan definitivo
            para reactivar la edición y tu menú público al instante.
          </p>
        </div>

        {/* Cuerpo Paywall */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Conmutador Facturación */}
          <div className="flex justify-center">
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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

          {/* Selector de Planes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYWALL_PLANS.map((plan) => {
              const isSelected = selectedPlanKey === plan.key;
              const planPrice = billingPeriod === 'annual' ? plan.annualMonthlyPrice : plan.monthlyPrice;

              return (
                <button
                  key={plan.key}
                  type="button"
                  onClick={() => setSelectedPlanKey(plan.key)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase text-amber-400/90">
                        {plan.badge}
                      </span>
                      {isSelected && (
                        <span className="p-1 rounded-full bg-amber-500 text-slate-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-black text-white">{plan.name}</div>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-black text-white">${planPrice}</span>
                      <span className="text-[10px] text-slate-400">MXN/mes</span>
                    </div>

                    <p className="text-[10px] text-slate-300 mt-1 font-semibold">{plan.slots}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{plan.highlight}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/50">
                    <span
                      className={`text-[10px] font-bold block text-center py-1 rounded-lg ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      {isSelected ? 'Elegido' : 'Seleccionar'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Botón de Pago Principal */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Generando checkout seguro con Stripe...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Desbloquear Menú con {currentPlan.name} (${price} MXN/mes)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Pie con opciones secundarias */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          {onOpenSupport ? (
            <button
              type="button"
              onClick={onOpenSupport}
              className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>¿Necesitas ayuda o factura?</span>
            </button>
          ) : (
            <span>Stripe 256-bit SSL</span>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

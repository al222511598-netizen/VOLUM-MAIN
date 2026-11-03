import React, { useMemo } from 'react';
import {
  Crown,
  Sparkles,
  Clock,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

/**
 * TrialBanner: Banner premium superior para restaurantes en periodo de prueba VIP de 7 días.
 * Muestra el tiempo restante y accesos al Recomendador de Planes según giro gastronómico.
 */
export default function TrialBanner({ restaurant, onOpenAdvisor, onOpenCheckout }) {
  const sub = restaurant?.subscription;

  // Solo visible si está en periodo de prueba trialing
  if (!sub || sub.status !== 'trialing') {
    return null;
  }

  // Omitir en la cuenta demo oficial si se desea, o mostrar si tiene prueba
  if (restaurant?.slug === 'la-terraza') {
    return null;
  }

  const { isExpired, daysLeft, hoursLeft, isUrgent } = useMemo(() => {
    if (!sub.trialEndsAt) {
      return { isExpired: false, daysLeft: 7, hoursLeft: 0, isUrgent: false };
    }
    const end = new Date(sub.trialEndsAt).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      return { isExpired: true, daysLeft: 0, hoursLeft: 0, isUrgent: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const urgent = days === 0; // Menos de 24 horas restantes

    return { isExpired: false, daysLeft: days, hoursLeft: hours, isUrgent: urgent };
  }, [sub?.trialEndsAt]);

  return (
    <div
      className={`relative overflow-hidden mb-6 rounded-2xl border transition-all duration-300 shadow-xl ${
        isUrgent
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border-rose-500/40 shadow-rose-950/30'
          : 'bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-950 border-amber-500/35 shadow-amber-950/20'
      }`}
    >
      {/* Resplandor decorativo de fondo */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Lado izquierdo: Identificador VIP y Contador */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${
              isUrgent
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            ) : (
              <Crown className="w-5 h-5 text-amber-400" />
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Crown className="w-3 h-3 text-amber-400" />
                Prueba VIP de 7 Días Activa
              </span>

              {isExpired ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3" />
                  Periodo finalizado
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    isUrgent
                      ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  {daysLeft > 0 ? (
                    <>
                      Te quedan <strong>{daysLeft} días</strong> y <strong>{hoursLeft} hrs</strong>
                    </>
                  ) : (
                    <>
                      ⚠️ ¡Últimas <strong>{Math.max(1, hoursLeft)} horas</strong> de prueba!
                    </>
                  )}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Estás disfrutando el <strong>Plan VIP Fine Dining</strong> completo (15 platillos en WebAR 1:1,
              Bóveda Histórica, croquis de mesas y comandero). Conoce qué plan se ajusta al giro de tu restaurante
              antes de que termine tu periodo gratuito.
            </p>
          </div>
        </div>

        {/* Lado derecho: Botones de Acción */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={onOpenAdvisor}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:border-amber-500/50 active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>¿Qué plan le conviene a mi negocio?</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdvisor}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>Elegir Plan Definitivo</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}

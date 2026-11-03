import React from 'react';
import { Coffee, Utensils, Moon, Sun, Clock, Sparkles } from 'lucide-react';

const ICONS = {
  Coffee: Coffee,
  Utensils: Utensils,
  Moon: Moon,
  Sun: Sun,
  Clock: Clock
};

export default function MealScheduleSelector({
  schedules = [],
  activeScheduleId,
  currentServiceScheduleId,
  onSelectSchedule,
  isDark = true
}) {
  if (!Array.isArray(schedules) || schedules.length === 0) return null;

  return (
    <div className="w-full my-3 px-3 sm:px-4 animate-fadeIn">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg overflow-x-auto no-scrollbar">
        {schedules
          .filter((s) => s.isActive !== false)
          .map((sched) => {
            const isSelected = activeScheduleId === sched.id;
            const isCurrentInService = currentServiceScheduleId === sched.id;
            const Icon = ICONS[sched.icon] || Utensils;

            return (
              <button
                key={sched.id}
                type="button"
                onClick={() => onSelectSchedule(sched.id)}
                className={`flex-1 min-w-[110px] sm:min-w-[130px] py-2 px-3 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 relative active:scale-95 text-center ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25 ring-1 ring-amber-400'
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                {/* Indicador de "En Servicio Ahora" */}
                {isCurrentInService && (
                  <span
                    className={`absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wider uppercase border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En servicio
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="text-xs font-bold truncate">{sched.name}</span>
                </div>

                <span
                  className={`text-[10px] font-mono leading-none ${
                    isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {sched.startTime} - {sched.endTime}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import {
  Clock,
  Coffee,
  Utensils,
  Moon,
  Sun,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { DEFAULT_MEAL_SCHEDULES } from '../utils/mealSchedules';

const AVAILABLE_ICONS = [
  { id: 'Coffee', label: 'Café / Desayuno', Icon: Coffee },
  { id: 'Utensils', label: 'Cubiertos / Comida', Icon: Utensils },
  { id: 'Moon', label: 'Luna / Cena', Icon: Moon },
  { id: 'Sun', label: 'Sol / Brunch', Icon: Sun },
  { id: 'Clock', label: 'Reloj / Turno', Icon: Clock }
];

export default function MealSchedulesManager({
  restaurant,
  token,
  onUpdated,
  showToast
}) {
  const initialSettings = restaurant?.settings?.mealSchedules || {
    enabled: false,
    autoSwitch: true,
    schedules: DEFAULT_MEAL_SCHEDULES
  };

  const [enabled, setEnabled] = useState(Boolean(initialSettings.enabled));
  const [autoSwitch, setAutoSwitch] = useState(
    initialSettings.autoSwitch !== undefined ? Boolean(initialSettings.autoSwitch) : true
  );
  const [schedules, setSchedules] = useState(
    Array.isArray(initialSettings.schedules) && initialSettings.schedules.length > 0
      ? initialSettings.schedules
      : DEFAULT_MEAL_SCHEDULES
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Agregar nuevo turno personalizado
  const handleAddSchedule = () => {
    const newId = `shift_${Date.now()}`;
    setSchedules((prev) => [
      ...prev,
      {
        id: newId,
        name: 'Nuevo Turno',
        startTime: '16:00',
        endTime: '20:00',
        badge: 'Especial',
        icon: 'Utensils',
        isActive: true
      }
    ]);
  };

  // Modificar un campo de un turno
  const handleUpdateSchedule = (index, field, value) => {
    setSchedules((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Eliminar turno
  const handleDeleteSchedule = (index) => {
    if (schedules.length <= 1) {
      if (showToast) showToast('Debes mantener al menos un turno en la lista.', 'info');
      return;
    }
    setSchedules((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Restablecer a turnos predeterminados
  const handleResetDefaults = () => {
    setSchedules(DEFAULT_MEAL_SCHEDULES);
    if (showToast) showToast('Turnos restablecidos a Desayunos, Comidas y Cenas.', 'info');
  };

  // Guardar configuración
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        mealSchedules: {
          enabled,
          autoSwitch,
          schedules
        }
      };

      const res = await axios.put('/api/v1/admin/theme', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.success) {
        setSaveSuccess(true);
        if (showToast) showToast('Configuración de horarios y turnos guardada exitosamente.', 'success');
        if (onUpdated) onUpdated(res.data.restaurant);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error al guardar turnos:', err);
      if (showToast) {
        showToast(err.response?.data?.message || 'Error al guardar configuración de turnos.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white">
              Multi-Cartas por Turno (Desayunos, Comidas y Cenas)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configura cartas independientes según el horario del día. El menú digital de tus comensales cambiará
            automáticamente según la hora de servicio.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
            title="Restablecer turnos estándar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* Interruptores Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle 1: Activar Multi-Cartas */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black text-white">
              ¿Manejas múltiples cartas por horario?
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Si se desactiva, se mostrará una única carta continua durante todo el día.
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Toggle 2: Detección Automática */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black text-white">
              Cambio automático según el reloj
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              El menú comensal detecta la hora y abre en el turno activo en ese instante.
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={autoSwitch}
              disabled={!enabled}
              onChange={(e) => setAutoSwitch(e.target.checked)}
              className="sr-only peer disabled:opacity-40"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      </div>

      {/* Lista de Turnos y Franjas Horarias */}
      {enabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Franjas Horarias Configuradas
            </h4>

            <button
              type="button"
              onClick={handleAddSchedule}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Franja Horaria</span>
            </button>
          </div>

          <div className="space-y-3">
            {schedules.map((sched, idx) => (
              <div
                key={sched.id || idx}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/70 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
              >
                {/* Nombre y Etiqueta */}
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <div className="p-2 rounded-xl bg-slate-700/60 text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={sched.name}
                      onChange={(e) => handleUpdateSchedule(idx, 'name', e.target.value)}
                      placeholder="Nombre del turno (ej. Desayunos)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Horarios Inicio - Fin */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">De:</span>
                    <input
                      type="time"
                      value={sched.startTime}
                      onChange={(e) => handleUpdateSchedule(idx, 'startTime', e.target.value)}
                      className="bg-transparent text-white text-xs font-mono font-bold outline-none"
                    />
                  </div>

                  <span className="text-slate-500 text-xs">a</span>

                  <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Hasta:</span>
                    <input
                      type="time"
                      value={sched.endTime}
                      onChange={(e) => handleUpdateSchedule(idx, 'endTime', e.target.value)}
                      className="bg-transparent text-white text-xs font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateSchedule(idx, 'isActive', !sched.isActive)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      sched.isActive !== false
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {sched.isActive !== false ? 'Activo' : 'Pausado'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSchedule(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
                    title="Eliminar franja horaria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de Guardar */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Los platillos pueden ser asignados a uno o varios turnos desde el Catálogo de Platillos.
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Guardando...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Guardado con éxito!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Configuración de Turnos</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

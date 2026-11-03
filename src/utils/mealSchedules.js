/**
 * Utilidades para la gestión de Multi-Cartas por Turnos y Horarios (Fase 4)
 * Soporta detección automática de franja horaria (con cruce de medianoche),
 * filtrado comensal y presets gastronómicos estándar.
 */

export const DEFAULT_MEAL_SCHEDULES = [
  {
    id: 'breakfast',
    name: 'Desayunos',
    startTime: '07:00',
    endTime: '12:30',
    badge: 'Matutino',
    icon: 'Coffee',
    isActive: true
  },
  {
    id: 'lunch',
    name: 'Comidas',
    startTime: '12:30',
    endTime: '19:00',
    badge: 'Mediodía',
    icon: 'Utensils',
    isActive: true
  },
  {
    id: 'dinner',
    name: 'Cenas',
    startTime: '19:00',
    endTime: '02:00',
    badge: 'Nocturno',
    icon: 'Moon',
    isActive: true
  }
];

/**
 * Convierte un string de hora 'HH:mm' a minutos desde la medianoche (0 - 1439)
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map((num) => parseInt(num, 10) || 0);
  return hours * 60 + minutes;
};

/**
 * Determina si una hora específica (en minutos) cae dentro del rango de un turno,
 * contemplando turnos que cruzan la medianoche (ej. 19:00 a 02:00).
 */
export const isTimeWithinSchedule = (timeMinutes, startMinutes, endMinutes) => {
  if (startMinutes <= endMinutes) {
    // Rango normal en el mismo día (ej. 07:00 a 12:30)
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  }
  // Rango que cruza la medianoche (ej. 19:00 a 02:00)
  return timeMinutes >= startMinutes || timeMinutes < endMinutes;
};

/**
 * Detecta qué turno se encuentra actualmente en servicio según la hora local
 */
export const getCurrentSchedule = (schedules = [], currentDate = new Date()) => {
  if (!Array.isArray(schedules) || schedules.length === 0) return null;

  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const activeSchedules = schedules.filter((s) => s.isActive !== false);

  for (const sched of activeSchedules) {
    const startM = timeToMinutes(sched.startTime);
    const endM = timeToMinutes(sched.endTime);

    if (isTimeWithinSchedule(currentMinutes, startM, endM)) {
      return sched;
    }
  }

  // Si no coincide con ninguno exacto, retornar el primer turno activo como fallback
  return activeSchedules[0] || null;
};

/**
 * Valida si un platillo está disponible en un turno específico
 */
export const isDishInSchedule = (dish, scheduleId) => {
  if (!dish) return false;
  if (!scheduleId || scheduleId === 'all') return true;

  const schedules = Array.isArray(dish.availableSchedules) && dish.availableSchedules.length > 0
    ? dish.availableSchedules
    : ['all'];

  return schedules.includes('all') || schedules.includes(scheduleId);
};

/**
 * Valida si una categoría completa está disponible en un turno específico
 */
export const isCategoryInSchedule = (category, scheduleId) => {
  if (!category) return false;
  if (!scheduleId || scheduleId === 'all') return true;

  const schedules = Array.isArray(category.availableSchedules) && category.availableSchedules.length > 0
    ? category.availableSchedules
    : ['all'];

  return schedules.includes('all') || schedules.includes(scheduleId);
};

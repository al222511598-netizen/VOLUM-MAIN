/**
 * Utilidades Algorítmicas para Banners Dinámicos de Marketing y Cuenta Regresiva
 * Volum-Menu SaaS - Fase 5
 */

/**
 * Convierte un string de hora 'HH:mm' a minutos transcurridos desde medianoche
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return Math.min(Math.max(hours * 60 + minutes, 0), 1439);
};

/**
 * Determina si una hora en minutos se encuentra dentro de un rango horario,
 * contemplando de forma robusta cruces de medianoche (ej. 22:00 a 02:00).
 */
export const isTimeWithinRange = (timeMinutes, startMinutes, endMinutes) => {
  if (startMinutes <= endMinutes) {
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }
  // Cruce de medianoche
  return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
};

/**
 * Calcula el tiempo restante hasta la fecha objetivo para un cronómetro de cuenta regresiva
 */
export const getCountdownTimeRemaining = (targetDateTime, now = new Date()) => {
  if (!targetDateTime) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true, isLiveNow: false, formatted: '' };
  }

  const target = new Date(targetDateTime).getTime();
  const current = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const diff = target - current;

  // Si ya llegó a cero o es pasado
  if (diff <= 0) {
    // Lapso de cortesía de 3 horas para mostrar "¡En Vivo Ahora!"
    const gracePeriodMs = 3 * 60 * 60 * 1000;
    const isLiveNow = diff > -gracePeriodMs;
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: true,
      isLiveNow,
      formatted: isLiveNow ? '00:00:00' : ''
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  // Formato compacto
  const pad = (n) => String(n).padStart(2, '0');
  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  } else {
    formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isCompleted: false,
    isLiveNow: false,
    formatted
  };
};

/**
 * Evalúa si un banner específico está activo en este preciso instante
 */
export const isBannerActiveNow = (banner, now = new Date()) => {
  if (!banner || banner.active === false) return false;

  // 1. Tipo Countdown (evento con fecha y hora fija)
  if (banner.type === 'countdown') {
    if (!banner.targetDateTime) return false;
    const remaining = getCountdownTimeRemaining(banner.targetDateTime, now);
    // Activo mientras cuenta o durante el lapso "En Vivo" (3h después)
    return !remaining.isCompleted || remaining.isLiveNow;
  }

  // 2. Tipo Estándar Programado (días y horas)
  if (banner.scheduleType === 'recurring' || !banner.scheduleType) {
    // Validar día de la semana
    const currentDay = now.getDay(); // 0=Domingo, 1=Lunes, ...
    if (Array.isArray(banner.daysOfWeek) && banner.daysOfWeek.length > 0) {
      if (!banner.daysOfWeek.includes(currentDay)) {
        return false;
      }
    }

    // Validar rango horario
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMin = timeToMinutes(banner.startTime || '00:00');
    const endMin = timeToMinutes(banner.endTime || '23:59');

    return isTimeWithinRange(currentMinutes, startMin, endMin);
  }

  return false;
};

/**
 * Obtiene la lista activa de banners a renderizar en el menú comensal y simulador
 * Máximo 2 banners simultáneos para no sobrecargar visualmente la pantalla.
 */
export const getActiveMarketingBanners = (settings = {}, now = new Date()) => {
  const marketingBanners = settings?.marketingBanners;
  const announcementBanner = settings?.announcementBanner;

  const results = [];

  // 1. Si el motor avanzado de marketing está habilitado
  if (marketingBanners?.enabled) {
    const scheduled = Array.isArray(marketingBanners.scheduledBanners) ? marketingBanners.scheduledBanners : [];
    const activeScheduled = scheduled.filter(b => isBannerActiveNow(b, now));

    if (marketingBanners.showFixedAndScheduled) {
      // Prioridad 1: Banner de evento o promoción programada activa
      if (activeScheduled.length > 0) {
        results.push(activeScheduled[0]);
      }
      // Prioridad 2: Banner fijo institucional
      if (announcementBanner?.enabled && announcementBanner.text) {
        results.push({
          id: 'fixed-announcement',
          isFixed: true,
          title: announcementBanner.text,
          badgeText: announcementBanner.badgeText || 'Novedad',
          icon: announcementBanner.icon || 'sparkles',
          colorTheme: 'primary'
        });
      }
      // Si hay un segundo banner programado y no hay fijo, agregarlo
      if (results.length < 2 && activeScheduled.length > 1) {
        results.push(activeScheduled[1]);
      }
    } else {
      // Modo exclusivo: Solo muestra el programado si está activo, de lo contrario el fijo
      if (activeScheduled.length > 0) {
        results.push(activeScheduled[0]);
      } else if (announcementBanner?.enabled && announcementBanner.text) {
        results.push({
          id: 'fixed-announcement',
          isFixed: true,
          title: announcementBanner.text,
          badgeText: announcementBanner.badgeText || 'Novedad',
          icon: announcementBanner.icon || 'sparkles',
          colorTheme: 'primary'
        });
      }
    }

    return results;
  }

  // 2. Modo tradicional retrocompatible: Solo announcementBanner
  if (announcementBanner?.enabled && announcementBanner.text) {
    return [{
      id: 'fixed-announcement',
      isFixed: true,
      title: announcementBanner.text,
      badgeText: announcementBanner.badgeText || 'Novedad',
      icon: announcementBanner.icon || 'sparkles',
      colorTheme: 'primary'
    }];
  }

  return [];
};

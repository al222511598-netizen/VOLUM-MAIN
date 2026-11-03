/**
 * Resuelve URLs de recursos multimedia (logotipos, banners, modelos 3D y fotos de platillos)
 * Si la URL ya es absoluta (https://...), se mantiene idéntica.
 * Si es una ruta relativa (/uploads/...), se concatena con la URL base del backend.
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // Modelos 3D y assets estáticos empaquetados en la carpeta public del frontend
  if (url.startsWith('/models/') || url.startsWith('models/')) {
    return url.startsWith('/') ? url : `/${url}`;
  }

  const rawApiUrl = import.meta.env.VITE_API_URL || 'https://volum-menu.onrender.com/api/v1';
  const baseUrl = rawApiUrl
    ? rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
    : 'https://volum-menu.onrender.com';

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

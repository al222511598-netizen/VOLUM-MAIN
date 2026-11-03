import React from 'react';
import ServiceModePage from '../../pages/service/ServiceModePage';

/**
 * Suite Operativa: Modo Servicio / Meseros y Barra (/servicio)
 * - Acceso rápido por PIN de 4 dígitos
 * - Alertas audibles con campanilla (*ding*) en tiempo real vía SSE
 * - Wake Lock API para mantener la pantalla de la tablet/móvil siempre encendida
 */
export default function ServiceApp() {
  return <ServiceModePage />;
}

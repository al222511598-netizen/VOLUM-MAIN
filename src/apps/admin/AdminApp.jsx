import React, { useState, useEffect } from 'react';
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage';
import SystemBroadcastBanner from '../../components/SystemBroadcastBanner';

/**
 * Suite Operativa: Panel Administrativo SaaS de Restaurantes (/app y /login)
 * - Gestión completa de platillos 2D y modelos 3D volumétricos
 * - Bóveda histórica para rotación estacional sin reimprimir cartas
 * - Generador vectorial de códigos QR SVG
 * - Personalización visual y simulador PhoneSimulator en tiempo real
 * - Facturación SaaS con Stripe Checkout y Portal de Clientes
 * - Receptor de Comunicados, Mantenimiento y Aceptación de Políticas de SuperAdmin
 */
export default function AdminApp() {
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const cached = localStorage.getItem('volum_admin_restaurant');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('volum_admin_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // Mantener sincronizado cuando el usuario inicia sesión o cambia de restaurante
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const cachedRest = localStorage.getItem('volum_admin_restaurant');
        const cachedUser = localStorage.getItem('volum_admin_user');
        if (cachedRest) setRestaurant(JSON.parse(cachedRest));
        if (cachedUser) setUser(JSON.parse(cachedUser));
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SystemBroadcastBanner restaurantId={restaurant?._id} user={user} />
      <div className="flex-1">
        <AdminDashboardPage />
      </div>
    </div>
  );
}

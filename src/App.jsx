import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Code Splitting dinámico: Aislamiento del bundle entre Apps operativas SaaS
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const DinerMenuPage = lazy(() => import('./apps/menu/DinerMenuApp'));
const ServiceModePage = lazy(() => import('./apps/service/ServiceApp'));
const AdminDashboardPage = lazy(() => import('./apps/admin/AdminApp'));
const WebARDirectViewPage = lazy(() => import('./pages/demo/WebARDirectViewPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'));
const CompanionUploadPage = lazy(() => import('./pages/companion/CompanionUploadPage'));
const Companion3DCapturePage = lazy(() => import('./pages/companion/Companion3DCapturePage'));
const VolumMainPage = lazy(() => import('./pages/main/VolumCorporateLanding.tsx'));
import FloatingFeedbackWidget from './components/FloatingFeedbackWidget';

const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
    <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
    <span className="text-sm font-medium tracking-wide">Cargando Volum-Menu...</span>
  </div>
);

// Enrutador inteligente: Si el dueño ya compró / tiene sesión activa, va directo a /app.
// Si es un visitante nuevo o prospecto, ve la Landing Page comercial con el simulador 3D.
const SmartHomeRoute = () => {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('volum_admin_token') || localStorage.getItem('token'))
    : null;

  if (token) {
    return <Navigate to="/app" replace />;
  }
  return <LandingPage />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Detección Dinámica de Sesión: Landing para prospectos, /app para clientes activos */}
          <Route path="/" element={<SmartHomeRoute />} />

          {/* Volum-Main: Portal Corporativo e Identidad de Marca */}
          <Route path="/volum-main" element={<VolumMainPage />} />
          <Route path="/volum" element={<VolumMainPage />} />
          <Route path="/main" element={<VolumMainPage />} />

          {/* Visualizador Directo WebAR 1:1 para Escaneo QR desde Landing */}
          <Route path="/demo/ar" element={<WebARDirectViewPage />} />

          {/* Menú Interactivo del Comensal (WebAR 1:1) */}
          <Route path="/r/:slug" element={<DinerMenuPage />} />
          <Route path="/menu/:slug" element={<DinerMenuPage />} />
          <Route path="/carta/:slug" element={<DinerMenuPage />} />

          {/* Modo Servicio / Mesero / Barra (PIN de 4 dígitos y alertas sonoras) */}
          <Route path="/servicio" element={<ServiceModePage />} />

          {/* Panel Administrativo e Inicio de Sesión */}
          <Route path="/app" element={<AdminDashboardPage />} />
          <Route path="/login" element={<AdminDashboardPage />} />

          {/* Captura móvil vía QR desde el panel (Fase 3) */}
          <Route path="/m/upload/:token" element={<CompanionUploadPage />} />
          {/* Escáner 3D Asistido por IA desde Celular (Tripo3D) */}
          <Route path="/m/capture-3d/:token" element={<Companion3DCapturePage />} />

          {/* Páginas Legales y Cumplimiento Normativo */}
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/terminos" element={<TermsOfServicePage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Asistente Flotante Global: Reporte de Errores y Sugerencias */}
      <FloatingFeedbackWidget />
    </BrowserRouter>
  );
}

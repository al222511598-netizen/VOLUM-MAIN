import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Configurar URL base de Axios: en desarrollo usa el proxy de Vite para evitar bloqueos CORS
const rawApi = import.meta.env.VITE_API_URL;
if (rawApi) {
  const domainUrl = rawApi.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  axios.defaults.baseURL = domainUrl;
} else if (!import.meta.env.DEV) {
  axios.defaults.baseURL = 'https://volum-menu.onrender.com';
}

// Interceptor global para inyectar token de autenticación en todas las llamadas API
axios.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('volum_admin_token') || localStorage.getItem('token'))
      : null;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // silencioso
  }
  return config;
}, (error) => Promise.reject(error));

// Nota: @google/model-viewer se carga bajo demanda (lazy) solo cuando se abre un visor 3D

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
            <svg className="w-8 h-8 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Ha ocurrido un error al cargar la vista</h1>
          <p className="text-xs text-slate-400 max-w-md mb-4">{this.state.error?.message || 'Error desconocido'}</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            Recargar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

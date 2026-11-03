import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@google/model-viewer') || id.includes('three')) {
            return 'model-viewer-engine';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-icons';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  },
  server: {
    host: true,
    port: 5180,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_BACKEND || 'https://volum-menu.onrender.com',
        changeOrigin: true,
        secure: false,
        headers: {
          origin: 'https://volum.menu'
        }
      },
      '/uploads': {
        target: process.env.VITE_DEV_BACKEND || 'https://volum-menu.onrender.com',
        changeOrigin: true,
        secure: false,
        headers: {
          origin: 'https://volum.menu'
        }
      }
    }
  }
});

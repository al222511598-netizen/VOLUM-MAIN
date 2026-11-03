let modelViewerPromise = null;

/**
 * Carga perezosa (lazy load) del motor WebAR @google/model-viewer
 * Solo se descarga bajo demanda cuando el usuario abre el visor 3D en pantalla.
 * Ahorra ~1.2 MB en el bundle inicial de comensales, meseros y landing page.
 */
export const loadModelViewer = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.customElements && window.customElements.get('model-viewer')) {
    return Promise.resolve();
  }
  if (!modelViewerPromise) {
    modelViewerPromise = import('@google/model-viewer').catch((err) => {
      console.warn('Aviso: No se pudo precargar @google/model-viewer dinámicamente:', err);
    });
  }
  return modelViewerPromise;
};

export default loadModelViewer;

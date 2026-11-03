import React, { useState } from 'react';
import { Palette, Check, Sparkles, Sun, Moon, Save, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ADMIN_THEMES, ADMIN_THEME_LIST } from '../config/adminThemePalettes';

/**
 * Selector de Tema Visual para la Consola Administrativa
 * - Soporta 5 plantillas maestras (Blanco Puro, Dark Luxury, Nórdico, Borgoña, Cyber)
 * - Persistencia dual: localStorage inmediato y guardado en MongoDB
 */
export default function AdminThemeSelector({
  themeKey,
  onSelectTheme,
  onSaveToBackend,
  isSaving,
  saveSuccess,
  compact = false,
  align = 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const current = ADMIN_THEMES[themeKey] || ADMIN_THEMES.dark_luxury;

  // Modo Compacto (para la barra lateral o cabecera móvil)
  if (compact) {
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            current.isLight
              ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 shadow-md'
          }`}
          title="Cambiar apariencia de la consola"
        >
          {current.isLight ? (
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          )}
          <span className="hidden sm:inline">{current.shortName}</span>
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
            style={{ backgroundColor: current.dotHex }}
          />
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div
              className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-80 min-w-[310px] rounded-2xl p-3 z-50 border shadow-2xl animate-fadeIn ${
                current.isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}
            >
              <div className="px-2 py-1.5 mb-2 border-b border-slate-500/20 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Estilo de Consola
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold">
                  {current.isLight ? 'Modo Claro' : 'Modo Oscuro'}
                </span>
              </div>

              <div className="space-y-1">
                {ADMIN_THEME_LIST.map((theme) => {
                  const isSelected = themeKey === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        onSelectTheme(theme.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? theme.isLight
                            ? 'bg-slate-100 text-slate-900 font-black'
                            : 'bg-slate-800 text-white font-black'
                          : theme.isLight
                            ? 'hover:bg-slate-50 text-slate-700'
                            : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-4 h-4 rounded-full border border-black/25 shrink-0"
                          style={{ backgroundColor: theme.dotHex }}
                        />
                        <span className="whitespace-nowrap font-bold">{theme.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Modo Completo (para insertar en la pestaña 'Marca, IA y Configuración')
  return (
    <div
      className={`p-6 rounded-3xl border transition-all ${
        current.isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-500" />
            <h3
              className={`text-base font-bold ${
                current.isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Apariencia y Paleta de la Consola de Administración
            </h3>
          </div>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              current.isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Adapta la interfaz de trabajo a la luz de tu entorno o a la identidad de tu restaurante.
            Se guarda automáticamente en tu navegador y puedes fijarlo de forma permanente en la base de datos.
          </p>
        </div>

        {/* Botón oficial de guardado en la nube */}
        <button
          type="button"
          onClick={onSaveToBackend}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 shrink-0 ${
            current.buttonPrimary
          }`}
        >
          {isSaving ? (
            <span className="animate-spin">⏳</span>
          ) : saveSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado Oficial!' : 'Guardar en Base de Datos'}</span>
        </button>
      </div>

      {/* Grid de Plantillas Maestras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ADMIN_THEME_LIST.map((theme) => {
          const isSelected = themeKey === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? current.isLight
                    ? 'border-sky-600 bg-sky-50/70 shadow-md ring-2 ring-sky-600/30'
                    : 'border-amber-500 bg-amber-500/10 shadow-lg ring-2 ring-amber-500/30'
                  : current.isLight
                    ? 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100/70'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: theme.dotHex }}
                    />
                    <span
                      className={`text-xs font-black ${
                        current.isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                  )}
                </div>

                <p
                  className={`text-[11px] leading-relaxed mb-3 ${
                    current.isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {theme.tagline}
                </p>
              </div>

              {/* Muestra de colores de la plantilla */}
              <div
                className={`p-2 rounded-xl flex items-center justify-between text-[10px] font-mono border ${
                  theme.isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-black/40 border-slate-800 text-slate-300'
                }`}
              >
                <span>Fondo: {theme.bgCanvas}</span>
                <span
                  className="font-bold px-1.5 py-0.5 rounded text-white"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  {theme.primaryHex}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

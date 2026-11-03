import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldAlert, Scale, CreditCard, Palette, X, Check } from 'lucide-react';
import { BRAND_PALETTES, useBrandPalette } from '../../config/brandPalettes';

export default function TermsOfServicePage() {
  const { selectedPaletteKey, setSelectedPaletteKey, currentPalette } = useBrandPalette();
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!paletteDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('#legal-palette-picker')) {
        setPaletteDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setPaletteDropdownOpen(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [paletteDropdownOpen]);

  return (
    <div
      className={`min-h-[100dvh] ${currentPalette.themeClass} ${currentPalette.fontBody} ${currentPalette.textPrimary} ${currentPalette.sectionBg} selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300`}
      style={{
        '--theme-accent': currentPalette.primaryHex,
        '--theme-dot': currentPalette.dot
      }}
    >
      {/* Barra de Navegación Superior */}
      <header className={`sticky top-0 z-40 ${currentPalette.navBg} backdrop-blur-xl transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: currentPalette.primaryHex,
                boxShadow: `0 8px 20px -4px ${currentPalette.primaryHex}45`
              }}
            >
              V
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-lg tracking-tight ${currentPalette.logoText}`}>
                Volum<span className={currentPalette.textAccent}>-Menu</span>
              </span>
              <span className={`text-xs tracking-widest uppercase font-semibold ${currentPalette.textMuted}`}>
                Términos y Condiciones
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 relative" id="legal-palette-picker">
            {/* Selector de Paleta de Marca */}
            <button
              type="button"
              onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
              className={`py-2 px-3 rounded-xl ${currentPalette.paletteBtn} text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer`}
              aria-label="Seleccionar Paleta de Marca"
            >
              <Palette className="w-4 h-4 shrink-0" style={{ color: currentPalette.primaryHex }} />
              <span className="hidden sm:inline">{currentPalette.name}</span>
            </button>

            {paletteDropdownOpen && (
              <div className={`absolute right-0 top-full mt-2 w-72 sm:w-80 ${currentPalette.cardBg} rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn text-left`}>
                <div className={`flex items-center justify-between pb-3 border-b ${currentPalette.sectionBorder} mb-3`}>
                  <span className={`text-xs font-black tracking-wider uppercase ${currentPalette.textMuted}`}>
                    PALETA DE MARCA
                  </span>
                  <button
                    type="button"
                    onClick={() => setPaletteDropdownOpen(false)}
                    className={`p-1 rounded-lg ${currentPalette.textMuted} hover:${currentPalette.textPrimary} transition-colors cursor-pointer`}
                    aria-label="Cerrar selector de paleta"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {Object.values(BRAND_PALETTES).map((pal) => {
                    const isSelected = selectedPaletteKey === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          setSelectedPaletteKey(pal.id);
                          setPaletteDropdownOpen(false);
                        }}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'text-white shadow-lg'
                            : currentPalette.isLight
                            ? 'bg-[#F1EFEA] hover:bg-[#EAE6DF] text-[#191919] border border-[#191919]/10'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-800/50'
                        }`}
                        style={isSelected ? { backgroundColor: pal.primaryHex, boxShadow: `0 10px 25px -5px ${pal.primaryHex}40` } : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-5 h-5 rounded-full shrink-0 border border-white/20 shadow-inner"
                            style={{ backgroundColor: pal.dot }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold leading-tight truncate">
                              {pal.name}
                            </span>
                            <span className={`text-[10px] leading-tight truncate mt-0.5 ${isSelected ? 'text-white/85' : currentPalette.textMuted}`}>
                              {pal.tagline}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-white shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Link
              to="/"
              className={`py-2 px-4 rounded-xl ${currentPalette.buttonSecondary} text-xs font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95`}
            >
              <ArrowLeft className="w-3.5 h-3.5" style={{ color: currentPalette.primaryHex }} />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
        
        {/* Encabezado */}
        <div className={`border-b ${currentPalette.sectionBorder} pb-8 mb-10`}>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentPalette.badgeClass} text-xs font-bold mb-4`}>
            <Scale className="w-4 h-4" style={{ color: currentPalette.primaryHex }} />
            <span>Condiciones Contractuales de Uso SaaS</span>
          </div>
          <h1 className={`text-3xl sm:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
            Términos y Condiciones de Servicio
          </h1>
          <p className={`text-xs sm:text-sm ${currentPalette.textMuted} mt-3`}>
            Última actualización y entrada en vigor: <strong className={currentPalette.textPrimary}>16 de septiembre de 2026</strong>.
          </p>
          <p className={`text-xs sm:text-sm ${currentPalette.textMuted} mt-1`}>
            Por favor, lee detenidamente estos términos antes de contratar o utilizar la plataforma Volum-Menu. Al suscribirte o interactuar con nuestros servicios, aceptas quedar legalmente vinculado a las presentes condiciones.
          </p>
        </div>

        {/* Secciones Contractuales */}
        <div className={`space-y-10 text-xs sm:text-sm ${currentPalette.textMuted} leading-relaxed`}>

          {/* 1. Objeto y Descripción del Servicio */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                1
              </span>
              <span>Objeto del Contrato y Alcance del Software como Servicio (SaaS)</span>
            </h2>
            <p className={`mb-3 ${currentPalette.textPrimary}`}>
              Volum-Menu concede al Restaurante o Suscriptor una licencia de uso no exclusiva, revocable e intransferible para acceder a su plataforma tecnológica en la nube. Los servicios contratados comprenden:
            </p>
            <ul className={`list-disc list-inside space-y-1.5 text-xs ${currentPalette.textMuted} pl-1`}>
              <li>Visualización e interacción de cartas gastronómicas digitales en formato WebAR a escala métrica 1:1 y visores 360°.</li>
              <li>Generador de códigos QR vectoriales de alta definición listos para mesa o imprenta.</li>
              <li>Estación operativa de sala (Modo Mesero con alertas sonoras y llamadas de cuenta en tiempo real).</li>
              <li>Herramientas asistidas por inteligencia artificial para digitalización de cartas físicas y edición de estilos cromáticos.</li>
              <li>Bóveda de almacenamiento y gestión de catálogos y sucursales según el plan contratado.</li>
            </ul>
          </section>

          {/* 2. Planes de Suscripción y Tarifas */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                2
              </span>
              <span>Planes de Suscripción, Tarifas y Facturación</span>
            </h2>
            <p className={`mb-4 ${currentPalette.textPrimary}`}>
              El servicio se ofrece mediante cuatro modalidades comerciales con cargos en Pesos Mexicanos (MXN) más el 16% de IVA conforme al marco tributario mexicano (CFDI deducible):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <span className="font-black text-xs uppercase" style={{ color: currentPalette.primaryHex }}>Plan Esencial</span>
                <p className={`text-base font-extrabold ${currentPalette.textPrimary} mt-1`}>
                  $449 MXN <span className={`text-xs font-normal ${currentPalette.textMuted}`}>+ IVA / mes</span>
                </p>
                <p className={`text-xs ${currentPalette.textMuted} mt-1`}>Hasta 4 platillos propios en 3D (carta fija) • Activación $0 MXN.</p>
              </div>
              <div className={`p-4 rounded-2xl ${currentPalette.cardRecommended}`}>
                <span className="font-black text-xs uppercase" style={{ color: currentPalette.primaryHex }}>Experiencia 3D</span>
                <p className={`text-base font-extrabold ${currentPalette.textPrimary} mt-1`}>
                  $799 MXN <span className={`text-xs font-normal ${currentPalette.textMuted}`}>+ IVA / mes</span>
                </p>
                <p className={`text-xs ${currentPalette.textMuted} mt-1`}>Hasta 8 platillos propios en 3D + Bóveda para 8 platillos estacionales + Modo Mesero con sonido + PIN de acceso • Activación $0 MXN.</p>
              </div>
              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <span className="font-black text-xs uppercase" style={{ color: currentPalette.primaryHex }}>VIP Fine Dining</span>
                <p className={`text-base font-extrabold ${currentPalette.textPrimary} mt-1`}>
                  $1,299 MXN <span className={`text-xs font-normal ${currentPalette.textMuted}`}>+ IVA / mes</span>
                </p>
                <p className={`text-xs ${currentPalette.textMuted} mt-1`}>Hasta 15 platillos propios en 3D + Bóveda para 30 platillos estacionales + Modo Mesero Avanzado • Activación $0 MXN.</p>
              </div>
              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <span className="font-black text-xs uppercase" style={{ color: currentPalette.primaryHex }}>Cadenas & Franquicias</span>
                <p className={`text-base font-extrabold ${currentPalette.textPrimary} mt-1`}>
                  $2,199 MXN <span className={`text-xs font-normal ${currentPalette.textMuted}`}>+ IVA / mes</span>
                </p>
                <p className={`text-xs ${currentPalette.textMuted} mt-1`}>Hasta 20 platillos propios en 3D + Bóveda para 60 platillos estacionales + Multi-sucursales nativas + Sucursales extra a $999 MXN/mes con 8 slots c/u • Activación $0 MXN.</p>
              </div>
            </div>

            <p className={`text-xs ${currentPalette.textMuted}`}>
              * Platillos 3D adicionales pueden contratarse en cualquier momento por una tarifa mensual recurrente de <strong className={currentPalette.textPrimary} style={{ color: currentPalette.primaryHex }}>$99 MXN + IVA</strong> por platillo activo adicional. Sucursales adicionales para planes de franquicia se tarifican a <strong className={currentPalette.textPrimary} style={{ color: currentPalette.primaryHex }}>$999 MXN + IVA / mes</strong> con 8 slots 3D propios incluidos por sucursal.
            </p>
          </section>

          {/* 3. Pagos y Stripe */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                3
              </span>
              <span>Procesamiento de Pagos y Facturación Recurrente</span>
            </h2>
            <ul className={`space-y-2.5 text-xs ${currentPalette.textMuted}`}>
              <li className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span><strong className={currentPalette.textPrimary}>Procesador Bancario Seguro:</strong> Todos los cobros se gestionan mediante Stripe, Inc., bajo estándares PCI-DSS Nivel 1. Al suscribirte, autorizas a Volum-Menu y a Stripe a realizar los cargos recurrentes automáticos (mensuales o anuales con 2 meses bonificados) en la tarjeta designada.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span><strong className={currentPalette.textPrimary}>Renovación Automática:</strong> Salvo que el suscriptor cancele antes de la fecha de corte, la suscripción se renovará automáticamente al término de cada período de facturación.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span><strong className={currentPalette.textPrimary}>Facturación Fiscal:</strong> El suscriptor podrá descargar sus comprobantes y facturas fiscales desde el panel de control o solicitándolas al correo oficial con su Cédula de Identificación Fiscal.</span>
              </li>
            </ul>
          </section>

          {/* 4. Propiedad Intelectual */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                4
              </span>
              <span>Propiedad Intelectual y Titularidad de Activos 3D</span>
            </h2>
            <p className={`mb-3 ${currentPalette.textPrimary}`}>
              Para evitar cualquier controversia respecto a los activos digitales, se establece la siguiente titularidad expresa:
            </p>

            <div className="space-y-3">
              <div className={`p-3.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <h4 className="font-bold text-xs mb-1" style={{ color: currentPalette.primaryHex }}>A. Recetas, Nombres, Marcas y Fotos del Restaurante:</h4>
                <p className={`text-xs ${currentPalette.textMuted}`}>
                  Son y seguirán siendo propiedad exclusiva del Restaurante. Volum-Menu solo recibe una licencia de exhibición técnica para renderizar los menús a los comensales.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <h4 className="font-bold text-xs mb-1" style={{ color: currentPalette.primaryHex }}>B. Modelos 3D Escaneados de Platillos Propios del Restaurante:</h4>
                <p className={`text-xs ${currentPalette.textMuted}`}>
                  Los modelos fotogramétricos resultantes del escaneo de platillos únicos del cliente se licencian exclusivamente para la visualización del restaurante cliente. Volum-Menu no venderá dichos modelos a restaurantes competidores.
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <h4 className="font-bold text-xs mb-1" style={{ color: currentPalette.primaryHex }}>C. Software y Plataforma Tecnológica:</h4>
                <p className={`text-xs ${currentPalette.textMuted}`}>
                  El código fuente, la plataforma WebAR, la lógica de negocio y las marcas de Volum-Menu son propiedad intelectual exclusiva e inalienable de Volum-Menu. Queda estrictamente prohibida su descompilación, extracción no autorizada o ingeniería inversa.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Cancelación y Política de Reembolsos */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                5
              </span>
              <span>Cancelaciones, Sin Plazos Forzosos y Reembolsos</span>
            </h2>
            <ul className={`space-y-3 text-xs ${currentPalette.textMuted}`}>
              <li>
                <strong className={currentPalette.textPrimary}>Cancelación Libre en Cualquier Momento:</strong> No existen contratos de permanencia obligatoria ni plazos forzosos. El restaurante puede cancelar su suscripción en cualquier momento desde el panel o notificándolo por correo. El servicio continuará operativo hasta el último día del ciclo ya abonado.
              </li>
              <li>
                <strong className={currentPalette.textPrimary}>Gastos de Digitalización y Setup:</strong> Las tarifas de escaneo 3D y activación inicial (<em>Setup Fee</em>) cubren costos directos de mano de obra especializada y procesamiento computacional en la nube. Por lo tanto, <em>una vez iniciada la sesión de escaneo o procesados los archivos 3D</em>, estas cuotas técnicas no son reembolsables.
              </li>
              <li>
                <strong className={currentPalette.textPrimary}>Menú de Prueba Previsto:</strong> Para asegurar la plena satisfacción del cliente antes de contratar, Volum-Menu pone a disposición de cualquier interesado una carta demo en vivo con modelos 3D reales a escala 1:1 y modo mesero totalmente funcional.
              </li>
            </ul>
          </section>

          {/* 6. Deslinde de Responsabilidad sobre Alimentos */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border border-rose-500/30 transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} text-rose-500 mb-3 flex items-center gap-2`}>
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <span>Deslinde de Responsabilidad Alimentaria, Alérgenos y Precios</span>
            </h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textPrimary} leading-relaxed mb-3`}>
              <strong>Volum-Menu es un proveedor de software de visualización y comunicación operativa de sala.</strong> En ninguna circunstancia Volum-Menu participa en la adquisición, elaboración, conservación, porcionado ni expendio de bebidas o alimentos.
            </p>
            <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} text-xs ${currentPalette.textMuted} space-y-2`}>
              <p>
                <strong className={currentPalette.textPrimary}>Exactitud de la Carta y Precios:</strong> El Restaurante es el único responsable legal ante las autoridades de protección al consumidor (como PROFECO en México) de que los precios, promociones, impuestos y descripciones mostrados en su menú digital coincidan con los cobrados físicamente al cliente.
              </p>
              <p>
                <strong className={currentPalette.textPrimary}>Alérgenos y Salud Pública:</strong> El Restaurante es el único responsable de declarar y advertir sobre ingredientes alergénicos (gluten, mariscos, frutos secos, lácteos, etc.). Volum-Menu queda libre de toda responsabilidad civil, penal o administrativa ante intoxicaciones o reacciones alérgicas derivadas de los platillos servidos.
              </p>
            </div>
          </section>

          {/* 7. Disponibilidad del Servicio (SLA) */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                7
              </span>
              <span>Nivel de Disponibilidad del Servicio (SLA) y Mantenimiento</span>
            </h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textMuted}`}>
              Nos esforzamos por garantizar una disponibilidad de la plataforma del <strong className={currentPalette.textPrimary} style={{ color: currentPalette.primaryHex }}>99.8%</strong> en servidores de nube redundantes. Las ventanas de mantenimiento preventivo o actualizaciones mayores se procurarán programar en horarios de baja afluencia gastronómica (madrugada) y serán notificadas oportunamente.
            </p>
          </section>

          {/* 8. Ley Aplicable y Jurisdicción */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                8
              </span>
              <span>Legislación Aplicable, Resolución de Controversias y Jurisdicción</span>
            </h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textMuted}`}>
              Los presentes Términos y Condiciones se rigen e interpretan con apego a las leyes mercantiles y civiles aplicables de los Estados Unidos Mexicanos. Para la resolución de cualquier controversia que no pueda resolverse de común acuerdo a través de nuestro canal de mediación, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros.
            </p>
          </section>

        </div>

        {/* Bloque de Dudas Contractuales */}
        <div className={`mt-14 p-6 sm:p-8 rounded-3xl ${currentPalette.cardRecommended} flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors`}>
          <div>
            <h3 className={`text-base font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary}`}>
              ¿Requieres un contrato especial para tu cadena o franquicia?
            </h3>
            <p className={`text-xs ${currentPalette.textMuted} mt-1`}>
              Para grupos con más de 5 sucursales, redactamos acuerdos de nivel de servicio (SLA) y facturación corporativa consolidada.
            </p>
          </div>
          <a
            href="mailto:volum.menu.oficial@gmail.com?subject=Convenio%20Corporativo%20Volum-Menu"
            className={`py-3 px-6 rounded-xl ${currentPalette.buttonPrimary} font-black text-xs transition-all flex items-center gap-2 shrink-0 active:scale-95`}
          >
            <Mail className="w-4 h-4" />
            <span>Contactar Área Legal</span>
          </a>
        </div>

      </main>

      {/* Footer Minimalista */}
      <footer className={`py-8 border-t ${currentPalette.sectionBorder} ${currentPalette.footerBg} text-xs text-center transition-colors`}>
        <p>© {new Date().getFullYear()} Volum-Menu. Plataforma SaaS de Menús Digitales en Realidad Aumentada. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Mail, CheckCircle2, Palette, X, Check } from 'lucide-react';
import { BRAND_PALETTES, useBrandPalette } from '../../config/brandPalettes';

export default function PrivacyPolicyPage() {
  const { selectedPaletteKey, setSelectedPaletteKey, currentPalette } = useBrandPalette();
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!paletteDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('#privacy-palette-picker')) {
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
                Aviso de Privacidad
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 relative" id="privacy-palette-picker">
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
            <ShieldCheck className="w-4 h-4" style={{ color: currentPalette.primaryHex }} />
            <span>Marco Legal & Protección de Datos Personales</span>
          </div>
          <h1 className={`text-3xl sm:text-5xl font-black ${currentPalette.fontHeading} ${currentPalette.headingCase} ${currentPalette.textPrimary} tracking-tight`}>
            Aviso de Privacidad Integral
          </h1>
          <p className={`text-xs sm:text-sm ${currentPalette.textMuted} mt-3`}>
            Última actualización y entrada en vigor: <strong className={currentPalette.textPrimary}>16 de septiembre de 2026</strong>.
          </p>
          <p className={`text-xs sm:text-sm ${currentPalette.textMuted} mt-1`}>
            Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, y en estricta observancia del Reglamento General de Protección de Datos (RGPD / GDPR) de la Unión Europea y la Ley de Privacidad del Consumidor de California (CCPA).
          </p>
        </div>

        {/* Secciones Legales */}
        <div className={`space-y-10 text-xs sm:text-sm ${currentPalette.textMuted} leading-relaxed`}>

          {/* 1. Identidad del Responsable */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                1
              </span>
              <span>Identidad y Domicilio del Responsable del Tratamiento</span>
            </h2>
            <p className={`${currentPalette.textPrimary} mb-3`}>
              La plataforma tecnológica <strong>Volum-Menu</strong> (en adelante denominada «Volum-Menu», «nosotros» o «la Plataforma»), con portal web accesible en el dominio oficial y canales digitales autorizados, es la entidad responsable del uso, protección y tratamiento legítimo de los datos personales recabados a través de sus sistemas, páginas web, menús interactivos en Realidad Aumentada (WebAR) y paneles de control.
            </p>
            <p className={`${currentPalette.textMuted} text-xs`}>
              Para cualquier consulta, requerimiento legal o ejercicio de derechos de privacidad, nuestro canal institucional es el correo electrónico oficial:{' '}
              <a
                href="mailto:volum.menu.oficial@gmail.com"
                className="font-bold underline hover:opacity-80"
                style={{ color: currentPalette.primaryHex }}
              >
                volum.menu.oficial@gmail.com
              </a>.
            </p>
          </section>

          {/* 2. Datos Personales Recabados */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                2
              </span>
              <span>Datos Personales Sujetos a Tratamiento</span>
            </h2>
            <p className={`mb-4 ${currentPalette.textPrimary}`}>
              Distinguiendo las categorías de usuarios de la Plataforma, recabamos exclusivamente los datos necesarios para la prestación del servicio:
            </p>

            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <h3 className="font-bold text-xs sm:text-sm mb-1.5" style={{ color: currentPalette.primaryHex }}>
                  A. Datos de Restaurantes, Propietarios y Administradores (Clientes SaaS):
                </h3>
                <ul className={`list-disc list-inside space-y-1 ${currentPalette.textMuted} text-xs pl-1`}>
                  <li>Nombre completo del titular o representante legal.</li>
                  <li>Nombre comercial y razón social del restaurante o grupo gastronómico.</li>
                  <li>Dirección física de los establecimientos y sucursales.</li>
                  <li>Correo electrónico corporativo y número de contacto telefónico o WhatsApp.</li>
                  <li>Datos de facturación fiscal (RFC o Tax ID) y domicilio fiscal.</li>
                  <li>
                    <strong className={currentPalette.textPrimary}>Información de Pago:</strong> Los datos de tarjetas bancarias son procesados de forma cifrada y tokenizada directamente por la pasarela de pagos internacional <strong className={currentPalette.textPrimary}>Stripe, Inc.</strong> Volum-Menu <em>nunca</em> almacena en sus servidores números de tarjeta completos (PAN) ni códigos de seguridad (CVV).
                  </li>
                </ul>
              </div>

              <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
                <h3 className="font-bold text-xs sm:text-sm mb-1.5" style={{ color: currentPalette.primaryHex }}>
                  B. Datos de Comensales y Visitantes del Menú WebAR:
                </h3>
                <p className={`text-xs ${currentPalette.textMuted} mb-2`}>
                  Garantizamos la máxima privacidad del comensal. <strong className={currentPalette.textPrimary}>No requerimos la creación de cuenta, registro de nombre ni descarga de aplicaciones móviles</strong> para acceder al menú en la mesa.
                </p>
                <ul className={`list-disc list-inside space-y-1 ${currentPalette.textMuted} text-xs pl-1`}>
                  <li>Identificador temporal de mesa y zona (ej. Mesa 5, Terraza) asignado al escanear el código QR.</li>
                  <li>Solicitudes de servicio (llamada a mesero o petición de cuenta con método de pago seleccionado).</li>
                  <li>Metadatos técnicos no identificables: sistema operativo móvil (iOS / Android) y compatibilidad del navegador para habilitar la proyección WebXR o QuickLook.</li>
                  <li>Dirección IP y registros de conexión con fines estrictos de seguridad de red y prevención de ataques de denegación de servicio (DDoS).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Finalidades del Tratamiento */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                3
              </span>
              <span>Finalidades del Tratamiento</span>
            </h2>

            <h3 className={`font-bold ${currentPalette.textPrimary} text-xs sm:text-sm mt-3 mb-2`}>
              Finalidades Primarias (Indispensables para el servicio):
            </h3>
            <ul className={`space-y-2 text-xs ${currentPalette.textMuted} mb-5`}>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span>Desplegar el menú digital interactivo y proyectar modelos 3D a escala métrica 1:1 en el dispositivo móvil del comensal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span>Transmitir en tiempo real las solicitudes de mesa (llamados y peticiones de cuenta) a la estación operativa de meseros.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span>Gestionar el alta, cobro de suscripción mensual o anual, y emisión de comprobantes de pago mediante Stripe.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span>Proveer soporte técnico, asesoría de configuración y coordinación de sesiones de digitalización 3D.</span>
              </li>
            </ul>

            <h3 className={`font-bold ${currentPalette.textPrimary} text-xs sm:text-sm mt-3 mb-2`}>
              Finalidades Secundarias (Accesorias):
            </h3>
            <ul className={`space-y-2 text-xs ${currentPalette.textMuted}`}>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span>Extracción y estructuración de cartas físicas mediante modelos de visión artificial avanzada (Motor Neuronal Volum IA) sin entrenamiento público con información confidencial del cliente.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentPalette.primaryHex }} />
                <span>Elaboración de métricas estadísticas anónimas sobre platillos más consultados para optimizar el rendimiento de la carta del restaurante.</span>
              </li>
            </ul>
          </section>

          {/* 4. Transferencia de Datos */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                4
              </span>
              <span>Transferencia de Datos a Terceros</span>
            </h2>
            <p className={`mb-3 ${currentPalette.textPrimary}`}>
              Volum-Menu no vende, arrienda ni comercializa datos personales a terceros con fines publicitarios. Las únicas transferencias realizadas corresponden a prestadores de infraestructura indispensable para operar la plataforma SaaS:
            </p>
            <ul className={`list-disc list-inside space-y-1.5 text-xs ${currentPalette.textMuted} pl-1`}>
              <li><strong className={currentPalette.textPrimary}>Stripe, Inc.:</strong> Para el procesamiento seguro y encriptado de pagos con tarjeta de crédito/débito y suscripciones recurrentes bajo el estándar PCI-DSS Nivel 1.</li>
              <li><strong className={currentPalette.textPrimary}>MongoDB Atlas / Cloud Storage:</strong> Para el resguardo seguro y encriptado en reposo de catálogos, credenciales con hash y configuraciones de restaurantes.</li>
              <li><strong className={currentPalette.textPrimary}>Infraestructura de Nube para Visión Artificial:</strong> Para el procesamiento transitorio y confidencial de fotografías de cartas físicas destinadas a la digitalización asistida por el Motor Neuronal Volum IA.</li>
              <li><strong className={currentPalette.textPrimary}>Autoridades Competentes:</strong> Exclusivamente en los supuestos legalmente previstos o ante mandato judicial expreso y fundamentado.</li>
            </ul>
          </section>

          {/* 5. Ejercicio de Derechos ARCO */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                5
              </span>
              <span>Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</span>
            </h2>
            <p className={`mb-3 ${currentPalette.textPrimary}`}>
              Usted tiene el derecho irrevocable de conocer qué datos personales resguardamos, para qué los utilizamos y las condiciones del uso que les damos (Acceso); solicitar la corrección de su información desactualizada o inexacta (Rectificación); requerir que la eliminemos de nuestras bases de datos (Cancelación); así como oponerse al uso de sus datos para fines específicos (Oposición).
            </p>
            <div className={`p-4 rounded-2xl ${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder}`}>
              <h4 className="text-xs font-bold mb-1" style={{ color: currentPalette.primaryHex }}>
                Mecanismo Oficial para Ejercer Derechos ARCO:
              </h4>
              <p className={`text-xs ${currentPalette.textPrimary} leading-relaxed`}>
                Envíe una solicitud por escrito al correo{' '}
                <a
                  href="mailto:volum.menu.oficial@gmail.com"
                  className="underline font-bold hover:opacity-80"
                  style={{ color: currentPalette.primaryHex }}
                >
                  volum.menu.oficial@gmail.com
                </a>{' '}
                con el asunto <strong>«Ejercicio de Derechos ARCO - Volum-Menu»</strong>, adjuntando:
              </p>
              <ul className={`list-disc list-inside space-y-1 text-xs ${currentPalette.textMuted} mt-2 pl-1`}>
                <li>Identificación oficial vigente del titular o documento que acredite la representación legal.</li>
                <li>Descripción clara y precisa de los datos respecto de los cuales busca ejercer el derecho.</li>
                <li>Cualquier elemento o dato que facilite la localización de sus registros (ej. correo de la cuenta o nombre del restaurante).</li>
              </ul>
              <p className={`text-xs ${currentPalette.textMuted} mt-2`}>
                Plazo de respuesta garantizado: máximo <strong className={currentPalette.textPrimary}>20 días hábiles</strong> contados a partir de la recepción efectiva de la solicitud, conforme a la legislación vigente.
              </p>
            </div>
          </section>

          {/* 6. Uso de Cookies y Almacenamiento Local */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                6
              </span>
              <span>Cookies y Tecnologías de Almacenamiento Local</span>
            </h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textMuted}`}>
              Volum-Menu emplea únicamente tecnologías técnicas de almacenamiento en el navegador (tales como{' '}
              <code className={`${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} px-1.5 py-0.5 rounded font-bold`} style={{ color: currentPalette.primaryHex }}>
                localStorage
              </code>{' '}
              y{' '}
              <code className={`${currentPalette.cardSubtleBg} border ${currentPalette.sectionBorder} px-1.5 py-0.5 rounded font-bold`} style={{ color: currentPalette.primaryHex }}>
                sessionStorage
              </code>
              ) destinadas a mantener la sesión activa del panel de restaurante, recordar la mesa del comensal mientras navega en la carta y almacenar en memoria local los modelos 3D para evitar consumos excesivos de datos móviles.{' '}
              <strong className={currentPalette.textPrimary}>No utilizamos cookies de seguimiento publicitario ni comercializamos perfiles de navegación.</strong>
            </p>
          </section>

          {/* 7. Medidas de Seguridad */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                7
              </span>
              <span>Medidas de Seguridad y Resguardo Criptográfico</span>
            </h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textMuted}`}>
              Implementamos protocolos rigurosos de cifrado en tránsito mediante <strong className={currentPalette.textPrimary}>Transport Layer Security (TLS 1.3 / HTTPS)</strong>, hashing robusto de contraseñas mediante <strong className={currentPalette.textPrimary}>Bcrypt</strong> con factor de trabajo adecuado, sanitización automática de archivos multimedia y segmentación lógica por restaurante (multi-tenancy) para evitar accesos indebidos o fugas de información.
            </p>
          </section>

          {/* 8. Modificaciones al Aviso */}
          <section className={`${currentPalette.cardBg} p-6 sm:p-8 rounded-3xl border ${currentPalette.sectionBorder} transition-colors`}>
            <h2 className={`text-base sm:text-lg font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary} mb-3 flex items-center gap-2.5`}>
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                style={{ backgroundColor: `${currentPalette.primaryHex}20`, color: currentPalette.primaryHex }}
              >
                8
              </span>
              <span>Modificaciones y Actualizaciones</span>
            </h2>
            <p className={`text-xs sm:text-sm ${currentPalette.textMuted}`}>
              Nos reservamos el derecho de actualizar este Aviso de Privacidad para adaptarlo a novedades legislativas, mejoras tecnológicas o requerimientos de servicio. Cualquier cambio sustancial será notificado en este mismo apartado web con la fecha de actualización correspondiente y, en el caso de restaurantes suscritos, mediante aviso en el panel de control o por correo electrónico.
            </p>
          </section>

        </div>

        {/* Bloque de Contacto Legal */}
        <div className={`mt-14 p-6 sm:p-8 rounded-3xl ${currentPalette.cardRecommended} flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors`}>
          <div>
            <h3 className={`text-base font-bold ${currentPalette.fontHeading} ${currentPalette.textPrimary}`}>
              ¿Tienes dudas legales sobre tus datos?
            </h3>
            <p className={`text-xs ${currentPalette.textMuted} mt-1`}>
              Nuestro equipo jurídico y de privacidad responderá a cualquier inquietud formal.
            </p>
          </div>
          <a
            href="mailto:volum.menu.oficial@gmail.com?subject=Consulta%20de%20Privacidad%20Volum-Menu"
            className={`py-3 px-6 rounded-xl ${currentPalette.buttonPrimary} font-black text-xs transition-all flex items-center gap-2 shrink-0 active:scale-95`}
          >
            <Mail className="w-4 h-4" />
            <span>volum.menu.oficial@gmail.com</span>
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

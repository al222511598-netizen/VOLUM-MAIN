import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Box,
  Layers,
  Compass,
  Eye,
  Check,
  CheckCircle2,
  ArrowRight,
  Utensils,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Target,
  Award,
  Users,
  Send,
  Copy,
  CheckCheck,
  Globe,
  Cpu,
  Smartphone,
  Sliders,
  Star,
  QrCode,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export default function VolumMainPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Volum-Menu',
    message: ''
  });

  const officialEmail = 'volum.menu.oficial@gmail.com';
  // WhatsApp oficial con mensaje pre-cargado
  const whatsappUrl = 'https://wa.me/525512345678?text=' + encodeURIComponent('¡Hola equipo de Volum! Me interesa conocer más sobre sus servicios de Realidad Aumentada y Volum-Menu.');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Luces y Gradientes de Fondo Ambientales */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[550px] h-[550px] bg-orange-600/10 blur-[140px] rounded-full" />
      </div>

      {/* 1. NAVBAR SUPERIOR CORPORATIVO */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Matriz VOLUM */}
          <Link to="/volum-main" className="flex items-center gap-3 group shrink-0" title="Volum Principal">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/25 group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all aspect-square border border-amber-400/30">
              V
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-white">
                  VOLUM
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 tracking-wider">
                  Matriz
                </span>
              </div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                Tecnología 3D & WebAR
              </span>
            </div>
          </Link>

          {/* Enlaces de Navegación Rápida */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide text-slate-300">
            <a href="#quienes-somos" className="hover:text-amber-400 transition-colors">Quiénes Somos</a>
            <a href="#servicios" className="hover:text-amber-400 transition-colors">Nuestros Servicios</a>
            <a href="#mision-vision" className="hover:text-amber-400 transition-colors">Misión y Visión</a>
            <a href="#contacto" className="hover:text-amber-400 transition-colors">Contacto</a>
          </nav>

          {/* Acciones Directas */}
          <div className="flex items-center gap-3">
            {/* Botón WhatsApp Rápido */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 shadow-sm"
              title="Chatear por WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Enlace directo a Volum-Menu */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Utensils className="w-4 h-4 text-slate-950" />
              <span>Ir a Volum-Menu</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO PRINCIPAL */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge de Empresa */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>INNOVACIÓN TECNOLÓGICA & COMPUTACIÓN ESPACIAL</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Damos <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">volumen</span> al mundo digital.
          </h1>

          {/* Subtítulo */}
          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            En <strong>Volum</strong> desarrollamos software y experiencias inmersivas en <strong>3D y Realidad Aumentada (WebAR)</strong> que transforman la forma en que las personas interactúan con productos, alimentos y espacios, directamente desde el navegador de su teléfono.
          </p>

          {/* Botones de Acción */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#servicios"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Box className="w-4 h-4 text-slate-950" />
              <span>Conoce Nuestro Servicio: Volum-Menu</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 flex items-center justify-center gap-2.5 transition-all hover:border-emerald-500/50 hover:text-emerald-300"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Platicar por WhatsApp</span>
            </a>
          </div>

          {/* Pilares Clave en Cifras */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">0 Apps</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Sin descargas pesadas</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-orange-400">Escala 1:1</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Proyección métrica real</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 1.0s</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Carga en el navegador</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">100% Web</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Safari iOS & Chrome Android</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: QUIÉNES SOMOS */}
      <section id="quienes-somos" className="relative z-10 py-20 px-4 sm:px-8 border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Identidad & Propósito</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ¿Quiénes Somos en <span className="text-amber-400">Volum</span>?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Somos un equipo apasionado por la computación visual y el desarrollo de software que busca cambiar la manera en que los negocios presentan sus productos al público.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Nacidos para la Web Abierta</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Rechazamos los ecosistemas cerrados que obligan a un usuario a instalar una aplicación de 200 MB solo para ver un producto. En Volum creamos tecnología que vive en la web estándar y se abre en segundos.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Precisión Visual Hiperrealista</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Utilizamos motores de renderizado 3D de última generación (PBR) y WebXR para que cada detalle, textura, brillo y proporción se vea tal cual existe en el mundo real, generando máxima confianza en el consumidor.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Impacto Comercial Tangible</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No hacemos tecnología por moda. Cada una de nuestras soluciones está pensada para aumentar las ventas, elevar el ticket promedio, agilizar la operación y crear un recuerdo inolvidable en el cliente final.
              </p>
            </div>

          </div>

          {/* Cita de Visión */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 text-center max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-slate-200 italic font-medium">
              "En Volum creemos que el internet plano de fotografías estáticas está llegando a su límite. El futuro es espacial, tridimensional y tangible desde la palma de tu mano."
            </p>
            <div className="mt-3 text-xs font-bold text-amber-400 uppercase tracking-wider">— Equipo Fundador de Volum</div>
          </div>

        </div>
      </section>

      {/* 4. SECCIÓN: NUESTROS SERVICIOS */}
      <section id="servicios" className="relative z-10 py-20 px-4 sm:px-8 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              <span>CATÁLOGO DE SOLUCIONES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Nuestros <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Servicios</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Actualmente nuestro producto insignia en producción es <strong>Volum-Menu</strong>, mientras expandimos nuestra tecnología a nuevas áreas de negocio.
            </p>
          </div>

          {/* TARJETA ESTRELLA: VOLUM-MENU */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border-2 border-amber-500/50 p-6 sm:p-10 shadow-2xl shadow-orange-500/10 overflow-hidden group">
            
            {/* Resplandor superior */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Información y características */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Servicio Activo en Producción
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                    Especializado en Restaurantes
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Volum<span className="text-amber-400">-Menu</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    Plataforma SaaS de Menús Digitales 3D y Realidad Aumentada (WebAR 1:1)
                  </p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Volum-Menu digitaliza la propuesta gastronómica de restaurantes de alta cocina. Los comensales escanean un código QR en su mesa y pueden ver los platillos girar en 360° o proyectarlos en tamaño real (escala métrica 1:1) sobre su mantel antes de ordenar.
                </p>

                {/* Lista de Capacidades */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>WebAR 1:1 en Mantel de Mesa</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Estación de Meseros con Timbre</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Previsualizador 3D en Vivo</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Carga Móvil Instantánea vía QR</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to="/"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <Utensils className="w-4 h-4 text-slate-950" />
                    <span>Explorar Plataforma Volum-Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/r/la-terraza?mode=showcase"
                    target="_blank"
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Carta Demo en Vivo</span>
                  </Link>

                  <Link
                    to="/app"
                    className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Panel de Control</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>

              </div>

              {/* Columna Derecha: Tarjeta Visual Simuladora */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/90 border border-slate-700/60 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">web-ar-engine:v1.0</span>
                  </div>

                  <div className="h-44 rounded-xl bg-slate-950 flex flex-col items-center justify-center p-4 text-center border border-slate-800/80 relative overflow-hidden group/box">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 group-hover/box:scale-110 group-hover/box:rotate-6 transition-all duration-300">
                      <Box className="w-8 h-8 text-amber-400" />
                    </div>
                    <div className="text-xs font-bold text-white">Visualizador 3D Universal</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Compatible con iOS Quick Look & Android SceneViewer</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Restaurantes Activos:</span>
                      <span className="font-bold text-amber-400">3 sedes de demostración</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Modelos 3D Optimizados:</span>
                      <span className="font-bold text-emerald-400">Archivos .GLB comprimidos</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Procesamiento de Imágenes:</span>
                      <span className="font-bold text-sky-400">WebP automático con Sharp</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ROADMAP / PRÓXIMOS SERVICIOS DE LA MATRIZ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Líneas de Innovación en Laboratorio de I+D</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 inline-block">
                  Próximamente • En I+D
                </span>
                <h4 className="text-xl font-bold text-white">Volum-Retail 3D</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Visores de Realidad Aumentada para tiendas de e-commerce, moda, calzado y muebles. Permite a los compradores ver el tamaño real de un producto en su sala antes de comprar.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 inline-block">
                  En Desarrollo
                </span>
                <h4 className="text-xl font-bold text-white">Volum-Spaces</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Modelado arquitectónico interactivo y recorridos espaciales WebAR para firmas de diseño de interiores, inmobiliarias y hoteles.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN: MISIÓN Y VISIÓN */}
      <section id="mision-vision" className="relative z-10 py-20 px-4 sm:px-8 border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Nuestros Fundamentos</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Misión y <span className="text-amber-400">Visión</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Nuestros principios estratégicos guían cada línea de código y cada modelo 3D que producimos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* MISIÓN */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-amber-500/30 space-y-5 relative overflow-hidden shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
                <Target className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Nuestra Misión</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Democratizar el acceso a la computación espacial y la Realidad Aumentada para empresas y negocios de cualquier escala. Nos dedicamos a crear herramientas de software elegantes, ultra veloces y sin fricción técnica que conecten a los usuarios con los productos de manera emocionante, mejorando sus decisiones de compra y optimizando las ventas.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Cero fricción, cero descargas, máxima emoción</span>
              </div>
            </div>

            {/* VISIÓN */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-orange-500/30 space-y-5 relative overflow-hidden shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-lg">
                <Compass className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Nuestra Visión</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Consolidar a <strong>Volum</strong> como el ecosistema de tecnología WebAR líder en el mercado hispanohablante y referente global, marcando el estándar de cómo la sociedad explora, siente y adquiere alimentos, productos físicos y experiencias en la nueva era de la web tridimensional.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-orange-400">
                <Check className="w-4 h-4 text-orange-400" />
                <span>Liderar la transición de la pantalla plana a la web espacial</span>
              </div>
            </div>

          </div>

          {/* Valores Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <Award className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-sm font-bold text-white">Excelencia Visual</div>
              <p className="text-xs text-slate-400">Modelos 3D con materiales hiperrealistas que reflejan la luz física real.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">Fiabilidad & Soporte</div>
              <p className="text-xs text-slate-400">Servidores 24/7 y acompañamiento cercano a cada restaurante o empresa.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <Zap className="w-6 h-6 text-sky-400 mx-auto" />
              <div className="text-sm font-bold text-white">Velocidad Extrema</div>
              <p className="text-xs text-slate-400">Optimización de peso para que la experiencia cargue al instante en datos móviles.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECCIÓN: CONTACTO & FOOTER */}
      <section id="contacto" className="relative z-10 py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Estamos a tu disposición</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ponte en <span className="text-emerald-400">Contacto</span> con Nosotros
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              ¿Quieres digitalizar tu restaurante con Volum-Menu, cotizar un desarrollo 3D a la medida o resolver dudas? Escríbenos por WhatsApp o correo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Columna Izquierda: Accesos Rápidos de Contacto */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tarjeta WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 transition-all block group shadow-lg shadow-emerald-950/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Atención Inmediata</div>
                    <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Chatear por WhatsApp
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Respuesta en menos de 15 minutos</div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Abrir conversación directa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Tarjeta Correo */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Correo Electrónico Oficial</div>
                    <div className="text-sm font-mono font-bold text-white truncate">
                      {officialEmail}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Para cotizaciones, alianzas y soporte</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href={`mailto:${officialEmail}?subject=Consulta%20sobre%20servicios%20de%20Volum`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enviar Correo</span>
                  </a>

                  <button
                    onClick={handleCopyEmail}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copiar dirección de correo"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tarjeta de Acceso a Volum-Menu */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">¿Listo para probar Volum-Menu?</div>
                    <div className="text-[11px] text-slate-400">Prueba gratuita de 7 días activa</div>
                  </div>
                </div>
                <Link
                  to="/"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-transform hover:scale-105 active:scale-95"
                >
                  Ir al Menú 3D
                </Link>
              </div>

            </div>

            {/* Columna Derecha: Formulario de Contacto */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
                
                {formSent ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Gracias por comunicarte con <strong>Volum</strong>. Un especialista de nuestro equipo se pondrá en contacto contigo en menos de 2 horas vía WhatsApp o correo.
                    </p>
                    <button
                      onClick={() => setFormSent(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="border-b border-slate-800 pb-3 mb-4">
                      <h3 className="text-xl font-bold text-white">Envíanos un Mensaje</h3>
                      <p className="text-xs text-slate-400">Cuéntanos sobre tu negocio o proyecto para asesorarte de inmediato.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej. Sofía Morales"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@correo.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Teléfono *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+52 55 1234 5678"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Servicio de Interés</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white outline-none transition-colors"
                        >
                          <option value="Volum-Menu">Volum-Menu (Para Restaurantes)</option>
                          <option value="Modelado-3D">Modelado y Escaneo 3D a Medida</option>
                          <option value="WebAR-Comercial">Solución WebAR Personalizada</option>
                          <option value="Alianzas">Alianzas Comerciales / Distribución</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Mensaje o Detalles del Proyecto *</label>
                      <textarea
                        required
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Platícanos qué tipo de restaurante o empresa tienes y cómo te gustaría implementar la Realidad Aumentada..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wide shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Enviar Mensaje al Equipo de Volum</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

          {/* FOOTER CORPORATIVO FINAL */}
          <div className="pt-12 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-base shadow-md">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white tracking-tight">VOLUM TECHNOLOGIES</span>
                <span className="text-[10px] text-slate-400">Ecosistema de Computación Espacial y WebAR</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <a href="#quienes-somos" className="hover:text-amber-400 transition-colors">Quiénes Somos</a>
              <a href="#servicios" className="hover:text-amber-400 transition-colors">Servicios</a>
              <a href="#mision-vision" className="hover:text-amber-400 transition-colors">Misión</a>
              <Link to="/" className="text-amber-400 font-bold hover:underline">Volum-Menu</Link>
              <Link to="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
              <Link to="/terminos" className="hover:text-white transition-colors">Términos de Servicio</Link>
            </div>

            <div className="text-slate-400 text-center md:text-right text-[11px]">
              © 2026 Volum. Todos los derechos reservados.
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

// Icono auxiliar de flecha
function ArrowDownRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 7 10 10" />
      <path d="M17 7v10H7" />
    </svg>
  );
}

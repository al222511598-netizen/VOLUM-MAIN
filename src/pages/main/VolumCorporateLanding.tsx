import React, { useEffect, useState } from 'react';
import type { ChangeEvent, CSSProperties, FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Cpu,
  Facebook,
  Layers3,
  Mail,
  Menu,
  MoveUpRight,
  RotateCcw,
  Send,
  Smartphone,
  Sparkles,
  X,
  Zap
} from 'lucide-react';

const EMAIL = 'volum.menu.oficial@gmail.com';
const WHATSAPP = 'https://wa.me/525512345678';
const NAV_ITEMS: Array<[string, string]> = [
  ['Inicio', '#inicio'],
  ['Nosotros', '#nosotros'],
  ['Servicios', '#servicios'],
  ['Start-ups', '#startups'],
  ['Proyectos', '#proyectos'],
  ['Contacto', '#contacto']
];

function makeMailto(subject: string, lines: string[]) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function VolumMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="volum-mark" aria-hidden="true"><span>V</span></span>
      <span className="text-[19px] font-extrabold tracking-[0.16em] text-white">
        VOLUM{!compact && <span className="ml-1 text-[9px] font-semibold tracking-[0.2em] text-slate-500">STUDIO</span>}
      </span>
    </span>
  );
}

function SectionEyebrow({ children, number }: { children: ReactNode; number?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
      <span className="h-px w-8 bg-cyan-400/70" />
      {number && <span className="font-mono text-cyan-500/60">{number}</span>}
      {children}
    </div>
  );
}

function ProductPreview() {
  const [rotation, setRotation] = useState<number>(0);
  const transformStyle: CSSProperties = {
    transform: `perspective(650px) rotateY(${rotation}deg) rotateX(-7deg)`
  };

  return (
    <div className="product-preview relative min-h-[360px] overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#080e18] p-5 sm:min-h-[420px] sm:p-7">
      <div className="absolute inset-0 product-grid opacity-70" aria-hidden="true" />
      <div className="absolute -left-16 top-12 h-48 w-48 rounded-full bg-cyan-400/10 blur-[70px]" aria-hidden="true" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">Vista de platillo</p>
          <p className="mt-1 text-sm font-medium text-slate-200">Experiencia 3D · Escala real</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          interactivo
        </span>
      </div>
      <div className="relative z-10 flex min-h-[220px] items-center justify-center sm:min-h-[270px]">
        <div className="absolute bottom-5 h-12 w-48 rounded-[50%] bg-cyan-400/20 blur-2xl" aria-hidden="true" />
        <div
          className="burger-3d select-none text-[118px] leading-none drop-shadow-[0_24px_32px_rgba(0,0,0,0.65)] sm:text-[150px]"
          style={transformStyle}
          aria-label="Representación 3D decorativa de una hamburguesa"
        >
          🍔
        </div>
        <div className="absolute bottom-3 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" aria-hidden="true" />
      </div>
      <div className="relative z-10 flex items-center justify-between border-t border-white/[0.08] pt-4">
        <div>
          <p className="text-xs font-semibold text-white">Burger Wagyu Suprema</p>
          <p className="mt-1 text-[10px] text-slate-500">Usa los controles para girar</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRotation((value) => value - 45)}
            className="preview-control"
            aria-label="Girar platillo a la izquierda"
          >
            <RotateCcw className="h-4 w-4 -scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => setRotation(0)}
            className="preview-control"
            aria-label="Restablecer rotación del platillo"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setRotation((value) => value + 45)}
            className="preview-control"
            aria-label="Girar platillo a la derecha"
          >
            <RotateCcw className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPreview() {
  const tables = [
    { name: 'Mesa 01', status: 'Ocupada', color: 'bg-cyan-400', orders: '2 comandas' },
    { name: 'Mesa 02', status: 'Disponible', color: 'bg-emerald-400', orders: 'Lista para recibir' },
    { name: 'Mesa 03', status: 'En atención', color: 'bg-amber-400', orders: '1 comanda' },
    { name: 'Mesa 04', status: 'Disponible', color: 'bg-emerald-400', orders: 'Lista para recibir' }
  ];

  return (
    <div className="admin-preview relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#0c121d] p-5 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">Panel de operación</p>
          <p className="mt-1 text-sm font-medium text-slate-200">La terraza · Vista de sala</p>
        </div>
        <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[10px] text-slate-400">En vivo</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {tables.map((table) => (
          <div key={table.name} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-colors hover:border-cyan-400/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">{table.name}</span>
              <span className={`h-2 w-2 rounded-full ${table.color}`} />
            </div>
            <p className="mt-3 text-[10px] text-slate-400">{table.status}</p>
            <p className="mt-1 text-[9px] text-slate-600">{table.orders}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/10 bg-cyan-400/[0.045] px-3.5 py-3">
        <span className="flex items-center gap-2 text-[10px] text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
          Comanda #024 · Mesa 03
        </span>
        <span className="text-[10px] font-medium text-cyan-300">Preparando</span>
      </div>
    </div>
  );
}

function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitted(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Escribe tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = 'Escribe un correo válido.';
    if (values.message.trim().length < 10) nextErrors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const mailto = makeMailto('Consulta para VOLUM', [
      `Nombre: ${values.name.trim()}`,
      `Correo: ${values.email.trim()}`,
      '',
      values.message.trim()
    ]);
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {submitted && (
        <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-200">
          Tu mensaje está listo. Si no se abrió tu correo, escríbenos directamente a {EMAIL}.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-slate-300">
          Nombre
          <input name="name" autoComplete="name" value={values.name} onChange={update} className="contact-input mt-2" placeholder="Tu nombre" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
          {errors.name && <span id="contact-name-error" className="mt-1.5 block text-xs text-rose-300">{errors.name}</span>}
        </label>
        <label className="block text-xs font-medium text-slate-300">
          Correo electrónico
          <input name="email" type="email" autoComplete="email" value={values.email} onChange={update} className="contact-input mt-2" placeholder="tu@empresa.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
          {errors.email && <span id="contact-email-error" className="mt-1.5 block text-xs text-rose-300">{errors.email}</span>}
        </label>
      </div>
      <label className="block text-xs font-medium text-slate-300">
        ¿En qué podemos ayudarte?
        <textarea name="message" rows="4" value={values.message} onChange={update} className="contact-input mt-2 resize-y" placeholder="Cuéntanos sobre tu idea o proyecto..." aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
        {errors.message && <span id="contact-message-error" className="mt-1.5 block text-xs text-rose-300">{errors.message}</span>}
      </label>
      <button type="submit" className="button-primary w-full sm:w-auto">
        <Send className="h-4 w-4" /> Enviar mensaje
      </button>
      <p className="text-[11px] text-slate-500">El envío abre tu aplicación de correo para que puedas revisar el mensaje antes de enviarlo.</p>
    </form>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresa un correo válido para recibir novedades.');
      setSubmitted(false);
      return;
    }
    setError('');
    window.location.href = makeMailto('Lista de espera VOLUM-PAGES', [`Quiero recibir novedades de VOLUM-PAGES.`, `Correo: ${email.trim()}`]);
    setSubmitted(true);
  };

  return (
    <form onSubmit={submit} noValidate className="mt-6">
      <label htmlFor="pages-email" className="sr-only">Tu correo para la lista de espera</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id="pages-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); setSubmitted(false); }} className="contact-input min-w-0 flex-1" placeholder="Tu correo electrónico" aria-invalid={Boolean(error)} aria-describedby={error ? 'pages-email-error' : undefined} />
        <button type="submit" className="button-primary shrink-0">
          {submitted ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {submitted ? 'Listo' : 'Avisarme'}
        </button>
      </div>
      {error && <span id="pages-email-error" className="mt-2 block text-xs text-rose-300">{error}</span>}
      {submitted && <span role="status" className="mt-2 block text-xs text-emerald-300">Tu solicitud está lista en tu aplicación de correo.</span>}
    </form>
  );
}

export default function VolumCorporateLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'VOLUM | Tecnología e innovación aplicada';
    if (description) {
      description.content = 'En VOLUM desarrollamos software y experiencias digitales para proyectos comerciales y privados.';
    }
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
    };
  }, []);

  return (
    <main className="volum-corporate min-h-screen overflow-hidden bg-[#0b0f19] text-slate-100">
      <div className="ambient-light" aria-hidden="true">
        <div className="ambient-orb ambient-orb-one" />
        <div className="ambient-orb ambient-orb-two" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0b0f19]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#inicio" className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label="VOLUM, inicio">
            <VolumMark />
          </a>
          <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map(([label, href]) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </nav>
          <a href="#contacto" className="button-outline hidden sm:inline-flex">
            Hablemos <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 lg:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Navegación móvil" className="border-t border-white/[0.06] bg-[#0b0f19]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col">
              {NAV_ITEMS.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-cyan-200">{label}</a>
              ))}
              <a href="#contacto" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950">
                Contactar <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </nav>
        )}
      </header>

      <section id="inicio" className="hero-section relative scroll-mt-24">
        <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="hero-halo absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:pb-32 lg:pt-32">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200 sm:text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Tecnología que expande posibilidades
            </div>
            <h1 className="max-w-3xl text-[clamp(2.65rem,6.2vw,5.6rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-white">
              VOLUM: innovando el futuro de los{' '}
              <span className="gradient-text">proyectos comerciales y privados.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Desarrollamos tecnología y experiencias digitales que convierten ideas ambiciosas en soluciones reales. Diseño, software y transformación digital con visión de futuro.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#nosotros" className="button-primary">
                Conoce más <ArrowDown className="h-4 w-4" />
              </a>
              <a href="#startups" className="button-secondary">
                Ver Start-ups <MoveUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.08] pt-6 text-[11px] font-medium text-slate-500">
              <span className="inline-flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-cyan-300" /> Desarrollo centrado en personas</span>
              <span className="inline-flex items-center gap-2"><Layers3 className="h-3.5 w-3.5 text-emerald-300" /> Tecnología para el mundo real</span>
            </div>
          </div>

          <div className="hero-visual relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center lg:ml-auto">
            <div className="hero-orbit hero-orbit-outer" aria-hidden="true" />
            <div className="hero-orbit hero-orbit-inner" aria-hidden="true" />
            <div className="hero-core relative flex h-44 w-44 items-center justify-center rounded-[42px] border border-cyan-200/20 bg-[#111c2c]/85 shadow-[0_0_90px_rgba(0,210,255,0.15),inset_0_0_50px_rgba(37,99,235,0.13)] sm:h-56 sm:w-56 sm:rounded-[54px]">
              <div className="absolute inset-3 rounded-[34px] border border-white/[0.07] sm:rounded-[46px]" />
              <div className="relative text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-4xl font-black text-[#06101b] shadow-[0_0_35px_rgba(0,210,255,0.28)] sm:h-20 sm:w-20 sm:text-5xl">V</div>
                <p className="text-xs font-bold tracking-[0.3em] text-white sm:text-sm">VOLUM</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.22em] text-cyan-200/60">Build what's next</p>
              </div>
            </div>
            <div className="floating-chip floating-chip-one"><Cpu className="h-4 w-4 text-cyan-300" /><span>Ideas + tecnología</span></div>
            <div className="floating-chip floating-chip-two"><Code2 className="h-4 w-4 text-emerald-300" /><span>Experiencias digitales</span></div>
            <div className="floating-chip floating-chip-three"><Sparkles className="h-4 w-4 text-blue-300" /><span>Innovación aplicada</span></div>
            <div className="absolute bottom-[13%] right-[4%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_#10b981]" aria-hidden="true" />
            <div className="absolute left-[8%] top-[20%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_#00d2ff]" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-px w-[min(90%,1100px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" aria-hidden="true" />
      </section>

      <section id="nosotros" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <SectionEyebrow number="01">Nosotros</SectionEyebrow>
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
              Diseñamos el siguiente paso, no solo el siguiente producto.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-slate-300">
              En VOLUM conectamos tecnología, diseño y estrategia para crear soluciones digitales útiles, memorables y preparadas para crecer.
            </p>
            <p className="mt-5 leading-7 text-slate-500">
              Trabajamos con comercios, marcas y equipos que quieren transformar su operación o llevar una idea desde el concepto hasta una experiencia digital concreta. Cada proyecto empieza entendiendo el reto y termina con tecnología que sí resuelve.
            </p>
            <a href="#servicios" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
              Así es como trabajamos <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="servicios" className="scroll-mt-24 border-y border-white/[0.06] bg-[#0e1521]/60 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <SectionEyebrow number="02">Servicios</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Tecnología para avanzar con intención.</h2>
            <p className="mt-4 leading-7 text-slate-400">Unimos capacidad técnica y criterio de producto para resolver retos comerciales y privados de principio a fin.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Code2, title: 'Desarrollo de software', text: 'Plataformas web y herramientas digitales creadas alrededor de las necesidades reales de cada negocio.' },
              { icon: Smartphone, title: 'Transformación digital', text: 'Mejoramos procesos y experiencias con soluciones accesibles, conectadas y fáciles de adoptar.' },
              { icon: Cpu, title: 'Experiencias inmersivas', text: 'Tecnologías 3D y WebAR para acercar productos y espacios al público de formas nuevas.' }
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="service-card group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-7">
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-200 transition group-hover:border-cyan-300/35 group-hover:bg-cyan-300/[0.12]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] text-slate-600">0{index + 1} / SOLUCIÓN</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
                <div className="mt-6 h-px w-10 bg-gradient-to-r from-cyan-300 to-transparent transition-all group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="startups" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <SectionEyebrow number="03">Start-ups</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Ideas propias. Impacto tangible.</h2>
              <p className="mt-4 leading-7 text-slate-400">Construimos productos digitales que abren nuevas posibilidades para negocios y marcas.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Ecosistema VOLUM
            </span>
          </div>

          <article id="proyectos" className="startup-card scroll-mt-24 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0e1520]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-11">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-[0_8px_28px_rgba(0,210,255,0.18)]">
                      <span className="text-lg font-black">V</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">VOLUM<span className="text-cyan-300">-MENU</span></h3>
                      <p className="text-[10px] uppercase tracking-[0.13em] text-slate-500">Tecnología para gastronomía</p>
                    </div>
                  </div>
                  <p className="max-w-lg text-sm leading-7 text-slate-400">
                    Una plataforma para comercios de comida que convierte el menú en una experiencia digital: platillos en 3D, pedidos desde la mesa y herramientas para gestionar sala y comandas.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Experiencia 3D', 'Control de mesas', 'Digitalización'].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-400">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-9">
                  <Link to="/" className="button-primary">
                    Explorar VOLUM-MENU <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-[10px] text-slate-600">Conoce la plataforma y explora su experiencia interactiva.</p>
                </div>
              </div>
              <div className="grid gap-3 border-t border-white/[0.06] bg-[#0b111b] p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
                <ProductPreview />
                <AdminPreview />
              </div>
            </div>
          </article>

          <article className="pages-card relative mt-5 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0c131e] p-6 sm:p-9 lg:p-11">
            <div className="blueprint-grid absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.75fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-300/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300 animate-pulse" /> Próximamente
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">VOLUM<span className="text-blue-300">-PAGES</span></h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                  Diseño, arquitectura y digitalización web a medida para marcas y empresas. Una presencia en línea construida alrededor de lo que hace única a cada marca.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Diseño a medida', 'Digitalización'].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-400">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="wireframe-panel relative aspect-[1.55] overflow-hidden rounded-2xl border border-blue-300/20 bg-[#0b1724]/90 p-4">
                  <div className="flex items-center gap-1.5 border-b border-blue-300/10 pb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-300/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/50" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <span className="ml-auto font-mono text-[8px] tracking-wider text-blue-200/50">VOLUM-PAGES / 001</span>
                  </div>
                  <div className="mt-5 grid grid-cols-[1fr_0.65fr] gap-3">
                    <div className="space-y-2.5">
                      <div className="h-2 w-4/5 rounded bg-blue-200/25" />
                      <div className="h-1 w-full rounded bg-blue-200/10" />
                      <div className="h-1 w-5/6 rounded bg-blue-200/10" />
                      <div className="mt-4 h-6 w-20 rounded border border-cyan-300/25 bg-cyan-300/[0.07]" />
                    </div>
                    <div className="relative h-20 rounded-lg border border-blue-300/20 bg-gradient-to-br from-blue-400/10 to-cyan-300/[0.03]">
                      <div className="absolute inset-3 border border-dashed border-blue-200/15" />
                    </div>
                  </div>
                  <div className="mt-4 h-7 rounded-lg border border-blue-300/10 bg-white/[0.015]" />
                  <div className="absolute inset-x-0 top-0 h-px animate-[blueprint-scan_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#00d2ff]" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300 animate-pulse" /> Sistema en desarrollo
                </div>
              </div>
            </div>
            <div className="relative mt-8 border-t border-white/[0.07] pt-6 sm:max-w-lg">
              <p className="text-xs font-medium text-slate-300">¿Quieres ser de los primeros en conocerlo?</p>
              <WaitlistForm />
            </div>
          </article>
        </div>
      </section>

      <section className="relative px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-cyan-300/10 bg-gradient-to-br from-[#101e2b] via-[#0d1622] to-[#0d1420] p-7 sm:p-11 lg:p-14">
          <div className="absolute" aria-hidden="true" />
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <SectionEyebrow>Construyamos juntos</SectionEyebrow>
              <h2 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">Tu próximo proyecto merece una nueva perspectiva.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">Cuéntanos qué quieres lograr. Nos encantará explorar contigo cómo llevarlo más lejos.</p>
            </div>
            <a href="#contacto" className="button-primary w-fit">
              Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="contacto" className="scroll-mt-24 border-t border-white/[0.06] bg-[#0e1521]/55 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div>
            <SectionEyebrow number="04">Contacto</SectionEyebrow>
            <h2 className="max-w-md text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">Cuéntanos qué estás imaginando.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">Estamos aquí para conversar sobre tu idea, resolver tus dudas o encontrar juntos el siguiente paso.</p>
            <div className="mt-9 space-y-4">
              <a href={`mailto:${EMAIL}`} className="contact-detail group">
                <span className="contact-icon"><Mail className="h-4 w-4" /></span>
                <span><span className="block text-[10px] uppercase tracking-wider text-slate-500">Correo</span><span className="mt-1 block text-sm text-slate-200 group-hover:text-cyan-200">{EMAIL}</span></span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-slate-600 transition group-hover:text-cyan-200" />
              </a>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="contact-detail group">
                <span className="contact-icon contact-icon-green"><Smartphone className="h-4 w-4" /></span>
                <span><span className="block text-[10px] uppercase tracking-wider text-slate-500">Teléfono / WhatsApp</span><span className="mt-1 block text-sm text-slate-200 group-hover:text-emerald-200">+52 55 1234 5678</span></span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-slate-600 transition group-hover:text-emerald-200" />
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#0b111b] p-5 sm:p-8">
            <p className="mb-6 text-sm font-semibold text-white">Envíanos un mensaje</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a href="#inicio" aria-label="VOLUM, volver al inicio"><VolumMark /></a>
            <p className="mt-2 text-[10px] text-slate-600">Tecnología, diseño e innovación aplicada.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] text-slate-500">
            <a href="#servicios" className="footer-link">Servicios</a>
            <a href="#startups" className="footer-link">Start-ups</a>
            <Link to="/privacidad" className="footer-link">Privacidad</Link>
            <Link to="/terminos" className="footer-link">Términos</Link>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/volummenu/" target="_blank" rel="noreferrer" aria-label="VOLUM en Instagram" className="social-link">
              <span className="text-[10px] font-bold">ig</span>
            </a>
            <a href="https://www.facebook.com/volummenu/" target="_blank" rel="noreferrer" aria-label="VOLUM en Facebook" className="social-link">
              <Facebook className="h-4 w-4" />
            </a>
            <span className="ml-3 text-[10px] text-slate-600">© {new Date().getFullYear()} VOLUM</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

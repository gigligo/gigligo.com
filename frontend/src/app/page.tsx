'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, Star, Shield, Zap, Code, Pen, BarChart2, Video, Users, Globe, Layers, Search, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ═══════════════════════════════════════════════
   INLINE SVG ICONS
   ═══════════════════════════════════════════════ */
function Icon({ name, className = '', size = 24 }: { name: string; className?: string; size?: number }) {
  const d: Record<string, React.ReactNode> = {
    medal: <><circle cx="12" cy="8" r="6" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></>,
    sparkle: <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />,
    shield: <><path d="M12 2l7 4v5c0 5.25-3.5 10-7 11.5C8.5 21 5 16.25 5 11V6l7-4z" /><path d="M9 12l2 2 4-4" /></>,
    out: <><path d="M7 17L17 7" /><path d="M7 7h10v10" /></>,
    trend: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    school: <><path d="M12 3L1 9l11 6 9-4.9V17h2V9z" /><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></>,
    premium: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
    fwd: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
    pen: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
    chart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    video: <><rect x="2" y="4" width="15" height="16" rx="2" /><polygon points="22 8 17 12 22 16" /></>,
    users: <><circle cx="9" cy="7" r="3" /><path d="M2 21v-2a5 5 0 015-5h4a5 5 0 015 5v2" /><circle cx="19" cy="7" r="2.5" /><path d="M22 21v-1.5a3.5 3.5 0 00-3-3.46" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />,
    layers: <><polygon points="12 2 2 7 12 12 22 7" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    case: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d[name]}
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING SHAPES
   ═══════════════════════════════════════════════ */
function Float3D({ children, className = '', style, ...rest }: { children: React.ReactNode; className?: string; style?: React.CSSProperties;[k: string]: unknown }) {
  return <div className={`absolute pointer-events-none ${className}`} style={{ willChange: 'transform', ...style }} {...rest}>{children}</div>;
}

function MorphBlob({ size, color, className = '' }: { size: number; color: string; className?: string }) {
  return (
    <div className={`morph ${className}`} style={{
      width: size, height: size,
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
    }} />
  );
}

function OrbitRing({ r, dur, color, dotSize = 6, className = '' }: { r: number; dur: number; color: string; dotSize?: number; className?: string }) {
  return (
    <div className={`absolute ${className}`} style={{ width: r * 2, height: r * 2, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <div className="w-full h-full rounded-full" style={{ border: '1px solid rgba(239,238,234,0.06)' }} />
      <div className="absolute top-0 left-1/2" style={{ '--orbit-r': `${r}px`, animation: `orbit ${dur}s linear infinite`, transformOrigin: '0 0' } as React.CSSProperties}>
        <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
    </div>
  );
}

function FloatSVG({ type, className = '', style }: { type: string; className?: string; style?: React.CSSProperties }) {
  const paths: Record<string, React.ReactNode> = {
    code: <><polyline points="12,6 4,16 12,26" /><polyline points="20,6 28,16 20,26" /><line x1="17" y1="4" x2="15" y2="28" /></>,
    pen: <path d="M24 4L30 10L12 28H6V22L24 4Z" />,
    chat: <><path d="M6 6H26V22H16L10 28V22H6V6Z" strokeLinejoin="round" /><line x1="11" y1="12" x2="21" y2="12" /></>,
    star: <polygon points="16,3 19,12 28,12 21,18 23,27 16,22 9,27 11,18 4,12 13,12" />,
    bolt: <path d="M18 3L7 17H16L14 29L25 15H16L18 3Z" />,
    case: <><rect x="4" y="12" width="24" height="16" rx="2" /><path d="M12 12V9C12 7 13.5 5 16 5S20 7 20 9V12" /></>,
    nodes: <><circle cx="8" cy="8" r="3" /><circle cx="24" cy="8" r="3" /><circle cx="16" cy="24" r="3" /><line x1="8" y1="8" x2="24" y2="8" /><line x1="8" y1="8" x2="16" y2="24" /></>,
    dollar: <><line x1="16" y1="4" x2="16" y2="28" /><path d="M22 10C22 7 19 5 16 5S10 7 10 10 14 15 16 16 22 18 22 22 19 27 16 27 10 25 10 22" /></>,
    bulb: <><path d="M14 26H18" /><path d="M13 22C10 20 8 17 8 13A8 8 0 0116 3a8 8 0 018 10c0 4-2 7-5 9H13Z" /></>,
    chart: <><polyline points="4,24 10,16 16,20 22,8 28,12" /><circle cx="28" cy="12" r="2" /></>,
    cube: <><path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" /><path d="M16 28V16" /><path d="M4 10L16 16L28 10" /></>,
    hex: <path d="M16 3L27 9V21L16 27L5 21V9L16 3Z" />,
  };
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {paths[type]}
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   GRADIENT G LOGO — orange → teal
   ═══════════════════════════════════════════════ */
function GLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
      <defs><linearGradient id="gLG" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#FE7743" /><stop offset="1" stopColor="#273F4F" /></linearGradient></defs>
      <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#gLG)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M19 18 H30" stroke="url(#gLG)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="19" cy="18" r="2" fill="#FE7743"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" /></circle>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING ELEMENTS — left = orange, right = teal
   ═══════════════════════════════════════════════ */
const HERO_FLOATS = [
  // Left side — Gold accent (Professional)
  { type: 'code', top: '10%', left: '3%', w: 48, op: 0.12, sp: -0.07, rt: 0.03, anim: 'float-slow', cls: 'text-[#DAA520]' },
  { type: 'bulb', top: '35%', left: '1%', w: 32, op: 0.08, sp: 0.05, rt: -0.04, anim: 'float-alt', cls: 'text-[#DAA520]/60' },
  { type: 'star', top: '65%', left: '5%', w: 38, op: 0.10, sp: -0.04, rt: 0.02, anim: 'float-diagonal', cls: 'text-[#DAA520]/40' },
  // Right side — Gray accent (Enterprise)
  { type: 'case', top: '8%', left: '55%', w: 40, op: 0.10, sp: 0.08, rt: -0.03, anim: 'float-alt', cls: 'text-[#424242]' },
  { type: 'chat', top: '40%', left: '92%', w: 34, op: 0.08, sp: -0.06, rt: 0.04, anim: 'float-slow', cls: 'text-[#424242]/60' },
  { type: 'pen', top: '70%', left: '87%', w: 38, op: 0.10, sp: 0.05, rt: -0.02, anim: 'float-diagonal', cls: 'text-[#424242]/40' },
];

/* ═══════════════════════════════════════════════
   TALENT CATEGORIES
   ═══════════════════════════════════════════════ */
const TALENTS = [
  { title: 'Development', sub: 'React, Node, iOS/Android', icon: 'code', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '< >' },
  { title: 'Arts & Design', sub: 'Figma, Logo, 3D Models', icon: 'pen', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '✨' },
  { title: 'Analytics', sub: 'Data Entry, Research', icon: 'chart', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '📈' },
  { title: 'Video & Media', sub: 'Editing, Animation', icon: 'video', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '▶' },
  { title: 'Writing', sub: 'Content, Proofreading', icon: 'chat', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '✎' },
  { title: 'Tech Support', sub: 'QA Testing, Cloud Ops', icon: 'zap', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '⚙' },
  { title: 'Business', sub: 'Virtual Admin, Support', icon: 'case', color: 'text-[#DAA520]', bg: 'from-[#DAA520]/5 to-transparent', hoverBg: 'group-hover:bg-[#DAA520]/10', border: 'group-hover:border-[#DAA520]/30', element: '❖' },
];

/* ═══════════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════════ */
const STATS = [
  { val: '30M+', label: 'Students in Pakistan' },
  { val: '0%', label: 'Freelancer Commission' },
  { val: '100%', label: 'Escrow Protection' },
  { val: 'Direct', label: 'JazzCash / Easypaisa' },
  { val: 'Verified', label: 'Campus Talent' },
  { val: '24/7', label: 'Local Support' },
];

/* ═══════════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════════ */
export default function Home() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const floatElsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef(0);
  const lastY = useRef(0);

  const handleTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--rx', `${(y - 0.5) * -12}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
  }, []);
  const resetTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }, []);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 0.5) return;
      lastY.current = y;
      if (progressRef.current) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current.style.width = h > 0 ? `${(y / h) * 100}%` : '0%';
      }
      headerRef.current?.classList.toggle('header-solid', y > 60);
      if (heroRef.current) {
        const factor = Math.min(y / 800, 1);
        heroRef.current.style.transform = `scale(${1 - factor * 0.05}) translateZ(0)`;
        heroRef.current.style.opacity = `${1 - factor * 0.3}`;
      }
      floatElsRef.current.forEach((el) => {
        const sp = parseFloat(el.dataset.sp || '0');
        const rt = parseFloat(el.dataset.rt || '0');
        el.style.transform = `translate3d(0, ${y * sp}px, 0) rotate(${y * rt}deg)`;
      });
    });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const d = e.target.getAttribute('data-delay');
          if (d) setTimeout(() => e.target.classList.add('revealed'), +d);
          else e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-scroll]').forEach((el) => obs.observe(el));

    floatElsRef.current = Array.from(document.querySelectorAll<HTMLElement>('[data-float]'));

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => { obs.disconnect(); window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafRef.current); };
  }, [handleScroll]);

  return (
    <div className="bg-white font-sans text-[#212121] selection:bg-[#DAA520]/20 transition-colors duration-300">
      <div ref={progressRef} className="scroll-progress" />

      <Navbar />

      <main>
        {/* ════════════════════════════════════════════════════════════
            HERO — LEFT = ORANGE (Students) | RIGHT = TEAL (Business)
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">
          {/* Background blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Float3D style={{ top: '-10%', left: '-5%' }} data-float="" data-sp="-0.02" data-rt="0">
              <MorphBlob size={400} color="rgba(218,165,32,0.05)" />
            </Float3D>
            <Float3D style={{ bottom: '-15%', right: '-8%' }} data-float="" data-sp="0.03" data-rt="0">
              <MorphBlob size={500} color="rgba(33,33,33,0.05)" />
            </Float3D>
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {HERO_FLOATS.map((f, i) => (
              <div key={i} className="absolute" style={{ top: f.top, left: f.left, willChange: 'transform' }} data-float="" data-sp={f.sp} data-rt={f.rt}>
                <div className={f.anim} style={{ opacity: f.op }}>
                  <FloatSVG type={f.type} className={f.cls} style={{ width: f.w, height: f.w }} />
                </div>
              </div>
            ))}
          </div>

          {/* Orbit rings */}
          <div className="absolute inset-0 z-2 pointer-events-none hidden md:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <OrbitRing r={120} dur={20} color="#FE7743" dotSize={5} />
              <OrbitRing r={180} dur={30} color="#273F4F" dotSize={4} className="opacity-60" />
              <OrbitRing r={240} dur={45} color="rgba(239,238,234,0.25)" dotSize={3} className="opacity-30" />
            </div>
          </div>

          {/* ── LEFT PANEL: Students ── */}
          <div ref={heroRef} className="relative flex-1 flex flex-col items-center justify-center px-8 py-28 md:px-16 persona-hover group overflow-hidden bg-white">
            <div className="relative z-10 w-full max-w-lg" data-scroll="fade-right" data-delay="200">
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse" /> Next-Gen Talent
              </div>
              <h1 className="font-sans text-5xl md:text-7xl font-bold text-[#212121] leading-[0.95] mb-6">
                Earn while you <br /><span className="text-[#DAA520]">Learn.</span>
              </h1>
              <p className="text-lg text-[#424242] font-normal mb-10 max-w-md leading-relaxed">Empowering students to launch their careers without boundaries.</p>

              <div className="space-y-4 mb-10">
                <div className="card p-6 border-l-4 border-l-[#DAA520]" data-scroll="fade-up" data-delay="400">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#DAA520]/10 flex items-center justify-center shrink-0"><Star size={20} className="text-[#DAA520]" /></div>
                    <div><h4 className="font-bold text-[#212121]">Skill-First Gigs</h4><p className="text-sm text-[#424242] mt-1">Free registration and tools to turn projects into impact.</p></div>
                  </div>
                </div>
              </div>

              <Link href="/register?role=SELLER" className="btn-primary w-full md:w-auto px-10 py-5">
                Start Earning Today
              </Link>
            </div>
          </div>

          {/* ── RIGHT PANEL: Businesses ── */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-28 md:px-16 persona-hover group overflow-hidden bg-[#212121]">
            <div className="relative z-10 w-full max-w-lg" data-scroll="fade-left" data-delay="400">
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse" /> Hire Talent
              </div>
              <h1 className="font-sans text-5xl md:text-7xl font-bold text-white leading-[0.95] mb-6">
                Scale with <br /><span className="text-[#DAA520]">Elite Talent.</span>
              </h1>
              <p className="text-lg text-white/60 font-normal mb-10 max-w-md leading-relaxed">Instant access to Pakistan's top university professionals.</p>

              <Link href="/search" className="btn-primary w-full md:w-auto px-10 py-5">
                Hire Talent Now
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SOCIAL PROOF (RECENT ACTIVITY TICKER)
            ════════════════════════════════════════════ */}
        <section className="py-2 bg-[#212121] border-y border-[#DAA520]/10 relative overflow-hidden">
          <div className="flex ticker whitespace-nowrap">
            {[
              { text: "Creative Director hired from LUMS", time: "2 min ago" },
              { text: "Product Designer completed project for TechLogix", time: "15 min ago" },
              { text: "Senior React Dev matched with Systems Ltd", time: "1 hr ago" },
              { text: "Content Writer earned 'Pro Talent' badge", time: "2 hrs ago" }
            ].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-8 border-r border-white/5 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                <span className="text-[11px] uppercase tracking-wider text-white/50 font-bold">{item.text}</span>
                <span className="text-[10px] text-[#DAA520] font-bold">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TRUSTED BY STRIP
            ════════════════════════════════════════════ */}
        <section className="py-12 bg-white">
          <div className="max-container">
            <p className="text-center text-[10px] font-bold text-[#424242]/40 uppercase tracking-[0.3em] mb-10">Trusted by Professionals from</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale contrast-125">
              <span className="text-2xl font-bold text-[#212121]">LUMS</span>
              <span className="text-2xl font-bold text-[#212121]">NUST</span>
              <span className="text-2xl font-bold text-[#212121] tracking-tighter">FAST-NU</span>
              <span className="text-2xl font-bold text-[#212121]">IBA</span>
              <span className="text-2xl font-bold text-[#212121]">GIKI</span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS TICKER — OFF-WHITE BAR (light section)
            ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-8 bg-[#F5F5F5]">
          <div className="flex ticker whitespace-nowrap">
            {[...STATS, ...STATS].map((s, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-10">
                <span className="text-3xl font-bold text-[#212121]">{s.val}</span>
                <span className="text-[10px] text-[#424242] uppercase tracking-widest font-bold">{s.label}</span>
                <span className="text-[#DAA520]/40 mx-6">/</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CURATED TALENT — TEAL DOMINANT SECTION
            ════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden bg-white">
          <div className="max-container relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <div data-scroll="fade-up">
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-xs font-bold uppercase tracking-widest">Expertise Areas</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-4 leading-tight">Elite <span className="text-[#DAA520]">Categories.</span></h2>
                <p className="text-[#424242]/70 max-w-lg font-normal text-lg">Curated local talent with specialized expertise for high-end results.</p>
              </div>
              <Link href="/search" className="btn-secondary py-3 px-6" data-scroll="fade-left" data-delay="200">
                Browse All <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {TALENTS.map((t, i) => (
                <div key={i} className="group cursor-pointer flex flex-col items-center text-center" data-scroll="fade-up" data-delay={`${i * 50}`}>
                  <div className={`w-full aspect-square rounded-2xl mb-4 relative overflow-hidden bg-[#F5F5F5] border border-transparent flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#DAA520]/20`}>
                    <div className="text-[60px] font-bold opacity-0 group-hover:opacity-[0.03] transition-all duration-700 select-none scale-50 group-hover:scale-100 absolute italic text-[#212121]">
                      {t.element}
                    </div>
                    <Icon name={t.icon} size={32} className={`mb-2 text-[#424242]/40 group-hover:text-[#DAA520] transition-all duration-300 relative z-10`} />
                  </div>
                  <h3 className="text-sm font-bold text-[#212121] mb-1">{t.title}</h3>
                  <p className="text-[#424242]/50 text-[11px] font-normal leading-snug">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURED TALENT PREVIEW (Show the Product!)
            ════════════════════════════════════════════ */}
        <section className="py-24 bg-[#F5F5F5] relative overflow-hidden">
          <div className="max-container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div data-scroll="fade-up">
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-xs font-bold uppercase tracking-widest">Rising Stars</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-4">Top Rated <span className="text-[#DAA520]">Students.</span></h2>
                <p className="text-[#424242]/60 max-w-lg font-normal text-lg">Verified university talent with a track record of excellence.</p>
              </div>
              <Link href="/search" className="btn-secondary py-3 px-6" data-scroll="fade-left">
                View All Talent
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Ahsan M.', uni: 'FAST-NU', role: 'Full Stack Web Developer', rate: 'PKR 15,000', img: 'A', tags: ['React', 'Node.js'] },
                { name: 'Fatima Z.', uni: 'LUMS', role: 'UI/UX Designer', rate: 'PKR 12,000', img: 'F', tags: ['Figma', 'Web Design'] },
                { name: 'Usman T.', uni: 'NUST', role: 'Data Scientist', rate: 'PKR 20,000', img: 'U', tags: ['Python', 'SQL'] },
              ].map((talent, i) => (
                <div key={i} className="bg-white border border-[#212121]/5 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group" data-scroll="fade-up" data-delay={i * 100}>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-[#212121] flex items-center justify-center text-[#DAA520] font-bold text-2xl shadow-lg border-2 border-[#DAA520]/20">
                      {talent.img}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#212121] text-lg flex items-center gap-2">{talent.name} <CheckCircle2 size={16} className="text-[#DAA520]" /></h4>
                      <p className="text-sm text-[#424242]/60 font-bold uppercase tracking-widest">{talent.uni}</p>
                    </div>
                  </div>
                  <h5 className="font-bold text-[#212121] mb-4">{talent.role}</h5>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {talent.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[#F5F5F5] rounded-full text-[10px] font-bold text-[#424242] uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-[#F5F5F5]">
                    <div>
                      <p className="text-[10px] text-[#424242]/40 font-bold uppercase tracking-widest mb-1">Starting at</p>
                      <p className="font-bold text-[#212121] text-xl">{talent.rate}</p>
                    </div>
                    <Link href="/search" className="w-10 h-10 rounded-full border border-[#DAA520]/30 flex items-center justify-center text-[#DAA520] hover:bg-[#DAA520] hover:text-[#212121] transition-all">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS — STEP-BY-STEP (ScrollReveal)
            ════════════════════════════════════════════ */}
        <section className="py-32 bg-[#212121] text-white relative overflow-hidden">
          <div className="max-container relative z-10">
            <div className="text-center mb-24" data-scroll="fade-up">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-xs font-bold uppercase tracking-widest">The Process</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">How it <span className="text-[#DAA520]">Works.</span></h2>
              <p className="text-white/50 max-w-lg mx-auto font-normal text-lg leading-relaxed">A seamless marketplace designed for high-end collaboration and impact.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {[
                { title: 'Create', desc: 'Build your profile or post a project scope with our high-end wizard.', icon: <Search size={24} /> },
                { title: 'Chat', desc: 'Connect directly through our secure, real-time communication portal.', icon: <Users size={24} /> },
                { title: 'Start', desc: 'Secure payment, release funds on completion, and scale your impact.', icon: <Shield size={24} /> }
              ].map((item, i) => (
                <div key={i} className="relative group text-center" data-scroll="fade-up" data-delay={i * 200}>
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 transition-all duration-500 group-hover:bg-[#DAA520]/10 group-hover:border-[#DAA520]/30 relative z-10">
                    <div className="text-[#DAA520] group-hover:rotate-180 transition-all duration-700">{item.icon}</div>
                    <div className="absolute -top-2 -right-2 text-[40px] font-bold text-white/5 italic select-none">0{i + 1}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed max-w-[280px] mx-auto font-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            OUR MISSION — BLACK + ORANGE accents
            ════════════════════════════════════════════ */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-container flex flex-col items-center text-center">
            <div className="max-w-3xl" data-scroll="fade-up">
              <div className="mb-8 flex justify-center"><GLogo size={48} /></div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-8 leading-tight italic font-serif opacity-80">
                &quot;To empower over 30 million Pakistani university students to build careers without boundaries, bridging the gap between local talent and global enterprise.&quot;
              </h2>
              <div className="w-12 h-1 bg-[#DAA520] mx-auto mb-8 rounded-full" />
              <p className="text-[12px] font-bold text-[#424242]/40 uppercase tracking-[0.4em]">The Gigligo Vision</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            DUAL CTA — OFF-WHITE / LIGHT SECTION
            ════════════════════════════════════════════ */}
        <section className="mb-20 px-6">
          <div className="max-container relative overflow-hidden rounded-[40px] bg-[#212121] py-24 px-8 md:px-20 text-center">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.1)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto" data-scroll="fade-up">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">Ready to <span className="text-[#DAA520]">Start?</span></h2>
              <p className="text-white/60 text-lg mb-12 max-w-md mx-auto leading-relaxed">Join Pakistan's premier freelance ecosystem today and experience the high-end difference.</p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link href="/register" className="btn-primary px-12 py-5 w-full md:w-auto">Join Gigligo Now</Link>
                <Link href="/pricing" className="text-white/60 hover:text-white font-bold transition-colors">View Pricing Plans</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER — BLACK ═══ */}
        <Footer />
      </main>
    </div>
  );
}

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, MoreHorizontal } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
      filter: 'blur(1px)',
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
  // Left side — orange accent
  { type: 'code', top: '10%', left: '3%', w: 48, op: 0.18, sp: -0.07, rt: 0.03, anim: 'float-slow', cls: 'text-orange' },
  { type: 'bulb', top: '35%', left: '1%', w: 32, op: 0.12, sp: 0.05, rt: -0.04, anim: 'float-alt', cls: 'text-orange-light' },
  { type: 'star', top: '65%', left: '5%', w: 38, op: 0.14, sp: -0.04, rt: 0.02, anim: 'float-diagonal', cls: 'text-orange/50' },
  { type: 'nodes', top: '80%', left: '20%', w: 42, op: 0.08, sp: -0.03, rt: -0.02, anim: 'float-slow', cls: 'text-orange-light/40' },
  { type: 'bolt', top: '22%', left: '30%', w: 30, op: 0.10, sp: 0.06, rt: 0.05, anim: 'float-alt', cls: 'text-orange/40' },
  { type: 'dollar', top: '50%', left: '15%', w: 24, op: 0.07, sp: -0.05, rt: 0.06, anim: 'float-diagonal', cls: 'text-orange-light/30' },
  // Right side — teal accent
  { type: 'case', top: '8%', left: '55%', w: 40, op: 0.15, sp: 0.08, rt: -0.03, anim: 'float-alt', cls: 'text-teal-light' },
  { type: 'chat', top: '40%', left: '92%', w: 34, op: 0.12, sp: -0.06, rt: 0.04, anim: 'float-slow', cls: 'text-teal' },
  { type: 'pen', top: '70%', left: '87%', w: 38, op: 0.15, sp: 0.05, rt: -0.02, anim: 'float-diagonal', cls: 'text-teal-light' },
  { type: 'chart', top: '82%', left: '70%', w: 44, op: 0.09, sp: 0.04, rt: 0.03, anim: 'float-slow', cls: 'text-teal/60' },
  { type: 'cube', top: '18%', left: '68%', w: 28, op: 0.08, sp: -0.07, rt: -0.05, anim: 'float-alt', cls: 'text-teal-light/50' },
  { type: 'hex', top: '55%', left: '60%', w: 26, op: 0.06, sp: 0.03, rt: -0.03, anim: 'float-alt', cls: 'text-teal/40' },
];

/* ═══════════════════════════════════════════════
   TALENT CATEGORIES
   ═══════════════════════════════════════════════ */
const TALENTS = [
  { title: 'Development', sub: 'Web, Python, Apps', icon: 'code', color: 'text-teal-vibrant', bg: 'from-teal-vibrant/5 to-transparent', hoverBg: 'group-hover:bg-teal-vibrant/10', border: 'group-hover:border-teal-vibrant/30', element: '< >' },
  { title: 'Arts & Design', sub: 'UI/UX, Branding', icon: 'pen', color: 'text-orange-light', bg: 'from-orange-light/5 to-transparent', hoverBg: 'group-hover:bg-orange-light/10', border: 'group-hover:border-orange-light/30', element: '✨' },
  { title: 'Analytics', sub: 'SEO, Research', icon: 'chart', color: 'text-teal-light', bg: 'from-teal-light/5 to-transparent', hoverBg: 'group-hover:bg-teal-light/10', border: 'group-hover:border-teal-light/30', element: '📈' },
  { title: 'Video & Media', sub: 'Motion, Editing', icon: 'video', color: 'text-orange', bg: 'from-orange/5 to-transparent', hoverBg: 'group-hover:bg-orange/10', border: 'group-hover:border-orange/30', element: '▶' },
  { title: 'Writing', sub: 'Copy, Translation', icon: 'chat', color: 'text-teal-vibrant', bg: 'from-teal-vibrant/5 to-transparent', hoverBg: 'group-hover:bg-teal-vibrant/10', border: 'group-hover:border-teal-vibrant/30', element: '✎' },
  { title: 'Tech Support', sub: 'IT, Networks', icon: 'zap', color: 'text-orange-light', bg: 'from-orange-light/5 to-transparent', hoverBg: 'group-hover:bg-orange-light/10', border: 'group-hover:border-orange-light/30', element: '⚙' },
  { title: 'Business', sub: 'Virtual Admin, Legal', icon: 'case', color: 'text-teal-light', bg: 'from-teal-light/5 to-transparent', hoverBg: 'group-hover:bg-teal-light/10', border: 'group-hover:border-teal-light/30', element: '❖' },
];

/* ═══════════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════════ */
const STATS = [
  { val: '30M+', label: 'Students in Pakistan' },
  { val: '4x', label: 'Cost Advantage vs Global' },
  { val: '<2%', label: 'Dispute Rate' },
  { val: '24hr', label: 'Average Delivery' },
  { val: '100K', label: 'Year 1 Target' },
  { val: 'PKR 30M', label: 'Transaction Goal' },
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
        heroRef.current.style.transform = `scale(${1 - factor * 0.05})`;
        heroRef.current.style.opacity = `${1 - factor * 0.3}`;
      }
      document.querySelectorAll<HTMLElement>('[data-float]').forEach((el) => {
        const sp = parseFloat(el.dataset.sp || '0');
        const rt = parseFloat(el.dataset.rt || '0');
        el.style.transform = `translateY(${y * sp}px) rotate(${y * rt}deg)`;
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => { obs.disconnect(); window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafRef.current); };
  }, [handleScroll]);

  return (
    <div className="bg-white dark:bg-black font-sans text-slate-900 dark:text-offwhite selection:bg-orange/50 dark:selection:bg-orange/30 transition-colors duration-300">
      <div ref={progressRef} className="scroll-progress" />

      {/* ═══ HEADER ═══ */}
      <header ref={headerRef} className="fixed top-0 z-50 w-full px-6 py-4 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="logo-glow"><GLogo size={36} /></div>
          <h2 className="font-display text-2xl font-black tracking-tighter text-slate-900 dark:text-offwhite">gigligo<span className="text-orange/70">.com</span></h2>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search" className="text-sm font-medium text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors">Find Talent</Link>
          <Link href="/jobs" className="text-sm font-medium text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors">Browse Jobs</Link>
          <Link href="/register?role=SELLER" className="text-sm font-medium text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors">Post a Gig</Link>

          <div className="relative group p-2">
            <button className="text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors flex items-center">
              <MoreHorizontal size={20} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
              <Link href="/pricing" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">Pricing</Link>
              <Link href="/referral" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">Refer & Earn</Link>
              <Link href="/faq" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">FAQ</Link>
            </div>
          </div>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <div className="relative group ml-1">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-orange to-orange-light flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer hover:scale-105 transition-transform">
                {session.user?.name?.[0] || 'U'}
              </div>
              <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-2">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{session.user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-white/50 truncate">{session.user?.email}</p>
                </div>
                {(session as any)?.role === 'ADMIN' && (
                  <Link href="/admin" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-bold text-orange transition-colors">Admin Dashboard</Link>
                )}
                <Link href="/dashboard" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">Dashboard</Link>
                <Link href="/dashboard/inbox" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">Inbox</Link>
                <Link href="/dashboard/profile" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">Profile</Link>
                <Link href="/dashboard/settings" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">Settings</Link>
                <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                <button onClick={() => signOut()} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-semibold text-red-600 dark:text-red-400 text-left w-full transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-100 dark:bg-offwhite/10 backdrop-blur-md border border-slate-200 dark:border-offwhite/15 text-slate-900 dark:text-offwhite hover:bg-slate-200 dark:hover:bg-offwhite dark:hover:text-black transition-all">Login</Link>
              <Link href="/register" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-orange text-white hover:bg-orange-light hover:shadow-lg hover:shadow-orange/25 transition-all">Join Free</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button className="text-slate-900 dark:text-offwhite p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 md:hidden">
          <button className="absolute top-6 right-6 text-slate-900 dark:text-offwhite" onClick={() => setMenuOpen(false)}>
            <X size={32} />
          </button>
          <nav className="flex flex-col items-center gap-8 w-full">
            <Link href="/search" className="text-2xl font-bold text-slate-900 dark:text-offwhite hover:text-orange" onClick={() => setMenuOpen(false)}>Find Talent</Link>
            <Link href="/jobs" className="text-2xl font-bold text-slate-900 dark:text-offwhite hover:text-orange" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            <Link href="/pricing" className="text-2xl font-bold text-slate-900 dark:text-offwhite hover:text-orange" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/register?role=SELLER" className="text-2xl font-bold text-slate-900 dark:text-offwhite hover:text-orange" onClick={() => setMenuOpen(false)}>Post a Gig</Link>
            <div className="h-px w-1/3 bg-slate-200 dark:bg-white/10 my-4"></div>
            {session ? (
              <Link href="/dashboard" className="w-full max-w-[200px] py-4 text-center rounded-full text-lg font-bold bg-orange text-white" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-[200px]">
                <Link href="/login" className="w-full py-4 text-center rounded-full text-lg font-bold bg-slate-100 dark:bg-offwhite/10 border border-slate-200 dark:border-offwhite/15 text-slate-900 dark:text-offwhite" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="w-full py-4 text-center rounded-full text-lg font-bold bg-orange text-white" onClick={() => setMenuOpen(false)}>Join Free</Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <main>
        {/* ════════════════════════════════════════════════════════════
            HERO — LEFT = ORANGE (Students) | RIGHT = TEAL (Business)
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">
          {/* Background blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Float3D style={{ top: '-10%', left: '-5%' }} data-float="" data-sp="-0.02" data-rt="0">
              <MorphBlob size={400} color="rgba(254,119,67,0.10)" />
            </Float3D>
            <Float3D style={{ bottom: '-15%', right: '-8%' }} data-float="" data-sp="0.03" data-rt="0">
              <MorphBlob size={500} color="rgba(39,63,79,0.10)" />
            </Float3D>
            <Float3D style={{ top: '40%', left: '45%' }} data-float="" data-sp="-0.01" data-rt="0">
              <MorphBlob size={250} color="rgba(239,238,234,0.04)" className="delay-300" />
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

          {/* ── LEFT PANEL: Students — ORANGE accent ── */}
          <div ref={heroRef} className="relative flex-1 flex flex-col items-center justify-center px-8 py-28 md:px-16 persona-hover group overflow-hidden bg-linear-to-br from-orange-50 via-white to-orange-50/50 dark:from-[#1a0800] dark:via-black dark:to-[#0d0400]">
            {/* Orange glow */}
            <div className="absolute inset-0 bg-linear-to-br from-orange/12 via-transparent to-orange-dark/5 pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-orange-light/5 rounded-full blur-[60px]" />

            <div className="relative z-10 w-full max-w-lg" data-scroll="fade-right" data-delay="200">
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/15 border border-orange/30 text-orange text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse" /> Next-Gen Talent
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-offwhite leading-[0.95] mb-6">
                Students &<br /><span className="glow-orange bg-linear-to-r from-orange to-orange-light bg-clip-text text-transparent">Graduates</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-offwhite/60 font-light mb-10 max-w-md leading-relaxed">Empowering <span className="text-orange font-semibold">30 million</span> university students to earn while they learn. No international fees, no barriers.</p>

              <div className="space-y-4 mb-10 perspective-1000">
                <div className="glass-card-orange tilt-card" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-up" data-delay="400">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange/20 flex items-center justify-center shrink-0"><Icon name="medal" size={20} className="text-orange" /></div>
                    <div><h4 className="font-bold text-slate-900 dark:text-offwhite">Opportunity First</h4><p className="text-sm text-slate-500 dark:text-offwhite/50 font-light mt-1">Free registration, verified badges, and lower-commission tiers for top performers.</p></div>
                  </div>
                </div>
                <div className="glass-card-orange tilt-card" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-up" data-delay="550">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-light/15 flex items-center justify-center shrink-0"><Icon name="sparkle" size={20} className="text-orange-light" /></div>
                    <div><h4 className="font-bold text-slate-900 dark:text-offwhite">Skill-Boost</h4><p className="text-sm text-slate-500 dark:text-offwhite/50 font-light mt-1">Micro-courses and certifications that turn gigs into lifelong careers.</p></div>
                  </div>
                </div>
              </div>

              <Link href="/register?role=SELLER" className="group/btn w-full md:w-auto px-10 py-5 bg-orange text-white font-bold rounded-2xl shadow-2xl shadow-orange/25 hover:shadow-orange/40 hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-3 relative overflow-hidden">
                <span className="relative z-10">Start Earning Today</span>
                <Icon name="out" size={20} className="relative z-10" />
                <div className="absolute inset-0 bg-orange-dark opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* ── RIGHT PANEL: Businesses — TEAL accent ── */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-28 md:px-16 persona-hover group overflow-hidden bg-linear-to-tl from-teal-50 via-white to-teal-50/50 dark:from-[#0d1a22] dark:via-black dark:to-[#091318]">
            {/* Teal glow */}
            <div className="absolute inset-0 bg-linear-to-tl from-teal/20 via-transparent to-teal-light/5 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal/12 rounded-full blur-[100px]" />
            <div className="absolute top-1/4 left-0 w-60 h-60 bg-teal-light/5 rounded-full blur-[60px]" />

            <div className="relative z-10 w-full max-w-lg" data-scroll="fade-left" data-delay="400">
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/25 border border-teal-light/30 text-teal-light text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-teal-light animate-pulse" /> Enterprise Ready
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-offwhite leading-[0.95] mb-6">
                Businesses &<br /><span className="bg-linear-to-r from-teal-light to-teal bg-clip-text text-transparent">Startups</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-offwhite/60 font-light mb-10 max-w-md leading-relaxed">Instant, affordable access to Pakistan&apos;s <span className="text-teal-light font-semibold">top talent</span>. Secure payments and verified results.</p>

              <div className="space-y-4 mb-10 perspective-1000">
                <div className="glass-card-teal tilt-card" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-up" data-delay="600">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal/30 flex items-center justify-center shrink-0"><Icon name="shield" size={20} className="text-teal-light" /></div>
                    <div><h4 className="font-bold text-slate-900 dark:text-offwhite">Secure & Transparent</h4><p className="text-sm text-slate-500 dark:text-offwhite/50 font-light mt-1">Escrow payment integration with full transparency at every step.</p></div>
                  </div>
                </div>
                <div className="glass-card-teal tilt-card" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-up" data-delay="750">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-light/20 flex items-center justify-center shrink-0"><Icon name="zap" size={20} className="text-slate-900 dark:text-offwhite/80" /></div>
                    <div><h4 className="font-bold text-slate-900 dark:text-offwhite">Speed & Trust</h4><p className="text-sm text-slate-500 dark:text-offwhite/50 font-light mt-1">24-hour dispute resolution and clear IP transfer contracts.</p></div>
                  </div>
                </div>
              </div>

              <Link href="/search" className="group/btn w-full md:w-auto px-10 py-5 bg-teal text-offwhite font-bold rounded-2xl shadow-2xl shadow-teal/25 hover:shadow-teal-light/30 hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-3 relative overflow-hidden border border-teal-light/20">
                <span className="relative z-10">Hire Talent Now</span>
                <Icon name="trend" size={20} className="relative z-10" />
                <div className="absolute inset-0 bg-teal-light opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SOCIAL PROOF (RECENT ACTIVITY TICKER)
            ════════════════════════════════════════════ */}
        <section className="py-4 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
          <div className="flex ticker whitespace-nowrap">
            {[
              { text: "Ali R. just hired a Web Developer from FAST-NU", time: "2 min ago" },
              { text: "Fatima S. completed a 5-star gig (Logo Design)", time: "15 min ago" },
              { text: "TechLogix posted 4 new React.js roles", time: "1 hr ago" },
              { text: "Usman A. earned Level 2 Seller status!", time: "2 hrs ago" },
              { text: "Ayesha K. successfully disputed an order refund", time: "3 hrs ago" },
              { text: "Zainab B. joined as a Founding Member", time: "5 hrs ago" }
            ].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-8 border-r border-white/10 last:border-0">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-sm text-offwhite/80 font-medium">{item.text}</span>
                <span className="text-xs text-orange/80 bg-orange/10 px-2 py-0.5 rounded-full">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            TRUSTED BY STRIP
            ════════════════════════════════════════════ */}
        <section className="py-8 bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-xs font-bold text-slate-400 dark:text-offwhite/40 uppercase tracking-[0.2em] mb-6">Trusted by top talent & businesses from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display">LUMS</span>
              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display">NUST</span>
              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display tracking-widest">FAST-NU</span>
              <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display">IBA</span>
              <span className="hidden md:inline-block text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display">GIKI</span>
              <span className="hidden lg:inline-block text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display tracking-widest">TECHLOGIX</span>
              <span className="hidden lg:inline-block text-xl md:text-2xl font-black text-slate-800 dark:text-offwhite font-display">SYSTEMS LTD</span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS TICKER — OFF-WHITE BAR (light section)
            ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-5" style={{ background: '#EFEEEA' }}>
          <div className="flex ticker whitespace-nowrap">
            {[...STATS, ...STATS].map((s, i) => (
              <div key={i} className="inline-flex items-center gap-3 px-10">
                <span className="text-2xl font-black text-black">{s.val}</span>
                <span className="text-xs text-teal uppercase tracking-wider font-medium">{s.label}</span>
                <span className="text-orange/40 mx-4">◆</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CURATED TALENT — TEAL DOMINANT SECTION
            ════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden bg-slate-50 dark:bg-linear-to-b dark:from-[#0d1a22] dark:via-[#152a36] dark:to-[#0d1a22]">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-orange/5 rounded-full blur-[120px] pointer-events-none" data-float="" data-sp="-0.02" data-rt="0" />
          <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-teal-light/8 rounded-full blur-[120px] pointer-events-none" data-float="" data-sp="0.03" data-rt="0" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <div data-scroll="fade-up">
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/15 border border-orange/25 text-orange text-xs font-bold uppercase tracking-widest">Expertise Areas</div>
                <h2 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-offwhite mb-4 leading-tight">Curated Local<br /><span className="bg-linear-to-r from-orange to-orange-light bg-clip-text text-transparent">Talent</span></h2>
                <p className="text-slate-600 dark:text-offwhite/50 max-w-lg font-light text-lg">The specialized expertise your business needs, powered by Pakistan&apos;s top university talent.</p>
              </div>
              <Link href="/search" className="text-sm font-bold text-orange flex items-center gap-2 group/link border border-orange/25 px-5 py-2.5 rounded-full hover:bg-orange/10 transition-all" data-scroll="fade-left" data-delay="200">
                Browse All <Icon name="fwd" size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 lg:gap-5 perspective-1500 max-w-[1400px] mx-auto">
              {TALENTS.map((t, i) => (
                <div key={i} className="group cursor-pointer tilt-card flex flex-col items-center text-center" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-up" data-delay={`${i * 50}`}>
                  <div className={`w-full aspect-square max-h-[140px] lg:max-h-[160px] rounded-2xl md:rounded-4xl mb-4 relative overflow-hidden bg-linear-to-b ${t.bg} border border-offwhite/5 flex flex-col items-center justify-center transition-all duration-500 group-hover:-translate-y-2 ${t.hoverBg} ${t.border}`}>

                    {/* Minimal Contextual Element Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] font-black opacity-0 group-hover:opacity-[0.03] transition-all duration-700 select-none scale-50 group-hover:scale-100 italic text-slate-900 dark:text-white" style={{ WebkitTextStroke: '1px currentColor' }}>
                      {t.element}
                    </div>

                    {/* Subtle Glow */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-black/10 dark:from-white/20 via-transparent to-transparent`} />

                    {/* Main Icon */}
                    <Icon name={t.icon} size={36} className={`mb-2 lg:w-10 lg:h-10 text-slate-400 dark:text-offwhite/40 group-hover:${t.color} group-hover:scale-110 transition-all duration-500 relative z-10 drop-shadow-sm`} />

                  </div>
                  <h3 className="text-[13px] md:text-sm font-bold text-slate-900 dark:text-offwhite mb-0.5 md:mb-1 dark:group-hover:text-white transition-colors leading-tight">{t.title}</h3>
                  <p className="text-slate-600 dark:text-offwhite/40 text-[11px] md:text-[12px] font-light leading-snug">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS — STEP-BY-STEP (ScrollReveal)
            ════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-accent/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <ScrollReveal yOffset={30}>
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-offwhite/80 text-xs font-bold uppercase tracking-widest">
                  Process
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1} yOffset={30}>
                <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-offwhite mb-6">
                  How <span className="text-transparent bg-clip-text bg-linear-to-r from-orange to-teal">Gigligo</span> Works
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2} yOffset={30}>
                <p className="text-lg text-slate-600 dark:text-offwhite/50 max-w-2xl mx-auto font-light leading-relaxed">
                  A seamless bridge between bold ideas and top-tier execution. Escrow protection and instant matching, all handled automatically.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-0.5 bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent z-0" />

              <ScrollReveal delay={0.1} yOffset={50} blur className="relative z-10 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center mb-6 ring-8 ring-slate-50 dark:ring-[#0a0a0a] group hover:-translate-y-2 transition-transform duration-300">
                  <Icon name="search" size={40} className="text-orange group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-offwhite mb-3">1. Find or Post</h3>
                <p className="text-slate-600 dark:text-offwhite/50 text-sm font-light leading-relaxed max-w-[250px]">
                  Browse highly-vetted talent profiles or post a gig to get competitive proposals instantly.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.25} yOffset={50} blur className="relative z-10 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center mb-6 ring-8 ring-slate-50 dark:ring-[#0a0a0a] group hover:-translate-y-2 transition-transform duration-300">
                  <Icon name="shield" size={40} className="text-teal group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-offwhite mb-3">2. Escrow Secured</h3>
                <p className="text-slate-600 dark:text-offwhite/50 text-sm font-light leading-relaxed max-w-[250px]">
                  Payments are held securely in escrow. Work begins with complete peace of mind for both parties.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.4} yOffset={50} blur className="relative z-10 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center mb-6 ring-8 ring-slate-50 dark:ring-[#0a0a0a] group hover:-translate-y-2 transition-transform duration-300">
                  <Icon name="checkCircle" size={40} className="text-orange-light group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-offwhite mb-3">3. Approve & Excel</h3>
                <p className="text-slate-600 dark:text-offwhite/50 text-sm font-light leading-relaxed max-w-[250px]">
                  Review the delivered work. Approve to release funds instantly and build a long-term partnership.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            OUR MISSION — BLACK + ORANGE accents
            ════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden bg-white dark:bg-black">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/4 rounded-full blur-[150px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal/5 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/20 border border-teal-light/20 text-teal-light text-xs font-bold uppercase tracking-widest" data-scroll="fade-up">Our Mission</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-offwhite mb-6 leading-tight" data-scroll="fade-up" data-delay="100">Building Pakistan&apos;s<br /><span className="bg-linear-to-r from-orange via-orange-light to-orange bg-clip-text text-transparent">Talent Economy</span></h2>
            <p className="text-xl text-slate-600 dark:text-offwhite/50 font-light mb-20 max-w-3xl mx-auto leading-relaxed" data-scroll="fade-up" data-delay="200">Pakistan is home to more than <span className="text-orange font-semibold">30 million</span> university students and an ever-growing small-business sector. Gigligo bridges the gap between untapped talent and businesses that need reliable, cost-effective help.</p>

            <div className="grid md:grid-cols-3 gap-8 mb-20 perspective-1000">
              {[
                { num: '01', title: '100K Users', desc: 'Connect 100,000 active users (50/50 Students & Businesses) in year one.', icon: 'users', accent: 'orange' },
                { num: '02', title: 'PKR 30M+', desc: 'Achieve PKR 30M+ in transactions with less than 2% disputes.', icon: 'chart', accent: 'teal-light' },
                { num: '03', title: 'PKR 2M Grants', desc: 'Launch PKR 2M scholarship fund in up-skilling courses for top performers.', icon: 'school', accent: 'orange' },
              ].map((item, i) => (
                <div key={i} className="tilt-card bg-teal/15 rounded-3xl p-8 border border-teal-light/15 text-left hover:border-orange/20 transition-all group" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-up" data-delay={`${i * 150}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-${item.accent}/15 flex items-center justify-center`}>
                      <Icon name={item.icon} size={22} className={`text-${item.accent}`} />
                    </div>
                    <span className="text-xs font-black text-offwhite/25">{item.num}</span>
                  </div>
                  <h4 className="text-xl text-slate-900 dark:text-offwhite font-bold mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-offwhite/40 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card-orange text-left" data-scroll="fade-right" data-delay="200">
                <div className="w-12 h-12 rounded-2xl bg-orange/15 flex items-center justify-center mb-5"><Icon name="globe" size={22} className="text-orange" /></div>
                <h4 className="text-lg text-slate-900 dark:text-offwhite font-bold mb-3">Community-Driven</h4>
                <p className="text-sm text-slate-600 dark:text-offwhite/45 font-light leading-relaxed">Campus ambassadors, hackathon sponsorships, and a peer-review forum. Building a collective of excellence, one campus at a time.</p>
              </div>
              <div className="glass-card-teal text-left" data-scroll="fade-left" data-delay="200">
                <div className="w-12 h-12 rounded-2xl bg-teal/25 flex items-center justify-center mb-5"><Icon name="layers" size={22} className="text-teal-light" /></div>
                <h4 className="text-lg text-slate-900 dark:text-offwhite font-bold mb-3">Scalable Solutions</h4>
                <p className="text-sm text-slate-600 dark:text-offwhite/45 font-light leading-relaxed">From a one-off logo design to a full-time remote development team, scale your talent without ever leaving the platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            DUAL CTA — OFF-WHITE / LIGHT SECTION
            ════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden bg-slate-50 dark:bg-[#EFEEEA]">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-orange/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-teal/6 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 perspective-1000">
              {/* Student CTA — orange */}
              <div className="tilt-card p-10 rounded-3xl bg-white border border-orange/15 group hover:border-orange/30 transition-all shadow-lg shadow-black/5" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-right">
                <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center mb-6"><Icon name="school" size={28} className="text-orange" /></div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-offwhite">Are you a Student?</h3>
                <p className="text-slate-600 dark:text-teal/80 mb-8 font-light leading-relaxed">Sign up with your .edu email. Every project adds a real-world credential to your résumé while you earn top-tier local rates.</p>
                <Link href="/register?role=SELLER" className="px-8 py-4 bg-orange text-white rounded-xl font-bold inline-flex items-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange/25 transition-all">
                  Join the Campus Elite <Icon name="fwd" size={16} />
                </Link>
              </div>
              {/* Business CTA — teal */}
              <div className="tilt-card p-10 rounded-3xl bg-teal border border-teal-light/20 group hover:border-teal-light/40 transition-all shadow-lg shadow-black/10" onMouseMove={handleTilt} onMouseLeave={resetTilt} data-scroll="fade-left">
                <div className="w-14 h-14 rounded-2xl bg-teal-light/20 flex items-center justify-center mb-6"><Icon name="premium" size={28} className="text-offwhite" /></div>
                <h3 className="text-2xl font-bold mb-4 text-white dark:text-offwhite">Running a Business?</h3>
                <p className="text-white/80 dark:text-offwhite/60 mb-8 font-light leading-relaxed">Post your first job with a <strong className="text-white hover:text-orange transition-colors">10% launch discount</strong>. High-quality work without breaking the bank.</p>
                <Link href="/search" className="px-8 py-4 bg-white dark:bg-offwhite text-teal-dark rounded-xl font-bold inline-flex items-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 transition-all">
                  Claim 10% Discount <Icon name="trend" size={16} />
                </Link>
              </div>
            </div>
            <div className="mt-20 text-center" data-scroll="fade" data-delay="300">
              <p className="text-teal/60 font-light italic text-lg">&ldquo;Building a new economy of trust, talent, and opportunity — one gig at a time.&rdquo;</p>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER — BLACK ═══ */}
        <footer className="py-16 text-slate-500 dark:text-offwhite/50 border-t border-slate-200 dark:border-offwhite/8 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <Link href="/" className="flex items-center gap-3"><GLogo size={30} /><h2 className="font-display text-xl font-black tracking-tighter text-slate-900 dark:text-offwhite">gigligo<span className="text-orange/60">.com</span></h2></Link>
              <div className="flex gap-8 text-sm">
                <Link href="/about" className="hover:text-orange transition-colors">About</Link>
                <Link href="/register?role=SELLER" className="hover:text-orange transition-colors">For Students</Link>
                <Link href="/search" className="hover:text-orange transition-colors">For Businesses</Link>
                <a href="#" className="hover:text-orange transition-colors">Privacy</a>
              </div>
              <p className="text-xs text-slate-400 dark:text-offwhite/30">&copy; {new Date().getFullYear()} Gigligo. Built for Pakistan.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

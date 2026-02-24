'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, MoreHorizontal } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function GLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
            <defs><linearGradient id="gLG" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#FE7743" /><stop offset="1" stopColor="#273F4F" /></linearGradient></defs>
            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#gLG)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M19 18 H30" stroke="url(#gLG)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="19" cy="18" r="2" fill="#FE7743"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" /></circle>
        </svg>
    );
}

export function Navbar() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header id="site-header" className="fixed top-0 z-50 w-full px-6 py-4 flex justify-between items-center transition-all duration-300">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="logo-glow"><GLogo size={36} /></div>
                    <h2 className="font-display text-2xl font-black tracking-tighter text-slate-900 dark:text-offwhite">gigligo<span className="text-orange/70">.com</span></h2>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/search" className="text-sm font-medium text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors">Find Talent</Link>
                    <Link href="/jobs" className="text-sm font-medium text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors">Browse Jobs</Link>
                    <Link href={session ? '/dashboard' : '/register?role=SELLER'} className="text-sm font-medium text-slate-600 dark:text-offwhite/60 hover:text-orange transition-colors">Post a Gig</Link>

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
                                <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-semibold text-red-600 dark:text-red-400 text-left w-full transition-colors">Logout</button>
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
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
                    <div className="fixed top-0 right-0 w-[85%] max-w-sm h-dvh bg-white/95 dark:bg-[#111]/95 backdrop-blur-2xl z-50 md:hidden shadow-2xl flex flex-col p-8 pt-20 border-l border-slate-200 dark:border-white/10">
                        <div className="flex-1 overflow-y-auto">
                            <Link href="/search" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>Find Talent</Link>
                            <Link href="/jobs" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
                            <Link href={session ? '/dashboard' : '/register?role=SELLER'} className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>Post a Gig</Link>
                            <Link href="/pricing" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>Pricing</Link>
                            <Link href="/referral" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>Refer & Earn</Link>
                            <Link href="/faq" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>FAQ</Link>

                            {session ? (
                                <>
                                    {(session as any)?.role === 'ADMIN' && (
                                        <Link href="/admin" className="block text-base font-medium text-orange py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange/80 transition-colors" onClick={() => setMenuOpen(false)}>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link href="/dashboard" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <Link href="/dashboard/profile" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    <Link href="/dashboard/settings" className="block text-base font-medium text-slate-700 dark:text-offwhite/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-orange transition-colors" onClick={() => setMenuOpen(false)}>
                                        Settings
                                    </Link>
                                    <button onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }} className="block w-full text-base font-medium text-red-500 dark:text-red-400 py-2.5 border-b border-slate-200 dark:border-white/10 text-left hover:text-red-600 transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : null}
                        </div>

                        {!session && (
                            <div className="mt-auto pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4">
                                <Link href="/login" className="w-full py-3 text-center text-lg font-bold text-slate-700 dark:text-offwhite bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-full py-3 bg-linear-to-r from-orange to-orange-light text-white text-center text-lg font-bold rounded-xl shadow-lg shadow-orange/20 hover:shadow-orange/40 transition-shadow"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export function ScrollObserver() {
    const rafRef = useRef(0);
    const lastY = useRef(0);

    const handleScroll = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const y = window.scrollY;
            if (Math.abs(y - lastY.current) < 0.5) return;
            lastY.current = y;

            const progressEl = document.querySelector('.scroll-progress') as HTMLElement;
            if (progressEl) {
                const h = document.documentElement.scrollHeight - window.innerHeight;
                progressEl.style.width = h > 0 ? `${(y / h) * 100}%` : '0%';
            }

            const headerEl = document.getElementById('site-header');
            headerEl?.classList.toggle('header-solid', y > 60);

            const heroEl = document.getElementById('hero-section');
            if (heroEl) {
                const factor = Math.min(y / 800, 1);
                heroEl.style.transform = `scale(${1 - factor * 0.05}) translateZ(0)`;
                heroEl.style.opacity = `${1 - factor * 0.3}`;
            }

            const floatEls = document.querySelectorAll<HTMLElement>('[data-float]');
            floatEls.forEach((el) => {
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

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            obs.disconnect();
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [handleScroll]);

    return <div className="scroll-progress" />;
}

export function TiltCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

    return (
        <div
            className={`tilt-card ${className}`}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            data-scroll="fade-up"
            data-delay={delay}
        >
            {children}
        </div>
    );
}

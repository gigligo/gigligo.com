'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ui/ThemeToggle';
import { MoreHorizontal, Coins } from 'lucide-react';
import { creditApi } from '@/lib/api';

/* ─── Gradient G Logo (shared across site) ─── */
function GigligoMark({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00f5d4" />
                    <stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#navGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M19 18 H30" stroke="url(#navGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="19" cy="18" r="2" fill="#00f5d4" />
        </svg>
    );
}

/* ─── Inline SVG Icons ─── */
function MenuIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}
function CloseIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export function Navbar() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE'].includes(role);
    const isEmployer = ['BUYER', 'EMPLOYER'].includes(role);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 60);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (token && isFreelancer) {
            creditApi.getBalance(token).then(res => setCredits(res.credits)).catch(() => { });
        }
    }, [token, isFreelancer]);

    const mainLinks = [
        { label: 'Find Talent', href: '/search' },
        { label: 'Browse Jobs', href: '/jobs' },
        ...(session && isEmployer ? [{ label: 'Post a Job', href: '/jobs/post' }] : []),
        ...(session && isFreelancer ? [{ label: 'My Gigs', href: '/dashboard' }] : []),
        ...(!session ? [{ label: 'Post a Gig', href: '/register?role=SELLER' }] : []),
    ];

    const moreLinks = [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Refer & Earn', href: '/referral' },
        { label: 'FAQ', href: '/faq' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-400 ${scrolled
                    ? 'bg-white dark:bg-[#0a0a0a]/90 border-b border-black/5 dark:border-white/5 backdrop-blur-xl shadow-md'
                    : 'bg-transparent'
                    }`}
                style={{ height: 68 }}
            >
                <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="logo-glow transition-transform group-hover:scale-105">
                                <GigligoMark size={32} />
                            </div>
                            <span className="font-display text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                                gigligo<span className="text-teal-vibrant opacity-80 dark:opacity-60">.com</span>
                            </span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8">
                            {mainLinks.map(link => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 dark:text-[#EFEEEA]/60 hover:text-slate-900 dark:hover:text-[#EFEEEA] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="relative group p-2">
                                <button className="text-slate-600 dark:text-[#EFEEEA]/60 hover:text-slate-900 dark:hover:text-[#EFEEEA] transition-colors flex items-center">
                                    <MoreHorizontal size={20} />
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                                    {moreLinks.map(link => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-[#EFEEEA]/80 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {session ? (
                            <>
                                {isFreelancer && credits !== null && (
                                    <Link href="/dashboard/credits" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
                                        <Coins size={16} />
                                        {credits}
                                    </Link>
                                )}
                                <NotificationBell />
                                <div className="relative group ml-1">
                                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#FE7743] to-[#FE7743]/50 flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer hover:scale-105 transition-transform">
                                        {session.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-2">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{session.user?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-white/50 truncate">{session.user?.email}</p>
                                        </div>
                                        {(session as any)?.role === 'ADMIN' && (
                                            <Link href="/admin" className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-bold text-[#FE7743] transition-colors">Admin Dashboard</Link>
                                        )}
                                        <Link href="/dashboard" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-[#EFEEEA]/80 transition-colors">Dashboard</Link>
                                        <Link href="/dashboard/inbox" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-[#EFEEEA]/80 transition-colors">Inbox</Link>
                                        <Link href="/dashboard/profile" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-[#EFEEEA]/80 transition-colors">Profile</Link>
                                        <Link href="/dashboard/settings" className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium text-slate-700 dark:text-[#EFEEEA]/80 transition-colors">Settings</Link>
                                        <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                                        <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-semibold text-red-600 dark:text-red-400 text-left w-full transition-colors">Logout</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 bg-[#FE7743] text-white text-sm font-bold rounded-lg hover:bg-[#FE7743]/90 transition-all shadow-md shadow-[#FE7743]/20"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3 md:hidden">
                        <ThemeToggle />
                        <button
                            className="p-2 text-slate-900 dark:text-white"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </header>


            {menuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
                    <div className="fixed top-0 right-0 w-[85%] max-w-sm h-dvh bg-white/95 dark:bg-[#111]/95 backdrop-blur-2xl z-50 md:hidden shadow-2xl flex flex-col p-8 pt-20 border-l border-slate-200 dark:border-white/10">
                        <div className="flex-1 overflow-y-auto">
                            {[...mainLinks, ...moreLinks].map(link => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="block text-base font-medium text-slate-700 dark:text-[#EFEEEA]/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-[#FE7743] transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {session ? (
                                <>
                                    {(session as any)?.role === 'ADMIN' && (
                                        <Link href="/admin" className="block text-base font-medium text-[#FE7743] py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-[#FE7743]/80 transition-colors" onClick={() => setMenuOpen(false)}>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link href="/dashboard" className="block text-base font-medium text-slate-700 dark:text-[#EFEEEA]/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-[#FE7743] transition-colors" onClick={() => setMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <Link href="/dashboard/profile" className="block text-base font-medium text-slate-700 dark:text-[#EFEEEA]/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-[#FE7743] transition-colors" onClick={() => setMenuOpen(false)}>
                                        Profile Layout
                                    </Link>
                                    <Link href="/dashboard/settings" className="block text-base font-medium text-slate-700 dark:text-[#EFEEEA]/80 py-2.5 border-b border-slate-200 dark:border-white/10 hover:text-[#FE7743] transition-colors" onClick={() => setMenuOpen(false)}>
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
                                <Link href="/login" className="w-full py-3 text-center text-lg font-bold text-slate-700 dark:text-[#EFEEEA] bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-full py-3 bg-linear-to-r from-[#FE7743] to-[#f9a886] text-white text-center text-lg font-bold rounded-xl shadow-lg shadow-[#FE7743]/20 hover:shadow-[#FE7743]/40 transition-shadow"
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

'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';
import { Coins, Menu, X } from 'lucide-react';
import { creditApi, userStateApi } from '@/lib/api';
import { Logo } from '@/components/Logo';

export function Navbar() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('gigligo_dark_mode');
        if (stored === 'true') {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newVal = !darkMode;
        setDarkMode(newVal);
        document.documentElement.classList.toggle('dark', newVal);
        localStorage.setItem('gigligo_dark_mode', String(newVal));
    };

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE'].includes(role);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 10);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const [userState, setUserState] = useState<any>(null);

    useEffect(() => {
        if (token) {
            userStateApi.getState(token).then(res => setUserState(res)).catch(() => { });
        }
    }, [token]);

    useEffect(() => {
        if (token && isFreelancer) {
            creditApi.getBalance(token).then(res => setCredits(res.credits)).catch(() => { });
        }
    }, [token, isFreelancer]);

    const moreLinks = [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Refer & Earn', href: '/referral' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                    ? 'bg-white dark:bg-background-dark border-border-light dark:border-slate-800 py-3 shadow-sm'
                    : 'bg-white dark:bg-background-dark border-border-light dark:border-slate-800 py-3'
                    }`}
                style={{ height: 72 }}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center">
                            <Logo className="h-28 w-auto dark:hidden" variant="dark" />
                            <Logo className="h-28 w-auto hidden dark:block" variant="white" />
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/search" className="text-text-muted dark:text-text-muted/60 text-sm font-semibold hover:text-primary transition-colors">Explore</Link>
                            <Link href="/register?role=SELLER" className="text-text-muted dark:text-text-muted/60 text-sm font-semibold hover:text-primary transition-colors">Become a Seller</Link>
                            <Link href="/jobs" className="text-text-muted dark:text-text-muted/60 text-sm font-semibold hover:text-primary transition-colors">Browse Jobs</Link>
                            <div className="relative group">
                                <button
                                    className="text-text-muted dark:text-text-muted/60 text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
                                    onMouseEnter={() => setMoreOpen(true)}
                                    onMouseLeave={() => setMoreOpen(false)}
                                >
                                    More <span className="material-symbols-outlined text-xs">expand_more</span>
                                </button>
                                <div
                                    className={`absolute top-full left-0 mt-2 w-48 bg-white dark:bg-background-dark border border-border-light dark:border-white/10 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2 z-50 transition-all ${moreOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                    onMouseEnter={() => setMoreOpen(true)}
                                    onMouseLeave={() => setMoreOpen(false)}
                                >
                                    {moreLinks.map(link => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="block px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-sm font-medium text-text-main dark:text-white/80 hover:text-primary transition-colors mx-2 rounded-xl"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4 md:gap-6">
                        {session ? (
                            <>
                                {isFreelancer && credits !== null && (
                                    <Link href="/dashboard/credits" className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                                        <Coins size={14} />
                                        {credits}
                                    </Link>
                                )}
                                <NotificationBell />
                                <button onClick={toggleDarkMode} className="w-9 h-9 rounded-full border border-border-light dark:border-white/10 flex items-center justify-center text-text-muted dark:text-white/80 hover:text-primary hover:border-primary/30 transition-colors" aria-label="Toggle dark mode">
                                    <span className="material-symbols-outlined text-[18px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                                </button>
                                <div className="relative group ml-1">
                                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform shadow-md">
                                        {session.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-background-dark border border-border-light dark:border-white/10 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                        <div className="px-5 py-3 border-b border-border-light/50 dark:border-white/10 mb-2">
                                            <p className="text-sm font-bold text-text-main dark:text-white truncate">{session.user?.name}</p>
                                            <p className="text-xs text-text-muted dark:text-white/60 truncate mt-0.5">{session.user?.email}</p>
                                        </div>
                                        <div className="px-2 flex flex-col gap-1">
                                            <Link href="/dashboard" className="block px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-sm font-medium text-text-main dark:text-white/80 transition-colors">Dashboard</Link>
                                            <Link href="/dashboard/inbox" className="block px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-sm font-medium text-text-main dark:text-white/80 transition-colors">Inbox</Link>
                                            <Link href="/dashboard/settings" className="block px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-sm font-medium text-text-main dark:text-white/80 transition-colors">Settings</Link>
                                            <div className="h-px bg-border-light/50 dark:bg-white/5 my-1 mx-2"></div>
                                            <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl text-sm font-semibold text-red-600 transition-colors">Logout</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-text-main dark:text-white/80 text-sm font-bold hover:text-primary transition-colors border border-border-light/50 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                                    Sign In
                                </Link>
                                <Link href="/register" className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-[1.25rem] h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:bg-primary-dark shadow-sm">
                                    Join
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex md:hidden">
                        <button className="p-2 text-text-main dark:text-slate-100" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div className="fixed inset-0 z-60 bg-white dark:bg-background-dark flex flex-col p-8 md:hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center">
                            <Logo className="h-16 w-auto dark:hidden" variant="dark" />
                            <Logo className="h-16 w-auto hidden dark:block" variant="white" />
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="text-text-main dark:text-white"><X size={28} /></button>
                    </div>
                    <nav className="flex flex-col gap-5 text-center">
                        {[
                            { label: 'Explore', href: '/search' },
                            { label: 'Browse Jobs', href: '/jobs' },
                            { label: 'Become a Seller', href: '/register?role=SELLER' },
                            { label: 'Pricing', href: '/pricing' },
                            { label: 'Blog', href: '/blog' },
                            { label: 'About', href: '/about' },
                            { label: 'Contact', href: '/contact' },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-[22px] font-bold text-text-main dark:text-white"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    {!session && (
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/login" className="text-center py-4 text-base font-bold text-text-main dark:text-white border border-border-light dark:border-white/10 rounded-[1.5rem]" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            <Link href="/register" className="text-center py-4 text-base font-bold bg-primary text-white rounded-[1.5rem]" onClick={() => setMenuOpen(false)}>Join Free</Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

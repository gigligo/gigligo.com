'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';
import { MoreHorizontal, Coins, Menu, X } from 'lucide-react';
import { creditApi, userStateApi } from '@/lib/api';
import { Logo } from '@/components/Logo';

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
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                    ? 'bg-[#1E1E1E] border-[#C9A227]/20 py-4 shadow-2xl'
                    : 'bg-transparent border-transparent py-6'
                    }`}
                style={{ height: scrolled ? 76 : 88 }}
            >
                <div className="max-container h-full flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <Logo className="h-8" iconClassName="text-[#C9A227]" withText={false} />
                            <span className="font-sans text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#C9A227]">
                                gigligo<span className="text-[#C9A227] opacity-80">.com</span>
                            </span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-10">
                            {['Browse Jobs', 'Find Gigs', 'How it Works'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Browse Jobs' ? '/jobs' : item === 'Find Gigs' ? '/search' : '#how-it-works'}
                                    className="text-sm font-semibold text-white/70 hover:text-[#C9A227] transition-colors py-2 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#C9A227] after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-150"
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="relative group p-2">
                                <button className="text-white/60 hover:text-[#C9A227] transition-colors flex items-center">
                                    <MoreHorizontal size={20} />
                                </button>
                                <div className="absolute top-full left-0 mt-4 w-48 bg-[#1E1E1E] border border-[#C9A227]/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-3 z-50">
                                    {moreLinks.map(link => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="px-5 py-2 hover:bg-[#C9A227]/10 text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {session ? (
                            <>
                                {isFreelancer && credits !== null && (
                                    <Link href="/dashboard/credits" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xs font-bold hover:bg-[#C9A227]/20 transition-colors">
                                        <Coins size={14} />
                                        {credits}
                                    </Link>
                                )}
                                <NotificationBell />
                                <div className="relative group ml-2">
                                    <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#1E1E1E] font-bold text-sm shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                        {session.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="absolute right-0 mt-4 w-64 bg-[#FFFFFF] border border-[#F7F7F6] rounded-xl shadow-2xl py-3 object-top invisible group-hover:visible transition-all">
                                        <div className="px-5 py-4 border-b border-[#F7F7F6] mb-2">
                                            <p className="text-sm font-bold text-[#1E1E1E] truncate">{session.user?.name}</p>
                                            <p className="text-xs font-medium text-[#3A3A3A] truncate mt-1">{session.user?.email}</p>
                                        </div>
                                        <Link href="/dashboard" className="block px-5 py-2.5 hover:bg-[#F7F7F6] text-sm font-medium text-[#1E1E1E] transition-colors">Dashboard</Link>
                                        <Link href="/dashboard/inbox" className="block px-5 py-2.5 hover:bg-[#F7F7F6] text-sm font-medium text-[#1E1E1E] transition-colors">Inbox</Link>
                                        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-5 py-2.5 hover:bg-[#C62828]/5 text-sm font-semibold text-[#C62828] transition-colors">Logout</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-sm font-semibold text-white/80 hover:text-[#C9A227] transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex md:hidden">
                        <button
                            className="p-2 text-white"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div className="fixed inset-0 z-60 bg-[#1E1E1E] flex flex-col p-8 md:hidden">
                    <div className="flex justify-between items-center mb-10">
                        <Logo className="h-8" iconClassName="text-[#C9A227]" withText={false} />
                        <button onClick={() => setMenuOpen(false)} className="text-white"><X size={28} /></button>
                    </div>
                    <nav className="flex flex-col gap-6">
                        {['Browse Jobs', 'Find Gigs', 'Pricing', 'Refer & Earn'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-xl font-bold text-white/90"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                    {!session && (
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/login" className="btn-secondary text-white! border-white! text-center py-4" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link href="/register" className="btn-primary text-center py-4" onClick={() => setMenuOpen(false)}>Join Free</Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

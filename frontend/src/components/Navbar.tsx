'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';
import { MoreHorizontal, Coins, Menu, X } from 'lucide-react';
import { creditApi, userStateApi } from '@/lib/api';

/* ─── Premium G Logo (Charcoal & Gold) ─── */
function GigligoMark({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="#DAA520" strokeWidth="3" strokeLinecap="round" />
            <path d="M19 18 H30" stroke="#DAA520" strokeWidth="3" strokeLinecap="round" />
            <circle cx="19" cy="18" r="2" fill="#DAA520" />
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
                    ? 'bg-[#212121] border-[#DAA520]/20 py-3 shadow-md'
                    : 'bg-transparent border-transparent py-5'
                    }`}
                style={{ height: 68 }}
            >
                <div className="max-container h-full flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <GigligoMark size={32} />
                            <span className="font-sans text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#DAA520]">
                                gigligo<span className="text-[#DAA520] opacity-80">.com</span>
                            </span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8">
                            {['Browse Jobs', 'Find Gigs', 'How it Works'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Browse Jobs' ? '/jobs' : item === 'Find Gigs' ? '/search' : '#how-it-works'}
                                    className="text-sm font-semibold text-white/70 hover:text-[#DAA520] transition-colors py-2"
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="relative group p-2">
                                <button className="text-white/60 hover:text-[#DAA520] transition-colors flex items-center">
                                    <MoreHorizontal size={20} />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-[#212121] border border-[#DAA520]/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                                    {moreLinks.map(link => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="px-4 py-2 hover:bg-[#DAA520]/10 text-sm font-medium text-white/80 hover:text-[#DAA520] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        {session ? (
                            <>
                                {isFreelancer && credits !== null && (
                                    <Link href="/dashboard/credits" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-xs font-bold hover:bg-[#DAA520]/20 transition-colors">
                                        <Coins size={14} />
                                        {credits}
                                    </Link>
                                )}
                                <NotificationBell />
                                <div className="relative group ml-1">
                                    <div className="w-9 h-9 rounded-full bg-[#DAA520] flex items-center justify-center text-[#212121] font-bold text-sm shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                        {session.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="absolute right-0 mt-3 w-56 bg-[#ffffff] border border-[#F5F5F5] rounded-lg shadow-xl py-2 invisible group-hover:visible transition-all">
                                        <div className="px-4 py-3 border-b border-[#F5F5F5] mb-2">
                                            <p className="text-sm font-bold text-[#212121] truncate">{session.user?.name}</p>
                                            <p className="text-[10px] font-medium text-[#424242] truncate">{session.user?.email}</p>
                                        </div>
                                        <Link href="/dashboard" className="block px-4 py-2 hover:bg-[#F5F5F5] text-sm font-medium text-[#212121]">Dashboard</Link>
                                        <Link href="/dashboard/inbox" className="block px-4 py-2 hover:bg-[#F5F5F5] text-sm font-medium text-[#212121]">Inbox</Link>
                                        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-2 hover:bg-[#C62828]/5 text-sm font-semibold text-[#C62828]">Logout</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-5 py-2 text-sm font-semibold text-white/80 hover:text-[#DAA520] transition-colors"
                                >
                                    Login
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
                <div className="fixed inset-0 z-60 bg-[#212121] flex flex-col p-8 md:hidden">
                    <div className="flex justify-between items-center mb-10">
                        <GigligoMark size={32} />
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

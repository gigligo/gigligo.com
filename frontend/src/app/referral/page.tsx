'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function ReferralPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;
        const token = (session as any)?.accessToken;

        // Generate code first, then get stats
        fetch(`${API}/api/referral/generate-code`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() =>
                fetch(`${API}/api/referral/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            )
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [session]);

    const copyLink = () => {
        if (stats?.referralLink) {
            navigator.clipboard.writeText(stats.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!session) {
        return (
            <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
                <Navbar />
                <main className="flex-1 w-full flex items-center justify-center p-6" style={{ paddingTop: 96 }}>
                    <div className="bg-surface-light border border-border-light rounded-3xl p-12 text-center max-w-lg w-full shadow-2xl animate-fade-in">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">group_add</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-main mb-4 tracking-tight">Referral Program</h1>
                        <p className="text-text-muted mb-8 font-medium leading-relaxed">Please authenticate to access your dedicated ambassador dashboard and share your unique referral links.</p>
                        <Link href="/login?callbackUrl=/referral" className="inline-flex w-full py-4 bg-primary text-white text-sm font-bold uppercase tracking-wide rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 items-center justify-center">
                            Secure Login
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Ultra-Premium Header Section */}
                <div className="relative pt-20 pb-32 overflow-hidden bg-nav-bg text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.05)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10 animate-fade-in">
                        <div className="inline-block px-5 py-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.2em] rounded-full mb-8 border border-primary/20 shadow-lg shadow-primary/5">
                            Ambassador Program
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Invite Network, <span className="text-primary italic font-serif">Earn Equity.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-normal leading-relaxed">
                            Share your unique link. Both you and your invited peer receive <strong className="text-primary font-bold">10 bonus credits</strong> instantly upon registration.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 -mt-16 pb-32 relative z-10">
                    {loading ? (
                        <div className="flex justify-center items-center py-20 bg-surface-light rounded-3xl border border-border-light shadow-2xl">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        </div>
                    ) : (
                        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                            {/* Referral Link Card */}
                            <div className="bg-surface-light border border-border-light rounded-3xl p-8 sm:p-10 mb-8 shadow-2xl backdrop-blur-xl">
                                <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-3 tracking-tight">
                                    <span className="material-symbols-outlined text-primary text-2xl">link</span>
                                    Your Exclusive Invitation Link
                                </h3>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="relative flex-1 w-full">
                                        <input
                                            readOnly
                                            value={stats?.referralLink || ''}
                                            className="w-full px-6 py-4 rounded-xl border border-border-light bg-background-light text-text-main text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-text-muted uppercase font-bold tracking-widest bg-surface-light px-2 py-1 rounded-md border border-border-light">
                                            Code: <span className="text-primary">{stats?.referralCode}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={copyLink}
                                        className={`w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{copied ? 'task_alt' : 'content_copy'}</span>
                                        {copied ? 'Copied' : 'Copy Link'}
                                    </button>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="bg-background-light border border-border-light rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/30 transition-colors group">
                                    <span className="material-symbols-outlined text-text-muted/30 text-4xl mb-4 group-hover:text-primary transition-colors">groups</span>
                                    <p className="text-5xl font-bold text-text-main tracking-tight mb-2">{stats?.totalReferrals || 0}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Network Invited</p>
                                </div>
                                <div className="bg-background-light border border-border-light rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/30 transition-colors group">
                                    <span className="material-symbols-outlined text-text-muted/30 text-4xl mb-4 group-hover:text-primary transition-colors">toll</span>
                                    <p className="text-5xl font-bold text-primary tracking-tight mb-2">{stats?.totalBonusCredits || 0}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Credits Earned</p>
                                </div>
                            </div>

                            {/* How it Works */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-text-main mb-8 tracking-tight text-center">Growth Architecture</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { icon: 'share', title: 'Distribute Link', desc: 'Send your unique cryptographic referral link to your high-value peers.' },
                                        { icon: 'person_add', title: 'Peer Registration', desc: 'Your colleague registers and completes the onboarding process.' },
                                        { icon: 'monetization_on', title: 'Mutual Equity', desc: 'Both accounts instantly receive 10 platform credits as a reward.' },
                                    ].map((s, idx) => (
                                        <div key={idx} className="bg-surface-light border border-border-light rounded-2xl p-8 text-center hover:border-primary/30 transition-colors">
                                            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 border border-primary/20">
                                                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                                            </div>
                                            <h4 className="font-bold text-text-main mb-3">{s.title}</h4>
                                            <p className="text-sm text-text-muted font-medium leading-relaxed">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Referral History */}
                            {stats?.referrals?.length > 0 && (
                                <div className="bg-surface-light border border-border-light rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-3 tracking-tight">
                                        <span className="material-symbols-outlined text-primary text-2xl">history</span>
                                        Onboarding Ledger
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.referrals.map((r: any) => (
                                            <div key={r.id} className="flex items-center justify-between p-4 bg-background-light border border-border-light rounded-xl hover:border-primary/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                                        {r.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-text-main text-sm">{r.name}</p>
                                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{new Date(r.joinedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                    +{r.bonusGiven} Credits
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

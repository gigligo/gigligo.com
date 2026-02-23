'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

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
            <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Referral Program</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Log in to access your referral dashboard.</p>
                    <a href="/login" className="px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl hover:bg-[#FE7743]/90 transition">Log In</a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Invite Friends, <span className="text-[#FE7743]">Earn Credits</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Share your unique link. Both you and your friend get <strong className="text-[#FE7743]">10 bonus credits</strong> when they sign up.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FE7743] mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {/* Referral Link Card */}
                        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 mb-8">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Referral Link</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    readOnly
                                    value={stats?.referralLink || ''}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                                />
                                <button
                                    onClick={copyLink}
                                    className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${copied ? 'bg-green-500' : 'bg-[#FE7743] hover:bg-[#FE7743]/90'}`}
                                >
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                                Code: <span className="font-mono font-bold text-[#FE7743]">{stats?.referralCode}</span>
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 text-center">
                                <p className="text-3xl font-bold text-[#FE7743]">{stats?.totalReferrals || 0}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Friends Invited</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 text-center">
                                <p className="text-3xl font-bold text-teal-500">{stats?.totalBonusCredits || 0}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Credits Earned</p>
                            </div>
                        </div>

                        {/* Referral History */}
                        {stats?.referrals?.length > 0 && (
                            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Referral History</h3>
                                <div className="space-y-3">
                                    {stats.referrals.map((r: any) => (
                                        <div key={r.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
                                                <p className="text-xs text-slate-500">{new Date(r.joinedAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-green-500">+{r.bonusGiven} credits</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* How it Works */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { step: '1', title: 'Share Your Link', desc: 'Send your unique referral link to friends.' },
                                { step: '2', title: 'They Join Gigligo', desc: 'Your friend signs up using your link.' },
                                { step: '3', title: 'Both Get Credits', desc: 'You both receive 10 bonus credits instantly!' },
                            ].map(s => (
                                <div key={s.step} className="text-center p-6">
                                    <div className="w-12 h-12 rounded-full bg-[#FE7743]/10 text-[#FE7743] font-bold text-xl flex items-center justify-center mx-auto mb-3">
                                        {s.step}
                                    </div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{s.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

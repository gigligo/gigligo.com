'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { adminApi, disputeApi } from '@/lib/api';

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any>(null);
    const [founders, setFounders] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'kyc' | 'transactions' | 'disputes'>('overview');

    // Credit Modal State
    const [selectedUserForCredits, setSelectedUserForCredits] = useState<any>(null);
    const [creditAmount, setCreditAmount] = useState<string>('');
    const [addingCredit, setAddingCredit] = useState(false);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;

    const handleAddCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserForCredits || !creditAmount || !token) return;

        try {
            setAddingCredit(true);
            await adminApi.addCredits(token, selectedUserForCredits.id, parseInt(creditAmount, 10));
            setSelectedUserForCredits(null);
            setCreditAmount('');
            alert('Credits added successfully!');
            // Quick refresh
            const a = await adminApi.getActivity(token);
            setActivity(a);
        } catch (err: any) {
            alert(err.message || 'Failed to add credits');
        } finally {
            setAddingCredit(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        if (role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        const load = async () => {
            try {
                const [s, a, f] = await Promise.all([
                    adminApi.getStats(token),
                    adminApi.getActivity(token),
                    adminApi.getFounders(token),
                ]);
                setStats(s);
                setActivity(a);
                setFounders(f);
            } catch (e: any) {
                setError(e.message || 'Failed to load admin data');
            }
            setLoading(false);
        };
        load();
    }, [status, token, role, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col gap-4">
                <p className="text-red-400 font-bold">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Retry</button>
            </div>
        );
    }

    const freelancerSlots = founders?.freelancers;
    const clientSlots = founders?.clients;

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-[#EFEEEA]">Admin <span className="text-[#FE7743]">Dashboard</span></h1>
                        <p className="text-[#EFEEEA]/50 text-sm mt-1">Platform overview, metrics, and management</p>
                    </div>
                    <div className="flex gap-2">
                        {(['overview', 'users', 'kyc', 'transactions', 'disputes'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${activeTab === tab
                                    ? 'bg-[#FE7743] text-white'
                                    : 'bg-white/5 text-[#EFEEEA]/60 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {tab === 'kyc' ? 'KYC Verification' : tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'kyc' && (
                    <div className="bg-[#111] rounded-2xl border border-white/10 p-2 sm:p-8">
                        <div className="mb-6 px-4 sm:px-0">
                            <h2 className="text-xl font-bold text-white mb-1">KYC Verification Inbox</h2>
                            <p className="text-sm text-[#EFEEEA]/50">Review submitted identity documents for freelancer accounts.</p>
                        </div>

                        <KycInboxTab token={token} />
                    </div>
                )}

                {activeTab === 'disputes' && (
                    <div className="bg-[#111] rounded-2xl border border-white/10 p-2 sm:p-8">
                        <div className="mb-6 px-4 sm:px-0">
                            <h2 className="text-xl font-bold text-white mb-1">Dispute Resolution Center</h2>
                            <p className="text-sm text-[#EFEEEA]/50">Review and actively resolve pending order escrow disputes.</p>
                        </div>

                        <DisputesTab token={token} />
                    </div>
                )}

                {activeTab === 'overview' && (
                    <>
                        {/* Primary KPIs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <KpiCard label="Total Users" value={stats?.totalUsers || 0} icon="👥" />
                            <KpiCard label="Platform Revenue" value={`PKR ${(stats?.platformRevenue || 0).toLocaleString()}`} icon="💰" accent="#22c55e" />
                            <KpiCard label="Total Orders" value={stats?.totalOrders || 0} icon="📦" accent="#3b82f6" />
                            <KpiCard label="GMV" value={`PKR ${(stats?.gmv || 0).toLocaleString()}`} icon="📊" accent="#a855f7" />
                        </div>

                        {/* Secondary Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                            <MiniStat label="Freelancers" value={stats?.totalSellers || 0} />
                            <MiniStat label="Clients" value={stats?.totalEmployers || 0} />
                            <MiniStat label="Active Jobs" value={stats?.activeJobs || 0} />
                            <MiniStat label="Total Gigs" value={stats?.totalGigs || 0} />
                            <MiniStat label="Active Boosts" value={stats?.activeBoosts || 0} color="#FE7743" />
                        </div>

                        {/* Escrow */}
                        <div className="bg-[#111] rounded-2xl border border-white/10 p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-[#EFEEEA]/50 uppercase tracking-wider mb-1">Escrow Held</h3>
                                <p className="text-3xl font-black text-amber-400">PKR {(stats?.escrowHeld || 0).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[#EFEEEA]/40">Total tracked transactions</p>
                                <p className="text-lg font-bold text-[#EFEEEA]">{(stats?.totalTransactions || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Founding Member Tracker */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-[#EFEEEA] mb-4">Founding Member Program</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FounderCard
                                    title="Freelancers / Students"
                                    awarded={freelancerSlots?.totalAwarded || 0}
                                    remaining={freelancerSlots?.remainingSlots || 500}
                                    max={500}
                                    color="#FE7743"
                                />
                                <FounderCard
                                    title="Clients / Employers"
                                    awarded={clientSlots?.totalAwarded || 0}
                                    remaining={clientSlots?.remainingSlots || 500}
                                    max={500}
                                    color="#3b82f6"
                                />
                            </div>
                        </div>

                        {/* Recent Jobs */}
                        <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-[#EFEEEA]">Recent Jobs</h2>
                            </div>
                            <div className="divide-y divide-white/5">
                                {activity?.recentJobs?.length > 0 ? activity.recentJobs.map((j: any) => (
                                    <div key={j.id} className="p-5 flex items-center justify-between hover:bg-white/2 transition">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="font-semibold text-[#EFEEEA] text-sm truncate">{j.title}</p>
                                            <p className="text-xs text-[#EFEEEA]/50 mt-1">by {j.employer?.profile?.fullName || 'Employer'} • PKR {j.budgetMin?.toLocaleString()}–{j.budgetMax?.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <StatusBadge status={j.status} />
                                            <p className="text-[10px] text-[#EFEEEA]/30 mt-1">{new Date(j.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="p-6 text-sm text-[#EFEEEA]/40 text-center">No jobs yet</p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'users' && (
                    <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-bold text-[#EFEEEA]">Recent Users</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {activity?.recentUsers?.length > 0 ? activity.recentUsers.map((u: any) => (
                                <div key={u.id} className="p-5 flex items-center justify-between hover:bg-white/2 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#FE7743] to-[#FE7743]/50 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            {u.profile?.fullName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#EFEEEA] text-sm">{u.profile?.fullName || 'User'}</p>
                                            <p className="text-xs text-[#EFEEEA]/50">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedUserForCredits(u)}
                                            className="px-3 py-1 text-xs font-bold bg-[#FE7743]/10 text-[#FE7743] border border-[#FE7743]/20 rounded-lg hover:bg-[#FE7743]/20 transition"
                                        >
                                            Add Credits
                                        </button>
                                        <RoleBadge role={u.role} />
                                        {u.isFoundingMember && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">FOUNDER</span>
                                        )}
                                        <p className="text-[10px] text-[#EFEEEA]/30">{new Date(u.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-6 text-sm text-[#EFEEEA]/40 text-center">No users yet</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-bold text-[#EFEEEA]">Recent Transactions</h2>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-4 px-5 py-3 text-[10px] font-semibold text-[#EFEEEA]/40 uppercase tracking-wider border-b border-white/5">
                            <span>User</span>
                            <span>Type</span>
                            <span className="text-right">Amount</span>
                            <span>Description</span>
                            <span className="text-right">Date</span>
                        </div>

                        <div className="divide-y divide-white/5">
                            {activity?.recentTransactions?.length > 0 ? activity.recentTransactions.map((t: any) => (
                                <div key={t.id} className="grid grid-cols-5 gap-4 px-5 py-4 text-sm hover:bg-white/2 transition items-center">
                                    <span className="text-[#EFEEEA] font-medium truncate">{t.user?.profile?.fullName || 'User'}</span>
                                    <span><TxTypeBadge type={t.type} /></span>
                                    <span className={`text-right font-bold ${['EARNING', 'CREDIT_BONUS'].includes(t.type) ? 'text-green-400' : t.type === 'COMMISSION' ? 'text-amber-400' : 'text-red-400'}`}>
                                        PKR {t.amountPKR?.toLocaleString()}
                                    </span>
                                    <span className="text-[#EFEEEA]/50 text-xs truncate">{t.description}</span>
                                    <span className="text-right text-[#EFEEEA]/30 text-xs">{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                            )) : (
                                <p className="p-6 text-sm text-[#EFEEEA]/40 text-center">No transactions yet</p>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ADD CREDITS MODAL */}
            {selectedUserForCredits && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold text-[#EFEEEA] mb-2">Add Credits</h3>
                        <p className="text-sm text-[#EFEEEA]/60 mb-6">
                            Manually inject credits into <strong>{selectedUserForCredits.profile?.fullName || selectedUserForCredits.email}</strong>'s wallet.
                        </p>

                        <form onSubmit={handleAddCredits} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#EFEEEA]/50 uppercase tracking-wider mb-2">Amount (Credits)</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={creditAmount}
                                    onChange={e => setCreditAmount(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FE7743] transition"
                                    placeholder="e.g. 50"
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedUserForCredits(null);
                                        setCreditAmount('');
                                    }}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingCredit || !creditAmount}
                                    className="flex-1 py-3 bg-[#FE7743] hover:bg-[#FE7743]/90 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center justify-center"
                                >
                                    {addingCredit ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Credits'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

/* ─── Sub-components ─── */

function KpiCard({ label, value, icon, accent = '#EFEEEA' }: { label: string; value: string | number; icon: string; accent?: string }) {
    return (
        <div className="bg-[#111] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition group">
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-3xl font-black" style={{ color: accent }}>{value}</p>
            <h3 className="text-xs font-semibold text-[#EFEEEA]/50 mt-2 uppercase tracking-wider">{label}</h3>
        </div>
    );
}

function MiniStat({ label, value, color = '#EFEEEA' }: { label: string; value: number; color?: string }) {
    return (
        <div className="bg-[#111] p-4 rounded-xl border border-white/10">
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] font-semibold text-[#EFEEEA]/40 uppercase tracking-wider mt-1">{label}</p>
        </div>
    );
}

function FounderCard({ title, awarded, remaining, max, color }: { title: string; awarded: number; remaining: number; max: number; color: string }) {
    const percentage = Math.round((awarded / max) * 100);
    return (
        <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[#EFEEEA]">{title}</h3>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${color}20`, color }}>{awarded}/{max}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, background: color }} />
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-[#EFEEEA]/50">Awarded: <span className="font-bold text-[#EFEEEA]">{awarded}</span></span>
                <span className="text-[#EFEEEA]/50">Slots left: <span className="font-bold" style={{ color }}>{remaining}</span></span>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        OPEN: 'bg-green-500/10 text-green-400 border-green-500/20',
        CLOSED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        FILLED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        EXPIRED: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm border uppercase tracking-wider ${colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            {status}
        </span>
    );
}

function RoleBadge({ role }: { role: string }) {
    const colors: Record<string, string> = {
        SELLER: 'bg-[#FE7743]/10 text-[#FE7743] border-[#FE7743]/20',
        STUDENT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        EMPLOYER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        BUYER: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
        FREE: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        ADMIN: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm border uppercase tracking-wider ${colors[role] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            {role}
        </span>
    );
}

function TxTypeBadge({ type }: { type: string }) {
    const colors: Record<string, string> = {
        EARNING: 'bg-green-500/10 text-green-400 border-green-500/20',
        COMMISSION: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        WITHDRAWAL: 'bg-red-500/10 text-red-400 border-red-500/20',
        BOOST: 'bg-[#FE7743]/10 text-[#FE7743] border-[#FE7743]/20',
        CREDIT_PURCHASE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        CREDIT_BONUS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        ESCROW_LOCK: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    return (
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm border uppercase tracking-wider ${colors[type] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            {type}
        </span>
    );
}

function KycInboxTab({ token }: { token: string }) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingKycId, setSubmittingKycId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchKyc = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${apiUrl}/api/admin/kyc/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load pending KYC');
                const data = await res.json();
                setApplications(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchKyc();
    }, [token]);

    const handleDecision = async (kycId: string, status: 'APPROVED' | 'REJECTED') => {
        setSubmittingKycId(kycId);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/admin/kyc/decide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ kycId, status })
            });

            if (!res.ok) throw new Error('Failed to process KYC decision');

            // Remove the processed application from the list
            setApplications(prev => prev.filter(app => app.id !== kycId));

        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmittingKycId(null);
        }
    };

    if (loading) return <div className="text-center py-10 opacity-50">Loading applications...</div>;
    if (error) return <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-sm mb-4">{error}</div>;

    if (applications.length === 0) {
        return (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-50"> Inbox Zero</span>
                </div>
                <h3 className="text-lg font-bold text-white">All caught up!</h3>
                <p className="text-slate-400 text-sm max-w-sm mt-1">There are no pending identity verification requests at this time.</p>
            </div>
        );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
            {applications.map(app => (
                <div key={app.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-[#EFEEEA]">{app.user?.profile?.fullName || 'Unknown User'}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded border bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold tracking-wider uppercase">Pending</span>
                        </div>
                        <p className="text-xs text-[#EFEEEA]/50 font-mono truncate">{app.user?.email}</p>
                    </div>

                    <div className="p-4 flex-1 flex flex-col gap-4">
                        <div>
                            <p className="text-[10px] text-[#EFEEEA]/40 mb-1.5 font-semibold uppercase tracking-wider">Live Selfie Verification</p>
                            <a href={`${apiUrl}/uploads/${app.selfieUrl}`} target="_blank" rel="noreferrer" className="block relative h-32 bg-black rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                                <img src={`${apiUrl}/uploads/${app.selfieUrl}`} alt="Selfie" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[10px] text-[#EFEEEA]/40 mb-1.5 font-semibold uppercase tracking-wider">ID Front</p>
                                <a href={`${apiUrl}/uploads/${app.cnicFrontUrl}`} target="_blank" rel="noreferrer" className="block relative h-20 bg-black rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                                    <img src={`${apiUrl}/uploads/${app.cnicFrontUrl}`} alt="ID Front" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </a>
                            </div>
                            <div>
                                <p className="text-[10px] text-[#EFEEEA]/40 mb-1.5 font-semibold uppercase tracking-wider">ID Back</p>
                                <a href={`${apiUrl}/uploads/${app.cnicBackUrl}`} target="_blank" rel="noreferrer" className="block relative h-20 bg-black rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                                    <img src={`${apiUrl}/uploads/${app.cnicBackUrl}`} alt="ID Back" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </a>
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-[#EFEEEA]/30 mt-auto pt-2 border-t border-white/5">
                            Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleDecision(app.id, 'REJECTED')}
                            disabled={submittingKycId === app.id}
                            className={`py-2 rounded-lg font-bold text-sm transition-all ${submittingKycId === app.id ? 'opacity-50' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'}`}
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => handleDecision(app.id, 'APPROVED')}
                            disabled={submittingKycId === app.id}
                            className={`py-2 rounded-lg font-bold text-sm transition-all ${submittingKycId === app.id ? 'opacity-50' : 'bg-teal-vibrant text-slate-950 hover:bg-teal-vibrant/90 shadow-lg shadow-teal-vibrant/20'}`}
                        >
                            {submittingKycId === app.id ? 'Saving...' : 'Approve'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function DisputesTab({ token }: { token: string }) {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                const res = await disputeApi.getAdminDisputes(token);
                setDisputes(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDisputes();
    }, [token]);

    const handleResolve = async (id: string, decision: 'RESOLVED_BUYER' | 'RESOLVED_SELLER') => {
        if (!confirm(`Are you sure you want to resolve this in favor of the ${decision === 'RESOLVED_BUYER' ? 'BUYER' : 'SELLER'}?`)) return;
        setResolvingId(id);
        try {
            await disputeApi.resolve(token, id, { status: decision, resolution: `Resolved manually by Admin in favor of ${decision}` });
            setDisputes(prev => prev.filter(d => d.id !== id));
        } catch (err: any) {
            alert(err?.message || 'Resolution failed');
        } finally {
            setResolvingId(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-white/50 animate-pulse">Loading disputes...</div>;
    }

    if (disputes.length === 0) {
        return (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl opacity-50">🎉</span>
                </div>
                <h3 className="text-lg font-bold text-white">No active disputes!</h3>
                <p className="text-slate-400 text-sm max-w-sm mt-1">Peace reigns across the platform.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
            {disputes.map(dispute => {
                const isJob = !!dispute.jobId;
                const contextName = isJob ? 'Job' : 'Order';
                const contextTitle = isJob ? dispute.job?.title : dispute.order?.gigId;
                const amount = isJob ? dispute.job?.budgetMin : dispute.order?.price;

                return (
                    <div key={dispute.id} className="bg-[#1a1a1a] rounded-xl border border-amber-500/20 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/10 bg-amber-500/5">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-[#EFEEEA]">Dispute #{dispute.id.slice(-6)}</h3>
                                <span className="text-[10px] px-2 py-0.5 rounded border bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold tracking-wider uppercase">Needs Resolution</span>
                            </div>
                            <p className="text-xs text-[#EFEEEA]/50 font-mono truncate">{contextName}: {contextTitle} • Value: PKR {amount}</p>
                        </div>

                        <div className="p-4 flex-1 flex flex-col gap-4">
                            <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider font-semibold">Initiator (Plaintiff)</p>
                                <p className="text-sm font-semibold text-white">{dispute.initiator?.profile?.fullName || 'User'}</p>
                                <p className="text-xs text-white/50">{dispute.initiator?.email}</p>
                            </div>
                            <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider font-semibold">Defendant</p>
                                <p className="text-sm font-semibold text-white">{dispute.defendant?.profile?.fullName || 'User'}</p>
                                <p className="text-xs text-white/50">{dispute.defendant?.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider font-semibold">Reason Provided</p>
                                <p className="text-sm italic text-white/80 border-l-2 border-red-500/50 pl-3">"{dispute.reason}"</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleResolve(dispute.id, 'RESOLVED_BUYER')}
                                disabled={resolvingId === dispute.id}
                                className={`py-2 rounded-lg font-bold text-sm transition-all ${resolvingId === dispute.id ? 'opacity-50' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'}`}
                            >
                                Refund Buyer
                            </button>
                            <button
                                onClick={() => handleResolve(dispute.id, 'RESOLVED_SELLER')}
                                disabled={resolvingId === dispute.id}
                                className={`py-2 rounded-lg font-bold text-sm transition-all ${resolvingId === dispute.id ? 'opacity-50' : 'bg-teal-vibrant text-slate-950 hover:bg-teal-vibrant/90 shadow-lg shadow-teal-vibrant/20'}`}
                            >
                                Pay Seller
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

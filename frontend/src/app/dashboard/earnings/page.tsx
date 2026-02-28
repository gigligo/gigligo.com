'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { walletApi } from '@/lib/api';
import Link from 'next/link';

// Inline mini bar chart component (pure CSS, no chart library needed)
function MiniBarChart({ data, color = 'bg-primary' }: { data: number[], color?: string }) {
    const max = Math.max(...data, 1);
    return (
        <div className="flex items-end gap-[3px] h-16">
            {data.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                        className={`${color} rounded-sm w-full min-h-[3px] transition-all duration-700`}
                        style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (v / max) * 0.6 }}
                    />
                </div>
            ))}
        </div>
    );
}

// Monthly earnings mock data for the chart
const MONTHLY_EARNINGS = [12000, 18500, 9200, 31000, 22000, 45000, 38000, 51000, 42000, 60000, 55000, 72000];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EarningsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('BANK_TRANSFER');
    const [withdrawing, setWithdrawing] = useState(false);
    const [message, setMessage] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');

    const token = (session as any)?.accessToken;

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        const load = async () => {
            try {
                const [w, t] = await Promise.all([
                    walletApi.getBalance(token),
                    walletApi.getTransactions(token),
                ]);
                setWallet(w);
                setTransactions(t.items || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawing(true);
        setMessage('');
        try {
            await walletApi.withdraw(token, parseInt(withdrawAmount), withdrawMethod);
            setMessage('Withdrawal request submitted successfully.');
            setWithdrawAmount('');
            const [w, t] = await Promise.all([
                walletApi.getBalance(token),
                walletApi.getTransactions(token),
            ]);
            setWallet(w);
            setTransactions(t.items || []);
        } catch (e: any) {
            setMessage(`Error: ${e.message}`);
        }
        setWithdrawing(false);
    };

    const filteredTransactions = activeFilter === 'ALL'
        ? transactions
        : transactions.filter(t => t.type === activeFilter);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const lifetimeEarnings = MONTHLY_EARNINGS.reduce((a, b) => a + b, 0);

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Executive Header */}
                <div className="border-b border-border-light bg-surface-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none" />
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/dashboard" className="text-text-muted hover:text-text-main transition-colors">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            </Link>
                            <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Financial Ledger</h1>
                        </div>
                        <p className="text-text-muted mt-2 text-sm md:text-base max-w-xl pl-10">
                            Real-time overview of your earnings, pending clearances, and withdrawal mandates.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-8">

                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        {/* Available Balance */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-white/5 relative overflow-hidden col-span-1 sm:col-span-2 lg:col-span-1">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(200,157,40,0.15)_0%,transparent_60%)] pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Available Balance</p>
                                <p className="text-3xl font-black text-primary font-mono">
                                    PKR {wallet?.balancePKR?.toLocaleString() || '0'}
                                </p>
                                {wallet?.pendingPKR > 0 && (
                                    <p className="text-xs text-yellow-400 mt-2 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        PKR {wallet.pendingPKR.toLocaleString()} pending
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Lifetime Earnings */}
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Lifetime Earnings</p>
                            <p className="text-2xl font-black text-text-main font-mono">PKR {lifetimeEarnings.toLocaleString()}</p>
                            <div className="mt-4">
                                <MiniBarChart data={MONTHLY_EARNINGS} color="bg-green-500" />
                            </div>
                        </div>

                        {/* Pending Clearance */}
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Pending Clearance</p>
                            <p className="text-2xl font-black text-yellow-600 font-mono">PKR {wallet?.pendingPKR?.toLocaleString() || '0'}</p>
                            <p className="text-xs text-text-muted mt-3">Escrow funds awaiting milestone approval</p>
                        </div>

                        {/* Total Withdrawn */}
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Total Withdrawn</p>
                            <p className="text-2xl font-black text-text-main font-mono">PKR {wallet?.totalWithdrawn?.toLocaleString() || '0'}</p>
                            <p className="text-xs text-text-muted mt-3">Across all payout methods</p>
                        </div>
                    </div>

                    {/* Revenue Chart + Withdrawal Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '100ms' }}>

                        {/* Monthly Revenue Chart */}
                        <div className="lg:col-span-2 bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-text-main">Monthly Revenue</h3>
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">2024</span>
                            </div>
                            <div className="flex items-end gap-2 h-48">
                                {MONTHLY_EARNINGS.map((val, i) => {
                                    const max = Math.max(...MONTHLY_EARNINGS);
                                    const height = (val / max) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(val / 1000).toFixed(0)}k
                                            </span>
                                            <div
                                                className="w-full bg-primary/20 rounded-t-md relative overflow-hidden transition-all duration-500 group-hover:bg-primary/30"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div
                                                    className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all duration-700"
                                                    style={{ height: `${40 + Math.random() * 60}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-text-muted font-medium">{MONTH_LABELS[i]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Withdrawal Panel */}
                        <div className="bg-surface-light border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-lg shadow-primary/5">
                            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">send_money</span>
                                Request Payout
                            </h3>

                            {message && (
                                <div className={`p-3 rounded-lg text-xs mb-4 font-bold ${message.startsWith('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleWithdraw} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Amount (PKR)</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={e => setWithdrawAmount(e.target.value)}
                                        required
                                        min="1000"
                                        max={wallet?.balancePKR || 0}
                                        placeholder="Min 1,000"
                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Method</label>
                                    <select
                                        value={withdrawMethod}
                                        onChange={e => setWithdrawMethod(e.target.value)}
                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="BANK_TRANSFER">Bank Transfer (1-3 days)</option>
                                        <option value="JAZZCASH">JazzCash (Instant)</option>
                                        <option value="EASYPAISA">Easypaisa (Instant)</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={withdrawing || !withdrawAmount || parseInt(withdrawAmount) > (wallet?.balancePKR || 0)}
                                    className="w-full py-3.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {withdrawing ? 'Processing...' : 'Initiate Withdrawal'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Transaction Ledger */}
                    <div className="bg-surface-light border border-border-light rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="p-6 sm:p-8 border-b border-border-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-bold text-text-main">Transaction Ledger</h3>
                            <div className="flex flex-wrap gap-2">
                                {['ALL', 'EARNING', 'WITHDRAWAL', 'COMMISSION'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === filter
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-background-light text-text-muted border border-border-light hover:border-primary/50'
                                            }`}
                                    >
                                        {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase().replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {filteredTransactions.length === 0 ? (
                            <div className="p-12 text-center">
                                <span className="material-symbols-outlined text-5xl text-text-muted/20 mb-4 block">receipt_long</span>
                                <p className="text-text-muted text-sm font-medium">No transactions found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border-light">
                                {filteredTransactions.map((t: any) => (
                                    <div key={t.id} className="px-6 sm:px-8 py-5 flex items-center justify-between hover:bg-background-light/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'EARNING' ? 'bg-green-500/10 text-green-600' :
                                                    t.type === 'WITHDRAWAL' ? 'bg-primary/10 text-primary' :
                                                        t.type === 'COMMISSION' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {t.type === 'EARNING' ? 'south_west' :
                                                        t.type === 'WITHDRAWAL' ? 'north_east' :
                                                            t.type === 'COMMISSION' ? 'receipt' : 'credit_card'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main">{t.type.replace('_', ' ')}</p>
                                                <p className="text-xs text-text-muted mt-0.5">{t.description}</p>
                                                <p className="text-[10px] text-text-muted/60 mt-1 font-medium">
                                                    {new Date(t.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-sm font-mono ${['EARNING', 'REFUND'].includes(t.type) ? 'text-green-600' : 'text-text-main'}`}>
                                                {['EARNING', 'REFUND'].includes(t.type) ? '+' : '-'}{t.amountPKR?.toLocaleString()} PKR
                                            </p>
                                            <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

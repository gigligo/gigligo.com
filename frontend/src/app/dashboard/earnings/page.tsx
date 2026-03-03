'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { walletApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Wallet,
    History,
    ChevronRight,
    Send,
    ShieldCheck,
    TrendingUp,
    Download,
    Filter,
    Activity,
    CheckCircle2,
    XCircle,
    Receipt
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

// Mock/Static Data for Visuals
const MONTHLY_EARNINGS = [
    { name: 'JAN', value: 12000 }, { name: 'FEB', value: 18500 }, { name: 'MAR', value: 9200 },
    { name: 'APR', value: 31000 }, { name: 'MAY', value: 22000 }, { name: 'JUN', value: 45000 },
    { name: 'JUL', value: 38000 }, { name: 'AUG', value: 51000 }, { name: 'SEP', value: 42000 },
    { name: 'OCT', value: 60000 }, { name: 'NOV', value: 55000 }, { name: 'DEC', value: 72000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-white/10 p-6 rounded-2xl backdrop-blur-3xl shadow-3xl shadow-black">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">{label} EARNINGS</p>
                <div className="flex items-center gap-4 text-sm font-bold italic">
                    <span className="text-white/60 uppercase tracking-tighter">CAPITAL GENERATED:</span>
                    <span className="text-primary">PKR {payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function EarningsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('BANK_TRANSFER');
    const [withdrawing, setWithdrawing] = useState(false);
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
                setTransactions(Array.isArray(t) ? t : (t.items || []));
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token, router]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawing(true);
        try {
            await walletApi.withdraw(token, parseInt(withdrawAmount), withdrawMethod);
            toast.success('Withdrawal protocol initiated successfully.');
            setWithdrawAmount('');
            const [w, t] = await Promise.all([
                walletApi.getBalance(token),
                walletApi.getTransactions(token),
            ]);
            setWallet(w);
            setTransactions(Array.isArray(t) ? t : (t.items || []));
        } catch (e: any) {
            toast.error(e.message || 'Withdrawal failure.');
        }
        setWithdrawing(false);
    };

    const filteredTransactions = activeFilter === 'ALL'
        ? transactions
        : transactions.filter(t => t.type === activeFilter);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic animate-pulse">Accessing Secure Ledger...</p>
                </div>
            </div>
        );
    }

    const lifetimeEarnings = MONTHLY_EARNINGS.reduce((a, b) => a + b.value, 0);

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Tactical Header */}
                <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                    <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-12">
                                <span className="material-symbols-outlined text-xl group-hover:-translate-x-3 transition-transform">arrow_back</span> Dashboard
                            </Link>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                <div className="space-y-6">
                                    <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic">
                                        Payout <span className="text-primary not-italic">Protocol.</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                        Execute high-frequency withdrawals and audit your capital generation stream across the global professional network.
                                    </p>
                                </div>

                                <div className="flex gap-6">
                                    <div className="bg-primary border border-primary-light rounded-3xl px-12 py-8 flex flex-col gap-2 min-w-[240px] shadow-2xl shadow-primary/40 active:scale-95 transition-transform cursor-pointer overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Wallet size={24} className="mb-2" />
                                        <div>
                                            <p className="text-4xl font-black italic tracking-tighter">PKR {wallet?.balancePKR?.toLocaleString() || '0'}</p>
                                            <p className="text-[10px] uppercase font-black tracking-[0.4em] mt-1 opacity-60">Available Capital</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24 space-y-24">

                    {/* Performance Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        <KPICard title="Lifetime Capital" value={`PKR ${(lifetimeEarnings / 1000).toFixed(0)}K`} growth="+18.4%" icon={TrendingUp} />
                        <KPICard title="Pending Clearance" value={`PKR ${((wallet?.pendingPKR || 0) / 1000).toFixed(0)}K`} growth="3.2%" icon={Clock} isNegative={wallet?.pendingPKR > 0} />
                        <KPICard title="Total Extraction" value={`PKR ${((wallet?.totalWithdrawn || 0) / 1000).toFixed(0)}K`} growth="+5.2%" icon={ArrowUpRight} />
                        <KPICard title="Active Mandates" value="12" growth="+2" icon={Zap} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Capital Stream Chart */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="xl:col-span-2 bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                            <div className="flex justify-between items-center mb-16 relative z-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Earning Trajectory Stream</h4>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Capital Generation Flow</h3>
                                </div>
                                <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all font-black italic text-white/40">
                                    <Download size={20} />
                                </button>
                            </div>

                            <div className="h-[450px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MONTHLY_EARNINGS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#007CFF" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#007CFF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }}
                                            dy={20}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
                                            dx={-10}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#007CFF"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorEarning)"
                                            animationDuration={2500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Payout Mandate Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/2 border border-primary/20 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-primary/5 relative overflow-hidden"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic mb-12 flex items-center gap-4">
                                <Send size={18} />
                                Initiate Extraction
                            </h4>

                            <form onSubmit={handleWithdraw} className="space-y-10 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-2 block">Extraction Amount (PKR)</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={e => setWithdrawAmount(e.target.value)}
                                            required
                                            min="1000"
                                            max={wallet?.balancePKR || 0}
                                            placeholder="MIN 1,000"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                        />
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">MAX {wallet?.balancePKR?.toLocaleString() || '0'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-2 block">Payout Architecture</label>
                                    <select
                                        value={withdrawMethod}
                                        onChange={e => setWithdrawMethod(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-sm font-black italic tracking-widest text-white focus:outline-none focus:border-primary transition-all appearance-none uppercase"
                                    >
                                        <option value="BANK_TRANSFER">Direct Ledger Transfer (1-3 D)</option>
                                        <option value="JAZZCASH">JazzCash Instant Protocol</option>
                                        <option value="EASYPAISA">Easypaisa Instant Node</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={withdrawing || !withdrawAmount || parseInt(withdrawAmount) > (wallet?.balancePKR || 0)}
                                    className="w-full py-6 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-20 flex items-center justify-center gap-4 italic active:scale-95"
                                >
                                    {withdrawing ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck size={18} />
                                            AUTHORIZE PAYOUT
                                        </>
                                    )}
                                </button>

                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] italic text-center leading-relaxed">
                                    Security synchronization required. Funds will be cleared based on protocol limits.
                                </p>
                            </form>
                        </motion.div>
                    </div>

                    {/* Transaction Registry */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/2 border border-white/5 rounded-[4rem] backdrop-blur-3xl shadow-3xl shadow-black overflow-hidden"
                    >
                        <div className="p-12 md:p-16 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Historical Registry</h4>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Operational Ledger</h3>
                            </div>
                            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-3xl overflow-x-auto max-w-full">
                                {['ALL', 'EARNING', 'WITHDRAWAL', 'COMMISSION'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all relative shrink-0 ${activeFilter === f ? 'text-white' : 'text-white/20 hover:text-white'}`}
                                    >
                                        {activeFilter === f && (
                                            <motion.div layoutId="filter-bg" className="absolute inset-0 bg-primary/20 rounded-xl z-0" />
                                        )}
                                        <span className="relative z-10 italic">{f === 'ALL' ? 'Total' : f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredTransactions.length === 0 ? (
                            <div className="py-48 text-center flex flex-col items-center justify-center space-y-8">
                                <History size={80} className="text-white/5 font-thin" strokeWidth={1} />
                                <h3 className="text-2xl font-black text-white/10 uppercase tracking-[0.5em] italic">No archived signals detected.</h3>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredTransactions.map((tx: any, idx: number) => (
                                    <div key={tx.id} className="p-10 md:p-12 flex items-center justify-between hover:bg-white/1 transition-colors group">
                                        <div className="flex items-center gap-10">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-black border border-white/5 group-hover:border-primary/30 transition-all ${tx.type === 'EARNING' ? 'text-emerald-500 bg-emerald-500/5' :
                                                tx.type === 'WITHDRAWAL' ? 'text-primary bg-primary/5' :
                                                    'text-amber-500 bg-amber-500/5'
                                                }`}>
                                                {tx.type === 'EARNING' ? <ArrowDownLeft size={28} /> :
                                                    tx.type === 'WITHDRAWAL' ? <ArrowUpRight size={28} /> :
                                                        <Receipt size={28} />}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">{tx.type.replace('_', ' ')}</p>
                                                <p className="text-xl font-black italic text-white group-hover:text-primary transition-colors">{tx.description}</p>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
                                                    {new Date(tx.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-3">
                                            <p className={`text-2xl font-black italic tracking-tighter ${['EARNING', 'REFUND'].includes(tx.type) ? 'text-white' : 'text-white/40'}`}>
                                                {['EARNING', 'REFUND'].includes(tx.type) ? '+' : '-'}{tx.amountPKR?.toLocaleString()} <span className="text-[10px] text-primary">PKR</span>
                                            </p>
                                            <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] rounded-full border italic ${tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {tx.status}
                                            </span   >
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                </div>
            </main>
        </div>
    );
}

function KPICard({ title, value, growth, icon: Icon, isNegative = false }: any) {
    const isPositive = growth.startsWith('+');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/2 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500"
        >
            <div className={`absolute top-0 left-0 w-2 h-full ${isPositive ? 'bg-primary' : (isNegative ? 'bg-amber-500' : 'bg-white/10')} opacity-30`} />

            <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center ${isNegative ? 'text-amber-500' : 'text-primary'} shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700`}>
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${isPositive ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white/40'} italic`}>
                    {growth}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-5xl font-black italic tracking-tighter text-white">{value}</h2>
                </div>
            </div>
        </motion.div>
    );
}

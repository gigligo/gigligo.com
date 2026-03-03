'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/ui/PageTransition';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    TrendingUp,
    DollarSign,
    ShieldCheck,
    Clock,
    ChevronRight,
    ArrowDownRight,
    PieChart as PieChartIcon,
    Globe,
    Lock,
    Verified
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

// Tactical Financial Intel
const REVENUE_DATA = [
    { name: 'JAN', value: 35000 },
    { name: 'FEB', value: 34000 },
    { name: 'MAR', value: 25000 },
    { name: 'APR', value: 28000 },
    { name: 'MAY', value: 31000 },
    { name: 'JUN', value: 45000 },
    { name: 'JUL', value: 42000 },
    { name: 'AUG', value: 48000 },
    { name: 'SEP', value: 52000 },
    { name: 'OCT', value: 64000 },
    { name: 'NOV', value: 58000 },
    { name: 'DEC', value: 72000 },
];

const TOP_ENTITIES = [
    { name: 'NOVA SYSTEMS', sector: 'TECH', value: '$45,200', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100' },
    { name: 'GLOBEX INTEL', sector: 'RETAIL', value: '$28,100', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
    { name: 'APEX LOGISTICS', sector: 'DEFENSE', value: '$12,400', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100' },
];

const RECENT_LEDGER = [
    { type: 'in', label: 'Mandate Authorization', id: 'INV-2024-001', amount: '+$14,200', date: '2H AGO', status: 'SYNCHRONIZED' },
    { type: 'out', label: 'Protocol Overhead', id: 'SUBSCRIPTION', amount: '-$120', date: '5H AGO', status: 'PROCESSED' },
    { type: 'in', label: 'Escrow Fufillment', id: 'INV-2024-003', amount: '+$8,800', date: '1D AGO', status: 'SYNCHRONIZED' },
    { type: 'in', label: 'Bonus Incentive', id: 'PERFORMANCE', amount: '+$2,500', date: '2D AGO', status: 'SYNCHRONIZED' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 border border-white/10 p-6 rounded-2xl backdrop-blur-3xl shadow-3xl shadow-black">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">{label} AUDIT</p>
                <div className="flex items-center gap-4 text-sm font-bold italic">
                    <span className="text-white/60 uppercase tracking-tighter">TOTAL CAPITAL:</span>
                    <span className="text-primary">${payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function FinanceDashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <PageTransition className="flex-1" style={{ paddingTop: 72 }}>
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
                                        Capital <span className="text-primary not-italic">Control.</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                        Precision-engineered visibility into your professional capital trajectory, decentralized escrow fulfillment, and tactical liquidity.
                                    </p>
                                </div>

                                <button className="h-16 px-12 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary hover:border-primary transition-all duration-500 flex items-center gap-4 italic shadow-2xl">
                                    <Download size={18} />
                                    EXTRACT AUDIT PDF
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24 space-y-24">

                    {/* Capital KPI Field */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        <KPICard title="Accumulated Capital" value="$124,500" growth="+12.4%" icon={TrendingUp} />
                        <KPICard title="Net Operative Profit" value="$98,200" growth="+8.2%" icon={DollarSign} />
                        <KPICard title="Pending Authorization" value="$12,450" growth="-2.1%" icon={Clock} isNegative />
                        <KPICard title="Average Protocol" value="$4,800" growth="+5.0%" icon={Zap} />
                    </div>

                    {/* Capital Trajectory Chart */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="xl:col-span-2 bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                            <div className="flex justify-between items-center mb-16 relative z-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Capital Trajectory Stream</h4>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gross Periodic Revenue</h3>
                                </div>
                                <div className="flex gap-4">
                                    {['1M', '3M', '1Y'].map(p => (
                                        <button key={p} className={`w-12 h-12 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${p === '1Y' ? 'bg-primary text-white' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[450px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                                            fill="url(#colorRevenue)"
                                            animationDuration={2500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Ledger */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden h-full flex flex-col"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic mb-12">Transactional Ledger</h4>
                            <div className="space-y-10 flex-1">
                                {RECENT_LEDGER.map((tx, i) => (
                                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                                        <div className="flex gap-6 items-center">
                                            <div className={`w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center shadow-2xl shadow-black ${tx.type === 'in' ? 'text-primary' : 'text-red-500'}`}>
                                                {tx.type === 'in' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold italic text-white uppercase tracking-tight group-hover:text-primary transition-colors">{tx.label}</p>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{tx.id} • {tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-black italic tracking-tighter ${tx.type === 'in' ? 'text-white' : 'text-red-500/50'}`}>{tx.amount}</p>
                                            <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">{tx.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-16 px-8 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic">
                                VIEW FULL LEDGER
                            </button>
                        </motion.div>
                    </div>

                    {/* Entities & High-Level Stats */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Strategic Entities */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black h-fit"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic mb-12">Strategic Entities (TOP)</h4>
                            <div className="space-y-10">
                                {TOP_ENTITIES.map((ent, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 rounded-3xl overflow-hidden border border-white/10 group-hover:border-primary transition-colors duration-500">
                                                <img src={ent.img} alt={ent.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black italic text-white uppercase tracking-tighter">{ent.name}</p>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{ent.sector} COMMAND</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-black italic tracking-tighter text-primary">{ent.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Extra Intelligence Panels */}
                        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-linear-to-r from-primary/20 to-transparent border border-primary/20 rounded-[4rem] p-12 flex flex-col justify-between group hover:from-primary/30 transition-all duration-700 h-[320px]">
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-700">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Tactical Audit</h3>
                                    <p className="text-lg font-bold italic text-white/40 leading-relaxed max-w-[240px]">Download full Periodic Financial Intelligence for tax synchronization.</p>
                                </div>
                                <button className="self-start text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-colors flex items-center gap-4 italic group">
                                    INITIATE DOWNLOAD <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>

                            <div className="bg-white/2 border border-white/5 rounded-[4rem] p-12 flex flex-col justify-between h-[320px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-emerald-500 shadow-2xl">
                                        <Verified size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Operational Plan</h3>
                                    <p className="text-lg font-bold italic text-white/40 leading-relaxed max-w-[240px]">Operative Limit: <span className="text-emerald-500">Tier 1 Elite</span>. Verified network node status confirmed.</p>
                                </div>
                                <button className="h-14 px-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-500 self-start italic">
                                    UPGRADE ARCHITECTURE
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </PageTransition>
        </div>
    );
}

function KPICard({ title, value, growth, icon: Icon, isNegative = false, isPercentage = false }: any) {
    const isPositive = growth.startsWith('+');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/2 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500"
        >
            <div className={`absolute top-0 left-0 w-2 h-full ${isPositive ? 'bg-primary' : (isNegative ? 'bg-red-500' : 'bg-white/10')} opacity-30`} />

            <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center ${isNegative ? 'text-red-500' : 'text-primary'} shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700`}>
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

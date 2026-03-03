'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/ui/PageTransition';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    TrendingUp,
    Users,
    Target,
    ArrowUpRight,
    BarChart3,
    Activity,
    ShieldCheck,
    Download,
    Filter,
    MoreVertical,
    Clock,
    Eye,
    Briefcase,
    Award,
    CheckCircle2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

// Mock analytics data - Tactical Intelligence
const ANALYTICS_DATA = [
    { name: 'JAN', views: 120, conversions: 5, value: 4500 },
    { name: 'FEB', views: 145, conversions: 8, value: 7200 },
    { name: 'MAR', views: 89, conversions: 4, value: 3800 },
    { name: 'APR', views: 210, conversions: 12, value: 12500 },
    { name: 'MAY', views: 340, conversions: 18, value: 18900 },
    { name: 'JUN', views: 280, conversions: 15, value: 14200 },
    { name: 'JUL', views: 310, conversions: 16, value: 15800 },
    { name: 'AUG', views: 420, conversions: 24, value: 24500 },
    { name: 'SEP', views: 390, conversions: 22, value: 21200 },
    { name: 'OCT', views: 510, conversions: 31, value: 28900 },
    { name: 'NOV', views: 480, conversions: 28, value: 26500 },
    { name: 'DEC', views: 620, conversions: 42, value: 38000 },
];

const TOP_OPERATIONS = [
    { name: 'React / Next.js Frameworks', impressions: 4200, conversions: 12, growth: '+24%' },
    { name: 'Node.js Microservices', impressions: 3100, conversions: 8, growth: '+12%' },
    { name: 'UI/UX Design Systems', impressions: 2800, conversions: 6, growth: '+8%' },
    { name: 'DevOps & Cloud Architecture', impressions: 1900, conversions: 3, growth: '-2%' },
];

const INTELLIGENCE_FEED = [
    { type: 'view', text: 'Strategic entity "NovaTech" analyzed your dossier', time: '2H AGO', icon: Eye, color: 'text-primary' },
    { type: 'shortlist', text: 'Protocol "Mobile Redesign" moved to short-list', time: '5H AGO', icon: Target, color: 'text-amber-500' },
    { type: 'badge', text: 'Tier 1 Operative Status synchronized for Q4', time: '1D AGO', icon: Award, color: 'text-emerald-500' },
    { type: 'milestone', text: 'Authorization GIG-8901 milestone processed', time: '2D AGO', icon: ShieldCheck, color: 'text-primary' },
    { type: 'network', text: '3 inbound signals from Fortune 500 nodes', time: '3D AGO', icon: Activity, color: 'text-primary' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 border border-white/10 p-6 rounded-2xl backdrop-blur-3xl shadow-2xl">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">{label} DATA</p>
                {payload.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-bold italic">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white/60 uppercase tracking-tighter">{item.name}:</span>
                        <span className="text-white">{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsPage() {
    const [activePeriod, setActivePeriod] = useState('12M');

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
                                        Tactical <span className="text-primary not-italic">Intel.</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                        Precision visibility into your professional trajectory, conversion funnels, and high-level engagement metrics.
                                    </p>
                                </div>

                                <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-3xl">
                                    {['30D', '90D', '12M'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setActivePeriod(p)}
                                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activePeriod === p ? 'text-white' : 'text-white/20 hover:text-white'}`}
                                        >
                                            {activePeriod === p && (
                                                <motion.div layoutId="period-bg" className="absolute inset-0 bg-primary rounded-xl z-0 shadow-lg shadow-primary/30" />
                                            )}
                                            <span className="relative z-10 italic">{p === '30D' ? 'Monthly' : p === '90D' ? 'Quarterly' : 'Annual'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Intelligence Matrix */}
                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24">

                    {/* KPI High-Density Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
                        <KPICard title="Dossier Impressions" value="18,420" growth="+12.4%" icon={Eye} />
                        <KPICard title="Protocol Conversion" value="66.7%" growth="+4.2%" icon={Target} isPercentage />
                        <KPICard title="Operative Retention" value="88.0%" growth="+2.1%" icon={Users} isPercentage />
                        <KPICard title="Strategic Capital" value="PKR 4.2M" growth="+22.8%" icon={TrendingUp} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Main Intelligence Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="xl:col-span-2 bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-16 relative z-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Network Engagement Stream</h4>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dossier Visibility Performance</h3>
                                </div>
                                <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary transition-all duration-500">
                                    <Download size={20} />
                                </button>
                            </div>

                            <div className="h-[450px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
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
                                            dataKey="views"
                                            name="IMPRESSIONS"
                                            stroke="#007CFF"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorViews)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Signal Feed */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic mb-12">Signal Intelligence</h4>

                            <div className="space-y-12">
                                {INTELLIGENCE_FEED.map((signal, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className={`w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-all duration-500 shadow-2xl shadow-black ${signal.color}`}>
                                            <signal.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-bold italic text-white leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">{signal.text}</p>
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{signal.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-16 px-8 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic">
                                DOWNLOAD INTEL LOG
                            </button>
                        </motion.div>
                    </div>

                    {/* Operative Skills & Conversion Matrix */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-10">
                        {/* Skill Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black"
                        >
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic mb-12">Skill Performance Analytics</h4>

                            <div className="space-y-12">
                                {TOP_OPERATIONS.map((op, i) => (
                                    <div key={i} className="space-y-6 group">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h5 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{op.name}</h5>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{op.impressions.toLocaleString()} IMPRESSIONS</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-black italic tracking-tighter ${op.growth.startsWith('+') ? 'text-primary' : 'text-white/40'}`}>
                                                    {op.conversions} HIRED
                                                </p>
                                                <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">{op.growth} PERIODIC</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(op.impressions / 4200) * 100}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-primary shadow-[0_0_10px_rgba(0,124,255,0.8)] rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Conversion Funnel / Circular Intelligence */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black flex flex-col items-center justify-center text-center relative overflow-hidden"
                        >
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 space-y-12 w-full">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Protocol Conversion Funnel</h4>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="flex flex-col items-center gap-8">
                                        <div className="w-48 h-48 relative">
                                            <CircularProgress pct={66.7} color="#007CFF" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black italic tracking-tighter">67<span className="text-primary">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Win Protocol Probability</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-8">
                                        <div className="w-48 h-48 relative">
                                            <CircularProgress pct={88.2} color="#10B981" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black italic tracking-tighter">88<span className="text-emerald-500">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Retention Efficiency</p>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-white/5">
                                    <p className="text-lg font-bold italic text-white/40 leading-relaxed max-w-sm mx-auto">
                                        Your nodes are performing at <span className="text-white">Tier 1 Efficiency</span> based on collective network data.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </PageTransition>
        </div>
    );
}

function KPICard({ title, value, growth, icon: Icon, isPercentage = false }: any) {
    const isPositive = growth.startsWith('+');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/2 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500"
        >
            <div className={`absolute top-0 left-0 w-2 h-full ${isPositive ? 'bg-primary' : 'bg-white/10'} opacity-30`} />

            <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700">
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

function CircularProgress({ pct, color }: { pct: number, color: string }) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" stroke="rgba(255,255,255,0.03)" />
            <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="10"
                stroke={color}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "circOut" }}
                strokeDasharray={circumference}
                className="drop-shadow-[0_0_8px_rgba(0,124,255,0.5)]"
            />
        </svg>
    );
}

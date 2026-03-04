'use client';

import { motion } from 'framer-motion';
import {
    Wallet,
    ArrowRight,
    Banknote,
    Bitcoin,
    CheckCircle2,
    MoreVertical,
    History,
    Activity,
    Zap,
    Download
} from 'lucide-react';

export function WithdrawalsView() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Withdrawal Hub</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Monitor your liquidity and manage your payout conduits.</p>
            </div>

            {/* Balance Overview Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/90 border border-white/10 rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-primary/20 group"
            >
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                    <Wallet size={160} className="text-white" strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Available Balance</p>
                        <h3 className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-none font-mono">
                            $24,580<span className="text-2xl text-white/40">.00</span>
                        </h3>
                    </div>

                    <button className="h-16 px-10 bg-white text-primary text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-4 active:scale-95 group/btn">
                        REQUEST PAYOUT
                        <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-12">

                {/* Withdrawal Linked Accounts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                                <Activity size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Withdrawal Conduits</h3>
                        </div>
                        <button className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-all flex items-center gap-3">
                            <Zap size={14} /> ADD NEW METHOD
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Chase Card */}
                        <div className="p-8 rounded-2xl border border-white/5 bg-white/1 flex items-center gap-6 group hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                            <div className="w-14 h-14 rounded-xl bg-black border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-all duration-500">
                                <Banknote size={24} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-xl font-bold text-white tracking-tight truncate">Chase Business</h4>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest rounded-full">DEFAULT</span>
                                </div>
                                <p className="text-[10px] font-medium text-white/20 font-mono tracking-widest">•••• 8392</p>
                            </div>
                            <button className="text-white/10 hover:text-white transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        {/* USDC Wallet */}
                        <div className="p-8 rounded-2xl border border-white/5 bg-white/1 flex items-center gap-6 group hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                            <div className="w-14 h-14 rounded-xl bg-black border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-all duration-500">
                                <Bitcoin size={24} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-bold text-white tracking-tight truncate mb-1">USDC Wallet (ETH)</h4>
                                <p className="text-[10px] font-medium text-white/20 font-mono tracking-widest truncate">0x71C...4D90</p>
                            </div>
                            <button className="text-white/10 hover:text-white transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Payouts Historical Ledger */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden"
                >
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <History size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Recent Payouts</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { date: 'Nov 01, 2024', method: 'Chase Business •••• 8392', amount: '$15,000.00', status: 'Completed' },
                            { date: 'Oct 15, 2024', method: 'USDC Wallet (Ethereum)', amount: '$8,250.00', status: 'Completed' },
                        ].map((payout, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl border border-white/5 bg-black/40 gap-8 hover:bg-white/2 hover:border-primary/20 transition-all duration-500 group">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/10">
                                        <CheckCircle2 size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{payout.method}</p>
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{payout.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center md:items-end justify-between md:justify-center gap-4 md:flex-col">
                                    <span className="text-3xl font-bold text-white tracking-tight font-mono">{payout.amount}</span>
                                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{payout.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-10 border-t border-white/5 flex justify-center">
                        <button className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-all flex items-center gap-3">
                            VIEW TRANSACTION HISTORY <Download size={14} />
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

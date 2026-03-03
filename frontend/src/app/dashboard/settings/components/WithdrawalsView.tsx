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
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Capital Extraction</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Manage payout conduits and monitor available liquidity for high-frequency extraction.</p>
            </div>

            {/* Balance Overview Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary border border-primary-dark rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-3xl shadow-primary/20 group"
            >
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                    <Wallet size={200} className="text-white" strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="space-y-6">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em] italic">Available Liquidity</p>
                        <h3 className="text-7xl md:text-[8rem] font-black tracking-tighter text-white leading-none font-mono italic">
                            $24,580<span className="text-3xl text-white/30">.00</span>
                        </h3>
                    </div>

                    <button className="h-20 px-12 bg-white text-primary text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-slate-100 transition-all shadow-3xl shadow-black/20 flex items-center justify-center gap-6 italic active:scale-95 group/btn">
                        REQUEST PAYOUT
                        <ArrowRight size={24} className="group-hover/btn:translate-x-4 transition-transform" />
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-12">

                {/* Withdrawal Linked Accounts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                                <Activity size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Extraction Nodes</h3>
                        </div>
                        <button className="text-[10px] font-black text-primary hover:text-white uppercase tracking-[0.4em] transition-all italic flex items-center gap-3">
                            <Zap size={16} /> ADD NEW CONDUIT
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Chase Card */}
                        <div className="p-8 rounded-4xl border border-white/5 bg-white/1 flex items-center gap-8 group hover:border-primary/50 transition-all duration-700 hover:shadow-3xl hover:shadow-primary/5">
                            <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-all duration-700">
                                <Banknote size={32} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-2">
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter truncate">Chase Business</h4>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full italic">DEFAULT</span>
                                </div>
                                <p className="text-sm font-black text-white/20 font-mono tracking-widest">•••• 8392</p>
                            </div>
                            <button className="text-white/10 hover:text-white transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* USDC Wallet */}
                        <div className="p-8 rounded-4xl border border-white/5 bg-white/1 flex items-center gap-8 group hover:border-primary/50 transition-all duration-700 hover:shadow-3xl hover:shadow-primary/5">
                            <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-all duration-700">
                                <Bitcoin size={32} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter truncate mb-2">USDC Matrix (ETH)</h4>
                                <p className="text-sm font-black text-white/20 font-mono tracking-widest truncate">0x71C...4D90</p>
                            </div>
                            <button className="text-white/10 hover:text-white transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Payouts Historical Ledger */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <History size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Extraction Archive</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { date: 'NOV 01, 2024', method: 'CHASE BUSINESS •••• 8392', amount: '$15,000.00', status: 'SYNCHRONIZED' },
                            { date: 'OCT 15, 2024', method: 'USDC MATRIX (ETHEREUM)', amount: '$8,250.00', status: 'SYNCHRONIZED' },
                        ].map((payout, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[3rem] border border-white/5 bg-black/40 gap-8 hover:bg-white/2 hover:border-primary/20 transition-all duration-500 group">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/10">
                                        <CheckCircle2 size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{payout.method}</p>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{payout.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center md:items-end justify-between md:justify-center gap-4 md:flex-col">
                                    <span className="text-3xl font-black text-white italic tracking-tighter font-mono">{payout.amount}</span>
                                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] italic animate-pulse">{payout.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/5 flex justify-center">
                        <button className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.5em] italic transition-all flex items-center gap-4">
                            VIEW FULL LEDGER <Download size={16} />
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

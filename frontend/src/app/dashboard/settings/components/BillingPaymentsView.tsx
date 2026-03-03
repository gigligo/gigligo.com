'use client';

import { motion } from 'framer-motion';
import {
    CreditCard,
    Plus,
    MoreHorizontal,
    Receipt,
    Download,
    CheckCircle2,
    PlusCircle,
    Zap,
    Shield
} from 'lucide-react';

export function BillingPaymentsView() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Capital Cycles</h2>
                    <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Manage financial conduits, track treasury influx, and audit operational invoices.</p>
                </div>
                <button className="h-16 px-10 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-primary/40 hover:bg-primary-dark transition-all flex items-center gap-4 italic active:scale-95">
                    <Plus size={20} />
                    ADD PAYMENT NODE
                </button>
            </div>

            <div className="space-y-12">
                {/* Payment Methods Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <CreditCard size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Active Conduits</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {/* Primary Card */}
                        <div className="group p-8 rounded-4xl border-2 border-primary bg-primary/5 relative overflow-hidden transition-all duration-700 hover:shadow-3xl hover:shadow-primary/10">
                            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
                                <CreditCard size={160} className="text-primary" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="px-4 py-1.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full italic animate-pulse">PRIMARY NODE</div>
                                    <button className="text-primary/40 hover:text-primary transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                <div className="mt-12 space-y-2">
                                    <div className="text-2xl font-black italic tracking-[0.2em] text-white">•••• •••• •••• 4242</div>
                                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">AMEX SYSTEM SIGNATURE</div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Card */}
                        <div className="group p-8 rounded-4xl border border-white/5 bg-white/1 relative overflow-hidden transition-all duration-700 hover:border-white/20">
                            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 -rotate-12">
                                <Shield size={160} className="text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-end">
                                    <button className="text-white/20 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                <div className="mt-12 space-y-2">
                                    <div className="text-2xl font-black italic tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">•••• •••• •••• 1928</div>
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic group-hover:text-white/40 transition-colors">VISA BUSINESS PROTOCOL</div>
                                </div>
                            </div>
                        </div>

                        {/* Add New Placeholder */}
                        <button className="group p-8 rounded-4xl border-2 border-dashed border-white/5 bg-white/1 flex flex-col items-center justify-center text-white/10 hover:text-primary hover:border-primary/50 transition-all duration-500 min-h-[180px] hover:bg-primary/5">
                            <PlusCircle size={40} strokeWidth={1} className="mb-4 transition-transform duration-700 group-hover:rotate-90 group-hover:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Initialize New node</span>
                        </button>
                    </div>
                </motion.div>

                {/* Billing History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-3xl shadow-black relative"
                >
                    <div className="p-10 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-8 bg-white/1">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                                <Receipt size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Operational Ledger</h3>
                        </div>
                        <button className="text-[10px] font-black text-white/20 hover:text-primary uppercase tracking-[0.4em] transition-all flex items-center gap-3 italic group">
                            EXTRACT ALL LOGS <Download size={16} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-black/40">
                                    <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-16">Timestamp</th>
                                    <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Transmission Description</th>
                                    <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Capital Delta</th>
                                    <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">State</th>
                                    <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic text-right pr-16">Archive</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/2">
                                {[
                                    { date: 'OCT 12, 2024', desc: 'Enterprise Membership - Annual Cycle', amount: '$4,999.00', status: 'SYNCHRONIZED' },
                                    { date: 'SEP 05, 2024', desc: 'Contract Escrow Funding (Mission Alpha)', amount: '$12,500.00', status: 'SYNCHRONIZED' },
                                    { date: 'AUG 21, 2024', desc: 'Additional Tactical Unit Seats (x5)', amount: '$495.00', status: 'SYNCHRONIZED' },
                                ].map((invoice, i) => (
                                    <tr key={i} className="hover:bg-white/2 transition-colors group">
                                        <td className="p-10 text-xl font-black italic tracking-tighter text-white/40 group-hover:text-white transition-colors pl-16">{invoice.date}</td>
                                        <td className="p-10 text-lg font-bold italic text-white/20 group-hover:text-white/40 transition-colors">{invoice.desc}</td>
                                        <td className="p-10 text-xl font-black italic tracking-tighter text-primary font-mono">{invoice.amount}</td>
                                        <td className="p-10">
                                            <div className="flex items-center gap-3 text-emerald-500">
                                                <CheckCircle2 size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">{invoice.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-10 text-right pr-16">
                                            <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/50 transition-all hover:bg-primary/10">
                                                <Download size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

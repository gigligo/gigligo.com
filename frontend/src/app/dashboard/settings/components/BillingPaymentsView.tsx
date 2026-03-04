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
                    <h2 className="text-3xl font-bold text-white tracking-tight">Billing & Payments</h2>
                    <p className="text-lg font-medium text-white/40 leading-tight">Manage your payment methods and download your invoices.</p>
                </div>
                <button className="h-14 px-8 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-3 active:scale-95">
                    <Plus size={18} />
                    ADD PAYMENT METHOD
                </button>
            </div>

            <div className="space-y-12">
                {/* Payment Methods Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <CreditCard size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Payment Methods</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {/* Primary Card */}
                        <div className="group p-8 rounded-2xl border-2 border-primary/40 bg-primary/5 relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 rotate-12">
                                <CreditCard size={140} className="text-primary" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="px-3 py-1 bg-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-full">DEFAULT</div>
                                    <button className="text-primary/40 hover:text-primary transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                                <div className="mt-10 space-y-1">
                                    <div className="text-xl font-bold tracking-widest text-white">•••• •••• •••• 4242</div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">American Express</div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Card */}
                        <div className="group p-8 rounded-2xl border border-white/5 bg-white/1 relative overflow-hidden transition-all duration-500 hover:border-white/10 hover:bg-white/2">
                            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 -rotate-12">
                                <Shield size={140} className="text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-end">
                                    <button className="text-white/10 hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                                <div className="mt-10 space-y-1">
                                    <div className="text-xl font-bold tracking-widest text-white/40 group-hover:text-white transition-colors">•••• •••• •••• 1928</div>
                                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">Visa Business</div>
                                </div>
                            </div>
                        </div>

                        {/* Add New Placeholder */}
                        <button className="group p-8 rounded-2xl border-2 border-dashed border-white/5 bg-white/1 flex flex-col items-center justify-center text-white/10 hover:text-primary hover:border-primary/40 transition-all duration-500 min-h-[160px] hover:bg-primary/5">
                            <PlusCircle size={32} strokeWidth={1} className="mb-3 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Connect New Method</span>
                        </button>
                    </div>
                </motion.div>

                {/* Billing History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl shadow-black relative"
                >
                    <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white/1">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                                <Receipt size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Ledger History</h3>
                        </div>
                        <button className="text-[10px] font-bold text-white/30 hover:text-primary uppercase tracking-widest transition-all flex items-center gap-3 group">
                            EXPORT AS CSV <Download size={14} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-black/40">
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest pl-12">Date</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">Description</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">Amount</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/2">
                                {[
                                    { date: 'Oct 12, 2024', desc: 'Enterprise Membership - Annual', amount: '$4,999.00', status: 'Completed' },
                                    { date: 'Sep 05, 2024', desc: 'Escrow Funding (Project Alpha)', amount: '$12,500.00', status: 'Completed' },
                                    { date: 'Aug 21, 2024', desc: 'Additional Team Seats (x5)', amount: '$495.00', status: 'Completed' },
                                ].map((invoice, i) => (
                                    <tr key={i} className="hover:bg-white/2 transition-colors group">
                                        <td className="p-8 text-lg font-bold tracking-tight text-white/40 group-hover:text-white transition-colors pl-12">{invoice.date}</td>
                                        <td className="p-8 text-sm font-medium text-white/20 group-hover:text-white/40 transition-colors">{invoice.desc}</td>
                                        <td className="p-8 text-lg font-bold tracking-tight text-primary font-mono">{invoice.amount}</td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2 text-emerald-500">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{invoice.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right pr-12">
                                            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover:text-primary group-hover:border-primary/40 transition-all hover:bg-primary/5">
                                                <Download size={18} />
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

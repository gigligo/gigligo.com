'use client';

import { motion } from 'framer-motion';
import {
    Zap,
    Shield,
    Trophy,
    CheckCircle2,
    Activity,
    Lock,
    UserPlus,
    Crown,
    Star,
    Layers,
    ChevronRight
} from 'lucide-react';

export function MembershipView() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Membership <span className="text-primary text-sm font-medium uppercase tracking-widest ml-4 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">Elite Status</span></h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Review your current plan privileges and subscription status.</p>
            </div>

            {/* Active Tier Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-black group"
            >
                <div className="absolute top-0 right-0 w-120 h-120 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-start xl:items-center justify-between">
                    <div className="flex-1 space-y-10 text-center xl:text-left">
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                            <Star className="text-primary fill-primary" size={16} />
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] italic">Active Mission Tier</span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                                Executive <span className="text-primary font-normal">Elite</span>
                            </h3>
                            <p className="text-lg font-medium text-white/30 max-w-2xl leading-relaxed mx-auto xl:mx-0">
                                Highest-priority clearance. Benefits include 0% escrow overhead, unlimited active projects, and instant support response.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                            <button className="h-16 px-10 bg-primary text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-3">
                                <Layers size={18} />
                                UPGRADE OPTIONS
                            </button>
                            <button className="h-16 px-10 bg-white/5 border border-white/10 text-white/40 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all">
                                MANAGE PLAN
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 rounded-3xl p-10 w-full xl:w-[420px] shrink-0 backdrop-blur-xl shadow-xl relative group/pricing">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/pricing:opacity-100 transition-opacity rounded-3xl" />

                        <div className="text-center mb-8 pb-8 border-b border-white/5">
                            <p className="text-6xl font-bold text-white tracking-tight">$499<span className="text-xl text-white/30">/mo</span></p>
                            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest mt-3">BILLED ANNUALLY</p>
                        </div>

                        <ul className="space-y-4">
                            {[
                                '0% Escrow Fee (Elite Only)',
                                'Unlimited Active Projects',
                                'Priority Network Support',
                                'Verification Badge Included',
                                '20 Member Team Seats'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-5 text-sm font-medium text-white/40 group-hover:text-white/60 transition-colors">
                                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Other Available Plans Grid */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Activity size={20} className="text-white/20" />
                    <h3 className="text-2xl font-bold text-white/40 tracking-tight">Available Plans</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Basic Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/3 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="space-y-5">
                            <h4 className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Entry Level</h4>
                            <div className="space-y-1">
                                <h5 className="text-3xl font-bold text-white tracking-tight">Free</h5>
                                <p className="text-2xl font-bold text-primary tracking-tight">$0<span className="text-sm text-white/20 font-medium ml-1">/mo</span></p>
                            </div>
                            <ul className="space-y-3 pt-6 border-t border-white/5">
                                <li className="text-xs font-medium text-white/30 flex items-center gap-3"><Lock size={12} className="text-white/10" /> 5% ESCROW FEE</li>
                                <li className="text-xs font-medium text-white/30 flex items-center gap-3"><Lock size={12} className="text-white/10" /> 3 ACTIVE PROJECTS</li>
                                <li className="text-xs font-medium text-white/30 flex items-center gap-3"><Lock size={12} className="text-white/10" /> STANDARD SUPPORT</li>
                            </ul>
                        </div>
                        <button className="w-full h-14 bg-white/5 mt-8 text-white/30 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all">
                            Downgrade
                        </button>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-10 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/3 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="space-y-5">
                            <h4 className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Performance</h4>
                            <div className="space-y-1">
                                <h5 className="text-3xl font-bold text-white tracking-tight">Pro</h5>
                                <p className="text-2xl font-bold text-primary tracking-tight">$99<span className="text-sm text-white/20 font-medium ml-1">/mo</span></p>
                            </div>
                            <ul className="space-y-3 pt-6 border-t border-white/5">
                                <li className="text-xs font-medium text-white/30 flex items-center gap-3"><Shield size={12} className="text-primary/40" /> 2.5% ESCROW FEE</li>
                                <li className="text-xs font-medium text-white/30 flex items-center gap-3"><Zap size={12} className="text-primary/40" /> 15 ACTIVE PROJECTS</li>
                                <li className="text-xs font-medium text-white/30 flex items-center gap-3"><CheckCircle2 size={12} className="text-primary/40" /> PRIORITY NETWORK</li>
                            </ul>
                        </div>
                        <button className="w-full h-14 bg-white/5 mt-8 text-white/30 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all">
                            Downgrade
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

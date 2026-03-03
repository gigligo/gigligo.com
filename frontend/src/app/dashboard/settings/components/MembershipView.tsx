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
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Rank Status</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Review your tactical tier privileges and active system subscription mandates.</p>
            </div>

            {/* Active Tier Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/2 border border-primary/20 rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-3xl shadow-primary/5 group"
            >
                <div className="absolute top-0 right-0 w-160 h-160 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-start xl:items-center justify-between">
                    <div className="flex-1 space-y-10 text-center xl:text-left">
                        <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                            <Star className="text-primary fill-primary" size={16} />
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] italic">Active Mission Tier</span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
                                Executive <span className="text-primary italic font-serif opacity-80">Elite.</span>
                            </h3>
                            <p className="text-xl font-bold italic text-white/20 max-w-2xl leading-relaxed mx-auto xl:mx-0">
                                Highest-priority clearance. Tactical advantages include 0% escrow overhead, unlimited mission mandates, and instantaneous signal response.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                            <button className="h-20 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-primary/40 hover:bg-primary-dark transition-all italic active:scale-95 flex items-center gap-4">
                                <Layers size={20} />
                                UPGRADE OPTIONS
                            </button>
                            <button className="h-20 px-12 bg-white/5 border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 hover:text-white transition-all italic">
                                CANCEL MANDATE
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/60 border border-white/5 rounded-[3.5rem] p-12 w-full xl:w-[450px] shrink-0 backdrop-blur-3xl shadow-3xl relative group/pricing">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/pricing:opacity-100 transition-opacity rounded-[3.5rem]" />

                        <div className="text-center mb-10 pb-10 border-b border-white/5">
                            <p className="text-7xl font-black text-white italic tracking-tighter font-mono">$499<span className="text-2xl text-white/20">/mo</span></p>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-4 italic">BILLED ANNUALLY (SYNCED)</p>
                        </div>

                        <ul className="space-y-6">
                            {[
                                '0% Escrow Surcharge (Elite)',
                                'Infinite Mission Mandates',
                                'Direct Signal Response Unit',
                                'Embedded Identity Verification',
                                '20 Tactical Team Seats'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-6 text-lg font-bold italic text-white/30 group-hover:text-white/60 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Other Available Plans Grid */}
            <div className="space-y-10">
                <div className="flex items-center gap-6">
                    <Activity size={24} className="text-white/20" />
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter opacity-40">Alternative Tiers</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Basic Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-12 rounded-[3.5rem] border border-white/5 bg-white/1 transition-all duration-700 hover:border-white/20 group relative overflow-hidden"
                    >
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Entry Level</h4>
                            <div className="space-y-2">
                                <h5 className="text-4xl font-black text-white italic uppercase tracking-tighter">Initiate.</h5>
                                <p className="text-4xl font-black font-mono text-primary italic">$0<span className="text-lg text-white/20 font-sans">/mo</span></p>
                            </div>
                            <ul className="space-y-4 pt-6 border-t border-white/5">
                                <li className="text-sm font-bold italic text-white/20 flex items-center gap-4"><Lock size={14} className="text-white/10" /> 5% ESCROW SURCHARGE</li>
                                <li className="text-sm font-bold italic text-white/20 flex items-center gap-4"><Lock size={14} className="text-white/10" /> 3 ACTIVE MANDATES</li>
                                <li className="text-sm font-bold italic text-white/20 flex items-center gap-4"><Lock size={14} className="text-white/10" /> PUBLIC UPLINK SUPPORT</li>
                            </ul>
                        </div>
                        <button className="w-full h-16 bg-white/5 mt-10 text-white/20 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 hover:text-white transition-all italic">
                            DOWNGRADE TO INITIATE
                        </button>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-12 rounded-[3.5rem] border border-white/5 bg-white/1 transition-all duration-700 hover:border-white/20 group relative overflow-hidden"
                    >
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Performance Unit</h4>
                            <div className="space-y-2">
                                <h5 className="text-4xl font-black text-white italic uppercase tracking-tighter">Operative.</h5>
                                <p className="text-4xl font-black font-mono text-primary italic">$99<span className="text-lg text-white/20 font-sans">/mo</span></p>
                            </div>
                            <ul className="space-y-4 pt-6 border-t border-white/5">
                                <li className="text-sm font-bold italic text-white/20 flex items-center gap-4"><Shield size={14} className="text-primary/40" /> 2.5% ESCROW SURCHARGE</li>
                                <li className="text-sm font-bold italic text-white/20 flex items-center gap-4"><Zap size={14} className="text-primary/40" /> 15 ACTIVE MANDATES</li>
                                <li className="text-sm font-bold italic text-white/20 flex items-center gap-4"><CheckCircle2 size={14} className="text-primary/40" /> PRIORITY SIGNAL UPLINK</li>
                            </ul>
                        </div>
                        <button className="w-full h-16 bg-white/5 mt-10 text-white/20 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 hover:text-white transition-all italic">
                            DOWNGRADE TO OPERATIVE
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

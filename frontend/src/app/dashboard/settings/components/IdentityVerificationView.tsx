'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Fingerprint,
    ShieldCheck,
    ShieldAlert,
    Gavel,
    CheckCircle2,
    Lock,
    Zap,
    ArrowRight,
    Activity,
    UserCheck,
    Scan
} from 'lucide-react';

export function IdentityVerificationView() {
    const [status] = useState<'unverified' | 'pending' | 'verified'>('unverified');

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Credential Auth</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Secure your operative terminal and establish high-trust clearance with a Verified Badge.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                {/* Protocol Status & Steps */}
                <div className="xl:col-span-3 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                    >
                        {status === 'unverified' && (
                            <div className="absolute top-0 right-0 w-120 h-120 bg-red-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        )}

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                                <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 ${status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-3xl shadow-emerald-500/20' : 'bg-red-500/10 border-red-500/30 text-red-500 shadow-3xl shadow-red-500/20'}`}>
                                    {status === 'verified' ? <ShieldCheck size={48} strokeWidth={1} /> : <ShieldAlert size={48} strokeWidth={1} className="animate-pulse" />}
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4 justify-center md:justify-start">
                                        {status === 'verified' ? 'CLEARANCE CONFIRMED' : 'ACTION REQUIRED'}
                                    </h3>
                                    <p className="text-xl font-bold italic text-white/20 leading-tight max-w-md">
                                        {status === 'verified'
                                            ? 'Your identity parameters have been synchronized with the global matrix.'
                                            : 'Complete biometric and credential upload to unlock full financial extraction.'}
                                    </p>
                                </div>
                            </div>

                            {status === 'unverified' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 gap-8">
                                        <StepRow
                                            number="01"
                                            title="COV-GOV ID SUBMISSION"
                                            desc="Passport, Driver Relay, or National National Matrix ID upload."
                                            icon={Fingerprint}
                                        />
                                        <StepRow
                                            number="02"
                                            title="BIOMETRIC NEURAL SCAN"
                                            desc="Live high-fidelity optical matching against provided credentials."
                                            icon={Scan}
                                        />
                                    </div>

                                    <div className="pt-12 border-t border-white/5 space-y-8">
                                        <button className="h-24 w-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-3xl shadow-3xl shadow-primary/40 hover:bg-primary-dark transition-all flex items-center justify-center gap-6 italic group/btn active:scale-[0.98]">
                                            INITIALIZE CLEARANCE PROTOCOL
                                            <ArrowRight size={24} className="group-hover/btn:translate-x-4 transition-transform" />
                                        </button>
                                        <div className="flex items-center justify-center gap-4 text-white/10 italic">
                                            <Lock size={14} />
                                            <p className="text-[9px] font-black uppercase tracking-[0.4em]">SYNCED VIA SECURE IDENTITY GATWAY 4.0</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {status === 'verified' && (
                                <div className="pt-10 border-t border-white/5 flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-white italic uppercase tracking-widest">IDENTITY CONDUIT ACTIVE</p>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">TIMESTAMP SYNC: {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Compliance Sidebar */}
                <div className="xl:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/60 border border-white/5 rounded-[3.5rem] p-12 backdrop-blur-3xl shadow-3xl relative overflow-hidden group/audit"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                            <Gavel size={120} className="text-white" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-2xl">
                                    <Activity size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Mission Compliance</h4>
                            </div>

                            <p className="text-lg font-bold italic text-white/20 leading-relaxed">
                                GIGLIGO adheres to strict global AML (Anti-Money Laundering) and KYC (Know Your Customer) protocols.
                                We audit every operative to ensure grid safety and prevent decentralized financial anomalies.
                            </p>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic mb-6">CLEARANCE ADVANTAGES:</p>
                                <ul className="space-y-4">
                                    <FeatureItem label="UNRESTRICTED CONTRACT LIMITS" />
                                    <FeatureItem label="PRIORITY ESCROW LIQUIDITY" />
                                    <FeatureItem label="INSTANT EXTRACTION BUFFERS" />
                                    <FeatureItem label="VERIFIED OPERATIVE BADGE" />
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function StepRow({ number, title, desc, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-10 p-8 rounded-4xl border border-white/5 bg-white/1 hover:bg-white/3 transition-all duration-700 group">
            <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-primary group-hover:border-primary/20 transition-all duration-700 shadow-2xl">
                {number}
            </div>
            <div className="flex-1 space-y-1">
                <h4 className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-sm font-bold italic text-white/20">{desc}</p>
            </div>
            <Icon size={24} className="text-white/10 group-hover:text-primary transition-colors duration-700" />
        </div>
    );
}

function FeatureItem({ label }: { label: string }) {
    return (
        <li className="flex items-center gap-4 text-xs font-black italic text-white/40 group-hover:text-white/60 transition-colors">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 size={10} />
            </div>
            <span className="tracking-[0.2em]">{label}</span>
        </li>
    );
}

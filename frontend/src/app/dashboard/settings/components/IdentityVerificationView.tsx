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
                <h2 className="text-3xl font-bold text-white tracking-tight">Identity Verification</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Secure your account and establish trust by verifying your identity documents.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
                {/* Protocol Status & Steps */}
                <div className="xl:col-span-3 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden"
                    >
                        {status === 'unverified' && (
                            <div className="absolute top-0 right-0 w-120 h-120 bg-red-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        )}

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
                                <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center transition-all duration-700 ${status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-red-500/10 border-red-500/30 text-red-500 shadow-xl shadow-red-500/20'}`}>
                                    {status === 'verified' ? <ShieldCheck size={40} strokeWidth={1.5} /> : <ShieldAlert size={40} strokeWidth={1.5} className="animate-pulse" />}
                                </div>
                                <div className="text-center md:text-left space-y-1">
                                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4 justify-center md:justify-start">
                                        {status === 'verified' ? 'Verification Complete' : 'Verification Required'}
                                    </h3>
                                    <p className="text-base font-medium text-white/40 leading-tight max-w-md">
                                        {status === 'verified'
                                            ? 'Your identity has been verified. You have full access to all platform features.'
                                            : 'Please complete the verification process to unlock higher withdrawal limits.'}
                                    </p>
                                </div>
                            </div>

                            {status === 'unverified' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 gap-8">
                                        <StepRow
                                            number="01"
                                            title="Government ID"
                                            desc="Upload a clear photo of your passport or driver's license."
                                            icon={Fingerprint}
                                        />
                                        <StepRow
                                            number="02"
                                            title="Liveness Check"
                                            desc="A quick selfie scan to verify your identity against your documents."
                                            icon={Scan}
                                        />
                                    </div>

                                    <div className="pt-10 border-t border-white/5 space-y-6">
                                        <button className="h-16 w-full bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-4 group/btn active:scale-[0.98]">
                                            START VERIFICATION
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                        </button>
                                        <div className="flex items-center justify-center gap-3 text-white/10 font-medium">
                                            <Lock size={12} />
                                            <p className="text-[9px] font-bold uppercase tracking-widest">SECURE DATA TRANSMISSION ACTIVE</p>
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
                                        <p className="text-base font-bold text-white tracking-wide">Identity Verified</p>
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Verified on {new Date().toLocaleDateString()}</p>
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
                        className="bg-black/40 border border-white/5 rounded-3xl p-10 backdrop-blur-3xl shadow-xl relative overflow-hidden group/audit"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                            <Gavel size={120} className="text-white" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg">
                                    <Activity size={20} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg font-bold text-white tracking-tight">Compliance</h4>
                            </div>

                            <p className="text-base font-medium text-white/20 leading-relaxed">
                                Gigligo adheres to global AML and KYC protocols to ensure platform safety and security for all members.
                            </p>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">MEMBER BENEFITS:</p>
                                <ul className="space-y-4">
                                    <FeatureItem label="HIGHER WITHDRAWAL LIMITS" />
                                    <FeatureItem label="PRIORITY DISPUTE RESOLUTION" />
                                    <FeatureItem label="FASTER PAYMENT PROCESSING" />
                                    <FeatureItem label="VERIFIED MEMBER BADGE" />
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
        <div className="flex items-center gap-8 p-6 rounded-2xl border border-white/5 bg-white/1 hover:bg-white/2 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-[10px] font-bold text-white/20 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500 shadow-lg">
                {number}
            </div>
            <div className="flex-1 space-y-0.5">
                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-sm font-medium text-white/20">{desc}</p>
            </div>
            <Icon size={24} className="text-white/10 group-hover:text-primary transition-colors duration-700" />
        </div>
    );
}

function FeatureItem({ label }: { label: string }) {
    return (
        <li className="flex items-center gap-3 text-xs font-bold text-white/40 group-hover:text-white/60 transition-colors">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 size={10} />
            </div>
            <span className="tracking-wide">{label}</span>
        </li>
    );
}

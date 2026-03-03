'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    User,
    ShieldCheck,
    Briefcase,
    Wallet,
    ChevronRight,
    CheckCircle2,
    Lock,
    Globe,
    Activity,
    Star,
    ArrowRight
} from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Identity Dossier', icon: User, description: 'Establish your professional record, bio, and operational rate.', link: '/dashboard/profile' },
    { id: 2, title: 'Security Clearance', icon: ShieldCheck, description: 'Execute KYC protocols to authorize high-value engagement.', link: '/dashboard/kyc' },
    { id: 3, title: 'Service Deployment', icon: Briefcase, description: 'Display your unique capabilities within the global network.', link: '/dashboard' },
    { id: 4, title: 'Capital Gateway', icon: Wallet, description: 'Synchronize financial nodes for decentralized payouts.', link: '/dashboard/earnings' },
];

export default function OnboardingPage() {
    const { data: session } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const markComplete = (step: number) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps([...completedSteps, step]);
        }
        if (step < STEPS.length - 1) setCurrentStep(step + 1);
    };

    const progress = (completedSteps.length / STEPS.length) * 100;

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Tactical Header */}
                <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                    <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-32 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-primary/20 animate-pulse border border-primary/30">
                                <Zap className="text-primary w-10 h-10" />
                            </div>

                            <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic mb-8">
                                Welcome, <span className="text-primary not-italic">{session?.user?.name?.split(' ')[0] || 'Operative'}.</span>
                            </h1>
                            <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl mx-auto leading-relaxed">
                                Initialize your deployment protocols to authorize high-frequency engagement across the global professional architecture.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Status Visualization */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Initialization Progress</h4>
                                <p className="text-2xl font-black italic tracking-tighter">{Math.round(progress)}<span className="text-primary">%</span> COMPLETE</p>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(0,124,255,0.8)]"
                                />
                            </div>
                        </div>

                        {/* Initialization Steps */}
                        <div className="space-y-6">
                            {STEPS.map((step, i) => (
                                <InitializationCard
                                    key={step.id}
                                    step={step}
                                    index={i}
                                    isComplete={completedSteps.includes(i)}
                                    isActive={currentStep === i}
                                    onComplete={() => markComplete(i)}
                                />
                            ))}
                        </div>

                        {/* Secondary Protocols */}
                        <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
                            <div className="flex items-center gap-6">
                                <ShieldCheck size={24} className="text-primary" />
                                <p className="text-lg font-bold italic text-white tracking-tight">ENCRYPTED OPERATIVE INITIALIZATION</p>
                            </div>
                            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-colors flex items-center gap-4 group italic">
                                SKIP INITIALIZATION HUB <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InitializationCard({ step, index, isComplete, isActive, onComplete }: any) {
    const Icon = step.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group bg-white/2 border transition-all duration-700 rounded-[3rem] p-10 md:p-12 backdrop-blur-3xl relative overflow-hidden ${isActive ? 'border-primary/40 shadow-3xl shadow-primary/5' :
                    isComplete ? 'border-emerald-500/20 opacity-60' :
                        'border-white/5 opacity-40 hover:opacity-100'
                }`}
        >
            {isComplete && (
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/30" />
            )}
            {isActive && (
                <div className="absolute top-0 left-0 w-2 h-full bg-primary animate-pulse" />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex items-center gap-10 flex-1">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all duration-700 ${isComplete ? 'bg-emerald-500/10 text-emerald-500' :
                            isActive ? 'bg-primary text-white scale-110' :
                                'bg-white/5 text-white/20'
                        }`}>
                        {isComplete ? <CheckCircle2 size={32} /> : <Icon size={32} strokeWidth={isActive ? 2.5 : 1.5} />}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isComplete ? 'text-white/40 line-through' : 'text-white'}`}>
                                {step.title}
                            </h3>
                            {isActive && (
                                <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse italic">Active Protocol</span>
                            )}
                        </div>
                        <p className="text-lg font-bold italic text-white/20 leading-tight">{step.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {isComplete ? (
                        <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.4em] rounded-2xl italic">
                            SYNCHRONIZED
                        </div>
                    ) : (
                        <Link
                            href={step.link}
                            onClick={onComplete}
                            className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all italic active:scale-95 flex items-center gap-4 ${isActive ? 'bg-primary text-white shadow-2xl shadow-primary/30' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            INITIATE <ChevronRight size={14} />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

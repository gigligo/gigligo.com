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

                    <div className="max-w-7xl mx-auto px-10 md:px-20 py-24 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/20 border border-primary/20">
                                <Zap className="text-primary w-8 h-8" />
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                                Welcome, <span className="text-primary">{(session?.user as any)?.name?.split(' ')[0] || 'Operative'}</span>.
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-white/40 max-w-2xl mx-auto leading-relaxed">
                                Let&apos;s get your profile finalized and secure so you can start working on world-class projects.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* Status Visualization */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest">Setup Progress</h4>
                                <p className="text-xl font-bold tracking-tight text-white">{Math.round(progress)}% <span className="text-white/40 font-medium">Complete</span></p>
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
                        <div className="pt-16 border-t border-white/5 flex flex-col items-center gap-10 text-center">
                            <div className="flex items-center gap-4 text-white/40">
                                <ShieldCheck size={20} className="text-primary/60" />
                                <p className="text-sm font-bold tracking-tight uppercase">Secured by Gigligo Platform</p>
                            </div>
                            <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-primary transition-colors flex items-center gap-4 group">
                                Skip for now <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
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
            className={`group bg-white/2 border transition-all duration-500 rounded-3xl p-8 md:p-10 backdrop-blur-3xl relative overflow-hidden ${isActive ? 'border-primary/40 shadow-xl shadow-primary/5' :
                isComplete ? 'border-emerald-500/10 opacity-60' :
                    'border-white/5 opacity-40 hover:opacity-100'
                }`}
        >
            {isComplete && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/20" />
            )}
            {isActive && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex items-center gap-10 flex-1">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all duration-700 ${isComplete ? 'bg-emerald-500/10 text-emerald-500' :
                        isActive ? 'bg-primary text-white scale-110' :
                            'bg-white/5 text-white/20'
                        }`}>
                        {isComplete ? <CheckCircle2 size={32} /> : <Icon size={32} strokeWidth={isActive ? 2.5 : 1.5} />}
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className={`text-xl font-bold tracking-tight ${isComplete ? 'text-white/40 line-through' : 'text-white'}`}>
                                {step.title}
                            </h3>
                            {isActive && (
                                <span className="px-2.5 py-1 bg-primary text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Active Step</span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-white/20 leading-tight">{step.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {isComplete ? (
                        <div className="px-6 py-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                            Completed
                        </div>
                    ) : (
                        <Link
                            href={step.link}
                            onClick={onComplete}
                            className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center gap-3 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Setup <ChevronRight size={14} />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

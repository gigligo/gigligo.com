'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContractsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'completed'>('active');
    const [expandedContract, setExpandedContract] = useState<string | null>(null);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isEmployer = ['BUYER', 'EMPLOYER'].includes(role);

    if (!session) return null;

    // Sample contracts for UI demonstration
    const sampleContracts = {
        active: [
            {
                id: 'ctr-001',
                title: 'Senior AI Architect for Fintech Core',
                freelancer: 'Elena V.',
                startDate: '2024-12-01',
                endDate: '2025-03-01',
                value: '$12,000',
                status: 'IN_PROGRESS',
                milestone: '60%',
                terms: [
                    'Deliverable: Predictive modeling engine with PyTorch integration',
                    'Timeline: 12 weeks with bi-weekly milestones',
                    'Payment: 40% upfront, 60% on completion',
                    'IP: All intellectual property transfers to client upon final payment',
                    'Confidentiality: 2-year NDA covering all proprietary data'
                ]
            },
            {
                id: 'ctr-002',
                title: 'Chief Marketing Officer (Fractional)',
                freelancer: 'Marcus Chen',
                startDate: '2024-11-15',
                endDate: '2025-02-15',
                value: '$8,500',
                status: 'REVIEW',
                milestone: '85%',
                terms: [
                    'Scope: Global brand strategy overhaul for luxury segment',
                    'Weekly status reports and monthly board presentations',
                    'Payment: Monthly retainer with performance bonus',
                    'Termination: 30-day notice period for either party'
                ]
            }
        ],
        drafts: [
            {
                id: 'ctr-003',
                title: 'Executive Branding Strategy',
                freelancer: 'David O.',
                value: '$4,500',
                status: 'DRAFT',
                terms: [
                    'Mission statement and core values framework',
                    'Visual identity guidelines',
                    'Payment: Milestone-based'
                ]
            }
        ],
        completed: [
            {
                id: 'ctr-004',
                title: 'Q3 Product Launch Campaign',
                freelancer: 'Sarah J.',
                startDate: '2024-07-01',
                endDate: '2024-09-30',
                value: '$6,200',
                status: 'COMPLETED',
                milestone: '100%',
                terms: [
                    'Full-cycle launch campaign including creative, media buying, and analytics',
                    'All deliverables approved and transferred'
                ]
            }
        ]
    };

    const contracts = sampleContracts[activeTab] || [];

    const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
        IN_PROGRESS: { label: 'Operational', color: 'text-primary bg-primary/10 border-primary/20', icon: 'sensors' },
        REVIEW: { label: 'In Review', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: 'visibility' },
        DRAFT: { label: 'Drafting', color: 'text-white/20 bg-white/5 border-white/10', icon: 'edit_note' },
        COMPLETED: { label: 'Fulfilled', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: 'verified' },
        SIGNED: { label: 'Legally Bound', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: 'gavel' },
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Cinematic Legal Header */}
                <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-10 md:px-20 py-24 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-12">
                                <span className="material-symbols-outlined text-xl group-hover:-translate-x-3 transition-transform">arrow_back</span> Dashboard
                            </Link>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                <div className="space-y-6">
                                    <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic">
                                        Professional <span className="text-primary not-italic">Mandates.</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                        Legally binding professional agreements secured with high-grade encryption and escrow protection.
                                    </p>
                                </div>

                                <div className="flex gap-6">
                                    {[
                                        { label: 'Live', value: sampleContracts.active.length, icon: 'bolt' },
                                        { label: 'Protocols', value: sampleContracts.drafts.length, icon: 'contract_edit' },
                                        { label: 'Archives', value: sampleContracts.completed.length, icon: 'verified_user' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-3xl px-10 py-6 flex flex-col gap-2 min-w-[140px] shadow-2xl backdrop-blur-3xl">
                                            <span className="material-symbols-outlined text-primary text-2xl font-light">{stat.icon}</span>
                                            <div>
                                                <p className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</p>
                                                <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black mt-1">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Navigation Bar Area */}
                <div className="bg-black/20 sticky top-[72px] z-20 backdrop-blur-3xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-10 md:px-20 flex items-center justify-between py-6">
                        <div className="flex items-center gap-2">
                            {[
                                { id: 'active' as const, label: 'Operational', icon: 'sensors' },
                                { id: 'drafts' as const, label: 'Negotiation', icon: 'edit_note' },
                                { id: 'completed' as const, label: 'Fulfillment', icon: 'verified' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all relative overflow-hidden group ${activeTab === tab.id
                                        ? 'text-white'
                                        : 'text-white/30 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="contract-tab-bg" className="absolute inset-0 bg-primary z-0 shadow-lg shadow-primary/20" />
                                    )}
                                    <span className="material-symbols-outlined text-xl font-light relative z-10">{tab.icon}</span>
                                    <span className="relative z-10 italic">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {isEmployer && (
                            <Link href="/jobs/post">
                                <button className="h-14 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary hover:border-primary transition-all duration-500 flex items-center gap-4 italic shadow-2xl">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    Initiate Decree
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mandate Field */}
                <div className="max-w-7xl mx-auto px-10 md:px-20 py-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-12"
                        >
                            {contracts.length === 0 ? (
                                <div className="text-center py-48 bg-white/2 border border-white/5 rounded-[4rem] flex flex-col items-center justify-center">
                                    <span className="material-symbols-outlined text-9xl text-white/5 mb-8 font-thin">description</span>
                                    <h3 className="text-2xl font-black text-white/20 uppercase tracking-[0.5em] italic">No detected mandates.</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-8">
                                    {contracts.map((contract: any) => {
                                        const cfg = statusConfig[contract.status] || statusConfig.DRAFT;
                                        const isExpanded = expandedContract === contract.id;

                                        return (
                                            <motion.div
                                                layout
                                                key={contract.id}
                                                className={`bg-white/2 border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-700 backdrop-blur-3xl hover:border-primary/30 group ${isExpanded ? 'ring-1 ring-primary/20 shadow-[0_0_50px_rgba(0,124,255,0.1)]' : 'shadow-2xl'}`}
                                            >
                                                {/* Mandate Header */}
                                                <div
                                                    className="p-12 cursor-pointer select-none"
                                                    onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                                                >
                                                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10">
                                                        <div className="flex items-start lg:items-center gap-10 flex-1">
                                                            <div className="w-20 h-20 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors shadow-black shadow-2xl">
                                                                <span className="material-symbols-outlined text-4xl text-primary font-light">{cfg.icon}</span>
                                                            </div>
                                                            <div className="flex-1 space-y-4">
                                                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{contract.title}</h3>
                                                                    <span className={`px-5 py-1.5 text-[9px] font-black uppercase tracking-[0.4em] rounded-full border self-start ${cfg.color} italic shadow-lg`}>
                                                                        {cfg.label}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-10 text-[10px] uppercase font-black tracking-[0.4em] text-white/20 italic">
                                                                    <span className="flex items-center gap-3">
                                                                        <span className="material-symbols-outlined text-lg font-light">account_circle</span>
                                                                        {contract.freelancer}
                                                                    </span>
                                                                    <span className="flex items-center gap-3 text-primary">
                                                                        <span className="material-symbols-outlined text-lg font-light">account_balance_wallet</span>
                                                                        {contract.value}
                                                                    </span>
                                                                    {contract.startDate && (
                                                                        <span className="flex items-center gap-3">
                                                                            <span className="material-symbols-outlined text-lg font-light">schedule</span>
                                                                            {contract.startDate} • {contract.endDate}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Progress Stream */}
                                                                {contract.milestone && (
                                                                    <div className="pt-4 flex items-center gap-8">
                                                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: contract.milestone }}
                                                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                                                className="h-full bg-primary shadow-[0_0_10px_rgba(0,124,255,0.8)]"
                                                                            />
                                                                        </div>
                                                                        <span className="text-[10px] font-black text-primary italic tracking-widest">{contract.milestone} COMPLETE</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <span className={`material-symbols-outlined text-white/20 text-4xl font-thin transition-transform duration-700 hidden lg:block ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                                                                keyboard_arrow_down
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Deep Dive: Terminology & Operational Actions */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                                            className="border-t border-white/5 bg-black/40 overflow-hidden"
                                                        >
                                                            <div className="p-12 lg:p-16 space-y-12">
                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                                                    <div className="space-y-8">
                                                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] flex items-center gap-4 italic">
                                                                            <span className="material-symbols-outlined text-lg">gavel</span>
                                                                            Operational Mandates
                                                                        </h4>
                                                                        <ul className="space-y-6">
                                                                            {contract.terms.map((term: string, i: number) => (
                                                                                <li key={i} className="flex items-start gap-6 group/item">
                                                                                    <span className="material-symbols-outlined text-primary text-xl font-light mt-1 opacity-40 group-hover/item:opacity-100 transition-opacity">check_circle</span>
                                                                                    <p className="text-lg font-bold italic text-white/40 leading-relaxed group-hover/item:text-white transition-colors uppercase tracking-tight">{term}</p>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <div className="bg-white/1 border border-white/5 rounded-2xl p-10 flex flex-col justify-center items-center text-center">
                                                                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20">
                                                                            <span className="material-symbols-outlined text-4xl">shield_locked</span>
                                                                        </div>
                                                                        <h5 className="text-xl font-black uppercase italic tracking-tighter mb-4">Secured Agreement</h5>
                                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 leading-relaxed max-w-[200px]">PROTOCOL VERSION 8.1 ENCRYPTED AND AUDITED</p>
                                                                    </div>
                                                                </div>

                                                                {/* Tactical Actions */}
                                                                <div className="flex flex-wrap gap-6 pt-12 border-t border-white/5">
                                                                    {contract.status === 'DRAFT' && (
                                                                        <>
                                                                            <button className="h-16 px-12 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center gap-4 italic active:scale-95">
                                                                                <span className="material-symbols-outlined text-xl">send</span>
                                                                                Broadcast for Authorization
                                                                            </button>
                                                                            <button className="h-16 px-12 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4 italic">
                                                                                <span className="material-symbols-outlined text-xl">edit</span>
                                                                                Refine Draft
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {contract.status === 'REVIEW' && (
                                                                        <>
                                                                            <button className="h-16 px-12 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/20 flex items-center gap-4 italic active:scale-95">
                                                                                <span className="material-symbols-outlined text-xl">draw</span>
                                                                                Authorize Mandate
                                                                            </button>
                                                                            <button className="h-16 px-12 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4 italic">
                                                                                <span className="material-symbols-outlined text-xl">forum</span>
                                                                                Request Calibration
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {contract.status === 'IN_PROGRESS' && (
                                                                        <>
                                                                            <button className="h-16 px-12 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4 italic">
                                                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                                                                Analyze Intelligence
                                                                            </button>
                                                                            <button className="h-16 px-12 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4 italic">
                                                                                <span className="material-symbols-outlined text-xl">download</span>
                                                                                Extract PDF Log
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Tactical Information Segment */}
                            <div className="mt-24 bg-linear-to-r from-primary to-primary-dark rounded-[4rem] p-16 md:p-24 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-12">
                                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white shadow-2xl">
                                        <span className="material-symbols-outlined text-5xl font-light">verified_user</span>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Encrypted Escrow <span className="text-white/40">Infrastructure.</span></h4>
                                        <p className="text-white/80 text-xl font-bold italic leading-relaxed">
                                            Every mandate is secured with bank-grade encryption and institutional-level Escrow protection. Your intellectual property and capital are guarded by our elite security layer.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-10">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-2xl font-light">enhanced_encryption</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">AES-256 SECURED</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-2xl font-light">lock</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">ESCROW REINFORCED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

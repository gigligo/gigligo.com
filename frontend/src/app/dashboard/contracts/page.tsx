'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

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
        IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'pending' },
        REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'rate_review' },
        DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: 'draft' },
        COMPLETED: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200', icon: 'check_circle' },
        SIGNED: { label: 'Signed', color: 'bg-green-50 text-green-700 border-green-200', icon: 'verified' },
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 96 }}>
                {/* Editorial Header */}
                <div className="bg-nav-bg text-white py-16 md:py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute top-0 right-0 w-72 h-72 border border-white/20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-56 h-56 border border-white/10 rotate-45 translate-y-1/3"></div>
                    </div>
                    <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                        <Link href="/dashboard" className="text-xs text-white/30 hover:text-primary transition mb-6 inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                            Contracts & <span className="text-primary">Agreements.</span>
                        </h1>
                        <p className="text-white/40 text-lg max-w-xl">
                            Manage, sign, and track all your professional agreements with precision and legal clarity.
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            {[
                                { label: 'Active', value: sampleContracts.active.length, icon: 'description' },
                                { label: 'Drafts', value: sampleContracts.drafts.length, icon: 'draft' },
                                { label: 'Completed', value: sampleContracts.completed.length, icon: 'task_alt' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">{stat.icon}</span>
                                    <div>
                                        <p className="text-white font-bold text-lg">{stat.value}</p>
                                        <p className="text-white/30 text-[10px] uppercase tracking-wider font-semibold">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="border-b border-border-light bg-surface-light sticky top-0 z-20">
                    <div className="max-w-5xl mx-auto px-6 md:px-12 flex items-center gap-1 py-3">
                        {[
                            { id: 'active' as const, label: 'Active Contracts', icon: 'description' },
                            { id: 'drafts' as const, label: 'Drafts', icon: 'draft' },
                            { id: 'completed' as const, label: 'Completed', icon: 'task_alt' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === tab.id
                                        ? 'bg-nav-bg text-white shadow-sm'
                                        : 'text-text-muted hover:bg-background-light hover:text-text-main'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}

                        {isEmployer && (
                            <button className="ml-auto h-10 px-6 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">add</span>
                                New Contract
                            </button>
                        )}
                    </div>
                </div>

                {/* Contracts List */}
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                    {contracts.length === 0 ? (
                        <div className="text-center py-24 border border-border-light rounded-2xl bg-surface-light">
                            <span className="material-symbols-outlined text-5xl text-text-muted/20 mb-4">description</span>
                            <h3 className="text-xl font-bold text-text-main mb-2">No {activeTab} contracts</h3>
                            <p className="text-text-muted text-sm">
                                {activeTab === 'drafts' ? 'Create a new contract to get started.' : 'No contracts in this category yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contracts.map((contract: any) => {
                                const cfg = statusConfig[contract.status] || statusConfig.DRAFT;
                                const isExpanded = expandedContract === contract.id;

                                return (
                                    <div key={contract.id} className="bg-surface-light border border-border-light rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
                                        {/* Contract Header */}
                                        <div
                                            className="p-6 cursor-pointer"
                                            onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="p-3 bg-background-light rounded-xl border border-border-light shrink-0">
                                                        <span className="material-symbols-outlined text-2xl text-primary">{cfg.icon}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-bold text-text-main text-lg">{contract.title}</h3>
                                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${cfg.color}`}>
                                                                {cfg.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mt-2">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-sm">person</span>
                                                                {contract.freelancer}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-primary font-semibold">
                                                                <span className="material-symbols-outlined text-sm">payments</span>
                                                                {contract.value}
                                                            </span>
                                                            {contract.startDate && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                                    {contract.startDate} – {contract.endDate}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Progress Bar */}
                                                        {contract.milestone && (
                                                            <div className="mt-4 flex items-center gap-3">
                                                                <div className="flex-1 h-2 bg-background-light rounded-full overflow-hidden border border-border-light">
                                                                    <div
                                                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                                                        style={{ width: contract.milestone }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs font-bold text-primary">{contract.milestone}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <span className={`material-symbols-outlined text-text-muted/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                        expand_more
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded: Terms & Actions */}
                                        {isExpanded && (
                                            <div className="border-t border-border-light bg-background-light px-6 py-6">
                                                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-primary">gavel</span>
                                                    Contract Terms
                                                </h4>
                                                <ul className="space-y-3 mb-6">
                                                    {contract.terms.map((term: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                                                            <span className="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0">check_circle</span>
                                                            {term}
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                                                    {contract.status === 'DRAFT' && (
                                                        <>
                                                            <button className="h-10 px-6 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg">send</span>
                                                                Send for Signature
                                                            </button>
                                                            <button className="h-10 px-6 bg-surface-light border border-border-light text-text-main text-sm font-semibold rounded-lg hover:border-primary/30 transition flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg">edit</span>
                                                                Edit Draft
                                                            </button>
                                                        </>
                                                    )}
                                                    {contract.status === 'REVIEW' && (
                                                        <>
                                                            <button className="h-10 px-6 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg">draw</span>
                                                                Sign Agreement
                                                            </button>
                                                            <button className="h-10 px-6 bg-surface-light border border-border-light text-text-main text-sm font-semibold rounded-lg hover:border-primary/30 transition flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg">chat</span>
                                                                Request Changes
                                                            </button>
                                                        </>
                                                    )}
                                                    {contract.status === 'IN_PROGRESS' && (
                                                        <>
                                                            <button className="h-10 px-6 bg-surface-light border border-border-light text-text-main text-sm font-semibold rounded-lg hover:border-primary/30 transition flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                                View Full Contract
                                                            </button>
                                                            <button className="h-10 px-6 bg-surface-light border border-border-light text-text-main text-sm font-semibold rounded-lg hover:border-primary/30 transition flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-lg">download</span>
                                                                Download PDF
                                                            </button>
                                                        </>
                                                    )}
                                                    {contract.status === 'COMPLETED' && (
                                                        <button className="h-10 px-6 bg-surface-light border border-border-light text-text-main text-sm font-semibold rounded-lg hover:border-primary/30 transition flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-lg">download</span>
                                                            Download Agreement
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Why Contracts Info */}
                    <div className="mt-10 bg-nav-bg text-white rounded-xl p-8 border border-white/5">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl shrink-0">verified_user</span>
                            <div>
                                <h4 className="font-bold text-lg mb-2 tracking-tight">Secure Contract Management</h4>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    GIGLIGO contracts are legally binding agreements that protect both parties. All contracts include escrow payment protection,
                                    IP transfer clauses, and confidentiality terms. Your agreements are encrypted and stored securely with full audit trails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

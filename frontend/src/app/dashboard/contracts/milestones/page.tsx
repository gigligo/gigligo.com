'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

interface Milestone {
    id: number;
    title: string;
    description: string;
    amount: number;
    deadline: string;
    status: 'draft' | 'funded' | 'in_progress' | 'submitted' | 'approved' | 'disputed';
}

const INITIAL_MILESTONES: Milestone[] = [
    { id: 1, title: 'Discovery & Architecture', description: 'Technical requirements gathering, system design documentation, and architecture review.', amount: 5000, deadline: '2024-11-15', status: 'approved' },
    { id: 2, title: 'Core Backend Development', description: 'REST API, database schema implementation, authentication, and authorization middleware.', amount: 12000, deadline: '2024-12-01', status: 'in_progress' },
    { id: 3, title: 'Frontend Implementation', description: 'Complete UI build with responsive layouts, state management, and API integration.', amount: 15000, deadline: '2024-12-20', status: 'funded' },
    { id: 4, title: 'QA, Deployment & Handoff', description: 'End-to-end testing, CI/CD pipeline setup, staging/production deployment, and documentation handoff.', amount: 8000, deadline: '2025-01-05', status: 'draft' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    draft: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100', icon: 'edit_note' },
    funded: { label: 'Funded', color: 'text-blue-700', bg: 'bg-blue-100', icon: 'account_balance' },
    in_progress: { label: 'In Progress', color: 'text-primary', bg: 'bg-primary/10', icon: 'pending' },
    submitted: { label: 'Submitted for Review', color: 'text-purple-700', bg: 'bg-purple-100', icon: 'rate_review' },
    approved: { label: 'Approved & Paid', color: 'text-green-700', bg: 'bg-green-100', icon: 'check_circle' },
    disputed: { label: 'Disputed', color: 'text-red-700', bg: 'bg-red-100', icon: 'gavel' },
};

export default function MilestoneContractPage() {
    const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMs, setNewMs] = useState({ title: '', description: '', amount: '', deadline: '' });

    const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);
    const paidOut = milestones.filter(m => m.status === 'approved').reduce((sum, m) => sum + m.amount, 0);
    const inEscrow = milestones.filter(m => ['funded', 'in_progress', 'submitted'].includes(m.status)).reduce((sum, m) => sum + m.amount, 0);

    const handleAddMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        const ms: Milestone = {
            id: Date.now(),
            title: newMs.title,
            description: newMs.description,
            amount: parseInt(newMs.amount) || 0,
            deadline: newMs.deadline,
            status: 'draft',
        };
        setMilestones([...milestones, ms]);
        setNewMs({ title: '', description: '', amount: '', deadline: '' });
        setShowAddForm(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Header */}
                <div className="border-b border-border-light bg-surface-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-2 pointer-events-none" />
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Link href="/dashboard/contracts" className="text-text-muted hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    </Link>
                                    <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">Milestone Contract Builder</h1>
                                </div>
                                <p className="text-text-muted mt-2 text-sm max-w-xl pl-10">
                                    Break enterprise contracts into staged payout gates. Each milestone locks funds in escrow until deliverables are approved.
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button className="px-5 py-2.5 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-xl hover:border-primary/50 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">download</span> Export PDF
                                </button>
                                <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">send</span> Send to Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-8">

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(200,157,40,0.15)_0%,transparent_60%)] pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Total Contract Value</p>
                                <p className="text-2xl font-black text-primary font-mono">PKR {totalValue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Paid Out</p>
                            <p className="text-2xl font-black text-green-600 font-mono">PKR {paidOut.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">In Escrow</p>
                            <p className="text-2xl font-black text-blue-600 font-mono">PKR {inEscrow.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Milestones</p>
                            <p className="text-2xl font-black text-text-main">{milestones.filter(m => m.status === 'approved').length}/{milestones.length}</p>
                            <div className="w-full bg-border-light rounded-full h-1.5 mt-3 overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all duration-700"
                                    style={{ width: `${(milestones.filter(m => m.status === 'approved').length / milestones.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Milestones Timeline */}
                    <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-text-main">Milestone Breakdown</h3>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                Add Milestone
                            </button>
                        </div>

                        <div className="space-y-6">
                            {milestones.map((ms, i) => {
                                const cfg = STATUS_CONFIG[ms.status];
                                return (
                                    <div key={ms.id} className="flex gap-5">
                                        {/* Timeline Connector */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
                                                <span className="material-symbols-outlined text-xl">{cfg.icon}</span>
                                            </div>
                                            {i < milestones.length - 1 && (
                                                <div className={`w-0.5 flex-1 mt-2 ${ms.status === 'approved' ? 'bg-green-300' : 'bg-border-light'}`} />
                                            )}
                                        </div>

                                        {/* Milestone Content */}
                                        <div className={`flex-1 border rounded-2xl p-6 transition-all ${ms.status === 'in_progress' ? 'border-primary/30 bg-primary/5 shadow-md shadow-primary/5' : 'border-border-light'
                                            }`}>
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-lg font-bold text-text-main">Milestone {i + 1}: {ms.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-text-muted leading-relaxed">{ms.description}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xl font-black text-text-main font-mono">PKR {ms.amount.toLocaleString()}</p>
                                                    <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${cfg.bg} ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border-light">
                                                <span className="text-xs text-text-muted flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    Due: {ms.deadline}
                                                </span>
                                                {ms.status === 'in_progress' && (
                                                    <button className="ml-auto px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                                                        Submit Deliverables
                                                    </button>
                                                )}
                                                {ms.status === 'funded' && (
                                                    <button className="ml-auto px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                                        Begin Work
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Milestone Form */}
                        {showAddForm && (
                            <form onSubmit={handleAddMilestone} className="mt-8 pt-8 border-t border-border-light space-y-5 animate-fade-in">
                                <h4 className="text-sm font-bold text-text-main mb-4">New Milestone</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Title</label>
                                        <input type="text" value={newMs.title} onChange={e => setNewMs({ ...newMs, title: e.target.value })} required
                                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                            placeholder="e.g. Phase 5 — Testing"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Amount (PKR)</label>
                                        <input type="number" value={newMs.amount} onChange={e => setNewMs({ ...newMs, amount: e.target.value })} required min="1000"
                                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                            placeholder="e.g. 10000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Description</label>
                                    <textarea value={newMs.description} onChange={e => setNewMs({ ...newMs, description: e.target.value })} rows={2}
                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all resize-y"
                                        placeholder="Describe the deliverables for this milestone..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Deadline</label>
                                    <input type="date" value={newMs.deadline} onChange={e => setNewMs({ ...newMs, deadline: e.target.value })}
                                        className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-lg">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">Add Milestone</button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

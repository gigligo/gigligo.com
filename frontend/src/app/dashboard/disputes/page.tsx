'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

// Mock dispute data
const MOCK_DISPUTES = [
    {
        id: 'DSP-2024-001',
        contractId: 'GIG-EX-2024-8901',
        contractTitle: 'Mobile App Redesign — Phase 2',
        opponent: 'Global Tech Partners Inc.',
        amount: 15000,
        status: 'under_review',
        openedAt: '2024-10-10',
        milestone: 'Milestone 2 — UI Implementation',
        reason: 'Deliverables do not match the agreed scope in Exhibit A of the contract.',
    },
    {
        id: 'DSP-2024-002',
        contractId: 'GIG-EX-2024-8845',
        contractTitle: 'Data Pipeline Architecture',
        opponent: 'FinServe Holdings',
        amount: 8500,
        status: 'resolved',
        openedAt: '2024-09-22',
        milestone: 'Full Project',
        reason: 'Client claims incomplete documentation for the ETL pipeline configuration.',
        resolution: 'Arbitrator ruled in favor of Consultant. Funds released in full.',
    },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    'open': { label: 'Open', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    'under_review': { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-100' },
    'resolved': { label: 'Resolved', color: 'text-green-700', bg: 'bg-green-100' },
    'escalated': { label: 'Escalated', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function DisputesPage() {
    const [disputes] = useState(MOCK_DISPUTES);
    const [selectedDispute, setSelectedDispute] = useState<typeof MOCK_DISPUTES[0] | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newDispute, setNewDispute] = useState({ contractId: '', reason: '', evidence: '' });

    const handleSubmitDispute = (e: React.FormEvent) => {
        e.preventDefault();
        setShowNewForm(false);
        setNewDispute({ contractId: '', reason: '', evidence: '' });
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
                                    <Link href="/dashboard" className="text-text-muted hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    </Link>
                                    <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
                                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">Resolution Center</h1>
                                </div>
                                <p className="text-text-muted mt-2 text-sm md:text-base max-w-xl pl-10">
                                    Formal dispute resolution and escrow arbitration for active contracts.
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowNewForm(true); setSelectedDispute(null); }}
                                className="px-6 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2 shrink-0"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                Open New Dispute
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Disputes List */}
                        <div className="w-full lg:w-96 shrink-0 space-y-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 pl-2">Your Disputes ({disputes.length})</h3>
                            {disputes.map(d => {
                                const s = STATUS_MAP[d.status] || STATUS_MAP['open'];
                                const isActive = selectedDispute?.id === d.id;
                                return (
                                    <button
                                        key={d.id}
                                        onClick={() => { setSelectedDispute(d); setShowNewForm(false); }}
                                        className={`w-full text-left bg-surface-light border rounded-2xl p-5 transition-all hover:shadow-md ${isActive ? 'border-primary shadow-lg shadow-primary/10' : 'border-border-light'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-mono font-bold text-text-muted">{d.id}</span>
                                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${s.bg} ${s.color}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-text-main text-sm mb-1 leading-snug">{d.contractTitle}</h4>
                                        <p className="text-xs text-text-muted">vs. {d.opponent}</p>
                                        <div className="mt-3 pt-3 border-t border-border-light flex justify-between text-xs text-text-muted">
                                            <span>PKR {d.amount.toLocaleString()} at stake</span>
                                            <span>{d.openedAt}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Detail Panel */}
                        <div className="flex-1 w-full min-w-0">
                            {showNewForm ? (
                                /* New Dispute Form */
                                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-10 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-text-main mb-2">Open a New Dispute</h2>
                                    <p className="text-text-muted text-sm mb-8">
                                        Opening a dispute will immediately lock the remaining milestone funds in escrow. An internal arbitrator will be assigned within 24 hours.
                                    </p>

                                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-red-500 text-xl shrink-0 mt-0.5">warning</span>
                                            <div>
                                                <h4 className="font-bold text-red-700 text-sm mb-1">Caution</h4>
                                                <p className="text-xs text-red-600 leading-relaxed">
                                                    Disputes are a formal process. Once opened, your account's trust score may be affected. We strongly recommend attempting to resolve the issue through direct messaging first.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmitDispute} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Contract ID</label>
                                            <input
                                                type="text"
                                                value={newDispute.contractId}
                                                onChange={e => setNewDispute({ ...newDispute, contractId: e.target.value })}
                                                className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                                placeholder="e.g. GIG-EX-2024-8902"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Reason for Dispute</label>
                                            <textarea
                                                value={newDispute.reason}
                                                onChange={e => setNewDispute({ ...newDispute, reason: e.target.value })}
                                                rows={4}
                                                className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all resize-y"
                                                placeholder="Describe the specific issue with the deliverables, scope, or payment..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Evidence Upload</label>
                                            <div className="border-2 border-dashed border-border-light rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-4xl text-text-muted/30 mb-3 block">cloud_upload</span>
                                                <p className="text-sm font-bold text-text-main mb-1">Click to upload or drag evidence files</p>
                                                <p className="text-xs text-text-muted">PDFs, screenshots, screen recordings (Max 25MB each)</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4 border-t border-border-light">
                                            <button
                                                type="button"
                                                onClick={() => setShowNewForm(false)}
                                                className="px-6 py-3 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-xl hover:border-primary/50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-8 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">gavel</span>
                                                Submit Dispute & Lock Escrow
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : selectedDispute ? (
                                /* Dispute Detail */
                                <div className="animate-fade-in space-y-6">
                                    <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono text-xs font-bold text-text-muted">{selectedDispute.id}</span>
                                                    {(() => {
                                                        const s = STATUS_MAP[selectedDispute.status];
                                                        return <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${s.bg} ${s.color}`}>{s.label}</span>;
                                                    })()}
                                                </div>
                                                <h2 className="text-2xl font-bold text-text-main mb-1">{selectedDispute.contractTitle}</h2>
                                                <p className="text-text-muted text-sm">Contract: {selectedDispute.contractId} • vs. {selectedDispute.opponent}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Amount at Stake</p>
                                                <p className="text-2xl font-black text-primary font-mono">PKR {selectedDispute.amount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                            <div className="bg-background-light rounded-xl p-4">
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Milestone</p>
                                                <p className="text-sm font-bold text-text-main">{selectedDispute.milestone}</p>
                                            </div>
                                            <div className="bg-background-light rounded-xl p-4">
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Opened On</p>
                                                <p className="text-sm font-bold text-text-main">{selectedDispute.openedAt}</p>
                                            </div>
                                            <div className="bg-background-light rounded-xl p-4">
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Escrow Status</p>
                                                <p className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                                    Locked
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Dispute Statement</h3>
                                            <div className="bg-background-light border border-border-light rounded-xl p-5">
                                                <p className="text-sm text-text-main leading-relaxed">{selectedDispute.reason}</p>
                                            </div>
                                        </div>

                                        {selectedDispute.resolution && (
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-green-600 text-xl shrink-0 mt-0.5">check_circle</span>
                                                    <div>
                                                        <h4 className="font-bold text-green-800 text-sm mb-1">Resolution</h4>
                                                        <p className="text-sm text-green-700 leading-relaxed">{selectedDispute.resolution}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-10">
                                        <h3 className="text-lg font-bold text-text-main mb-6">Arbitration Timeline</h3>
                                        <div className="space-y-6">
                                            {[
                                                { icon: 'flag', label: 'Dispute Opened', time: selectedDispute.openedAt, desc: 'Funds locked in escrow automatically.' },
                                                { icon: 'person_search', label: 'Arbitrator Assigned', time: 'Oct 11, 2024', desc: 'Case assigned to Arbitrator #A-4421.' },
                                                { icon: 'fact_check', label: 'Evidence Under Review', time: 'Oct 12, 2024', desc: 'Arbitrator is reviewing uploaded documents and communications.' },
                                            ].map((step, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                                                        </div>
                                                        {i < 2 && <div className="w-px flex-1 bg-border-light mt-2" />}
                                                    </div>
                                                    <div className="pb-6">
                                                        <p className="text-sm font-bold text-text-main">{step.label}</p>
                                                        <p className="text-xs text-text-muted mt-0.5">{step.time}</p>
                                                        <p className="text-sm text-text-muted mt-2 leading-relaxed">{step.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center text-text-muted">
                                    <span className="material-symbols-outlined text-6xl mb-4 opacity-20">balance</span>
                                    <h3 className="text-lg font-bold">Select a Dispute</h3>
                                    <p className="text-sm font-medium">Choose one from the list or open a new case.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

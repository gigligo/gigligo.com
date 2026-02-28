'use client';
import { useState } from 'react';
import Link from 'next/link';

// Mock KYC Queue Data
const KYC_QUEUE = [
    {
        id: 'kyc-8902',
        user: { name: 'Ali Noman', email: 'ali@gigligo.com', role: 'Executive Architect' },
        documents: { front: '/images/id-front-mock.jpg', back: '/images/id-back-mock.jpg', selfie: '/images/selfie-mock.jpg' },
        submittedAt: 'Oct 14, 2024 - 14:30 PKT',
        status: 'pending',
        riskScore: 12
    },
    {
        id: 'kyc-8903',
        user: { name: 'Sarah Ahmed', email: 'sarah@designops.co', role: 'Creative Director' },
        documents: { front: '/images/id-front-mock.jpg', back: '/images/id-back-mock.jpg', selfie: '/images/selfie-mock.jpg' },
        submittedAt: 'Oct 14, 2024 - 15:45 PKT',
        status: 'pending',
        riskScore: 8
    }
];

export default function AdminKYCPage() {
    const [queue, setQueue] = useState(KYC_QUEUE);
    const [selectedRequest, setSelectedRequest] = useState<typeof KYC_QUEUE[0] | null>(queue[0]);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        setQueue(queue.filter(q => q.id !== id));
        if (selectedRequest?.id === id) {
            setSelectedRequest(null);
        }
    };

    return (
        <div className="flex bg-background-light min-h-screen text-text-main font-sans selection:bg-primary/30">
            {/* Minimal Admin Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/5 hidden md:flex flex-col text-white">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        Gigligo <span className="text-primary text-xs uppercase tracking-widest px-2 py-0.5 border border-primary/20 bg-primary/10 rounded">Admin</span>
                    </h1>
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-bold">
                        <span className="material-symbols-outlined text-[18px]">space_dashboard</span> Overview
                    </Link>
                    <Link href="/admin/kyc" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary border border-primary/30 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(200,157,40,0.1)]">
                        <span className="material-symbols-outlined text-[18px]">id_check</span> KYC Review Queue
                        <span className="ml-auto bg-primary text-nav-bg text-[10px] px-2 py-0.5 rounded-full">{queue.length}</span>
                    </Link>
                    <Link href="/admin/disputes" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-bold">
                        <span className="material-symbols-outlined text-[18px]">gavel</span> Arbitration
                    </Link>
                </nav>
                <div className="p-6 border-t border-white/5">
                    <button className="flex items-center gap-3 text-white/50 hover:text-red-400 transition-colors text-sm font-bold w-full">
                        <span className="material-symbols-outlined text-[18px]">logout</span> Exit Portal
                    </button>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>

                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-border-light bg-surface-light relative z-10 shrink-0">
                    <h2 className="text-lg font-bold">Identity Verification Queue</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-text-muted">Compliance Engine v2.1</span>
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary">
                            A
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden relative z-10">
                    {/* Queue List */}
                    <div className="w-full lg:w-96 border-r border-border-light overflow-y-auto bg-surface-light shrink-0">
                        {queue.length === 0 ? (
                            <div className="p-8 text-center text-text-muted text-sm font-medium">
                                Queue is currently empty.<br />All identities verified.
                            </div>
                        ) : (
                            queue.map(req => (
                                <button
                                    key={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className={`w-full text-left p-6 border-b border-border-light transition-colors hover:bg-background-light ${selectedRequest?.id === req.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-text-main">{req.user.name}</h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${req.riskScore < 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            Risk: {req.riskScore}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted mb-3 font-medium">{req.user.email}</p>
                                    <div className="flex justify-between items-center text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                        <span>{req.user.role}</span>
                                        <span>{req.id}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Review Panel */}
                    <div className="flex-1 bg-background-light overflow-y-auto p-8 lg:p-12">
                        {selectedRequest ? (
                            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                                {/* Header Details */}
                                <div className="bg-surface-light border border-border-light rounded-2xl p-8 flex justify-between items-start shadow-sm">
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-main mb-1">{selectedRequest.user.name}</h2>
                                        <p className="text-text-muted font-medium mb-4">{selectedRequest.user.email} • {selectedRequest.user.role}</p>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-background-light border border-border-light rounded text-xs font-bold text-text-muted uppercase">
                                                ID: {selectedRequest.id}
                                            </span>
                                            <span className="px-3 py-1 bg-background-light border border-border-light rounded text-xs font-bold text-text-muted uppercase">
                                                Submitted: {selectedRequest.submittedAt}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAction(selectedRequest.id, 'reject')}
                                            className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100 transition-colors"
                                        >
                                            Reject & Request Retry
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedRequest.id, 'approve')}
                                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            Approve Identity
                                        </button>
                                    </div>
                                </div>

                                {/* Images Grid */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    {/* ID Front */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-2">National ID (Front)</h4>
                                        <div className="bg-surface-light border border-border-light rounded-xl overflow-hidden aspect-85/54 relative group">
                                            {/* Note: using div placeholdes instead of img to avoid 404s natively */}
                                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-5xl">badge</span>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ID Back */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-2">National ID (Back)</h4>
                                        <div className="bg-surface-light border border-border-light rounded-xl overflow-hidden aspect-85/54 relative group">
                                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-5xl">qr_code_2</span>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selfie Match */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-2">Liveness Selfie Match</h4>
                                        <div className="bg-surface-light border border-border-light rounded-xl overflow-hidden aspect-square relative group">
                                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-5xl">face</span>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-muted">
                                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">fact_check</span>
                                <h3 className="text-lg font-bold">No Request Selected</h3>
                                <p className="text-sm font-medium">Select an identity from the queue to process.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function ContractSigningPage() {
    const [signature, setSignature] = useState('');
    const [isSigned, setIsSigned] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleSign = () => {
        if (!signature || !agreeTerms) return;
        setIsSigned(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 96 }}>
                {/* Header Section */}
                <div className="bg-surface-light border-b border-border-light sticky top-24 z-20">
                    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Link href="/dashboard" className="text-text-muted hover:text-text-main transition-colors flex items-center">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                </Link>
                                <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    {isSigned ? <span className="text-green-500">Executing</span> : 'Pending Signature'}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main flex items-center gap-3">
                                Executive Service Agreement
                                <span className="material-symbols-outlined text-primary text-2xl" title="Premium Contract">verified</span>
                            </h1>
                            <p className="text-sm text-text-muted mt-1">Contract ID: GIG-EX-2024-8902 • Issued by Global Tech Partners</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2.5 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-lg hover:border-primary/50 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">download</span> PDF
                            </button>
                            {isSigned ? (
                                <button className="px-6 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-bold rounded-lg flex items-center gap-2 cursor-default">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span> Executed
                                </button>
                            ) : (
                                <button
                                    onClick={() => document.getElementById('signature-panel')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                                >
                                    Sign Document <span className="material-symbols-outlined text-[18px]">draw</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Legal Document Document Preview */}
                        <div className="flex-1 w-full bg-white text-black p-8 sm:p-12 min-h-[800px] border border-border-light rounded-tl-xl rounded-bl-sm rounded-tr-xl rounded-br-sm shadow-2xl relative">
                            {/* Binder UI Effect */}
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-linear-to-b from-gray-200 via-gray-300 to-gray-200"></div>

                            {/* Watermark */}
                            {isSigned && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                                    <div className="text-8xl font-black uppercase text-green-500 -rotate-45 tracking-widest border-8 border-green-500 p-8 rounded-3xl">Executed</div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
                                <div>
                                    <h2 className="text-2xl font-black font-serif uppercase tracking-widest mb-1">GIGLIGO</h2>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Executive Consulting Agreement</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p>Date: {new Date().toLocaleDateString()}</p>
                                    <p>Ref: GIG-EX-2024-8902</p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="space-y-6 font-serif leading-relaxed text-sm">
                                <p>This Executive Consulting Agreement (the "Agreement") is entered into as of the Effective Date, by and between:</p>
                                <p className="ml-6 border-l-4 border-gray-200 pl-4 font-bold">
                                    CLIENT: Global Tech Partners Inc. (Company)<br />
                                    CONTRACTOR: Jane Doe (Executive Consultant)
                                </p>

                                <h3 className="text-lg font-bold mt-8 mb-4 border-b border-gray-200 pb-2">1. Scope of Services</h3>
                                <p>The Executive Consultant agrees to provide high-level strategic guidance and technical architectural consulting to the Company ("Services"). The specific deliverables are outlined in Exhibit A attached to this Agreement. The Executive Consultant shall perform these Services with the highest degree of professionalism and expertise expected of an executive in this industry.</p>

                                <h3 className="text-lg font-bold mt-8 mb-4 border-b border-gray-200 pb-2">2. Compensation & Escrow</h3>
                                <p>In consideration for the Services, the Company shall pay the Executive Consultant a total fee of $45,000.00 USD. All funds will be held securely in the GIGLIGO Corporate Escrow until deliverables are mutually approved. An initial retainer of $15,000.00 USD shall be released upon the execution of this Agreement.</p>

                                <h3 className="text-lg font-bold mt-8 mb-4 border-b border-gray-200 pb-2">3. Confidentiality & Non-Disclosure</h3>
                                <p>The Executive Consultant recognizes that during the course of performance under this Agreement, they may acquire access to sensitive, proprietary, and highly confidential information. The Executive Consultant agrees to maintain the strictest confidentiality...</p>

                                {/* Truncated for visual */}
                                <div className="h-64 bg-linear-to-b from-transparent to-white relative z-10 flex items-end justify-center pb-8 border-b-2 border-gray-100 mt-12">
                                    <p className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest">... End of Exhibit A ...</p>
                                </div>

                                {/* Signature Block on Document */}
                                {isSigned && (
                                    <div className="mt-12 grid grid-cols-2 gap-12">
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500 mb-6">For the Company</p>
                                            <p className="font-['Brush_Script_MT',cursive] text-4xl mb-2 text-blue-900 border-b border-black pb-2">Marcus Chen</p>
                                            <p className="text-xs font-bold">Marcus Chen, VP of Operations</p>
                                            <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-gray-500 mb-6">Executive Consultant</p>
                                            <p className="font-['Brush_Script_MT',cursive] text-4xl mb-2 text-blue-900 border-b border-black pb-2">{signature}</p>
                                            <p className="text-xs font-bold">{signature || 'Jane Doe'}</p>
                                            <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Signature Tools Panel */}
                        <div id="signature-panel" className="w-full lg:w-[400px] shrink-0 space-y-6">
                            {!isSigned ? (
                                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 sticky top-52">
                                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">draw</span>
                                        Sign Document
                                    </h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Type Your Full Name</label>
                                            <input
                                                type="text"
                                                value={signature}
                                                onChange={(e) => setSignature(e.target.value)}
                                                className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                                placeholder="e.g. Jane Doe"
                                            />
                                        </div>

                                        {/* Auto-generated Script display */}
                                        <div className="h-24 bg-background-light border border-dashed border-border-light rounded-lg flex items-center justify-center overflow-hidden p-4">
                                            {signature ? (
                                                <span className="font-['Brush_Script_MT',cursive] text-4xl text-text-main opacity-80">{signature}</span>
                                            ) : (
                                                <span className="text-sm text-text-muted">Signature Preview</span>
                                            )}
                                        </div>

                                        <label className="flex items-start gap-3 p-4 border border-border-light rounded-xl cursor-pointer hover:bg-background-light/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                className="mt-1 w-4 h-4 rounded border-border-light text-primary focus:ring-primary/50 bg-background-light"
                                            />
                                            <span className="text-xs text-text-muted leading-relaxed">
                                                I agree that my typed name constitutes a legally binding electronic signature under the ESIGN Act and UETA.
                                            </span>
                                        </label>

                                        <button
                                            onClick={handleSign}
                                            disabled={!signature || !agreeTerms}
                                            className="w-full py-4 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            Execute Agreement
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 sm:p-8 sticky top-52 space-y-6">
                                    <div className="flex flex-col items-center justify-center text-center py-4">
                                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-3xl">verified</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main mb-2">Contract Executed</h3>
                                        <p className="text-sm text-text-muted">This agreement is now legally binding. Copies have been sent to both parties securely.</p>
                                    </div>

                                    <div className="pt-6 border-t border-green-500/20 space-y-3">
                                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Audit Trail</h4>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-muted">IP Address:</span>
                                            <span className="font-mono text-text-main">192.168.1.5</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-muted">Timestamp:</span>
                                            <span className="font-mono text-text-main">{new Date().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-muted">Hash:</span>
                                            <span className="font-mono text-text-main">A8F9321...E4</span>
                                        </div>
                                    </div>

                                    <Link href="/dashboard" className="w-full py-4 bg-surface-light border border-border-light text-text-main text-sm font-bold rounded-xl hover:border-primary/50 transition-colors flex items-center justify-center mt-6">
                                        Return to Dashboard
                                    </Link>
                                </div>
                            )}

                            {/* Summary Card */}
                            <div className="bg-nav-bg text-white rounded-2xl p-6 sm:p-8 border border-white/5">
                                <h4 className="font-bold text-lg mb-4">Agreement Context</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Contract Value</p>
                                        <p className="text-xl font-mono font-bold text-white">$45,000.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Retainer Required</p>
                                        <p className="text-xl font-mono font-bold text-white">$15,000.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Project Deadline</p>
                                        <p className="text-sm font-bold text-white">December 31, 2024</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

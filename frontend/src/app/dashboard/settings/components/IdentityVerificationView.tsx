'use client';

import { useState } from 'react';

export function IdentityVerificationView() {
    const [status] = useState<'unverified' | 'pending' | 'verified'>('unverified');

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">Identity Verification</h2>
                <p className="text-text-muted mt-1 text-sm">Secure your account and build trust with a Verified badge.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column - Form & Steps */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 relative overflow-hidden">

                        {status === 'unverified' && (
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <span className="material-symbols-outlined text-9xl">fingerprint</span>
                            </div>
                        )}

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-4 rounded-xl border ${status === 'verified' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                    <span className="material-symbols-outlined text-3xl">
                                        {status === 'verified' ? 'verified_user' : 'gpp_bad'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-main">
                                        {status === 'verified' ? 'Account Verified' : 'Action Required'}
                                    </h3>
                                    <p className="text-sm text-text-muted mt-1">
                                        {status === 'verified'
                                            ? 'Your identity has been confirmed by our compliance team.'
                                            : 'Complete verification to unlock full financial privileges.'}
                                    </p>
                                </div>
                            </div>

                            {status === 'unverified' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                            <div>
                                                <h4 className="font-bold text-text-main text-sm">Government ID Upload</h4>
                                                <p className="text-xs text-text-muted">Passport, Driver's License, or National ID Card.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                            <div>
                                                <h4 className="font-bold text-text-main text-sm">Biometric Selfie Matching</h4>
                                                <p className="text-xs text-text-muted">A quick live photo to match your ID.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border-light">
                                        <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            Start Verification Process
                                        </button>
                                        <p className="text-[10px] text-text-muted/50 mt-4 text-center sm:text-left uppercase tracking-widest font-bold">
                                            Powered by Secure Identity Partners
                                        </p>
                                    </div>
                                </div>
                            )}

                            {status === 'verified' && (
                                <div className="pt-4 border-t border-border-light">
                                    <div className="flex items-center gap-2 text-sm text-green-500 font-bold mb-2">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Identity Confirmed
                                    </div>
                                    <p className="text-xs text-text-muted">Verified on: {new Date().toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-white/5">
                        <span className="material-symbols-outlined text-primary text-3xl mb-4">gavel</span>
                        <h4 className="font-bold text-lg mb-2">Anti-Money Laundering (AML)</h4>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            GIGLIGO complies with global AML and KYC (Know Your Customer) regulations. We verify the identity of all members operating within the platform to prevent financial crimes.
                        </p>
                        <h4 className="font-bold text-sm mb-2 text-white/80">Verification Unlocks:</h4>
                        <ul className="text-white/50 text-xs space-y-2 mb-4">
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-primary">done</span> Unlimited Contract Values</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-primary">done</span> Escrow Funding Access</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-primary">done</span> Direct Bank Withdrawals</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

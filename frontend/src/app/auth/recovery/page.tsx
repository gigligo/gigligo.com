'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function SecurityRecoveryPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans antialiased flex flex-col selection:bg-primary/30 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center relative z-10 border-b border-white/5">
                <Logo className="h-8 w-auto" variant="white" />
                <nav className="hidden md:flex gap-6 text-sm font-semibold uppercase tracking-wider text-white/50">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/dashboard/settings" className="hover:text-white transition-colors">Security</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
                </nav>
            </header>

            <main className="flex-1 flex flex-col justify-center items-center p-6 relative z-10 w-full max-w-7xl mx-auto">
                <div className="w-full max-w-2xl">
                    <div className="mb-12 text-center">
                        <div className="inline-flex h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl text-red-400">key</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Safeguard Your Access.</h1>
                        <p className="text-white/50 text-lg max-w-lg mx-auto leading-relaxed">
                            These codes are your ultimate key to bypassing 2-Step Verification if you lose access to your device. <span className="text-white/90 font-semibold border-b border-primary/30">Store them offline.</span>
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl p-8 md:p-12 mb-8 relative">
                        {/* Security Pattern watermark */}
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <span className="material-symbols-outlined text-9xl">fingerprint</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                            {[
                                'X7T2 - M9B4 - 1P3K',
                                'L5C8 - R2N6 - J4W9',
                                'V3D1 - Q8H7 - F5S2',
                                'K9P6 - A4Y3 - Z7T1',
                                'M2E5 - G8U9 - C6X4',
                                'H1W7 - B3N5 - D2R8',
                                'T4S9 - Y6Q2 - L8P1',
                                'F7K3 - J5M8 - V9C6',
                                'N6B2 - X4R1 - W3D7',
                                'P8Z5 - C9T4 - G2F3'
                            ].map((code, index) => (
                                <div key={index} className="flex gap-4 items-center font-mono text-base md:text-lg text-white/80 pb-2 border-b border-white/5">
                                    <span className="text-primary/40 text-xs">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="tracking-[0.2em]">{code}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10 relative z-10">
                            <button className="flex-1 h-12 bg-white text-nav-bg font-bold text-sm tracking-wide rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">download</span> Download PDF
                            </button>
                            <button className="flex-1 h-12 bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wide rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">content_copy</span> Copy to Clipboard
                            </button>
                            <button className="flex-1 h-12 bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wide rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">print</span> Print Codes
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-white/30 text-xs mb-4">
                            Warning: Keep these codes secret. Anyone with access to these codes can bypass your account security.
                        </p>
                        <Link href="/dashboard/settings" className="text-primary font-semibold text-sm hover:underline underline-offset-4">
                            Return to Security Settings
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center relative z-10 flex gap-6 justify-center text-xs font-semibold uppercase tracking-widest text-white/30">
                <p>&copy; 2024 GIGLIGO.</p>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Help Center</Link>
            </footer>
        </div>
    );
}

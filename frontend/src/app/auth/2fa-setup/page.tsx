'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function AuthenticatorSetupPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans antialiased flex flex-col selection:bg-primary/30 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center relative z-10 border-b border-white/5">
                <Logo className="h-8 w-auto" variant="white" />
                <nav className="hidden md:flex gap-6 text-sm font-semibold uppercase tracking-wider text-white/50">
                    <Link href="/search" className="hover:text-white transition-colors">Talent</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Business</Link>
                    <Link href="/brand" className="hover:text-white transition-colors">Editorial</Link>
                </nav>
            </header>

            <main className="flex-1 flex flex-col justify-center items-center p-6 relative z-10 w-full max-w-7xl mx-auto">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center">
                        <div className="inline-flex h-16 w-16 bg-white/5 border border-white/10 rounded-2xl items-center justify-center mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-3xl text-primary">phonelink_lock</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-3">Secure Your Access.</h1>
                        <p className="text-white/50 text-sm">Connect your preferred authenticator app to enable 2-Step Verification.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="p-8 border-b border-white/10 flex justify-center bg-white/5">
                            {/* Mock QR Code */}
                            <div className="p-4 bg-white rounded-xl">
                                <div className="w-48 h-48 bg-stone-100 flex items-center justify-center text-black font-mono text-center border-4 border-dashed border-stone-300 relative">
                                    <div className="absolute inset-2 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80 mix-blend-multiply"></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <p className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[10px]">looks_one</span> Setup Key
                                </p>
                                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-3">
                                    <code className="text-primary font-mono text-sm tracking-wider">GIGL-X9PQ-8R2L-M4N5</code>
                                    <button className="text-white/40 hover:text-white transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[10px]">looks_two</span> Verification Code
                                </p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength={1}
                                            className="w-full aspect-square bg-black/40 border border-white/10 rounded-lg text-center text-xl font-mono text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="·"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button className="w-full h-12 bg-primary text-white font-bold text-sm tracking-wide rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                Verify & Activate <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/dashboard/settings" className="text-white/40 text-sm hover:text-white transition-colors bg-transparent px-4 py-2 rounded -ml-4">
                            Cancel Setup
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

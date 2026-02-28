'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

    const handleInput = (index: number, value: string) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            const next = document.getElementById(`code-${index + 1}`);
            next?.focus();
        }

        if (newCode.every(c => c !== '')) {
            setStatus('success');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: 96 }}>
                <div className="max-w-md w-full">
                    {status === 'success' ? (
                        <div className="bg-surface-light border border-border-light rounded-3xl p-10 text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6 border border-green-200">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h1 className="text-2xl font-black text-text-main mb-2">Email Verified!</h1>
                            <p className="text-sm text-text-muted mb-8">Your email has been successfully verified. You can now access all features.</p>
                            <Link href="/dashboard" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition">
                                Go to Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-surface-light border border-border-light rounded-3xl p-10 text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
                            </div>
                            <h1 className="text-2xl font-black text-text-main mb-2">Verify Your Email</h1>
                            <p className="text-sm text-text-muted mb-8">We&apos;ve sent a 6-digit verification code to your email address. Enter it below.</p>
                            <div className="flex justify-center gap-3 mb-8">
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`code-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleInput(i, e.target.value)}
                                        className="w-12 h-14 text-center text-xl font-bold border-2 border-border-light rounded-xl bg-background-light text-text-main focus:outline-none focus:border-primary transition-colors"
                                    />
                                ))}
                            </div>
                            <button className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition mb-4">
                                Verify Email
                            </button>
                            <p className="text-xs text-text-muted">
                                Didn&apos;t receive the code?{' '}
                                <button className="text-primary font-bold hover:underline">Resend Code</button>
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

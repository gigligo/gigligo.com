'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [loading, setLoading] = useState(false);

    const handleInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 1) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            const next = document.getElementById(`code-${index + 1}`);
            next?.focus();
        }
    };

    const handleVerify = async () => {
        if (code.some(c => c === '')) return;
        setLoading(true);
        // Simulate API
        await new Promise(r => setTimeout(r, 1500));
        setStatus('success');
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-background-dark selection:bg-primary/30 overflow-x-hidden">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: 96 }}>
                <div className="max-w-xl w-full py-20">
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-white border border-border-light rounded-[4rem] p-12 md:p-20 text-center shadow-2xl backdrop-blur-3xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none opacity-50" />
                                <div className="w-32 h-32 rounded-4xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-10 border border-green-500/20 shadow-2xl relative z-10">
                                    <span className="material-symbols-outlined text-6xl font-light">check_circle</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-background-dark mb-4 uppercase tracking-tighter italic relative z-10">Identity Verified.</h1>
                                <p className="text-xl text-text-muted mb-12 font-medium leading-tight max-w-sm mx-auto relative z-10">Verification complete. Your account is now fully authorized for market operations.</p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                                    <Link href="/dashboard" className="inline-block px-14 py-6 bg-background-dark text-white font-black rounded-full text-sm uppercase tracking-[0.2em] shadow-2xl transition-all">
                                        Enter Dashboard
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-white border border-border-light rounded-[4rem] p-12 md:p-20 text-center shadow-2xl backdrop-blur-3xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-50" />
                                <div className="w-32 h-32 rounded-4xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-2xl relative z-10">
                                    <span className="material-symbols-outlined text-6xl font-light">mark_email_read</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-background-dark mb-4 uppercase tracking-tighter italic relative z-10">Verify Access.</h1>
                                <p className="text-xl text-text-muted mb-12 font-medium leading-tight max-w-sm mx-auto relative z-10">
                                    We've transmitted a 6-digit verification code to your email. Enter it to authorize this device.
                                </p>

                                <div className="flex justify-center gap-4 mb-12 relative z-10">
                                    {code.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`code-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleInput(i, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !digit && i > 0) {
                                                    document.getElementById(`code-${i - 1}`)?.focus();
                                                }
                                            }}
                                            className="w-14 h-20 text-center text-3xl font-black border-2 border-border-light rounded-3xl bg-black/5 text-background-dark focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleVerify}
                                    disabled={loading || code.some(c => c === '')}
                                    className="w-full py-6 bg-primary text-white font-black rounded-full text-sm uppercase tracking-widest shadow-2xl shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-3 relative z-10"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        "Authorize Account"
                                    )}
                                </motion.button>

                                <p className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted relative z-10">
                                    Didn't receive signal?{' '}
                                    <button className="text-primary hover:underline underline-offset-4">Retransmit Code</button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
}

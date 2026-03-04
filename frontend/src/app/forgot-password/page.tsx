'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { authApi } from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'code' | 'done'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.forgotPassword(email);
            setSuccess('Reset code transmitted.');
            setStep('code');
        } catch (err: any) {
            setError(err.message || 'Transmission failed.');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Mismatch detected.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authApi.resetPassword(email, code, newPassword);
            setStep('done');
        } catch (err: any) {
            setError(err.message || 'Invalid authorization code.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-background-dark selection:bg-primary/30 overflow-x-hidden">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: 96 }}>
                <div className="w-full max-w-xl py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white border border-border-light rounded-[4rem] p-12 md:p-20 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-50" />

                        <AnimatePresence mode="wait">
                            {step === 'email' && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="relative z-10"
                                >
                                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-10 border border-primary/20 shadow-inner">
                                        <span className="material-symbols-outlined text-4xl font-light">lock_reset</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">Key Recovery.</h1>
                                    <p className="text-xl text-text-muted mb-12 font-medium leading-tight max-w-sm">Enter your registered email link to receive a reset authorization code.</p>

                                    {error && <p className="text-red-500 text-xs font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-2xl mb-8 border border-red-500/20">{error}</p>}

                                    <form onSubmit={handleSendCode} className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-3 block px-1">Signal Destination</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="name@domain.com"
                                                className="w-full px-8 py-6 bg-black/5 border border-border-light rounded-2xl text-background-dark text-lg focus:outline-none focus:border-primary transition-all font-black placeholder:text-text-muted/20 shadow-inner"
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading || !email}
                                            className="w-full py-6 bg-primary text-white font-black rounded-full text-sm uppercase tracking-widest shadow-2xl shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Transmit Code"}
                                        </motion.button>
                                    </form>
                                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] mt-10 text-text-muted">
                                        Found your key?{' '}
                                        <Link href="/login" className="text-primary hover:underline underline-offset-4">Mission Login</Link>
                                    </p>
                                </motion.div>
                            )}

                            {step === 'code' && (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="relative z-10"
                                >
                                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-10 border border-primary/20 shadow-inner">
                                        <span className="material-symbols-outlined text-4xl font-light">security</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">Authorize Reset.</h1>
                                    <p className="text-xl text-text-muted mb-12 font-medium leading-tight max-w-sm">{success}</p>

                                    {error && <p className="text-red-500 text-xs font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-2xl mb-8 border border-red-500/20">{error}</p>}

                                    <form onSubmit={handleResetPassword} className="space-y-8">
                                        <div>
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-3 block px-1">Authorization Code</label>
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                required
                                                maxLength={6}
                                                placeholder="123456"
                                                className="w-full px-8 py-6 bg-black/5 border border-border-light rounded-2xl text-background-dark text-3xl text-center tracking-[0.5em] focus:outline-none focus:border-primary transition-all font-black shadow-inner"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-3 block px-1">New Cipher</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                    placeholder="********"
                                                    className="w-full px-6 py-5 bg-black/5 border border-border-light rounded-2xl text-background-dark text-sm focus:outline-none focus:border-primary transition-all font-bold shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-3 block px-1">Confirm Cipher</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    placeholder="********"
                                                    className="w-full px-6 py-5 bg-black/5 border border-border-light rounded-2xl text-background-dark text-sm focus:outline-none focus:border-primary transition-all font-bold shadow-inner"
                                                />
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading || !code || !newPassword || !confirmPassword}
                                            className="w-full py-6 bg-primary text-white font-black rounded-full text-sm uppercase tracking-widest shadow-2xl shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Authorize Overwrite"}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'done' && (
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center relative z-10"
                                >
                                    <div className="w-32 h-32 bg-green-500/10 text-green-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-green-500/20 shadow-2xl">
                                        <span className="material-symbols-outlined text-6xl font-light">task_alt</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-background-dark mb-6 uppercase tracking-tighter italic">Ciphers Reset.</h1>
                                    <p className="text-xl text-text-muted mb-12 font-medium leading-tight max-w-sm mx-auto">Your access keys have been successfully updated. You may now re-enter the network.</p>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href="/login"
                                            className="inline-block px-14 py-6 bg-background-dark text-white font-black rounded-full text-sm uppercase tracking-[0.2em] shadow-2xl transition-all"
                                        >
                                            Proceed to Login
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

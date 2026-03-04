/// <reference types="node" />
'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // OTP state
    const [otpStep, setOtpStep] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>());

    // Forgot Password states
    const [forgotStep, setForgotStep] = useState<'idle' | 'email' | 'code' | 'done'>('idle');
    const [resetEmail, setResetEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetConfirmPassword, setResetConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState('');

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Step 1: Submit email + password
    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(backendUrl + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok && data.requiresOtp) {
                setTempToken(data.tempToken);
                setOtpStep(true);
                startResendCooldown();
            } else if (res.ok && data.access_token) {
                // Legacy fallback (shouldn't happen with new flow, but graceful)
                const signInRes = await signIn('credentials', {
                    email,
                    password,
                    callbackUrl,
                    redirect: false,
                });
                if (signInRes?.url) window.location.href = signInRes.url;
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        const code = otpCode.join('');
        if (code.length !== 6) return;

        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(backendUrl + '/api/auth/login/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken, code }),
            });
            const data = await res.json();

            if (res.ok && data.access_token) {
                // Now sign in via NextAuth using the credentials provider
                const signInRes = await signIn('credentials', {
                    email,
                    password,
                    accessToken: data.access_token,
                    userId: data.user?.id,
                    role: data.user?.role,
                    kycStatus: data.user?.kycStatus,
                    name: data.user?.profile?.fullName,
                    callbackUrl,
                    redirect: false,
                });
                if (signInRes?.error) {
                    setError('Login failed. Please try again.');
                } else if (signInRes?.url) {
                    window.location.href = signInRes.url;
                }
            } else {
                setError(data.message || 'Invalid or expired verification code.');
                setOtpCode(['', '', '', '', '', '']);
                otpRefs[0].current?.focus();
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setError('');
        try {
            await fetch(backendUrl + '/api/auth/otp/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken }),
            });
            startResendCooldown();
        } catch {
            setError('Failed to resend code.');
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // OTP input handlers
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...otpCode];
        newCode[index] = value.slice(-1);
        setOtpCode(newCode);
        if (value && index < 5) otpRefs[index + 1].current?.focus();
        // Auto-submit when all 6 digits entered
        if (newCode.every(d => d !== '') && newCode.join('').length === 6) {
            setTimeout(() => handleVerifyOtp(), 100);
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...otpCode];
        for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i];
        setOtpCode(newCode);
        if (pasted.length === 6) setTimeout(() => handleVerifyOtp(), 100);
    };

    // ── Forgot Password Handlers ──
    const handleForgotSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setError('');
        try {
            const res = await fetch(backendUrl + '/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });
            await res.json();
            setForgotStep('code');
        } catch {
            setError('Failed to send reset code. Please try again.');
        } finally {
            setResetLoading(false);
        }
    };

    const handleForgotResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (resetNewPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (resetNewPassword !== resetConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setResetLoading(true);
        setError('');
        try {
            const res = await fetch(backendUrl + '/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword: resetNewPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Reset failed');
            setForgotStep('done');
            setResetSuccess('Password reset successful! You can now sign in.');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-background-dark">
            {/* Left Side: Branding / Visual (Hidden on smaller screens) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black text-white p-12 flex-col justify-between">
                <div className="absolute inset-0 bg-[url('/auth-bg.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black" />

                {/* Brand Logo */}
                <div className="relative z-10 flex items-center gap-2">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <span className="font-display text-4xl font-black tracking-tighter uppercase">gigligo<span className="text-primary italic">.com</span></span>
                    </Link>
                </div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative z-10 my-auto"
                >
                    <div className="w-16 h-1 bg-primary mb-8" />
                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        Access the <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">top 1%</span> of global talent.
                    </h2>
                    <p className="text-xl text-white/60 max-w-md leading-relaxed">
                        Join the fastest-growing network of elite professionals and serious businesses scaling their operations securely.
                    </p>
                </motion.div>

                <div className="relative z-10 text-sm font-medium text-white/40 flex items-center gap-4">
                    <span>© {new Date().getFullYear()} Gigligo Inc.</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </div>
            </div>

            {/* Right Side: Authentication Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
                {/* Mobile Background Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none lg:hidden" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none lg:hidden" />

                <div className="max-w-md w-full relative z-10">
                    <div className="text-center mb-10 lg:text-left">
                        <Link href="/" className="inline-block lg:hidden hover:opacity-80 transition-opacity mb-8">
                            <span className="font-display text-3xl font-black tracking-tighter text-background-dark dark:text-white uppercase">gigligo<span className="text-primary italic">.com</span></span>
                        </Link>

                        <AnimatePresence mode="wait">
                            {forgotStep !== 'idle' ? (
                                <motion.div
                                    key="forgot"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h1 className="text-3xl font-bold text-background-dark dark:text-white mt-8 tracking-tight">
                                        {forgotStep === 'done' ? 'Password Reset!' : 'Reset Password'}
                                    </h1>
                                    <p className="text-text-muted dark:text-white/60 mt-3 font-medium">
                                        {forgotStep === 'email' && 'Enter your email to receive a reset code'}
                                        {forgotStep === 'code' && <>We sent a code to <strong className="text-background-dark dark:text-white">{resetEmail}</strong></>}
                                        {forgotStep === 'done' && 'You can now sign in with your new password'}
                                    </p>
                                </motion.div>
                            ) : !otpStep ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h1 className="text-4xl font-bold text-background-dark dark:text-white mt-10 tracking-tight">Welcome back</h1>
                                    <p className="text-text-muted dark:text-white/60 mt-3 font-medium text-lg">Sign in to continue your journey</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h1 className="text-3xl font-bold text-background-dark dark:text-white mt-8 tracking-tight">Verify Identity</h1>
                                    <p className="text-text-muted dark:text-white/60 mt-3 font-medium">We sent a 6-digit code to <strong className="text-background-dark dark:text-white">{email}</strong></p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm text-center font-bold"
                        >
                            {error}
                        </motion.div>
                    )}

                    {forgotStep === 'email' ? (
                        <form onSubmit={handleForgotSubmitEmail} className="space-y-6 mb-8">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={resetEmail}
                                    onChange={e => setResetEmail(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                    placeholder="name@domain.com"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={resetLoading}
                                className="w-full py-5 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/25 disabled:opacity-50 transition-all text-[15px]"
                            >
                                {resetLoading ? 'Sending Authorization...' : 'Send Reset Code'}
                            </motion.button>
                            <button type="button" onClick={() => { setForgotStep('idle'); setError(''); }} className="w-full py-2 text-[13px] font-bold text-text-muted hover:text-primary dark:hover:text-white transition-colors">
                                ← Return to Sign In
                            </button>
                        </form>
                    ) : forgotStep === 'code' ? (
                        <form onSubmit={handleForgotResetPassword} className="space-y-6 mb-8">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Reset Code</label>
                                <input
                                    type="text"
                                    required
                                    value={resetCode}
                                    onChange={e => setResetCode(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white focus:outline-none focus:border-primary transition-all text-center tracking-[0.5em] font-mono text-xl placeholder:text-text-muted/20"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={resetNewPassword}
                                    onChange={e => setResetNewPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                    placeholder="At least 8 characters"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={resetConfirmPassword}
                                    onChange={e => setResetConfirmPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                    placeholder="Re-enter new password"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={resetLoading}
                                className="w-full py-5 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/25 disabled:opacity-50 transition-all text-[15px]"
                            >
                                {resetLoading ? 'Resetting...' : 'Confirm New Password'}
                            </motion.button>
                            <button type="button" onClick={() => { setForgotStep('email'); setError(''); }} className="w-full py-2 text-[13px] font-bold text-text-muted hover:text-primary dark:hover:text-white transition-colors">
                                ← Use different email
                            </button>
                        </form>
                    ) : forgotStep === 'done' ? (
                        <div className="text-center space-y-8 mb-8">
                            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20">
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="text-background-dark dark:text-white font-bold text-lg leading-tight">{resetSuccess}</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setForgotStep('idle'); setError(''); setResetEmail(''); setResetCode(''); setResetNewPassword(''); setResetConfirmPassword(''); }}
                                className="w-full py-5 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/25 transition-all text-[15px]"
                            >
                                Back to Sign In
                            </motion.button>
                        </div>
                    ) : !otpStep ? (
                        <>
                            <form onSubmit={handleCredentialsLogin} className="space-y-6 mb-10">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                        placeholder="name@domain.com"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-3 px-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40">Password</label>
                                        <button type="button" onClick={() => { setForgotStep('email'); setResetEmail(email); setError(''); }} className="text-[10px] text-primary hover:text-primary/70 font-bold uppercase tracking-widest transition-colors">
                                            Forgot?
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-background-dark dark:bg-white dark:text-background-dark text-white font-extrabold rounded-full shadow-2xl disabled:opacity-50 mt-4 transition-all text-[15px]"
                                >
                                    {isLoading ? 'Authenticating...' : 'Sign In'}
                                </motion.button>
                            </form>

                            <div className="relative mb-10">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light dark:border-white/10"></div></div>
                                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.3em]"><span className="bg-white dark:bg-background-dark px-6 text-text-muted dark:text-white/30 backdrop-blur-xl">OR</span></div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => {
                                    setIsLoading(true);
                                    signIn('google', { callbackUrl });
                                }}
                                disabled={isLoading}
                                className="w-full py-5 bg-white dark:bg-white/5 text-background-dark dark:text-white font-bold rounded-full border border-border-light dark:border-white/10 hover:border-primary transition-all text-[15px] flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {isLoading ? 'Connecting...' : 'Continue with Google'}
                            </motion.button>
                            <p className="mt-10 text-center text-[15px] text-text-muted dark:text-white/50 font-bold">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-primary hover:text-primary/70 dark:text-white dark:hover:text-primary underline underline-offset-8 transition-colors">Create one</Link>
                            </p>
                        </>
                    ) : (
                        /* ═══ OTP VERIFICATION STEP ═══ */
                        <div className="space-y-10">
                            <div className="flex justify-center gap-4" onPaste={handleOtpPaste}>
                                {otpCode.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={otpRefs[i]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        className="w-12 h-16 text-center text-2xl font-black bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white focus:outline-none focus:border-primary transition-all shadow-sm"
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleVerifyOtp}
                                disabled={isLoading || otpCode.join('').length !== 6}
                                className="w-full py-5 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/25 disabled:opacity-50 transition-all text-[15px]"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                            </motion.button>

                            <div className="text-center space-y-4">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0}
                                    className="text-[14px] text-background-dark dark:text-white hover:text-primary font-bold disabled:text-text-muted/40 transition-colors"
                                >
                                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                                </button>
                                <br />
                                <button
                                    onClick={() => { setOtpStep(false); setError(''); setOtpCode(['', '', '', '', '', '']); }}
                                    className="text-[13px] font-bold text-text-muted hover:text-background-dark dark:hover:text-white transition-colors"
                                >
                                    ← Back to sign in
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    );
}

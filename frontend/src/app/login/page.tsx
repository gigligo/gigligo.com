/// <reference types="node" />
'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                            <defs><linearGradient id="lgLogin" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#00f5d4" /><stop offset="1" stopColor="#4f46e5" /></linearGradient></defs>
                            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#lgLogin)" strokeWidth="3.5" strokeLinecap="round" />
                            <path d="M19 18 H30" stroke="url(#lgLogin)" strokeWidth="3.5" strokeLinecap="round" />
                            <circle cx="19" cy="18" r="2" fill="#00f5d4" />
                        </svg>
                        <span className="font-display text-xl font-black tracking-tighter text-slate-900 dark:text-white">gigligo<span className="text-teal-vibrant opacity-60">.com</span></span>
                    </Link>

                    {forgotStep !== 'idle' ? (
                        <>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 tracking-tight">
                                {forgotStep === 'done' ? 'Password Reset!' : 'Reset Password'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                {forgotStep === 'email' && 'Enter your email to receive a reset code'}
                                {forgotStep === 'code' && <>We sent a code to <strong className="text-slate-700 dark:text-white">{resetEmail}</strong></>}
                                {forgotStep === 'done' && 'You can now sign in with your new password'}
                            </p>
                        </>
                    ) : !otpStep ? (
                        <>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 tracking-tight">Welcome</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to continue</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 tracking-tight">Verify Your Identity</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">We sent a 6-digit code to <strong className="text-slate-700 dark:text-white">{email}</strong></p>
                        </>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {forgotStep === 'email' ? (
                    <form onSubmit={handleForgotSubmitEmail} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={resetLoading}
                            className="w-full py-3.5 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FE7743]/20 disabled:opacity-50"
                        >
                            {resetLoading ? 'Sending Code...' : 'Send Reset Code'}
                        </button>
                        <button type="button" onClick={() => { setForgotStep('idle'); setError(''); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-white transition">
                            ← Back to Sign In
                        </button>
                    </form>
                ) : forgotStep === 'code' ? (
                    <form onSubmit={handleForgotResetPassword} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Reset Code</label>
                            <input
                                type="text"
                                required
                                value={resetCode}
                                onChange={e => setResetCode(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors text-center tracking-[0.3em] font-mono text-lg"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                            <input
                                type="password"
                                required
                                value={resetNewPassword}
                                onChange={e => setResetNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors"
                                placeholder="Minimum 8 characters"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={resetConfirmPassword}
                                onChange={e => setResetConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors"
                                placeholder="Re-enter new password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={resetLoading}
                            className="w-full py-3.5 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FE7743]/20 disabled:opacity-50"
                        >
                            {resetLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button type="button" onClick={() => { setForgotStep('email'); setError(''); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-white transition">
                            ← Change Email
                        </button>
                    </form>
                ) : forgotStep === 'done' ? (
                    <div className="text-center space-y-4 mb-6">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-green-500 font-semibold">{resetSuccess}</p>
                        <button
                            onClick={() => { setForgotStep('idle'); setError(''); setResetEmail(''); setResetCode(''); setResetNewPassword(''); setResetConfirmPassword(''); }}
                            className="w-full py-3.5 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FE7743]/20"
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : !otpStep ? (
                    <>
                        <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    <button type="button" onClick={() => { setForgotStep('email'); setResetEmail(email); setError(''); }} className="text-xs text-[#FE7743] hover:text-[#FE7743]/80 font-semibold transition">
                                        Forgot Password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FE7743]/20 disabled:opacity-50"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
                            <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">or continue with</span></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setIsLoading(true);
                                signIn('google', { callbackUrl });
                            }}
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all text-sm flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
                        </button>
                        <p className="mt-8 text-center text-xs text-slate-500">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-semibold text-teal-vibrant hover:text-teal-vibrant/80 transition">Sign up</Link>
                        </p>
                    </>
                ) : (
                    /* ═══ OTP VERIFICATION STEP ═══ */
                    <div className="space-y-6">
                        <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
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
                                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 dark:bg-[#111] border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#FE7743] dark:focus:border-[#FE7743]/50 transition-colors"
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={isLoading || otpCode.join('').length !== 6}
                            className="w-full py-3.5 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FE7743]/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                        </button>

                        <div className="text-center space-y-2">
                            <button
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0}
                                className="text-sm text-teal-vibrant hover:text-teal-vibrant/80 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                            </button>
                            <br />
                            <button
                                onClick={() => { setOtpStep(false); setError(''); setOtpCode(['', '', '', '', '', '']); }}
                                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                            >
                                ← Back to sign in
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}

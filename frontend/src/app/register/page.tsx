'use client';

import React, { Suspense, useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function RegisterContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('SELLER');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // OTP state
    const [otpStep, setOtpStep] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>());

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const handleCredentialsRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const roleParam = searchParams.get('role') || role;
            const payload = {
                fullName,
                email,
                password,
                role: roleParam,
                termsAccepted: acceptedTerms
            };
            const res = await fetch(backendUrl + '/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok && data.requiresOtp) {
                setTempToken(data.tempToken);
                setOtpStep(true);
                startResendCooldown();
            } else if (res.ok && data.access_token) {
                // Fallback if OTP is somehow disabled
                const signInRes = await signIn('credentials', {
                    email,
                    password,
                    callbackUrl,
                    redirect: false
                });
                if (signInRes?.url) window.location.href = signInRes.url;
            } else {
                setError(data.message || 'Failed to create account. Email may already exist.');
            }
        } catch (e) {
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

    return (
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark px-4 py-16 relative overflow-hidden">
            {/* Mesh Blurs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-white/5 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-border-light dark:border-white/10 max-w-md w-full relative z-10 backdrop-blur-2xl"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <span className="font-display text-3xl font-black tracking-tighter text-background-dark dark:text-white uppercase">gigligo<span className="text-primary italic">.com</span></span>
                    </Link>

                    <AnimatePresence mode="wait">
                        {!otpStep ? (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <h1 className="text-3xl font-bold text-background-dark dark:text-white mt-10 tracking-tight">Create account</h1>
                                <p className="text-text-muted dark:text-white/60 mt-3 font-medium text-lg">Join the elite Gigligo community</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <h1 className="text-3xl font-bold text-background-dark dark:text-white mt-10 tracking-tight">Verify email</h1>
                                <p className="text-text-muted dark:text-white/60 mt-3 font-medium">We sent a code to <strong className="text-background-dark dark:text-white">{email}</strong></p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!otpStep && (
                    <div className="text-center mb-10 border-b border-border-light dark:border-white/5 pb-8">
                        <p className="text-[11px] text-text-muted dark:text-white/40 leading-relaxed max-w-[90%] mx-auto font-bold uppercase tracking-widest">
                            By continuing, you agree to the <Link href="/terms" className="text-background-dark dark:text-white underline underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-background-dark dark:text-white underline underline-offset-4">Privacy</Link>.
                        </p>
                    </div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm text-center font-bold"
                    >
                        {error}
                    </motion.div>
                )}

                {!otpStep ? (
                    <>
                        <form onSubmit={handleCredentialsRegister} className="space-y-6 mb-10">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                    placeholder="John Doe"
                                />
                            </div>
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
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-white/40 mb-3 block px-1">Account Role</label>
                                <div className="relative group">
                                    <select
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        className="w-full px-5 py-4 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] font-bold focus:outline-none focus:border-primary transition-all appearance-none pr-10"
                                    >
                                        <option value="SELLER">Freelancer / Seller</option>
                                        <option value="BUYER">Employer / Buyer</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-colors group-hover:text-primary">expand_more</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-6 mb-8 px-1">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptedTerms}
                                        onChange={e => setAcceptedTerms(e.target.checked)}
                                        className="w-5 h-5 rounded-lg border-2 border-border-light dark:border-white/10 text-primary focus:ring-primary/20 bg-transparent cursor-pointer appearance-none checked:bg-primary checked:border-primary transition-all"
                                    />
                                    {acceptedTerms && <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-white text-[14px] pointer-events-none">check</span>}
                                </div>
                                <label htmlFor="terms" className="text-[12px] text-text-muted dark:text-white/50 cursor-pointer font-bold select-none">
                                    I accept all policies
                                </label>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-background-dark dark:bg-white dark:text-background-dark text-white font-extrabold rounded-full shadow-2xl disabled:opacity-50 transition-all text-[15px]"
                            >
                                {isLoading ? 'Architecting Account...' : 'Create Account'}
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
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:text-primary/70 dark:text-white dark:hover:text-primary underline underline-offset-8 transition-colors">Sign in</Link>
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
                            {isLoading ? 'Verifying...' : 'Verify & Launch'}
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
                                ← Back to start
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-background-dark"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <RegisterContent />
        </Suspense>
    );
}

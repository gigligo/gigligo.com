'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
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
            setSuccess('If an account exists with this email, a reset code has been sent.');
            setStep('code');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset code.');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authApi.resetPassword(email, code, newPassword);
            setStep('done');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The code may be invalid or expired.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-900">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: 96 }}>
                <div className="w-full max-w-md">
                    <div className="bg-slate-800 rounded-2xl border border-white/10 p-8">
                        {step === 'email' && (
                            <>
                                <h1 className="text-2xl font-bold text-slate-100 mb-2">Forgot Password</h1>
                                <p className="text-sm text-slate-100/50 mb-6">Enter your email address and we&apos;ll send you a verification code to reset your password.</p>
                                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg mb-4">{error}</p>}
                                <form onSubmit={handleSendCode} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-100/60 font-semibold block mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-slate-100 text-sm placeholder:text-slate-100/20 focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Code'}
                                    </button>
                                </form>
                                <p className="text-center text-xs text-slate-100/40 mt-6">
                                    Remember your password?{' '}
                                    <Link href="/login" className="text-primary hover:underline font-semibold">Log In</Link>
                                </p>
                            </>
                        )}

                        {step === 'code' && (
                            <>
                                <h1 className="text-2xl font-bold text-slate-100 mb-2">Reset Password</h1>
                                <p className="text-sm text-slate-100/50 mb-2">{success}</p>
                                <p className="text-xs text-slate-100/40 mb-6">Enter the 6-digit code sent to <strong className="text-primary">{email}</strong> and your new password.</p>
                                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg mb-4">{error}</p>}
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-100/60 font-semibold block mb-2">Verification Code</label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            required
                                            maxLength={6}
                                            placeholder="123456"
                                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-slate-100 text-sm text-center tracking-[0.5em] font-mono text-xl placeholder:text-slate-100/20 focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-100/60 font-semibold block mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            placeholder="Min 8 characters"
                                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-slate-100 text-sm placeholder:text-slate-100/20 focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-100/60 font-semibold block mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            placeholder="Repeat password"
                                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-slate-100 text-sm placeholder:text-slate-100/20 focus:outline-none focus:border-primary/50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !code || !newPassword || !confirmPassword}
                                        className="w-full py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition disabled:opacity-50"
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                                <button
                                    onClick={() => { setStep('email'); setError(''); }}
                                    className="w-full text-center text-xs text-slate-100/40 mt-4 hover:text-primary transition"
                                >
                                    ← Use a different email
                                </button>
                            </>
                        )}

                        {step === 'done' && (
                            <div className="text-center py-6">
                                <div className="text-4xl mb-4">✅</div>
                                <h1 className="text-2xl font-bold text-slate-100 mb-2">Password Reset!</h1>
                                <p className="text-sm text-slate-100/50 mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
                                <Link
                                    href="/login"
                                    className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

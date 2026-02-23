'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError('Invalid email or password');
            setIsLoading(false);
        } else {
            router.push(callbackUrl);
            router.refresh();
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 tracking-tight">Welcome back</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to your Gigligo account</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />

                    <div className="flex items-center justify-between text-xs py-2">
                        <label className="flex items-center text-slate-600 dark:text-slate-400">
                            <input type="checkbox" className="mr-2 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-teal-vibrant focus:ring-teal-vibrant" />
                            Remember me
                        </label>
                        <a href="#" className="font-medium text-teal-vibrant hover:text-teal-vibrant/80 transition">Forgot password?</a>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-teal-vibrant text-slate-950 font-bold rounded-lg hover:bg-teal-vibrant/90 transition-all shadow-md shadow-teal-vibrant/20 text-sm disabled:opacity-50">
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            if (!email) {
                                setError('Please enter your email address first to use Face ID / Touch ID.');
                                return;
                            }
                            setIsLoading(true);
                            setError('');
                            try {
                                const { startAuthentication } = await import('@simplewebauthn/browser');
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

                                // 1. Get auth options from server
                                const optsRes = await fetch(`${apiUrl}/api/auth/webauthn/login/options`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email })
                                });
                                if (!optsRes.ok) throw new Error('Biometric login unavailable for this email.');
                                const options = await optsRes.json();

                                // 2. Prompt user to authenticate via WebAuthn
                                const asseResp = await startAuthentication(options);

                                // 3. Verify response with NextAuth credentials provider
                                const res = await signIn('credentials', {
                                    redirect: false,
                                    email,
                                    webauthnResponse: JSON.stringify(asseResp), // Hack: we'll intercept this in Auth.js provider
                                });

                                if (res?.error) {
                                    throw new Error(res.error);
                                }

                                router.push(callbackUrl);
                                router.refresh();
                            } catch (err: any) {
                                setError(err.message || 'Biometric login failed.');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                        className="w-full py-3 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 text-teal-vibrant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                        Sign in with Face ID / Touch ID
                    </button>

                    <div className="relative flex items-center py-4">
                        <div className="grow border-t border-slate-200 dark:border-slate-700/50"></div>
                        <span className="shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">or sign in with</span>
                        <div className="grow border-t border-slate-200 dark:border-slate-700/50"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-teal-vibrant hover:text-teal-vibrant/80 transition">Sign up</Link>
                </p>
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

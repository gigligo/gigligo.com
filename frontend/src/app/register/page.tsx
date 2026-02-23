'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') === 'SELLER' ? 'SELLER' : 'BUYER';

    const [role, setRole] = useState<'BUYER' | 'SELLER'>(initialRole);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!termsAccepted) {
            setError('You must accept the Terms of Service and Privacy Policy.');
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    role: role === 'BUYER' ? 'EMPLOYER' : 'SELLER',
                    termsAccepted
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Registration failed');
            }

            // Temporarily store the email to allow WebAuthn registration
            setHasRegistered(true);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleWebAuthnSetup = async () => {
        setIsLoading(true);
        setError('');
        try {
            // First we need to login to get a token to register the passkey
            const { signIn } = await import('next-auth/react');
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) throw new Error('Could not auto-login to set up Passkey.');

            // Now perform device registration
            const { startRegistration } = await import('@simplewebauthn/browser');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

            const optsRes = await fetch(`${apiUrl}/api/auth/webauthn/register/options`, {
                headers: { Authorization: `Bearer ${(res as any)?.accessToken || ''}` } // NextAuth doesn't return token directly here on client side, we might need a workaround or just fetch session
            });

            // To be entirely safe, we should rely on the session if we just signed in, 
            // but NextAuth `signIn` without redirect requires page refresh or `getSession()`.
            const { getSession } = await import('next-auth/react');
            const session = await getSession();
            const token = (session as any)?.accessToken;

            const optsResWithToken = await fetch(`${apiUrl}/api/auth/webauthn/register/options`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!optsResWithToken.ok) throw new Error('Failed to start passkey setup.');
            const options = await optsResWithToken.json();

            const attResp = await startRegistration(options);

            const verifyRes = await fetch(`${apiUrl}/api/auth/webauthn/register/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(attResp)
            });

            if (!verifyRes.ok) throw new Error('Passkey verification failed.');

            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            // If it fails or they cancel, just send them to login
            router.push('/login?registered=true');
        } finally {
            setIsLoading(false);
        }
    };

    if (hasRegistered) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
                <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-teal-vibrant/10 text-teal-vibrant rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account Created!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                        Would you like to enable Face ID or Touch ID for faster, passwordless sign-ins in the future?
                    </p>

                    <button
                        onClick={handleWebAuthnSetup}
                        disabled={isLoading}
                        className="w-full py-3 mb-3 bg-teal-vibrant text-slate-950 font-bold rounded-xl hover:bg-teal-vibrant/90 transition shadow-lg shadow-teal-vibrant/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Setting up...' : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                                Enable Biometric Login
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => router.push('/login?registered=true')}
                        className="w-full py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center">
                        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                            <defs><linearGradient id="lgReg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#00f5d4" /><stop offset="1" stopColor="#4f46e5" /></linearGradient></defs>
                            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#lgReg)" strokeWidth="3.5" strokeLinecap="round" />
                            <path d="M19 18 H30" stroke="url(#lgReg)" strokeWidth="3.5" strokeLinecap="round" />
                            <circle cx="19" cy="18" r="2" fill="#00f5d4" />
                        </svg>
                        <span className="font-display text-xl font-black tracking-tighter text-slate-900 dark:text-white">gigligo<span className="text-teal-vibrant opacity-60">.com</span></span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 tracking-tight">Create your account</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Join the Gigligo freelance community</p>
                </div>

                {/* Role Selector */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8 border border-slate-200 dark:border-slate-800">
                    <button type="button" onClick={() => setRole('BUYER')} className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition-all ${role === 'BUYER' ? 'bg-white dark:bg-teal-vibrant/20 shadow-sm text-teal-vibrant' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                        I want to Hire
                    </button>
                    <button type="button" onClick={() => setRole('SELLER')} className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition-all ${role === 'SELLER' ? 'bg-white dark:bg-teal-vibrant/20 shadow-sm text-teal-vibrant' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                        I want to Work
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
                    <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />


                    <div className="flex items-start gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 shrink-0 w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-teal-vibrant focus:ring-teal-vibrant/20 cursor-pointer"
                            required
                        />
                        <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none">
                            I agree to the <Link href="/terms" className="text-teal-vibrant hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-teal-vibrant hover:underline">Privacy Policy</Link>, and consent to ID verification if required.
                        </label>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-teal-vibrant text-slate-950 font-bold rounded-lg hover:bg-teal-vibrant/90 transition-all shadow-md shadow-teal-vibrant/20 text-sm mt-4 disabled:opacity-50">
                        {isLoading ? 'Creating account...' : `Create ${role === 'SELLER' ? 'Freelancer' : 'Client'} Account`}
                    </button>

                    <div className="relative flex items-center py-4">
                        <div className="grow border-t border-slate-200 dark:border-slate-700/50"></div>
                        <span className="shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">or sign up with</span>
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
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-teal-vibrant hover:text-teal-vibrant/80 transition">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm">Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}

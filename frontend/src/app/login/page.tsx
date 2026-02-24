'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [isLoading, setIsLoading] = useState(false);

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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 tracking-tight">Welcome</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in or create an account to continue</p>
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

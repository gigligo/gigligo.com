'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RoleSelectionPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isNewGoogleUser = session && (session as any).isNewGoogleUser;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && !isNewGoogleUser) {
            router.push('/dashboard');
        }
    }, [status, isNewGoogleUser, router]);

    const handleRoleSelect = async (role: 'SELLER' | 'EMPLOYER') => {
        setIsLoading(true);
        setError('');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${apiUrl}/api/auth/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${(session as any)?.accessToken}`
                },
                body: JSON.stringify({ role })
            });

            if (res.ok) {
                const data = await res.json();
                // Tell NextAuth to update the session with the new role
                await update({ role: data.user.role, isNewGoogleUser: false });
                router.push('/dashboard');
            } else {
                const errData = await res.json();
                setError(errData.message || "Failed to update role");
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || !isNewGoogleUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500 text-sm">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
            <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-white/10 max-w-2xl w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
                        <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                            <defs><linearGradient id="lgRole" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#00f5d4" /><stop offset="1" stopColor="#4f46e5" /></linearGradient></defs>
                            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#lgRole)" strokeWidth="3.5" strokeLinecap="round" />
                            <path d="M19 18 H30" stroke="url(#lgRole)" strokeWidth="3.5" strokeLinecap="round" />
                            <circle cx="19" cy="18" r="2" fill="#00f5d4" />
                        </svg>
                        <span className="font-display text-2xl font-black tracking-tighter text-white">gigligo<span className="text-teal-vibrant opacity-60">.com</span></span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Welcome to Gigligo!</h1>
                    <p className="text-slate-400 text-base max-w-lg mx-auto">
                        To tailor your experience, please tell us how you plan to use the platform. You are almost done.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20">{error}</div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Freelancer Option */}
                    <button
                        onClick={() => handleRoleSelect('SELLER')}
                        disabled={isLoading}
                        className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-teal-vibrant/50 rounded-2xl p-8 text-left transition-all overflow-hidden flex flex-col h-full"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 rounded-full bg-teal-vibrant/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-teal-vibrant" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-vibrant transition-colors">I want to Work</h3>
                        <p className="text-slate-400 text-sm leading-relaxed grow">
                            Join as a Freelancer. Offer your skills, browse jobs, and build your digital career globally.
                        </p>
                    </button>

                    {/* Employer Option */}
                    <button
                        onClick={() => handleRoleSelect('EMPLOYER')}
                        disabled={isLoading}
                        className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400/50 rounded-2xl p-8 text-left transition-all overflow-hidden flex flex-col h-full"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 rounded-full bg-indigo-400/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">I want to Hire</h3>
                        <p className="text-slate-400 text-sm leading-relaxed grow">
                            Join as a Client. Post jobs, browse talented freelancers, and get your projects done efficiently.
                        </p>
                    </button>
                </div>

                {isLoading && (
                    <div className="mt-8 text-center text-teal-vibrant text-sm animate-pulse font-medium">
                        Saving your preferences...
                    </div>
                )}
            </div>
        </div>
    );
}

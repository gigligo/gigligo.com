'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';

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
            <div className="min-h-screen flex items-center justify-center bg-background-dark text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
                Authenticating Network...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark px-6 py-20 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-40" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-20" />

            <div className="max-w-4xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-20"
                >
                    <Link href="/" className="inline-block mb-12">
                        <Logo className="h-4 w-auto" variant="white" />
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase leading-none italic">
                        Select Your <span className="text-primary not-italic">Identity.</span>
                    </h1>
                    <p className="text-white/40 text-lg md:text-xl font-bold max-w-lg mx-auto leading-tight uppercase tracking-widest opacity-60">
                        Tailor your experience within the Gigligo ecosystem. This action is final.
                    </p>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-10 text-center border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Freelancer Option */}
                    <motion.button
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect('SELLER')}
                        disabled={isLoading}
                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-[3.5rem] p-12 text-left transition-all backdrop-blur-3xl overflow-hidden flex flex-col h-full shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary text-3xl font-light">verified</span>
                        </div>
                        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 text-primary border border-primary/20 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <span className="material-symbols-outlined text-4xl font-light">work</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic grayscale group-hover:grayscale-0 transition-all">I want to Work</h3>
                        <p className="text-white/40 text-base font-bold leading-tight uppercase tracking-wide grow">
                            Join as an elite operative. Deploy your skills, conquer missions, and scale your digital empire.
                        </p>
                        <div className="mt-10 flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">
                            Initialize Freelancer <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    </motion.button>

                    {/* Employer Option */}
                    <motion.button
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect('EMPLOYER')}
                        disabled={isLoading}
                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-[3.5rem] p-12 text-left transition-all backdrop-blur-3xl overflow-hidden flex flex-col h-full shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary text-3xl font-light">verified</span>
                        </div>
                        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 text-primary border border-primary/20 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <span className="material-symbols-outlined text-4xl font-light">person_add</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic grayscale group-hover:grayscale-0 transition-all">I want to Hire</h3>
                        <p className="text-white/40 text-base font-bold leading-tight uppercase tracking-wide grow">
                            Join as a commander. Deploy capital, recruit top-tier talent, and execute visionary projects.
                        </p>
                        <div className="mt-10 flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">
                            Initialize Employer <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    </motion.button>
                </div>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-16 text-center text-primary text-[10px] font-black uppercase tracking-[0.5em] animate-pulse"
                    >
                        WRITING IDENTITY TO NETWORK...
                    </motion.div>
                )}
            </div>
        </div>
    );
}

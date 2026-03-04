'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Mesh Blurs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl w-full bg-white p-12 md:p-16 rounded-[3rem] border border-red-500/20 shadow-2xl backdrop-blur-3xl text-center relative z-10"
            >
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-inner">
                    <span className="material-symbols-outlined text-5xl font-light">warning</span>
                </div>

                <h2 className="text-4xl font-bold text-background-dark mb-4 tracking-tight">System Glitch</h2>

                <p className="text-lg text-text-muted mb-10 leading-relaxed font-medium">
                    {error.message || 'An unexpected error occurred during execution. Our team has been notified.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => reset()}
                        className="px-10 py-5 bg-red-500 text-white font-extrabold rounded-full text-[15px] shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all uppercase tracking-widest"
                    >
                        Force Restart
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/'}
                        className="px-10 py-5 bg-white border border-border-light text-background-dark font-bold rounded-full text-[15px] hover:border-red-500/50 transition-all backdrop-blur-xl uppercase tracking-widest"
                    >
                        Abort to Home
                    </motion.button>
                </div>

                <div className="mt-12 pt-8 border-t border-border-light">
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.3em]">
                        Error Digest: {error.digest || 'N/A'}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

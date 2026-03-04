'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Mesh Blurs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-32 h-32 rounded-4xl bg-black/5 border border-border-light text-primary flex items-center justify-center mx-auto mb-12 backdrop-blur-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                >
                    <span className="material-symbols-outlined text-6xl font-light">explore_off</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-[12rem] font-black leading-none tracking-tighter text-background-dark mb-6 opacity-10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
                >
                    404
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl md:text-6xl font-bold text-background-dark mb-6 tracking-tight"
                >
                    Lost in Space?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl text-text-muted mb-12 max-w-lg mx-auto font-medium"
                >
                    The page you're looking for has vanished into the digital void. Let's get you back on track.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/"
                            className="inline-block px-12 py-5 bg-background-dark text-white font-extrabold rounded-full text-lg shadow-2xl transition-all"
                        >
                            Return to Mission
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/contact"
                            className="inline-block px-12 py-5 bg-white border border-border-light text-background-dark font-bold rounded-full text-lg hover:border-primary transition-all backdrop-blur-xl"
                        >
                            Contact Control
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

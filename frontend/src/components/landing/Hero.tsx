'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 sm:py-32 bg-[#0A0A0B]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-75" />
                <div className="absolute bottom-1/4 right-1/4 w-120 h-120 bg-indigo-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-150" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

                {/* Linear gradient mask for fading out the background towards the bottom */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0A0A0B]/50 to-[#0A0A0B]" />
            </div>

            <div className="container px-4 md:px-6 relative z-10 max-w-5xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center space-y-10">

                    {/* Top Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-white/80 tracking-wide">The New Standard in Freelancing</span>
                    </motion.div>

                    {/* Headline */}
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1]"
                        >
                            Find the Best Talent
                            <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white/80 to-white/40">
                                Smarter & Faster.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 font-medium leading-relaxed"
                        >
                            Connect with top-tier professionals worldwide. Complete your projects securely with our advanced matching system and escrow protection.
                        </motion.p>
                    </div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
                    >
                        <Link href="/register" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 group">
                                Get Started
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>

                        <Link href="/jobs" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-full font-bold text-lg transition-all hover:border-white/40 active:scale-95 flex items-center justify-center gap-2">
                                Explore Jobs
                            </button>
                        </Link>
                    </motion.div>

                    {/* Quick Stats or Trust Indicators underneath CTAs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="pt-12 flex items-center justify-center gap-8 text-sm font-medium text-white/40 flex-wrap"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Secure Escrow
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Verified Talent
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            AI Powered Matching
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

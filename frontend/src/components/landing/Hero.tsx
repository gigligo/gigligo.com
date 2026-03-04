'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[85vh] flex items-center overflow-hidden bg-white pt-24 pb-16"
        >
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-6 md:px-10 relative z-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left — Text Content */}
                    <motion.div
                        style={{ y: textY }}
                        className="max-w-xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-semibold text-primary tracking-wide">The New Standard in Freelancing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-text-main leading-[1.15] mb-6"
                        >
                            Find the Best Talent,{' '}
                            <span className="text-primary">Smarter & Faster.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-text-muted font-medium leading-relaxed mb-10 max-w-md"
                        >
                            Connect with top-tier professionals worldwide. Complete projects securely with advanced matching and escrow protection.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-start gap-3"
                        >
                            <Link href="/register">
                                <button className="px-7 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-[15px] transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] flex items-center gap-2 group">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </Link>
                            <Link href="/jobs">
                                <button className="px-7 py-3.5 bg-transparent border border-gray-200 hover:border-gray-300 text-text-main rounded-xl font-semibold text-[15px] transition-all hover:bg-gray-50 active:scale-[0.98]">
                                    Explore Jobs
                                </button>
                            </Link>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="pt-10 flex items-center gap-6 text-xs font-medium text-text-muted flex-wrap"
                        >
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Secure Escrow
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Verified Talent
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                AI Matching
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right — Hero Illustration with Parallax */}
                    <motion.div
                        style={{ y: imageY, scale: imageScale }}
                        className="relative w-full aspect-4/3 lg:aspect-square"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src="/hero-landing.png"
                                alt="Gigligo — Connecting talent with opportunity"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

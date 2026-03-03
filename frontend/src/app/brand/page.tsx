'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { motion, Variants } from 'framer-motion';

export default function HorizonLogoStory() {
    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white font-sans antialiased overflow-x-hidden selection:bg-primary/30">
            {/* Minimalist Navigation */}
            <nav className="absolute top-0 w-full z-50 p-10 flex justify-between items-center text-white mix-blend-difference">
                <Link href="/" className="font-black tracking-[0.4em] uppercase hover:text-primary transition-all text-[10px] flex items-center gap-3 group">
                    <span className="material-symbols-outlined text-xl group-hover:-translate-x-2 transition-transform">arrow_back</span> Return to Base
                </Link>
                <Logo className="h-4 w-auto" variant="white" />
            </nav>

            <main>
                {/* Cinema Hero Section */}
                <section className="relative h-screen flex flex-col justify-center items-center bg-background-dark text-white overflow-hidden px-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,124,255,0.15)_0%,transparent_70%)] pointer-events-none" />

                    {/* The Horizon Graphic */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "80%", opacity: 0.3 }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-primary to-transparent mx-auto"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ duration: 3 }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-linear-to-t from-transparent via-primary/20 to-transparent blur-[120px]"
                    />

                    <div className="relative z-10 text-center max-w-5xl mx-auto">
                        <motion.div
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                            className="inline-block px-8 py-2 bg-white/5 border border-white/10 text-primary font-black text-[10px] uppercase tracking-[0.5em] rounded-full mb-12 backdrop-blur-3xl shadow-2xl"
                        >
                            Brand Intelligence
                        </motion.div>
                        <motion.h1
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            className="text-6xl md:text-[8rem] font-black tracking-tighter mb-10 leading-[0.85] uppercase italic"
                        >
                            The Horizon of <br /><span className="text-primary not-italic">Opportunity.</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-bold leading-tight uppercase tracking-widest opacity-60"
                        >
                            Experience the precision of growth and the trust of a new professional beginning. Built for elite execution.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-12 flex flex-col items-center gap-4 text-white/20"
                    >
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black">Scan Down</span>
                        <span className="material-symbols-outlined text-2xl font-light">south</span>
                    </motion.div>
                </section>

                {/* Strategic Stages */}
                <section className="py-48 bg-white dark:bg-background-dark px-6 border-b border-border-light dark:border-white/5 relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-40">
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="text-5xl md:text-[6rem] font-black tracking-tighter mb-8 uppercase leading-none grayscale hover:grayscale-0 transition-all"
                            >
                                Three Pillars of <br /><span className="text-primary italic">Evolution.</span>
                            </motion.h2>
                            <p className="text-text-muted dark:text-white/40 text-xl font-bold max-w-2xl mx-auto italic leading-tight">
                                Our philosophy is embedded in every pixel. The horizon line guides you through the essential phases of digital career expansion.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {[
                                { num: '01', icon: 'draw', title: 'Ideate', desc: 'The spark. Defining high-impact missions and identifying visionary talent.' },
                                { num: '02', icon: 'forum', title: 'Sync', desc: 'The connection. Real-time tactical alignment through secure communication rails.' },
                                { num: '03', icon: 'rocket_launch', title: 'Launch', desc: 'The execution. Escrow-backed mission starts and flawless project transitions.' }
                            ].map((stage, i) => (
                                <motion.div
                                    key={stage.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="group relative"
                                >
                                    <div className="text-[8rem] font-black text-black/3 dark:text-white/3 absolute -top-20 -left-6 lining-nums group-hover:text-primary/10 transition-colors pointer-events-none">
                                        {stage.num}
                                    </div>
                                    <div className="relative z-10 p-10 rounded-[3rem] border border-border-light dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-3xl hover:border-primary/40 transition-all shadow-2xl hover:shadow-primary/5">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-10 border border-primary/20 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <span className="material-symbols-outlined text-3xl font-light">{stage.icon}</span>
                                        </div>
                                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">{stage.title}</h3>
                                        <p className="text-text-muted dark:text-white/50 leading-snug font-bold">
                                            {stage.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final Visionary Section */}
                <section className="py-48 bg-background-dark text-white relative overflow-hidden">
                    <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-40 animate-pulse" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <h2 className="text-5xl md:text-[7rem] font-black tracking-tighter mb-10 leading-[0.85] uppercase italic">
                                    Strategic <span className="text-primary not-italic">Enclaves.</span>
                                </h2>
                                <p className="text-white/50 text-xl font-bold leading-tight mb-16 max-w-xl opacity-80 uppercase tracking-widest">
                                    The workspace is no longer constrained by geography. We've optimized an environment where elite professionals and visionary ventures intersect.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="/search" className="inline-flex h-20 px-16 items-center justify-center bg-white text-background-dark font-black tracking-[0.2em] text-sm uppercase rounded-full hover:bg-primary hover:text-white transition-all shadow-2xl shadow-black/50">
                                        Explore the Network
                                    </Link>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="grid grid-cols-2 gap-8"
                            >
                                <div className="space-y-8">
                                    <div className="aspect-square bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center text-white/5 hover:border-primary/50 transition-all duration-700 shadow-2xl group">
                                        <span className="material-symbols-outlined text-[8rem] font-thin group-hover:text-primary/30 transition-all">architecture</span>
                                    </div>
                                    <div className="aspect-4/3 bg-primary/10 border border-primary/20 rounded-[3rem] flex items-center justify-center text-primary/20 hover:bg-primary/20 transition-all duration-700 shadow-2xl group">
                                        <span className="material-symbols-outlined text-7xl font-thin group-hover:scale-125 transition-all">handshake</span>
                                    </div>
                                </div>
                                <div className="space-y-8 mt-24">
                                    <div className="aspect-4/3 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center text-white/5 hover:border-primary/50 transition-all duration-700 shadow-2xl group">
                                        <span className="material-symbols-outlined text-7xl font-thin group-hover:text-primary transition-all">verified_user</span>
                                    </div>
                                    <div className="aspect-square bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center text-white/5 hover:border-primary/50 transition-all duration-700 shadow-2xl group">
                                        <span className="material-symbols-outlined text-[8rem] font-thin group-hover:rotate-360 transition-all duration-3000">language</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Minimal High-End Footer */}
            <footer className="bg-background-dark border-t border-white/5 py-16 text-center">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
                    <Logo className="h-5 w-auto grayscale" variant="white" />
                    <p className="text-white/10 text-[10px] font-black tracking-[0.6em] uppercase">© {new Date().getFullYear()} GIGLIGO ENTERPRISE NETWORK. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
}

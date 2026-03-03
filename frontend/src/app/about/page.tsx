'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* ═══ Premium Hero ═══ */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background-dark text-white px-6">
                    {/* Mesh Blurs */}
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-30" />

                    <div className="relative z-10 text-center max-w-5xl mx-auto">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="mb-12 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Our Visionary Mission</span>
                        </motion.div>

                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-6xl md:text-[8rem] font-black tracking-tighter mb-8 leading-[0.9] uppercase"
                        >
                            gigligo<span className="text-primary italic">.com</span>
                        </motion.h1>

                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-xl md:text-3xl text-white/60 font-medium mb-16 max-w-3xl mx-auto leading-tight"
                        >
                            A marketplace where verified cinematic talent meets serious enterprise. Bridging the gap for 30M+ professionals.
                        </motion.p>

                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <Link href="/register" className="h-18 px-14 inline-flex items-center justify-center bg-primary text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 text-[15px] uppercase tracking-widest">
                                Start Your Journey
                            </Link>
                            <Link href="#manifesto" className="h-18 px-14 inline-flex items-center justify-center bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-3xl text-[15px] uppercase tracking-widest">
                                The Manifesto
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* ═══ Founder Section ═══ */}
                <section id="manifesto" className="py-32 bg-white dark:bg-background-dark relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl opacity-50" />
                                <div className="relative aspect-4/5 rounded-[3.5rem] overflow-hidden border border-border-light dark:border-white/10 shadow-2xl group">
                                    <img
                                        alt="Ali Noman"
                                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                        src="/images/hero/hero.jpg"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-10 left-10">
                                        <p className="text-white text-3xl font-black uppercase tracking-tighter">Ali Noman</p>
                                        <p className="text-primary text-xs font-bold uppercase tracking-[0.3em]">Founder & Visionary</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="relative z-10">
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="text-5xl md:text-7xl font-black text-background-dark dark:text-white mb-10 tracking-tighter uppercase leading-[0.9]"
                                >
                                    Rewriting <br /><span className="text-primary italic">The Future.</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-xl text-text-muted dark:text-white/60 font-medium mb-8 leading-relaxed"
                                >
                                    A tech entrepreneur with a singular mission: to unlock the dormant potential of Pakistan's 30 million university students.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-xl text-text-muted dark:text-white/60 font-medium mb-12 leading-relaxed"
                                >
                                    Gigligo isn't just a platform; it's an economic movement designed to provide affordable, high-quality talent access for businesses worldwide while empowering students to earn while they learn.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="grid grid-cols-3 gap-6"
                                >
                                    {[
                                        { value: '30M+', label: 'Students' },
                                        { value: '100K', label: 'Launch Goal' },
                                        { value: '<2%', label: 'Disputes' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 border border-border-light dark:border-white/10 backdrop-blur-xl">
                                            <p className="text-3xl font-black text-background-dark dark:text-white mb-1 tracking-tighter">{stat.value}</p>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{stat.label}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ Mission Grid ═══ */}
                <section className="py-32 bg-black dark:bg-white text-white dark:text-background-dark relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="text-center mb-24">
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="text-5xl md:text-[6rem] font-black tracking-tighter mb-8 leading-none"
                            >
                                THE <span className="text-primary italic">CORE</span> PILLARS
                            </motion.h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { num: '01', title: '100K SCALE', desc: 'Connecting Pakistan\'s elite talent base in a unified high-performance network.' },
                                { num: '02', title: 'ESCROW SECURITY', desc: 'Ensuring every PKR 1 committed is protected by military-grade security infrastructure.' },
                                { num: '03', title: 'GROWTH GRANTS', desc: 'Plowing back capital into educational funds for our top-tier performers.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 dark:bg-black/5 rounded-[3rem] p-12 border border-white/10 dark:border-black/10 transition-all hover:bg-primary/10 hover:border-primary/20 group"
                                >
                                    <span className="text-7xl font-black text-white/5 dark:text-black/5 block mb-8 group-hover:text-primary/20 transition-colors uppercase italic">{item.num}</span>
                                    <h4 className="text-3xl font-black mb-6 tracking-tighter group-hover:translate-x-2 transition-transform uppercase leading-tight">{item.title}</h4>
                                    <p className="text-lg opacity-60 font-medium group-hover:opacity-100 transition-opacity">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ CTA ═══ */}
                <section className="py-40 bg-white dark:bg-background-dark text-center relative overflow-hidden">
                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-6xl md:text-[8rem] font-black text-background-dark dark:text-white mb-12 tracking-tighter leading-none uppercase"
                        >
                            JOIN THE <br /><span className="text-primary italic">MOVEMENT.</span>
                        </motion.h2>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/register?role=SELLER" className="h-20 px-16 inline-flex items-center justify-center bg-background-dark dark:bg-white text-white dark:text-background-dark font-black rounded-full shadow-2xl text-lg uppercase tracking-widest">
                                    Become Talent
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/search" className="h-20 px-16 inline-flex items-center justify-center bg-white dark:bg-background-dark border-2 border-background-dark dark:border-white text-background-dark dark:text-white font-black rounded-full text-lg uppercase tracking-widest hover:bg-background-dark dark:hover:bg-white hover:text-white dark:hover:text-background-dark transition-all">
                                    Hire Elite
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

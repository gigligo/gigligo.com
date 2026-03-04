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
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-text-main selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 80 }}>
                {/* Hero */}
                <section className="py-20 md:py-28 bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-semibold text-primary tracking-wide">Our Mission</span>
                        </motion.div>

                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight"
                        >
                            Verified talent meets <span className="text-primary">serious business.</span>
                        </motion.h1>

                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-lg text-text-muted font-medium mb-8 max-w-2xl mx-auto leading-relaxed"
                        >
                            A marketplace where verified cinematic talent meets serious enterprise. Bridging the gap for 30M+ professionals.
                        </motion.p>

                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row gap-3 justify-center"
                        >
                            <Link href="/register" className="px-7 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">
                                Start Your Journey
                            </Link>
                            <Link href="#manifesto" className="px-7 py-3 bg-gray-50 border border-gray-200 text-text-main font-semibold rounded-xl hover:bg-gray-100 transition-all text-sm">
                                The Manifesto
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Founder Section */}
                <section id="manifesto" className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="relative aspect-4/5 rounded-3xl overflow-hidden border border-gray-100 shadow-lg group">
                                    <img
                                        alt="Ali Noman"
                                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                                        src="/images/hero/hero.jpg"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-8 left-8">
                                        <p className="text-white text-2xl font-bold">Ali Noman</p>
                                        <p className="text-primary text-xs font-semibold uppercase tracking-widest mt-1">Founder & Visionary</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-3xl md:text-4xl font-bold text-text-main mb-6 tracking-tight"
                                >
                                    Rewriting <span className="text-primary">The Future.</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-base text-text-muted font-medium mb-4 leading-relaxed"
                                >
                                    A tech entrepreneur with a singular mission: to unlock the dormant potential of Pakistan&apos;s 30 million university students.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-base text-text-muted font-medium mb-10 leading-relaxed"
                                >
                                    Gigligo isn&apos;t just a platform; it&apos;s an economic movement designed to provide affordable, high-quality talent access for businesses worldwide while empowering students to earn while they learn.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    {[
                                        { value: '30M+', label: 'Students' },
                                        { value: '100K', label: 'Launch Goal' },
                                        { value: '<2%', label: 'Disputes' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                            <p className="text-2xl font-bold text-text-main mb-0.5">{stat.value}</p>
                                            <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">{stat.label}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="py-20 bg-[#FAFBFD] border-y border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 md:px-12">
                        <div className="text-center mb-14">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
                            >
                                The <span className="text-primary">Core</span> Pillars
                            </motion.h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { num: '01', title: '100K Scale', desc: 'Connecting Pakistan\'s elite talent base in a unified high-performance network.' },
                                { num: '02', title: 'Escrow Security', desc: 'Ensuring every PKR 1 committed is protected by military-grade security infrastructure.' },
                                { num: '03', title: 'Growth Grants', desc: 'Plowing back capital into educational funds for our top-tier performers.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <span className="text-5xl font-bold text-gray-100 block mb-4 group-hover:text-primary/15 transition-colors">{item.num}</span>
                                    <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-white text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold text-text-main mb-8 tracking-tight"
                        >
                            Join the <span className="text-primary">Movement.</span>
                        </motion.h2>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/register?role=SELLER" className="px-8 py-3.5 bg-text-main text-white font-semibold rounded-xl hover:bg-text-main/90 transition-all text-sm">
                                Become Talent
                            </Link>
                            <Link href="/search" className="px-8 py-3.5 bg-white border border-gray-200 text-text-main font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
                                Hire Elite
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

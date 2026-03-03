'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
    const fadeIn = {
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
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white selection:bg-primary/30 antialiased overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Cinematic Header */}
                <div className="relative pt-32 pb-40 overflow-hidden bg-background-dark text-white px-6">
                    {/* Mesh Blurs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-30" />

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="inline-block px-8 py-2 bg-white/5 border border-white/10 text-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-full mb-12 backdrop-blur-3xl"
                        >
                            Legal & Compliance
                        </motion.div>
                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-6xl md:text-[8rem] font-black tracking-tighter mb-10 uppercase leading-[0.9]"
                        >
                            Privacy <span className="text-primary italic">Policy.</span>
                        </motion.h1>
                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-medium leading-tight mb-4"
                        >
                            Last Updated: October 14, 2024.
                        </motion.p>
                        <motion.p
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-sm text-white/30 max-w-xl mx-auto font-bold uppercase tracking-widest"
                        >
                            Governing data retention, KYC protocols, and financial privacy standards.
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-32 -mt-24 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-white/5 border border-border-light dark:border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl backdrop-blur-3xl text-text-muted dark:text-white/60 leading-relaxed font-bold space-y-16"
                    >
                        <section>
                            <h2 className="text-3xl font-black text-background-dark dark:text-white mb-6 tracking-tighter uppercase italic border-b border-border-light dark:border-white/5 pb-4">01. Collective Intel</h2>
                            <p className="mb-6 text-lg">
                                Gigligo collects information that you provide directly to us when utilizing our executive talent marketplace. This includes:
                            </p>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-3 shrink-0" />
                                    <span><strong className="text-background-dark dark:text-white uppercase tracking-wider text-sm mr-2">Identity Data:</strong> Legal name, government-issued IDs, and biometric data specifically utilized for our Know Your Customer (KYC) / Anti-Money Laundering (AML) verifications.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-3 shrink-0" />
                                    <span><strong className="text-background-dark dark:text-white uppercase tracking-wider text-sm mr-2">Financial Data:</strong> Bank account metrics, JazzCash/EasyPaisa routing numbers, and cryptographic wallet addresses handled strictly through our secure escrow infrastructure.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-3 shrink-0" />
                                    <span><strong className="text-background-dark dark:text-white uppercase tracking-wider text-sm mr-2">Professional Data:</strong> Resumes, portfolios, academic credentials, and peer reviews.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-black text-background-dark dark:text-white mb-6 tracking-tighter uppercase italic border-b border-border-light dark:border-white/5 pb-4">02. Mission Execution</h2>
                            <p className="mb-6 text-lg">
                                We utilize the collected data fundamentally to uphold the integrity and security of the Gigligo marketplace. Primary uses encompass:
                            </p>
                            <ul className="space-y-4 text-sm uppercase tracking-widest opacity-80">
                                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-primary" /> Facilitating secure escrow transactions.</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-primary" /> Executing automated fraud detection routines.</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-primary" /> Calculating performative ranking adjustments.</li>
                                <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-primary" /> Processing withdrawals via authorized gateways.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-black text-background-dark dark:text-white mb-6 tracking-tighter uppercase italic border-b border-border-light dark:border-white/5 pb-4">03. Retention Protocol</h2>
                            <p className="text-lg">
                                Gigligo retains your profile and transaction history for as long as your account is active, or as necessary to comply with financial auditing regulations (typically 5 years post-account closure). Users retain the right to request a complete cryptographic deletion of their PII (Personally Identifiable Information) by contacting <code>dpo@gigligo.com</code>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-black text-background-dark dark:text-white mb-6 tracking-tighter uppercase italic border-b border-border-light dark:border-white/5 pb-4">04. Encryption Shield</h2>
                            <p className="text-lg">
                                We deploy military-grade structural protections, including AES-256 encryption at rest and TLS 1.3 in transit. Access to KYC biometric data is strictly limited to authorized administrative personnel operating on zero-trust network architectures.
                            </p>
                        </section>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

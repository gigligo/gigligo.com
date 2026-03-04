'use client';

import { motion, Variants } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
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
        <div className="flex flex-col min-h-screen bg-white text-background-dark selection:bg-primary/30 antialiased overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Executive Header */}
                <div className="relative pt-32 pb-40 overflow-hidden bg-white px-6 border-b border-border-light">
                    {/* Mesh Blurs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

                    <div className="max-w-6xl mx-auto flex flex-col items-start relative z-10">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="flex items-center gap-4 mb-8"
                        >
                            <span className="w-16 h-[3px] bg-primary rounded-full"></span>
                            <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Operational Charter</span>
                        </motion.div>

                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-6xl md:text-[8rem] font-black tracking-tighter mb-10 uppercase leading-[0.9]"
                        >
                            Terms of <span className="text-primary italic">Service.</span>
                        </motion.h1>

                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="text-2xl text-text-muted max-w-3xl font-bold leading-tight"
                        >
                            Governing the access and utilization of the Gigligo elite talent network. <br /><span className="text-primary">Effective Date: October 14, 2024.</span>
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-32 animate-fade-in flex flex-col md:flex-row gap-24 relative z-20">
                    {/* Navigation Sidebar */}
                    <div className="w-full md:w-72 shrink-0 hidden md:block">
                        <div className="sticky top-40 space-y-6 border-l-2 border-border-light pl-10">
                            {[
                                { id: 'acceptance', title: '01 Acceptance' },
                                { id: 'escrow', title: '02 Escrow Holds' },
                                { id: 'disputes', title: '03 Arbitration' },
                                { id: 'milestones', title: '04 Payouts' },
                                { id: 'liability', title: '05 Liability' },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={`#${item.id}`}
                                    className="block text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all"
                                >
                                    {item.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 space-y-24 text-text-muted leading-relaxed font-bold">

                        <section id="acceptance" className="scroll-mt-48">
                            <h2 className="text-4xl font-black text-background-dark mb-8 tracking-tighter uppercase italic leading-none">01. Terms Acceptance</h2>
                            <p className="text-xl">
                                By registering on the Gigligo platform (the "Site") as either a verified Client or an Executive Consultant, you expressly agree to be bound by these Terms. If you're accepting on behalf of an enterprise, you represent legal authority to bind that entity.
                            </p>
                        </section>

                        <section id="escrow" className="scroll-mt-48">
                            <h2 className="text-4xl font-black text-background-dark mb-8 tracking-tighter uppercase italic leading-none">02. Escrow holds</h2>
                            <p className="text-xl mb-10">
                                Gigligo operates a strictly regulated marketplace framework. To initiate an Executive Contract, the Client must deposit the full sum—or the First Milestone block—into the Gigligo Corporate Escrow.
                            </p>
                            <motion.div
                                whileInView={{ scale: [0.95, 1] }}
                                className="bg-black/5 border-l-8 border-primary p-10 rounded-r-3xl"
                            >
                                <h4 className="text-primary font-black uppercase tracking-widest text-sm mb-4">Escrow Protocol Notice</h4>
                                <p className="text-lg text-background-dark leading-tight">Funds in Escrow are strictly bound. They cannot be unilaterally withdrawn without mutual authorization or formal arbitration.</p>
                            </motion.div>
                        </section>

                        <section id="disputes" className="scroll-mt-48">
                            <h2 className="text-4xl font-black text-background-dark mb-8 tracking-tighter uppercase italic leading-none">03. Arbitration</h2>
                            <p className="text-xl">
                                Should a disagreement arise, either party may invoke formal Dispute protocols. Upon invocation, all remaining funds are immediately locked. Our internal arbitrators review communications, repositories, and deliverables against the precise scope defined in the <Link href="/search" className="text-primary font-black hover:underline underline-offset-8">Executive Interface</Link>. Decisions are final.
                            </p>
                        </section>

                        <section id="milestones" className="scroll-mt-48">
                            <h2 className="text-4xl font-black text-background-dark mb-8 tracking-tighter uppercase italic leading-none">04. Milestone release</h2>
                            <p className="text-xl">
                                Enterprise contracts are governed by Milestone Payouts. Consultants are prohibited from demanding upfront compensation outside platform Escrow. Gigligo releases blocks linearly upon manual approval of artifact submissions.
                            </p>
                        </section>

                        <section id="liability" className="scroll-mt-48 pb-20">
                            <h2 className="text-4xl font-black text-background-dark mb-8 tracking-tighter uppercase italic leading-none">05. Limitation of liability</h2>
                            <p className="text-xl">
                                In no event shall Gigligo, its directors, or affiliates be liable for indirect, incidental, or special damages, including loss of profits or data, resulting from (i) access or use of the service; (ii) third-party conduct; (iii) content obtained from the network.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

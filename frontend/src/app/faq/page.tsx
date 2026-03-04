'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

const faqs = [
    {
        q: 'What is Gigligo?',
        a: "Gigligo is Pakistan's premier freelance marketplace connecting university students and graduates with businesses looking for affordable, high-quality talent. We enable students to earn while they learn.",
    },
    {
        q: 'How does the payment system work?',
        a: 'Gigligo uses a secure escrow system. When a client places an order, funds are held in escrow until the work is delivered and approved. This protects both the freelancer and the client.',
    },
    {
        q: 'What is a Founding Member?',
        a: 'The first 500 users who join Gigligo receive Founding Member status with exclusive perks: 0% commission on the first 3 projects, 25 free bonus credits, and a permanent Founding Member badge on their profile.',
    },
    {
        q: 'How do I get paid?',
        a: 'Once a client approves your delivery, 90% of the payment is released to your Gigligo Wallet. You can then withdraw funds to your bank account, JazzCash, or EasyPaisa.',
    },
    {
        q: 'What is the commission rate?',
        a: 'Gigligo charges a 10% service fee on completed orders. Founding Members enjoy 0% commission on their first 3 projects as a special launch benefit.',
    },
    {
        q: 'How does the referral program work?',
        a: 'Every user gets a unique referral link. When someone joins using your link, both you and your friend receive 10 bonus credits. There is no limit to how many people you can refer!',
    },
    {
        q: 'Is KYC verification required?',
        a: 'Yes, we require identity verification (selfie + national ID) before freelancers can start selling. This builds trust and ensures a safe marketplace for everyone.',
    },
    {
        q: 'Can I use Gigligo as both a freelancer and a client?',
        a: 'Currently, you choose a role during registration (Freelancer or Client). Contact support if you need to switch or add a secondary role to your account.',
    },
    {
        q: 'What categories of work are available?',
        a: 'We support a wide range of categories including Web Development, Mobile Apps, Graphic Design, Content Writing, Video Editing, Digital Marketing, Data Entry, and more.',
    },
    {
        q: 'How do I resolve a dispute?',
        a: 'If you have an issue with an order, you can open a dispute from your dashboard. Our support team will review the case and mediate a fair resolution within 48 hours.',
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col min-h-screen bg-white text-background-dark selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Cinematic Header */}
                <div className="relative pt-32 pb-40 overflow-hidden bg-background-dark text-white px-6">
                    {/* Mesh Blurs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50" />

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-8 py-2 bg-white/5 border border-white/10 text-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-full mb-12 backdrop-blur-3xl"
                        >
                            Knowledge Base
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-[8rem] font-black tracking-tighter mb-10 uppercase leading-[0.9]"
                        >
                            Common <span className="text-primary italic">Questions.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-medium leading-tight"
                        >
                            Everything you need to know about navigating the Gigligo ecosystem and mastering the marketplace.
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-32 -mt-24 relative z-20">
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="rounded-4xl overflow-hidden bg-white border border-border-light shadow-xl backdrop-blur-3xl transition-all hover:border-primary/40 group"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 sm:p-10 text-left transition-colors group"
                                >
                                    <span className="font-black text-background-dark text-xl md:text-2xl tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors pr-12">{faq.q}</span>
                                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                        <span className={`material-symbols-outlined text-2xl transition-transform duration-500 ease-in-out ${openIndex === i ? 'rotate-45' : ''}`}>
                                            add
                                        </span>
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="px-10 pb-12 text-text-muted text-lg leading-relaxed font-bold border-t border-border-light pt-8">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mt-32 text-center p-16 rounded-[4rem] bg-background-dark text-white border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none opacity-50" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-10 border border-white/10 shadow-inner">
                                <span className="material-symbols-outlined text-5xl font-light">support_agent</span>
                            </div>
                            <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Still Unclear?</h3>
                            <p className="text-white/50 mb-12 font-medium text-lg leading-tight max-w-sm">Our elite support concierge is standing by to resolve any mission objectives.</p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/contact"
                                    className="px-12 py-5 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-full shadow-2xl shadow-primary/20 flex items-center gap-3"
                                >
                                    Contact Support
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

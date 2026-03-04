'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const CATEGORIES = [
    {
        icon: 'rocket_launch',
        title: 'Getting Started',
        articles: [
            { title: 'How to create your account', slug: '#' },
            { title: 'Setting up your freelancer profile', slug: '#' },
            { title: 'Understanding verification levels', slug: '#' },
            { title: 'Your first gig: A step-by-step guide', slug: '#' },
        ],
    },
    {
        icon: 'payments',
        title: 'Payments & Billing',
        articles: [
            { title: 'How escrow works on Gigligo', slug: '#' },
            { title: 'Withdrawal methods and timelines', slug: '#' },
            { title: 'Understanding platform fees', slug: '#' },
            { title: 'Invoicing and tax documents', slug: '#' },
        ],
    },
    {
        icon: 'shield',
        title: 'Security & Trust',
        articles: [
            { title: 'Setting up two-factor authentication', slug: '#' },
            { title: 'KYC verification process', slug: '#' },
            { title: 'Reporting suspicious activity', slug: '#' },
            { title: 'Account recovery options', slug: '#' },
        ],
    },
    {
        icon: 'handshake',
        title: 'Contracts & Disputes',
        articles: [
            { title: 'Creating milestone-based contracts', slug: '#' },
            { title: 'Submitting deliverables for approval', slug: '#' },
            { title: 'Opening a formal dispute', slug: '#' },
            { title: 'Arbitration process explained', slug: '#' },
        ],
    },
    {
        icon: 'work',
        title: 'For Employers',
        articles: [
            { title: 'Posting your first job', slug: '#' },
            { title: 'Evaluating freelancer proposals', slug: '#' },
            { title: 'Managing active projects', slug: '#' },
            { title: 'Enterprise account features', slug: '#' },
        ],
    },
    {
        icon: 'school',
        title: 'For Students',
        articles: [
            { title: 'Student verification and benefits', slug: '#' },
            { title: 'Building your first portfolio', slug: '#' },
            { title: 'Skill assessments and badges', slug: '#' },
            { title: 'Finding student-friendly gigs', slug: '#' },
        ],
    },
];

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = searchQuery
        ? CATEGORIES.map(cat => ({
            ...cat,
            articles: cat.articles.filter(a =>
                a.title.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter(cat => cat.articles.length > 0)
        : CATEGORIES;

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
                {/* Search Hero */}
                <div className="bg-background-dark text-white py-32 px-6 relative overflow-hidden">
                    {/* Mesh Blurs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-40" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-20" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-[7rem] font-black tracking-tighter mb-8 uppercase leading-[0.9]"
                        >
                            HOW CAN WE <br /><span className="text-primary italic">SUPPORT?</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/50 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-tight"
                        >
                            Access the mission-critical knowledge base and conquer the marketplace.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-2xl mx-auto group"
                        >
                            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors text-3xl">search</span>
                            <input
                                type="text"
                                placeholder="Search Intel Articles..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-16 pr-8 py-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-primary transition-all backdrop-blur-3xl shadow-2xl font-bold uppercase tracking-widest"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCategories.map((cat, i) => (
                            <motion.div
                                key={cat.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white border border-border-light rounded-[3rem] p-10 hover:shadow-2xl hover:border-primary/30 transition-all group backdrop-blur-3xl"
                            >
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-16 h-16 rounded-3xl bg-black/5 text-text-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-border-light group-hover:border-primary shadow-inner">
                                        <span className="material-symbols-outlined text-3xl font-light">{cat.icon}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-background-dark uppercase tracking-tighter italic">{cat.title}</h3>
                                </div>
                                <ul className="space-y-6 px-1">
                                    {cat.articles.map(article => (
                                        <li key={article.title}>
                                            <Link href={article.slug} className="flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all group/link">
                                                <div className="w-1.5 h-1.5 rounded-full bg-border-light group-hover/link:bg-primary transition-colors group-hover/link:scale-150" />
                                                {article.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="mt-32 bg-background-dark text-white rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-50" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-10 border border-white/10 shadow-inner">
                                <span className="material-symbols-outlined text-5xl font-light">support_agent</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">STILL UNDER FIRE?</h2>
                            <p className="text-white/60 text-xl font-medium mb-12 max-w-lg mx-auto leading-tight">
                                Our elite support team typically responds within 120 minutes. Initiate direct contact now.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/contact" className="inline-block px-14 py-6 bg-primary text-white font-black rounded-full text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all">
                                    Contact Ops
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

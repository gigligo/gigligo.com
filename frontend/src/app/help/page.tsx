'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

import type { Metadata } from 'next';

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

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Hero */}
                <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(200,157,40,0.15)_0%,transparent_60%)] pointer-events-none" />
                    <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">How can we help?</h1>
                        <p className="text-white/60 text-lg mb-8">Search our knowledge base or browse categories below.</p>
                        <div className="relative max-w-xl mx-auto">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30">search</span>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCategories.map(cat => (
                            <div key={cat.title} className="bg-surface-light border border-border-light rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">{cat.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main">{cat.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {cat.articles.map(article => (
                                        <li key={article.title}>
                                            <Link href={article.slug} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group">
                                                <span className="material-symbols-outlined text-[14px] text-border-light group-hover:text-primary transition-colors">article</span>
                                                {article.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 bg-slate-900 text-white rounded-2xl p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,157,40,0.1)_0%,transparent_50%)] pointer-events-none" />
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-primary text-3xl mb-4">support_agent</span>
                            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                            <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                                Our support team typically responds within 2 hours during business hours.
                            </p>
                            <Link href="/contact" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

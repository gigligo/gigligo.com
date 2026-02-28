'use client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

// Mock CMS Data tailored for Gigligo's executive audience
const BLOG_POSTS = [
    {
        id: '1',
        title: 'The Future of Remote Executive Consulting in 2025',
        category: 'Market Insights',
        date: 'Oct 24, 2024',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
        excerpt: 'How top-tier enterprises are leveraging fractional C-suite executives and specialized tech architects via private networks instead of traditional sourcing.',
        featured: true
    },
    {
        id: '2',
        title: 'Navigating Cross-Border Escrow Regulations',
        category: 'Platform & Trust',
        date: 'Oct 18, 2024',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        excerpt: 'An deep dive into how Gigligo handles milestone locking, AML compliance, and biometric KYC protocols to guarantee zero counter-party risk.',
        featured: false
    },
    {
        id: '3',
        title: 'Designing High-Converting E-Commerce Architectures',
        category: 'Engineering',
        date: 'Oct 12, 2024',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        excerpt: 'A technical review of modern high-scale React architectures utilized by the top 1% of frontend engineers on our platform.',
        featured: false
    },
    {
        id: '4',
        title: 'Optimizing Your Profile for Enterprise Discovery',
        category: 'Growth Strategies',
        date: 'Oct 05, 2024',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Learn exactly which keywords and portfolio presentation metrics the Gigligo algorithm relies on to rank elite freelancers.',
        featured: false
    }
];

export default function BlogPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Market Insights', 'Platform & Trust', 'Engineering', 'Growth Strategies'];

    const featuredPost = BLOG_POSTS.find(p => p.featured);
    const standardPosts = BLOG_POSTS.filter(p => !p.featured && (activeFilter === 'All' || p.category === activeFilter));

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Header Section */}
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 animate-fade-in flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border-light">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                            Platform <span className="text-primary italic font-serif">Intelligence.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-muted font-medium">
                            Executive insights, architectural breakdowns, and platform trust mechanics sourced directly from the Gigligo network.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">

                    {/* Filter Navigation */}
                    <div className="flex flex-wrap gap-3 mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeFilter === filter
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'bg-surface-light text-text-muted border border-border-light hover:border-primary/50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Featured Post (Only show if 'All' or matches category) */}
                    {(activeFilter === 'All' || activeFilter === featuredPost?.category) && featuredPost && (
                        <div className="mb-16 group cursor-pointer animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <div className="bg-surface-light border border-border-light rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="lg:w-3/5 h-[300px] lg:h-[500px] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 z-20">
                                        <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg">
                                            Featured
                                        </span>
                                    </div>
                                </div>
                                <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                                        <span className="text-primary">{featuredPost.category}</span>
                                        <span>•</span>
                                        <span>{featuredPost.date}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6 leading-tight group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-text-muted text-lg mb-8 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all w-fit">
                                        Read Deep Dive <span className="material-symbols-outlined text-[18px]">east</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
                        {standardPosts.map((post) => (
                            <div key={post.id} className="group cursor-pointer flex flex-col">
                                <div className="relative h-64 rounded-2xl overflow-hidden border border-border-light mb-6">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 pl-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{post.category}</span>
                                        <span className="text-xs text-text-muted font-medium">{post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main leading-snug mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border-light">
                                        <span className="text-text-muted text-xs font-bold uppercase tracking-wider">{post.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter CTA */}
                    <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden animate-fade-in border border-white/5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.15)_0%,transparent_60%)] pointer-events-none" />
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-black mb-4">Command the Market.</h2>
                            <p className="text-white/60 mb-8 max-w-xl mx-auto">
                                Subscribe to the Gigligo dispatch. Receive high-signal engineering patterns and elite freelance strategies bi-weekly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your executive email"
                                    className="flex-1 px-4 py-3.5 rounded-lg bg-surface-dark border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                                />
                                <button className="px-8 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shrink-0">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

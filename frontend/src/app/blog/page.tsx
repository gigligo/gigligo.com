'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";

export default function BlogPost() {
    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-100 py-16">
                    <div className="max-w-[800px] mx-auto px-6">
                        <Link href="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors mb-8">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>

                        <div className="mb-6 flex items-center gap-3">
                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded-full">Freelancing</span>
                            <span className="px-3 py-1 bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider rounded-full">Guides</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-6">
                            Top 5 Freelance Skills High-Paying Clients Are Looking For in 2026
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-muted font-medium">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Gigligo Team
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> 5 min read
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Oct 24, 2026
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="max-w-[800px] mx-auto px-6 py-12">
                    <article className="prose prose-lg prose-slate max-w-none text-muted leading-relaxed">
                        <p className="text-xl leading-relaxed text-primary/80 font-medium mb-8">
                            The gig economy in Pakistan is booming. With over 30 million university students and
                            a rapidly digitizing small business landscape, the demand for specialized, vetted
                            local talent has never been higher.
                        </p>

                        <h2 className="text-2xl font-bold text-primary mt-12 mb-4">1. Full-Stack Web Development (Next.js & Supabase)</h2>
                        <p>
                            We&apos;re seeing a massive transition away from traditional WordPress sites. Startups
                            and even brick-and-mortar stores are looking for highly performant, custom-built web
                            applications. Specializing in modern React frameworks like Next.js makes you highly
                            valuable.
                        </p>

                        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">2. AI Prompt Engineering & Automation</h2>
                        <p>
                            You don&apos;t necessarily need a PhD in Machine Learning to capitalize on the AI boom.
                            Businesses need freelancers who know how to wire up tools like OpenAI, Anthropic, and
                            Make/Zapier to automate their customer service and lead generation.
                        </p>

                        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">3. UI/UX Product Design</h2>
                        <p>
                            A beautiful website that doesn&apos;t convert is useless. Understanding user psychology,
                            creating wireframes in Figma, and designing intuitive user journeys is one of the highest
                            paying skills on Gigligo right now.
                        </p>

                        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 my-10">
                            <h3 className="text-xl font-bold text-primary mb-3">Ready to start earning?</h3>
                            <p className="mb-6 text-primary/70">Join thousands of Pakistani students and graduates making a full-time living on their own terms.</p>
                            <Link href="/register?role=SELLER" className="inline-block px-6 py-3 bg-accent text-white font-bold rounded-xl hover:-translate-y-1 transition-transform shadow-lg shadow-accent/20">
                                Create Your Freelancer Profile
                            </Link>
                        </div>

                        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">4. Short-Form Video Editing (Reels & TikToks)</h2>
                        <p>
                            Attention is the new currency. E-commerce brands are desperate for editors who understand
                            pacing, sound design, and hooks for Instagram Reels and TikTok.
                        </p>

                        <h2 className="text-2xl font-bold text-primary mt-10 mb-4">5. SEO & Copywriting</h2>
                        <p>
                            Getting to the first page of Google is still the holy grail for local businesses. Being able
                            to write persuasive landing page copy that is also search engine optimized is a dual-threat
                            skill that commands premium rates.
                        </p>

                        <hr className="my-12 border-gray-100" />

                        <p className="font-medium text-primary">
                            <em>Have these skills? Or looking to hire someone who does? Head over to the Gigligo <Link href="/search" className="text-accent hover:underline">Talent Marketplace</Link> today.</em>
                        </p>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}

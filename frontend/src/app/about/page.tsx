'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
    const rafRef = useRef<number>(0);

    const handleScroll = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            document.querySelectorAll<HTMLElement>('[data-parallax-y]').forEach((el) => {
                const speed = parseFloat(el.dataset.parallaxY || '0');
                el.style.transform = `translateY(${window.scrollY * speed}px)`;
            });
        });
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );
        document.querySelectorAll('[data-scroll]').forEach((el) => obs.observe(el));
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { obs.disconnect(); window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafRef.current); };
    }, [handleScroll]);

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* ═══ Ultra-Minimalist Hero ═══ */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-nav-bg text-white">
                    {/* Geometric abstract */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute top-20 left-20 w-96 h-96 border border-white/20 rounded-full" data-parallax-y="-0.03"></div>
                        <div className="absolute bottom-10 right-10 w-72 h-72 border border-white/10 rotate-45" data-parallax-y="0.02"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.06)_0%,transparent_70%)] rounded-full"></div>
                    </div>

                    <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                        {/* Logo Mark */}
                        <div className="mb-12 animate-fade-in" data-scroll="fade-up">
                            <svg width="72" height="72" viewBox="0 0 36 36" fill="none" className="mx-auto">
                                <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
                                <path d="M19 18 H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
                                <circle cx="19" cy="18" r="2" fill="currentColor" className="text-primary" />
                            </svg>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05] animate-fade-in" data-scroll="fade-up" data-scroll-delay="100">
                            GIGLIGO
                        </h1>
                        <p className="text-2xl md:text-3xl text-white/50 font-normal mb-16 animate-fade-in max-w-2xl mx-auto" data-scroll="fade-up" data-scroll-delay="200">
                            Verified talent meets serious business.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" data-scroll="fade-up" data-scroll-delay="300">
                            <Link href="/register" className="h-16 px-12 inline-flex items-center justify-center bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-sm tracking-wide uppercase">
                                Enter Concierge
                            </Link>
                            <Link href="#manifesto" className="h-16 px-12 inline-flex items-center justify-center bg-white/5 border border-white/10 text-white/70 font-bold rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm tracking-wide uppercase">
                                Read the Manifesto
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ═══ Founder Section ═══ */}
                <section id="manifesto" className="py-32 bg-surface-light relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="flex justify-center lg:justify-start relative z-10" data-scroll="fade-right">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-50" />
                                    <img
                                        alt="Ali Noman — Founder & CEO"
                                        className="relative w-[320px] h-[400px] md:w-[400px] md:h-[480px] object-cover object-top rounded-4xl border-4 border-background-light shadow-2xl"
                                        src="/images/hero/hero.jpg"
                                        loading="lazy"
                                    />
                                    <div className="absolute -bottom-8 -right-8 bg-nav-bg border border-white/10 rounded-2xl px-8 py-5 shadow-2xl backdrop-blur-md">
                                        <p className="text-primary font-bold text-lg mb-1">Founder & CEO</p>
                                        <p className="text-white text-xs uppercase tracking-[0.2em] opacity-40">Gigligo</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-5xl md:text-6xl font-bold text-text-main mb-8 tracking-tight" data-scroll="fade-up">
                                    Meet <span className="text-primary">Ali Noman</span>
                                </h2>
                                <p className="text-xl text-text-muted font-medium mb-8 leading-relaxed" data-scroll="fade-up" data-scroll-delay="150">
                                    A passionate tech entrepreneur from Pakistan, Ali founded Gigligo with a singular vision: to unlock the potential of 30 million+ university students by connecting them with businesses that need affordable, high-quality talent.
                                </p>
                                <p className="text-xl text-text-muted font-medium mb-12 leading-relaxed" data-scroll="fade-up" data-scroll-delay="250">
                                    With years of experience in the tech industry and a deep understanding of Pakistan&apos;s education landscape, Ali saw an opportunity to create a platform that empowers students to earn while they learn.
                                </p>
                                <blockquote className="text-2xl font-medium italic text-text-main border-l-4 border-primary pl-8 py-4 mb-12 bg-background-light/50 rounded-r-2xl" data-scroll="fade-up" data-scroll-delay="350">
                                    &ldquo;Empowering the next-generation of Pakistani talent while giving every business instant, affordable access to competent professionals.&rdquo;
                                </blockquote>
                                <div className="flex gap-6" data-scroll="fade-up" data-scroll-delay="450">
                                    {[
                                        { value: '30M+', label: 'Students' },
                                        { value: '100K', label: 'Year 1 Target' },
                                        { value: '<2%', label: 'Disputes' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-background-light rounded-2xl px-6 py-5 border border-border-light text-center shadow-sm flex-1 hover:border-primary/30 transition-colors">
                                            <p className={`text-4xl font-bold mb-2 ${i === 1 ? 'text-primary' : 'text-text-main'}`}>{stat.value}</p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ Mission / Goals ═══ */}
                <section className="py-32 bg-background-light relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.03)_0%,transparent_70%)] rounded-full" />
                    </div>
                    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
                        <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest shadow-sm shadow-primary/5" data-scroll="fade-up">Our Mission</div>
                        <h2 className="text-5xl md:text-6xl font-bold text-text-main mb-8 tracking-tight" data-scroll="fade-up" data-scroll-delay="100">
                            Building Pakistan&apos;s <span className="text-primary italic font-serif">Talent Economy</span>
                        </h2>
                        <p className="text-2xl text-text-muted font-medium mb-20 max-w-4xl mx-auto leading-relaxed" data-scroll="fade-up" data-scroll-delay="200">
                            Pakistan is home to more than <span className="text-primary font-bold">30 million university students</span> and an ever-growing small-business sector. Gigligo exists to bridge the gap.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 mb-20">
                            {[
                                { num: '01', icon: 'groups', title: '100K Users', desc: 'Connect 100,000 active users (50/50 Students & Businesses) in year one.' },
                                { num: '02', icon: 'payments', title: 'PKR 30M+', desc: 'Achieve PKR 30M+ in transactions with less than 2% disputes.' },
                                { num: '03', icon: 'school', title: 'PKR 2M Grants', desc: 'Launch PKR 2M scholarship fund in up-skilling courses for top performers.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-surface-light rounded-3xl p-12 border border-border-light text-left hover:border-primary/40 transition-all duration-300 group shadow-lg hover:-translate-y-2" data-scroll="fade-up" data-scroll-delay={`${i * 150}`}>
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">{item.num}</span>
                                        <span className="material-symbols-outlined text-4xl text-text-muted/20 group-hover:text-primary transition-colors">{item.icon}</span>
                                    </div>
                                    <h4 className="text-text-main font-bold text-2xl mb-4 tracking-tight">{item.title}</h4>
                                    <p className="text-base text-text-muted font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                            <div className="relative bg-surface-light rounded-3xl p-12 text-left border border-border-light hover:border-primary/30 transition-all duration-300 overflow-hidden group shadow-lg" data-scroll="fade-right" data-scroll-delay="200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(200,157,40,0.1)_0%,transparent_70%)] pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" />
                                <h4 className="text-text-main font-bold text-xl mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-3xl">diversity_3</span> Community-Driven
                                </h4>
                                <p className="text-text-muted font-medium leading-relaxed text-lg">Campus ambassadors, hackathon sponsorships, and a forum where peers review each other&apos;s work. Building a collective of excellence.</p>
                            </div>
                            <div className="relative bg-surface-light rounded-3xl p-12 text-left border border-border-light hover:border-primary/30 transition-all duration-300 overflow-hidden group shadow-lg" data-scroll="fade-left" data-scroll-delay="200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(200,157,40,0.1)_0%,transparent_70%)] pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" />
                                <h4 className="text-text-main font-bold text-xl mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-3xl">layers</span> Scalable Solutions
                                </h4>
                                <p className="text-text-muted font-medium leading-relaxed text-lg">From a one-off logo design to a full-time remote development team, scale your talent without ever leaving the platform.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ CTA ═══ */}
                <section className="py-32 bg-nav-bg text-center relative overflow-hidden" data-scroll="fade-up">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.08)_0%,transparent_70%)] pointer-events-none" />
                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <svg width="72" height="72" viewBox="0 0 36 36" fill="none" className="mx-auto mb-10 opacity-80">
                            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
                            <path d="M19 18 H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary" />
                            <circle cx="19" cy="18" r="2" fill="currentColor" className="text-primary" />
                        </svg>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to join the movement?</h2>
                        <p className="text-white/50 font-medium mb-16 text-xl md:text-2xl max-w-2xl mx-auto">Whether you&apos;re a student looking to earn or a business seeking elite talent — Gigligo connects you.</p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/register?role=SELLER" className="h-16 px-12 inline-flex items-center justify-center bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-2xl shadow-primary/20 text-sm tracking-wide uppercase">
                                Start as Freelancer
                            </Link>
                            <Link href="/search" className="h-16 px-12 inline-flex items-center justify-center bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm tracking-wide uppercase">
                                Hire Talent
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}


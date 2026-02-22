'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ─── Gradient G Logo ─── */
function GigligoLogo({ size = 36 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <defs>
                <linearGradient id="gAbout" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00f5d4" /><stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="url(#gAbout)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M19 18 H30" stroke="url(#gAbout)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="19" cy="18" r="2" fill="#00f5d4"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" /></circle>
        </svg>
    );
}

/* ─── Inline SVG Icon ─── */
function Icon({ name, className = '', size = 24 }: { name: string; className?: string; size?: number }) {
    const icons: Record<string, React.ReactNode> = {
        groups: <><circle cx="9" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" /></>,
        money: <><rect x="1" y="4" width="22" height="16" rx="2" /><circle cx="12" cy="12" r="4" /></>,
        flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
        community: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="5" r="3" /><circle cx="12" cy="19" r="3" /><path d="M6 8v6l6 2" /><path d="M18 8v6l-6 2" /></>,
        layers: <><polygon points="12 2 2 7 12 12 22 7" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
        arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name] || null}
        </svg>
    );
}

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
        /* Scroll reveal */
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );
        document.querySelectorAll('[data-scroll]').forEach((el) => obs.observe(el));

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { obs.disconnect(); window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafRef.current); };
    }, [handleScroll]);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 min-h-screen transition-colors duration-300">
            <Navbar />

            {/* ═══ Hero Banner ═══ */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-teal-vibrant/10 rounded-full blur-[100px]" data-parallax-y="-0.05" />
                    <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-accent/10 rounded-full blur-[120px]" data-parallax-y="0.03" />
                </div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-vibrant/10 border border-teal-vibrant/30 text-teal-vibrant text-xs font-bold uppercase tracking-widest mb-6" data-scroll="fade-up">About Gigligo</div>
                    <h1 className="font-display text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight" data-scroll="fade-up" data-scroll-delay="100">The Vision Behind<br /><span className="text-teal-vibrant">Pakistan&apos;s Talent Engine</span></h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto" data-scroll="fade-up" data-scroll-delay="200">One man&apos;s mission to bridge the gap between 30 million students and thousands of businesses — locally.</p>
                </div>
            </section>

            {/* ═══ Founder Section ═══ */}
            <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal-vibrant/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="flex justify-center" data-scroll="fade-right">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-linear-to-br from-teal-vibrant/40 to-indigo-accent/40 rounded-3xl blur-lg" />
                                <img alt="Ali Noman — Founder & CEO" className="relative w-72 h-80 md:w-80 md:h-88 object-cover object-top rounded-3xl border-2 border-white/10 shadow-2xl" src="/founder-ali-noman.jpg" loading="eager" />
                                <div className="absolute -bottom-4 -right-4 bg-slate-900 border border-white/10 rounded-2xl px-5 py-3 shadow-xl">
                                    <p className="text-teal-vibrant font-bold text-sm">Founder & CEO</p>
                                    <p className="text-white text-xs">Gigligo</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6" data-scroll="fade-up">Meet <span className="text-teal-vibrant">Ali Noman</span></h2>
                            <p className="text-lg text-slate-700 dark:text-slate-300 font-light mb-6 leading-relaxed" data-scroll="fade-up" data-scroll-delay="150">A passionate tech entrepreneur from Pakistan, Ali founded Gigligo with a singular vision: to unlock the potential of 30 million+ university students by connecting them with businesses that need affordable, high-quality talent.</p>
                            <p className="text-lg text-slate-700 dark:text-slate-300 font-light mb-6 leading-relaxed" data-scroll="fade-up" data-scroll-delay="250">With years of experience in the tech industry and a deep understanding of Pakistan&apos;s education landscape, Ali saw an opportunity to create a platform that empowers students to earn while they learn — building real-world portfolios that set them apart in the global market.</p>
                            <blockquote className="text-xl font-light italic text-teal-vibrant/90 border-l-4 border-teal-vibrant pl-6 py-2 mb-8" data-scroll="fade-up" data-scroll-delay="350">&ldquo;Empowering the next-generation of Pakistani talent while giving every business instant, affordable access to competent professionals.&rdquo;</blockquote>
                            <div className="flex gap-4" data-scroll="fade-up" data-scroll-delay="450">
                                <div className="bg-slate-800/50 rounded-xl px-5 py-3 border border-white/5 text-center"><p className="text-2xl font-bold text-teal-vibrant">30M+</p><p className="text-xs text-slate-400">Students</p></div>
                                <div className="bg-slate-800/50 rounded-xl px-5 py-3 border border-white/5 text-center"><p className="text-2xl font-bold text-indigo-accent">100K</p><p className="text-xs text-slate-400">Year 1 Target</p></div>
                                <div className="bg-slate-800/50 rounded-xl px-5 py-3 border border-white/5 text-center"><p className="text-2xl font-bold text-white">&lt;2%</p><p className="text-xs text-slate-400">Disputes</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Mission / Goals ═══ */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-vibrant/3 rounded-full blur-[120px]" /></div>
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-accent/20 border border-indigo-accent/40 text-indigo-accent text-xs font-bold uppercase tracking-widest" data-scroll="fade-up">Our Mission</div>
                    <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6" data-scroll="fade-up" data-scroll-delay="100">Building Pakistan&apos;s <span className="text-teal-vibrant">Talent Economy</span></h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-light mb-16 max-w-3xl mx-auto leading-relaxed" data-scroll="fade-up" data-scroll-delay="200">Pakistan is home to more than <span className="text-teal-vibrant font-semibold">30 million university students</span> and an ever-growing small-business sector. Gigligo exists to bridge the gap between untapped talent and businesses that need reliable, cost-effective help.</p>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            { num: '01', title: '100K Users', desc: 'Connect 100,000 active users (50/50 Students & Businesses) in year one.', icon: 'groups' },
                            { num: '02', title: 'PKR 30M+', desc: 'Achieve PKR 30M+ in transactions with less than 2% disputes.', icon: 'money' },
                            { num: '03', title: 'PKR 2M Grants', desc: 'Launch PKR 2M scholarship fund in up-skilling courses for top performers.', icon: 'flag' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-white/5 text-left hover:border-teal-vibrant/30 transition-colors group shadow-sm dark:shadow-none" data-scroll="fade-up" data-scroll-delay={`${i * 120}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-8 h-8 rounded-full bg-teal-vibrant/15 text-teal-vibrant flex items-center justify-center text-xs font-bold">{item.num}</span>
                                    <Icon name={item.icon} size={20} className="text-slate-400 dark:text-slate-600 group-hover:text-teal-vibrant/50 transition-colors" />
                                </div>
                                <h4 className="text-slate-900 dark:text-white font-bold mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-500 font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-left shadow-sm dark:shadow-none" data-scroll="fade-right" data-scroll-delay="200">
                            <h4 className="text-teal-vibrant font-bold mb-4 flex items-center gap-2"><Icon name="community" size={20} /> Community-Driven</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-light">Campus ambassadors, hackathon sponsorships, and a forum where peers review each other&apos;s work. Building a collective of excellence.</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-left shadow-sm dark:shadow-none" data-scroll="fade-left" data-scroll-delay="200">
                            <h4 className="text-indigo-accent font-bold mb-4 flex items-center gap-2"><Icon name="layers" size={20} /> Scalable Solutions</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-light">From a one-off logo design to a full-time remote development team, scale your talent without ever leaving the platform.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="py-20 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-transparent text-center transition-colors duration-300" data-scroll="fade-up">
                <div className="max-w-3xl mx-auto px-6">
                    <GigligoLogo size={48} />
                    <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mt-6 mb-4">Ready to join the movement?</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-light mb-8">Whether you&apos;re a student looking to earn or a business seeking talent — Gigligo connects you.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register?role=SELLER" className="px-8 py-4 bg-teal-vibrant text-slate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-teal-vibrant/20 transition-all">Start as Freelancer</Link>
                        <Link href="/search" className="px-8 py-4 bg-indigo-accent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-accent/20 transition-all">Hire Talent</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

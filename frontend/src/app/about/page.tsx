'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ─── Gradient G Logo ─── */
function GigligoLogo({ size = 36 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="#DAA520" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M19 18 H30" stroke="#DAA520" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="19" cy="18" r="2" fill="#DAA520" />
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
        <div className="bg-white font-sans text-[#212121] min-h-screen">
            <Navbar />

            {/* ═══ Hero Banner ═══ */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.05)_0%,transparent_70%)] rounded-full" data-parallax-y="-0.05" />
                    <div className="absolute bottom-0 right-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(33,33,33,0.03)_0%,transparent_70%)] rounded-full" data-parallax-y="0.03" />
                </div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-[10px] font-bold uppercase tracking-widest mb-6" data-scroll="fade-up">About Gigligo</div>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#212121] mb-6 leading-tight" data-scroll="fade-up" data-scroll-delay="100">The Vision Behind<br /><span className="text-[#DAA520]">Pakistan&apos;s Talent Engine</span></h1>
                    <p className="text-xl text-[#424242]/70 font-normal max-w-2xl mx-auto" data-scroll="fade-up" data-scroll-delay="200">One man&apos;s mission to bridge the gap between 30 million students and thousands of businesses — locally.</p>
                </div>
            </section>

            {/* ═══ Founder Section ═══ */}
            <section className="py-24 bg-[#F5F5F5] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="flex justify-center" data-scroll="fade-right">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-[#DAA520]/20 rounded-3xl blur-lg" />
                                <img
                                    alt="Ali Noman — Founder & CEO"
                                    className="relative w-72 h-80 md:w-80 md:h-88 object-cover object-top rounded-3xl border-2 border-white shadow-2xl"
                                    src="/images/hero/hero.jpg"
                                    loading="eager"
                                    width={320}
                                    height={352}
                                />
                                <div className="absolute -bottom-4 -right-4 bg-[#212121] border border-white/10 rounded-2xl px-5 py-3 shadow-xl">
                                    <p className="text-[#DAA520] font-bold text-sm">Founder & CEO</p>
                                    <p className="text-white text-[10px] uppercase tracking-widest opacity-40">Gigligo</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6" data-scroll="fade-up">Meet <span className="text-[#DAA520]">Ali Noman</span></h2>
                            <p className="text-lg text-[#424242]/70 font-normal mb-6 leading-relaxed" data-scroll="fade-up" data-scroll-delay="150">A passionate tech entrepreneur from Pakistan, Ali founded Gigligo with a singular vision: to unlock the potential of 30 million+ university students by connecting them with businesses that need affordable, high-quality talent.</p>
                            <p className="text-lg text-[#424242]/70 font-normal mb-6 leading-relaxed" data-scroll="fade-up" data-scroll-delay="250">With years of experience in the tech industry and a deep understanding of Pakistan&apos;s education landscape, Ali saw an opportunity to create a platform that empowers students to earn while they learn — building real-world portfolios that set them apart in the global market.</p>
                            <blockquote className="text-xl font-medium italic text-[#DAA520]/90 border-l-4 border-[#DAA520] pl-6 py-2 mb-8" data-scroll="fade-up" data-scroll-delay="350">&ldquo;Empowering the next-generation of Pakistani talent while giving every business instant, affordable access to competent professionals.&rdquo;</blockquote>
                            <div className="flex gap-4" data-scroll="fade-up" data-scroll-delay="450">
                                <div className="bg-white rounded-xl px-5 py-3 border border-[#212121]/5 text-center shadow-sm"><p className="text-2xl font-bold text-[#212121]">30M+</p><p className="text-[10px] text-[#424242]/40 font-bold uppercase tracking-widest">Students</p></div>
                                <div className="bg-white rounded-xl px-5 py-3 border border-[#212121]/5 text-center shadow-sm"><p className="text-2xl font-bold text-[#DAA520]">100K</p><p className="text-[10px] text-[#424242]/40 font-bold uppercase tracking-widest">Year 1 Target</p></div>
                                <div className="bg-white rounded-xl px-5 py-3 border border-[#212121]/5 text-center shadow-sm"><p className="text-2xl font-bold text-[#212121]">&lt;2%</p><p className="text-[10px] text-[#424242]/40 font-bold uppercase tracking-widest">Disputes</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Mission / Goals ═══ */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.03)_0%,transparent_70%)] rounded-full" /></div>
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DAA520]/10 border border-[#DAA520]/20 text-[#DAA520] text-[10px] font-bold uppercase tracking-widest" data-scroll="fade-up">Our Mission</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6" data-scroll="fade-up" data-scroll-delay="100">Building Pakistan&apos;s <span className="text-[#DAA520]">Talent Economy</span></h2>
                    <p className="text-xl text-[#424242]/70 font-normal mb-16 max-w-3xl mx-auto leading-relaxed" data-scroll="fade-up" data-scroll-delay="200">Pakistan is home to more than <span className="text-teal-vibrant font-semibold">30 million university students</span> and an ever-growing small-business sector. Gigligo exists to bridge the gap between untapped talent and businesses that need reliable, cost-effective help.</p>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            { num: '01', title: '100K Users', desc: 'Connect 100,000 active users (50/50 Students & Businesses) in year one.', icon: 'groups' },
                            { num: '02', title: 'PKR 30M+', desc: 'Achieve PKR 30M+ in transactions with less than 2% disputes.', icon: 'money' },
                            { num: '03', title: 'PKR 2M Grants', desc: 'Launch PKR 2M scholarship fund in up-skilling courses for top performers.', icon: 'flag' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-[32px] p-10 border border-[#212121]/5 text-left hover:border-[#DAA520]/20 transition-all group shadow-sm" data-scroll="fade-up" data-scroll-delay={`${i * 120}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-[#DAA520]/10 text-[#DAA520] flex items-center justify-center text-xs font-bold">{item.num}</span>
                                    <Icon name={item.icon} size={20} className="text-[#424242]/20 group-hover:text-[#DAA520]/50 transition-colors" />
                                </div>
                                <h4 className="text-[#212121] font-bold mb-3">{item.title}</h4>
                                <p className="text-sm text-[#424242]/60 font-normal leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-[#F5F5F5] rounded-3xl p-10 text-left border border-transparent hover:border-[#DAA520]/10 transition-all" data-scroll="fade-right" data-scroll-delay="200">
                            <h4 className="text-[#212121] font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest opacity-60"><Icon name="community" size={20} className="text-[#DAA520]" /> Community-Driven</h4>
                            <p className="text-sm text-[#424242]/70 font-normal leading-relaxed">Campus ambassadors, hackathon sponsorships, and a forum where peers review each other&apos;s work. Building a collective of excellence.</p>
                        </div>
                        <div className="bg-[#F5F5F5] rounded-3xl p-10 text-left border border-transparent hover:border-[#DAA520]/10 transition-all" data-scroll="fade-left" data-scroll-delay="200">
                            <h4 className="text-[#212121] font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest opacity-60"><Icon name="layers" size={20} className="text-[#DAA520]" /> Scalable Solutions</h4>
                            <p className="text-sm text-[#424242]/70 font-normal leading-relaxed">From a one-off logo design to a full-time remote development team, scale your talent without ever leaving the platform.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="py-24 bg-[#212121] text-center relative overflow-hidden" data-scroll="fade-up">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.05)_0%,transparent_70%)] pointer-events-none" />
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <GigligoLogo size={64} />
                    <h2 className="text-4xl font-bold text-white mt-8 mb-6">Ready to join the movement?</h2>
                    <p className="text-white/60 font-normal mb-12 text-lg">Whether you&apos;re a student looking to earn or a business seeking talent — Gigligo connects you.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/register?role=SELLER" className="btn-primary px-10 py-4 shadow-2xl">Start as Freelancer</Link>
                        <Link href="/search" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white hover:text-[#212121] transition-all">Hire Talent</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

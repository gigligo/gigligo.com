'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useEffect, useRef, useState } from 'react';

/* ──────────────────── Scroll Reveal ──────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); io.unobserve(el); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const r = useReveal();
  return <div ref={r} className={`reveal-up ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ──────────────────── Data ──────────────────── */
const categories = [
  { icon: 'code', name: 'Development & IT', count: '1,240+', href: '/search?category=development' },
  { icon: 'palette', name: 'Design & Creative', count: '890+', href: '/search?category=design' },
  { icon: 'campaign', name: 'Sales & Marketing', count: '650+', href: '/search?category=marketing' },
  { icon: 'edit_note', name: 'Writing & Translation', count: '430+', href: '/search?category=writing' },
  { icon: 'smart_toy', name: 'AI Services', count: '320+', href: '/search?category=ai' },
  { icon: 'videocam', name: 'Video & Animation', count: '275+', href: '/search?category=video' },
  { icon: 'headphones', name: 'Music & Audio', count: '180+', href: '/search?category=audio' },
  { icon: 'business_center', name: 'Business & Consulting', count: '510+', href: '/search?category=business' },
];

const popularServices = [
  { title: 'Website Development', color: '#1a3c34', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqvHWbGlb-Fo0vZn90BiSLB3XgkUgG8hJkTX2GxO5Tuy1HnB8e1vGoi-ilYoi2YRZ5I0qEJ8mr6YkhZKKnGtXicZ3h_3hWOOpgYlxFA_c1sTWzjEWBWrriq2WSsB--qX8Y4Qt2nhXVDT026FRvB7X1TsEUU0eywtM4iRBukCrXyJ8lCC6ldck71Bp2c8l3BUBaXVz_zmUkrWKjVkQ-kvI1xIjOL75aldeSs19mZlsNtAaWz94x-a3hQLblzfOQLStI30SV38YewXs', href: '/search?q=web+development' },
  { title: 'Logo & Brand Identity', color: '#2d1b69', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwY8tQFuqmXR9xT5Kn0IaJYWe78H5oQs7mK1yJz7cIlHRd48ymasyYizxTzH7hISwIPsv3FQ9fFKpLdFBCbV-JAAeuOnNqRyoeafHcDXjMB6zaTvt6_2OrkHgymUCQ1aLyJcGWGcGXR0qyU1_9FxZtom8-MSo-ASvTfkvN7YVuvn5hwSywjWP2KqKb5FwHH40wp1d2aysfaxairypQTUkf7wrWaCoGMu04HAW6zTooWDBPfwfzdOCmMzvvlkiGm5QRxNo9KNGZRro', href: '/search?q=logo+design' },
  { title: 'Video Editing', color: '#0d3b66', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv6k6IJtPsRtauuejdpsmycJY9B1_WqUF-EBp2hUTXpxUJcfwB6-6RJYDMz4ueyeYmmJkLxdo2I1a9q7DPtzwTQZbBKO0H2GUxw14IMgo2H_lGbIf4TePyAdxkhIvUkdpt4SVPQHaG9PvJ16FqBB5Ou9X3IImcGJznnwCfThCXUI7kTcBykKRWZTU90mqEMjb2RvS_xtwnN4O33IulCX83a-QK-mKyj1kiDHUvukCotfhAf4fDD0jsu2AIjWBF1Gh25kvlqi-MX0I', href: '/search?q=video+editing' },
  { title: 'Digital Marketing', color: '#6b2737', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYrUokKWHJ51Q3nZ2cy-iWFBN5y514essRE_pBDqkb0PjB7vA5MCConR9QhKwBwWKi1YXdw63Vv6nI6MHNf9Xia45kgktNeBrN6vTW7vdHBBK_rlSMSsr31gfGQosO219PQAZhQ0MEAArr7FfHVDgzPA5hBrXgCz6VedLe0cWLy3A_WUGlQdvMZF5U0dySSRo6ypxn5u9TlVpTj04LVwlhVdWGVJ5wvWT29MyVWZhVH1A8p2WwU-aboCfYoAAk-ISsb-ZFupRmXUo', href: '/search?q=digital+marketing' },
];

const testimonials = [
  { name: 'Sarah Jenkins', role: 'VP of Engineering, TechCorp', quote: 'GIGLIGO transformed how we source executive creative direction. The quality of talent here is simply unmatched.', rating: 5, category: 'Development' },
  { name: 'Michael Chen', role: 'CEO, StartupX', quote: 'We scaled our entire design team through GIGLIGO in just 2 weeks. The vetting process saved us months of hiring.', rating: 5, category: 'Design' },
  { name: 'Emma Rodriguez', role: 'Marketing Director, GlobalBrand', quote: 'The freelancers on GIGLIGO deliver enterprise-grade work. Our campaign ROI increased 340% after switching.', rating: 5, category: 'Marketing' },
];

const stats = [
  { value: '10K+', label: 'Verified Professionals' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50K+', label: 'Projects Completed' },
  { value: '120+', label: 'Countries Served' },
];

/* ──────────────────── Component ──────────────────── */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'talent' | 'jobs'>('talent');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = activeTab === 'talent'
        ? `/search?q=${encodeURIComponent(searchQuery)}`
        : `/jobs?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-[#111] text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />

      <main className="flex flex-col grow" style={{ paddingTop: 72 }}>

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative overflow-hidden bg-[#0d1117] text-white">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_cgwvDSQ9PGm8I3aPS3640hgivXyFVa-gMLMw7Wbp2D_aO0lMFPom1hqAkrJdCKLufNDm-Wy0V9wd85F1AeMEuCetcqIPj2QH3u534JQ_lwiZ3MO0yusKe6YSWu6wPcbPybStn76mkclj1-ejrzEHLM9VNigoFwF-Hu9lRCGxtcEubLJPkDgdGyQdDqkrVw_gfglKojOOZ8q_KFqjKsi0N3LNmCkU2zZY5np-zoQ4-sl4nfVjvpVGBnrKxs1_7IUC1FpRbBYzSOk')" }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0d1117]/80 via-[#0d1117]/60 to-[#0d1117]" />

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
            <div className="max-w-3xl animate-hero-in">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-6">
                Find the perfect <span className="text-primary">freelance</span><br />
                services for your business
              </h1>
              <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-xl leading-relaxed">
                Access a curated network of verified students and freelancers. Get quality work done faster with GIGLIGO.
              </p>

              {/* Search Box */}
              <div className="bg-white rounded-xl p-1.5 max-w-2xl shadow-2xl shadow-black/30">
                {/* Tabs */}
                <div className="flex gap-1 mb-1.5 px-1">
                  <button
                    onClick={() => setActiveTab('talent')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'talent'
                      ? 'bg-primary text-white'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                  >
                    Find Talent
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'jobs'
                      ? 'bg-primary text-white'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                  >
                    Browse Jobs
                  </button>
                </div>
                {/* Search Input */}
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'talent' ? 'Search by role, skills, or keywords…' : 'Search jobs by title or keyword…'}
                    className="flex-1 px-4 py-3.5 text-slate-800 text-base rounded-l-lg focus:outline-none placeholder:text-slate-400 bg-slate-50 border border-slate-200 border-r-0"
                  />
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-r-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">search</span>
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </form>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center gap-2 mt-5 text-sm">
                <span className="text-white/40 font-medium">Popular:</span>
                {['Web Developer', 'Logo Design', 'Video Editor', 'AI Expert'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full border border-white/15 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-medium"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trusted By Logos */}
            <div className="mt-14 pt-8 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <span className="text-white/30 text-xs font-semibold uppercase tracking-widest">Trusted by:</span>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-40">
                  <span className="text-xl font-black tracking-tight">ACME<span className="text-primary">CORP</span></span>
                  <span className="text-xl font-bold italic">Vertex</span>
                  <span className="text-xl font-bold tracking-[0.2em]">GLOBAL</span>
                  <span className="text-xl font-black font-mono">Strata.</span>
                  <span className="text-xl font-bold flex items-center gap-1"><span className="block size-3 bg-primary rounded-full" />Onyx</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ CATEGORIES ═══════════════════ */}
        <section className="py-16 sm:py-24 bg-white dark:bg-[#111]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse talent by category</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Get inspired and find the right professional for your project</p>
                </div>
                <Link href="/search" className="text-primary font-semibold hover:underline flex items-center gap-1 text-sm">
                  All categories <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat, i) => (
                <Reveal key={cat.name} delay={i * 60}>
                  <Link
                    href={cat.href}
                    className="group flex flex-col items-start p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-3xl text-primary mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="text-xs text-slate-400 mt-1">{cat.count} professionals</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ POPULAR SERVICES ═══════════════════ */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10">Popular services</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {popularServices.map((svc, i) => (
                <Reveal key={svc.title} delay={i * 80}>
                  <Link
                    href={svc.href}
                    className="group relative flex flex-col rounded-2xl overflow-hidden h-[340px] hover:-translate-y-1 transition-all duration-500 shadow-md hover:shadow-xl"
                  >
                    <div className="px-5 pt-5 pb-3 z-10" style={{ backgroundColor: svc.color }}>
                      <p className="text-white font-bold text-lg leading-snug">{svc.title}</p>
                    </div>
                    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: svc.color }}>
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url('${svc.img}')` }}
                      />
                    </div>
                    <div className="absolute bottom-3 right-3 size-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="material-symbols-outlined text-white text-lg">arrow_outward</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
        <section className="py-16 sm:py-24 bg-white dark:bg-[#111]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How it works</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-lg mx-auto">Get your project done in three simple steps</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {[
                { step: '01', icon: 'edit_document', title: 'Post your project', desc: 'Describe what you need. It\'s free to post and only takes minutes.' },
                { step: '02', icon: 'group_add', title: 'Get matched with talent', desc: 'Receive proposals from verified freelancers. Review profiles, portfolios and ratings.' },
                { step: '03', icon: 'verified', title: 'Pay when satisfied', desc: 'Use milestone payments for security. Release payment only when the work meets your standards.' },
              ].map((item, i) => (
                <Reveal key={item.step} delay={i * 120}>
                  <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors group">
                    <div className="relative mb-6">
                      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                      </div>
                      <span className="absolute -top-2 -right-2 size-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ STATS ═══════════════════ */}
        <section className="py-14 bg-primary">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 80}>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</p>
                    <p className="text-white/70 text-sm font-medium">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What clients are saying</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-base">Real stories from businesses that hired on GIGLIGO</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 100}>
                  <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                        <span key={j} className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{t.category}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA BANNER ═══════════════════ */}
        <section className="py-16 sm:py-24 bg-[#0d1117] text-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Ready to get started?
                </h2>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  Join thousands of businesses and freelancers already growing with GIGLIGO.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all hover:scale-105 duration-300 shadow-lg shadow-primary/30 text-base"
                  >
                    Sign Up — It&apos;s Free
                  </Link>
                  <Link
                    href="/search"
                    className="px-8 py-4 border border-white/20 text-white hover:bg-white/10 font-semibold rounded-xl transition-all text-base"
                  >
                    Browse Talent
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />

      {/* Animations */}
      <style jsx global>{`
                @keyframes heroIn {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-hero-in {
                    animation: heroIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .reveal-up {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-up.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
    </div>
  );
}

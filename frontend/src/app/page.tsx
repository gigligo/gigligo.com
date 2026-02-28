'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useEffect, useRef } from 'react';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-reveal-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`animate-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      {/* Faint Background Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-pattern z-0"></div>

      <Navbar />

      <main className="flex flex-col grow z-10">
        <div className="flex flex-1 justify-center py-10 lg:py-20 bg-white dark:bg-[#1E1E1E]" style={{ paddingTop: 96 }}>
          <div className="flex flex-col max-w-[1200px] w-full px-4 lg:px-8 gap-20">

            {/* ═══════ HERO SECTION ═══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
              <div className="flex flex-col gap-8 order-2 lg:order-1">
                <div className="flex flex-col gap-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Premium Network</span>
                  </div>
                  <h1 className="text-slate-900 dark:text-white text-5xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tighter animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    Create •<br />Chat • Start.
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-normal leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    Access an exclusive network of high-end talent of Students/Freelancers and serious business opportunities. Elevate your projects with GIGLIGO&apos;s curated elite.
                  </p>
                </div>
                <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                  <Link
                    href="/register"
                    className="flex cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white hover:bg-primary-dark transition-all text-base font-bold tracking-wide shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105 duration-300"
                  >
                    Start Now
                  </Link>
                  <Link
                    href="/search"
                    className="flex cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-base font-medium hover:scale-105 duration-300"
                  >
                    Explore
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-4 text-slate-500 dark:text-slate-500 text-sm animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                  <div className="flex -space-x-3">
                    <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAy951AyHXYlgo87XrSqWNTnTKx1oF-3mw1DhJaQ2IjrVTCAJwbp5lkyNo62Iun1ttrDMRQHjglrZZhWrho7ynf21GkJak4DSUbvFiWinyw9KRvfmH-LYUK1ByRQtrK4udNoegPYkfr9OfTQ6y1TOj3Hz-98rYQyiRaG0-CgoZcVHNc0lC4s3xdG5Rw3Fe27RPDMEbhqDk9liuLteHon1esPvQh4tTaPIrYd9YWCKIWYRv0sTWf3_bSDBGvamlqTZdyutGxKoXUcpo')" }}
                    />
                    <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-300 bg-cover bg-center"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwY8tQFuqmXR9xT5Kn0IaJYWe78H5oQs7mK1yJz7cIlHRd48ymasyYizxTzH7hISwIPsv3FQ9fFKpLdFBCbV-JAAeuOnNqRyoeafHcDXjMB6zaTvt6_2OrkHgymUCQ1aLyJcGWGcGXR0qyU1_9FxZtom8-MSo-ASvTfkvN7YVuvn5hwSywjWP2KqKb5FwHH40wp1d2aysfaxairypQTUkf7wrWaCoGMu04HAW6zTooWDBPfwfzdOCmMzvvlkiGm5QRxNo9KNGZRro')" }}
                    />
                    <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-400 bg-cover bg-center"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv6k6IJtPsRtauuejdpsmycJY9B1_WqUF-EBp2hUTXpxUJcfwB6-6RJYDMz4ueyeYmmJkLxdo2I1a9q7DPtzwTQZbBKO0H2GUxw14IMgo2H_lGbIf4TePyAdxkhIvUkdpt4SVPQHaG9PvJ16FqBB5Ou9X3IImcGJznnwCfThCXUI7kTcBykKRWZTU90mqEMjb2RvS_xtwnN4O33IulCX83a-QK-mKyj1kiDHUvukCotfhAf4fDD0jsu2AIjWBF1Gh25kvlqi-MX0I')" }}
                    />
                  </div>
                  <p>Trusted by 10,000+ elite professionals</p>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden order-1 lg:order-2 shadow-2xl animate-fade-in-scale" style={{ animationDelay: '300ms' }}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-700"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_cgwvDSQ9PGm8I3aPS3640hgivXyFVa-gMLMw7Wbp2D_aO0lMFPom1hqAkrJdCKLufNDm-Wy0V9wd85F1AeMEuCetcqIPj2QH3u534JQ_lwiZ3MO0yusKe6YSWu6wPcbPybStn76mkclj1-ejrzEHLM9VNigoFwF-Hu9lRCGxtcEubLJPkDgdGyQdDqkrVw_gfglKojOOZ8q_KFqjKsi0N3LNmCkU2zZY5np-zoQ4-sl4nfVjvpVGBnrKxs1_7IUC1FpRbBYzSOk')" }}
                >
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-sm hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                      <p className="text-white font-bold">Verified Excellence</p>
                    </div>
                    <p className="text-white/80 text-sm italic" style={{ fontFamily: "'Lora', serif" }}>
                      &ldquo;GIGLIGO transformed how we source executive creative direction. Simply unmatched quality.&rdquo;
                    </p>
                    <p className="text-white/50 text-xs mt-2 font-medium">— Sarah Jenkins, VP of Engineering</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center justify-center gap-2 animate-bounce opacity-40">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">Scroll to explore</p>
              <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
            </div>

            {/* ═══════ VERIFIED TALENT SECTION ═══════ */}
            <RevealSection>
              <div className="flex flex-col gap-16 py-24 px-8 lg:px-12 bg-[#F7F7F6] dark:bg-[#1E1E1E] rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                  <div className="max-w-2xl">
                    <h2 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-4">
                      Verified <span className="text-primary">Elite Talent</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      Hand-picked professionals vetted for expertise, reliability, and excellence. Only the top 1% make the cut.
                    </p>
                  </div>
                  <Link href="/search" className="group flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity">
                    View All Categories
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: UX Designers */}
                  <RevealSection delay={100}>
                    <Link href="/search?category=design" className="group relative flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-l-4 border-transparent hover:border-primary p-2 hover:-translate-y-1">
                      <div className="h-64 overflow-hidden relative">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqvHWbGlb-Fo0vZn90BiSLB3XgkUgG8hJkTX2GxO5Tuy1HnB8e1vGoi-ilYoi2YRZ5I0qEJ8mr6YkhZKKnGtXicZ3h_3hWOOpgYlxFA_c1sTWzjEWBWrriq2WSsB--qX8Y4Qt2nhXVDT026FRvB7X1TsEUU0eywtM4iRBukCrXyJ8lCC6ldck71Bp2c8l3BUBaXVz_zmUkrWKjVkQ-kvI1xIjOL75aldeSs19mZlsNtAaWz94x-a3hQLblzfOQLStI30SV38YewXs')" }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          <p className="text-white text-xs font-bold uppercase tracking-wider">Top Rated</p>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 gap-4">
                        <div>
                          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Senior UX Designers</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Verified experts with 10+ years of crafting digital experiences.</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">124 Available</span>
                          <span className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-sm">arrow_outward</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealSection>

                  {/* Card 2: Full-Stack Architects */}
                  <RevealSection delay={250}>
                    <Link href="/search?category=development" className="group relative flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-l-4 border-transparent hover:border-primary p-2 hover:-translate-y-1">
                      <div className="h-64 overflow-hidden relative">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYrUokKWHJ51Q3nZ2cy-iWFBN5y514essRE_pBDqkb0PjB7vA5MCConR9QhKwBwWKi1YXdw63Vv6nI6MHNf9Xia45kgktNeBrN6vTW7vdHBBK_rlSMSsr31gfGQosO219PQAZhQ0MEAArr7FfHVDgzPA5hBrXgCz6VedLe0cWLy3A_WUGlQdvMZF5U0dySSRo6ypxn5u9TlVpTj04LVwlhVdWGVJ5wvWT29MyVWZhVH1A8p2WwU-aboCfYoAAk-ISsb-ZFupRmXUo')" }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 gap-4">
                        <div>
                          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Full-Stack Architects</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Building scalable enterprise solutions for Fortune 500s.</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">86 Available</span>
                          <span className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-sm">arrow_outward</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealSection>

                  {/* Card 3: Growth Strategists */}
                  <RevealSection delay={400}>
                    <Link href="/search?category=marketing" className="group relative flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-l-4 border-transparent hover:border-primary p-2 hover:-translate-y-1">
                      <div className="h-64 overflow-hidden relative">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDv2-sqApu0ULtw2FzRIFq6mjnsujsbbs-5wHSO8lJjbTvgEH9Q6xJRTApqTX9I0VuIEF23gv7DFVarg2BMl--TUXjAWPSmHsCSRtafS7L23FRnzG9CLomUoll3vPtxCPtmscM5-vk5LSIZF5eJ-3OWiEi94nqZMogq2EGx5eG9T0yf9IWBHtAXUlo3TJnsj2YOxOhgQ2JMBCyBeN6JlhGI8fvUdv4nMU0aXGsrODKZkVp3JfkOraUGsiEvesG_1TqdSujrXS38WM4')" }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 gap-4">
                        <div>
                          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Growth Strategists</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Data-driven marketing leaders to scale your revenue.</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">53 Available</span>
                          <span className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <span className="material-symbols-outlined text-sm">arrow_outward</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </RevealSection>
                </div>
              </div>
            </RevealSection>

            {/* ═══════ TRUST/LOGOS SECTION ═══════ */}
            <RevealSection>
              <div className="py-10 border-t border-slate-200 dark:border-slate-800">
                <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by global leaders</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-200">ACME<span className="text-primary">CORP</span></span>
                  <span className="text-2xl font-bold italic text-slate-800 dark:text-slate-200">Vertex</span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-[0.2em]">GLOBAL</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">Strata.</span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span className="block size-4 bg-primary rounded-full"></span>Onyx
                  </span>
                </div>
              </div>
            </RevealSection>

          </div>
        </div>
      </main>

      <Footer />

      {/* Motion Animation Styles */}
      <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in-scale {
                    opacity: 0;
                    animation: fadeInScale 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-reveal {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-reveal-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
    </div>
  );
}

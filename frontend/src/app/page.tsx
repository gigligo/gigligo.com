'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, Star, Shield, Zap, Code, Pen, BarChart2, Video, Users, Globe, Layers, Search, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ═══════════════════════════════════════════════
   INLINE SVG ICONS
   ═══════════════════════════════════════════════ */
function Icon({ name, className = '', size = 24 }: { name: string; className?: string; size?: number }) {
  const d: Record<string, React.ReactNode> = {
    code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
    pen: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
    chart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    video: <><rect x="2" y="4" width="15" height="16" rx="2" /><polygon points="22 8 17 12 22 16" /></>,
    chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />,
    case: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d[name]}
    </svg>
  );
}

function GLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
      <path d="M26.5 9 A12 12 0 1 0 30 18" stroke="#C9A227" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 18 H30" stroke="#C9A227" strokeWidth="3" strokeLinecap="round" />
      <circle cx="19" cy="18" r="2" fill="#C9A227"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" /></circle>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   DATA ARRAYS
   ═══════════════════════════════════════════════ */
const TALENTS = [
  { title: 'Development', sub: 'React, Node, iOS/Android', icon: 'code', element: '{ }' },
  { title: 'Arts & Design', sub: 'Figma, Logo, 3D Models', icon: 'pen', element: '✨' },
  { title: 'Analytics', sub: 'Data Entry, Research', icon: 'chart', element: '📈' },
  { title: 'Video & Media', sub: 'Editing, Animation', icon: 'video', element: '▶' },
  { title: 'Writing', sub: 'Content, Proofreading', icon: 'chat', element: '✎' },
  { title: 'Tech Support', sub: 'QA Testing, Cloud Ops', icon: 'zap', element: '⚡' },
  { title: 'Business', sub: 'Virtual Admin, Support', icon: 'case', element: '❖' },
];

const STATS = [
  { val: '30M+', label: 'Students in Pakistan' },
  { val: '0%', label: 'Freelancer Commission' },
  { val: '100%', label: 'Escrow Protection' },
  { val: 'Direct', label: 'JazzCash / Easypaisa' },
  { val: 'Verified', label: 'Campus Talent' },
  { val: '24/7', label: 'Local Support' },
];

/* ═══════════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════════ */
export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const d = e.target.getAttribute('data-delay');
          if (d) setTimeout(() => e.target.classList.add('revealed'), +d);
          else e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('[data-scroll]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-[#FFFFFF] font-sans text-[#1E1E1E] selection:bg-[#C9A227]/20 transition-colors duration-300">
      <Navbar />

      <main>
        {/* ════════════════════════════════════════════════════════════
            HERO — Cinematic Minimal-Classic
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen relative overflow-hidden bg-[#FFFFFF] flex flex-col justify-center section-spacing pt-32">
          {/* Abstract Geometry Background */}
          <div className="absolute inset-0 z-0 bg-abstract-geometry pointer-events-none" />

          <div className="content-container relative z-10 grid md:grid-cols-2 gap-16 items-center">

            {/* Left: Headline & Talent CTA */}
            <div data-scroll="fade-up" data-delay="100">
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#F7F7F6] text-[#C9A227] text-xs font-bold uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" /> The Professional Arena
              </div>
              <h1 className="h1 text-[#1E1E1E] mb-6">
                Where elite talent meets <span className="text-[#C9A227] italic font-serif">serious business.</span>
              </h1>
              <p className="body-regular mb-10 max-w-lg">
                Gigligo is the high-end platform for professionals verifying their expertise, bypassing the clutter of traditional marketplaces, and delivering enterprise-grade results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/search" className="btn-primary">
                  Hire Elite Talent
                </Link>
                <Link href="/register?role=SELLER" className="btn-secondary">
                  Apply as Freelancer
                </Link>
              </div>

              {/* Authority markers */}
              <div className="flex items-center gap-6 pt-8 border-t border-[#F7F7F6]" data-scroll="fade-up" data-delay="300">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FFFFFF] bg-[#1E1E1E] flex items-center justify-center text-[#C9A227] font-bold text-xs">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-[#C9A227] mb-1"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                  <p className="micro-label text-[#3A3A3A]">Trusted by 10k+ Founders</p>
                </div>
              </div>
            </div>

            {/* Right: Visual Abstract representation of the platform */}
            <div className="relative hidden md:block" data-scroll="fade-left" data-delay="300">
              <div className="relative w-full aspect-square bg-[#F7F7F6] rounded-[10px] overflow-hidden border border-[#E5E5E5] flex items-center justify-center">
                {/* Subtle architectural lines */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1E1E1E 1px, transparent 1px), linear-gradient(90deg, #1E1E1E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Floating UI Elements indicating high-end nature */}
                <div className="absolute top-[20%] left-[10%] card p-6 w-64 shadow-2xl z-20" style={{ transform: 'rotate(-2deg)' }}>
                  <div className="flex gap-3 items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#1E1E1E] text-[#C9A227] flex justify-center items-center font-bold">M</div>
                    <div>
                      <div className="text-sm font-bold text-[#1E1E1E]">Senior Architect</div>
                      <div className="micro-label text-[#3A3A3A]">Verified Expert</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#F7F7F6] rounded-full mb-2" />
                  <div className="w-3/4 h-2 bg-[#F7F7F6] rounded-full" />
                </div>

                <div className="absolute bottom-[20%] right-[10%] card p-6 w-56 shadow-2xl z-20" style={{ transform: 'rotate(3deg)' }}>
                  <div className="text-sm font-bold text-[#1E1E1E] mb-2 text-right">Escrow Secured</div>
                  <div className="text-2xl font-bold text-[#C9A227] text-right">$4,500.00</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════
            SOCIAL PROOF TICKER
            ════════════════════════════════════════════ */}
        <section className="py-4 bg-[#1E1E1E] border-y border-[#3A3A3A] relative overflow-hidden">
          <div className="flex ticker whitespace-nowrap">
            {[
              { text: "Creative Director hired from LUMS", time: "2 min ago" },
              { text: "Product Designer completed project for TechLogix", time: "15 min ago" },
              { text: "Senior React Dev matched with Systems Ltd", time: "1 hr ago" },
              { text: "Content Writer earned 'Pro Talent' badge", time: "2 hrs ago" }
            ].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-4 px-12 border-r border-[#3A3A3A] last:border-0">
                <div className="w-2 h-2 rounded-full bg-[#C9A227]" />
                <span className="text-[12px] uppercase tracking-widest text-[#FFFFFF]/70 font-semibold">{item.text}</span>
                <span className="text-[12px] text-[#C9A227] font-semibold">{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CURATED TALENT — MINIMAL GRID
            ════════════════════════════════════════════ */}
        <section className="section-spacing bg-[#F7F7F6] relative overflow-hidden">
          <div className="content-container relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div data-scroll="fade-up">
                <h2 className="h2 text-[#1E1E1E] mb-4">Categorical <span className="text-[#C9A227] italic font-serif">Excellence.</span></h2>
                <p className="body-regular max-w-lg">Curated talent pools designed for precision matching and outstanding project delivery.</p>
              </div>
              <Link href="/search" className="btn-secondary" data-scroll="fade-left" data-delay="200">
                Browse Disciplines <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {TALENTS.map((t, i) => (
                <div key={i} className="group cursor-pointer flex flex-col items-center text-center" data-scroll="fade-up" data-delay={`${i * 50}`}>
                  <div className="w-full aspect-square rounded-[10px] mb-4 relative overflow-hidden bg-[#FFFFFF] border border-[#E5E5E5] flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#C9A227] group-hover:shadow-lg">
                    <div className="text-[50px] font-bold opacity-0 group-hover:opacity-5 transition-all duration-500 select-none scale-50 group-hover:scale-100 absolute italic text-[#1E1E1E]">
                      {t.element}
                    </div>
                    <Icon name={t.icon} size={28} className="mb-2 text-[#3A3A3A] group-hover:text-[#C9A227] transition-all duration-300 relative z-10" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-1">{t.title}</h3>
                  <p className="micro-label text-[#3A3A3A]/70 leading-snug">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURED TALENT PREVIEW (Cards)
            ════════════════════════════════════════════ */}
        <section className="section-spacing bg-[#FFFFFF] relative overflow-hidden">
          <div className="content-container bg-abstract-geometry absolute inset-0 z-0 pointer-events-none" />
          <div className="content-container relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div data-scroll="fade-up">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1E1E] text-[#C9A227] micro-label">
                  Rising Stars
                </div>
                <h2 className="h2 text-[#1E1E1E] mb-4">Top Rated <span className="text-[#C9A227] italic font-serif">Professionals.</span></h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Ahsan M.', uni: 'FAST-NU', role: 'Full Stack Architect', rate: 'PKR 15,000', img: 'A', tags: ['React', 'Node.js', 'AWS'] },
                { name: 'Fatima Z.', uni: 'LUMS', role: 'Principal UX Designer', rate: 'PKR 12,000', img: 'F', tags: ['Figma', 'Strategy', 'UI'] },
                { name: 'Usman T.', uni: 'NUST', role: 'Data Scientist', rate: 'PKR 20,000', img: 'U', tags: ['Python', 'SQL', 'Models'] },
              ].map((talent, i) => (
                <div key={i} className="card group" data-scroll="fade-up" data-delay={i * 100}>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#C9A227] font-bold text-xl shadow-sm border border-[#3A3A3A]">
                      {talent.img}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E1E1E] text-lg flex items-center gap-2">{talent.name} <CheckCircle2 size={16} className="text-[#2E7D32]" /></h4>
                      <p className="micro-label text-[#3A3A3A] mt-1">{talent.uni}</p>
                    </div>
                  </div>
                  <h5 className="font-semibold text-[#1E1E1E] text-[17px] mb-4">{talent.role}</h5>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {talent.tags.map(tag => (
                      <span key={tag} className="badge-gray">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-[#F7F7F6]">
                    <div>
                      <p className="micro-label text-[#3A3A3A] mb-1">Starting at</p>
                      <p className="font-bold text-[#1E1E1E] text-lg">{talent.rate}</p>
                    </div>
                    <Link href="/search" className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#1E1E1E] hover:bg-[#C9A227] hover:border-[#C9A227] transition-all">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS — Editorial layout
            ════════════════════════════════════════════ */}
        <section className="section-spacing bg-[#1E1E1E] text-[#FFFFFF] relative overflow-hidden">
          <div className="content-container relative z-10">
            <div className="text-center mb-24" data-scroll="fade-up">
              <h2 className="h2 mb-6">The Protocol.</h2>
              <p className="body-regular text-[#FFFFFF]/70 max-w-lg mx-auto">A seamless architecture designed for enterprise-level engagement and secure collaboration.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-16 relative">
              {/* Decorative line connecting steps */}
              <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] h-px bg-[#3A3A3A]" />

              {[
                { title: 'Create', desc: 'Construct a verified profile or scope requirements within our precision wizard.', icon: <Search size={24} /> },
                { title: 'Chat', desc: 'Negotiate and align through a secure, encrypted real-time communication channel.', icon: <Users size={24} /> },
                { title: 'Start', desc: 'Initiate with escrowed capital, ensuring accountability and premium delivery.', icon: <Shield size={24} /> }
              ].map((item, i) => (
                <div key={i} className="relative group text-center" data-scroll="fade-up" data-delay={i * 200}>
                  <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border border-[#3A3A3A] flex items-center justify-center mx-auto mb-10 transition-all duration-300 group-hover:border-[#C9A227] relative z-10 shadow-[0_0_0_8px_#1E1E1E]">
                    <div className="text-[#C9A227]">{item.icon}</div>
                    <div className="absolute -top-4 -right-2 text-[32px] font-serif italic text-[#3A3A3A] select-none opacity-50">0{i + 1}</div>
                  </div>
                  <h3 className="h3 mb-4">{item.title}</h3>
                  <p className="body-regular text-[#FFFFFF]/60 max-w-[280px] mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            OUR MISSION — Minimal typography focus
            ════════════════════════════════════════════ */}
        <section className="section-spacing bg-[#FFFFFF] relative overflow-hidden text-center">
          <div className="content-container">
            <div className="max-w-4xl mx-auto" data-scroll="fade-up">
              <div className="mb-10 flex justify-center"><GLogo size={40} /></div>
              <h2 className="text-[32px] md:text-[42px] font-serif italic text-[#1E1E1E] mb-12 leading-relaxed font-light">
                &quot;To establish the definitive arena where ambition meets execution—elevating Pakistani professionals into the global enterprise standard.&quot;
              </h2>
              <div className="w-10 h-[2px] bg-[#C9A227] mx-auto mb-8" />
              <p className="micro-label text-[#3A3A3A]">Philosophy & Vision</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            DUAL CTA — Final Call
            ════════════════════════════════════════════ */}
        <section className="pb-24 px-6 bg-[#FFFFFF]">
          <div className="content-container relative overflow-hidden rounded-[20px] bg-[#1E1E1E] py-24 px-8 md:px-20 text-center shadow-2xl border border-[#3A3A3A]">
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-abstract-geometry" />

            <div className="relative z-10 max-w-2xl mx-auto" data-scroll="fade-up">
              <h2 className="h2 text-[#FFFFFF] mb-8">Enter the <span className="text-[#C9A227] italic font-serif">Arena.</span></h2>
              <p className="body-regular text-[#FFFFFF]/70 mb-12 max-w-md mx-auto">
                Join the platform designed exclusively for high-caliber professionals and discerning clients.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link href="/register" className="btn-primary">Initiate Registration</Link>
                <Link href="/pricing" className="btn-secondary bg-transparent! text-[#FFFFFF]! border-[#3A3A3A]! hover:bg-[#FFFFFF]! hover:text-[#1E1E1E]!">Review Plans</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <Footer />
      </main>
    </div>
  );
}

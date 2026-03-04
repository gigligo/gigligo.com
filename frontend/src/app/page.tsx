'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/landing/Hero';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const InfiniteLogoCarousel = dynamic(() => import('@/components/landing/InfiniteLogoCarousel').then(mod => mod.InfiniteLogoCarousel), { ssr: true });
const ModularFeatures = dynamic(() => import('@/components/landing/ModularFeatures').then(mod => mod.ModularFeatures), { ssr: true });
const InteractiveStats = dynamic(() => import('@/components/landing/InteractiveStats').then(mod => mod.InteractiveStats), { ssr: true });
const PortfolioShowcase = dynamic(() => import('@/components/landing/PortfolioShowcase').then(mod => mod.PortfolioShowcase), { ssr: true });

/* ──────────────────── Component ──────────────────── */
export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-text-main font-sans selection:bg-primary selection:text-text-main">
      <Navbar />

      <main className="flex flex-col grow">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <Hero />

        {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
        <InfiniteLogoCarousel />

        {/* ═══════════════════ MODULAR FEATURES ═══════════════════ */}
        <ModularFeatures />

        {/* ═══════════════════ INTERACTIVE STATS ═══════════════════ */}
        <InteractiveStats />

        {/* ═══════════════════ PORTFOLIO SHOWCASE ═══════════════════ */}
        <PortfolioShowcase />

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <section className="px-6 py-32 md:py-48 bg-text-main text-white relative overflow-hidden flex flex-col items-center justify-center text-center w-full mt-12">

          <div className="absolute right-1/2 top-1/2 w-full max-w-4xl h-full bg-primary/30 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-full flex flex-col items-center justify-center relative z-10 text-center mx-auto max-w-5xl"
          >
            <div className="flex flex-col items-center justify-center gap-10 w-full">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-[1.05] tracking-tight">
                Suddenly, <br className="hidden md:block" />it&apos;s all so <span className="text-primary drop-shadow-sm">easy.</span>
              </h2>
              <p className="text-white/70 text-xl md:text-2xl font-medium text-center max-w-2xl px-4 leading-relaxed">
                Join the millions of businesses using GIGLIGO to find the best talent and scale their operations securely.
              </p>
              <div className="mt-10 flex justify-center w-full">
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="inline-flex items-center justify-center bg-primary text-white px-12 py-5 rounded-3xl font-bold text-xl hover:bg-primary-dark shadow-[0_10px_40px_rgba(0,124,255,0.4)] transition-colors group"
                  >
                    Start Hiring Now
                    <span className="material-symbols-outlined ml-3 text-[24px]">arrow_forward</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

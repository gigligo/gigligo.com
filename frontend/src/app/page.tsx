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
        <section className="px-6 py-20 md:py-28 bg-[#FAFBFD] border-t border-gray-100 relative overflow-hidden flex flex-col items-center justify-center text-center w-full">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full flex flex-col items-center justify-center relative z-10 text-center mx-auto max-w-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight mb-5 leading-tight">
              Ready to get started?
            </h2>
            <p className="text-text-muted text-lg font-medium max-w-lg mx-auto leading-relaxed mb-8">
              Join thousands of businesses using Gigligo to find the best talent and scale their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <button className="px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm shadow-sm hover:shadow-md">
                  Start Hiring Now
                </button>
              </Link>
              <Link href="/register?role=SELLER">
                <button className="px-8 py-3.5 bg-white border border-gray-200 text-text-main font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">
                  Become a Freelancer
                </button>
              </Link>
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

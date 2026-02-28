'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden selection:bg-primary/30">
      {/* Faint Background Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-pattern z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#1E1E1E]/95 backdrop-blur-md px-6 py-4 lg:px-12 transition-colors duration-300">
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
          <Logo className="h-8" iconClassName="text-primary" />
        </div>
        <div className="hidden lg:flex flex-1 justify-end gap-10 items-center">
          <nav className="flex items-center gap-8">
            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors" href="/search">Find Talent</Link>
            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors" href="/register">Join as Pro</Link>
            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors" href="#">Enterprise</Link>
            <Link className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors" href="/login">Log In</Link>
          </nav>
          <Link href="/register" className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold tracking-wide shadow-lg shadow-primary/20">
            <span>Get Started</span>
          </Link>
        </div>
        {/* Mobile Menu Icon */}
        <div className="lg:hidden text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </div>
      </header>

      <main className="layout-container flex flex-col grow z-10">
        <div className="flex flex-1 justify-center py-10 lg:py-20">
          <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 lg:px-8 gap-20">

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-8 order-2 lg:order-1"
              >
                <div className="flex flex-col gap-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit">
                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Premium Network</span>
                  </div>
                  <h1 className="text-slate-900 dark:text-white text-5xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
                    Create •<br />Chat • Start.
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-normal leading-relaxed max-w-lg">
                    Access an exclusive network of high-end talent and serious business opportunities. Elevate your projects with GIGLIGO&apos;s curated elite.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/register" className="flex cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white hover:bg-primary-dark transition-colors text-base font-bold tracking-wide shadow-xl shadow-primary/20">
                    <span>Start Now</span>
                  </Link>
                  <Link href="/search" className="flex cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-base font-medium">
                    <span>Explore</span>
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-4 text-slate-500 dark:text-slate-500 text-sm">
                  <div className="flex -space-x-3">
                    <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAy951AyHXYlgo87XrSqWNTnTKx1oF-3mw1DhJaQ2IjrVTCAJwbp5lkyNo62Iun1ttrDMRQHjglrZZhWrho7ynf21GkJak4DSUbvFiWinyw9KRvfmH-LYUK1ByRQtrK4udNoegPYkfr9OfTQ6y1TOj3Hz-98rYQyiRaG0-CgoZcVHNc0lC4s3xdG5Rw3Fe27RPDMEbhqDk9liuLteHon1esPvQh4tTaPIrYd9YWCKIWYRv0sTWf3_bSDBGvamlqTZdyutGxKoXUcpo")' }}></div>
                    <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-300 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwY8tQFuqmXR9xT5Kn0IaJYWe78H5oQs7mK1yJz7cIlHRd48ymasyYizxTzH7hISwIPsv3FQ9fFKpLdFBCbV-JAAeuOnNqRyoeafHcDXjMB6zaTvt6_2OrkHgymUCQ1aLyJcGWGcGXR0qyU1_9FxZtom8-MSo-ASvTfkvN7YVuvn5hwSywjWP2KqKb5FwHH40wp1d2aysfaxairypQTUkf7wrWaCoGMu04HAW6zTooWDBPfwfzdOCmMzvvlkiGm5QRxNo9KNGZRro")' }}></div>
                    <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-400 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCv6k6IJtPsRtauuejdpsmycJY9B1_WqUF-EBp2hUTXpxUJcfwB6-6RJYDMz4ueyeYmmJkLxdo2I1a9q7DPtzwTQZbBKO0H2GUxw14IMgo2H_lGbIf4TePyAdxkhIvUkdpt4SVPQHaG9PvJ16FqBB5Ou9X3IImcGJznnwCfThCXUI7kTcBykKRWZTU90mqEMjb2RvS_xtwnN4O33IulCX83a-QK-mKyj1kiDHUvukCotfhAf4fDD0jsu2AIjWBF1Gh25kvlqi-MX0I")' }}></div>
                  </div>
                  <p>Trusted by 10,000+ elite professionals</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative h-[500px] w-full rounded-2xl overflow-hidden order-1 lg:order-2 shadow-2xl"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-700" style={{ backgroundImage: 'url("/3d_handshake_partners_1772299828770.png")' }}>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                      <p className="text-white font-bold">Verified Excellence</p>
                    </div>
                    <p className="text-white/80 text-sm">&quot;GIGLIGO transformed how we source executive creative direction. Simply unmatched quality.&quot;</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Verified Talent Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="max-w-2xl">
                  <h2 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-4">
                    Verified <span className="text-primary">Elite Talent</span>
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Hand-picked professionals vetted for expertise, reliability, and excellence. Only the top 1% make the cut.
                  </p>
                </div>
                <Link className="group flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity" href="/search">
                  View All Categories
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card 1 */}
                <div className="group cursor-pointer relative flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-primary">
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqvHWbGlb-Fo0vZn90BiSLB3XgkUgG8hJkTX2GxO5Tuy1HnB8e1vGoi-ilYoi2YRZ5I0qEJ8mr6YkhZKKnGtXicZ3h_3hWOOpgYlxFA_c1sTWzjEWBWrriq2WSsB--qX8Y4Qt2nhXVDT026FRvB7X1TsEUU0eywtM4iRBukCrXyJ8lCC6ldck71Bp2c8l3BUBaXVz_zmUkrWKjVkQ-kvI1xIjOL75aldeSs19mZlsNtAaWz94x-a3hQLblzfOQLStI30SV38YewXs")' }}></div>
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
                      <button className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="group cursor-pointer relative flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-primary">
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYrUokKWHJ51Q3nZ2cy-iWFBN5y514essRE_pBDqkb0PjB7vA5MCConR9QhKwBwWKi1YXdw63Vv6nI6MHNf9Xia45kgktNeBrN6vTW7vdHBBK_rlSMSsr31gfGQosO219PQAZhQ0MEAArr7FfHVDgzPA5hBrXgCz6VedLe0cWLy3A_WUGlQdvMZF5U0dySSRo6ypxn5u9TlVpTj04LVwlhVdWGVJ5wvWT29MyVWZhVH1A8p2WwU-aboCfYoAAk-ISsb-ZFupRmXUo")' }}></div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Full-Stack Architects</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Building scalable enterprise solutions for Fortune 500s.</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">86 Available</span>
                      <button className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="group cursor-pointer relative flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-primary">
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDv2-sqApu0ULtw2FzRIFq6mjnsujsbbs-5wHSO8lJjbTvgEH9Q6xJRTApqTX9I0VuIEF23gv7DFVarg2BMl--TUXjAWPSmHsCSRtafS7L23FRnzG9CLomUoll3vPtxCPtmscM5-vk5LSIZF5eJ-3OWiEi94nqZMogq2EGx5eG9T0yf9IWBHtAXUlo3TJnsj2YOxOhgQ2JMBCyBeN6JlhGI8fvUdv4nMU0aXGsrODKZkVp3JfkOraUGsiEvesG_1TqdSujrXS38WM4")' }}></div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-1">Growth Strategists</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Data-driven marketing leaders to scale your revenue.</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">53 Available</span>
                      <button className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Trust/Logos Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="py-10 border-t border-slate-200 dark:border-slate-800"
            >
              <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by global leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">ACME<span className="text-primary">CORP</span></span>
                <span className="text-2xl font-bold italic text-slate-800 dark:text-slate-200">Vertex</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-[0.2em]">GLOBAL</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">Strata.</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1"><span className="block size-4 bg-primary rounded-full"></span>Onyx</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E1E1E] py-12">
        <div className="layout-container flex flex-col items-center justify-center gap-6 text-center px-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-2xl">diamond</span>
            <span className="text-slate-900 dark:text-white font-bold tracking-tight">GIGLIGO</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors" href="#">Support</Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 GIGLIGO Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

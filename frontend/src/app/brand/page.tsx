'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function HorizonLogoStory() {
    return (
        <div className="min-h-screen bg-background-light text-text-main font-sans antialiased overflow-x-hidden selection:bg-primary/30">
            {/* Minimalist Navigation */}
            <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
                <Link href="/" className="font-bold tracking-widest uppercase hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">arrow_back</span> Return
                </Link>
                <Logo className="h-4 w-auto" variant="white" />
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative h-screen flex flex-col justify-center items-center bg-slate-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>

                    {/* The "Horizon" Graphic (Conceptual) */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-30"></div>
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 bg-linear-to-t from-transparent via-primary/5 to-transparent blur-2xl"></div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
                        <span className="material-symbols-outlined text-primary text-6xl mb-8 animate-pulse">diamond</span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                            The Horizon of <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-yellow-400 to-primary">Opportunity.</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            GIGLIGO represents your professional journey. From creation, to connection, to launch. Experience the precision of growth and the trust of a new beginning.
                        </p>
                    </div>

                    <div className="absolute bottom-12 flex flex-col items-center gap-2 text-white/30 animate-bounce">
                        <span className="text-xs uppercase tracking-widest font-bold">Discover</span>
                        <span className="material-symbols-outlined">south</span>
                    </div>
                </section>

                {/* Stages Section */}
                <section className="py-32 bg-background-light px-6 border-b border-border-light">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-main">
                                Three Stages of <span className="text-primary italic font-serif">Growth</span>
                            </h2>
                            <p className="text-text-muted text-lg max-w-2xl mx-auto">
                                Our philosophy is embedded in every detail. The horizon line guides you through the essential phases of professional evolution.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Stage 1 */}
                            <div className="group border-l-2 border-border-light pl-6 hover:border-primary transition-colors duration-500">
                                <div className="text-5xl font-black text-primary/20 mb-6 group-hover:text-primary transition-colors">01</div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">draw</span>
                                    Create
                                </h3>
                                <p className="text-text-muted leading-relaxed">
                                    The foundation. Sourcing exceptional talent and defining the scope of visionary projects. The spark of the idea.
                                </p>
                            </div>

                            {/* Stage 2 */}
                            <div className="group border-l-2 border-border-light pl-6 hover:border-primary transition-colors duration-500">
                                <div className="text-5xl font-black text-primary/20 mb-6 group-hover:text-primary transition-colors">02</div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">forum</span>
                                    Chat
                                </h3>
                                <p className="text-text-muted leading-relaxed">
                                    The bridge. Secure, encrypted communication connecting minds across the globe. Aligning vision with capability.
                                </p>
                            </div>

                            {/* Stage 3 */}
                            <div className="group border-l-2 border-border-light pl-6 hover:border-primary transition-colors duration-500">
                                <div className="text-5xl font-black text-primary/20 mb-6 group-hover:text-primary transition-colors">03</div>
                                <h3 className="text-2xl font-bold mb-3 text-text-main flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">rocket_launch</span>
                                    Start
                                </h3>
                                <p className="text-text-muted leading-relaxed">
                                    The execution. Agreements signed, escrow funded, and the work begins. Crossing the threshold into reality.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conceptual Gallery */}
                <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                                    Visionary <span className="text-primary">Spaces.</span>
                                </h2>
                                <p className="text-white/60 text-lg leading-relaxed mb-8">
                                    The workspace is no longer constrained by physical walls. We've built an environment where top-tier professionals and ambitious businesses intersect. A digital executive suite designed for focus and trust.
                                </p>
                                <Link href="/search" className="inline-flex h-12 px-8 items-center justify-center bg-white text-nav-bg font-bold tracking-wide text-sm rounded-lg hover:bg-primary hover:text-white transition-colors">
                                    Explore the Network
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-64 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:border-primary/50 transition-colors">
                                        <span className="material-symbols-outlined text-5xl">architecture</span>
                                    </div>
                                    <div className="h-48 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary/50 hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-5xl">handshake</span>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-12">
                                    <div className="h-48 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:border-primary/50 transition-colors">
                                        <span className="material-symbols-outlined text-5xl">verified_user</span>
                                    </div>
                                    <div className="h-64 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:border-primary/50 transition-colors">
                                        <span className="material-symbols-outlined text-5xl">language</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Minimal */}
            <footer className="bg-slate-900 border-t border-white/10 py-12 text-center">
                <p className="text-white/30 text-sm font-semibold tracking-widest uppercase flex items-center justify-center">© {new Date().getFullYear()} <Logo className="h-3 ml-2 w-auto" variant="white" /></p>
            </footer>
        </div>
    );
}

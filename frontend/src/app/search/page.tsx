'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { gigApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    }
};

function SearchPageContent() {
    const { data: session } = useSession();
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE', 'ADMIN'].includes(role);

    const searchParams = useSearchParams();
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');

    const loadGigs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== 'All Categories') params.set('category', category);
            if (search) params.set('q', search);
            const data = await gigApi.list(params);
            setGigs(Array.isArray(data) ? data : (data.items || []));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadGigs();
    }, [category]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadGigs();
    };

    const categories = ['All Categories', 'Design', 'Development', 'Marketing', 'Writing', 'AI & ML', 'Business'];

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white font-sans selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Discovery Hero */}
                <section className="relative overflow-hidden bg-background-dark text-white pt-32 pb-48 px-6">
                    {/* Cinematic Background */}
                    <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[180px] pointer-events-none opacity-40 animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-20" />

                    <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-4xl"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-block px-8 py-2 bg-white/5 border border-white/10 text-primary font-black text-[10px] uppercase tracking-[0.5em] rounded-full mb-12 backdrop-blur-3xl"
                            >
                                Talent Discovery
                            </motion.div>
                            <h1 className="text-6xl md:text-[9.5rem] font-black tracking-tighter leading-[0.85] mb-12 uppercase italic">
                                Find <span className="text-primary not-italic">Elite.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/50 font-bold leading-tight mb-20 max-w-2xl mx-auto">
                                Curated university talent for high-impact ventures. Precision-matched to your mission requirements.
                            </p>

                            {/* Ultra-Premium Search Bar */}
                            <form onSubmit={handleSearch} className="group relative w-full max-w-3xl mx-auto">
                                <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-blue-600/50 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                <div className="relative flex items-center bg-white/10 p-3 rounded-full border border-white/20 backdrop-blur-3xl shadow-2xl transition-all group-hover:bg-white/15">
                                    <span className="material-symbols-outlined ml-6 text-white/30 text-3xl font-light group-hover:text-primary transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="SEARCH INTEL, SKILLS, OR NAMES..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="flex-1 bg-transparent border-none px-6 py-6 text-white placeholder:text-white/20 text-lg font-black uppercase tracking-widest outline-none"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="hidden md:flex h-[72px] px-14 bg-primary text-white text-sm font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 items-center justify-center"
                                    >
                                        Execute
                                    </motion.button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="md:hidden w-full mt-6 py-5 bg-primary text-white text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-primary/20"
                                >
                                    Execute Search
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </section>

                {/* Categorical Filtering */}
                <div className="border-b border-border-light dark:border-white/10 bg-white/90 dark:bg-background-dark/95 backdrop-blur-2xl sticky top-[72px] z-30 transition-all duration-500">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center gap-6 overflow-x-auto py-8 no-scrollbar">
                        {categories.map(cat => (
                            <motion.button
                                whileHover={{ y: -3 }}
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap shadow-sm group ${category === cat
                                    ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-110'
                                    : 'bg-black/5 dark:bg-white/5 text-text-muted dark:text-white/40 hover:text-primary hover:bg-black/10 dark:hover:bg-white/10'
                                    }`}
                            >
                                {cat}
                                {category === cat && (
                                    <motion.div layoutId="underline" className="h-0.5 bg-white/30 rounded-full mt-1 mx-2" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Discovery Grid */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-black/5 dark:bg-white/5 rounded-[3.5rem] border border-border-light dark:border-white/10 h-[500px]" />
                            ))}
                        </div>
                    ) : gigs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-48 border border-dashed border-border-light dark:border-white/10 rounded-[4rem] bg-black/2 dark:bg-white/2 backdrop-blur-3xl"
                        >
                            <div className="w-32 h-32 bg-primary/10 text-primary rounded-4xl flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-inner">
                                <span className="material-symbols-outlined text-6xl font-light">search_off</span>
                            </div>
                            <h3 className="text-5xl font-black text-background-dark dark:text-white mb-6 uppercase tracking-tighter">Negative Results</h3>
                            <p className="text-text-muted dark:text-white/50 max-w-md mx-auto mb-16 text-xl font-bold leading-tight uppercase tracking-widest opacity-60">
                                {(!session || isFreelancer)
                                    ? "Be the first to provide this capability. The marketplace awaits."
                                    : "Adjust search parameters or category filter for wider coverage."}
                            </p>
                            {(!session || isFreelancer) && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href={session ? "/dashboard/create-gig" : "/register?role=SELLER"} className="inline-flex items-center justify-center py-6 px-16 bg-primary text-white font-black rounded-full uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all text-sm">
                                        Establish Presence
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {gigs.map(gig => (
                                <motion.div key={gig.id} variants={itemVariants}>
                                    <Link
                                        href={`/gig/${gig.id}`}
                                        className="group relative flex flex-col bg-white dark:bg-white/5 rounded-[3.5rem] border border-border-light dark:border-white/10 overflow-hidden hover:border-primary transition-all duration-700 h-full shadow-2xl hover:shadow-primary/10 backdrop-blur-3xl"
                                    >
                                        {/* Cinematic Visualizer */}
                                        <div className="w-full aspect-6/5 shrink-0 overflow-hidden relative bg-black/5 dark:bg-white/5">
                                            {gig.images && gig.images.length > 0 ? (
                                                <Image src={gig.images[0]} alt={gig.title} fill className="object-cover transition-transform duration-2000 ease-out group-hover:scale-110" sizes="(max-width: 768px) 100vw, 500px" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted/20 dark:text-white/5">
                                                    <span className="material-symbols-outlined text-8xl font-thin">all_inclusive</span>
                                                </div>
                                            )}

                                            {/* Price Badge - Premium Glass */}
                                            <div className="absolute bottom-6 left-6 bg-white/20 dark:bg-background-dark/30 backdrop-blur-2xl text-white px-8 py-4 rounded-full border border-white/30 text-base font-black shadow-2xl tracking-tighter shadow-black/40">
                                                PKR {gig.basePrice?.toLocaleString()}
                                            </div>

                                            {/* Featured Overlays */}
                                            {gig.boosts && gig.boosts.length > 0 && (
                                                <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] px-6 py-3 rounded-full shadow-2xl shadow-primary/50 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-xs">bolt</span>
                                                    Intel Selected
                                                </div>
                                            )}
                                        </div>

                                        {/* Strategic Intelligence */}
                                        <div className="flex-1 p-10 flex flex-col">
                                            {/* Talent Profile */}
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg font-black text-text-main dark:text-white shrink-0 border border-border-light dark:border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                    {gig.seller?.profile?.fullName?.[0] || 'T'}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="text-base font-black text-background-dark dark:text-white block uppercase tracking-tighter leading-none group-hover:text-primary transition-colors truncate mb-1">
                                                        {gig.seller?.profile?.fullName || 'EXPERT TALENT'}
                                                    </span>
                                                    <span className="text-[10px] text-text-muted dark:text-white/30 uppercase tracking-[0.3em] font-black italic">{gig.category || 'SPECIALIST'}</span>
                                                </div>
                                            </div>

                                            {/* Intelligence Briefing */}
                                            <h3 className="text-3xl font-black text-background-dark dark:text-white line-clamp-2 mb-6 group-hover:text-primary transition-all leading-none tracking-tighter uppercase grayscale group-hover:grayscale-0">
                                                {gig.title}
                                            </h3>

                                            <p className="text-base text-text-muted dark:text-white/40 line-clamp-2 leading-snug mb-10 flex-1 font-bold italic">
                                                {gig.description || 'Superior craftsmanship delivering exponential value across core mission objectives.'}
                                            </p>

                                            {/* Core Metrics */}
                                            <div className="flex items-center justify-between pt-10 border-t border-border-light dark:border-white/5 mt-auto">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 px-5 py-2.5 bg-black/3 dark:bg-white/3 rounded-full border border-black/5 dark:border-white/5 shadow-inner">
                                                        <span className="material-symbols-outlined text-primary text-xl font-light" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
                                                        <span className="font-black text-background-dark dark:text-white text-base tracking-tighter">{gig.avgRating ? gig.avgRating.toFixed(1) : 'NEW'}</span>
                                                    </div>
                                                    <span className="text-text-muted dark:text-white/30 font-black text-[9px] uppercase tracking-[0.3em]">({gig.reviewCount || 0} INTEL)</span>
                                                </div>
                                                <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-background-dark dark:text-white translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 border border-transparent group-hover:border-primary/20">
                                                    <span className="material-symbols-outlined text-3xl font-thin">arrow_outward</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

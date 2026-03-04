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
        <div className="flex flex-col min-h-screen bg-white text-background-dark font-inter selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Discovery Hero - Editorial Minimal */}
                <section className="relative bg-white pt-24 pb-16 px-6 border-b border-border-light/40">
                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-background-dark mb-4 uppercase">
                                Talent Discovery
                            </h1>
                            <p className="text-lg md:text-xl text-text-muted font-medium mb-12 font-lora italic opacity-70">
                                Unmatched talent for world-class projects.
                            </p>

                            {/* Minimalist Search Bar */}
                            <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
                                <div className="relative flex items-center bg-[#f5f5f7] p-4 rounded-2xl transition-all border border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:shadow-xl">
                                    <span className="material-symbols-outlined ml-4 text-text-muted/40">search</span>
                                    <input
                                        type="text"
                                        placeholder="Find Agency, Skills, or Names..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="flex-1 bg-transparent border-none px-4 py-2 text-background-dark placeholder:text-text-muted/30 text-lg font-medium outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-8 py-2 bg-background-dark text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary transition-all shadow-lg"
                                    >
                                        Execute
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </section>

                {/* Categories - Editorial Horizontal */}
                <div className="bg-white/80 backdrop-blur-xl sticky top-[72px] z-30 border-b border-border-light/20">
                    <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-8 overflow-x-auto py-6 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${category === cat
                                    ? 'text-primary'
                                    : 'text-text-muted hover:text-background-dark'
                                    }`}
                            >
                                {cat}
                                {category === cat && (
                                    <motion.div layoutId="searchUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Talent Discovery List */}
                <div className="max-w-4xl mx-auto px-6 py-20">
                    {loading ? (
                        <div className="space-y-12">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-black/2 rounded-3xl h-64" />
                            ))}
                        </div>
                    ) : gigs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 border-2 border-dashed border-border-light/40 rounded-[2.5rem]"
                        >
                            <span className="material-symbols-outlined text-6xl text-text-muted/20 mb-6">database_off</span>
                            <h3 className="text-2xl font-black text-background-dark mb-4 uppercase tracking-tighter">No Talent Found</h3>
                            <p className="text-text-muted font-lora italic">Expand your search criteria or explore other categories.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-12"
                        >
                            {gigs.map(gig => (
                                <motion.div key={gig.id} variants={itemVariants}>
                                    <Link
                                        href={`/gig/${gig.id}`}
                                        className="group block bg-white hover:bg-[#fafafb] transition-all duration-500 rounded-[2rem] overflow-hidden relative"
                                    >
                                        {/* Vertical Gold Accent - The Stitch Signature */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-12 bg-[#c9a227] opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-8">
                                            {/* Portrait Visualizer (B&W) */}
                                            <div className="w-48 h-48 shrink-0 relative rounded-3xl overflow-hidden bg-black/5 border border-border-light/20 grayscale group-hover:grayscale-0 transition-all duration-700">
                                                {gig.images && gig.images.length > 0 ? (
                                                    <Image
                                                        src={gig.images[0]}
                                                        alt={gig.title}
                                                        fill
                                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                                        sizes="200px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#f0f0f2]">
                                                        <span className="text-4xl font-black text-background-dark/10 tracking-tighter">G.</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Talent Briefing */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                                                        {gig.category || 'Specialist'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full">
                                                        <span className="material-symbols-outlined text-[14px] text-[#c9a227]" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
                                                        <span className="text-[10px] font-black">{gig.avgRating ? gig.avgRating.toFixed(1) : 'NEW'}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-3xl font-black text-background-dark mb-4 tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
                                                    {gig.seller?.profile?.fullName || 'EXPERT TALENT'}
                                                </h3>

                                                <p className="text-xl text-background-dark font-bold tracking-tight mb-4 leading-tight opacity-90">
                                                    {gig.title}
                                                </p>

                                                <p className="text-base text-text-muted font-lora italic leading-relaxed mb-8 line-clamp-2 max-w-2xl">
                                                    {gig.description || 'Superior craftsmanship delivering exponential value across core mission objectives.'}
                                                </p>

                                                {/* Skill Vectors */}
                                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                    {gig.tags?.slice(0, 4).map((tag: string) => (
                                                        <span key={tag} className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest px-4 py-2 bg-black/5 rounded-xl">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    <div className="ml-auto hidden md:flex items-center gap-3 text-primary group-hover:translate-x-2 transition-transform duration-500">
                                                        <span className="text-[10px] font-black uppercase tracking-widest px-2">View Portfolio</span>
                                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )
                    }
                </div >
            </main >

            <Footer />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div >
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

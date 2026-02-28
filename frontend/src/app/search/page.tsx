'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { gigApi } from "@/lib/api";

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

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 96 }}>
                {/* Hero Section – Editorial Discovery */}
                <section className="relative overflow-hidden bg-nav-bg text-white py-20 md:py-28">
                    {/* Abstract geometric pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 border border-white/10 rotate-45 translate-y-1/3 -translate-x-1/4"></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                                Discover <span className="text-primary">Excellence.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/60 font-normal leading-relaxed mb-10 max-w-lg">
                                Curated talent for world-class ventures. Only the top 1% make the cut.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl">search</span>
                                    <input
                                        type="text"
                                        placeholder="Search talent, services, or skills..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white placeholder:text-white/30 text-sm font-medium outline-none focus:border-primary/50 focus:bg-white/8 transition-all backdrop-blur-sm"
                                    />
                                </div>
                                <button type="submit" className="h-[54px] px-7 bg-primary text-white text-sm font-bold tracking-wide rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Category Filter Bar */}
                <div className="border-b border-border-light bg-surface-light sticky top-0 z-20">
                    <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                        {['All Categories', 'Design', 'Development', 'Marketing', 'Writing', 'AI & ML', 'Business'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${category === cat
                                    ? 'bg-nav-bg text-white shadow-sm'
                                    : 'bg-transparent text-text-muted hover:bg-background-light hover:text-text-main border border-transparent hover:border-border-light'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-surface-light rounded-xl border border-border-light h-72"></div>
                            ))}
                        </div>
                    ) : gigs.length === 0 ? (
                        <div className="text-center py-28 border border-border-light rounded-2xl bg-surface-light">
                            <div className="w-20 h-20 bg-background-light text-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-border-light">
                                <span className="material-symbols-outlined text-4xl">search</span>
                            </div>
                            <h3 className="text-2xl font-bold text-text-main mb-3">No results found</h3>
                            <p className="text-text-muted max-w-sm mx-auto mb-8 leading-relaxed">
                                {(!session || isFreelancer)
                                    ? "Be the first to offer this service! Pakistan's talent economy is waiting for your skills."
                                    : "Try adjusting your search criteria or category filter."}
                            </p>
                            {(!session || isFreelancer) && (
                                <Link href={session ? "/dashboard/create-gig" : "/register?role=SELLER"} className="inline-flex items-center justify-center h-12 px-8 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                    Create a Gig Now
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {gigs.map(gig => (
                                <Link
                                    href={`/gig/${gig.id}`}
                                    key={gig.id}
                                    className="group relative flex flex-col md:flex-row bg-surface-light rounded-xl border border-border-light overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="w-full md:w-56 h-48 md:h-auto shrink-0 overflow-hidden relative bg-background-light">
                                        {gig.images && gig.images.length > 0 ? (
                                            <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted/20">
                                                <span className="material-symbols-outlined text-5xl">layers</span>
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {gig.boosts && gig.boosts.length > 0 && (
                                            <div className="absolute top-4 left-4 bg-nav-bg/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-xs">bolt</span>
                                                FEATURED
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            {/* Seller */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-nav-bg flex items-center justify-center text-xs font-bold text-primary shrink-0 ring-2 ring-primary/20">
                                                    {gig.seller?.profile?.fullName?.[0] || 'S'}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-text-main block">{gig.seller?.profile?.fullName || 'Verified Pro'}</span>
                                                    <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">{gig.category || 'Expert'}</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-text-main line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug tracking-tight">
                                                {gig.title}
                                            </h3>

                                            {/* Description snippet */}
                                            <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4">
                                                {gig.description || 'Curated talent delivering world-class work for elite ventures.'}
                                            </p>
                                        </div>

                                        {/* Footer: Rating + Price */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border-light">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="font-bold text-text-main">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                                <span className="text-text-muted font-medium">({gig.reviewCount || 0})</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">From</span>
                                                <span className="text-base font-bold text-text-main tracking-tight">PKR {gig.basePrice?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

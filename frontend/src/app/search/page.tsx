'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { gigApi } from "@/lib/api";
import { Search, Layers, Zap, Star } from "lucide-react";

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

            // The backend returns an array of gigs sorted correctly
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
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-[#212121] mb-2">{category}</h1>
                        <p className="text-[#424242]/60 font-normal">Explore verified talent ready to launch your projects.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424242]/30 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search talent or services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3.5 bg-[#F5F5F5] border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#DAA520]/20 transition-all text-sm text-[#212121] placeholder:text-[#424242]/30 font-bold"
                        />
                    </form>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white p-6 rounded-2xl border border-[#212121]/5 sticky top-24">
                            <h2 className="font-bold text-sm uppercase tracking-widest mb-6 text-[#212121] border-b border-[#F5F5F5] pb-4">Filters</h2>

                            <div className="mb-6">
                                <h3 className="font-bold text-[10px] uppercase tracking-widest mb-4 text-[#424242]/60">Budget Range</h3>
                                <div className="flex gap-2 items-center">
                                    <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-[#F5F5F5] border border-transparent rounded-lg text-sm text-[#212121] outline-none focus:bg-white focus:border-[#DAA520]/20" />
                                    <span className="text-[#424242]/20">-</span>
                                    <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-[#F5F5F5] border border-transparent rounded-lg text-sm text-[#212121] outline-none focus:bg-white focus:border-[#DAA520]/20" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-[#F5F5F5] rounded-2xl border border-[#212121]/5 h-72"></div>
                                ))}
                            </div>
                        ) : gigs.length === 0 ? (
                            <div className="text-center py-24 border border-[#212121]/5 rounded-[32px] bg-[#F5F5F5] shadow-sm">
                                <div className="w-20 h-20 bg-[#DAA520]/10 text-[#DAA520] rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#212121] mb-3">No results found</h3>
                                <p className="text-[#424242]/60 max-w-sm mx-auto mb-10 font-normal">
                                    {(!session || isFreelancer)
                                        ? "Be the first to offer this service! Pakistan's talent economy is waiting for your skills."
                                        : "Try adjusting your search criteria or category filter to find what you're looking for."}
                                </p>
                                {(!session || isFreelancer) && (
                                    <Link href={session ? "/dashboard/create-gig" : "/register?role=SELLER"} className="btn-primary px-10 py-4">
                                        Create a Gig Now
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gigs.map(gig => (
                                    <Link href={`/gig/${gig.id}`} key={gig.id} className="group flex flex-col bg-white rounded-2xl border border-[#212121]/5 overflow-hidden hover:border-[#DAA520]/20 hover:shadow-2xl transition-all duration-300">

                                        {/* Image Region & Badges */}
                                        <div className="h-44 overflow-hidden relative bg-[#F5F5F5]">
                                            {gig.images && gig.images.length > 0 ? (
                                                <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-[#212121]/10">
                                                    <Layers size={32} />
                                                </div>
                                            )}

                                            {/* FEATURED BADGE */}
                                            {gig.boosts && gig.boosts.length > 0 && (
                                                <div className="absolute top-4 left-4 bg-[#DAA520] text-[#212121] text-[10px] tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                                                    <Zap size={12} fill="currentColor" />
                                                    FEATURED
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Region */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded-full bg-[#212121] flex items-center justify-center text-[10px] font-bold text-[#DAA520] shrink-0">
                                                    {gig.seller?.profile?.fullName?.[0] || 'S'}
                                                </div>
                                                <span className="text-[10px] font-bold text-[#424242]/40 uppercase tracking-widest w-full overflow-hidden text-ellipsis whitespace-nowrap">{gig.seller?.profile?.fullName || 'Seller'}</span>
                                            </div>

                                            <h3 className="text-sm font-bold text-[#212121] line-clamp-2 mb-4 group-hover:text-[#DAA520] transition-colors flex-1 leading-snug">
                                                {gig.title}
                                            </h3>

                                            <div className="flex items-center text-xs font-bold mb-4">
                                                <Star size={14} className="text-[#DAA520] mr-1" fill="currentColor" />
                                                <span className="text-[#212121]">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                                <span className="text-[#424242]/40 ml-1">({gig.reviewCount || 0}) reviews</span>
                                            </div>

                                            <div className="pt-6 border-t border-[#F5F5F5] flex items-center justify-between">
                                                <span className="text-[9px] font-bold text-[#424242]/40 uppercase tracking-widest">Starting at</span>
                                                <span className="text-sm font-bold text-[#212121] bg-[#F5F5F5] px-3 py-1 rounded-full">PKR {gig.basePrice?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#DAA520] border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

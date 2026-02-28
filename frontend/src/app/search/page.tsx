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
        <div className="flex flex-col min-h-screen bg-[#F7F7F6]">
            <Navbar />

            <main className="flex-1 content-container w-full" style={{ paddingTop: 96, paddingBottom: 64 }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 mt-12">
                    <div>
                        <h1 className="h1 text-[#1E1E1E] mb-2">{category}</h1>
                        <p className="body-regular text-[#3A3A3A]/70">Explore verified talent ready to launch your projects.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96 shadow-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A3A3A]/40 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search talent or services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#FFFFFF] border border-[#E5E5E5] rounded-[10px] outline-none focus:border-[#C9A227] transition-all text-[15px] font-medium text-[#1E1E1E] placeholder:text-[#3A3A3A]/40 shadow-sm"
                        />
                    </form>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-[#FFFFFF] p-8 rounded-[10px] border border-[#E5E5E5] sticky top-28 shadow-sm">
                            <h2 className="micro-label text-[#1E1E1E] border-b border-[#F7F7F6] pb-4 mb-6">Filters</h2>

                            <div className="mb-6">
                                <h3 className="micro-label text-[#3A3A3A]/60 mb-4">Budget Range (PKR)</h3>
                                <div className="flex gap-3 items-center">
                                    <input type="number" placeholder="Min" className="w-full px-4 py-3 bg-[#F7F7F6] border border-transparent rounded-[8px] text-[14px] font-medium text-[#1E1E1E] outline-none focus:bg-[#FFFFFF] focus:border-[#C9A227] transition-colors" />
                                    <span className="text-[#3A3A3A]/30">-</span>
                                    <input type="number" placeholder="Max" className="w-full px-4 py-3 bg-[#F7F7F6] border border-transparent rounded-[8px] text-[14px] font-medium text-[#1E1E1E] outline-none focus:bg-[#FFFFFF] focus:border-[#C9A227] transition-colors" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-[#FFFFFF] rounded-[10px] border border-[#E5E5E5] h-80"></div>
                                ))}
                            </div>
                        ) : gigs.length === 0 ? (
                            <div className="text-center py-32 border border-[#E5E5E5] rounded-[20px] bg-[#FFFFFF] shadow-sm">
                                <div className="w-24 h-24 bg-[#F7F7F6] text-[#C9A227] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#E5E5E5]">
                                    <Search size={36} />
                                </div>
                                <h3 className="h3 text-[#1E1E1E] mb-4">No results found</h3>
                                <p className="body-regular text-[#3A3A3A]/60 max-w-sm mx-auto mb-10">
                                    {(!session || isFreelancer)
                                        ? "Be the first to offer this service! Pakistan's talent economy is waiting for your skills."
                                        : "Try adjusting your search criteria or category filter to find what you're looking for."}
                                </p>
                                {(!session || isFreelancer) && (
                                    <Link href={session ? "/dashboard/create-gig" : "/register?role=SELLER"} className="btn-primary">
                                        Create a Gig Now
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {gigs.map(gig => (
                                    <Link href={`/gig/${gig.id}`} key={gig.id} className="card group p-0 overflow-hidden flex flex-col hover:-translate-y-2">

                                        {/* Image Region & Badges */}
                                        <div className="h-48 overflow-hidden relative bg-[#F7F7F6] border-b border-[#E5E5E5]">
                                            {gig.images && gig.images.length > 0 ? (
                                                <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-[#1E1E1E]/10 bg-abstract-geometry">
                                                    <Layers size={40} />
                                                </div>
                                            )}

                                            {/* FEATURED BADGE */}
                                            {gig.boosts && gig.boosts.length > 0 && (
                                                <div className="absolute top-4 left-4 bg-[#1E1E1E] text-[#C9A227] micro-label px-3 py-1.5 rounded-[6px] shadow-lg border border-[#3A3A3A] flex items-center gap-1.5">
                                                    <Zap size={12} fill="currentColor" />
                                                    FEATURED
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Region */}
                                        <div className="p-6 flex flex-col flex-1 bg-[#FFFFFF]">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[12px] font-bold text-[#C9A227] shrink-0 border border-[#3A3A3A]">
                                                    {gig.seller?.profile?.fullName?.[0] || 'S'}
                                                </div>
                                                <span className="micro-label text-[#3A3A3A]/50 w-full overflow-hidden text-ellipsis whitespace-nowrap">{gig.seller?.profile?.fullName || 'Verified Seller'}</span>
                                            </div>

                                            <h3 className="text-[17px] font-semibold text-[#1E1E1E] line-clamp-2 mb-4 group-hover:text-[#C9A227] transition-colors flex-1 leading-snug">
                                                {gig.title}
                                            </h3>

                                            <div className="flex items-center text-[14px] font-bold mb-6">
                                                <Star size={16} className="text-[#C9A227] mr-1.5" fill="currentColor" />
                                                <span className="text-[#1E1E1E]">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                                <span className="text-[#3A3A3A]/40 ml-2 font-medium">({gig.reviewCount || 0})</span>
                                            </div>

                                            <div className="pt-5 border-t border-[#F7F7F6] flex items-center justify-between">
                                                <span className="micro-label text-[#3A3A3A]/40">Starting at</span>
                                                <span className="text-[15px] font-bold text-[#1E1E1E] tracking-tight">PKR {gig.basePrice?.toLocaleString()}</span>
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
        <Suspense fallback={<div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

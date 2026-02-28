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
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000]">
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA] mb-2">{category}</h1>
                        <p className="text-slate-600 dark:text-[#EFEEEA]/60">Explore talented freelancers ready to start your next project.</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#EFEEEA]/40 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search for services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-[#FE7743]/50 transition-all text-sm text-slate-900 dark:text-[#EFEEEA] placeholder:text-slate-400 dark:placeholder:text-[#EFEEEA]/30"
                        />
                    </form>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-slate-200 dark:border-white/10 sticky top-24">
                            <h2 className="font-bold text-base mb-4 text-slate-900 dark:text-[#EFEEEA] border-b border-slate-200 dark:border-white/5 pb-2">Filters</h2>

                            <div className="mb-6">
                                <h3 className="font-semibold text-sm mb-3 text-slate-700 dark:text-[#EFEEEA]/80">Budget</h3>
                                <div className="flex gap-2 items-center">
                                    <input type="number" placeholder="Min" className="w-full px-2 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-[#EFEEEA] outline-none focus:border-[#FE7743]/50" />
                                    <span className="text-slate-400 dark:text-[#EFEEEA]/40">-</span>
                                    <input type="number" placeholder="Max" className="w-full px-2 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-[#EFEEEA] outline-none focus:border-[#FE7743]/50" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 h-72"></div>
                                ))}
                            </div>
                        ) : gigs.length === 0 ? (
                            <div className="text-center py-24 text-slate-500 dark:text-[#EFEEEA]/40 border border-slate-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#111] shadow-sm">
                                <div className="w-20 h-20 bg-[#FE7743]/10 text-[#FE7743] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No gigs found here</h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-8">
                                    {(!session || isFreelancer)
                                        ? "Be the first to offer this service! Pakistan's talent economy is waiting for your skills."
                                        : "Try adjusting your search criteria or category filter to find what you're looking for."}
                                </p>
                                {(!session || isFreelancer) && (
                                    <Link href={session ? "/dashboard/create-gig" : "/register?role=SELLER"} className="inline-block px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40">
                                        Create a Gig Now
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gigs.map(gig => (
                                    <Link href={`/gig/${gig.id}`} key={gig.id} className="group gig-card flex flex-col bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-[#FE7743]/30 transition-all">

                                        {/* Image Region & Badges */}
                                        <div className="h-44 overflow-hidden relative bg-slate-100 dark:bg-[#273F4F]/20">
                                            {gig.images && gig.images.length > 0 ? (
                                                <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-[#EFEEEA]/20">
                                                    <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                                                </div>
                                            )}

                                            {/* FEATURED BADGE */}
                                            {gig.boosts && gig.boosts.length > 0 && (
                                                <div className="absolute top-3 left-3 bg-[#FE7743] text-white text-[10px] tracking-wider font-extrabold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                                    FEATURED
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Region */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 rounded-full bg-[#FE7743]/10 dark:bg-[#FE7743]/20 flex items-center justify-center text-[10px] font-bold text-[#FE7743] shrink-0">
                                                    {gig.seller?.profile?.fullName?.[0] || 'S'}
                                                </div>
                                                <span className="text-xs font-medium text-slate-600 dark:text-[#EFEEEA]/60 w-full overflow-hidden text-ellipsis whitespace-nowrap">{gig.seller?.profile?.fullName || 'Seller'}</span>
                                                {gig.seller?.profile?.sellerLevel && gig.seller.profile.sellerLevel !== 'NEW' && (
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ml-auto whitespace-nowrap ${gig.seller.profile.sellerLevel === 'TOP_RATED' ? 'bg-amber-100 dark:bg-amber-400/20 text-amber-600 dark:text-amber-300' :
                                                        gig.seller.profile.sellerLevel === 'LEVEL_2' ? 'bg-teal-100 dark:bg-teal-400/20 text-teal-600 dark:text-teal-300' :
                                                            'bg-blue-100 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300'
                                                        }`}>
                                                        {gig.seller.profile.sellerLevel === 'TOP_RATED' ? '⭐ Top Rated' :
                                                            gig.seller.profile.sellerLevel === 'LEVEL_2' ? 'Level 2' : 'Level 1'}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-[#EFEEEA] line-clamp-2 mb-3 group-hover:text-[#FE7743] transition-colors flex-1 leading-snug">
                                                {gig.title}
                                            </h3>

                                            <div className="flex items-center text-xs font-medium mb-3">
                                                <span className="text-amber-400 mr-1">★</span>
                                                <span className="text-slate-800 dark:text-[#EFEEEA]">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                                <span className="text-slate-500 dark:text-[#EFEEEA]/40 ml-1">({gig.reviewCount || 0})</span>
                                            </div>

                                            <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-slate-500 dark:text-[#EFEEEA]/40 uppercase tracking-wider">Starting at</span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-[#EFEEEA] bg-slate-100 dark:bg-[#273F4F] px-2.5 py-1 rounded-md">PKR {gig.basePrice?.toLocaleString()}</span>
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
        <Suspense fallback={<div className="min-h-screen bg-[#000] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}

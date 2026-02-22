'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const CATEGORIES = ['All', 'Web Development', 'Mobile Apps', 'Design', 'Data Science', 'Marketing', 'Writing', 'Video', 'Business', 'Other'];

function JobListContent() {
    const searchParams = useSearchParams();
    const [jobs, setJobs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [page, setPage] = useState(1);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== 'All') params.set('category', category);
            if (search) params.set('search', search);
            params.set('page', page.toString());
            params.set('limit', '12');
            const data = await jobApi.list(params);
            setJobs(data.items || []);
            setTotal(data.total || 0);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { loadJobs(); }, [category, page]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); loadJobs(); };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000]">
            <Navbar />
            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA]">Browse Jobs</h1>
                        <p className="text-slate-600 dark:text-[#EFEEEA]/50 text-sm mt-1">{total} jobs available</p>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-3">
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search jobs by title or description..."
                            className="flex-1 px-4 py-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-[#EFEEEA] text-sm placeholder:text-slate-400 dark:placeholder:text-[#EFEEEA]/30 focus:outline-none focus:border-[#FE7743]/50"
                        />
                        <button type="submit" className="px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition">
                            Search
                        </button>
                    </div>
                </form>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${category === cat
                                ? 'bg-[#FE7743] text-white'
                                : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-[#EFEEEA]/60 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                                }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Job Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 p-6 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-4" />
                                <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full mb-2" />
                                <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-24 text-slate-500 dark:text-[#EFEEEA]/40 border border-slate-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#111] shadow-sm">
                        <div className="w-20 h-20 bg-teal-500/10 text-teal-500 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No jobs found</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-8">Get things done by posting your own project. Top Pakistani freelancers are ready to help!</p>
                        <Link href="/register?role=BUYER" className="inline-block px-8 py-3 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#FE7743]/20 hover:shadow-[#FE7743]/40">
                            Post a Job Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobs.map((job: any) => (
                            <Link key={job.id} href={`/jobs/${job.id}`} className="group">
                                <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:border-[#FE7743]/30 transition-all hover:shadow-lg hover:shadow-[#FE7743]/5 h-full flex flex-col">
                                    {job.isBoosted && (
                                        <span className="text-[10px] font-bold text-[#FE7743] uppercase tracking-wider mb-2">⚡ Boosted</span>
                                    )}
                                    <h3 className="font-bold text-slate-900 dark:text-[#EFEEEA] text-sm group-hover:text-[#FE7743] overflow-hidden text-ellipsis line-clamp-2 transition mb-2">{job.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/40 mb-3 line-clamp-2">{job.description}</p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-[#FE7743] font-semibold">PKR {job.budgetMin?.toLocaleString()} – {job.budgetMax?.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-[#EFEEEA]/30 mt-1">{job.employer?.profile?.fullName || 'Employer'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 dark:bg-[#273F4F]/30 text-slate-600 dark:text-[#EFEEEA]/60">{job.jobType}</span>
                                            <p className="text-[10px] text-slate-400 dark:text-[#EFEEEA]/30 mt-1">{job._count?.applications || 0} applicants</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {total > 12 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).slice(0, 5).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${page === p ? 'bg-[#FE7743] text-white' : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-[#EFEEEA]/60 hover:bg-slate-300 dark:hover:bg-white/10'
                                    }`}>
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#000] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" /></div>}>
            <JobListContent />
        </Suspense>
    );
}

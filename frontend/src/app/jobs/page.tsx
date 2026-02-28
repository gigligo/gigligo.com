'use client';

import { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CATEGORIES = ['All', 'Web Development', 'Mobile Apps', 'Design', 'Data Science', 'Marketing', 'Writing', 'Video', 'Business', 'Other'];

function JobListContent() {
    const { data: session } = useSession();
    const role = (session as any)?.role;
    const isEmployer = ['BUYER', 'EMPLOYER', 'ADMIN'].includes(role);

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
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
            <Navbar />
            <main className="flex-1" style={{ paddingTop: 72 }}>

                {/* Hero */}
                <section className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            Search <span className="text-primary">Jobs</span>
                        </h1>
                        <p className="text-slate-500 text-base mb-8 max-w-lg">
                            {total} opportunities from top companies. Find the perfect role for your expertise.
                        </p>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                                <input
                                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search jobs by title or description..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-5 py-3.5 text-slate-900 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                                />
                            </div>
                            <button type="submit" className="h-[50px] px-7 bg-primary text-slate-900 text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
                                Search
                            </button>
                        </form>
                    </div>
                </section>

                {/* Category Filter */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-[72px] z-20">
                    <div className="max-w-6xl mx-auto px-6 md:px-12 flex gap-2 overflow-x-auto py-4 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${category === cat
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job List */}
                <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-32" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-28 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 text-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-4xl">work</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">No jobs found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
                                {(!session || isEmployer)
                                    ? "Get things done by posting your own project. Top freelancers are ready to help!"
                                    : "Check back later for new opportunities that match your skills."}
                            </p>
                            {(!session || isEmployer) && (
                                <Link href={session ? "/jobs/post" : "/register?role=BUYER"} className="inline-flex items-center justify-center h-12 px-8 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                    Post a Job Now
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job: any) => (
                                <Link key={job.id} href={`/jobs/${job.id}`} className="group block">
                                    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-200">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    {job.isBoosted && (
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs">bolt</span> Featured
                                                        </span>
                                                    )}
                                                    {job.employer?.paymentVerified && (
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">Payment Verified</span>
                                                    )}
                                                    {job.employer?.kycStatus === 'APPROVED' && (
                                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Identity Verified</span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>

                                                <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> {job.employer?.profile?.fullName || 'Employer'}</span>
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> {job._count?.applications || 0} applicants</span>
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {new Date(job.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="md:text-right shrink-0 flex flex-row md:flex-col items-center md:items-end gap-3">
                                                <div>
                                                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium block">Budget</span>
                                                    <span className="text-base font-bold text-primary tracking-tight">PKR {job.budgetMin?.toLocaleString()} – {job.budgetMax?.toLocaleString()}</span>
                                                </div>
                                                <span className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">{job.jobType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {total > 12 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).slice(0, 5).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${page === p ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
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

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <JobListContent />
        </Suspense>
    );
}

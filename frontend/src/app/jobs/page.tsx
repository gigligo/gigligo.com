'use client';

import { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

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
    hidden: { opacity: 0, x: -30, filter: "blur(10px)" },
    visible: {
        opacity: 1, x: 0, filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 25
        }
    }
};

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
        <div className="flex flex-col min-h-screen bg-white text-black font-inter selection:bg-primary/30 overflow-x-hidden">
            <Navbar />
            <main className="flex-1" style={{ paddingTop: 72 }}>

                {/* Editorial Hero - Massive Minimalist Search */}
                <section className="bg-white pt-32 pb-20 px-6">
                    <div className="max-w-5xl mx-auto flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full text-center"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a227] mb-8 block">
                                Open Mission Parameters
                            </span>

                            {/* Massive Underlined Search */}
                            <form onSubmit={handleSearch} className="relative w-full max-w-4xl mx-auto mb-16">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Find your next mission."
                                    className="w-full bg-transparent border-0 border-b-2 border-black/5 py-10 text-4xl md:text-7xl font-black text-black placeholder:text-black/5 outline-none focus:border-[#c9a227] transition-colors text-center"
                                />
                                <button type="submit" className="absolute right-0 bottom-4 md:bottom-10 group flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Submit</span>
                                    <span className="material-symbols-outlined text-3xl font-light text-text-muted hover:text-[#c9a227] transition-colors">arrow_right_alt</span>
                                </button>
                            </form>

                            <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.2em]">
                                {total} Active Objectives Deployed
                            </h2>
                        </motion.div>
                    </div>
                </section>

                {/* Editorial Filters */}
                <div className="border-b border-border-light/20 bg-white/80 backdrop-blur-xl sticky top-[72px] z-30 transition-all">
                    <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-10 overflow-x-auto py-6 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${category === cat
                                    ? 'text-[#c9a227]'
                                    : 'text-text-muted hover:text-black'
                                    }`}
                            >
                                {cat}
                                {category === cat && (
                                    <motion.div layoutId="jobUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a227] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Cards - Editorial Borderless */}
                <div className="max-w-4xl mx-auto px-6 py-24">
                    {loading ? (
                        <div className="space-y-12">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-black/2 rounded-[2rem] h-64" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 border-2 border-dashed border-border-light/40 rounded-[2.5rem]"
                        >
                            <span className="material-symbols-outlined text-6xl text-text-muted/20 mb-6">work_off</span>
                            <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tighter">No Missions Available</h3>
                            <p className="text-text-muted font-lora italic">Refine your strategic parameters or check back for new authorizations.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-12"
                        >
                            {jobs.map((job: any) => (
                                <motion.div key={job.id} variants={itemVariants}>
                                    <Link
                                        href={`/jobs/${job.id}`}
                                        className="group block relative bg-white hover:bg-[#fafafb] transition-all duration-500 rounded-[2rem] p-10 overflow-hidden"
                                    >
                                        {/* Vertical Gold Stake - The Stitch Hallmark */}
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#c9a227] opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-6">
                                                    {job.isBoosted && (
                                                        <span className="text-[9px] font-black text-white bg-[#c9a227] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                                            Top Priority
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] font-black text-[#c9a227] bg-[#c9a227]/5 px-4 py-1.5 rounded-full border border-[#c9a227]/10 uppercase tracking-[0.2em]">
                                                        {job.jobType}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest">{job.category}</span>
                                                </div>

                                                <h3 className="text-4xl md:text-5xl font-black text-black group-hover:text-primary transition-colors line-clamp-2 mb-6 tracking-tighter uppercase leading-[0.9]">
                                                    {job.title}
                                                </h3>

                                                <p className="text-lg text-text-muted font-lora italic leading-relaxed mb-10 max-w-3xl">
                                                    {job.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-10 border-t border-black/5 pt-10 mt-auto">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center border border-border-light group-hover:bg-[#c9a227] group-hover:text-white transition-all duration-500">
                                                            <span className="material-symbols-outlined text-2xl font-light">person</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] italic mb-0.5">Commander</span>
                                                            <span className="text-sm font-black uppercase tracking-tighter">{job.employer?.profile?.fullName || 'ANONYMOUS'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center border border-border-light group-hover:bg-[#c9a227] group-hover:text-white transition-all duration-500">
                                                            <span className="material-symbols-outlined text-2xl font-light">group</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] italic mb-0.5">Operatives</span>
                                                            <span className="text-sm font-black uppercase tracking-tighter">{job._count?.applications || 0} APPLIED</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:text-right shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-10">
                                                <div className="flex flex-col md:items-end">
                                                    <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-2 italic">Compensation</span>
                                                    <span className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">
                                                        {job.budgetMax?.toLocaleString()} <span className="text-sm block mt-1">PKR</span>
                                                    </span>
                                                </div>
                                                <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center text-text-muted translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700">
                                                    <span className="material-symbols-outlined text-3xl font-thin">arrow_outward</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Editorial Pagination */}
                    {total > 12 && (
                        <div className="flex justify-center gap-10 mt-32">
                            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).slice(0, 5).map(p => (
                                <button
                                    key={p} onClick={() => { setPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                    className={`text-xl font-black transition-all relative py-2 ${page === p
                                        ? 'text-[#c9a227]'
                                        : 'text-text-muted hover:text-black'
                                        }`}>
                                    {String(p).padStart(2, '0')}
                                    {page === p && (
                                        <motion.div layoutId="pageUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a227] rounded-full" />
                                    )}
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
        <Suspense fallback={<div className="min-h-screen bg-background-light flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <JobListContent />
        </Suspense>
    );
}

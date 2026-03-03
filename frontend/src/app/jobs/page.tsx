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
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white font-sans selection:bg-primary/30 overflow-x-hidden">
            <Navbar />
            <main className="flex-1" style={{ paddingTop: 72 }}>

                {/* Tactical Hero */}
                <section className="relative overflow-hidden bg-background-dark text-white pt-32 pb-48 px-6">
                    {/* Cinematic Shadows */}
                    <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[180px] pointer-events-none opacity-50" />

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
                                Operational Flow
                            </motion.div>
                            <h1 className="text-6xl md:text-[9.5rem] font-black tracking-tighter leading-[0.85] mb-12 uppercase italic">
                                Active <span className="text-primary not-italic">Intel.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/50 font-bold leading-tight mb-20 max-w-2xl mx-auto">
                                {total} high-priority mission objectives currently deployed. Secure your assignment today.
                            </p>

                            {/* Strategic Search Bar */}
                            <form onSubmit={handleSearch} className="group relative w-full max-w-3xl mx-auto">
                                <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-blue-600/50 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000" />
                                <div className="relative flex items-center bg-white/10 p-3 rounded-full border border-white/20 backdrop-blur-3xl shadow-2xl transition-all">
                                    <span className="material-symbols-outlined ml-6 text-white/30 text-3xl font-light group-hover:text-primary transition-colors">search</span>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="SEARCH MISSION PARAMETERS..."
                                        className="flex-1 bg-transparent border-none px-6 py-6 text-white placeholder:text-white/20 text-lg font-black uppercase tracking-widest outline-none"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="hidden md:flex h-[72px] px-14 bg-primary text-white text-sm font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary-dark shadow-2xl shadow-primary/40 items-center justify-center transition-all"
                                    >
                                        Deploy
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </section>

                {/* Vertical Filter Rails */}
                <div className="border-b border-border-light dark:border-white/10 bg-white/90 dark:bg-background-dark/95 backdrop-blur-2xl sticky top-[72px] z-30">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center gap-6 overflow-x-auto py-8 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <motion.button
                                whileHover={{ y: -3 }}
                                key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                                className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap shadow-sm ${category === cat
                                    ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-110'
                                    : 'bg-black/5 dark:bg-white/5 text-text-muted dark:text-white/40 hover:text-primary hover:bg-black/10 dark:hover:bg-white/10'
                                    }`}>
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Mission List */}
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-32">
                    {loading ? (
                        <div className="space-y-10">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-black/5 dark:bg-white/5 rounded-[4rem] border border-border-light dark:border-white/10 p-12 h-64" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-48 border border-dashed border-border-light dark:border-white/10 rounded-[4rem] bg-black/2 dark:bg-white/2 backdrop-blur-3xl"
                        >
                            <div className="w-32 h-32 bg-primary/10 text-primary rounded-4xl flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-inner">
                                <span className="material-symbols-outlined text-6xl font-light">work_off</span>
                            </div>
                            <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter">Zero Objectives</h3>
                            <p className="text-text-muted dark:text-white/50 max-w-sm mx-auto mb-16 text-xl font-bold leading-tight uppercase tracking-widest opacity-60">
                                {(!session || isEmployer)
                                    ? "Initiate a project sequence by deploying your first mission request."
                                    : "Mission data is restricted. Check back for future authorizations."}
                            </p>
                            {(!session || isEmployer) && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href={session ? "/jobs/post" : "/register?role=BUYER"} className="inline-flex items-center justify-center h-20 px-16 bg-primary text-white font-black rounded-full uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all text-sm">
                                        Initiate Mission
                                    </Link>
                                </motion.div>
                            )}
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
                                    <Link href={`/jobs/${job.id}`} className="group block">
                                        <div className="bg-white dark:bg-white/5 rounded-[4rem] border border-border-light dark:border-white/10 p-12 md:p-16 hover:border-primary transition-all duration-700 relative overflow-hidden shadow-2xl hover:shadow-primary/5 backdrop-blur-3xl">
                                            {/* Dynamic Scan Line Effect */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-10">
                                                        {job.isBoosted && (
                                                            <span className="text-[9px] font-black text-white bg-primary px-5 py-2 rounded-full uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl shadow-primary/40">
                                                                <span className="material-symbols-outlined text-xs">bolt</span> Featured Intel
                                                            </span>
                                                        )}
                                                        {job.employer?.paymentVerified && (
                                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20 uppercase tracking-[0.3em]">Capital Secured</span>
                                                        )}
                                                        <span className="text-[9px] font-black text-primary bg-primary/5 px-5 py-2 rounded-full border border-primary/20 uppercase tracking-[0.3em]">{job.jobType}</span>
                                                    </div>

                                                    <h3 className="text-4xl md:text-5xl font-black text-background-dark dark:text-white group-hover:text-primary transition-all line-clamp-1 mb-6 tracking-tighter uppercase grayscale group-hover:grayscale-0">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-xl text-text-muted dark:text-white/40 line-clamp-2 leading-tight mb-12 font-bold italic">{job.description}</p>

                                                    <div className="flex flex-wrap items-center gap-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-border-light dark:border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                                                <span className="material-symbols-outlined text-3xl font-light">account_circle</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-text-muted dark:text-white/20 uppercase tracking-[0.3em] mb-1">Commander</span>
                                                                <span className="text-sm font-black uppercase tracking-tighter">{job.employer?.profile?.fullName || 'ANONYMOUS'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-border-light dark:border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                                                <span className="material-symbols-outlined text-3xl font-light">group_add</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-text-muted dark:text-white/20 uppercase tracking-[0.3em] mb-1">Forces</span>
                                                                <span className="text-sm font-black uppercase tracking-tighter">{job._count?.applications || 0} OPERATIVES</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="md:text-right shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-8 border-t md:border-t-0 md:border-l border-border-light dark:border-white/5 pt-10 md:pt-0 md:pl-16">
                                                    <div className="flex flex-col md:items-end">
                                                        <span className="text-[10px] text-text-muted dark:text-white/30 uppercase tracking-[0.4em] font-black mb-2 italic">Compensation</span>
                                                        <span className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">
                                                            PKR {job.budgetMax?.toLocaleString()}
                                                            <span className="text-lg text-text-muted dark:text-white/30 block mt-1 font-bold">MAX INTEL</span>
                                                        </span>
                                                    </div>
                                                    <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-muted dark:text-white/20 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 border border-transparent group-hover:border-primary/20 shadow-2xl">
                                                        <span className="material-symbols-outlined text-4xl font-thin">arrow_outward</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Mission Cycles - Pagination */}
                    {total > 12 && (
                        <div className="flex justify-center gap-6 mt-32">
                            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).slice(0, 5).map(p => (
                                <motion.button
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    key={p} onClick={() => { setPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                    className={`w-16 h-16 rounded-3xl text-sm font-black transition-all duration-500 border ${page === p
                                        ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-125'
                                        : 'bg-white dark:bg-white/5 border-border-light dark:border-white/10 text-text-muted dark:text-white/40 hover:border-primary/50'}`}>
                                    {String(p).padStart(2, '0')}
                                </motion.button>
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
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <JobListContent />
        </Suspense>
    );
}

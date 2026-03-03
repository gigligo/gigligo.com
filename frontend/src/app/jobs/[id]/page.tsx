'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi, applicationApi, creditApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function JobDetailContent() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [proposedRate, setProposedRate] = useState('');
    const [timeline, setTimeline] = useState('');
    const [credits, setCredits] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE'].includes(role);

    useEffect(() => {
        const load = async () => {
            try {
                const j = await jobApi.get(id as string);
                setJob(j);
                if (token) {
                    const c = await creditApi.getBalance(token);
                    setCredits(c.credits);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [id, token]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplying(true);
        setError('');
        try {
            await applicationApi.apply(token, {
                jobId: id as string,
                coverLetter,
                proposedRate: proposedRate ? parseInt(proposedRate) : undefined,
                timeline: timeline || undefined,
            });
            setSuccess('MISSION SECURED. INTEL CONSUMED.');
            setShowApplyForm(false);
            setCredits(c => c - 1);
        } catch (e: any) {
            setError(e.message);
        }
        setApplying(false);
    };

    const handleDeleteJob = async () => {
        setDeleting(true);
        try {
            await jobApi.delete(token, id as string);
            router.push('/dashboard');
        } catch (e: any) {
            alert(e.message || 'Purge failed');
        }
        setDeleting(false);
        setDeleteModalOpen(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!job) return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark text-white font-black uppercase tracking-[0.5em]">
            Objective Obscured
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white font-sans selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Immersive Mission Hero */}
                <section className="relative overflow-hidden bg-background-dark text-white pt-48 pb-32 px-6">
                    <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[200px] pointer-events-none opacity-40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,124,255,0.1)_0%,transparent_50%)]" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/jobs" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-16">
                                <span className="material-symbols-outlined text-xl group-hover:-translate-x-3 transition-transform">arrow_back</span> Return to Operations
                            </Link>

                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <span className="px-6 py-2 bg-white/10 border border-white/20 backdrop-blur-3xl text-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-full">
                                    {job.category}
                                </span>
                                <span className="px-6 py-2 bg-white/5 border border-white/10 text-white/50 font-black text-[10px] uppercase tracking-[0.4em] rounded-full">
                                    {job.jobType}
                                </span>
                                {job.isBoosted && (
                                    <span className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs">bolt</span> High Priority
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                                <div>
                                    <h1 className="text-5xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.85] mb-12 uppercase italic">
                                        {job.title}
                                    </h1>
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl border border-white/20">
                                                {job.employer?.profile?.fullName?.[0] || 'E'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mb-1">Commander</span>
                                                <span className="text-sm font-black text-white uppercase tracking-tighter">{job.employer?.profile?.fullName || 'Anonymous Envoy'}</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-px bg-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mb-1">Base</span>
                                            <span className="text-sm font-black text-white uppercase tracking-tighter">{job.employer?.profile?.location || 'Pakistan Operations'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:text-right flex flex-col items-start lg:items-end gap-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mb-4">Tactical Allocation</span>
                                        <div className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                                            PKR {job.budgetMax?.toLocaleString()}
                                            <span className="block text-xl text-white/30 not-italic mt-2">MAX INTEL LIMIT</span>
                                        </div>
                                    </div>
                                    {job.employer?.paymentVerified && (
                                        <div className="flex items-center gap-3 px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full shadow-2xl shadow-emerald-500/10">
                                            <span className="material-symbols-outlined font-light">verified_user</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Capital Secured for Payout</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                        {/* Mission Briefing */}
                        <div className="lg:col-span-2 space-y-24">
                            <section>
                                <div className="flex items-center gap-6 mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Mission <span className="text-primary not-italic">Briefing.</span></h2>
                                    <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                                </div>
                                <div className="prose prose-xl prose-invert max-w-none text-text-muted dark:text-white/60 font-bold italic leading-relaxed whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-6 mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Required <span className="text-primary not-italic">Competencies.</span></h2>
                                    <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {job.tags?.map((tag: string) => (
                                        <span key={tag} className="px-10 py-4 bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full text-xs font-black uppercase tracking-[0.3em] text-text-muted dark:text-white/50 hover:border-primary/50 hover:text-primary transition-all duration-500 shadow-xl cursor-default">
                                            {tag}
                                        </span>
                                    )) || (
                                            <p className="text-text-muted dark:text-white/30 italic font-bold">Generalist talent required. Apply within.</p>
                                        )}
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 p-12 rounded-[3rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                                    <span className="material-symbols-outlined absolute top-8 right-8 text-primary opacity-5 group-hover:opacity-20 transition-all text-8xl font-thin">group</span>
                                    <span className="block text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">Operative Pool</span>
                                    <div className="text-7xl font-black tracking-tighter text-background-dark dark:text-white mb-2">{job._count?.applications || 0}</div>
                                    <span className="text-sm font-black text-text-muted dark:text-white/20 uppercase tracking-[0.3em]">ACTIVE APPLICATIONS</span>
                                </div>
                                <div className="bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/10 p-12 rounded-[3rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                                    <span className="material-symbols-outlined absolute top-8 right-8 text-primary opacity-5 group-hover:opacity-20 transition-all text-8xl font-thin">schedule</span>
                                    <span className="block text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">Deadlines</span>
                                    <div className="text-6xl font-black tracking-tighter text-background-dark dark:text-white mb-2 uppercase italic leading-none pt-4">
                                        {job.deadline ? new Date(job.deadline).toLocaleDateString('en-PK', { month: 'short', day: '2-digit' }) : 'OPEN'}
                                    </div>
                                    <span className="text-sm font-black text-text-muted dark:text-white/20 uppercase tracking-[0.3em]">MISSION EXPIRATION</span>
                                </div>
                            </div>
                        </div>

                        {/* Tactical Action Grid */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-10">
                                <div className="bg-white dark:bg-background-dark/80 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[4rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />

                                    {job.status !== 'OPEN' ? (
                                        <div className="text-center py-10">
                                            <span className="material-symbols-outlined text-6xl text-white/5 font-thin mb-6">lock</span>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Mission <span className="text-primary not-italic">Concluded.</span></h3>
                                            <p className="text-[10px] text-text-muted dark:text-white/30 font-black uppercase tracking-[0.4em] mt-6 leading-relaxed">This operational window is now closed to new applicants.</p>
                                        </div>
                                    ) : !session ? (
                                        <div className="space-y-10">
                                            <div className="text-center">
                                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Secure <span className="text-primary not-italic">Access.</span></h3>
                                                <p className="text-sm text-text-muted dark:text-white/40 font-bold italic uppercase tracking-widest leading-tight">Identity authentication required to view mission parameters.</p>
                                            </div>
                                            <div className="space-y-4">
                                                <Link href="/login" className="block">
                                                    <button className="w-full h-20 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-full text-xs shadow-2xl shadow-primary/30 transition-all">Authenticate Base</button>
                                                </Link>
                                                <Link href="/register?role=SELLER" className="block">
                                                    <button className="w-full h-20 bg-white dark:bg-white/5 border border-border-light dark:border-white/10 text-background-dark dark:text-white font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-all">New Identity</button>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : !isFreelancer ? (
                                        <div className="text-center py-10">
                                            <span className="material-symbols-outlined text-6xl text-primary/20 font-thin mb-6">admin_panel_settings</span>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Command <span className="text-primary not-italic">Restriction.</span></h3>
                                            <p className="text-[10px] text-text-muted dark:text-white/30 font-black uppercase tracking-[0.4em] mt-6 leading-relaxed">Only tactical operatives can apply to active missions.</p>
                                        </div>
                                    ) : success ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-10"
                                        >
                                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                                            </div>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic text-emerald-500">Mission <span className="not-italic">Acquired.</span></h3>
                                            <p className="text-[10px] text-text-muted dark:text-white/30 font-black uppercase tracking-[0.4em] mb-10">YOUR PROPOSAL HAS BEEN DEPLOYED TO COMMANDER.</p>
                                            <Link href="/dashboard/applications" className="text-[10px] font-black uppercase tracking-[0.5em] text-primary hover:tracking-[0.8em] transition-all duration-700">View Deployment Status →</Link>
                                        </motion.div>
                                    ) : !showApplyForm ? (
                                        <div className="space-y-12">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Capital Requirements</span>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-black uppercase tracking-tighter italic whitespace-nowrap">Intelligence Cost</span>
                                                    <span className="text-3xl font-black text-background-dark dark:text-white tracking-tighter">01 INTEL</span>
                                                </div>
                                                <span className="text-[9px] text-text-muted dark:text-white/20 font-black uppercase tracking-[0.4em] mt-2 italic">RESERVE REMAINING: {credits} UNIT</span>
                                            </div>

                                            {credits < 1 ? (
                                                <Link href="/dashboard/credits" className="block">
                                                    <button className="w-full h-24 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-[0.3em] rounded-full text-xs shadow-2xl shadow-red-500/20 transition-all">Insufficient Intel Reserve</button>
                                                </Link>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setShowApplyForm(true)}
                                                    className="w-full h-24 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-full text-sm shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-4"
                                                >
                                                    Acquire Objective <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                                                </motion.button>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApply} className="space-y-10">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter italic grayscale">Proposal <span className="text-primary not-italic">Sync.</span></h3>
                                                <button type="button" onClick={() => setShowApplyForm(false)} className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">Abort</button>
                                            </div>

                                            {error && <p className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20">{error}</p>}

                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] block mb-4 italic">Execution Strategy *</label>
                                                    <textarea
                                                        value={coverLetter}
                                                        onChange={e => setCoverLetter(e.target.value)}
                                                        required
                                                        rows={8}
                                                        placeholder="DETAIL YOUR TACTICAL ADVANTAGE AND APPROACH..."
                                                        className="w-full bg-black/30 border border-white/10 rounded-2xl p-8 text-white text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all resize-none italic"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] block mb-4 italic">Requested Allocation (PKR)</label>
                                                    <input
                                                        type="number"
                                                        value={proposedRate}
                                                        onChange={e => setProposedRate(e.target.value)}
                                                        placeholder="PKR 0.00"
                                                        className="w-full h-20 bg-black/30 border border-white/10 rounded-2xl px-8 text-white text-xl font-black placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all uppercase tracking-tighter"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] block mb-4 italic">Engagement Window</label>
                                                    <input
                                                        type="text"
                                                        value={timeline}
                                                        onChange={e => setTimeline(e.target.value)}
                                                        placeholder="E.G. 14 DAYS"
                                                        className="w-full h-20 bg-black/30 border border-white/10 rounded-2xl px-8 text-white text-sm font-black placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all uppercase tracking-widest"
                                                    />
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={applying || !coverLetter}
                                                className="w-full h-24 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-full text-sm shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50"
                                            >
                                                {applying ? 'INITIALIZING...' : 'Deploy Proposal'}
                                            </motion.button>
                                        </form>
                                    )}

                                    {session && (session as any)?.user?.id === job.employerId && (
                                        <div className="mt-10 border-t border-white/5 pt-10">
                                            <button
                                                onClick={() => setDeleteModalOpen(true)}
                                                className="w-full h-20 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                            >
                                                Terminate Objective
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white/5 border border-white/5 p-10 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl text-center flex flex-col items-center">
                                    <span className="material-symbols-outlined text-primary text-6xl font-thin mb-6">shield</span>
                                    <h4 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Security <span className="text-primary not-italic">Assurance.</span></h4>
                                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] leading-normal opacity-60">
                                        All tactical applications are processed through encrypted channels with full intellectual protection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {deleteModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute inset-0 bg-background-dark/80 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-background-dark border border-white/10 p-12 md:p-16 rounded-[4rem] w-full max-w-xl relative z-10 shadow-2xl text-center"
                        >
                            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-red-500/20">
                                <span className="material-symbols-outlined text-5xl font-light">warning</span>
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 italic">Abort <span className="text-red-500 not-italic">Mission.</span></h2>
                            <p className="text-xl text-white/50 font-bold italic mb-12 leading-tight">
                                Termination current operational objective. All associated intelligence will be archived and hidden from the grid.
                            </p>
                            <div className="flex flex-col md:flex-row gap-6">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 h-20 bg-white/5 text-white/40 font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-white/10 transition-all border border-transparent"
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteJob}
                                    disabled={deleting}
                                    className="flex-1 h-20 bg-red-500 text-white font-black uppercase tracking-[0.2em] rounded-full text-xs shadow-2xl shadow-red-500/30 hover:bg-red-600 transition-all"
                                >
                                    {deleting ? 'TERMINATING...' : 'EXECUTE ABORT'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

export default function JobDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <JobDetailContent />
        </Suspense>
    );
}

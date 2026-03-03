'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { applicationApi, jobApi, chatApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ChevronLeft,
    MessageSquare,
    UserCheck,
    XCircle,
    Clock,
    Target,
    ShieldCheck,
    Briefcase,
    FileText,
    History,
    MoreVertical,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

function ApplicationsContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');

    const [applications, setApplications] = useState<any[]>([]);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isEmployer = ['BUYER', 'EMPLOYER'].includes(role);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        const load = async () => {
            try {
                if (isEmployer) {
                    if (!jobId) { router.push('/dashboard'); return; }
                    const [apps, job] = await Promise.all([
                        applicationApi.getForJob(token, jobId),
                        jobApi.get(jobId),
                    ]);
                    setApplications(apps);
                    setJobDetails(job);
                } else {
                    const apps = await applicationApi.getMine(token);
                    setApplications(apps);
                }
            } catch (e) {
                console.error(e);
                toast.error("Failed to synchronize mission data.");
            }
            setLoading(false);
        };
        load();
    }, [status, token, jobId, isEmployer, router]);

    const handleAction = async (appId: string, action: 'hire' | 'shortlist' | 'reject' | 'withdraw') => {
        setActionLoading(appId);
        try {
            if (action === 'hire') await applicationApi.hire(token, appId);
            if (action === 'shortlist') await applicationApi.shortlist(token, appId);
            if (action === 'reject') await applicationApi.reject(token, appId);
            if (action === 'withdraw') await applicationApi.withdraw(token, appId);

            setApplications(apps => apps.map(app => {
                if (app.id === appId) {
                    const statusMap = { hire: 'HIRED', shortlist: 'SHORTLISTED', reject: 'REJECTED', withdraw: 'WITHDRAWN' };
                    return { ...app, status: statusMap[action] };
                }
                return app;
            }));
            toast.success(`Protocol ${action.toUpperCase()} executed.`);
        } catch (e) {
            toast.error((e as Error).message);
        }
        setActionLoading(null);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Tactical Header */}
                <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                    <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors mb-12">
                                <span className="material-symbols-outlined text-xl group-hover:-translate-x-3 transition-transform">arrow_back</span> Dashboard
                            </Link>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                <div className="space-y-6">
                                    <h1 className="text-5xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.8] uppercase italic">
                                        {isEmployer ? "Candidate " : "Mission "} <span className="text-primary not-italic">Protocols.</span>
                                    </h1>
                                    <p className="text-xl md:text-2xl font-bold italic text-white/40 max-w-2xl leading-relaxed">
                                        {isEmployer
                                            ? `Orchestrate high-stakes talent acquisition for "${jobDetails?.title || 'Active Project'}" with precision.`
                                            : "Track your active deployments and authorization status across the global network."}
                                    </p>
                                </div>

                                <div className="flex gap-6">
                                    <div className="bg-white/5 border border-white/10 rounded-3xl px-10 py-6 flex flex-col gap-2 min-w-[140px] shadow-2xl backdrop-blur-3xl">
                                        <Clock className="text-primary" size={24} />
                                        <div>
                                            <p className="text-4xl font-black text-white italic tracking-tighter">{applications.length}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black mt-1">Pending Sync</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Engagement Grid */}
                <div className="max-w-[1440px] mx-auto px-10 md:px-20 py-24">
                    {applications.length === 0 ? (
                        <div className="text-center py-48 bg-white/2 border border-white/5 rounded-[4rem] flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-9xl text-white/5 mb-8 font-thin">grid_view</span>
                            <h3 className="text-2xl font-black text-white/20 uppercase tracking-[0.5em] italic text-center">No active protocols detected.</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-10">
                            <AnimatePresence>
                                {applications.map((app: any, idx) => (
                                    <ApplicationCard
                                        key={app.id}
                                        app={app}
                                        isEmployer={isEmployer}
                                        token={token}
                                        index={idx}
                                        onAction={handleAction}
                                        actionLoading={actionLoading}
                                        session={session}
                                        router={router}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function ApplicationCard({ app, isEmployer, token, index, onAction, actionLoading, session, router }: any) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`bg-white/2 border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-700 backdrop-blur-3xl hover:border-primary/30 group ${isExpanded ? 'ring-1 ring-primary/20 shadow-[0_0_50px_rgba(0,124,255,0.1)]' : 'shadow-2xl'}`}
        >
            <div
                className="p-10 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-10">
                    <div className="flex items-start lg:items-center gap-10 flex-1">
                        {isEmployer ? (
                            <div className="relative">
                                <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-primary font-black text-3xl italic shadow-2xl group-hover:border-primary/50 transition-colors">
                                    {app.freelancer?.profile?.fullName?.[0] || 'U'}
                                </div>
                                {app.freelancer?.profile?.sellerLevel === 'TOP_RATED' && (
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-background-dark shadow-xl">
                                        <span className="material-symbols-outlined text-white text-[14px]">workspace_premium</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors shadow-black shadow-2xl">
                                <Target className="text-primary" size={32} />
                            </div>
                        )}

                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">
                                    {isEmployer ? app.freelancer?.profile?.fullName : app.job.title}
                                </h3>
                                <StatusBadge status={app.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-10 text-[10px] uppercase font-black tracking-[0.4em] text-white/20 italic">
                                <span className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg font-light">account_balance_wallet</span>
                                    PKR {app.proposedRate?.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg font-light">schedule</span>
                                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                                </span>
                                {!isEmployer && (
                                    <span className="flex items-center gap-3 text-primary">
                                        <span className="material-symbols-outlined text-lg font-light">business</span>
                                        {app.job.employer?.profile?.fullName || 'Strategic Partner'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <span className={`material-symbols-outlined text-white/20 text-4xl font-thin transition-transform duration-700 hidden lg:block ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                            keyboard_arrow_down
                        </span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="border-t border-white/5 bg-black/40 overflow-hidden"
                    >
                        <div className="p-12 lg:p-16 space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] flex items-center gap-4 italic">
                                        <FileText size={18} />
                                        Mission Statement
                                    </h4>
                                    <div className="bg-white/1 border border-white/5 rounded-2xl p-10 relative">
                                        <p className="text-xl font-bold italic text-white/60 leading-relaxed whitespace-pre-wrap">
                                            "{app.coverLetter}"
                                        </p>
                                        <div className="absolute top-6 right-6 opacity-10">
                                            <span className="material-symbols-outlined text-6xl">format_quote</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-white/1 border border-white/5 rounded-2xl p-10 space-y-8">
                                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">Deployment Intel</h4>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2">TIMELINE</p>
                                                <p className="text-xl font-black text-white italic">{app.timeline || 'Unspecified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2">RATE PKT</p>
                                                <p className="text-xl font-black text-white italic">PKR {app.proposedRate?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Hub */}
                                    <div className="flex flex-wrap gap-6">
                                        {isEmployer && ['PENDING', 'SHORTLISTED'].includes(app.status) && (
                                            <>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            const myId = (session as any)?.user?.id;
                                                            const res: any = await chatApi.findOrCreate(token, app.freelancer.id, myId, undefined, app.jobId);
                                                            const convId = res?.data?.id || res?.id;
                                                            if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                        } catch (error) { toast.error("Communication failure."); }
                                                    }}
                                                    className="h-16 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4 italic"
                                                >
                                                    <MessageSquare size={18} />
                                                    INITIATE COMMS
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onAction(app.id, 'hire'); }}
                                                    className="h-16 px-10 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center gap-4 italic active:scale-95"
                                                >
                                                    <UserCheck size={18} />
                                                    AUTHORIZE HIRE
                                                </button>
                                                {app.status === 'PENDING' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onAction(app.id, 'shortlist'); }}
                                                        className="h-16 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center gap-4 italic"
                                                    >
                                                        SHORTLIST OPERATIVE
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onAction(app.id, 'reject'); }}
                                                    className="h-16 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all flex items-center gap-4 italic"
                                                >
                                                    DECLINE PROTOCOL
                                                </button>
                                            </>
                                        )}
                                        {!isEmployer && app.status === 'PENDING' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onAction(app.id, 'withdraw'); }}
                                                className="h-16 px-10 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 flex items-center gap-4 italic active:scale-95"
                                            >
                                                <XCircle size={18} />
                                                WITHDRAW MISSION
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; color: string; icon: any }> = {
        PENDING: { label: 'In Review', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock },
        SHORTLISTED: { label: 'Strategic Priority', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Target },
        HIRED: { label: 'Active Deployment', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
        REJECTED: { label: 'Discontinued', color: 'text-white/20 bg-white/5 border-white/10', icon: XCircle },
        WITHDRAWN: { label: 'Archived', color: 'text-white/20 bg-white/5 border-white/10', icon: History },
    };

    const cfg = config[status] || config.PENDING;
    const Icon = cfg.icon;

    return (
        <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-[0.4em] rounded-full border flex items-center gap-3 ${cfg.color} italic shadow-lg`}>
            <Icon size={12} strokeWidth={3} />
            {cfg.label}
        </span>
    );
}

function Loader2() {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic animate-pulse">Synchronizing Tactical Data...</p>
        </div>
    );
}

export default function ApplicationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark flex items-center justify-center"><Loader2 /></div>}>
            <ApplicationsContent />
        </Suspense>
    );
}

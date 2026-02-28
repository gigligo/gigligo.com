'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { applicationApi, jobApi, chatApi } from '@/lib/api';
import Link from 'next/link';

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
            } catch (e) { console.error(e); }
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
        } catch (e) { alert((e as Error).message); }
        setActionLoading(null);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 96 }}>
                {/* Editorial Header */}
                <div className="bg-slate-900 text-white py-16 md:py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute top-0 right-0 w-72 h-72 border border-white/20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    </div>
                    <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                        <Link href="/dashboard" className="text-xs text-white/30 hover:text-primary transition mb-6 inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
                        </Link>
                        {isEmployer ? (
                            <>
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                                    Active <span className="text-primary">Projects.</span>
                                </h1>
                                <p className="text-white/40 text-lg max-w-lg">
                                    Orchestrate your high-stakes initiatives with precision and elegance.
                                </p>
                                {jobDetails && (
                                    <div className="mt-6 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                                        <span className="material-symbols-outlined text-primary text-xl">work</span>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{jobDetails.title}</p>
                                            <p className="text-white/30 text-xs">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                                    My <span className="text-primary">Applications</span>
                                </h1>
                                <p className="text-white/40 text-lg">Track the status of jobs you&apos;ve applied to.</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Applications List */}
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                    {applications.length === 0 ? (
                        <div className="text-center py-24 border border-border-light rounded-2xl bg-surface-light">
                            <span className="material-symbols-outlined text-5xl text-text-muted/20 mb-4">folder_open</span>
                            <h3 className="text-xl font-bold text-text-main mb-2">No applications yet</h3>
                            <p className="text-text-muted text-sm">
                                {isEmployer ? 'No applicants yet for this job.' : 'You haven\'t applied to any jobs yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app: any) => (
                                <div key={app.id} className="bg-surface-light border border-border-light rounded-xl overflow-hidden hover:border-primary/20 transition-colors group">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                {isEmployer ? (
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-primary font-bold text-lg ring-2 ring-primary/20">
                                                            {app.freelancer?.profile?.fullName?.[0] || 'U'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-text-main text-lg">{app.freelancer?.profile?.fullName || 'Freelancer'}</h3>
                                                                {(app.freelancer?.isFoundingMember || app.freelancer?.role === 'PRO' || app.freelancer?.profile?.sellerLevel === 'TOP_RATED') && (
                                                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-linear-to-r from-amber-400 to-yellow-600 text-white rounded-md font-bold text-[10px] shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                                                                        <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                                                                        <span>{app.freelancer?.isFoundingMember ? 'Founding PRO' : 'PRO'}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-text-muted">
                                                                {app.freelancer?.profile?.skills?.[0] || 'Professional'} • {app.proposedRate ? `PKR ${app.proposedRate.toLocaleString()}` : 'Standard Rate'}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={app.status} />
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between items-start border-b border-border-light pb-4 mb-4">
                                                        <div>
                                                            <Link href={`/jobs/${app.job.id}`} className="font-bold text-text-main text-lg hover:text-primary transition">{app.job.title}</Link>
                                                            <p className="text-xs text-text-muted mt-1">
                                                                {app.job.employer?.profile?.fullName || 'Employer'} • {app.proposedRate ? `Proposed: PKR ${app.proposedRate.toLocaleString()}` : 'Standard Rate'}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={app.status} />
                                                    </div>
                                                )}

                                                {/* Cover Letter */}
                                                <div className="bg-background-light rounded-xl p-5 border border-border-light">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Cover Letter</p>
                                                        {app.timeline && (
                                                            <span className="text-xs text-primary font-semibold bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                                                Timeline: {app.timeline}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-text-muted whitespace-pre-wrap leading-relaxed">{app.coverLetter}</p>
                                                </div>
                                                <p className="text-[10px] text-text-muted/50 mt-3">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="md:w-48 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-border-light pt-4 md:pt-0 md:pl-6">
                                                {isEmployer && ['PENDING', 'SHORTLISTED'].includes(app.status) && (
                                                    <>
                                                        <button onClick={async () => {
                                                            try {
                                                                setActionLoading(app.id);
                                                                const myId = (session as any)?.user?.id;
                                                                const res: any = await chatApi.findOrCreate(token, app.freelancer.id, myId, undefined, app.jobId);
                                                                const convId = res?.data?.id || res?.id;
                                                                if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                            } catch (error) { console.error("Failed to start chat", error); }
                                                            finally { setActionLoading(null); }
                                                        }} disabled={!!actionLoading}
                                                            className="w-full py-2.5 bg-background-light border border-border-light text-text-main font-semibold rounded-lg text-xs hover:border-primary/30 transition disabled:opacity-50">
                                                            {actionLoading === app.id ? '...' : 'Message'}
                                                        </button>
                                                        <button onClick={() => handleAction(app.id, 'hire')} disabled={!!actionLoading}
                                                            className="w-full py-2.5 bg-green-50 text-green-700 border border-green-200 font-semibold rounded-lg text-xs hover:bg-green-100 transition disabled:opacity-50">
                                                            {actionLoading === app.id ? '...' : 'Hire Candidate'}
                                                        </button>
                                                        {app.status === 'PENDING' && (
                                                            <button onClick={() => handleAction(app.id, 'shortlist')} disabled={!!actionLoading}
                                                                className="w-full py-2.5 bg-blue-50 text-blue-700 border border-blue-200 font-semibold rounded-lg text-xs hover:bg-blue-100 transition disabled:opacity-50">
                                                                Shortlist
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleAction(app.id, 'reject')} disabled={!!actionLoading}
                                                            className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 font-semibold rounded-lg text-xs hover:bg-red-100 transition disabled:opacity-50">
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                {!isEmployer && app.status === 'PENDING' && (
                                                    <button onClick={() => handleAction(app.id, 'withdraw')} disabled={!!actionLoading}
                                                        className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 font-semibold rounded-lg text-xs hover:bg-red-100 transition disabled:opacity-50">
                                                        {actionLoading === app.id ? '...' : 'Withdraw Application'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ApplicationsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ApplicationsContent />
        </Suspense>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
        SHORTLISTED: 'bg-blue-50 text-blue-700 border-blue-200',
        HIRED: 'bg-green-50 text-green-700 border-green-200',
        REJECTED: 'bg-red-50 text-red-700 border-red-200',
        WITHDRAWN: 'bg-slate-100 text-slate-500 border-slate-200',
    };
    return (
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${colors[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            {status}
        </span>
    );
}

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
                    if (!jobId) {
                        router.push('/dashboard');
                        return;
                    }
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

            // Refresh list inline
            setApplications(apps => apps.map(app => {
                if (app.id === appId) {
                    const statusMap = { hire: 'HIRED', shortlist: 'SHORTLISTED', reject: 'REJECTED', withdraw: 'WITHDRAWN' };
                    return { ...app, status: statusMap[action] };
                }
                return app;
            }));
        } catch (e) {
            alert((e as Error).message);
        }
        setActionLoading(null);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#000]">
            <Navbar />
            <main className="flex-1 max-w-[1000px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <Link href="/dashboard" className="text-xs text-[#EFEEEA]/40 hover:text-[#FE7743] transition mb-6 inline-block">← Dashboard</Link>

                {isEmployer ? (
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#EFEEEA]">Review Applicants</h1>
                        <p className="text-[#EFEEEA]/50 text-sm mt-1">
                            For job: <Link href={`/jobs/${jobId}`} className="text-[#FE7743] hover:underline font-semibold">{jobDetails?.title}</Link>
                        </p>
                    </div>
                ) : (
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#EFEEEA]">My Applications</h1>
                        <p className="text-[#EFEEEA]/50 text-sm mt-1">Track the status of jobs you've applied to.</p>
                    </div>
                )}

                <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                    {applications.length === 0 ? (
                        <div className="p-12 text-center text-[#EFEEEA]/40">
                            {isEmployer ? 'No applicants yet for this job.' : 'You haven\'t applied to any jobs yet.'}
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {applications.map((app: any) => (
                                <div key={app.id} className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            {isEmployer ? (
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#EFEEEA] font-bold">
                                                        {app.freelancer?.profile?.fullName?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#EFEEEA]">{app.freelancer?.profile?.fullName || 'Freelancer'}</h3>
                                                        <p className="text-xs text-[#EFEEEA]/50">
                                                            {app.freelancer?.profile?.skills?.[0] || 'Professional'} • {app.proposedRate ? `PKR ${app.proposedRate.toLocaleString()}` : 'Standard Rate'}
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto"><StatusBadge status={app.status} /></div>
                                                </div>
                                            ) : (
                                                <div className="mb-3 flex justify-between items-start border-b border-white/5 pb-3">
                                                    <div>
                                                        <Link href={`/jobs/${app.job.id}`} className="font-bold text-[#EFEEEA] hover:text-[#FE7743] transition">{app.job.title}</Link>
                                                        <p className="text-xs text-[#EFEEEA]/50 mt-1">
                                                            {app.job.employer?.profile?.fullName || 'Employer'} • {app.proposedRate ? `Proposed: PKR ${app.proposedRate.toLocaleString()}` : 'Standard Rate'}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={app.status} />
                                                </div>
                                            )}

                                            <div className="bg-black/30 rounded-xl p-4 mt-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-xs text-[#EFEEEA]/40 uppercase tracking-widest font-semibold">Cover Letter</p>
                                                    {app.timeline && (
                                                        <p className="text-xs text-[#FE7743] font-semibold bg-[#FE7743]/10 px-2 py-1 rounded">
                                                            Timeline: {app.timeline}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[#EFEEEA]/70 whitespace-pre-wrap">{app.coverLetter}</p>
                                            </div>
                                            <p className="text-[10px] text-[#EFEEEA]/30 mt-3">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:w-48 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                            {isEmployer && ['PENDING', 'SHORTLISTED'].includes(app.status) && (
                                                <>
                                                    <button onClick={async () => {
                                                        try {
                                                            setActionLoading(app.id);
                                                            const myId = (session as any)?.user?.id;
                                                            const res: any = await chatApi.findOrCreate(token, app.freelancer.id, myId, undefined, app.jobId);
                                                            const convId = res?.data?.id || res?.id;
                                                            if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                        } catch (error) {
                                                            console.error("Failed to start chat", error);
                                                        } finally {
                                                            setActionLoading(null);
                                                        }
                                                    }} disabled={!!actionLoading}
                                                        className="w-full py-2 bg-white/5 border border-white/10 text-white font-semibold rounded-lg text-xs hover:bg-white/10 transition disabled:opacity-50">
                                                        {actionLoading === app.id ? '...' : 'Message'}
                                                    </button>
                                                    <button onClick={() => handleAction(app.id, 'hire')} disabled={!!actionLoading}
                                                        className="w-full py-2 bg-[#22c55e]/20 text-[#22c55e] font-semibold rounded-lg text-xs hover:bg-[#22c55e]/30 transition disabled:opacity-50">
                                                        {actionLoading === app.id ? '...' : 'Hire Candidate'}
                                                    </button>
                                                    {app.status === 'PENDING' && (
                                                        <button onClick={() => handleAction(app.id, 'shortlist')} disabled={!!actionLoading}
                                                            className="w-full py-2 bg-blue-500/20 text-blue-400 font-semibold rounded-lg text-xs hover:bg-blue-500/30 transition disabled:opacity-50">
                                                            Shortlist
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleAction(app.id, 'reject')} disabled={!!actionLoading}
                                                        className="w-full py-2 bg-red-500/10 text-red-400 font-semibold rounded-lg text-xs hover:bg-red-500/20 transition disabled:opacity-50">
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            {!isEmployer && app.status === 'PENDING' && (
                                                <button onClick={() => handleAction(app.id, 'withdraw')} disabled={!!actionLoading}
                                                    className="w-full py-2 bg-red-500/10 text-red-400 font-semibold rounded-lg text-xs hover:bg-red-500/20 transition disabled:opacity-50">
                                                    {actionLoading === app.id ? '...' : 'Withdraw Application'}
                                                </button>
                                            )}
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
            <div className="min-h-screen bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ApplicationsContent />
        </Suspense>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        SHORTLISTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        HIRED: 'bg-green-500/10 text-green-400 border-green-500/20',
        REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
        WITHDRAWN: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            {status}
        </span>
    );
}

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';
import { creditApi, walletApi, applicationApi, jobApi, orderApi, disputeApi, reviewApi, analyticsApi, userStateApi } from '@/lib/api';
import Link from 'next/link';
import { Loader2, Star, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const [credits, setCredits] = useState(0);
    const [wallet, setWallet] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [myGigs, setMyGigs] = useState<any[]>([]);
    const [purchasedGigs, setPurchasedGigs] = useState<any[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [disputeTarget, setDisputeTarget] = useState<{ id: string, type: 'order' | 'job' } | null>(null);
    const [disputeReason, setDisputeReason] = useState('');
    const [submittingDispute, setSubmittingDispute] = useState(false);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const [analytics, setAnalytics] = useState<any[]>([]);

    // ── Live Centralized State from backend (not from cached JWT) ──
    const [userState, setUserState] = useState<any>(null);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE'].includes(role);
    const isEmployer = ['BUYER', 'EMPLOYER'].includes(role);

    // Fetch fresh user state from backend on every page load
    useEffect(() => {
        if (!token || !isFreelancer) return;
        userStateApi.getState(token)
            .then((data: any) => {
                setUserState(data);
                const freshStatus = data?.kycStatus || 'UNVERIFIED';
                // If approved, update the NextAuth session so future navigations use the fresh status
                if (freshStatus === 'APPROVED' && (session as any)?.kycStatus !== 'APPROVED') {
                    updateSession({ kycStatus: 'APPROVED' });
                }
            })
            .catch(() => {
                // Fallback to session value if backend call fails
                setUserState({ kycStatus: (session as any)?.kycStatus || 'UNVERIFIED' });
            });
    }, [token, isFreelancer]);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        const load = async () => {
            try {
                const [creditRes, walletRes] = await Promise.all([
                    creditApi.getBalance(token),
                    walletApi.getBalance(token),
                ]);
                setCredits(creditRes.credits);
                setWallet(walletRes);

                if (isFreelancer) {
                    const [apps, sales, stats, recs] = await Promise.all([
                        applicationApi.getMine(token),
                        orderApi.getMySales(token),
                        analyticsApi.getFreelancerStats(token),
                        jobApi.getRecommended(token)
                    ]);
                    setApplications(apps);
                    setMyGigs(sales);
                    setAnalytics(stats);
                    setRecommendedJobs(recs || []);
                }
                if (isEmployer) {
                    const [jobs, purchases] = await Promise.all([
                        jobApi.getMyJobs(token),
                        orderApi.getMyPurchases(token)
                    ]);
                    setMyJobs(jobs);
                    setPurchasedGigs(purchases);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token]);

    const handleOpenDispute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!disputeTarget || !disputeReason.trim() || !token) return;
        setSubmittingDispute(true);
        try {
            const payload = disputeTarget.type === 'order'
                ? { orderId: disputeTarget.id, reason: disputeReason }
                : { jobId: disputeTarget.id, reason: disputeReason };
            await disputeApi.create(token, payload);
            alert('Dispute opened successfully. An admin will review it shortly.');
            setDisputeModalOpen(false);
            setDisputeReason('');
            window.location.reload();
        } catch (err: any) {
            alert(err?.message || 'Failed to open dispute');
        } finally {
            setSubmittingDispute(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewTarget || !token) return;
        setSubmittingReview(true);
        try {
            await reviewApi.submit(token, {
                orderId: reviewTarget,
                rating: reviewRating,
                comment: reviewComment
            });
            alert('Review submitted successfully!');
            setReviewModalOpen(false);
            setReviewComment('');
            window.location.reload();
        } catch (err: any) {
            alert(err?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const pendingApps = applications.filter(a => a.status === 'PENDING').length;
    const hiredApps = applications.filter(a => a.status === 'HIRED').length;
    const totalApplicants = myJobs.reduce((sum: number, j: any) => sum + (j._count?.applications || 0), 0);

    // Use live backend KYC status instead of cached JWT value
    const kycStatus = userState?.kycStatus || (session as any)?.kycStatus || 'UNVERIFIED';
    const showKycBlocker = isFreelancer && kycStatus !== 'APPROVED';
    const stateLoading = isFreelancer && userState === null;

    if (stateLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (showKycBlocker) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Required</h2>

                        {kycStatus === 'UNVERIFIED' || kycStatus === 'REJECTED' ? (
                            <>
                                <p className="text-slate-400 mb-8">
                                    {kycStatus === 'REJECTED'
                                        ? "Your previous verification attempt was rejected. Please submit clear, valid documents."
                                        : "To protect our community, all freelancers must complete Identity Verification (KYC) before accessing the dashboard or applying to jobs."}
                                </p>
                                <Link href="/dashboard/kyc" className="inline-block w-full py-3 px-6 bg-[#FE7743] hover:bg-[#FE7743]/90 text-white font-bold rounded-xl transition shadow-lg shadow-[#FE7743]/20">
                                    Complete Verification Now
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-slate-600 dark:text-slate-400 mb-8">
                                    Your documents have been received and are currently under review by our moderation team. You will be able to access the platform once approved.
                                </p>
                                <button disabled className="w-full py-3 px-6 bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                                    Review Pending...
                                </button>
                            </>
                        )}
                        <button onClick={() => router.push('/')} className="mt-4 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                            Return to Homepage
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <GlobalErrorBoundary>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000]">
                <Navbar />
                <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA]">Dashboard</h1>
                            <p className="text-slate-600 dark:text-[#EFEEEA]/50 text-sm mt-1">
                                {isFreelancer ? 'Manage your applications & earnings' : 'Manage your job postings & hires'}
                            </p>
                        </div>
                        {isFreelancer ? (
                            <Link href="/jobs" className="px-5 py-2.5 bg-[#FE7743] text-white font-semibold rounded-lg text-sm hover:bg-[#FE7743]/90 transition">
                                Browse Jobs →
                            </Link>
                        ) : (
                            <Link href="/jobs/post" className="px-5 py-2.5 bg-[#273F4F] text-[#EFEEEA] font-semibold rounded-lg text-sm hover:bg-[#273F4F]/80 transition">
                                Post a Job →
                            </Link>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {isFreelancer ? (
                            <>
                                <StatCard label="Credits" value={credits.toString()} accent="#FE7743" link="/dashboard/credits" />
                                <StatCard label="Applications" value={applications.length.toString()} accent="#273F4F" />
                                <StatCard label="Pending" value={pendingApps.toString()} accent="#FE7743" />
                                <StatCard label="Hired" value={hiredApps.toString()} accent="#22c55e" />
                            </>
                        ) : (
                            <>
                                <StatCard label="Jobs Posted" value={myJobs.length.toString()} accent="#273F4F" />
                                <StatCard label="Open Jobs" value={myJobs.filter(j => j.status === 'OPEN').length.toString()} accent="#FE7743" />
                                <StatCard label="Total Applicants" value={totalApplicants.toString()} accent="#273F4F" />
                                <StatCard label="Filled" value={myJobs.filter(j => j.status === 'FILLED').length.toString()} accent="#22c55e" />
                            </>
                        )}
                    </div>

                    {/* Wallet */}
                    {wallet && (
                        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-8 shadow-sm dark:shadow-none">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider font-semibold mb-1">Wallet Balance</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA]">PKR {wallet.balancePKR?.toLocaleString() || '0'}</p>
                                    {wallet.pendingPKR > 0 && (
                                        <p className="text-xs text-[#FE7743] mt-1">PKR {wallet.pendingPKR.toLocaleString()} pending withdrawal</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    {isFreelancer && (
                                        <Link href="/dashboard/earnings" className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#EFEEEA] rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition">
                                            Earnings →
                                        </Link>
                                    )}
                                    <Link href="/dashboard/credits" className="px-4 py-2 bg-[#FE7743] text-white rounded-lg text-sm font-semibold hover:bg-[#FE7743]/90 transition">
                                        Buy Credits
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-6">
                            {isFreelancer ? (
                                <>
                                    {/* Performance Overview Chart */}
                                    {analytics.length > 0 && (
                                        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 mb-6 shadow-sm dark:shadow-none">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA] mb-6">Performance Overview (30 Days)</h3>
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={analytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#FE7743" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#FE7743" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="date" stroke="#EFEEEA50" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                                        <YAxis stroke="#EFEEEA50" fontSize={10} />
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#EFEEEA10" vertical={false} />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#EFEEEA', borderRadius: '8px' }}
                                                            itemStyle={{ color: '#EFEEEA' }}
                                                        />
                                                        <Area type="monotone" dataKey="earnings" stroke="#FE7743" fillOpacity={1} fill="url(#colorEarnings)" name="Earnings (PKR)" />
                                                        <Area type="monotone" dataKey="orders" stroke="#22c55e" fillOpacity={1} fill="url(#colorOrders)" name="Completed Orders" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommended for You (AI Matching) */}
                                    <div className="bg-linear-to-br from-[#FE7743]/10 to-transparent p-6 rounded-2xl border border-[#FE7743]/20 mb-6 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 text-[#FE7743]/5 rotate-12">
                                            <Star size={120} fill="currentColor" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 dark:text-[#EFEEEA] flex items-center gap-2">
                                                        <Sparkles className="w-5 h-5 text-[#FE7743]" /> Recommended for You
                                                    </h2>
                                                    <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/50 mt-1">AI matched based on your skills and rate</p>
                                                </div>
                                            </div>

                                            {recommendedJobs.length === 0 ? (
                                                <p className="text-sm text-slate-500 dark:text-[#EFEEEA]/50">Update your profile skills to see AI matches.</p>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {recommendedJobs.map((job: any) => (
                                                        <Link href={`/jobs/${job.id}`} key={job.id} className="bg-white dark:bg-[#111] p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#FE7743]/50 transition flex justify-between items-center group">
                                                            <div>
                                                                <h3 className="font-bold text-slate-900 dark:text-[#EFEEEA] group-hover:text-[#FE7743] transition">{job.title}</h3>
                                                                <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/40 mt-1">
                                                                    PKR {job.budgetMin?.toLocaleString()}–{job.budgetMax?.toLocaleString()} • {job.employer?.profile?.fullName || 'Client'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end gap-1">
                                                                <span className="inline-block px-2 py-1 bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-bold rounded-lg border border-[#22c55e]/20">
                                                                    {job.matchScore}% MATCH
                                                                </span>
                                                                {job.isBoosted && <span className="text-[10px] text-[#FE7743] font-bold">BOOSTED</span>}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Freelancer: Active Gig Orders */}
                                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA]">Active Gig Orders</h2>
                                        </div>
                                        {myGigs.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 dark:text-[#EFEEEA]/40 text-sm">
                                                No gig orders yet.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                {myGigs.slice(0, 5).map((order: any) => (
                                                    <div key={order.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/2 transition">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-slate-900 dark:text-[#EFEEEA] text-sm truncate">{order.gig?.title}</p>
                                                            <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/40 mt-1">
                                                                Buyer: {order.buyer?.profile?.fullName || 'Client'} • PKR {order.price?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <StatusBadge status={order.status} />
                                                            {(order.status === 'PENDING' || order.status === 'IN_PROGRESS' || order.status === 'DELIVERED') && (
                                                                <button
                                                                    onClick={() => { setDisputeTarget({ id: order.id, type: 'order' }); setDisputeModalOpen(true); }}
                                                                    className="text-[10px] text-red-400 hover:text-red-300 transition underline"
                                                                >
                                                                    Open Dispute
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Freelancer: Recent Applications */}
                                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA]">Recent Applications</h2>
                                            <Link href="/dashboard/applications" className="text-xs text-[#FE7743] font-semibold hover:underline">View All</Link>
                                        </div>
                                        {applications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 dark:text-[#EFEEEA]/40 text-sm">
                                                No applications yet. <Link href="/jobs" className="text-[#FE7743] hover:underline">Browse jobs</Link> to get started.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                {applications.slice(0, 5).map((app: any) => (
                                                    <div key={app.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/2 transition">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-slate-900 dark:text-[#EFEEEA] text-sm truncate">{app.job?.title || 'Job'}</p>
                                                            <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/40 mt-1">
                                                                {app.job?.employer?.profile?.fullName || 'Employer'} • PKR {app.job?.budgetMin?.toLocaleString()}–{app.job?.budgetMax?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={app.status} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Employer: Purchased Gigs */}
                                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA]">Purchased Gigs</h2>
                                        </div>
                                        {purchasedGigs.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 dark:text-[#EFEEEA]/40 text-sm">
                                                No gigs purchased. <Link href="/search" className="text-[#FE7743] hover:underline">Find a freelancer</Link>.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                {purchasedGigs.slice(0, 5).map((order: any) => (
                                                    <div key={order.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/2 transition">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-slate-900 dark:text-[#EFEEEA] text-sm truncate">{order.gig?.title}</p>
                                                            <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/40 mt-1">
                                                                Seller: {order.seller?.profile?.fullName || 'Freelancer'} • PKR {order.price?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <StatusBadge status={order.status} />
                                                            {(order.status === 'PENDING' || order.status === 'IN_PROGRESS' || order.status === 'DELIVERED') && (
                                                                <button
                                                                    onClick={() => { setDisputeTarget({ id: order.id, type: 'order' }); setDisputeModalOpen(true); }}
                                                                    className="text-[10px] text-red-400 hover:text-red-300 transition underline"
                                                                >
                                                                    Open Dispute
                                                                </button>
                                                            )}
                                                            {(order.status === 'COMPLETED' && !order.buyerRating) && (
                                                                <button
                                                                    onClick={() => { setReviewTarget(order.id); setReviewModalOpen(true); }}
                                                                    className="text-[10px] text-[#FE7743] hover:text-[#FE7743]/80 transition underline"
                                                                >
                                                                    Leave a Review
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Employer: My Job Postings */}
                                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA]">My Job Postings</h2>
                                            <Link href="/jobs/post" className="text-xs text-[#FE7743] font-semibold hover:underline">Post New</Link>
                                        </div>
                                        {myJobs.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 dark:text-[#EFEEEA]/40 text-sm">
                                                No jobs posted yet. <Link href="/jobs/post" className="text-[#FE7743] hover:underline">Post your first job</Link> for free.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                {myJobs.slice(0, 5).map((job: any) => (
                                                    <div key={job.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/2 transition">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-slate-900 dark:text-[#EFEEEA] text-sm truncate">{job.title}</p>
                                                            <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/40 mt-1">
                                                                {job._count?.applications || 0} applicants • PKR {job.budgetMin?.toLocaleString()}–{job.budgetMax?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <StatusBadge status={job.status} />
                                                            <Link href={`/dashboard/applications?jobId=${job.id}`} className="text-xs text-[#273F4F] bg-[#273F4F]/20 px-3 py-1.5 rounded-lg hover:bg-[#273F4F]/30 transition font-medium">
                                                                View
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                <h3 className="font-bold text-slate-900 dark:text-[#EFEEEA] text-sm mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    {isFreelancer ? (
                                        <>
                                            <Link href="/jobs" className="block w-full py-2.5 bg-[#FE7743] text-white text-center font-semibold rounded-lg text-sm hover:bg-[#FE7743]/90 transition shadow-sm">Browse Jobs</Link>
                                            <Link href="/dashboard/promote-gig" className="block w-full py-2.5 bg-[#273F4F] text-[#EFEEEA] text-center font-semibold rounded-lg text-sm hover:bg-[#273F4F]/80 transition shadow-sm">Promote a Gig</Link>
                                            <Link href="/dashboard/credits" className="block w-full py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#EFEEEA] text-center font-semibold rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition">Buy Credits</Link>
                                            <Link href="/dashboard/applications" className="block w-full py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#EFEEEA] text-center font-semibold rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition">My Applications</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/jobs/post" className="block w-full py-2.5 bg-[#273F4F] text-[#EFEEEA] text-center font-semibold rounded-lg text-sm hover:bg-[#273F4F]/80 transition shadow-sm">Post a Job</Link>
                                            <Link href="/dashboard/applications" className="block w-full py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#EFEEEA] text-center font-semibold rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition">Review Applicants</Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Credit Balance Card (Freelancer) */}
                            {isFreelancer && (
                                <div className="bg-linear-to-br from-[#FE7743]/20 to-[#FE7743]/5 p-6 rounded-2xl border border-[#FE7743]/20">
                                    <p className="text-xs text-[#FE7743] uppercase tracking-wider font-semibold mb-2">Application Credits</p>
                                    <p className="text-4xl font-black text-[#EFEEEA]">{credits}</p>
                                    <p className="text-xs text-[#EFEEEA]/50 mt-2">Each job application uses 1 credit</p>
                                    <Link href="/dashboard/credits" className="mt-4 block w-full py-2.5 bg-[#FE7743] text-white text-center font-semibold rounded-lg text-sm hover:bg-[#FE7743]/90 transition">
                                        Purchase Credits
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Dispute Modal */}
                {disputeModalOpen && disputeTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-2">Open Dispute</h2>
                            <p className="text-sm text-white/60 mb-6">
                                Please describe the issue in detail. An admin will review this dispute and freeze funds temporarily.
                            </p>
                            <form onSubmit={handleOpenDispute}>
                                <textarea
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    placeholder="Why are you opening a dispute?"
                                    required
                                    rows={4}
                                    className="w-full bg-[#1A1A1A] border border-white/10 text-white text-sm rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-[#FE7743] resize-none"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setDisputeModalOpen(false)}
                                        className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingDispute}
                                        className="px-5 py-2 text-sm font-semibold bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500 flex items-center gap-2 hover:text-white transition disabled:opacity-50"
                                    >
                                        {submittingDispute && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Submit Dispute
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Review Modal */}
                {reviewModalOpen && reviewTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-2">Leave a Review</h2>
                            <p className="text-sm text-white/60 mb-6">
                                How was your experience working with this freelancer?
                            </p>
                            <form onSubmit={handleSubmitReview}>
                                <div className="flex items-center gap-2 mb-6 justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star className={`w-10 h-10 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Write your review here..."
                                    required
                                    rows={4}
                                    className="w-full bg-[#1A1A1A] border border-white/10 text-white text-sm rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-[#FE7743] resize-none"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setReviewModalOpen(false)}
                                        className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="px-5 py-2 text-sm font-semibold bg-[#FE7743] text-white rounded-lg hover:bg-[#FE7743]/90 flex items-center gap-2 transition disabled:opacity-50"
                                    >
                                        {submittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </GlobalErrorBoundary>
    );
}

function StatCard({ label, value, accent, link }: { label: string; value: string; accent: string; link?: string }) {
    const inner = (
        <div className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition shadow-sm dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-[#EFEEEA]/50 uppercase tracking-wider font-semibold mb-2">{label}</p>
            <p className="text-2xl font-bold" style={{ color: accent }}>{value}</p>
        </div>
    );
    if (link) return <Link href={link}>{inner}</Link>;
    return inner;
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-500/10 text-yellow-500',
        SHORTLISTED: 'bg-blue-500/10 text-blue-400',
        HIRED: 'bg-green-500/10 text-green-400',
        REJECTED: 'bg-red-500/10 text-red-400',
        WITHDRAWN: 'bg-gray-500/10 text-gray-400',
        OPEN: 'bg-green-500/10 text-green-400',
        CLOSED: 'bg-gray-500/10 text-gray-400',
        FILLED: 'bg-blue-500/10 text-blue-400',
        EXPIRED: 'bg-red-500/10 text-red-400',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${colors[status] || 'bg-gray-500/10 text-gray-400'}`}>
            {status}
        </span>
    );
}

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
            <div className="min-h-screen bg-[#F7F7F6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
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
            <div className="min-h-screen bg-[#F7F7F6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (showKycBlocker) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F7F7F6]">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[10px] p-10 max-w-lg w-full text-center shadow-sm">
                        <div className="w-20 h-20 bg-[#C62828]/5 text-[#C62828] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C62828]/10">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="h3 text-[#1E1E1E] mb-3">Verification Required</h2>

                        {kycStatus === 'UNVERIFIED' || kycStatus === 'REJECTED' ? (
                            <>
                                <p className="body-regular text-[#3A3A3A]/70 mb-8">
                                    {kycStatus === 'REJECTED'
                                        ? "Your previous verification attempt was rejected. Please submit clear, valid documents."
                                        : "To protect our community, all freelancers must complete Identity Verification (KYC) before accessing the dashboard or applying to jobs."}
                                </p>
                                <Link href="/dashboard/kyc" className="btn-primary w-full shadow-md py-4 text-[15px]">
                                    Complete Verification Now
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="body-regular text-[#3A3A3A]/70 mb-8">
                                    Your documents have been received and are currently under review by our moderation team. You will be able to access the platform once approved.
                                </p>
                                <button disabled className="w-full py-4 px-6 bg-[#F7F7F6] text-[#3A3A3A]/50 font-bold rounded-[8px] cursor-not-allowed border border-[#E5E5E5]">
                                    Review Pending...
                                </button>
                            </>
                        )}
                        <button onClick={() => router.push('/')} className="mt-6 text-[14px] font-medium text-[#3A3A3A]/60 hover:text-[#1E1E1E] transition">
                            Return to Homepage
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <GlobalErrorBoundary>
            <div className="flex flex-col min-h-screen bg-[#F7F7F6]">
                <Navbar />
                <main className="flex-1 max-w-[1240px] mx-auto px-6 py-12 w-full" style={{ paddingTop: 120 }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                            <h1 className="h1 text-[#1E1E1E] mb-2 tracking-tight">Dashboard</h1>
                            <p className="body-regular text-[#3A3A3A] font-medium">
                                {isFreelancer ? 'Manage your applications & earnings' : 'Manage your job postings & hires'}
                            </p>
                        </div>
                        {isFreelancer ? (
                            <Link href="/jobs" className="btn-primary shadow-md">
                                Browse Jobs
                            </Link>
                        ) : (
                            <Link href="/jobs/post" className="btn-primary shadow-md">
                                Post a Job
                            </Link>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {isFreelancer ? (
                            <>
                                <StatCard label="Credits" value={credits.toString()} accent="#C9A227" link="/dashboard/credits" />
                                <StatCard label="Applications" value={applications.length.toString()} accent="#1E1E1E" />
                                <StatCard label="Pending" value={pendingApps.toString()} accent="#C9A227" />
                                <StatCard label="Hired" value={hiredApps.toString()} accent="#2E7D32" />
                            </>
                        ) : (
                            <>
                                <StatCard label="Jobs Posted" value={myJobs.length.toString()} accent="#1E1E1E" />
                                <StatCard label="Open Jobs" value={myJobs.filter(j => j.status === 'OPEN').length.toString()} accent="#C9A227" />
                                <StatCard label="Total Applicants" value={totalApplicants.toString()} accent="#1E1E1E" />
                                <StatCard label="Filled" value={myJobs.filter(j => j.status === 'FILLED').length.toString()} accent="#2E7D32" />
                            </>
                        )}
                    </div>

                    {/* Wallet */}
                    {wallet && (
                        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[10px] p-8 mb-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A227]" />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div>
                                    <p className="micro-label text-[#3A3A3A] mb-2">Wallet Balance</p>
                                    <p className="text-4xl font-display font-black text-[#1E1E1E] tracking-tight">PKR {wallet.balancePKR?.toLocaleString() || '0'}</p>
                                    {wallet.pendingPKR > 0 && (
                                        <p className="text-[13px] text-[#C9A227] font-bold mt-2">PKR {wallet.pendingPKR.toLocaleString()} pending withdrawal</p>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    {isFreelancer && (
                                        <Link href="/dashboard/earnings" className="btn-secondary">
                                            Earnings
                                        </Link>
                                    )}
                                    <Link href="/dashboard/credits" className="btn-primary">
                                        Buy Credits
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            {isFreelancer ? (
                                <>
                                    {/* Performance Overview Chart */}
                                    {analytics.length > 0 && (
                                        <div className="bg-[#FFFFFF] p-8 rounded-[10px] border border-[#E5E5E5] shadow-sm">
                                            <h3 className="h3 text-[#1E1E1E] mb-6">Performance Overview (30 Days)</h3>
                                            <div className="h-[300px] w-full mt-4">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={analytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2} />
                                                                <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                                                            </linearGradient>
                                                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.1} />
                                                                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="date" stroke="#E5E5E5" tick={{ fill: '#3A3A3A' }} fontSize={11} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                                        <YAxis stroke="#E5E5E5" tick={{ fill: '#3A3A3A' }} fontSize={11} />
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#1E1E1E', color: '#FFFFFF', borderRadius: '4px', fontSize: '12px' }}
                                                            itemStyle={{ color: '#FFFFFF' }}
                                                        />
                                                        <Area type="monotone" dataKey="earnings" stroke="#C9A227" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" name="Earnings (PKR)" />
                                                        <Area type="monotone" dataKey="orders" stroke="#2E7D32" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" name="Completed Orders" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommended for You (AI Matching) */}
                                    <div className="bg-[#FFFFFF] p-8 rounded-[10px] border border-[#E5E5E5] shadow-sm relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 text-[#C9A227]/10 rotate-12">
                                            <Star size={140} fill="currentColor" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <h2 className="h3 text-[#1E1E1E] flex items-center gap-3">
                                                        <Sparkles className="w-5 h-5 text-[#C9A227]" /> Recommended for You
                                                    </h2>
                                                    <p className="body-regular text-[#3A3A3A]/70 mt-1">AI matched based on your skills and rate</p>
                                                </div>
                                            </div>

                                            {recommendedJobs.length === 0 ? (
                                                <p className="text-[14px] text-[#3A3A3A]/60 font-medium">Update your profile skills to see AI matches.</p>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    {recommendedJobs.map((job: any) => (
                                                        <Link href={`/jobs/${job.id}`} key={job.id} className="bg-[#F7F7F6] p-5 rounded-[8px] border border-[#E5E5E5] hover:border-[#C9A227]/50 transition-all flex justify-between items-center group">
                                                            <div>
                                                                <h3 className="font-bold text-[#1E1E1E] text-[15px] group-hover:text-[#C9A227] transition-colors">{job.title}</h3>
                                                                <p className="text-[13px] font-medium text-[#3A3A3A]/70 mt-1">
                                                                    PKR {job.budgetMin?.toLocaleString()}–{job.budgetMax?.toLocaleString()} • {job.employer?.profile?.fullName || 'Client'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end gap-2">
                                                                <span className="inline-block px-2.5 py-1 bg-[#2E7D32]/10 text-[#2E7D32] text-[10px] font-extrabold uppercase tracking-wider rounded-[4px] border border-[#2E7D32]/20">
                                                                    {job.matchScore}% MATCH
                                                                </span>
                                                                {job.isBoosted && <span className="text-[10px] text-[#C9A227] font-extrabold uppercase tracking-widest">BOOSTED</span>}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Freelancer: Active Gig Orders */}
                                    <div className="bg-[#FFFFFF] rounded-[10px] border border-[#E5E5E5] shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center">
                                            <h2 className="h3 text-[#1E1E1E]">Active Gig Orders</h2>
                                        </div>
                                        {myGigs.length === 0 ? (
                                            <div className="p-10 text-center text-[#3A3A3A]/50 text-[14px] font-medium">
                                                No gig orders yet.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-[#E5E5E5]">
                                                {myGigs.slice(0, 5).map((order: any) => (
                                                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-[#F7F7F6] transition-colors">
                                                        <div className="min-w-0 flex-1 pr-4">
                                                            <p className="font-bold text-[#1E1E1E] text-[15px] truncate">{order.gig?.title}</p>
                                                            <p className="text-[13px] font-medium text-[#3A3A3A]/70 mt-1">
                                                                Buyer: <span className="text-[#1E1E1E]">{order.buyer?.profile?.fullName || 'Client'}</span> • PKR {order.price?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                                            <StatusBadge status={order.status} />
                                                            {(order.status === 'PENDING' || order.status === 'IN_PROGRESS' || order.status === 'DELIVERED') && (
                                                                <button
                                                                    onClick={() => { setDisputeTarget({ id: order.id, type: 'order' }); setDisputeModalOpen(true); }}
                                                                    className="text-[11px] font-bold uppercase tracking-widest text-[#C62828] hover:text-[#C62828]/80 transition-colors"
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
                                    <div className="bg-[#FFFFFF] rounded-[10px] border border-[#E5E5E5] shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center">
                                            <h2 className="h3 text-[#1E1E1E]">Recent Applications</h2>
                                            <Link href="/dashboard/applications" className="text-[12px] font-bold uppercase tracking-widest text-[#C9A227] hover:text-[#1E1E1E] transition-colors">View All</Link>
                                        </div>
                                        {applications.length === 0 ? (
                                            <div className="p-10 text-center text-[#3A3A3A]/50 text-[14px] font-medium">
                                                No applications yet. <Link href="/jobs" className="text-[#1E1E1E] font-bold border-b border-[#C9A227]">Browse jobs</Link> to get started.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-[#E5E5E5]">
                                                {applications.slice(0, 5).map((app: any) => (
                                                    <div key={app.id} className="p-6 flex items-center justify-between hover:bg-[#F7F7F6] transition-colors">
                                                        <div className="min-w-0 flex-1 pr-4">
                                                            <p className="font-bold text-[#1E1E1E] text-[15px] truncate">{app.job?.title || 'Job'}</p>
                                                            <p className="text-[13px] font-medium text-[#3A3A3A]/70 mt-1">
                                                                <span className="text-[#1E1E1E]">{app.job?.employer?.profile?.fullName || 'Employer'}</span> • PKR {app.job?.budgetMin?.toLocaleString()}–{app.job?.budgetMax?.toLocaleString()}
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
                                    <div className="bg-[#FFFFFF] rounded-[10px] border border-[#E5E5E5] shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center">
                                            <h2 className="h3 text-[#1E1E1E]">Purchased Gigs</h2>
                                        </div>
                                        {purchasedGigs.length === 0 ? (
                                            <div className="p-10 text-center text-[#3A3A3A]/50 text-[14px] font-medium">
                                                No gigs purchased. <Link href="/search" className="text-[#1E1E1E] font-bold border-b border-[#C9A227]">Find a freelancer</Link>.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-[#E5E5E5]">
                                                {purchasedGigs.slice(0, 5).map((order: any) => (
                                                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-[#F7F7F6] transition-colors">
                                                        <div className="min-w-0 flex-1 pr-4">
                                                            <p className="font-bold text-[#1E1E1E] text-[15px] truncate">{order.gig?.title}</p>
                                                            <p className="text-[13px] font-medium text-[#3A3A3A]/70 mt-1">
                                                                Seller: <span className="text-[#1E1E1E]">{order.seller?.profile?.fullName || 'Freelancer'}</span> • PKR {order.price?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                                            <StatusBadge status={order.status} />
                                                            {(order.status === 'PENDING' || order.status === 'IN_PROGRESS' || order.status === 'DELIVERED') && (
                                                                <button
                                                                    onClick={() => { setDisputeTarget({ id: order.id, type: 'order' }); setDisputeModalOpen(true); }}
                                                                    className="text-[11px] font-bold uppercase tracking-widest text-[#C62828] hover:text-[#C62828]/80 transition-colors"
                                                                >
                                                                    Open Dispute
                                                                </button>
                                                            )}
                                                            {(order.status === 'COMPLETED' && !order.buyerRating) && (
                                                                <button
                                                                    onClick={() => { setReviewTarget(order.id); setReviewModalOpen(true); }}
                                                                    className="text-[11px] font-bold uppercase tracking-widest text-[#C9A227] hover:text-[#1E1E1E] transition-colors"
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
                                    <div className="bg-[#FFFFFF] rounded-[10px] border border-[#E5E5E5] shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center">
                                            <h2 className="h3 text-[#1E1E1E]">My Job Postings</h2>
                                            <Link href="/jobs/post" className="text-[12px] font-bold uppercase tracking-widest text-[#C9A227] hover:text-[#1E1E1E] transition-colors">Post New</Link>
                                        </div>
                                        {myJobs.length === 0 ? (
                                            <div className="p-10 text-center text-[#3A3A3A]/50 text-[14px] font-medium">
                                                No jobs posted yet. <Link href="/jobs/post" className="text-[#1E1E1E] font-bold border-b border-[#C9A227]">Post your first job</Link> for free.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-[#E5E5E5]">
                                                {myJobs.slice(0, 5).map((job: any) => (
                                                    <div key={job.id} className="p-6 flex items-center justify-between hover:bg-[#F7F7F6] transition-colors">
                                                        <div className="min-w-0 flex-1 pr-4">
                                                            <p className="font-bold text-[#1E1E1E] text-[15px] truncate">{job.title}</p>
                                                            <p className="text-[13px] font-medium text-[#3A3A3A]/70 mt-1">
                                                                {job._count?.applications || 0} applicants • PKR {job.budgetMin?.toLocaleString()}–{job.budgetMax?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <StatusBadge status={job.status} />
                                                            <Link href={`/dashboard/applications?jobId=${job.id}`} className="text-[12px] font-bold uppercase tracking-widest text-[#1E1E1E] border-b border-[#1E1E1E] hover:text-[#C9A227] hover:border-[#C9A227] transition-colors">
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
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <div className="bg-[#FFFFFF] p-8 rounded-[10px] border border-[#E5E5E5] shadow-sm">
                                <h3 className="h3 text-[#1E1E1E] mb-6">Quick Actions</h3>
                                <div className="space-y-4">
                                    {isFreelancer ? (
                                        <>
                                            <Link href="/jobs" className="btn-primary w-full text-center shadow-md">Browse Jobs</Link>
                                            <Link href="/dashboard/promote-gig" className="btn-secondary w-full text-center">Promote a Gig</Link>
                                            <Link href="/dashboard/credits" className="btn-secondary w-full text-center">Buy Credits</Link>
                                            <Link href="/dashboard/applications" className="btn-secondary w-full text-center border-transparent">My Applications</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/jobs/post" className="btn-primary w-full text-center shadow-md">Post a Job</Link>
                                            <Link href="/dashboard/applications" className="btn-secondary w-full text-center">Review Applicants</Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Credit Balance Card (Freelancer) */}
                            {isFreelancer && (
                                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#3A3A3A] p-8 rounded-[10px] border border-[#1E1E1E] shadow-xl text-[#FFFFFF]">
                                    <p className="micro-label text-[#C9A227] mb-3">Application Credits</p>
                                    <p className="text-5xl font-display font-black tracking-tighter text-[#FFFFFF]">{credits}</p>
                                    <p className="text-[13px] font-medium text-[#FFFFFF]/70 mt-3">Each job application uses 1 credit</p>
                                    <Link href="/dashboard/credits" className="mt-6 block w-full py-3.5 bg-[#C9A227] text-[#1E1E1E] text-center font-bold rounded-[8px] text-[15px] hover:bg-[#b59020] transition-colors">
                                        Purchase Credits
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Dispute Modal */}
                {disputeModalOpen && disputeTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E1E]/80 backdrop-blur-md">
                        <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-8 rounded-[10px] w-full max-w-lg shadow-2xl">
                            <h2 className="h3 text-[#1E1E1E] mb-3">Open Dispute</h2>
                            <p className="body-regular text-[#3A3A3A]/70 mb-8">
                                Please describe the issue in detail. An admin will review this dispute and freeze funds temporarily.
                            </p>
                            <form onSubmit={handleOpenDispute}>
                                <textarea
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    placeholder="Why are you opening a dispute?"
                                    required
                                    rows={5}
                                    className="w-full bg-[#F7F7F6] border border-transparent text-[#1E1E1E] text-[15px] rounded-[8px] px-5 py-4 mb-6 focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C9A227] resize-none placeholder:text-[#3A3A3A]/40 transition-colors"
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setDisputeModalOpen(false)}
                                        className="px-6 py-3 text-[14px] font-bold text-[#3A3A3A] hover:text-[#1E1E1E] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingDispute}
                                        className="px-6 py-3 text-[14px] font-bold bg-[#C62828] text-[#FFFFFF] rounded-[8px] hover:bg-[#b71c1c] flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {submittingDispute && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Submit Dispute
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Review Modal */}
                {reviewModalOpen && reviewTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E1E]/80 backdrop-blur-md">
                        <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-8 rounded-[10px] w-full max-w-lg shadow-2xl">
                            <h2 className="h3 text-[#1E1E1E] mb-3">Leave a Review</h2>
                            <p className="body-regular text-[#3A3A3A]/70 mb-8">
                                How was your experience working with this freelancer?
                            </p>
                            <form onSubmit={handleSubmitReview}>
                                <div className="flex items-center gap-3 mb-8 justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-12 h-12 ${star <= reviewRating ? 'fill-[#C9A227] text-[#C9A227]' : 'text-[#E5E5E5]'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Write your review here..."
                                    required
                                    rows={5}
                                    className="w-full bg-[#F7F7F6] border border-transparent text-[#1E1E1E] text-[15px] rounded-[8px] px-5 py-4 mb-6 focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C9A227] resize-none placeholder:text-[#3A3A3A]/40 transition-colors"
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setReviewModalOpen(false)}
                                        className="px-6 py-3 text-[14px] font-bold text-[#3A3A3A] hover:text-[#1E1E1E] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="btn-primary px-8 shadow-md flex items-center gap-2"
                                    >
                                        {submittingReview && <Loader2 className="w-5 h-5 animate-spin" />}
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
        <div className="bg-[#FFFFFF] p-6 rounded-[10px] border border-[#E5E5E5] hover:border-[#1E1E1E] transition-colors duration-300 shadow-sm group">
            <p className="micro-label text-[#3A3A3A]/70 mb-3 group-hover:text-[#1E1E1E] transition-colors">{label}</p>
            <p className="text-3xl font-display font-black tracking-tighter" style={{ color: accent }}>{value}</p>
        </div>
    );
    if (link) return <Link href={link}>{inner}</Link>;
    return inner;
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/20',
        SHORTLISTED: 'bg-[#1E1E1E]/5 text-[#1E1E1E] border-[#1E1E1E]/10',
        HIRED: 'bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20',
        REJECTED: 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/20',
        WITHDRAWN: 'bg-[#3A3A3A]/10 text-[#3A3A3A] border-[#3A3A3A]/20',
        OPEN: 'bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20',
        CLOSED: 'bg-[#3A3A3A]/10 text-[#3A3A3A] border-[#3A3A3A]/20',
        FILLED: 'bg-[#1E1E1E]/5 text-[#1E1E1E] border-[#1E1E1E]/10',
        EXPIRED: 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/20',
    };
    return (
        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-[4px] border ${colors[status] || 'bg-[#3A3A3A]/10 text-[#3A3A3A] border-[#3A3A3A]/20'}`}>
            {status}
        </span>
    );
}

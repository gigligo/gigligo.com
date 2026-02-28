'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { creditApi, walletApi, applicationApi, jobApi, orderApi, disputeApi, reviewApi, analyticsApi, userStateApi } from '@/lib/api';
import Link from 'next/link';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [userState, setUserState] = useState<any>(null);

    const token = (session as any)?.accessToken;
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE'].includes(role);
    const isEmployer = ['BUYER', 'EMPLOYER'].includes(role);

    useEffect(() => {
        if (!token || !isFreelancer) return;
        userStateApi.getState(token)
            .then((data: any) => {
                setUserState(data);
                const freshStatus = data?.kycStatus || 'UNVERIFIED';
                if (freshStatus === 'APPROVED' && (session as any)?.kycStatus !== 'APPROVED') {
                    updateSession({ kycStatus: 'APPROVED' });
                }
            })
            .catch(() => {
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
                    const [apps, sales, recs] = await Promise.all([
                        applicationApi.getMine(token),
                        orderApi.getMySales(token),
                        jobApi.getRecommended(token)
                    ]);
                    setApplications(apps);
                    setMyGigs(sales);
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

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const pendingApps = applications.filter(a => a.status === 'PENDING').length;

    const kycStatus = userState?.kycStatus || (session as any)?.kycStatus || 'UNVERIFIED';
    const showKycBlocker = isFreelancer && kycStatus !== 'APPROVED';
    const stateLoading = isFreelancer && userState === null;

    if (stateLoading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (showKycBlocker) {
        return (
            <div className="flex h-screen w-full bg-background-light items-center justify-center p-6">
                <div className="bg-surface-light border border-border-light rounded-xl p-10 max-w-lg w-full text-center shadow-sm">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                        <span className="material-symbols-outlined text-4xl">warning</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-3 tracking-tight">Verification Required</h2>
                    {kycStatus === 'UNVERIFIED' || kycStatus === 'REJECTED' ? (
                        <>
                            <p className="text-text-muted mb-8">
                                {kycStatus === 'REJECTED'
                                    ? "Your previous verification attempt was rejected. Please submit clear, valid documents."
                                    : "To protect our community, all professionals must complete Identity Verification (KYC) before accessing the executive suite."}
                            </p>
                            <Link href="/dashboard/kyc" className="flex items-center justify-center h-12 rounded-lg bg-primary text-white font-bold tracking-wide w-full shadow-md hover:bg-primary-dark transition-colors">
                                Complete Verification Now
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-text-muted mb-8">
                                Your documents have been received and are currently under review by our moderation team. You will be able to access the platform once approved.
                            </p>
                            <button disabled className="w-full h-12 bg-background-light text-text-muted font-bold rounded-lg cursor-not-allowed border border-border-light">
                                Review Pending...
                            </button>
                        </>
                    )}
                    <button onClick={() => router.push('/')} className="mt-6 text-sm font-medium text-text-muted hover:text-text-main transition">
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light text-text-main font-sans antialiased">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 md:relative transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-nav-bg text-white flex flex-col justify-between border-r border-white/5 shrink-0`}>
                <div className="p-6 flex flex-col gap-8">
                    {/* User Profile / Brand */}
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-slate-700 bg-cover bg-center ring-2 ring-primary/30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBECihEFRoS1E7671uBNHtaYth0GmBiZQBv_cHh2NzpKIfuwtRcAnZsbYAf5N46bgnIAOjJtqf9SqbuCvlqK7QlY-KKhFhq5U9eQARcnjEbYh5ba7vxD7pHtHHlh6fUPMylKMqV30WUtdGq-2u107hNG6_pfdnZUULJUcdZE39TJlYW-j7LjteTOvsCeX8tk7SRBxEHKB8kaSTJa4u39hmIpsuKSUylkybQTpt4s88jE1diEQQ2VDOQSBP4cawz_GxECXmdq1JJAPo')" }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-semibold tracking-wide text-white">GIGLIGO</h1>
                            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Executive Suite</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white active-nav-icon shadow-sm shadow-primary/20 transition-all">
                            <span className="material-symbols-outlined text-xl">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link href={isFreelancer ? "/dashboard/applications" : "/dashboard/jobs"} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">work</span>
                            <span className="text-sm font-medium">{isFreelancer ? 'Proposals' : 'Job Postings'}</span>
                        </Link>
                        <Link href="/dashboard/inbox" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">chat</span>
                            <span className="text-sm font-medium">Inbox</span>
                        </Link>
                        <Link href="/dashboard/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">assignment</span>
                            <span className="text-sm font-medium">Projects</span>
                        </Link>
                        <Link href="/dashboard/finance" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">account_balance</span>
                            <span className="text-sm font-medium">Finance</span>
                        </Link>
                        <Link href="/dashboard/earnings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">payments</span>
                            <span className="text-sm font-medium">Wallet & Earnings</span>
                        </Link>
                        <Link href="/dashboard/contracts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">gavel</span>
                            <span className="text-sm font-medium">Contracts</span>
                        </Link>
                        <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-xl">person_search</span>
                            <span className="text-sm font-medium">Talent Search</span>
                        </Link>
                    </nav>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-xl">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    {isFreelancer ? (
                        <Link href="/jobs" className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-semibold tracking-wide uppercase">
                            <span className="material-symbols-outlined text-lg">search</span>
                            <span>Find Jobs</span>
                        </Link>
                    ) : (
                        <Link href="/jobs/post" className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-semibold tracking-wide uppercase">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>Post Job</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto bg-background-light">
                <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-10">

                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative">
                        <div className="flex items-center gap-3">
                            <button
                                className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-main transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="material-symbols-outlined text-3xl">menu</span>
                            </button>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">Executive Overview</h2>
                                    <span className="px-2 py-0.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-bold tracking-wider uppercase hidden sm:inline-block">Pro</span>
                                </div>
                                <p className="text-text-muted font-normal text-sm sm:text-base">Welcome back, {(session?.user as any)?.name?.split(' ')[0] || 'User'}. Your metrics are looking pristine.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 self-end sm:self-auto">
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 relative">
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background-light"></span>
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            {isFreelancer && (
                                <div className="text-right">
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Current Rate</p>
                                    <p className="text-text-main font-bold">PKR 5K/hr</p>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Metrics Row */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-surface-light rounded-xl p-6 border border-border-light shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-text-muted">{isFreelancer ? 'Total Earnings' : 'Total Spent'}</p>
                                    <h3 className="text-3xl font-bold text-text-main mt-1 tracking-tight">PKR {wallet?.balancePKR?.toLocaleString() || '0'}</h3>
                                </div>
                                <span className={`p-2 rounded-lg ${isFreelancer ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'}`}>
                                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                                </span>
                            </div>
                            {wallet?.pendingPKR > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded">PKR {wallet.pendingPKR.toLocaleString()}</span>
                                    <span className="text-text-muted">pending withdrawal</span>
                                </div>
                            )}
                        </div>

                        {/* Card 2 */}
                        <div className="bg-surface-light rounded-xl p-6 border border-border-light shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-text-muted">{isFreelancer ? 'Active Proposals' : 'Active Jobs'}</p>
                                    <h3 className="text-3xl font-bold text-text-main mt-1 tracking-tight">{isFreelancer ? pendingApps : myJobs.filter(j => j.status === 'OPEN').length}</h3>
                                </div>
                                <span className="p-2 bg-blue-50 rounded-lg text-blue-700">
                                    <span className="material-symbols-outlined text-xl">send</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">{isFreelancer ? applications.length : myJobs.length}</span>
                                <span className="text-text-muted">total</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-surface-light rounded-xl p-6 border border-border-light shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-text-muted">{isFreelancer ? 'Credits' : 'Hired'}</p>
                                    <h3 className="text-3xl font-bold text-text-main mt-1 tracking-tight">{isFreelancer ? credits : myJobs.filter(j => j.status === 'FILLED').length}</h3>
                                </div>
                                <span className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined text-xl">{isFreelancer ? 'stars' : 'verified'}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {isFreelancer && (
                                    <>
                                        <span className="text-primary font-medium bg-primary/5 px-1.5 py-0.5 rounded">Top 1%</span>
                                        <span className="text-text-muted">of talent pool</span>
                                    </>
                                )}
                            </div>
                            {isFreelancer && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                                    <div className="h-full bg-primary w-[98%]"></div>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

                        {/* Recent Activity */}
                        <section className="lg:col-span-2 flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-text-main">Recent Activity</h3>
                                <Link className="text-sm font-medium text-primary hover:text-primary-dark transition-colors" href="/dashboard/applications">View All</Link>
                            </div>
                            <div className="bg-surface-light rounded-xl border border-border-light shadow-sm divide-y divide-border-light">

                                {isFreelancer && applications.slice(0, 3).map((app: any) => (
                                    <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                    <span className="material-symbols-outlined">edit_document</span>
                                                </div>
                                                <div>
                                                    <p className="text-text-main font-semibold text-sm">Proposal: {app.job?.title || 'Job'}</p>
                                                    <p className="text-text-muted text-xs mt-0.5">Client: {app.job?.employer?.profile?.fullName || 'Employer'} • Budget: PKR {app.job?.budgetMin?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <StatusBadge status={app.status} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isEmployer && myJobs.slice(0, 3).map((job: any) => (
                                    <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                                    <span className="material-symbols-outlined">work</span>
                                                </div>
                                                <div>
                                                    <p className="text-text-main font-semibold text-sm">Job Posting: {job.title}</p>
                                                    <p className="text-text-muted text-xs mt-0.5">{job._count?.applications || 0} Applicants • PKR {job.budgetMin?.toLocaleString()} - {job.budgetMax?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <StatusBadge status={job.status} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {((isFreelancer && applications.length === 0) || (isEmployer && myJobs.length === 0)) && (
                                    <div className="p-8 text-center text-text-muted text-sm font-medium">
                                        No recent activity to display.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Recommended Gigs / Postings */}
                        <section className="flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-text-main">{isFreelancer ? 'Recommended Jobs' : 'Top Talent'}</h3>
                                <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-xl">tune</span>
                                </button>
                            </div>

                            {isFreelancer ? (
                                recommendedJobs.length > 0 ? (
                                    recommendedJobs.slice(0, 3).map((job: any) => (
                                        <Link href={`/jobs/${job.id}`} key={job.id} className="bg-surface-light rounded-xl border border-border-light p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 border border-border-light rounded-lg bg-background-light text-text-main flex items-center justify-center font-bold text-xs uppercase">
                                                    {job.employer?.profile?.fullName?.[0] || 'C'}
                                                </div>
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide rounded">{job.matchScore}% Match</span>
                                            </div>
                                            <h4 className="text-text-main font-bold text-base mb-1 group-hover:text-primary transition-colors">{job.title}</h4>
                                            <p className="text-text-muted text-xs mb-4">{job.employer?.profile?.fullName || 'Client'}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {job.skills?.slice(0, 2).map((skill: any) => (
                                                    <span key={skill.id} className="px-2 py-1 border border-border-light rounded text-[10px] text-text-muted font-medium">{skill.name}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-border-light">
                                                <span className="text-text-main font-bold text-sm">PKR {job.budgetMax?.toLocaleString()}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="bg-surface-light rounded-xl border border-border-light p-8 text-center shadow-sm">
                                        <p className="text-sm text-text-muted">Update your profile skills to get AI job match recommendations.</p>
                                    </div>
                                )
                            ) : (
                                /* Employer side placeholder for top talent */
                                <div className="bg-surface-light rounded-xl border border-border-light p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">A</div>
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide rounded">Top Rated</span>
                                    </div>
                                    <h4 className="text-text-main font-bold text-base mb-1 group-hover:text-primary transition-colors">Senior Software Engineer</h4>
                                    <p className="text-text-muted text-xs mb-4">React, Node.js, AWS</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-border-light">
                                        <span className="text-text-main font-bold text-sm">PKR 8,000/hr</span>
                                    </div>
                                </div>
                            )}

                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let colorClass = "bg-slate-100 text-slate-600";
    if (['PENDING', 'OPEN'].includes(status)) colorClass = "bg-primary/10 text-primary border border-primary/20";
    if (['HIRED', 'FILLED'].includes(status)) colorClass = "bg-green-100 text-green-700 border border-green-200";
    if (['REJECTED', 'EXPIRED'].includes(status)) colorClass = "bg-red-100 text-red-700 border border-red-200";

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${colorClass}`}>
            {status}
        </span>
    );
}

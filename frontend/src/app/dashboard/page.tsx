'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { creditApi, walletApi, applicationApi, jobApi, orderApi, userStateApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState, TacticalSkeleton, PageTransition } from '@/components/ui/TacticalUI';
import { Briefcase, Rocket, Bell, Search, Plus, Settings, Bolt, LayoutDashboard, MessageSquare, ClipboardList, Building2, Wallet as WalletIcon, Gavel, UserSearch } from 'lucide-react';

export default function DashboardPage() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const [credits, setCredits] = useState(0);
    const [wallet, setWallet] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [myJobs, setMyJobs] = useState<any[]>([]);
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
                    setRecommendedJobs(recs || []);
                }
                if (isEmployer) {
                    const [jobs] = await Promise.all([
                        jobApi.getMyJobs(token),
                    ]);
                    setMyJobs(jobs);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const kycStatus = userState?.kycStatus || (session as any)?.kycStatus || 'UNVERIFIED';
    const showKycBlocker = isFreelancer && kycStatus !== 'APPROVED';

    if (showKycBlocker) {
        return (
            <div className="flex min-h-screen w-full bg-background-dark items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[4rem] p-16 max-w-2xl w-full text-center shadow-2xl"
                >
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-xl">
                        <span className="material-symbols-outlined text-5xl font-light">verified_user</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Identity Verification Required</h2>
                    <p className="text-base text-white/40 font-medium mb-10 px-10 leading-relaxed">
                        To ensure platform security and compliance, please complete your identity verification before accessing the dashboard.
                    </p>
                    {kycStatus === 'UNVERIFIED' || kycStatus === 'REJECTED' ? (
                        <div className="space-y-4">
                            <Link href="/dashboard/settings?tab=verification" className="flex items-center justify-center h-16 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[11px] w-full shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
                                START VERIFICATION
                            </Link>
                            {kycStatus === 'REJECTED' && (
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Verification failed. Please check your documents and try again.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">Verification in progress...</p>
                            <button disabled className="w-full h-16 bg-white/5 text-white/20 font-bold uppercase tracking-widest rounded-xl text-[11px] border border-white/5 cursor-not-allowed">
                                PENDING APPROVAL
                            </button>
                        </div>
                    )}
                    <button onClick={() => router.push('/')} className="mt-10 text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-all">
                        RETURN TO HOME
                    </button>
                </motion.div>
            </div >
        );
    }

    return (
        <PageTransition>
            <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-sans antialiased selection:bg-primary/30">
                {/* Sidebar Navigation - Tactical Wing */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-[300px] md:relative transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-700 ease-[0.16, 1, 0.3, 1] bg-black border-r border-white/5 flex flex-col justify-between shrink-0 shadow-2xl shadow-black`}>
                    <div className="p-10 flex flex-col gap-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 px-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
                                <Bolt className="text-white w-5 h-5 font-bold" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-bold tracking-tight text-white uppercase group-hover:text-primary transition-colors">GIGLIGO</h1>
                                <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">DASHBOARD</span>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1.5">
                            <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" active />
                            <NavItem href={isFreelancer ? "/dashboard/applications" : "/dashboard/jobs"} icon={Briefcase} label={isFreelancer ? 'Applications' : 'My Jobs'} />
                            <NavItem href="/dashboard/inbox" icon={MessageSquare} label="Messages" />
                            <NavItem href="/dashboard/projects" icon={ClipboardList} label="Projects" />
                            <NavItem href="/dashboard/finance" icon={Building2} label="Finance" />
                            <NavItem href="/dashboard/earnings" icon={WalletIcon} label="Earnings" />
                            <NavItem href="/dashboard/contracts" icon={Gavel} label="Contracts" />
                            <NavItem href="/search" icon={UserSearch} label="Browse" />
                        </nav>
                    </div>

                    <div className="p-8 flex flex-col gap-6">
                        <Link href="/dashboard/settings" className="flex items-center gap-4 px-4 py-3 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all duration-300 group">
                            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" />
                            <span className="text-xs font-bold">Settings</span>
                        </Link>

                        <Link href={isFreelancer ? "/jobs" : "/jobs/post"} className="w-full">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-11 rounded-xl bg-primary text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined text-base">{isFreelancer ? 'search' : 'add'}</span>
                                {isFreelancer ? 'Find Jobs' : 'Post Job'}
                            </motion.button>
                        </Link>
                    </div>
                </aside>

                {/* Main Command Display */}
                <main className="flex-1 h-full overflow-y-auto bg-background-dark relative">
                    {/* Background Atmosphere */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] pointer-events-none opacity-50" />

                    <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col gap-20 relative z-10">
                        {/* Command Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex items-center gap-6">
                                <button
                                    className="md:hidden w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    <span className="material-symbols-outlined text-2xl">menu</span>
                                </button>
                                <div>
                                    <div className="flex items-center gap-4 mb-1">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard</h2>
                                        <span className="px-3 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[8px] font-bold tracking-widest uppercase hidden sm:inline-block">Professional</span>
                                    </div>
                                    <p className="text-white/30 font-medium text-base">Welcome back, {(session?.user as any)?.name?.split(' ')[0] || 'User'}.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="h-12 w-px bg-white/5 hidden lg:block" />
                                <div className="flex items-center gap-5">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-white transition-all relative border border-white/5 group"
                                    >
                                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,124,255,0.6)] group-hover:scale-150 transition-transform"></span>
                                        <Bell className="w-5 h-5 font-light" />
                                    </motion.button>

                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-cover bg-center border border-white/10 p-0.5 shadow-lg" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${(session?.user as any)?.email}&backgroundColor=040300')` }}>
                                            <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-[9px]" />
                                        </div>
                                        <div className="hidden lg:flex flex-col">
                                            <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest mb-0.5">Tier</span>
                                            <span className="text-xs font-bold text-white tracking-tight">PRO MEMBER</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Operational Metrics */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MetricCard
                                label={isFreelancer ? 'Total Earnings' : 'Total Spent'}
                                value={`PKR ${wallet?.balancePKR?.toLocaleString() || '0'}`}
                                subLabel={wallet?.pendingPKR > 0 ? `PKR ${wallet.pendingPKR.toLocaleString()} in transit` : 'Available funds'}
                                icon="account_balance_wallet"
                                color="primary"
                            />
                            <MetricCard
                                label={isFreelancer ? 'Active Applications' : 'Open Jobs'}
                                value={isFreelancer ? applications.filter(a => a.status === 'PENDING').length : myJobs.filter(j => j.status === 'OPEN').length}
                                subLabel={`${isFreelancer ? applications.length : myJobs.length} total entries`}
                                icon="rocket_launch"
                                color="white"
                            />
                            <MetricCard
                                label={isFreelancer ? 'Available Bid Credits' : 'Successful Hires'}
                                value={isFreelancer ? credits : myJobs.filter(j => j.status === 'FILLED').length}
                                subLabel={isFreelancer ? 'Platform currency balance' : 'Team members onboarded'}
                                icon={isFreelancer ? 'bolt' : 'verified'}
                                color="primary"
                                progress={isFreelancer ? (credits / 20) * 100 : undefined}
                            />
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20">
                            {/* Pulse - Recent Activity */}
                            <section className="lg:col-span-2 flex flex-col gap-10">
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <h3 className="text-2xl font-bold tracking-tight">Recent <span className="text-primary">Activity</span></h3>
                                    <Link className="text-sm font-bold text-white/40 hover:text-primary transition-all" href="/dashboard/applications">View All</Link>
                                </div>

                                <div className="space-y-6">
                                    {isFreelancer && applications.length > 0 ? applications.slice(0, 4).map((app: any) => (
                                        <ActivityItem
                                            key={app.id}
                                            title={`Proposal: ${app.job?.title || 'Data Stream'}`}
                                            meta={`Commander: ${app.job?.employer?.profile?.fullName || 'Anon'} • Allocation: PKR ${app.job?.budgetMin?.toLocaleString()}`}
                                            status={app.status}
                                            icon="database"
                                        />
                                    )) : isEmployer && myJobs.length > 0 ? myJobs.slice(0, 4).map((job: any) => (
                                        <ActivityItem
                                            key={job.id}
                                            title={`Mission: ${job.title}`}
                                            meta={`${job._count?.applications || 0} Operatives Engaged • Range: PKR ${job.budgetMin?.toLocaleString()} - ${job.budgetMax?.toLocaleString()}`}
                                            status={job.status}
                                            icon="rocket"
                                        />
                                    )) : (
                                        <EmptyState
                                            icon={isFreelancer ? Rocket : Briefcase}
                                            title="No Pulse Detected"
                                            description={isFreelancer ? "You haven't applied to any missions yet. Initiate your first engagement and track progress here." : "No active missions under your command. Post your first requirement to recruit top-tier talent."}
                                            action={{
                                                label: isFreelancer ? "EXPLORE MISSIONS" : "DEPLOY MISSION",
                                                onClick: () => router.push(isFreelancer ? "/search" : "/jobs/post")
                                            }}
                                        />
                                    )}
                                </div>
                            </section>

                            {/* Top Recommendations */}
                            <section className="flex flex-col gap-8">
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-bold tracking-tight">{isFreelancer ? 'Recommended Jobs' : 'Top Talent'}</h3>
                                    <button className="text-white/20 hover:text-white transition-all"><span className="material-symbols-outlined text-xl">tune</span></button>
                                </div>

                                <div className="space-y-8">
                                    {isFreelancer ? (
                                        recommendedJobs.length > 0 ? recommendedJobs.slice(0, 3).map((job: any) => (
                                            <motion.div
                                                key={job.id}
                                                whileHover={{ y: -4 }}
                                                className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-3xl group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-10 h-10 bg-primary/20 text-primary border border-primary/20 rounded-lg flex items-center justify-center font-bold text-xs">
                                                        {job.employer?.profile?.fullName?.[0] || 'C'}
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">{job.matchScore}% MATCH</span>
                                                </div>
                                                <Link href={`/jobs/${job.id}`} className="block">
                                                    <h4 className="text-white font-bold text-lg tracking-tight mb-1 group-hover:text-primary transition-all leading-tight">{job.title}</h4>
                                                </Link>
                                                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">{job.employer?.profile?.fullName || 'Employer'}</p>
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {job.skills?.slice(0, 2).map((skill: any) => (
                                                        <span key={skill.id} className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] text-white/40 font-bold uppercase tracking-widest border border-white/5">{skill.name}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <span className="text-white font-bold text-base tracking-tight">PKR {job.budgetMax?.toLocaleString()}</span>
                                                    <span className="material-symbols-outlined text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <EmptyState
                                                icon="radar"
                                                title="Signal Lost"
                                                description="Matchmaking engine requiring more tactical intel. Calibrate your profile to synchronize with relevant mandates."
                                            />
                                        )
                                    ) : (
                                        /* Asset Spotlight Placeholder */
                                        <div className="bg-white/2 border border-white/5 p-8 rounded-2xl relative overflow-hidden group shadow-xl">
                                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                                <span className="material-symbols-outlined text-8xl">verified</span>
                                            </div>
                                            <div className="flex items-center gap-4 mb-6 text-primary">
                                                <span className="material-symbols-outlined text-3xl">verified</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Featured Talent</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-1">Systems Architect</h4>
                                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                                                Specialized in cloud infrastructure & security protocols.
                                            </p>
                                            <button className="w-full h-12 bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest rounded-xl text-[10px] hover:bg-primary hover:text-white transition-all">View Full Profile</button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all duration-300 group relative ${active ? 'bg-primary/10 text-primary border border-primary/10 shadow-sm' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Icon className={`w-4 h-4 ${active ? 'text-primary font-bold' : 'group-hover:text-primary'} transition-colors duration-300`} />
            <span className="text-[13px] font-bold">{label}</span>
            {active && <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}
        </Link>
    );
}

function MetricCard({ label, value, subLabel, icon, color, progress }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/2 rounded-3xl p-8 border border-white/5 shadow-2xl shadow-black relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{label}</span>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3.5 rounded-xl ${color === 'primary' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                    <span className="material-symbols-outlined text-2xl font-light">{icon}</span>
                </div>
            </div>
            <p className="text-xs text-white/30 font-medium mb-6">{subLabel}</p>
            {progress !== undefined && (
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(0,124,255,0.4)]"
                    />
                </div>
            )}
        </motion.div>
    );
}

function ActivityItem({ title, meta, status, icon }: any) {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            className="p-6 bg-white/1 border border-white/5 rounded-2xl hover:bg-white/3 hover:border-white/10 transition-all duration-500 cursor-pointer group flex items-center justify-between gap-6"
        >
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/5 text-primary flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/40 transition-all duration-500">
                    <span className="material-symbols-outlined text-2xl font-light">{icon}</span>
                </div>
                <div>
                    <p className="text-white font-bold text-lg tracking-tight mb-0.5">{title}</p>
                    <p className="text-white/20 text-xs font-medium">{meta}</p>
                </div>
            </div>
            <StatusBadge status={status} />
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let style = "bg-white/5 text-white/30 border border-white/10";
    if (['PENDING', 'OPEN'].includes(status)) style = "bg-primary/10 text-primary border border-primary/20";
    if (['HIRED', 'FILLED', 'ACTIVE'].includes(status)) style = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10";
    if (['REJECTED', 'EXPIRED', 'TERMINATED'].includes(status)) style = "bg-red-500/10 text-red-500 border border-red-500/20";

    return (
        <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${style}`}>
            {status}
        </span>
    );
}

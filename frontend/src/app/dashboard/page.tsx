'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { creditApi, walletApi, applicationApi, jobApi, orderApi, userStateApi } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
                    <div className="w-32 h-32 bg-red-500/10 text-red-500 rounded-4xl flex items-center justify-center mx-auto mb-10 border border-red-500/20">
                        <span className="material-symbols-outlined text-6xl font-light">verified_user</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Strategic <span className="text-red-500 not-italic">Verification.</span></h2>
                    <p className="text-xl text-white/40 font-bold italic mb-12 leading-tight">
                        To maintain elite operational integrity, all tactical operatives must complete identity authentication before accessing the executive command center.
                    </p>
                    {kycStatus === 'UNVERIFIED' || kycStatus === 'REJECTED' ? (
                        <div className="space-y-6">
                            <Link href="/dashboard/kyc" className="flex items-center justify-center h-24 rounded-full bg-primary text-white font-black uppercase tracking-[0.3em] text-sm w-full shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all">
                                Initialize Authentication Protocol
                            </Link>
                            {kycStatus === 'REJECTED' && (
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Previous submission compromised. Clear biometric data required.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Encryption analysis in progress...</p>
                            <button disabled className="w-full h-24 bg-white/5 text-white/20 font-black uppercase tracking-[0.3em] rounded-full text-xs border border-white/10 cursor-not-allowed">
                                Protocol Pending Approval
                            </button>
                        </div>
                    )}
                    <button onClick={() => router.push('/')} className="mt-12 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] hover:text-white transition-all italic">
                        Abort and Return to Grid
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-sans antialiased selection:bg-primary/30">
            {/* Sidebar Navigation - Tactical Wing */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[300px] md:relative transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-700 ease-[0.16, 1, 0.3, 1] bg-black border-r border-white/5 flex flex-col justify-between shrink-0 shadow-2xl shadow-black`}>
                <div className="p-10 flex flex-col gap-16">
                    {/* Logo & HQ */}
                    <Link href="/" className="flex items-center gap-5 group cursor-pointer">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 p-1 border border-white/10 group-hover:border-primary/50 transition-all duration-700">
                            <div className="w-full h-full bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
                                <span className="material-symbols-outlined text-white text-2xl font-black">bolt</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">GIGLIGO.</h1>
                            <span className="text-[9px] uppercase tracking-[0.6em] text-primary font-black">Executive Command</span>
                        </div>
                    </Link>

                    {/* Mission Control Nav */}
                    <nav className="flex flex-col gap-4">
                        <NavItem href="/dashboard" icon="dashboard" label="Overview" active />
                        <NavItem href={isFreelancer ? "/dashboard/applications" : "/dashboard/jobs"} icon="work" label={isFreelancer ? 'Missions' : 'Objectives'} />
                        <NavItem href="/dashboard/inbox" icon="chat" label="Frequency" />
                        <NavItem href="/dashboard/projects" icon="assignment" label="Logistics" />
                        <NavItem href="/dashboard/finance" icon="account_balance" label="Treasury" />
                        <NavItem href="/dashboard/earnings" icon="payments" label="Yield" />
                        <NavItem href="/dashboard/contracts" icon="gavel" label="Protocols" />
                        <NavItem href="/search" icon="person_search" label="Intel Scan" />
                    </nav>
                </div>

                <div className="p-10 flex flex-col gap-8">
                    <Link href="/dashboard/settings" className="flex items-center gap-5 px-6 py-4 rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all duration-500 group">
                        <span className="material-symbols-outlined text-2xl font-light group-hover:rotate-90 transition-transform duration-700">settings</span>
                        <span className="text-xs font-black uppercase tracking-[0.4em]">Parameters</span>
                    </Link>

                    <Link href={isFreelancer ? "/jobs" : "/jobs/post"} className="w-full">
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#007CFF', color: 'white' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-16 rounded-full border border-primary/40 text-primary text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg">{isFreelancer ? 'search' : 'add'}</span>
                            {isFreelancer ? 'Scan Grid' : 'Deploy Objective'}
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
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div className="flex items-center gap-8">
                            <button
                                className="md:hidden w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="material-symbols-outlined text-3xl">menu</span>
                            </button>
                            <div>
                                <div className="flex items-center gap-6 mb-4">
                                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Command <span className="text-primary not-italic">Center.</span></h2>
                                    <span className="px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black tracking-[0.4em] uppercase hidden sm:inline-block">Elite Operational Status</span>
                                </div>
                                <p className="text-white/30 font-bold text-xl italic leading-none">Welcome back, {(session?.user as any)?.name?.split(' ')[0] || 'Operative'}. The network is stable.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <div className="h-16 w-px bg-white/5 hidden lg:block" />
                            <div className="flex items-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 hover:text-white transition-all relative border border-white/5"
                                >
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary"></span>
                                    <span className="material-symbols-outlined text-2xl font-light">notifications</span>
                                </motion.button>

                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-cover bg-center border-2 border-primary/30 p-1" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${(session?.user as any)?.email}&backgroundColor=040300')` }}>
                                        <div className="w-full h-full bg-background-dark/20 backdrop-blur-sm rounded-lg" />
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em] mb-1">Rank</span>
                                        <span className="text-sm font-black text-white tracking-tighter uppercase">PREMIUM AGENT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Operational Metrics */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <MetricCard
                            label={isFreelancer ? 'Total Yield' : 'Total Allocation'}
                            value={`PKR ${wallet?.balancePKR?.toLocaleString() || '0'}`}
                            subLabel={wallet?.pendingPKR > 0 ? `PKR ${wallet.pendingPKR.toLocaleString()} in transit` : 'Settled funds'}
                            icon="account_balance_wallet"
                            color="primary"
                        />
                        <MetricCard
                            label={isFreelancer ? 'Active Engagements' : 'Deployed Missions'}
                            value={isFreelancer ? applications.filter(a => a.status === 'PENDING').length : myJobs.filter(j => j.status === 'OPEN').length}
                            subLabel={`${isFreelancer ? applications.length : myJobs.length} accumulated across all cycles`}
                            icon="rocket_launch"
                            color="white"
                        />
                        <MetricCard
                            label={isFreelancer ? 'Protocol Units' : 'Successful Hires'}
                            value={isFreelancer ? credits : myJobs.filter(j => j.status === 'FILLED').length}
                            subLabel={isFreelancer ? 'Executive intelligence remaining' : 'Elite talent secured'}
                            icon={isFreelancer ? 'bolt' : 'verified'}
                            color="primary"
                            progress={isFreelancer ? (credits / 20) * 100 : undefined}
                        />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20">
                        {/* Pulse - Recent Activity */}
                        <section className="lg:col-span-2 flex flex-col gap-10">
                            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Mission <span className="text-primary not-italic">Pulse.</span></h3>
                                <Link className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] hover:text-primary transition-all" href="/dashboard/applications">Analyze All</Link>
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
                                    <div className="py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                        <span className="material-symbols-outlined text-6xl text-white/5 font-thin mb-6">sensors</span>
                                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">No active signal detected.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Top Intel - Recommendations */}
                        <section className="flex flex-col gap-10">
                            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">{isFreelancer ? 'Top <span className="text-primary not-italic">Intel.</span>' : 'Top <span className="text-primary not-italic">Assets.</span>'}</h3>
                                <button className="text-white/20 hover:text-white transition-all"><span className="material-symbols-outlined font-light">tune</span></button>
                            </div>

                            <div className="space-y-8">
                                {isFreelancer ? (
                                    recommendedJobs.length > 0 ? recommendedJobs.slice(0, 3).map((job: any) => (
                                        <motion.div
                                            key={job.id}
                                            whileHover={{ y: -5 }}
                                            className="bg-white/5 border border-white/10 p-8 rounded-4xl shadow-2xl backdrop-blur-3xl group"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-primary/30 uppercase">
                                                    {job.employer?.profile?.fullName?.[0] || 'C'}
                                                </div>
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-[0.4em] rounded-full border border-primary/20">{job.matchScore}% SYNC</span>
                                            </div>
                                            <Link href={`/jobs/${job.id}`} className="block">
                                                <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-2 group-hover:text-primary transition-all leading-tight italic">{job.title}</h4>
                                            </Link>
                                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic">{job.employer?.profile?.fullName || 'COMMANDER'}</p>
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {job.skills?.slice(0, 2).map((skill: any) => (
                                                    <span key={skill.id} className="px-3 py-1 bg-white/5 rounded-full text-[8px] text-white/40 font-black uppercase tracking-[0.3em] border border-white/5">{skill.name}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                <span className="text-white font-black text-lg tracking-tighter uppercase italic">PKR {job.budgetMax?.toLocaleString()}</span>
                                                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="p-10 text-center bg-white/5 rounded-[3rem] border border-white/10">
                                            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] leading-relaxed">Update tactical competencies to calibrate AI matchmaking engines.</p>
                                        </div>
                                    )
                                ) : (
                                    /* Asset Spotlight Placeholder */
                                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                                        <div className="flex items-center gap-6 mb-8 text-primary">
                                            <span className="material-symbols-outlined text-5xl font-thin">verified</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">OPERATIVE OF THE CYCLE</span>
                                        </div>
                                        <h4 className="text-2xl font-black uppercase tracking-tighter text-white italic mb-2">Systems Architect <span className="text-primary not-italic">X.</span></h4>
                                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mb-10 leading-relaxed italic">Expert specialization in neural network deployment and cloud security infrastructure.</p>
                                        <button className="w-full h-16 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.4em] rounded-full text-[9px] hover:bg-white/10 transition-all">Scan Full Dossier</button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: string, label: string, active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-700 group relative ${active ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
            <span className={`material-symbols-outlined text-2xl font-light ${active ? 'text-white' : 'group-hover:text-primary'} transition-colors duration-700`}>{icon}</span>
            <span className="text-xs font-black uppercase tracking-[0.4em]">{label}</span>
            {active && <motion.div layoutId="nav-active" className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />}
        </Link>
    );
}

function MetricCard({ label, value, subLabel, icon, color, progress }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 rounded-[4rem] p-12 border border-white/10 shadow-3xl shadow-black relative overflow-hidden group"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
            <div className="flex justify-between items-start mb-10">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">{label}</span>
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">{value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${color === 'primary' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                    <span className="material-symbols-outlined text-2xl font-light">{icon}</span>
                </div>
            </div>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] italic mb-6">{subLabel}</p>
            {progress !== undefined && (
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(0,124,255,0.5)]"
                    />
                </div>
            )}
        </motion.div>
    );
}

function ActivityItem({ title, meta, status, icon }: any) {
    return (
        <motion.div
            whileHover={{ x: 10 }}
            className="p-8 bg-white/2 border border-white/5 rounded-4xl hover:bg-white/4 hover:border-white/10 transition-all duration-700 cursor-pointer group flex items-center justify-between gap-6"
        >
            <div className="flex items-center gap-8">
                <div className="h-16 w-16 rounded-3xl bg-white/5 text-primary flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/40 transition-all duration-700">
                    <span className="material-symbols-outlined text-2xl font-light">{icon}</span>
                </div>
                <div>
                    <p className="text-white font-black text-lg tracking-tighter uppercase italic mb-1">{title}</p>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] italic">{meta}</p>
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
        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic ${style}`}>
            {status}
        </span>
    );
}

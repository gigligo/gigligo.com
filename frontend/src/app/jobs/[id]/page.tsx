'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi, applicationApi, creditApi } from '@/lib/api';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Calendar, Users, Briefcase, Clock, AlertCircle } from 'lucide-react';

export default function JobDetailPage() {
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
            setSuccess('Application submitted! 1 credit deducted.');
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
            alert('Job deleted successfully.');
            router.push('/dashboard');
        } catch (e: any) {
            alert(e.message || 'Failed to delete job');
        }
        setDeleting(false);
        setDeleteModalOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#000] flex items-center justify-center text-[#EFEEEA]/40">
                Job not found
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#000]">
            <Navbar />
            <main className="flex-1 max-w-[900px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <Link href="/jobs" className="text-xs text-[#EFEEEA]/40 hover:text-[#FE7743] transition mb-6 inline-block">← Back to Jobs</Link>

                <div className="bg-[#111] rounded-2xl border border-white/10 p-8 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                        <div>
                            {job.isBoosted && <span className="text-[10px] font-bold text-[#FE7743] uppercase tracking-wider">⚡ Featured</span>}
                            <h1 className="text-2xl font-bold text-[#EFEEEA] mt-1">{job.title}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-sm text-[#EFEEEA]/40">
                                    Posted by {job.employer?.profile?.fullName || 'Employer'} • {job.employer?.profile?.location || 'Pakistan'}
                                </p>
                                <div className="flex gap-2">
                                    {job.employer?.paymentVerified && (
                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#4ADE80] bg-[#4ADE80]/10 px-1.5 py-0.5 rounded border border-[#4ADE80]/20">
                                            <ShieldCheck className="w-2.5 h-2.5" /> PAYMENT VERIFIED
                                        </span>
                                    )}
                                    {job.employer?.kycStatus === 'APPROVED' && (
                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#60A5FA] bg-[#60A5FA]/10 px-1.5 py-0.5 rounded border border-[#60A5FA]/20">
                                            <CheckCircle2 className="w-2.5 h-2.5" /> IDENTITY VERIFIED
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-[11px] text-[#EFEEEA]/30 mt-2 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> Posted on {new Date(job.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(job.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-xl font-bold text-[#FE7743]">PKR {job.budgetMin?.toLocaleString()} – {job.budgetMax?.toLocaleString()}</p>
                            <span className="text-xs px-3 py-1 rounded-full bg-[#273F4F]/30 text-[#EFEEEA]/60">{job.jobType}</span>
                            {session && (session as any)?.user?.id === job.employerId && job.status === 'OPEN' && (
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="text-xs px-3 py-1 mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition"
                                >
                                    Delete Job
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-xs px-3 py-1 rounded-full bg-[#FE7743]/10 text-[#FE7743] font-medium">{job.category}</span>
                        {job.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#EFEEEA]/50">{tag}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[#FE7743]/10 border border-[#FE7743]/30 rounded-xl p-4 shadow-[0_0_15px_rgba(254,119,67,0.1)]">
                            <div className="flex items-center gap-2 mb-1">
                                <Users className="w-3 h-3 text-[#FE7743]" />
                                <p className="text-[10px] text-[#FE7743] uppercase tracking-wider font-bold">Applicants</p>
                            </div>
                            <p className="text-lg font-black text-[#FE7743] leading-none">{job._count?.applications || 0}</p>
                        </div>
                        <InfoBox icon={<Briefcase className="w-3 h-3" />} label="Status" value={job.status} />
                        <InfoBox icon={<Clock className="w-3 h-3" />} label="Type" value={job.jobType} />
                        <InfoBox icon={<Calendar className="w-3 h-3" />} label="Deadline" value={job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'} />
                    </div>

                    <h2 className="font-bold text-[#EFEEEA] text-lg mb-3">Job Description</h2>
                    <div className="text-[#EFEEEA]/70 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</div>
                </div>

                {/* Apply Section — Glow and prominence */}
                {job.status === 'OPEN' && (
                    <div className="bg-linear-to-b from-[#111] to-[#0a0a0a] rounded-2xl border border-[#FE7743]/20 p-8 shadow-[0_0_50px_rgba(254,119,67,0.05)]">
                        {!session ? (
                            <div className="text-center">
                                <p className="text-[#EFEEEA] font-semibold mb-2">Want to apply for this job?</p>
                                <p className="text-xs text-[#EFEEEA]/40 mb-4">Create a freelancer account to apply and submit your proposal.</p>
                                <div className="flex gap-3 justify-center">
                                    <Link href="/login" className="px-6 py-3 bg-white/5 border border-white/10 text-[#EFEEEA] font-semibold rounded-xl text-sm hover:bg-white/10 transition">
                                        Log In
                                    </Link>
                                    <Link href="/register?role=SELLER" className="px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition">
                                        Create Account
                                    </Link>
                                </div>
                            </div>
                        ) : !isFreelancer ? (
                            <div className="text-center">
                                <p className="text-[#EFEEEA]/50 text-sm">⚠️ Only freelancers can apply to jobs. You are logged in as an employer.</p>
                            </div>
                        ) : success ? (
                            <div className="text-center">
                                <p className="text-green-400 font-semibold text-lg mb-2">✅ {success}</p>
                                <Link href="/dashboard/applications" className="text-sm text-[#FE7743] hover:underline">View My Applications</Link>
                            </div>
                        ) : !showApplyForm ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="text-[#EFEEEA] font-semibold">Apply to this job</p>
                                    <p className="text-xs text-[#EFEEEA]/40 mt-1">This will use 1 credit. You have <strong className="text-[#FE7743]">{credits}</strong> credits.</p>
                                </div>
                                {((session as any)?.kycStatus || 'UNVERIFIED') !== 'APPROVED' ? (
                                    <div className="text-right">
                                        <p className="text-red-400 text-xs mb-2 font-semibold flex items-center gap-1 justify-end">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Identity Verification Required
                                        </p>
                                        <Link href="/dashboard/kyc" className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold rounded-lg text-sm hover:bg-red-500/20 transition inline-block">
                                            Verify Identity Now
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        {credits < 1 ? (
                                            <Link href="/dashboard/credits" className="px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm">
                                                Buy Credits First
                                            </Link>
                                        ) : (
                                            <button onClick={() => setShowApplyForm(true)} className="px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition">
                                                Apply Now (1 Credit)
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleApply} className="space-y-4">
                                <h3 className="font-bold text-[#EFEEEA]">Submit Your Application</h3>
                                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
                                <div>
                                    <label className="text-xs text-[#EFEEEA]/60 font-semibold block mb-2">Cover Letter *</label>
                                    <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} required
                                        rows={6} placeholder="Explain why you're the perfect fit for this job..."
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50 resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#EFEEEA]/60 font-semibold block mb-2">Proposed Rate (PKR) — Optional</label>
                                    <input type="number" value={proposedRate} onChange={e => setProposedRate(e.target.value)}
                                        placeholder="e.g. 15000"
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#EFEEEA]/60 font-semibold block mb-2">Completion Timeline — Optional</label>
                                    <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)}
                                        placeholder="e.g. 2 weeks"
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowApplyForm(false)} className="flex-1 py-3 bg-white/5 border border-white/10 text-[#EFEEEA] font-semibold rounded-xl text-sm hover:bg-white/10 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={applying || !coverLetter} className="flex-1 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition disabled:opacity-50">
                                        {applying ? 'Submitting...' : 'Submit Application (−1 Credit)'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">Delete Job</h2>
                        <p className="text-sm text-white/60 mb-6">
                            Are you sure you want to delete this job? This action will archive it if there are hired applicants, or close it otherwise.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteJob}
                                disabled={deleting}
                                className="px-5 py-2 text-sm font-semibold bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500 flex items-center gap-2 hover:text-white transition disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

function InfoBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1 text-[#EFEEEA]/40">
                {icon}
                <p className="text-[10px] uppercase tracking-wider font-semibold">{label}</p>
            </div>
            <p className="text-sm font-bold text-[#EFEEEA]">{value}</p>
        </div>
    );
}

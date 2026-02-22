'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi, applicationApi, creditApi, chatApi } from '@/lib/api';
import Link from 'next/link';

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
    const [credits, setCredits] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            });
            setSuccess('Application submitted! 1 credit deducted.');
            setShowApplyForm(false);
            setCredits(c => c - 1);
        } catch (e: any) {
            setError(e.message);
        }
        setApplying(false);
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
                            <p className="text-sm text-[#EFEEEA]/40 mt-2">
                                Posted by {job.employer?.profile?.fullName || 'Employer'} • {job.employer?.profile?.location || 'Pakistan'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-[#FE7743]">PKR {job.budgetMin?.toLocaleString()} – {job.budgetMax?.toLocaleString()}</p>
                            <span className="text-xs px-3 py-1 rounded-full bg-[#273F4F]/30 text-[#EFEEEA]/60">{job.jobType}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-xs px-3 py-1 rounded-full bg-[#FE7743]/10 text-[#FE7743] font-medium">{job.category}</span>
                        {job.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#EFEEEA]/50">{tag}</span>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <InfoBox label="Applicants" value={`${job._count?.applications || 0}`} />
                        <InfoBox label="Status" value={job.status} />
                        <InfoBox label="Type" value={job.jobType} />
                        <InfoBox label="Deadline" value={job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'} />
                    </div>

                    <h2 className="font-bold text-[#EFEEEA] text-lg mb-3">Job Description</h2>
                    <div className="text-[#EFEEEA]/70 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</div>
                </div>

                {/* Apply Section */}
                {isFreelancer && job.status === 'OPEN' && (
                    <div className="bg-[#111] rounded-2xl border border-white/10 p-8">
                        {success ? (
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
                                        <button
                                            onClick={async () => {
                                                if (!token) return router.push('/login');
                                                try {
                                                    const myId = (session as any).user.id;
                                                    const res: any = await chatApi.findOrCreate(token, myId, job.employerId, undefined, job.id);
                                                    const convId = res?.data?.id || res?.id;
                                                    if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                } catch (error) {
                                                    console.error("Failed to start chat", error);
                                                }
                                            }}
                                            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-sm hover:bg-white/10 transition"
                                        >
                                            Message
                                        </button>
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

                {!session && job.status === 'OPEN' && (
                    <div className="bg-[#111] rounded-2xl border border-white/10 p-8 text-center">
                        <p className="text-[#EFEEEA] font-semibold mb-2">Want to apply?</p>
                        <Link href="/register?role=SELLER" className="px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition inline-block">
                            Create Account
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/3 rounded-xl p-3">
            <p className="text-[10px] text-[#EFEEEA]/40 uppercase tracking-wider font-semibold">{label}</p>
            <p className="text-sm font-bold text-[#EFEEEA] mt-1">{value}</p>
        </div>
    );
}

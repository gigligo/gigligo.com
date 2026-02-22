'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { jobApi } from '@/lib/api';
import Link from 'next/link';

const CATEGORIES = ['Web Development', 'Mobile Apps', 'Design', 'Data Science', 'Marketing', 'Writing', 'Video', 'Business', 'Other'];

export default function PostJobPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const token = (session as any)?.accessToken;

    const [form, setForm] = useState({
        title: '', description: '', category: CATEGORIES[0], budgetMin: '', budgetMax: '', deadline: '', location: '', jobType: 'REMOTE' as const, tags: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return router.push('/login');
        setLoading(true);
        setError('');
        try {
            const data = {
                ...form,
                budgetMin: parseInt(form.budgetMin),
                budgetMax: parseInt(form.budgetMax),
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                deadline: form.deadline || undefined,
                location: form.location || undefined,
            };
            await jobApi.create(token, data);
            router.push('/dashboard');
        } catch (e: any) {
            setError(e.message);
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

    return (
        <div className="flex flex-col min-h-screen bg-[#000]">
            <Navbar />
            <main className="flex-1 max-w-[700px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <Link href="/dashboard" className="text-xs text-[#EFEEEA]/40 hover:text-[#FE7743] transition mb-6 inline-block">← Back to Dashboard</Link>

                <div className="bg-[#111] rounded-2xl border border-white/10 p-8">
                    <h1 className="text-2xl font-bold text-[#EFEEEA] mb-2">Post a Job</h1>
                    <p className="text-sm text-[#EFEEEA]/40 mb-8">Free to post. Reach thousands of talented freelancers.</p>

                    {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg mb-6">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label="Job Title *">
                            <input type="text" value={form.title} onChange={e => updateField('title', e.target.value)} required
                                placeholder="e.g., Build a React Native Mobile App"
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                        </Field>

                        <Field label="Description *">
                            <textarea value={form.description} onChange={e => updateField('description', e.target.value)} required rows={6}
                                placeholder="Describe the project requirements, deliverables, and timeline..."
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50 resize-none" />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Category *">
                                <select value={form.category} onChange={e => updateField('category', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </Field>
                            <Field label="Job Type">
                                <select value={form.jobType} onChange={e => updateField('jobType', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50">
                                    <option value="REMOTE">Remote</option>
                                    <option value="ONSITE">On-site</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Budget Min (PKR) *">
                                <input type="number" value={form.budgetMin} onChange={e => updateField('budgetMin', e.target.value)} required
                                    placeholder="5000" min="0"
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                            </Field>
                            <Field label="Budget Max (PKR) *">
                                <input type="number" value={form.budgetMax} onChange={e => updateField('budgetMax', e.target.value)} required
                                    placeholder="50000" min="0"
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Deadline">
                                <input type="date" value={form.deadline} onChange={e => updateField('deadline', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50" />
                            </Field>
                            <Field label="Location">
                                <input type="text" value={form.location} onChange={e => updateField('location', e.target.value)}
                                    placeholder="Lahore, Pakistan"
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                            </Field>
                        </div>

                        <Field label="Tags (comma-separated)">
                            <input type="text" value={form.tags} onChange={e => updateField('tags', e.target.value)}
                                placeholder="react, node.js, typescript"
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm placeholder:text-[#EFEEEA]/20 focus:outline-none focus:border-[#FE7743]/50" />
                        </Field>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-[#273F4F] text-[#EFEEEA] font-bold rounded-xl text-sm hover:bg-[#273F4F]/80 transition disabled:opacity-50 mt-4">
                            {loading ? 'Publishing...' : 'Publish Job (Free)'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-xs text-[#EFEEEA]/60 font-semibold block mb-2">{label}</label>
            {children}
        </div>
    );
}

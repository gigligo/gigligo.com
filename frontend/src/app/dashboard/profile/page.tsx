'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { profileApi } from '@/lib/api';
import { Plus, Trash2, Edit2, Loader2, Link as LinkIcon, Briefcase, GraduationCap, Image as ImageIcon, MapPin, User, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileEditorPage() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'portfolio'>('basic');

    // Modals state
    const [showExpModal, setShowExpModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);
    const [showPortModal, setShowPortModal] = useState(false);

    useEffect(() => {
        if (token) loadProfile();
    }, [token]);

    const loadProfile = async () => {
        try {
            const data = await profileApi.getMine(token);
            setProfile(data);
        } catch (error: any) {
            toast.error('Failed to load profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Basic Info Submit ---
    const handleBasicSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = {
            fullName: fd.get('fullName'),
            bio: fd.get('bio'),
            location: fd.get('location'),
            hourlyRate: parseInt(fd.get('hourlyRate') as string) || 0,
            websiteUrl: fd.get('websiteUrl'),
            linkedinUrl: fd.get('linkedinUrl'),
            githubUrl: fd.get('githubUrl'),
        };
        try {
            await profileApi.updateMine(token, data);
            toast.success('Profile updated successfully!');
            loadProfile();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    // --- Delete Handlers ---
    const deleteExp = async (id: string) => {
        if (!confirm('Delete this experience?')) return;
        try { await profileApi.deleteExperience(token, id); toast.success('Deleted'); loadProfile(); } catch (err: any) { toast.error(err.message); }
    };
    const deleteEdu = async (id: string) => {
        if (!confirm('Delete this education?')) return;
        try { await profileApi.deleteEducation(token, id); toast.success('Deleted'); loadProfile(); } catch (err: any) { toast.error(err.message); }
    };
    const deletePort = async (id: string) => {
        if (!confirm('Delete this portfolio item?')) return;
        try { await profileApi.deletePortfolioItem(token, id); toast.success('Deleted'); loadProfile(); } catch (err: any) { toast.error(err.message); }
    };

    if (!session || loading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#000] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-teal-vibrant" /></div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-200">
            <Navbar />
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8" style={{ paddingTop: 100 }}>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Profile Editor</h1>

                        <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} icon={<User size={18} />} label="Basic Info" />
                        <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={18} />} label="Experience" />
                        <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<GraduationCap size={18} />} label="Education" />
                        <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<ImageIcon size={18} />} label="Portfolio" />

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                            <a href={`/profile/${profile.id}`} target="_blank" rel="noreferrer" className="w-full text-center block px-4 py-3 bg-teal-vibrant/10 text-teal-vibrant font-bold rounded-xl hover:bg-teal-vibrant/20 transition">
                                View Public Profile &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">

                        {/* ══ BASIC INFO TAB ══ */}
                        {activeTab === 'basic' && (
                            <form onSubmit={handleBasicSubmit} className="space-y-6">
                                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Full Name</label>
                                        <input name="fullName" defaultValue={profile.fullName} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-teal-vibrant focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <input name="location" defaultValue={profile.location} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-teal-vibrant focus:outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Professional Bio</label>
                                    <textarea name="bio" defaultValue={profile.bio} rows={4} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-teal-vibrant focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="I am a full-stack developer with 5 years of experience..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Hourly Rate (PKR)</label>
                                    <div className="relative max-w-xs">
                                        <DollarSign className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input type="number" name="hourlyRate" defaultValue={profile.hourlyRate} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-teal-vibrant focus:outline-none" placeholder="e.g. 5000" />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold mt-10 mb-4 border-t border-slate-200 dark:border-white/10 pt-8">Social Links</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Personal Website</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <input name="websiteUrl" defaultValue={profile.websiteUrl} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-teal-vibrant focus:outline-none" placeholder="https://" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">LinkedIn Profile</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <input name="linkedinUrl" defaultValue={profile.linkedinUrl} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-teal-vibrant focus:outline-none" placeholder="https://linkedin.com/in/..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">GitHub Profile</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <input name="githubUrl" defaultValue={profile.githubUrl} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-teal-vibrant focus:outline-none" placeholder="https://github.com/..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="px-8 py-3 bg-teal-vibrant text-slate-950 font-bold rounded-xl hover:bg-teal-vibrant/90 transition shadow-lg shadow-teal-vibrant/20">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ══ EXPERIENCE TAB ══ */}
                        {activeTab === 'experience' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Work Experience</h2>
                                    <button onClick={() => setShowExpModal(true)} className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-lg flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition">
                                        <Plus size={16} /> Add New
                                    </button>
                                </div>

                                {profile.experiences?.length === 0 ? (
                                    <p className="text-slate-500 text-center py-10">No experience added yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {profile.experiences?.map((exp: any) => (
                                            <div key={exp.id} className="p-5 border border-slate-200 dark:border-white/10 rounded-2xl flex justify-between items-start group">
                                                <div>
                                                    <h3 className="font-bold text-lg">{exp.title} at {exp.company}</h3>
                                                    <p className="text-sm text-slate-500 mb-2">
                                                        {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300">{exp.description}</p>
                                                </div>
                                                <button onClick={() => deleteExp(exp.id)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ EDUCATION TAB ══ */}
                        {activeTab === 'education' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Education</h2>
                                    <button onClick={() => setShowEduModal(true)} className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-lg flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition">
                                        <Plus size={16} /> Add New
                                    </button>
                                </div>

                                {profile.educations?.length === 0 ? (
                                    <p className="text-slate-500 text-center py-10">No education added yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {profile.educations?.map((edu: any) => (
                                            <div key={edu.id} className="p-5 border border-slate-200 dark:border-white/10 rounded-2xl flex justify-between items-start group">
                                                <div>
                                                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                                                    <p className="text-sm text-slate-800 dark:text-slate-200 mb-1">{edu.institution}</p>
                                                    <p className="text-sm text-slate-500 mb-2">{edu.startYear} - {edu.endYear || 'Present'}</p>
                                                </div>
                                                <button onClick={() => deleteEdu(edu.id)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ PORTFOLIO TAB ══ */}
                        {activeTab === 'portfolio' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Portfolio</h2>
                                    <button onClick={() => setShowPortModal(true)} className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold rounded-lg flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition">
                                        <Plus size={16} /> Add Project
                                    </button>
                                </div>

                                {profile.portfolioItems?.length === 0 ? (
                                    <p className="text-slate-500 text-center py-10">No portfolio items added yet.</p>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {profile.portfolioItems?.map((port: any) => (
                                            <div key={port.id} className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden group relative bg-slate-50 dark:bg-black flex flex-col">
                                                <div className="h-40 bg-slate-200 dark:bg-[#111] overflow-hidden">
                                                    {port.imageUrl ? (
                                                         
                                                        <img src={`http://localhost:3001${port.imageUrl}`} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={40} /></div>
                                                    )}
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-lg mb-1">{port.title}</h3>
                                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{port.description}</p>

                                                    <div className="mt-auto flex justify-between items-center">
                                                        {port.linkUrl && (
                                                            <a href={port.linkUrl} target="_blank" rel="noreferrer" className="text-teal-vibrant text-sm font-semibold hover:underline flex items-center gap-1">
                                                                <LinkIcon size={14} /> View Project
                                                            </a>
                                                        )}
                                                        <button onClick={() => deletePort(port.id)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 bg-white dark:bg-black rounded-full shadow-lg">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Modals */}
            {showExpModal && <ExperienceModal onClose={() => setShowExpModal(false)} token={token} onSuccess={loadProfile} />}
            {showEduModal && <EducationModal onClose={() => setShowEduModal(false)} token={token} onSuccess={loadProfile} />}
            {showPortModal && <PortfolioModal onClose={() => setShowPortModal(false)} token={token} onSuccess={loadProfile} />}
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button onClick={onClick} className={`w-full text-left px-4 py-3 font-semibold rounded-xl flex items-center gap-3 transition ${active ? 'bg-indigo-accent text-white shadow-md' : 'btn-ghost text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
            <span className={active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>{icon}</span> {label}
        </button>
    );
}

// Minimal inline modals for creation (can be split later)
function ExperienceModal({ onClose, token, onSuccess }: any) {
    const [submitting, setSubmitting] = useState(false);
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.target);
        const data = {
            title: fd.get('title'),
            company: fd.get('company'),
            startDate: new Date(fd.get('startDate') as string).toISOString(),
            isCurrent: fd.get('isCurrent') === 'on',
            endDate: fd.get('endDate') ? new Date(fd.get('endDate') as string).toISOString() : null,
            description: fd.get('description')
        };
        try {
            await profileApi.addExperience(token, data);
            toast.success('Experience added');
            onSuccess();
            onClose();
        } catch (err: any) { toast.error(err.message); setSubmitting(false); }
    };
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl w-full max-w-md border border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add Experience</h3>
                <form onSubmit={onSubmit} className="space-y-4 text-slate-900 dark:text-white">
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Job Title</label><input name="title" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Company</label><input name="company" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Start Date</label><input type="month" name="startDate" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                        <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">End Date</label><input type="month" name="endDate" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    </div>
                    <div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isCurrent" /> I currently work here</label></div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Description</label><textarea name="description" rows={3} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 p-3 bg-slate-200 dark:bg-white/5 rounded-lg font-bold">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 p-3 bg-teal-vibrant text-slate-950 rounded-lg font-bold disabled:opacity-50">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EducationModal({ onClose, token, onSuccess }: any) {
    const [submitting, setSubmitting] = useState(false);
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.target);
        const data = {
            degree: fd.get('degree'),
            institution: fd.get('institution'),
            startYear: parseInt(fd.get('startYear') as string),
            endYear: fd.get('endYear') ? parseInt(fd.get('endYear') as string) : null,
            description: fd.get('description')
        };
        try {
            await profileApi.addEducation(token, data);
            toast.success('Education added');
            onSuccess();
            onClose();
        } catch (err: any) { toast.error(err.message); setSubmitting(false); }
    };
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl w-full max-w-md border border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add Education</h3>
                <form onSubmit={onSubmit} className="space-y-4 text-slate-900 dark:text-white">
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Degree / Certificate</label><input name="degree" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Institution</label><input name="institution" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Start Year</label><input type="number" min="1950" max="2050" name="startYear" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                        <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">End Year</label><input type="number" min="1950" max="2050" name="endYear" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    </div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Description (Optional)</label><textarea name="description" rows={3} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 p-3 bg-slate-200 dark:bg-white/5 rounded-lg font-bold text-slate-900 dark:text-white">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 p-3 bg-teal-vibrant text-slate-950 rounded-lg font-bold disabled:opacity-50">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PortfolioModal({ onClose, token, onSuccess }: any) {
    const [submitting, setSubmitting] = useState(false);
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.target);

        try {
            await profileApi.addPortfolioItem(token, fd);
            toast.success('Portfolio item added');
            onSuccess();
            onClose();
        } catch (err: any) { toast.error(err.message); setSubmitting(false); }
    };
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl w-full max-w-md border border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Add Portfolio Project</h3>
                <form onSubmit={onSubmit} className="space-y-4 text-slate-900 dark:text-white">
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Project Title</label><input name="title" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">External Link (Optional)</label><input type="url" name="linkUrl" placeholder="https://" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Cover Image</label><input type="file" accept="image/*" name="image" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div><label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Description</label><textarea name="description" rows={3} required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 mt-1" /></div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 p-3 bg-slate-200 dark:bg-white/5 rounded-lg font-bold text-slate-900 dark:text-white">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 p-3 bg-teal-vibrant text-slate-950 rounded-lg font-bold disabled:opacity-50">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

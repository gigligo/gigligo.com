'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { profileApi } from '@/lib/api';
import { Plus, Trash2, Edit2, Loader2, Link as LinkIcon, Briefcase, GraduationCap, Image as ImageIcon, MapPin, User, DollarSign, ShieldCheck, Zap, X, Upload } from 'lucide-react';
import { PageTransition } from '@/components/ui/TacticalUI';
import NextImage from 'next/image';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
            toast.success('Dossier synchronized successfully.');
            loadProfile();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    // --- Delete Handlers ---
    const deleteExp = async (id: string) => {
        if (!confirm('Purge this experience protocol?')) return;
        try { await profileApi.deleteExperience(token, id); toast.success('Protocol purged.'); loadProfile(); } catch (err: any) { toast.error(err.message); }
    };
    const deleteEdu = async (id: string) => {
        if (!confirm('Purge this educational credential?')) return;
        try { await profileApi.deleteEducation(token, id); toast.success('Credential purged.'); loadProfile(); } catch (err: any) { toast.error(err.message); }
    };
    const deletePort = async (id: string) => {
        if (!confirm('Purge this portfolio project from archives?')) return;
        try { await profileApi.deletePortfolioItem(token, id); toast.success('Project archived.'); loadProfile(); } catch (err: any) { toast.error(err.message); }
    };

    if (!session || loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
                <Navbar />

                <main className="flex-1 w-full max-w-[1440px] mx-auto px-10 md:px-20 py-24 relative" style={{ paddingTop: 100 }}>
                    {/* Background Glow */}
                    <div className="absolute top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

                    <header className="mb-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="flex flex-col gap-4 mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    Profile <span className="text-primary">Settings</span>
                                </h1>
                                <p className="text-base md:text-lg font-medium text-white/30 max-w-2xl">
                                    Manage your professional identity, experience, and portfolio across the platform.
                                </p>
                            </div>
                        </motion.div>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                        {/* Tactical Sidebar */}
                        <aside className="w-full lg:w-80 shrink-0 space-y-12 sticky top-32">
                            <div className="space-y-2">
                                <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} icon={<User size={18} />} label="Personal Information" />
                                <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={18} />} label="Work Experience" />
                                <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<GraduationCap size={18} />} label="Education" />
                                <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<ImageIcon size={18} />} label="Portfolio" />
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <Link href={`/profile/${profile.id}`} target="_blank" className="w-full group px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all duration-300">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">View Public Profile</span>
                                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>
                        </aside>

                        {/* Operational Workspace */}
                        <div className="flex-1 bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {/* ══ CORE DOSSIER TAB ══ */}
                                {activeTab === 'basic' && (
                                    <motion.form
                                        key="basic"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleBasicSubmit}
                                        className="space-y-16"
                                    >
                                        <div className="flex flex-col lg:flex-row items-center gap-8 pb-10 border-b border-white/5">
                                            <div className="relative group shrink-0">
                                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-black border border-white/10 shadow-xl flex items-center justify-center relative transition-all duration-500">
                                                    {profile.avatarUrl ? (
                                                        <NextImage src={profile.avatarUrl} alt="Avatar" fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" sizes="200px" />
                                                    ) : (
                                                        <User size={48} className="text-white/10" />
                                                    )}
                                                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 cursor-pointer backdrop-blur-sm">
                                                        <label className="text-white text-[9px] font-bold uppercase tracking-widest cursor-pointer">
                                                            Change Photo
                                                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                                if (!e.target.files || !e.target.files[0]) return;
                                                                const fd = new FormData();
                                                                fd.append('image', e.target.files[0]);
                                                                try {
                                                                    await profileApi.updateAvatar(token, fd);
                                                                    toast.success('Avatar updated successfully.');
                                                                    loadProfile();
                                                                } catch (err: any) {
                                                                    toast.error(err.message);
                                                                }
                                                            }} />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg border-2 border-background-dark">
                                                    <ShieldCheck className="text-white" size={16} />
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1 text-center lg:text-left">
                                                <h3 className="text-xl font-bold text-white tracking-tight">Profile Image</h3>
                                                <p className="text-sm font-medium text-white/30 max-w-lg">A professional photo increases your chances of getting hired by 3x.</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-10">
                                            <InputField name="fullName" defaultValue={profile.fullName} label="FULL NAME" required />
                                            <InputField name="location" defaultValue={profile.location} label="LOCATION" icon={<MapPin size={18} />} />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60">Bio & Summary</label>
                                            <textarea name="bio" defaultValue={profile.bio} rows={6} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-base font-medium text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/5" placeholder="Define your professional mission and tactical advantages..." />
                                        </div>

                                        <div className="max-w-xs">
                                            <InputField type="number" name="hourlyRate" defaultValue={profile.hourlyRate} label="HOURLY RATE (PKR)" icon={<DollarSign size={18} />} />
                                        </div>

                                        <div className="pt-12 border-t border-white/5">
                                            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Website & Socials</h2>
                                            <div className="grid md:grid-cols-2 gap-10">
                                                <InputField name="websiteUrl" defaultValue={profile.websiteUrl} label="WEBSITE" icon={<LinkIcon size={18} />} />
                                                <InputField name="linkedinUrl" defaultValue={profile.linkedinUrl} label="LINKEDIN" icon={<LinkIcon size={18} />} />
                                                <InputField name="githubUrl" defaultValue={profile.githubUrl} label="GITHUB" icon={<LinkIcon size={18} />} />
                                            </div>
                                        </div>

                                        <div className="pt-12">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="px-8 py-3.5 bg-primary text-white text-[13px] font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                                            >
                                                Save Changes
                                            </motion.button>
                                        </div>
                                    </motion.form>
                                )}

                                {/* ══ EXPERIENCE TAB ══ */}
                                {activeTab === 'experience' && (
                                    <motion.div
                                        key="experience"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex justify-between items-center mb-10">
                                            <h2 className="text-2xl font-bold text-white tracking-tight">Work Experience</h2>
                                            <button onClick={() => setShowExpModal(true)} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all duration-300">
                                                <Plus size={16} /> ADD EXPERIENCE
                                            </button>
                                        </div>

                                        {profile.experiences?.length === 0 ? (
                                            <div className="text-center py-32 bg-black/20 rounded-[3rem] border border-white/5">
                                                <span className="material-symbols-outlined text-8xl text-white/5 mb-6">history_edu</span>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">No active operations detected in history.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-8">
                                                {profile.experiences?.map((exp: any) => (
                                                    <div key={exp.id} className="p-8 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-primary/30 transition-all duration-500">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-4">
                                                                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                                                <span className="text-primary font-bold text-[10px] uppercase tracking-widest">@{exp.company}</span>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                                {formatDate(exp.startDate)} — {exp.isCurrent ? 'PRESENT' : formatDate(exp.endDate)}
                                                            </p>
                                                            <p className="text-base text-white/40 max-w-2xl leading-relaxed">{exp.description}</p>
                                                        </div>
                                                        <button onClick={() => deleteExp(exp.id)} className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* ══ EDUCATION TAB ══ */}
                                {activeTab === 'education' && (
                                    <motion.div
                                        key="education"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex justify-between items-center mb-10">
                                            <h2 className="text-2xl font-bold text-white tracking-tight">Education</h2>
                                            <button onClick={() => setShowEduModal(true)} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all duration-300">
                                                <Plus size={16} /> ADD EDUCATION
                                            </button>
                                        </div>

                                        {profile.educations?.length === 0 ? (
                                            <div className="text-center py-32 bg-black/20 rounded-[3rem] border border-white/5">
                                                <span className="material-symbols-outlined text-8xl text-white/5 mb-6">school</span>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">No educational protocols found.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-8">
                                                {profile.educations?.map((edu: any) => (
                                                    <div key={edu.id} className="p-8 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-primary/30 transition-all duration-500">
                                                        <div className="space-y-3">
                                                            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                                                            <p className="text-primary font-bold text-[10px] uppercase tracking-widest">{edu.institution}</p>
                                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{edu.startYear} — {edu.endYear || 'PRESENT'}</p>
                                                        </div>
                                                        <button onClick={() => deleteEdu(edu.id)} className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* ══ PORTFOLIO TAB ══ */}
                                {activeTab === 'portfolio' && (
                                    <motion.div
                                        key="portfolio"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex justify-between items-center mb-10">
                                            <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio</h2>
                                            <button onClick={() => setShowPortModal(true)} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all duration-300">
                                                <Plus size={16} /> ADD PROJECT
                                            </button>
                                        </div>

                                        {profile.portfolioItems?.length === 0 ? (
                                            <div className="text-center py-32 bg-black/20 rounded-[3rem] border border-white/5">
                                                <span className="material-symbols-outlined text-8xl text-white/5 mb-6">inventory_2</span>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">No archived intelligence discovered.</p>
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 gap-10">
                                                {profile.portfolioItems?.map((port: any) => (
                                                    <div key={port.id} className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden flex flex-col group hover:border-primary/30 transition-all duration-500 shadow-xl relative">
                                                        <div className="h-56 bg-black/40 overflow-hidden relative">
                                                            {port.imageUrl ? (
                                                                <NextImage src={`${port.imageUrl}`} alt={port.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/5"><ImageIcon size={48} strokeWidth={1} /></div>
                                                            )}
                                                            <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:opacity-100 transition-all">
                                                                <button onClick={() => deletePort(port.id)} className="w-10 h-10 bg-black/80 backdrop-blur-md rounded-lg flex items-center justify-center text-white/40 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="p-8 flex-1 flex flex-col gap-4">
                                                            <h3 className="text-xl font-bold text-white tracking-tight leading-none">{port.title}</h3>
                                                            <p className="text-sm font-medium text-white/30 leading-relaxed line-clamp-2">{port.description}</p>

                                                            {port.linkUrl && (
                                                                <div className="mt-auto pt-6 border-t border-white/5">
                                                                    <a href={port.linkUrl} target="_blank" rel="noreferrer" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                                                                        <LinkIcon size={12} /> View Project
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* Modals with Cinematic Aesthetic */}
                <AnimatePresence>
                    {showExpModal && <ExperienceModal isOpen={showExpModal} onClose={() => setShowExpModal(false)} onSave={async (formData: any) => {
                        try {
                            const data = {
                                title: formData.title,
                                company: formData.company,
                                startDate: new Date(formData.startDate).toISOString(),
                                isCurrent: formData.isCurrent === 'on',
                                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                                description: formData.description
                            };
                            await profileApi.addExperience(token, data);
                            toast.success('Experience added successfully.');
                            loadProfile();
                            setShowExpModal(false);
                        } catch (err: any) {
                            toast.error(err.message);
                        }
                    }} />}
                    {showEduModal && <EducationModal isOpen={showEduModal} onClose={() => setShowEduModal(false)} onSave={async (formData: any) => {
                        try {
                            const data = {
                                degree: formData.degree,
                                institution: formData.institution,
                                startYear: parseInt(formData.startYear),
                                endYear: formData.endYear ? parseInt(formData.endYear) : null,
                                description: formData.description // EducationModal doesn't have description in the new structure, but keeping for safety if it's added later
                            };
                            await profileApi.addEducation(token, data);
                            toast.success('Education added successfully.');
                            loadProfile();
                            setShowEduModal(false);
                        } catch (err: any) {
                            toast.error(err.message);
                        }
                    }} />}
                    {showPortModal && <PortfolioModal isOpen={showPortModal} onClose={() => setShowPortModal(false)} onSave={async (formData: any) => {
                        try {
                            const fd = new FormData();
                            fd.append('title', formData.title);
                            fd.append('linkUrl', formData.linkUrl);
                            fd.append('description', formData.description);
                            if (formData.imageUrl) {
                                // Assuming imageUrl is a direct URL after upload, not a file
                                // If it's a file, the modal's internal logic should handle the upload and pass the URL
                                // For now, if imageUrl is present, we'll assume it's the final URL.
                                // The original OperationsModal used `fd` directly, implying file upload.
                                // The new PortfolioModal handles upload internally and passes `imageUrl`.
                                // So, we just pass the imageUrl as part of the data.
                                fd.append('imageUrl', formData.imageUrl);
                            }
                            await profileApi.addPortfolioItem(token, fd);
                            toast.success('Portfolio item added successfully.');
                            loadProfile();
                            setShowPortModal(false);
                        } catch (err: any) {
                            toast.error(err.message);
                        }
                    }} />}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button onClick={onClick} className={`w-full text-left px-5 py-3 rounded-xl flex items-center gap-4 transition-all duration-300 relative overflow-hidden group ${active ? 'text-primary bg-primary/10 border border-primary/20' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <span className={`relative z-10 transition-colors duration-300 ${active ? 'text-primary' : 'group-hover:text-primary'}`}>{icon}</span>
            <span className="relative z-10 text-[13px] font-bold leading-none">{label}</span>
            {active && (
                <motion.div layoutId="profile-tab-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-lg" />
            )}
        </button>
    );
}

function ExperienceModal({ isOpen, onClose, onSave }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 pb-20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-xl bg-background-dark border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight">Add Experience</h3>
                        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <form onSubmit={(e: any) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        onSave(Object.fromEntries(fd));
                    }} className="space-y-8">
                        <InputField name="title" label="JOB TITLE" placeholder="e.g. Senior Software Engineer" required />
                        <InputField name="company" label="COMPANY" placeholder="e.g. Google" required />
                        <div className="grid grid-cols-2 gap-8">
                            <InputField name="startDate" type="date" label="START DATE" required />
                            <InputField name="endDate" type="date" label="END DATE" />
                        </div>
                        <div className="flex items-center gap-3 py-2">
                            <input type="checkbox" name="isCurrent" id="isCurrent" className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary/20" />
                            <label htmlFor="isCurrent" className="text-xs font-bold text-white/40 uppercase tracking-widest">I currently work here</label>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30">DESCRIPTION</label>
                            <textarea name="description" className="w-full bg-white/2 border border-white/5 rounded-2xl p-6 text-sm text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/5 min-h-[150px]" placeholder="Describe your responsibilities and achievements..." />
                        </div>
                        <div className="pt-6">
                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                SAVE EXPERIENCE
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

function EducationModal({ isOpen, onClose, onSave }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 pb-20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-xl bg-background-dark border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight">Add Education</h3>
                        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <form onSubmit={(e: any) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        onSave(Object.fromEntries(fd));
                    }} className="space-y-8">
                        <InputField name="institution" label="INSTITUTION" placeholder="e.g. Stanford University" required />
                        <InputField name="degree" label="DEGREE / CERTIFICATION" placeholder="e.g. B.S. Computer Science" required />
                        <div className="grid grid-cols-2 gap-8">
                            <InputField name="startYear" type="number" label="START YEAR" required />
                            <InputField name="endYear" type="number" label="END YEAR (OR EXPECTED)" />
                        </div>
                        <div className="pt-6">
                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                SAVE CREDENTIALS
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

function PortfolioModal({ isOpen, onClose, onSave }: any) {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        onSave({ ...data, imageUrl });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 pb-20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-xl bg-background-dark border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight">Post Project</h3>
                        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30">PROJECT PREVIEW</label>
                            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden relative group bg-white/2">
                                {imageUrl ? (
                                    <>
                                        <NextImage src={imageUrl} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button type="button" onClick={() => setImageUrl('')} className="px-4 py-2 bg-red-500 text-white text-[10px] font-bold rounded-lg capitalize">Remove</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className={`mb-4 ${uploading ? 'animate-bounce text-primary' : 'text-white/10'}`} size={32} />
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={async (e) => {
                                            if (!e.target.files?.[0]) return;
                                            setUploading(true);
                                            const body = new FormData();
                                            body.append('image', e.target.files[0]);
                                            try {
                                                const res = await fetch('/api/upload', { method: 'POST', body });
                                                const { url } = await res.json();
                                                setImageUrl(url);
                                            } catch (err) { toast.error('Upload failed'); }
                                            setUploading(false);
                                        }} />
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{uploading ? 'TRANSMITTING...' : 'UPLOAD ARCHIVE (JPG/PNG)'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <InputField name="title" label="PROJECT TITLE" placeholder="e.g. E-Commerce Platform" required />
                        <div className="space-y-3">
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30">DESCRIPTION</label>
                            <textarea name="description" className="w-full bg-white/2 border border-white/5 rounded-2xl p-6 text-sm text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/5 min-h-[100px]" placeholder="Briefly explain your role and the tech stack used..." />
                        </div>
                        <InputField name="linkUrl" label="PROJECT LINK" placeholder="e.g. https://github.com/..." />

                        <div className="pt-6">
                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                PUBLISH TO PORTFOLIO
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

function InputField({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/30">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">{icon}</div>}
                <input
                    {...props}
                    className={`w-full bg-white/2 border border-white/5 rounded-xl ${icon ? 'pl-12' : 'px-5'} py-3 text-sm font-medium text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/5 shadow-sm`}
                />
            </div>
        </div>
    );
}

function formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

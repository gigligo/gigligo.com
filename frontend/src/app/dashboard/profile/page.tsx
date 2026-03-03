'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { profileApi } from '@/lib/api';
import { Plus, Trash2, Edit2, Loader2, Link as LinkIcon, Briefcase, GraduationCap, Image as ImageIcon, MapPin, User, DollarSign, ShieldCheck, Zap } from 'lucide-react';
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
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-10 md:px-20 py-24 relative" style={{ paddingTop: 100 }}>
                {/* Background Glow */}
                <div className="absolute top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

                <header className="mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
                                <Zap className="text-white fill-current" size={28} />
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
                                Professional <span className="text-primary not-italic">Identity.</span>
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl font-bold italic text-white/30 max-w-3xl leading-relaxed">
                            Configure your high-level dossier. This information is publicized to elite employers and tactical partners across the GIGLIGO network.
                        </p>
                    </motion.div>
                </header>

                <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                    {/* Tactical Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-12 sticky top-32">
                        <div className="space-y-4">
                            <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} icon={<User size={20} />} label="CORE DOSSIER" />
                            <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={20} />} label="FIELD OPS" />
                            <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<GraduationCap size={20} />} label="CREDENTIALS" />
                            <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<ImageIcon size={20} />} label="ARCHIVES" />
                        </div>

                        <div className="pt-12 border-t border-white/5">
                            <Link href={`/profile/${profile.id}`} target="_blank" className="w-full group px-8 py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all duration-500">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Broadcast Live</span>
                                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </aside>

                    {/* Operational Workspace */}
                    <div className="flex-1 bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden">
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
                                    <div className="flex flex-col lg:flex-row items-center gap-12 pb-16 border-b border-white/5">
                                        <div className="relative group shrink-0">
                                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center relative group-hover:scale-105 transition-all duration-700">
                                                {profile.avatarUrl ? (
                                                    <NextImage src={profile.avatarUrl} alt="Avatar" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" sizes="200px" />
                                                ) : (
                                                    <User size={64} className="text-white/10" />
                                                )}
                                                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-700 cursor-pointer backdrop-blur-sm">
                                                    <label className="text-white text-[10px] font-black uppercase tracking-[0.4em] cursor-pointer">
                                                        UPLINK IMG
                                                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                            if (!e.target.files || !e.target.files[0]) return;
                                                            const fd = new FormData();
                                                            fd.append('image', e.target.files[0]);
                                                            try {
                                                                await profileApi.updateAvatar(token, fd);
                                                                toast.success('Visual ID synchronized.');
                                                                loadProfile();
                                                            } catch (err: any) {
                                                                toast.error(err.message);
                                                            }
                                                        }} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl border-4 border-background-dark">
                                                <ShieldCheck className="text-white" size={24} />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4 text-center lg:text-left">
                                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Tactical Visualization</h3>
                                            <p className="text-lg font-bold italic text-white/30 max-w-lg leading-relaxed">Your professional biometric avatar. High-definition visuals enhance network trust and operative credibility.</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-12">
                                        <InputField name="fullName" defaultValue={profile.fullName} label="FULL LEGAL NAME" required />
                                        <InputField name="location" defaultValue={profile.location} label="OPERATIONAL BASE" icon={<MapPin size={18} />} />
                                    </div>

                                    <div className="space-y-6">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">PROFESSIONAL DIRECTIVE</label>
                                        <textarea name="bio" defaultValue={profile.bio} rows={6} className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 text-lg font-bold italic text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/5" placeholder="Define your professional mission and tactical advantages..." />
                                    </div>

                                    <div className="max-w-xs">
                                        <InputField type="number" name="hourlyRate" defaultValue={profile.hourlyRate} label="CAPITAL MANDATE (PKR/HR)" icon={<DollarSign size={18} />} />
                                    </div>

                                    <div className="pt-16 border-t border-white/5">
                                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-12">Signal Uplinks</h2>
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <InputField name="websiteUrl" defaultValue={profile.websiteUrl} label="INTEL REPOSITORY (SITE)" icon={<LinkIcon size={18} />} />
                                            <InputField name="linkedinUrl" defaultValue={profile.linkedinUrl} label="NETWORK FREQUENCY (LINKEDIN)" icon={<LinkIcon size={18} />} />
                                            <InputField name="githubUrl" defaultValue={profile.githubUrl} label="CODE ARCHIVES (GITHUB)" icon={<LinkIcon size={18} />} />
                                        </div>
                                    </div>

                                    <div className="pt-20">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="px-16 py-6 bg-primary text-white text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all italic"
                                        >
                                            SYNCHRONIZE DOSSIER
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
                                    <div className="flex justify-between items-center mb-16">
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Field <span className="text-primary not-italic">Ops.</span></h2>
                                        <button onClick={() => setShowExpModal(true)} className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center gap-4 hover:bg-primary hover:border-primary transition-all duration-500 italic">
                                            <Plus size={18} /> INITIALIZE LOG
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
                                                <div key={exp.id} className="p-10 bg-black/40 border border-white/5 rounded-[3rem] flex justify-between items-center group hover:border-primary/30 transition-all duration-700">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-6">
                                                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{exp.title}</h3>
                                                            <span className="text-primary font-black text-[9px] uppercase tracking-[0.4em]">@ {exp.company}</span>
                                                        </div>
                                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                                                            {formatDate(exp.startDate)} — {exp.isCurrent ? 'ACTIVE' : formatDate(exp.endDate)}
                                                        </p>
                                                        <p className="text-lg font-bold italic text-white/40 max-w-2xl leading-relaxed">{exp.description}</p>
                                                    </div>
                                                    <button onClick={() => deleteExp(exp.id)} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-500">
                                                        <Trash2 size={24} />
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
                                    <div className="flex justify-between items-center mb-16">
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Academic <span className="text-primary not-italic">Intel.</span></h2>
                                        <button onClick={() => setShowEduModal(true)} className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center gap-4 hover:bg-primary hover:border-primary transition-all duration-500 italic">
                                            <Plus size={18} /> ADD CREDENTIAL
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
                                                <div key={edu.id} className="p-10 bg-black/40 border border-white/5 rounded-[3rem] flex justify-between items-center group hover:border-primary/30 transition-all duration-700">
                                                    <div className="space-y-4">
                                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{edu.degree}</h3>
                                                        <p className="text-primary font-black text-[9px] uppercase tracking-[0.4em]">{edu.institution}</p>
                                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{edu.startYear} — {edu.endYear || 'PRESENT'}</p>
                                                    </div>
                                                    <button onClick={() => deleteEdu(edu.id)} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all duration-500">
                                                        <Trash2 size={24} />
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
                                    <div className="flex justify-between items-center mb-16">
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Tactical <span className="text-primary not-italic">Archives.</span></h2>
                                        <button onClick={() => setShowPortModal(true)} className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center gap-4 hover:bg-primary hover:border-primary transition-all duration-500 italic">
                                            <Plus size={18} /> UPLINK PROJECT
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
                                                <div key={port.id} className="bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-700 shadow-2xl relative">
                                                    <div className="h-64 bg-black overflow-hidden relative">
                                                        {port.imageUrl ? (
                                                            <a href={port.imageUrl} target="_blank" rel="noreferrer">
                                                                <NextImage src={`${port.imageUrl}`} alt={port.title} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition duration-1000 ease-[0.16, 1, 0.3, 1]" sizes="(max-width: 768px) 100vw, 33vw" />
                                                            </a>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/5 bg-white/2"><ImageIcon size={64} strokeWidth={1} /></div>
                                                        )}
                                                        <div className="absolute top-6 right-6">
                                                            <button onClick={() => deletePort(port.id)} className="w-12 h-12 bg-black/80 backdrop-blur-3xl rounded-xl flex items-center justify-center text-white/40 hover:text-red-500 transition-colors shadow-black shadow-2xl">
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-10 flex-1 flex flex-col gap-6">
                                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{port.title}</h3>
                                                        <p className="text-lg font-bold italic text-white/30 leading-relaxed line-clamp-3">{port.description}</p>

                                                        {port.linkUrl && (
                                                            <div className="mt-auto pt-6 border-t border-white/5">
                                                                <a href={port.linkUrl} target="_blank" rel="noreferrer" className="text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors flex items-center gap-3 italic">
                                                                    <LinkIcon size={14} /> Intelligence Uplink
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
                {showExpModal && <OperationsModal type="Experience" onClose={() => setShowExpModal(false)} token={token} onSuccess={loadProfile} />}
                {showEduModal && <OperationsModal type="Education" onClose={() => setShowEduModal(false)} token={token} onSuccess={loadProfile} />}
                {showPortModal && <OperationsModal type="Portfolio" onClose={() => setShowPortModal(false)} token={token} onSuccess={loadProfile} />}
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button onClick={onClick} className={`w-full text-left px-10 py-5 rounded-2xl flex items-center gap-6 transition-all duration-700 relative overflow-hidden group ${active ? 'text-white' : 'text-white/20 hover:text-white hover:bg-white/5'}`}>
            {active && (
                <motion.div layoutId="profile-tab-bg" className="absolute inset-0 bg-primary z-0 shadow-2xl shadow-primary/30" />
            )}
            <span className={`relative z-10 transition-colors duration-700 ${active ? 'text-white' : 'group-hover:text-primary'}`}>{icon}</span>
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">{label}</span>
        </button>
    );
}

function InputField({ label, icon, ...props }: any) {
    return (
        <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">{icon}</div>}
                <input
                    {...props}
                    className={`w-full bg-black/40 border border-white/5 rounded-2xl ${icon ? 'pl-16' : 'px-8'} py-5 text-sm font-bold italic text-white focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/5`}
                />
            </div>
        </div>
    );
}

function formatDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

// Unified Tactical Modal
function OperationsModal({ type, onClose, token, onSuccess }: any) {
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.target);

        try {
            if (type === 'Experience') {
                const data = {
                    title: fd.get('title'),
                    company: fd.get('company'),
                    startDate: new Date(fd.get('startDate') as string).toISOString(),
                    isCurrent: fd.get('isCurrent') === 'on',
                    endDate: fd.get('endDate') ? new Date(fd.get('endDate') as string).toISOString() : null,
                    description: fd.get('description')
                };
                await profileApi.addExperience(token, data);
            } else if (type === 'Education') {
                const data = {
                    degree: fd.get('degree'),
                    institution: fd.get('institution'),
                    startYear: parseInt(fd.get('startYear') as string),
                    endYear: fd.get('endYear') ? parseInt(fd.get('endYear') as string) : null,
                    description: fd.get('description')
                };
                await profileApi.addEducation(token, data);
            } else if (type === 'Portfolio') {
                await profileApi.addPortfolioItem(token, fd);
            }
            toast.success(`${type} directive synchronized.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message);
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-background-dark border border-white/10 p-12 lg:p-16 rounded-[4rem] w-full max-w-2xl shadow-3xl shadow-black relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-12">Initialize <span className="text-primary not-italic">{type}.</span></h3>

                <form onSubmit={onSubmit} className="space-y-8">
                    {type === 'Experience' && (
                        <>
                            <InputField name="title" label="OPERATIONAL ROLE" required />
                            <InputField name="company" label="TACTICAL ENTITY (COMPANY)" required />
                            <div className="grid grid-cols-2 gap-8">
                                <InputField type="month" name="startDate" label="COMMENCEMENT" required />
                                <InputField type="month" name="endDate" label="TERMINATION" />
                            </div>
                            <div className="flex items-center gap-4">
                                <input type="checkbox" name="isCurrent" id="isCurrent" className="size-6 bg-black border-white/10 rounded-lg text-primary focus:ring-primary" />
                                <label htmlFor="isCurrent" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">STILL ENGAGED AT ENTITY</label>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">OPERATIONAL RECAP</label>
                                <textarea name="description" rows={3} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-bold italic text-white focus:border-primary/50 focus:outline-none transition-all" />
                            </div>
                        </>
                    )}

                    {type === 'Education' && (
                        <>
                            <InputField name="degree" label="CREDENTIAL / MANDATE" required />
                            <InputField name="institution" label="ACADEMIC COMMAND" required />
                            <div className="grid grid-cols-2 gap-8">
                                <InputField type="number" name="startYear" label="INCEPTION YEAR" required />
                                <InputField type="number" name="endYear" label="GRADUATION YEAR" />
                            </div>
                        </>
                    )}

                    {type === 'Portfolio' && (
                        <>
                            <InputField name="title" label="PROJECT CODENAME" required />
                            <InputField name="linkUrl" label="INTEL LINK (URL)" placeholder="https://" />
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">TACTICAL VISUAL (FILE)</label>
                                <div className="relative">
                                    <input type="file" accept="image/*" name="image" className="w-full bg-black/40 border border-white/5 rounded-2xl px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-white italic file:hidden cursor-pointer" />
                                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined">upload_file</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">MISSION SUMMARY</label>
                                <textarea name="description" rows={3} required className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-bold italic text-white focus:border-primary/50 focus:outline-none transition-all" />
                            </div>
                        </>
                    )}

                    <div className="flex gap-6 pt-12">
                        <button type="button" onClick={onClose} className="flex-1 px-8 py-5 bg-white/5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] text-white/30 hover:text-white transition-all">ABORT</button>
                        <button type="submit" disabled={submitting} className="flex-1 px-8 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 hover:bg-primary-dark transition-all disabled:opacity-50 italic">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'SYNCHRONIZE'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

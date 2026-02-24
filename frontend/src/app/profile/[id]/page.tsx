'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { profileApi, reviewApi } from '@/lib/api';
import { Loader2, MapPin, Link as LinkIcon, Briefcase, GraduationCap, CheckCircle, ExternalLink, Globe, Github, Linkedin, Calendar, Star } from 'lucide-react';

export default function PublicProfilePage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [params.id]);

    const loadData = async () => {
        try {
            const pData = await profileApi.getPublic(params.id);
            setProfile(pData);
            const rData = await reviewApi.getForSeller(pData.user.id);
            setReviews(rData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#000] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-teal-vibrant" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#000] flex items-center justify-center text-slate-500">
                <h2>Profile not found.</h2>
            </div>
        );
    }

    const { user, experiences, educations, portfolioItems, skills } = profile;
    const isSeller = user.role === 'SELLER' || user.role === 'STUDENT';
    const joinedDate = new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-200">
            <Navbar />

            {/* Custom Background Banner (LinkedIn style) */}
            <div className="h-48 md:h-64 w-full bg-linear-to-r from-teal-vibrant/20 to-purple-500/20 mt-[80px]"></div>

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 -mt-24 pb-20 relative z-10">

                {/* ══ HERO CARD ══ */}
                <div className="bg-white dark:bg-[#111] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-white/5 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-white dark:border-[#111] overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            {profile.avatarUrl ? (

                                <img src={`${profile.avatarUrl}`} alt={profile.fullName} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                                <span className="text-4xl font-bold text-slate-400">{profile.fullName?.charAt(0)}</span>
                            )}
                        </div>

                        {/* Highlights */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold flex items-center gap-2">
                                        {profile.fullName}
                                        {(profile.verifiedStudent || user.kycStatus === 'APPROVED') && <CheckCircle className="text-teal-vibrant" size={20} />}
                                    </h1>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{isSeller ? 'Freelancer' : 'Employer'}</p>

                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                        {profile.location && <span className="flex items-center gap-1"><MapPin size={16} /> {profile.location}</span>}
                                        <span className="flex items-center gap-1"><Calendar size={16} /> Joined {joinedDate}</span>
                                        {profile.hourlyRate > 0 && <span className="flex items-center gap-1 font-semibold text-teal-vibrant">PKR {profile.hourlyRate}/hr</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isSeller && <button className="px-6 py-2.5 bg-teal-vibrant text-slate-950 font-bold rounded-xl hover:bg-teal-vibrant/90 shadow-lg shadow-teal-vibrant/20 transition">Hire Me</button>}
                                    <button className="px-6 py-2.5 bg-slate-200 dark:bg-white/5 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-white/10 transition">Message</button>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3 mt-4">
                                {profile.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="p-2 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition"><Globe size={18} /></a>}
                                {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition"><Linkedin size={18} /></a>}
                                {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="p-2 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition"><Github size={18} /></a>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 cursor-default">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* About */}
                        {profile.bio && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-xl font-bold mb-4">About</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                            </div>
                        )}

                        {/* Portfolio */}
                        {portfolioItems?.length > 0 && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-xl font-bold mb-6">Portfolio</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {portfolioItems.map((port: any) => (
                                        <div key={port.id} className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden group bg-slate-50 dark:bg-black">
                                            <div className="h-48 overflow-hidden bg-slate-200 dark:bg-[#111]">
                                                {port.imageUrl ? (

                                                    <img src={`${port.imageUrl}`} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-lg mb-2">{port.title}</h3>
                                                <p className="text-sm text-slate-500 mb-3">{port.description}</p>
                                                {port.linkUrl && (
                                                    <a href={port.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-vibrant hover:underline">
                                                        View Live <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experience */}
                        {experiences?.length > 0 && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase size={22} className="text-slate-400" /> Experience</h2>
                                <div className="space-y-6">
                                    {experiences.map((exp: any, idx: number) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10">
                                            <div className="absolute w-3 h-3 bg-teal-vibrant rounded-full -left-[7px] top-1.5 border-2 border-white dark:border-[#111]"></div>
                                            <h3 className="font-bold text-lg">{exp.title}</h3>
                                            <p className="text-slate-800 dark:text-slate-200 font-medium mb-1">{exp.company}</p>
                                            <p className="text-sm text-slate-500 mb-2">
                                                {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-xl font-bold mb-6">Client Reviews</h2>
                                <div className="space-y-4">
                                    {reviews.map((rev: any) => (
                                        <div key={rev.id} className="p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-black">
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} size={16} className={star <= rev.rating ? 'fill-orange text-orange' : 'text-slate-300 dark:text-slate-700'} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>
                                            <p className="text-xs text-slate-500 mt-2 font-semibold">- {rev.reviewer?.profile?.fullName || 'Anonymous'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: Sidebar Items */}
                    <div className="space-y-8">

                        {/* Skills */}
                        {skills?.length > 0 && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-lg font-bold mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {educations?.length > 0 && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><GraduationCap size={20} className="text-slate-400" /> Education</h2>
                                <div className="space-y-4">
                                    {educations.map((edu: any) => (
                                        <div key={edu.id}>
                                            <h3 className="font-bold">{edu.degree}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{edu.institution}</p>
                                            <p className="text-xs text-slate-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {profile.languages?.length > 0 && (
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 shadow-xs border border-slate-200 dark:border-white/5">
                                <h2 className="text-lg font-bold mb-4">Languages</h2>
                                <ul className="space-y-2">
                                    {profile.languages.map((lang: string, idx: number) => (
                                        <li key={idx} className="text-slate-600 dark:text-slate-300 flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-teal-vibrant before:rounded-full">
                                            {lang}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}

'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { profileApi, reviewApi } from '@/lib/api';
import {
    Loader2, MapPin, Briefcase, GraduationCap,
    CheckCircle, ExternalLink, Globe, Github,
    Linkedin, Calendar, Star, ShieldCheck,
    CreditCard, FileCheck, Check
} from 'lucide-react';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Resolve the actual ID: if 'me', we'll use the authenticated endpoint instead
    const isSelf = resolvedParams.id === 'me';
    const resolvedId = isSelf ? (session?.user?.id || null) : resolvedParams.id;
    const token = (session as any)?.accessToken;

    useEffect(() => {
        if (isSelf && !token) {
            // Wait for session to load
            if (session === undefined) return;
            setLoading(false);
            return;
        }
        if (!isSelf && !resolvedId) {
            setLoading(false);
            return;
        }
        loadData();
    }, [resolvedId, token, session]);

    const loadData = async () => {
        try {
            let pData;
            if (isSelf && token) {
                // Use authenticated endpoint to fetch own profile
                pData = await profileApi.getMine(token);
            } else if (resolvedId) {
                pData = await profileApi.getPublic(resolvedId);
            } else {
                setLoading(false);
                return;
            }
            setProfile(pData);
            try {
                const userId = pData.user?.id || pData.userId;
                if (userId) {
                    const rData = await reviewApi.getForSeller(userId);
                    setReviews(rData);
                }
            } catch { /* reviews may fail silently */ }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const user = profile?.user;
    if (!user) {
        return (
            <div className="min-h-screen bg-[#000]">
                <Navbar />
                <div className="pt-32 px-6 text-center">
                    <h2 className="text-2xl font-bold text-[#EFEEEA]">User Not Found</h2>
                    <p className="text-[#EFEEEA]/60 mt-2">The profile you're looking for doesn't exist.</p>
                    <Link href="/" className="mt-8 inline-block bg-[#FE7743] text-white px-8 py-3 rounded-xl font-bold">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const experiences = profile.experiences || [];
    const educations = profile.educations || [];
    const portfolioItems = profile.portfolioItems || [];
    const isSeller = user.role === 'SELLER' || user.role === 'STUDENT';
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '';

    return (
        <div className="min-h-screen bg-[#000] text-[#EFEEEA] pt-24">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-[#111] rounded-3xl border border-white/10 p-8 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(254,119,67,0.05)_0%,transparent_70%)] pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10 text-center">
                                <div className="w-40 h-40 rounded-full bg-white/10 mx-auto p-1.5 border-2 border-[#FE7743]/30 relative group-hover:border-[#FE7743] transition-all duration-500 shadow-2xl shadow-[#FE7743]/10 mb-6">
                                    {user?.image ? (
                                        <img src={user.image} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-5xl font-black text-white">
                                            {user?.fullName?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-[#FE7743] transition-colors">{user?.fullName}</h1>
                                <p className="text-[#FE7743] font-bold text-sm tracking-widest uppercase mb-4 opacity-80">{user?.role === 'SELLER' ? 'Pro Freelancer' : 'Top Client'}</p>

                                <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm text-slate-500">
                                    {profile.location && <span className="flex items-center gap-1"><MapPin size={16} /> {profile.location}</span>}
                                    <span className="flex items-center gap-1"><Calendar size={16} /> Joined {joinedDate}</span>
                                    {profile.hourlyRate > 0 && <span className="flex items-center gap-1 font-semibold text-teal-400">PKR {profile.hourlyRate}/hr</span>}
                                </div>
                                <div className="flex gap-2 justify-center mt-6">
                                    {isSeller && <button className="px-6 py-2.5 bg-[#FE7743] text-white font-bold rounded-xl hover:bg-[#FE7743]/90 shadow-lg shadow-[#FE7743]/20 transition">Hire Me</button>}
                                    <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-[#EFEEEA] font-bold rounded-xl hover:bg-white/10 transition">Message</button>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center justify-center gap-3 mt-6">
                                    {[
                                        { icon: <Github size={18} />, href: profile.githubUrl },
                                        { icon: <Linkedin size={18} />, href: profile.linkedinUrl },
                                        { icon: <Globe size={18} />, href: profile.websiteUrl }
                                    ].filter(s => s.href).map((link, i) => (
                                        <a key={i} href={link.href} target="_blank" rel="noreferrer" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition text-[#EFEEEA]/60 hover:text-[#EFEEEA]">
                                            {link.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Identity & Verification */}
                        <div className="bg-[#111] rounded-3xl border border-white/10 p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-teal-400" /> Verifications
                            </h3>
                            <div className="space-y-4">
                                <VerificationBadge
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Payment Method"
                                    isVerified={user.paymentVerified}
                                />
                                <VerificationBadge
                                    icon={<FileCheck className="w-4 h-4" />}
                                    label="Identity (KYC)"
                                    isVerified={user.kycStatus === 'APPROVED'}
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatBox label="Member Since" value={new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} />
                            <StatBox label="Last Active" value="Today" />
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Bio */}
                        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-white mb-6">About</h2>
                            <p className="text-[#EFEEEA]/70 leading-relaxed text-lg whitespace-pre-line">
                                {user.profile?.bio || `${user.fullName} hasn't added a bio yet.`}
                            </p>
                        </div>

                        {/* Skills */}
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                                <h3 className="text-lg font-bold text-white mb-6">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill: string) => (
                                        <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-[#EFEEEA]/80">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Portfolio */}
                        {portfolioItems?.length > 0 && (
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-white mb-6">Portfolio</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {portfolioItems.map((port: any) => (
                                        <div key={port.id} className="border border-white/10 rounded-2xl overflow-hidden group bg-black">
                                            <div className="h-48 overflow-hidden bg-[#111]">
                                                {port.imageUrl ? (
                                                    <img src={`${port.imageUrl}`} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-lg mb-2 text-white">{port.title}</h3>
                                                <p className="text-sm text-[#EFEEEA]/70 mb-3">{port.description}</p>
                                                {port.linkUrl && (
                                                    <a href={port.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#FE7743] hover:underline">
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
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Briefcase size={22} className="text-[#EFEEEA]/30" /> Experience</h2>
                                <div className="space-y-6">
                                    {experiences.map((exp: any) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-white/10">
                                            <div className="absolute w-3 h-3 bg-[#FE7743] rounded-full -left-[7px] top-1.5 border-2 border-[#111]"></div>
                                            <h3 className="font-bold text-lg text-white">{exp.title}</h3>
                                            <p className="text-[#EFEEEA]/80 font-medium mb-1">{exp.company}</p>
                                            <p className="text-sm text-[#EFEEEA]/60 mb-2">
                                                {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                                            </p>
                                            <p className="text-sm text-[#EFEEEA]/70">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {educations?.length > 0 && (
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><GraduationCap size={22} className="text-[#EFEEEA]/30" /> Education</h2>
                                <div className="space-y-4">
                                    {educations.map((edu: any) => (
                                        <div key={edu.id}>
                                            <h3 className="font-bold text-white">{edu.degree}</h3>
                                            <p className="text-sm text-[#EFEEEA]/80">{edu.institution}</p>
                                            <p className="text-xs text-[#EFEEEA]/60">{edu.startYear} - {edu.endYear || 'Present'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-white mb-6">Client Reviews</h2>
                                <div className="space-y-4">
                                    {reviews.map((rev: any) => (
                                        <div key={rev.id} className="p-4 border border-white/10 rounded-2xl bg-black">
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} size={16} className={star <= rev.rating ? 'fill-[#FE7743] text-[#FE7743]' : 'text-white/10'} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#EFEEEA]/70 italic">"{rev.comment}"</p>
                                            <p className="text-xs text-[#EFEEEA]/60 mt-2 font-semibold">- {rev.reviewer?.profile?.fullName || 'Anonymous'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {profile.languages?.length > 0 && (
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
                                <h2 className="text-2xl font-bold text-white mb-6">Languages</h2>
                                <ul className="space-y-2">
                                    {profile.languages.map((lang: string, idx: number) => (
                                        <li key={idx} className="text-[#EFEEEA]/70 flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#FE7743] before:rounded-full">
                                            {lang}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function StatBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center group hover:border-[#FE7743]/50 transition-all duration-300">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-[#FE7743] transition-colors">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
        </div>
    );
}

function VerificationBadge({ icon, label, isVerified }: { icon: any, label: string, isVerified: boolean }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/5 group last:border-0">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isVerified ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'}`}>
                    {icon}
                </div>
                <span className="text-sm font-bold text-[#EFEEEA]/80">{label}</span>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${isVerified ? 'bg-teal-500 text-white' : 'bg-[#EFEEEA]/5 text-[#EFEEEA]/20'}`}>
                {isVerified ? 'Verified' : 'Unverified'}
            </span>
        </div>
    );
}

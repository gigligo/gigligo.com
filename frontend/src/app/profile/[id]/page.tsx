'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { profileApi, reviewApi } from '@/lib/api';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isSelf = resolvedParams.id === 'me';
    const resolvedId = isSelf ? (session?.user?.id || null) : resolvedParams.id;
    const token = (session as any)?.accessToken;

    useEffect(() => {
        if (isSelf && !token) {
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
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const user = profile?.user;
    if (!user) {
        return (
            <div className="min-h-screen bg-background-light">
                <Navbar />
                <div className="pt-32 px-6 text-center">
                    <h2 className="text-2xl font-bold text-text-main">User Not Found</h2>
                    <p className="text-text-muted mt-2">The profile you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/" className="mt-8 inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
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
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 font-sans antialiased">
            <Navbar />

            {/* Profile Hero Header */}
            <section className="relative bg-slate-900 dark:bg-slate-950 text-white overflow-hidden" style={{ paddingTop: 96 }}>
                {/* Abstract Background */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 border border-white/10 rotate-45 translate-y-1/3"></div>
                </div>

                <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Avatar */}
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-primary/30 overflow-hidden shrink-0 shadow-2xl shadow-primary/10">
                            {profile?.avatarUrl ? (
                                <Image src={profile.avatarUrl} alt={profile.fullName || user.fullName} fill className="object-cover" sizes="160px" />
                            ) : (
                                <div className="w-full h-full bg-white/10 flex items-center justify-center text-5xl font-black text-white">
                                    {(profile?.fullName || user?.fullName)?.[0] || 'U'}
                                </div>
                            )}
                        </div>

                        {/* Name & Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    {profile?.fullName || user?.fullName}
                                </h1>
                                {(user?.isFoundingMember || user?.role === 'PRO' || profile?.sellerLevel === 'TOP_RATED') && (
                                    <div className="flex items-center gap-1 px-3 py-1 bg-linear-to-r from-amber-400 to-yellow-600 text-white rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                        <span>{user?.isFoundingMember ? 'Founding PRO' : 'PRO'}</span>
                                    </div>
                                )}
                            </div>
                            {profile?.bio && (
                                <p className="text-white/50 text-lg font-normal italic max-w-xl leading-relaxed mb-5">
                                    &ldquo;{profile.bio.slice(0, 120)}{profile.bio.length > 120 ? '...' : ''}&rdquo;
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                                {profile.location && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-lg">location_on</span>
                                        {profile.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                    Joined {joinedDate}
                                </span>
                                {profile.hourlyRate > 0 && (
                                    <span className="flex items-center gap-1.5 text-primary font-semibold">
                                        PKR {profile.hourlyRate}/hr
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons & Social */}
                        <div className="flex flex-col gap-3 items-start md:items-end shrink-0">
                            <div className="flex gap-3">
                                {isSeller && (
                                    <button className="h-12 px-8 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-sm tracking-wide">
                                        Hire Me
                                    </button>
                                )}
                                <button className="h-12 px-6 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
                                    Message
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                {[
                                    { icon: 'language', href: profile.websiteUrl },
                                    { icon: 'link', href: profile.linkedinUrl },
                                    { icon: 'mail', href: profile.githubUrl }
                                ].filter(s => s.href).map((link, i) => (
                                    <a key={i} href={link.href} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 hover:border-white/20 transition-all text-white/40 hover:text-white/80">
                                        <span className="material-symbols-outlined text-lg">{link.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Sidebar */}
                    <div className="space-y-6">
                        {/* Specialization */}
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">category</span>
                                    Specialization
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1.5 bg-background-light border border-border-light rounded-lg text-xs font-semibold text-text-main">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {educations?.length > 0 && (
                            <div className="bg-surface-light border border-border-light rounded-xl p-6">
                                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">school</span>
                                    Education
                                </h3>
                                <div className="space-y-3">
                                    {educations.map((edu: any) => (
                                        <div key={edu.id}>
                                            <p className="font-bold text-text-main text-sm">{edu.degree}</p>
                                            <p className="text-xs text-text-muted">{edu.institution}</p>
                                            <p className="text-[11px] text-text-muted/60">{edu.startYear} – {edu.endYear || 'Present'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Verification */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                                Verifications
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-text-main">Payment Method</span>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${user.paymentVerified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-background-light text-text-muted border border-border-light'}`}>
                                        {user.paymentVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-text-main">Identity (KYC)</span>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${user.kycStatus === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-background-light text-text-muted border border-border-light'}`}>
                                        {user.kycStatus === 'APPROVED' ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        {profile.languages?.length > 0 && (
                            <div className="bg-surface-light border border-border-light rounded-xl p-6">
                                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">translate</span>
                                    Languages
                                </h3>
                                <ul className="space-y-2">
                                    {profile.languages.map((lang: string, idx: number) => (
                                        <li key={idx} className="text-sm text-text-main font-medium flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                            {lang}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                            <h2 className="text-xl font-bold text-text-main mb-5 tracking-tight">About</h2>
                            <p className="text-text-muted leading-relaxed text-[15px] whitespace-pre-line">
                                {user.profile?.bio || `${user.fullName} hasn't added a bio yet.`}
                            </p>
                        </div>

                        {/* Selected Works / Portfolio */}
                        {portfolioItems?.length > 0 && (
                            <div className="bg-surface-light border border-border-light rounded-xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-text-main tracking-tight">Selected Works</h2>
                                    <span className="text-xs text-primary font-bold uppercase tracking-wider cursor-pointer hover:text-primary-dark transition-colors">View All</span>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    {portfolioItems.map((port: any) => (
                                        <div key={port.id} className="border border-border-light rounded-xl overflow-hidden group bg-background-light hover:border-primary/30 transition-all duration-300">
                                            <div className="h-44 overflow-hidden bg-background-light">
                                                {port.imageUrl ? (
                                                    <Image src={`${port.imageUrl}`} alt={port.title} fill className="object-cover group-hover:scale-105 transition duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-text-muted/30">
                                                        <span className="material-symbols-outlined text-4xl">image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{port.title}</h3>
                                                <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{port.description}</p>
                                                {port.linkUrl && (
                                                    <a href={port.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark mt-3 transition-colors">
                                                        View Live
                                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
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
                            <div className="bg-surface-light border border-border-light rounded-xl p-8">
                                <h2 className="text-xl font-bold text-text-main mb-6 tracking-tight flex items-center gap-2">
                                    <span className="material-symbols-outlined text-text-muted/40">work</span>
                                    Experience
                                </h2>
                                <div className="space-y-6">
                                    {experiences.map((exp: any) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-border-light">
                                            <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-surface-light"></div>
                                            <h3 className="font-bold text-text-main">{exp.title}</h3>
                                            <p className="text-text-muted font-medium text-sm mb-1">{exp.company}</p>
                                            <p className="text-xs text-text-muted/60 mb-2">
                                                {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} – {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                                            </p>
                                            <p className="text-sm text-text-muted leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div className="bg-surface-light border border-border-light rounded-xl p-8">
                                <h2 className="text-xl font-bold text-text-main mb-6 tracking-tight">Client Reviews</h2>
                                <div className="space-y-4">
                                    {reviews.map((rev: any) => (
                                        <div key={rev.id} className="p-5 border border-border-light rounded-xl bg-background-light">
                                            <div className="flex items-center gap-0.5 mb-3">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className={`material-symbols-outlined text-lg ${star <= rev.rating ? 'text-primary' : 'text-border-light'}`} style={{ fontVariationSettings: star <= rev.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-text-muted italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                                            <p className="text-xs text-text-muted/60 mt-3 font-semibold">— {rev.reviewer?.profile?.fullName || 'Anonymous'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { profileApi, reviewApi } from '@/lib/api';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const user = profile?.user;
    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-48 px-6 text-center">
                    <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Profile Not Authorized</h2>
                    <p className="text-text-muted mt-4 font-lora italic text-xl">The mission parameters for this individual are currently restricted.</p>
                    <Link href="/" className="mt-12 inline-block text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-primary pb-2 hover:text-primary transition-colors">
                        Return to Command
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
        <div className="min-h-screen bg-white text-black font-inter selection:bg-primary/30 antialiased overflow-x-hidden">
            <Navbar />

            {/* Editorial Profile Header */}
            <section className="bg-white pt-40 pb-24 border-b border-black/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-16">
                        {/* B&W Portrait with Gold Stake */}
                        <div className="relative group">
                            <div className="absolute -left-4 top-10 bottom-10 w-[2px] bg-[#c9a227] hidden md:block" />
                            <div className="w-64 h-80 relative overflow-hidden bg-black/5">
                                {profile?.avatarUrl ? (
                                    <Image
                                        src={profile.avatarUrl}
                                        alt={profile.fullName || user.fullName}
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                        sizes="300px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-8xl font-black text-black/5 uppercase">
                                        {(profile?.fullName || user?.fullName)?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Identity Pillar */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
                                    {profile?.fullName || user?.fullName}
                                </h1>
                                {profile.sellerLevel === 'TOP_RATED' && (
                                    <span className="inline-flex items-center gap-2 px-6 py-2 bg-[#c9a227] text-white text-[10px] font-black uppercase tracking-widest rounded-full self-center md:self-auto">
                                        Elite Operative
                                    </span>
                                )}
                            </div>

                            <p className="text-2xl md:text-3xl text-text-muted font-lora italic leading-relaxed mb-10 max-w-3xl">
                                {profile?.bio || "No mission bio provided yet."}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227] mb-1">Status</span>
                                    <span className="text-lg font-black uppercase tracking-tighter">Active Agent</span>
                                </div>
                                {profile.location && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227] mb-1">Base</span>
                                        <span className="text-lg font-black uppercase tracking-tighter">{profile.location}</span>
                                    </div>
                                )}
                                {profile.hourlyRate > 0 && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a227] mb-1">Rate</span>
                                        <span className="text-lg font-black uppercase tracking-tighter">PKR {profile.hourlyRate}/Hr</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Stack */}
                        <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                            {isSeller && !isSelf && (
                                <button className="h-16 px-12 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#c9a227] transition-all duration-500">
                                    Initiate Contract
                                </button>
                            )}
                            <button className="h-16 px-12 border-2 border-black text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500">
                                Message Agent
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tactical Briefing - Skills & Portfolio */}
            <div className="max-w-6xl mx-auto px-6 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-24">

                    {/* Sidebar Stats */}
                    <div className="space-y-16">
                        {profile.skills && profile.skills.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a227] mb-8">Specializations</h3>
                                <div className="flex flex-col gap-4">
                                    {profile.skills.map((skill: string) => (
                                        <span key={skill} className="text-sm font-black uppercase tracking-tighter border-b border-black/5 pb-2">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {educations?.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a227] mb-8">Authorizations</h3>
                                <div className="space-y-8">
                                    {educations.map((edu: any) => (
                                        <div key={edu.id}>
                                            <p className="text-sm font-black uppercase tracking-tighter leading-none mb-2">{edu.degree}</p>
                                            <p className="text-xs text-text-muted font-lora italic">{edu.institution}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a227] mb-8">Verification</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                                    <span>Identity</span>
                                    <span className={user.kycStatus === 'APPROVED' ? 'text-[#c9a227]' : ''}>{user.kycStatus === 'APPROVED' ? '[SECURE]' : '[PENDING]'}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                                    <span>Payment</span>
                                    <span className={user.paymentVerified ? 'text-[#c9a227]' : ''}>{user.paymentVerified ? '[VERIFIED]' : '[UNVERIFIED]'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Intel Area */}
                    <div className="lg:col-span-3 space-y-32">

                        {/* Selected Case Studies */}
                        {portfolioItems?.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-16 border-b border-black pb-8">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Case Studies</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted italic">Selected Assets</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {portfolioItems.map((port: any) => (
                                        <div key={port.id} className="group cursor-pointer">
                                            <div className="aspect-square relative overflow-hidden bg-black/5 mb-8">
                                                {port.imageUrl ? (
                                                    <Image
                                                        src={`${port.imageUrl}`}
                                                        alt={port.title}
                                                        fill
                                                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                                        sizes="400px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-black/5 grayscale uppercase">
                                                        Intel Asset
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 transition-colors group-hover:text-[#c9a227]">{port.title}</h3>
                                            <p className="text-lg text-text-muted font-lora italic leading-snug line-clamp-3">{port.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mission Timeline */}
                        {experiences?.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-16 border-b border-black pb-8">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Mission Log</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted italic">Operational History</span>
                                </div>
                                <div className="space-y-20">
                                    {experiences.map((exp: any) => (
                                        <div key={exp.id} className="flex flex-col md:flex-row gap-8 relative">
                                            <div className="absolute -left-6 top-1 bottom-1 w-[2px] bg-[#c9a227] hidden md:block" />
                                            <div className="md:w-48 shrink-0">
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c9a227]">
                                                    {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Current' : new Date(exp.endDate).getFullYear()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{exp.title}</h3>
                                                <p className="text-sm font-black uppercase tracking-tighter text-text-muted mb-6">{exp.company}</p>
                                                <p className="text-xl text-text-muted font-lora italic leading-relaxed max-w-2xl">{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Debriefing Reviews */}
                        {reviews.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-16 border-b border-black pb-8">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Commendations</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted italic">Mission Feedback</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {reviews.map((rev: any) => (
                                        <div key={rev.id} className="relative p-10 bg-black/2">
                                            <div className="absolute -left-2 top-10 bottom-10 w-[2px] bg-[#c9a227]" />
                                            <p className="text-2xl text-black font-lora italic leading-relaxed mb-8">&ldquo;{rev.comment}&rdquo;</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">— {rev.reviewer?.profile?.fullName || 'Anonymous Agent'}</span>
                                                <div className="flex gap-1 text-[#c9a227]">
                                                    {[...Array(rev.rating)].map((_, i) => (
                                                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    ))}
                                                </div>
                                            </div>
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

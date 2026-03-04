'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { gigApi, chatApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function GigDetailsPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [gig, setGig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState<'standard' | 'starter' | 'premium'>('standard');

    useEffect(() => {
        gigApi.get(params.id)
            .then((data: any) => setGig(data))
            .catch((err: any) => console.error("Failed to load gig:", err))
            .finally(() => setLoading(false));
    }, [params.id]);

    const handleDeleteGig = async () => {
        setDeleting(true);
        try {
            const token = (session as any)?.accessToken;
            await gigApi.delete(token, gig.id);
            router.push('/dashboard');
        } catch (e: any) {
            alert(e.message || 'Failed to delete gig');
        }
        setDeleting(false);
        setDeleteModalOpen(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!gig) return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark text-white font-black uppercase tracking-[0.5em]">
            Intelligence Not Found
        </div>
    );

    const currentPrice = activeTab === 'starter' ? (gig.priceStarter || gig.basePrice) :
        activeTab === 'premium' ? (gig.pricePremium || gig.basePrice * 2) :
            (gig.priceStandard || gig.basePrice);

    const currentDelivery = activeTab === 'starter' ? (gig.deliveryTimeStarter || 3) :
        activeTab === 'premium' ? (gig.deliveryTimePremium || 14) :
            (gig.deliveryTimeStandard || 7);

    return (
        <div className="flex flex-col min-h-screen bg-white text-background-dark font-sans selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Immersive Showcase Hero */}
                <section className="relative w-full aspect-21/9 min-h-[600px] overflow-hidden bg-black">
                    {gig.images && gig.images.length > 0 ? (
                        <Image
                            src={gig.images[0]}
                            alt={gig.title}
                            fill
                            className="object-cover opacity-60 transition-transform duration-3000 scale-110 hover:scale-100"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-background-dark to-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[12rem] text-white/5 font-thin italic">all_inclusive</span>
                        </div>
                    )}

                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/20 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-background-dark/80 via-transparent to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-24 max-w-7xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <span className="px-6 py-2 bg-white/10 border border-white/20 backdrop-blur-3xl text-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-full">
                                    {gig.category}
                                </span>
                                {gig.boosts?.length > 0 && (
                                    <span className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs">bolt</span> Priority Intel
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-[7rem] font-black text-white tracking-tighter leading-[0.85] mb-12 uppercase italic max-w-4xl">
                                {gig.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary font-black text-2xl border border-white/20 shadow-2xl overflow-hidden backdrop-blur-3xl">
                                        {gig.seller?.profile?.fullName?.[0] || 'S'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mb-1">Operative</span>
                                        <span className="text-xl font-black text-white uppercase tracking-tighter">{gig.seller?.profile?.fullName || 'EXPERT TALENT'}</span>
                                    </div>
                                </div>
                                <div className="h-12 w-px bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-3xl">
                                        <span className="material-symbols-outlined text-primary text-2xl font-light" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
                                        <span className="font-black text-white text-xl tracking-tighter">{gig.avgRating ? gig.avgRating.toFixed(1) : 'NEW'}</span>
                                    </div>
                                    <span className="text-white/30 font-black text-xs uppercase tracking-[0.3em] italic">({gig.reviewCount || 0} Successful Missions)</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                        {/* Dossier Details */}
                        <div className="lg:col-span-2 space-y-24">
                            <section>
                                <div className="flex items-center gap-6 mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Mission <span className="text-primary not-italic">Objectives.</span></h2>
                                    <div className="flex-1 h-px bg-black/5" />
                                </div>
                                <div className="prose prose-xl prose-invert max-w-none text-text-muted font-bold italic leading-relaxed whitespace-pre-line">
                                    {gig.description}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-6 mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Strategic <span className="text-primary not-italic">Background.</span></h2>
                                    <div className="flex-1 h-px bg-black/5" />
                                </div>
                                <div className="bg-black/2 rounded-[3.5rem] border border-black/5 p-12 md:p-16 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 text-primary opacity-5 group-hover:opacity-20 transition-all duration-1000">
                                        <span className="material-symbols-outlined text-[10rem] font-thin">person_search</span>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                        <div className="w-32 h-32 bg-primary/10 rounded-4xl flex items-center justify-center text-primary font-black text-5xl border border-primary/20 shadow-inner shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-700">
                                            {gig.seller?.profile?.fullName?.[0] || 'S'}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                                <h3 className="text-4xl font-black uppercase tracking-tighter italic">{gig.seller?.profile?.fullName || 'Verified Professional'}</h3>
                                                {gig.seller?.kycStatus === 'APPROVED' ? (
                                                    <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-[0.3em] rounded-full">Identity Verified</span>
                                                ) : (
                                                    <span className="px-4 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-[0.3em] rounded-full">Security Processing</span>
                                                )}
                                            </div>
                                            <p className="text-xl text-text-muted font-bold italic mb-8">
                                                Elite Operative specializing in {gig.category}. Verified track record of mission success.
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-[11px] font-black uppercase tracking-[0.4em]">
                                                <div className="p-6 rounded-2xl bg-black/5 border border-black/5 flex flex-col gap-2">
                                                    <span className="text-primary">Deploying From</span>
                                                    <span>PAKISTAN BASE</span>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-black/5 border border-black/5 flex flex-col gap-2">
                                                    <span className="text-primary">Response Time</span>
                                                    <span>ULTRA-FAST</span>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-black/5 border border-black/5 flex flex-col gap-2">
                                                    <span className="text-primary">Engagement Rate</span>
                                                    <span>{gig.avgRating ? (gig.avgRating * 20).toFixed(0) : 100}% SUCCESSFUL</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Intel Feedback - Reviews */}
                            <section>
                                <div className="flex items-center gap-6 mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Mission <span className="text-primary not-italic">Intel.</span></h2>
                                    <div className="flex-1 h-px bg-black/5" />
                                </div>
                                {gig.reviews?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {gig.reviews.map((rev: any) => (
                                            <motion.div
                                                key={rev.id}
                                                whileHover={{ y: -10 }}
                                                className="bg-black/2 border border-black/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-3xl"
                                            >
                                                <div className="flex items-center gap-5 mb-8">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                                                        {rev.reviewer?.profile?.fullName?.[0] || 'C'}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-black uppercase tracking-tighter leading-none mb-1">{rev.reviewer?.profile?.fullName || 'TACTICAL COMMAND'}</span>
                                                        <div className="flex items-center gap-1 text-primary">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: i < rev.rating ? "'FILL' 1" : "" }}>grade</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-base text-text-muted font-bold italic leading-relaxed">
                                                    "{rev.comment}"
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-24 text-center bg-black/2 rounded-[4rem] border border-dashed border-black/10">
                                        <span className="material-symbols-outlined text-6xl text-white/5 font-thin mb-6">history_edu</span>
                                        <p className="text-text-muted font-black uppercase tracking-[0.4em] text-xs">First contract available. Secure first-mover advantage.</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Tactical Execution Options */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-10">
                                <div className="bg-white backdrop-blur-3xl border border-black/5 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col h-full">
                                    {/* Intelligence Tier Selector */}
                                    <div className="flex bg-black/3 p-3 gap-2">
                                        {(['starter', 'standard', 'premium'] as const).map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all duration-500 ${activeTab === tab
                                                    ? 'bg-primary text-white shadow-xl shadow-primary/25'
                                                    : 'text-text-muted hover:bg-black/5'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-12 md:p-16 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Investment Required</span>
                                                <h3 className="text-4xl font-black uppercase tracking-tighter italic grayscale group-hover:grayscale-0 transition-all leading-none">
                                                    {activeTab} Delivery
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-background-dark tracking-tighter block leading-none mb-1">PKR {currentPrice.toLocaleString()}</span>
                                                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] italic">TOTAL INTEL VALUE</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-16 pb-12 border-b border-black/5">
                                            <div className="flex items-center gap-5 text-sm font-black uppercase tracking-widest text-text-muted">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                                    <span className="material-symbols-outlined text-xl">schedule</span>
                                                </div>
                                                {currentDelivery} Day Engagement
                                            </div>
                                            <div className="flex items-center gap-5 text-sm font-black uppercase tracking-widest text-text-muted">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                                    <span className="material-symbols-outlined text-xl">history</span>
                                                </div>
                                                {activeTab === 'premium' ? 'UNLIMITED' : activeTab === 'starter' ? '01' : '03'} Protocol Revisions
                                            </div>
                                        </div>

                                        {session && (session as any)?.user?.id === gig.sellerId ? (
                                            <div className="space-y-4">
                                                <Link href={`/dashboard/create-gig?edit=${gig.id}`} className="block">
                                                    <button className="w-full h-20 bg-white border border-border-light text-background-dark font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-black/5 transition-all">
                                                        Modify Intelligence
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModalOpen(true)}
                                                    className="w-full h-20 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Purge Data
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <Link href={`/checkout/${gig.id}?pkg=${activeTab}`} className="block">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full h-24 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-full text-sm shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-4"
                                                    >
                                                        Initialize Protocol <span className="material-symbols-outlined">arrow_forward</span>
                                                    </motion.button>
                                                </Link>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={async () => {
                                                        if (!session) { router.push('/login'); return; }
                                                        try {
                                                            const token = (session as any).accessToken;
                                                            const res: any = await chatApi.findOrCreate(token, (session as any)?.user?.id, gig.seller.id, undefined, undefined);
                                                            const convId = res?.data?.id || res?.id;
                                                            if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                        } catch (e) { console.error(e); }
                                                    }}
                                                    className="w-full h-20 bg-white border border-border-light text-background-dark font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-black/5 transition-all flex items-center justify-center gap-4 shadow-xl"
                                                >
                                                    Request Tactical Brief <span className="material-symbols-outlined text-xl">forum</span>
                                                </motion.button>
                                            </div>
                                        )}

                                        <div className="mt-12 bg-black/3 p-8 rounded-4xl flex items-start gap-5 border border-black/5">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-2xl font-light">verified_user</span>
                                            </div>
                                            <p className="text-[11px] text-text-muted font-black uppercase tracking-wider leading-relaxed">
                                                <span className="text-background-dark">Gigligo Strategic Reserve:</span> Capital is held in high-security escrow and released only upon your final verification of mission success.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 p-10 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl text-center flex flex-col items-center">
                                    <span className="material-symbols-outlined text-primary text-6xl font-thin mb-6">workspace_premium</span>
                                    <h4 className="text-xl font-black uppercase tracking-tighter mb-4 italic">Guaranteed <span className="text-primary not-italic">Execution.</span></h4>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] leading-normal opacity-60">
                                        All service delivery protocols are monitored for compliance with elite operational standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {deleteModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute inset-0 bg-background-dark/80 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white border border-border-light p-12 md:p-16 rounded-[4rem] w-full max-w-xl relative z-10 shadow-2xl text-center"
                        >
                            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-red-500/20">
                                <span className="material-symbols-outlined text-5xl font-light">warning</span>
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 italic">Confirm <span className="text-red-500 not-italic">Purge.</span></h2>
                            <p className="text-xl text-text-muted font-bold italic mb-12 leading-tight">
                                This action will permanently archive the listing from the public network. This process is irreversible.
                            </p>
                            <div className="flex flex-col md:flex-row gap-6">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 h-20 bg-black/5 text-text-muted font-black uppercase tracking-[0.2em] rounded-full text-xs hover:bg-black/10 transition-all border border-transparent"
                                    disabled={deleting}
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={handleDeleteGig}
                                    disabled={deleting}
                                    className="flex-1 h-20 bg-red-500 text-white font-black uppercase tracking-[0.2em] rounded-full text-xs shadow-2xl shadow-red-500/30 hover:bg-red-600 transition-all"
                                >
                                    {deleting ? 'PURGING...' : 'EXECUTE PURGE'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

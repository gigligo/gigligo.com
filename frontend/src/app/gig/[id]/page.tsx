'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Check, Star, Clock, RefreshCw, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { chatApi } from "@/lib/api";

import { useState, useEffect } from "react";
import { gigApi } from "@/lib/api";

export default function GigDetailsPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [gig, setGig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        gigApi.get(params.id)
            .then((data: any) => setGig(data))
            .catch((err: any) => console.error("Failed to load gig:", err))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#000]"><div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" /></div>;
    if (!gig) return <div className="min-h-screen flex items-center justify-center bg-[#000] text-white">Gig not found</div>;

    return (
        <div className="flex flex-col min-h-screen bg-light" >
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8" style={{ paddingTop: 96 }}>
                <div className="text-sm text-muted mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-accent">Home</Link>
                    <span>/</span>
                    <Link href="/search" className="hover:text-accent">{gig.category.split(' > ')[0]}</Link>
                    <span>/</span>
                    <span className="text-primary font-medium truncate">{gig.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-6">{gig.title}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-xl uppercase">
                                    {gig.seller?.profile?.fullName?.[0] || 'S'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary">{gig.seller?.profile?.fullName || 'Seller'}</span>
                                        {gig.seller?.profile?.sellerLevel && gig.seller.profile.sellerLevel !== 'NEW' && (
                                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${gig.seller.profile.sellerLevel === 'TOP_RATED' ? 'bg-amber-400/20 text-amber-600' :
                                                gig.seller.profile.sellerLevel === 'LEVEL_2' ? 'bg-teal-400/20 text-teal-600' :
                                                    'bg-blue-400/20 text-blue-600'
                                                }`}>
                                                {gig.seller.profile.sellerLevel === 'TOP_RATED' ? '⭐ Top Rated' :
                                                    gig.seller.profile.sellerLevel === 'LEVEL_2' ? 'Level 2' : 'Level 1'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm mt-1">
                                        <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
                                        <span className="font-bold">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                        <span className="text-muted ml-1">({gig.reviewCount || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 mb-8 border border-gray-100 flex items-center justify-center">
                                {gig.images && gig.images.length > 0 ? (
                                    <img src={gig.images[0]} alt="Gig Thumbnail" className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <span className="text-muted font-bold">No Image</span>
                                )}
                            </div>

                            <div className="bg-white p-8 rounded-2xl border border-gray-100">
                                <h2 className="text-2xl font-bold mb-4 text-primary">About This Gig</h2>
                                <div className="prose max-w-none text-muted space-y-4 whitespace-pre-line text-sm leading-relaxed">
                                    {gig.description}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border border-gray-100 mt-8">
                                <h2 className="text-2xl font-bold mb-6 text-primary">About The Seller</h2>
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-3xl uppercase shrink-0">
                                        {gig.seller?.profile?.fullName?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{gig.seller?.profile?.fullName || 'Seller'}</h3>
                                        <p className="text-muted mb-2 text-sm">{
                                            gig.seller?.profile?.sellerLevel === 'TOP_RATED' ? 'Top Rated Seller' :
                                                gig.seller?.profile?.sellerLevel === 'LEVEL_2' ? 'Level 2 Seller' :
                                                    gig.seller?.profile?.sellerLevel === 'LEVEL_1' ? 'Level 1 Seller' : 'New Seller'
                                        }</p>
                                        <div className="flex items-center text-sm mb-4">
                                            <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
                                            <span className="font-bold">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                            <span className="text-muted ml-1">({gig.reviewCount || 0} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100 text-sm">
                                    <div><span className="block text-muted mb-1">From</span><span className="font-medium text-primary">Pakistan</span></div>
                                    <div><span className="block text-muted mb-1">Avg. response</span><span className="font-medium text-primary">1 hour</span></div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border border-gray-100 mt-8 mb-8">
                                <h2 className="text-2xl font-bold mb-6 text-primary">Reviews ({gig.reviewCount || 0})</h2>
                                {gig.reviews && gig.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {gig.reviews.map((rev: any) => (
                                            <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                                                        {rev.reviewer?.profile?.fullName?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm text-primary">{rev.reviewer?.profile?.fullName || 'User'}</div>
                                                        <div className="flex items-center text-amber-400 text-xs">
                                                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />)}
                                                            <span className="text-gray-400 ml-2">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted mt-2">{rev.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-sm">No reviews yet for this gig.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                            <div className="flex border-b border-gray-100">
                                <button className="flex-1 py-4 text-sm font-bold text-muted hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent">Starter</button>
                                <button className="flex-1 py-4 text-sm font-bold text-accent border-b-2 border-accent">Standard</button>
                                <button className="flex-1 py-4 text-sm font-bold text-muted hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent">Premium</button>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-primary pr-4">Standard Package</h3>
                                    <span className="text-2xl font-extrabold text-primary whitespace-nowrap">PKR {gig.priceStandard?.toLocaleString() || gig.basePrice?.toLocaleString()}</span>
                                </div>

                                <p className="text-muted text-sm mb-6">Standard delivery package for this gig.</p>

                                <div className="flex items-center gap-6 text-sm font-medium text-primary/80 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted" />
                                        {gig.deliveryTimeStandard || 7} Days
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 text-muted" />
                                        3 Revisions
                                    </div>
                                </div>

                                {((session as any)?.role === 'SELLER' && (session as any)?.kycStatus !== 'APPROVED') ? (
                                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-3">
                                        <p className="text-red-400 text-xs mb-2 font-semibold flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Identity Verification Required
                                        </p>
                                        <Link href="/dashboard/kyc" className="block text-center px-4 py-3 bg-red-500/20 text-red-100 font-semibold rounded-lg text-sm hover:bg-red-500/30 transition">
                                            Verify Identity Now
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link href={`/checkout/${gig.id}?pkg=standard`}>
                                            <Button size="lg" variant="accent" fullWidth className="text-base py-4 mb-3">
                                                Continue (PKR {gig.priceStandard?.toLocaleString() || gig.basePrice?.toLocaleString()})
                                            </Button>
                                        </Link>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            fullWidth
                                            className="text-base py-4"
                                            onClick={async () => {
                                                if (!session) {
                                                    router.push('/login');
                                                    return;
                                                }
                                                try {
                                                    const token = (session as any).accessToken;
                                                    const myId = (session as any).user.id;
                                                    const res: any = await chatApi.findOrCreate(token, myId, gig.seller.id, undefined, undefined);
                                                    const convId = res?.data?.id || res?.id;
                                                    if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                } catch (error) {
                                                    console.error("Failed to start chat", error);
                                                }
                                            }}
                                        >
                                            Message Seller
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="bg-accent/5 p-4 flex items-center gap-3 border-t border-accent/10">
                                <ShieldCheck className="w-7 h-7 text-accent shrink-0" />
                                <p className="text-xs text-primary/70 font-medium">
                                    Gigligo guarantees your satisfaction — payment is released only when you approve the delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            <Footer />
        </div >
    );
}

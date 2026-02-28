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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
            alert('Gig deleted successfully.');
            router.push('/dashboard');
        } catch (e: any) {
            alert(e.message || 'Failed to delete gig');
        }
        setDeleting(false);
        setDeleteModalOpen(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F6]"><div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" /></div>;
    if (!gig) return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F6] text-[#1E1E1E]">Gig not found</div>;

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F7F6]" >
            <Navbar />

            <main className="flex-1 content-container py-8" style={{ paddingTop: 96, paddingBottom: 64 }}>
                <div className="text-[13px] text-[#3A3A3A]/60 font-medium mb-8 flex items-center gap-2 mt-8">
                    <Link href="/" className="hover:text-[#1E1E1E] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/search" className="hover:text-[#1E1E1E] transition-colors">{gig.category.split(' > ')[0]}</Link>
                    <span>/</span>
                    <span className="text-[#1E1E1E] font-semibold truncate">{gig.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h1 className="h2 text-[#1E1E1E] mb-8 leading-tight">{gig.title}</h1>

                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-14 h-14 bg-[#1E1E1E] rounded-full flex items-center justify-center text-[#C9A227] font-bold text-xl uppercase border border-[#3A3A3A]">
                                    {gig.seller?.profile?.fullName?.[0] || 'S'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-bold text-[#1E1E1E] text-lg">{gig.seller?.profile?.fullName || 'Verified Seller'}</span>
                                        {(gig.seller?.isFoundingMember || gig.seller?.role === 'PRO' || gig.seller?.profile?.sellerLevel === 'TOP_RATED') && (
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-amber-400 to-yellow-600 text-white rounded-[6px] font-bold text-xs shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                                <span>{gig.seller?.isFoundingMember ? 'Founding PRO' : 'PRO'}</span>
                                            </div>
                                        )}
                                        {gig.seller?.profile?.sellerLevel && gig.seller.profile.sellerLevel !== 'NEW' && gig.seller.profile.sellerLevel !== 'TOP_RATED' && (
                                            <span className="micro-label bg-[#C9A227]/10 text-[#1E1E1E] px-2.5 py-1 rounded-[4px] border border-[#C9A227]/20">
                                                {gig.seller.profile.sellerLevel === 'LEVEL_2' ? 'Level 2' : 'Level 1'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm mt-1.5">
                                        <Star className="w-4 h-4 text-[#C9A227] mr-1.5 fill-currentColor" />
                                        <span className="font-bold text-[#1E1E1E]">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                        <span className="text-[#3A3A3A]/50 ml-1.5 font-medium">({gig.reviewCount || 0} reviews)</span>
                                    </div>
                                    <p className="micro-label text-[#3A3A3A]/40 mt-2 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> Member since {new Date(gig.seller?.createdAt || Date.now()).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full aspect-video rounded-[10px] overflow-hidden bg-[#FFFFFF] mb-10 border border-[#E5E5E5] flex items-center justify-center shadow-sm">
                                {gig.images && gig.images.length > 0 ? (
                                    <img src={gig.images[0]} alt="Gig Thumbnail" className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <span className="micro-label text-[#3A3A3A]/30 font-bold">No Image Available</span>
                                )}
                            </div>

                            <div className="bg-[#FFFFFF] p-10 rounded-[10px] border border-[#E5E5E5] shadow-sm">
                                <h2 className="h3 text-[#1E1E1E] mb-6">About This Service</h2>
                                <div className="prose max-w-none text-[#3A3A3A] space-y-5 whitespace-pre-line text-[15px] leading-relaxed font-medium">
                                    {gig.description}
                                </div>
                            </div>

                            <div className="bg-[#FFFFFF] p-10 rounded-[10px] border border-[#E5E5E5] mt-10 shadow-sm">
                                <h2 className="h3 text-[#1E1E1E] mb-8">About The Professional</h2>
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 bg-[#F7F7F6] rounded-full flex items-center justify-center text-[#1E1E1E] font-bold text-4xl uppercase shrink-0 border border-[#E5E5E5] shadow-inner">
                                        {gig.seller?.profile?.fullName?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap mb-1">
                                            <h3 className="text-xl font-bold text-[#1E1E1E]">{gig.seller?.profile?.fullName || 'Verified Professional'}</h3>
                                            {(gig.seller?.isFoundingMember || gig.seller?.role === 'PRO' || gig.seller?.profile?.sellerLevel === 'TOP_RATED') && (
                                                <div className="flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-amber-400 to-yellow-600 text-white rounded-[6px] font-bold text-xs shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                                    <span>{gig.seller?.isFoundingMember ? 'Founding PRO' : 'PRO'}</span>
                                                </div>
                                            )}
                                            {gig.seller?.kycStatus !== 'APPROVED' && (
                                                <span className="micro-label text-[#C62828] bg-[#C62828]/5 px-2 py-0.5 rounded-[4px] border border-[#C62828]/20">UNVERIFIED IDENTITY</span>
                                            )}
                                        </div>
                                        <p className="text-[#3A3A3A]/60 mb-3 text-[15px] font-medium">{
                                            gig.seller?.profile?.sellerLevel === 'TOP_RATED' ? 'Top Rated Professional' :
                                                gig.seller?.profile?.sellerLevel === 'LEVEL_2' ? 'Level 2 Professional' :
                                                    gig.seller?.profile?.sellerLevel === 'LEVEL_1' ? 'Level 1 Professional' : 'New Talent'
                                        }</p>
                                        <div className="flex items-center text-[15px] mb-4">
                                            <Star className="w-4 h-4 text-[#C9A227] mr-1.5 fill-currentColor" />
                                            <span className="font-bold text-[#1E1E1E]">{gig.avgRating ? gig.avgRating.toFixed(1) : '—'}</span>
                                            <span className="text-[#3A3A3A]/50 ml-1.5 font-medium">({gig.reviewCount || 0} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-[#F7F7F6] text-[15px]">
                                    <div><span className="block text-[#3A3A3A]/50 mb-1 font-medium">From</span><span className="font-bold text-[#1E1E1E]">Pakistan</span></div>
                                    <div><span className="block text-[#3A3A3A]/50 mb-1 font-medium">Avg. response time</span><span className="font-bold text-[#1E1E1E]">1 hour</span></div>
                                </div>
                            </div>

                            <div className="bg-[#FFFFFF] p-10 rounded-[10px] border border-[#E5E5E5] mt-10 shadow-sm">
                                <h2 className="h3 text-[#1E1E1E] mb-8">Reviews ({gig.reviewCount || 0})</h2>
                                {gig.reviews && gig.reviews.length > 0 ? (
                                    <div className="space-y-8">
                                        {gig.reviews.map((rev: any) => (
                                            <div key={rev.id} className="border-b border-[#F7F7F6] pb-8 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-[13px] font-bold text-[#C9A227] uppercase">
                                                        {rev.reviewer?.profile?.fullName?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-[#1E1E1E]">{rev.reviewer?.profile?.fullName || 'Client'}</div>
                                                        <div className="flex items-center text-[#C9A227] text-xs mt-1">
                                                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-currentColor' : 'text-[#E5E5E5]'}`} />)}
                                                            <span className="text-[#3A3A3A]/40 ml-3 font-semibold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-[15px] text-[#3A3A3A] leading-relaxed font-medium">{rev.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="body-regular text-[#3A3A3A]/40">No reviews yet for this professional.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#FFFFFF] rounded-[10px] shadow-lg border border-[#E5E5E5] overflow-hidden sticky top-28">
                            <div className="flex border-b border-[#E5E5E5] bg-[#F7F7F6]">
                                <button className="flex-1 py-5 text-[13px] uppercase tracking-widest font-bold text-[#3A3A3A]/40 hover:text-[#1E1E1E] transition-colors border-b-[3px] border-transparent">Starter</button>
                                <button className="flex-1 py-5 text-[13px] uppercase tracking-widest font-bold text-[#1E1E1E] border-b-[3px] border-[#1E1E1E] bg-[#FFFFFF]">Standard</button>
                                <button className="flex-1 py-5 text-[13px] uppercase tracking-widest font-bold text-[#3A3A3A]/40 hover:text-[#1E1E1E] transition-colors border-b-[3px] border-transparent">Premium</button>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-[22px] font-bold text-[#1E1E1E] pr-4">Standard Delivery</h3>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[28px] font-bold text-[#1E1E1E] tracking-tight whitespace-nowrap">PKR {gig.priceStandard?.toLocaleString() || gig.basePrice?.toLocaleString()}</span>
                                        {session && (session as any)?.user?.id === gig.sellerId && gig.isActive && (
                                            <button
                                                onClick={() => setDeleteModalOpen(true)}
                                                className="micro-label bg-[#C62828]/10 text-[#C62828] hover:bg-[#C62828]/20 px-3 py-1.5 rounded-[4px] transition-colors"
                                            >
                                                Delete Listing
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 text-[14px] font-semibold text-[#3A3A3A] mb-8 pb-8 border-b border-[#F7F7F6]">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-[#C9A227]" />
                                        {gig.deliveryTimeStandard || 7} Days Delivery
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-[#C9A227]" />
                                        3 Revisions Included
                                    </div>
                                </div>

                                {((session as any)?.role === 'SELLER' && (session as any)?.kycStatus !== 'APPROVED') ? (
                                    <div className="mt-4 p-5 bg-[#C62828]/5 border border-[#C62828]/20 rounded-[8px] mb-4">
                                        <p className="text-[#C62828] text-sm mb-3 font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5" />
                                            Identity Verification Required
                                        </p>
                                        <Link href="/dashboard/kyc" className="block text-center px-4 py-3 bg-[#C62828] text-white font-bold rounded-[6px] text-[15px] hover:bg-[#C62828]/90 transition">
                                            Verify Identity Now
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link href={`/checkout/${gig.id}?pkg=standard`}>
                                            <Button size="lg" fullWidth className="btn-primary w-full shadow-md">
                                                Continue (PKR {gig.priceStandard?.toLocaleString() || gig.basePrice?.toLocaleString()})
                                            </Button>
                                        </Link>
                                        <Button
                                            size="lg"
                                            fullWidth
                                            className="btn-secondary w-full"
                                            onClick={async () => {
                                                if (!session) {
                                                    router.push('/login');
                                                    return;
                                                }
                                                try {
                                                    const token = (session as any).accessToken;
                                                    const myId = (session as any)?.user?.id;
                                                    const res: any = await chatApi.findOrCreate(token, myId, gig.seller.id, undefined, undefined);
                                                    const convId = res?.data?.id || res?.id;
                                                    if (convId) router.push(`/dashboard/inbox?c=${convId}`);
                                                } catch (error) {
                                                    console.error("Failed to start chat", error);
                                                }
                                            }}
                                        >
                                            Message Client
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#F7F7F6] p-5 flex items-start gap-4 border-t border-[#E5E5E5]">
                                <ShieldCheck className="w-6 h-6 text-[#1E1E1E] shrink-0 mt-0.5" />
                                <p className="text-[13px] text-[#3A3A3A] font-medium leading-relaxed">
                                    Gigligo Escrow: Capital is secured and released only upon your final approval of the deliverables.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E1E]/80 backdrop-blur-sm">
                    <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-8 rounded-[10px] w-full max-w-sm shadow-2xl">
                        <h2 className="h3 text-[#1E1E1E] mb-3">Delete Listing</h2>
                        <p className="body-regular text-[#3A3A3A]/70 mb-8">
                            Are you sure you want to delete this listing? This action will set it to inactive. Listings with active orders cannot be deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-5 py-2.5 text-[15px] font-bold text-[#3A3A3A] hover:text-[#1E1E1E] transition-colors"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteGig}
                                disabled={deleting}
                                className="px-6 py-2.5 text-[15px] font-bold bg-[#C62828] text-white rounded-[6px] hover:bg-[#C62828]/90 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

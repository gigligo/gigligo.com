'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Check, Loader2 } from 'lucide-react';
import { creditApi, paymentApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const role = (session as any)?.role;
    const isFreelancer = ['SELLER', 'STUDENT', 'FREE'].includes(role);
    const isEmployer = ['BUYER', 'EMPLOYER'].includes(role);

    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        creditApi.getPackages()
            .then((res: any) => setPackages(res.data || res))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handlePurchase = async (pkgId: string) => {
        if (!session) {
            router.push(`/login?callbackUrl=/pricing`);
            return;
        }

        const token = (session as any).accessToken;

        setProcessingId(pkgId);
        try {
            const res: any = await paymentApi.checkout(token, {
                packageId: pkgId,
                method: 'CARD', // Sandbox mock
            });
            if (res.data?.paymentUrl || res.paymentUrl) {
                const url = res.data?.paymentUrl || res.paymentUrl;
                window.location.href = url;
            }
        } catch (error) {
            console.error(error);
            alert('Failed to initiate checkout.');
            setProcessingId(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
            <Navbar />
            <main className="flex-1 w-full relative z-10" style={{ paddingTop: 96 }}>

                {/* Header Section */}
                <div className="content-container section-spacing text-center">
                    <div className="inline-block px-4 py-1.5 bg-[#C9A227]/10 text-[#C9A227] font-bold text-[10px] uppercase tracking-widest rounded-full mb-6 border border-[#C9A227]/20 shadow-sm">
                        ⚡ Limited Founding Member Rewards
                    </div>
                    <h1 className="h1 text-[#1E1E1E] mb-6">
                        Transparent <span className="text-[#C9A227] italic font-serif">investment.</span>
                    </h1>
                    <p className="body-regular max-w-2xl mx-auto">
                        High-end talent and enterprise solutions, engineered precisely for the scale of tomorrow's economy.
                    </p>
                </div>

                {/* First 500 Rewards Banner */}
                <div className="content-container mb-24">
                    <div className="bg-[#1E1E1E] rounded-[20px] p-8 md:p-16 relative overflow-hidden shadow-2xl border border-[#3A3A3A]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.05)_0%,transparent_70%)] pointer-events-none bg-abstract-geometry" />
                        <h2 className="h2 text-[#FFFFFF] mb-12 text-center relative z-10">Founding Member Perks</h2>

                        <div className="grid md:grid-cols-2 gap-10 relative z-10">
                            <div className="bg-[#FFFFFF]/5 p-10 rounded-[10px] border border-[#FFFFFF]/10 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-[#C9A227] mb-8 uppercase tracking-widest">For Talent</h3>
                                <ul className="space-y-5">
                                    <Benefit check="✔">25 Bonus Credits Monthly</Benefit>
                                    <Benefit check="✔">Exclusive 'Founding' Badge</Benefit>
                                    <Benefit check="✔">0% Commission on first 3 projects</Benefit>
                                    <Benefit check="✔">Priority Search Ranking</Benefit>
                                </ul>
                            </div>
                            <div className="bg-[#FFFFFF]/5 p-10 rounded-[10px] border border-[#FFFFFF]/10 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-[#FFFFFF]/60 mb-8 uppercase tracking-widest">For Businesses</h3>
                                <ul className="space-y-5">
                                    <Benefit check="✔">0% Service Fee on first 3 hires</Benefit>
                                    <Benefit check="✔">1 Free 'Featured Job' Post</Benefit>
                                    <Benefit check="✔">Priority suggestion engine</Benefit>
                                    <Benefit check="✔">Founding Client Status</Benefit>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Freelancer Credit Packages */}
                <div className="content-container pb-32">
                    <div className="text-center mb-16">
                        <h2 className="h2 text-[#1E1E1E]">Credit Packages</h2>
                        <p className="micro-label text-[#3A3A3A]/70 mt-4">1 Credit = 1 Professional Proposal</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#C9A227]" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
                            {packages.map((pkg, idx) => (
                                <PricingCard
                                    key={pkg.id}
                                    title={pkg.name}
                                    price={pkg.pricePKR.toLocaleString()}
                                    credits={`${pkg.credits} Credits`}
                                    features={[`Submit ${pkg.credits} Proposals`, idx === 1 ? 'Premium Visibility' : idx === 2 ? 'Elite Status' : 'Standard Visibility', 'Direct Local Payouts']}
                                    buttonText="Select Plan"
                                    recommended={pkg.credits === 60}
                                    bestValue={pkg.credits === 150}
                                    onPurchase={() => handlePurchase(pkg.id)}
                                    isProcessing={processingId === pkg.id}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-[#F7F7F6] section-spacing border-t border-[#E5E5E5]">
                    <div className="content-container grid lg:grid-cols-2 gap-20">

                        {/* Freelancer Pro Plan */}
                        <div>
                            <h2 className="h2 text-[#1E1E1E] mb-10">Gigligo Pro</h2>
                            <div className="bg-[#1E1E1E] rounded-[20px] p-12 relative overflow-hidden shadow-2xl border border-[#3A3A3A]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.1)_0%,transparent_70%)] pointer-events-none bg-abstract-geometry"></div>

                                <h3 className="h3 text-[#FFFFFF] mb-4">Pro Subscription</h3>
                                <div className="flex items-baseline gap-3 mt-4 mb-12 border-b border-[#3A3A3A] pb-8">
                                    <span className="text-[40px] font-bold text-[#C9A227] tracking-tight">PKR 1,500</span>
                                    <span className="text-[#FFFFFF]/50 font-medium">/ month</span>
                                </div>

                                <ul className="space-y-6 mb-12">
                                    <Benefit check="⚡">25 Free Credits Monthly</Benefit>
                                    <Benefit check="⚡">Elite Profile Badge</Benefit>
                                    <Benefit check="⚡">Advanced Market Analytics</Benefit>
                                    <Benefit check="⚡">Priority Support Access</Benefit>
                                </ul>

                                <button className="btn-primary w-full">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>

                        {/* Platform Features */}
                        <div>
                            <h2 className="h2 text-[#1E1E1E] mb-10">Platform Mechanics</h2>
                            <div className="space-y-6">
                                <FeatureBlock title="Standard Commission" price="10%">
                                    Automatically deducted upon successful delivery. Transparent, simple, fair.
                                </FeatureBlock>

                                <FeatureBlock title="Skill Verified Badges" price="Free">
                                    Included for all university-vetted profiles to ensure quality.
                                </FeatureBlock>

                                <FeatureBlock title="Featured Listings" price="PKR 500+">
                                    Boost your presence for 7-30 days to reach elite clients faster.
                                </FeatureBlock>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Benefit({ children, check }: { children: React.ReactNode, check: string }) {
    return (
        <li className="flex items-center gap-4 text-[#FFFFFF]">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] text-[10px] font-bold">
                {check}
            </span>
            <span className="text-[15px] font-medium text-[#FFFFFF]/80">{children}</span>
        </li>
    );
}

function PricingCard({ title, price, credits, features, buttonText, recommended, bestValue }: any) {
    return (
        <div className={`relative bg-[#FFFFFF] border ${recommended ? `border-[#C9A227] shadow-xl` : 'border-[#E5E5E5] shadow-sm'} rounded-[10px] p-10 flex flex-col transition-all duration-300 hover:-translate-y-2`}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#C9A227] text-[#1E1E1E] micro-label rounded-full shadow-lg">
                    Recommended
                </div>
            )}
            {bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1E1E1E] text-[#FFFFFF] micro-label rounded-full shadow-lg border border-[#3A3A3A]">
                    Best Value
                </div>
            )}

            <h3 className="h3 text-[#1E1E1E] text-center mb-2 mt-4">{title}</h3>
            <div className="text-center mb-8 border-b border-[#F7F7F6] pb-8">
                <span className="micro-label text-[#3A3A3A]/70">{credits}</span>
            </div>

            <div className="flex justify-center items-baseline gap-2 mb-10">
                <span className="text-sm text-[#3A3A3A]/60 font-bold">PKR</span>
                <span className="text-[40px] font-bold text-[#1E1E1E] tracking-tight">{price}</span>
            </div>

            <ul className="space-y-5 mb-12 flex-1">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#C9A227] shrink-0" />
                        <span className="text-[#3A3A3A] text-[15px] font-medium leading-relaxed">{f}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full py-4 rounded-[8px] font-semibold text-[15px] transition-all duration-300 ${recommended ? 'bg-[#1E1E1E] text-[#FFFFFF] hover:bg-[#C9A227] hover:text-[#1E1E1E]' : 'bg-[#F7F7F6] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#FFFFFF]'}`}>
                {buttonText}
            </button>
        </div>
    );
}

function FeatureBlock({ title, price, children }: any) {
    return (
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[10px] p-8 hover:border-[#C9A227] hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[#1E1E1E]">{title}</h3>
                <span className="px-3 py-1 bg-[#C9A227]/10 rounded-full text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">{price}</span>
            </div>
            <p className="body-regular">
                {children}
            </p>
        </div>
    )
}

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
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1 w-full relative z-10" style={{ paddingTop: 96 }}>

                {/* Header Section */}
                <div className="max-container py-24 text-center">
                    <div className="inline-block px-4 py-1.5 bg-[#DAA520]/10 text-[#DAA520] font-bold text-[10px] uppercase tracking-widest rounded-full mb-6 border border-[#DAA520]/20">
                        ⚡ Limited Founding Member Rewards
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#212121] mb-6 leading-tight">
                        Simple, transparent <br /><span className="text-[#DAA520]">pricing.</span>
                    </h1>
                    <p className="text-lg text-[#424242]/70 max-w-2xl mx-auto font-normal">
                        High-end talent and enterprise solutions, designed for Pakistan's growing economy.
                    </p>
                </div>

                {/* First 500 Rewards Banner */}
                <div className="max-container mb-24">
                    <div className="bg-[#212121] rounded-[40px] p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.05)_0%,transparent_70%)] pointer-events-none" />
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center relative z-10">Founding Member Perks</h2>

                        <div className="grid md:grid-cols-2 gap-10 relative z-10">
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                <h3 className="text-xl font-bold text-[#DAA520] mb-6 uppercase tracking-widest">For Talent</h3>
                                <ul className="space-y-4">
                                    <Benefit check="✔">25 Bonus Credits Monthly</Benefit>
                                    <Benefit check="✔">Exclusive 'Founding' Badge</Benefit>
                                    <Benefit check="✔">0% Commission on first 3 projects</Benefit>
                                    <Benefit check="✔">Priority Search Ranking</Benefit>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                <h3 className="text-xl font-bold text-white/60 mb-6 uppercase tracking-widest">For Businesses</h3>
                                <ul className="space-y-4">
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
                <div className="max-container pb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#212121]">Credit Packages</h2>
                        <p className="text-[#424242]/60 mt-2 font-normal">1 Credit = 1 Professional Proposal</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#DAA520]" />
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

                <div className="bg-[#F5F5F5] py-32 border-t border-[#212121]/5">
                    <div className="max-container grid lg:grid-cols-2 gap-20">

                        {/* Freelancer Pro Plan */}
                        <div>
                            <h2 className="text-3xl font-bold text-[#212121] mb-10">Gigligo Pro</h2>
                            <div className="bg-[#212121] rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.1)_0%,transparent_70%)] pointer-events-none"></div>

                                <h3 className="text-2xl font-bold text-white mb-2">Pro Subscription</h3>
                                <div className="flex items-baseline gap-2 mt-4 mb-10">
                                    <span className="text-5xl font-bold text-[#DAA520]">PKR 1,500</span>
                                    <span className="text-white/40 font-normal">/ month</span>
                                </div>

                                <ul className="space-y-5 mb-10">
                                    <Benefit check="⚡">25 Free Credits Monthly</Benefit>
                                    <Benefit check="⚡">Elite Profile Badge</Benefit>
                                    <Benefit check="⚡">Advanced Market Analytics</Benefit>
                                    <Benefit check="⚡">Priority Support Access</Benefit>
                                </ul>

                                <button className="w-full py-4 rounded-xl bg-white text-[#212121] font-bold hover:bg-[#DAA520] transition-all">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>

                        {/* Platform Features */}
                        <div>
                            <h2 className="text-3xl font-bold text-[#212121] mb-10">Platform Mechanics</h2>
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
        <li className="flex items-center gap-3 text-white">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520] text-sm font-bold">
                {check}
            </span>
            <span className="text-sm font-normal text-white/70">{children}</span>
        </li>
    );
}

function PricingCard({ title, price, credits, features, buttonText, recommended, bestValue }: any) {
    return (
        <div className={`relative bg-white border ${recommended ? `border-[#DAA520] shadow-2xl` : 'border-[#212121]/5'} rounded-3xl p-10 flex flex-col transition-all duration-300 hover:-translate-y-2`}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#DAA520] text-[#212121] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Recommended
                </div>
            )}
            {bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#424242] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Best Value
                </div>
            )}

            <h3 className="text-xl font-bold text-[#212121] text-center mb-1 mt-4">{title}</h3>
            <div className="text-center mb-8">
                <span className="text-[10px] text-[#424242]/40 font-bold uppercase tracking-widest">{credits}</span>
            </div>

            <div className="flex justify-center items-baseline gap-2 mb-10">
                <span className="text-sm text-[#424242]/40 font-bold">PKR</span>
                <span className="text-4xl font-bold text-[#212121]">{price}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#DAA520] shrink-0" />
                        <span className="text-[#424242]/70 text-sm font-normal leading-relaxed">{f}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${recommended ? 'bg-[#212121] text-white hover:bg-[#DAA520] hover:text-[#212121]' : 'bg-[#F5F5F5] text-[#212121] hover:bg-[#212121] hover:text-white'}`}>
                {buttonText}
            </button>
        </div>
    );
}

function FeatureBlock({ title, price, children }: any) {
    return (
        <div className="bg-white border border-[#212121]/5 rounded-2xl p-8 hover:border-[#DAA520]/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[#212121]">{title}</h3>
                <span className="px-3 py-1 bg-[#DAA520]/10 rounded-full text-[10px] font-bold text-[#DAA520] uppercase tracking-widest">{price}</span>
            </div>
            <p className="text-sm text-[#424242]/60 leading-relaxed font-normal">
                {children}
            </p>
        </div>
    )
}

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
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#000]">
            <Navbar />
            <main className="flex-1 w-full relative z-10" style={{ paddingTop: 96 }}>

                {/* Header Section */}
                <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
                    <div className="inline-block px-4 py-1.5 bg-[#FE7743]/10 text-[#FE7743] font-semibold text-sm rounded-full mb-6 border border-[#FE7743]/20 shadow-[0_0_15px_rgba(254,119,67,0.3)]">
                        ⚡ First 500 Users Get Lifetime Rewards!
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-[#EFEEEA] mb-6 leading-tight">
                        Simple, transparent <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FE7743] to-[#f9a886]">pricing</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-[#EFEEEA]/60 max-w-2xl mx-auto">
                        Whether you're finding talent or finding work, we have a plan that fits your growth.
                        Join now and claim your Founding Member benefits.
                    </p>
                </div>

                {/* First 500 Rewards Banner */}
                <div className="max-w-[1000px] mx-auto px-6 mb-20">
                    <div className="bg-linear-to-br from-[#FE7743]/10 via-slate-50 to-[#273F4F]/10 dark:from-[#FE7743]/20 dark:via-[#111] dark:to-[#273F4F]/30 border border-[#FE7743]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(254,119,67,0.1)]">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-[#EFEEEA] mb-8 text-center flex items-center justify-center gap-3">
                            <span className="text-3xl">🏆</span> Founding Member Perks
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/60 dark:bg-[#000]/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                                <h3 className="text-xl font-bold text-[#FE7743] mb-4">For Freelancers & Students</h3>
                                <ul className="space-y-3">
                                    <Benefit check="✔">25 Free Bonus Credits</Benefit>
                                    <Benefit check="✔">Exclusive 'Founding Member' Badge</Benefit>
                                    <Benefit check="✔">0% Commission on first 3 projects</Benefit>
                                    <Benefit check="✔">Higher search ranking for 60 days</Benefit>
                                </ul>
                            </div>
                            <div className="bg-white/60 dark:bg-[#000]/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                                <h3 className="text-xl font-bold text-[#273F4F] dark:text-[#86b5d1] mb-4">For Clients & Businesses</h3>
                                <ul className="space-y-3">
                                    <Benefit check="✔">0% Service Fee for first 3 hires</Benefit>
                                    <Benefit check="✔">1 Free 'Featured Job' Post</Benefit>
                                    <Benefit check="✔">Priority freelancer suggestions</Benefit>
                                    <Benefit check="✔">Exclusive 'Founding Client' Badge</Benefit>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Freelancer Credit Packages */}
                <div className="max-w-[1200px] mx-auto px-6 pb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA]">Freelancer Credit Packages</h2>
                        <p className="text-slate-600 dark:text-[#EFEEEA]/60 mt-2">1 Credit = 1 Job Proposal Submission</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#FE7743]" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
                            {packages.map((pkg, idx) => (
                                <PricingCard
                                    key={pkg.id}
                                    title={pkg.name}
                                    price={pkg.pricePKR.toLocaleString()}
                                    credits={`${pkg.credits} Credits`}
                                    features={[`Submit ${pkg.credits} Proposals`, idx === 1 ? '2.5x More Value' : idx === 2 ? 'Maximum Value' : 'Standard Profile Visibility', idx > 0 ? 'Priority Support' : 'Normal Support']}
                                    buttonText="Buy Now"
                                    recommended={pkg.credits === 60}
                                    bestValue={pkg.credits === 150}
                                    accent={pkg.credits === 60 ? "#FE7743" : pkg.credits === 150 ? "#86b5d1" : undefined}
                                    onPurchase={() => handlePurchase(pkg.id)}
                                    isProcessing={processingId === pkg.id}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Subscription Plans & Client Features */}
                <div className="bg-slate-50 dark:bg-[#111] border-t border-slate-200 dark:border-white/5 py-24">
                    <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-16">

                        {/* Freelancer Pro Plan */}
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA] mb-8">Freelancer Pro Subscription</h2>
                            <div className="bg-white dark:bg-[#000] border border-slate-200 dark:border-[#273F4F] rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(39,63,79,0.3)_0%,transparent_70%)] pointer-events-none"></div>

                                <h3 className="text-2xl font-bold text-slate-900 dark:text-[#EFEEEA]">Pro Plan</h3>
                                <div className="flex items-baseline gap-2 mt-4 mb-8">
                                    <span className="text-4xl font-black text-[#FE7743]">PKR 1,500</span>
                                    <span className="text-slate-500 dark:text-[#EFEEEA]/50">/ month</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <Benefit check="⚡">25 Free Bonus Credits Monthly</Benefit>
                                    <Benefit check="⚡">Profile Visibility Boost</Benefit>
                                    <Benefit check="⚡">Exclusive 'Pro' Badge</Benefit>
                                    <Benefit check="⚡">Advanced Analytics</Benefit>
                                </ul>

                                <button className="w-full py-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#EFEEEA] font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>

                        {/* Additional Platform Features */}
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-[#EFEEEA] mb-8">Platform Features & Fees</h2>
                            <div className="space-y-6">
                                <FeatureBlock title="Standard Commission" price="10%">
                                    Automatically deducted from freelancer earnings upon successful gig delivery or job completion.
                                    <span className="text-[#FE7743] block mt-1">(0% for first 3 projects for Founding Members)</span>
                                </FeatureBlock>

                                <FeatureBlock title="Featured Gig Promotions" price="From PKR 500">
                                    Boost your gig to the top of the search results and homepage.<br />
                                    • 7 Days: PKR 500<br />
                                    • 30 Days: PKR 1,500
                                </FeatureBlock>

                                <FeatureBlock title="Client Job Posting" price="Free">
                                    Posting standard jobs is completely free. Reach thousands of freelancers instantly.
                                </FeatureBlock>

                                <FeatureBlock title="Client Premium Posts" price="From PKR 500">
                                    Stand out to the best talent.<br />
                                    • Urgent Hiring Badge: PKR 500<br />
                                    • Featured Job: PKR 1,000
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
        <li className="flex items-center gap-3 text-slate-700 dark:text-[#EFEEEA]">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#FE7743]/10 flex items-center justify-center text-[#FE7743] text-sm font-bold">
                {check}
            </span>
            <span className="text-sm md:text-base">{children}</span>
        </li>
    );
}

function PricingCard({ title, price, credits, features, buttonText, recommended, bestValue, accent }: any) {
    return (
        <div className={`relative bg-white dark:bg-[#111] border ${recommended ? `border-[${accent}] shadow-[0_0_30px_rgba(254,119,67,0.15)]` : 'border-slate-200 dark:border-white/10'} rounded-3xl p-8 flex flex-col`}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FE7743] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    Recommended
                </div>
            )}
            {bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#273F4F] text-white dark:text-[#86b5d1] border border-[#273F4F]/30 dark:border-[#86b5d1]/30 text-xs font-bold uppercase tracking-wider rounded-full">
                    Best Value
                </div>
            )}

            <h3 className="text-xl font-bold text-slate-900 dark:text-[#EFEEEA] text-center mb-2 mt-4">{title}</h3>
            <div className="text-center mb-6">
                <span className="text-sm text-slate-500 dark:text-[#EFEEEA]/50 font-semibold uppercase tracking-widest">{credits}</span>
            </div>

            <div className="flex justify-center items-baseline gap-2 mb-8">
                <span className="text-xl text-slate-500 dark:text-[#EFEEEA]/50">PKR</span>
                <span className="text-4xl font-black text-slate-900 dark:text-[#EFEEEA]">{price}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#FE7743] shrink-0" />
                        <span className="text-slate-600 dark:text-[#EFEEEA]/80 text-sm">{f}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full py-3 rounded-xl font-bold transition ${recommended ? 'bg-[#FE7743] text-white hover:bg-[#FE7743]/90' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#EFEEEA] hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                {buttonText}
            </button>
        </div>
    );
}

function FeatureBlock({ title, price, children }: any) {
    return (
        <div className="bg-white dark:bg-[#000] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#EFEEEA]">{title}</h3>
                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs font-bold text-[#FE7743]">{price}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-[#EFEEEA]/60 leading-relaxed">
                {children}
            </p>
        </div>
    )
}

'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { creditApi, paymentApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const role = (session as any)?.role;

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
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full relative z-10" style={{ paddingTop: 96 }}>

                {/* Ultra-Premium Header Section */}
                <div className="relative pt-20 pb-32 overflow-hidden bg-slate-900 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.05)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 text-center relative z-10 animate-fade-in">
                        <div className="inline-block px-5 py-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.2em] rounded-full mb-8 border border-primary/20 shadow-lg shadow-primary/5">
                            ⚡ Limited Founding Member Rewards
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            Transparent <span className="text-primary italic font-serif">investment.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto font-normal leading-relaxed">
                            High-end talent and enterprise solutions, engineered precisely for the scale of tomorrow's economy.
                        </p>
                    </div>
                </div>

                {/* First 500 Rewards Banner */}
                <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-32 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="bg-surface-light rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl border border-border-light text-text-main backdrop-blur-xl">

                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold tracking-tight text-text-main mb-4">Founding Member Perks</h2>
                            <p className="text-lg text-text-muted">Exclusive lifetime benefits for the first 500 visionaries to join Gigligo.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                            <div className="bg-background-light p-10 rounded-2xl border border-border-light shadow-sm hover:border-primary/30 transition-colors">
                                <h3 className="text-xl font-bold text-primary mb-8 uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined">psychology</span> For Talent
                                </h3>
                                <ul className="space-y-6">
                                    <Benefit check="check_circle">25 Bonus Credits Monthly</Benefit>
                                    <Benefit check="check_circle">Exclusive 'Founding' Badge</Benefit>
                                    <Benefit check="check_circle">0% Commission on first 3 projects</Benefit>
                                    <Benefit check="check_circle">Priority Search Ranking</Benefit>
                                </ul>
                            </div>
                            <div className="bg-background-light p-10 rounded-2xl border border-border-light shadow-sm hover:border-primary/30 transition-colors">
                                <h3 className="text-xl font-bold text-text-main mb-8 uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined">corporate_fare</span> For Businesses
                                </h3>
                                <ul className="space-y-6">
                                    <Benefit check="check_circle">0% Service Fee on first 3 hires</Benefit>
                                    <Benefit check="check_circle">1 Free 'Featured Job' Post</Benefit>
                                    <Benefit check="check_circle">Priority suggestion engine</Benefit>
                                    <Benefit check="check_circle">Founding Client Status</Benefit>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Freelancer Credit Packages */}
                <div className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-4xl font-bold tracking-tight text-text-main">Credit Packages</h2>
                        <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-6">1 Credit = 1 Professional Proposal</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

                {/* Bottom Section */}
                <div className="bg-surface-light border-t border-border-light py-32">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24">

                        {/* Freelancer Pro Plan */}
                        <div className="animate-fade-in">
                            <h2 className="text-4xl font-bold tracking-tight text-text-main mb-12">Gigligo Pro</h2>
                            <div className="bg-slate-900 text-white rounded-3xl p-12 relative overflow-hidden shadow-2xl border border-white/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.15)_0%,transparent_70%)] pointer-events-none"></div>

                                <h3 className="text-2xl font-bold mb-4">Pro Subscription</h3>
                                <div className="flex items-baseline gap-3 mt-4 mb-12 border-b border-white/10 pb-8">
                                    <span className="text-5xl font-bold text-primary tracking-tight">PKR 1,500</span>
                                    <span className="text-white/50 font-medium">/ month</span>
                                </div>

                                <ul className="space-y-6 mb-12">
                                    <ProBenefit>25 Free Credits Monthly</ProBenefit>
                                    <ProBenefit>Elite Profile Badge</ProBenefit>
                                    <ProBenefit>Advanced Market Analytics</ProBenefit>
                                    <ProBenefit>Priority Support Access</ProBenefit>
                                </ul>

                                <button className="w-full py-5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-lg">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>

                        {/* Platform Features */}
                        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <h2 className="text-4xl font-bold tracking-tight text-text-main mb-12">Platform Mechanics</h2>
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
        <li className="flex items-center gap-4 text-text-main">
            <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-[16px]">{check}</span>
            </span>
            <span className="text-[15px] font-medium text-text-muted">{children}</span>
        </li>
    );
}

function ProBenefit({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-4 text-white">
            <span className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
            </span>
            <span className="text-[15px] font-medium text-white/80">{children}</span>
        </li>
    );
}


function PricingCard({ title, price, credits, features, buttonText, recommended, bestValue, onPurchase, isProcessing }: any) {
    return (
        <div className={`relative bg-background-light border ${recommended ? `border-primary shadow-2xl flex-col justify-between -mt-4 mb-4` : 'border-border-light shadow-sm flex-col justify-between'} rounded-3xl p-10 flex transition-all duration-500 hover:-translate-y-2`}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/30">
                    Recommended
                </div>
            )}
            {bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-text-main text-background-light text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Best Value
                </div>
            )}

            <div>
                <h3 className="text-2xl font-bold text-text-main text-center mb-3 mt-4">{title}</h3>
                <div className="text-center mb-10 border-b border-border-light pb-8">
                    <span className="px-4 py-1.5 bg-surface-light border border-border-light text-text-muted rounded-full text-xs font-bold uppercase tracking-widest">{credits}</span>
                </div>

                <div className="flex justify-center items-baseline gap-2 mb-12">
                    <span className="text-sm text-text-muted font-bold">PKR</span>
                    <span className="text-5xl font-bold text-text-main tracking-tight">{price}</span>
                </div>

                <ul className="space-y-6 mb-12">
                    {features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary shrink-0 opacity-80">check</span>
                            <span className="text-text-muted text-[15px] font-medium leading-relaxed">{f}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onPurchase}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-2 ${recommended ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20' : 'bg-surface-light border border-border-light text-text-main hover:border-primary/50'}`}
            >
                {isProcessing ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : null}
                {isProcessing ? 'Processing' : buttonText}
            </button>
        </div>
    );
}

function FeatureBlock({ title, price, children }: any) {
    return (
        <div className="bg-background-light border border-border-light rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{title}</h3>
                <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">{price}</span>
            </div>
            <p className="text-text-muted leading-relaxed font-medium">
                {children}
            </p>
        </div>
    )
}

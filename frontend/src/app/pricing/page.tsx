'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { creditApi, paymentApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['Credit Packages', 'Pro Plan', 'Enterprise'];

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

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
            const res: any = await paymentApi.checkout(token, { packageId: pkgId, method: 'CARD' });
            if (res.data?.paymentUrl || res.paymentUrl) {
                window.location.href = res.data?.paymentUrl || res.paymentUrl;
            }
        } catch (error) {
            console.error(error);
            alert('Failed to initiate checkout.');
            setProcessingId(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-text-main font-sans selection:bg-primary/30 antialiased">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 80 }}>
                {/* Header */}
                <section className="py-16 md:py-20 bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6">
                                <span className="text-xs font-semibold text-primary">⚡ Limited founding member rewards</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                                Transparent <span className="text-primary">pricing.</span>
                            </h1>
                            <p className="text-lg text-text-muted max-w-xl mx-auto font-medium leading-relaxed">
                                High-end talent and enterprise solutions, designed for the scale of tomorrow&apos;s economy.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Tabs */}
                <div className="max-w-6xl mx-auto px-6 -mt-6 relative z-10 mb-12">
                    <div className="flex items-center justify-center gap-1 bg-gray-50 rounded-xl p-1 max-w-md mx-auto border border-gray-100">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(i)}
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === i
                                    ? 'bg-white text-text-main shadow-sm border border-gray-100'
                                    : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                        <motion.div
                            key="credits"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Founding Member Perks */}
                            <div className="max-w-6xl mx-auto px-6 mb-16">
                                <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
                                    <div className="text-center mb-10">
                                        <h2 className="text-2xl font-bold text-text-main mb-3">Founding Member Perks</h2>
                                        <p className="text-sm text-text-muted font-medium">Exclusive benefits for the first 500 visionaries to join Gigligo.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-white p-8 rounded-2xl border border-gray-100">
                                            <h3 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">For Talent</h3>
                                            <ul className="space-y-4">
                                                <Benefit>25 Bonus Credits Monthly</Benefit>
                                                <Benefit>Exclusive &apos;Founding&apos; Badge</Benefit>
                                                <Benefit>0% Commission on first 3 projects</Benefit>
                                                <Benefit>Priority Search Ranking</Benefit>
                                            </ul>
                                        </div>
                                        <div className="bg-white p-8 rounded-2xl border border-gray-100">
                                            <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">For Businesses</h3>
                                            <ul className="space-y-4">
                                                <Benefit>0% Service Fee on first 3 hires</Benefit>
                                                <Benefit>1 Free &apos;Featured Job&apos; Post</Benefit>
                                                <Benefit>Priority suggestion engine</Benefit>
                                                <Benefit>Founding Client Status</Benefit>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Packages */}
                            <div className="max-w-6xl mx-auto px-6 pb-20">
                                <div className="text-center mb-12">
                                    <h2 className="text-2xl font-bold text-text-main mb-2">Credit Packages</h2>
                                    <p className="text-sm font-medium text-text-muted">1 Credit = 1 Professional Proposal</p>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-20">
                                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                        </motion.div>
                    )}

                    {activeTab === 1 && (
                        <motion.div
                            key="pro"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-3xl mx-auto px-6 pb-20"
                        >
                            <div className="bg-text-main text-white rounded-2xl p-10 md:p-14 border border-gray-800">
                                <h3 className="text-2xl font-bold mb-2">Gigligo Pro</h3>
                                <p className="text-white/60 text-sm mb-8">Monthly subscription for serious freelancers</p>
                                <div className="flex items-baseline gap-2 mb-10 border-b border-white/10 pb-8">
                                    <span className="text-4xl font-bold text-primary">PKR 1,500</span>
                                    <span className="text-white/40 font-medium text-sm">/ month</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    <ProBenefit>25 Free Credits Monthly</ProBenefit>
                                    <ProBenefit>Elite Profile Badge</ProBenefit>
                                    <ProBenefit>Advanced Market Analytics</ProBenefit>
                                    <ProBenefit>Priority Support Access</ProBenefit>
                                </ul>
                                <button className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all text-sm">
                                    Upgrade to Pro
                                </button>
                            </div>

                            <div className="mt-8 space-y-4">
                                <FeatureBlock title="Standard Commission" price="10%">
                                    Automatically deducted upon successful delivery. Transparent, simple, fair.
                                </FeatureBlock>
                                <FeatureBlock title="Skill Verified Badges" price="Free">
                                    Included for all university-vetted profiles to ensure absolute quality.
                                </FeatureBlock>
                                <FeatureBlock title="Featured Listings" price="PKR 500+">
                                    Boost your presence for 7-30 days to reach elite clients faster.
                                </FeatureBlock>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 2 && (
                        <motion.div
                            key="enterprise"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-3xl mx-auto px-6 pb-20 text-center"
                        >
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 md:p-14">
                                <h3 className="text-2xl font-bold mb-3">Enterprise Plan</h3>
                                <p className="text-text-muted font-medium mb-8 max-w-md mx-auto text-sm leading-relaxed">
                                    Custom solutions for organizations hiring at scale. Dedicated account management, volume discounts, and custom integrations.
                                </p>
                                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                                    {[
                                        { label: 'Dedicated Manager', icon: '👤' },
                                        { label: 'Volume Discounts', icon: '📊' },
                                        { label: 'Custom API', icon: '🔗' },
                                    ].map((item) => (
                                        <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-5">
                                            <div className="text-2xl mb-2">{item.icon}</div>
                                            <p className="text-sm font-semibold text-text-main">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/contact" className="inline-flex px-8 py-3.5 bg-text-main text-white font-semibold rounded-xl hover:bg-text-main/90 transition-all text-sm">
                                    Contact Sales
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}

function Benefit({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-3 text-text-main">
            <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-[12px]">check</span>
            </span>
            <span className="text-sm font-medium text-text-muted">{children}</span>
        </li>
    );
}

function ProBenefit({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[12px]">bolt</span>
            </span>
            <span className="text-sm font-medium text-white/70">{children}</span>
        </li>
    );
}

function PricingCard({ title, price, credits, features, buttonText, recommended, bestValue, onPurchase, isProcessing }: any) {
    return (
        <div className={`relative bg-white border ${recommended ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02] z-10' : 'border-gray-100 shadow-sm'} rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Recommended
                </div>
            )}
            {bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-text-main text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Best Value
                </div>
            )}
            <div>
                <h3 className="text-xl font-bold text-text-main text-center mb-3 mt-2">{title}</h3>
                <div className="text-center mb-6 border-b border-gray-100 pb-6">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-text-muted rounded-full text-xs font-semibold">{credits}</span>
                </div>
                <div className="flex justify-center items-baseline gap-1.5 mb-8">
                    <span className="text-xs text-text-muted font-semibold uppercase">PKR</span>
                    <span className="text-4xl font-bold text-text-main">{price}</span>
                </div>
                <ul className="space-y-4 mb-8">
                    {features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 mt-0.5">
                                <span className="material-symbols-outlined text-primary text-[11px]">check</span>
                            </div>
                            <span className="text-text-muted text-sm font-medium">{f}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={onPurchase}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${recommended ? 'bg-primary text-white hover:bg-primary/90 shadow-sm' : 'bg-gray-50 border border-gray-200 text-text-main hover:border-primary/40'}`}
            >
                {isProcessing ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
                {isProcessing ? 'Processing...' : buttonText}
            </button>
        </div>
    );
}

function FeatureBlock({ title, price, children }: any) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-text-main group-hover:text-primary transition-colors">{title}</h3>
                <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary border border-primary/15">{price}</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{children}</p>
        </div>
    );
}

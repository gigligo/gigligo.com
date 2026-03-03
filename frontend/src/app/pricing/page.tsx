'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { creditApi, paymentApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1, y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

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
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-text-main dark:text-white font-sans selection:bg-primary/30 antialiased">
            <Navbar />

            <main className="flex-1 w-full relative z-10" style={{ paddingTop: 72 }}>

                {/* Ultra-Premium Header Section */}
                <section className="relative overflow-hidden bg-background-dark text-white py-24 md:py-32 border-b border-white/5">
                    {/* Framer-style mesh blurs */}
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-block px-6 py-2 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-[0.2em] rounded-full mb-8 border border-primary/20 backdrop-blur-md">
                                ⚡ Limited Founding member rewards
                            </div>
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
                                Transparent <span className="text-primary italic font-serif">investment.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
                                High-end talent and enterprise solutions, engineered precisely for the scale of tomorrow's economy.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* First 500 Rewards Banner */}
                <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white dark:bg-white/5 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl border border-border-light dark:border-white/10 backdrop-blur-2xl"
                    >
                        <div className="text-center mb-16 relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main dark:text-white mb-6">Founding Member Perks</h2>
                            <p className="text-lg md:text-xl text-text-muted dark:text-white/60 font-medium">Exclusive lifetime benefits for the first 500 visionaries to join Gigligo.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                            <div className="bg-black/5 dark:bg-white/5 p-12 rounded-4xl border border-border-light dark:border-white/10 shadow-sm hover:border-primary/30 transition-all duration-500">
                                <h3 className="text-base font-bold text-primary mb-10 uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">psychology</span> For Talent
                                </h3>
                                <ul className="space-y-6">
                                    <Benefit check="check_circle">25 Bonus Credits Monthly</Benefit>
                                    <Benefit check="check_circle">Exclusive 'Founding' Badge</Benefit>
                                    <Benefit check="check_circle">0% Commission on first 3 projects</Benefit>
                                    <Benefit check="check_circle">Priority Search Ranking</Benefit>
                                </ul>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 p-12 rounded-4xl border border-border-light dark:border-white/10 shadow-sm hover:border-primary/30 transition-all duration-500">
                                <h3 className="text-base font-bold text-text-main dark:text-white mb-10 uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">corporate_fare</span> For Businesses
                                </h3>
                                <ul className="space-y-6">
                                    <Benefit check="check_circle">0% Service Fee on first 3 hires</Benefit>
                                    <Benefit check="check_circle">1 Free 'Featured Job' Post</Benefit>
                                    <Benefit check="check_circle">Priority suggestion engine</Benefit>
                                    <Benefit check="check_circle">Founding Client Status</Benefit>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Freelancer Credit Packages */}
                <div className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text-main dark:text-white mb-6">Credit Packages</h2>
                        <p className="text-sm font-bold text-text-muted dark:text-white/40 uppercase tracking-[0.3em]">1 Credit = 1 Professional Proposal</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-32">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
                        >
                            {packages.map((pkg, idx) => (
                                <motion.div key={pkg.id} variants={itemVariants}>
                                    <PricingCard
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
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="bg-black/5 dark:bg-white/5 border-t border-border-light dark:border-white/10 py-32">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24">

                        {/* Freelancer Pro Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main dark:text-white mb-12">Gigligo Pro</h2>
                            <div className="bg-background-dark text-white rounded-[3rem] p-12 md:p-16 relative overflow-hidden shadow-2xl border border-white/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                                <h3 className="text-2xl font-bold mb-4">Pro Subscription</h3>
                                <div className="flex items-baseline gap-3 mt-4 mb-12 border-b border-white/10 pb-10">
                                    <span className="text-6xl font-bold text-primary tracking-tighter">PKR 1,500</span>
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-sm">/ month</span>
                                </div>

                                <ul className="space-y-6 mb-12">
                                    <ProBenefit>25 Free Credits Monthly</ProBenefit>
                                    <ProBenefit>Elite Profile Badge</ProBenefit>
                                    <ProBenefit>Advanced Market Analytics</ProBenefit>
                                    <ProBenefit>Priority Support Access</ProBenefit>
                                </ul>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-6 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 text-lg"
                                >
                                    Upgrade to Pro
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Platform Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main dark:text-white mb-12">System Mechanics</h2>
                            <div className="space-y-6">
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
                <span className="material-symbols-outlined text-[14px]">bolt</span>
            </span>
            <span className="text-[15px] font-bold text-white/70 tracking-tight">{children}</span>
        </li>
    );
}


function PricingCard({ title, price, credits, features, buttonText, recommended, bestValue, onPurchase, isProcessing }: any) {
    return (
        <div className={`relative bg-white dark:bg-white/5 border ${recommended ? `border-primary shadow-[0_30px_60px_rgba(0,124,255,0.15)] scale-105 z-10` : 'border-border-light dark:border-white/10 shadow-sm'} rounded-[3rem] p-12 flex flex-col justify-between transition-all duration-700 hover:-translate-y-4`}>
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-primary/30 whitespace-nowrap">
                    Recommended
                </div>
            )}
            {bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-background-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap dark:bg-white dark:text-background-dark">
                    Best Value
                </div>
            )}

            <div>
                <h3 className="text-3xl font-bold text-text-main dark:text-white text-center mb-4 tracking-tighter mt-4">{title}</h3>
                <div className="text-center mb-10 border-b border-border-light dark:border-white/5 pb-10">
                    <span className="px-5 py-2 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 text-text-muted dark:text-white/60 rounded-full text-[10px] font-bold uppercase tracking-widest">{credits}</span>
                </div>

                <div className="flex justify-center items-baseline gap-2 mb-12">
                    <span className="text-sm text-text-muted dark:text-white/40 font-bold uppercase tracking-widest">PKR</span>
                    <span className="text-6xl font-bold text-text-main dark:text-white tracking-tighter">{price}</span>
                </div>

                <ul className="space-y-6 mb-12">
                    {features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-[14px]">check</span>
                            </div>
                            <span className="text-text-muted dark:text-white/60 text-[15px] font-bold leading-tight tracking-tight">{f}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPurchase}
                disabled={isProcessing}
                className={`w-full py-5 rounded-full font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-3 ${recommended ? 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/25' : 'bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 text-text-main dark:text-white hover:border-primary/50'}`}
            >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {isProcessing ? 'Processing...' : buttonText}
            </motion.button>
        </div>
    );
}

function FeatureBlock({ title, price, children }: any) {
    return (
        <div className="bg-white dark:bg-white/5 border border-border-light dark:border-white/10 rounded-4xl p-10 hover:border-primary/50 hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors tracking-tight">{title}</h3>
                <span className="px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-[0.2em] border border-primary/20">{price}</span>
            </div>
            <p className="text-lg text-text-muted dark:text-white/60 leading-relaxed font-medium">
                {children}
            </p>
        </div>
    )
}

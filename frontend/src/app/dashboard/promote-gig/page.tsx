'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { gigApi, walletApi } from '@/lib/api';
import Link from 'next/link';

export default function PromoteGigPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const token = (session as any)?.accessToken;

    const [gigs, setGigs] = useState<any[]>([]);
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // UI State
    const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(7);
    const [isBoosting, setIsBoosting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        const load = async () => {
            try {
                const [myGigs, walletRes] = await Promise.all([
                    gigApi.getMyGigs(token),
                    walletApi.getBalance(token)
                ]);
                setGigs(myGigs);
                setWallet(walletRes);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token]);

    const handleBoost = async () => {
        if (!selectedGigId || !token) return;
        setIsBoosting(true);
        setMessage('');

        try {
            await gigApi.boost(token, selectedGigId, duration);
            setMessage('Your gig has been successfully promoted!');

            // Reload balances and gigs
            const [myGigs, walletRes] = await Promise.all([
                gigApi.getMyGigs(token),
                walletApi.getBalance(token)
            ]);
            setGigs(myGigs);
            setWallet(walletRes);

            setSelectedGigId(null);

            // Optional: redirect after success
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (e: any) {
            setMessage(e.message || 'Error occurred while promoting gig');
        } finally {
            setIsBoosting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary text-primary border-t-transparent flex items-center justify-center animate-spin rounded-full"></div>
            </div>
        );
    }

    const pricePerDay = 500;
    const totalCost = duration * pricePerDay;
    const hasEnoughBalance = wallet && wallet.balancePKR >= totalCost;

    return (
        <div className="flex flex-col min-h-screen bg-slate-900">
            <Navbar />
            <main className="flex-1 max-w-[1000px] mx-auto px-6 py-12 w-full" style={{ paddingTop: 96 }}>

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-slate-100 mb-4">Promote Your <span className="text-primary">Gig</span></h1>
                    <p className="text-lg text-slate-100/60 max-w-xl mx-auto">
                        Get your gig featured at the top of the search results and land more clients effortlessly.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-12">

                    {/* Left Col: Target Selection and Duration */}
                    <div className="md:col-span-3 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 mb-4">1. Select a Gig</h2>
                            {gigs.length === 0 ? (
                                <div className="p-6 border border-white/10 rounded-2xl bg-slate-800 text-center">
                                    <p className="text-slate-100/60 mb-4">You don't have any active gigs to promote.</p>
                                    <Link href="/gigs/create" className="text-primary font-semibold hover:underline">
                                        Create a Gig
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {gigs.map(g => (
                                        <div
                                            key={g.id}
                                            onClick={() => setSelectedGigId(g.id)}
                                            className={`p-4 border rounded-xl cursor-pointer transition flex justify-between items-center ${selectedGigId === g.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-white/10 bg-slate-800 hover:border-white/30'
                                                }`}
                                        >
                                            <div>
                                                <h3 className="font-bold text-slate-100">{g.title}</h3>
                                                <p className="text-sm text-slate-100/50 mt-1">{g.category}</p>
                                            </div>
                                            {g.boosts && g.boosts.length > 0 && (
                                                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">
                                                    Already Promoted
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedGigId && (
                            <div className="animate-in fade-in slide-in-from-top-4">
                                <h2 className="text-xl font-bold text-slate-100 mb-4">2. Select Duration</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {[3, 7, 30].map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            className={`p-4 border rounded-xl font-bold transition ${duration === d
                                                    ? 'border-[#273F4F] bg-[#273F4F] text-slate-100'
                                                    : 'border-white/10 bg-slate-800 text-slate-100/60 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="block text-2xl mb-1">{d}</span>
                                            Days
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Checkout / Summary */}
                    <div className="md:col-span-2">
                        <div className="sticky top-24 bg-slate-800 border border-white/10 rounded-3xl p-6">
                            <h2 className="text-xl font-bold text-slate-100 mb-6">Promotion Summary</h2>

                            <div className="space-y-4 mb-8 text-slate-100/80">
                                <div className="flex justify-between">
                                    <span>Rate per day</span>
                                    <span>PKR {pricePerDay}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Duration</span>
                                    <span>{duration} Days</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between font-bold text-lg text-slate-100">
                                    <span>Total Value</span>
                                    <span>PKR {(totalCost).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-100/60">Wallet Balance</span>
                                    <span className={`font-bold ${hasEnoughBalance ? 'text-[#22c55e]' : 'text-red-400'}`}>
                                        PKR {wallet?.balancePKR?.toLocaleString() || '0'}
                                    </span>
                                </div>
                                {!hasEnoughBalance && (
                                    <p className="text-xs text-red-400 mt-2">
                                        Insufficient funds. Please <Link href="/dashboard/earnings" className="underline font-bold">deposit funds</Link> first.
                                    </p>
                                )}
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.includes('success') ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-red-500/10 text-red-500'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                onClick={handleBoost}
                                disabled={!selectedGigId || !hasEnoughBalance || isBoosting}
                                className="w-full py-4 bg-primary disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-xl text-lg hover:bg-primary/90 transition"
                            >
                                {isBoosting ? 'Processing...' : 'Complete Purchase'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

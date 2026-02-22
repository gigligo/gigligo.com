'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { creditApi } from '@/lib/api';
import Link from 'next/link';

export default function CreditsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [packages, setPackages] = useState<any[]>([]);
    const [credits, setCredits] = useState(0);
    const [ledger, setLedger] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const token = (session as any)?.accessToken;

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        const load = async () => {
            try {
                const [pkgRes, balRes, ledRes] = await Promise.all([
                    creditApi.getPackages(),
                    creditApi.getBalance(token),
                    creditApi.getLedger(token),
                ]);
                setPackages(pkgRes);
                setCredits(balRes.credits);
                setLedger(ledRes.items || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token]);

    const handlePurchase = async (packageId: string) => {
        setPurchasing(packageId);
        setMessage('');
        try {
            const res = await creditApi.purchase(token, packageId);
            setCredits(res.credits);
            setMessage(`✅ Successfully purchased ${res.purchased} credits!`);
            // Refresh ledger
            const ledRes = await creditApi.getLedger(token);
            setLedger(ledRes.items || []);
        } catch (e: any) {
            setMessage(`❌ ${e.message}`);
        }
        setPurchasing(null);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-[#000] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FE7743] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#000]">
            <Navbar />
            <main className="flex-1 max-w-[1000px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <Link href="/dashboard" className="text-xs text-[#EFEEEA]/40 hover:text-[#FE7743] transition mb-6 inline-block">← Dashboard</Link>

                {/* Balance Hero */}
                <div className="bg-linear-to-r from-[#FE7743]/20 via-[#FE7743]/10 to-[#273F4F]/20 rounded-2xl p-8 border border-[#FE7743]/20 mb-8">
                    <p className="text-xs text-[#FE7743] uppercase tracking-wider font-semibold mb-2">Your Credit Balance</p>
                    <p className="text-5xl font-black text-[#EFEEEA]">{credits}</p>
                    <p className="text-sm text-[#EFEEEA]/40 mt-2">1 credit = 1 job application</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm mb-6 ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message}
                    </div>
                )}

                {/* Packages */}
                <h2 className="text-xl font-bold text-[#EFEEEA] mb-4">Purchase Credits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {packages.map((pkg: any, i: number) => {
                        const perCredit = Math.round(pkg.pricePKR / pkg.credits);
                        const isBest = i === 1; // Standard is best value
                        return (
                            <div key={pkg.id} className={`relative rounded-2xl p-6 border flex flex-col ${isBest
                                ? 'bg-[#FE7743]/10 border-[#FE7743]/40'
                                : 'bg-[#111] border-white/10'
                                }`}>
                                {isBest && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FE7743] text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
                                        Best Value
                                    </span>
                                )}
                                <p className="font-bold text-[#EFEEEA] text-sm">{pkg.name}</p>
                                <p className="text-3xl font-black text-[#FE7743] mt-2">{pkg.credits}</p>
                                <p className="text-xs text-[#EFEEEA]/40">credits</p>
                                <div className="mt-4 mb-4 flex-1">
                                    <p className="text-lg font-bold text-[#EFEEEA]">PKR {pkg.pricePKR.toLocaleString()}</p>
                                    <p className="text-xs text-[#EFEEEA]/40">PKR {perCredit} per credit</p>
                                </div>
                                <p className="text-xs text-[#EFEEEA]/40 mb-4">{pkg.description}</p>
                                <button onClick={() => handlePurchase(pkg.id)} disabled={purchasing === pkg.id}
                                    className={`w-full py-2.5 font-semibold rounded-xl text-sm transition disabled:opacity-50 ${isBest
                                        ? 'bg-[#FE7743] text-white hover:bg-[#FE7743]/90'
                                        : 'bg-white/5 text-[#EFEEEA] border border-white/10 hover:bg-white/10'
                                        }`}>
                                    {purchasing === pkg.id ? 'Processing...' : 'Purchase'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Credit History */}
                <h2 className="text-xl font-bold text-[#EFEEEA] mb-4">Credit History</h2>
                <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                    {ledger.length === 0 ? (
                        <div className="p-8 text-center text-[#EFEEEA]/40 text-sm">No credit history yet</div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {ledger.map((entry: any) => (
                                <div key={entry.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#EFEEEA] font-medium">{entry.reason}</p>
                                        <p className="text-xs text-[#EFEEEA]/30 mt-1">{new Date(entry.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${entry.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {entry.amount > 0 ? '+' : ''}{entry.amount}
                                        </p>
                                        <p className="text-[10px] text-[#EFEEEA]/30">Balance: {entry.balanceAfter}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { walletApi } from '@/lib/api';
import Link from 'next/link';

export default function EarningsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('BANK_TRANSFER');
    const [withdrawing, setWithdrawing] = useState(false);
    const [message, setMessage] = useState('');

    const token = (session as any)?.accessToken;

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status !== 'authenticated' || !token) return;

        const load = async () => {
            try {
                const [w, t] = await Promise.all([
                    walletApi.getBalance(token),
                    walletApi.getTransactions(token),
                ]);
                setWallet(w);
                setTransactions(t.items || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [status, token]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawing(true);
        setMessage('');
        try {
            await walletApi.withdraw(token, parseInt(withdrawAmount), withdrawMethod);
            setMessage('✅ Withdrawal request submitted successfully.');
            setWithdrawAmount('');
            // Refresh
            const [w, t] = await Promise.all([
                walletApi.getBalance(token),
                walletApi.getTransactions(token),
            ]);
            setWallet(w);
            setTransactions(t.items || []);
        } catch (e: any) {
            setMessage(`❌ ${e.message}`);
        }
        setWithdrawing(false);
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balances */}
                    <div className="md:col-span-2 bg-[#111] rounded-2xl border border-white/10 p-8 flex flex-col justify-center">
                        <p className="text-xs text-[#EFEEEA]/40 uppercase tracking-wider font-semibold mb-2">Available for Withdrawal</p>
                        <p className="text-5xl font-black text-[#FE7743]">PKR {wallet?.balancePKR?.toLocaleString() || '0'}</p>
                        {wallet?.pendingPKR > 0 && (
                            <p className="text-sm text-yellow-500 mt-3 font-medium">
                                ⏳ PKR {wallet.pendingPKR.toLocaleString()} pending withdrawal
                            </p>
                        )}
                    </div>

                    {/* Withdrawal Form */}
                    <div className="bg-[#111] rounded-2xl border border-[#FE7743]/30 p-6 shadow-[0_0_30px_rgba(254,119,67,0.05)]">
                        <h2 className="font-bold text-[#EFEEEA] mb-4">Request Withdrawal</h2>
                        {message && (
                            <div className={`p-3 rounded-lg text-xs mb-4 ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="text-[10px] text-[#EFEEEA]/60 font-semibold uppercase tracking-wider block mb-1">Amount (PKR)</label>
                                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required min="1000" max={wallet?.balancePKR || 0}
                                    placeholder="Min 1,000"
                                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50" />
                            </div>
                            <div>
                                <label className="text-[10px] text-[#EFEEEA]/60 font-semibold uppercase tracking-wider block mb-1">Method</label>
                                <select value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50">
                                    <option value="BANK_TRANSFER">Bank Transfer (1-3 days)</option>
                                    <option value="JAZZCASH">JazzCash (Instant)</option>
                                    <option value="EASYPAISA">Easypaisa (Instant)</option>
                                </select>
                            </div>
                            <button type="submit" disabled={withdrawing || !withdrawAmount || parseInt(withdrawAmount) > wallet?.balancePKR}
                                className="w-full py-2.5 bg-[#FE7743] text-white font-semibold rounded-lg text-sm hover:bg-[#FE7743]/90 transition disabled:opacity-50">
                                {withdrawing ? 'Processing...' : 'Withdraw Funds'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Transaction History */}
                <h2 className="text-xl font-bold text-[#EFEEEA] mb-4">Transaction History</h2>
                <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-[#EFEEEA]/40 text-sm">No transactions yet</div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {transactions.map((t: any) => (
                                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-white/2 transition">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            {t.type === 'EARNING' && <span className="text-green-400 text-xl">↓</span>}
                                            {t.type === 'COMMISSION' && <span className="text-red-400 text-xl">↑</span>}
                                            {t.type === 'WITHDRAWAL' && <span className="text-[#FE7743] text-xl">↗</span>}
                                            {t.type === 'CREDIT_PURCHASE' && <span className="text-blue-400 text-xl">💳</span>}
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#EFEEEA] font-medium">{t.type.replace('_', ' ')}</p>
                                            <p className="text-xs text-[#EFEEEA]/40 mt-0.5">{t.description}</p>
                                            <p className="text-[10px] text-[#EFEEEA]/30 mt-1">
                                                {new Date(t.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${['EARNING', 'REFUND'].includes(t.type) ? 'text-green-400' : 'text-[#EFEEEA]'}`}>
                                            {['EARNING', 'REFUND'].includes(t.type) ? '+' : '-'}{t.amountPKR?.toLocaleString()} PKR
                                        </p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm ${t.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' :
                                            t.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {t.status}
                                        </span>
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

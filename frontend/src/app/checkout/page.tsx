'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const txnId = searchParams.get('txnId');
    const amount = searchParams.get('amount');
    const pkgId = searchParams.get('pkgId');
    const userId = searchParams.get('userId');
    const method = searchParams.get('method') || 'CARD';

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate network delay for payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Fire webhook to backend
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payments/webhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    amount: parseFloat(amount || '0'),
                    status: 'COMPLETED',
                    method,
                    reference: txnId,
                    packageId: pkgId,
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
                // Redirect back to dashboard after a short delay
                setTimeout(() => {
                    router.push('/dashboard/credits?success=true');
                }, 1500);
            } else {
                throw new Error('Payment Failed');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to process mock payment.');
            setIsProcessing(false);
        }
    };

    if (!txnId || !amount) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Checkout Session</h1>
                    <Link href="/pricing" className="text-teal-vibrant hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Return to Pricing
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="bg-slate-800 p-8 rounded-2xl border border-teal-vibrant/30 text-center max-w-sm w-full shadow-2xl shadow-teal-vibrant/10">
                    <div className="w-16 h-16 bg-teal-vibrant/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-teal-vibrant" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-slate-400 mb-6 text-sm">Your transaction has been processed and credits have been added to your wallet.</p>
                    <Loader2 className="w-6 h-6 animate-spin text-teal-vibrant mx-auto" />
                    <p className="text-xs text-slate-500 mt-4">Redirecting you back to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
            {/* Left Side - Details */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-r border-[#222]">
                <div>
                    <Link href="/pricing" className="text-slate-400 hover:text-white flex items-center gap-2 mb-12 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Cancel and return to Gigligo
                    </Link>

                    <div className="mb-2 text-teal-vibrant font-semibold text-sm tracking-wider uppercase">Gigligo Secure Checkout</div>
                    <h1 className="text-3xl font-bold mb-8">Complete your purchase</h1>

                    <div className="bg-slate-800 border border-[#222] rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400">Transaction ID</span>
                            <span className="font-mono text-sm">{txnId}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400">Payment Method</span>
                            <span className="font-medium">{method} (Sandbox)</span>
                        </div>
                        <div className="h-px w-full bg-[#222] my-4"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-slate-300 font-medium">Total Amount</span>
                            <div className="text-right">
                                <span className="text-3xl font-bold text-white">PKR {parseFloat(amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 bg-teal-vibrant/5 p-4 rounded-lg border border-teal-vibrant/10">
                        <ShieldCheck className="w-5 h-5 text-teal-vibrant shrink-0" />
                        <p>This is a secure Sandbox testing environment. No real funds will be deducted from your account.</p>
                    </div>
                </div>

                <div className="mt-12 text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} Gigligo Technologies. All rights reserved.
                </div>
            </div>

            {/* Right Side - Payment Form */}
            <div className="w-full md:w-1/2 bg-[#0a0a0a] p-8 md:p-16 flex items-center">
                <div className="w-full max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-teal-vibrant" />
                        Payment Details
                    </h2>

                    <form onSubmit={handlePay} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Card Number (Mock)</label>
                            <input
                                type="text"
                                placeholder="4242 4242 4242 4242"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                                className="w-full bg-slate-800 border border-[#222] focus:border-teal-vibrant focus:ring-1 focus:ring-teal-vibrant rounded-lg px-4 py-3 outline-none transition-all font-mono"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required
                                    className="w-full bg-slate-800 border border-[#222] focus:border-teal-vibrant focus:ring-1 focus:ring-teal-vibrant rounded-lg px-4 py-3 outline-none transition-all font-mono"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-slate-300 mb-2">CVC</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    required
                                    className="w-full bg-slate-800 border border-[#222] focus:border-teal-vibrant focus:ring-1 focus:ring-teal-vibrant rounded-lg px-4 py-3 outline-none transition-all font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-teal-vibrant hover:bg-teal-vibrant/90 text-[#050505] font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(13,148,136,0.3)] transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                            ) : (
                                `Pay PKR ${parseFloat(amount).toLocaleString()}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-vibrant" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

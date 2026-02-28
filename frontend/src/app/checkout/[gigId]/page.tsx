import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Check } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage({ params, searchParams }: { params: { gigId: string }, searchParams: { pkg?: string } }) {
    const pkgName = searchParams.pkg || 'starter';

    const prices: Record<string, number> = {
        starter: 149,
        standard: 499,
        premium: 1199,
    };

    const price = prices[pkgName] || prices.starter;
    const platformFee = Math.round(price * 0.05);
    const total = price + platformFee;

    return (
        <div className="flex flex-col min-h-screen bg-light">
            <Navbar />

            <main className="flex-1 max-w-[1000px] mx-auto px-6 py-8" style={{ paddingTop: 96 }}>
                <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 border-b pb-4 text-primary">Order Summary</h2>

                            <div className="flex gap-4 mb-6">
                                <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <Image src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=150&fit=crop" alt="Gig" width={96} height={64} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary">Custom Next.js eCommerce Site</h3>
                                    <p className="text-xs text-muted capitalize">{pkgName} Package</p>
                                </div>
                            </div>

                            <ul className="space-y-2 mb-6 text-sm text-muted">
                                <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Responsive Design</li>
                                <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Payment Integration</li>
                                <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Source Code</li>
                            </ul>

                            <div className="border-t pt-4 space-y-3 text-sm">
                                <div className="flex justify-between text-muted">
                                    <span>Package Price</span>
                                    <span>${price}</span>
                                </div>
                                <div className="flex justify-between text-muted">
                                    <span>Service Fee (5%)</span>
                                    <span>${platformFee}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-primary pt-3 border-t">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 border-b pb-4 text-primary">Payment Method</h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-accent transition">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-accent" />
                                        <span className="font-semibold text-primary text-sm">Credit / Debit Card</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="w-8 h-5 bg-blue-800 text-white text-[10px] flex items-center justify-center font-bold rounded">VISA</span>
                                        <span className="w-8 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center font-bold rounded">MC</span>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-accent transition">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" className="w-5 h-5 text-accent" />
                                        <span className="font-semibold text-primary text-sm">PayPal</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">PayPal</span>
                                </label>

                                <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-accent transition">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" className="w-5 h-5 text-accent" />
                                        <span className="font-semibold text-primary text-sm">Bank Transfer</span>
                                    </div>
                                    <span className="text-xs text-muted">2-3 business days</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6">
                                <Button size="lg" variant="accent" fullWidth className="text-base py-4 mb-4">
                                    Pay ${total}
                                </Button>
                                <p className="text-[10px] text-center text-muted mb-6">
                                    You will be redirected to the secure payment gateway.
                                </p>

                                <div className="bg-accent/5 rounded-xl p-5 border border-accent/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                                        <h3 className="font-bold text-primary text-sm">Gigligo Guarantee</h3>
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed mb-4">
                                        Your payment is protected by <strong className="text-primary">Gigligo</strong>. The freelancer is paid only after you review and approve the delivered work.
                                    </p>
                                    <ul className="text-xs text-muted space-y-2">
                                        <li className="flex items-center gap-2">• Money-back guarantee</li>
                                        <li className="flex items-center gap-2">• Dispute resolution center</li>
                                        <li className="flex items-center gap-2">• SSL encrypted payments</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

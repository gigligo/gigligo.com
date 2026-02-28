'use client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Minimalist Header Section */}
                <div className="relative pt-20 pb-20 overflow-hidden bg-slate-900 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.05)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10 animate-fade-in">
                        <div className="inline-block px-5 py-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.2em] rounded-full mb-8 border border-primary/20 shadow-lg shadow-primary/5">
                            Legal & Compliance
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Privacy <span className="text-primary italic font-serif">Policy.</span>
                        </h1>
                        <p className="text-lg text-white/50 max-w-2xl mx-auto font-normal leading-relaxed">
                            Last Updated: October 14, 2024. Governing data retention, KYC protocols, and financial privacy standards.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-24 -mt-10 relative z-10">
                    <div className="bg-surface-light border border-border-light rounded-3xl p-8 sm:p-12 shadow-sm animate-fade-in text-text-muted leading-relaxed font-medium space-y-8">

                        <section>
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">1. Information We Collect</h2>
                            <p className="mb-4">
                                Gigligo ("Company", "we", "us") collects information that you provide directly to us when utilizing our executive talent marketplace. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Identity Data:</strong> Legal name, government-issued IDs, and biometric data (selfies) specifically utilized for our Know Your Customer (KYC) / Anti-Money Laundering (AML) verifications.</li>
                                <li><strong>Financial Data:</strong> Bank account metrics, JazzCash/EasyPaisa routing numbers, and cryptographic wallet addresses handled strictly through our secure escrow infrastructure.</li>
                                <li><strong>Professional Data:</strong> Resumes, portfolios, academic credentials, and peer reviews.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">2. Use of Information</h2>
                            <p className="mb-4">
                                We utilize the collected data fundamentally to uphold the integrity and security of the Gigligo marketplace. Primary uses encompass:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Facilitating secure escrow transactions between Clients and Executive Consultants.</li>
                                <li>Executing automated fraud detection routines.</li>
                                <li>Calculating performance metrics and ranking adjustments within our proprietary search algorithms.</li>
                                <li>Processing withdrawals via authorized third-party payment gateways compliant with State Bank of Pakistan regulations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">3. Data Retention & Deletion</h2>
                            <p>
                                Gigligo retains your profile and transaction history for as long as your account is active, or as necessary to comply with financial auditing regulations (typically 5 years post-account closure). Users retain the right to request a complete cryptographic deletion of their PII (Personally Identifiable Information) by contacting our Data Protection Officer at <code>dpo@gigligo.com</code>, excluding data strictly mandated by AML regulatory hold policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">4. Security Infrastructure</h2>
                            <p>
                                We deploy military-grade structural protections, including AES-256 encryption at rest and TLS 1.3 in transit. Access to KYC biometric data is strictly limited to authorized administrative personnel operating on zero-trust network architectures.
                            </p>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

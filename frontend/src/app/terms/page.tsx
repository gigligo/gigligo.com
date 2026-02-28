'use client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Executive Header Section */}
                <div className="relative border-b border-border-light bg-surface-light overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
                    <div className="max-w-4xl mx-auto px-6 py-20 relative z-10 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-[2px] bg-primary"></span>
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Legal Contract</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-text-muted max-w-2xl font-medium leading-relaxed">
                            These Terms of Service ("Agreement") govern your access to and utilization of the Gigligo elite talent network. Effective Date: October 14, 2024.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in flex flex-col md:flex-row gap-12">

                    {/* Navigation Sidebar */}
                    <div className="w-full md:w-64 shrink-0 hidden md:block">
                        <div className="sticky top-32 space-y-4 border-l-2 border-border-light pl-6">
                            <a href="#acceptance" className="block text-sm font-bold text-primary hover:text-primary-dark transition-colors">1. Acceptance of Terms</a>
                            <a href="#escrow" className="block text-sm font-medium text-text-muted hover:text-text-main transition-colors">2. Escrow & Wallet Holds</a>
                            <a href="#disputes" className="block text-sm font-medium text-text-muted hover:text-text-main transition-colors">3. Arbitration & Disputes</a>
                            <a href="#milestones" className="block text-sm font-medium text-text-muted hover:text-text-main transition-colors">4. Milestone Payouts</a>
                            <a href="#liability" className="block text-sm font-medium text-text-muted hover:text-text-main transition-colors">5. Limitation of Liability</a>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 space-y-12 text-text-muted leading-relaxed font-medium">

                        <section id="acceptance" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">1. Acceptance of Terms</h2>
                            <p>
                                By registering on the Gigligo platform (the "Site") as either a verified Client or an Executive Consultant, you expressly agree to be bound by these Terms. If you are accepting these Terms on behalf of an enterprise entity, you represent that you possess the requisite legal authority to bind that entity to this Agreement.
                            </p>
                        </section>

                        <section id="escrow" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">2. Escrow & Wallet Holds</h2>
                            <p className="mb-4">
                                Gigligo operates a strictly regulated marketplace framework. To initiate an Executive Contract, the Client must deposit the full sum—or the agreed upon First Milestone block—into the Gigligo Corporate Escrow infrastructure.
                            </p>
                            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl my-6">
                                <h4 className="text-primary font-bold mb-2">Notice on Asset Freezes</h4>
                                <p className="text-sm text-text-main">Funds placed in Escrow are strictly bound. They cannot be mutually withdrawn by the Client without the Consultant's authorization unless a formal Dispute is arbitrated via the Gigligo Resolution Center.</p>
                            </div>
                        </section>

                        <section id="disputes" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">3. Arbitration & Disputes</h2>
                            <p>
                                Should a disagreement arise regarding the quality or execution of deliverables, either party may invoke the formal Dispute process. Upon invocation, all Escrow funds remaining for the active milestone are immediately locked. An internal Gigligo arbitrator will review uploaded communications, GitHub repositories, and specified deliverables against the precise scope defined in the <Link href="/dashboard/contracts/sign" className="text-primary font-bold hover:underline">Executive Contract Interface</Link>. The arbitrator's decision is final and binding.
                            </p>
                        </section>

                        <section id="milestones" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">4. Milestone Payouts</h2>
                            <p>
                                For enterprise contracts exceeding standard thresholds, execution is governed by Milestone Payouts. Consultants are prohibited from demanding upfront compensation outside of the platform Escrow. Gigligo releases Escrow blocks linearly upon the Client's manual approval of the submitted milestone artifacts.
                            </p>
                        </section>

                        <section id="liability" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-text-main mb-4 tracking-tight">5. Limitation of Liability</h2>
                            <p>
                                In no event shall Gigligo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service.
                            </p>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

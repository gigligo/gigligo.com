'use client';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const faqs = [
    {
        q: 'What is Gigligo?',
        a: "Gigligo is Pakistan's premier freelance marketplace connecting university students and graduates with businesses looking for affordable, high-quality talent. We enable students to earn while they learn.",
    },
    {
        q: 'How does the payment system work?',
        a: 'Gigligo uses a secure escrow system. When a client places an order, funds are held in escrow until the work is delivered and approved. This protects both the freelancer and the client.',
    },
    {
        q: 'What is a Founding Member?',
        a: 'The first 500 users who join Gigligo receive Founding Member status with exclusive perks: 0% commission on the first 3 projects, 25 free bonus credits, and a permanent Founding Member badge on their profile.',
    },
    {
        q: 'How do I get paid?',
        a: 'Once a client approves your delivery, 90% of the payment is released to your Gigligo Wallet. You can then withdraw funds to your bank account, JazzCash, or EasyPaisa.',
    },
    {
        q: 'What is the commission rate?',
        a: 'Gigligo charges a 10% service fee on completed orders. Founding Members enjoy 0% commission on their first 3 projects as a special launch benefit.',
    },
    {
        q: 'How does the referral program work?',
        a: 'Every user gets a unique referral link. When someone joins using your link, both you and your friend receive 10 bonus credits. There is no limit to how many people you can refer!',
    },
    {
        q: 'Is KYC verification required?',
        a: 'Yes, we require identity verification (selfie + national ID) before freelancers can start selling. This builds trust and ensures a safe marketplace for everyone.',
    },
    {
        q: 'Can I use Gigligo as both a freelancer and a client?',
        a: 'Currently, you choose a role during registration (Freelancer or Client). Contact support if you need to switch or add a secondary role to your account.',
    },
    {
        q: 'What categories of work are available?',
        a: 'We support a wide range of categories including Web Development, Mobile Apps, Graphic Design, Content Writing, Video Editing, Digital Marketing, Data Entry, and more.',
    },
    {
        q: 'How do I resolve a dispute?',
        a: 'If you have an issue with an order, you can open a dispute from your dashboard. Our support team will review the case and mediate a fair resolution within 48 hours.',
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-sans text-text-main antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>

                {/* Ultra-Premium Header Section */}
                <div className="relative pt-20 pb-20 overflow-hidden bg-nav-bg text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,157,40,0.05)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10 animate-fade-in">
                        <div className="inline-block px-5 py-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.2em] rounded-full mb-8 border border-primary/20 shadow-lg shadow-primary/5">
                            Knowledge Base
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Frequently Asked <span className="text-primary italic font-serif">Questions.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-normal leading-relaxed">
                            Everything you need to know about navigating the Gigligo ecosystem.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-24 -mt-16 relative z-10">
                    <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="border border-border-light rounded-2xl overflow-hidden bg-surface-light shadow-sm hover:border-primary/30 transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 sm:p-8 text-left bg-background-light hover:bg-surface-light transition-colors group"
                                >
                                    <span className="font-bold text-text-main text-lg group-hover:text-primary transition-colors pr-8">{faq.q}</span>
                                    <span className={`material-symbols-outlined text-primary text-2xl transition-transform duration-500 ease-in-out shrink-0 ${openIndex === i ? 'rotate-135' : ''}`}>
                                        add
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 sm:p-8 pt-0 border-t border-border-light text-text-muted leading-relaxed font-medium">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center p-12 rounded-3xl bg-surface-light border border-border-light shadow-2xl animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl">support_agent</span>
                        </div>
                        <h3 className="text-2xl font-bold text-text-main mb-3 tracking-tight">Still have questions?</h3>
                        <p className="text-text-muted mb-8 font-medium">Our world-class support concierge is here to assist you.</p>
                        <a
                            href="/contact"
                            className="inline-flex px-8 py-4 bg-primary text-white text-sm font-bold uppercase tracking-wide rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 items-center justify-center gap-2"
                        >
                            Contact Concierge
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}


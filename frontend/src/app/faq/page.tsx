'use client';
import { useState } from 'react';

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
        <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Frequently Asked <span className="text-[#FE7743]">Questions</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Everything you need to know about Gigligo
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden bg-white dark:bg-slate-800/50 backdrop-blur-sm transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
                                <span className={`text-[#FE7743] text-2xl transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>
                                    +
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-5 px-5' : 'max-h-0'}`}
                            >
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center p-8 rounded-2xl bg-linear-to-r from-[#FE7743]/10 to-teal-500/10 border border-[#FE7743]/20">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Our support team is here to help you.</p>
                    <a
                        href="/contact"
                        className="inline-block px-6 py-3 bg-[#FE7743] text-white font-semibold rounded-xl hover:bg-[#FE7743]/90 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </main>
    );
}

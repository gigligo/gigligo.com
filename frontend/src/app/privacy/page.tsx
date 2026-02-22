'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="flex-1 max-w-[800px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <h1 className="text-3xl font-black text-[#EFEEEA] mb-2">Privacy Policy</h1>
                <p className="text-sm text-[#EFEEEA]/40 mb-10">Last updated: February 21, 2026</p>

                <div className="prose-custom space-y-8">
                    <Section title="1. Information We Collect">
                        <p>We collect information you provide directly to us when you create an account, complete a profile, post a gig, submit a job application, or communicate with other users. This includes:</p>
                        <ul>
                            <li>Full name, email address, and phone number</li>
                            <li>Profile information (skills, education, work history)</li>
                            <li>Payment and banking details for wallet transactions</li>
                            <li>Communications between buyers and sellers</li>
                            <li>Usage data and platform activity logs</li>
                        </ul>
                    </Section>

                    <Section title="2. How We Use Your Information">
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process transactions and manage escrow payments</li>
                            <li>Match freelancers with relevant job opportunities</li>
                            <li>Send notifications about orders, messages, and platform updates</li>
                            <li>Detect and prevent fraud or unauthorized activity</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </Section>

                    <Section title="3. Sharing of Information">
                        <p>We do not sell your personal information. We share information only in the following circumstances:</p>
                        <ul>
                            <li><strong>With other users:</strong> Your public profile, gig listings, and reviews are visible to other platform users</li>
                            <li><strong>Service providers:</strong> We use third-party services for payment processing (JazzCash, Easypaisa), hosting, and analytics</li>
                            <li><strong>Legal compliance:</strong> When required by law or to protect our rights</li>
                        </ul>
                    </Section>

                    <Section title="4. Payment & Financial Data">
                        <p>Financial transactions on Gigligo are processed through our secure escrow system. We store wallet balances, transaction histories, and commission records. We do not store full credit/debit card numbers on our servers — payment processing is handled by our certified payment partners.</p>
                    </Section>

                    <Section title="5. Data Security">
                        <p>We implement industry-standard security measures including encryption, secure authentication (JWT), and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
                    </Section>

                    <Section title="6. Data Retention">
                        <p>We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us.</p>
                    </Section>

                    <Section title="7. Your Rights">
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and download your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Delete your account</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </Section>

                    <Section title="8. Contact Us">
                        <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:giglido.com@gmail.com" className="text-[#FE7743] hover:underline">giglido.com@gmail.com</a>.</p>
                    </Section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-xl font-bold text-[#EFEEEA] mb-3">{title}</h2>
            <div className="text-sm text-[#EFEEEA]/70 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-[#EFEEEA]">
                {children}
            </div>
        </section>
    );
}

'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="flex-1 max-w-[800px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <h1 className="text-3xl font-black text-[#EFEEEA] mb-2">Terms of Service</h1>
                <p className="text-sm text-[#EFEEEA]/40 mb-10">Last updated: February 21, 2026</p>

                <div className="prose-custom space-y-8">
                    <Section title="1. Acceptance of Terms">
                        <p>By accessing or using Gigligo.com (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform.</p>
                    </Section>

                    <Section title="2. Eligibility">
                        <p>You must be at least 18 years of age (or 16 with parental consent for students) and a legal resident of Pakistan or an authorized user to create an account on Gigligo.</p>
                    </Section>

                    <Section title="3. Account Responsibilities">
                        <ul>
                            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                            <li>You must provide accurate and complete information when creating your account</li>
                            <li>You may not create multiple accounts or impersonate others</li>
                            <li>You are responsible for all activity that occurs under your account</li>
                        </ul>
                    </Section>

                    <Section title="4. Platform Services">
                        <p>Gigligo provides a marketplace connecting freelancers (sellers) with clients (buyers). We offer:</p>
                        <ul>
                            <li><strong>Gig Marketplace:</strong> Sellers list services; buyers purchase them</li>
                            <li><strong>Job Board:</strong> Employers post jobs; freelancers apply</li>
                            <li><strong>Escrow Payments:</strong> Funds are held securely until work is delivered and approved</li>
                            <li><strong>Gig Promotion:</strong> Sellers can boost gigs for greater visibility</li>
                        </ul>
                    </Section>

                    <Section title="5. Fees & Commissions">
                        <ul>
                            <li><strong>Standard Commission:</strong> 10% is deducted from freelancer earnings on completed orders and jobs</li>
                            <li><strong>Founding Members:</strong> First 500 freelancers/students enjoy 0% commission on their first 3 projects</li>
                            <li><strong>Credits:</strong> Required for job applications. Available in packages (Starter: PKR 5,000 for 25 credits, Growth: PKR 10,000 for 60, Pro: PKR 20,000 for 150)</li>
                            <li><strong>Gig Boosts:</strong> PKR 500/day for featured placement in search results</li>
                        </ul>
                    </Section>

                    <Section title="6. Payment & Escrow">
                        <p>When a buyer purchases a gig, the payment is placed in escrow. Funds are released to the seller only after the buyer confirms satisfactory delivery. The platform commission is deducted at the time of release. Disputes are handled by our support team.</p>
                    </Section>

                    <Section title="7. Prohibited Conduct">
                        <p>You agree not to:</p>
                        <ul>
                            <li>Use the Platform for any unlawful purpose</li>
                            <li>Submit fake reviews or manipulate rankings</li>
                            <li>Take transactions off-platform to avoid commissions</li>
                            <li>Harass, threaten, or discriminate against other users</li>
                            <li>Upload malicious content or attempt to breach platform security</li>
                            <li>Copy or resell another user&apos;s gig content</li>
                            <li><strong>Create duplicate accounts</strong> or use fake/altered identity documents</li>
                            <li><strong>Freelancers may not self-post jobs</strong> — this prevents fake reviews and manipulation</li>
                        </ul>
                    </Section>

                    <Section title="8. Platform Security & Trust Rules">
                        <p>The following rules are <strong>mandatory</strong> for all users and are strictly enforced:</p>
                        <ul>
                            <li><strong>KYC Verification:</strong> All accounts must pass identity verification (KYC) before posting jobs, submitting proposals, chatting, or leaving reviews. This includes a live selfie and government ID card (front &amp; back)</li>
                            <li><strong>Two-Factor Authentication:</strong> 2FA via email OTP is mandatory for every login to protect account security</li>
                            <li><strong>No Fake Profiles:</strong> Submitting fake, altered, or stolen identity documents will result in immediate and permanent account termination</li>
                            <li><strong>Communication Logging:</strong> All in-platform communications are logged. Harassment, threats, or abusive language will lead to immediate ban</li>
                            <li><strong>Escrow Protection:</strong> All payments are held in escrow until the employer marks the contract as completed and the freelancer confirms</li>
                            <li><strong>Review Integrity:</strong> Reviews can only be submitted after a contract is completed. You may not review your own work or solicit fake reviews</li>
                        </ul>
                    </Section>

                    <Section title="9. Intellectual Property">
                        <p>Upon full payment and order completion, intellectual property rights for the delivered work transfer to the buyer unless otherwise agreed. Sellers retain the right to showcase completed work in their portfolio unless the buyer requests otherwise.</p>
                    </Section>

                    <Section title="9. Termination">
                        <p>We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or harm the platform community. You may also delete your account at any time through your dashboard settings.</p>
                    </Section>

                    <Section title="10. Limitation of Liability">
                        <p>Gigligo is a marketplace platform and does not guarantee the quality of work delivered by freelancers. We are not liable for disputes between buyers and sellers beyond providing our dispute resolution process. Our total liability is limited to the amount of fees you have paid to the Platform in the preceding 12 months.</p>
                    </Section>

                    <Section title="11. Governing Law">
                        <p>These Terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Islamabad, Pakistan.</p>
                    </Section>

                    <Section title="12. Contact">
                        <p>For questions about these Terms, contact us at <a href="mailto:giglido.com@gmail.com" className="text-[#FE7743] hover:underline">giglido.com@gmail.com</a>.</p>
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

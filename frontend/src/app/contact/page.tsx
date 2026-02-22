'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would POST to an API
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left — Info */}
                    <div>
                        <h1 className="text-3xl font-black text-[#EFEEEA] mb-4">Get in <span className="text-[#FE7743]">Touch</span></h1>
                        <p className="text-[#EFEEEA]/60 mb-10 leading-relaxed">
                            Have a question, feedback, or need help? Our team is here to assist you. Fill out the form or reach out directly.
                        </p>

                        <div className="space-y-6">
                            <ContactInfo icon="📧" label="Email" value="giglido.com@gmail.com" href="mailto:giglido.com@gmail.com" />
                            <ContactInfo icon="📞" label="Phone" value="+92 308 7666622" href="tel:+923087666622" />
                            <ContactInfo icon="📍" label="Location" value="Islamabad, Pakistan" />
                            <ContactInfo icon="⏰" label="Support Hours" value="Mon–Sat, 9:00 AM – 6:00 PM PKT" />
                        </div>

                        <div className="mt-10 p-6 bg-[#111] rounded-2xl border border-white/10">
                            <h3 className="font-bold text-[#EFEEEA] mb-2">Quick Links</h3>
                            <div className="space-y-2 text-sm">
                                <p className="text-[#EFEEEA]/50">• For billing issues: <a href="mailto:giglido.com@gmail.com" className="text-[#FE7743] hover:underline">giglido.com@gmail.com</a></p>
                                <p className="text-[#EFEEEA]/50">• For partnerships: <a href="mailto:giglido.com@gmail.com" className="text-[#FE7743] hover:underline">giglido.com@gmail.com</a></p>
                                <p className="text-[#EFEEEA]/50">• For legal matters: <a href="mailto:giglido.com@gmail.com" className="text-[#FE7743] hover:underline">giglido.com@gmail.com</a></p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="bg-[#111] rounded-2xl border border-white/10 p-8">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <div className="text-5xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold text-[#EFEEEA] mb-2">Message Sent!</h2>
                                <p className="text-[#EFEEEA]/60">We&apos;ll get back to you within 24 hours.</p>
                                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 px-6 py-2 bg-white/5 border border-white/10 text-[#EFEEEA] rounded-lg text-sm font-semibold hover:bg-white/10 transition">
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h2 className="text-xl font-bold text-[#EFEEEA] mb-4">Send us a message</h2>

                                <div>
                                    <label className="text-xs font-semibold text-[#EFEEEA]/50 uppercase tracking-wider mb-1.5 block">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50 transition placeholder:text-[#EFEEEA]/20"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#EFEEEA]/50 uppercase tracking-wider mb-1.5 block">Email Address</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50 transition placeholder:text-[#EFEEEA]/20"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#EFEEEA]/50 uppercase tracking-wider mb-1.5 block">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50 transition"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing & Payments</option>
                                        <option value="dispute">Order Dispute</option>
                                        <option value="feedback">Feedback & Suggestions</option>
                                        <option value="partnership">Business Partnership</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#EFEEEA]/50 uppercase tracking-wider mb-1.5 block">Message</label>
                                    <textarea
                                        required rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-[#EFEEEA] text-sm focus:outline-none focus:border-[#FE7743]/50 transition placeholder:text-[#EFEEEA]/20 resize-none"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button type="submit" className="w-full py-3.5 bg-[#FE7743] text-white font-bold rounded-xl hover:bg-[#FE7743]/90 transition shadow-lg shadow-[#FE7743]/20">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ContactInfo({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
    return (
        <div className="flex items-start gap-4">
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="text-xs font-semibold text-[#EFEEEA]/40 uppercase tracking-wider">{label}</p>
                {href ? (
                    <a href={href} className="text-[#EFEEEA] font-medium hover:text-[#FE7743] transition">{value}</a>
                ) : (
                    <p className="text-[#EFEEEA] font-medium">{value}</p>
                )}
            </div>
        </div>
    );
}

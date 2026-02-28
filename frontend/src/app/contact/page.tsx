'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Check } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would POST to an API
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 w-full" style={{ paddingTop: 96 }}>
                <div className="grid lg:grid-cols-2 gap-20 py-12">
                    {/* Left — Info */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6">Get in <span className="text-[#DAA520]">Touch.</span></h1>
                        <p className="text-lg text-[#424242]/70 font-normal mb-12 leading-relaxed max-w-lg">
                            Have a question or need expert guidance? Pakistan's talent engine is here to support your growth.
                        </p>

                        <div className="space-y-8">
                            <ContactInfo icon={<Mail className="w-5 h-5" />} label="Email" value="giglido.com@gmail.com" href="mailto:giglido.com@gmail.com" />
                            <ContactInfo icon={<Phone className="w-5 h-5" />} label="Phone" value="+92 308 7666622" href="tel:+923087666622" />
                            <ContactInfo icon={<MapPin className="w-5 h-5" />} label="Location" value="Islamabad, Pakistan" />
                            <ContactInfo icon={<Clock className="w-5 h-5" />} label="Support" value="Mon–Sat, 9:00 AM – 6:00 PM PKT" />
                        </div>

                        <div className="mt-16 p-8 bg-[#F5F5F5] rounded-[32px] border border-[#212121]/5">
                            <h3 className="font-bold text-[#212121] mb-4 text-sm uppercase tracking-widest opacity-60">Direct Channels</h3>
                            <div className="space-y-4 text-sm font-normal">
                                <p className="text-[#424242]/60 flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                                    Billing Support: <a href="mailto:giglido.com@gmail.com" className="text-[#212121] font-bold hover:text-[#DAA520]">giglido.com@gmail.com</a>
                                </p>
                                <p className="text-[#424242]/60 flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                                    Partnerships: <a href="mailto:giglido.com@gmail.com" className="text-[#212121] font-bold hover:text-[#DAA520]">giglido.com@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="bg-white rounded-[40px] border border-[#212121]/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.05)_0%,transparent_70%)] pointer-events-none" />
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                <div className="w-20 h-20 bg-[#DAA520]/10 text-[#DAA520] rounded-full flex items-center justify-center mb-8">
                                    <Check size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#212121] mb-3">Message Sent</h2>
                                <p className="text-[#424242]/60 font-normal max-w-xs mx-auto mb-10">We&apos;ll get back to you within 24 hours.</p>
                                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="px-8 py-4 bg-[#F5F5F5] text-[#212121] rounded-xl text-sm font-bold hover:bg-[#212121] hover:text-white transition-all">
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-xl font-bold text-[#212121] mb-6">Send a message</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#424242]/40 uppercase tracking-widest mb-2 block">Full Name</label>
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-[#F5F5F5] border border-transparent rounded-xl text-[#212121] text-sm focus:outline-none focus:bg-white focus:border-[#DAA520]/20 transition-all font-bold placeholder:text-[#424242]/20 shadow-sm"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-[#424242]/40 uppercase tracking-widest mb-2 block">Email Address</label>
                                        <input
                                            type="email" required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-[#F5F5F5] border border-transparent rounded-xl text-[#212121] text-sm focus:outline-none focus:bg-white focus:border-[#DAA520]/20 transition-all font-bold placeholder:text-[#424242]/20 shadow-sm"
                                            placeholder="you@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-[#424242]/40 uppercase tracking-widest mb-2 block">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-5 py-3.5 bg-[#F5F5F5] border border-transparent rounded-xl text-[#212121] text-sm focus:outline-none focus:bg-white focus:border-[#DAA520]/20 transition-all font-bold shadow-sm"
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
                                    <label className="text-[10px] font-bold text-[#424242]/40 uppercase tracking-widest mb-2 block">Message</label>
                                    <textarea
                                        required rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-[#F5F5F5] border border-transparent rounded-xl text-[#212121] text-sm focus:outline-none focus:bg-white focus:border-[#DAA520]/20 transition-all font-bold placeholder:text-[#424242]/20 shadow-sm resize-none"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button type="submit" className="btn-primary w-full py-4 text-sm tracking-wider">
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

function ContactInfo({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520] shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-[#424242]/40 uppercase tracking-widest mb-1">{label}</p>
                {href ? (
                    <a href={href} className="text-[#212121] font-bold hover:text-[#DAA520] transition-all">{value}</a>
                ) : (
                    <p className="text-[#212121] font-bold">{value}</p>
                )}
            </div>
        </div>
    );
}

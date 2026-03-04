'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Check, Send } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-text-main selection:bg-primary/30 overflow-x-hidden">
            <Navbar />
            <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full" style={{ paddingTop: 80 }}>
                <div className="grid lg:grid-cols-2 gap-16 py-12">
                    {/* Left — Info */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                                Get in <span className="text-primary">Touch.</span>
                            </h1>
                            <p className="text-lg text-text-muted font-medium mb-12 leading-relaxed max-w-md">
                                Have a question or need expert guidance? We&apos;re ready to help scale your vision.
                            </p>

                            <div className="space-y-6">
                                <ContactInfo icon={<Mail className="w-5 h-5" />} label="Email" value="gigligo.com@gmail.com" href="mailto:gigligo.com@gmail.com" />
                                <ContactInfo icon={<Phone className="w-5 h-5" />} label="Phone" value="+92 308 7666622" href="tel:+923087666622" />
                                <ContactInfo icon={<MapPin className="w-5 h-5" />} label="Location" value="Islamabad, Pakistan" />
                                <ContactInfo icon={<Clock className="w-5 h-5" />} label="Hours" value="Mon–Sat, 9 AM – 6 PM PKT" />
                            </div>

                            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h3 className="font-semibold text-xs uppercase tracking-widest text-text-muted mb-4">Specialized Channels</h3>
                                <div className="space-y-2">
                                    <p className="text-sm text-text-muted flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Enterprise: <a href="mailto:enterprise@gigligo.com" className="text-text-main font-medium hover:text-primary transition-colors">enterprise@gigligo.com</a>
                                    </p>
                                    <p className="text-sm text-text-muted flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Press: <a href="mailto:media@gigligo.com" className="text-text-main font-medium hover:text-primary transition-colors">media@gigligo.com</a>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
                    >
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                                        <Check size={32} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-main mb-3">Message Sent</h2>
                                    <p className="text-text-muted font-medium max-w-xs mx-auto mb-8 text-sm leading-relaxed">We&apos;ve received your message and will respond within 12 hours.</p>
                                    <button
                                        onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                                        className="px-6 py-3 bg-text-main text-white rounded-xl text-sm font-semibold hover:bg-text-main/90 transition-all"
                                    >
                                        Send Another
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-text-main">Send a Message</h2>
                                        <div className="h-0.5 w-12 bg-primary mt-3 rounded-full" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Name</label>
                                            <input
                                                type="text" required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium placeholder:text-text-muted/40"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Email</label>
                                            <input
                                                type="email" required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium placeholder:text-text-muted/40"
                                                placeholder="name@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Subject</label>
                                        <select
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium appearance-none"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="billing">Billing</option>
                                            <option value="partnership">Partnership</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Message</label>
                                        <textarea
                                            required rows={4}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium placeholder:text-text-muted/40 resize-none"
                                            placeholder="Your message..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ContactInfo({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all border border-gray-100 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-0.5">{label}</p>
                {href ? (
                    <a href={href} className="text-base font-semibold text-text-main hover:text-primary transition-colors">{value}</a>
                ) : (
                    <p className="text-base font-semibold text-text-main">{value}</p>
                )}
            </div>
        </div>
    );
}

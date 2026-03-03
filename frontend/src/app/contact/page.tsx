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
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark text-background-dark dark:text-white selection:bg-primary/30 overflow-x-hidden">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full" style={{ paddingTop: 96 }}>
                <div className="grid lg:grid-cols-2 gap-24 py-16">
                    {/* Left — Info */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter mb-10 leading-[0.9] uppercase">
                                Get in <br /><span className="text-primary italic">Touch.</span>
                            </h1>
                            <p className="text-2xl text-text-muted dark:text-white/60 font-medium mb-16 leading-tight max-w-xl">
                                Have a question or need expert guidance? Pakistan's talent engine is ready to scale your vision.
                            </p>

                            <div className="space-y-10">
                                <ContactInfo icon={<Mail className="w-6 h-6" />} label="Digital Pipeline" value="giglido.com@gmail.com" href="mailto:giglido.com@gmail.com" />
                                <ContactInfo icon={<Phone className="w-6 h-6" />} label="Direct Link" value="+92 308 7666622" href="tel:+923087666622" />
                                <ContactInfo icon={<MapPin className="w-6 h-6" />} label="Base Ops" value="Islamabad, Pakistan" />
                                <ContactInfo icon={<Clock className="w-6 h-6" />} label="Availability" value="Mon–Sat, 9:00 AM – 6:00 PM PKT" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-20 p-10 bg-black/5 dark:bg-white/5 rounded-[3rem] border border-border-light dark:border-white/10 backdrop-blur-3xl"
                            >
                                <h3 className="font-black text-[10px] uppercase tracking-[0.4em] mb-6 opacity-40">Specialized Channels</h3>
                                <div className="space-y-4">
                                    <p className="text-[13px] font-bold text-text-muted dark:text-white/40 flex items-center gap-4">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        ENTERPRISE: <a href="mailto:giglido.com@gmail.com" className="text-background-dark dark:text-white hover:text-primary transition-colors">enterprise@gigligo.com</a>
                                    </p>
                                    <p className="text-[13px] font-bold text-text-muted dark:text-white/40 flex items-center gap-4">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        PRESS: <a href="mailto:giglido.com@gmail.com" className="text-background-dark dark:text-white hover:text-primary transition-colors">media@gigligo.com</a>
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right — Form Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white dark:bg-white/5 rounded-[4rem] p-10 md:p-16 shadow-2xl border border-border-light dark:border-white/10 relative overflow-hidden backdrop-blur-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-32 h-32 bg-primary/10 text-primary rounded-4xl flex items-center justify-center mb-10 border border-primary/20 shadow-2xl">
                                        <Check size={48} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-4xl font-black text-background-dark dark:text-white mb-4 uppercase tracking-tighter">Transmission Sent</h2>
                                    <p className="text-text-muted dark:text-white/60 font-medium max-w-xs mx-auto mb-12 text-lg leading-tight">We've received your coordinates and will respond within 12 hours.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                                        className="px-12 py-5 bg-background-dark dark:bg-white text-white dark:text-background-dark rounded-full text-sm font-black uppercase tracking-widest shadow-2xl transition-all"
                                    >
                                        Initiate New Protocol
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-black text-background-dark dark:text-white uppercase tracking-tighter">Send a Signal</h2>
                                        <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.3em] mb-3 block px-1">Identity</label>
                                            <input
                                                type="text" required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-6 py-5 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] focus:outline-none focus:border-primary transition-all font-bold placeholder:text-text-muted/30 shadow-inner"
                                                placeholder="Legal Name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.3em] mb-3 block px-1">Email Link</label>
                                            <input
                                                type="email" required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-6 py-5 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] focus:outline-none focus:border-primary transition-all font-bold placeholder:text-text-muted/30 shadow-inner"
                                                placeholder="name@domain.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.3em] mb-3 block px-1">Subject Protocol</label>
                                        <div className="relative group">
                                            <select
                                                value={formData.subject}
                                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                                className="w-full px-6 py-5 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] focus:outline-none focus:border-primary transition-all font-bold shadow-inner appearance-none pr-12"
                                            >
                                                <option value="">Select Command</option>
                                                <option value="general">MISSION INQUIRY</option>
                                                <option value="support">TECHNICAL OPS</option>
                                                <option value="billing">FINANCIAL INFRA</option>
                                                <option value="partnership">STRATEGIC ALLIANCE</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/20 pointer-events-none group-hover:text-primary transition-colors">expand_more</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.3em] mb-3 block px-1">Brief Details</label>
                                        <textarea
                                            required rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-6 py-5 bg-black/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-2xl text-background-dark dark:text-white text-[15px] focus:outline-none focus:border-primary transition-all font-bold placeholder:text-text-muted/30 shadow-inner resize-none appearance-none"
                                            placeholder="Transmit your message here..."
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 bg-primary text-white font-black rounded-full text-sm uppercase tracking-widest shadow-2xl shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={18} strokeWidth={3} />
                                                Transmit Signal
                                            </>
                                        )}
                                    </motion.button>
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
        <motion.div
            whileHover={{ x: 10 }}
            className="flex items-start gap-6 group"
        >
            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-muted dark:text-white/30 group-hover:bg-primary group-hover:text-white transition-all border border-border-light dark:border-white/10 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-text-muted dark:text-white/30 uppercase tracking-[0.3em] mb-2">{label}</p>
                {href ? (
                    <a href={href} className="text-2xl font-black text-background-dark dark:text-white hover:text-primary transition-all tracking-tighter uppercase">{value}</a>
                ) : (
                    <p className="text-2xl font-black text-background-dark dark:text-white tracking-tighter uppercase leading-none">{value}</p>
                )}
            </div>
        </motion.div>
    );
}

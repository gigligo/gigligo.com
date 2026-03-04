'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    ShieldCheck,
    Plus,
    Save,
    Loader2,
    Globe,
    Activity,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';

export function ContactInfoView({ userData }: { userData: any; token: string; apiUrl: string }) {
    const [primaryEmail, setPrimaryEmail] = useState(userData?.email || 'OPERATIVE@GIGLIGO.COM');
    const [secondaryEmail, setSecondaryEmail] = useState('');
    const [phoneCode, setPhoneCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Signal uplink points updated.");
        }, 1200);
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Contact Information</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Manage your email addresses and physical location for billing and account updates.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden space-y-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Email Addresses Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Mail size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Email Addresses</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Primary Email</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="flex-1 w-full relative group">
                                    <input
                                        type="email"
                                        value={primaryEmail}
                                        readOnly
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white/40 cursor-not-allowed focus:outline-none transition-all"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                        <ShieldCheck size={14} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest pl-4">Main email used for account notifications and security alerts.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Secondary Email</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <input
                                    type="email"
                                    value={secondaryEmail}
                                    onChange={(e) => setSecondaryEmail(e.target.value)}
                                    className="flex-1 w-full bg-black/40 border border-dashed border-white/10 rounded-xl px-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all hover:bg-white/2"
                                    placeholder="Add secondary email..."
                                />
                                <button className="h-14 px-8 bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all active:scale-95 shrink-0 flex items-center gap-3">
                                    <Plus size={18} /> ADD EMAIL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Telephone Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Phone size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Phone Number</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Primary Phone</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative w-full md:w-40 group">
                                <select
                                    value={phoneCode}
                                    onChange={(e) => setPhoneCode(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white/60 focus:outline-none focus:border-primary/40 appearance-none transition-all hover:bg-white/2"
                                >
                                    <option value="+1">+1 (US)</option>
                                    <option value="+44">+44 (UK)</option>
                                    <option value="+91">+91 (IN)</option>
                                    <option value="+61">+61 (AU)</option>
                                </select>
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="flex-1 w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all hover:bg-white/2"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest pl-4">Used for two-factor authentication and SMS alerts.</p>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Physical Address Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <MapPin size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Mailing Address</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Physical Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all resize-none hover:bg-white/2"
                            placeholder="Street, City, State, ZIP Code..."
                        ></textarea>
                        <div className="flex items-center gap-3 pl-4 text-white/20 font-medium">
                            <Lock size={12} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Encrypted Data - Restricted For Invoicing Compliance</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-10 border-t border-white/5">
                    <div className="flex items-center gap-3 text-white/20 font-medium">
                        <Activity size={18} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Connection synced</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-16 px-12 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-4 active:scale-95 disabled:opacity-20"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                SAVE CHANGES
                                <Save size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

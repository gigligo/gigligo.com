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
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Comm Channels</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Calibrate your primary signal endpoints and physical deployment coordinates.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden space-y-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Email Addresses Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <Mail size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SMTP Relays</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic block pl-4">Primary Command Uplink</label>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 w-full relative group">
                                    <input
                                        type="email"
                                        value={primaryEmail}
                                        readOnly
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-6 text-lg font-black italic uppercase tracking-widest text-white/30 cursor-not-allowed focus:outline-none transition-all"
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3 text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                                        <ShieldCheck size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic pl-4">Mandatory endpoint for critical account telemetry and extraction alerts.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic block pl-4">Secondary Tactical Relay (Optional)</label>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <input
                                    type="email"
                                    value={secondaryEmail}
                                    onChange={(e) => setSecondaryEmail(e.target.value)}
                                    className="flex-1 w-full bg-black/40 border border-dashed border-white/10 rounded-2xl px-8 py-6 text-lg font-black italic uppercase tracking-widest text-white focus:outline-none focus:border-primary transition-all hover:bg-white/2"
                                    placeholder="ENTER SECONDARY UPLINK..."
                                />
                                <button className="h-20 px-10 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 hover:text-white transition-all italic active:scale-95 shrink-0 flex items-center gap-4">
                                    <Plus size={20} /> ADD RELAY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Telephone Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <Phone size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Cellular Uplink</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic block pl-4">Primary Cellular Endpoint</label>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="relative w-full md:w-48 group">
                                <select
                                    value={phoneCode}
                                    onChange={(e) => setPhoneCode(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-6 text-lg font-black italic uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary appearance-none transition-all hover:bg-white/2"
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
                                className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-6 text-lg font-black italic uppercase tracking-widest text-white focus:outline-none focus:border-primary transition-all hover:bg-white/2"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic pl-4">Hardware redundancy for 2-Step Auth and tactical contract pings.</p>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Physical Address Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <MapPin size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Geospatial Coordinates</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic block pl-4">Primary Deployment Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={4}
                            className="w-full bg-black/40 border border-white/5 rounded-[3rem] px-10 py-10 text-lg font-bold italic text-white focus:outline-none focus:border-primary transition-all resize-none hover:bg-white/2"
                            placeholder="ENTER FULL NAV-STRING (STREET, CITY, STATE, ARCHIVE CODE)..."
                        ></textarea>
                        <div className="flex items-center gap-4 pl-4 text-white/20 italic">
                            <Lock size={14} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Data - Restricted For Invoicing Compliance</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-12 border-t border-white/5">
                    <div className="flex items-center gap-4 text-white/20 italic">
                        <Activity size={20} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Grid Relays Synchronized</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-20 px-16 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-primary/40 hover:bg-primary-dark transition-all flex items-center gap-6 italic active:scale-95 disabled:opacity-20"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                SYNC COMM CHANNELS
                                <Save size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

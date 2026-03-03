'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    User,
    Camera,
    MapPin,
    Globe,
    FileText,
    Save,
    Loader2,
    CheckCircle2,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function ProfileView({ userData }: { userData: any; token: string; apiUrl: string }) {
    const [firstName, setFirstName] = useState(userData?.profile?.firstName || '');
    const [lastName, setLastName] = useState(userData?.profile?.lastName || '');
    const [title, setTitle] = useState(userData?.profile?.title || '');
    const [bio, setBio] = useState(userData?.profile?.bio || '');
    const [location, setLocation] = useState(userData?.profile?.location || '');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Dossier updated successfully.");
        }, 1500);
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Public Dossier</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Manage your strategic persona and professional identity across the global network.</p>
            </div>

            <div className="space-y-12">
                {/* Visual Identity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden group"
                >
                    <div className="absolute top-0 inset-x-0 h-48 bg-linear-to-b from-primary/10 via-primary/5 to-transparent opacity-30 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-12 pt-24">
                        <div className="relative group/avatar">
                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-black shadow-3xl bg-black flex items-center justify-center shrink-0 relative">
                                {userData?.profile?.avatar ? (
                                    <Image src={userData.profile.avatar} alt="Avatar" fill className="object-cover transition-transform duration-700 group-hover/avatar:scale-110" sizes="192px" />
                                ) : (
                                    <User className="text-white/10 w-24 h-24" strokeWidth={1} />
                                )}
                                <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer text-white gap-2">
                                    <Camera size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Update Signal</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-black">
                                <ImageIcon size={20} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Visual Identity</h3>
                                <p className="text-sm font-bold italic text-white/20 max-w-md">Synchronize your professional optics. High-resolution imagery mandatory for verified operatives.</p>
                            </div>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <button className="h-14 px-8 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all italic active:scale-95">
                                    UPLOAD AVATAR
                                </button>
                                <button className="h-14 px-8 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all italic">
                                    UPDATE COVER
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Core Parameters Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <FileText size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Core Parameters</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">First Designation</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                placeholder="JANE"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Last Designation</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                placeholder="DOE"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Professional Title / Role</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                            placeholder="EXECUTIVE CREATIVE OPERATIVE"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Geographic Node</label>
                            <div className="relative">
                                <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                                    placeholder="CITY, COUNTRY"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Global Matrix (Website)</label>
                            <div className="relative">
                                <Globe className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                <input
                                    type="url"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-16 pr-8 py-5 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10 font-mono"
                                    placeholder="HTTPS://MATRIX.NETWORK"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-12">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-4">Operational Biography</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={6}
                            className="w-full bg-black/40 border border-white/5 rounded-4xl px-8 py-6 text-xl font-black italic tracking-tighter text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/10 resize-none leading-relaxed"
                            placeholder="DESCRIBE YOUR STRATEGIC CAREER ARC..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-12 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-20 px-16 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-3xl shadow-primary/40 flex items-center gap-6 italic active:scale-95 disabled:opacity-20"
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    SAVE DOSSIER
                                    <CheckCircle2 size={24} />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

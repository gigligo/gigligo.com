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
                <h2 className="text-3xl font-bold text-white tracking-tight">Public Profile</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Manage your professional identity and how others see you on the platform.</p>
            </div>

            <div className="space-y-12">
                {/* Visual Identity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden group"
                >
                    <div className="absolute top-0 inset-x-0 h-48 bg-linear-to-b from-primary/10 via-primary/5 to-transparent opacity-30 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-12 pt-24">
                        <div className="relative group/avatar">
                            <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl bg-black flex items-center justify-center shrink-0 relative">
                                {userData?.profile?.avatar ? (
                                    <Image src={userData.profile.avatar} alt="Avatar" fill className="object-cover transition-transform duration-700 group-hover/avatar:scale-105" sizes="160px" />
                                ) : (
                                    <User className="text-white/10 w-20 h-20" strokeWidth={1} />
                                )}
                                <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer text-white gap-2">
                                    <Camera size={32} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Update Photo</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl border-4 border-black">
                                <ImageIcon size={18} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Visual Identity</h3>
                                <p className="text-sm font-medium text-white/40 max-w-md">Update your profile photo and cover image. High-quality imagery helps build trust.</p>
                            </div>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <button className="h-12 px-8 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95">
                                    UPLOAD PHOTO
                                </button>
                                <button className="h-12 px-8 bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                                    CHANGE COVER
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
                    className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <FileText size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Profile Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                                placeholder="Jane"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Professional Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                            placeholder="Creative Director"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-14 pr-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10"
                                    placeholder="London, UK"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <input
                                    type="url"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-14 pr-6 py-4 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10 font-mono"
                                    placeholder="https://portfolio.me"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-10">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={6}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-base font-medium text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/10 resize-none leading-relaxed"
                            placeholder="Write a brief professional introduction..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-10 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-16 px-12 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 flex items-center gap-4 active:scale-95 disabled:opacity-20"
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    SAVE PROFILE
                                    <CheckCircle2 size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

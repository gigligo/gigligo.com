'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    Clock,
    Palette,
    Sun,
    Moon,
    Monitor,
    Save,
    Loader2,
    Activity,
    ChevronDown,
    Zap
} from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSettingsView() {
    const [language, setLanguage] = useState('en-US');
    const [timezone, setTimezone] = useState('America/Los_Angeles');
    const [theme, setTheme] = useState('dark');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Core parameters synchronized with network.");
        }, 1200);
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Core Parameters</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Calibrate your localized telemetry and neural visual interface for peak operational efficiency.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden space-y-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Localization Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <Globe size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Neural Localization</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic block pl-4">Primary Linguistic Protocol</label>
                            <div className="relative group">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-6 text-lg font-black italic uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary appearance-none transition-all duration-500 hover:bg-white/2 hover:border-white/20"
                                >
                                    <option value="en-US">English (US Matrix)</option>
                                    <option value="en-GB">English (UK Grid)</option>
                                    <option value="fr-FR">Français (Sector 7)</option>
                                    <option value="es-ES">Español (Iberian Relay)</option>
                                    <option value="de-DE">Deutsch (Central Core)</option>
                                </select>
                                <ChevronDown size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic block pl-4">Temporal Chronometer</label>
                            <div className="relative group">
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-6 text-lg font-black italic uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary appearance-none transition-all duration-500 hover:bg-white/2 hover:border-white/20"
                                >
                                    <option value="America/Los_Angeles">Pacific (PT) - Los Angeles</option>
                                    <option value="America/New_York">Eastern (ET) - New York</option>
                                    <option value="Europe/London">Greenwich (GMT) - London</option>
                                    <option value="Europe/Paris">Central Euro (CET) - Paris</option>
                                    <option value="Asia/Tokyo">Japan Std (JST) - Tokyo</option>
                                </select>
                                <ChevronDown size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex items-center gap-3 pl-4 text-emerald-500 italic opacity-40">
                                <Clock size={12} />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Timeline Synchronization Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Appearance Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shadow-black">
                            <Palette size={24} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Visual Interface</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <ThemeButton
                            id="light"
                            label="Solar Ray"
                            desc="High-visibility luminance"
                            icon={Sun}
                            active={theme === 'light'}
                            onClick={() => setTheme('light')}
                        />
                        <ThemeButton
                            id="dark"
                            label="Vantablack"
                            desc="Low-latency stealth"
                            icon={Moon}
                            active={theme === 'dark'}
                            onClick={() => setTheme('dark')}
                        />
                        <ThemeButton
                            id="system"
                            label="Neural Sync"
                            desc="OS hardware telemetry"
                            icon={Monitor}
                            active={theme === 'system'}
                            onClick={() => setTheme('system')}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-12 border-t border-white/5">
                    <div className="flex items-center gap-4 text-white/20 italic">
                        <Activity size={20} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core Metrics Synchronized</span>
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
                                SAVE NEURAL PREFERENCES
                                <Save size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ThemeButton({ label, desc, icon: Icon, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-10 rounded-[3rem] border-2 transition-all duration-700 flex flex-col items-center gap-6 relative overflow-hidden group ${active
                    ? 'border-primary bg-primary/5 text-primary shadow-3xl shadow-primary/10 scale-[1.02]'
                    : 'border-white/5 bg-black/40 text-white/20 hover:border-white/20 hover:text-white/40'
                }`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 ${active ? 'bg-primary/20 scale-110' : 'bg-black border border-white/5'}`}>
                <Icon size={32} strokeWidth={1} />
            </div>
            <div className="text-center space-y-2">
                <span className={`text-xl font-black italic uppercase tracking-tighter block transition-colors duration-700 ${active ? 'text-white' : ''}`}>{label}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-40">{desc}</span>
            </div>
            {active && (
                <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-3xl shadow-primary animate-pulse" />
                </div>
            )}
        </button>
    );
}

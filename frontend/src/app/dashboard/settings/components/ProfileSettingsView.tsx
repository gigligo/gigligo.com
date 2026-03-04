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
                <h2 className="text-3xl font-bold text-white tracking-tight">System Preferences</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Configure your localized experience and interface appearance.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden space-y-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Localization Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Globe size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Localization</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Display Language</label>
                            <div className="relative group">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white/60 focus:outline-none focus:border-primary/40 appearance-none transition-all duration-500 hover:bg-white/2 hover:border-white/10"
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest block pl-4">Time Zone</label>
                            <div className="relative group">
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-base font-medium text-white/60 focus:outline-none focus:border-primary/40 appearance-none transition-all duration-500 hover:bg-white/2 hover:border-white/10"
                                >
                                    <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                                    <option value="America/New_York">Eastern Time (New York)</option>
                                    <option value="Europe/London">Greenwich Mean Time (London)</option>
                                    <option value="Europe/Paris">Central European Time (Paris)</option>
                                    <option value="Asia/Tokyo">Japan Standard Time (Tokyo)</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex items-center gap-2 pl-4 text-emerald-500/60 font-medium">
                                <Clock size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Auto-sync detected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Appearance Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Palette size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Interface Appearance</h3>
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

                <div className="flex justify-between items-center pt-10 border-t border-white/5">
                    <div className="flex items-center gap-3 text-white/20 font-medium">
                        <Activity size={18} className="animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Configuration synced</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-16 px-10 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-4 active:scale-95 disabled:opacity-20"
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

function ThemeButton({ label, desc, icon: Icon, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-10 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center gap-6 relative overflow-hidden group ${active
                ? 'border-primary/40 bg-primary/5 text-primary shadow-xl shadow-primary/5 scale-[1.02]'
                : 'border-white/5 bg-black/40 text-white/20 hover:border-white/10 hover:text-white/40'
                }`}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-primary/20 scale-110' : 'bg-black border border-white/5'}`}>
                <Icon size={24} strokeWidth={1} />
            </div>
            <div className="text-center space-y-1">
                <span className={`text-xl font-bold tracking-tight block transition-colors duration-500 ${active ? 'text-white' : ''}`}>{label}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{desc}</span>
            </div>
            {active && (
                <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary animate-pulse" />
                </div>
            )}
        </button>
    );
}

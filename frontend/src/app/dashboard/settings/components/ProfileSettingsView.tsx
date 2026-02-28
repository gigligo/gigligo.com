'use client';

import { useState } from 'react';

export function ProfileSettingsView() {
    const [language, setLanguage] = useState('en-US');
    const [timezone, setTimezone] = useState('America/Los_Angeles');
    const [theme, setTheme] = useState('system');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">Profile Settings</h2>
                <p className="text-text-muted mt-1 text-sm">Configure your localized experience and visual preferences.</p>
            </div>

            <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 space-y-8">

                {/* Localization */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">language</span>
                        Localization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Display Language</label>
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary appearance-none transition-colors"
                                >
                                    <option value="en-US">English (US)</option>
                                    <option value="en-GB">English (UK)</option>
                                    <option value="fr-FR">Français</option>
                                    <option value="es-ES">Español</option>
                                    <option value="de-DE">Deutsch</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-3.5 text-text-muted pointer-events-none text-xl">expand_more</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Timezone</label>
                            <div className="relative">
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary appearance-none transition-colors"
                                >
                                    <option value="America/Los_Angeles">Pacific Time (PT) - Los Angeles</option>
                                    <option value="America/New_York">Eastern Time (ET) - New York</option>
                                    <option value="Europe/London">Greenwich Mean Time (GMT) - London</option>
                                    <option value="Europe/Paris">Central European Time (CET) - Paris</option>
                                    <option value="Asia/Tokyo">Japan Standard Time (JST) - Tokyo</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-3.5 text-text-muted pointer-events-none text-xl">expand_more</span>
                            </div>
                            <p className="text-xs text-text-muted/60 mt-1">This context is used for your dashboard charts and message timestamps.</p>
                        </div>
                    </div>
                </div>

                <hr className="border-border-light" />

                {/* Appearance */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">palette</span>
                        Appearance
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border-light bg-background-light text-text-muted hover:border-text-muted/30'}`}
                        >
                            <span className="material-symbols-outlined text-3xl">light_mode</span>
                            <span className="text-sm font-bold">Light Mode</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border-light bg-background-light text-text-muted hover:border-text-muted/30'}`}
                        >
                            <span className="material-symbols-outlined text-3xl">dark_mode</span>
                            <span className="text-sm font-bold">Dark Mode</span>
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border-light bg-background-light text-text-muted hover:border-text-muted/30'}`}
                        >
                            <span className="material-symbols-outlined text-3xl">desktop_windows</span>
                            <span className="text-sm font-bold">System Sync</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-border-light">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                Saving...
                            </>
                        ) : (
                            "Save Preferences"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';

export function ContactInfoView({ userData }: { userData: any; token: string; apiUrl: string }) {
    const [primaryEmail, setPrimaryEmail] = useState(userData?.email || '');
    const [secondaryEmail, setSecondaryEmail] = useState('');
    const [phoneCode, setPhoneCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">Contact Info</h2>
                <p className="text-text-muted mt-1 text-sm">Manage how clients and GIGLIGO communicate with you.</p>
            </div>

            <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 space-y-8">

                {/* Email Addresses */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">mail</span>
                        Email Addresses
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Primary Email</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="email"
                                    value={primaryEmail}
                                    readOnly
                                    className="flex-1 bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-muted cursor-not-allowed focus:outline-none transition-all"
                                    placeholder="Enter primary email"
                                />
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-xs font-bold uppercase tracking-wider shrink-0">
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    Verified
                                </div>
                            </div>
                            <p className="text-xs text-text-muted/60">This email receives critical account security and billing notices.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Secondary Email (Optional)</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="email"
                                    value={secondaryEmail}
                                    onChange={(e) => setSecondaryEmail(e.target.value)}
                                    className="flex-1 bg-background-light border border-dashed border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                    placeholder="Enter secondary email"
                                />
                                <button className="px-4 py-3 bg-background-light border border-border-light text-text-muted text-sm font-bold rounded-lg hover:border-primary/50 transition-colors shrink-0">
                                    Add Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-border-light" />

                {/* Telephone */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">call</span>
                        Phone Number
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Primary Phone</label>
                        <div className="flex gap-3">
                            <select
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                                className="w-24 bg-background-light border border-border-light rounded-lg px-3 py-3 text-sm text-text-main focus:outline-none focus:border-primary appearance-none transition-colors"
                            >
                                <option value="+1">+1 (US)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+91">+91 (IN)</option>
                                <option value="+61">+61 (AU)</option>
                            </select>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="flex-1 bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                        <p className="text-xs text-text-muted/60">Used for 2-Step Verification backup and critical contract alerts.</p>
                    </div>
                </div>

                <hr className="border-border-light" />

                {/* Physical Address */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">home_pin</span>
                        Physical Address
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Mailing Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all resize-y"
                            placeholder="Enter your full business or personal address..."
                        ></textarea>
                        <p className="text-xs text-text-muted/60">Required for invoicing and strict compliance standards.</p>
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
                            "Save Contact Info"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

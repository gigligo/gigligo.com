'use client';

import { useState } from 'react';

export function ProfileView({ userData }: { userData: any; token: string; apiUrl: string }) {
    const [firstName, setFirstName] = useState(userData?.profile?.firstName || '');
    const [lastName, setLastName] = useState(userData?.profile?.lastName || '');
    const [title, setTitle] = useState(userData?.profile?.title || '');
    const [bio, setBio] = useState(userData?.profile?.bio || '');
    const [location, setLocation] = useState(userData?.profile?.location || '');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">My Profile</h2>
                <p className="text-text-muted mt-1 text-sm">Manage your public persona and professional details.</p>
            </div>

            <div className="space-y-8">
                {/* Visual Identity */}
                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-16">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface-light shadow-xl bg-background-light flex items-center justify-center shrink-0">
                            {userData?.profile?.avatar ? (
                                <img src={userData.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-5xl text-text-muted">account_circle</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold text-text-main">Profile Photo & Cover</h3>
                            <p className="text-sm text-text-muted mb-4">Recommended size: 500x500px for avatar, 1920x1080px for cover.</p>
                            <div className="flex gap-3 justify-center sm:justify-start">
                                <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md hover:bg-primary-dark transition-colors">Upload Avatar</button>
                                <button className="px-4 py-2 bg-background-light border border-border-light text-text-main text-xs font-bold rounded-lg hover:border-primary/50 transition-colors">Update Cover</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Details Form */}
                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-text-main mb-6">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="E.g. Jane"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="E.g. Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Professional Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="E.g. Executive Creative Director"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Location</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3.5 text-text-muted/50 text-[18px]">location_on</span>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-background-light border border-border-light rounded-lg pl-10 pr-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Personal Website</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-3.5 text-text-muted/50 text-[18px]">link</span>
                                <input
                                    type="url"
                                    className="w-full bg-background-light border border-border-light rounded-lg pl-10 pr-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Biography</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full bg-background-light border border-border-light rounded-lg px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                            placeholder="Write a brief introduction about your career..."
                        ></textarea>
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
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

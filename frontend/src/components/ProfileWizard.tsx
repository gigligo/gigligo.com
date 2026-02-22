'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, FileText, Briefcase, ChevronRight, X, CheckCircle } from 'lucide-react';

interface ProfileData {
    fullName?: string;
    bio?: string;
    skills?: string[];
    avatarUrl?: string;
    portfolio?: string;
}

export default function ProfileWizard({ profile }: { profile?: ProfileData }) {
    const { data: session } = useSession();
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || !session) return null;

    // Calculate completion percentage
    const fields = [
        { key: 'fullName', label: 'Full Name', icon: User, filled: !!profile?.fullName },
        { key: 'bio', label: 'Bio / Description', icon: FileText, filled: !!profile?.bio && profile.bio.length > 20 },
        { key: 'skills', label: 'Skills', icon: Briefcase, filled: !!profile?.skills && profile.skills.length >= 2 },
        { key: 'avatarUrl', label: 'Profile Photo', icon: User, filled: !!profile?.avatarUrl },
        { key: 'portfolio', label: 'Portfolio Link', icon: FileText, filled: !!profile?.portfolio },
    ];

    const completedCount = fields.filter(f => f.filled).length;
    const percentage = Math.round((completedCount / fields.length) * 100);

    // Don't show if profile is >= 80% complete
    if (percentage >= 80) return null;

    return (
        <div className="relative bg-linear-to-r from-orange/10 via-orange/5 to-teal/10 dark:from-orange/15 dark:via-transparent dark:to-teal/15 border border-orange/20 dark:border-orange/30 rounded-2xl p-6 mb-8">
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
            >
                <X size={16} className="text-slate-400" />
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Left: Progress */}
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-white/10" />
                            <circle
                                cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"
                                strokeDasharray={`${percentage * 1.76} 176`}
                                strokeLinecap="round"
                                className="text-orange transition-all duration-500"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white">
                            {percentage}%
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Complete Your Profile</h3>
                        <p className="text-sm text-slate-500 dark:text-white/50">A complete profile gets <span className="text-orange font-semibold">3x more orders</span></p>
                    </div>
                </div>

                {/* Right: Checklist */}
                <div className="flex flex-wrap gap-3 flex-1">
                    {fields.map(f => (
                        <div
                            key={f.key}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${f.filled
                                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50'
                                }`}
                        >
                            {f.filled ? <CheckCircle size={12} /> : <f.icon size={12} />}
                            {f.label}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="/settings"
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange text-white text-sm font-semibold hover:bg-orange-light transition-colors"
                >
                    Edit Profile <ChevronRight size={14} />
                </a>
            </div>
        </div>
    );
}

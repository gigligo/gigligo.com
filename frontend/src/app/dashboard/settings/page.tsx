'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';

// View Components
import { ProfileView } from './components/ProfileView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { ContactInfoView } from './components/ContactInfoView';
import { IdentityVerificationView } from './components/IdentityVerificationView';
import { SecurityView } from './components/SecurityView';
import { ConnectedServicesView } from './components/ConnectedServicesView';
import { BillingPaymentsView } from './components/BillingPaymentsView';
import { WithdrawalsView } from './components/WithdrawalsView';
import { MembershipView } from './components/MembershipView';
import { TeamsView } from './components/TeamsView';
import { NotificationsView } from './components/NotificationsView';

const SETTINGS_CATEGORIES = [
    {
        name: 'Account & Identity',
        items: [
            { id: 'profile', label: 'My Profile', icon: 'person' },
            { id: 'profile_settings', label: 'Profile Settings', icon: 'manage_accounts' },
            { id: 'contact', label: 'Contact Info', icon: 'contact_mail' },
            { id: 'verification', label: 'Identity Verification', icon: 'verified_user' },
        ]
    },
    {
        name: 'Security & Access',
        items: [
            { id: 'security', label: 'Password & Security', icon: 'lock' },
            { id: 'connected_services', label: 'Connected Services', icon: 'hub' },
        ]
    },
    {
        name: 'Financials & Workspace',
        items: [
            { id: 'billing', label: 'Billing & Payments', icon: 'credit_card' },
            { id: 'withdrawals', label: 'Withdrawals', icon: 'account_balance' },
            { id: 'membership', label: 'Membership', icon: 'card_membership' },
            { id: 'teams', label: 'My Teams', icon: 'groups' },
        ]
    },
    {
        name: 'Preferences',
        items: [
            { id: 'notifications', label: 'Notification Settings', icon: 'notifications' },
        ]
    }
];

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('profile');

    const token = (session as any)?.accessToken;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Global settings state (can be passed to views)
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (token) {
            fetch(`${apiUrl}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setUserData(data);
                })
                .catch(err => console.error('Failed to fetch profile', err));
        }
    }, [token, apiUrl]);

    if (!session) return null;

    const renderActiveView = () => {
        switch (activeTab) {
            case 'profile': return <ProfileView userData={userData} token={token} apiUrl={apiUrl} />;
            case 'profile_settings': return <ProfileSettingsView />;
            case 'contact': return <ContactInfoView userData={userData} token={token} apiUrl={apiUrl} />;
            case 'verification': return <IdentityVerificationView />;
            case 'security': return <SecurityView userData={userData} token={token} apiUrl={apiUrl} />;
            case 'connected_services': return <ConnectedServicesView />;
            case 'billing': return <BillingPaymentsView />;
            case 'withdrawals': return <WithdrawalsView />;
            case 'membership': return <MembershipView />;
            case 'teams': return <TeamsView />;
            case 'notifications': return <NotificationsView />;
            default: return <ProfileView userData={userData} token={token} apiUrl={apiUrl} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 96 }}>
                {/* Header */}
                <div className="border-b border-border-light bg-surface-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="material-symbols-outlined text-primary text-3xl">tune</span>
                            <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tight">Settings Workspace</h1>
                        </div>
                        <p className="text-text-muted mt-2 text-sm md:text-base max-w-xl">
                            Configure your executive presence, security protocols, and financial mandates.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                    <div className="flex flex-col md:flex-row gap-12 items-start">

                        {/* Settings Sidebar */}
                        <div className="w-full md:w-72 shrink-0 space-y-8 sticky top-32">
                            {SETTINGS_CATEGORIES.map((category, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider pl-4">
                                        {category.name}
                                    </h3>
                                    <div className="space-y-1">
                                        {category.items.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 text-sm font-semibold ${activeTab === tab.id
                                                    ? 'bg-nav-bg text-white shadow-md'
                                                    : 'text-text-muted hover:bg-surface-light hover:text-text-main'
                                                    }`}
                                            >
                                                <span className={`material-symbols-outlined text-[18px] ${activeTab === tab.id ? 'text-primary' : ''}`}>
                                                    {tab.icon}
                                                </span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Settings Panel */}
                        <div className="flex-1 w-full min-w-0">
                            {renderActiveView()}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

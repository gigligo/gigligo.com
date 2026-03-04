'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Mail,
    ShieldCheck,
    Lock,
    Share2,
    CreditCard,
    ArrowDownToLine,
    Zap,
    Users,
    Bell,
    Cpu,
    Activity,
    ChevronRight,
    Search
} from 'lucide-react';

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
        name: 'Profile & Account',
        items: [
            { id: 'profile', label: 'Public Profile', icon: User, desc: 'Manage your visibility' },
            { id: 'profile_settings', label: 'System Settings', icon: Settings, desc: 'Language & preferences' },
            { id: 'contact', label: 'Contact Details', icon: Mail, desc: 'Email & phone endpoints' },
            { id: 'verification', label: 'Identity Verification', icon: ShieldCheck, desc: 'Verification status' },
        ]
    },
    {
        name: 'Security & Privacy',
        items: [
            { id: 'security', label: 'Password & Security', icon: Lock, desc: 'Access keys & 2FA' },
            { id: 'connected_services', label: 'Connected Services', icon: Share2, desc: 'External account sync' },
        ]
    },
    {
        name: 'Finance & Billing',
        items: [
            { id: 'billing', label: 'Billing & Payments', icon: CreditCard, desc: 'Payment methods & history' },
            { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownToLine, desc: 'Payout protocols' },
            { id: 'membership', label: 'Membership Plan', icon: Zap, desc: 'Manage your tier' },
            { id: 'teams', label: 'Team Management', icon: Users, desc: 'Unit roles & access' },
        ]
    },
    {
        name: 'Notifications',
        items: [
            { id: 'notifications', label: 'Notification Settings', icon: Bell, desc: 'Alert frequency calibration' },
        ]
    }
];

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('profile');
    const [searchQuery, setSearchQuery] = useState('');

    const token = (session as any)?.accessToken;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Global settings state
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
        const views: any = {
            profile: <ProfileView userData={userData} token={token} apiUrl={apiUrl} />,
            profile_settings: <ProfileSettingsView />,
            contact: <ContactInfoView userData={userData} token={token} apiUrl={apiUrl} />,
            verification: <IdentityVerificationView />,
            security: <SecurityView userData={userData} token={token} apiUrl={apiUrl} />,
            connected_services: <ConnectedServicesView />,
            billing: <BillingPaymentsView />,
            withdrawals: <WithdrawalsView />,
            membership: <MembershipView />,
            teams: <TeamsView />,
            notifications: <NotificationsView />,
        };
        return views[activeTab] || views.profile;
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased selection:bg-primary/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-1" style={{ paddingTop: 72 }}>
                {/* Premium Dashboard Header */}
                <div className="relative border-b border-white/5 bg-black/40 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-160 h-160 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto px-10 md:px-20 py-16 md:py-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-4"
                        >
                            <div className="flex flex-col gap-3">
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                                    Account <span className="text-primary">Settings</span>
                                </h1>
                                <p className="text-base md:text-lg font-medium text-white/40 max-w-2xl leading-relaxed">
                                    Manage your profile details, security preferences, and financial configurations.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
                        >
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-lg font-bold tracking-tight text-emerald-500 flex items-center gap-2">
                                    <Activity size={14} className="animate-pulse" />
                                    Active
                                </p>
                            </div>
                            <div className="w-px h-8 bg-white/10 mx-2" />
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Account Tier</p>
                                <p className="text-lg font-bold tracking-tight text-white/60">Professional</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-10 md:px-20 py-24">
                    <div className="flex flex-col lg:flex-row gap-20 items-start">

                        {/* Settings Navigation Sidebar */}
                        <aside className="w-full lg:w-[320px] shrink-0 space-y-12 sticky top-32">
                            {/* Search */}
                            <div className="relative group">
                                <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search settings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-12 bg-black/40 border border-white/5 rounded-xl pl-12 pr-6 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
                                />
                            </div>

                            {SETTINGS_CATEGORIES.map((category, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest px-4 border-l-2 border-primary/20 ml-2 py-0.5">
                                        {category.name}
                                    </h3>
                                    <div className="space-y-2">
                                        {category.items.map(tab => {
                                            const isActive = activeTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all duration-300 relative group overflow-hidden border ${isActive
                                                        ? 'bg-primary/10 border-primary/30 text-white shadow-lg shadow-black/20'
                                                        : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 border border-white/5 text-white/20 group-hover:text-primary group-hover:border-primary/20'}`}>
                                                        <tab.icon size={16} strokeWidth={2} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className={`text-[13px] font-bold block transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{tab.label}</span>
                                                        <span className={`text-[11px] font-medium block transition-colors duration-300 ${isActive ? 'text-white/40' : 'text-white/20'}`}>{tab.desc}</span>
                                                    </div>
                                                    {isActive && (
                                                        <motion.div layoutId="active-pill" className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Platform Uptime</h4>
                                <div className="flex items-end gap-2 text-3xl font-bold text-white/40">
                                    999<span className="text-sm pb-1 font-medium">.82 DAYS</span>
                                </div>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Operational
                                </p>
                            </div>
                        </aside>

                        {/* Interactive Parameters Panel */}
                        <div className="flex-1 w-full min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="bg-white/2 border border-white/5 rounded-3xl backdrop-blur-3xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                                    <div className="p-1 md:p-1">
                                        {renderActiveView()}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

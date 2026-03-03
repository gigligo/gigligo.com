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
        name: 'Identity & Presence',
        items: [
            { id: 'profile', label: 'Public Dossier', icon: User, desc: 'Manage your network visibility' },
            { id: 'profile_settings', label: 'Core Parameters', icon: Settings, desc: 'Neural localization & vision' },
            { id: 'contact', label: 'Comm Channels', icon: Mail, desc: 'Primary signal endpoints' },
            { id: 'verification', label: 'Credential Auth', icon: ShieldCheck, desc: 'Biometric clearance status' },
        ]
    },
    {
        name: 'Security Shield',
        items: [
            { id: 'security', label: 'Encryption Protocol', icon: Lock, desc: 'Access keys & rotation' },
            { id: 'connected_services', label: 'Grid Nodes', icon: Share2, desc: 'External relay synchronization' },
        ]
    },
    {
        name: 'Financial Treasury',
        items: [
            { id: 'billing', label: 'Capital Cycles', icon: CreditCard, desc: 'Treasury conduits & influx' },
            { id: 'withdrawals', label: 'Extraction', icon: ArrowDownToLine, desc: 'Liquidity outflow protocols' },
            { id: 'membership', label: 'Rank Status', icon: Zap, desc: 'Elite tier mandates' },
            { id: 'teams', label: 'Unit Management', icon: Users, desc: 'Command hierarchy allocation' },
        ]
    },
    {
        name: 'Signal Preferences',
        items: [
            { id: 'notifications', label: 'Signal Protocols', icon: Bell, desc: 'Alert frequency calibration' },
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
                {/* Cinematic Tactical Header */}
                <div className="relative border-b border-white/5 bg-black/60 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,124,255,0.08)_0%,transparent_50%)] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-200 h-200 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto px-10 md:px-20 py-24 md:py-32 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-3xl shadow-primary/20">
                                    <Cpu size={32} strokeWidth={1} />
                                </div>
                                <h1 className="text-5xl md:text-[5rem] font-black text-white tracking-tighter uppercase italic leading-none">
                                    Operative <span className="text-primary not-italic">Parameters.</span>
                                </h1>
                            </div>
                            <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-8 max-w-2xl">
                                Calibrate your strategic presence, encryption protocols, and financial mandates for elite performance on the network.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center gap-4 font-mono"
                        >
                            <div className="text-right">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">SYSTEM CORE STATUS</p>
                                <p className="text-2xl font-black italic tracking-tighter text-emerald-500 flex items-center gap-3">
                                    <Activity size={20} className="animate-pulse" />
                                    SYNCED_88%
                                </p>
                            </div>
                            <div className="w-px h-12 bg-white/10 mx-6" />
                            <div className="text-right">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">ENCRYPTION KEY</p>
                                <p className="text-2xl font-black italic tracking-tighter text-white/60">GGLG-PRM-24</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-10 md:px-20 py-24">
                    <div className="flex flex-col lg:flex-row gap-20 items-start">

                        {/* Tactical Navigation Sidebar */}
                        <aside className="w-full lg:w-[400px] shrink-0 space-y-16 sticky top-32">
                            {/* System Search */}
                            <div className="relative group">
                                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH PARAMETERS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl pl-16 pr-6 text-[10px] font-black uppercase tracking-[0.4em] italic text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
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
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] px-4 italic border-l-2 border-primary/20 ml-4 py-1">
                                        {category.name}
                                    </h3>
                                    <div className="space-y-3">
                                        {category.items.map(tab => {
                                            const isActive = activeTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`w-full text-left p-6 rounded-4xl flex items-center gap-6 transition-all duration-700 relative group overflow-hidden border-2 ${isActive
                                                        ? 'bg-primary/5 border-primary shadow-3xl shadow-primary/10'
                                                        : 'bg-white/1 border-white/5 text-white/20 hover:bg-white/3 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-primary text-white' : 'bg-black border border-white/5 group-hover:text-primary group-hover:border-primary/20'}`}>
                                                        <tab.icon size={20} strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] block transition-colors duration-700 italic ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{tab.label}</span>
                                                        <span className={`text-[9px] font-bold italic uppercase tracking-widest block transition-colors duration-700 ${isActive ? 'text-white/40' : 'text-white/10'}`}>{tab.desc}</span>
                                                    </div>
                                                    {isActive && (
                                                        <ChevronRight size={16} className="text-white/40" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}

                            <div className="p-8 rounded-[3rem] bg-linear-to-br from-primary/10 to-transparent border border-primary/20 space-y-4">
                                <h4 className="text-[10px] font-black text-white italic uppercase tracking-[0.4em]">SYSTEM UPTIME</h4>
                                <div className="flex items-end gap-3 text-4xl font-black font-mono italic text-white/40">
                                    999<span className="text-sm pb-1">.82 DAYS</span>
                                </div>
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic">STABLE SIGNAL RELAY</p>
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
                                    className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                                    {renderActiveView()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

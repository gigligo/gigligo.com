'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Mail,
    Smartphone,
    Zap,
    Activity,
    ShieldCheck,
    Save,
    Loader2,
    MessageSquare,
    Clock,
    CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsView() {
    const [preferences, setPreferences] = useState({
        email_messages: true,
        email_contracts: true,
        email_marketing: false,
        push_messages: true,
        push_reminders: true,
        sms_security: true,
        sms_alerts: false
    });

    const togglePref = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const [saving, setSaving] = useState(false);
    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Signal protocols synchronized.");
        }, 1200);
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Signal Protocols</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Calibrate your notification preferences and alert frequencies.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden space-y-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Email Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Mail size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Email Notifications</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <ToggleRow
                            title="Direct Transmissions"
                            description="Asynchronous email alerts for incoming peer-to-peer messages."
                            icon={MessageSquare}
                            checked={preferences.email_messages}
                            onChange={() => togglePref('email_messages')}
                        />
                        <ToggleRow
                            title="Mandate & Escrow Cycles"
                            description="Critical telemetry regarding active project funding and clearance."
                            icon={Activity}
                            checked={preferences.email_contracts}
                            onChange={() => togglePref('email_contracts')}
                            disabled={true}
                            mandatory={true}
                        />
                        <ToggleRow
                            title="Intelligence Briefings"
                            description="Occasional updates about new GIGLIGO vector features and spotlights."
                            icon={Zap}
                            checked={preferences.email_marketing}
                            onChange={() => togglePref('email_marketing')}
                        />
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Push Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Bell size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Push Alerts</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <ToggleRow
                            title="In-App Comms"
                            description="Browser or mobile push notifications for instant operative chat."
                            icon={MessageSquare}
                            checked={preferences.push_messages}
                            onChange={() => togglePref('push_messages')}
                        />
                        <ToggleRow
                            title="Deadline Proximity"
                            description="Alerts 24 hours before a major project milestone threshold is reached."
                            icon={Clock}
                            checked={preferences.push_reminders}
                            onChange={() => togglePref('push_reminders')}
                        />
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* SMS Section */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-black">
                            <Smartphone size={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">SMS Security</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <ToggleRow
                            title="Hard-Security Alerts"
                            description="Immediate SMS for unauthorized access attempts or key rotations."
                            icon={ShieldCheck}
                            checked={preferences.sms_security}
                            onChange={() => togglePref('sms_security')}
                            disabled={true}
                            mandatory={true}
                        />
                        <ToggleRow
                            title="Extraction Confirmations"
                            description="Telemetric confirmation when capital successfully hits your bank node."
                            icon={CreditCard}
                            checked={preferences.sms_alerts}
                            onChange={() => togglePref('sms_alerts')}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-white/5">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-16 px-12 bg-primary text-white text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center gap-4 active:scale-95 disabled:opacity-20"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                SAVE CHANGES
                                <Save size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ToggleRow({ title, description, icon: Icon, checked, onChange, disabled = false, mandatory = false }: any) {
    return (
        <label className={`flex items-center justify-between gap-6 p-6 rounded-2xl border transition-all duration-500 cursor-pointer group ${disabled ? 'opacity-30' : 'hover:bg-white/2 border-white/5 hover:border-primary/20'
            } ${checked && !disabled ? 'bg-primary/3 border-primary/20' : ''}`}>
            <div className="flex items-center gap-6 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${checked ? 'bg-primary/20 text-primary' : 'bg-black text-white/10 group-hover:text-white/30'}`}>
                    <Icon size={18} strokeWidth={1.5} />
                </div>
                <div className="space-y-1 truncate">
                    <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-white tracking-tight">{title}</h4>
                        {mandatory && <span className="text-[8px] font-bold text-primary uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-full">Required</span>}
                    </div>
                    <p className="text-xs font-medium text-white/20 leading-relaxed max-w-xl truncate md:whitespace-normal">{description}</p>
                </div>
            </div>

            <div className="relative shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={disabled ? undefined : onChange}
                    className="sr-only"
                />
                <div className={`w-16 h-8 rounded-full transition-all duration-500 border border-white/10 relative ${checked ? 'bg-primary' : 'bg-black'}`}>
                    <motion.div
                        initial={false}
                        animate={{ x: checked ? 34 : 4 }}
                        className="w-6 h-6 rounded-full bg-white absolute top-1 shadow-2xl"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </div>
            </div>
        </label>
    );
}

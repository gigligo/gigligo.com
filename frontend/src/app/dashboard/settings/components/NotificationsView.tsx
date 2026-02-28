'use client';

import { useState } from 'react';

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
        setTimeout(() => setSaving(false), 800);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">Notification Settings</h2>
                <p className="text-text-muted mt-1 text-sm">Control how and when you receive alerts from the platform.</p>
            </div>

            <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 space-y-8">

                {/* Email Notifications */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">email</span>
                        Email Notifications
                    </h3>
                    <div className="space-y-4">
                        <ToggleRow
                            title="Direct Messages"
                            description="Receive an email when a client or team member messages you."
                            checked={preferences.email_messages}
                            onChange={() => togglePref('email_messages')}
                        />
                        <ToggleRow
                            title="Contract & Escrow Updates"
                            description="Critical alerts regarding active projects, funding, and approvals."
                            checked={preferences.email_contracts}
                            onChange={() => togglePref('email_contracts')}
                            disabled={true}
                        />
                        <ToggleRow
                            title="Marketing & Newsletters"
                            description="Occasional updates about new GIGLIGO features and top talent spotlights."
                            checked={preferences.email_marketing}
                            onChange={() => togglePref('email_marketing')}
                        />
                    </div>
                </div>

                <hr className="border-border-light" />

                {/* Push Notifications */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">notifications_active</span>
                        Push Notifications
                    </h3>
                    <div className="space-y-4">
                        <ToggleRow
                            title="In-App Messages"
                            description="Browser or mobile push notifications for instant chats."
                            checked={preferences.push_messages}
                            onChange={() => togglePref('push_messages')}
                        />
                        <ToggleRow
                            title="Deadline Reminders"
                            description="Alerts 24 hours before a major project milestone is due."
                            checked={preferences.push_reminders}
                            onChange={() => togglePref('push_reminders')}
                        />
                    </div>
                </div>

                <hr className="border-border-light" />

                {/* SMS Notifications */}
                <div>
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">sms</span>
                        SMS Texts
                    </h3>
                    <div className="space-y-4">
                        <ToggleRow
                            title="Critical Security Alerts"
                            description="Immediate text messages for unauthorized login attempts or password changes."
                            checked={preferences.sms_security}
                            onChange={() => togglePref('sms_security')}
                            disabled={true}
                        />
                        <ToggleRow
                            title="Withdrawal Status"
                            description="Texts when your funds successfully land in your bank account."
                            checked={preferences.sms_alerts}
                            onChange={() => togglePref('sms_alerts')}
                        />
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

function ToggleRow({ title, description, checked, onChange, disabled = false }: any) {
    return (
        <div className={`flex items-start justify-between gap-6 p-4 rounded-xl border border-transparent hover:border-border-light transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <div>
                <h4 className="font-bold text-text-main text-sm mb-1">{title}</h4>
                <p className="text-xs text-text-muted leading-relaxed max-w-md">{description}</p>
                {disabled && title.includes('Escrow') && <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2 block">Required for service</span>}
                {disabled && title.includes('Security') && <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-2 block">Mandatory Protocol</span>}
            </div>
            <button
                onClick={disabled ? undefined : onChange}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 border border-border-light ${checked ? 'bg-primary' : 'bg-background-light'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${checked ? 'left-7' : 'left-0.5'}`}></div>
            </button>
        </div>
    );
}

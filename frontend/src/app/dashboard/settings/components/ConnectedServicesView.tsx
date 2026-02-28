'use client';

import { useState } from 'react';

export function ConnectedServicesView() {
    const [services, setServices] = useState([
        { id: 'google', name: 'Google', description: 'Sign in to GIGLIGO with your Google account.', connected: true, icon: 'trusted_device' },
        { id: 'apple', name: 'Apple', description: 'Sign in smoothly using your Apple ID.', connected: false, icon: 'apple' },
        { id: 'linkedin', name: 'LinkedIn', description: 'Import professional experience and referrals directly from LinkedIn.', connected: false, icon: 'work' },
        { id: 'github', name: 'GitHub', description: 'Link repositories for automated portfolio sync.', connected: false, icon: 'code' },
    ]);

    const toggleConnection = (id: string) => {
        setServices(services.map(s => s.id === id ? { ...s, connected: !s.connected } : s));
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-main">Connected Services</h2>
                <p className="text-text-muted mt-1 text-sm">Integrate third-party accounts for faster login and profile synchronization.</p>
            </div>

            <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                <div className="space-y-4">
                    {services.map((service, index) => (
                        <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl border border-border-light bg-background-light gap-6 hover:border-primary/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl border shrink-0 ${service.connected ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-light border-border-light text-text-muted'}`}>
                                    <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main mb-1">{service.name}</h4>
                                    <p className="text-sm text-text-muted max-w-sm leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:flex-col sm:items-end justify-between sm:justify-center">
                                {service.connected ? (
                                    <>
                                        <span className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Connected
                                        </span>
                                        <button
                                            onClick={() => toggleConnection(service.id)}
                                            className="text-xs font-bold text-text-muted hover:text-red-500 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => toggleConnection(service.id)}
                                        className="px-6 py-2 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-lg hover:border-primary/50 transition-colors shrink-0"
                                    >
                                        Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-white/5">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">security</span>
                <h4 className="font-bold text-lg mb-2">Data Privacy & Security</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                    GIGLIGO only requests permission to view your basic profile information when connecting third-party services. We never post to your timeline or access private messages without explicit authorization.
                </p>
            </div>
        </div>
    );
}

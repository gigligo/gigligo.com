'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Shield,
    Link as LinkIcon,
    CheckCircle2,
    XCircle,
    Github,
    Linkedin,
    Chrome,
    Apple,
    Activity,
    Lock
} from 'lucide-react';
import { toast } from 'sonner';

export function ConnectedServicesView() {
    const [services, setServices] = useState([
        { id: 'google', name: 'GOOGLE CLOUD', description: 'Synchronize identity via Google persistent OAuth 2.0 node.', connected: true, icon: Chrome },
        { id: 'apple', name: 'APPLE ID', description: 'Secure biometric-ready authentication through Apple secure enclave.', connected: false, icon: Apple },
        { id: 'linkedin', name: 'LINKEDIN PROFESSIONAL', description: 'Source career telemetry and professional endorsements directly from the grid.', connected: false, icon: Linkedin },
        { id: 'github', name: 'GITHUB REPOSITORY', description: 'Link codebase repositories for automated portfolio sync and capability audit.', connected: false, icon: Github },
    ]);

    const toggleConnection = (id: string, name: string, isConnecting: boolean) => {
        setServices(services.map(s => s.id === id ? { ...s, connected: !s.connected } : s));
        if (isConnecting) {
            toast.success(`${name} node synchronized.`);
        } else {
            toast.info(`${name} relay disconnected.`);
        }
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Connected Services</h2>
                <p className="text-lg font-medium text-white/40 leading-tight">Manage integrations between Gigligo and your external accounts for seamless data flow.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-3xl p-10 md:p-14 backdrop-blur-3xl shadow-2xl shadow-black relative overflow-hidden space-y-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="grid grid-cols-1 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl border border-white/5 bg-black/40 gap-8 hover:bg-white/2 hover:border-primary/20 transition-all duration-500 group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-700 ${service.connected ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-black text-white/10 border border-white/5 group-hover:text-white/30'}`}>
                                    <service.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{service.name}</h4>
                                    <p className="text-sm font-medium text-white/20 leading-relaxed max-w-sm">{service.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 md:flex-col md:items-end justify-between md:justify-center">
                                {service.connected ? (
                                    <>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <CheckCircle2 size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">CONNECTED</span>
                                        </div>
                                        <button
                                            onClick={() => toggleConnection(service.id, service.name, false)}
                                            className="text-[10px] font-bold text-white/20 hover:text-red-500 uppercase tracking-widest transition-all"
                                        >
                                            DISCONNECT
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => toggleConnection(service.id, service.name, true)}
                                        className="h-12 px-8 bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary hover:border-primary hover:text-white transition-all active:scale-95 group-hover:shadow-lg group-hover:shadow-primary/20 flex items-center gap-3"
                                    >
                                        <LinkIcon size={16} />
                                        CONNECT
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 p-8 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group/privacy">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="w-14 h-14 rounded-xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-xl shrink-0 group-hover/privacy:scale-105 transition-transform duration-700">
                        <Shield size={24} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h4 className="text-lg font-bold text-white tracking-tight">Privacy Policy</h4>
                        <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest leading-relaxed max-w-2xl">
                            Gigligo only requests minimal permissions. We never store your passwords or post on your behalf.
                        </p>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3 text-primary/60 font-medium">
                        <Activity size={16} className="animate-pulse" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">SECURE CONNECTION</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Grid Nodes</h2>
                <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Establish secure relays between GIGLIGO and third-party infrastructure for enhanced data mobility.</p>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-[4rem] p-12 md:p-16 backdrop-blur-3xl shadow-3xl shadow-black relative overflow-hidden space-y-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="grid grid-cols-1 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[3rem] border border-white/5 bg-black/40 gap-10 hover:bg-white/2 hover:border-primary/20 transition-all duration-500 group"
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 ${service.connected ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-black text-white/10 border border-white/5 group-hover:text-white/30'}`}>
                                    <service.icon size={28} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{service.name}</h4>
                                    <p className="text-sm font-bold italic text-white/20 leading-relaxed max-w-sm">{service.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 md:flex-col md:items-end justify-between md:justify-center">
                                {service.connected ? (
                                    <>
                                        <div className="flex items-center gap-3 text-emerald-500">
                                            <CheckCircle2 size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">SYNCHRONIZED</span>
                                        </div>
                                        <button
                                            onClick={() => toggleConnection(service.id, service.name, false)}
                                            className="text-[10px] font-black text-white/20 hover:text-red-500 uppercase tracking-[0.4em] transition-all italic"
                                        >
                                            DISCONNECT RELAY
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => toggleConnection(service.id, service.name, true)}
                                        className="h-14 px-10 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary hover:border-primary hover:text-white transition-all italic active:scale-95 group-hover:shadow-3xl group-hover:shadow-primary/20 flex items-center gap-4"
                                    >
                                        <LinkIcon size={16} />
                                        ESTABLISH UPLINK
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 p-10 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group/privacy">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary shadow-2xl shrink-0 group-hover/privacy:scale-110 transition-transform duration-700">
                        <Shield size={28} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Encryption & Privacy Protocol</h4>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] leading-relaxed max-w-2xl italic">
                            GIGLIGO only requests minimal identity tokens for external relay. We never transmit PII (Personally Identifiable Information) or perform unauthorized timeline injections.
                        </p>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4 text-primary italic">
                        <Activity size={20} className="animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Security Lock Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    Shield,
    Settings,
    User,
    UserMinus,
    CheckCircle2,
    Clock,
    MoreVertical,
    Activity
} from 'lucide-react';

export function TeamsView() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Unit Management</h2>
                    <p className="text-xl font-bold italic text-white/40 leading-tight border-l-2 border-primary/20 pl-6">Calibrate organizational hierarchy, delegate tactical roles, and oversee unit deployment.</p>
                </div>
                <button className="h-16 px-10 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-primary/40 hover:bg-primary-dark transition-all flex items-center gap-4 italic active:scale-95">
                    <UserPlus size={20} />
                    INVITE OPERATIVE
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/2 border border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-3xl shadow-black relative"
            >
                {/* Team Header */}
                <div className="p-12 md:p-16 border-b border-white/5 bg-black/40 relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none opacity-50" />

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-3xl shadow-primary/20 italic border-4 border-black group-hover:scale-110 transition-transform duration-700">
                                G
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Global Enterprises Inc.</h3>
                                <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                                    <span>EXECUTIVE WORKSPACE</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                                    <span className="text-primary">3 / 20 NODES OCCUPIED</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-primary transition-all hover:bg-white/10">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Members Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/1">
                                <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic pl-16">Active Operatives</th>
                                <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Tactical Role</th>
                                <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Duty State</th>
                                <th className="p-10 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic text-right pr-16">Directive</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/2">
                            {[
                                { name: 'JANE DOE', email: 'JANE.DOE@GLOBAL.INC', role: 'COMMANDER (OWNER)', status: 'ACTIVE DUTY', isSelf: true },
                                { name: 'MICHAEL CHEN', email: 'M.CHEN@GLOBAL.INC', role: 'FINANCIAL STRATEGIST', status: 'ACTIVE DUTY', isSelf: false },
                                { name: 'SARAH JENKINS', email: 'S.JENKINS@GLOBAL.INC', role: 'CONTENT OPERATIVE', status: 'SIGNAL PENDING', isSelf: false },
                            ].map((member, i) => (
                                <tr key={i} className="hover:bg-white/2 transition-colors group">
                                    <td className="p-10 pl-16">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-white/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500 overflow-hidden relative shadow-2xl">
                                                <User size={32} strokeWidth={1} />
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4 group-hover:text-primary transition-colors">
                                                    {member.name}
                                                    {member.isSelf && <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full italic">SELF</span>}
                                                </p>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-mono italic">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="relative group/select">
                                            <select
                                                className={`bg-transparent border border-white/5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest italic text-white/30 focus:outline-none focus:border-primary transition-all cursor-pointer appearance-none ${member.isSelf ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20 hover:text-white'}`}
                                                defaultValue={member.role}
                                                disabled={member.isSelf}
                                            >
                                                <option value="COMMANDER (OWNER)">COMMANDER (OWNER)</option>
                                                <option value="FINANCIAL STRATEGIST">FINANCIAL STRATEGIST</option>
                                                <option value="CONTENT OPERATIVE">CONTENT OPERATIVE</option>
                                                <option value="VIEWER">VIEWER</option>
                                            </select>
                                            {!member.isSelf && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none group-hover/select:text-primary transition-all" />}
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className={`flex items-center gap-3 ${member.status === 'ACTIVE DUTY' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {member.status === 'ACTIVE DUTY' ? <CheckCircle2 size={16} /> : <Clock size={16} className="animate-pulse" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">{member.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-10 text-right pr-16">
                                        {!member.isSelf && (
                                            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100" title="PURGE OPERATIVE">
                                                <UserMinus size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-12 md:p-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/1">
                    <div className="flex items-center gap-4 text-white/20 italic">
                        <Shield size={16} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Unit Lockdown Protocols Active</p>
                    </div>
                    <div className="flex items-center gap-12 font-mono">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">DESTRUCTION IMMINENT</p>
                            <p className="text-2xl font-black italic tracking-tighter text-red-500/50">ARCHIVE DATA</p>
                        </div>
                        <div className="w-px h-12 bg-white/5" />
                        <div className="text-right">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">UNIT METRICS</p>
                            <p className="text-2xl font-black italic tracking-tighter text-primary">SYNC_88.2%</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

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
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Team Management</h2>
                        <p className="text-lg font-medium text-white/40 leading-tight">Manage your organization hierarchy and team members.</p>
                    </div>
                    <button className="h-14 px-8 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all flex items-center gap-3 active:scale-95">
                        <UserPlus size={18} />
                        INVITE MEMBER
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl shadow-black relative"
                >
                    {/* Team Header */}
                    <div className="p-10 md:p-14 border-b border-white/5 bg-black/40 relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none opacity-50" />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-primary/10 border-4 border-black group-hover:scale-105 transition-transform duration-500">
                                    G
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Global Enterprises Inc.</h3>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                        <span>Team Workspace</span>
                                        <span className="w-1 h-1 bg-white/10 rounded-full" />
                                        <span className="text-primary font-medium">3 / 20 SEATS OCCUPIED</span>
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
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest pl-12">Team Member</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">Role</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</th>
                                    <th className="p-8 text-[10px] font-bold text-white/20 uppercase tracking-widest text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/2">
                                {[
                                    { name: 'JANE DOE', email: 'jane.doe@global.inc', role: 'Team Owner', status: 'Active', isSelf: true },
                                    { name: 'MICHAEL CHEN', email: 'm.chen@global.inc', role: 'Finance Manager', status: 'Active', isSelf: false },
                                    { name: 'SARAH JENKINS', email: 's.jenkins@global.inc', role: 'Content Creator', status: 'Pending', isSelf: false },
                                ].map((member, i) => (
                                    <tr key={i} className="hover:bg-white/2 transition-colors group">
                                        <td className="p-8 pl-12">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-white/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500 overflow-hidden relative shadow-lg">
                                                    <User size={24} strokeWidth={1} />
                                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-lg font-bold text-white tracking-tight flex items-center gap-3 group-hover:text-primary transition-colors">
                                                        {member.name}
                                                        {member.isSelf && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest rounded-full">YOU</span>}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest font-mono">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="relative group/select">
                                                <select
                                                    className={`bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 focus:outline-none focus:border-primary/40 transition-all cursor-pointer appearance-none ${member.isSelf ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/10 hover:text-white'}`}
                                                    defaultValue={member.role}
                                                    disabled={member.isSelf}
                                                >
                                                    <option value="Team Owner">Team Owner</option>
                                                    <option value="Finance Manager">Finance Manager</option>
                                                    <option value="Content Creator">Content Creator</option>
                                                    <option value="Viewer">Viewer</option>
                                                </select>
                                                {!member.isSelf && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none group-hover/select:text-primary transition-all" />}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className={`flex items-center gap-2 ${member.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {member.status === 'Active' ? <CheckCircle2 size={14} /> : <Clock size={14} className="animate-pulse" />}
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{member.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right pr-12">
                                            {!member.isSelf && (
                                                <button className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100" title="PURGE OPERATIVE">
                                                    <UserMinus size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-10 md:p-14 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/1">
                        <div className="flex items-center gap-3 text-white/20 font-medium">
                            <Shield size={16} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Internal control mechanisms active</p>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Action Required</p>
                                <p className="text-2xl font-bold tracking-tight text-white/60">Archive Team</p>
                            </div>
                            <div className="w-px h-10 bg-white/5" />
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Workspace Usage</p>
                                <p className="text-2xl font-bold tracking-tight text-primary">88.2%</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

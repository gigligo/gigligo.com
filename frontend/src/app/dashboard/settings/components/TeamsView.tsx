'use client';

export function TeamsView() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-main">My Teams</h2>
                    <p className="text-text-muted mt-1 text-sm">Manage organizational access and delegate roles securely.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person_add</span> Invite Member
                </button>
            </div>

            <div className="bg-surface-light border border-border-light rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-border-light bg-background-light/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                G
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-main">Global Enterprises Inc.</h3>
                                <p className="text-sm text-text-muted">Executive Workspace • 3 / 20 Seats Used</p>
                            </div>
                        </div>
                        <button className="hidden sm:flex text-text-muted hover:text-primary transition-colors p-2 border border-transparent hover:border-border-light rounded-lg">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-light bg-surface-light">
                                <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider pl-6 sm:pl-8">Active Members</th>
                                <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right pr-6 sm:pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Jane Doe', email: 'jane.doe@global.inc', role: 'Owner', status: 'Active', isSelf: true },
                                { name: 'Michael Chen', email: 'm.chen@global.inc', role: 'Financial Admin', status: 'Active', isSelf: false },
                                { name: 'Sarah Jenkins', email: 's.jenkins@global.inc', role: 'Editor', status: 'Pending Invite', isSelf: false },
                            ].map((member, i) => (
                                <tr key={i} className="border-b border-border-light/50 hover:bg-background-light/30 transition-colors group">
                                    <td className="p-4 pl-6 sm:pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-background-light border border-border-light flex items-center justify-center overflow-hidden shrink-0">
                                                <span className="material-symbols-outlined text-text-muted text-[18px]">person</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main flex items-center gap-2">
                                                    {member.name}
                                                    {member.isSelf && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded">You</span>}
                                                </p>
                                                <p className="text-xs text-text-muted">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            className="bg-transparent border border-transparent hover:border-border-light rounded-lg px-2 py-1 text-sm text-text-main focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                                            defaultValue={member.role}
                                            disabled={member.isSelf}
                                        >
                                            <option value="Owner">Owner</option>
                                            <option value="Financial Admin">Financial Admin</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Viewer">Viewer</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${member.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6 sm:pr-8">
                                        {!member.isSelf && (
                                            <button className="text-text-muted hover:text-red-500 transition-colors" title="Remove Member">
                                                <span className="material-symbols-outlined text-[20px]">person_remove</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

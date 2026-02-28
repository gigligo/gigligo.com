'use client';

export function WithdrawalsView() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-main">Withdrawals</h2>
                    <p className="text-text-muted mt-1 text-sm">Manage payout methods and monitor your available cleared balance.</p>
                </div>
            </div>

            {/* Balance Overview */}
            <div className="bg-primary border border-primary-dark rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-primary/10">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <span className="material-symbols-outlined text-[140px] text-white">account_balance_wallet</span>
                </div>
                <div className="relative z-10 text-white">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Available to Withdraw</p>
                    <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 font-mono">$24,580<span className="text-3xl text-white/50">.00</span></h3>

                    <button className="px-8 py-4 bg-white text-primary text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                        Request Payout <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Payout Methods */}
                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
                            Withdrawal Linked Accounts
                        </h3>
                        <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">add</span> Add Account
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Account */}
                        <div className="p-6 rounded-2xl border-2 border-border-light bg-background-light relative overflow-hidden flex items-center gap-6 group hover:border-primary/50 transition-colors">
                            <div className="p-4 bg-surface-light rounded-xl border border-border-light shrink-0">
                                <span className="material-symbols-outlined text-3xl text-text-main">account_balance</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-text-main">Chase Business</h4>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded">Default</span>
                                </div>
                                <p className="text-sm text-text-muted font-mono">•••• 8392</p>
                            </div>
                            <span className="material-symbols-outlined text-text-muted hover:text-text-main cursor-pointer shrink-0">more_vert</span>
                        </div>

                        {/* Crypto Wallet Alternative */}
                        <div className="p-6 rounded-2xl border-2 border-border-light bg-background-light relative overflow-hidden flex items-center gap-6 group hover:border-primary/50 transition-colors">
                            <div className="p-4 bg-surface-light rounded-xl border border-border-light shrink-0">
                                <span className="material-symbols-outlined text-3xl text-text-main">currency_bitcoin</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-text-main mb-1">USDC Wallet (Ethereum)</h4>
                                <p className="text-sm text-text-muted font-mono truncate max-w-[120px] sm:max-w-[200px]">0x71C...4d90</p>
                            </div>
                            <span className="material-symbols-outlined text-text-muted hover:text-text-main cursor-pointer shrink-0">more_vert</span>
                        </div>
                    </div>
                </div>

                {/* Recent Payouts */}
                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">history</span>
                        Recent Payouts
                    </h3>

                    <div className="space-y-4">
                        {[
                            { date: 'Nov 01, 2024', method: 'Chase Business •••• 8392', amount: '$15,000.00', status: 'Completed' },
                            { date: 'Oct 15, 2024', method: 'USDC Wallet (Ethereum)', amount: '$8,250.00', status: 'Completed' },
                        ].map((payout, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border-light bg-background-light gap-4 hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-text-main">{payout.method}</p>
                                        <p className="text-xs text-text-muted">{payout.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start">
                                    <span className="text-lg font-bold font-mono text-text-main">{payout.amount}</span>
                                    <span className="text-xs text-green-500 font-bold uppercase tracking-widest">{payout.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

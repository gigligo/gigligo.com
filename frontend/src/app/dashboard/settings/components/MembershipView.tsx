'use client';

export function MembershipView() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-main">Membership Plan</h2>
                    <p className="text-text-muted mt-1 text-sm">Review your active subscription and GIGLIGO tier privileges.</p>
                </div>
            </div>

            <div className="bg-surface-light border border-primary/20 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-primary/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <span className="material-symbols-outlined text-primary text-[16px]">stars</span>
                            <span className="text-primary text-xs font-bold uppercase tracking-widest">Active Tier</span>
                        </div>

                        <h3 className="text-4xl sm:text-5xl font-black text-text-main tracking-tighter mb-2">
                            Executive <span className="text-primary font-serif italic">Elite</span>
                        </h3>
                        <p className="text-text-muted text-sm max-w-md leading-relaxed mb-6">
                            You are on our highest tier, granting you priority access to verified talent, unlimited active contracts, and 0% escrow fees on transfers over $10,000.
                        </p>

                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                Upgrade Options
                            </button>
                            <button className="px-6 py-3 bg-background-light border border-border-light text-text-main text-sm font-bold rounded-lg hover:border-text-muted/50 transition-colors">
                                Cancel Plan
                            </button>
                        </div>
                    </div>

                    <div className="bg-background-light border border-border-light rounded-2xl p-6 w-full md:w-[320px] shrink-0">
                        <div className="text-center mb-6 pb-6 border-b border-border-light">
                            <p className="text-5xl font-black text-text-main font-mono">$499<span className="text-lg text-text-muted">/mo</span></p>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-2">Billed Annually</p>
                        </div>

                        <ul className="space-y-4">
                            {[
                                '0% Escrow Fees (Top Tier)',
                                'Unlimited Active Contracts',
                                'Priority Dedicated Support',
                                'Included Identity Verification',
                                'Up to 20 Team Seats Included'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-text-muted font-medium">
                                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Other Available Plans */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted text-xl">compare_arrows</span>
                    Explore Other Tiers
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic */}
                    <div className="p-8 rounded-2xl border border-border-light bg-surface-light opacity-60 hover:opacity-100 transition-opacity flex flex-col justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-text-main tracking-tight mb-2">Basic</h4>
                            <p className="text-3xl font-black font-mono text-text-main mb-6">$0<span className="text-sm text-text-muted font-sans">/mo</span></p>
                            <ul className="space-y-3 mb-8">
                                <li className="text-sm text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-text-muted/50 text-[18px]">check</span> Standard 5% Escrow Fee</li>
                                <li className="text-sm text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-text-muted/50 text-[18px]">check</span> Up to 3 Active Contracts</li>
                                <li className="text-sm text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-text-muted/50 text-[18px]">check</span> Community Support</li>
                            </ul>
                        </div>
                        <button className="w-full py-3 bg-background-light border border-border-light text-text-main font-bold rounded-lg text-sm hover:border-text-muted/50 transition-colors">
                            Downgrade to Basic
                        </button>
                    </div>

                    {/* Pro */}
                    <div className="p-8 rounded-2xl border border-border-light bg-surface-light opacity-60 hover:opacity-100 transition-opacity flex flex-col justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-text-main tracking-tight mb-2">Professional</h4>
                            <p className="text-3xl font-black font-mono text-text-main mb-6">$99<span className="text-sm text-text-muted font-sans">/mo</span></p>
                            <ul className="space-y-3 mb-8">
                                <li className="text-sm text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-text-muted/50 text-[18px]">check</span> Reduced 2.5% Escrow Fee</li>
                                <li className="text-sm text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-text-muted/50 text-[18px]">check</span> Up to 15 Active Contracts</li>
                                <li className="text-sm text-text-muted flex items-center gap-2"><span className="material-symbols-outlined text-text-muted/50 text-[18px]">check</span> Priority Email Support</li>
                            </ul>
                        </div>
                        <button className="w-full py-3 bg-background-light border border-border-light text-text-main font-bold rounded-lg text-sm hover:border-text-muted/50 transition-colors">
                            Downgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

export function BillingPaymentsView() {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-main">Billing & Payments</h2>
                    <p className="text-text-muted mt-1 text-sm">Manage, review, and control your funding sources and invoices.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add Payment Method
                </button>
            </div>

            <div className="space-y-8">
                {/* Payment Methods */}
                <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">credit_card</span>
                        Payment Methods
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Primary Card */}
                        <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-primary">credit_card</span>
                            </div>
                            <div className="relative z-10 text-primary">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-block">Primary</div>
                                    <span className="material-symbols-outlined hover:text-primary-dark cursor-pointer transition-colors">more_horiz</span>
                                </div>
                                <div className="text-sm font-bold tracking-widest mb-1">•••• •••• •••• 4242</div>
                                <div className="text-xs font-semibold opacity-80 uppercase">Amex Signature</div>
                            </div>
                        </div>

                        {/* Secondary Card */}
                        <div className="p-6 rounded-2xl border border-border-light bg-background-light relative overflow-hidden group hover:border-text-muted/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-text-muted">credit_card</span>
                            </div>
                            <div className="relative z-10 text-text-muted">
                                <div className="flex justify-end mb-6">
                                    <span className="material-symbols-outlined hover:text-text-main cursor-pointer transition-colors">more_horiz</span>
                                </div>
                                <div className="text-sm font-bold tracking-widest mb-1 text-text-main">•••• •••• •••• 1928</div>
                                <div className="text-xs font-semibold uppercase">Visa Business</div>
                            </div>
                        </div>

                        {/* Add New Placeholder */}
                        <div className="p-6 rounded-2xl border-2 border-dashed border-border-light bg-background-light/50 flex flex-col items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-colors cursor-pointer min-h-[140px]">
                            <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
                            <span className="text-sm font-bold">New Method</span>
                        </div>
                    </div>
                </div>

                {/* Billing History */}
                <div className="bg-surface-light border border-border-light rounded-2xl overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-border-light flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                            Billing History
                        </h3>
                        <button className="text-sm font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1">
                            Download All <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-light bg-background-light/50">
                                    <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider pl-6 sm:pl-8">Date</th>
                                    <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Description</th>
                                    <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Amount</th>
                                    <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right pr-6 sm:pr-8">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { date: 'Oct 12, 2024', desc: 'Enterprise Membership - Annual', amount: '$4,999.00', status: 'Paid' },
                                    { date: 'Sep 05, 2024', desc: 'Contract Escrow Funding (Project XYZ)', amount: '$12,500.00', status: 'Paid' },
                                    { date: 'Aug 21, 2024', desc: 'Additional Team Seats (x5)', amount: '$495.00', status: 'Paid' },
                                ].map((invoice, i) => (
                                    <tr key={i} className="border-b border-border-light/50 hover:bg-background-light/30 transition-colors group">
                                        <td className="p-4 text-sm text-text-main pl-6 sm:pl-8 font-medium">{invoice.date}</td>
                                        <td className="p-4 text-sm text-text-muted">{invoice.desc}</td>
                                        <td className="p-4 text-sm text-text-main font-mono font-medium">{invoice.amount}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded">
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right pr-6 sm:pr-8">
                                            <button className="text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                                                <span className="material-symbols-outlined text-[20px]">file_download</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';

export default function FinanceDashboardPage() {
    return (
        <div className="flex flex-col gap-8 max-w-[1600px] w-full mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1 w-full md:w-auto">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white">Earnings Overview</h2>
                    <p className="text-text-muted text-sm md:text-base font-light">Financial performance for current quarter</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export Report
                    </button>
                </div>
            </header>

            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* KPI Card 1 */}
                <div className="relative flex flex-col justify-between p-6 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                        <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 px-2 py-0.5 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +12%
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-black tracking-tight mb-1 text-text-main dark:text-white">$124,500</p>
                        <p className="text-text-muted text-xs">vs. last quarter</p>
                    </div>
                </div>

                {/* KPI Card 2 */}
                <div className="relative flex flex-col justify-between p-6 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Net Profit</p>
                        <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 px-2 py-0.5 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +8%
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-black tracking-tight mb-1 text-text-main dark:text-white">$98,200</p>
                        <p className="text-text-muted text-xs">vs. last quarter</p>
                    </div>
                </div>

                {/* KPI Card 3 */}
                <div className="relative flex flex-col justify-between p-6 rounded-xl bg-text-main dark:bg-[#2A2A2A] text-white shadow-lg shadow-text-main/10 group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Pending Invoices</p>
                        <span className="flex items-center text-red-400 bg-white/10 px-2 py-0.5 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-sm mr-0.5">trending_down</span> -2%
                        </span>
                    </div>
                    <div>
                        <p className="text-white text-3xl font-black tracking-tight mb-1">$12,450</p>
                        <p className="text-white/60 text-xs font-medium">Needs attention</p>
                    </div>
                </div>

                {/* KPI Card 4 */}
                <div className="relative flex flex-col justify-between p-6 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Avg Deal Size</p>
                        <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/10 px-2 py-0.5 rounded text-xs font-bold">
                            <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +5%
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-black tracking-tight mb-1 text-text-main dark:text-white">$4,800</p>
                        <p className="text-text-muted text-xs">vs. last quarter</p>
                    </div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
                {/* Large Chart */}
                <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 p-8 flex flex-col relative overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-text-main dark:text-white">Revenue Growth</h3>
                            <p className="text-text-muted text-sm mt-1">Detailed breakdown of income streams</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-text-main dark:text-white/70 text-xs font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition">1M</button>
                            <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition shadow-md shadow-primary/20">3M</button>
                            <button className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-text-main dark:text-white/70 text-xs font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition">1Y</button>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-full min-h-[300px] relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between text-xs text-text-muted/30 font-mono pointer-events-none">
                            <div className="w-full border-b border-gray-100 dark:border-white/5 h-0"></div>
                            <div className="w-full border-b border-gray-100 dark:border-white/5 h-0"></div>
                            <div className="w-full border-b border-gray-100 dark:border-white/5 h-0"></div>
                            <div className="w-full border-b border-gray-100 dark:border-white/5 h-0"></div>
                            <div className="w-full border-b border-gray-100 dark:border-white/5 h-0"></div>
                        </div>
                        {/* SVG Chart */}
                        <svg className="w-full h-full absolute inset-0 z-10" preserveAspectRatio="none" viewBox="0 0 1000 400">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#c9a326" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#c9a326" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,350 C100,340 150,250 250,280 C350,310 400,150 500,180 C600,210 650,100 750,120 C850,140 900,50 1000,80 V400 H0 Z" fill="url(#chartGradient)"></path>
                            <path d="M0,350 C100,340 150,250 250,280 C350,310 400,150 500,180 C600,210 650,100 750,120 C850,140 900,50 1000,80" fill="none" stroke="#c9a326" strokeWidth="3"></path>
                            {/* Interactive Dots */}
                            <circle cx="250" cy="280" fill="white" r="5" stroke="#c9a326" strokeWidth="2"></circle>
                            <circle cx="500" cy="180" fill="white" r="5" stroke="#c9a326" strokeWidth="2"></circle>
                            <circle className="animate-pulse" cx="750" cy="120" fill="#c9a326" r="6" stroke="white" strokeWidth="2"></circle>
                            {/* Tooltip */}
                            <g transform="translate(710, 50)">
                                <rect fill="#2d2926" height="36" rx="6" width="80" x="0" y="0"></rect>
                                <text fill="white" fontFamily="inherit" fontSize="12" fontWeight="bold" textAnchor="middle" x="40" y="22">$32,400</text>
                            </g>
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-text-muted font-medium uppercase tracking-wider px-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Side Stats / Transactions */}
                <div className="flex flex-col gap-6">
                    {/* Stat Box */}
                    <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 p-6 shadow-sm">
                        <h3 className="text-base font-bold mb-4 text-text-main dark:text-white">Top Clients</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100')" }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-text-main dark:text-white">Acme Corp</span>
                                        <span className="text-text-muted text-xs">Tech</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-text-main dark:text-white">$45,200</span>
                            </div>
                            <div className="h-px bg-gray-50 dark:bg-white/5 w-full"></div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100')" }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-text-main dark:text-white">Globex</span>
                                        <span className="text-text-muted text-xs">Retail</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-text-main dark:text-white">$28,100</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/5 flex-1 p-6 overflow-hidden flex flex-col shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-text-main dark:text-white">Recent</h3>
                            <button className="text-primary text-xs font-bold uppercase tracking-wider hover:text-primary-dark transition-colors">View All</button>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                            {[
                                { status: 'in', label: 'Payment Received', id: 'Inv-2024-001', amount: '+$4,200', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20', icon: 'arrow_downward' },
                                { status: 'out', label: 'Software Sub', id: 'Monthly', amount: '-$120', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20', icon: 'arrow_upward' },
                                { status: 'in', label: 'Payment Received', id: 'Inv-2024-003', amount: '+$2,800', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20', icon: 'arrow_downward' }
                            ].map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/20 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${tx.bg} ${tx.color}`}>
                                            <span className="material-symbols-outlined text-[18px]">{tx.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-main dark:text-white">{tx.label}</p>
                                            <p className="text-text-muted text-xs">{tx.id}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm ${tx.status === 'out' ? 'text-red-600 dark:text-red-400' : 'text-text-main dark:text-white'}`}>{tx.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Extra Details Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mt-4">
                <div className="rounded-xl bg-gray-50 dark:bg-[#2A2A2A] border border-gray-100 dark:border-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4 items-center">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-text-main dark:text-white">Quarterly Report</h4>
                            <p className="text-text-muted text-sm">Download the full financial breakdown.</p>
                        </div>
                    </div>
                    <button className="bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition whitespace-nowrap">Download PDF</button>
                </div>
                <div className="rounded-xl bg-linear-to-r from-primary/10 to-transparent border border-primary/20 p-6 flex items-center justify-between">
                    <div>
                        <h4 className="text-primary font-bold text-lg mb-1">Premium Plan</h4>
                        <p className="text-text-muted text-sm max-w-[250px]">You are using 80% of your current plan limits.</p>
                    </div>
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary-dark transition shadow-sm">Upgrade</button>
                </div>
            </div>
        </div>
    );
}

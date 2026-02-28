'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

// Mock analytics data
const PROFILE_VIEWS = [120, 145, 89, 210, 340, 280, 310, 420, 390, 510, 480, 620];
const PROPOSAL_DATA = { sent: 42, accepted: 28, rate: 66.7 };
const IMPRESSIONS_DATA = { total: 18420, change: '+12.4%' };
const CLIENT_RETENTION = { returning: 8, total: 12, rate: 66.7 };
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TOP_SKILLS = [
    { name: 'React / Next.js', impressions: 4200, conversions: 12 },
    { name: 'Node.js Architecture', impressions: 3100, conversions: 8 },
    { name: 'UI/UX Design', impressions: 2800, conversions: 6 },
    { name: 'DevOps & CI/CD', impressions: 1900, conversions: 3 },
];

const RECENT_ACTIVITY = [
    { type: 'view', text: 'Enterprise client viewed your profile', time: '2 hours ago' },
    { type: 'proposal', text: 'Your proposal for "Mobile App Redesign" was shortlisted', time: '5 hours ago' },
    { type: 'badge', text: 'You earned the "Top Rated" badge this month', time: '1 day ago' },
    { type: 'contract', text: 'Contract GIG-EX-2024-8901 milestone approved', time: '2 days ago' },
    { type: 'view', text: '3 new profile views from Fortune 500 companies', time: '3 days ago' },
];

function CircularGauge({ value, max, label, color = 'stroke-primary' }: { value: number, max: number, label: string, color?: string }) {
    const pct = (value / max) * 100;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (pct / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-border-light" />
                    <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className={color}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-text-main">{pct.toFixed(0)}%</span>
                </div>
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</span>
        </div>
    );
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('12m');

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full" style={{ paddingTop: 96 }}>
                {/* Executive Header */}
                <div className="border-b border-border-light bg-surface-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none" />
                    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Link href="/dashboard" className="text-text-muted hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    </Link>
                                    <span className="material-symbols-outlined text-primary text-3xl">monitoring</span>
                                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">Performance Analytics</h1>
                                </div>
                                <p className="text-text-muted mt-2 text-sm md:text-base max-w-xl pl-10">
                                    Deep visibility into your profile performance, conversion funnels, and client acquisition metrics.
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                {['30d', '90d', '12m'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === p
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-background-light text-text-muted border border-border-light hover:border-primary/50'
                                            }`}
                                    >
                                        {p === '30d' ? 'Last 30 Days' : p === '90d' ? 'Last 90 Days' : 'This Year'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-8">

                    {/* KPI Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total Impressions</p>
                            <p className="text-3xl font-black text-text-main">{IMPRESSIONS_DATA.total.toLocaleString()}</p>
                            <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                {IMPRESSIONS_DATA.change} vs last period
                            </p>
                        </div>
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Proposals Sent</p>
                            <p className="text-3xl font-black text-text-main">{PROPOSAL_DATA.sent}</p>
                            <p className="text-xs text-text-muted font-medium mt-2">{PROPOSAL_DATA.accepted} accepted</p>
                        </div>
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Acceptance Rate</p>
                            <p className="text-3xl font-black text-primary">{PROPOSAL_DATA.rate}%</p>
                            <div className="w-full bg-border-light rounded-full h-1.5 mt-3 overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${PROPOSAL_DATA.rate}%` }} />
                            </div>
                        </div>
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Repeat Clients</p>
                            <p className="text-3xl font-black text-text-main">{CLIENT_RETENTION.returning}/{CLIENT_RETENTION.total}</p>
                            <p className="text-xs text-text-muted font-medium mt-2">{CLIENT_RETENTION.rate}% retention rate</p>
                        </div>
                    </div>

                    {/* Profile Views Chart + Gauges */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        {/* Profile Views */}
                        <div className="lg:col-span-2 bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-text-main">Profile Views Over Time</h3>
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Monthly</span>
                            </div>
                            <div className="flex items-end gap-2 h-48">
                                {PROFILE_VIEWS.map((val, i) => {
                                    const max = Math.max(...PROFILE_VIEWS);
                                    const height = (val / max) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                {val}
                                            </span>
                                            <div
                                                className="w-full rounded-t-md transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/20"
                                                style={{
                                                    height: `${height}%`,
                                                    background: `linear-gradient(to top, rgba(200,157,40,0.8), rgba(200,157,40,0.3))`
                                                }}
                                            />
                                            <span className="text-[10px] text-text-muted font-medium">{MONTH_LABELS[i]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Circular Gauges */}
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-8">
                            <h3 className="text-lg font-bold text-text-main self-start">Conversion Funnels</h3>
                            <CircularGauge value={PROPOSAL_DATA.accepted} max={PROPOSAL_DATA.sent} label="Proposal Win Rate" color="stroke-primary" />
                            <CircularGauge value={CLIENT_RETENTION.returning} max={CLIENT_RETENTION.total} label="Client Retention" color="stroke-green-500" />
                        </div>
                    </div>

                    {/* Skill Performance + Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        {/* Top Skills */}
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-text-main mb-6">Skill Performance</h3>
                            <div className="space-y-5">
                                {TOP_SKILLS.map((skill, i) => {
                                    const maxImpressions = Math.max(...TOP_SKILLS.map(s => s.impressions));
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-text-main">{skill.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-text-muted font-medium">{skill.impressions.toLocaleString()} views</span>
                                                    <span className="text-xs font-bold text-primary">{skill.conversions} hired</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-border-light rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-1000"
                                                    style={{ width: `${(skill.impressions / maxImpressions) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="bg-surface-light border border-border-light rounded-2xl p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-text-main mb-6">Recent Activity</h3>
                            <div className="space-y-1">
                                {RECENT_ACTIVITY.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-background-light transition-colors">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.type === 'view' ? 'bg-blue-500/10 text-blue-500' :
                                                item.type === 'proposal' ? 'bg-primary/10 text-primary' :
                                                    item.type === 'badge' ? 'bg-yellow-500/10 text-yellow-600' :
                                                        'bg-green-500/10 text-green-600'
                                            }`}>
                                            <span className="material-symbols-outlined text-[18px]">
                                                {item.type === 'view' ? 'visibility' :
                                                    item.type === 'proposal' ? 'description' :
                                                        item.type === 'badge' ? 'workspace_premium' : 'task_alt'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-main leading-snug">{item.text}</p>
                                            <p className="text-xs text-text-muted mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

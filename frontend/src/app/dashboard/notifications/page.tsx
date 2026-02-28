'use client';

import { Navbar } from '@/components/Navbar';
import { useState } from 'react';
import Link from 'next/link';

type NotificationType = 'system' | 'message' | 'asset' | 'project' | 'maintenance';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    time: string;
    read: boolean;
    icon: string;
    iconBg: string;
    iconColor: string;
}

const NOTIFICATIONS: { label: string; items: Notification[] }[] = [
    {
        label: 'Today',
        items: [
            {
                id: '1',
                type: 'system',
                title: 'System Update V3.0',
                body: 'Your dashboard has been successfully updated. Review the changelog for new motion features.',
                time: '2 hours ago',
                read: false,
                icon: 'system_update',
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
            },
            {
                id: '2',
                type: 'message',
                title: 'Alex Morgan commented on Q4 Proposal',
                body: '"The minimalist approach here is exactly what we needed. Great work on the V1 monogram integration."',
                time: '4 hours ago',
                read: false,
                icon: 'chat_bubble',
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
            },
            {
                id: '3',
                type: 'asset',
                title: 'New Assets Available',
                body: 'Marketing team uploaded 4 new banners for the Q1 campaign.',
                time: '6 hours ago',
                read: false,
                icon: 'image',
                iconBg: 'bg-green-50',
                iconColor: 'text-green-600',
            },
        ],
    },
    {
        label: 'Yesterday',
        items: [
            {
                id: '4',
                type: 'project',
                title: 'Project "Alpha" Completed',
                body: 'The final deliverables have been sent to the client. Funds released from escrow.',
                time: '1 day ago',
                read: true,
                icon: 'task_alt',
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
            },
            {
                id: '5',
                type: 'maintenance',
                title: 'Server Maintenance',
                body: 'Scheduled maintenance completed successfully. All systems operational.',
                time: '1 day ago',
                read: true,
                icon: 'build',
                iconBg: 'bg-orange-50',
                iconColor: 'text-orange-600',
            },
        ],
    },
];

const FILTER_TABS = ['All', 'Unread', 'Messages', 'System', 'Projects'];

export default function NotificationsPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const unreadCount = notifications.flatMap(g => g.items).filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev =>
            prev.map(group => ({
                ...group,
                items: group.items.map(n => ({ ...n, read: true })),
            }))
        );
    };

    const filteredGroups = notifications
        .map(group => ({
            ...group,
            items: group.items.filter(n => {
                if (activeFilter === 'All') return true;
                if (activeFilter === 'Unread') return !n.read;
                if (activeFilter === 'Messages') return n.type === 'message';
                if (activeFilter === 'System') return n.type === 'system' || n.type === 'maintenance';
                if (activeFilter === 'Projects') return n.type === 'project';
                return true;
            }),
        }))
        .filter(g => g.items.length > 0);

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-12 py-16" style={{ paddingTop: 120 }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
                        <p className="text-sm text-text-muted mt-1">
                            You have <span className="font-bold text-primary">{unreadCount} unread</span> messages
                        </p>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="text-xs font-bold text-primary hover:underline transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeFilter === tab
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-surface-light border border-border-light text-text-muted hover:border-primary/30'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Notification Groups */}
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-surface-light text-text-muted flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </div>
                        <p className="text-text-muted font-medium">No notifications to show</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredGroups.map(group => (
                            <div key={group.label}>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 pl-2">{group.label}</p>
                                <div className="space-y-3">
                                    {group.items.map(n => (
                                        <div
                                            key={n.id}
                                            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${n.read
                                                    ? 'bg-surface-light border-border-light'
                                                    : 'bg-white border-primary/10 shadow-sm'
                                                }`}
                                        >
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${n.iconBg}`}>
                                                <span className={`material-symbols-outlined text-lg ${n.iconColor}`}>{n.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`text-sm font-bold truncate ${n.read ? 'text-text-muted' : 'text-text-main'}`}>
                                                        {n.title}
                                                    </h3>
                                                    {!n.read && (
                                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{n.body}</p>
                                            </div>
                                            <span className="text-[10px] font-medium text-text-muted whitespace-nowrap shrink-0 pt-1">{n.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Overview */}
                <div className="mt-12 grid grid-cols-3 gap-4">
                    <div className="bg-surface-light border border-border-light rounded-2xl p-5 text-center">
                        <p className="text-2xl font-black text-primary">12</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">This Week</p>
                    </div>
                    <div className="bg-surface-light border border-border-light rounded-2xl p-5 text-center">
                        <p className="text-2xl font-black text-text-main">47</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">This Month</p>
                    </div>
                    <div className="bg-surface-light border border-border-light rounded-2xl p-5 text-center">
                        <p className="text-2xl font-black text-green-600">98%</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Read Rate</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

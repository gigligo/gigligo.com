'use client';

import { Navbar } from '@/components/Navbar';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notificationApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

const FILTER_TABS = ['All', 'Unread', 'Messages', 'System', 'Projects'];

function groupNotifications(notifications: Notification[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { label: string; items: Notification[] }[] = [
        { label: 'Today', items: [] },
        { label: 'Yesterday', items: [] },
        { label: 'Older', items: [] }
    ];

    notifications.forEach(n => {
        const d = new Date(n.createdAt);
        if (d >= today) {
            groups[0].items.push(n);
        } else if (d >= yesterday) {
            groups[1].items.push(n);
        } else {
            groups[2].items.push(n);
        }
    });

    return groups.filter(g => g.items.length > 0);
}

function getIconForType(type: string) {
    const t = type.toLowerCase();
    if (t.includes('message')) return { icon: 'chat_bubble', bg: 'bg-primary/10', color: 'text-primary' };
    if (t.includes('order') || t.includes('project')) return { icon: 'task_alt', bg: 'bg-emerald-50', color: 'text-emerald-600' };
    if (t.includes('payment') || t.includes('wallet')) return { icon: 'payments', bg: 'bg-green-50', color: 'text-green-600' };
    if (t.includes('kyc') || t.includes('security')) return { icon: 'security', bg: 'bg-orange-50', color: 'text-orange-600' };
    return { icon: 'notifications', bg: 'bg-blue-50', color: 'text-blue-600' };
}

function formatTime(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function NotificationsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const token = (session as any)?.accessToken;

    const [activeFilter, setActiveFilter] = useState('All');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!token) return;
        try {
            const data = await notificationApi.getAll(token);
            setNotifications(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) loadData();
    }, [token, loadData]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllRead = async () => {
        if (!token) return;
        try {
            await notificationApi.markAllRead(token);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications marked as read');
        } catch (err: any) {
            toast.error('Failed to update notifications');
        }
    };

    const handleRead = async (id: string, link?: string) => {
        if (!token) return;
        try {
            await notificationApi.markRead(token, id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            if (link) {
                router.push(link);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = notifications.filter(n => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Unread') return !n.isRead;
        const t = n.type.toLowerCase();
        if (activeFilter === 'Messages') return t.includes('message');
        if (activeFilter === 'System') return t.includes('system') || t.includes('kyc') || t.includes('security');
        if (activeFilter === 'Projects') return t.includes('order') || t.includes('project');
        return true;
    });

    const grouped = groupNotifications(filtered);

    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased selection:bg-primary/30">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-12 py-16" style={{ paddingTop: 100 }}>
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-light border border-border-light hover:border-primary/50 text-text-muted hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </button>
                    <div className="flex-1 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
                            <p className="text-sm text-text-muted mt-1">
                                You have <span className="font-bold text-primary">{unreadCount} unread</span> messages
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-bold text-primary hover:underline transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
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
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : grouped.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-surface-light text-text-muted flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </div>
                        <p className="text-text-muted font-medium">No notifications to show</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {grouped.map(group => (
                            <div key={group.label}>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 pl-2">{group.label}</p>
                                <div className="space-y-3">
                                    {group.items.map(n => {
                                        const iconDef = getIconForType(n.type);
                                        return (
                                            <div
                                                key={n.id}
                                                onClick={() => handleRead(n.id, n.link)}
                                                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${n.isRead
                                                    ? 'bg-surface-light border-border-light hover:border-text-muted/20'
                                                    : 'bg-white border-primary/20 shadow-sm hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconDef.bg}`}>
                                                    <span className={`material-symbols-outlined text-lg ${iconDef.color}`}>{iconDef.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`text-sm font-bold truncate ${n.isRead ? 'text-text-muted' : 'text-text-main'}`}>
                                                            {n.title}
                                                        </h3>
                                                        {!n.isRead && (
                                                            <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{n.message}</p>
                                                </div>
                                                <span className="text-[10px] font-medium text-text-muted whitespace-nowrap shrink-0 pt-1">{formatTime(n.createdAt)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

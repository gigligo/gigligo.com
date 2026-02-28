'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Bell } from 'lucide-react';
import { notificationApi } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function NotificationBell() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const token = (session as any)?.accessToken;

    // Connect to WebSocket for real-time notifications
    useEffect(() => {
        if (!token) return;

        const socket = io(`${API_URL}/notifications`, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        socket.on('newNotification', (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        socket.on('connect_error', () => {
            // Fallback to polling if WebSocket fails
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token]);

    // Fetch unread count every 30s as fallback
    useEffect(() => {
        if (!token) return;
        const fetchCount = async () => {
            try {
                const data = await notificationApi.getUnreadCount(token);
                setUnreadCount(data.unreadCount || 0);
            } catch { /* silent */ }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [token]);

    // Fetch full list when dropdown opens
    useEffect(() => {
        if (!open || !token) return;
        (async () => {
            try {
                const data = await notificationApi.getAll(token, 1);
                setNotifications(data.items || []);
            } catch { /* silent */ }
        })();
    }, [open, token]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkAllRead = async () => {
        if (!token) return;
        try {
            await notificationApi.markAllRead(token);
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch { /* silent */ }
    };

    const handleNotificationClick = useCallback(async (n: Notification) => {
        if (!token) return;
        if (!n.isRead) {
            try {
                await notificationApi.markRead(token, n.id);
                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch { /* silent */ }
        }
        if (n.link) {
            setOpen(false);
            router.push(n.link);
        }
    }, [token, router]);

    const typeIcon: Record<string, string> = {
        APPLICATION_SUBMITTED: '📋',
        APPLICATION_HIRED: '🎉',
        APPLICATION_REJECTED: '❌',
        APPLICATION_SHORTLISTED: '⭐',
        NEW_MESSAGE: '💬',
        ORDER_UPDATE: '📦',
        PAYMENT_RECEIVED: '💰',
        LOW_CREDITS: '⚠️',
        SUBSCRIPTION_ACTIVATED: '🚀',
        KYC_APPROVED: '✅',
        KYC_REJECTED: '🚫',
        SYSTEM: '🔔',
    };

    if (!session) return null;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} className="text-slate-600 dark:text-offwhite/70" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold px-1 animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-medium text-orange hover:text-orange-light transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 dark:text-white/40 text-sm">
                                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`px-4 py-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${!n.isRead ? 'bg-orange/5 dark:bg-orange/10' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <span className="text-lg shrink-0 mt-0.5">{typeIcon[n.type] || '🔔'}</span>
                                        <div className="min-w-0">
                                            <p className={`text-sm leading-tight ${!n.isRead ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/60'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5 truncate">{n.message}</p>
                                            <p className="text-[10px] text-slate-300 dark:text-white/20 mt-1">
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-[#FE7743] shrink-0 mt-2" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

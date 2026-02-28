'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
// @ts-ignore
import { io, Socket } from 'socket.io-client';
import { chatApi } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function InboxContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const autoOpenId = searchParams?.get('c');

    const [socket, setSocket] = useState<Socket | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConv, setActiveConv] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isEmployer = (session as any)?.role === 'EMPLOYER' || (session as any)?.role === 'BUYER';
    const myId = (session as any)?.user?.id;
    const token = (session as any)?.accessToken;

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
        if (status === 'authenticated' && token) {
            loadConversations();
            initSocket();
        }
        return () => {
            if (socket) socket.disconnect();
        };

    }, [status, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initSocket = () => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || '', {
            auth: { token },
        });

        socketInstance.on('newMessage', (msg: any) => {
            setMessages((prev) => {
                if (prev.find(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
            loadConversations();
        });

        setSocket(socketInstance);
    };

    const loadConversations = async () => {
        try {
            const res: any = await chatApi.getConversations(token);
            setConversations(res.data || res);

            if (autoOpenId && !activeConv) {
                openConversation(autoOpenId);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openConversation = async (convId: string) => {
        try {
            const res: any = await chatApi.getConversation(token, convId);
            const convData = res.data || res;
            setActiveConv(convData);
            setMessages(convData.messages || []);

            if (socket) {
                if (activeConv) socket.emit('leaveConversation', activeConv.id);
                socket.emit('joinConversation', convId);
            }
        } catch (error) {
            console.error('Failed to load conversation details', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv || !socket) return;

        setSending(true);
        socket.emit('sendMessage', {
            conversationId: activeConv.id,
            content: newMessage.trim(),
        }, (response: any) => {
            if (response?.status === 'success') {
                setNewMessage('');
            }
            setSending(false);
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-background-light items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 font-display">
            {/* Top Navigation Bar */}
            <header className="flex shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-6 py-3 shadow-sm z-20">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 text-text-main dark:text-white">
                        <div className="size-6 text-primary">
                            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">GIGLIGO</h2>
                    </Link>
                    <div className="hidden md:flex relative w-64 h-10">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input className="block w-full h-full pl-10 pr-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors" placeholder="Search workspace..." type="text" />
                    </div>
                </div>
                <nav className="hidden lg:flex items-center gap-1">
                    <Link className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors" href="/dashboard">Dashboard</Link>
                    <Link className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors" href="/search">Talent</Link>
                    <Link className="px-4 py-2 text-sm font-medium text-text-main border-b-2 border-primary" href="/dashboard/inbox">Messages</Link>
                    <Link className="px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors" href="/dashboard/earnings">Wallet</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        {/* <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></span> */}
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-border-light dark:border-border-dark">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-text-main dark:text-white">{(session?.user as any)?.name?.split(' ')[0] || 'User'}</p>
                            <p className="text-xs text-primary font-medium">{isEmployer ? 'Enterprise Client' : 'Verified Pro'}</p>
                        </div>
                        <div className="size-9 rounded-full bg-cover bg-center border border-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOF5Bz-LIj2X6TE6aMSGX-x9vurtYB2XaxlCThLvGIxiRL2ms90cyFCh2rr-NtOiqmf2sff-Ck4ChOaC_5grOgTRpwtAGfWS1i7TTY-8zkXuS4-y-VRMm_sNOru_b0zgOsedacJyklXjXXdXa6ZOHTFDY8vwdlbqwKEB2OR7ulPz22XZJpN50PKME0oINLW80_fOtdjH9IyVqCMJlTffUClbh8O1BU_HvPVTZnIGrZ8Y33cYafGKMOT3h0yI9Om48ADNuptw_NzXU')" }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Contact List */}
                <aside className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shrink-0 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-text-main dark:text-white">Inbox</h3>
                            <div className="flex gap-2">
                                <button className="text-text-muted hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                </button>
                                <button className="text-text-muted hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                <span className="material-symbols-outlined text-[18px]">search</span>
                            </span>
                            <input className="w-full pl-9 pr-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded text-sm focus:outline-none focus:border-primary placeholder-text-muted transition-colors" placeholder="Filter conversations..." type="text" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-text-muted p-4 text-center">
                                <span className="material-symbols-outlined text-4xl mb-3 opacity-20">forum</span>
                                <p className="font-medium">No messages yet.</p>
                                <p className="text-sm mt-1">Start a conversation from a Gig or Job posting.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const otherUser = isEmployer ? conv.freelancer : conv.employer;
                                const contextLabel = conv.job?.title || conv.order?.gig?.title || 'Direct Message';
                                const lastMsg = conv.messages?.[0];
                                const isActive = activeConv?.id === conv.id;

                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() => openConversation(conv.id)}
                                        className={`group flex items-center gap-3 p-4 cursor-pointer transition-colors ${isActive ? 'bg-white dark:bg-surface-dark border-l-4 border-primary shadow-sm' : 'border-b border-border-light dark:border-border-dark hover:bg-white dark:hover:bg-surface-dark'}`}
                                    >
                                        <div className="relative shrink-0 flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                                            {otherUser?.profile?.fullName?.[0] || '?'}
                                            {isActive && (
                                                <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-text-main dark:text-white' : 'text-text-main dark:text-gray-200'}`}>{otherUser?.profile?.fullName || 'User'}</h4>
                                                <span className={`text-xs ${isActive ? 'font-medium text-primary' : 'text-text-muted'}`}>
                                                    {lastMsg ? format(new Date(lastMsg.createdAt), 'h:mm a') : ''}
                                                </span>
                                            </div>
                                            <p className={`text-xs text-primary/80 mb-0.5 truncate`}>{contextLabel}</p>
                                            <p className={`text-sm truncate ${isActive ? 'text-text-main dark:text-gray-300 font-medium' : 'text-text-muted'}`}>
                                                {lastMsg ? lastMsg.content : 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Right Pane: Message Window */}
                <section className={`flex flex-1 flex-col h-full bg-surface-light dark:bg-surface-dark relative ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
                    {activeConv ? (
                        <>
                            {/* Chat Header */}
                            <header className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark/95 backdrop-blur z-10">
                                <div className="flex items-center gap-4">
                                    <button className="md:hidden text-text-muted hover:text-primary transition-colors" onClick={() => setActiveConv(null)}>
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <div className="relative flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                                        {(isEmployer ? activeConv.freelancer?.profile?.fullName?.[0] : activeConv.employer?.profile?.fullName?.[0]) || '?'}
                                        <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-text-main dark:text-white">
                                                {isEmployer ? activeConv.freelancer?.profile?.fullName : activeConv.employer?.profile?.fullName}
                                            </h3>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                                Verified
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted">Local Time {format(new Date(), 'h:mm a')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center justify-center size-9 rounded text-text-muted hover:bg-background-light hover:text-primary transition-colors" title="Start Call">
                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                    </button>
                                    <button className="flex items-center justify-center size-9 rounded text-text-muted hover:bg-background-light hover:text-primary transition-colors" title="Video Call">
                                        <span className="material-symbols-outlined text-[20px]">videocam</span>
                                    </button>
                                    <div className="h-5 w-px bg-border-light dark:bg-border-dark mx-1"></div>
                                    <button className="flex items-center justify-center size-9 rounded text-text-muted hover:bg-background-light hover:text-primary transition-colors" title="More Options">
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>
                                </div>
                            </header>

                            {/* Chat Messages Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 bg-background-light dark:bg-background-dark/50" style={{ backgroundImage: "radial-gradient(#c89d280d 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
                                {messages.map((msg: any, idx) => {
                                    const isMe = msg.senderId === myId;
                                    const showTimestamp = idx === 0 || new Date(msg.createdAt).getTime() - new Date(messages[idx - 1].createdAt).getTime() > 1000 * 60 * 60;

                                    return (
                                        <div key={msg.id}>
                                            {showTimestamp && (
                                                <div className="flex justify-center mb-8">
                                                    <span className="px-3 py-1 text-xs font-medium text-text-muted bg-border-light/50 dark:bg-border-dark/50 rounded-full">
                                                        {format(new Date(msg.createdAt), 'MMMM d')}
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`flex flex-col gap-1 mb-6 max-w-[80%] lg:max-w-[60%] ${isMe ? 'items-end ml-auto' : 'items-start'}`}>
                                                <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                    {!isMe && (
                                                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold shrink-0 mb-1">
                                                            {(isEmployer ? activeConv.freelancer?.profile?.fullName?.[0] : activeConv.employer?.profile?.fullName?.[0]) || '?'}
                                                        </div>
                                                    )}

                                                    {isMe ? (
                                                        <div className="relative bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-4 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-sm overflow-hidden group">
                                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary"></div>
                                                            <p className="text-sm text-text-main dark:text-gray-200 leading-relaxed pr-3 whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm">
                                                            <p className="text-sm text-text-main dark:text-gray-200 leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`text-[10px] text-text-muted flex items-center gap-1 ${isMe ? '' : 'pl-12'}`}>
                                                    {format(new Date(msg.createdAt), 'h:mm a')}
                                                    {isMe && <span className="material-symbols-outlined text-[12px] text-primary">done_all</span>}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark shrink-0">
                                <form onSubmit={handleSendMessage} className="relative bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg shadow-inner focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-1 p-2 border-b border-border-light dark:border-border-dark bg-white/50 dark:bg-black/20 rounded-t-lg">
                                        <button type="button" className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Bold">
                                            <span className="material-symbols-outlined text-[18px]">format_bold</span>
                                        </button>
                                        <button type="button" className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Italic">
                                            <span className="material-symbols-outlined text-[18px]">format_italic</span>
                                        </button>
                                        <button type="button" className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="List">
                                            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                                        </button>
                                        <div className="h-4 w-px bg-border-light dark:bg-border-dark mx-1"></div>
                                        <button type="button" className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Attach File">
                                            <span className="material-symbols-outlined text-[18px]">attach_file</span>
                                        </button>
                                        <button type="button" className="p-1.5 text-text-muted hover:text-primary rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Insert Contract Clause">
                                            <span className="material-symbols-outlined text-[18px]">gavel</span>
                                        </button>
                                    </div>
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full bg-transparent border-none p-3 text-sm text-text-main dark:text-white placeholder-text-muted focus:ring-0 resize-none"
                                        placeholder="Type your message here... Use Shift + Enter for new line"
                                        rows={3}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    ></textarea>
                                    <div className="flex justify-between items-center p-2">
                                        <div className="text-xs text-text-muted px-2">Press Enter to send</div>
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-1.5 rounded text-sm font-semibold shadow-md transition-colors flex items-center gap-2"
                                        >
                                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Message <span className="material-symbols-outlined text-[16px]">send</span></>}
                                        </button>
                                    </div>
                                </form>
                                <div className="flex items-center justify-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px] text-green-600">lock</span>
                                        <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">End-to-End Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
                                        <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Escrow Secured</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">forum</span>
                            <h2 className="text-xl font-semibold mb-2 text-text-main dark:text-white">Your Messages</h2>
                            <p className="text-sm max-w-sm text-center">Select a conversation from the sidebar or start a new one.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default function InboxPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen bg-background-light"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
            <InboxContent />
        </Suspense>
    );
}

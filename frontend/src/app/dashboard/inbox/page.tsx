'use client';

import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
type Socket = any;
const io = (url: string, options: any) => {
    return {
        on: (event: string, cb: any) => { },
        emit: (event: string, data: any, cb?: any) => { if (cb) cb({ status: 'success' }) },
        disconnect: () => { }
    } as Socket;
};
import { chatApi } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';
import { Loader2, Zap, Bolt, Search, Plus, Settings, LayoutDashboard, MessageSquare, ClipboardList, Building2, Wallet as WalletIcon, Gavel, UserSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState, PageTransition } from '@/components/ui/TacticalUI';
import { TacticalSpinner } from '@/components/ui/TacticalSpinner';

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
            const data = res.data || res;
            setConversations(data);

            if (autoOpenId && !activeConv) {
                const target = data.find((c: any) => c.id === autoOpenId);
                if (target) openConversation(autoOpenId);
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

    const renderedConversations = useMemo(() => {
        if (conversations.length === 0) {
            return (
                <EmptyState
                    icon="sensors_off"
                    title="No Signals"
                    description="No active frequency detected. Initiate contact to begin tactical synchronization."
                />
            );
        }

        return conversations.map((conv) => {
            const otherUser = isEmployer ? conv.freelancer : conv.employer;
            const contextLabel = conv.job?.title || conv.order?.gig?.title || 'Tactical Comms';
            const lastMsg = conv.messages?.[0];
            const isActive = activeConv?.id === conv.id;

            return (
                <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => openConversation(conv.id)}
                    className={`group flex items-center gap-5 p-6 cursor-pointer transition-all duration-500 relative ${isActive ? 'bg-white/5 shadow-2xl overflow-hidden' : 'hover:bg-white/2'}`}
                >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,124,255,0.8)]" />}

                    <div className="relative shrink-0 flex items-center justify-center size-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-lg">
                        <span className="text-white font-black text-xl uppercase italic">{otherUser?.profile?.fullName?.[0] || '?'}</span>
                        {isActive && (
                            <div className="absolute bottom-1 right-1 size-3 bg-primary rounded-full border-2 border-background-dark shadow-sm"></div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-sm font-black uppercase tracking-tighter truncate text-white">{otherUser?.profile?.fullName || 'OPERATIVE'}</h4>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                                {lastMsg ? format(new Date(lastMsg.createdAt), 'HH:mm') : ''}
                            </span>
                        </div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2 truncate opacity-70 group-hover:opacity-100 transition-opacity italic">{contextLabel}</p>
                        <p className={`text-xs truncate ${isActive ? 'text-white font-bold italic' : 'text-white/40 font-medium italic'}`}>
                            {lastMsg ? lastMsg.content : 'Standing by for transmission...'}
                        </p>
                    </div>
                </motion.div>
            );
        });
    }, [conversations, activeConv?.id, isEmployer]);

    const renderedMessages = useMemo(() => {
        return messages.map((msg: any, idx) => {
            const isMe = msg.senderId === myId;
            const showTimestamp = idx === 0 || new Date(msg.createdAt).getTime() - new Date(messages[idx - 1].createdAt).getTime() > 1000 * 60 * 60;

            return (
                <div key={msg.id} className="mb-8">
                    {showTimestamp && (
                        <div className="flex justify-center mb-12">
                            <span className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 bg-white/5 border border-white/10 rounded-full italic backdrop-blur-3xl">
                                Protocol Log: {format(new Date(msg.createdAt), 'MMM dd, yyyy')}
                            </span>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex flex-col gap-3 max-w-[85%] lg:max-w-[70%] ${isMe ? 'items-end ml-auto' : 'items-start'}`}
                    >
                        <div className={`flex items-end gap-5 ${isMe ? 'flex-row-reverse' : ''}`}>
                            {!isMe && (
                                <div className="flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 text-primary font-black text-xs shrink-0 mb-1 uppercase italic shadow-lg">
                                    {(isEmployer ? activeConv?.freelancer?.profile?.fullName?.[0] : activeConv?.employer?.profile?.fullName?.[0]) || '?'}
                                </div>
                            )}

                            <div className={`relative px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-3xl border transition-all duration-500 ${isMe
                                ? 'bg-primary/95 text-white border-primary/50 rounded-tr-none'
                                : 'bg-white/5 text-white border-white/10 rounded-tl-none hover:bg-white/8'}`}>
                                <p className="text-sm font-bold italic leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                                {isMe && (
                                    <div className="absolute top-0 right-0 w-0.5 h-full bg-white/20" />
                                )}
                            </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2 ${isMe ? '' : 'pl-12'}`}>
                            {format(new Date(msg.createdAt), 'HH:mm')}
                            {isMe && <span className="material-symbols-outlined text-[10px] text-white/50">check_circle</span>}
                        </span>
                    </motion.div>
                </div>
            );
        });
    }, [messages, myId, isEmployer, activeConv]);

    if (loading) {
        return (
            <div className="flex h-screen bg-background-dark items-center justify-center">
                <TacticalSpinner label="Synchronizing Comms..." />
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-white font-sans selection:bg-primary/30 antialiased">
                {/* Mission Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-3xl px-10 py-6 z-20">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-4 text-white group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-all duration-500">
                                <span className="material-symbols-outlined text-white text-xl font-black">bolt</span>
                            </div>
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">GIGLIGO. <span className="text-[10px] not-italic text-primary ml-2 tracking-[0.5em] align-middle">COMMS</span></h2>
                        </Link>
                        <div className="hidden lg:flex items-center gap-2">
                            <Link href="/dashboard" className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">Overview</Link>
                            <Link href="/dashboard/inbox" className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/10 rounded-full border border-primary/20">Frequency</Link>
                            <Link href="/search" className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">Intel Scan</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="items-center gap-4 text-right hidden sm:flex">
                            <div className="flex flex-col">
                                <p className="text-xs font-black text-white uppercase tracking-tighter italic">{(session?.user as any)?.name || 'OPERATIVE'}</p>
                                <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em]">{isEmployer ? 'COMMANDER' : 'ELITE AGENT'}</p>
                            </div>
                            <div className="size-12 rounded-xl bg-white/5 border border-white/10 p-1">
                                <div className="w-full h-full bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${(session?.user as any)?.email}&backgroundColor=040300')` }}></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tactical Grid */}
                <main className="flex flex-1 overflow-hidden">
                    {/* Left Operative List */}
                    <aside className={`w-full md:w-[350px] lg:w-[450px] flex flex-col border-r border-white/5 bg-black/20 shrink-0 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-10 border-b border-white/5 bg-black/40">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Comms <span className="text-primary not-italic">Log.</span></h3>
                                <div className="flex gap-4">
                                    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all"><span className="material-symbols-outlined font-light text-xl">filter_list</span></button>
                                    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all"><span className="material-symbols-outlined font-light text-xl">edit_square</span></button>
                                </div>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/20">
                                    <span className="material-symbols-outlined text-xl">manage_search</span>
                                </span>
                                <input className="w-full pl-16 pr-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-primary/50 focus:bg-white/8 placeholder:text-white/10 transition-all italic text-white" placeholder="SCAN FREQUENCIES..." type="text" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
                            {renderedConversations}
                        </div>
                    </aside>

                    {/* Right Interactive Termimal */}
                    <section className={`flex flex-1 flex-col h-full bg-background-dark relative ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,124,255,0.05)_0%,transparent_50%)] pointer-events-none" />

                        {activeConv ? (
                            <>
                                {/* Mission Participant Header */}
                                <header className="flex shrink-0 items-center justify-between px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl z-10">
                                    <div className="flex items-center gap-6">
                                        <button className="md:hidden w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40" onClick={() => setActiveConv(null)}>
                                            <span className="material-symbols-outlined">arrow_back</span>
                                        </button>
                                        <div className="relative flex items-center justify-center size-14 rounded-2xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden shadow-black">
                                            <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${isEmployer ? activeConv.freelancer?.profile?.fullName : activeConv.employer?.profile?.fullName}&backgroundColor=007CFF')` }}></div>
                                            <div className="absolute bottom-1 right-1 size-3 bg-emerald-500 rounded-full border-2 border-black"></div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-1">
                                                <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">
                                                    {isEmployer ? activeConv.freelancer?.profile?.fullName : activeConv.employer?.profile?.fullName}
                                                </h3>
                                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[10px] font-black">verified</span> VERIFIED
                                                </span>
                                            </div>
                                            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.5em] italic">Operational Status: ACTIVE • GMT {format(new Date(), 'HH:mm')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 hover:text-white transition-all border border-white/5"><span className="material-symbols-outlined font-light">call</span></button>
                                        <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 hover:text-white transition-all border border-white/5"><span className="material-symbols-outlined font-light">videocam</span></button>
                                        <div className="h-8 w-px bg-white/5 mx-2"></div>
                                        <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 hover:text-white transition-all border border-white/5"><span className="material-symbols-outlined font-light">more_vert</span></button>
                                    </div>
                                </header>

                                {/* Data Stream Area */}
                                <div className="flex-1 overflow-y-auto px-12 py-12 scrollbar-hide">
                                    <div className="max-w-4xl mx-auto">
                                        {renderedMessages}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Tactical Input Unit */}
                                <div className="px-12 py-10 bg-black/40 border-t border-white/5 shrink-0 backdrop-blur-3xl">
                                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                                        <div className="absolute -inset-1 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 rounded-4xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />

                                        <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black focus-within:border-primary/50 transition-all duration-700">
                                            {/* Action Bar */}
                                            <div className="flex items-center gap-2 p-3 bg-white/2 border-b border-white/5">
                                                <button type="button" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-primary transition-all hover:bg-primary/10"><span className="material-symbols-outlined text-xl">attach_file</span></button>
                                                <button type="button" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-primary transition-all hover:bg-primary/10"><span className="material-symbols-outlined text-xl">image</span></button>
                                                <div className="h-6 w-px bg-white/5 mx-2" />
                                                <button type="button" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-primary transition-all hover:bg-primary/10"><span className="material-symbols-outlined text-xl">format_bold</span></button>
                                                <button type="button" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-primary transition-all hover:bg-primary/10"><span className="material-symbols-outlined text-xl">gavel</span></button>
                                            </div>

                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="w-full bg-transparent border-none p-8 text-sm text-white placeholder:text-white/10 focus:ring-0 resize-none font-bold italic leading-relaxed min-h-[140px]"
                                                placeholder="TRANSMIT TACTICAL DIRECTIVE..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage(e);
                                                    }
                                                }}
                                            />

                                            <div className="flex justify-between items-center p-6 bg-white/1">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Encrypted Channel Stable</span>
                                                </div>
                                                <motion.button
                                                    type="submit"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={!newMessage.trim() || sending}
                                                    className="bg-primary text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/40 flex items-center gap-4 hover:bg-primary-dark transition-all disabled:opacity-50 italic"
                                                >
                                                    {sending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <>TRANSMIT <span className="material-symbols-outlined text-sm">send</span></>}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-8 flex justify-center gap-10">
                                        <div className="flex items-center gap-3 text-white/20">
                                            <span className="material-symbols-outlined text-sm font-light">shield_lock</span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">SECURE COMMS PROTOCOL v4.2</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-white/10 p-24 text-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="relative mb-12"
                                >
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                                    <span className="material-symbols-outlined text-[10rem] font-thin relative z-10">radar</span>
                                </motion.div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-white/30">Intelligence <span className="text-primary/40 not-italic">Scanning.</span></h2>
                                <p className="text-[10px] max-w-sm font-black uppercase tracking-[0.5em] leading-relaxed">System operational. Awaiting incoming tactical frequency modulation.</p>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </PageTransition>
    );
}

export default function InboxPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen bg-background-dark"><TacticalSpinner label="Calibrating Frequency..." /></div>}>
            <InboxContent />
        </Suspense>
    );
}

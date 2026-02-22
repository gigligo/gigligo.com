'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, Loader2, ArrowLeft, MoreVertical, Search, MessageSquare } from 'lucide-react';
import { chatApi } from '@/lib/api';
import { format } from 'date-fns';

function InboxContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Auto-open conversation if passed via URL
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

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initSocket = () => {
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
            auth: { token },
        });

        socketInstance.on('connect', () => {
            console.log('Connected to Chat Server');
        });

        socketInstance.on('newMessage', (msg) => {
            setMessages((prev) => {
                // Prevent duplicates
                if (prev.find(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
            // Also update the sidebar preview
            loadConversations(); // lazy refresh, could be optimized
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

            // Join socket room
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
        // Let the socket handle it instead of a POST request for real-time speed
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
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="w-10 h-10 animate-spin text-[#FE7743]" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-80px)] bg-[#0A0A0A] overflow-hidden rounded-tr-2xl">
            {/* Context Sidebar */}
            <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-white/5 flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-white/5 sticky top-0 bg-[#0A0A0A] z-10">
                    <h1 className="text-2xl font-bold text-white mb-4">Inbox</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FE7743]/50 transition-colors"
                        />
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/40 p-4 text-center">
                            <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                            <p>No messages yet.</p>
                            <p className="text-sm mt-1">When you connect with a client or freelancer, your conversations will appear here.</p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const otherUser = isEmployer ? conv.freelancer : conv.employer;
                            const contextLabel = conv.job?.title || conv.order?.gig?.title || 'Direct Message';
                            const lastMsg = conv.messages?.[0];
                            const isActive = activeConv?.id === conv.id;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => openConversation(conv.id)}
                                    className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/5 flex items-start gap-3
                                        ${isActive ? 'bg-white/5 border-l-2 border-l-[#FE7743]' : ''}
                                    `}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#FE7743]/20 flex items-center justify-center shrink-0 border border-[#FE7743]/20 text-[#FE7743] font-bold">
                                        {otherUser?.profile?.fullName?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-semibold text-white truncate pr-2">{otherUser?.profile?.fullName || 'User'}</h3>
                                            <span className="text-xs text-white/40 shrink-0">
                                                {lastMsg ? format(new Date(lastMsg.createdAt), 'MMM d') : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#FE7743]/80 mb-1 truncate">{contextLabel}</p>
                                        <p className="text-sm text-white/60 truncate">
                                            {lastMsg ? lastMsg.content : 'No messages yet'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-[#111]/50 ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
                {activeConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[73px] border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0A] shrink-0 pb-1">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden text-white/60" onClick={() => setActiveConv(null)}>
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="font-bold text-white text-lg">
                                        {isEmployer ? activeConv.freelancer?.profile?.fullName : activeConv.employer?.profile?.fullName}
                                    </h2>
                                    <p className="text-xs text-white/40 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button className="text-white/40 hover:text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg: any, idx) => {
                                const isMe = msg.senderId === myId;
                                const showTimestamp = idx === 0 || new Date(msg.createdAt).getTime() - new Date(messages[idx - 1].createdAt).getTime() > 1000 * 60 * 60;

                                return (
                                    <div key={msg.id} className="flex flex-col">
                                        {showTimestamp && (
                                            <div className="flex justify-center mb-4 mt-2">
                                                <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
                                                    {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] ${isMe ? 'self-end bg-[#FE7743] text-white' : 'self-start bg-white/5 text-white/90 border border-white/5'} rounded-2xl px-5 py-3 shadow-lg relative group`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                                            <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 ${isMe ? 'right-full mr-2 text-white/40' : 'left-full ml-2 text-white/40'} whitespace-nowrap`}>
                                                {format(new Date(msg.createdAt), 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-[#0A0A0A] border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto relative">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Write your message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-[#FE7743]/50 transition-colors resize-none placeholder-white/30"
                                    rows={1}
                                    style={{ minHeight: '52px', maxHeight: '150px' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="w-[52px] h-[52px] shrink-0 bg-[#FE7743] hover:bg-[#e66a3a] text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(254,119,67,0.3)] disabled:shadow-none"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-white/30">Press Enter to send, Shift + Enter for new line</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/40">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
                        <p className="text-sm max-w-sm text-center">Select a conversation from the sidebar or start a new one from a Job or Gig page to begin chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function InboxPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-80px)] bg-[#0A0A0A]"><Loader2 className="w-10 h-10 animate-spin text-[#FE7743]" /></div>}>
            <InboxContent />
        </Suspense>
    );
}

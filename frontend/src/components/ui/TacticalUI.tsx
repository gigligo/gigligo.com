'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon | string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white/2 border border-dashed border-white/10 rounded-[3rem] relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,124,255,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-700 border border-white/5 group-hover:border-primary/30">
                {typeof Icon === 'string' ? (
                    <span className="material-symbols-outlined text-5xl text-white/10 group-hover:text-primary transition-colors">{Icon}</span>
                ) : (
                    <Icon className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors" strokeWidth={1} />
                )}
            </div>

            <div className="relative z-10 space-y-4 max-w-md">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
                <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed italic">{description}</p>
            </div>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-12 px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 italic active:scale-95"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}

export function TacticalSkeleton({ className }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden bg-white/5 rounded-2xl ${className}`}>
            <motion.div
                animate={{
                    x: ['-100%', '100%']
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent shadow-[0_0_40px_rgba(255,255,255,0.02)]"
            />
        </div>
    );
}

export function PageTransition({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}

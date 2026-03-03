'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon = 'sensors_off',
    title,
    subtitle,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col items-center justify-center text-center py-32 px-12 bg-white/1 border border-white/5 rounded-[3rem] relative overflow-hidden ${className}`}
        >
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,124,255,0.03)_0%,transparent_60%)] pointer-events-none" />

            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mb-10"
            >
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[60px]" />
                <span className="material-symbols-outlined text-[7rem] text-white/6 font-thin relative z-10">
                    {icon}
                </span>
            </motion.div>

            <h3 className="text-sm font-black text-white/25 uppercase tracking-[0.5em] italic mb-4 relative z-10">
                {title}
            </h3>

            {subtitle && (
                <p className="text-xs font-bold italic text-white/15 max-w-md leading-relaxed relative z-10">
                    {subtitle}
                </p>
            )}

            {action && (
                <div className="mt-10 relative z-10">
                    {action}
                </div>
            )}
        </motion.div>
    );
}

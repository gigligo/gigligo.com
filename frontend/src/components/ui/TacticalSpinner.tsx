'use client';

import { motion } from 'framer-motion';

interface TacticalSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    className?: string;
}

const sizes = {
    sm: { ring: 'w-8 h-8 border-2', icon: 'text-lg', label: 'text-[8px]' },
    md: { ring: 'w-14 h-14 border-[3px]', icon: 'text-2xl', label: 'text-[9px]' },
    lg: { ring: 'w-20 h-20 border-4', icon: 'text-4xl', label: 'text-[10px]' },
};

export function TacticalSpinner({ size = 'md', label = 'Synchronizing...', className = '' }: TacticalSpinnerProps) {
    const s = sizes[size];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center gap-6 ${className}`}
        >
            <div className="relative">
                {/* Outer glow */}
                <div className={`absolute inset-0 ${s.ring} rounded-full border-primary/30 blur-md`} />

                {/* Spinning ring */}
                <div className={`${s.ring} rounded-full border-white/5 border-t-primary border-r-primary/40 animate-spin shadow-[0_0_20px_rgba(0,124,255,0.3)]`} />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`material-symbols-outlined ${s.icon} text-primary/60 font-light animate-pulse`}>radar</span>
                </div>
            </div>

            {label && (
                <p className={`${s.label} font-black uppercase tracking-[0.5em] text-white/20 italic animate-pulse`}>
                    {label}
                </p>
            )}
        </motion.div>
    );
}

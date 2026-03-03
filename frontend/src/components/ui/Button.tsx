'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] italic rounded-2xl transition-all duration-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark shadow-2xl shadow-primary/30 border border-primary/50',
        secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
        ghost: 'bg-transparent text-white/40 hover:text-white hover:bg-white/5',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-2xl shadow-red-500/20 border border-red-500/50',
    };

    const sizeMap = {
        sm: 'px-6 py-3 text-[9px]',
        md: 'px-10 py-4 text-[10px]',
        lg: 'px-14 py-5 text-[11px]',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`${base} ${variants[variant]} ${sizeMap[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || loading}
            {...(props as any)}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </motion.button>
    );
}

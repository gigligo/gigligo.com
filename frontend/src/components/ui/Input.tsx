'use client';

import React, { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

export function Input({
    label,
    icon,
    error,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors duration-500">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full bg-black/40 border border-white/5 rounded-2xl ${icon ? 'pl-16' : 'px-8'} py-5 text-sm font-bold italic text-white placeholder:text-white/10 focus:border-primary/50 focus:outline-none focus:bg-white/3 transition-all duration-500 ${error ? 'border-red-500/50' : ''} ${className}`}
                    {...props}
                />
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 blur-xl" />
            </div>
            {error && (
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400 italic flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">error</span>
                    {error}
                </p>
            )}
        </div>
    );
}

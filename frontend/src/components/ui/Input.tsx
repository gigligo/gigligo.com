import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
            <input
                className={`px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border rounded-md outline-none focus:ring-2 focus:ring-primary transition-all ${error ? 'border-accent focus:ring-accent' : 'border-slate-300 dark:border-slate-700'
                    }`}
                {...props}
            />
            {error && <span className="text-xs text-accent mt-1">{error}</span>}
        </div>
    );
}

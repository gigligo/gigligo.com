import React from 'react';

export function Logo({
    className = "h-8",
    iconClassName = "text-primary",
    textClassName = "text-slate-900 dark:text-white",
    withText = true
}: {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    withText?: boolean;
}) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-full w-auto ${iconClassName}`}>
                <path d="M20 2.5L37.5 20L20 37.5L2.5 20L20 2.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter" />
                <path d="M12.5 20L20 12.5L27.5 20L20 27.5L12.5 20Z" fill="currentColor" />
            </svg>
            {withText && <span className={`font-bold tracking-tight ${textClassName}`}>GIGLIGO</span>}
        </div>
    );
}

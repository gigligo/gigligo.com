'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-surface-light rounded-2xl border border-border-light p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-200">
                    <span className="material-symbols-outlined text-3xl">warning</span>
                </div>
                <h2 className="text-xl font-bold text-text-main mb-2">Something went wrong</h2>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2.5 bg-background-light border border-border-light text-text-main font-bold rounded-xl text-sm hover:border-primary/50 transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

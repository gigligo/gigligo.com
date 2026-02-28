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
        <div className="min-h-screen bg-[#000] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#111] rounded-2xl border border-white/10 p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-[#EFEEEA] mb-2">Something went wrong</h2>
                <p className="text-sm text-[#EFEEEA]/50 mb-6">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2.5 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 text-[#EFEEEA] font-semibold rounded-xl text-sm hover:bg-white/10 transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

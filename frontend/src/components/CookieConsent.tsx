'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('gigligo_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('gigligo_cookie_consent', 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem('gigligo_cookie_consent', 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-100 p-4 sm:p-6 animate-fade-in">
            <div className="max-w-4xl mx-auto bg-nav-bg border border-[#C9A227]/20 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">🍪 We value your privacy</p>
                    <p className="text-white/60 text-xs leading-relaxed">
                        We use cookies to enhance your experience, analyze traffic, and personalize content.
                        Read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for more details.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button onClick={decline} className="px-5 py-2.5 text-white/60 text-xs font-bold rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                        Decline
                    </button>
                    <button onClick={accept} className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}

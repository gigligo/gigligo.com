'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroLottie({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let anim: any = null;
        let onScroll: (() => void) | null = null;

        // @ts-ignore
        import('lottie-web').then((mod) => {
            const lottie = mod.default || mod;
            if (!containerRef.current) return;

            anim = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: '/handshake-contract.json',
            });

            onScroll = () => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    anim.play();
                }
            };

            window.addEventListener('scroll', onScroll);
            onScroll();
        });

        return () => {
            if (onScroll) window.removeEventListener('scroll', onScroll);
            if (anim) anim.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className || 'w-full max-w-lg mx-auto'}
            style={{ minHeight: 300 }}
        />
    );
}

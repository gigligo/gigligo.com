'use client';

import React, { useEffect, useRef } from 'react';

export default function GraduatesLottie({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let anim: any = null;

        // @ts-ignore
        import('lottie-web').then((mod) => {
            const lottie = mod.default || mod;
            if (!containerRef.current) return;

            anim = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/graduates-scroll.json',
            });
        });

        return () => {
            if (anim) anim.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className || 'w-full max-w-5xl mx-auto'}
            style={{ minHeight: 300 }}
        />
    );
}

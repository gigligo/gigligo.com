'use client';

import React, { useEffect, useRef } from 'react';

export default function GraduatesLottie({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animation: any = null;

        // @ts-ignore: Bypass local typescript warnings since lottie-web was forcefully injected
        import('lottie-web').then((lottieModule) => {
            // Handle both ESModule default exports and direct exports
            const lottie = lottieModule.default || lottieModule;

            if (containerRef.current) {
                animation = lottie.loadAnimation({
                    container: containerRef.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: '/graduates-scroll.json',
                });
            }
        });

        return () => {
            if (animation) {
                animation.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} className={className || "w-full max-w-5xl mx-auto"} />;
}

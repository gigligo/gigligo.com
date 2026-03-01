'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroLottie({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animation: any = null;

        // Dynamically import lottie-web on the client side only
        import('lottie-web').then((lottieModule) => {
            const lottie = lottieModule.default;

            if (containerRef.current) {
                animation = lottie.loadAnimation({
                    container: containerRef.current,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: '/handshake-contract.json',
                });

                const handleScroll = () => {
                    if (!containerRef.current) return;
                    const position = containerRef.current.getBoundingClientRect().top;
                    const screenHeight = window.innerHeight;

                    if (position < screenHeight - 100) {
                        animation.play();
                    }
                };

                window.addEventListener('scroll', handleScroll);

                // Check once on mount
                handleScroll();

                return () => {
                    window.removeEventListener('scroll', handleScroll);
                    animation.destroy();
                };
            }
        });

        return () => {
            if (animation) {
                animation.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} className={className || "w-full max-w-lg mx-auto h-[400px]"} />;
}

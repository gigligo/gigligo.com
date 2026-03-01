'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollScaleImageProps {
    src: string;
    alt: string;
    className?: string;
    startScale?: number;
}

export function ScrollScaleImage({
    src,
    alt,
    className = '',
    startScale = 0.85
}: ScrollScaleImageProps) {
    const ref = useRef(null);

    // Track scroll progress purely over this specific remote element.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'] // Starts when top of image hits bottom of screen. Ends when bottom hits top.
    });

    // Scale from `startScale` to 1 as it reaches the center, 
    // then scales back down slightly as it leaves viewport for 3D depth
    const rawScale = useTransform(scrollYProgress, [0, 0.4, 1], [startScale, 1, 0.95]);
    const smoothScale = useSpring(rawScale, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const rawOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0.5]);

    return (
        <div ref={ref} className={`relative flex items-center justify-center w-full ${className}`}>
            <motion.div
                style={{ scale: smoothScale, opacity: rawOpacity }}
                className="w-full h-full relative"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl"
                />
            </motion.div>
        </div>
    );
}

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    xOffset?: number;
    scale?: number;
    once?: boolean;
    blur?: boolean;
}

export function ScrollReveal({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    yOffset = 40,
    xOffset = 0,
    scale = 1,
    once = true,
    blur = false,
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-10% 0px' });

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                y: yOffset,
                x: xOffset,
                scale,
                filter: blur ? 'blur(10px)' : 'blur(0px)'
            }}
            animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : yOffset,
                x: isInView ? 0 : xOffset,
                scale: isInView ? 1 : scale,
                filter: isInView ? 'blur(0px)' : (blur ? 'blur(10px)' : 'blur(0px)'),
            }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxItemProps {
    children: React.ReactNode;
    className?: string;
    offset?: number; // Distance string integer (e.g. 50 moves Y from -50 to +50 based on scroll)
}

export function ParallaxItem({ children, className = '', offset = 50 }: ParallaxItemProps) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Transform scroll progress (0 to 1) into Y offset (+offset to -offset)
    const roughY = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

    // Add a spring to smooth out the parallax effect against rapid scroll stops
    const smoothY = useSpring(roughY, {
        damping: 25,
        stiffness: 150,
        mass: 0.5,
    });

    return (
        <div ref={ref} className={className}>
            <motion.div style={{ y: smoothY }} className="w-full h-full">
                {children}
            </motion.div>
        </div>
    );
}

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export function Reveal({
    children,
    width = '100%',
    delay = 0,
    className = '',
    direction = 'up',
}: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px 0px' });

    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { y: 40, opacity: 0 };
            case 'down': return { y: -40, opacity: 0 };
            case 'left': return { x: -40, opacity: 0 };
            case 'right': return { x: 40, opacity: 0 };
        }
    };

    return (
        <div ref={ref} style={{ width }} className={className}>
            <motion.div
                variants={{
                    hidden: getInitialPosition(),
                    visible: { opacity: 1, y: 0, x: 0 },
                }}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{
                    duration: 0.8,
                    delay: delay,
                    ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth cubic bezier matching Framer
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </div>
    );
}

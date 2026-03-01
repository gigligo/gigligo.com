'use client';

import { motion } from 'framer-motion';

interface TextHighlightProps {
    children: React.ReactNode;
    delay?: number;
    highlightColor?: string;
}

export function TextHighlight({
    children,
    delay = 0.2,
    highlightColor = '#D4F252' // qazqaz reference lime green
}: TextHighlightProps) {
    return (
        <span className="relative inline-block whitespace-nowrap px-1 z-10 transition-colors duration-500">
            <motion.span
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{
                    duration: 0.8,
                    delay: delay,
                    ease: 'circOut'
                }}
                className="absolute bottom-1 left-0 h-[40%] md:h-[50%] z-[-1] rounded-sm opacity-80"
                style={{ backgroundColor: highlightColor }}
            />
            {children}
        </span>
    );
}

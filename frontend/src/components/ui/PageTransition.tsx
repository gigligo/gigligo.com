'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
}

export function PageTransition({ children, className = '', ...rest }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
}

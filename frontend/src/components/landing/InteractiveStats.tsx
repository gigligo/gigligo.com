'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function useAnimatedCounter(value: number) {
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001
    });

    const displayValue = useTransform(springValue, (current) =>
        Math.round(current).toLocaleString()
    );

    useEffect(() => {
        if (inView && !hasAnimated) {
            springValue.set(value);
            setHasAnimated(true);
        }
    }, [inView, value, springValue, hasAnimated]);

    return { ref, displayValue };
}

interface AnimatedCounterProps {
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    delay?: number;
}

export function AnimatedCounter({ value, label, suffix = "", prefix = "", delay = 0 }: AnimatedCounterProps) {
    const { ref, displayValue } = useAnimatedCounter(value);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
            <div className="text-4xl sm:text-5xl font-bold text-text-main tracking-tight mb-2 flex items-baseline justify-center">
                {prefix && <span className="text-2xl text-text-muted mr-1">{prefix}</span>}
                <motion.span ref={ref}>{displayValue}</motion.span>
                {suffix && <span className="text-primary ml-0.5">{suffix}</span>}
            </div>
            <p className="text-sm font-medium text-text-muted">{label}</p>
        </motion.div>
    );
}

export function InteractiveStats() {
    return (
        <section className="py-16 bg-[#FAFBFD] border-y border-gray-100 relative overflow-hidden">
            <div className="container px-6 md:px-10 max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl font-bold tracking-tight text-text-main mb-4"
                    >
                        Built for scale.{' '}
                        <span className="text-text-muted">Trusted globally.</span>
                    </motion.h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    <AnimatedCounter value={500} suffix="K+" label="Projects Completed" delay={0.1} />
                    <AnimatedCounter value={98} suffix="%" label="Client Satisfaction" delay={0.2} />
                    <AnimatedCounter value={2} suffix="M+" label="Freelancers Available" delay={0.3} />
                </div>
            </div>
        </section>
    );
}

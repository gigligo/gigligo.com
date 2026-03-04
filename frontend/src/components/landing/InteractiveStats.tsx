'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Specialized Hook for animating numbers
function useAnimatedCounter(value: number, duration: number = 2) {
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    // Spring physics configuration 
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
            className="flex flex-col items-center justify-center text-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
        >
            <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 flex items-baseline justify-center">
                {prefix && <span className="text-3xl sm:text-4xl text-white/50 mr-1">{prefix}</span>}
                <motion.span ref={ref}>{displayValue}</motion.span>
                {suffix && <span className="text-primary ml-1">{suffix}</span>}
            </div>
            <p className="text-lg sm:text-xl font-medium text-white/60">{label}</p>
        </motion.div>
    );
}

export function InteractiveStats() {
    return (
        <section className="py-24 sm:py-32 bg-[#0A0A0B] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-full max-h-[600px] bg-primary/20 blur-[120px] rounded-[100%] z-0" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
            </div>

            <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6"
                    >
                        Built for scale. <br />
                        <span className="text-white/50">Trusted globally.</span>
                    </motion.h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
                    <AnimatedCounter value={500} suffix="K+" label="Projects Completed" delay={0.1} />
                    <AnimatedCounter value={98} suffix="%" label="Client Satisfaction" delay={0.2} />
                    <AnimatedCounter value={2} suffix="M+" label="Freelancers Available" delay={0.3} />
                </div>
            </div>
        </section>
    );
}

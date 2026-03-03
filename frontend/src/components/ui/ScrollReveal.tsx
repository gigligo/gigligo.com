'use client';

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
}: ScrollRevealProps) {
    // Scroll animations removed to optimize website speed
    return (
        <div className={className}>
            {children}
        </div>
    );
}

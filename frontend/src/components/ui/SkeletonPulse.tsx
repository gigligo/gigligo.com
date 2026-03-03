'use client';

interface SkeletonProps {
    className?: string;
}

/** A single shimmering line placeholder */
export function SkeletonLine({ className = '' }: SkeletonProps) {
    return (
        <div className={`h-3 rounded-lg bg-white/4 skeleton-shimmer ${className}`} />
    );
}

/** Circular avatar / icon placeholder */
export function SkeletonCircle({ className = 'w-12 h-12' }: SkeletonProps) {
    return (
        <div className={`rounded-full bg-white/4 skeleton-shimmer ${className}`} />
    );
}

/** KPI / stat card skeleton */
export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-white/2 border border-white/5 rounded-3xl p-8 space-y-5 ${className}`}>
            <SkeletonLine className="w-24 h-2" />
            <SkeletonLine className="w-32 h-6" />
            <SkeletonLine className="w-16 h-2" />
        </div>
    );
}

/** Chart area skeleton */
export function SkeletonChart({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-white/2 border border-white/5 rounded-3xl p-8 space-y-6 ${className}`}>
            <div className="flex items-center justify-between">
                <SkeletonLine className="w-40 h-3" />
                <div className="flex gap-3">
                    <SkeletonLine className="w-16 h-8 rounded-xl" />
                    <SkeletonLine className="w-16 h-8 rounded-xl" />
                </div>
            </div>
            <div className="flex items-end gap-2 h-48">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-white/3 rounded-t-lg skeleton-shimmer"
                        style={{ height: `${30 + Math.random() * 60}%`, animationDelay: `${i * 0.08}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

/** Table / list row skeleton */
export function SkeletonRow({ className = '' }: SkeletonProps) {
    return (
        <div className={`flex items-center gap-6 p-6 border-b border-white/5 ${className}`}>
            <SkeletonCircle className="w-10 h-10 shrink-0" />
            <div className="flex-1 space-y-3">
                <SkeletonLine className="w-3/5 h-3" />
                <SkeletonLine className="w-2/5 h-2" />
            </div>
            <SkeletonLine className="w-20 h-8 rounded-xl shrink-0" />
        </div>
    );
}

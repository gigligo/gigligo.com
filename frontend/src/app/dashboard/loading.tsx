import { SkeletonCard, SkeletonChart, SkeletonLine, SkeletonRow } from '@/components/ui/SkeletonPulse';
import { TacticalSpinner } from '@/components/ui/TacticalSpinner';

export default function DashboardLoading() {
    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased">
            {/* Navbar placeholder */}
            <div className="h-[72px] bg-black/60 border-b border-white/5 skeleton-shimmer shrink-0" />

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-10 md:px-20 py-16 space-y-12">
                {/* Header skeleton */}
                <div className="space-y-6">
                    <SkeletonLine className="w-72 h-10 rounded-2xl" />
                    <SkeletonLine className="w-96 h-4" />
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>

                {/* Chart area */}
                <SkeletonChart />

                {/* Table rows */}
                <div className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <SkeletonLine className="w-48 h-4" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                        <SkeletonRow key={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}

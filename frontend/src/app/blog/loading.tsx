import { SkeletonLine } from '@/components/ui/SkeletonPulse';

export default function BlogLoading() {
    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans antialiased">
            {/* Navbar placeholder */}
            <div className="h-[72px] bg-black/60 border-b border-white/5 skeleton-shimmer shrink-0" />

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-12">
                {/* Hero */}
                <div className="space-y-6">
                    <SkeletonLine className="w-48 h-8 rounded-2xl" />
                    <div className="h-80 w-full bg-white/2 border border-white/5 rounded-3xl skeleton-shimmer" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white/2 border border-white/5 rounded-3xl overflow-hidden">
                            <div className="h-48 skeleton-shimmer" />
                            <div className="p-8 space-y-4">
                                <SkeletonLine className="w-20 h-2" />
                                <SkeletonLine className="w-full h-4" />
                                <SkeletonLine className="w-3/4 h-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLoading() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased">
            <div className="h-[76px] bg-slate-900 border-b border-border-light animate-pulse" />
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-16">
                <div className="space-y-8">
                    <div className="h-10 w-64 bg-border-light rounded-xl animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-surface-light border border-border-light rounded-2xl p-6 space-y-3 animate-pulse">
                                <div className="h-3 w-20 bg-border-light rounded" />
                                <div className="h-8 w-32 bg-border-light rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="bg-surface-light border border-border-light rounded-2xl p-8 space-y-4 animate-pulse">
                        <div className="h-4 w-48 bg-border-light rounded" />
                        <div className="h-64 w-full bg-border-light rounded-xl" />
                    </div>
                </div>
            </main>
        </div>
    );
}

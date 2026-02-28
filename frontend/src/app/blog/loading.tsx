export default function BlogLoading() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans antialiased">
            <div className="h-[76px] bg-slate-900 border-b border-border-light animate-pulse" />
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 py-16">
                <div className="space-y-8">
                    <div className="h-10 w-40 bg-border-light rounded-xl animate-pulse" />
                    <div className="h-80 w-full bg-border-light rounded-2xl animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-surface-light border border-border-light rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-border-light" />
                                <div className="p-5 space-y-3">
                                    <div className="h-3 w-16 bg-border-light rounded" />
                                    <div className="h-5 w-full bg-border-light rounded" />
                                    <div className="h-3 w-3/4 bg-border-light rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

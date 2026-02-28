import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-4xl">explore_off</span>
                </div>
                <p className="text-8xl font-black text-primary mb-4 tracking-tighter">404</p>
                <h2 className="text-2xl font-bold text-text-main mb-2">Page Not Found</h2>
                <p className="text-sm text-text-muted mb-8 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-surface-light border border-border-light text-text-main font-bold rounded-xl text-sm hover:border-primary/50 transition"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

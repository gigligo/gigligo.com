import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#000] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <p className="text-8xl font-bold text-[#FE7743] mb-4">404</p>
                <h2 className="text-2xl font-bold text-[#EFEEEA] mb-2">Page Not Found</h2>
                <p className="text-sm text-[#EFEEEA]/50 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-[#FE7743] text-white font-semibold rounded-xl text-sm hover:bg-[#FE7743]/90 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

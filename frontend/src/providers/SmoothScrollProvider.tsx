'use client';

// Removed Lenis smooth scroll initialization to fix website scroll lag and improve performance
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

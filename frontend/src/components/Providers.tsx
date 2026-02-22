'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    theme="system"
                    toastOptions={{
                        style: {
                            fontFamily: 'var(--font-jakarta)',
                        },
                    }}
                />
            </SessionProvider>
        </ThemeProvider>
    );
}

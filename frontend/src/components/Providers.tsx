'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
            <SessionProvider>
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    theme="dark"
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

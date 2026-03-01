import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com'),
  title: {
    default: "Gigligo | Create • Chat • Start",
    template: "%s | Gigligo"
  },
  description: "Gigligo is a hybrid freelance marketplace for professionals. Create, Chat, and Start your projects today.",
  keywords: ["freelance", "marketplace", "jobs", "talent", "gigligo", "freelancer", "gig economy", "hire talent"],
  authors: [{ name: "Gigligo Team" }],
  creator: "Gigligo",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gigligo.com',
    siteName: 'Gigligo',
    title: 'Gigligo | Create • Chat • Start',
    description: 'Access an exclusive network of high-end talent and serious business opportunities. Elevate your projects with GIGLIGO\'s curated elite.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gigligo | Create • Chat • Start',
    description: 'Access an exclusive network of high-end talent and serious business opportunities.',
    creator: '@gigligo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/providers/AuthProvider";
import CookieConsent from "@/components/CookieConsent";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import SmoothScrollProvider from '@/providers/SmoothScrollProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f8f7f6" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col`}>
        <Providers>
          <AuthProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </AuthProvider>
          <CookieConsent />
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
        <Analytics />
      </body>
    </html>
  );
}

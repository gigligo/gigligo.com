import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com'),
  title: {
    default: "Gigligo | Create • Chat • Start",
    template: "%s | Gigligo"
  },
  description: "Gigligo is a hybrid freelance marketplace for professionals. Create, Chat, and Start your projects today.",
  keywords: ["freelance", "marketplace", "jobs", "talent", "gigligo"],
  authors: [{ name: "Gigligo Team" }],
  creator: "Gigligo",
};

import { Providers } from "@/components/Providers";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';

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
      <body className={`${inter.variable} antialiased bg-background-light text-text-main dark:bg-background-dark dark:text-slate-100 font-sans`}>
        <Providers>
          {children}
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gigligo.com'),
  title: {
    default: "Gigligo | Empowering Pakistan's Future",
    template: "%s | Gigligo"
  },
  description: "Gigligo empowers the next-generation of Pakistani talent by giving businesses instant, affordable access to vetted university professionals and freelancers.",
  keywords: ["freelance pakistan", "pakistani talent", "hire students pakistan", "gig economy pakistan", "gigligo", "freelance marketplace"],
  authors: [{ name: "Gigligo Team" }],
  creator: "Gigligo",
  openGraph: {
    title: "Gigligo | Empowering Pakistan's Future",
    description: "Empowering the next-generation of Pakistani talent.",
    siteName: "Gigligo",
    type: "website",
    locale: "en_PK",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gigligo | Top Pakistani Talent",
    description: "Hire vetted university students and premium freelancers from Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { Providers } from "@/components/Providers";

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e8793a" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${jakarta.variable} ${outfit.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300`}>
        <Providers>
          {children}
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  );
}

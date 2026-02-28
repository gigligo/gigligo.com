import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E1E1E" />
      </head>
      <body className={`${inter.variable} ${lora.variable} antialiased bg-white text-[#1E1E1E]`}>
        <Providers>
          {children}
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
        <Analytics />
      </body>
    </html>
  );
}

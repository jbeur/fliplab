import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlipLab - Find Hidden Gems",
  description: "AI-powered thrift scanner and business management platform",
  authors: [{ name: "FlipLab Team" }],
  keywords: ["thrift", "flipping", "AI", "scanner", "business"],
  openGraph: {
    title: "FlipLab",
    description: "AI-powered thrift scanner and business management platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlipLab",
    description: "AI-powered thrift scanner and business management platform",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FlipLab",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FlipLab" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { ogImageUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "free online tools",
    "pdf merge",
    "image compressor",
    "word counter",
    "cv builder",
    "online toolkit",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} – ${siteConfig.slogan}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: ogImageUrl(siteConfig.name, siteConfig.slogan), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} – ${siteConfig.slogan}`,
    description: siteConfig.description,
    images: [ogImageUrl(siteConfig.name, siteConfig.slogan)],
  },
  robots: { index: true, follow: true },
  other: siteConfig.adsenseClient ? { "google-adsense-account": siteConfig.adsenseClient } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d14" },
  ],
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {siteConfig.adsenseClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}

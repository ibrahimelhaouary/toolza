import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} - ${siteConfig.slogan}`,
  description: siteConfig.description,
  robots: { index: true, follow: true },
  verification: {
    google: "LzR_KsFT7khyPAYXPiO5XxOqJ_3ddy8Dq0ZA0DAb3Xs",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="LzR_KsFT7khyPAYXPiO5XxOqJ_3ddy8Dq0ZA0DAb3Xs" />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

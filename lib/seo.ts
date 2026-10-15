import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getTool } from "@/lib/tools";

export function ogImageUrl(title: string, subtitle?: string) {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  return `/api/og?${params.toString()}`;
}

/** Per-tool metadata with canonical URL and dynamic OpenGraph image. */
export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  if (!tool) return {};
  const title = `${tool.title} – Free Online Tool`;
  const image = ogImageUrl(tool.title, tool.description);
  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: tool.href },
    openGraph: {
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
      url: absoluteUrl(tool.href),
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: tool.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
      images: [image],
    },
  };
}

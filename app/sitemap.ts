import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { categories, liveTools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/privacy-policy", "/terms", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({
      url: absoluteUrl(`/category/${c.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...liveTools().map((t) => ({
      url: absoluteUrl(t.href),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...staticPages,
  ];
}

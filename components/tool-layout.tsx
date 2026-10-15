import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { FaqItem } from "@/types";
import { getCategory, getTool } from "@/lib/tools";
import { SITE } from "@/lib/site";
import { AdBanner } from "@/components/ad-banner";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  slug: string;
  howTo: string[];
  faqs: FaqItem[];
  /** Overview paragraphs shown under the tool (SEO + AdSense content policy). */
  about: string[];
  children: ReactNode;
  /** Wide layout without sidebar ad (used by the CV builder). */
  wide?: boolean;
}

export function ToolLayout({ slug, howTo, faqs, about, children, wide }: ToolLayoutProps) {
  const tool = getTool(slug);
  if (!tool) return null;
  const category = getCategory(tool.category);
  const url = `${SITE.url}${tool.href}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.title,
      url,
      description: tool.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: category.label, item: `${SITE.url}/#${category.id}` },
        { "@type": "ListItem", position: 3, name: tool.title, item: url },
      ],
    },
  ];

  const content = (
    <div className="min-w-0 space-y-12">
      <section aria-labelledby="tool-heading">{children}</section>

      <section className="space-y-4 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight">About this tool</h2>
        {about.map((p, i) => (
          <p key={i} className="leading-7 text-muted-foreground">
            {p}
          </p>
        ))}
      </section>

      <section className="space-y-4 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight">How to use {tool.title}</h2>
        <ol className="space-y-3">
          {howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <span className="pt-0.5 text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="divide-y divide-border rounded-lg border border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group p-4">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="container py-8 print:max-w-none print:p-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground print:hidden">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/#${category.id}`} className="hover:text-foreground">
          {category.label}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{tool.title}</span>
      </nav>

      <header className="mb-6 print:hidden">
        <h1 id="tool-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
          {tool.title}
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{tool.description}</p>
      </header>

      <AdBanner variant="top" className="mb-8" />

      <div className={cn(!wide && "grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]")}>
        {content}
        {!wide && (
          <div className="hidden lg:block">
            <AdBanner variant="sidebar" />
          </div>
        )}
      </div>
    </div>
  );
}

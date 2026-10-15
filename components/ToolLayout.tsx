import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import JsonLd from "@/components/JsonLd";
import { ToolIcon } from "@/lib/icons";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getCategory, getTool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  children: React.ReactNode;
  /** Full-width layout without the sidebar ad (used by the CV builder). */
  wide?: boolean;
}

/**
 * Shared shell for every tool page: breadcrumb, H1, ads, the tool itself,
 * a how-to guide, FAQs and Schema.org structured data (WebApplication + FAQPage).
 */
export default function ToolLayout({ slug, children, wide }: Props) {
  const tool = getTool(slug);
  if (!tool) notFound();
  const category = getCategory(tool.category);

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: absoluteUrl(tool.href),
    description: tool.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(`/category/${category.id}`) },
      { "@type": "ListItem", position: 3, name: tool.title, item: absoluteUrl(tool.href) },
    ],
  };

  return (
    <div className="container py-8 print:p-0">
      <JsonLd data={webApp} />
      <JsonLd data={breadcrumbLd} />
      {tool.faqs.length > 0 && <JsonLd data={faqLd} />}

      <div className="print:hidden">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/category/${category.id}`} className="hover:text-foreground">{category.name}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{tool.title}</span>
        </nav>

        <header className="mb-6 flex items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:flex">
            <ToolIcon name={tool.icon} className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tool.title}</h1>
            <p className="mt-1 text-muted-foreground">{tool.description}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              Private by design — runs entirely in your browser.
            </p>
          </div>
        </header>

        <AdBanner variant="top" className="mb-6" />
      </div>

      <div className={cn("grid gap-8", !wide && "lg:grid-cols-[minmax(0,1fr)_300px]")}>
        <div className="min-w-0">
          {children}

          <div className="print:hidden">
            <AdBanner variant="infeed" className="mt-10" />

            <section className="mt-10" aria-labelledby="how-to">
              <h2 id="how-to" className="text-xl font-semibold">
                How to use {tool.title}
              </h2>
              <ol className="mt-4 space-y-3">
                {tool.howTo.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-10" aria-labelledby="faq">
              <h2 id="faq" className="text-xl font-semibold">
                Frequently asked questions
              </h2>
              <div className="mt-4 divide-y rounded-lg border bg-card">
                {tool.faqs.map((f) => (
                  <details key={f.q} className="group p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                      {f.q}
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>

        {!wide && (
          <aside className="hidden space-y-6 lg:block print:hidden" aria-label="Sidebar">
            <div className="sticky top-24 space-y-6">
              <AdBanner variant="sidebar" />
              <div className="rounded-lg border bg-card p-4 text-sm">
                <h2 className="font-semibold">Why Toolza?</h2>
                <ul className="mt-2 space-y-1.5 text-muted-foreground">
                  <li>• 100% free, no sign-up</li>
                  <li>• Files never leave your device</li>
                  <li>• Fast — no uploads or queues</li>
                </ul>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

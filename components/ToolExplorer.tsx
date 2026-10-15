"use client";

import { Search, ShieldCheck, Zap, Infinity as InfinityIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import AdBanner from "@/components/AdBanner";
import ToolCard from "@/components/ToolCard";
import { ToolIcon } from "@/lib/icons";
import { categories, searchTools, tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types";

type Filter = "all" | CategoryId;

export default function ToolExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    const byCat = filter === "all" ? tools : tools.filter((t) => t.category === filter);
    return searchTools(query, byCat);
  }, [query, filter]);

  function pickCategory(id: Filter) {
    setFilter(id);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.14),transparent)]"
        />
        <div className="container py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
            Files never leave your device
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            {siteConfig.slogan}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Merge PDFs, compress images, count words and build a CV — free, fast and private.
            No sign-up, no uploads.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (filter !== "all") setFilter("all");
              }}
              placeholder="Search tools: merge pdf, compress image, word count…"
              aria-label="Search tools"
              className="field h-14 rounded-xl pl-12 text-base shadow-sm"
            />
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Instant results</li>
            <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 100% private</li>
            <li className="inline-flex items-center gap-1.5"><InfinityIcon className="h-4 w-4 text-primary" /> Unlimited use</li>
          </ul>
        </div>
      </section>

      <div className="container">
        <AdBanner variant="top" className="mt-8" />

        {/* ------------------------------------------------- Category grid */}
        <section className="mt-12" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-bold tracking-tight">
            Browse by category
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => {
              const count = tools.filter((t) => t.category === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickCategory(c.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    filter === c.id && "border-primary ring-1 ring-primary"
                  )}
                >
                  <ToolIcon name={c.icon} className="h-6 w-6 text-primary" />
                  <span className="text-sm font-semibold">{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "tool" : "tools"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------ Tabs + results */}
        <section ref={gridRef} className="mt-14 scroll-mt-24" aria-labelledby="tools-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="tools-heading" className="text-2xl font-bold tracking-tight">
              {query ? `Results for “${query}”` : "All tools"}
            </h2>
            <div role="tablist" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {[{ id: "all" as const, name: "All" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={filter === c.id}
                  onClick={() => setFilter(c.id as Filter)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    filter === c.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed p-12 text-center">
              <p className="font-medium">No tools match your search.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try “pdf”, “image” or “resume”.</p>
              <button
                type="button"
                className="btn-outline mt-4"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          )}
        </section>

        <AdBanner variant="infeed" className="mt-12" />
      </div>
    </>
  );
}

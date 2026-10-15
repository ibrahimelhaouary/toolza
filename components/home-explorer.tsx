"use client";

import { Fragment, useMemo, useState } from "react";
import { Lock, Search, Zap } from "lucide-react";
import type { CategoryId } from "@/types";
import { CATEGORIES, filterTools } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";
import { AdBanner } from "@/components/ad-banner";
import { cn } from "@/lib/utils";

type Tab = CategoryId | "all";

export function HomeExplorer() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const tools = useMemo(() => filterTools(query, tab), [query, tab]);
  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All tools" },
    ...CATEGORIES.map((c) => ({ id: c.id as Tab, label: c.label })),
  ];

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container py-14 text-center sm:py-20">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Your Free Everyday <span className="text-primary">Online Toolkit</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Merge PDFs, compress images, count words and build a CV. Everything runs privately in
            your browser, with no uploads and no sign-up.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools: merge pdf, compress image, word count…"
              aria-label="Search tools"
              className="input h-12 rounded-xl pl-12 text-base shadow-sm"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> 100% private
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> Instant, in-browser
            </span>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div
          role="tablist"
          aria-label="Tool categories"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tools.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No tools match “{query}”. Try a different keyword.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <Fragment key={tool.slug}>
                <ToolCard tool={tool} />
                {(i + 1) % 6 === 0 && i + 1 < tools.length && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdBanner variant="in-feed" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </section>

      {/* Category grid */}
      <section className="container pb-6">
        <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const count = filterTools("", c.id).filter((t) => t.live).length;
            return (
              <button
                key={c.id}
                id={c.id}
                onClick={() => {
                  setTab(c.id);
                  setQuery("");
                  window.scrollTo({ top: 360, behavior: "smooth" });
                }}
                className="card scroll-mt-24 p-5 text-left transition-colors hover:border-primary/50"
              >
                <p className="font-semibold">{c.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <p className="mt-3 text-xs text-primary">
                  {count} {count === 1 ? "tool" : "tools"} available
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

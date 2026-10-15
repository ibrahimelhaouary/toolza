"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, Wrench, X } from "lucide-react";
import { CATEGORIES, filterTools, getCategory } from "@/lib/tools";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolIcon } from "@/components/tool-icon";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (query.trim() ? filterTools(query).slice(0, 6) : []), [query]);

  // Close everything on navigation
  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
    setQuery("");
    setFocused(false);
  }, [pathname]);

  // Click outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setFocused(false);
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const searchBox = (
    <div ref={searchRef} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Search tools…"
        aria-label="Search tools"
        className="input pl-9"
      />
      {focused && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No tools found.</p>
          ) : (
            <ul>
              {results.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.live ? t.href : "/"}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent"
                  >
                    <ToolIcon name={t.icon} className="h-4 w-4 text-primary" />
                    <span className="flex-1 font-medium">{t.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.live ? getCategory(t.category).label : "Soon"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur print:hidden">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </span>
          <span className="text-lg">Toolza</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          <div ref={catRef} className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              className="btn-ghost gap-1"
            >
              Categories
              <ChevronDown className={cn("h-4 w-4 transition-transform", catOpen && "rotate-180")} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/#${c.id}`}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    <span className="font-medium">{c.label}</span>
                    <span className="block text-xs text-muted-foreground">{c.description}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block">{searchBox}</div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <button
            type="button"
            className="btn-ghost h-9 w-9 p-0 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-4 border-t border-border px-4 py-4 md:hidden">
          {searchBox}
          <ul className="space-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/#${c.id}`} className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

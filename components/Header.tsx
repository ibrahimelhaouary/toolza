"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { ToolIcon } from "@/lib/icons";
import { categories, searchTools, tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => (query.trim() ? searchTools(query, tools).slice(0, 6) : []),
    [query]
  );

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) setSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function go(href: string) {
    setQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = results.find((t) => t.status === "live");
    if (first) go(first.href);
  }

  const searchBox = (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={onSubmit} role="search">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search tools…"
          aria-label="Search tools"
          className="field h-9 pl-9"
        />
      </form>
      {searchOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border bg-card shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No tools found.</p>
          ) : (
            <ul>
              {results.map((t) => (
                <li key={t.slug}>
                  {t.status === "live" ? (
                    <button
                      type="button"
                      onClick={() => go(t.href)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-secondary"
                    >
                      <ToolIcon name={t.icon} className="h-4 w-4 text-primary" />
                      <span className="font-medium">{t.title}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground">
                      <ToolIcon name={t.icon} className="h-4 w-4" />
                      <span>{t.title}</span>
                      <span className="ml-auto text-[11px]">Soon</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur print:hidden">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight" aria-label={`${siteConfig.name} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </span>
          <span className="text-lg">{siteConfig.name}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              className="btn-ghost"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Categories <ChevronDown className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border bg-card p-2 shadow-lg"
              >
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/category/${c.id}`}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-start gap-3 rounded-md p-2.5 hover:bg-secondary"
                  >
                    <ToolIcon name={c.icon} className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <span className="block text-sm font-medium">{c.name}</span>
                      <span className="block text-xs text-muted-foreground">{c.description}</span>
                    </span>
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
            className="btn-ghost h-9 w-9 !p-0 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="container space-y-4 border-t py-4 md:hidden">
          {searchBox}
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-secondary"
                >
                  <ToolIcon name={c.icon} className="h-4 w-4 text-primary" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { SITE } from "@/lib/site";

export function Footer() {
  const featured = TOOLS.filter((t) => t.live).slice(0, 5);
  return (
    <footer className="mt-16 border-t border-border bg-muted/30 print:hidden">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">{SITE.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.slogan}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Your files never leave your device. Every tool runs in your browser.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Categories</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/#${c.id}`} className="hover:text-foreground">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Popular tools</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {featured.map((t) => (
              <li key={t.slug}>
                <Link href={t.href} className="hover:text-foreground">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy-policy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}

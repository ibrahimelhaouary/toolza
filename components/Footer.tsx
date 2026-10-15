import Link from "next/link";
import { Wrench } from "lucide-react";
import { categories, liveTools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-secondary/40 print:hidden">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="h-4 w-4" />
            </span>
            {siteConfig.name}
          </Link>
          <p className="text-sm text-muted-foreground">{siteConfig.slogan}</p>
          <p className="text-xs text-muted-foreground">
            All files are processed locally in your browser. We never upload or store them.
          </p>
        </div>

        <nav aria-label="Categories">
          <h2 className="mb-3 text-sm font-semibold">Categories</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.id}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular tools">
          <h2 className="mb-3 text-sm font-semibold">Popular tools</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {liveTools().map((t) => (
              <li key={t.slug}>
                <Link href={t.href} className="hover:text-foreground">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="mb-3 text-sm font-semibold">Company</h2>
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
        </nav>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}

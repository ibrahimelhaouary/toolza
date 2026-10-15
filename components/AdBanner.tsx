"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "top" | "sidebar" | "infeed";

const config: Record<Variant, { min: string; format: string; label: string }> = {
  top: { min: "min-h-[90px]", format: "horizontal", label: "Top banner (728×90 / responsive)" },
  sidebar: { min: "min-h-[250px]", format: "rectangle", label: "Sidebar (300×250 / 300×600)" },
  infeed: { min: "min-h-[100px]", format: "fluid", label: "In-feed (responsive)" },
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Responsive ad container. Space is reserved up-front to avoid layout shift.
 * - With NEXT_PUBLIC_ADSENSE_CLIENT set: renders a real AdSense unit.
 * - Without it: shows a labelled placeholder in development and nothing in production.
 */
export default function AdBanner({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLModElement>(null);
  const { min, format, label } = config[variant];
  const client = siteConfig.adsenseClient;
  const slot = siteConfig.adSlots[variant];
  const live = Boolean(client && slot);

  useEffect(() => {
    if (!live || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blockers or duplicate push — safe to ignore */
    }
  }, [live]);

  if (!live) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex w-full items-center justify-center rounded-lg border border-dashed bg-muted/40 text-xs text-muted-foreground print:hidden",
          min,
          className
        )}
      >
        Advertisement · {label}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden print:hidden", min, className)}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wide text-muted-foreground">
        Advertisement
      </p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format === "fluid" ? "fluid" : "auto"}
        data-ad-layout={format === "fluid" ? "in-article" : undefined}
        data-full-width-responsive="true"
      />
    </div>
  );
}

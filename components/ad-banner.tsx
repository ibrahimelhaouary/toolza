"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

type Variant = "top" | "sidebar" | "in-feed";

const SIZES: Record<Variant, string> = {
  // Reserved heights prevent layout shift when the ad loads.
  top: "min-h-[90px] w-full max-w-[728px] mx-auto",
  sidebar: "min-h-[250px] w-full max-w-[300px] lg:sticky lg:top-20",
  "in-feed": "min-h-[100px] w-full",
};

interface AdBannerProps {
  variant: Variant;
  /** AdSense ad-unit slot id (optional). */
  slot?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdBanner({ variant, slot, className }: AdBannerProps) {
  const pushed = useRef(false);
  const live = Boolean(SITE.adsenseClient && slot);

  useEffect(() => {
    if (!live || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker or script not ready */
    }
  }, [live]);

  return (
    <aside
      aria-label="Advertisement"
      className={cn("print:hidden", SIZES[variant], className)}
    >
      {live ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight: "inherit" }}
          data-ad-client={SITE.adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex h-full min-h-[inherit] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground"
          style={{ minHeight: "inherit" }}
        >
          Advertisement
        </div>
      )}
    </aside>
  );
}

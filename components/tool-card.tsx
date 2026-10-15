import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/types";
import { getCategory } from "@/lib/tools";
import { ToolIcon } from "@/components/tool-icon";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        {tool.live ? (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold">{tool.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{tool.description}</p>
      <span className="mt-4 inline-flex w-fit rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
        {getCategory(tool.category).label}
      </span>
    </>
  );

  const base = "group card flex h-full flex-col p-5 transition-all";

  if (!tool.live) {
    return <div className={cn(base, "opacity-70")}>{body}</div>;
  }
  return (
    <Link
      href={tool.href}
      className={cn(base, "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md")}
    >
      {body}
    </Link>
  );
}

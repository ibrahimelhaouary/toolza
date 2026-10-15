import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ToolIcon } from "@/lib/icons";
import { getCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

export default function ToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  const soon = tool.status === "soon";

  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        {soon ? (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Coming soon
          </span>
        ) : (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
      <h3 className="mt-4 font-semibold leading-tight">{tool.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{tool.description}</p>
      <span className="mt-4 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        {category.name}
      </span>
    </>
  );

  const base = "flex h-full flex-col rounded-xl border bg-card p-5 text-card-foreground shadow-sm";

  if (soon) {
    return <div className={cn(base, "opacity-70")}>{body}</div>;
  }

  return (
    <Link
      href={tool.href}
      className={cn(
        base,
        "group transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {body}
    </Link>
  );
}

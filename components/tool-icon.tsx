import {
  CaseSensitive,
  FileDown,
  FilePlus2,
  FileUser,
  GitCompare,
  ImageDown,
  Languages,
  RefreshCw,
  Scaling,
  Scissors,
  Sparkles,
  Type,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  CaseSensitive,
  FileDown,
  FilePlus2,
  FileUser,
  GitCompare,
  ImageDown,
  Languages,
  RefreshCw,
  Scaling,
  Scissors,
  Sparkles,
  Type,
};

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon className={className} aria-hidden="true" />;
}

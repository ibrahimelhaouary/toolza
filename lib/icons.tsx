import {
  Briefcase,
  CaseSensitive,
  FileDown,
  FileText,
  FileUser,
  GitCompare,
  Image as ImageIcon,
  Languages,
  Maximize2,
  Merge,
  Minimize2,
  RefreshCw,
  Scissors,
  Sparkles,
  Type,
  Hash,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Briefcase,
  CaseSensitive,
  FileDown,
  FileText,
  FileUser,
  GitCompare,
  Image: ImageIcon,
  Languages,
  Maximize2,
  Merge,
  Minimize2,
  RefreshCw,
  Scissors,
  Sparkles,
  Type,
  Hash,
};

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? FileText;
  return <Icon className={className} aria-hidden="true" />;
}

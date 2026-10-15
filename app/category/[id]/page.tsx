import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import ToolCard from "@/components/ToolCard";
import { ogImageUrl } from "@/lib/seo";
import { categories, toolsByCategory } from "@/lib/tools";
import type { CategoryId } from "@/types";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) return {};
  return {
    title: `${category.name} – Free Online Tools`,
    description: category.description,
    alternates: { canonical: `/category/${category.id}` },
    openGraph: { images: [ogImageUrl(category.name, category.description)] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();
  const list = toolsByCategory(category.id as CategoryId);

  return (
    <div className="container py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link> / <span className="text-foreground">{category.name}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
      <p className="mt-2 text-muted-foreground">{category.description}</p>
      <AdBanner variant="top" className="my-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}

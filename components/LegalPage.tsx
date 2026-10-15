export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {updated && <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>}
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}

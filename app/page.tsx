import JsonLd from "@/components/JsonLd";
import ToolExplorer from "@/components/ToolExplorer";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function HomePage() {
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/api/og?title=Toolza"),
    email: siteConfig.email,
  };

  return (
    <>
      <JsonLd data={websiteLd} />
      <JsonLd data={orgLd} />
      <ToolExplorer />

      {/* Editorial content for SEO and AdSense content-policy compliance */}
      <section className="container mt-16" aria-labelledby="about-heading">
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 id="about-heading" className="text-2xl font-bold tracking-tight text-foreground">
            Free online tools that respect your privacy
          </h2>
          <p>
            {siteConfig.name} is a growing collection of everyday utilities — PDF merging, image
            compression, word counting and CV building — that work directly in your web browser.
            Unlike most online converters, your files are never uploaded to a server. The work is
            done on your own device using modern JavaScript, so it is fast, works with large
            files and keeps sensitive documents private.
          </p>
          <h3 className="text-lg font-semibold text-foreground">Why use browser-based tools?</h3>
          <p>
            Uploading a contract, an ID scan or a personal photo to an unknown server is a
            privacy risk. With {siteConfig.name} the data stays on your computer or phone, there
            is nothing to wait for, and there are no daily limits or sign-ups.
          </p>
          <h3 className="text-lg font-semibold text-foreground">What can you do here?</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Merge several PDF files into a single document in the order you choose.</li>
            <li>Compress JPG, PNG and WebP images and convert between formats.</li>
            <li>Count words, characters and reading time, and convert text case.</li>
            <li>Create a clean, print-ready resume and export it as a PDF.</li>
          </ul>
        </div>
      </section>
    </>
  );
}

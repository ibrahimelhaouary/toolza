import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms and conditions for using ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 14, 2026">
      <p>
        By accessing or using {siteConfig.name} you agree to these terms. If you do not agree,
        please do not use the site.
      </p>

      <h2>Use of the service</h2>
      <p>
        {siteConfig.name} provides free browser-based utilities. You agree to use them lawfully and
        not to abuse, disrupt or attempt to reverse-engineer the service beyond what applicable law
        permits.
      </p>

      <h2>Your content</h2>
      <p>
        You retain all rights to the files and text you process. Because processing happens in your
        browser, we do not receive or store your content.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided “as is” without warranties of any kind. We do not guarantee that
        results will be error-free or fit for a particular purpose. Always keep a copy of your
        original files.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {siteConfig.name} is not liable for any indirect or
        consequential damages, or loss of data, arising from use of the service.
      </p>

      <h2>Advertising and third-party links</h2>
      <p>
        The site may display third-party advertisements and links. We are not responsible for the
        content or practices of third-party sites.
      </p>

      <h2>Changes</h2>
      <p>We may modify these terms at any time. Continued use of the site means you accept the updated terms.</p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data, cookies and advertising.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 14, 2026">
      <p>
        Your privacy matters to us. This policy explains what information {siteConfig.name} (“we”,
        “us”) collects and how it is used when you visit {siteConfig.url}.
      </p>

      <h2>Your files stay on your device</h2>
      <p>
        All file processing — merging PDFs, compressing images, counting text and building a CV —
        happens locally in your browser. Files and text you work with are <strong>not uploaded to
        or stored on our servers</strong>. CV data you enter is saved only in your browser&apos;s
        localStorage and can be deleted at any time by clearing your site data.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Standard server logs (IP address, browser type, pages requested) for security and diagnostics.</li>
        <li>Anonymous usage and performance data, if analytics is enabled.</li>
        <li>Cookies and similar technologies set by our advertising partners (see below).</li>
      </ul>

      <h2>Advertising and cookies</h2>
      <p>
        We use Google AdSense to display ads. Google and its partners use cookies to serve ads
        based on your prior visits to this and other websites. You can opt out of personalized
        advertising at{" "}
        <a href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>{" "}
        or at{" "}
        <a href="https://www.aboutads.info" rel="noopener noreferrer" target="_blank">
          aboutads.info
        </a>
        . Visitors from the EEA, UK and Switzerland are shown a consent prompt where required.
      </p>

      <h2>Third-party services</h2>
      <p>
        Third-party vendors, including Google, may collect data according to their own privacy
        policies. We do not control those practices.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>{siteConfig.name} is not directed to children under 13 and we do not knowingly collect their personal information.</p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live you may have the right to access, correct or delete personal
        data we hold about you. Contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The latest version is always available on this page.</p>
    </LegalPage>
  );
}

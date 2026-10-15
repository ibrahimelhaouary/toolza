import type { Metadata } from "next";
import { Mail } from "lucide-react";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${siteConfig.name} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>
        Found a bug, have a feature request or a question about these terms? We read every
        message and usually reply within a few business days.
      </p>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground">
        <Mail className="h-5 w-5 text-primary" />
        <a href={`mailto:${siteConfig.email}`} className="font-medium">
          {siteConfig.email}
        </a>
      </div>
      <p>
        When reporting a problem, please include your browser, operating system and the tool you
        were using. Please do not email sensitive documents — you never need to send us your files
        to get help.
      </p>
    </LegalPage>
  );
}

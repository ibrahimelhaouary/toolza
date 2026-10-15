import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import CvBuilder from "./CvBuilder";

export const metadata: Metadata = toolMetadata("cv-builder");

export default function CvBuilderPage() {
  return (
    <ToolLayout slug="cv-builder" wide>
      <CvBuilder />
    </ToolLayout>
  );
}

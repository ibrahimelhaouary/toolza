import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import MergeTool from "./MergeTool";

export const metadata: Metadata = toolMetadata("pdf-merge");

export default function PdfMergePage() {
  return (
    <ToolLayout slug="pdf-merge">
      <MergeTool />
    </ToolLayout>
  );
}

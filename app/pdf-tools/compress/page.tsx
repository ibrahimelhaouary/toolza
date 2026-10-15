import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import PdfCompressTool from "./PdfCompressTool";

export const metadata: Metadata = toolMetadata("pdf-compress");

export default function Page() {
  return (
    <ToolLayout slug="pdf-compress">
      <PdfCompressTool />
    </ToolLayout>
  );
}

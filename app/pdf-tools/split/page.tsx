import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import SplitTool from "./SplitTool";

export const metadata: Metadata = toolMetadata("pdf-split");

export default function Page() {
  return (
    <ToolLayout slug="pdf-split">
      <SplitTool />
    </ToolLayout>
  );
}

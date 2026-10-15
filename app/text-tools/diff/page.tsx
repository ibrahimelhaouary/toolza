import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import DiffTool from "./DiffTool";

export const metadata: Metadata = toolMetadata("diff-checker");

export default function Page() {
  return (
    <ToolLayout slug="diff-checker">
      <DiffTool />
    </ToolLayout>
  );
}

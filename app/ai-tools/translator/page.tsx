import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import TranslatorTool from "./TranslatorTool";

export const metadata: Metadata = toolMetadata("ai-translator");

export default function Page() {
  return (
    <ToolLayout slug="ai-translator">
      <TranslatorTool />
    </ToolLayout>
  );
}

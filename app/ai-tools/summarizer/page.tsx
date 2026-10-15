import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import SummarizerTool from "./SummarizerTool";

export const metadata: Metadata = toolMetadata("ai-summarizer");

export default function Page() {
  return (
    <ToolLayout slug="ai-summarizer">
      <SummarizerTool />
    </ToolLayout>
  );
}

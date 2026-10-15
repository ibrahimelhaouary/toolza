import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import CounterTool from "./CounterTool";

export const metadata: Metadata = toolMetadata("word-counter");

export default function WordCounterPage() {
  return (
    <ToolLayout slug="word-counter">
      <CounterTool />
    </ToolLayout>
  );
}

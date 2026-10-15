import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import CaseTool from "./CaseTool";

export const metadata: Metadata = toolMetadata("case-converter");

export default function Page() {
  return (
    <ToolLayout slug="case-converter">
      <CaseTool />
    </ToolLayout>
  );
}

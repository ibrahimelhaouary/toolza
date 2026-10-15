import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import ConvertTool from "./ConvertTool";

export const metadata: Metadata = toolMetadata("image-convert");

export default function Page() {
  return (
    <ToolLayout slug="image-convert">
      <ConvertTool />
    </ToolLayout>
  );
}

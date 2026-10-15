import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import ResizeTool from "./ResizeTool";

export const metadata: Metadata = toolMetadata("image-resize");

export default function Page() {
  return (
    <ToolLayout slug="image-resize">
      <ResizeTool />
    </ToolLayout>
  );
}

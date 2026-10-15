import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolMetadata } from "@/lib/seo";
import CompressTool from "./CompressTool";

export const metadata: Metadata = toolMetadata("image-compress");

export default function ImageCompressPage() {
  return (
    <ToolLayout slug="image-compress">
      <CompressTool />
    </ToolLayout>
  );
}

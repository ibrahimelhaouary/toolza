import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/** Dynamic OpenGraph image: /api/og?title=...&subtitle=... */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? siteConfig.name).slice(0, 70);
  const subtitle = (searchParams.get("subtitle") ?? siteConfig.slogan).slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg,#312e81 0%,#4f46e5 55%,#7c3aed 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 24, opacity: 0.85 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.8 }}>
          Free • Private • Runs in your browser
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

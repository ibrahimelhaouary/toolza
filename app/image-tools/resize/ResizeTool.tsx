"use client";

import { Download, Loader2, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { canvasToBlob, drawToCanvas, imageFormats, loadImage } from "@/lib/image";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

export default function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"px" | "pct">("px");
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [pct, setPct] = useState(50);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const prevUrl = useRef<string | null>(null);

  useEffect(() => () => { if (prevUrl.current) URL.revokeObjectURL(prevUrl.current); }, []);

  async function onFiles(files: File[]) {
    setError(null);
    setInfo(null);
    try {
      const loaded = await loadImage(files[0]);
      if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
      prevUrl.current = loaded.url;
      setFile(files[0]);
      setImg(loaded.img);
      setUrl(loaded.url);
      setW(loaded.img.naturalWidth);
      setH(loaded.img.naturalHeight);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read image.");
    }
  }

  const ratio = img ? img.naturalWidth / img.naturalHeight : 1;
  const target = img
    ? mode === "pct"
      ? { w: Math.round((img.naturalWidth * pct) / 100), h: Math.round((img.naturalHeight * pct) / 100) }
      : { w, h }
    : { w: 0, h: 0 };

  async function resize() {
    if (!img || !file || target.w < 1 || target.h < 1) return;
    if (target.w > 16000 || target.h > 16000) return setError("Maximum supported size is 16000 px per side.");
    setBusy(true);
    setError(null);
    try {
      const canvas = drawToCanvas(img, target.w, target.h, format);
      const blob = await canvasToBlob(canvas, format, quality / 100);
      const ext = imageFormats.find((f) => f.value === format)!.ext;
      downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}-${target.w}x${target.h}.${ext}`);
      setInfo(`Saved ${target.w}×${target.h}px · ${formatBytes(blob.size)} (original ${formatBytes(file.size)})`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <FileDropzone accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple={false} onFiles={onFiles} title="Drag & drop an image here, or click to browse" hint="JPG, PNG or WebP · processed locally" />

      {img && url && (
        <div className="panel grid gap-6 md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Preview" className="max-h-72 w-full rounded-md bg-secondary object-contain" />
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Original: {img.naturalWidth}×{img.naturalHeight}px</p>

            <div className="flex gap-1 rounded-md bg-secondary p-1" role="radiogroup" aria-label="Resize mode">
              {(["px", "pct"] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}
                  className={cn("flex-1 rounded px-3 py-1.5 text-sm font-medium", mode === m ? "bg-background shadow-sm" : "text-muted-foreground")}>
                  {m === "px" ? "Pixels" : "Percentage"}
                </button>
              ))}
            </div>

            {mode === "px" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="w" className="label">Width (px)</label>
                    <input id="w" type="number" min={1} className="field" value={w || ""} onChange={(e) => { const v = Number(e.target.value); setW(v); if (lock) setH(Math.round(v / ratio)); }} />
                  </div>
                  <div>
                    <label htmlFor="h" className="label">Height (px)</label>
                    <input id="h" type="number" min={1} className="field" value={h || ""} onChange={(e) => { const v = Number(e.target.value); setH(v); if (lock) setW(Math.round(v * ratio)); }} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Lock aspect ratio
                </label>
              </>
            ) : (
              <div>
                <div className="flex justify-between text-sm"><label htmlFor="pct">Scale</label><span className="tabular-nums">{pct}% → {target.w}×{target.h}</span></div>
                <input id="pct" type="range" min={5} max={200} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="mt-2 w-full accent-[hsl(var(--primary))]" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="fmt" className="label">Format</label>
                <select id="fmt" className="field" value={format} onChange={(e) => setFormat(e.target.value)}>
                  {imageFormats.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="q" className="label">Quality {quality}%</label>
                <input id="q" type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full accent-[hsl(var(--primary))]" disabled={format === "image/png"} />
              </div>
            </div>

            <button type="button" className="btn-primary" onClick={resize} disabled={busy || target.w < 1 || target.h < 1}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Maximize2 className="h-4 w-4" />} Resize <Download className="h-4 w-4" />
            </button>
            {info && <p className="text-sm text-green-600">{info}</p>}
          </div>
        </div>
      )}

      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

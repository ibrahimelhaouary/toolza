"use client";

import { Download, Loader2, Trash2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { cn, downloadBlob, formatBytes, uid } from "@/lib/utils";

type Format = "image/webp" | "image/jpeg" | "image/png";
type Status = "idle" | "working" | "done" | "error";

interface Item {
  id: string;
  file: File;
  previewUrl: string;
  status: Status;
  result?: File;
  error?: string;
}

const formats: { value: Format; label: string; ext: string }[] = [
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/jpeg", label: "JPG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
];

const sizes = [
  { value: 0, label: "Original size" },
  { value: 3840, label: "Max 3840 px (4K)" },
  { value: 1920, label: "Max 1920 px (Full HD)" },
  { value: 1280, label: "Max 1280 px" },
  { value: 800, label: "Max 800 px" },
];

function outName(name: string, ext: string) {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base}-toolza.${ext}`;
}

export default function CompressTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<Format>("image/webp");
  const [maxDim, setMaxDim] = useState(0);
  const [busy, setBusy] = useState(false);
  const urls = useRef<Set<string>>(new Set());

  useEffect(() => {
    const set = urls.current;
    return () => set.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  function addFiles(files: File[]) {
    const added = files.map<Item>((file) => {
      const previewUrl = URL.createObjectURL(file);
      urls.current.add(previewUrl);
      return { id: uid(), file, previewUrl, status: "idle" };
    });
    setItems((prev) => [...prev, ...added]);
  }

  function remove(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        urls.current.delete(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }

  function clearAll() {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    setItems([]);
  }

  async function compressAll() {
    setBusy(true);
    const { default: imageCompression } = await import("browser-image-compression");
    const ext = formats.find((f) => f.value === format)!.ext;
    // Reset all results, then process sequentially to keep memory usage low.
    setItems((prev) => prev.map((i) => ({ ...i, status: "working", result: undefined, error: undefined })));
    for (const item of items) {
      try {
        const out = await imageCompression(item.file, {
          maxSizeMB: Number.POSITIVE_INFINITY,
          initialQuality: quality / 100,
          fileType: format,
          useWebWorker: true,
          alwaysKeepResolution: maxDim === 0,
          ...(maxDim > 0 ? { maxWidthOrHeight: maxDim } : {}),
        });
        const result = new File([out], outName(item.file.name, ext), { type: format });
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "done", result } : i)));
      } catch (e) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error", error: e instanceof Error ? e.message : "Compression failed" }
              : i
          )
        );
      }
    }
    setBusy(false);
  }

  async function downloadAll() {
    for (const item of items) {
      if (item.result) {
        downloadBlob(item.result, item.result.name);
        await new Promise((r) => setTimeout(r, 350)); // avoid browser multi-download blocking
      }
    }
  }

  const done = items.filter((i) => i.result);
  const totalBefore = done.reduce((s, i) => s + i.file.size, 0);
  const totalAfter = done.reduce((s, i) => s + (i.result?.size ?? 0), 0);
  const saved = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onFiles={addFiles}
        title="Drag & drop images here, or click to browse"
        hint="JPG, PNG or WebP · batch supported · processed locally"
      />

      {/* ------------------------------------------------------------ Settings */}
      <div className="panel grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <div className="flex items-center justify-between">
            <label htmlFor="quality" className="text-sm font-medium">Quality</label>
            <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold tabular-nums">{quality}%</span>
          </div>
          <input
            id="quality"
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-2 w-full accent-[hsl(var(--primary))]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
          {format === "image/png" && (
            <p className="mt-2 text-xs text-muted-foreground">
              PNG is lossless, so the quality slider has little effect. Choose WebP or JPG for smaller files, or reduce the max size.
            </p>
          )}
        </div>

        <div>
          <span className="label">Output format</span>
          <div className="flex gap-1 rounded-md bg-secondary p-1" role="radiogroup" aria-label="Output format">
            {formats.map((f) => (
              <button
                key={f.value}
                type="button"
                role="radio"
                aria-checked={format === f.value}
                onClick={() => setFormat(f.value)}
                className={cn(
                  "flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  format === f.value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="maxdim">Resize</label>
          <select id="maxdim" className="field" value={maxDim} onChange={(e) => setMaxDim(Number(e.target.value))}>
            {sizes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------- File list */}
      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={compressAll} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {busy ? "Compressing…" : `Compress ${items.length} ${items.length === 1 ? "image" : "images"}`}
            </button>
            {done.length > 1 && (
              <button type="button" className="btn-outline" onClick={downloadAll} disabled={busy}>
                <Download className="h-4 w-4" /> Download all ({done.length})
              </button>
            )}
            <button type="button" className="btn-ghost" onClick={clearAll} disabled={busy}>
              Clear all
            </button>
            {done.length > 0 && (
              <span className="ml-auto text-sm text-muted-foreground">
                {formatBytes(totalBefore)} → <strong className="text-foreground">{formatBytes(totalAfter)}</strong>{" "}
                <span className={cn(saved > 0 ? "text-green-600" : "text-destructive")}>
                  ({saved > 0 ? `−${saved}%` : `+${Math.abs(saved)}%`})
                </span>
              </span>
            )}
          </div>

          <ul className="space-y-3">
            {items.map((item) => {
              const after = item.result?.size;
              const pct = after !== undefined ? Math.round((1 - after / item.file.size) * 100) : null;
              return (
                <li key={item.id} className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.previewUrl} alt="" className="h-20 w-full rounded-md bg-secondary object-contain sm:w-28" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.file.name}</p>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs sm:max-w-sm">
                      <div className="rounded bg-secondary px-2 py-1.5">
                        <span className="block text-muted-foreground">Before</span>
                        <span className="font-semibold">{formatBytes(item.file.size)}</span>
                      </div>
                      <div className="rounded bg-secondary px-2 py-1.5">
                        <span className="block text-muted-foreground">After</span>
                        <span className="font-semibold">
                          {item.status === "working" && <Loader2 className="inline h-3 w-3 animate-spin" />}
                          {item.status === "idle" && "—"}
                          {item.status === "error" && <span className="text-destructive">Error</span>}
                          {after !== undefined && (
                            <>
                              {formatBytes(after)}{" "}
                              <span className={cn("font-medium", (pct ?? 0) > 0 ? "text-green-600" : "text-destructive")}>
                                ({(pct ?? 0) > 0 ? `−${pct}%` : `+${Math.abs(pct ?? 0)}%`})
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {item.error && <p className="mt-1 text-xs text-destructive">{item.error}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.result && (
                      <button type="button" className="btn-outline btn-sm" onClick={() => downloadBlob(item.result!, item.result!.name)}>
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    )}
                    <button type="button" className="btn-ghost h-8 w-8 !p-0 text-destructive" onClick={() => remove(item.id)} aria-label={`Remove ${item.file.name}`} disabled={busy}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

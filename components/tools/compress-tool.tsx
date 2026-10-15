"use client";

import { useEffect, useRef, useState } from "react";
import { Archive, Download, Loader2, Trash2 } from "lucide-react";
import { Dropzone } from "@/components/dropzone";
import { cn, downloadBlob, formatBytes, uid } from "@/lib/utils";

type Format = "webp" | "jpg" | "png";

const MIME: Record<Format, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  png: "image/png",
};

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "working" | "done" | "error";
  out?: Blob;
  outName?: string;
}

function outputName(name: string, format: Format) {
  return `${name.replace(/\.[^.]+$/, "")}-compressed.${format}`;
}

export function CompressTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<Format>("webp");
  const [zipping, setZipping] = useState(false);
  const runId = useRef(0);
  const itemsRef = useRef<ImageItem[]>([]);
  itemsRef.current = items;

  function addFiles(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setItems((prev) => [
      ...prev,
      ...images.map<ImageItem>((file) => ({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      })),
    ]);
  }

  function remove(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  function clearAll() {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
  }

  // Re-compress whenever the files, quality or format change (debounced).
  const signature = items.map((i) => i.id).join(",");
  useEffect(() => {
    if (!signature) return;
    const myRun = ++runId.current;

    const timer = setTimeout(async () => {
      const { default: imageCompression } = await import("browser-image-compression");
      setItems((prev) => prev.map((i) => ({ ...i, status: "working" as const })));

      for (const item of itemsRef.current) {
        if (runId.current !== myRun) return; // a newer run took over
        try {
          const result = await imageCompression(item.file, {
            maxSizeMB: 100, // effectively unlimited, so the quality setting drives the size
            alwaysKeepResolution: true,
            useWebWorker: true,
            fileType: MIME[format],
            initialQuality: quality / 100,
          });
          if (runId.current !== myRun) return;
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done", out: result, outName: outputName(item.file.name, format) }
                : i,
            ),
          );
        } catch (err) {
          console.error(err);
          if (runId.current !== myRun) return;
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error" } : i)));
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [signature, quality, format]);

  const done = items.filter((i) => i.status === "done" && i.out);
  const originalTotal = done.reduce((s, i) => s + i.file.size, 0);
  const outTotal = done.reduce((s, i) => s + (i.out?.size ?? 0), 0);
  const saved = originalTotal ? Math.round((1 - outTotal / originalTotal) * 100) : 0;

  async function downloadZip() {
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      done.forEach((i) => zip.file(i.outName!, i.out!));
      downloadBlob(await zip.generateAsync({ type: "blob" }), "toolza-images.zip");
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card grid gap-6 p-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quality" className="flex items-center justify-between text-sm font-medium">
            Quality <span className="text-primary">{quality}%</span>
          </label>
          <input
            id="quality"
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            disabled={format === "png"}
            className="mt-3 w-full accent-[hsl(var(--primary))]"
          />
          {format === "png" && (
            <p className="mt-2 text-xs text-muted-foreground">
              PNG is lossless, so the quality slider has no effect. Use WebP or JPG for smaller files.
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">Output format</p>
          <div className="mt-3 inline-flex rounded-md border border-border p-1" role="radiogroup" aria-label="Output format">
            {(["webp", "jpg", "png"] as Format[]).map((f) => (
              <button
                key={f}
                role="radio"
                aria-checked={format === f}
                onClick={() => setFormat(f)}
                className={cn(
                  "rounded px-4 py-1.5 text-sm font-medium uppercase transition-colors",
                  format === f ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dropzone
        accept="image/*"
        label="Drag & drop images here"
        hint="JPG, PNG, WebP and more. Compression happens in your browser."
        onFiles={addFiles}
      />

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              {done.length > 0 ? (
                <>
                  <span className="font-medium">
                    {formatBytes(originalTotal)} → {formatBytes(outTotal)}
                  </span>{" "}
                  <span className={cn(saved >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                    ({saved >= 0 ? `${saved}% smaller` : `${Math.abs(saved)}% larger`})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Compressing…</span>
              )}
            </p>
            <div className="flex gap-2">
              {done.length > 1 && (
                <button type="button" className="btn-primary" onClick={downloadZip} disabled={zipping}>
                  {zipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                  Download all (ZIP)
                </button>
              )}
              <button type="button" className="btn-outline" onClick={clearAll}>
                Clear
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {items.map((item) => {
              const pct = item.out ? Math.round((1 - item.out.size / item.file.size) * 100) : 0;
              return (
                <li key={item.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt={`Preview of ${item.file.name}`}
                    className="h-20 w-20 shrink-0 rounded-md border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.file.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-md bg-muted px-3 py-2">
                        <p className="text-xs text-muted-foreground">Before</p>
                        <p className="font-medium">{formatBytes(item.file.size)}</p>
                      </div>
                      <div className="rounded-md bg-muted px-3 py-2">
                        <p className="text-xs text-muted-foreground">After</p>
                        <p className="font-medium">
                          {item.status === "done" && item.out ? (
                            <>
                              {formatBytes(item.out.size)}{" "}
                              <span className={cn("text-xs", pct >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                                {pct >= 0 ? `−${pct}%` : `+${Math.abs(pct)}%`}
                              </span>
                            </>
                          ) : item.status === "error" ? (
                            <span className="text-destructive">Failed</span>
                          ) : (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={item.status !== "done"}
                      onClick={() => item.out && downloadBlob(item.out, item.outName!)}
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                    <button
                      type="button"
                      className="btn-ghost h-10 w-10 p-0 text-destructive"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.file.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

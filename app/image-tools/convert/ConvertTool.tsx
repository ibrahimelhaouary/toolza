"use client";

import { Download, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { canvasToBlob, drawToCanvas, imageFormats, loadImage } from "@/lib/image";
import { cn, downloadBlob, formatBytes, uid } from "@/lib/utils";

interface Item {
  id: string;
  file: File;
  result?: Blob;
  name?: string;
  error?: string;
}

export default function ConvertTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<string>("image/webp");
  const [busy, setBusy] = useState(false);

  async function convertAll() {
    setBusy(true);
    const ext = imageFormats.find((f) => f.value === format)!.ext;
    const next: Item[] = [];
    for (const item of items) {
      try {
        const { img, url } = await loadImage(item.file);
        const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, format);
        URL.revokeObjectURL(url);
        const result = await canvasToBlob(canvas, format, 0.92);
        next.push({ ...item, result, name: `${item.file.name.replace(/\.[^.]+$/, "")}.${ext}`, error: undefined });
      } catch (e) {
        next.push({ ...item, result: undefined, error: e instanceof Error ? e.message : "Conversion failed" });
      }
    }
    setItems(next);
    setBusy(false);
  }

  async function downloadAll() {
    for (const i of items) {
      if (i.result && i.name) {
        downloadBlob(i.result, i.name);
        await new Promise((r) => setTimeout(r, 350));
      }
    }
  }

  const done = items.filter((i) => i.result);

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onFiles={(f) => setItems((p) => [...p, ...f.map((file) => ({ id: uid(), file }))])}
        title="Drag & drop images here, or click to browse"
        hint="JPG, PNG or WebP · batch supported · processed locally"
      />

      <div className="panel">
        <span className="label">Convert to</span>
        <div className="flex max-w-sm gap-1 rounded-md bg-secondary p-1" role="radiogroup" aria-label="Target format">
          {imageFormats.map((f) => (
            <button key={f.value} type="button" role="radio" aria-checked={format === f.value} onClick={() => setFormat(f.value)}
              className={cn("flex-1 rounded px-3 py-1.5 text-sm font-medium", format === f.value ? "bg-background shadow-sm" : "text-muted-foreground")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={convertAll} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Convert {items.length} {items.length === 1 ? "image" : "images"}
            </button>
            {done.length > 1 && (
              <button type="button" className="btn-outline" onClick={downloadAll}><Download className="h-4 w-4" /> Download all ({done.length})</button>
            )}
            <button type="button" className="btn-ghost" onClick={() => setItems([])} disabled={busy}>Clear all</button>
          </div>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{i.file.name}</p>
                  <p className={cn("text-xs", i.error ? "text-destructive" : "text-muted-foreground")}>
                    {i.error ?? (i.result ? `${formatBytes(i.file.size)} → ${formatBytes(i.result.size)}` : formatBytes(i.file.size))}
                  </p>
                </div>
                {i.result && i.name && (
                  <button type="button" className="btn-outline btn-sm" onClick={() => downloadBlob(i.result!, i.name!)}>
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                )}
                <button type="button" className="btn-ghost h-8 w-8 !p-0 text-destructive" aria-label={`Remove ${i.file.name}`} onClick={() => setItems((p) => p.filter((x) => x.id !== i.id))} disabled={busy}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

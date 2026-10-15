"use client";

import { ArrowDown, ArrowUp, Download, FileText, GripVertical, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadBlob, formatBytes, uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  file: File;
  pages: number | null;
  error?: string;
}

export default function MergeTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  async function addFiles(files: File[]) {
    setError(null);
    const { PDFDocument } = await import("pdf-lib");
    const added: Item[] = await Promise.all(
      files.map(async (file) => {
        const item: Item = { id: uid(), file, pages: null };
        try {
          const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
          item.pages = doc.getPageCount();
        } catch {
          item.error = "Could not read this PDF (it may be corrupted or password-protected).";
        }
        return item;
      })
    );
    setItems((prev) => [...prev, ...added]);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  const valid = items.filter((i) => !i.error);
  const totalPages = valid.reduce((sum, i) => sum + (i.pages ?? 0), 0);
  const totalSize = valid.reduce((sum, i) => sum + i.file.size, 0);

  async function merge() {
    if (valid.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const item of valid) {
        const src = await PDFDocument.load(await item.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "toolza-merged.pdf");
    } catch (e) {
      setError(e instanceof Error ? `Merge failed: ${e.message}` : "Merge failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="application/pdf,.pdf"
        onFiles={addFiles}
        title="Drag & drop PDF files here, or click to browse"
        hint="Add two or more PDFs · processed locally, never uploaded"
      />

      {items.length > 0 && (
        <div className="panel !p-0">
          <div className="flex items-center justify-between border-b px-4 py-3 text-sm">
            <span className="font-medium">
              {items.length} {items.length === 1 ? "file" : "files"}
            </span>
            <span className="text-muted-foreground">
              {totalPages} pages · {formatBytes(totalSize)}
            </span>
          </div>

          <ul>
            {items.map((item, i) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null) move(dragIndex, i);
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                className={cn(
                  "flex items-center gap-3 border-b px-3 py-3 last:border-b-0",
                  dragIndex === i && "opacity-40",
                  overIndex === i && dragIndex !== null && dragIndex !== i && "bg-accent"
                )}
              >
                <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-muted-foreground sm:block" aria-hidden="true" />
                <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className={cn("text-xs", item.error ? "text-destructive" : "text-muted-foreground")}>
                    {item.error ?? `${item.pages} ${item.pages === 1 ? "page" : "pages"} · ${formatBytes(item.file.size)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  <button type="button" className="btn-ghost h-8 w-8 !p-0" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${item.file.name} up`}>
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" className="btn-ghost h-8 w-8 !p-0" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${item.file.name} down`}>
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" className="btn-ghost h-8 w-8 !p-0 text-destructive" onClick={() => setItems((p) => p.filter((x) => x.id !== item.id))} aria-label={`Remove ${item.file.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={merge} disabled={busy || valid.length < 2}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {busy ? "Merging…" : "Merge PDFs"}
        </button>
        {items.length > 0 && (
          <button type="button" className="btn-outline" onClick={() => setItems([])} disabled={busy}>
            Clear all
          </button>
        )}
        {valid.length < 2 && (
          <span className="text-xs text-muted-foreground">Add at least 2 valid PDFs to merge.</span>
        )}
      </div>
    </div>
  );
}

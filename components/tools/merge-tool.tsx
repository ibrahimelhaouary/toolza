"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Download, FileText, GripVertical, Loader2, Trash2 } from "lucide-react";
import { Dropzone } from "@/components/dropzone";
import { cn, downloadBlob, formatBytes, uid } from "@/lib/utils";

interface PdfItem {
  id: string;
  file: File;
  pages: number | null;
  error?: string;
}

export function MergeTool() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  async function addFiles(files: File[]) {
    const pdfs = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (pdfs.length === 0) {
      setMessage("Please choose PDF files only.");
      return;
    }
    setMessage(pdfs.length < files.length ? "Some files were skipped because they are not PDFs." : null);

    const { PDFDocument } = await import("pdf-lib");
    const added: PdfItem[] = [];
    for (const file of pdfs) {
      try {
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        added.push({ id: uid(), file, pages: doc.getPageCount() });
      } catch {
        added.push({ id: uid(), file, pages: null, error: "Could not read this PDF" });
      }
    }
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
  const totalSize = items.reduce((sum, i) => sum + i.file.size, 0);

  async function merge() {
    if (valid.length < 2) return;
    setBusy(true);
    setMessage(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const item of valid) {
        const src = await PDFDocument.load(await item.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), "merged.pdf");
      setMessage(`Done! Merged ${valid.length} files into merged.pdf (${totalPages} pages).`);
    } catch (err) {
      console.error(err);
      setMessage("Merging failed. One of the files may be corrupted or protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Dropzone
        accept="application/pdf,.pdf"
        label="Drag & drop PDF files here"
        hint="Add two or more PDFs. Files are processed in your browser and never uploaded."
        onFiles={addFiles}
      />

      {items.length > 0 && (
        <div className="card divide-y divide-border">
          <div className="flex items-center justify-between p-4 text-sm">
            <span className="font-medium">
              {items.length} {items.length === 1 ? "file" : "files"} · {totalPages} pages · {formatBytes(totalSize)}
            </span>
            <button type="button" className="btn-ghost h-8 px-3 text-destructive" onClick={() => setItems([])}>
              Clear all
            </button>
          </div>
          <ul>
            {items.map((item, index) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(item.id);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
                onDrop={() => {
                  const from = items.findIndex((i) => i.id === dragId);
                  if (from >= 0) move(from, index);
                  setDragId(null);
                  setOverId(null);
                }}
                className={cn(
                  "flex items-center gap-3 p-3 sm:p-4",
                  overId === item.id && dragId !== item.id && "bg-primary/5",
                  dragId === item.id && "opacity-50",
                )}
              >
                <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-muted-foreground sm:block" />
                <FileText className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className={cn("text-xs", item.error ? "text-destructive" : "text-muted-foreground")}>
                    {item.error ?? `${item.pages} ${item.pages === 1 ? "page" : "pages"} · ${formatBytes(item.file.size)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    className="btn-ghost h-8 w-8 p-0"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move ${item.file.name} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost h-8 w-8 p-0"
                    onClick={() => move(index, index + 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${item.file.name} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost h-8 w-8 p-0 text-destructive"
                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary h-11 px-6" disabled={busy || valid.length < 2} onClick={merge}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {busy ? "Merging…" : "Merge & download"}
        </button>
        {valid.length < 2 && <span className="text-sm text-muted-foreground">Add at least 2 valid PDFs to merge.</span>}
      </div>

      {message && (
        <p role="status" className="rounded-md bg-muted px-4 py-3 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}

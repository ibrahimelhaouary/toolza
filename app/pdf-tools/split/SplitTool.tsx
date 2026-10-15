"use client";

import { Download, FileText, Loader2, Scissors } from "lucide-react";
import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadBlob, formatBytes } from "@/lib/utils";

/** "1-3, 5, 8-" → zero-based page indices. Returns an error string on invalid input. */
function parseRanges(input: string, total: number): number[] | string {
  const out: number[] = [];
  for (const part of input.split(",").map((p) => p.trim()).filter(Boolean)) {
    const m = part.match(/^(\d*)\s*-\s*(\d*)$/) ?? part.match(/^(\d+)$/);
    if (!m) return `Invalid range “${part}”.`;
    let a: number, b: number;
    if (m.length === 2) a = b = Number(m[1]);
    else {
      a = m[1] ? Number(m[1]) : 1;
      b = m[2] ? Number(m[2]) : total;
    }
    if (a < 1 || b > total || a > b) return `Range “${part}” is outside 1–${total}.`;
    for (let p = a; p <= b; p++) out.push(p - 1);
  }
  return out.length ? out : "Enter at least one page or range.";
}

export default function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: File[]) {
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      setFile(files[0]);
      setPages(doc.getPageCount());
      setRange("");
    } catch {
      setFile(null);
      setError("Could not read this PDF (it may be corrupted or password-protected).");
    }
  }

  const base = file?.name.replace(/\.pdf$/i, "") ?? "document";

  async function build(indices: number[]) {
    const { PDFDocument } = await import("pdf-lib");
    const src = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
    const out = await PDFDocument.create();
    (await out.copyPages(src, indices)).forEach((p) => out.addPage(p));
    return new Blob([(await out.save()) as BlobPart], { type: "application/pdf" });
  }

  async function extract() {
    const idx = parseRanges(range, pages);
    if (typeof idx === "string") return setError(idx);
    setError(null);
    setBusy(true);
    try {
      downloadBlob(await build(idx), `${base}-pages.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to extract pages.");
    } finally {
      setBusy(false);
    }
  }

  async function splitAll() {
    setError(null);
    setBusy(true);
    try {
      for (let i = 0; i < pages; i++) {
        downloadBlob(await build([i]), `${base}-page-${i + 1}.pdf`);
        await new Promise((r) => setTimeout(r, 350));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to split.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <FileDropzone accept="application/pdf,.pdf" multiple={false} onFiles={onFiles} title="Drag & drop a PDF here, or click to browse" hint="Processed locally, never uploaded" />

      {file && (
        <div className="panel space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{pages} pages · {formatBytes(file.size)}</p>
            </div>
          </div>
          <div>
            <label htmlFor="range" className="label">Pages to extract (e.g. 1-3, 5, 8-)</label>
            <input id="range" className="field" value={range} onChange={(e) => setRange(e.target.value)} placeholder={`1-${Math.min(3, pages)}`} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={extract} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />} Extract pages
            </button>
            <button type="button" className="btn-outline" onClick={splitAll} disabled={busy || pages < 2}>
              <Download className="h-4 w-4" /> Split every page ({pages} files)
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

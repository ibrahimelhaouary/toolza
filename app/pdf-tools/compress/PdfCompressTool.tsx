"use client";

import { Download, FileText, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { downloadBlob, formatBytes } from "@/lib/utils";

export default function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false });
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");
      const bytes = await doc.save({ useObjectStreams: true });
      setResult(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process this PDF.");
    } finally {
      setBusy(false);
    }
  }

  const saved = file && result ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="application/pdf,.pdf"
        multiple={false}
        onFiles={(f) => {
          setFile(f[0]);
          setResult(null);
          setError(null);
        }}
        title="Drag & drop a PDF here, or click to browse"
        hint="Lossless optimization · processed locally"
      />

      {file && (
        <div className="panel space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">Original: {formatBytes(file.size)}</p>
            </div>
          </div>

          {result && (
            <div className="rounded-md bg-secondary p-3 text-sm">
              Optimized: <strong>{formatBytes(result.size)}</strong>{" "}
              {saved > 0 ? (
                <span className="text-green-600">(−{saved}%)</span>
              ) : (
                <span className="text-muted-foreground">— this file is already well optimized; no meaningful savings possible without re-encoding images.</span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={run} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />} Compress PDF
            </button>
            {result && saved > 0 && (
              <button type="button" className="btn-outline" onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf")}>
                <Download className="h-4 w-4" /> Download
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

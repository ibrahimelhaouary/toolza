"use client";

import { GitCompare } from "lucide-react";
import { useState } from "react";
import { diffLines, type DiffRow } from "@/lib/text";
import { cn } from "@/lib/utils";

export default function DiffTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [rows, setRows] = useState<DiffRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function compare() {
    const key = (s: string) => {
      let k = s;
      if (ignoreWs) k = k.replace(/\s+/g, " ").trim();
      if (ignoreCase) k = k.toLowerCase();
      return k;
    };
    const result = diffLines(a.split("\n"), b.split("\n"), key);
    if (!result) {
      setRows(null);
      return setError("These texts are too large to compare in the browser. Try smaller sections.");
    }
    setError(null);
    setRows(result);
  }

  const added = rows?.filter((r) => r.type === "add").length ?? 0;
  const removed = rows?.filter((r) => r.type === "del").length ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="orig" className="label">Original text</label>
          <textarea id="orig" rows={10} className="field font-mono text-xs" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div>
          <label htmlFor="changed" className="label">Changed text</label>
          <textarea id="changed" rows={10} className="field font-mono text-xs" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="btn-primary" onClick={compare} disabled={!a && !b}>
          <GitCompare className="h-4 w-4" /> Compare
        </button>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} /> Ignore case</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} /> Ignore whitespace</label>
      </div>

      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      {rows && (
        <div className="panel !p-0 overflow-hidden">
          <div className="flex gap-4 border-b px-4 py-2 text-sm">
            <span className="text-green-600">+{added} added</span>
            <span className="text-destructive">−{removed} removed</span>
            {added + removed === 0 && <span className="text-muted-foreground">No differences found.</span>}
          </div>
          <pre className="max-h-[480px] overflow-auto text-xs leading-6">
            {rows.map((r, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre-wrap break-words px-4",
                  r.type === "add" && "bg-green-500/15",
                  r.type === "del" && "bg-red-500/15"
                )}
              >
                <span className="mr-2 inline-block w-3 select-none text-muted-foreground">{r.type === "add" ? "+" : r.type === "del" ? "−" : " "}</span>
                {r.text || " "}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

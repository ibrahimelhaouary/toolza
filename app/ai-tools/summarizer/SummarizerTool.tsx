"use client";

import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { summarize } from "@/lib/text";

export default function SummarizerTool() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [summary, setSummary] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText((summary ?? []).join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel space-y-3">
        <label htmlFor="sum-input" className="label">Text to summarize ({wordCount} words)</label>
        <textarea id="sum-input" rows={12} className="field" value={text} onChange={(e) => { setText(e.target.value); setSummary(null); }} placeholder="Paste an article, report or essay…" />
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sentences">Summary length</label>
            <select id="sentences" className="field !w-auto" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[1, 2, 3, 5, 7, 10].map((n) => <option key={n} value={n}>{n} {n === 1 ? "sentence" : "sentences"}</option>)}
            </select>
          </div>
          <button type="button" className="btn-primary" disabled={wordCount < 30} onClick={() => setSummary(summarize(text, count))}>
            <Sparkles className="h-4 w-4" /> Summarize
          </button>
          {wordCount > 0 && wordCount < 30 && <span className="text-xs text-muted-foreground">Add at least 30 words.</span>}
        </div>
      </div>

      {summary && (
        <div className="panel space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Summary</h2>
            <button type="button" className="btn-outline btn-sm" onClick={copy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {summary.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not enough full sentences to summarize.</p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {summary.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">Extractive summary generated locally in your browser.</p>
        </div>
      )}
    </div>
  );
}

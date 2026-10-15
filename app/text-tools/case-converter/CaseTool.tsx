"use client";

import { Check, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { toAlternating, toCamel, toKebab, toPascal, toSentence, toSnake, toTitle } from "@/lib/text";

const styles: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { label: "lower case", fn: (s) => s.toLowerCase() },
  { label: "Title Case", fn: toTitle },
  { label: "Sentence case", fn: toSentence },
  { label: "camelCase", fn: toCamel },
  { label: "PascalCase", fn: toPascal },
  { label: "snake_case", fn: toSnake },
  { label: "kebab-case", fn: toKebab },
  { label: "aLtErNaTiNg", fn: toAlternating },
];

export default function CaseTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="panel !p-3 sm:!p-4">
      <label htmlFor="case-input" className="sr-only">Your text</label>
      <textarea id="case-input" rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here…" className="field min-h-[220px] resize-y text-base" />
      <div className="mt-3 flex flex-wrap gap-2">
        {styles.map((s) => (
          <button key={s.label} type="button" className="btn-outline btn-sm" disabled={!text} onClick={() => setText((t) => s.fn(t))}>{s.label}</button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-primary btn-sm" onClick={copy} disabled={!text}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className="btn-ghost btn-sm text-destructive" onClick={() => setText("")} disabled={!text}>
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
    </div>
  );
}

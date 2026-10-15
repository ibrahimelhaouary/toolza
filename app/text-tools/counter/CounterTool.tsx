"use client";

import { Check, Copy, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const WPM_READ = 200;
const WPM_SPEAK = 130;

function toTitleCase(s: string) {
  return s.toLowerCase().replace(/(^|[\s\-_([{"'“‘])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

function toSentenceCase(s: string) {
  return s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

function formatMinutes(words: number, wpm: number) {
  if (words === 0) return "0 sec";
  const seconds = Math.round((words / wpm) * 60);
  if (seconds < 60) return `${seconds} sec`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} sec`;
}

export default function CounterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).length : 0;
    const lines = text ? text.split("\n").length : 0;
    return {
      words,
      chars,
      charsNoSpaces,
      paragraphs,
      sentences,
      lines,
      reading: formatMinutes(words, WPM_READ),
      speaking: formatMinutes(words, WPM_SPEAK),
    };
  }, [text]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const cards: { label: string; value: string | number }[] = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "No spaces", value: stats.charsNoSpaces },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Sentences", value: stats.sentences },
    { label: "Reading time", value: stats.reading },
  ];

  const converters: { label: string; fn: (s: string) => string }[] = [
    { label: "UPPER CASE", fn: (s) => s.toUpperCase() },
    { label: "lower case", fn: (s) => s.toLowerCase() },
    { label: "Title Case", fn: toTitleCase },
    { label: "Sentence case", fn: toSentenceCase },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border bg-card p-3 text-center">
            <p className="text-xl font-bold tabular-nums sm:text-2xl">{c.value}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="panel !p-3 sm:!p-4">
        <label htmlFor="text-input" className="sr-only">Your text</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          rows={14}
          spellCheck
          className="field min-h-[280px] resize-y text-base leading-relaxed"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {converters.map((c) => (
            <button key={c.label} type="button" className="btn-outline btn-sm" onClick={() => setText((t) => c.fn(t))} disabled={!text}>
              {c.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button type="button" className="btn-outline btn-sm" onClick={copy} disabled={!text}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="btn-ghost btn-sm text-destructive" onClick={() => setText("")} disabled={!text}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Speaking time: {stats.speaking} · Lines: {stats.lines} · Reading speed assumed at {WPM_READ} wpm.
      </p>
    </div>
  );
}

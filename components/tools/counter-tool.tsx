"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Eraser } from "lucide-react";

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "up"]);

function toTitleCase(text: string) {
  let first = true;
  return text
    .toLowerCase()
    .replace(/[\p{L}\p{N}'’]+/gu, (word) => {
      const isSmall = SMALL_WORDS.has(word) && !first;
      first = false;
      return isSmall ? word : word.charAt(0).toUpperCase() + word.slice(1);
    });
}

function toSentenceCase(text: string) {
  return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

function readingTime(words: number, wpm: number) {
  if (words === 0) return "0 sec";
  const seconds = Math.ceil((words / wpm) * 60);
  if (seconds < 60) return `${seconds} sec`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m} min ${s} sec` : `${m} min`;
}

export function CounterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    return {
      words,
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, "").length,
      sentences: (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).filter((s) => s.trim()).length,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0,
      lines: text ? text.split("\n").length : 0,
      reading: readingTime(words, 238),
      speaking: readingTime(words, 130),
    };
  }, [text]);

  const cards: [string, string | number][] = [
    ["Words", stats.words],
    ["Characters", stats.chars],
    ["No spaces", stats.charsNoSpaces],
    ["Sentences", stats.sentences],
    ["Paragraphs", stats.paragraphs],
    ["Reading time", stats.reading],
  ];

  const converters: [string, (t: string) => string][] = [
    ["UPPERCASE", (t) => t.toUpperCase()],
    ["lowercase", (t) => t.toLowerCase()],
    ["Title Case", toTitleCase],
    ["Sentence case", toSentenceCase],
  ];

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
    <div className="space-y-6" id="case">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="counter-text" className="sr-only">
          Your text
        </label>
        <textarea
          id="counter-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          rows={12}
          className="input min-h-[260px] resize-y leading-7"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {converters.map(([label, fn]) => (
          <button key={label} type="button" className="btn-outline" onClick={() => setText((t) => fn(t))} disabled={!text}>
            {label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn-outline" onClick={copy} disabled={!text}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setText("")} disabled={!text}>
            <Eraser className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Speaking time: {stats.speaking} · Lines: {stats.lines}
      </p>
    </div>
  );
}

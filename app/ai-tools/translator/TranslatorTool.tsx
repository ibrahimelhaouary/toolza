"use client";

import { ArrowLeftRight, Check, Copy, Languages as LanguagesIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { languages } from "@/lib/ai";

export default function TranslatorTool() {
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("en");
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);

    try {
      // تحديد زوج اللغات للترجمة
      const langPair = source === "auto" ? `autodetect|${target}` : `${source}|${target}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("فشل الاتصال بخدمة الترجمة");

      const data = await res.json();
      if (data.responseData && data.responseData.translatedText) {
        setOutput(data.responseData.translatedText);
      } else {
        throw new Error("تعذر الحصول على الترجمة، يرجى المحاولة لاحقاً.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed.");
    } finally {
      setBusy(false);
    }
  }

  function swap() {
    if (source === "auto") return;
    setSource(target);
    setTarget(source);
    setText(output);
    setOutput(text);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Source language"
            className="field !w-auto"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            {languages.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn-ghost h-9 w-9 !p-0"
            onClick={swap}
            disabled={source === "auto"}
            aria-label="Swap languages"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          <select
            aria-label="Target language"
            className="field !w-auto"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            {languages
              .filter(([v]) => v !== "auto")
              .map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <textarea
            aria-label="Text to translate"
            rows={8}
            className="field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate…"
          />
          <div className="relative">
            <textarea
              aria-label="Translation"
              rows={8}
              readOnly
              className="field bg-secondary/50"
              value={output}
              placeholder="Translation appears here…"
            />
            {output && (
              <button
                type="button"
                className="btn-outline btn-sm absolute bottom-2 right-2"
                onClick={copy}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={run}
          disabled={busy || !text.trim()}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LanguagesIcon className="h-4 w-4" />
          )}{" "}
          Translate
        </button>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

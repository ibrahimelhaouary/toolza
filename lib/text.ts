const words = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

export const toTitle = (s: string) =>
  s.toLowerCase().replace(/(^|[\s\-_([{"'“‘])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());

export const toSentence = (s: string) =>
  s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());

export const toCamel = (s: string) =>
  words(s).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join("");

export const toPascal = (s: string) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
export const toSnake = (s: string) => words(s).map((w) => w.toLowerCase()).join("_");
export const toKebab = (s: string) => words(s).map((w) => w.toLowerCase()).join("-");
export const toAlternating = (s: string) =>
  [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("");

export type DiffRow = { type: "same" | "add" | "del"; text: string };

/** Line diff using longest common subsequence. Returns null if inputs are too large. */
export function diffLines(a: string[], b: string[], key: (s: string) => string): DiffRow[] | null {
  const n = a.length;
  const m = b.length;
  if (n * m > 25_000_000) return null;
  const ka = a.map(key);
  const kb = b.map(key);
  const w = m + 1;
  const dp = new Uint32Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * w + j] = ka[i] === kb[j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    }
  }
  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (ka[i] === kb[j]) {
      rows.push({ type: "same", text: b[j] });
      i++;
      j++;
    } else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) {
      rows.push({ type: "del", text: a[i++] });
    } else {
      rows.push({ type: "add", text: b[j++] });
    }
  }
  while (i < n) rows.push({ type: "del", text: a[i++] });
  while (j < m) rows.push({ type: "add", text: b[j++] });
  return rows;
}

const STOP = new Set(
  "the and for are but not you all any can had her was one our out has have this that with from they will would there their what about which when your said each she how them these than then into some could other been were more also its who its very just over such only like most"
    .split(" ")
);

/** Extractive summary: scores sentences by word frequency and keeps the top `count` in original order. */
export function summarize(text: string, count: number): string[] {
  const sentences = (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).map((s) => s.trim()).filter((s) => s.length > 20);
  if (sentences.length <= count) return sentences;
  const freq = new Map<string, number>();
  const tok = (s: string) => (s.toLowerCase().match(/\p{L}{3,}/gu) ?? []).filter((w) => !STOP.has(w));
  sentences.forEach((s) => tok(s).forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1)));
  const scored = sentences.map((s, i) => {
    const t = tok(s);
    const score = t.reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) / Math.sqrt(t.length || 1);
    return { s, i, score };
  });
  return scored
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .sort((x, y) => x.i - y.i)
    .map((x) => x.s);
}

export const languages = [
  ["auto", "Detect language"],
  ["en", "English"],
  ["ar", "Arabic"],
  ["fr", "French"],
  ["es", "Spanish"],
  ["de", "German"],
  ["it", "Italian"],
  ["pt", "Portuguese"],
  ["tr", "Turkish"],
  ["ru", "Russian"],
  ["zh", "Chinese"],
  ["ja", "Japanese"],
] as const;

export const translateEndpoint = process.env.NEXT_PUBLIC_TRANSLATE_ENDPOINT ?? "";

/**
 * Translation adapter. Point NEXT_PUBLIC_TRANSLATE_ENDPOINT at any service that accepts
 * POST { text, source, target } and returns { translation }.
 */
export async function translate(text: string, source: string, target: string): Promise<string> {
  if (!translateEndpoint) throw new Error("NO_PROVIDER");
  const res = await fetch(translateEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });
  if (!res.ok) throw new Error(`Translation service returned ${res.status}.`);
  const data = (await res.json()) as { translation?: string };
  if (!data.translation) throw new Error("Unexpected response from translation service.");
  return data.translation;
}

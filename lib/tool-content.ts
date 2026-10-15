import type { Tool } from "@/types";

type Extra = Pick<Tool, "status" | "howTo" | "faqs">;

const privacyFaq = (what: string) => ({
  q: "Is my data uploaded to a server?",
  a: `No. ${what} is processed entirely in your browser, so your content never leaves your device.`,
});

export const extraContent: Record<string, Extra> = {
  "pdf-split": {
    status: "live",
    howTo: [
      "Upload a PDF file.",
      "Enter the pages you want, such as 1-3, 5, 8- (a trailing dash means “to the end”).",
      "Click “Extract pages” for one PDF, or “Split every page” for one file per page.",
      "Your files download instantly.",
    ],
    faqs: [
      { q: "How do I write page ranges?", a: "Separate ranges with commas: “1-3, 5, 8-” extracts pages 1 to 3, page 5 and everything from page 8 onward." },
      privacyFaq("Your PDF"),
      { q: "Does splitting reduce quality?", a: "No. Pages are copied as they are, so text and images keep their original quality." },
    ],
  },
  "pdf-compress": {
    status: "live",
    howTo: [
      "Upload a PDF file.",
      "Click “Compress PDF”. The file is optimized and its metadata is stripped.",
      "Compare the before and after sizes.",
      "Download the optimized PDF.",
    ],
    faqs: [
      { q: "How much will my PDF shrink?", a: "Browser-side optimization repackages the PDF structure losslessly. PDFs with many small objects often shrink noticeably; PDFs made mostly of large photos may change little because images are not re-encoded." },
      { q: "Will quality change?", a: "No. This is lossless, so text, fonts and images stay exactly as they were." },
      privacyFaq("Your PDF"),
    ],
  },
  "image-resize": {
    status: "live",
    howTo: [
      "Upload an image.",
      "Enter a new width or height, or switch to percentage mode. Keep the aspect-ratio lock on to avoid distortion.",
      "Pick an output format and quality.",
      "Click “Resize” and download the result.",
    ],
    faqs: [
      { q: "Will resizing blur my image?", a: "Making an image smaller keeps it sharp. Enlarging it beyond its original size cannot add detail and may look soft." },
      { q: "Which format should I export?", a: "Use JPG or WebP for photos and PNG for graphics that need transparency." },
      privacyFaq("Your image"),
    ],
  },
  "image-convert": {
    status: "live",
    howTo: [
      "Drop one or more images into the upload area.",
      "Choose the target format: JPG, PNG or WebP.",
      "Click “Convert”.",
      "Download each file or all of them.",
    ],
    faqs: [
      { q: "What happens to transparency when converting to JPG?", a: "JPG has no transparency, so transparent areas are filled with white." },
      { q: "Can I convert many images at once?", a: "Yes. Add as many files as your device can handle and convert them in one go." },
      privacyFaq("Your images"),
    ],
  },
  "case-converter": {
    status: "live",
    howTo: [
      "Type or paste your text.",
      "Click the case style you want: UPPER, lower, Title, Sentence, camelCase, snake_case and more.",
      "Copy the converted text.",
    ],
    faqs: [
      { q: "What is Title Case?", a: "Title Case capitalizes the first letter of every word, for example “The Quick Brown Fox”." },
      { q: "When should I use camelCase or snake_case?", a: "They are naming styles for code. camelCase is common in JavaScript, snake_case in Python and databases." },
      privacyFaq("Your text"),
    ],
  },
  "diff-checker": {
    status: "live",
    howTo: [
      "Paste the original text on the left and the changed text on the right.",
      "Optionally ignore case or extra whitespace.",
      "Click “Compare”.",
      "Added lines are highlighted green and removed lines red.",
    ],
    faqs: [
      { q: "How does the comparison work?", a: "The tool compares the two texts line by line and finds the longest common sequence of lines, then marks everything else as added or removed." },
      { q: "Is there a size limit?", a: "Very large inputs (millions of line pairs) are rejected to keep your browser responsive." },
      privacyFaq("Your text"),
    ],
  },
  "ai-summarizer": {
    status: "live",
    howTo: [
      "Paste an article or document.",
      "Choose how many sentences the summary should have.",
      "Click “Summarize”.",
      "Copy the key points.",
    ],
    faqs: [
      { q: "Does this use a large language model?", a: "This version uses extractive summarization that runs in your browser: it ranks sentences by how many important words they contain and keeps the best ones. It never rewrites text." },
      { q: "Can it be connected to an AI provider?", a: "Yes. The summarize function in lib/ai.ts is a single adapter you can point at any LLM API." },
      privacyFaq("Your text"),
    ],
  },
  "ai-translator": {
    status: "live",
    howTo: [
      "Choose the source and target languages.",
      "Type or paste your text.",
      "Click “Translate”.",
      "Copy the translation.",
    ],
    faqs: [
      { q: "Why does the translator ask for a provider?", a: "Translation needs a translation service. This interface is ready to use: set NEXT_PUBLIC_TRANSLATE_ENDPOINT to your provider's endpoint." },
      { q: "What does the endpoint receive?", a: "A JSON POST with text, source and target. It must return JSON with a translation field." },
      { q: "Is my text stored?", a: "Toolza does not store it. If you connect a provider, that provider's privacy policy applies." },
    ],
  },
};

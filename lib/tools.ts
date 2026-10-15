import type { Category, CategoryId, Tool } from "@/types";

export const categories: Category[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split and compress PDFs privately.",
    icon: "FileText",
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Compress, resize and convert images.",
    icon: "Image",
  },
  {
    id: "text",
    name: "Text & Writing",
    description: "Count, convert and compare text instantly.",
    icon: "Type",
  },
  {
    id: "career",
    name: "Career & CV",
    description: "Build a professional resume in minutes.",
    icon: "Briefcase",
  },
  {
    id: "ai",
    name: "AI Utilities",
    description: "Summarize and translate with AI helpers.",
    icon: "Sparkles",
  },
];

const baseTools: Tool[] = [
  // ---------------------------------------------------------------- PDF
  {
    slug: "pdf-merge",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document. 100% in your browser.",
    category: "pdf",
    href: "/pdf-tools/merge",
    icon: "Merge",
    status: "live",
    keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger online free"],
    howTo: [
      "Drag and drop your PDF files into the upload area, or click to browse.",
      "Reorder the files by dragging them or using the up/down arrows.",
      "Click “Merge PDFs” to combine them into a single document.",
      "Your merged PDF downloads instantly — nothing is ever uploaded to a server.",
    ],
    faqs: [
      {
        q: "Are my PDF files uploaded anywhere?",
        a: "No. Toolza merges your PDFs entirely inside your browser using JavaScript. Your files never leave your device, so your documents stay private.",
      },
      {
        q: "Is there a limit on the number of files or pages?",
        a: "There is no fixed limit. Practical limits depend on your device's memory — most modern computers handle hundreds of pages without problems.",
      },
      {
        q: "Can I merge password-protected PDFs?",
        a: "Files protected with an owner password usually work. PDFs that require a password to open must be unlocked first.",
      },
    ],
  },
  {
    slug: "pdf-split",
    title: "Split PDF",
    description: "Extract pages or split a PDF into separate files.",
    category: "pdf",
    href: "/pdf-tools/split",
    icon: "Scissors",
    status: "soon",
    keywords: ["split pdf", "extract pdf pages"],
    howTo: [],
    faqs: [],
  },
  {
    slug: "pdf-compress",
    title: "Compress PDF",
    description: "Reduce PDF file size while keeping quality.",
    category: "pdf",
    href: "/pdf-tools/compress",
    icon: "FileDown",
    status: "soon",
    keywords: ["compress pdf", "reduce pdf size"],
    howTo: [],
    faqs: [],
  },
  // -------------------------------------------------------------- Image
  {
    slug: "image-compress",
    title: "Image Compressor",
    description: "Shrink JPG, PNG and WebP images with a quality slider and format switcher.",
    category: "image",
    href: "/image-tools/compress",
    icon: "Minimize2",
    status: "live",
    keywords: ["compress image", "image optimizer", "reduce image size", "jpg to webp"],
    howTo: [
      "Drop one or more images (JPG, PNG or WebP) into the upload area.",
      "Choose an output format and set the quality with the slider.",
      "Click “Compress” and compare the before and after file sizes.",
      "Download each image individually or all of them at once.",
    ],
    faqs: [
      {
        q: "Does compressing reduce image quality?",
        a: "Lossy formats (WebP and JPG) trade a small amount of detail for a much smaller file. Quality 70–85% is usually visually identical for photos.",
      },
      {
        q: "Which format should I choose?",
        a: "WebP gives the smallest files and is supported by all modern browsers. JPG is the most compatible for photos; PNG is lossless and best for graphics with transparency.",
      },
      {
        q: "Are my images uploaded?",
        a: "No. Compression runs locally in your browser using Web Workers, so your images never leave your device.",
      },
    ],
  },
  {
    slug: "image-resize",
    title: "Image Resizer",
    description: "Resize images by pixels or percentage.",
    category: "image",
    href: "/image-tools/resize",
    icon: "Maximize2",
    status: "soon",
    keywords: ["resize image"],
    howTo: [],
    faqs: [],
  },
  {
    slug: "image-convert",
    title: "Image Converter",
    description: "Convert between JPG, PNG and WebP.",
    category: "image",
    href: "/image-tools/convert",
    icon: "RefreshCw",
    status: "soon",
    keywords: ["convert image", "png to jpg"],
    howTo: [],
    faqs: [],
  },
  // --------------------------------------------------------------- Text
  {
    slug: "word-counter",
    title: "Word & Text Counter",
    description: "Live word, character, paragraph and reading-time stats with case converters.",
    category: "text",
    href: "/text-tools/counter",
    icon: "Hash",
    status: "live",
    keywords: ["word counter", "character counter", "reading time", "case converter"],
    howTo: [
      "Type or paste your text into the editor.",
      "Watch words, characters, paragraphs and reading time update in real time.",
      "Use the case buttons to convert to UPPER, lower, Title or Sentence case.",
      "Copy the result with one click.",
    ],
    faqs: [
      {
        q: "How is reading time calculated?",
        a: "We assume an average adult reading speed of 200 words per minute, and 130 words per minute for speaking time.",
      },
      {
        q: "What counts as a word?",
        a: "Any sequence of characters separated by whitespace. Hyphenated words such as “well-known” count as one word.",
      },
      {
        q: "Is my text stored?",
        a: "No. Everything is calculated in your browser and nothing is sent to our servers.",
      },
    ],
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description: "Switch text between upper, lower, title and sentence case.",
    category: "text",
    href: "/text-tools/case-converter",
    icon: "CaseSensitive",
    status: "soon",
    keywords: ["case converter"],
    howTo: [],
    faqs: [],
  },
  {
    slug: "diff-checker",
    title: "Diff Checker",
    description: "Compare two texts and highlight the differences.",
    category: "text",
    href: "/text-tools/diff",
    icon: "GitCompare",
    status: "soon",
    keywords: ["diff checker", "compare text"],
    howTo: [],
    faqs: [],
  },
  // ------------------------------------------------------------- Career
  {
    slug: "cv-builder",
    title: "Quick Resume Builder",
    description: "Build a clean, ATS-friendly CV with a live A4 preview and instant PDF export.",
    category: "career",
    href: "/cv-tools/builder",
    icon: "FileUser",
    status: "live",
    keywords: ["resume builder", "cv maker", "free cv builder", "ats resume"],
    howTo: [
      "Fill in your personal details, summary, experience, education and skills on the left.",
      "Watch the A4 preview on the right update as you type.",
      "Pick an accent color that suits your industry.",
      "Click “Download PDF” and choose “Save as PDF” in the print dialog.",
    ],
    faqs: [
      {
        q: "Is the CV builder really free?",
        a: "Yes — no sign-up, no watermark and no paywall. Your data is saved only in your browser's local storage.",
      },
      {
        q: "How do I get a PDF?",
        a: "Click “Download PDF”, then choose “Save as PDF” as the destination in your browser's print dialog. Turn off “Headers and footers” for the cleanest result.",
      },
      {
        q: "Where is my data stored?",
        a: "Only on your device, in localStorage. Clearing your browser data removes it. Nothing is sent to a server.",
      },
    ],
  },
  // ----------------------------------------------------------------- AI
  {
    slug: "ai-summarizer",
    title: "AI Summarizer",
    description: "Condense long articles into key points.",
    category: "ai",
    href: "/ai-tools/summarizer",
    icon: "Sparkles",
    status: "soon",
    keywords: ["ai summarizer", "text summarizer"],
    howTo: [],
    faqs: [],
  },
  {
    slug: "ai-translator",
    title: "AI Translator",
    description: "Translate text between languages instantly.",
    category: "ai",
    href: "/ai-tools/translator",
    icon: "Languages",
    status: "soon",
    keywords: ["ai translator", "translate text"],
    howTo: [],
    faqs: [],
  },
];

import { extraContent } from "@/lib/tool-content";

export const tools: Tool[] = baseTools.map((t) => ({ ...t, ...extraContent[t.slug] }));

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const toolsByCategory = (id: CategoryId) => tools.filter((t) => t.category === id);
export const liveTools = () => tools.filter((t) => t.status === "live");

/** Case-insensitive match against title, description, keywords and category name. */
export function searchTools(query: string, list: Tool[] = tools): Tool[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return list;
  return list.filter((t) => {
    const haystack = [t.title, t.description, getCategory(t.category).name, ...t.keywords]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

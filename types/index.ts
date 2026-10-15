export type CategoryId = "pdf" | "image" | "text" | "career" | "ai";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  href: string;
  icon: string;
  /** "live" tools are fully implemented, "soon" tools show a badge and are not linked. */
  status: "live" | "soon";
  keywords: string[];
  howTo: string[];
  faqs: FAQ[];
}

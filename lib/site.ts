export const siteConfig = {
  name: "Toolza",
  slogan: "Your Free Everyday Online Toolkit",
  description:
    "Free online tools for PDF, images, text and your CV. Everything runs privately in your browser — your files never leave your device.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolza.app").replace(/\/$/, ""),
  email: "contact@toolza.app",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  adSlots: {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
    infeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED ?? "",
  },
};

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

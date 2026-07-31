import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://emperor-foods.vatisp.chatgpt.site";
  const editorial = ["emperor-story", "history-of-mooncake", "pink-blue-mooncake", "mid-autumn-festival-2026", "corporate-mooncake-gifts", "mooncake-guide"];
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#story`, changeFrequency: "monthly", priority: .7 },
    { url: `${base}/#collection`, changeFrequency: "weekly", priority: .9 },
    { url: `${base}/#corporate`, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/#guide`, changeFrequency: "monthly", priority: .7 },
    ...editorial.map((slug) => ({ url: `${base}/${slug}`, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}

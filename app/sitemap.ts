import type { MetadataRoute } from "next";

const BASE_URL = "https://milestonestudio.nikhilsai.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/alternatives`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Editor is noindex but still submit for crawl reference
    // Remove if you don't want it in sitemap
    // {
    //   url: `${BASE_URL}/editor`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.3,
    // },
  ];
}
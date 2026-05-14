import type { MetadataRoute } from "next";

const BASE_URL = "https://milestonestudio.nikhilsai.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/landing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },

    // SEO / comparison pages
    {
      url: `${BASE_URL}/alternatives`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },

    // Future SEO pages (add the route files when ready)
    // {
    //   url: `${BASE_URL}/use-cases/indie-hackers`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.75,
    // },
    // {
    //   url: `${BASE_URL}/use-cases/open-source`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.75,
    // },
    // {
    //   url: `${BASE_URL}/use-cases/creators`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.75,
    // },
    // {
    //   url: `${BASE_URL}/use-cases/founders`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.75,
    // },

    // Comparison vs specific tools
    // {
    //   url: `${BASE_URL}/vs/canva`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
    // {
    //   url: `${BASE_URL}/vs/figma`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
    // {
    //   url: `${BASE_URL}/vs/adobe-express`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
  ];
}

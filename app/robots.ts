import type { MetadataRoute } from "next";

const BASE_URL = "https://milestonestudio.nikhilsai.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/editor"], // no value indexing the editor tool UI
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
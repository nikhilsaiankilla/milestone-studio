// Example: Using SEO utilities for a new page
// Copy this template when creating new pages

import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo-utils";
import { WebAppStructuredData, BreadcrumbStructuredData } from "@/components/structured-data";

// Page-specific metadata
export const metadata: Metadata = createPageMetadata(
  "Page Title | Milestone Studio",
  "Page description for search results and social sharing",
  ["keyword1", "keyword2", "keyword3"],
  "/page-path",
  "/og-image-path.png"
);

// Or use custom metadata for more control:
export const metadata2: Metadata = {
  title: "Custom Title",
  description: "Custom description",
  keywords: ["keyword1", "keyword2"],
  alternates: { canonical: "/custom-path" },
};

export default function ExamplePage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Current Page", url: "/current" },
  ];

  return (
    <>
      {/* Add structured data */}
      <WebAppStructuredData />
      <BreadcrumbStructuredData items={breadcrumbs} />

      {/* Page content */}
      <main>
        <h1>Your Page Content</h1>
        {/* ... */}
      </main>
    </>
  );
}

import type { Metadata } from "next";

const BASE_URL = "https://milestonestudio.nikhilsai.in";
const BRAND_NAME = "Milestone Studio";
const AUTHOR_NAME = "Nikhil Sai";
const AUTHOR_URL = "https://nikhilsai.in";
const TWITTER_HANDLE = "@itzznikhilsai";

export const seoConfig = {
  baseUrl: BASE_URL,
  brandName: BRAND_NAME,
  authorName: AUTHOR_NAME,
  authorUrl: AUTHOR_URL,
  twitterHandle: TWITTER_HANDLE,
};

// Schema.org JSON-LD for Organization
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Free milestone card generator for creators, founders, and entrepreneurs",
    sameAs: [
      `https://twitter.com/${TWITTER_HANDLE}`,
      `${AUTHOR_URL}`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: AUTHOR_URL,
    },
  };
}

// Schema.org JSON-LD for WebApplication
export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: BRAND_NAME,
    description:
      "Create beautiful milestone cards with custom gradients, fonts, and themes. Free PNG export.",
    url: BASE_URL,
    applicationCategory: "DesignApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    creator: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    image: `${BASE_URL}/og-image.png`,
    screenshot: `${BASE_URL}/og-image.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "100",
    },
  };
}

// Schema.org JSON-LD for BreadcrumbList
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

// Enhanced metadata factory
export function createPageMetadata(
  title: string,
  description: string,
  keywords: string[],
  path: string = "/",
  imageUrl: string = "/og-image.png"
): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      siteName: BRAND_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${BASE_URL}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}${imageUrl}`],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
  };
}

// FAQ Schema
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb navigation
export const breadcrumbs = {
  home: { name: "Home", url: "/" },
  editor: { name: "Editor", url: "/editor" },
  about: { name: "About", url: "/about" },
};

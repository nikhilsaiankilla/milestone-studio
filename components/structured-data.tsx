/**
 * JSON-LD structured data for Milestone Studio.
 * Drop <StructuredData /> into any page's <head> or directly in the page body.
 * Next.js script tags in the body are fine for JSON-LD.
 */

const BASE_URL = "https://milestonestudio.nikhilsai.in";

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Milestone Studio",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Free milestone card generator for creators, founders, and entrepreneurs",
    sameAs: [
      "https://twitter.com/itzznikhilsai",
      "https://nikhilsai.in",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://nikhilsai.in",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebAppStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Milestone Studio",
    url: BASE_URL,
    description:
      "Free milestone card generator for creators and founders. Customize gradients, fonts, metrics, and export up to 6K PNG.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript, works on all modern browsers",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: "Nikhil Sai",
      url: "https://nikhilsai.in",
    },
    creator: {
      "@type": "Person",
      name: "Nikhil Sai",
      url: "https://nikhilsai.in",
    },
    featureList: [
      "Milestone card templates",
      "Gradient library",
      "Typography controls",
      "Platform branding",
      "Up to 6K PNG export",
      "Emoji overlays",
      "No account required",
      "Instant sharing",
      "Custom metrics",
      "Multiple themes",
    ],
    image: `${BASE_URL}/og-image.png`,
    screenshot: `${BASE_URL}/og-image.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "100",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Milestone Studio free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — completely free, no account required. Open the editor and start creating.",
        },
      },
      {
        "@type": "Question",
        name: "What export resolutions are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Low (1x), Medium (2x), High (3x), 2K, 4K, and 6K. All exported as PNG.",
        },
      },
      {
        "@type": "Question",
        name: "What platforms can I share my milestone card on?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Any platform that accepts image uploads — Twitter/X, LinkedIn, Instagram, YouTube Community, Product Hunt, Indie Hackers, and more.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a watermark on exported cards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Milestone Studio does not add any watermark to exported cards.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize the design of my milestone card?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Customize gradients, fonts, metrics, platform branding, add emojis, and choose from multiple themes and templates.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No account needed. Milestone Studio is completely anonymous. Open the editor, create your card, and export instantly.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Milestone Studio",
    description:
      "Free online tool to create beautiful milestone cards with custom gradients, fonts, and themes.",
    image: `${BASE_URL}/og-image.png`,
    brand: {
      "@type": "Brand",
      name: "Milestone Studio",
    },
    offers: {
      "@type": "Offer",
      url: BASE_URL,
      priceCurrency: "USD",
      price: "0",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "100",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
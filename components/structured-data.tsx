/**
 * JSON-LD structured data for Milestone Studio.
 * Drop <StructuredData /> into any page's <head> or directly in the page body.
 * Next.js script tags in the body are fine for JSON-LD.
 */

const BASE_URL = "https://milestonestudio.nikhilsai.in";

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
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
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
    ],
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
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
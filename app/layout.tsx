import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

import {
  Inter,
  Roboto,
  Playfair_Display,
  Space_Grotesk,
  Syne,
  DM_Sans,
} from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const BASE_URL = "https://milestonestudio.nikhilsai.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Milestone Studio — Beautiful Milestone Cards for Creators & Founders",
    template: "%s | Milestone Studio",
  },

  description:
    "Turn your growth numbers into shareable milestone cards. Customize gradients, fonts, and layouts — export high-quality PNG for Twitter, LinkedIn, Instagram instantly. Free milestone card maker for creators, founders, and entrepreneurs.",

  keywords: [
    "milestone card generator",
    "social media milestone card",
    "twitter milestone card",
    "instagram milestone post",
    "linkedin growth post",
    "creator milestone card",
    "milestone graphics",
    "share achievements online",
    "png card generator",
    "growth milestone design",
    "free milestone card maker",
    "achievement card generator",
    "MRR milestone card",
    "revenue milestone design",
    "startup growth tracker",
    "business milestone design",
    "achievement graphics maker",
    "custom milestone template",
    "social proof graphics",
    "growth metric designer",
  ],

  applicationName: "Milestone Studio",
  category: "productivity",
  authors: [{ name: "Nikhil Sai", url: "https://nikhilsai.in" }],
  creator: "Nikhil Sai",
  publisher: "Milestone Studio",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Milestone Studio — Beautiful Milestone Cards for Growth Tracking",
    description:
      "Create stunning milestone cards with custom gradients, fonts, themes, and instant PNG export. Free for creators, founders, and entrepreneurs. No login required.",
    url: BASE_URL,
    siteName: "Milestone Studio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Milestone Studio — Beautiful Milestone Cards for Creators and Founders",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Milestone Studio — Create Beautiful Achievement Cards",
    description:
      "Free milestone card maker for creators, founders, and brands. Design achievement graphics with custom gradients and export 6K PNG instantly.",
    images: ["/og-image.png"],
    creator: "@itzznikhilsai",
    site: "@itzznikhilsai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Milestone Studio",
    description:
      "Create beautiful milestone cards with custom gradients, fonts, and themes. Free PNG export for creators and founders.",
    url: BASE_URL,
    applicationCategory: "DesignApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Nikhil Sai",
      url: "https://nikhilsai.in",
    },
    creator: {
      "@type": "Person",
      name: "Nikhil Sai",
    },
    image: "/og-image.png",
    screenshot: "/og-image.png",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Milestone Studio" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`min-h-screen w-full text-foreground font-sans antialiased bg-black
          ${roboto.variable} 
          ${inter.variable} 
          ${playfair.variable} 
          ${spaceGrotesk.variable} 
          ${syne.variable} 
          ${dmSans.variable}`}
        suppressHydrationWarning
      >
        <Toaster />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
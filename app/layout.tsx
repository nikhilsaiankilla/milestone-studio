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
    "Turn your growth numbers into shareable milestone cards. Customize gradients, fonts, and layouts — export high-quality PNG for Twitter, LinkedIn, Instagram instantly. Free.",

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
  ],

  applicationName: "Milestone Studio",
  authors: [{ name: "Nikhil Sai", url: "https://nikhilsai.in" }],
  creator: "Nikhil Sai",
  publisher: "Milestone Studio",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Milestone Studio — Beautiful Milestone Cards",
    description:
      "Create beautiful milestone cards with gradients, custom fonts, themes, and instant PNG export. Free for creators and founders.",
    url: BASE_URL,
    siteName: "Milestone Studio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Milestone Studio — Beautiful Milestone Cards for Creators",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Milestone Studio — Beautiful Milestone Cards",
    description:
      "Create beautiful milestone cards for creators, founders, and brands. Free, no login, export up to 6K PNG.",
    images: ["/og-image.png"],
    creator: "@itzznikhilsai",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen w-full bg-background text-foreground font-sans antialiased 
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
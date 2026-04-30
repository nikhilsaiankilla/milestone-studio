import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"

import { Inter, Roboto, Playfair_Display, Space_Grotesk, Syne, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400", "700", "900"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400", "700"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["400", "700", "800"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "700"] });

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Milestone Studio | Create Beautiful Milestone Cards for Social Media",
  description:
    "Design stunning milestone cards for Twitter, Instagram, LinkedIn, YouTube and more. Customize typography, themes, gradients, aspect ratios, and export high-quality PNGs instantly.",

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
  ],

  applicationName: "Milestone Studio",

  authors: [{ name: "Milestone Studio" }],
  creator: "Milestone Studio",
  publisher: "Milestone Studio",

  metadataBase: new URL("https://milestonestudio.nikhilsai.in"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Milestone Studio",
    description:
      "Create beautiful milestone cards with gradients, custom fonts, themes, and instant PNG export.",
    url: "https://milestonestudio.nikhilsai.in",
    siteName: "Milestone Studio",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Milestone Studio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Milestone Studio",
    description:
      "Create beautiful milestone cards for creators, founders, and brands.",
    images: ["/og-image.png"],
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
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen w-full bg-background text-foreground font-sans antialiased 
          ${roboto.variable} 
          ${inter.variable} 
          ${playfair.variable} 
          ${spaceGrotesk.variable} 
          ${syne.variable} 
          ${dmSans.variable}`
        }
        suppressHydrationWarning
      >
        <Toaster />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

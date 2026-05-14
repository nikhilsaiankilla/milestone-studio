import type { Metadata } from "next";
import Hero from '@/components/landing/Hero'
import FinalCTA from '@/components/landing/FinalCTA'
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import FoundersNote from "@/components/landing/FoundersNote";
import FAQ from "@/components/landing/FAQ";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Milestone Studio — Beautiful Milestone Cards for Founders & Creators",
  description:
    "Turn your growth numbers into shareable milestone cards. No login, no friction. Create beautiful achievement graphics in seconds and export as PNG. Perfect for indie hackers, open source maintainers, and creators.",
  alternates: { canonical: "/landing" },
  keywords: [
    "milestone card generator",
    "growth milestone card",
    "achievement graphics",
    "founder journey",
    "startup milestones",
    "MRR card",
    "GitHub stars card",
    "follower milestone",
    "indie hacker tools",
    "build in public tools",
  ],
  openGraph: {
    title: "Milestone Studio — Beautiful Milestone Cards",
    description: "Turn your growth numbers into shareable milestone cards. No login, no friction.",
    type: "website",
    url: "https://milestonestudio.nikhilsai.in/landing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milestone Studio — Beautiful Milestone Cards",
    description: "Turn your growth numbers into shareable milestone cards. No login, no friction.",
    creator: "@itzznikhilsai",
  },
};

const page = () => {
  return (
    <div className='w-full bg-black'>
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <FoundersNote />
      <FAQ />
      <FinalCTA />
      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
        <span>© {new Date().getFullYear()} Milestone Studio</span>
        <div className="flex items-center gap-6">
          <Link href="/landing" className="hover:text-white/50 transition-colors">Home</Link>
          <Link href="/" className="hover:text-white/50 transition-colors">Editor</Link>
          <Link href="/alternatives" className="hover:text-white/50 transition-colors">Alternatives</Link>
          <Link href="https://github.com/nikhilsaiankilla/milestone-studio" target="_blank" className="hover:text-white/50 transition-colors">GitHub</Link>
        </div>
      </footer>
    </div>
  )
}

export default page
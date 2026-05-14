import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Milestone Studio Alternatives — Why Builders Choose Milestone Studio",
    description:
        "Comparing Milestone Studio to Canva, Figma, and other design tools for creating milestone cards. See why founders and indie hackers prefer Milestone Studio for sharing their wins.",
    alternates: { canonical: "/alternatives" },
    keywords: [
        "milestone studio alternative",
        "canva alternative for milestone cards",
        "figma alternative for social cards",
        "milestone card generator alternative",
        "best tool for sharing milestones",
        "indie hacker milestone tool",
        "achievement card maker",
    ],
    openGraph: {
        title: "Milestone Studio vs Canva, Figma & Others",
        description: "Why founders and indie hackers choose Milestone Studio to share their milestones.",
        type: "website",
        url: "https://milestonestudio.nikhilsai.in/alternatives",
    },
    twitter: {
        card: "summary_large_image",
        title: "Milestone Studio Alternatives",
        description: "Why founders and indie hackers choose Milestone Studio to share their milestones.",
        creator: "@itzznikhilsai",
    },
};

const competitors = [
    {
        name: "Canva",
        description: "A general-purpose design tool with millions of templates.",
        pros: ["Large template library", "Team collaboration", "Brand kit"],
        cons: ["Requires login", "Overkill for simple cards", "Paid for best features", "Slow for one-off exports"],
    },
    {
        name: "Figma",
        description: "A professional UI/UX design tool used by product teams.",
        pros: ["Extremely powerful", "Component libraries", "Developer handoff"],
        cons: ["Steep learning curve", "Requires account", "Not built for quick social posts", "No milestone-specific templates"],
    },
    {
        name: "Adobe Express",
        description: "Adobe's quick-design product for social media content.",
        pros: ["Adobe ecosystem integration", "Good template variety"],
        cons: ["Requires Adobe account", "Paid subscription for full access", "No indie hacker focus", "Slow to get started"],
    },
    {
        name: "Twitter/X Card Tools",
        description: "Manual design or screenshot-based sharing of metrics.",
        pros: ["Native platform", "No extra tool needed"],
        cons: ["Looks plain", "No customisation", "Low visual impact", "Not reusable"],
    },
];

const comparison = [
    { feature: "No login required", ms: true, canva: false, figma: false, adobe: false },
    { feature: "Free forever", ms: true, canva: false, figma: false, adobe: false },
    { feature: "Built for milestone cards", ms: true, canva: false, figma: false, adobe: false },
    { feature: "One-click export", ms: true, canva: true, figma: false, adobe: true },
    { feature: "Open source", ms: true, canva: false, figma: false, adobe: false },
    { feature: "Shareable config URL", ms: true, canva: false, figma: true, adobe: false },
    { feature: "Works instantly in browser", ms: true, canva: true, figma: true, adobe: true },
    { feature: "Indie hacker templates", ms: true, canva: false, figma: false, adobe: false },
];

function Tick({ yes }: { yes: boolean }) {
    return yes
        ? <Check size={16} className="text-white/70 mx-auto" />
        : <X size={14} className="text-white/15 mx-auto" />;
}

export default function AlternativesPage() {
    return (
        <div className="w-full min-h-screen bg-black text-white">

            {/* Nav */}
            <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
                <Link href="/landing" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Milestone Studio Logo" width={32} height={32} className="object-contain" />
                    <span className="text-sm font-medium tracking-tight text-white/80">Milestone Studio</span>
                </Link>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all active:scale-95"
                >
                    Open Editor <Sparkles size={12} fill="black" />
                </Link>
            </nav>

            {/* Hero */}
            <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-6">
                    Alternatives
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15]">
                    Why builders choose<br />Milestone Studio
                </h1>
                <p className="mt-6 text-white/40 text-lg font-light max-w-xl mx-auto">
                    Canva, Figma, and Adobe Express are powerful but they weren&apos;t built for what you need: a beautiful milestone card in under 60 seconds, no account, no friction.
                </p>
            </div>

            {/* Comparison table */}
            <div className="max-w-4xl mx-auto px-6 pb-24">
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-8 text-center">
                    Feature comparison
                </div>

                <div className="overflow-x-auto rounded-[24px] border border-white/5">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="text-left p-5 font-medium text-white/50 min-w-[200px]">Feature</th>
                                <th className="p-5 font-semibold text-white text-center">Milestone Studio</th>
                                <th className="p-5 font-medium text-white/40 text-center">Canva</th>
                                <th className="p-5 font-medium text-white/40 text-center">Figma</th>
                                <th className="p-5 font-medium text-white/40 text-center">Adobe Express</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparison.map((row, i) => (
                                <tr
                                    key={row.feature}
                                    className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}
                                >
                                    <td className="p-5 text-white/60">{row.feature}</td>
                                    <td className="p-5 text-center"><Tick yes={row.ms} /></td>
                                    <td className="p-5 text-center"><Tick yes={row.canva} /></td>
                                    <td className="p-5 text-center"><Tick yes={row.figma} /></td>
                                    <td className="p-5 text-center"><Tick yes={row.adobe} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Per-competitor breakdown */}
            <div className="max-w-4xl mx-auto px-6 pb-24">
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-8 text-center">
                    In depth
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-16">
                    Milestone Studio vs the alternatives
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {competitors.map(({ name, description, pros, cons }) => (
                        <div key={name} className="p-8 rounded-[24px] border border-white/5 bg-white/[0.02] flex flex-col gap-6">
                            <div>
                                <h3 className="text-base font-semibold text-white mb-1">{name}</h3>
                                <p className="text-sm text-white/40 font-light">{description}</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold tracking-widest uppercase text-white/25">Strengths</p>
                                {pros.map(p => (
                                    <div key={p} className="flex items-start gap-2 text-sm text-white/50">
                                        <Check size={13} className="mt-0.5 shrink-0 text-white/30" />
                                        {p}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold tracking-widest uppercase text-white/25">Limitations for milestone cards</p>
                                {cons.map(c => (
                                    <div key={c} className="flex items-start gap-2 text-sm text-white/40">
                                        <X size={13} className="mt-0.5 shrink-0 text-white/20" />
                                        {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why MS wins */}
            <div className="max-w-4xl mx-auto px-6 pb-24">
                <div className="p-8 md:p-12 rounded-[32px] border border-white/5 bg-white/[0.02] text-center flex flex-col items-center gap-6">
                    <Image src="/logo.png" alt="Milestone Studio Logo" width={52} height={52} unoptimized className="object-contain" />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug max-w-lg">
                        The right tool for the job
                    </h2>
                    <p className="text-white/40 font-light max-w-lg text-base leading-relaxed">
                        Canva and Figma are excellent at what they do. But when you just hit a milestone and want to share it right now, you don&apos;t need a design suite. You need Milestone Studio open, type, style, export. Done.
                    </p>
                    <Link
                        href="/"
                        className="mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
                    >
                        Create your card free <Sparkles size={14} fill="black" />
                    </Link>
                    <p className="text-xs text-white/20">No login · No cost · Open source</p>
                </div>
            </div>

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
    );
}
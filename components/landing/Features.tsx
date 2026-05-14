import { Zap, Download, Palette, Lock, Share2, Shuffle, Smile } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Instant, no login",
        description: "Open the editor and start building immediately. No account, no onboarding, no waiting.",
    },
    {
        icon: Palette,
        title: "Beautiful gradients",
        description: "Choose from dozens of hand-crafted gradient backgrounds across multiple categories.",
    },
    {
        icon: Shuffle,
        title: "One-click shuffle",
        description: "Hit shuffle and instantly generate a random combination of gradient, layout, and ratio.",
    },
    {
        icon: Download,
        title: "High-res export",
        description: "Download a crisp PNG at any quality setting, or copy directly to your clipboard.",
    },
    {
        icon: Smile,
        title: "Emoji scatter",
        description: "Add depth with scattered emoji overlays — each one sized, blurred, and rotated for a natural parallax feel.",
    },
    {
        icon: Lock,
        title: "Open source",
        description: "Fully open source on GitHub. Self-host it, fork it, contribute — it's yours.",
    },
];

export default function Features() {
    return (
        <section className="relative w-full py-32 bg-black text-white px-6">
            <div className="max-w-5xl mx-auto">

                {/* Label */}
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-6 text-center">
                    Features
                </div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center leading-tight max-w-2xl mx-auto">
                    Everything you need.<br />Nothing you don&apos;t.
                </h2>

                <p className="mt-5 text-white/40 text-lg font-light text-center max-w-xl mx-auto">
                    Milestone Studio is ruthlessly focused. Every feature exists for one reason — to help you share your wins faster.
                </p>

                {/* Grid */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-[32px] overflow-hidden border border-white/5">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="bg-black p-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <Icon size={16} className="text-white/60" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed font-light">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
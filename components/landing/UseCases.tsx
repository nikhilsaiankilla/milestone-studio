"use client";

const cases = [
    {
        label: "Indie Hackers",
        headline: "Share your MRR the moment you hit it.",
        body: "You just crossed $1K MRR. Don't let the moment pass with a plain tweet. Make it a card.",
        tag: "$1,000 MRR",
    },
    {
        label: "OSS Maintainers",
        headline: "Celebrate every GitHub star milestone.",
        body: "100 stars. 1K stars. 10K stars. Each one deserves a moment. Make it beautiful.",
        tag: "10K ⭐",
    },
    {
        label: "Creators",
        headline: "Mark your follower milestones.",
        body: "Whether it's 500 or 500K, you earned it. Milestone Studio makes the card in seconds.",
        tag: "500K followers",
    },
    {
        label: "Founders",
        headline: "Turn launch metrics into social proof.",
        body: "Day 1 signups. Week 1 revenue. First paying customer. Share the journey publicly.",
        tag: "100 signups",
    },
];

export default function UseCases() {
    return (
        <section className="relative w-full py-32 bg-black text-white px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">

                {/* Label */}
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-6 text-center">
                    Use cases
                </div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center leading-tight max-w-2xl mx-auto">
                    Built for builders<br />who share their journey.
                </h2>

                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {cases.map(({ label, headline, body, tag }) => (
                        <div
                            key={label}
                            className="relative p-8 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.035] transition-colors overflow-hidden group"
                        >
                            {/* Faint background number */}
                            <div
                                className="absolute -bottom-3 -right-2 text-[72px] font-black text-white/[0.03] leading-none select-none pointer-events-none whitespace-nowrap"
                                aria-hidden
                            >
                                {tag}
                            </div>

                            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-white/25 mb-5">
                                {label}
                            </div>
                            <h3 className="text-lg font-semibold text-white leading-snug mb-3">{headline}</h3>
                            <p className="text-sm text-white/40 leading-relaxed font-light">{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
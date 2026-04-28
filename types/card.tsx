export const TEMPLATES = [
    {
        id: "metrics",
        label: "Metrics",
        isPro: false,
        skeleton: (
            <div className="flex flex-col items-center gap-1.5" >
                <div className="w-6 h-1.5 rounded-full bg-current" />
                < div className="w-4 h-1 rounded-full bg-current opacity-40" />
            </div>
        )
    },
    {
        id: "milestone",
        label: "Milestone",
        isPro: true,
        skeleton: (
            <div className="flex flex-col items-center gap-1.5" >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <div className="w-5 h-1.5 rounded-full bg-current opacity-40" />
            </div>
        )
    },
    {
        id: "progress",
        label: "Progress",
        isPro: true,
        skeleton: (
            <div className="w-12 h-1.5 rounded-full bg-current/20 relative overflow-hidden" >
                <div className="absolute left-0 top-0 h-full w-2/3 bg-current" />
            </div>
        )
    },
    {
        id: "list",
        label: "List",
        isPro: true,
        skeleton: (
            <div className="flex flex-col items-start gap-1" >
                <div className="w-8 h-1 rounded-full bg-current" />
                <div className="w-8 h-1 rounded-full bg-current" />
                <div className="w-8 h-1 rounded-full bg-current" />
            </div>
        )
    },
];

export const GRADIENTS = [
    // Linear classics
    "linear-gradient(120deg,#ff7e5f,#feb47b)",
    "linear-gradient(135deg,#667eea,#764ba2)",
    "linear-gradient(135deg,#00c6ff,#0072ff)",
    "linear-gradient(135deg,#f7971e,#ffd200)",
    "linear-gradient(135deg,#43cea2,#185a9d)",

    // Mesh / multi-radial (like image 1 - dark with color blobs)
    "radial-gradient(ellipse at 20% 50%, #c0392b88 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #2980b988 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0d0d0d 100%)",
    "radial-gradient(ellipse at 15% 50%, #e67e2288 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, #8e44ad88 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, #111 0%, #1a1a1a 100%)",
    "radial-gradient(ellipse at 20% 50%, #00b4db88 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #0083b088 0%, transparent 55%), #0a0a1a",

    // Mesh / multi-radial (like image 2 - soft pastel blobs)
    "radial-gradient(ellipse at 30% 40%, #4a9e8e 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #2d6a4f 0%, transparent 55%), radial-gradient(ellipse at 50% 30%, #7fb5a0 0%, transparent 50%), #1e4d40",
    "radial-gradient(ellipse at 25% 45%, #8e9eab 0%, transparent 55%), radial-gradient(ellipse at 75% 55%, #4a6fa5 0%, transparent 55%), radial-gradient(ellipse at 50% 25%, #c9d6df 0%, transparent 50%), #2c3e50",
    "radial-gradient(ellipse at 30% 50%, #c9a96e 0%, transparent 55%), radial-gradient(ellipse at 70% 40%, #a0522d 0%, transparent 55%), radial-gradient(ellipse at 55% 70%, #8b6914 0%, transparent 50%), #2c1810",
    "radial-gradient(ellipse at 20% 40%, #d4a5c9 0%, transparent 55%), radial-gradient(ellipse at 80% 60%, #9b59b6 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #f8c8e8 0%, transparent 50%), #4a235a",
    "radial-gradient(ellipse at 25% 50%, #a8d8a8 0%, transparent 55%), radial-gradient(ellipse at 75% 45%, #52b788 0%, transparent 55%), radial-gradient(ellipse at 50% 75%, #d4edda 0%, transparent 50%), #1a472a",
    "radial-gradient(ellipse at 30% 40%, #ffd89b 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #ff9a9e 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #ffecd2 0%, transparent 50%), #c0392b",
    "radial-gradient(ellipse at 20% 50%, #a1c4fd 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #c2e9fb 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, #e0f7fa 0%, transparent 50%), #1565c0",
    "radial-gradient(ellipse at 35% 45%, #fd746c 0%, transparent 55%), radial-gradient(ellipse at 65% 55%, #ff9068 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #ffb347 0%, transparent 50%), #7b1a1a",
]

export const FONTS = [
    { label: "Inter", value: "var(--font-inter)" },
    { label: "Roboto", value: "var(--font-roboto)" },
    { label: "Playfair Display", value: "var(--font-playfair)" },
    { label: "Space Grotesk", value: "var(--font-space-grotesk)" },
    { label: "Syne", value: "var(--font-syne)" },
    { label: "DM Sans", value: "var(--font-dm-sans)" },
]
import { Eye, Heart, MessageCircle, Share2, Star, TrendingUp, Users } from "lucide-react";
import React from "react";

export type EmojiPosition = { id: number; x: number; y: number; size: number; opacity: number; rotation: number }

export interface MetricStyle {
    showIcon: boolean
    iconSize: number        // 16–64
    valueSize: number       // 24–96
    valueBold: boolean
    valueItalic: boolean
    labelSize: number       // 10–24
    labelBold: boolean
    labelItalic: boolean
    fontFamily: string
    textColor: string
}

export const DEFAULT_METRIC_STYLE: MetricStyle = {
    showIcon: true,
    iconSize: 40,
    valueSize: 48,
    valueBold: true,
    valueItalic: false,
    labelSize: 12,
    labelBold: false,
    labelItalic: false,
    fontFamily: "var(--font-inter)",
    textColor: "#ffffff",
}

// Update Metric type to include style
export type Metric = {
    showIcon: boolean,
    id: string
    value: string
    label: string
    icon: string
    style: MetricStyle
}

const METRIC_ICONS = {
    users: Users,
    growth: TrendingUp,
    likes: Heart,
    views: Eye,
    comments: MessageCircle,
    shares: Share2,
    stars: Star
} as const

export type MetricIconKey = keyof typeof METRIC_ICONS

export { METRIC_ICONS }  // move METRIC_ICONS here from Dashboard

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

export const GRADIENT_CATEGORIES = {
    "Linear Classics": [
        // Existing
        "linear-gradient(120deg,#ff7e5f,#feb47b)",
        "linear-gradient(135deg,#667eea,#764ba2)",
        "linear-gradient(135deg,#00c6ff,#0072ff)",
        "linear-gradient(135deg,#f7971e,#ffd200)",
        "linear-gradient(135deg,#43cea2,#185a9d)",

        // New Additions
        // 1. "Midnight Rose" - Deep purple to hot pink
        "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",

        // 2. "Tropical Punch" - Bright orange to deep pink
        "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",

        // 3. "Electric Violet" - Vivid blue to purple
        "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",

        // 4. "Lush Green" - Deep emerald to lime
        "linear-gradient(135deg, #11998e, #38ef7d)",

        // 5. "Space" - Dark navy to deep violet
        "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
    ],
    "Deep Mesh": [
        "radial-gradient(ellipse at 20% 50%, #c0392b88 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #2980b988 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0d0d0d 100%)",
        "radial-gradient(ellipse at 15% 50%, #e67e2288 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, #8e44ad88 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, #111 0%, #1a1a1a 100%)",
        "radial-gradient(ellipse at 20% 50%, #00b4db88 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #0083b088 0%, transparent 55%), #0a0a1a",
        "radial-gradient(at 0% 100%, rgba(255, 126, 95, 0.7) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(212, 20, 90, 0.8) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(73, 31, 155, 1) 0px, transparent 50%), radial-gradient(at 80% 90%, rgba(255, 0, 150, 0.6) 0px, transparent 50%), #0f0c29",
        "radial-gradient(at 0% 0%, rgba(0, 255, 255, 0.5) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 0, 255, 0.5) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(0, 102, 255, 0.3) 0px, transparent 50%), #050510",
        "radial-gradient(at 10% 20%, rgba(46, 204, 113, 0.4) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(230, 126, 34, 0.6) 0px, transparent 50%), radial-gradient(at 50% 10%, rgba(39, 174, 96, 0.3) 0px, transparent 50%), #0a1a0a",
        "radial-gradient(at 20% 30%, rgba(0, 242, 255, 0.5) 0px, transparent 50%), radial-gradient(at 70% 20%, rgba(162, 0, 255, 0.5) 0px, transparent 50%), radial-gradient(at 40% 80%, rgba(0, 255, 136, 0.4) 0px, transparent 50%), #0d0221",
        "radial-gradient(at 0% 50%, rgba(255, 215, 0, 0.4) 0px, transparent 50%), radial-gradient(at 100% 50%, rgba(255, 69, 0, 0.5) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(75, 0, 130, 0.6) 0px, transparent 50%), #1a051a",
        "radial-gradient(at 10% 10%, rgba(0, 180, 219, 0.7) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(0, 131, 176, 0.5) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(5, 117, 230, 0.6) 0px, transparent 50%), #000428"
    ],
    "Soft Pastels": [
        "radial-gradient(ellipse at 30% 40%, #4a9e8e 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #2d6a4f 0%, transparent 55%), radial-gradient(ellipse at 50% 30%, #7fb5a0 0%, transparent 50%), #1e4d40",
        "radial-gradient(ellipse at 25% 45%, #8e9eab 0%, transparent 55%), radial-gradient(ellipse at 75% 55%, #4a6fa5 0%, transparent 55%), radial-gradient(ellipse at 50% 25%, #c9d6df 0%, transparent 50%), #2c3e50",
        "radial-gradient(ellipse at 30% 50%, #c9a96e 0%, transparent 55%), radial-gradient(ellipse at 70% 40%, #a0522d 0%, transparent 55%), radial-gradient(ellipse at 55% 70%, #8b6914 0%, transparent 50%), #2c1810",
        "radial-gradient(ellipse at 20% 40%, #d4a5c9 0%, transparent 55%), radial-gradient(ellipse at 80% 60%, #9b59b6 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #f8c8e8 0%, transparent 50%), #4a235a",
        "radial-gradient(ellipse at 25% 50%, #a8d8a8 0%, transparent 55%), radial-gradient(ellipse at 75% 45%, #52b788 0%, transparent 55%), radial-gradient(ellipse at 50% 75%, #d4edda 0%, transparent 50%), #1a472a",
        "radial-gradient(ellipse at 30% 40%, #ffd89b 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, #ff9a9e 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #ffecd2 0%, transparent 50%), #c0392b",
        "radial-gradient(ellipse at 20% 50%, #a1c4fd 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, #c2e9fb 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, #e0f7fa 0%, transparent 50%), #1565c0",
        "radial-gradient(ellipse at 35% 45%, #fd746c 0%, transparent 55%), radial-gradient(ellipse at 65% 55%, #ff9068 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, #ffb347 0%, transparent 50%), #7b1a1a",
    ]
};

export const FONTS = [
    { label: "Inter", value: "var(--font-inter)" },
    { label: "Roboto", value: "var(--font-roboto)" },
    { label: "Playfair Display", value: "var(--font-playfair)" },
    { label: "Space Grotesk", value: "var(--font-space-grotesk)" },
    { label: "Syne", value: "var(--font-syne)" },
    { label: "DM Sans", value: "var(--font-dm-sans)" },
]

export const ICONS = {
    x: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M18.244 2H21l-6.56 7.5L22 22h-6.828l-5.35-6.993L3.5 22H1l7.02-8.02L2 2h6.828l4.84 6.33L18.244 2Zm-2.394 18h1.885L8.16 4H6.155l9.695 16Z" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" fill="#0A66C2" width="14" height="14">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    youtube: (
        <svg viewBox="0 0 24 24" fill="#FF0000" width="14" height="14">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    producthunt: (
        <svg viewBox="0 0 24 24" fill="#DA552F" width="14" height="14">
            <path d="M13.604 8.4h-3.405V12h3.405a1.8 1.8 0 0 0 0-3.6zM12 0C5.373 0 0 5.372 0 12s5.373 12 12 12 12-5.372 12-12S18.627 0 12 0zm1.604 14.4H10.2V18H7.8V6h5.804a4.2 4.2 0 0 1 0 8.4z" />
        </svg>
    ),
    github: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    ),
    medium: (
        <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="100" fill="black" />

            <path d="M94.1 394.2V121.8h21.1l111.4 199.1 111.4-199.1h21.1v272.4h-26.6v-224l-95.2 170.8h-21.1L120.7 170.2v224H94.1z" fill="white" />

            <path d="M414.7 274.6c0-54.8 38.6-102.1 97.3-102.1 55.4 0 91.9 41.2 91.9 101.5 0 5.1-.3 10.5-.9 15.6H440.3c3.6 42.1 33.1 63.8 68.6 63.8 24.1 0 45.4-9.6 59.9-24.7l17.7 17.1c-19.8 24.7-50.5 37.2-83.9 37.2-56.9-.1-87.9-46.6-87.9-108.4zm162.8-19.5c-2.4-38.1-26.2-58.2-65.5-58.2-36.4 0-61.9 22.8-68.9 58.2h134.4z" fill="white" />
        </svg>
    )
}

export interface PlatformType {
    label: string;
    value: string;
    placeholder: string;
    icon: React.ReactNode;
}

export const PLATFORMS: PlatformType[] = [
    { label: "X (Twitter)", value: "x", placeholder: "@your_handle", icon: ICONS.x },
    { label: "Instagram", value: "instagram", placeholder: "@username", icon: ICONS.instagram },
    { label: "LinkedIn", value: "linkedin", placeholder: "linkedin.com/in/username", icon: ICONS.linkedin },
    { label: "YouTube", value: "youtube", placeholder: "@channel", icon: ICONS.youtube },
    { label: "Product Hunt", value: "producthunt", placeholder: "@username", icon: ICONS.producthunt },
    { label: "GitHub", value: "github", placeholder: "@username", icon: ICONS.github },
    { label: "Medium", value: "medium", placeholder: "@username", icon: ICONS.medium },
]
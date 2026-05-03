import { Eye, Heart, MessageCircle, Share2, Star, TrendingUp, Users } from "lucide-react";
import React from "react";

// — Emoji —
export type EmojiPosition = {
    id: number
    x: number
    y: number
    size: number
    opacity: number
    rotation: number
    blur: number
}

// — Metric Style —
export interface MetricStyle {
    // Icon
    showIcon: boolean
    iconSize: number        // 16–64

    // Value
    valueSize: number       // 24–96
    valueBold: boolean
    valueItalic: boolean

    // Label
    labelSize: number       // 10–28
    labelBold: boolean
    labelItalic: boolean

    // Typography
    fontFamily: string
    textColor: string

    // Text Shadow
    textShadowEnabled: boolean
    textShadowX: number     // -20 to 20
    textShadowY: number     // -20 to 20
    textShadowBlur: number  // 0 to 40
}

export const DEFAULT_METRIC_STYLE: MetricStyle = {
    // Icon
    showIcon: true,
    iconSize: 40,

    // Value
    valueSize: 48,
    valueBold: true,
    valueItalic: false,

    // Label
    labelSize: 12,
    labelBold: false,
    labelItalic: false,

    // Typography
    fontFamily: "var(--font-inter)",
    textColor: "#ffffff",

    // Text Shadow
    textShadowEnabled: false,
    textShadowX: 2,
    textShadowY: 4,
    textShadowBlur: 12,
}

// — Metric —
export type Metric = {
    id: string
    value: string
    label: string
    icon: string
    showIcon: boolean
    style: MetricStyle
}

// — Metric Icons —
const METRIC_ICONS = {
    users: Users,
    growth: TrendingUp,
    likes: Heart,
    views: Eye,
    comments: MessageCircle,
    shares: Share2,
    stars: Star,
} as const

export type MetricIconKey = keyof typeof METRIC_ICONS
export { METRIC_ICONS }

// — Platform —
export interface PlatformType {
    label: string
    value: string
    placeholder: string
    icon: React.ReactNode
}
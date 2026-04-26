/* ── TYPES ──────────────────────────────────────────── */

export type Platform =
    | "twitter"
    | "instagram"
    | "youtube"
    | "github"
    | "linkedin"
    | "newsletter"
    | "saas"
    | "tiktok"
    | "twitch"
    | "producthunt";

export type Theme = "dark" | "light" | "cream";
export type AspectRatio = "1:1" | "4:5" | "3:2";
export type BackgroundMode = "solid" | "gradient";
export type TextAlign = "left" | "center" | "right";
export type CardMode =
    | "standard"
    | "story"
    | "beforeAfter"
    | "slotMachine"
    | "progressTarget"
    | "rank"
    | "tiktokDuotone";

export interface BackgroundPreset {
    label: string;
    mode: BackgroundMode;
    value: string;
}

export interface TypographyStyle {
    family: string;
    weight: number;
    size: number;
    spacing: number;
    uppercase?: boolean;
    color?: string;
    align?: TextAlign;
}

export interface CardConfig {
    platform: Platform;
    milestone: string;
    unit: string;
    handle: string;
    message: string;
    logoUrl?: string;
    imageSize?: number;
    logoAlign?: TextAlign;

    theme: Theme;
    aspectRatio: AspectRatio;

    mStyle: TypographyStyle;
    unitStyle: TypographyStyle;
    messageStyle: TypographyStyle;

    backgroundMode: BackgroundMode;
    backgroundValue: string;
    noiseOpacity: number;

    showPlatformBadge?: boolean;
    showDivider?: boolean;
    cardBorderRadius?: number;
    accentColor?: string;

    cardMode?: CardMode;

    storyProgress?: number;
    showCountdown?: boolean;
    countdownTarget?: string;

    milestoneBefore?: string;
    milestoneGoal?: string;
    goalLabel?: string;
    showLiveBadge?: boolean;

    currencyPrefix?: string;
    autoFormatNumber?: boolean;
    growthLabel?: string;
}

/* ── DATA ───────────────────────────────────────────── */

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
    { label: "Ink", mode: "solid", value: "#080808" },
    { label: "Snow", mode: "solid", value: "#ffffff" },
    { label: "Parchment", mode: "solid", value: "#f4efe6" },
    { label: "Navy", mode: "solid", value: "#0c1526" },
    { label: "Plum", mode: "solid", value: "#1a0a2e" },
    { label: "Moss", mode: "solid", value: "#0a1f0f" },
    { label: "Blaze", mode: "gradient", value: "linear-gradient(135deg,#ff4d00 0%,#ff9500 100%)" },
    { label: "Dusk", mode: "gradient", value: "linear-gradient(135deg,#1a1a2e 0%,#e94560 100%)" },
    { label: "Neon", mode: "gradient", value: "linear-gradient(135deg,#00ff87 0%,#60efff 100%)" },
    { label: "Aurora", mode: "gradient", value: "linear-gradient(135deg,#0072ff 0%,#00c6ff 100%)" },
    { label: "Royal", mode: "gradient", value: "linear-gradient(135deg,#7f00ff 0%,#e100ff 100%)" },
    { label: "Ember", mode: "gradient", value: "linear-gradient(135deg,#f12711 0%,#f5af19 100%)" },
    { label: "Jade", mode: "gradient", value: "linear-gradient(135deg,#134e5e 0%,#71b280 100%)" },
    { label: "Rose", mode: "gradient", value: "linear-gradient(135deg,#b76e79 0%,#f0c4b0 100%)" },
    { label: "Abyss", mode: "gradient", value: "linear-gradient(160deg,#0f0c29 0%,#302b63 60%,#24243e 100%)" },
    { label: "Lava", mode: "gradient", value: "linear-gradient(135deg,#200122 0%,#6f0000 100%)" },
];

export const PLATFORMS: Record<Platform, { label: string; glyph: string; defaultUnit: string; image?: string }> = {
    twitter: { label: "X / Twitter", glyph: "𝕏", defaultUnit: "followers", image: "https://s.magecdn.com/social/tc-x.svg" },
    instagram: { label: "Instagram", glyph: "◈", defaultUnit: "followers", image: "https://s.magecdn.com/social/tc-instagram.svg" },
    youtube: { label: "YouTube", glyph: "▶", defaultUnit: "subscribers", image: "https://s.magecdn.com/social/tc-youtube.svg" },
    github: { label: "GitHub", glyph: "⌥", defaultUnit: "stars", image: "https://s.magecdn.com/social/tc-github.svg" },
    linkedin: { label: "LinkedIn", glyph: "in", defaultUnit: "connections", image: "https://s.magecdn.com/social/tc-linkedin.svg" },
    tiktok: { label: "TikTok", glyph: "♪", defaultUnit: "followers", image: "https://s.magecdn.com/social/tc-tiktok.svg" },
    twitch: { label: "Twitch", glyph: "◉", defaultUnit: "followers" },
    producthunt: { label: "Product Hunt", glyph: "▲", defaultUnit: "upvotes", image: "https://s.magecdn.com/social/tc-producthunt.svg" },
    newsletter: { label: "Newsletter", glyph: "✉", defaultUnit: "subscribers" },
    saas: { label: "SaaS", glyph: "◆", defaultUnit: "MRR" },
};

export const ASPECT_RATIOS: Record<AspectRatio, { label: string; css: string }> = {
    "1:1": { label: "Square 1:1", css: "1 / 1" },
    "4:5": { label: "Portrait 4:5", css: "4 / 5" },
    "3:2": { label: "Wide 3:2", css: "3 / 2" },
};

export const CATEGORIES = ["All", "X / Twitter", "Product Hunt", "GitHub", "YouTube", "Newsletter", "SaaS", "Twitch", "TikTok", "LinkedIn"];

export const TEMPLATES = [
    /* ── X / TWITTER ── */
    {
        id: "x-slot-machine",
        name: "X · Slot Machine",
        emoji: "𝕏",
        category: "X / Twitter",
        desc: "Past → Now → Goal · three-row scroll",
        cfg: {
            platform: "twitter" as Platform,
            backgroundValue: "#000000",
            noiseOpacity: 0,
            showDivider: false,
            showPlatformBadge: false,
            cardBorderRadius: 20,
            cardMode: "slotMachine" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "followers",
            milestone: "10K",
            milestoneBefore: "8.4K",
            milestoneGoal: "15K",
            mStyle: { family: "Helvetica", weight: 900, size: 56, spacing: -3, color: "#ffffff", align: "center" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 400, size: 11, spacing: 8, color: "rgba(255,255,255,0.4)", align: "center" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.25)", align: "center" as TextAlign, uppercase: false },
        },
    },
    {
        id: "x-milestone",
        name: "X · Milestone",
        emoji: "𝕏",
        category: "X / Twitter",
        desc: "Clean black · bold count · minimal",
        cfg: {
            platform: "twitter" as Platform,
            backgroundValue: "#000000",
            noiseOpacity: 12,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "followers",
            milestone: "10K",
            mStyle: { family: "Helvetica", weight: 900, size: 96, spacing: -5, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 400, size: 12, spacing: 9, color: "rgba(255,255,255,0.4)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.25)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── PRODUCT HUNT ── */
    {
        id: "ph-upvote-progress",
        name: "PH · Upvote Progress",
        emoji: "▲",
        category: "Product Hunt",
        desc: "Live progress bar · upvotes vs goal",
        cfg: {
            platform: "producthunt" as Platform,
            backgroundValue: "#f24a00",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "progressTarget" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "upvotes",
            milestone: "100",
            milestoneGoal: "120",
            goalLabel: "#1 Product of the Day",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 400, size: 12, spacing: 8, color: "rgba(255,255,255,0.6)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.45)", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "ph-product-of-the-day",
        name: "PH · Product of the Day",
        emoji: "▲",
        category: "Product Hunt",
        desc: "Rank badge · orange · celebration",
        cfg: {
            platform: "producthunt" as Platform,
            backgroundValue: "#f24a00",
            noiseOpacity: 14,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "rank" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "upvotes",
            milestone: "#1",
            message: "Product of the Day",
            mStyle: { family: "Helvetica", weight: 900, size: 96, spacing: -5, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 14, spacing: 4, color: "rgba(255,255,255,0.65)", align: "left" as TextAlign, uppercase: false },
            messageStyle: { family: "Helvetica", weight: 300, size: 11, spacing: 0, color: "rgba(255,255,255,0.4)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── GITHUB ── */
    {
        id: "gh-stars",
        name: "GitHub · Stars",
        emoji: "⭐",
        category: "GitHub",
        desc: "Dark navy · star icons · repo milestone",
        cfg: {
            platform: "github" as Platform,
            backgroundValue: "#0d1117",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 16,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "stars",
            milestone: "2.4K",
            mStyle: { family: "monospace", weight: 900, size: 88, spacing: -2, color: "#ffd700", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "monospace", weight: 400, size: 12, spacing: 6, color: "rgba(255,255,255,0.4)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "monospace", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.25)", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "gh-forks",
        name: "GitHub · Forks",
        emoji: "⭐",
        category: "GitHub",
        desc: "Dark · fork count · monospace",
        cfg: {
            platform: "github" as Platform,
            backgroundValue: "#161b22",
            noiseOpacity: 6,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 16,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "forks",
            milestone: "500",
            mStyle: { family: "monospace", weight: 900, size: 88, spacing: -2, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "monospace", weight: 400, size: 12, spacing: 6, color: "rgba(255,255,255,0.35)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "monospace", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.2)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── YOUTUBE ── */
    {
        id: "yt-subscribers",
        name: "YouTube · Subscribers",
        emoji: "▶",
        category: "YouTube",
        desc: "Red · bold · subscriber milestone",
        cfg: {
            platform: "youtube" as Platform,
            backgroundValue: "#ff0000",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "subscribers",
            milestone: "50K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 13, spacing: 7, color: "rgba(255,255,255,0.6)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.4)", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "yt-views",
        name: "YouTube · Views",
        emoji: "▶",
        category: "YouTube",
        desc: "Deep red · views milestone · dramatic",
        cfg: {
            platform: "youtube" as Platform,
            backgroundValue: "#1a0000",
            noiseOpacity: 14,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "total views",
            milestone: "1M",
            mStyle: { family: "Helvetica", weight: 900, size: 96, spacing: -5, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 13, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── NEWSLETTER ── */
    {
        id: "nl-subscribers",
        name: "Newsletter · Subscribers",
        emoji: "✉",
        category: "Newsletter",
        desc: "Parchment · serif · warm print feel",
        cfg: {
            platform: "newsletter" as Platform,
            backgroundValue: "#f4efe6",
            noiseOpacity: 28,
            showDivider: true,
            showPlatformBadge: true,
            cardBorderRadius: 8,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "subscribers",
            milestone: "5K",
            mStyle: { family: "Times New Roman", weight: 900, size: 88, spacing: -4, color: "#1a1208", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Times New Roman", weight: 400, size: 13, spacing: 8, color: "#7c6b55", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Times New Roman", weight: 300, size: 11, spacing: 0, color: "#8a7a68", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "nl-open-rate",
        name: "Newsletter · Open Rate",
        emoji: "✉",
        category: "Newsletter",
        desc: "Warm cream · open rate · vs industry avg",
        cfg: {
            platform: "newsletter" as Platform,
            backgroundValue: "#faf4e4",
            noiseOpacity: 20,
            showDivider: true,
            showPlatformBadge: true,
            cardBorderRadius: 8,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "open rate",
            milestone: "48%",
            message: "Industry avg: 22%",
            mStyle: { family: "Times New Roman", weight: 900, size: 80, spacing: -3, color: "#1a1208", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Times New Roman", weight: 400, size: 13, spacing: 6, color: "#7c6b55", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Times New Roman", weight: 300, size: 11, spacing: 0, color: "#8a7a68", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── SAAS / MRR ── */
    {
        id: "saas-mrr",
        name: "SaaS · MRR",
        emoji: "◆",
        category: "SaaS",
        desc: "Deep purple · MRR · growth badge",
        cfg: {
            platform: "saas" as Platform,
            backgroundValue: "linear-gradient(160deg,#0f0c29 0%,#302b63 100%)",
            noiseOpacity: 6,
            showDivider: false,
            showPlatformBadge: false,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            currencyPrefix: "$",
            autoFormatNumber: true,
            growthLabel: "+42% MoM",
            unit: "MRR",
            milestone: "12500",
            mStyle: { family: "Helvetica", weight: 900, size: 80, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 4, color: "rgba(255,255,255,0.5)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 11, spacing: 0, color: "rgba(255,255,255,0.35)", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "saas-arr",
        name: "SaaS · ARR",
        emoji: "◆",
        category: "SaaS",
        desc: "Black · ARR · serif bold editorial",
        cfg: {
            platform: "saas" as Platform,
            backgroundValue: "#080808",
            noiseOpacity: 18,
            showDivider: true,
            showPlatformBadge: false,
            cardBorderRadius: 12,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            currencyPrefix: "$",
            autoFormatNumber: true,
            growthLabel: "ARR",
            unit: "ARR",
            milestone: "150000",
            mStyle: { family: "Georgia", weight: 900, size: 72, spacing: -3, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Georgia", weight: 300, size: 12, spacing: 4, color: "#555555", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Georgia", weight: 300, size: 11, spacing: 0, color: "#444444", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "saas-customers",
        name: "SaaS · Customers",
        emoji: "◆",
        category: "SaaS",
        desc: "Teal ocean · paying customers · clean",
        cfg: {
            platform: "saas" as Platform,
            backgroundValue: "linear-gradient(145deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: false,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "customers",
            milestone: "500",
            message: "avg $25 / month",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 11, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── TWITCH ── */
    {
        id: "twitch-followers",
        name: "Twitch · Followers",
        emoji: "◉",
        category: "Twitch",
        desc: "Purple · LIVE badge · follower milestone",
        cfg: {
            platform: "twitch" as Platform,
            backgroundValue: "#9147ff",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "followers",
            milestone: "25K",
            showLiveBadge: true,
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "twitch-subs",
        name: "Twitch · Subs",
        emoji: "◉",
        category: "Twitch",
        desc: "Deep plum · paid subs · exclusive feel",
        cfg: {
            platform: "twitch" as Platform,
            backgroundValue: "#2e0d5c",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "paid subscribers",
            milestone: "1K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── TIKTOK ── */
    {
        id: "tiktok-followers",
        name: "TikTok · Followers",
        emoji: "♪",
        category: "TikTok",
        desc: "Black · glitch duotone · viral energy",
        cfg: {
            platform: "tiktok" as Platform,
            backgroundValue: "#010101",
            noiseOpacity: 0,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "tiktokDuotone" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "followers",
            milestone: "100K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.5)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left" as TextAlign, uppercase: false },
        },
    },

    /* ── LINKEDIN ── */
    {
        id: "li-connections",
        name: "LinkedIn · Connections",
        emoji: "in",
        category: "LinkedIn",
        desc: "LinkedIn blue · connections · professional",
        cfg: {
            platform: "linkedin" as Platform,
            backgroundValue: "#0a66c2",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "connections",
            milestone: "10K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.5)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.35)", align: "left" as TextAlign, uppercase: false },
        },
    },
    {
        id: "li-impressions",
        name: "LinkedIn · Impressions",
        emoji: "in",
        category: "LinkedIn",
        desc: "Deep navy · post impressions · reach",
        cfg: {
            platform: "linkedin" as Platform,
            backgroundValue: "#083264",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard" as CardMode,
            aspectRatio: "1:1" as AspectRatio,
            unit: "impressions",
            milestone: "500K",
            message: "last 30 days",
            mStyle: { family: "Helvetica", weight: 900, size: 80, spacing: -4, color: "#ffffff", align: "left" as TextAlign, uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left" as TextAlign, uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left" as TextAlign, uppercase: false },
        },
    },
];
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

/* ── DYNAMIC FIELD SYSTEM ───────────────────────────── */

/**
 * FieldDef describes a single editable field exposed in the sidebar.
 * The key maps to a CardConfig property. This drives the entire sidebar UI
 * dynamically — no sidebar rewrites needed when adding new templates.
 */
export type FieldType =
    | "text"        // plain text input
    | "number"      // numeric input
    | "handle"      // @ prefixed text
    | "textarea"    // multi-line
    | "toggle"      // boolean checkbox
    | "color"       // color picker
    | "range"       // slider
    | "select";     // dropdown

export interface FieldDef {
    key: keyof CardConfig;                  // which CardConfig field this controls
    label: string;                          // displayed in the sidebar
    type: FieldType;
    placeholder?: string;
    defaultValue?: string | number | boolean;
    min?: number;                           // for range/number
    max?: number;
    step?: number;
    options?: { label: string; value: string }[];  // for select
    hint?: string;                          // small helper text below field
}

/* ── TYPOGRAPHY ─────────────────────────────────────── */

export interface TypographyStyle {
    family: string;
    weight: number;
    size: number;
    spacing: number;
    uppercase?: boolean;
    color?: string;
    align?: TextAlign;
}

/* ── CARD CONFIG ────────────────────────────────────── */

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

/* ── BACKGROUND PRESETS ─────────────────────────────── */

export interface BackgroundPreset {
    label: string;
    mode: BackgroundMode;
    value: string;
}

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

/* ── PLATFORMS ──────────────────────────────────────── */

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

/* ── ASPECT RATIOS ──────────────────────────────────── */

export const ASPECT_RATIOS: Record<AspectRatio, { label: string; css: string }> = {
    "1:1": { label: "Square 1:1", css: "1 / 1" },
    "4:5": { label: "Portrait 4:5", css: "4 / 5" },
    "3:2": { label: "Wide 3:2", css: "3 / 2" },
};

/* ── CATEGORIES ─────────────────────────────────────── */

export const CATEGORIES = [
    "All", "X / Twitter", "Product Hunt", "GitHub",
    "YouTube", "Newsletter", "SaaS", "Twitch", "TikTok", "LinkedIn",
];

/* ── TEMPLATE DEFINITION ────────────────────────────── */

/**
 * Template now includes a `fields` array that drives the left sidebar UI.
 * No sidebar code changes needed when adding new templates.
 */
export interface TemplateDef {
    id: string;
    name: string;
    emoji: string;
    category: string;
    desc: string;
    fields: FieldDef[];   // ← dynamic sidebar fields
    cfg: Partial<CardConfig>;
}

/* ── TEMPLATES ──────────────────────────────────────── */

export const TEMPLATES: TemplateDef[] = [

    /* ════════════════════════════════════════
       X / TWITTER
    ════════════════════════════════════════ */
    {
        id: "x-slot-machine",
        name: "X · Slot Machine",
        emoji: "𝕏",
        category: "X / Twitter",
        desc: "Past → Now → Goal · three-row scroll",
        fields: [
            { key: "handle", label: "Your handle", type: "handle", placeholder: "@yourhandle", defaultValue: "@yourhandle" },
            { key: "milestoneBefore", label: "Previous count", type: "text", placeholder: "8.4K", defaultValue: "8.4K", hint: "Shown faded above — where you were" },
            { key: "milestone", label: "Current count", type: "text", placeholder: "10K", defaultValue: "10K", hint: "The milestone you're celebrating" },
            { key: "milestoneGoal", label: "Goal", type: "text", placeholder: "15K", defaultValue: "15K", hint: "Shown faded below — where you're headed" },
            { key: "unit", label: "Unit", type: "text", placeholder: "followers", defaultValue: "followers" },
        ],
        cfg: {
            platform: "twitter",
            backgroundValue: "#000000",
            noiseOpacity: 0,
            showDivider: false,
            showPlatformBadge: false,
            cardBorderRadius: 20,
            cardMode: "slotMachine",
            aspectRatio: "1:1",
            unit: "followers",
            milestone: "10K",
            milestoneBefore: "8.4K",
            milestoneGoal: "15K",
            mStyle: { family: "Helvetica", weight: 900, size: 56, spacing: -3, color: "#ffffff", align: "center", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 400, size: 11, spacing: 8, color: "rgba(255,255,255,0.4)", align: "center", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.25)", align: "center", uppercase: false },
        },
    },

    {
        id: "x-milestone",
        name: "X · Milestone",
        emoji: "𝕏",
        category: "X / Twitter",
        desc: "Clean black · bold count · minimal",
        fields: [
            { key: "handle", label: "Your handle", type: "handle", placeholder: "@yourhandle", defaultValue: "@yourhandle" },
            { key: "milestone", label: "Follower count", type: "text", placeholder: "10K", defaultValue: "10K" },
            { key: "unit", label: "Unit", type: "text", placeholder: "followers", defaultValue: "followers" },
            { key: "message", label: "Thank-you note", type: "text", placeholder: "Thank you all so much 🙏", defaultValue: "Thank you all so much 🙏" },
        ],
        cfg: {
            platform: "twitter",
            backgroundValue: "#000000",
            noiseOpacity: 12,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "followers",
            milestone: "10K",
            mStyle: { family: "Helvetica", weight: 900, size: 96, spacing: -5, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 400, size: 12, spacing: 9, color: "rgba(255,255,255,0.4)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.25)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       PRODUCT HUNT
    ════════════════════════════════════════ */
    {
        id: "ph-upvote-progress",
        name: "PH · Upvote Progress",
        emoji: "▲",
        category: "Product Hunt",
        desc: "Live progress bar · upvotes vs goal",
        fields: [
            { key: "handle", label: "Product / handle", type: "text", placeholder: "My Product", defaultValue: "My Product" },
            { key: "milestone", label: "Current upvotes", type: "number", placeholder: "100", defaultValue: "100", hint: "Your current upvote count" },
            { key: "milestoneGoal", label: "Target upvotes", type: "number", placeholder: "120", defaultValue: "120", hint: "Upvotes needed for #1" },
            { key: "goalLabel", label: "Goal label", type: "text", placeholder: "#1 Product of the Day", defaultValue: "#1 Product of the Day" },
        ],
        cfg: {
            platform: "producthunt",
            backgroundValue: "#f24a00",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "progressTarget",
            aspectRatio: "1:1",
            unit: "upvotes",
            milestone: "100",
            milestoneGoal: "120",
            goalLabel: "#1 Product of the Day",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 400, size: 12, spacing: 8, color: "rgba(255,255,255,0.6)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.45)", align: "left", uppercase: false },
        },
    },

    {
        id: "ph-product-of-the-day",
        name: "PH · Product of the Day",
        emoji: "▲",
        category: "Product Hunt",
        desc: "Rank badge · orange · celebration",
        fields: [
            { key: "milestone", label: "Rank", type: "text", placeholder: "#1", defaultValue: "#1", hint: "e.g. #1 or #2" },
            { key: "message", label: "Badge label", type: "text", placeholder: "Product of the Day", defaultValue: "Product of the Day" },
            { key: "handle", label: "Product name", type: "text", placeholder: "My Product", defaultValue: "My Product" },
            { key: "unit", label: "Upvotes", type: "text", placeholder: "187 upvotes", defaultValue: "187 upvotes" },
        ],
        cfg: {
            platform: "producthunt",
            backgroundValue: "#f24a00",
            noiseOpacity: 14,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "rank",
            aspectRatio: "1:1",
            unit: "187 upvotes",
            milestone: "#1",
            message: "Product of the Day",
            mStyle: { family: "Helvetica", weight: 900, size: 96, spacing: -5, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 14, spacing: 4, color: "rgba(255,255,255,0.65)", align: "left", uppercase: false },
            messageStyle: { family: "Helvetica", weight: 300, size: 11, spacing: 0, color: "rgba(255,255,255,0.4)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       GITHUB
    ════════════════════════════════════════ */
    {
        id: "gh-stars",
        name: "GitHub · Stars",
        emoji: "⭐",
        category: "GitHub",
        desc: "Dark navy · star icons · repo milestone",
        fields: [
            { key: "handle", label: "Repo (user/repo)", type: "text", placeholder: "user/repo", defaultValue: "user/repo" },
            { key: "milestone", label: "Star count", type: "text", placeholder: "2.4K", defaultValue: "2.4K" },
            { key: "message", label: "Tagline", type: "text", placeholder: "Thank you for the stars!", defaultValue: "Thank you for the stars!" },
        ],
        cfg: {
            platform: "github",
            backgroundValue: "#0d1117",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 16,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "stars",
            milestone: "2.4K",
            mStyle: { family: "monospace", weight: 900, size: 88, spacing: -2, color: "#ffd700", align: "left", uppercase: false },
            unitStyle: { family: "monospace", weight: 400, size: 12, spacing: 6, color: "rgba(255,255,255,0.4)", align: "left", uppercase: true },
            messageStyle: { family: "monospace", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.25)", align: "left", uppercase: false },
        },
    },

    {
        id: "gh-forks",
        name: "GitHub · Forks",
        emoji: "⭐",
        category: "GitHub",
        desc: "Dark · fork count · monospace",
        fields: [
            { key: "handle", label: "Repo (user/repo)", type: "text", placeholder: "user/repo", defaultValue: "user/repo" },
            { key: "milestone", label: "Fork count", type: "text", placeholder: "500", defaultValue: "500" },
            { key: "message", label: "Tagline", type: "text", placeholder: "Fork it. Build it. Ship it.", defaultValue: "Fork it. Build it. Ship it." },
        ],
        cfg: {
            platform: "github",
            backgroundValue: "#161b22",
            noiseOpacity: 6,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 16,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "forks",
            milestone: "500",
            mStyle: { family: "monospace", weight: 900, size: 88, spacing: -2, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "monospace", weight: 400, size: 12, spacing: 6, color: "rgba(255,255,255,0.35)", align: "left", uppercase: true },
            messageStyle: { family: "monospace", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.2)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       YOUTUBE
    ════════════════════════════════════════ */
    {
        id: "yt-subscribers",
        name: "YouTube · Subscribers",
        emoji: "▶",
        category: "YouTube",
        desc: "Red · bold · subscriber milestone",
        fields: [
            { key: "handle", label: "Channel handle", type: "handle", placeholder: "@channel", defaultValue: "@channel" },
            { key: "milestone", label: "Subscriber count", type: "text", placeholder: "50K", defaultValue: "50K" },
            { key: "message", label: "Message", type: "text", placeholder: "Thank you! 🙏", defaultValue: "Thank you! 🙏" },
        ],
        cfg: {
            platform: "youtube",
            backgroundValue: "#ff0000",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "subscribers",
            milestone: "50K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 13, spacing: 7, color: "rgba(255,255,255,0.6)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.4)", align: "left", uppercase: false },
        },
    },

    {
        id: "yt-views",
        name: "YouTube · Views",
        emoji: "▶",
        category: "YouTube",
        desc: "Deep red · views milestone · dramatic",
        fields: [
            { key: "handle", label: "Channel handle", type: "handle", placeholder: "@channel", defaultValue: "@channel" },
            { key: "milestone", label: "Total views", type: "text", placeholder: "1M", defaultValue: "1M" },
            { key: "message", label: "Message", type: "text", placeholder: "One million eyes 👁️", defaultValue: "One million eyes 👁️" },
        ],
        cfg: {
            platform: "youtube",
            backgroundValue: "#1a0000",
            noiseOpacity: 14,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "total views",
            milestone: "1M",
            mStyle: { family: "Helvetica", weight: 900, size: 96, spacing: -5, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 13, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       NEWSLETTER
    ════════════════════════════════════════ */
    {
        id: "nl-subscribers",
        name: "Newsletter · Subscribers",
        emoji: "✉",
        category: "Newsletter",
        desc: "Parchment · serif · warm print feel",
        fields: [
            { key: "handle", label: "Newsletter name", type: "text", placeholder: "The Weekly Dispatch", defaultValue: "The Weekly Dispatch" },
            { key: "milestone", label: "Subscriber count", type: "text", placeholder: "5K", defaultValue: "5K" },
            { key: "message", label: "Tagline", type: "text", placeholder: "5,000 curious minds.", defaultValue: "5,000 curious minds." },
        ],
        cfg: {
            platform: "newsletter",
            backgroundValue: "#f4efe6",
            noiseOpacity: 28,
            showDivider: true,
            showPlatformBadge: true,
            cardBorderRadius: 8,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "subscribers",
            milestone: "5K",
            mStyle: { family: "Times New Roman", weight: 900, size: 88, spacing: -4, color: "#1a1208", align: "left", uppercase: false },
            unitStyle: { family: "Times New Roman", weight: 400, size: 13, spacing: 8, color: "#7c6b55", align: "left", uppercase: true },
            messageStyle: { family: "Times New Roman", weight: 300, size: 11, spacing: 0, color: "#8a7a68", align: "left", uppercase: false },
        },
    },

    {
        id: "nl-open-rate",
        name: "Newsletter · Open Rate",
        emoji: "✉",
        category: "Newsletter",
        desc: "Warm cream · open rate · vs industry avg",
        fields: [
            { key: "handle", label: "Newsletter name", type: "text", placeholder: "The Weekly Dispatch", defaultValue: "The Weekly Dispatch" },
            { key: "milestone", label: "Open rate", type: "text", placeholder: "48%", defaultValue: "48%" },
            { key: "message", label: "Comparison note", type: "text", placeholder: "Industry avg: 22%", defaultValue: "Industry avg: 22%" },
        ],
        cfg: {
            platform: "newsletter",
            backgroundValue: "#faf4e4",
            noiseOpacity: 20,
            showDivider: true,
            showPlatformBadge: true,
            cardBorderRadius: 8,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "open rate",
            milestone: "48%",
            message: "Industry avg: 22%",
            mStyle: { family: "Times New Roman", weight: 900, size: 80, spacing: -3, color: "#1a1208", align: "left", uppercase: false },
            unitStyle: { family: "Times New Roman", weight: 400, size: 13, spacing: 6, color: "#7c6b55", align: "left", uppercase: true },
            messageStyle: { family: "Times New Roman", weight: 300, size: 11, spacing: 0, color: "#8a7a68", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       SAAS / MRR
    ════════════════════════════════════════ */
    {
        id: "saas-mrr",
        name: "SaaS · MRR",
        emoji: "◆",
        category: "SaaS",
        desc: "Deep purple · MRR · growth badge",
        fields: [
            { key: "milestone", label: "MRR amount", type: "text", placeholder: "12500", defaultValue: "12500", hint: "Raw number, e.g. 12500 → shown as $12.5K" },
            { key: "growthLabel", label: "Growth badge", type: "text", placeholder: "+42% MoM", defaultValue: "+42% MoM", hint: "Shown as a green pill above the number" },
            { key: "handle", label: "Product name", type: "text", placeholder: "MyProduct", defaultValue: "MyProduct" },
            { key: "message", label: "Tagline", type: "text", placeholder: "Building in public 🚀", defaultValue: "Building in public 🚀" },
        ],
        cfg: {
            platform: "saas",
            backgroundValue: "linear-gradient(160deg,#0f0c29 0%,#302b63 100%)",
            noiseOpacity: 6,
            showDivider: false,
            showPlatformBadge: false,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            currencyPrefix: "$",
            autoFormatNumber: true,
            growthLabel: "+42% MoM",
            unit: "MRR",
            milestone: "12500",
            mStyle: { family: "Helvetica", weight: 900, size: 80, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 4, color: "rgba(255,255,255,0.5)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 11, spacing: 0, color: "rgba(255,255,255,0.35)", align: "left", uppercase: false },
        },
    },

    {
        id: "saas-arr",
        name: "SaaS · ARR",
        emoji: "◆",
        category: "SaaS",
        desc: "Black · ARR · serif bold editorial",
        fields: [
            { key: "milestone", label: "ARR amount", type: "text", placeholder: "150000", defaultValue: "150000", hint: "Raw number → shown as $150K" },
            { key: "growthLabel", label: "Growth badge", type: "text", placeholder: "ARR", defaultValue: "ARR" },
            { key: "handle", label: "Product name", type: "text", placeholder: "MyProduct", defaultValue: "MyProduct" },
            { key: "message", label: "Tagline", type: "text", placeholder: "$12.5K MRR × 12", defaultValue: "$12.5K MRR × 12" },
        ],
        cfg: {
            platform: "saas",
            backgroundValue: "#080808",
            noiseOpacity: 18,
            showDivider: true,
            showPlatformBadge: false,
            cardBorderRadius: 12,
            cardMode: "standard",
            aspectRatio: "1:1",
            currencyPrefix: "$",
            autoFormatNumber: true,
            growthLabel: "ARR",
            unit: "ARR",
            milestone: "150000",
            mStyle: { family: "Georgia", weight: 900, size: 72, spacing: -3, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Georgia", weight: 300, size: 12, spacing: 4, color: "#555555", align: "left", uppercase: true },
            messageStyle: { family: "Georgia", weight: 300, size: 11, spacing: 0, color: "#444444", align: "left", uppercase: false },
        },
    },

    {
        id: "saas-customers",
        name: "SaaS · Customers",
        emoji: "◆",
        category: "SaaS",
        desc: "Teal ocean · paying customers · clean",
        fields: [
            { key: "milestone", label: "Customer count", type: "text", placeholder: "500", defaultValue: "500" },
            { key: "message", label: "Sub-note", type: "text", placeholder: "avg $25 / month", defaultValue: "avg $25 / month" },
            { key: "handle", label: "Product name", type: "text", placeholder: "MyProduct", defaultValue: "MyProduct" },
        ],
        cfg: {
            platform: "saas",
            backgroundValue: "linear-gradient(145deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: false,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "customers",
            milestone: "500",
            message: "avg $25 / month",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 11, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       TWITCH
    ════════════════════════════════════════ */
    {
        id: "twitch-followers",
        name: "Twitch · Followers",
        emoji: "◉",
        category: "Twitch",
        desc: "Purple · LIVE badge · follower milestone",
        fields: [
            { key: "handle", label: "Channel name", type: "handle", placeholder: "@streamer", defaultValue: "@streamer" },
            { key: "milestone", label: "Follower count", type: "text", placeholder: "25K", defaultValue: "25K" },
            { key: "showLiveBadge", label: "Show LIVE badge", type: "toggle", defaultValue: true },
            { key: "message", label: "Tagline", type: "text", placeholder: "Live every night 🎮", defaultValue: "Live every night 🎮" },
        ],
        cfg: {
            platform: "twitch",
            backgroundValue: "#9147ff",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "followers",
            milestone: "25K",
            showLiveBadge: true,
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left", uppercase: false },
        },
    },

    {
        id: "twitch-subs",
        name: "Twitch · Subs",
        emoji: "◉",
        category: "Twitch",
        desc: "Deep plum · paid subs · exclusive feel",
        fields: [
            { key: "handle", label: "Channel name", type: "handle", placeholder: "@streamer", defaultValue: "@streamer" },
            { key: "milestone", label: "Subscriber count", type: "text", placeholder: "1K", defaultValue: "1K" },
            { key: "message", label: "Tagline", type: "text", placeholder: "Tier 1 legends only 👑", defaultValue: "Tier 1 legends only 👑" },
        ],
        cfg: {
            platform: "twitch",
            backgroundValue: "#2e0d5c",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "paid subscribers",
            milestone: "1K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       TIKTOK
    ════════════════════════════════════════ */
    {
        id: "tiktok-followers",
        name: "TikTok · Followers",
        emoji: "♪",
        category: "TikTok",
        desc: "Black · glitch duotone · viral energy",
        fields: [
            { key: "handle", label: "TikTok handle", type: "handle", placeholder: "@creator", defaultValue: "@creator" },
            { key: "milestone", label: "Follower count", type: "text", placeholder: "100K", defaultValue: "100K" },
            { key: "message", label: "Vibe", type: "text", placeholder: "We made it 🔥", defaultValue: "We made it 🔥" },
        ],
        cfg: {
            platform: "tiktok",
            backgroundValue: "#010101",
            noiseOpacity: 0,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "tiktokDuotone",
            aspectRatio: "1:1",
            unit: "followers",
            milestone: "100K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.5)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left", uppercase: false },
        },
    },

    /* ════════════════════════════════════════
       LINKEDIN
    ════════════════════════════════════════ */
    {
        id: "li-connections",
        name: "LinkedIn · Connections",
        emoji: "in",
        category: "LinkedIn",
        desc: "LinkedIn blue · connections · professional",
        fields: [
            { key: "handle", label: "Your name", type: "text", placeholder: "Jane Doe", defaultValue: "Jane Doe" },
            { key: "milestone", label: "Connection count", type: "text", placeholder: "10K", defaultValue: "10K" },
            { key: "message", label: "Note", type: "text", placeholder: "Grateful for every connection.", defaultValue: "Grateful for every connection." },
        ],
        cfg: {
            platform: "linkedin",
            backgroundValue: "#0a66c2",
            noiseOpacity: 8,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "connections",
            milestone: "10K",
            mStyle: { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.5)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.35)", align: "left", uppercase: false },
        },
    },

    {
        id: "li-impressions",
        name: "LinkedIn · Impressions",
        emoji: "in",
        category: "LinkedIn",
        desc: "Deep navy · post impressions · reach",
        fields: [
            { key: "handle", label: "Your name", type: "text", placeholder: "Jane Doe", defaultValue: "Jane Doe" },
            { key: "milestone", label: "Impressions", type: "text", placeholder: "500K", defaultValue: "500K" },
            { key: "message", label: "Time period", type: "text", placeholder: "last 30 days", defaultValue: "last 30 days" },
        ],
        cfg: {
            platform: "linkedin",
            backgroundValue: "#083264",
            noiseOpacity: 10,
            showDivider: false,
            showPlatformBadge: true,
            cardBorderRadius: 20,
            cardMode: "standard",
            aspectRatio: "1:1",
            unit: "impressions",
            milestone: "500K",
            message: "last 30 days",
            mStyle: { family: "Helvetica", weight: 900, size: 80, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
            unitStyle: { family: "Helvetica", weight: 300, size: 12, spacing: 7, color: "rgba(255,255,255,0.45)", align: "left", uppercase: true },
            messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, color: "rgba(255,255,255,0.3)", align: "left", uppercase: false },
        },
    },
];
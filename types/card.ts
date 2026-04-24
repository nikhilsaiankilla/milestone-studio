/* ── TYPES ──────────────────────────────────────────── */

export type Platform =
  | "twitter"
  | "instagram"
  | "youtube"
  | "github"
  | "linkedin"
  | "newsletter"
  | "saas";

export type Theme = "dark" | "light" | "cream";

export type AspectRatio = "1:1" | "4:5" | "9:16" | "3:2";

export type BackgroundMode = "solid" | "gradient";

export type TextAlign = "left" | "center" | "right";

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
  color?: string; // optional custom color override
}

export interface CardConfig {
  platform: Platform;
  milestone: string;
  unit: string;
  handle: string;
  message: string;
  logoUrl?: string;

  theme: Theme;
  aspectRatio: AspectRatio;
  textAlign: TextAlign;

  milestoneStyle: TypographyStyle;
  unitStyle: TypographyStyle;
  messageStyle: TypographyStyle;

  backgroundMode: BackgroundMode;
  backgroundValue: string;
  noiseOpacity: number; // 0–100
}

/* ── DATA ───────────────────────────────────────────── */

export const BACKGROUND_PRESETS = [
  { label: "Midnight", mode: "solid" as BackgroundMode, value: "#0a0a0a" },
  { label: "White", mode: "solid" as BackgroundMode, value: "#ffffff" },
  { label: "Cream", mode: "solid" as BackgroundMode, value: "#f5f0e8" },
  { label: "Ocean", mode: "solid" as BackgroundMode, value: "#0f172a" },
  { label: "Purple", mode: "solid" as BackgroundMode, value: "#2e1065" },
  { label: "Teal", mode: "solid" as BackgroundMode, value: "#0d4141" },
  { label: "Sunset", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#ff7e5f 0%,#feb47b 100%)" },
  { label: "Aurora", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#00c6ff 0%,#0072ff 100%)" },
  { label: "Royal", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#7f00ff 0%,#e100ff 100%)" },
  { label: "Forest", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#134e5e 0%,#71b280 100%)" },
  { label: "Fire", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#f12711 0%,#f5af19 100%)" },
  { label: "Night Sky", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#141e30 0%,#243b55 100%)" },
  { label: "Rose Gold", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#b76e79 0%,#e8c5b0 100%)" },
  { label: "Carbon", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#1a1a1a 0%,#3a3a3a 100%)" },
  { label: "Neon", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#00ff87 0%,#60efff 100%)" },
  { label: "Dusk", mode: "gradient" as BackgroundMode, value: "linear-gradient(135deg,#2c3e50 0%,#fd746c 100%)" },
] satisfies BackgroundPreset[];

export const PLATFORMS: Record<
  Platform,
  { label: string; glyph: string; defaultUnit: string }
> = {
  twitter: { label: "X / Twitter", glyph: "𝕏", defaultUnit: "followers" },
  instagram: { label: "Instagram", glyph: "◈", defaultUnit: "followers" },
  youtube: { label: "YouTube", glyph: "▶", defaultUnit: "subscribers" },
  github: { label: "GitHub", glyph: "⌥", defaultUnit: "stars" },
  linkedin: { label: "LinkedIn", glyph: "in", defaultUnit: "connections" },
  newsletter: { label: "Newsletter", glyph: "✉", defaultUnit: "subscribers" },
  saas: { label: "SaaS", glyph: "◆", defaultUnit: "users" },
};

export const THEMES: Record<
  Theme,
  {
    bg: string;
    border: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
  }
> = {
  dark: {
    bg: "#0a0a0a",
    border: "#222",
    surface: "rgba(255,255,255,0.04)",
    textPrimary: "#fff",
    textSecondary: "#7a7a7a",
  },
  light: {
    bg: "#ffffff",
    border: "#e8e8e8",
    surface: "rgba(0,0,0,0.04)",
    textPrimary: "#111",
    textSecondary: "#777",
  },
  cream: {
    bg: "#f5f0e8",
    border: "#ddd0bf",
    surface: "rgba(0,0,0,0.05)",
    textPrimary: "#1b140f",
    textSecondary: "#7e6d5d",
  },
};

export const ASPECT_RATIOS: Record<AspectRatio, { label: string; css: string }> = {
  "1:1": { label: "Square", css: "1 / 1" },
  "4:5": { label: "Portrait", css: "4 / 5" },
  "9:16": { label: "Story", css: "9 / 16" },
  "3:2": { label: "Landscape", css: "3 / 2" },
};
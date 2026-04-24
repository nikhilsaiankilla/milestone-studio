"use client";

import { ASPECT_RATIOS, CardConfig, PLATFORMS } from "@/types/card";
import { forwardRef, useMemo } from "react";

const NOISE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

function getLuminance(hex: string): number {
    const clean = hex.replace("#", "");
    const full =
        clean.length === 3
            ? clean.split("").map((c) => c + c).join("")
            : clean;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

function isLightBackground(bg: string): boolean {
    if (!bg) return false;
    const lower = bg.toLowerCase();
    if (lower.includes("gradient")) {
        const hexMatches = [...lower.matchAll(/#([0-9a-f]{3,6})/g)];
        if (hexMatches.length === 0) return false;
        const avg =
            hexMatches.reduce((sum, m) => {
                const hex =
                    m[1].length === 3
                        ? m[1].split("").map((c) => c + c).join("")
                        : m[1];
                return sum + getLuminance("#" + hex);
            }, 0) / hexMatches.length;
        return avg > 170;
    }
    if (lower.startsWith("#")) return getLuminance(lower) > 170;
    const rgb = lower.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgb) {
        const [, r, g, b] = rgb.map(Number);
        return (r * 299 + g * 587 + b * 114) / 1000 > 170;
    }
    return false;
}

export const CardPreview = forwardRef<HTMLDivElement, { config: CardConfig }>(
    function CardPreview({ config }, ref) {
        const ratio = ASPECT_RATIOS[config.aspectRatio];
        const p = PLATFORMS[config.platform];

        const handle = config.handle
            ? config.handle.startsWith("@")
                ? config.handle
                : `@${config.handle}`
            : null;

        const isLight = useMemo(
            () => isLightBackground(config.backgroundValue),
            [config.backgroundValue]
        );

        const auto = useMemo(
            () => ({
                primary: isLight ? "#111111" : "#ffffff",
                secondary: isLight ? "#555555" : "#7a7a7a",
                divider: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
                corner: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                overlayGrad: isLight
                    ? "linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(0,0,0,0.04))"
                    : "linear-gradient(to bottom, rgba(255,255,255,0.02), rgba(0,0,0,0.28))",
            }),
            [isLight]
        );

        const ms = config.milestoneStyle;
        const us = config.unitStyle;
        const mgs = config.messageStyle;

        const noiseAlpha = ((config.noiseOpacity ?? 0) / 100) * 0.35;
        const align = config.textAlign ?? "left";

        // Per-field colors: use custom override if set, else auto
        const milestoneColor = ms.color || auto.primary;
        const unitColor = us.color || auto.secondary;
        const messageColor = mgs.color || auto.secondary;

        return (
            <div
                className="w-full max-w-[480px] transition-all duration-500"
                style={{ aspectRatio: ratio.css }}
            >
                <div
                    ref={ref}
                    className="w-full h-full rounded-2xl relative overflow-hidden flex flex-col justify-between p-[8%]"
                    style={{
                        background: config.backgroundValue,
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    {/* Depth overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: auto.overlayGrad }}
                    />

                    {/* Noise / grain */}
                    {noiseAlpha > 0 && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `url("${NOISE_SVG}")`,
                                backgroundRepeat: "repeat",
                                backgroundSize: "200px 200px",
                                opacity: noiseAlpha,
                                mixBlendMode: isLight ? "multiply" : "screen",
                            }}
                        />
                    )}

                    {/* Corner accent */}
                    <div className="absolute top-0 left-0 w-[30%] pt-[30%] pointer-events-none overflow-hidden">
                        <div
                            className="absolute inset-0 rounded-br-full"
                            style={{ background: auto.corner }}
                        />
                    </div>

                    {/* Optional logo — top right */}
                    {config.logoUrl && (
                        <img
                            src={config.logoUrl}
                            alt="logo"
                            className="absolute top-[8%] right-[8%] z-10"
                            style={{
                                width: "36px",
                                height: "36px",
                                objectFit: "contain",
                                borderRadius: "6px",
                                opacity: 0.9,
                            }}
                        />
                    )}

                    {/* TOP — platform */}
                    <div className="relative z-10" style={{ textAlign: align }}>
                        <div
                            className="text-2xl font-bold mb-1"
                            style={{ color: auto.secondary }}
                        >
                            {p.glyph}
                        </div>
                        <div
                            className="text-[9px] uppercase tracking-[0.25em]"
                            style={{ color: auto.secondary, opacity: 0.8 }}
                        >
                            {p.label}
                        </div>
                    </div>

                    {/* CENTER — milestone */}
                    <div
                        className="relative z-10 flex-1 flex flex-col justify-center"
                        style={{ textAlign: align }}
                    >
                        <h1
                            style={{
                                fontFamily: ms.family,
                                fontWeight: ms.weight,
                                fontSize: `${ms.size}px`,
                                letterSpacing: `${ms.spacing}px`,
                                color: milestoneColor,
                                lineHeight: 1,
                                textTransform: ms.uppercase ? "uppercase" : "none",
                                textShadow: isLight ? "none" : "0 4px 16px rgba(0,0,0,0.3)",
                            }}
                        >
                            {config.milestone || "0"}
                        </h1>

                        <p
                            className="mt-2"
                            style={{
                                fontFamily: us.family,
                                fontWeight: us.weight,
                                fontSize: `${us.size}px`,
                                letterSpacing: `${us.spacing}px`,
                                color: unitColor,
                                textTransform: us.uppercase ? "uppercase" : "none",
                            }}
                        >
                            {config.unit}
                        </p>
                    </div>

                    {/* BOTTOM — handle + message */}
                    <div className="relative z-10" style={{ textAlign: align }}>
                        <div
                            className="h-px w-full mb-4"
                            style={{ background: auto.divider }}
                        />

                        {handle && (
                            <p
                                className="mb-1"
                                style={{ fontSize: "13px", fontWeight: 400, color: auto.primary, fontFamily: "Inter", letterSpacing: 0.5, textTransform: "none" }}
                            >
                                {handle}
                            </p>
                        )}

                        {config.message && (
                            <p
                                style={{
                                    fontFamily: mgs.family,
                                    fontWeight: mgs.weight,
                                    fontSize: `${mgs.size}px`,
                                    letterSpacing: `${mgs.spacing}px`,
                                    color: messageColor,
                                    lineHeight: 1.6,
                                    textTransform: mgs.uppercase ? "uppercase" : "none",
                                }}
                            >
                                {config.message}
                            </p>
                        )}
                    </div>

                    {/* Inner ring */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none" />
                </div>
            </div>
        );
    }
);
"use client";

import { isLight } from "@/app/page";
import { ASPECT_RATIOS, CardConfig, PLATFORMS } from "@/types/card";
import { forwardRef, useState, useEffect } from "react";

const NOISE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

interface TimeLeft { d: number; h: number; m: number; s: number }

export function fmtNum(val: string, auto: boolean, prefix = ""): string {
    if (!auto) return prefix + val;
    const n = parseFloat(val.replace(/,/g, ""));
    if (isNaN(n)) return prefix + val;
    if (n >= 1e6) return prefix + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return prefix + (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return prefix + n.toLocaleString();
}

export const CardPreview = forwardRef<HTMLDivElement, { config: CardConfig }>(
    function CardPreview({ config: cfg }, ref) {
        const [imgFailed, setImgFailed] = useState(false)
        
        const light = isLight(cfg.backgroundValue);
        const auto = {
            pri: light ? "#111" : "#fff",
            sec: light ? "#666" : "#6a6a6a",
            div: light ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
            overlay: light
                ? "linear-gradient(to bottom,rgba(255,255,255,0.06),rgba(0,0,0,0.03))"
                : "linear-gradient(to bottom,rgba(255,255,255,0.03),rgba(0,0,0,0.3))",
        };

        // mStyle is the canonical field in all templates and DEFAULT_CONFIG
        const ms = cfg.mStyle;
        const us = cfg.unitStyle;
        const gs = cfg.messageStyle;
        const mColor = ms.color || auto.pri;
        const uColor = us.color || auto.sec;
        const gColor = gs.color || auto.sec;
        const noiseA = ((cfg.noiseOpacity ?? 0) / 100) * 0.35;
        const accent = cfg.accentColor || "#00ff87";
        const platform = PLATFORMS[cfg.platform] || PLATFORMS.twitter;
        const mode = cfg.cardMode || "standard";
        const ratio = ASPECT_RATIOS[cfg.aspectRatio] || ASPECT_RATIOS["1:1"];
        const borderRadius = cfg.cardBorderRadius ?? 16;

        const displayVal = cfg.autoFormatNumber
            ? fmtNum(cfg.milestone, true, cfg.currencyPrefix || "")
            : (cfg.currencyPrefix || "") + cfg.milestone;
        const displayBefore = cfg.milestoneBefore || "0";
        const displayGoal = cfg.milestoneGoal || "";

        const progressPct = cfg.milestoneGoal
            ? Math.min(100, Math.round((parseFloat(cfg.milestone) / parseFloat(cfg.milestoneGoal)) * 100))
            : 0;

        const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

        useEffect(() => {
            if (!cfg.showCountdown || !cfg.countdownTarget) { setTimeLeft(null); return; }
            const tick = () => {
                const diff = new Date(cfg.countdownTarget!).getTime() - Date.now();
                if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
                setTimeLeft({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
            };
            tick();
            const id = setInterval(tick, 1000);
            return () => clearInterval(id);
        }, [cfg.showCountdown, cfg.countdownTarget]);

        const pad = (n: number) => String(n).padStart(2, "0");

        return (
            <div
                ref={ref}
                style={{
                    width: "420px",
                    maxWidth: "90vw",
                    flexShrink: 0,
                    aspectRatio:
                        cfg.aspectRatio === "1:1"
                            ? "1 / 1"
                            : cfg.aspectRatio === "4:5"
                                ? "4 / 5"
                                : "3 / 2",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "8%",
                        boxSizing: "border-box",
                        background: cfg.backgroundValue,
                        borderRadius: cfg.cardBorderRadius ?? 16,
                    }}
                >
                    {/* Overlay */}
                    <div style={{ position: "absolute", inset: 0, background: auto.overlay, pointerEvents: "none" }} />

                    {/* Noise */}
                    {noiseA > 0 && (
                        <div style={{
                            position: "absolute", inset: 0, pointerEvents: "none",
                            backgroundImage: `url("${NOISE_SVG}")`, backgroundRepeat: "repeat", backgroundSize: "200px",
                            opacity: noiseA, mixBlendMode: light ? "multiply" : "screen",
                        }} />
                    )}

                    {/* TikTok duotone glitch layers */}
                    {mode === "tiktokDuotone" && (
                        <>
                            <div style={{ position: "absolute", inset: 0, background: "#fe2c55", opacity: 0.55, transform: "translate(4px,-3px)", mixBlendMode: "screen", pointerEvents: "none" }} />
                            <div style={{ position: "absolute", inset: 0, background: "#25f4ee", opacity: 0.45, transform: "translate(-4px,3px)", mixBlendMode: "screen", pointerEvents: "none" }} />
                        </>
                    )}

                    {/* Story progress bar */}
                    {mode === "story" && (
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.12)", zIndex: 20 }}>
                            <div style={{ height: "100%", width: `${cfg.storyProgress ?? 70}%`, background: accent, transition: "width 0.5s ease" }} />
                        </div>
                    )}

                    {/* Logo */}
                    {cfg.logoUrl && (
                        <img src={cfg.logoUrl} alt="logo" style={{
                            position: "absolute", top: "8%",
                            ...(cfg.logoAlign === "left" ? { left: "8%" } : cfg.logoAlign === "center" ? { left: "50%", transform: "translateX(-50%)" } : { right: "8%" }),
                            zIndex: 10, width: cfg.imageSize ?? 55, height: cfg.imageSize ?? 55,
                            objectFit: "contain", borderRadius: 6, opacity: 0.9,
                        }} />
                    )}

                    {/* ── SLOT MACHINE (X three-row) ── */}
                    {mode === "slotMachine" ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 10, gap: 0 }}>
                            {/* Platform glyph top-left */}
                            <div style={{ position: "absolute", top: 0, left: 0, fontSize: 18, fontWeight: 900, color: "rgba(255,255,255,0.35)" }}>
                                {platform.glyph}
                            </div>

                            {/* Past */}
                            <div style={{ textAlign: "center", width: "100%", paddingBottom: 10 }}>
                                <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size * 0.55, letterSpacing: ms.spacing, color: "rgba(255,255,255,0.2)", lineHeight: 1 }}>
                                    {displayBefore}
                                </div>
                                <div style={{ fontSize: us.size * 0.8, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: us.spacing, marginTop: 4 }}>was</div>
                            </div>

                            <div style={{ width: "60%", height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 10 }} />

                            {/* Current */}
                            <div style={{ textAlign: "center", width: "100%", padding: "4px 0" }}>
                                <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size, letterSpacing: ms.spacing, color: mColor, lineHeight: 1 }}>
                                    {displayVal}
                                </div>
                                <div style={{ fontSize: us.size, color: uColor, textTransform: us.uppercase ? "uppercase" : "none", letterSpacing: us.spacing, marginTop: 6 }}>
                                    {cfg.unit}
                                </div>
                            </div>

                            <div style={{ width: "60%", height: 1, background: "rgba(255,255,255,0.08)", marginTop: 10, marginBottom: 10 }} />

                            {/* Goal */}
                            <div style={{ textAlign: "center", width: "100%", paddingTop: 10 }}>
                                <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size * 0.55, letterSpacing: ms.spacing, color: "rgba(255,255,255,0.2)", lineHeight: 1 }}>
                                    {displayGoal}
                                </div>
                                <div style={{ fontSize: us.size * 0.8, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: us.spacing, marginTop: 4 }}>goal</div>
                            </div>

                            {/* Handle bottom-left */}
                            {cfg.handle && (
                                <div style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    fontSize: gs.size,
                                    color: "rgba(255,255,255,0.25)"
                                }}>
                                    {cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}
                                </div>
                            )}
                        </div>

                    ) : mode === "progressTarget" ? (
                        /* ── PRODUCT HUNT PROGRESS ── */
                        <>
                            {/* TOP: platform badge */}
                            {cfg.showPlatformBadge ? (
                                <div style={{ position: "relative", zIndex: 10 }}>
                                    {platform.image && !imgFailed ? (
                                        <img
                                            src={platform.image}
                                            alt={platform.label}
                                            onError={() => setImgFailed(true)}
                                            style={{
                                                width: 28,
                                                height: 28,
                                                objectFit: "contain",
                                                borderRadius: 4,
                                                opacity: 0.9,
                                                marginBottom: 6,
                                                display: "block",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: "rgba(255,255,255,0.7)",
                                                marginBottom: 4,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {platform.glyph}
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            fontSize: 7,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.28em",
                                            color: "rgba(255,255,255,0.55)",
                                        }}
                                    >
                                        {platform.label}
                                    </div>
                                </div>
                            ) : (
                                <div />
                            )}

                            {/* CENTER: count */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
                                <h1 style={{ margin: 0, fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size, letterSpacing: ms.spacing, color: mColor, lineHeight: 1 }}>
                                    {displayVal}
                                </h1>
                                <p style={{ margin: "8px 0 0", fontFamily: us.family, fontWeight: us.weight, fontSize: us.size, letterSpacing: us.spacing, color: uColor, textTransform: us.uppercase ? "uppercase" : "none" }}>
                                    {cfg.unit}
                                </p>
                            </div>

                            {/* BOTTOM: progress bar */}
                            <div style={{ position: "relative", zIndex: 10 }}>
                                <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                                    <div style={{ height: "100%", width: `${progressPct}%`, background: "#ffffff", borderRadius: 2, transition: "width 0.5s ease" }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontFamily: gs.family, fontWeight: gs.weight, fontSize: gs.size, color: "rgba(255,255,255,0.6)", letterSpacing: gs.spacing }}>
                                        {cfg.goalLabel || `Goal: ${displayGoal}`}
                                    </span>
                                    <span style={{ fontSize: gs.size, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                                        {progressPct}%
                                    </span>
                                </div>
                            </div>
                        </>

                    ) : mode === "rank" ? (
                        /* ── RANK (PH Product of the Day) ── */
                        <>
                            {cfg.showPlatformBadge ? (
                                <div style={{ position: "relative", zIndex: 10 }}>
                                    {platform.image ? (
                                        <img src={platform.image} alt="" style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4, opacity: 0.9, marginBottom: 6 }} />
                                    ) : (
                                        <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{platform.glyph}</div>
                                    )}
                                    <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.55)" }}>{platform.label}</div>
                                </div>
                            ) : <div />}

                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
                                <h1 style={{ margin: 0, fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size, letterSpacing: ms.spacing, color: mColor, lineHeight: 1 }}>
                                    {cfg.milestone}
                                </h1>
                                <p style={{ margin: "10px 0 0", fontFamily: us.family, fontWeight: us.weight, fontSize: us.size, letterSpacing: us.spacing, color: uColor }}>
                                    {cfg.message || "Product of the Day"}
                                </p>
                            </div>

                            <div style={{ position: "relative", zIndex: 10 }}>
                                {cfg.handle && (
                                    <p style={{ margin: 0, fontSize: gs.size, color: gColor, fontFamily: gs.family }}>
                                        {cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}
                                    </p>
                                )}
                            </div>
                        </>

                    ) : mode === "beforeAfter" ? (
                        /* ── BEFORE / AFTER ── */
                        <>
                            <div />
                            <div style={{ flex: 1, display: "flex", alignItems: "stretch", position: "relative", zIndex: 10 }}>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "6%", borderRight: `1px solid ${auto.div}` }}>
                                    <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: 3, color: auto.sec, marginBottom: 10, opacity: 0.6 }}>Before</div>
                                    <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: Math.min(ms.size * 0.62, 50), letterSpacing: ms.spacing, color: auto.sec, lineHeight: 1, opacity: 0.35, textDecoration: "line-through" }}>
                                        {displayBefore}
                                    </div>
                                    <div style={{ fontSize: Math.min(us.size * 0.85, 12), color: auto.sec, marginTop: 5, opacity: 0.35, textTransform: us.uppercase ? "uppercase" : "none", letterSpacing: us.spacing * 0.5 }}>
                                        {cfg.unit}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 18px", color: accent, fontSize: 20, fontWeight: 900 }}>→</div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "6%" }}>
                                    <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: 3, color: accent, marginBottom: 10, opacity: 0.9 }}>After</div>
                                    <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: Math.min(ms.size * 0.62, 50), letterSpacing: ms.spacing, color: mColor, lineHeight: 1 }}>
                                        {displayVal}
                                    </div>
                                    <div style={{ fontFamily: us.family, fontWeight: us.weight, fontSize: Math.min(us.size, 13), letterSpacing: us.spacing, color: uColor, marginTop: 5, textTransform: us.uppercase ? "uppercase" : "none" }}>
                                        {cfg.unit}
                                    </div>
                                </div>
                            </div>
                            <div style={{ position: "relative", zIndex: 10, textAlign: gs.align }}>
                                {cfg.handle && <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 500, color: auto.pri, opacity: 0.9 }}>{cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}</p>}
                                {cfg.message && <p style={{ margin: 0, fontFamily: gs.family, fontWeight: gs.weight, fontSize: gs.size, letterSpacing: gs.spacing, color: gColor, lineHeight: 1.65 }}>{cfg.message}</p>}
                            </div>
                        </>

                    ) : (
                        /* ── STANDARD / STORY / TIKTOK DUOTONE ── */
                        <>
                            {/* TOP: platform badge */}
                            {cfg.showPlatformBadge ? (
                                <div style={{ position: "relative", zIndex: 10, textAlign: ms.align }}>
                                    {platform.image ? (
                                        <img src={platform.image} alt="" style={{
                                            width: 30, height: 30, objectFit: "contain", borderRadius: 4, opacity: 0.8,
                                            display: ms.align === "center" ? "block" : "inline-block",
                                            margin: ms.align === "center" ? "0 auto 6px" : "0 0 6px",
                                        }} />
                                    ) : (
                                        <div style={{ fontSize: 18, fontWeight: 700, color: auto.sec, marginBottom: 4 }}>{platform.glyph}</div>
                                    )}
                                    <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.28em", color: auto.sec, opacity: 0.6 }}>
                                        {platform.label}
                                    </div>
                                </div>
                            ) : <div />}

                            {/* Twitch LIVE badge */}
                            {cfg.showLiveBadge && (
                                <div style={{ position: "absolute", top: "8%", right: "8%", zIndex: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4444" }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#fff" }}>LIVE</span>
                                </div>
                            )}

                            {/* Story countdown */}
                            {mode === "story" && cfg.showCountdown && timeLeft && (
                                <div style={{
                                    position: "relative", zIndex: 10, display: "flex", gap: 12,
                                    justifyContent: ms.align === "center" ? "center" : ms.align === "right" ? "flex-end" : "flex-start",
                                    marginTop: 14,
                                }}>
                                    {(["d", "h", "m", "s"] as const).map((k, i) => (
                                        <div key={k} style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 26, fontWeight: 900, color: accent, lineHeight: 1 }}>{pad(timeLeft[k])}</div>
                                            <div style={{ fontSize: 7, color: auto.sec, textTransform: "uppercase", letterSpacing: 1.5 }}>{["days", "hrs", "min", "sec"][i]}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CENTER */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10, textAlign: ms.align }}>
                                {cfg.growthLabel && (
                                    <div style={{ marginBottom: 14, textAlign: ms.align }}>
                                        <span style={{
                                            display: "inline-block",
                                            background: "rgba(0,255,135,0.12)",
                                            border: "1px solid rgba(0,255,135,0.25)",
                                            color: "#00ff87", fontSize: 10, fontWeight: 700,
                                            padding: "3px 11px", borderRadius: 20, letterSpacing: 1.5,
                                        }}>
                                            {cfg.growthLabel}
                                        </span>
                                    </div>
                                )}
                                <h1 style={{
                                    margin: 0,
                                    fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size,
                                    letterSpacing: ms.spacing, color: mColor, lineHeight: 1,
                                    textTransform: ms.uppercase ? "uppercase" : "none",
                                }}>
                                    {displayVal}
                                </h1>
                                <p style={{
                                    margin: "8px 0 0",
                                    fontFamily: us.family, fontWeight: us.weight, fontSize: us.size,
                                    letterSpacing: us.spacing, color: uColor,
                                    textTransform: us.uppercase ? "uppercase" : "none",
                                    textAlign: us.align,
                                }}>
                                    {cfg.unit}
                                </p>
                            </div>

                            {/* BOTTOM */}
                            <div style={{ position: "relative", zIndex: 10, textAlign: gs.align }}>
                                {cfg.showDivider && (
                                    <div style={{ height: 1, background: auto.div, marginBottom: 14 }} />
                                )}
                                {cfg.handle && (
                                    <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 500, color: auto.pri, letterSpacing: 0.3, opacity: 0.9 }}>
                                        {cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}
                                    </p>
                                )}
                                {cfg.message && (
                                    <p style={{
                                        margin: 0,
                                        fontFamily: gs.family, fontWeight: gs.weight, fontSize: gs.size,
                                        letterSpacing: gs.spacing, color: gColor, lineHeight: 1.65,
                                        textTransform: gs.uppercase ? "uppercase" : "none",
                                    }}>
                                        {cfg.message}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Inner ring */}
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)", borderRadius }} />
                </div>
            </div>
        );
    }
);
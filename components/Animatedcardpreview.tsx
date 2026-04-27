"use client";

/**
 * AnimatedCardPreview — drop-in replacement for CardPreview
 * when animation mode is active.
 *
 * Features:
 * - CSS keyframe animations for every card mode
 * - MP4/WebM video export via MediaRecorder + html2canvas frame capture
 * - Animate button in the toolbar
 *
 * Usage:
 *   import { AnimatedCardPreview } from "@/components/AnimatedCardPreview"
 *
 *   // In your page, swap CardPreview → AnimatedCardPreview
 *   // and wire up the isAnimating / onDownloadVideo props.
 */

import { forwardRef, useRef, useEffect, useState, useCallback } from "react";
import { CardConfig, PLATFORMS, ASPECT_RATIOS } from "@/types/card";
import { isLight } from "@/app/page";

/* ─── Noise texture (same as CardPreview) ─── */
const NOISE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

export function fmtNum(val: string, auto: boolean, prefix = ""): string {
  if (!auto) return prefix + val;
  const n = parseFloat(val.replace(/,/g, ""));
  if (isNaN(n)) return prefix + val;
  if (n >= 1e6) return prefix + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return prefix + (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return prefix + n.toLocaleString();
}

/* ─── helpers ─── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ─────────────────────────────────────────────────────────
   VIDEO EXPORT
   We capture frames from the card DOM using html2canvas,
   then push them into a <canvas> and record that canvas
   with MediaRecorder to get a WebM blob.
   ───────────────────────────────────────────────────────── */
async function recordCardAnimation(
  cardEl: HTMLElement,
  durationMs: number,
  fps: number,
  onProgress: (pct: number) => void
): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas");

  const rect = cardEl.getBoundingClientRect();
  const W = Math.round(rect.width * 2);   // 2× for sharpness
  const H = Math.round(rect.height * 2);

  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const ctx = offscreen.getContext("2d")!;

  // Detect best mime type
  const mime = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
    ? "video/mp4;codecs=avc1"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

  const chunks: Blob[] = [];
  const stream = offscreen.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 8_000_000,
  });
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  return new Promise(async (resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));

    recorder.start();

    const totalFrames = Math.round((durationMs / 1000) * fps);
    const msPerFrame = 1000 / fps;

    for (let i = 0; i <= totalFrames; i++) {
      const snap = await html2canvas(cardEl, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      });
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(snap, 0, 0, W, H);
      onProgress(Math.round((i / totalFrames) * 100));
      await new Promise((r) => setTimeout(r, msPerFrame));
    }

    recorder.stop();
  });
}

/* ─────────────────────────────────────────────────────────
   ANIMATION CONFIGS per cardMode
   Each config drives CSS keyframes injected into a <style>
   tag that lives inside the card DOM.
   ───────────────────────────────────────────────────────── */
type AnimCfg = {
  /** total animation loop duration (ms) */
  duration: number;
  /** CSS keyframes string injected into card */
  keyframes: string;
  /** class names applied to specific card elements */
  classes: {
    milestone?: string;
    unit?: string;
    handle?: string;
    message?: string;
    badge?: string;
    before?: string;
    after?: string;
    progress?: string;
    slotRows?: string;
  };
};

/* ── Slot Machine: rows scroll into place ── */
const SLOT_ANIM: AnimCfg = {
  duration: 2400,
  keyframes: `
    @keyframes slot-in-past {
      0%   { opacity: 0; transform: translateY(-40px); }
      30%  { opacity: 0.2; transform: translateY(0); }
      100% { opacity: 0.2; transform: translateY(0); }
    }
    @keyframes slot-in-now {
      0%   { opacity: 0; transform: translateY(30px) scale(0.85); }
      25%  { opacity: 0; transform: translateY(30px) scale(0.85); }
      65%  { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes slot-in-goal {
      0%   { opacity: 0; transform: translateY(40px); }
      55%  { opacity: 0; transform: translateY(40px); }
      100% { opacity: 0.2; transform: translateY(0); }
    }
    @keyframes slot-count-up {
      0%   { letter-spacing: 8px; }
      65%  { letter-spacing: inherit; }
      100% { letter-spacing: inherit; }
    }
    @keyframes slot-divider {
      0%   { transform: scaleX(0); opacity: 0; }
      40%  { transform: scaleX(0); opacity: 0; }
      70%  { transform: scaleX(1); opacity: 1; }
      100% { transform: scaleX(1); opacity: 1; }
    }
  `,
  classes: {
    before: "slot-anim-past",
    milestone: "slot-anim-now",
    after: "slot-anim-goal",
  },
};

/* ── GitHub Stars: number counts up + stars scatter ── */
const GITHUB_STARS_ANIM: AnimCfg = {
  duration: 2800,
  keyframes: `
    @keyframes gh-reveal {
      0%   { opacity: 0; transform: translateY(24px); }
      40%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes gh-count {
      0%   { opacity: 0; filter: blur(8px); letter-spacing: 12px; }
      30%  { opacity: 0; filter: blur(8px); letter-spacing: 12px; }
      70%  { opacity: 1; filter: blur(0); letter-spacing: inherit; }
      100% { opacity: 1; filter: blur(0); letter-spacing: inherit; }
    }
    @keyframes gh-unit {
      0%   { opacity: 0; transform: translateX(-12px); }
      60%  { opacity: 0; transform: translateX(-12px); }
      90%  { opacity: 1; transform: translateX(0); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes gh-star-1 {
      0%,50% { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
      70%  { opacity: 1; transform: translate(-30px,-40px) scale(1.2) rotate(30deg); }
      90%  { opacity: 0.7; transform: translate(-35px,-50px) scale(1) rotate(45deg); }
      100% { opacity: 0; transform: translate(-40px,-60px) scale(0.8) rotate(60deg); }
    }
    @keyframes gh-star-2 {
      0%,55% { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
      75%  { opacity: 1; transform: translate(25px,-30px) scale(1) rotate(-20deg); }
      90%  { opacity: 0.6; transform: translate(30px,-40px) scale(0.9) rotate(-35deg); }
      100% { opacity: 0; transform: translate(35px,-55px) scale(0.7) rotate(-50deg); }
    }
    @keyframes gh-star-3 {
      0%,60% { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
      80%  { opacity: 1; transform: translate(10px,-45px) scale(1.1) rotate(15deg); }
      90%  { opacity: 0.5; transform: translate(12px,-55px) scale(0.9) rotate(25deg); }
      100% { opacity: 0; transform: translate(15px,-65px) scale(0.7) rotate(40deg); }
    }
    @keyframes gh-shine {
      0%,60% { opacity: 0; }
      75%  { opacity: 0.15; }
      90%  { opacity: 0; }
      100% { opacity: 0; }
    }
  `,
  classes: {
    milestone: "gh-anim-count",
    unit: "gh-anim-unit",
    handle: "gh-anim-reveal",
    message: "gh-anim-reveal",
  },
};

/* ── Standard milestone: cinematic reveal ── */
const STANDARD_ANIM: AnimCfg = {
  duration: 2200,
  keyframes: `
    @keyframes std-badge {
      0%   { opacity: 0; transform: scale(0.8) translateY(-8px); }
      35%  { opacity: 1; transform: scale(1) translateY(0); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes std-num {
      0%   { opacity: 0; transform: translateY(20px) scale(0.9); filter: blur(6px); }
      20%  { opacity: 0; }
      60%  { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes std-unit {
      0%,40% { opacity: 0; transform: translateX(-8px); }
      70%  { opacity: 1; transform: translateX(0); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes std-bottom {
      0%,55% { opacity: 0; transform: translateY(10px); }
      85%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes std-flash {
      0%,30%  { opacity: 0; }
      45%  { opacity: 0.12; }
      55%  { opacity: 0; }
      100% { opacity: 0; }
    }
  `,
  classes: {
    badge: "std-anim-badge",
    milestone: "std-anim-num",
    unit: "std-anim-unit",
    message: "std-anim-bottom",
    handle: "std-anim-bottom",
  },
};

/* ── Progress: bar fills up ── */
const PROGRESS_ANIM: AnimCfg = {
  duration: 2600,
  keyframes: `
    @keyframes prog-num {
      0%   { opacity: 0; transform: translateY(18px); }
      35%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes prog-bar {
      0%,40% { width: 0% !important; }
      90%  { width: var(--prog-pct) !important; }
      100% { width: var(--prog-pct) !important; }
    }
    @keyframes prog-label {
      0%,60% { opacity: 0; }
      90%  { opacity: 1; }
      100% { opacity: 1; }
    }
  `,
  classes: {
    milestone: "prog-anim-num",
    progress: "prog-anim-bar",
    message: "prog-anim-label",
  },
};

/* ── Rank: pops in with bounce ── */
const RANK_ANIM: AnimCfg = {
  duration: 2000,
  keyframes: `
    @keyframes rank-pop {
      0%   { opacity: 0; transform: scale(0.4) rotate(-8deg); }
      50%  { opacity: 1; transform: scale(1.1) rotate(2deg); }
      65%  { transform: scale(0.97) rotate(-1deg); }
      80%  { transform: scale(1.02) rotate(0.5deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes rank-label {
      0%,40% { opacity: 0; transform: translateX(-12px); }
      75%  { opacity: 1; transform: translateX(0); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes rank-sub {
      0%,55% { opacity: 0; transform: translateY(8px); }
      90%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `,
  classes: {
    milestone: "rank-anim-pop",
    unit: "rank-anim-label",
    message: "rank-anim-sub",
    handle: "rank-anim-sub",
  },
};

/* ── TikTok duotone: glitch burst ── */
const TIKTOK_ANIM: AnimCfg = {
  duration: 2000,
  keyframes: `
    @keyframes tt-glitch-r {
      0%,60%  { transform: translate(4px,-3px); opacity: 0.55; }
      62% { transform: translate(12px,-6px); opacity: 0.9; }
      64% { transform: translate(-8px,3px); opacity: 0.7; }
      66% { transform: translate(4px,-3px); opacity: 0.55; }
      80%,90% { transform: translate(4px,-3px); opacity: 0.55; }
      82% { transform: translate(16px,-8px); opacity: 0.95; }
      84% { transform: translate(-10px,4px); opacity: 0.65; }
      86% { transform: translate(4px,-3px); opacity: 0.55; }
      100% { transform: translate(4px,-3px); opacity: 0.55; }
    }
    @keyframes tt-glitch-b {
      0%,60%  { transform: translate(-4px,3px); opacity: 0.45; }
      62% { transform: translate(-12px,7px); opacity: 0.85; }
      64% { transform: translate(9px,-4px); opacity: 0.6; }
      66% { transform: translate(-4px,3px); opacity: 0.45; }
      80%,90% { transform: translate(-4px,3px); opacity: 0.45; }
      82% { transform: translate(-16px,9px); opacity: 0.9; }
      84% { transform: translate(11px,-5px); opacity: 0.55; }
      86% { transform: translate(-4px,3px); opacity: 0.45; }
      100% { transform: translate(-4px,3px); opacity: 0.45; }
    }
    @keyframes tt-num {
      0%   { opacity: 0; transform: scale(1.3) skewX(-4deg); }
      30%  { opacity: 1; transform: scale(1) skewX(0deg); }
      100% { opacity: 1; }
    }
    @keyframes tt-word-in {
      0%,20% { opacity: 0; transform: translateY(16px); }
      55%  { opacity: 1; transform: translateY(0); }
      100% { opacity: 1; }
    }
  `,
  classes: {
    milestone: "tt-anim-num",
    unit: "tt-anim-word",
    handle: "tt-anim-word",
    message: "tt-anim-word",
  },
};

function getAnimCfg(mode: string): AnimCfg {
  switch (mode) {
    case "slotMachine": return SLOT_ANIM;
    case "standard":    return STANDARD_ANIM;
    case "progressTarget": return PROGRESS_ANIM;
    case "rank":        return RANK_ANIM;
    case "tiktokDuotone": return TIKTOK_ANIM;
    default:            return STANDARD_ANIM;
  }
}

/* ─────────────────────────────────────────────────────────
   ANIMATED CARD INNER
   Renders the card with animation classes applied.
   This is a separate component so the animation keyframes
   are scoped inside the card DOM (for html2canvas capture).
   ───────────────────────────────────────────────────────── */
interface AnimInnerProps {
  cfg: CardConfig;
  animating: boolean;
  animKey: number;  // bump to restart animation
}

function AnimCardInner({ cfg, animating, animKey }: AnimInnerProps) {
  const light = isLight(cfg.backgroundValue);
  const auto = {
    pri: light ? "#111" : "#fff",
    sec: light ? "#666" : "#6a6a6a",
    div: light ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
    overlay: light
      ? "linear-gradient(to bottom,rgba(255,255,255,0.06),rgba(0,0,0,0.03))"
      : "linear-gradient(to bottom,rgba(255,255,255,0.03),rgba(0,0,0,0.3))",
  };

  const ms = cfg.mStyle;
  const us = cfg.unitStyle;
  const gs = cfg.messageStyle;
  const mColor = ms.color || auto.pri;
  const uColor = us.color || auto.sec;
  const gColor = gs.color || auto.sec;
  const noiseA = ((cfg.noiseOpacity ?? 0) / 100) * 0.35;
  const platform = PLATFORMS[cfg.platform] || PLATFORMS.twitter;
  const mode = cfg.cardMode || "standard";
  const borderRadius = cfg.cardBorderRadius ?? 16;

  const displayVal = cfg.autoFormatNumber
    ? fmtNum(cfg.milestone, true, cfg.currencyPrefix || "")
    : (cfg.currencyPrefix || "") + cfg.milestone;
  const displayBefore = cfg.milestoneBefore || "0";
  const displayGoal = cfg.milestoneGoal || "";

  const progressPct = cfg.milestoneGoal
    ? Math.min(100, Math.round((parseFloat(cfg.milestone) / parseFloat(cfg.milestoneGoal)) * 100))
    : 0;

  const animCfg = getAnimCfg(mode);

  // Generate animation CSS with the animKey baked in for restart
  const dur = animCfg.duration;
  const animStyles = animating ? `
    ${animCfg.keyframes}
    
    /* Slot machine */
    .slot-anim-past { animation: slot-in-past ${dur}ms ease-out both; }
    .slot-anim-now  { animation: slot-in-now ${dur}ms ease-out both, slot-count-up ${dur}ms ease-out both; }
    .slot-anim-goal { animation: slot-in-goal ${dur}ms ease-out both; }
    .slot-divider   { animation: slot-divider ${dur}ms ease-out both; transform-origin: left center; }

    /* GitHub stars */
    .gh-anim-reveal { animation: gh-reveal ${dur}ms ease-out both; }
    .gh-anim-count  { animation: gh-count ${dur}ms ease-out both; }
    .gh-anim-unit   { animation: gh-unit ${dur}ms ease-out both; }
    .gh-star { position: absolute; font-size: 18px; animation-timing-function: ease-out; animation-fill-mode: both; }
    .gh-star-1 { animation: gh-star-1 ${dur}ms ease-out both; animation-delay: 0ms; }
    .gh-star-2 { animation: gh-star-2 ${dur}ms ease-out both; animation-delay: 80ms; }
    .gh-star-3 { animation: gh-star-3 ${dur}ms ease-out both; animation-delay: 160ms; }
    .gh-shine  { animation: gh-shine ${dur}ms ease-out both; position: absolute; inset: 0; background: radial-gradient(circle at 60% 40%, rgba(255,215,0,0.5), transparent 60%); pointer-events: none; border-radius: inherit; }

    /* Standard */
    .std-anim-badge  { animation: std-badge ${dur}ms ease-out both; }
    .std-anim-num    { animation: std-num ${dur}ms ease-out both; }
    .std-anim-unit   { animation: std-unit ${dur}ms ease-out both; }
    .std-anim-bottom { animation: std-bottom ${dur}ms ease-out both; }
    .std-flash       { animation: std-flash ${dur}ms ease-out both; position: absolute; inset: 0; background: white; pointer-events: none; border-radius: inherit; }

    /* Progress */
    .prog-anim-num  { animation: prog-num ${dur}ms ease-out both; }
    .prog-anim-bar  { animation: prog-bar ${dur}ms ease-out both !important; }
    .prog-anim-label { animation: prog-label ${dur}ms ease-out both; }

    /* Rank */
    .rank-anim-pop   { animation: rank-pop ${dur}ms cubic-bezier(0.34,1.56,0.64,1) both; }
    .rank-anim-label { animation: rank-label ${dur}ms ease-out both; }
    .rank-anim-sub   { animation: rank-sub ${dur}ms ease-out both; }

    /* TikTok */
    .tt-glitch-r { animation: tt-glitch-r ${dur}ms linear infinite; }
    .tt-glitch-b { animation: tt-glitch-b ${dur}ms linear infinite; }
    .tt-anim-num  { animation: tt-num ${dur}ms ease-out both; }
    .tt-anim-word { animation: tt-word-in ${dur}ms ease-out both; }
  ` : "";

  const isGithubStars = cfg.platform === "github" && (mode === "standard" || !mode);

  return (
    <div
      key={`anim-${animKey}`}
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
      {/* Injected animation keyframes */}
      {animating && <style>{animStyles}</style>}

      {/* Flash overlay for standard */}
      {animating && mode === "standard" && <div className="std-flash" />}
      
      {/* Gold shine for GitHub stars */}
      {animating && isGithubStars && <div className="gh-shine" />}

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
          <div className={animating ? "tt-glitch-r" : undefined} style={{ position: "absolute", inset: 0, background: "#fe2c55", opacity: 0.55, transform: "translate(4px,-3px)", mixBlendMode: "screen", pointerEvents: "none" }} />
          <div className={animating ? "tt-glitch-b" : undefined} style={{ position: "absolute", inset: 0, background: "#25f4ee", opacity: 0.45, transform: "translate(-4px,3px)", mixBlendMode: "screen", pointerEvents: "none" }} />
        </>
      )}

      {/* ── SLOT MACHINE ── */}
      {mode === "slotMachine" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 10, gap: 0 }}>
          <div style={{ position: "absolute", top: 0, left: 0, fontSize: 18, fontWeight: 900, color: "rgba(255,255,255,0.35)" }}>
            {platform.glyph}
          </div>

          {/* Past */}
          <div className={animating ? "slot-anim-past" : undefined} style={{ textAlign: "center", width: "100%", paddingBottom: 10 }}>
            <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size * 0.55, letterSpacing: ms.spacing, color: "rgba(255,255,255,0.2)", lineHeight: 1 }}>
              {displayBefore}
            </div>
            <div style={{ fontSize: us.size * 0.8, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: us.spacing, marginTop: 4 }}>was</div>
          </div>

          <div className={animating ? "slot-divider" : undefined} style={{ width: "60%", height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 10 }} />

          {/* Current */}
          <div className={animating ? "slot-anim-now" : undefined} style={{ textAlign: "center", width: "100%", padding: "4px 0" }}>
            <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size, letterSpacing: ms.spacing, color: mColor, lineHeight: 1 }}>
              {displayVal}
            </div>
            <div style={{ fontSize: us.size, color: uColor, textTransform: us.uppercase ? "uppercase" : "none", letterSpacing: us.spacing, marginTop: 6 }}>
              {cfg.unit}
            </div>
          </div>

          <div className={animating ? "slot-divider" : undefined} style={{ width: "60%", height: 1, background: "rgba(255,255,255,0.08)", marginTop: 10, marginBottom: 10 }} />

          {/* Goal */}
          <div className={animating ? "slot-anim-goal" : undefined} style={{ textAlign: "center", width: "100%", paddingTop: 10 }}>
            <div style={{ fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size * 0.55, letterSpacing: ms.spacing, color: "rgba(255,255,255,0.2)", lineHeight: 1 }}>
              {displayGoal}
            </div>
            <div style={{ fontSize: us.size * 0.8, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: us.spacing, marginTop: 4 }}>goal</div>
          </div>

          {cfg.handle && (
            <div style={{ position: "absolute", bottom: 0, left: 0, fontSize: gs.size, color: "rgba(255,255,255,0.25)" }}>
              {cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}
            </div>
          )}
        </div>

      ) : mode === "progressTarget" ? (
        /* ── PROGRESS TARGET ── */
        <>
          {cfg.showPlatformBadge ? (
            <div style={{ position: "relative", zIndex: 10 }}>
              {platform.image ? (
                <img src={platform.image} alt={platform.label} style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4, opacity: 0.9, marginBottom: 6, display: "block" }} />
              ) : (
                <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{platform.glyph}</div>
              )}
              <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(255,255,255,0.55)" }}>{platform.label}</div>
            </div>
          ) : <div />}

          <div className={animating ? "prog-anim-num" : undefined} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10 }}>
            <h1 style={{ margin: 0, fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size, letterSpacing: ms.spacing, color: mColor, lineHeight: 1 }}>
              {displayVal}
            </h1>
            <p style={{ margin: "8px 0 0", fontFamily: us.family, fontWeight: us.weight, fontSize: us.size, letterSpacing: us.spacing, color: uColor, textTransform: us.uppercase ? "uppercase" : "none" }}>
              {cfg.unit}
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
              <div
                className={animating ? "prog-anim-bar" : undefined}
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "#ffffff",
                  borderRadius: 2,
                  // @ts-ignore CSS custom property
                  "--prog-pct": `${progressPct}%`,
                }}
              />
            </div>
            <div className={animating ? "prog-anim-label" : undefined} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: gs.family, fontWeight: gs.weight, fontSize: gs.size, color: "rgba(255,255,255,0.6)", letterSpacing: gs.spacing }}>
                {cfg.goalLabel || `Goal: ${displayGoal}`}
              </span>
              <span style={{ fontSize: gs.size, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{progressPct}%</span>
            </div>
          </div>
        </>

      ) : mode === "rank" ? (
        /* ── RANK ── */
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
            <h1 className={animating ? "rank-anim-pop" : undefined} style={{ margin: 0, fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size, letterSpacing: ms.spacing, color: mColor, lineHeight: 1, display: "inline-block" }}>
              {cfg.milestone}
            </h1>
            <p className={animating ? "rank-anim-label" : undefined} style={{ margin: "10px 0 0", fontFamily: us.family, fontWeight: us.weight, fontSize: us.size, letterSpacing: us.spacing, color: uColor }}>
              {cfg.message || "Product of the Day"}
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 10 }}>
            {cfg.handle && (
              <p className={animating ? "rank-anim-sub" : undefined} style={{ margin: 0, fontSize: gs.size, color: gColor, fontFamily: gs.family }}>
                {cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}
              </p>
            )}
          </div>
        </>

      ) : (
        /* ── STANDARD / STORY / TIKTOK DUOTONE / GITHUB ── */
        <>
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

          {/* GitHub: floating star particles */}
          {animating && isGithubStars && (
            <div style={{ position: "absolute", zIndex: 20, bottom: "30%", left: "8%", pointerEvents: "none" }}>
              <span className="gh-star gh-star-1" style={{ fontSize: 20 }}>⭐</span>
              <span className="gh-star gh-star-2" style={{ fontSize: 14, top: 0, left: 20 }}>✨</span>
              <span className="gh-star gh-star-3" style={{ fontSize: 16, top: 0, left: 10 }}>⭐</span>
            </div>
          )}

          {/* Center */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 10, textAlign: ms.align }}>
            {cfg.growthLabel && (
              <div className={animating ? "std-anim-badge" : undefined} style={{ marginBottom: 14, textAlign: ms.align }}>
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
            <h1
              className={animating ? (mode === "tiktokDuotone" ? "tt-anim-num" : isGithubStars ? "gh-anim-count" : "std-anim-num") : undefined}
              style={{
                margin: 0, fontFamily: ms.family, fontWeight: ms.weight, fontSize: ms.size,
                letterSpacing: ms.spacing, color: mColor, lineHeight: 1,
                textTransform: ms.uppercase ? "uppercase" : "none",
              }}
            >
              {displayVal}
            </h1>
            <p
              className={animating ? (mode === "tiktokDuotone" ? "tt-anim-word" : isGithubStars ? "gh-anim-unit" : "std-anim-unit") : undefined}
              style={{
                margin: "8px 0 0", fontFamily: us.family, fontWeight: us.weight, fontSize: us.size,
                letterSpacing: us.spacing, color: uColor,
                textTransform: us.uppercase ? "uppercase" : "none",
                textAlign: us.align,
              }}
            >
              {cfg.unit}
            </p>
          </div>

          {/* Bottom */}
          <div style={{ position: "relative", zIndex: 10, textAlign: gs.align }}>
            {cfg.showDivider && <div style={{ height: 1, background: auto.div, marginBottom: 14 }} />}
            {cfg.handle && (
              <p
                className={animating ? (mode === "tiktokDuotone" ? "tt-anim-word" : isGithubStars ? "gh-anim-reveal" : "std-anim-bottom") : undefined}
                style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 500, color: auto.pri, letterSpacing: 0.3, opacity: 0.9 }}
              >
                {cfg.handle.startsWith("@") ? cfg.handle : "@" + cfg.handle}
              </p>
            )}
            {cfg.message && (
              <p
                className={animating ? (mode === "tiktokDuotone" ? "tt-anim-word" : isGithubStars ? "gh-anim-reveal" : "std-anim-bottom") : undefined}
                style={{
                  margin: 0, fontFamily: gs.family, fontWeight: gs.weight, fontSize: gs.size,
                  letterSpacing: gs.spacing, color: gColor, lineHeight: 1.65,
                  textTransform: gs.uppercase ? "uppercase" : "none",
                }}
              >
                {cfg.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Inner ring */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)", borderRadius }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PUBLIC COMPONENT: AnimatedCardPreview
   ───────────────────────────────────────────────────────── */
export interface AnimatedCardPreviewProps {
  config: CardConfig;
  isAnimating: boolean;
  animKey: number;
}

export const AnimatedCardPreview = forwardRef<HTMLDivElement, AnimatedCardPreviewProps>(
  function AnimatedCardPreview({ config: cfg, isAnimating, animKey }, ref) {
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
        <AnimCardInner cfg={cfg} animating={isAnimating} animKey={animKey} />
      </div>
    );
  }
);

/* ─────────────────────────────────────────────────────────
   VIDEO EXPORT HOOK
   Call from parent to trigger the record + download flow.
   ───────────────────────────────────────────────────────── */
export function useVideoExport(cardRef: React.RefObject<HTMLDivElement | null>) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportVideo = useCallback(async (durationMs: number) => {
    if (!cardRef.current) return;
    setExporting(true);
    setProgress(0);
    try {
      const blob = await recordCardAnimation(
        cardRef.current,
        durationMs,
        24,
        setProgress
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      // Detect extension
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      a.download = `milestone-card.${ext}`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Video export failed:", err);
      alert("Video export failed. Try a shorter animation or different browser.");
    } finally {
      setExporting(false);
      setProgress(0);
    }
  }, [cardRef]);

  return { exportVideo, exporting, progress };
}
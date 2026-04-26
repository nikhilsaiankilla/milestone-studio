/*
  export.ts — PNG download via native Canvas API
  ------------------------------------------------
  We draw directly to a canvas rather than relying on html2canvas.
  This gives us full control over resolution, fonts, and layout.
  The card is drawn at 2× the display size for crisp retina output.
*/

import type { CardConfig } from "@/types/card";
import { PLATFORMS, THEMES } from "@/types/card";

const CARD_W = 1080;  // output width in px
const CARD_H = 1080;  // output height in px

export async function downloadCardAsPng(
  _el: HTMLDivElement,   // kept for signature parity — we re-draw on canvas
  config: CardConfig
): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  await drawCard(ctx, config, CARD_W, CARD_H);

  // Trigger browser download
  const link = document.createElement("a");
  link.download = buildFileName(config);
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

// Drawing
async function drawCard(
  ctx: CanvasRenderingContext2D,
  config: CardConfig,
  W: number,
  H: number
) {
  const t = THEMES[config.theme];
  const p = PLATFORMS[config.platform];

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle top-left corner accent square
  ctx.fillStyle = t.surface;
  ctx.fillRect(0, 0, 320, 320);
  ctx.fillStyle = t.bg;
  ctx.beginPath();
  ctx.arc(0, 0, 320, 0, Math.PI / 2);
  ctx.fill();

  // Thin bottom border line
  ctx.fillStyle = t.border;
  ctx.fillRect(80, H - 80, W - 160, 1);

  // Platform glyph — top left
  ctx.font = `700 52px 'Syne', 'Arial', sans-serif`;
  ctx.fillStyle = t.textSecondary;
  ctx.textAlign = "left";
  ctx.fillText(p.glyph, 80, 130);

  // Platform label
  ctx.font = `400 26px 'DM Sans', 'Arial', sans-serif`;
  ctx.fillStyle = t.textSecondary;
  ctx.fillText(p.label, 80, 172);

  // ── Big milestone number ──────────────────────────────────────────────────
  const numFontSize = config.milestone.length > 5 ? 160 : 200;
  ctx.font = `800 ${numFontSize}px 'Syne', 'Arial', sans-serif`;
  ctx.fillStyle = t.textPrimary;
  ctx.textAlign = "left";
  ctx.fillText(config.milestone, 80, H / 2 + 40);

  // Unit label (followers / subscribers / etc)
  ctx.font = `400 38px 'DM Sans', 'Arial', sans-serif`;
  ctx.fillStyle = t.textSecondary;
  ctx.fillText(config.unit, 80, H / 2 + 100);

  // ── Handle ────────────────────────────────────────────────────────────────
  if (config.handle) {
    const handle = config.handle.startsWith("@")
      ? config.handle
      : `@${config.handle}`;
    ctx.font = `500 32px 'DM Sans', 'Arial', sans-serif`;
    ctx.fillStyle = t.textPrimary;
    ctx.textAlign = "left";
    ctx.fillText(handle, 80, H - 200);
  }

  // ── Message ───────────────────────────────────────────────────────────────
  if (config.message) {
    ctx.font = `300 28px 'DM Sans', 'Arial', sans-serif`;
    ctx.fillStyle = t.textSecondary;
    ctx.textAlign = "left";
    ctx.fillText(config.message, 80, H - 150);
  }

  // Footer tag
  ctx.font = `400 20px 'DM Sans', 'Arial', sans-serif`;
  ctx.fillStyle = t.border;
  ctx.textAlign = "right";
  ctx.fillText("milestonecard.vercel.app", W - 80, H - 50);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildFileName(config: CardConfig): string {
  const slug = config.milestone.replace(/[^a-zA-Z0-9]/g, "");
  return `milestone-${config.platform}-${slug}.png`;
}
  
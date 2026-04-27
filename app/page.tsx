"use client";

import { useRef, useState, useCallback } from "react";
import { ASPECT_RATIOS, CardConfig, PLATFORMS, TEMPLATES, TemplateDef } from "@/types/card";
import { CardPreview } from "@/components/CardPreview";
import Image from "next/image";
import LeftSidebarEditor from "@/components/left-sidebar-editor";
import RightSidebarEditor from "@/components/right-sidebar-editor";

const DEFAULT_CONFIG: CardConfig = {
  platform: "twitter",
  milestone: "10K",
  unit: "followers",
  handle: "@yourhandle",
  message: "Thank you all so much 🙏",
  logoUrl: undefined,
  theme: "dark",
  aspectRatio: "1:1",
  cardMode: "slotMachine",
  backgroundMode: "solid",
  backgroundValue: "#000000",
  noiseOpacity: 0,
  showPlatformBadge: false,
  showDivider: false,
  cardBorderRadius: 20,
  milestoneBefore: "8.4K",
  milestoneGoal: "15K",
  mStyle: { family: "Helvetica", weight: 900, size: 56, spacing: -3, uppercase: false, align: "center", color: "#ffffff" },
  unitStyle: { family: "Helvetica", weight: 400, size: 11, spacing: 8, uppercase: true, align: "center", color: "rgba(255,255,255,0.4)" },
  messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0, uppercase: false, align: "center", color: "rgba(255,255,255,0.25)" },
};

export default function Home() {
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [downloading, setDownloading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateDef | null>(TEMPLATES[0]);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(TEMPLATES[0].id);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTemplateChange = useCallback((tpl: TemplateDef) => {
    setActiveTemplate(tpl);
    setActiveTemplateId(tpl.id);
  }, []);

  /* ── Export ── */
  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el) {
      alert("Card not ready — please wait and try again.");
      return;
    }

    setDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      // Wait a tick to ensure any pending paints flush
      await new Promise(r => setTimeout(r, 120));

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        imageTimeout: 20000,
        onclone: (doc) => {
          // Ensure cloned element has explicit px dimensions
          const cloned = doc.querySelector('[data-card-root]') as HTMLElement;
          if (cloned) {
            const rect = el.getBoundingClientRect();
            cloned.style.width = `${rect.width}px`;
            cloned.style.height = `${rect.height}px`;
          }
        },
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);

      // Programmatic download — works cross-browser
      const link = document.createElement("a");
      link.download = "milestone-card.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Try right-clicking the card and saving the image.");
    } finally {
      setDownloading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setActiveTemplate(TEMPLATES[0]);
    setActiveTemplateId(TEMPLATES[0].id);
  }, []);

  const modeName =
    config.cardMode === "beforeAfter" ? "Growth" :
      config.cardMode === "story" ? "Story" :
        config.cardMode === "slotMachine" ? "Slot" :
          config.cardMode === "progressTarget" ? "Progress" :
            config.cardMode === "rank" ? "Rank" :
              config.cardMode === "tiktokDuotone" ? "Duotone" : "Standard";

  return (
    <main className="min-h-screen w-full text-white" style={{ background: "#06080d" }}>

      {/* NAV */}
      <nav
        style={{ background: "rgba(8,10,16,0.9)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
        className="sticky top-0 z-50"
      >
        <div className="mx-auto flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04]">
              <Image src="/logo.png" alt="Milestone Studio" width={22} height={22} unoptimized />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold tracking-tight text-white/90" style={{ fontFamily: "Georgia, serif" }}>
                Milestone Studio
              </h1>
              <p className="text-[10px] text-white/25 tracking-wide">Beautiful milestone cards</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="h-9 px-4 rounded-xl text-[11px] font-medium text-white/40 border border-white/[0.07] hover:text-white/70 hover:border-white/15 transition-all tracking-wide cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="h-9 px-5 rounded-xl text-[11px] font-semibold tracking-wide cursor-pointer transition-all disabled:opacity-50"
              style={{ background: downloading ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.92)", color: "#080808" }}
            >
              {downloading ? "Exporting…" : "Export PNG"}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-56px)]">

        {/* LEFT: Dynamic field editor */}
        <LeftSidebarEditor
          config={config}
          onChange={setConfig}
          activeTemplate={activeTemplate}
        />

        {/* CENTER: Preview */}
        <div className="flex-1 flex flex-col items-center justify-start pt-16 p-8 overflow-y-auto relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />

          {/* data-card-root used by html2canvas onclone */}
          <div data-card-root ref={cardRef}>
            <CardPreview config={config} />
          </div>

          {/* Meta bar */}
          <div
            className="mt-6 flex items-center gap-5 rounded-full px-5 py-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            {([
              ["Format", ASPECT_RATIOS[config.aspectRatio]?.label || "Square"],
              ["Platform", PLATFORMS[config.platform]?.label || "Twitter"],
              ["Mode", modeName],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="text-[8px] text-white/20 uppercase tracking-widest">{k}</div>
                <div className="text-[10px] text-white/50 font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Template picker */}
        <RightSidebarEditor
          config={config}
          onChange={setConfig}
          onTemplateChange={handleTemplateChange}
          activeTemplateId={activeTemplateId}
        />
      </div>
    </main>
  );
}

/* ── Helpers (exported so sidebars can import) ── */

export function isLight(bg: string | undefined): boolean {
  if (!bg) return false;
  const lo = bg.toLowerCase();
  if (lo.includes("gradient")) {
    const m = [...lo.matchAll(/#([0-9a-f]{3,6})/g)];
    if (!m.length) return false;
    return m.reduce((s, x) => {
      const h = x[1].length === 3 ? x[1].split("").map(c => c + c).join("") : x[1];
      return s + luminance("#" + h);
    }, 0) / m.length > 170;
  }
  if (lo.startsWith("#")) return luminance(lo) > 170;
  return false;
}

export function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const f = c.length === 3 ? c.split("").map(x => x + x).join("") : c;
  const r = parseInt(f.slice(0, 2), 16), g = parseInt(f.slice(2, 4), 16), b = parseInt(f.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function fmtNum(val: string, auto: boolean, prefix = ""): string {
  if (!auto) return prefix + val;
  const n = parseFloat(val.replace(/,/g, ""));
  if (isNaN(n)) return prefix + val;
  if (n >= 1e6) return prefix + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return prefix + (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return prefix + n.toLocaleString();
}
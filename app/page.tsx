"use client";

import { useRef, useState, useCallback } from "react";
import { ASPECT_RATIOS, CardConfig, PLATFORMS, TEMPLATES, TemplateDef } from "@/types/card";
import { CardPreview } from "@/components/CardPreview";
import Image from "next/image";
import LeftSidebarEditor from "@/components/left-sidebar-editor";
import RightSidebarEditor from "@/components/right-sidebar-editor";
import Link from "next/link";

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

  /* ── Export (High Quality) ── */
  const handleDownload = useCallback(async () => {
    const el = cardRef.current;

    if (!el) {
      alert("Card not ready — please wait and try again.");
      return;
    }

    setDownloading(true);

    try {
      const { toPng } = await import("html-to-image");

      // Wait for paint + fonts
      await new Promise((r) => setTimeout(r, 150));
      await document.fonts.ready;

      const rect = el.getBoundingClientRect();

      const dataUrl = await toPng(el, {
        cacheBust: true,

        // Main quality control
        pixelRatio: 5, // use 4–6 for crisp exports

        // Force exact export dimensions
        canvasWidth: rect.width * 5,
        canvasHeight: rect.height * 5,
        width: rect.width,
        height: rect.height,

        style: {
          margin: "0",
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = "milestone-card-hq.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
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

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/nikhilsaiankilla/millestone-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-current"
              >
                <path d="M12 2c5.5228 0 10 4.47715 10 10 0 4.5716 -3.0686 8.4239 -7.2578 9.6162v-3.0117c0 -0.7275 -0.1595 -1.4465 -0.4678 -2.1055 2.1883 -0.7822 4.2783 -2.4447 4.2783 -4.4355 0 -1.2663 -0.4671 -2.75174 -1.5127 -3.63186V6l-2.9462 0.98828c-0.6589 -0.16036 -1.3628 -0.24706 -2.0938 -0.24707 -0.731 0 -1.4349 0.08673 -2.09375 0.24707L6.95996 6v2.43164c-1.04555 0.88009 -1.51163 2.36566 -1.51172 3.63186 0 1.9907 2.08913 3.6533 4.27735 4.4355 -0.26358 0.5635 -0.41862 1.1711 -0.45801 1.7901 -0.13854 0.0283 -0.25191 0.0415 -0.34473 0.04 -0.20756 -0.0033 -0.36606 -0.06 -0.51953 -0.1562 -1.11532 -0.7 -1.54401 -1.9835 -3.05566 -2.1543 -0.19076 -0.0214 -0.3474 0.1371 -0.34766 0.3291 0 0.1922 0.15921 0.3423 0.34473 0.3925 1.44216 0.39 1.42755 3.2266 3.54785 3.2598 0.11976 0.0019 0.24101 -0.0069 0.36426 -0.0186v1.6348C5.06807 20.4236 2 16.5713 2 12 2 6.47715 6.47715 2 12 2" />
              </svg>
            </Link>
            <Link href="https://x.com/itzznikhilsai" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" className="bi bi-twitter-x" viewBox="0 0 16 16" id="Twitter-X--Streamline-Bootstrap" height="16" width="16">
                <desc>
                  Twitter X Streamline Icon: https://streamlinehq.com
                </desc>
                <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z" stroke-width="1"></path>
              </svg>
            </Link>
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
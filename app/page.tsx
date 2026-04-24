"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CardConfig } from "@/types/card";
import { Editor } from "@/components/Editor";
import { CardPreview } from "@/components/CardPreview";

const DEFAULT_CONFIG: CardConfig = {
  platform: "twitter",
  milestone: "1,000",
  unit: "followers",
  handle: "@yourhandle",
  message: "Thank you all so much 🙏",
  logoUrl: undefined,

  theme: "dark",
  aspectRatio: "1:1",
  textAlign: "left",

  backgroundMode: "solid",
  backgroundValue: "#0a0a0a",
  noiseOpacity: 0,

  milestoneStyle: { family: "Inter", weight: 900, size: 96, spacing: -2, uppercase: false },
  unitStyle: { family: "Inter", weight: 400, size: 20, spacing: 2, uppercase: true },
  messageStyle: { family: "Inter", weight: 300, size: 13, spacing: 0, uppercase: false },
};

export default function Home() {
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 1200 / cardRef.current.offsetWidth,
        useCORS: true,
        backgroundColor: null,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });
      const link = document.createElement("a");
      link.download = `milestone-${config.platform}-${config.milestone.replace(/,/g, "")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [config]);

  const handleReset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* NAV */}
      <nav className="h-14 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-sm">
        <div className="uppercase tracking-[0.3em] text-[10px] font-bold text-zinc-400">
          Milestone Studio
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-zinc-500 hover:text-white hover:bg-white/5 text-xs font-semibold h-9 px-4 rounded-lg border border-white/[0.08]"
          >
            Reset
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold h-9 px-5 rounded-lg"
          >
            {downloading ? "Exporting..." : "Export PNG"}
          </Button>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-[380px] lg:min-w-[380px] lg:h-[calc(100vh-56px)] lg:sticky lg:top-14 border-r border-white/[0.08] bg-[#0a0a0a] overflow-y-auto">
          <div className="p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-700">
            <Editor config={config} onChange={setConfig} />
          </div>
        </aside>

        {/* PREVIEW */}
        <section className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-pattern">
          <CardPreview ref={cardRef} config={config} />
        </section>
      </div>
    </main>
  );
}


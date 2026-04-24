"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CardConfig } from "@/types/card";
import { Editor } from "@/components/Editor";
import { CardPreview } from "@/components/CardPreview";
import Image from "next/image";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTheme } from "next-themes";

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

  milestoneStyle: {
    family: "Inter",
    weight: 900,
    size: 96,
    spacing: -2,
    uppercase: false,
  },
  unitStyle: {
    family: "Inter",
    weight: 400,
    size: 20,
    spacing: 2,
    uppercase: true,
  },
  messageStyle: {
    family: "Inter",
    weight: 300,
    size: 13,
    spacing: 0,
    uppercase: false,
  },
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
      link.download = `milestone-${config.platform}-${config.milestone.replace(
        /,/g,
        ""
      )}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [config]);

  const handleReset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="px-6 py-2 border-b border-border flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="flex items-end">
          <Image
            src="/logo.png"
            alt="Milestone Studio Logo"
            width={50}
            height={50}
            unoptimized
          />
          <span className="text-lg font-medium">Milestone Studio</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitch />

          <Button
            onClick={handleReset}
            variant="outline"
            className={`px-8 py-4 text-[10px] uppercase tracking-widest cursor-pointer ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Reset
          </Button>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            className={`px-8 py-4 text-[10px] uppercase tracking-widest ${downloading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            {downloading ? "Exporting..." : "Export PNG"}
          </Button>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-[380px] lg:min-w-[380px] lg:h-[calc(100vh-56px)] lg:sticky lg:top-14 border-r border-border bg-card overflow-y-auto">
          <div className="p-6">
            <Editor config={config} onChange={setConfig} />
          </div>
        </aside>

        {/* PREVIEW */}
        <section
          className={`flex-1 flex items-center justify-center p-8 lg:p-12 bg-background overflow-y-auto`}
        >
          <CardPreview ref={cardRef} config={config} />
        </section>
      </div>
    </main>
  );
}
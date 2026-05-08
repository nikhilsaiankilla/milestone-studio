"use client";

import { Sparkles } from "lucide-react";
import { ScrollColumn } from "./ScrollColumn";
import { useEffect, useState } from "react";

export default function Hero() {
  // Organized based on your assets card.png through card9.png
  const col1 = ["/cards/card.png", "/cards/card4.png", "/cards/card7.png", "/cards/card.png","/cards/card3.png", "/cards/card6.png", "/cards/card9.png", "/cards/card3.png"];
  const col2 = ["/cards/card2.png", "/cards/card5.png", "/cards/card8.png", "/cards/card2.png","/cards/card3.png", "/cards/card6.png", "/cards/card9.png", "/cards/card3.png"];
  const col3 = ["/cards/card3.png", "/cards/card6.png", "/cards/card9.png", "/cards/card3.png","/cards/card3.png", "/cards/card6.png", "/cards/card9.png", "/cards/card3.png"];

  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/nikhilsaiankilla/milestone-studio')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStars(d.stargazers_count))
      .catch(() => { })
  }, [])

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">

      {/* 1. Hero Content Layer */}
      <div className="relative z-30 flex flex-col items-center pt-32 pb-16 px-6 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_50%)] -z-10 pointer-events-none" />

        {/* Branding */}
        <div className="flex items-center gap-3 mb-10 group cursor-default">
          <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center text-[13px] font-bold">M</div>
          <span className="text-sm font-medium tracking-tight text-white/80">Milestone Studio</span>
        </div>

        {/* Copy */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center leading-[1.15] max-w-3xl">
          Create Beautiful <br /> Milestone Cards in Seconds
        </h1>

        <p className="mt-6 text-white/40 text-lg md:text-xl font-light text-center max-w-lg">
          No login. No friction. Just create and export your achievements.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95">
            Open Editor <Sparkles size={14} fill="black" />
          </button>
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white/80 text-sm font-medium hover:bg-white/10 transition-all">
            Star on GitHub {stars !== null && (
              <span className="ml-1 flex items-center gap-1 border-l pl-2 border-border text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                  <path d="M12 1.7L14.6 9h7.7l-6.2 4.5 2.4 7.3L12 16.3l-6.5 4.5 2.4-7.3L1.7 9h7.7L12 1.7z" />
                </svg>
                {stars}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Showcase Layer (The Slot Machine) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-[200vh] overflow-hidden">
        {/* Top/Bottom Fades */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ScrollColumn images={col1} />
          <ScrollColumn images={col2} reverse={true} />
          <div className="hidden md:block">
            <ScrollColumn images={col3} />
          </div>
        </div>
      </div>

      {/* 3. Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_8px_1px_white]" />
        <div className="absolute bottom-1/3 right-1/4 w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_8px_1px_white]" />
      </div>
    </section>
  );
}
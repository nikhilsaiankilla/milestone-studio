"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function FinalCTA() {
    return (
        <section className="relative w-full py-32 bg-black text-white px-6 border-t border-white/5 overflow-hidden">
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />

            <div className="relative max-w-2xl mx-auto flex flex-col items-center text-center gap-8">
                <Image src="/logo.png" alt="Milestone Studio Logo" width={80} height={80} unoptimized className="object-contain" />

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                    Your next milestone<br />deserves a card.
                </h2>

                <p className="text-white/40 text-lg font-light max-w-md">
                    No login. No design skills. Open the editor and go live in under a minute.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
                >
                    Create your card <Sparkles size={14} fill="black" />
                </Link>

                <p className="text-xs text-white/20 tracking-wide">
                    Free forever · Open source · No account needed
                </p>
            </div>
        </section>
    );
}
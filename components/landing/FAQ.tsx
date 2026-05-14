"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        q: "Do I need to create an account?",
        a: "No. Milestone Studio is completely login-free. Open the editor and start creating immediately — nothing to sign up for.",
    },
    {
        q: "Is it really free?",
        a: "Yes, entirely free. The project is open source and there are no hidden paywalls, watermark removal fees, or premium tiers.",
    },
    {
        q: "What formats can I export?",
        a: "You can download your card as a high-resolution PNG or copy it directly to your clipboard for instant pasting.",
    },
    {
        q: "Can I share a specific card design?",
        a: "Yes — every card generates a shareable URL that encodes your full configuration. Anyone with the link sees the exact same card.",
    },
    {
        q: "What aspect ratios are supported?",
        a: "Landscape (16:9), Portrait (9:16), and Square (1:1) — all common social media dimensions.",
    },
    {
        q: "Can I self-host Milestone Studio?",
        a: "Absolutely. The project is open source on GitHub under a permissive license. Clone it, deploy it, and make it your own.",
    },
];

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="border-b border-white/5 cursor-pointer group"
            onClick={() => setOpen(o => !o)}
        >
            <div className="flex items-center justify-between py-5 gap-4">
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{q}</span>
                <div className={cn(
                    "shrink-0 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-all duration-200",
                    open ? "rotate-45 bg-white/10" : "bg-transparent"
                )}>
                    <Plus size={12} className="text-white/50" />
                </div>
            </div>
            {open && (
                <p className="text-sm text-white/40 leading-relaxed font-light pb-5">
                    {a}
                </p>
            )}
        </div>
    );
}

export default function FAQ() {
    return (
        <section className="relative w-full py-32 bg-black text-white px-6 border-t border-white/5">
            <div className="max-w-2xl mx-auto">

                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-6 text-center">
                    FAQ
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center leading-tight mb-16">
                    Common questions
                </h2>

                <div>
                    {faqs.map(faq => (
                        <FAQItem key={faq.q} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}
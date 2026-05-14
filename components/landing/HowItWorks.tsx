import Link from "next/link";
import { Sparkles } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Pick your template",
        description: "Choose from Metrics, Milestone, Progress, or List layouts depending on what you want to share.",
    },
    {
        number: "02",
        title: "Enter your numbers",
        description: "Type in your milestone value and label. Add multiple metrics, pick an icon, and style your typography.",
    },
    {
        number: "03",
        title: "Style the card",
        description: "Select a gradient background, adjust alignment and aspect ratio, toggle noise texture, or hit shuffle.",
    },
    {
        number: "04",
        title: "Export and share",
        description: "Download as a high-res PNG or copy to clipboard. Post it anywhere — X, LinkedIn, Product Hunt.",
    },
];

export default function HowItWorks() {
    return (
        <section className="relative w-full py-32 bg-black text-white px-6 border-t border-white/5">
            <div className="max-w-5xl mx-auto">

                {/* Label */}
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-6 text-center">
                    How it works
                </div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center leading-tight max-w-2xl mx-auto">
                    From zero to card<br />in under a minute.
                </h2>

                {/* Steps */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step, i) => (
                        <div
                            key={step.number}
                            className="relative flex gap-6 p-8 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                            {/* Step number */}
                            <div className="shrink-0 text-[40px] font-black leading-none text-white/8 select-none">
                                {step.number}
                            </div>
                            <div className="flex flex-col gap-2 pt-1">
                                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed font-light">{step.description}</p>
                            </div>

                            {/* Connector line between steps (vertical on mobile, hidden on last) */}
                            {i < steps.length - 1 && (
                                <div className="absolute -bottom-4 left-14 w-px h-8 bg-white/10 hidden md:block" />
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] active:scale-95"
                    >
                        Try it now <Sparkles size={14} fill="black" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
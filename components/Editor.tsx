"use client";

import {
    ASPECT_RATIOS,
    AspectRatio,
    BACKGROUND_PRESETS,
    CardConfig,
    Platform,
    PLATFORMS,
    TextAlign,
    TypographyStyle,
} from "@/types/card";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const FONT_FAMILIES = [
    "Inter",
    "Georgia",
    "Arial",
    "Verdana",
    "monospace",
    "Times New Roman",
    "Helvetica",
    "Trebuchet MS",
];

const EXTRA_GRADIENTS = [
    { label: "Rose Gold", mode: "gradient" as const, value: "linear-gradient(135deg,#b76e79 0%,#e8c5b0 100%)" },
    { label: "Carbon", mode: "gradient" as const, value: "linear-gradient(135deg,#1a1a1a 0%,#3a3a3a 100%)" },
    { label: "Neon", mode: "gradient" as const, value: "linear-gradient(135deg,#00ff87 0%,#60efff 100%)" },
    { label: "Dusk", mode: "gradient" as const, value: "linear-gradient(135deg,#2c3e50 0%,#fd746c 100%)" },
];

const ALL_PRESETS = [...BACKGROUND_PRESETS, ...EXTRA_GRADIENTS];

/* ── helper ── */
function nativeSliderBg(value: number, min: number, max: number) {
    const pct = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #fff ${pct}%, #3f3f46 ${pct}%)`;
}

export function Editor({
    config,
    onChange,
}: {
    config: CardConfig;
    onChange: (c: CardConfig) => void;
}) {
    const [openStyle, setOpenStyle] = useState<string | null>(null);
    const [customColor, setCustomColor] = useState("#0a0a0a");
    const [gradColor1, setGradColor1] = useState("#7f00ff");
    const [gradColor2, setGradColor2] = useState("#e100ff");
    const [gradAngle, setGradAngle] = useState(135);

    const set = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) =>
        onChange({ ...config, [key]: value });

    const setStyle = (
        key: "milestoneStyle" | "unitStyle" | "messageStyle",
        patch: Partial<TypographyStyle>
    ) => onChange({ ...config, [key]: { ...config[key], ...patch } });

    const applyCustomGradient = () => {
        set("backgroundMode", "gradient");
        set("backgroundValue", `linear-gradient(${gradAngle}deg,${gradColor1} 0%,${gradColor2} 100%)`);
    };

    return (
        <div className="space-y-8 font-sans selection:bg-white/10">

            {/* ── PLATFORM ── */}
            <Section label="Platform">
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(PLATFORMS) as Platform[]).map((key) => (
                        <ChipButton
                            key={key}
                            active={config.platform === key}
                            onClick={() => { set("platform", key); set("unit", PLATFORMS[key].defaultUnit); }}
                        >
                            {PLATFORMS[key].label}
                        </ChipButton>
                    ))}
                </div>
            </Section>

            {/* ── MILESTONE ── */}
            <Section label="Milestone">
                <Field label="Amount">
                    <InputWithStyle
                        value={config.milestone}
                        onChange={(e) => set("milestone", e.target.value)}
                        placeholder="1,000"
                        open={openStyle === "milestone"}
                        onToggle={() => setOpenStyle(openStyle === "milestone" ? null : "milestone")}
                    />
                    {openStyle === "milestone" && (
                        <StylePanel
                            key="milestone"
                            style={config.milestoneStyle}
                            onChange={(patch) => setStyle("milestoneStyle", patch)}
                        />
                    )}
                </Field>

                <Field label="Unit">
                    <InputWithStyle
                        value={config.unit}
                        onChange={(e) => set("unit", e.target.value)}
                        placeholder="followers"
                        open={openStyle === "unit"}
                        onToggle={() => setOpenStyle(openStyle === "unit" ? null : "unit")}
                    />
                    {openStyle === "unit" && (
                        <StylePanel
                            key="unit"
                            style={config.unitStyle}
                            onChange={(patch) => setStyle("unitStyle", patch)}
                        />
                    )}
                </Field>
            </Section>

            {/* ── IDENTITY ── */}
            <Section label="Identity">
                <Field label="Handle">
                    <Input
                        value={config.handle}
                        onChange={(e) => set("handle", e.target.value)}
                        placeholder="@yourhandle"
                        className="h-11 rounded-xl bg-white/[0.03] border-white/10 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-1 focus-visible:ring-white/20"
                    />
                </Field>

                <Field label="Logo (optional)">
                    <div className="flex gap-2 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            id="logo-upload"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => set("logoUrl", ev.target?.result as string);
                                reader.readAsDataURL(file);
                            }}
                        />
                        <label
                            htmlFor="logo-upload"
                            className="flex-1 h-11 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            {config.logoUrl ? "✓ Logo uploaded — click to replace" : "↑ Upload logo image"}
                        </label>
                        {config.logoUrl && (
                            <button
                                onClick={() => set("logoUrl", undefined)}
                                className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/10 text-zinc-500 hover:text-red-400 hover:border-red-400/30 transition-all text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {config.logoUrl && (
                        <img
                            src={config.logoUrl}
                            alt="preview"
                            className="mt-2 w-10 h-10 rounded-lg object-contain border border-white/10"
                        />
                    )}
                </Field>
            </Section>

            {/* ── MESSAGE ── */}
            <Section label="Message">
                <Field label="Caption">
                    <InputWithStyle
                        value={config.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Thank you..."
                        open={openStyle === "message"}
                        onToggle={() => setOpenStyle(openStyle === "message" ? null : "message")}
                    />
                    {openStyle === "message" && (
                        <StylePanel
                            key="message"
                            style={config.messageStyle}
                            onChange={(patch) => setStyle("messageStyle", patch)}
                        />
                    )}
                </Field>
            </Section>

            {/* ── TEXT ALIGNMENT ── */}
            <Section label="Text Alignment">
                <div className="flex gap-2">
                    {(["left", "center", "right"] as TextAlign[]).map((a) => (
                        <button
                            key={a}
                            onClick={() => set("textAlign", a)}
                            className={`flex-1 h-11 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${config.textAlign === a
                                ? "bg-white text-black border-white"
                                : "border-white/10 text-zinc-500 hover:text-white hover:border-white/30"
                                }`}
                        >
                            {a === "left" && <span className="text-base leading-none">⇤</span>}
                            {a === "center" && <span className="text-base leading-none">↔</span>}
                            {a === "right" && <span className="text-base leading-none">⇥</span>}
                            <span className="capitalize">{a}</span>
                        </button>
                    ))}
                </div>
            </Section>

            {/* ── FORMAT ── */}
            <Section label="Format">
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map((key) => (
                        <ChipButton
                            key={key}
                            active={config.aspectRatio === key}
                            onClick={() => set("aspectRatio", key)}
                        >
                            {ASPECT_RATIOS[key].label}
                        </ChipButton>
                    ))}
                </div>
            </Section>

            {/* ── BACKGROUND ── */}
            <Section label="Background">
                <div className="grid grid-cols-3 gap-2">
                    {ALL_PRESETS.map((bg) => {
                        const active = config.backgroundValue === bg.value;
                        return (
                            <button
                                key={bg.label}
                                onClick={() => { set("backgroundMode", bg.mode); set("backgroundValue", bg.value); }}
                                className={`h-14 rounded-xl relative overflow-hidden transition-all cursor-pointer ${active ? "ring-2 ring-white scale-[1.02]" : "ring-1 ring-white/10 hover:ring-white/30"
                                    }`}
                                style={{ background: bg.value }}
                            >
                                <span className="absolute bottom-1.5 left-2 text-[8px] font-bold text-white drop-shadow-md">
                                    {bg.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Custom solid */}
                <div className="mt-3 space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Custom Solid</p>
                    <div className="flex gap-3 items-center">
                        <input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5"
                        />
                        <button
                            onClick={() => { set("backgroundMode", "solid"); set("backgroundValue", customColor); }}
                            className="flex-1 h-10 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                            style={{ background: customColor + "22" }}
                        >
                            Apply {customColor}
                        </button>
                    </div>
                </div>

                {/* Custom gradient */}
                <div className="mt-3 space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Custom Gradient</p>
                    <div className="flex gap-3 items-center">
                        <div className="flex flex-col items-center gap-1">
                            <input
                                type="color"
                                value={gradColor1}
                                onChange={(e) => setGradColor1(e.target.value)}
                                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5"
                            />
                            <span className="text-[8px] text-zinc-600">Start</span>
                        </div>
                        <div
                            className="flex-1 h-10 rounded-xl border border-white/10"
                            style={{ background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` }}
                        />
                        <div className="flex flex-col items-center gap-1">
                            <input
                                type="color"
                                value={gradColor2}
                                onChange={(e) => setGradColor2(e.target.value)}
                                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5"
                            />
                            <span className="text-[8px] text-zinc-600">End</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                            <span>Angle</span>
                            <span className="text-zinc-300">{gradAngle}°</span>
                        </div>
                        <input
                            type="range"
                            min={0} max={360} step={1}
                            value={gradAngle}
                            onChange={(e) => setGradAngle(Number(e.target.value))}
                            className="w-full h-1 rounded-full appearance-none cursor-pointer"
                            style={{ background: nativeSliderBg(gradAngle, 0, 360) }}
                        />
                    </div>

                    <button
                        onClick={applyCustomGradient}
                        className="w-full h-10 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    >
                        Apply Gradient →
                    </button>
                </div>

                {/* Noise */}
                <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                        <span>Noise / Grain</span>
                        <span className="text-zinc-300">{config.noiseOpacity ?? 0}</span>
                    </div>
                    <input
                        type="range"
                        min={0} max={100} step={1}
                        value={config.noiseOpacity ?? 0}
                        onChange={(e) => set("noiseOpacity", Number(e.target.value))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{ background: nativeSliderBg(config.noiseOpacity ?? 0, 0, 100) }}
                    />
                    <p className="text-[9px] text-zinc-600">Adds film grain texture over the background</p>
                </div>
            </Section>

        </div>
    );
}

function StylePanel({
    style,
    onChange,
}: {
    style: TypographyStyle;
    onChange: (patch: Partial<TypographyStyle>) => void;
}) {
    const [local, setLocal] = useState<TypographyStyle>({ ...style });

    const update = (patch: Partial<TypographyStyle>) => {
        const next = { ...local, ...patch };
        setLocal(next);
        onChange(patch);
    };

    return (
        <div className="mt-3 rounded-2xl border border-white/5 bg-zinc-900/60 backdrop-blur-sm p-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">

            {/* Font family */}
            <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Font Family</p>
                <Select
                    value={local.family}
                    onValueChange={(val) => update({ family: val || local.family })}
                >
                    <SelectTrigger className="w-full bg-black/30 border-white/10 rounded-xl text-sm focus:ring-1 focus:ring-white/20">
                        <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {FONT_FAMILIES.map((f) => (
                            <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
                <NativeSliderField label="Weight" min={100} max={900} step={100} value={local.weight} onChange={(v) => update({ weight: v })} />
                <NativeSliderField label="Size (px)" min={8} max={160} step={1} value={local.size} onChange={(v) => update({ size: v })} />
                <NativeSliderField label="Spacing (px)" min={-10} max={20} step={1} value={local.spacing} onChange={(v) => update({ spacing: v })} />
            </div>

            {/* Color override */}
            <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Text Color</p>
                <div className="flex gap-3 items-center">
                    <input
                        type="color"
                        value={local.color || "#ffffff"}
                        onChange={(e) => update({ color: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5"
                    />
                    <div className="flex-1 space-y-1">
                        <p className="text-[10px] text-zinc-400">
                            {local.color ? local.color : "Auto (from background)"}
                        </p>
                        {local.color && (
                            <button
                                onClick={() => update({ color: undefined })}
                                className="text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                                ✕ Reset to auto
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Uppercase */}
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={!!local.uppercase}
                    onChange={(e) => update({ uppercase: e.target.checked })}
                    className="w-4 h-4 accent-white rounded"
                />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Uppercase</span>
            </label>
        </div>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 whitespace-nowrap">
                    {label}
                </h3>
                <div className="h-[1px] w-full bg-white/5" />
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                {label}
            </label>
            {children}
        </div>
    );
}

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${active
                ? "bg-white text-black border-white shadow-lg shadow-white/5"
                : "border-white/5 text-zinc-500 hover:text-zinc-200 hover:border-white/20"
                }`}
        >
            {children}
        </button>
    );
}

function InputWithStyle({
    open,
    onToggle,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { open: boolean; onToggle: () => void }) {
    return (
        <div className="flex gap-2">
            <Input
                {...props}
                className="flex-1 px-4 h-11 rounded-xl bg-white/[0.03] border-white/10 text-zinc-100 placeholder:text-zinc-700 focus-visible:ring-1 focus-visible:ring-white/20 transition-all"
            />
            <button
                onClick={onToggle}
                className={`w-11 h-11 flex items-center justify-center rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer ${open
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.03] border-white/10 text-zinc-500 hover:text-white hover:border-white/30"
                    }`}
            >
                Aa
            </button>
        </div>
    );
}

function NativeSliderField({
    label, value, min, max, step, onChange,
}: {
    label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                <span>{label}</span>
                <span className="text-zinc-300">{value}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: nativeSliderBg(value, min, max) }}
            />
        </div>
    );
}
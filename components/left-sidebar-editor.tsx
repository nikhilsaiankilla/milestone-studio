'use client'

import { Sidebar, SidebarContent } from './ui/sidebar'
import { CardConfig } from '@/types/card'
import { useState } from 'react'
import {
    ASPECT_RATIOS, AspectRatio, BACKGROUND_PRESETS, CardMode,
    Platform, PLATFORMS, TextAlign, TypographyStyle,
} from "@/types/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

function sliderBg(value: number, min: number, max: number) {
    const pct = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #e2e8f0 ${pct}%, rgba(255,255,255,0.06) ${pct}%)`;
}

function AlignButtons({ value, onChange }: { value: TextAlign; onChange: (v: TextAlign) => void }) {
    return (
        <div className="flex gap-1">
            {(["left", "center", "right"] as TextAlign[]).map((a) => {
                const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                return (
                    <button key={a} onClick={() => onChange(a)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${value === a
                            ? "bg-white/10 text-white border-white/20"
                            : "border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/15"}`}>
                        <Icon size={12} />
                    </button>
                );
            })}
        </div>
    );
}

const LeftSidebarEditor = ({ config, onChange }: { config: CardConfig; onChange: (c: CardConfig) => void }) => {
    const [openStyle, setOpenStyle] = useState<string | null>(null);
    const [customColor, setCustomColor] = useState("#080808");
    const [gradColor1, setGradColor1] = useState("#7f00ff");
    const [gradColor2, setGradColor2] = useState("#e100ff");
    const [gradAngle, setGradAngle] = useState(135);

    const set = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) => onChange({ ...config, [key]: value });

    const setStyle = (key: "mStyle" | "unitStyle" | "messageStyle", patch: Partial<TypographyStyle>) =>
        onChange({ ...config, [key]: { ...config[key], ...patch } });

    const applyCustomGradient = () => onChange({
        ...config,
        backgroundMode: "gradient",
        backgroundValue: `linear-gradient(${gradAngle}deg,${gradColor1} 0%,${gradColor2} 100%)`,
    });

    const currentMode = config.cardMode ?? "standard";

    const setCardMode = (mode: CardMode) => {
        const updates: Partial<CardConfig> = { cardMode: mode };
        if (mode === "beforeAfter") updates.aspectRatio = "3:2";
        onChange({ ...config, ...updates });
    };

    return (
        <Sidebar collapsible="none" className="w-[320px] min-w-[320px] max-w-[320px] lg:h-[calc(100vh-56px)] lg:sticky lg:top-14 overflow-y-auto border-r border-white/[0.05]" style={{ background: "#0a0c10" }}>
            <SidebarContent>
                <div className="px-5 py-8 space-y-10">

                    {/* ── CARD MODE ── */}
                    <Section label="Mode">
                        <div className="grid grid-cols-3 gap-1.5">
                            {(["standard", "story", "beforeAfter"] as CardMode[]).map((m) => (
                                <ModeChip key={m} active={currentMode === m} onClick={() => setCardMode(m)}>
                                    {m === "standard" ? "Standard" : m === "story" ? "Story" : "Growth"}
                                </ModeChip>
                            ))}
                        </div>
                    </Section>

                    {/* ── STORY ELEMENTS ── */}
                    {currentMode === "story" && (
                        <Section label="Story">
                            <Field label={`Progress · ${config.storyProgress ?? 70}%`}>
                                <input type="range" min={0} max={100} step={1} value={config.storyProgress ?? 70}
                                    onChange={(e) => set("storyProgress", Number(e.target.value))}
                                    className="slider w-full" style={{ background: sliderBg(config.storyProgress ?? 70, 0, 100) }} />
                            </Field>
                            <Field label="Accent Color">
                                <ColorRow value={config.accentColor ?? "#00ff87"} onChange={(v) => set("accentColor", v)} onReset={() => set("accentColor", undefined)} />
                            </Field>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={config.showCountdown ?? false} onChange={(e) => set("showCountdown", e.target.checked)} className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                                <span className="text-[11px] text-white/40">Show countdown timer</span>
                            </label>
                            {config.showCountdown && (
                                <input type="datetime-local" value={config.countdownTarget ? new Date(config.countdownTarget).toISOString().slice(0, 16) : ""}
                                    onChange={(e) => set("countdownTarget", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                                    className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/70 text-xs px-3 outline-none" />
                            )}
                        </Section>
                    )}

                    {/* ── PLATFORM ── */}
                    <Section label="Platform">
                        <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(PLATFORMS) as Platform[]).map((key) => (
                                <PlatformChip key={key} active={config.platform === key}
                                    onClick={() => onChange({ ...config, platform: key, unit: PLATFORMS[key].defaultUnit })}>
                                    {PLATFORMS[key].image && <img src={PLATFORMS[key].image} alt="" className="w-3 h-3 object-contain rounded-sm opacity-90" />}
                                    {PLATFORMS[key].label}
                                </PlatformChip>
                            ))}
                        </div>
                        <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                            <input type="checkbox" checked={config.showPlatformBadge ?? true} onChange={(e) => set("showPlatformBadge", e.target.checked)} className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                            <span className="text-[11px] text-white/40">Show platform badge</span>
                        </label>
                    </Section>

                    {/* ── MILESTONE ── */}
                    <Section label="Milestone">
                        {currentMode === "beforeAfter" && (
                            <Field label="From (before)">
                                <StyledInput value={config.milestoneBefore ?? ""} onChange={(e) => set("milestoneBefore", e.target.value)} placeholder="e.g. 500"
                                    open={false} onToggle={() => { }} showStyle={false} />
                            </Field>
                        )}
                        <Field label={currentMode === "beforeAfter" ? "To (after)" : "Number"}>
                            <StyledInput value={config.milestone} onChange={(e) => set("milestone", e.target.value)} placeholder="10,000"
                                open={openStyle === "milestone"} onToggle={() => setOpenStyle(openStyle === "milestone" ? null : "milestone")} />
                            {openStyle === "milestone" && <StylePanel style={config.mStyle} onChange={(p) => setStyle("mStyle", p)} />}
                        </Field>
                        <Field label="Unit label">
                            <StyledInput value={config.unit} onChange={(e) => set("unit", e.target.value)} placeholder="followers"
                                open={openStyle === "unit"} onToggle={() => setOpenStyle(openStyle === "unit" ? null : "unit")} />
                            {openStyle === "unit" && <StylePanel style={config.unitStyle} onChange={(p) => setStyle("unitStyle", p)} />}
                        </Field>
                    </Section>

                    {/* ── REVENUE (SaaS only) ── */}
                    {config.platform === "saas" && (
                        <Section label="Revenue">
                            <Field label="Currency prefix">
                                <input value={config.currencyPrefix ?? "$"} onChange={(e) => set("currencyPrefix", e.target.value)} placeholder="$" maxLength={3}
                                    className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 outline-none focus:border-white/20 transition-colors" />
                            </Field>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={config.autoFormatNumber ?? false} onChange={(e) => set("autoFormatNumber", e.target.checked)} className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                                <span className="text-[11px] text-white/40">Auto-format (12500 → 12.5K)</span>
                            </label>
                            <Field label="Growth badge">
                                <input value={config.growthLabel ?? ""} onChange={(e) => set("growthLabel", e.target.value || undefined)} placeholder="+42% MoM"
                                    className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 outline-none focus:border-white/20 transition-colors" />
                            </Field>
                        </Section>
                    )}

                    {/* ── IDENTITY ── */}
                    <Section label="Identity">
                        <Field label="Handle">
                            <input value={config.handle} onChange={(e) => set("handle", e.target.value)} placeholder="@yourhandle"
                                className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 outline-none focus:border-white/20 transition-colors" />
                        </Field>
                        <Field label="Message">
                            <StyledInput value={config.message} onChange={(e) => set("message", e.target.value)} placeholder="Thank you all 🙏"
                                open={openStyle === "message"} onToggle={() => setOpenStyle(openStyle === "message" ? null : "message")} />
                            {openStyle === "message" && <StylePanel style={config.messageStyle} onChange={(p) => setStyle("messageStyle", p)} />}
                        </Field>
                        <Field label="Logo">
                            <div className="flex gap-2 items-center">
                                <input type="file" accept="image/*" id="logo-upload" className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]; if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) => set("logoUrl", ev.target?.result as string);
                                        reader.readAsDataURL(file);
                                    }} />
                                <label htmlFor="logo-upload" className="flex-1 h-10 rounded-xl border border-dashed border-white/[0.1] text-[11px] text-white/30 hover:text-white/50 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2">
                                    {config.logoUrl ? "✓ Logo uploaded — click to replace" : "↑ Upload logo"}
                                </label>
                                {config.logoUrl && (
                                    <button onClick={() => set("logoUrl", undefined)} className="w-10 h-10 rounded-xl border border-white/[0.07] text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer flex items-center justify-center">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                            {config.logoUrl && (
                                <div className="mt-2 space-y-3">
                                    <img src={config.logoUrl} alt="preview" className="w-9 h-9 rounded-lg object-contain border border-white/10" />
                                    <Field label={`Size · ${config.imageSize ?? 35}px`}>
                                        <input type="range" min={20} max={120} step={1} value={config.imageSize ?? 35}
                                            onChange={(e) => set("imageSize", Number(e.target.value))}
                                            className="slider w-full" style={{ background: sliderBg(config.imageSize ?? 35, 20, 120) }} />
                                    </Field>
                                    <div>
                                        <p className="label-xs mb-2">Logo position</p>
                                        <AlignButtons value={config.logoAlign ?? "right"} onChange={(v) => set("logoAlign", v)} />
                                    </div>
                                </div>
                            )}
                        </Field>
                    </Section>

                    {/* ── FORMAT ── */}
                    <Section label="Format">
                        <div className="grid grid-cols-2 gap-1.5">
                            {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map((key) => (
                                <ModeChip key={key} active={config.aspectRatio === key} onClick={() => set("aspectRatio", key)}>
                                    {ASPECT_RATIOS[key].label}
                                </ModeChip>
                            ))}
                        </div>
                    </Section>

                    {/* ── CARD STYLE ── */}
                    <Section label="Card">
                        <Field label={`Border radius · ${config.cardBorderRadius ?? 16}px`}>
                            <input type="range" min={0} max={48} step={2} value={config.cardBorderRadius ?? 16}
                                onChange={(e) => set("cardBorderRadius", Number(e.target.value))}
                                className="slider w-full" style={{ background: sliderBg(config.cardBorderRadius ?? 16, 0, 48) }} />
                        </Field>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={config.showDivider ?? true} onChange={(e) => set("showDivider", e.target.checked)} className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                            <span className="text-[11px] text-white/40">Show divider line</span>
                        </label>
                    </Section>

                    {/* ── BACKGROUND ── */}
                    <Section label="Background">
                        <div className="grid grid-cols-4 gap-1.5">
                            {BACKGROUND_PRESETS.map((bg) => {
                                const active = config.backgroundValue === bg.value;
                                return (
                                    <button key={bg.label} onClick={() => onChange({ ...config, backgroundMode: bg.mode, backgroundValue: bg.value })}
                                        title={bg.label}
                                        className={`h-9 rounded-lg transition-all cursor-pointer relative overflow-hidden ${active ? "ring-2 ring-white/60 scale-[1.05]" : "ring-1 ring-white/[0.07] hover:ring-white/20"}`}
                                        style={{ background: bg.value }}>
                                        <span className="absolute bottom-0.5 left-1 text-[6px] text-white/60 font-medium leading-tight drop-shadow-sm">{bg.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom solid */}
                        <div className="mt-1">
                            <p className="label-xs mb-2">Custom solid</p>
                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2">
                                <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)}
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                                <button onClick={() => onChange({ ...config, backgroundMode: "solid", backgroundValue: customColor })}
                                    className="flex-1 h-8 rounded-lg text-[11px] text-white/50 hover:text-white/80 font-mono transition-colors cursor-pointer text-left px-2">
                                    {customColor.toUpperCase()} — Apply
                                </button>
                            </div>
                        </div>

                        {/* Custom gradient */}
                        <div className="mt-1">
                            <p className="label-xs mb-2">Custom gradient</p>
                            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 space-y-3">
                                <div className="flex items-center gap-2">
                                    <input type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)}
                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                                    <div className="flex-1 h-8 rounded-lg border border-white/10 overflow-hidden" style={{ background: `linear-gradient(${gradAngle}deg,${gradColor1},${gradColor2})` }} />
                                    <input type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)}
                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                                </div>
                                <div>
                                    <div className="flex justify-between label-xs mb-1.5"><span>Angle</span><span>{gradAngle}°</span></div>
                                    <input type="range" min={0} max={360} step={1} value={gradAngle} onChange={(e) => setGradAngle(Number(e.target.value))}
                                        className="slider w-full" style={{ background: sliderBg(gradAngle, 0, 360) }} />
                                </div>
                                <button onClick={applyCustomGradient} className="w-full h-8 rounded-lg text-[11px] text-white/50 hover:text-white/80 border border-white/[0.07] hover:border-white/15 transition-all cursor-pointer">
                                    Apply gradient
                                </button>
                            </div>
                        </div>

                        {/* Noise */}
                        <Field label={`Grain / Noise · ${config.noiseOpacity ?? 0}`}>
                            <input type="range" min={0} max={100} step={1} value={config.noiseOpacity ?? 0}
                                onChange={(e) => set("noiseOpacity", Number(e.target.value))}
                                className="slider w-full" style={{ background: sliderBg(config.noiseOpacity ?? 0, 0, 100) }} />
                        </Field>
                    </Section>

                </div>

                {/* Global styles for sliders */}
                <style jsx global>{`
          .slider { -webkit-appearance: none; appearance: none; height: 3px; border-radius: 9999px; outline: none; cursor: pointer; }
          .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #e2e8f0; border: 2px solid rgba(255,255,255,0.1); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.4); }
          .slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #e2e8f0; border: 2px solid rgba(255,255,255,0.1); cursor: pointer; }
          .label-xs { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.25); }
        `}</style>
            </SidebarContent>
        </Sidebar>
    );
};

export default LeftSidebarEditor;

/* Sub-components*/
function StylePanel({ style, onChange }: { style: TypographyStyle; onChange: (patch: Partial<TypographyStyle>) => void }) {
    const [local, setLocal] = useState<TypographyStyle>({ ...style });
    const update = (patch: Partial<TypographyStyle>) => { const next = { ...local, ...patch }; setLocal(next); onChange(patch); };

    return (
        <div className="mt-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-4">
            <div>
                <p className="label-xs mb-2">Font</p>
                <Select value={local.family} onValueChange={(val) => update({ family: val ? val : undefined })}>
                    <SelectTrigger className="w-full h-9 bg-white/[0.04] border-white/[0.07] rounded-xl text-white/70 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111318] border-white/[0.08] text-white/70">
                        {["Georgia", "Times New Roman", "Helvetica", "Trebuchet MS", "Verdana", "monospace"].map((f) => (
                            <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <p className="label-xs mb-2">Color</p>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2">
                    <input type="color" value={local.color || "#ffffff"} onChange={(e) => update({ color: e.target.value })}
                        className="h-7 w-7 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                    <span className="text-[11px] text-white/50 font-mono flex-1">{local.color || "Auto"}</span>
                    {local.color && <button onClick={() => update({ color: undefined })} className="text-[10px] text-white/25 hover:text-white/50 cursor-pointer">reset</button>}
                </div>
            </div>

            <div>
                <p className="label-xs mb-2">Align</p>
                <AlignButtons value={local.align ?? "left"} onChange={(v) => update({ align: v })} />
            </div>

            <SliderRow label="Weight" min={100} max={900} step={100} value={local.weight} onChange={(v) => update({ weight: v })} />
            <SliderRow label="Size" min={8} max={160} step={1} value={local.size} onChange={(v) => update({ size: v })} />
            <SliderRow label="Spacing" min={-10} max={20} step={1} value={local.spacing} onChange={(v) => update({ spacing: v })} />

            <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={local.uppercase ?? false} onChange={(e) => update({ uppercase: e.target.checked })} className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                <span className="text-[11px] text-white/40">Uppercase</span>
            </label>
        </div>
    );
}

function SliderRow({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between label-xs"><span>{label}</span><span className="text-white/40">{value}</span></div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
                className="slider w-full" style={{ background: `linear-gradient(to right, #e2e8f0 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.06) ${((value - min) / (max - min)) * 100}%)` }} />
        </div>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 whitespace-nowrap">{label}</h3>
                <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="label-xs">{label}</p>
            {children}
        </div>
    );
}

function ModeChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick}
            className={`h-9 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer tracking-wide ${active
                ? "bg-white/10 text-white border-white/20"
                : "border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/12"}`}>
            {children}
        </button>
    );
}

function PlatformChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${active
                ? "bg-white/10 text-white border-white/20"
                : "border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/12"}`}>
            {children}
        </button>
    );
}

function ColorRow({ value, onChange, onReset }: { value: string; onChange: (v: string) => void; onReset: () => void }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
            <span className="text-[11px] font-mono text-white/50 flex-1">{value.toUpperCase()}</span>
            <button onClick={onReset} className="text-[10px] text-white/25 hover:text-white/50 cursor-pointer">reset</button>
        </div>
    );
}

function StyledInput({ open, onToggle, showStyle = true, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { open: boolean; onToggle: () => void; showStyle?: boolean }) {
    return (
        <div className="flex gap-1.5">
            <input {...props}
                className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
            {showStyle && (
                <button onClick={onToggle}
                    className={`w-10 h-10 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${open ? "bg-white/10 text-white border-white/20" : "bg-white/[0.03] border-white/[0.07] text-white/30 hover:text-white/60"}`}>
                    Aa
                </button>
            )}
        </div>
    );
}
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
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X } from "lucide-react";

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
    {
        label: "Rose Gold",
        mode: "gradient" as const,
        value: "linear-gradient(135deg,#b76e79 0%,#e8c5b0 100%)",
    },
    {
        label: "Carbon",
        mode: "gradient" as const,
        value: "linear-gradient(135deg,#1a1a1a 0%,#3a3a3a 100%)",
    },
    {
        label: "Neon",
        mode: "gradient" as const,
        value: "linear-gradient(135deg,#00ff87 0%,#60efff 100%)",
    },
    {
        label: "Dusk",
        mode: "gradient" as const,
        value: "linear-gradient(135deg,#2c3e50 0%,#fd746c 100%)",
    },
];

const ALL_PRESETS = [...BACKGROUND_PRESETS, ...EXTRA_GRADIENTS];

function nativeSliderBg(value: number, min: number, max: number) {
    const pct = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)`;
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
        set(
            "backgroundValue",
            `linear-gradient(${gradAngle}deg,${gradColor1} 0%,${gradColor2} 100%)`
        );
    };

    return (
        <div className="space-y-8 selection:bg-primary/50">
            {/* PLATFORM */}
            <Section label="Platform">
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(PLATFORMS) as Platform[]).map((key) => {
                        console.log('PLATFORM KEY:', key);
                        console.log('PLATFORM CONFIG:', config.platform);
                        return (
                            <ChipButton
                                key={key}
                                active={config.platform === key}
                                onClick={() => {
                                    set("platform", key);
                                    set("unit", PLATFORMS[key].defaultUnit);
                                }}
                            >
                                {PLATFORMS[key].label}
                            </ChipButton>
                        )
                    })}
                </div>
            </Section>

            {/* MILESTONE */}
            <Section label="Milestone">
                <Field label="Amount">
                    <InputWithStyle
                        value={config.milestone}
                        onChange={(e) => set("milestone", e.target.value)}
                        placeholder="1,000"
                        open={openStyle === "milestone"}
                        onToggle={() =>
                            setOpenStyle(openStyle === "milestone" ? null : "milestone")
                        }
                    />
                    {openStyle === "milestone" && (
                        <StylePanel
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
                            style={config.unitStyle}
                            onChange={(patch) => setStyle("unitStyle", patch)}
                        />
                    )}
                </Field>
            </Section>

            {/* IDENTITY */}
            <Section label="Identity">
                <Field label="Handle">
                    <Input
                        value={config.handle}
                        onChange={(e) => set("handle", e.target.value)}
                        placeholder="@yourhandle"
                        className="h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                </Field>

                <Field label="Logo (optional)">
                    <div className="flex gap-2 items-center">
                        <Input
                            type="file"
                            accept="image/*"
                            id="logo-upload"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) =>
                                    set("logoUrl", ev.target?.result as string);
                                reader.readAsDataURL(file);
                            }}
                        />

                        <Label
                            htmlFor="logo-upload"
                            className="flex-1 h-11 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-ring/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            {config.logoUrl
                                ? "✓ Logo uploaded — click to replace"
                                : "↑ Upload logo image"}
                        </Label>

                        {config.logoUrl && (
                            <Button
                                onClick={() => set("logoUrl", undefined)}
                                variant={'outline'}
                                className="w-11 h-11 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all cursor-pointer"
                            >
                                <X />
                            </Button>
                        )}
                    </div>

                    {config.logoUrl && (
                        <img
                            src={config.logoUrl}
                            alt="preview"
                            className="mt-2 w-10 h-10 rounded-lg object-contain border border-border"
                        />
                    )}
                </Field>
            </Section>

            {/* MESSAGE */}
            <Section label="Message">
                <Field label="Caption">
                    <InputWithStyle
                        value={config.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Thank you..."
                        open={openStyle === "message"}
                        onToggle={() =>
                            setOpenStyle(openStyle === "message" ? null : "message")
                        }
                    />

                    {openStyle === "message" && (
                        <StylePanel
                            style={config.messageStyle}
                            onChange={(patch) => setStyle("messageStyle", patch)}
                        />
                    )}
                </Field>
            </Section>

            {/* TEXT ALIGNMENT */}
            <Section label="Text Alignment">
                <div className="flex gap-2">
                    {(["left", "center", "right"] as TextAlign[]).map((a) => (
                        <Button
                            key={a}
                            onClick={() => set("textAlign", a)}
                            variant={`${config.textAlign === a ? 'default' : 'outline'}`}
                            className={`flex-1 h-11 rounded-xl border text-xs cursor-pointer`}
                        >
                            {a}
                        </Button>
                    ))}
                </div>
            </Section>

            {/* FORMAT */}
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

            {/* BACKGROUND */}
            <Section label="Background">
                <div className="grid grid-cols-3 gap-2">
                    {ALL_PRESETS.map((bg) => {
                        const active = config.backgroundValue === bg.value;

                        return (
                            <Button
                                key={bg.label}
                                onClick={() => {
                                    set("backgroundMode", bg.mode);
                                    set("backgroundValue", bg.value);
                                }}
                                className={`h-14 rounded-xl relative overflow-hidden transition-all ${active
                                    ? "ring-2 ring-ring scale-[1.02]"
                                    : "ring-1 ring-border hover:ring-ring/40"
                                    }`}
                                style={{ background: bg.value }}
                            >
                                <span className="absolute bottom-1.5 left-2 text-[8px] font-bold text-white">
                                    {bg.label}
                                </span>
                            </Button>
                        );
                    })}
                </div>

                {/* CUSTOM SOLID */}
                <div className="mt-3 space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                        Custom Solid
                    </p>

                    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-2">
                        {/* Color Picker */}
                        <div className="relative shrink-0">
                            <Input
                                type="color"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-border p-0 overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-full"
                            />
                        </div>

                        {/* Preview + Apply */}
                        <Button
                            onClick={() => {
                                set("backgroundMode", "solid");
                                set("backgroundValue", customColor);
                            }}
                            variant="outline"
                            className="group h-10 flex-1 justify-between rounded-lg px-3 text-xs font-medium transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-4 w-4 rounded-full border border-border shadow-sm"
                                    style={{ backgroundColor: customColor }}
                                />
                                <span>Apply Color</span>
                            </div>

                            <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                                {customColor.toUpperCase()}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* CUSTOM GRADIENT */}
                <div className="mt-3 p-2 space-y-3 rounded-2xl border border-border/60 bg-muted/30">
                    <div className="flex items-center justify-between px-3 pt-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Custom Gradient
                        </p>

                        <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">
                            {gradAngle}°
                        </span>
                    </div>

                    {/* Pickers + Preview */}
                    <div className="flex items-center gap-3 px-3">
                        <Input
                            type="color"
                            value={gradColor1}
                            onChange={(e) => setGradColor1(e.target.value)}
                            className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-border p-0 overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-full"
                        />

                        <div
                            className="relative h-10 flex-1 overflow-hidden rounded-xl border border-border shadow-sm"
                            style={{
                                background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5" />
                        </div>

                        <Input
                            type="color"
                            value={gradColor2}
                            onChange={(e) => setGradColor2(e.target.value)}
                            className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-border p-0 overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-full"
                        />
                    </div>

                    {/* Angle Slider */}
                    <div className="space-y-1 px-3">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>0°</span>
                            <span>180°</span>
                            <span>360°</span>
                        </div>

                        <Input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={gradAngle}
                            onChange={(e) => setGradAngle(Number(e.target.value))}
                            className="h-1 w-full cursor-pointer appearance-none rounded-full"
                            style={{ background: nativeSliderBg(gradAngle, 0, 360) }}
                        />
                    </div>

                    {/* Apply Button */}
                    <Button
                        onClick={applyCustomGradient}
                        variant="outline"
                        className="group h-10 w-full justify-between px-3 text-xs font-medium transition-all cursor-pointer"
                    >
                        <span>Apply Gradient</span>

                        <div className="flex items-center gap-2">
                            <span
                                className="h-3 w-3 rounded-full border border-border"
                                style={{ backgroundColor: gradColor1 }}
                            />
                            <span
                                className="h-3 w-3 rounded-full border border-border"
                                style={{ backgroundColor: gradColor2 }}
                            />
                        </div>
                    </Button>
                </div>

                {/* NOISE */}
                <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        <span>Noise / Grain</span>
                        <span>{config.noiseOpacity ?? 0}</span>
                    </div>

                    <Input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={config.noiseOpacity ?? 0}
                        onChange={(e) => set("noiseOpacity", Number(e.target.value))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: nativeSliderBg(config.noiseOpacity ?? 0, 0, 100),
                        }}
                    />
                </div>
            </Section>
        </div>
    );
}

/* SUB COMPONENTS */
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
        <div className="mt-3 rounded-2xl border border-border bg-card p-4 space-y-5">
            <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">
                    Font Family
                </p>

                <Select
                    value={local.family}
                    onValueChange={(val) => update({ family: val ? val : undefined })}
                >
                    <SelectTrigger className="w-full bg-background border-border rounded-xl">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="bg-popover border-border">
                        {FONT_FAMILIES.map((f) => (
                            <SelectItem key={f} value={f}>
                                {f}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <NativeSliderField
                label="Weight"
                min={100}
                max={900}
                step={100}
                value={local.weight}
                onChange={(v) => update({ weight: v })}
            />

            <NativeSliderField
                label="Size"
                min={8}
                max={160}
                step={1}
                value={local.size}
                onChange={(v) => update({ size: v })}
            />

            <NativeSliderField
                label="Spacing"
                min={-10}
                max={20}
                step={1}
                value={local.spacing}
                onChange={(v) => update({ spacing: v })}
            />
        </div>
    );
}

function Section({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground whitespace-nowrap">
                    {label}
                </h3>
                <div className="h-px w-full bg-border" />
            </div>

            <div className="space-y-6">{children}</div>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-3">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">
                {label}
            </Label>
            {children}
        </div>
    );
}

function ChipButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${active
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-ring/40"
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
}: React.InputHTMLAttributes<HTMLInputElement> & {
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex gap-2">
            <Input
                {...props}
                className="flex-1 px-4 h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground"
            />

            <Button
                onClick={onToggle}
                variant={'outline'}
                className={`w-11 h-11 rounded-xl border text-[11px] font-bold cursor-pointer ${open
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-ring/40"
                    }`}
            >
                Aa
            </Button>
        </div>
    );
}

function NativeSliderField({
    label,
    value,
    min,
    max,
    step,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (n: number) => void;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>{label}</span>
                <span>{value}</span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: nativeSliderBg(value, min, max) }}
            />
        </div>
    );
}
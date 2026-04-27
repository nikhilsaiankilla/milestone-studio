'use client'

import { Sidebar, SidebarContent } from './ui/sidebar'
import { CardConfig, CardMode, AspectRatio, FieldDef, TemplateDef, BACKGROUND_PRESETS, BackgroundMode, PLATFORMS, Platform, ASPECT_RATIOS } from '@/types/card'
import { useState } from 'react'
import { X } from 'lucide-react'

/* ── Layout config ── */
const ASPECT_OPTIONS: { value: AspectRatio; label: string; w: number; h: number; sub: string }[] = [
    { value: "1:1", label: "Square", w: 32, h: 32, sub: "1:1" },
    { value: "4:5", label: "Portrait", w: 26, h: 32, sub: "4:5" },
    { value: "3:2", label: "Wide", w: 36, h: 24, sub: "3:2" },
]

/* ── helpers ── */
function sliderBg(value: number, min: number, max: number) {
    const pct = ((value - min) / (max - min)) * 100
    return `linear-gradient(to right, #e2e8f0 ${pct}%, rgba(255,255,255,0.06) ${pct}%)`
}

/* ── props ── */
interface Props {
    config: CardConfig
    onChange: (c: CardConfig) => void
    activeTemplate: TemplateDef | null
}

const LeftSidebarEditor = ({ config, onChange, activeTemplate }: Props) => {
    const [customColor, setCustomColor] = useState('#080808')
    const [gradColor1, setGradColor1] = useState('#7f00ff')
    const [gradColor2, setGradColor2] = useState('#e100ff')
    const [gradAngle, setGradAngle] = useState(135)

    const [openStylePanel, setOpenStylePanel] = useState<string | null>(null)

    const set = <K extends keyof CardConfig>(key: K, value: CardConfig[K]) =>
        onChange({ ...config, [key]: value })

    const applyGradient = () =>
        onChange({ ...config, backgroundMode: 'gradient', backgroundValue: `linear-gradient(${gradAngle}deg,${gradColor1} 0%,${gradColor2} 100%)` })

    /* Render a single dynamic field from template.fields */
    const renderField = (field: FieldDef) => {
        const rawVal = config[field.key]

        switch (field.type) {
            case "text":
            case "handle":
            case "number": {
                const strVal =
                    rawVal !== undefined && rawVal !== null ? String(rawVal) : ""

                const styleKey =
                    field.key === "milestone"
                        ? "mStyle"
                        : field.key === "message"
                            ? "messageStyle"
                            : field.key === "unit"
                                ? "unitStyle"
                                : null

                const styleVal = styleKey ? (config as any)[styleKey] : null

                return (
                    <Field key={field.key} label={field.label} hint={field.hint}>
                        <div className="space-y-2">
                            {/* Input + Aa Button */}
                            <div className="flex gap-2">
                                <input
                                    value={strVal}
                                    onChange={(e) => set(field.key, e.target.value as any)}
                                    placeholder={field.placeholder}
                                    className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 outline-none focus:border-white/20 transition-colors placeholder:text-white/15"
                                />

                                {styleKey && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenStylePanel(
                                                openStylePanel === field.key ? null : field.key
                                            )
                                        }
                                        className="h-10 w-10 shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/75 text-sm font-semibold transition-all"
                                    >
                                        Aa
                                    </button>
                                )}
                            </div>

                            {/* Styling Panel */}
                            {styleKey && openStylePanel === field.key && (
                                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {/* Size */}
                                    <div>
                                        <p className="text-[10px] text-white/45 mb-1">Size</p>
                                        <input
                                            type="range"
                                            min="18"
                                            max="120"
                                            value={styleVal?.size ?? 42}
                                            onChange={(e) =>
                                                set(styleKey, {
                                                    ...styleVal,
                                                    size: Number(e.target.value),
                                                })
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div>
                                        <p className="text-[10px] text-white/45 mb-1">Weight</p>
                                        <select
                                            value={styleVal?.weight ?? 700}
                                            onChange={(e) =>
                                                set(styleKey, {
                                                    ...styleVal,
                                                    weight: Number(e.target.value),
                                                })
                                            }
                                            className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] px-2 text-sm text-white"
                                        >
                                            {[400, 500, 600, 700, 800, 900].map((w) => (
                                                <option key={w} value={w}>
                                                    {w}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Color */}
                                    <div>
                                        <p className="text-[10px] text-white/45 mb-1">Color</p>
                                        <input
                                            type="color"
                                            value={styleVal?.color ?? "#ffffff"}
                                            onChange={(e) =>
                                                set(styleKey, {
                                                    ...styleVal,
                                                    color: e.target.value,
                                                })
                                            }
                                            className="w-full h-9 rounded-xl bg-transparent"
                                        />
                                    </div>

                                    {/* Alignment */}
                                    <div>
                                        <p className="text-[10px] text-white/45 mb-1">Alignment</p>
                                        <div className="grid grid-cols-3 gap-1">
                                            {["left", "center", "right"].map((align) => (
                                                <button
                                                    key={align}
                                                    type="button"
                                                    onClick={() =>
                                                        set(styleKey, {
                                                            ...styleVal,
                                                            align,
                                                        })
                                                    }
                                                    className={`h-9 rounded-xl text-xs capitalize border transition-all ${styleVal?.align === align
                                                            ? "border-white/25 bg-white/10 text-white"
                                                            : "border-white/[0.08] bg-white/[0.03] text-white/55"
                                                        }`}
                                                >
                                                    {align}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Uppercase */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            set(styleKey, {
                                                ...styleVal,
                                                uppercase: !styleVal?.uppercase,
                                            })
                                        }
                                        className={`w-full h-9 rounded-xl text-xs border transition-all ${styleVal?.uppercase
                                                ? "border-white/25 bg-white/10 text-white"
                                                : "border-white/[0.08] bg-white/[0.03] text-white/55"
                                            }`}
                                    >
                                        UPPERCASE
                                    </button>
                                </div>
                            )}
                        </div>
                    </Field>
                )
            }

            case 'toggle': {
                const boolVal = rawVal !== undefined ? Boolean(rawVal) : Boolean(field.defaultValue)
                return (
                    <label key={field.key} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={boolVal}
                            onChange={e => set(field.key, e.target.checked as any)}
                            className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer"
                        />
                        <span className="text-[11px] text-white/40">{field.label}</span>
                    </label>
                )
            }

            case 'range': {
                const numVal = rawVal !== undefined ? Number(rawVal) : Number(field.defaultValue ?? 0)
                return (
                    <Field key={field.key} label={`${field.label} · ${numVal}`} hint={field.hint}>
                        <input
                            type="range"
                            min={field.min ?? 0} max={field.max ?? 100} step={field.step ?? 1}
                            value={numVal}
                            onChange={e => set(field.key, Number(e.target.value) as any)}
                            className="slider w-full"
                            style={{ background: sliderBg(numVal, field.min ?? 0, field.max ?? 100) }}
                        />
                    </Field>
                )
            }

            case 'color': {
                const colVal = rawVal !== undefined ? String(rawVal) : '#ffffff'
                return (
                    <Field key={field.key} label={field.label} hint={field.hint}>
                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2">
                            <input
                                type="color" value={colVal}
                                onChange={e => set(field.key, e.target.value as any)}
                                className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full"
                            />
                            <span className="text-[11px] font-mono text-white/50 flex-1">{colVal.toUpperCase()}</span>
                        </div>
                    </Field>
                )
            }

            case 'select': {
                const selVal = rawVal !== undefined ? String(rawVal) : String(field.defaultValue ?? '')
                return (
                    <Field key={field.key} label={field.label} hint={field.hint}>
                        <select
                            value={selVal}
                            onChange={e => set(field.key, e.target.value as any)}
                            className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 outline-none focus:border-white/20 transition-colors"
                        >
                            {(field.options ?? []).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </Field>
                )
            }

            case 'textarea': {
                const taVal = rawVal !== undefined ? String(rawVal) : ''
                return (
                    <Field key={field.key} label={field.label} hint={field.hint}>
                        <textarea
                            value={taVal}
                            onChange={e => set(field.key, e.target.value as any)}
                            placeholder={field.placeholder}
                            rows={3}
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm px-3 py-2.5 outline-none focus:border-white/20 transition-colors placeholder:text-white/15 resize-none"
                        />
                    </Field>
                )
            }

            default:
                return null
        }
    }

    return (
        <Sidebar
            collapsible="none"
            className="w-[380px] min-w-[380px] max-w-[380px] lg:h-[calc(100vh-56px)] lg:sticky lg:top-14 overflow-y-auto border-r border-white/[0.05]"
            style={{ background: '#0a0c10' }}
        >
            <SidebarContent>
                <div className="px-5 py-8 space-y-10">

                    <Section label="Platform">
                        <Field label={`Selected Platform · ${config.platform ?? "none"}`}>
                            <div className="grid grid-cols-3 gap-1">
                                {Object.entries(PLATFORMS).map(([key, platform]) => {
                                    const active = config.platform === key

                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() =>
                                                onChange({
                                                    ...config,
                                                    platform: key as Platform,
                                                    unit: platform.defaultUnit,
                                                })
                                            }
                                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all
              ${active
                                                    ? "border-white/30 bg-white/10"
                                                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                                                }`}
                                        >
                                            {platform.image ? (
                                                <img
                                                    src={platform.image}
                                                    alt={platform.label}
                                                    className="w-5 h-5 rounded-sm object-contain"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 flex items-center justify-center text-[11px] text-white/70">
                                                    {platform.glyph}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-[11px] font-medium text-white truncate">
                                                    {platform.label}
                                                </p>
                                                <p className="text-[9px] text-white/40 truncate">
                                                    {platform.defaultUnit}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </Field>
                    </Section>
                    <Section label="Aspect Ratio">
                        <Field label={`Selected Ratio · ${config.aspectRatio ?? "1:1"}`}>
                            <div className="grid grid-cols-3 gap-1">
                                {Object.entries(ASPECT_RATIOS).map(([key, ratio]) => {
                                    const active = config.aspectRatio === key

                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() =>
                                                onChange({
                                                    ...config,
                                                    aspectRatio: key as AspectRatio,
                                                })
                                            }
                                            className={`rounded-xl border px-3 py-2 text-left transition-all
            ${active
                                                    ? "border-white/30 bg-white/10"
                                                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                                                }`}
                                        >
                                            <div className="flex flex-col gap-2">
                                                {/* Ratio Preview */}
                                                <div className="h-10 flex items-center justify-center">
                                                    <div
                                                        className="border border-white/20 rounded-md bg-white/[0.03]"
                                                        style={{
                                                            width:
                                                                key === "1:1"
                                                                    ? 26
                                                                    : key === "4:5"
                                                                        ? 22
                                                                        : 30,
                                                            height:
                                                                key === "1:1"
                                                                    ? 26
                                                                    : key === "4:5"
                                                                        ? 28
                                                                        : 20,
                                                        }}
                                                    />
                                                </div>

                                                {/* Text */}
                                                <div>
                                                    <p className="text-[11px] font-medium text-white truncate">
                                                        {key}
                                                    </p>
                                                    <p className="text-[9px] text-white/40 truncate">
                                                        {ratio.label}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </Field>
                    </Section>

                    {/* ── TEMPLATE FIELDS (dynamic) ── */}
                    {activeTemplate && activeTemplate.fields.length > 0 && (
                        <Section label={activeTemplate.name}>
                            <div className="space-y-4">
                                {activeTemplate.fields.map(f => renderField(f))}
                            </div>
                        </Section>
                    )}

                    {/* ── NO TEMPLATE SELECTED ── */}
                    {!activeTemplate && (
                        <div className="text-center py-8">
                            <p className="text-[11px] text-white/25">Select a template from the right panel to start editing.</p>
                        </div>
                    )}

                    {/* ── LOGO ── */}
                    <Section label="Logo">
                        <div className="flex gap-2 items-center">
                            <input type="file" accept="image/*" id="logo-upload" className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0]; if (!file) return
                                    const reader = new FileReader()
                                    reader.onload = ev => set('logoUrl', ev.target?.result as string)
                                    reader.readAsDataURL(file)
                                }} />
                            <label htmlFor="logo-upload" className="flex-1 h-10 rounded-xl border border-dashed border-white/[0.1] text-[11px] text-white/30 hover:text-white/50 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2">
                                {config.logoUrl ? '✓ Logo uploaded — click to replace' : '↑ Upload logo'}
                            </label>
                            {config.logoUrl && (
                                <button onClick={() => set('logoUrl', undefined)} className="w-10 h-10 rounded-xl border border-white/[0.07] text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer flex items-center justify-center">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                        {config.logoUrl && (
                            <div className="mt-3 space-y-3">
                                <img src={config.logoUrl} alt="preview" className="w-9 h-9 rounded-lg object-contain border border-white/10" />
                                <Field label={`Size · ${config.imageSize ?? 35}px`}>
                                    <input type="range" min={20} max={120} step={1} value={config.imageSize ?? 35}
                                        onChange={e => set('imageSize', Number(e.target.value))}
                                        className="slider w-full" style={{ background: sliderBg(config.imageSize ?? 35, 20, 120) }} />
                                </Field>
                            </div>
                        )}
                    </Section>

                    {/* ── BACKGROUND ── */}
                    <Section label="Background">
                        <div className="grid grid-cols-4 gap-1.5">
                            {BACKGROUND_PRESETS.map(bg => {
                                const active = config.backgroundValue === bg.value
                                return (
                                    <button key={bg.label}
                                        onClick={() => onChange({ ...config, backgroundMode: bg.mode as BackgroundMode, backgroundValue: bg.value })}
                                        title={bg.label}
                                        className={`h-9 rounded-lg transition-all cursor-pointer relative overflow-hidden ${active ? 'ring-2 ring-white/60 scale-[1.05]' : 'ring-1 ring-white/[0.07] hover:ring-white/20'}`}
                                        style={{ background: bg.value }}>
                                        <span className="absolute bottom-0.5 left-1 text-[6px] text-white/60 font-medium leading-tight drop-shadow-sm">{bg.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Custom solid */}
                        <div className="mt-2">
                            <p className="label-xs mb-2">Custom solid</p>
                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2">
                                <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)}
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                                <button onClick={() => onChange({ ...config, backgroundMode: 'solid', backgroundValue: customColor })}
                                    className="flex-1 h-8 rounded-lg text-[11px] text-white/50 hover:text-white/80 font-mono transition-colors cursor-pointer text-left px-2">
                                    {customColor.toUpperCase()} — Apply
                                </button>
                            </div>
                        </div>

                        {/* Custom gradient */}
                        <div className="mt-2">
                            <p className="label-xs mb-2">Custom gradient</p>
                            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 space-y-3">
                                <div className="flex items-center gap-2">
                                    <input type="color" value={gradColor1} onChange={e => setGradColor1(e.target.value)}
                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                                    <div className="flex-1 h-8 rounded-lg border border-white/10 overflow-hidden" style={{ background: `linear-gradient(${gradAngle}deg,${gradColor1},${gradColor2})` }} />
                                    <input type="color" value={gradColor2} onChange={e => setGradColor2(e.target.value)}
                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 p-0 bg-transparent overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full" />
                                </div>
                                <div>
                                    <div className="flex justify-between label-xs mb-1.5"><span>Angle</span><span>{gradAngle}°</span></div>
                                    <input type="range" min={0} max={360} step={1} value={gradAngle}
                                        onChange={e => setGradAngle(Number(e.target.value))}
                                        className="slider w-full" style={{ background: sliderBg(gradAngle, 0, 360) }} />
                                </div>
                                <button onClick={applyGradient} className="w-full h-8 rounded-lg text-[11px] text-white/50 hover:text-white/80 border border-white/[0.07] hover:border-white/15 transition-all cursor-pointer">
                                    Apply gradient
                                </button>
                            </div>
                        </div>

                        {/* Noise */}
                        <Field label={`Grain / Noise · ${config.noiseOpacity ?? 0}`}>
                            <input type="range" min={0} max={100} step={1} value={config.noiseOpacity ?? 0}
                                onChange={e => set('noiseOpacity', Number(e.target.value))}
                                className="slider w-full" style={{ background: sliderBg(config.noiseOpacity ?? 0, 0, 100) }} />
                        </Field>
                    </Section>

                    {/* ── CARD STYLE ── */}
                    <Section label="Card">
                        <Field label={`Border radius · ${config.cardBorderRadius ?? 16}px`}>
                            <input type="range" min={0} max={48} step={2} value={config.cardBorderRadius ?? 16}
                                onChange={e => set('cardBorderRadius', Number(e.target.value))}
                                className="slider w-full" style={{ background: sliderBg(config.cardBorderRadius ?? 16, 0, 48) }} />
                        </Field>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={config.showDivider ?? false}
                                onChange={e => set('showDivider', e.target.checked)}
                                className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                            <span className="text-[11px] text-white/40">Show divider line</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={config.showPlatformBadge ?? true}
                                onChange={e => set('showPlatformBadge', e.target.checked)}
                                className="w-3.5 h-3.5 rounded accent-white/80 cursor-pointer" />
                            <span className="text-[11px] text-white/40">Show platform badge</span>
                        </label>
                    </Section>

                </div>

                <style jsx global>{`
                    .slider { -webkit-appearance: none; appearance: none; height: 3px; border-radius: 9999px; outline: none; cursor: pointer; }
                    .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #e2e8f0; border: 2px solid rgba(255,255,255,0.1); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.4); }
                    .slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #e2e8f0; border: 2px solid rgba(255,255,255,0.1); cursor: pointer; }
                    .label-xs { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.25); }
                `}</style>
            </SidebarContent>
        </Sidebar>
    )
}

export default LeftSidebarEditor

/* ── Sub-components ── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 whitespace-nowrap">{label}</h3>
                <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="label-xs">{label}</p>
            {children}
            {hint && <p className="text-[10px] text-white/20 leading-tight">{hint}</p>}
        </div>
    )
}
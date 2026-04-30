'use client'

import { cn } from '@/lib/utils'
import { FONTS, type MetricStyle } from '@/types/card'
import { Switch } from '../ui/switch'
import { useRef } from 'react'

interface Props {
    style: MetricStyle
    onChange: (s: Partial<MetricStyle>) => void
}

const FONT_SIZES = {
    icon: { min: 16, max: 64, label: 'Icon Size' },
    value: { min: 24, max: 96, label: 'Value Size' },
    label: { min: 10, max: 28, label: 'Label Size' },
}

const PRESET_COLORS = [
    '#ffffff', '#000000', '#facc15', '#34d399',
    '#60a5fa', '#f87171', '#e879f9', '#fb923c',
]

function ColorPicker({
    value,
    onChange,
}: {
    value?: string
    onChange: (c: string | undefined) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const current = value ?? '#ffffff'
    const isPreset = PRESET_COLORS.includes(current)
    const isCustom = !!value && !isPreset

    return (
        <div className="space-y-2">
            {/* Presets row */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => onChange(c)}
                        title={c}
                        className={cn(
                            'w-5 h-5 rounded-full border-2 transition-all cursor-pointer shrink-0',
                            value === c
                                ? 'border-white scale-110 shadow-[0_0_0_1px_rgba(255,255,255,0.3)]'
                                : 'border-transparent hover:scale-105 hover:border-white/30'
                        )}
                        style={{ background: c }}
                    />
                ))}

                {/* Custom swatch — clicking opens native color picker */}
                <button
                    onClick={() => inputRef.current?.click()}
                    title="Custom color"
                    className={cn(
                        'w-5 h-5 rounded-full border-2 transition-all cursor-pointer shrink-0 relative overflow-hidden',
                        isCustom
                            ? 'border-white scale-110 shadow-[0_0_0_1px_rgba(255,255,255,0.3)]'
                            : 'border-dashed border-white/30 hover:border-white/60'
                    )}
                    style={isCustom ? { background: current } : undefined}
                >
                    {!isCustom && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/40 font-bold leading-none">
                            +
                        </span>
                    )}
                </button>

                {/* Hidden native input */}
                <input
                    ref={inputRef}
                    type="color"
                    value={current}
                    onChange={(e) => onChange(e.target.value)}
                    className="sr-only"
                />
            </div>

            {/* Hex input row */}
            <div className="flex items-center gap-2">
                {/* Live color preview dot */}
                <div
                    className="w-5 h-5 rounded-full shrink-0 border border-white/10"
                    style={{ background: current }}
                />
                <input
                    type="text"
                    value={current}
                    maxLength={7}
                    onChange={(e) => {
                        const v = e.target.value
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[11px] font-mono text-white/70 focus:outline-none focus:border-white/30 focus:text-white transition-colors"
                    placeholder="#ffffff"
                />
                {value && (
                    <button
                        onClick={() => onChange(undefined)}
                        className="text-[9px] text-white/25 hover:text-white/60 transition-colors shrink-0"
                    >
                        reset
                    </button>
                )}
            </div>
        </div>
    )
}

function StyleRow({
    label,
    size,
    bold,
    italic,
    min,
    max,
    onSize,
    onBold,
    onItalic,
}: {
    label: string
    size: number
    bold?: boolean
    italic?: boolean
    min: number
    max: number
    onSize: (v: number) => void
    onBold?: (v: boolean) => void
    onItalic?: (v: boolean) => void
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{label}</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/50 font-mono w-6 text-right">{size}</span>
                    {onBold !== undefined && (
                        <button
                            onClick={() => onBold(!bold)}
                            className={cn(
                                'w-6 h-6 rounded text-[11px] font-black border transition-all cursor-pointer',
                                bold
                                    ? 'bg-primary/20 border-primary/40 text-primary'
                                    : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'
                            )}
                        >B</button>
                    )}
                    {onItalic !== undefined && (
                        <button
                            onClick={() => onItalic(!italic)}
                            className={cn(
                                'w-6 h-6 rounded text-[11px] italic font-bold border transition-all cursor-pointer',
                                italic
                                    ? 'bg-primary/20 border-primary/40 text-primary'
                                    : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'
                            )}
                        >I</button>
                    )}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={size}
                onChange={(e) => onSize(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1"
            />
        </div>
    )
}

export default function MetricTypographyPanel({ style, onChange }: Props) {
    return (
        <div className="mt-2 px-3 py-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">

            <div className="space-y-2">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Text Color</span>
                <ColorPicker
                    value={style.textColor}
                    onChange={(c) => onChange({ textColor: c })}
                />
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Show Icon */}
            <div className='w-full flex items-center justify-between'>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Show Icon</span>
                <Switch
                    checked={style.showIcon}
                    onCheckedChange={(v) => onChange({ showIcon: v })}
                />
            </div>

            <div className="h-[1px] bg-white/5" />
            <StyleRow
                label="Icon Size"
                size={style?.iconSize}
                min={FONT_SIZES?.icon?.min}
                max={FONT_SIZES?.icon?.max}
                onSize={(v) => onChange({ iconSize: v })}
            />
            <div className="h-[1px] bg-white/5" />
            <StyleRow
                label="Value"
                size={style?.valueSize}
                bold={style?.valueBold}
                italic={style?.valueItalic}
                min={FONT_SIZES?.value.min}
                max={FONT_SIZES?.value.max}
                onSize={(v) => onChange({ valueSize: v })}
                onBold={(v) => onChange({ valueBold: v })}
                onItalic={(v) => onChange({ valueItalic: v })}
            />
            <div className="h-[1px] bg-white/5" />
            <StyleRow
                label="Label"
                size={style?.labelSize}
                bold={style?.labelBold}
                italic={style?.labelItalic}
                min={FONT_SIZES?.label?.min}
                max={FONT_SIZES?.label?.max}
                onSize={(v) => onChange({ labelSize: v })}
                onBold={(v) => onChange({ labelBold: v })}
                onItalic={(v) => onChange({ labelItalic: v })}
            />
            <div className="h-[1px] bg-white/5" />
            <div className="space-y-1.5">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Font</span>
                <div className="grid grid-cols-2 gap-1">
                    {FONTS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => onChange({ fontFamily: f.value })}
                            className={cn(
                                'px-2 py-1.5 rounded-lg border text-[10px] transition-all cursor-pointer truncate',
                                style.fontFamily === f.value
                                    ? 'bg-primary/20 border-primary/40 text-primary'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                            )}
                            style={{ fontFamily: f.value }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
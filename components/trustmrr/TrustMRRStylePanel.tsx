'use client'

/**
 * TrustMRRStylePanel.tsx
 * Typography + color controls for TrustMRR cards.
 * Shown inside TrustMRRPanel below the template list.
 * Matches the dark design language of MetricTypographyPanel exactly.
 */

import { useRef } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { FONTS } from '@/constants/fonts'
import type { TrustMRRStyle } from '@/types/trustmrr'

// ── Same preset colors as MetricTypographyPanel ────────────────────────────
const PRESET_COLORS = [
    '#ffffff', '#e2e8f0', '#94a3b8', '#334155', '#0f172a', '#000000',
    '#fef08a', '#facc15', '#fb923c', '#f87171', '#f43f5e', '#fb7185',
    '#34d399', '#2dd4bf', '#22d3ee', '#60a5fa', '#818cf8', '#a78bfa',
    '#e879f9', '#c084fc', '#f0abfc', '#38bdf8', '#4ade80', '#86efac',
    '#7c3aed', '#4f46e5', '#0ea5e9', '#059669', '#dc2626', '#9f1239',
    '#a16207', '#92400e', '#1e3a5f', '#1a2e1a', '#2d1b69', '#1c1917',
]

interface TrustMRRStylePanelProps {
    style: TrustMRRStyle
    onChange: (partial: Partial<TrustMRRStyle>) => void
}

export default function TrustMRRStylePanel({ style, onChange }: TrustMRRStylePanelProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const current = style.textColor ?? '#ffffff'
    const isPreset = PRESET_COLORS.includes(current)
    const isCustom = !!current && !isPreset

    return (
        <div className="px-3 py-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">

            {/* Text Color */}
            <div className="space-y-2">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Text Color</span>

                {/* Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => onChange({ textColor: c })}
                            title={c}
                            className={cn(
                                'w-5 h-5 rounded-full border-2 transition-all cursor-pointer shrink-0',
                                current === c
                                    ? 'border-white scale-110 shadow-[0_0_0_1px_rgba(255,255,255,0.3)]'
                                    : 'border-transparent hover:scale-105 hover:border-white/30'
                            )}
                            style={{ background: c }}
                        />
                    ))}

                    {/* Custom swatch */}
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
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/40 font-bold">+</span>
                        )}
                    </button>
                    <input
                        ref={inputRef}
                        type="color"
                        value={current}
                        onChange={(e) => onChange({ textColor: e.target.value })}
                        className="sr-only"
                    />
                </div>

                {/* Hex input */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full shrink-0 border border-white/10" style={{ background: current }} />
                    <input
                        type="text"
                        value={current}
                        maxLength={7}
                        onChange={(e) => {
                            const v = e.target.value
                            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange({ textColor: v })
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[11px] font-mono text-white/70 focus:outline-none focus:border-white/30 focus:text-white transition-colors"
                        placeholder="#ffffff"
                    />
                    <button
                        onClick={() => onChange({ textColor: '#ffffff' })}
                        className="text-[9px] text-white/25 hover:text-white/60 transition-colors shrink-0"
                    >
                        reset
                    </button>
                </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Value Size */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Value Size</span>
                    <span className="text-[10px] text-white/50 font-mono">{style.valueSize}px</span>
                </div>
                <input
                    type="range"
                    min={32}
                    max={96}
                    value={style.valueSize}
                    onChange={(e) => onChange({ valueSize: Number(e.target.value) })}
                    className="w-full accent-primary cursor-pointer h-1"
                />
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Label Size */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Label Size</span>
                    <span className="text-[10px] text-white/50 font-mono">{style.labelSize}px</span>
                </div>
                <input
                    type="range"
                    min={8}
                    max={24}
                    value={style.labelSize}
                    onChange={(e) => onChange({ labelSize: Number(e.target.value) })}
                    className="w-full accent-primary cursor-pointer h-1"
                />
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Font Family */}
            <div className="space-y-2">
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

            {/* Live preview */}
            <Separator className="opacity-20" />
            <div
                className="text-center py-3 rounded-lg bg-white/5 border border-white/10"
                style={{
                    color: style.textColor,
                    fontFamily: style.fontFamily,
                    fontSize: `${Math.min(style.valueSize * 0.4, 32)}px`,
                    fontWeight: 800,
                    lineHeight: 1,
                }}
            >
                $1,247
                <p style={{
                    fontSize: `${style.labelSize}px`,
                    fontWeight: 600,
                    opacity: 0.5,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginTop: 6,
                }}>
                    Monthly Recurring Revenue
                </p>
            </div>
        </div>
    )
}
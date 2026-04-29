'use client'

/**
 * CardCanvas.tsx
 * Renders the actual milestone card preview.
 * Receives all visual state as props. ref is forwarded to parent via cardRef prop.
 */

import { useMemo, forwardRef } from 'react'
import { TrendingUp, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FONTS } from '@/types/card'
import type { MetricIconKey, Metric, EmojiPosition } from '@/types/card'
import { METRIC_ICONS } from '@/types/card'

interface CardCanvasProps {
    active: string
    metrics: Metric[]
    selectedGradient: string
    textColor: string
    selectedFont: string
    alignment: 'left' | 'center' | 'right'
    ratio: 'square' | 'landscape' | 'portrait'
    noiseEnabled: boolean
    selectedEmoji: string | null
    emojiPositions: EmojiPosition[]
    handle: string
    platform: { icon: React.ReactNode } | null
    borderRadius: number
}

const CardCanvas = forwardRef<HTMLDivElement, CardCanvasProps>(({
    active,
    metrics,
    selectedGradient,
    textColor,
    selectedFont,
    alignment,
    ratio,
    noiseEnabled,
    selectedEmoji,
    emojiPositions,
    handle,
    platform,
    borderRadius,
}, ref) => {
    const ratioClass = useMemo(() => {
        switch (ratio) {
            case 'landscape': return 'aspect-[16/9]'
            case 'portrait': return 'aspect-[9/16]'
            default: return 'aspect-square'
        }
    }, [ratio])

    const alignmentClass = useMemo(() => {
        switch (alignment) {
            case 'left': return 'items-center justify-start text-left'
            case 'right': return 'items-center justify-end text-right'
            default: return 'items-center justify-center text-center'
        }
    }, [alignment])

    return (
        <div
            ref={ref}
            className={cn(
                'w-full overflow-hidden flex p-8 relative',
                ratioClass,
                alignmentClass
            )}
            style={{ borderRadius }}
        >
            {/* Background gradient layer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: selectedGradient, borderRadius }}
            />

            {/* Noise overlay */}
            {noiseEnabled && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        backgroundRepeat: 'repeat',
                        opacity: 1.5,
                        mixBlendMode: 'overlay',
                    }}
                />
            )}

            {/* Emoji scatter */}
            {selectedEmoji && emojiPositions.map((e) => (
                <span
                    key={e.id}
                    className="absolute pointer-events-none select-none z-[5]"
                    style={{
                        left: `${e.x}%`,
                        top: `${e.y}%`,
                        fontSize: `${e.size}px`,
                        transform: `rotate(${e.rotation}deg)`,
                        opacity: e.opacity,
                        filter: `blur(${e.size > 30 ? 0.6 : 1.4}px)`,
                        textShadow: `
                            ${e.size * 0.02}px ${e.size * 0.02}px ${e.size * 0.1}px rgba(0,0,0,0.2),
                            ${e.size * 0.04}px ${e.size * 0.04}px ${e.size * 0.2}px rgba(0,0,0,0.1)
                        `,
                    }}
                >
                    {selectedEmoji}
                </span>
            ))}

            {/* Handle watermark */}
            {handle && (
                <p
                    className="absolute right-6 bottom-6 z-10 font-semibold flex items-center gap-1"
                    style={{ color: textColor }}
                >
                    {platform?.icon}
                    {handle}
                </p>
            )}

            {/* Metrics template */}
            {active === 'metrics' && (
                <div
                    className={cn(
                        'relative z-10 flex flex-col',
                        alignment === 'left' && 'items-start',
                        alignment === 'center' && 'items-center',
                        alignment === 'right' && 'items-end'
                    )}
                    style={{ color: textColor, fontFamily: selectedFont }}
                >
                    <div className="flex items-center gap-1.5 font-bold text-xl mb-2">
                        <TrendingUp size={22} strokeWidth={3} />
                        <span>+900%</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        {metrics.map((m) => {
                            const Icon = METRIC_ICONS[m.icon as MetricIconKey] || Users
                            return (
                                <div key={m.id} className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-4xl md:text-5xl font-extrabold tracking-tight">
                                        <Icon size={40} strokeWidth={2.5} />
                                        <span>{formatNumber(m.value)}</span>
                                    </div>
                                    <div className="text-xs mt-1 uppercase tracking-wider opacity-60">
                                        {m.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Milestone template */}
            {active === 'milestone' && (() => {
                const metric = metrics[0]
                const value = parseValue(metric?.value || '0')
                const { past, future } = getMilestones(value)

                return (
                    <div
                        className="relative z-10 flex flex-col items-center justify-center"
                        style={{ color: textColor, fontFamily: selectedFont }}
                    >
                        <div className="text-4xl font-extrabold opacity-30 tracking-wide">
                            {formatNumber(future)}
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-7xl md:text-8xl font-extrabold leading-none">
                                {formatNumber(value)}
                            </div>
                            <div className="text-xs mt-2 uppercase tracking-[0.25em] opacity-60">
                                {metric?.label}
                            </div>
                        </div>
                        <div className="text-4xl font-extrabold opacity-30 tracking-wide">
                            {formatNumber(past)}
                        </div>
                    </div>
                )
            })()}
        </div>
    )
})

CardCanvas.displayName = 'CardCanvas'

export default CardCanvas

// Helpers
const formatNumber = (value: number | string) => {
    const num = typeof value === 'number' ? value : Number(value)
    if (!num) return '0'
    const fmt = (n: number) => parseFloat(n.toFixed(1)).toString()
    if (num >= 1_000_000_000) return fmt(num / 1_000_000_000) + 'B'
    if (num >= 1_000_000) return fmt(num / 1_000_000) + 'M'
    if (num >= 1_000) return fmt(num / 1_000) + 'K'
    return num.toString()
}

const getMilestones = (value: number) => {
    if (value <= 0) return { past: 0, future: 0 }
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
    const past = Math.floor(value / magnitude) * magnitude
    return { past, future: past + magnitude }
}

const parseValue = (value: string) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
}
'use client'

/**
 * CardCanvas.tsx
 * Renders the actual milestone card preview.
 * Receives all visual state as props. ref is forwarded to parent via cardRef prop.
 */

import { useMemo, forwardRef } from 'react'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricIconKey, Metric, EmojiPosition, MetricStyle } from '@/types'
import { METRIC_ICONS } from '@/types'

interface CardCanvasProps {
    progressType: 'circle' | 'bar'
    active: string
    metrics: Metric[]
    selectedGradient: string
    alignment: 'left' | 'center' | 'right'
    ratio: 'square' | 'landscape' | 'portrait'
    noiseEnabled: boolean
    selectedEmoji: string | null
    emojiPositions: EmojiPosition[]
    handle: string
    platform: { icon: React.ReactNode } | null
    borderRadius: number
    handleTextColor: string
    selectedEmojiUrl: string | null
}

const CardCanvas = forwardRef<HTMLDivElement, CardCanvasProps>(({
    active,
    metrics,
    selectedGradient,
    selectedEmojiUrl,
    alignment,
    ratio,
    noiseEnabled,
    selectedEmoji,
    emojiPositions,
    handle,
    platform,
    borderRadius,
    handleTextColor,
    progressType
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

    // Detect if selectedGradient is an image path
    const isImageBackground = /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(selectedGradient) || selectedGradient.startsWith('/')

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

            {/* Milestone Studio watermark */}
            <p
                className="absolute z-20 flex items-center gap-1"
                style={{
                    left: '16px',
                    bottom: '12px',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    opacity: 0.25,
                    color: handleTextColor,
                    fontFamily: 'sans-serif',
                    pointerEvents: 'none',
                }}
            >
                Milestone Studio
            </p>

            {isImageBackground ? (
                <img
                    src={selectedGradient}
                    alt=""
                    className="absolute inset-0 w-full h-full pointer-events-none object-cover"
                    style={{ borderRadius }}
                />
            ) : (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: selectedGradient, borderRadius }}
                />
            )}

            {noiseEnabled && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.18, borderRadius }}
                >
                    <filter id="noise-filter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.9"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise-filter)" />
                </svg>
            )}

            {selectedEmoji && emojiPositions.map((e) => (
                <img
                    key={e.id}
                    src={selectedEmojiUrl ?? emojiToTwemojiUrl(selectedEmoji)}
                    alt={selectedEmoji}
                    className="absolute pointer-events-none select-none z-[5]"
                    style={{
                        left: `${e.x}%`,
                        top: `${e.y}%`,
                        width: `${e.size}px`,
                        height: `${e.size}px`,
                        transform: `rotate(${e.rotation}deg)`,
                        opacity: e.opacity,
                        filter: `blur(${e.blur}px) drop-shadow(${e.size * 0.02}px ${e.size * 0.02}px ${e.size * 0.1}px rgba(0,0,0,0.2))`,
                    }}
                    crossOrigin="anonymous"
                />
            ))}

            {/* Handle watermark */}
            {handle && (
                <p
                    className="absolute right-6 bottom-6 z-10 font-semibold flex items-center gap-1"
                    style={{ color: handleTextColor }}
                >
                    {platform?.icon}
                    {handle}
                </p>
            )}

            {active === 'metrics' && (
                <div className={cn(
                    'relative z-10 flex flex-col',
                    alignment === 'left' && 'items-start',
                    alignment === 'center' && 'items-center',
                    alignment === 'right' && 'items-end'
                )}>
                    <div className="flex flex-wrap items-center gap-8">
                        {metrics.map((m, idx) => {
                            const Icon = METRIC_ICONS[m.icon as MetricIconKey] || Users
                            const s = m.style

                            return (
                                <div key={m.id} className="flex items-center gap-8">
                                    {/* Divider between metrics */}
                                    {idx > 0 && (
                                        <div className="w-px h-12 opacity-20" style={{ backgroundColor: s?.textColor || '#ffffff' }} />
                                    )}
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            color: s?.textColor,
                                            alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
                                        }}
                                    >
                                        {/* Icon + Value */}
                                        <div className="flex items-center gap-2 tracking-tight leading-none">
                                            {s?.showIcon && (
                                                <Icon size={s?.iconSize * 0.6} strokeWidth={s?.valueBold ? 2.5 : 1.5} style={{ opacity: 0.7 }} />
                                            )}
                                            <span style={{
                                                fontSize: `${s?.valueSize}px`,
                                                fontWeight: s?.valueBold ? 800 : 400,
                                                fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                                fontFamily: s?.fontFamily,
                                                textShadow: getTextShadow(s),
                                                lineHeight: 1,
                                            }}>
                                                {formatNumber(m.value)}
                                            </span>
                                        </div>
                                        {/* Label on top */}
                                        <div style={{
                                            fontSize: `${s?.labelSize}px`,
                                            fontWeight: s?.labelBold ? 700 : 600,
                                            fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            opacity: 0.5,
                                            fontFamily: s?.fontFamily,
                                            textShadow: getTextShadow(s),
                                            marginBottom: '6px',
                                            textAlign: 'center'
                                        }}>
                                            {m.label}
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {active === 'milestone' && (() => {
                const metric = metrics[0];
                const value = parseValue(metric?.value || '0');
                const { past1, past2, future1, future2 } = getMilestones(value);
                const s = metric.style;

                const base = {
                    fontStyle: s?.valueItalic ? 'italic' : 'normal',
                    fontFamily: s?.fontFamily,
                    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    color: s?.textColor || '#ffffff',
                    userSelect: 'none' as const,
                    pointerEvents: 'none' as const,
                    lineHeight: 1,
                    display: 'block',
                };

                return (
                    <div
                        className="relative z-10 flex flex-col items-center justify-center"
                        style={{ perspective: '800px', gap: '2px' }}
                    >
                        {/* Future 2 — farthest away */}
                        <div style={{
                            ...base,
                            fontSize: `${s?.valueSize * 0.52}px`,
                            fontWeight: 200,
                            letterSpacing: '3px',
                            opacity: 0.08,
                            filter: 'blur(1.8px)',
                            transform: 'rotateX(-38deg) translateY(4px) translateZ(-60px) scale(0.78)',
                            marginBottom: '2px',
                        }}>
                            {formatNumber(future2)}
                        </div>

                        {/* Future 1 */}
                        <div style={{
                            ...base,
                            fontSize: `${s?.valueSize * 0.68}px`,
                            fontWeight: s?.valueBold ? 300 : 200,
                            letterSpacing: '5px',
                            opacity: 0.22,
                            filter: 'blur(0.9px)',
                            transform: 'rotateX(-22deg) translateY(2px) translateZ(-30px) scale(0.88)',
                            marginBottom: '6px',
                        }}>
                            {formatNumber(future1)}
                        </div>

                        {/* Current — hero */}
                        <div className="flex flex-col items-center z-20" style={{ marginBottom: '6px' }}>
                            <div style={{
                                ...base,
                                fontSize: `${s?.valueSize}px`,
                                fontWeight: s?.valueBold ? 900 : 500,
                                letterSpacing: '8px',
                                opacity: 1,
                                filter: 'none',
                                transform: 'translateZ(0)',
                                textShadow: `0 0 40px ${s?.textColor || '#ffffff'}55, 0 2px 8px rgba(0,0,0,0.4)`,
                                pointerEvents: 'auto',
                                userSelect: 'text',
                            }}>
                                {formatNumber(value)}
                            </div>
                            <div style={{
                                fontSize: `${s?.labelSize}px`,
                                fontWeight: s?.labelBold ? 700 : 500,
                                fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                fontFamily: s?.fontFamily,
                                color: s?.textColor || '#ffffff',
                                opacity: 0.45,
                                letterSpacing: '0.35em',
                                textTransform: 'uppercase',
                                marginTop: '10px',
                            }}>
                                {metric?.label}
                            </div>
                        </div>

                        {/* Past 1 */}
                        <div style={{
                            ...base,
                            fontSize: `${s?.valueSize * 0.68}px`,
                            fontWeight: s?.valueBold ? 300 : 200,
                            letterSpacing: '5px',
                            opacity: 0.22,
                            filter: 'blur(0.9px)',
                            transform: 'rotateX(22deg) translateY(-2px) translateZ(-30px) scale(0.88)',
                            marginTop: '2px',
                        }}>
                            {formatNumber(past1)}
                        </div>

                        {/* Past 2 — farthest away */}
                        <div style={{
                            ...base,
                            fontSize: `${s?.valueSize * 0.52}px`,
                            fontWeight: 200,
                            letterSpacing: '3px',
                            opacity: 0.08,
                            filter: 'blur(1.8px)',
                            transform: 'rotateX(38deg) translateY(-4px) translateZ(-60px) scale(0.78)',
                            marginTop: '2px',
                        }}>
                            {formatNumber(past2)}
                        </div>
                    </div>
                );
            })()}

            {/* Progress Template */}
            {active === 'progress' && (() => {
                const currentMetric = metrics[0];
                const targetMetric = metrics[1]; // Optional second metric as goal

                const currentVal = parseValue(currentMetric?.value || '0');
                const targetVal = targetMetric ? parseValue(targetMetric.value) : 100;

                // Calculate percentage (clamped between 0 and 100)
                const percentage = Math.min(Math.max((currentVal / targetVal) * 100, 0), 100);
                const s = currentMetric?.style;

                // Dynamic Typography Base
                const typographyBase = {
                    fontFamily: s?.fontFamily,
                    fontStyle: s?.valueItalic ? 'italic' : 'normal',
                    textShadow: getTextShadow(s),
                };

                return (
                    <div className={cn(
                        "relative z-10 flex flex-col w-full items-center justify-center",
                        progressType === 'bar' && {
                            'items-start': alignment === 'left',
                            'items-center': alignment === 'center',
                            'items-end': alignment === 'right',
                        }
                    )}
                        style={{ color: s?.textColor }} // Apply dynamic text color to entire container
                    >

                        {progressType === 'bar' ? (
                            /* --- LINEAR BAR VIEW --- */
                            <div className="w-full max-w-md">
                                {/* Header: Label and Percentage */}
                                <div className="w-full flex justify-between items-end mb-4 px-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-[0.2em] opacity-60 mb-1" style={typographyBase}>
                                            {currentMetric?.label || 'Progress'}
                                        </span>
                                        <span style={{
                                            ...typographyBase,
                                            fontSize: `${(s?.valueSize || 40) * 0.8}px`,
                                            fontWeight: s?.valueBold ? 800 : 400,
                                        }}>
                                            {formatNumber(currentVal)}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-2xl font-light opacity-90" style={typographyBase}>
                                            {Math.round(percentage)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar Track */}
                                <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                    {/* Glowing Fill - Now using dynamic s.textColor */}
                                    <div
                                        className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full"
                                        style={{
                                            width: `${percentage}%`,
                                            background: s?.textColor || '#ffffff',
                                            // Dynamic glow: uses the text color with 50% opacity for the outer glow
                                            boxShadow: `0 0 15px ${s?.textColor}80`,
                                        }}
                                    />
                                </div>

                                {/* Footer: Target/Goal info */}
                                <div className="w-full flex justify-between mt-3 px-1 text-[10px] uppercase tracking-widest opacity-50 font-bold" style={typographyBase}>
                                    <span>0</span>
                                    {targetMetric ? (
                                        <span>Goal: {formatNumber(targetVal)} {targetMetric.label}</span>
                                    ) : (
                                        <span>Target: {formatNumber(targetVal)}</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* --- CIRCLE PROGRESS VIEW --- */
                            <div className="relative flex items-center justify-center">

                                <svg className="w-64 h-64 transform -rotate-90">
                                    {/* Background Track Circle */}
                                    <circle
                                        cx="128" cy="128" r="100"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-white/10"
                                    />
                                    {/* Dynamic Glowing Progress Circle */}
                                    <circle
                                        cx="128" cy="128" r="100"
                                        fill="transparent"
                                        stroke={s?.textColor || '#ffffff'} // Dynamic stroke color
                                        strokeWidth="12"
                                        strokeDasharray={2 * Math.PI * 100}
                                        strokeDashoffset={2 * Math.PI * 100 * (1 - percentage / 100)}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                        style={{
                                            // Dynamic glow: uses text color with 50% opacity (hex suffix 80)
                                            filter: `drop-shadow(0 0 8px ${s?.textColor || '#ffffff'}80)`
                                        }}
                                    />
                                </svg>

                                {/* Centered Content with Dynamic Typography */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span
                                        className="text-xs uppercase tracking-[0.3em] opacity-50 mb-1"
                                        style={{ fontFamily: s?.fontFamily }}
                                    >
                                        {currentMetric?.label}
                                    </span>
                                    <span style={{
                                        fontFamily: s?.fontFamily,
                                        fontSize: `${(s?.valueSize || 40) * 1.1}px`,
                                        fontWeight: s?.valueBold ? 800 : 400,
                                        fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                        lineHeight: 1,
                                        color: s?.textColor // Ensure text matches the glowing ring
                                    }}>
                                        {Math.round(percentage)}%
                                    </span>
                                    <div
                                        className="mt-2 text-[10px] opacity-40 font-bold tracking-widest"
                                        style={{ fontFamily: s?.fontFamily }}
                                    >
                                        {formatNumber(currentVal)} / {formatNumber(targetVal)}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                );
            })()}

            {active === 'list' && (
                <div className={cn(
                    "relative z-10 w-full px-4",
                    "grid gap-4",
                    metrics.length === 1 ? "grid-cols-1 max-w-xs" :
                        metrics.length === 2 ? "grid-cols-2" :
                            metrics.length <= 4 ? "grid-cols-2" : "grid-cols-3",
                    alignment === 'left' && 'justify-items-start',
                    alignment === 'center' && 'justify-items-center',
                    alignment === 'right' && 'justify-items-end'
                )}>
                    {metrics.map((m) => {
                        const Icon = METRIC_ICONS[m.icon as MetricIconKey] || Users
                        const s = m.style
                        const color = s?.textColor || '#ffffff'

                        return (
                            <div
                                key={m.id}
                                className="relative flex flex-col justify-between w-full overflow-hidden"
                                style={{
                                    color,
                                    padding: '18px 20px',
                                    borderRadius: '16px',
                                    background: `${color}08`,
                                    border: `1px solid ${color}15`,
                                    backdropFilter: 'blur(8px)',
                                    alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'flex-start',
                                    minWidth: 0,
                                }}
                            >
                                {/* Left accent bar */}
                                <div
                                    className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                                    style={{ background: `linear-gradient(180deg, ${color}, ${color}33)` }}
                                />

                                {/* Icon + Label row */}
                                <div className="flex items-center gap-2 mb-3 pl-3">
                                    {s?.showIcon && (
                                        <Icon
                                            size={s?.iconSize * 0.45 || 16}
                                            strokeWidth={1.5}
                                            style={{ opacity: 0.5 }}
                                        />
                                    )}
                                    <span style={{
                                        fontSize: `${s?.labelSize || 11}px`,
                                        fontWeight: 600,
                                        fontFamily: s?.fontFamily,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        opacity: 0.45,
                                    }}>
                                        {m.label}
                                    </span>
                                </div>

                                {/* Value */}
                                <div className="pl-3">
                                    <span style={{
                                        fontSize: `${s?.valueSize || 42}px`,
                                        fontWeight: s?.valueBold ? 800 : 400,
                                        fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                        fontFamily: s?.fontFamily,
                                        textShadow: getTextShadow(s),
                                        lineHeight: 1,
                                        display: 'block',
                                    }}>
                                        {formatNumber(m.value)}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
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
    // Handle 0 or edge cases
    if (value === 0) return { past1: -10, past2: -20, future1: 10, future2: 20 };

    const absValue = Math.abs(value);
    const magnitude = Math.pow(10, Math.floor(Math.log10(absValue)));
    const firstDigit = absValue / magnitude;

    // Determine a "pretty" step size (1, 2, or 5)
    let step;
    if (firstDigit < 2) step = magnitude / 5;      // Steps of 200 for 1000
    else if (firstDigit < 5) step = magnitude / 2; // Steps of 500 for 1000
    else step = magnitude;                         // Steps of 1000 for 5000

    // Round the base to the nearest step to keep the cylinder stable
    const base = Math.floor(value / step) * step;

    return {
        past2: base - (step * 2),
        past1: base - step,
        future1: base + step,
        future2: base + (step * 2)
    };
};

const parseValue = (value: string) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

const getTextShadow = (s: MetricStyle | undefined) => {
    if (!s?.textShadowEnabled) return undefined
    return `${s.textShadowX}px ${s.textShadowY}px ${s.textShadowBlur}px ${s.textColor}99`
}

// Helper at bottom of file — converts emoji char to Twemoji CDN URL
const emojiToTwemojiUrl = (emoji: string): string => {
    // Get the codepoint(s), filter out variation selectors (FE0F)
    const codePoints = [...emoji]
        .map(c => c.codePointAt(0)!.toString(16))
        .filter(cp => cp !== 'fe0f')
        .join('-')
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoints}.svg`
}
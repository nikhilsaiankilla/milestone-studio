'use client'

/**
 * CardCanvas.tsx
 * Renders the actual milestone card preview.
 * Receives all visual state as props. ref is forwarded to parent via cardRef prop.
 */

import { useMemo, forwardRef } from 'react'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricIconKey, Metric, EmojiPosition } from '@/types/card'
import { METRIC_ICONS } from '@/types/card'

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
}

const CardCanvas = forwardRef<HTMLDivElement, CardCanvasProps>(({
    active,
    metrics,
    selectedGradient,
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

            {noiseEnabled && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        backgroundRepeat: 'repeat',
                        opacity: 0.10,  // Visible without blend mode
                        // NO mixBlendMode here
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
                    style={{ color: handleTextColor }}
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
                >
                    <div className="flex flex-wrap items-center gap-6">
                        {metrics.map((m) => {
                            const Icon = METRIC_ICONS[m.icon as MetricIconKey] || Users
                            const s = m.style

                            return (
                                <div
                                    key={m.id}
                                    className="flex flex-col items-center"
                                    style={{ color: s?.textColor }}
                                >
                                    <div className="flex items-center gap-2 tracking-tight">
                                        {s?.showIcon && <Icon size={s?.iconSize} strokeWidth={s?.valueBold ? 2.5 : 1.5} />}
                                        <span style={{
                                            fontSize: `${s?.valueSize}px`,
                                            fontWeight: s?.valueBold ? 800 : 400,
                                            fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                            fontFamily: s?.fontFamily
                                        }}>
                                            {formatNumber(m.value)}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: `${s?.labelSize}px`,
                                        fontWeight: s?.labelBold ? 700 : 400,
                                        fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                        marginTop: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        opacity: 0.6,
                                        fontFamily: s?.fontFamily
                                    }}>
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
                const metric = metrics[0];
                const value = parseValue(metric?.value || '0');
                const { past1, past2, future1, future2 } = getMilestones(value);
                const s = metric.style;

                const baseFontStyle = {
                    fontStyle: s?.valueItalic ? 'italic' : 'normal',
                    fontFamily: s?.fontFamily,
                    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                    color: s?.textColor || '#ffffff'
                };

                return (
                    <div
                        className="relative z-10 flex flex-col items-center justify-center border-none outline-none bg-transparent"
                        style={{ perspective: '1200px' }}
                    >
                        {/* FUTURE 2 - Ultra-Tightened */}
                        <div
                            className="opacity-10 select-none pointer-events-none"
                            style={{
                                ...baseFontStyle,
                                fontSize: `${s?.valueSize * 0.6}px`,
                                fontWeight: s?.valueBold ? 300 : 100,
                                /* translateY reduced from 12px to 6px | translateZ reduced from -60px to -40px */
                                transform: 'rotateX(-45deg) translateY(6px) translateZ(-10px) scale(0.85)',
                                filter: 'blur(0.6px)',
                                letterSpacing: "4px"
                            }}
                        >
                            {formatNumber(future2)}
                        </div>

                        {/* FUTURE 1 - Tightened */}
                        <div
                            className="opacity-30 select-none pointer-events-none"
                            style={{
                                ...baseFontStyle,
                                fontSize: `${s?.valueSize * 0.7}px`,
                                fontWeight: s?.valueBold ? 400 : 200,
                                /* translateY reduced from 4px to 2px | translateZ reduced from -30px to -20px */
                                transform: 'rotateX(-30deg) translateY(2px) translateZ(-20px) scale(0.85)',
                                filter: 'blur(0.5px)',
                                letterSpacing: "6px"
                            }}
                        >
                            {formatNumber(future1)}
                        </div>

                        {/* MIDDLE (Current) */}
                        <div className="flex flex-col items-center z-20">
                            <div
                                className="leading-none"
                                style={{
                                    ...baseFontStyle,
                                    fontSize: `${s?.valueSize}px`,
                                    fontWeight: s?.valueBold ? 800 : 400,
                                    transform: 'translateZ(20px)',
                                    letterSpacing: "10px",
                                    textShadow: `0 0 20px ${s?.textColor || '#ffffff'}33`
                                }}
                            >
                                {formatNumber(value)}
                            </div>
                            <div
                                className="mt-1 uppercase tracking-[0.4em] opacity-60"
                                style={{
                                    fontSize: `${s?.labelSize}px`,
                                    fontWeight: s?.labelBold ? 700 : 400,
                                    fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                    fontFamily: s?.fontFamily
                                }}
                            >
                                {metric?.label}
                            </div>
                        </div>

                        {/* PAST 1 - Tightened */}
                        <div
                            className="opacity-30 select-none pointer-events-none"
                            style={{
                                ...baseFontStyle,
                                fontSize: `${s?.valueSize * 0.7}px`,
                                fontWeight: s?.valueBold ? 400 : 200,
                                /* translateY reduced from -4px to -2px | translateZ reduced from -30px to -20px */
                                transform: 'rotateX(30deg) translateY(-2px) translateZ(-20px) scale(0.85)',
                                filter: 'blur(0.5px)',
                                letterSpacing: "6px"
                            }}
                        >
                            {formatNumber(past1)}
                        </div>

                        {/* PAST 2 - Ultra-Tightened */}
                        <div
                            className="opacity-10 select-none pointer-events-none"
                            style={{
                                ...baseFontStyle,
                                fontSize: `${s?.valueSize * 0.6}px`,
                                fontWeight: s?.valueBold ? 300 : 100,
                                /* translateY reduced from -12px to -6px | translateZ reduced from -60px to -40px */
                                transform: 'rotateX(45deg) translateY(-6px) translateZ(-10px) scale(0.85)',
                                filter: 'blur(0.6px)',
                                letterSpacing: "4px"
                            }}
                        >
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

            {/* Grid Template */}
            {active === 'list' && (
                <div
                    className={cn(
                        "relative z-10 grid gap-x-12 gap-y-8 w-full px-4",
                        // Dynamic column adjustment based on metric count
                        metrics.length === 1 ? "grid-cols-1" :
                            metrics.length === 2 ? "grid-cols-2" :
                                metrics.length <= 4 ? "grid-cols-2" : "grid-cols-3",

                        // Alignment based on global setting
                        alignment === 'left' && 'justify-items-start',
                        alignment === 'center' && 'justify-items-center text-center',
                        alignment === 'right' && 'justify-items-end text-right'
                    )}
                >
                    {metrics.map((m) => {
                        const Icon = METRIC_ICONS[m.icon as MetricIconKey] || Users;
                        const s = m.style;

                        return (
                            <div
                                key={m.id}
                                className="flex flex-col group transition-transform duration-300 hover:scale-105"
                                style={{
                                    color: s?.textColor || '#ffffff',
                                    alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
                                }}
                            >
                                {/* Value & Icon Row */}
                                <div className="flex items-center gap-3 tracking-tight leading-none">
                                    {s?.showIcon && (
                                        <Icon
                                            size={s?.iconSize || 24}
                                            strokeWidth={s?.valueBold ? 2.5 : 1.5}
                                            className="opacity-80"
                                        />
                                    )}
                                    <span
                                        style={{
                                            fontSize: `${s?.valueSize || 48}px`,
                                            fontWeight: s?.valueBold ? 800 : 400,
                                            fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                            fontFamily: s?.fontFamily
                                        }}
                                    >
                                        {formatNumber(m.value)}
                                    </span>
                                </div>

                                {/* Label Row */}
                                <div
                                    className="uppercase tracking-[0.2em] opacity-60"
                                    style={{
                                        fontSize: `${s?.labelSize || 12}px`,
                                        fontWeight: s?.labelBold ? 700 : 400,
                                        fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                        fontFamily: s?.fontFamily,
                                        marginTop: '8px'
                                    }}
                                >
                                    {m.label}
                                </div>

                                {/* Optional Accent Line */}
                                <div
                                    className="h-1 w-8 mt-2 rounded-full opacity-30"
                                    style={{ backgroundColor: s?.textColor || '#ffffff' }}
                                />
                            </div>
                        );
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
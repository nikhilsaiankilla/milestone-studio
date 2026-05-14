'use client'

/**
 * CardCanvas.tsx
 * Renders the actual milestone card preview.
 * Receives all visual state as props. ref is forwarded to parent via cardRef prop.
 *
 * Responsive strategy: card always renders at CARD_BASE_WIDTH (800px) internally,
 * then CSS scale() shrinks it to fit the container. The forwarded ref always points
 * to the full-size element so downloads are always crisp.
 */

import { useMemo, forwardRef, useRef, useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricIconKey, Metric, EmojiPosition, MetricStyle } from '@/types'
import { METRIC_ICONS } from '@/types'

// The card always renders at this internal width — download quality is always crisp
const CARD_BASE_WIDTH = 800

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
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    // Measure wrapper and compute scale so card fits perfectly
    useEffect(() => {
        const update = () => {
            if (!wrapperRef.current) return
            const available = wrapperRef.current.getBoundingClientRect().width
            setScale(available / CARD_BASE_WIDTH)
        }
        update()
        const ro = new ResizeObserver(update)
        if (wrapperRef.current) ro.observe(wrapperRef.current)
        return () => ro.disconnect()
    }, [])

    const aspectRatio = useMemo(() => {
        switch (ratio) {
            case 'landscape': return 16 / 9
            case 'portrait': return 9 / 16
            default: return 1
        }
    }, [ratio])

    // Wrapper height keeps space reserved so layout doesn't collapse
    const scaledHeight = (CARD_BASE_WIDTH / aspectRatio) * scale

    const alignmentClass = useMemo(() => {
        switch (alignment) {
            case 'left': return 'items-center justify-start text-left'
            case 'right': return 'items-center justify-end text-right'
            default: return 'items-center justify-center text-center'
        }
    }, [alignment])

    const isImageBackground = /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(selectedGradient) || selectedGradient.startsWith('/')

    return (
        // Outer wrapper: fills available width, reserves the right height
        <div ref={wrapperRef} className="w-full" style={{ height: scaledHeight }}>
            {/*
                Inner card: always CARD_BASE_WIDTH wide, scaled down via transform.
                transform-origin top-left so it anchors correctly.
                The `ref` forwarded here is what html-to-image targets —
                captures the card at full CARD_BASE_WIDTH resolution regardless of scale.
            */}
            <div
                ref={ref}
                className={cn(
                    'overflow-hidden flex items-center p-8 relative',
                    alignmentClass
                )}
                style={{
                    width: CARD_BASE_WIDTH,
                    height: CARD_BASE_WIDTH / aspectRatio,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    borderRadius,
                }}
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

                {/* ── Metrics template ── */}
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
                                const isHero = s?.iconPosition === 'hero'

                                return (
                                    <div key={m.id} className="flex items-center gap-8">
                                        {idx > 0 && (
                                            <div className="w-px h-12 opacity-20"
                                                style={{ backgroundColor: s?.textColor || '#ffffff' }} />
                                        )}
                                        <div
                                            className="flex flex-col"
                                            style={{
                                                color: s?.textColor,
                                                alignItems: alignment === 'left' ? 'flex-start'
                                                    : alignment === 'right' ? 'flex-end'
                                                        : 'center'
                                            }}
                                        >
                                            {s?.showIcon && isHero && (
                                                <Icon
                                                    size={s?.iconSize * 1.2}
                                                    strokeWidth={1.5}
                                                    style={{
                                                        opacity: 0.9,
                                                        marginBottom: `${s?.valueSize * 0.2}px`,
                                                    }}
                                                />
                                            )}

                                            <div className="flex items-center gap-2 tracking-tight leading-none">
                                                {s?.showIcon && !isHero && (
                                                    <Icon
                                                        size={s?.iconSize * 0.6}
                                                        strokeWidth={s?.valueBold ? 2.5 : 1.5}
                                                        style={{ opacity: 0.7 }}
                                                    />
                                                )}
                                                <span style={{
                                                    fontSize: `${s?.valueSize}px`,
                                                    fontWeight: s?.valueBold ? 800 : 400,
                                                    fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                                    fontFamily: s?.fontFamily,
                                                    textShadow: getTextShadow(s),
                                                    lineHeight: 1,
                                                }}>
                                                    {s.numberFormat !== 'full' ? formatNumber(m.value) : m.value}
                                                </span>
                                            </div>

                                            <div style={{
                                                fontSize: `${s?.labelSize}px`,
                                                fontWeight: s?.labelBold ? 700 : 600,
                                                fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                opacity: 0.5,
                                                fontFamily: s?.fontFamily,
                                                textShadow: getTextShadow(s),
                                                marginTop: '6px',
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

                {/* ── Milestone template ── */}
                {active === 'milestone' && (() => {
                    const metric = metrics[0]
                    const value = parseValue(metric?.value || '0')
                    const { past1, past2, future1, future2 } = getMilestones(value)
                    const s = metric.style

                    const STEP_Z = 60
                    const STEP_ROTATE = 18
                    const SCALE_FACTOR = 0.18

                    const base = {
                        fontStyle: s?.valueItalic ? 'italic' : 'normal',
                        fontFamily: s?.fontFamily,
                        color: s?.textColor || '#ffffff',
                        lineHeight: 1,
                        userSelect: 'none' as const,
                    }

                    const Icon = METRIC_ICONS[metric.icon as MetricIconKey] || Users

                    return (
                        <div
                            className="relative z-10 flex flex-col items-center justify-center"
                            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                        >
                            <div style={{
                                ...base,
                                fontSize: `${s?.valueSize * (1 - 2 * SCALE_FACTOR)}px`,
                                fontWeight: 300,
                                letterSpacing: '3px',
                                opacity: 0.14,
                                filter: 'blur(2.4px)',
                                transform: `rotateX(${-STEP_ROTATE * 2}deg) translateZ(${-STEP_Z}px) scale(${1 - 2 * SCALE_FACTOR})`,
                                transformOrigin: 'center',
                                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                            }}>
                                {s.numberFormat !== 'full' ? formatNumber(future2) : future2}
                            </div>

                            <div style={{
                                ...base,
                                fontSize: `${s?.valueSize * (1 - SCALE_FACTOR)}px`,
                                fontWeight: 300,
                                letterSpacing: '3px',
                                opacity: 0.28,
                                filter: 'blur(1.2px)',
                                transform: `rotateX(${-STEP_ROTATE}deg) translateZ(${-STEP_Z}px) scale(${1 - SCALE_FACTOR})`,
                                transformOrigin: 'center',
                                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                            }}>
                                {s.numberFormat !== 'full' ? formatNumber(future1) : future1}
                            </div>

                            <div className="flex flex-col items-center" style={{ transform: 'translateZ(0)', zIndex: 10 }}>
                                <div style={{
                                    ...base,
                                    fontSize: `${s?.valueSize}px`,
                                    fontWeight: s?.valueBold ? 900 : 600,
                                    letterSpacing: '6px',
                                    opacity: 1,
                                    filter: 'none',
                                    textShadow: `0 0 35px ${s?.textColor || '#ffffff'}33`,
                                    userSelect: 'text',
                                    pointerEvents: 'auto',
                                }}>
                                    {s.numberFormat !== 'full' ? formatNumber(value) : value}
                                </div>

                                <div style={{
                                    marginTop: '14px',
                                    fontSize: `${s?.labelSize}px`,
                                    fontWeight: s?.labelBold ? 700 : 500,
                                    fontStyle: s?.labelItalic ? 'italic' : 'normal',
                                    fontFamily: s?.fontFamily,
                                    color: s?.textColor || '#ffffff',
                                    opacity: 0.45,
                                    letterSpacing: '0.35em',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    {s?.showIcon && (
                                        <Icon
                                            size={s?.iconSize * 0.2}
                                            strokeWidth={s?.valueBold ? 2.5 : 1.5}
                                            style={{ opacity: 0.7 }}
                                        />
                                    )}
                                    {metric?.label}
                                </div>
                            </div>

                            <div style={{
                                ...base,
                                fontSize: `${s?.valueSize * (1 - SCALE_FACTOR)}px`,
                                fontWeight: 300,
                                letterSpacing: '3px',
                                opacity: 0.28,
                                filter: 'blur(1.2px)',
                                transform: `rotateX(${STEP_ROTATE}deg) translateZ(${-STEP_Z}px) scale(${1 - SCALE_FACTOR})`,
                                transformOrigin: 'center',
                                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                            }}>
                                {s.numberFormat !== 'full' ? formatNumber(past1) : past1}
                            </div>

                            <div style={{
                                ...base,
                                fontSize: `${s?.valueSize * (1 - 2 * SCALE_FACTOR)}px`,
                                fontWeight: 300,
                                letterSpacing: '3px',
                                opacity: 0.14,
                                filter: 'blur(2.4px)',
                                transform: `rotateX(${STEP_ROTATE * 2}deg) translateZ(${-STEP_Z}px) scale(${1 - 2 * SCALE_FACTOR})`,
                                transformOrigin: 'center',
                                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                            }}>
                                {s.numberFormat !== 'full' ? formatNumber(past2) : past2}
                            </div>

                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                                }}
                            />
                        </div>
                    )
                })()}

                {/* ── Progress template ── */}
                {active === 'progress' && (() => {
                    const currentMetric = metrics[0]
                    const targetMetric = metrics[1]

                    const currentVal = parseValue(currentMetric?.value || '0')
                    const targetVal = targetMetric ? parseValue(targetMetric.value) : 100
                    const percentage = Math.min(Math.max((currentVal / targetVal) * 100, 0), 100)
                    const s = currentMetric?.style

                    const typographyBase = {
                        fontFamily: s?.fontFamily,
                        fontStyle: s?.valueItalic ? 'italic' : 'normal',
                        textShadow: getTextShadow(s),
                    }

                    return (
                        <div className={cn(
                            "relative z-10 flex flex-col w-full items-center justify-center",
                            progressType === 'bar' && {
                                'items-start': alignment === 'left',
                                'items-center': alignment === 'center',
                                'items-end': alignment === 'right',
                            }
                        )}
                            style={{ color: s?.textColor }}
                        >
                            {progressType === 'bar' ? (
                                <div className="w-full max-w-md">
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
                                                {s.numberFormat !== 'full' ? formatNumber(currentVal) : currentVal}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-light opacity-90" style={typographyBase}>
                                                {Math.round(percentage)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                        <div
                                            className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                background: s?.textColor || '#ffffff',
                                                boxShadow: `0 0 15px ${s?.textColor}80`,
                                            }}
                                        />
                                    </div>

                                    <div className="w-full flex justify-between mt-3 px-1 text-[10px] uppercase tracking-widest opacity-50 font-bold" style={typographyBase}>
                                        <span>0</span>
                                        {targetMetric ? (
                                            <span>Goal: {s.numberFormat !== 'full' ? formatNumber(targetVal) : targetVal} {targetMetric.label}</span>
                                        ) : (
                                            <span>Target: {s.numberFormat !== 'full' ? formatNumber(targetVal) : targetVal}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-64 h-64 transform -rotate-90">
                                        <circle cx="128" cy="128" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                                        <circle
                                            cx="128" cy="128" r="100"
                                            fill="transparent"
                                            stroke={s?.textColor || '#ffffff'}
                                            strokeWidth="12"
                                            strokeDasharray={2 * Math.PI * 100}
                                            strokeDashoffset={2 * Math.PI * 100 * (1 - percentage / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                            style={{ filter: `drop-shadow(0 0 8px ${s?.textColor || '#ffffff'}80)` }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-xs uppercase tracking-[0.3em] opacity-50 mb-1" style={{ fontFamily: s?.fontFamily }}>
                                            {currentMetric?.label}
                                        </span>
                                        <span style={{
                                            fontFamily: s?.fontFamily,
                                            fontSize: `${(s?.valueSize || 40) * 1.1}px`,
                                            fontWeight: s?.valueBold ? 800 : 400,
                                            fontStyle: s?.valueItalic ? 'italic' : 'normal',
                                            lineHeight: 1,
                                            color: s?.textColor
                                        }}>
                                            {Math.round(percentage)}%
                                        </span>
                                        <div className="mt-2 text-[10px] opacity-40 font-bold tracking-widest" style={{ fontFamily: s?.fontFamily }}>
                                            {s.numberFormat !== 'full' ? formatNumber(currentVal) : currentVal} / {s.numberFormat !== 'full' ? formatNumber(targetVal) : targetVal}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })()}

                {/* ── List template ── */}
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
                                    <div
                                        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                                        style={{ background: `linear-gradient(180deg, ${color}, ${color}33)` }}
                                    />

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
                                            {s.numberFormat !== 'full' ? formatNumber(m.value) : m.value}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
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
    if (value === 0) return { past1: -10, past2: -20, future1: 10, future2: 20 }
    const absValue = Math.abs(value)
    const magnitude = Math.pow(10, Math.floor(Math.log10(absValue)))
    const firstDigit = absValue / magnitude
    let step: number
    if (firstDigit < 2) step = magnitude / 5
    else if (firstDigit < 5) step = magnitude / 2
    else step = magnitude
    const base = Math.floor(value / step) * step
    return {
        past2: base - (step * 2),
        past1: base - step,
        future1: base + step,
        future2: base + (step * 2)
    }
}

const parseValue = (value: string) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

const getTextShadow = (s: MetricStyle | undefined) => {
    if (!s?.textShadowEnabled) return undefined
    return `${s.textShadowX}px ${s.textShadowY}px ${s.textShadowBlur}px ${s.textColor}99`
}

const emojiToTwemojiUrl = (emoji: string): string => {
    const codePoints = [...emoji]
        .map(c => c.codePointAt(0)!.toString(16))
        .filter(cp => cp !== 'fe0f')
        .join('-')
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoints}.svg`
}
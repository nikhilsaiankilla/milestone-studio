'use client'

import { AlignCenter, AlignLeft, AlignRight, ChevronDown, ShuffleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import Product from '../product'
import { GRADIENT_CATEGORIES } from '@/constants/gradients-bg'
import { useState } from 'react'

interface RightPanelProps {
    selectedGradient: string
    setSelectedGradient: (g: string) => void
    alignment: 'left' | 'center' | 'right'
    setAlignment: (a: 'left' | 'center' | 'right') => void
    noiseEnabled: boolean
    setNoiseEnabled: (n: boolean) => void
    ratio: 'square' | 'landscape' | 'portrait'
    setRatio: (r: 'square' | 'landscape' | 'portrait') => void
    onShuffle: () => void
}

// Ratio options with social context
const RATIO_PRESETS: {
    key: 'square' | 'landscape' | 'portrait'
    label: string
    ratio: string
    w: number
    h: number
    tags: string[]
}[] = [
        {
            key: 'landscape',
            label: 'Landscape',
            ratio: '16:9',
            w: 48, h: 27,
            tags: ['Twitter', 'YouTube', 'LinkedIn'],
        },
        {
            key: 'square',
            label: 'Square',
            ratio: '1:1',
            w: 36, h: 36,
            tags: ['Instagram', 'Threads'],
        },
        {
            key: 'portrait',
            label: 'Portrait',
            ratio: '9:16',
            w: 27, h: 48,
            tags: ['Story', 'Reels', 'TikTok'],
        },
    ]

export default function RightPanel({
    selectedGradient, setSelectedGradient,
    alignment, setAlignment,
    noiseEnabled, setNoiseEnabled,
    ratio, setRatio,
    onShuffle,
}: RightPanelProps) {
    const [ratioOpen, setRatioOpen] = useState(false)

    const currentRatio = RATIO_PRESETS.find(r => r.key === ratio)!

    return (
        <div className="bg-card w-[360px] shrink-0 border-l-2 border-white/10 flex flex-col h-full">
            {/* Scrollable area */}
            <div className="flex-1 w-full overflow-y-auto p-4 space-y-5 custom-scroll">
                <Product />
                {/* <div
                    style={{
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        border: "1px solid rgb(224, 224, 224)",
                        borderRadius: "12px",
                        padding: "20px",
                        maxWidth: "500px",
                        background: "rgb(255, 255, 255)",
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "12px",
                        }}
                    >
                        <img
                            alt="Milestone Studio"
                            src="https://ph-files.imgix.net/62049eeb-7320-4819-b46f-0940305924b5.png?auto=format&fit=crop&w=80&h=80"
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                flexShrink: 0,
                            }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    color: "rgb(26, 26, 26)",
                                    lineHeight: 1.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Milestone Studio
                            </h3>

                            <p
                                style={{
                                    margin: "4px 0 0",
                                    fontSize: "14px",
                                    color: "rgb(102, 102, 102)",
                                    lineHeight: 1.4,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                Generate Visually stunning Milestone cards within seconds!
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://www.producthunt.com/products/milestone-studio?embed=true&utm_source=embed&utm_medium=post_embed"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "12px",
                            padding: "8px 16px",
                            background: "rgb(255, 97, 84)",
                            color: "#fff",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        Check it out on Product Hunt →
                    </a>
                </div> */}
                <Separator className="opacity-50" />

                {/* Noise */}
                <section>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Noise</span>
                        <Switch
                            checked={noiseEnabled}
                            onCheckedChange={setNoiseEnabled}
                            className="cursor-pointer"
                        />
                    </div>
                </section>

                <Separator className="opacity-20" />

                {/* Alignment */}
                <section className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Alignment</span>
                    <div className="w-full grid grid-cols-3 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                        {(['left', 'center', 'right'] as const).map((a) => (
                            <button
                                key={a}
                                onClick={() => setAlignment(a)}
                                className={cn(
                                    'flex items-center justify-center py-2 rounded-lg transition-all cursor-pointer',
                                    alignment === a ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                                )}
                            >
                                {a === 'left' && <AlignLeft size={15} />}
                                {a === 'center' && <AlignCenter size={15} />}
                                {a === 'right' && <AlignRight size={15} />}
                            </button>
                        ))}
                    </div>
                </section>

                <Separator className="opacity-20" />

                {/* Gradient picker */}
                <div className="space-y-6">
                    {Object.entries(GRADIENT_CATEGORIES).map(([category, items]) => (
                        <section key={category} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold whitespace-nowrap">
                                    {category}
                                </span>
                                <div className="h-[1px] w-full bg-white/5" />
                            </div>

                            <div className="grid grid-cols-6 gap-2">
                                {items.map((item, i) => {
                                    const isImage = /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(item) || item.startsWith('/')
                                    return (
                                        <button
                                            key={`${category}-${i}`}
                                            onClick={() => setSelectedGradient(item)}
                                            className={cn(
                                                'relative w-full aspect-square rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer group active:scale-95',
                                                selectedGradient === item
                                                    ? 'border-white/90 ring-4 ring-white/20 z-10 scale-95'
                                                    : 'border-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-black/20'
                                            )}
                                            style={isImage ? {} : { background: item }}
                                            aria-label={`Select ${category} gradient ${i + 1}`}
                                        >
                                            {isImage && (
                                                <img
                                                    src={item}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    draggable={false}
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-40" />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                        </button>
                                    )
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Pinned bottom — canvas size + randomize */}
            <div className="shrink-0 p-4 border-t border-white/5 bg-white/5 space-y-3">

                {/* Canvas Size Popover */}
                <div className="space-y-2 flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Canvas Size</span>
                    <Popover open={ratioOpen} onOpenChange={setRatioOpen}>
                        <PopoverTrigger>
                            <button className={cn(
                                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer',
                                ratioOpen
                                    ? 'border-primary bg-yellow-500/5 text-white'
                                    : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/20'
                            )}>
                                <div className="flex items-center gap-3">
                                    {/* Mini shape preview */}
                                    <div className="flex items-center justify-center w-8 h-8">
                                        <div
                                            className={cn(
                                                'rounded-sm border-2 transition-all',
                                                ratioOpen ? 'border-primary' : 'border-white/40'
                                            )}
                                            style={{
                                                width: `${currentRatio.w * 0.55}px`,
                                                height: `${currentRatio.h * 0.55}px`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-semibold">{currentRatio.label}</span>
                                        <span className="text-[10px] opacity-40">{currentRatio.ratio}</span>
                                    </div>
                                </div>
                                <ChevronDown
                                    size={14}
                                    className={cn('transition-transform opacity-50', ratioOpen && 'rotate-180')}
                                />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="center"
                            className="w-[300px] p-4 bg-card border border-white/10 rounded-2xl shadow-2xl"
                        >
                            <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 font-bold mb-4">
                                Select Canvas Size
                            </p>

                            <div className="flex flex-col gap-2">
                                {RATIO_PRESETS.map((preset) => {
                                    const isSelected = ratio === preset.key
                                    return (
                                        <button
                                            key={preset.key}
                                            onClick={() => {
                                                setRatio(preset.key)
                                                setRatioOpen(false)
                                            }}
                                            className={cn(
                                                'flex items-center gap-4 w-full px-3 py-3 rounded-xl border transition-all cursor-pointer text-left',
                                                isSelected
                                                    ? 'border-primary bg-yellow-500/8 text-white'
                                                    : 'border-white/8 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/15 hover:bg-white/5'
                                            )}
                                        >
                                            {/* Shape preview — fixed width container so shapes align */}
                                            <div className="flex items-center justify-center shrink-0 w-12 h-12">
                                                <div
                                                    className={cn(
                                                        'rounded-[3px] border-2 transition-all',
                                                        isSelected ? 'border-primary bg-primary/10' : 'border-white/25'
                                                    )}
                                                    style={{
                                                        width: `${preset.w}px`,
                                                        height: `${preset.h}px`,
                                                    }}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={cn(
                                                        'text-[13px] font-semibold',
                                                        isSelected ? 'text-white' : 'text-white/70'
                                                    )}>
                                                        {preset.label}
                                                    </span>
                                                    <span className={cn(
                                                        'text-[11px] font-mono',
                                                        isSelected ? 'text-primary' : 'text-white/30'
                                                    )}>
                                                        {preset.ratio}
                                                    </span>
                                                </div>

                                                {/* Tags in a row */}
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {preset.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className={cn(
                                                                'text-[10px] px-2 py-0.5 rounded-full font-medium transition-all',
                                                                isSelected
                                                                    ? 'bg-primary/15 text-primary/80'
                                                                    : 'bg-white/5 text-white/25'
                                                            )}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Selected indicator */}
                                            {isSelected && (
                                                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <Button className="w-full cursor-pointer" variant="outline" onClick={onShuffle}>
                    <ShuffleIcon size={14} />
                    <span>Randomize Style</span>
                </Button>
            </div>
        </div>
    )
}
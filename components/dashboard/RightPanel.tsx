'use client'

/**
 * RightPanel.tsx
 * Gradient picker, text color, font, alignment, noise toggle, canvas size, randomize.
 */

import { AlignCenter, AlignLeft, AlignRight, ShuffleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { FONTS, GRADIENT_CATEGORIES } from '@/types/card'

interface RightPanelProps {
    selectedGradient: string
    setSelectedGradient: (g: string) => void
    textColor: string
    setTextColor: (c: string) => void
    selectedFont: string
    setSelectedFont: (f: string) => void
    alignment: 'left' | 'center' | 'right'
    setAlignment: (a: 'left' | 'center' | 'right') => void
    noiseEnabled: boolean
    setNoiseEnabled: (n: boolean) => void
    ratio: 'square' | 'landscape' | 'portrait'
    setRatio: (r: 'square' | 'landscape' | 'portrait') => void
    onShuffle: () => void
}

export default function RightPanel({
    selectedGradient, setSelectedGradient,
    textColor, setTextColor,
    selectedFont, setSelectedFont,
    alignment, setAlignment,
    noiseEnabled, setNoiseEnabled,
    ratio, setRatio,
    onShuffle,
}: RightPanelProps) {
    return (
        <div className="bg-card w-[360px] shrink-0 border-l-2 border-white/10 flex flex-col h-full">

            {/* Scrollable area */}
            <div className="flex-1 w-full overflow-y-auto p-4 space-y-5 custom-scroll">
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
                                {items.map((item, i) => (
                                    <button
                                        key={`${category}-${i}`}
                                        onClick={() => setSelectedGradient(item)}
                                        className={cn(
                                            'relative w-full aspect-square rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer group active:scale-95',
                                            selectedGradient === item
                                                ? 'border-white/90 ring-4 ring-white/20 z-10 scale-95'
                                                : 'border-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-black/20'
                                        )}
                                        style={{ background: item, backgroundSize: 'cover' }}
                                        aria-label={`Select ${category} gradient ${i + 1}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-40" />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <Separator className="opacity-20" />

                {/* Text Color */}
                <section className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Text Color</span>
                    <label className="relative w-full h-14 rounded-xl border border-white/10 cursor-pointer overflow-hidden flex items-center px-3 gap-3">
                        <div
                            className="w-8 h-8 rounded-lg border border-white/20 shrink-0"
                            style={{ backgroundColor: textColor }}
                        />
                        <span className="text-sm font-mono text-white/60">{textColor}</span>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>
                </section>

                <Separator className="opacity-20" />

                {/* Font */}
                <section className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Font</span>
                    <Select value={selectedFont} onValueChange={(val) => { if (val) setSelectedFont(val) }}>
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl text-sm w-full">
                            <SelectValue>
                                {FONTS.find(f => f.value === selectedFont)?.label ?? 'Select font'}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {FONTS.map((f) => (
                                <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                    {f.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
            </div>

            {/* Pinned bottom — canvas size + randomize */}
            <div className="shrink-0 p-4 border-t border-white/5 bg-white/5 space-y-3">
                <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Canvas Size</span>
                    <div className="w-full grid grid-cols-3 gap-1.5">
                        {([
                            { key: 'square', label: '1:1', w: 'w-6', h: 'h-6' },
                            { key: 'landscape', label: '16:9', w: 'w-8', h: 'h-[18px]' },
                            { key: 'portrait', label: '9:16', w: 'w-[18px]', h: 'h-8' },
                        ] as const).map(({ key, label, w, h }) => (
                            <Button
                                key={key}
                                onClick={() => setRatio(key)}
                                variant="ghost"
                                className={cn(
                                    'flex flex-col items-center gap-1.5 h-auto py-3 rounded-lg cursor-pointer border transition-all',
                                    ratio === key
                                        ? 'border-primary bg-yellow-500/10 text-primary'
                                        : 'border-white/10 text-white/40 hover:text-white/60'
                                )}
                            >
                                <div className={cn(w, h, 'rounded-sm border-2', ratio === key ? 'border-primary' : 'border-current')} />
                                <span className="text-[10px] font-bold">{label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                <Button className="w-full cursor-pointer" variant="outline" onClick={onShuffle}>
                    <ShuffleIcon size={14} />
                    <span>Randomize Style</span>
                </Button>
            </div>
        </div>
    )
}
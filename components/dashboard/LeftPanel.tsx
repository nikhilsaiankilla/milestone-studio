'use client'

/**
 * LeftPanel.tsx
 * Templates, platform/handle, metrics, emoji scatter, download/copy buttons.
 */

import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { useState } from 'react'
import {
    ChevronDown, IdCard, Layout, Plus, Sparkles, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Metric, METRIC_ICONS, MetricIconKey, PLATFORMS, PlatformType, TEMPLATES } from '@/types/card'
import { QUALITY_LABELS, QualityPreset } from '@/lib/export-service'

interface LeftPanelProps {
    // Template
    active: string
    setActive: (id: string) => void

    // Platform
    platform: PlatformType | null
    setPlatform: (p: PlatformType) => void
    handle: string
    setHandle: (h: string) => void

    // Metrics
    metrics: Metric[]
    activeMetricIndex: number
    setActiveMetricIndex: (i: number) => void
    handleAddMetric: () => void
    handleRemoveMetric: (i: number) => void
    updateMetric: (i: number, data: Partial<Metric>) => void

    // Emoji
    selectedEmoji: string | null
    setSelectedEmoji: (e: string | null) => void
    emojiCount: number
    setEmojiCount: (n: number) => void

    // Export
    quality: QualityPreset
    setQuality: (q: QualityPreset) => void
    downloading: boolean
    copying: boolean
    downloadProgress: number
    copyProgress: number
    onDownload: () => void
    onCopy: () => void
}

const QUALITY_KEYS: QualityPreset[] = ['low', 'medium', 'high', '2k', '4k', '6k']

export default function LeftPanel({
    active, setActive,
    platform, setPlatform, handle, setHandle,
    metrics, activeMetricIndex, setActiveMetricIndex,
    handleAddMetric, handleRemoveMetric, updateMetric,
    selectedEmoji, setSelectedEmoji, emojiCount, setEmojiCount,
    quality, setQuality,
    downloading, copying, downloadProgress, copyProgress,
    onDownload, onCopy,
}: LeftPanelProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const activeMetric = metrics[activeMetricIndex]

    const inferIconFromLabel = (label: string): MetricIconKey => {
        const l = label.toLowerCase()
        if (l.includes('follower') || l.includes('user')) return 'users'
        if (l.includes('like')) return 'likes'
        if (l.includes('view')) return 'views'
        if (l.includes('comment')) return 'comments'
        if (l.includes('share')) return 'shares'
        if (l.includes('star')) return 'stars'
        return 'users'
    }

    return (
        <div className="bg-card w-[360px] border-r-2 border-white/10 flex flex-col h-full">
            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scroll">

                {/* Templates */}
                <section>
                    <div className="w-full flex items-center gap-2 mb-4">
                        <IdCard size={18} />
                        <h2 className="text-sm font-semibold text-secondary-foreground">Templates</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {TEMPLATES.map((tpl) => (
                            <div key={tpl.id} className="w-full flex flex-col gap-2 items-center cursor-pointer">
                                <button
                                    onClick={() => setActive(tpl.id)}
                                    className={cn(
                                        'relative rounded-xl w-full aspect-square flex items-center justify-center transition-all border cursor-pointer',
                                        active === tpl.id
                                            ? 'border-primary bg-[#2a2416] shadow-[0_0_0_2px_rgba(234,179,8,0.4)]'
                                            : 'border-white/10 bg-[#121212] hover:bg-[#121212]/70'
                                    )}
                                >
                                    <div className={cn('h-8 flex items-center', active === tpl.id ? 'text-primary' : 'text-white/10')}>
                                        {tpl.skeleton}
                                    </div>
                                </button>
                                <span className={cn('text-[10px] font-semibold', active === tpl.id ? 'text-primary' : 'text-white/60')}>
                                    {tpl.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <Separator className="opacity-50" />

                {/* Platform + Handle */}
                <section className="space-y-4">
                    <div className="w-full flex items-center gap-2">
                        <IdCard size={18} />
                        <h2 className="text-sm font-semibold text-secondary-foreground">Main Info</h2>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {PLATFORMS.map((p) => {
                            const isActive = platform?.value === p.value
                            return (
                                <button
                                    key={p.value}
                                    onClick={() => setPlatform(p)}
                                    className={`flex items-center gap-2 p-3 rounded-lg text-sm border transition-all cursor-pointer ${isActive
                                        ? 'bg-primary text-black border-primary'
                                        : 'border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span className={isActive ? 'text-black' : 'text-white/60'}>
                                        {p.icon}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium text-white/70">
                            {platform?.label} Handle
                        </Label>
                        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 focus-within:border-yellow-500/50">
                            <span className="text-white/60">{platform?.icon}</span>
                            <input
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                placeholder={platform?.placeholder}
                                className="w-full bg-transparent text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                </section>

                <Separator className="opacity-50" />

                {/* Metrics */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layout size={16} className="text-white/60" />
                            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Metrics</span>
                        </div>
                        <button
                            onClick={handleAddMetric}
                            className="px-3 py-2 border border-dashed border-white/20 rounded-lg text-xs text-white/40 hover:bg-white/5 flex items-center gap-2"
                        >
                            <Plus size={14} /> Add metric
                        </button>
                    </div>

                    {/* Metric tabs */}
                    {metrics.length > 1 && (
                        <div className="flex gap-1 flex-wrap">
                            {metrics.map((m, i) => (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveMetricIndex(i)}
                                    className={cn(
                                        'px-2 py-1 rounded text-[11px] font-medium border transition-all',
                                        activeMetricIndex === i
                                            ? 'border-primary text-primary bg-yellow-500/10'
                                            : 'border-white/10 text-white/40 hover:text-white/60'
                                    )}
                                >
                                    {m.label || `Metric ${i + 1}`}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden">
                        <Select
                            value={activeMetric.icon}
                            onValueChange={(value) => {
                                if (value) updateMetric(activeMetricIndex, { icon: value as MetricIconKey })
                            }}
                        >
                            <SelectTrigger className="w-14 h-full bg-transparent rounded-none border-0 border-r border-white/10 px-2 focus:ring-0 focus:ring-offset-0">
                                <SelectValue>
                                    {(() => {
                                        const Icon = METRIC_ICONS[activeMetric.icon as MetricIconKey]
                                        return <Icon size={16} />
                                    })()}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(METRIC_ICONS).map((key) => {
                                    const Icon = METRIC_ICONS[key as MetricIconKey]
                                    return (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <Icon size={14} />
                                                <span className="capitalize">{key}</span>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>

                        <input
                            type="text"
                            value={activeMetric.value}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value))
                                    updateMetric(activeMetricIndex, { value: e.target.value })
                            }}
                            className="w-16 bg-transparent border-r border-white/10 py-2 text-center text-sm focus:outline-none"
                        />

                        <input
                            value={activeMetric.label}
                            onChange={(e) => {
                                updateMetric(activeMetricIndex, {
                                    label: e.target.value,
                                    icon: inferIconFromLabel(e.target.value),
                                })
                            }}
                            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                            placeholder="Followers"
                        />

                        <button
                            onClick={() => handleRemoveMetric(activeMetricIndex)}
                            className="px-2 text-white/20 hover:text-white/60"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <Separator className="opacity-50" />

                {/* Emoji Scatter */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Emoji Scatter</span>
                        </div>
                        {selectedEmoji && (
                            <button onClick={() => setSelectedEmoji(null)} className="text-white/30 hover:text-white/60">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all',
                            showEmojiPicker
                                ? 'border-primary bg-yellow-500/5 text-white'
                                : 'border-white/10 bg-[#1a1a1a] text-white/50 hover:text-white/80'
                        )}
                    >
                        <span className="flex items-center gap-2">
                            {selectedEmoji
                                ? <><span className="text-xl">{selectedEmoji}</span><span className="text-white/60 text-xs">Selected</span></>
                                : <span>Choose an emoji</span>
                            }
                        </span>
                        <ChevronDown size={14} className={cn('transition-transform', showEmojiPicker && 'rotate-180')} />
                    </button>

                    {showEmojiPicker && (
                        <EmojiPicker
                            theme={Theme.DARK}
                            onEmojiClick={(data: EmojiClickData) => {
                                setSelectedEmoji(data.emoji)
                                setShowEmojiPicker(false)
                            }}
                            width="100%"
                            height={350}
                            previewConfig={{ showPreview: false }}
                            skinTonesDisabled
                        />
                    )}

                    {selectedEmoji && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] text-white/40 font-medium">Count</span>
                                <span className="text-[11px] text-white/60 font-bold">{emojiCount}</span>
                            </div>
                            <input
                                type="range" min={2} max={20} value={emojiCount}
                                onChange={(e) => setEmojiCount(Number(e.target.value))}
                                className="w-full accent-primary cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] text-white/20 font-medium">
                                <span>Minimal</span>
                                <span>Dense</span>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Pinned bottom — quality + download/copy */}
            <div className="shrink-0 p-4 border-t border-white/5 bg-white/5 space-y-3">
                {/* Quality selector */}
                <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Export Quality</span>
                    <div className="w-full grid grid-cols-6 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl mt-2">
                        {QUALITY_KEYS.map((q) => (
                            <button
                                key={q}
                                onClick={() => setQuality(q)}
                                className={cn(
                                    'flex items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
                                    quality === q ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                                )}
                            >
                                {QUALITY_LABELS[q]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Download */}
                <Button
                    onClick={onDownload}
                    disabled={downloading}
                    className="w-full bg-primary cursor-pointer py-5 font-bold rounded-xl flex items-center justify-center gap-2"
                >
                    <span>{downloading ? 'Downloading...' : 'Download image'}</span>
                    {downloading && downloadProgress > 0 && (
                        <span className="text-xs font-normal opacity-80">{downloadProgress}%</span>
                    )}
                </Button>

                {/* Copy */}
                <Button
                    onClick={onCopy}
                    disabled={copying}
                    variant="outline"
                    className="w-full py-5 cursor-pointer rounded-xl flex items-center justify-center gap-2"
                >
                    <span>{copying ? 'Copying...' : 'Copy'}</span>
                    {copying && copyProgress > 0 && (
                        <span className="text-xs font-normal opacity-60">{copyProgress}%</span>
                    )}
                </Button>
            </div>
        </div>
    )
}
'use client'

import { useState } from 'react'
import {
    Loader2,
    Search,
    ExternalLink,
    ChevronRight,
    AlertCircle,
    Palette
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type {
    TrustMRRStartup,
    TrustMRRCardTemplate,
    TrustMRRStyle
} from '@/types/trustmrr'

import {
    TRUSTMRR_CARD_CONFIGS,
    centsToUSD,
    formatPercent,
    formatNumber
} from '@/types/trustmrr'

import TrustMRRStylePanel from './TrustMRRStylePanel'

interface TrustMRRPanelProps {
    selectedTemplate: TrustMRRCardTemplate | null
    onSelectTemplate: (template: TrustMRRCardTemplate) => void
    trustMRRData: TrustMRRStartup | null
    onDataFetched: (data: TrustMRRStartup) => void
    style: TrustMRRStyle
    onStyleChange: (partial: Partial<TrustMRRStyle>) => void
}

export default function TrustMRRPanel({
    selectedTemplate,
    onSelectTemplate,
    trustMRRData,
    onDataFetched,
    style,
    onStyleChange,
}: TrustMRRPanelProps) {
    const [slug, setSlug] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showStyle, setShowStyle] = useState(false)

    const handleFetch = async () => {
        const trimmed = slug
            .trim()
            .toLowerCase()
            .replace(/^\/+|\/+$/g, '')

        if (!trimmed) return

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/trustmrr/${trimmed}`)

            if (!res.ok) {
                const json = await res.json().catch(() => ({}))
                setError(json.error ?? 'Failed to fetch startup data')
                return
            }

            const json = await res.json()

            onDataFetched(json.data)

            const firstAvailable = TRUSTMRR_CARD_CONFIGS.find((c) =>
                c.available(json.data)
            )

            if (firstAvailable) {
                onSelectTemplate(firstAvailable.id)
            }
        } catch {
            setError('Network error — please try again')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFetch()
        }
    }

    return (
        <div
            className="
                space-y-6
                rounded-2xl
                border border-white/[0.06]
                bg-gradient-to-b
                from-zinc-900/90
                to-black
                p-5
                shadow-2xl shadow-black/40
                backdrop-blur-xl
            "
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <img
                        src="https://trustmrr.com/favicon.ico"
                        alt="TrustMRR"
                        className="h-5 w-5 rounded-md"
                        onError={(e) => {
                            ; (e.target as HTMLImageElement).style.display = 'none'
                        }}
                    />

                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        TrustMRR
                    </span>
                </div>

                <a
                    href="https://trustmrr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        rounded-lg
                        p-2
                        text-zinc-500
                        transition-all
                        hover:bg-white/[0.04]
                        hover:text-zinc-200
                    "
                >
                    <ExternalLink size={14} />
                </a>
            </div>

            {/* Input */}
            <div className="space-y-3">
                <p className="text-xs leading-relaxed text-zinc-400">
                    Enter your startup slug from TrustMRR to generate verified
                    revenue cards.
                </p>

                <div className="flex gap-3">
                    <div
                        className="
                            flex flex-1 items-center gap-2
                            rounded-xl
                            border border-white/[0.08]
                            bg-white/[0.03]
                            px-4 py-3
                            transition-all
                            focus-within:border-primary/40
                            focus-within:ring-2
                            focus-within:ring-primary/10
                        "
                    >
                        <span className="shrink-0 text-xs text-zinc-500">
                            trustmrr.com/
                        </span>

                        <Input
                            value={slug}
                            onChange={(e) => {
                                setSlug(e.target.value)
                                setError(null)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="your-startup"
                            className="
                                h-auto
                                border-0
                                bg-transparent
                                p-0
                                text-sm
                                text-white
                                placeholder:text-zinc-600
                                focus-visible:ring-0
                                focus-visible:ring-offset-0
                            "
                        />
                    </div>

                    <Button
                        onClick={handleFetch}
                        disabled={loading || !slug.trim()}
                        size="sm"
                        className="
                            h-auto
                            rounded-xl
                            bg-primary
                            px-4
                            py-3
                            font-semibold
                            text-black
                            shadow-lg shadow-primary/20
                            transition-all duration-200
                            hover:brightness-110
                            active:scale-[0.98]
                            disabled:opacity-50
                        "
                    >
                        {loading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Search size={15} />
                        )}
                    </Button>
                </div>

                {error && (
                    <div
                        className="
                            flex items-center gap-2
                            rounded-xl
                            border border-red-500/20
                            bg-red-500/10
                            px-3 py-2.5
                            text-red-400
                        "
                    >
                        <AlertCircle size={13} className="shrink-0" />

                        <span className="text-xs">{error}</span>
                    </div>
                )}
            </div>

            {/* Loaded */}
            {trustMRRData && (
                <>
                    <Separator className="bg-white/[0.06]" />

                    {/* Startup Card */}
                    <div
                        className="
                            flex items-center gap-3
                            rounded-2xl
                            border border-white/[0.08]
                            bg-white/[0.03]
                            px-4 py-3
                        "
                    >
                        {trustMRRData.icon && (
                            <img
                                src={trustMRRData.icon}
                                alt={trustMRRData.name}
                                className="
                                    h-10 w-10
                                    rounded-xl
                                    object-contain
                                    ring-1 ring-white/10
                                "
                            />
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                                {trustMRRData.name}
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                                {trustMRRData.website}
                            </p>
                        </div>

                        {trustMRRData.rank && (
                            <Badge
                                variant="outline"
                                className="
                                    rounded-lg
                                    border-primary/20
                                    bg-primary/10
                                    px-2.5 py-1
                                    text-[10px]
                                    font-semibold
                                    text-primary
                                "
                            >
                                #{trustMRRData.rank}
                            </Badge>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatPill
                            label="MRR"
                            value={centsToUSD(trustMRRData.revenue.mrr)}
                        />

                        <StatPill
                            label="30d Revenue"
                            value={centsToUSD(
                                trustMRRData.revenue.last30Days
                            )}
                        />

                        <StatPill
                            label="Customers"
                            value={formatNumber(trustMRRData.customers)}
                        />

                        <StatPill
                            label="Growth"
                            value={formatPercent(
                                trustMRRData.growth30d
                            )}
                            highlight={
                                trustMRRData.growth30d !== null &&
                                trustMRRData.growth30d > 0
                            }
                        />
                    </div>

                    <Separator className="bg-white/[0.06]" />

                    {/* Templates */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                            Card Templates
                        </span>

                        <div className="space-y-2">
                            {TRUSTMRR_CARD_CONFIGS.map((config) => {
                                const isAvailable =
                                    config.available(trustMRRData)

                                const isActive =
                                    selectedTemplate === config.id

                                return (
                                    <button
                                        key={config.id}
                                        onClick={() =>
                                            isAvailable &&
                                            onSelectTemplate(config.id)
                                        }
                                        disabled={!isAvailable}
                                        className={cn(
                                            `
                                                w-full
                                                rounded-2xl
                                                border
                                                px-4 py-3
                                                text-left
                                                transition-all duration-200
                                            `,
                                            isActive
                                                ? `
                                                    border-primary/30
                                                    bg-primary/10
                                                    shadow-[0_0_20px_rgba(255,255,255,0.03)]
                                                    text-white
                                                `
                                                : isAvailable
                                                    ? `
                                                    border-white/[0.06]
                                                    bg-white/[0.03]
                                                    text-zinc-300
                                                    hover:scale-[1.01]
                                                    hover:border-white/[0.12]
                                                    hover:bg-white/[0.05]
                                                    hover:text-white
                                                    active:scale-[0.99]
                                                `
                                                    : `
                                                    border-white/[0.04]
                                                    bg-transparent
                                                    text-zinc-600
                                                    cursor-not-allowed
                                                `
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <p
                                                    className={cn(
                                                        'text-sm font-semibold',
                                                        isActive &&
                                                        'text-primary'
                                                    )}
                                                >
                                                    {config.label}
                                                </p>

                                                <p className="text-xs text-zinc-500">
                                                    {config.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!isAvailable && (
                                                    <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                                                        N/A
                                                    </span>
                                                )}

                                                {isActive && (
                                                    <ChevronRight
                                                        size={14}
                                                        className="text-primary"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="bg-white/[0.06]" />

                    {/* Style Toggle */}
                    <div className="space-y-3">
                        <button
                            onClick={() =>
                                setShowStyle((prev) => !prev)
                            }
                            className={cn(
                                `
                                    flex w-full items-center justify-between
                                    rounded-2xl
                                    border
                                    px-4 py-3
                                    transition-all duration-200
                                `,
                                showStyle
                                    ? `
                                        border-primary/30
                                        bg-primary/10
                                        text-primary
                                    `
                                    : `
                                        border-white/[0.06]
                                        bg-white/[0.03]
                                        text-zinc-300
                                        hover:border-white/[0.12]
                                        hover:bg-white/[0.05]
                                        hover:text-white
                                    `
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Palette size={14} />

                                <span className="text-sm font-semibold">
                                    Typography & Color
                                </span>
                            </div>

                            <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                {showStyle ? 'Hide' : 'Edit'}
                            </span>
                        </button>

                        {showStyle && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <TrustMRRStylePanel
                                    style={style}
                                    onChange={onStyleChange}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Empty State */}
            {!trustMRRData && !loading && (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <div
                        className="
                            flex h-12 w-12 items-center justify-center
                            rounded-2xl
                            border border-white/[0.06]
                            bg-white/[0.03]
                            backdrop-blur-sm
                        "
                    >
                        <Search
                            size={18}
                            className="text-zinc-500"
                        />
                    </div>

                    <p className="max-w-[220px] text-center text-xs leading-relaxed text-zinc-500">
                        Enter your TrustMRR slug to generate verified revenue
                        milestone cards
                    </p>
                </div>
            )}
        </div>
    )
}

function StatPill({
    label,
    value,
    highlight,
}: {
    label: string
    value: string
    highlight?: boolean
}) {
    return (
        <div
            className="
                rounded-2xl
                border border-white/[0.06]
                bg-gradient-to-b
                from-white/[0.06]
                to-white/[0.03]
                px-4 py-3
            "
        >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {label}
            </p>

            <p
                className={cn(
                    'text-base font-semibold',
                    highlight
                        ? 'text-green-400'
                        : 'text-white'
                )}
            >
                {value}
            </p>
        </div>
    )
}
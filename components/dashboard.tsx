'use client'

import { useExport } from "@/hooks/useExport"
import { Metric, PlatformType } from "@/types"
import { useEffect, useMemo, useRef, useState } from "react"
import LeftPanel from "./dashboard/LeftPanel"
import CardCanvas from "./dashboard/CardCanvas"
import RightPanel from "./dashboard/RightPanel"
import { useSupportPrompt } from "@/hooks/useSupportPrompt"
import { SupportDialog } from "./SupportDialog"
import DashboardNav from "./dashboard/DashboardNav"
import { DEFAULT_METRIC_STYLE } from '@/types'
import { PLATFORMS } from "@/constants/platforms"
import { GRADIENT_CATEGORIES } from "@/constants/gradients-bg"

import TrustMRRCardCanvas from '@/components/trustmrr/TrustMRRCardCanvas'
import { type TrustMRRStartup, type TrustMRRCardTemplate, type TrustMRRStyle, DEFAULT_TRUSTMRR_STYLE } from '@/types/trustmrr'

const Dashboard = () => {

    const [stars, setStars] = useState<number | null>(null)

    useEffect(() => {
        fetch('https://api.github.com/repos/nikhilsaiankilla/milestone-studio')
            .then(r => r.ok ? r.json() : null)
            .then(d => d && setStars(d.stargazers_count))
            .catch(() => { })
    }, [])

    const [active, setActive] = useState('metrics')
    const [platform, setPlatform] = useState<PlatformType | null>(PLATFORMS[0])
    const [handle, setHandle] = useState('')
    const [progressType, setProgressType] = useState<'bar' | 'circle'>('bar')

    const [metrics, setMetrics] = useState<Metric[]>([
        {
            id: crypto.randomUUID(),
            value: '0',
            label: 'Followers',
            icon: 'users',
            style: DEFAULT_METRIC_STYLE,
            showIcon: true,
        }
    ])

    const [activeMetricIndex, setActiveMetricIndex] = useState(0)

    const handleAddMetric = () => {
        setMetrics(prev => [...prev, {
            id: crypto.randomUUID(),
            value: '0',
            label: 'Metric',
            icon: 'users',
            style: DEFAULT_METRIC_STYLE,
            showIcon: true,
        }])
        setActiveMetricIndex(metrics.length)
    }

    const handleRemoveMetric = (index: number) => {
        if (metrics.length <= 1) return
        setMetrics(prev => {
            const updated = prev.filter((_, i) => i !== index)
            if (activeMetricIndex >= updated.length) setActiveMetricIndex(updated.length - 1)
            return updated
        })
    }

    const updateMetric = (index: number, data: Partial<Metric>) => {
        setMetrics(prev => prev.map((m, i) => i === index ? { ...m, ...data } : m))
    }

    const [borderRadius] = useState(5)
    const [noiseEnabled, setNoiseEnabled] = useState(true)
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center')
    const [ratio, setRatio] = useState<'square' | 'landscape' | 'portrait'>('landscape')
    const [selectedGradient, setSelectedGradient] = useState(Object.values(GRADIENT_CATEGORIES)[1][0])
    const [handleTextColor, setHandleTextColor] = useState<string>('#ffffff')

    // Emoji — char + image URL stored together
    const [selectedEmoji, setSelectedEmojiChar] = useState<string | null>(null)
    const [selectedEmojiUrl, setSelectedEmojiUrl] = useState<string | null>(null)
    const [emojiCount, setEmojiCount] = useState(6)

    const [trustMRRData, setTrustMRRData] = useState<TrustMRRStartup | null>(null)
    const [trustMRRTemplate, setTrustMRRTemplate] = useState<TrustMRRCardTemplate | null>(null)
    const [trustMRRStyle, setTrustMRRStyle] = useState<TrustMRRStyle>(DEFAULT_TRUSTMRR_STYLE)

    const updateTrustMRRStyle = (partial: Partial<TrustMRRStyle>) =>
        setTrustMRRStyle(prev => ({ ...prev, ...partial }))


    // Single setter passed to LeftPanel — keeps char + url in sync always
    const handleEmojiSelect = (emoji: string | null, url: string | null) => {
        setSelectedEmojiChar(emoji)
        setSelectedEmojiUrl(url)
    }

    const emojiPositions = useMemo(() => {
        if (!selectedEmoji) return []

        const slots = [
            // Hero — far left middle, large, sharp, slight upward-left tilt
            { x: 6, y: 38, rotation: -20, depth: 1.0 },

            // Top right — large, sharp, tilted right-upward
            { x: 74, y: 5, rotation: 18, depth: 0.88 },

            // Bottom right — mid size, slight tilt
            { x: 80, y: 72, rotation: -8, depth: 0.60 },

            // Center — small, behind the milestone numbers, faded
            { x: 52, y: 28, rotation: 22, depth: 0.28 },

            // Bottom center-right — small, below 2050
            { x: 60, y: 68, rotation: 12, depth: 0.32 },

            // Bottom left — small, below hero
            { x: 14, y: 75, rotation: -18, depth: 0.38 },

            // Top center — tiny, above 1900
            { x: 38, y: 6, rotation: 14, depth: 0.18 },

            // Right edge mid — small
            { x: 88, y: 42, rotation: -6, depth: 0.25 },
        ]

        return slots.slice(0, emojiCount).map((s, i) => {
            // size: front=52px, back=10px
            const size = 10 + s.depth * 42

            // opacity: front=0.95, back=0.15
            const opacity = 0.15 + s.depth * 0.80

            // blur: front=0.4px, back=2.5px (inverted depth)
            const blur = 0.4 + (1 - s.depth) * 2.1

            return { id: i, x: s.x, y: s.y, rotation: s.rotation, size, opacity, blur }
        })
    }, [selectedEmoji, emojiCount])

    // Undo/Redo
    const historyRef = useRef<Array<{
        gradient: string
        alignment: 'left' | 'center' | 'right'
        ratio: 'square' | 'landscape' | 'portrait'
        noise: boolean
        emoji: string | null
        emojiUrl: string | null
        emojiCount: number
        handleTextColor: string
        progressType: 'bar' | 'circle'
    }>>([])
    const currentIndexRef = useRef(-1)
    const isTravelingRef = useRef(false)

    useEffect(() => {
        if (isTravelingRef.current) return
        const snapshot = {
            gradient: selectedGradient,
            alignment,
            ratio,
            noise: noiseEnabled,
            emoji: selectedEmoji,
            emojiUrl: selectedEmojiUrl,
            emojiCount,
            handleTextColor,
            progressType,
        }
        historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1)
        historyRef.current.push(snapshot)
        currentIndexRef.current = historyRef.current.length - 1
    }, [selectedGradient, progressType, handleTextColor, alignment, ratio, noiseEnabled, selectedEmoji, selectedEmojiUrl, emojiCount])

    useEffect(() => {
        const restore = (index: number) => {
            const s = historyRef.current[index]
            if (!s) return
            isTravelingRef.current = true
            setSelectedGradient(s.gradient)
            setProgressType(s.progressType)
            setAlignment(s.alignment)
            setRatio(s.ratio)
            setHandleTextColor(s.handleTextColor)
            setNoiseEnabled(s.noise)
            setSelectedEmojiChar(s.emoji)
            setSelectedEmojiUrl(s.emojiUrl)
            setEmojiCount(s.emojiCount)
            setTimeout(() => { isTravelingRef.current = false }, 100)
        }

        const onKey = (e: KeyboardEvent) => {
            const mod = e.ctrlKey || e.metaKey
            if (mod && e.key === 'z' && !e.shiftKey) {
                e.preventDefault(); e.stopPropagation()
                if (currentIndexRef.current > 0) { currentIndexRef.current--; restore(currentIndexRef.current) }
            }
            if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault(); e.stopPropagation()
                if (currentIndexRef.current < historyRef.current.length - 1) { currentIndexRef.current++; restore(currentIndexRef.current) }
            }
            if (mod && e.key === 'r') { e.preventDefault(); e.stopPropagation() }
        }

        window.addEventListener('keydown', onKey, { capture: true })
        return () => window.removeEventListener('keydown', onKey, { capture: true })
    }, [])

    const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    const shuffleStyle = () => {
        setSelectedGradient(getRandom(Object.values(GRADIENT_CATEGORIES).flat()))
        setAlignment(getRandom(['left', 'center', 'right'] as const))
        setRatio(getRandom(['square', 'landscape', 'portrait'] as const))
        // Shuffle clears emoji since we don't have a URL to shuffle to
        setSelectedEmojiChar(null)
        setSelectedEmojiUrl(null)
        setEmojiCount(Math.floor(Math.random() * 8) + 3)
        setNoiseEnabled(Math.random() > 0.3)
        setHandleTextColor('#ffffff')
        setProgressType(getRandom(['bar', 'circle'] as const))
    }

    const cardRef = useRef<HTMLDivElement>(null)
    const {
        quality, setQuality,
        downloading, copying,
        downloadProgress, copyProgress,
        handleDownload, handleCopy,
    } = useExport()

    const { open, triggerCheck, dismissTemporarily, dismissPermanently } = useSupportPrompt()

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col">
            <DashboardNav stars={stars} />

            <div className="w-full flex justify-between overflow-hidden flex-1">
                <LeftPanel
                    active={active} setActive={setActive}
                    progressType={progressType} setProgressType={setProgressType}
                    platform={platform} setPlatform={setPlatform}
                    handle={handle} setHandle={setHandle}
                    metrics={metrics}
                    handleTextColor={handleTextColor}
                    onChangeHandleTextColor={setHandleTextColor}
                    activeMetricIndex={activeMetricIndex}
                    setActiveMetricIndex={setActiveMetricIndex}
                    handleAddMetric={handleAddMetric}
                    handleRemoveMetric={handleRemoveMetric}
                    updateMetric={updateMetric}
                    selectedEmoji={selectedEmoji}
                    selectedEmojiUrl={selectedEmojiUrl}
                    setSelectedEmoji={handleEmojiSelect}
                    emojiCount={emojiCount} setEmojiCount={setEmojiCount}
                    quality={quality} setQuality={setQuality}
                    downloading={downloading} copying={copying}
                    downloadProgress={downloadProgress} copyProgress={copyProgress}
                    style={trustMRRStyle}
                    onStyleChange={updateTrustMRRStyle}
                    onDownload={async () => {
                        await handleDownload(cardRef.current)
                        triggerCheck()
                    }}
                    onCopy={() => handleCopy(cardRef.current)}

                    trustMRRData={trustMRRData}
                    onTrustMRRDataFetched={setTrustMRRData}
                    trustMRRTemplate={trustMRRTemplate}
                    onTrustMRRTemplateSelect={setTrustMRRTemplate}
                />

                <div
                    className="flex-1 min-w-0 overflow-y-auto p-10"
                    style={{
                        backgroundColor: '#000000',
                        backgroundImage: 'radial-gradient(rgba(229, 231, 235, 0.15) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                >
                    <div className="w-full max-w-2xl! flex flex-col gap-2 mx-auto">
                        {active === 'trustmrr' && trustMRRData && trustMRRTemplate ? (
                            <TrustMRRCardCanvas
                                ref={cardRef}
                                data={trustMRRData}
                                template={trustMRRTemplate}
                                selectedGradient={selectedGradient}
                                alignment={alignment}
                                ratio={ratio}
                                noiseEnabled={noiseEnabled}
                                style={trustMRRStyle}
                                borderRadius={borderRadius}
                            />
                        ) : (
                            <CardCanvas
                                ref={cardRef}
                                active={active}
                                progressType={progressType}
                                metrics={metrics}
                                selectedGradient={selectedGradient}
                                alignment={alignment}
                                ratio={ratio}
                                noiseEnabled={noiseEnabled}
                                selectedEmoji={selectedEmoji}
                                selectedEmojiUrl={selectedEmojiUrl}
                                emojiPositions={emojiPositions}
                                handle={handle}
                                handleTextColor={handleTextColor}
                                platform={platform}
                                borderRadius={borderRadius}
                            />
                        )}
                    </div>
                </div>

                <RightPanel
                    selectedGradient={selectedGradient} setSelectedGradient={setSelectedGradient}
                    alignment={alignment} setAlignment={setAlignment}
                    noiseEnabled={noiseEnabled} setNoiseEnabled={setNoiseEnabled}
                    ratio={ratio} setRatio={setRatio}
                    onShuffle={shuffleStyle}
                />

                <SupportDialog
                    open={open}
                    stars={stars}
                    onLater={dismissTemporarily}
                    onClose={dismissPermanently}
                />
            </div>
        </div>
    )
}

export default Dashboard
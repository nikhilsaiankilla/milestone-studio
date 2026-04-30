'use client'

import { useExport } from "@/hooks/useExport"
import { GRADIENT_CATEGORIES, Metric, PLATFORMS, PlatformType } from "@/types/card"
import { useEffect, useMemo, useRef, useState } from "react"
import LeftPanel from "./dashboard/LeftPanel"
import CardCanvas from "./dashboard/CardCanvas"
import RightPanel from "./dashboard/RightPanel"
import { useSupportPrompt } from "@/hooks/useSupportPrompt"
import { SupportDialog } from "./SupportDialog"
import DashboardNav from "./dashboard/DashboardNav"
import { DEFAULT_METRIC_STYLE } from '@/types/card'

/**
 * Dashboard.tsx
 * Thin orchestrator: owns all state, wires up LeftPanel, CardCanvas, RightPanel.
 * No rendering logic lives here — it all delegates to child components.
 */

const Dashboard = () => {

    const [stars, setStars] = useState<number | null>(null)

    useEffect(() => {
        fetch('https://api.github.com/repos/nikhilsaiankilla/milestone-studio')
            .then(r => r.ok ? r.json() : null)
            .then(d => d && setStars(d.stargazers_count))
            .catch(() => { })
    }, [])

    // Template
    const [active, setActive] = useState('metrics')

    // Platform / Handle 
    const [platform, setPlatform] = useState<PlatformType | null>(PLATFORMS[0])
    const [handle, setHandle] = useState('')

    // Inside Dashboard component
    const [progressType, setProgressType] = useState<'bar' | 'circle'>('bar');

    // Metrics
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
    const [handleTextColor, setHandleTextColor] = useState<string>('#ffffff');

    // Emoji
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
    const [emojiCount, setEmojiCount] = useState(6)

    const emojiPositions = useMemo(() => {
        if (!selectedEmoji) return []
        const slots = [
            { x: 5, y: 30, size: 52, opacity: 0.95, rotation: -15 },
            { x: 72, y: 4, size: 38, opacity: 0.90, rotation: 20 },
            { x: 78, y: 68, size: 30, opacity: 0.85, rotation: -10 },
            { x: 55, y: 15, size: 14, opacity: 0.35, rotation: 25 },
            { x: 62, y: 55, size: 12, opacity: 0.30, rotation: 10 },
            { x: 20, y: 72, size: 16, opacity: 0.30, rotation: -20 },
            { x: 40, y: 8, size: 11, opacity: 0.25, rotation: 15 },
            { x: 85, y: 40, size: 13, opacity: 0.28, rotation: -5 },
        ]
        return slots.slice(0, emojiCount).map((s, i) => ({ id: i, ...s }))
    }, [selectedEmoji, emojiCount])

    // Undo/Redo history
    const historyRef = useRef<Array<{
        gradient: string;
        alignment: 'left' | 'center' | 'right'
        ratio: 'square' | 'landscape' | 'portrait'
        noise: boolean; emoji: string | null; emojiCount: number
        handleTextColor: string;
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
            emojiCount,
            handleTextColor,
            progressType
        }
        historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1)
        historyRef.current.push(snapshot)
        currentIndexRef.current = historyRef.current.length - 1
    }, [selectedGradient, progressType, handleTextColor, alignment, ratio, noiseEnabled, selectedEmoji, emojiCount])

    useEffect(() => {
        const restore = (index: number) => {
            const s = historyRef.current[index]
            if (!s) return
            isTravelingRef.current = true
            setSelectedGradient(s.gradient);
            setProgressType(s.progressType)
            setAlignment(s.alignment);
            setRatio(s.ratio);
            setHandleTextColor(s.handleTextColor)
            setNoiseEnabled(s.noise)
            setSelectedEmoji(s.emoji);
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

    // Shuffle
    const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    const shuffleStyle = () => {
        setSelectedGradient(getRandom(Object.values(GRADIENT_CATEGORIES).flat()))
        setAlignment(getRandom(['left', 'center', 'right'] as const))
        setRatio(getRandom(['square', 'landscape', 'portrait'] as const))
        setSelectedEmoji(Math.random() > 0.5 ? selectedEmoji || '🔥' : null)
        setEmojiCount(Math.floor(Math.random() * 8) + 3)
        setNoiseEnabled(Math.random() > 0.3)
        setHandleTextColor('#ffffff')
        setProgressType(getRandom(['bar', 'circle'] as const))
    }

    // Export
    const cardRef = useRef<HTMLDivElement>(null)
    const {
        quality, setQuality,
        downloading, copying,
        downloadProgress, copyProgress,
        handleDownload, handleCopy,
    } = useExport()

    const {
        open,
        triggerCheck,
        dismissTemporarily,
        dismissPermanently,
    } = useSupportPrompt()

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col">
            <DashboardNav stars={stars} />

            {/* Body */}
            <div className="w-full flex justify-between overflow-hidden flex-1">
                <LeftPanel
                    active={active} setActive={setActive}
                    progressType={progressType}
                    setProgressType={setProgressType}
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
                    selectedEmoji={selectedEmoji} setSelectedEmoji={setSelectedEmoji}
                    emojiCount={emojiCount} setEmojiCount={setEmojiCount}
                    quality={quality} setQuality={setQuality}
                    downloading={downloading} copying={copying}
                    downloadProgress={downloadProgress} copyProgress={copyProgress}
                    onDownload={async () => {
                        await handleDownload(cardRef.current)
                        triggerCheck()
                    }}
                    onCopy={() => handleCopy(cardRef.current)}
                />

                {/* Center canvas */}
                <div
                    className="flex-1 min-w-0 overflow-y-auto p-10"
                    style={{
                        backgroundColor: '#000000',
                        backgroundImage: 'radial-gradient(rgba(229, 231, 235, 0.15) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                >
                    <div className="w-full max-w-2xl! flex flex-col gap-2 mx-auto">
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
                            emojiPositions={emojiPositions}
                            handle={handle}
                            handleTextColor={handleTextColor}
                            platform={platform}
                            borderRadius={borderRadius}
                        />
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
'use client'

import { useExport } from "@/hooks/useExport"
import { FONTS, GRADIENT_CATEGORIES, Metric, PLATFORMS, PlatformType } from "@/types/card"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Kbd, KbdGroup } from "./ui/kbd"
import { Button } from "./ui/button"
import LeftPanel from "./dashboard/LeftPanel"
import CardCanvas from "./dashboard/CardCanvas"
import RightPanel from "./dashboard/RightPanel"
import { useSupportPrompt } from "@/hooks/useSupportPrompt"
import { SupportDialog } from "./SupportDialog"

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

    // Metrics
    const [metrics, setMetrics] = useState<Metric[]>([
        { id: crypto.randomUUID(), value: '0', label: 'Followers', icon: 'users' }
    ])
    const [activeMetricIndex, setActiveMetricIndex] = useState(0)

    const handleAddMetric = () => {
        setMetrics(prev => [...prev, { id: crypto.randomUUID(), value: '0', label: 'Metric', icon: 'users' }])
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

    // Visual state
    const [textColor, setTextColor] = useState('#0f172a')
    const [borderRadius] = useState(5)
    const [noiseEnabled, setNoiseEnabled] = useState(true)
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center')
    const [ratio, setRatio] = useState<'square' | 'landscape' | 'portrait'>('landscape')
    const [selectedFont, setSelectedFont] = useState(FONTS[0].value)
    const [selectedGradient, setSelectedGradient] = useState(Object.values(GRADIENT_CATEGORIES)[0][0])

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
        gradient: string; textColor: string; font: string
        alignment: 'left' | 'center' | 'right'
        ratio: 'square' | 'landscape' | 'portrait'
        noise: boolean; emoji: string | null; emojiCount: number
    }>>([])
    const currentIndexRef = useRef(-1)
    const isTravelingRef = useRef(false)

    useEffect(() => {
        if (isTravelingRef.current) return
        const snapshot = { gradient: selectedGradient, textColor, font: selectedFont, alignment, ratio, noise: noiseEnabled, emoji: selectedEmoji, emojiCount }
        historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1)
        historyRef.current.push(snapshot)
        currentIndexRef.current = historyRef.current.length - 1
    }, [selectedGradient, textColor, selectedFont, alignment, ratio, noiseEnabled, selectedEmoji, emojiCount])

    useEffect(() => {
        const restore = (index: number) => {
            const s = historyRef.current[index]
            if (!s) return
            isTravelingRef.current = true
            setSelectedGradient(s.gradient); setTextColor(s.textColor); setSelectedFont(s.font)
            setAlignment(s.alignment); setRatio(s.ratio); setNoiseEnabled(s.noise)
            setSelectedEmoji(s.emoji); setEmojiCount(s.emojiCount)
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
        setSelectedFont(getRandom(FONTS).value)
        setAlignment(getRandom(['left', 'center', 'right'] as const))
        setRatio(getRandom(['square', 'landscape', 'portrait'] as const))
        setTextColor(Math.random() > 0.5 ? '#ffffff' : '#0f172a')
        setSelectedEmoji(Math.random() > 0.5 ? selectedEmoji || '🔥' : null)
        setEmojiCount(Math.floor(Math.random() * 8) + 3)
        setNoiseEnabled(Math.random() > 0.3)
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

            {/* Nav */}
            <nav className="bg-card w-full border-b-2 border-white/10 flex items-center justify-between px-5 py-4 shrink-0">
                <Link href="/" className="flex items-center gap-2 group transition-all">
                    <div className="relative overflow-hidden rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Image src="/logo.png" alt="Milestone Studio Logo" width={32} height={32} className="object-contain" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-none">
                        Milestore Studio
                    </h1>
                </Link>

                <div className="flex items-center justify-center gap-3">
                    <p className="text-xs text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl + Z</Kbd><span>Undo</span>
                            <span className="mx-1">•</span>
                            <Kbd>Ctrl + Y</Kbd><span>Redo</span>
                        </KbdGroup>
                    </p>

                    <Link href="https://github.com/nikhilsaiankilla/milestone-studio" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            <span>GitHub</span>
                            {stars !== null && (
                                <span className="ml-1 flex items-center gap-1 border-l pl-2 border-border text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                                        <path d="M12 1.7L14.6 9h7.7l-6.2 4.5 2.4 7.3L12 16.3l-6.5 4.5 2.4-7.3L1.7 9h7.7L12 1.7z" />
                                    </svg>
                                    {stars}
                                </span>
                            )}
                        </Button>
                    </Link>

                    <Link href="https://twitter.com/itzznikhilsai" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                            Twitter
                        </Button>
                    </Link>

                    <Link href="https://www.buymeacoffee.com/nikhilsaiankilla" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                            <Image src="/buymeacoffee.png" alt="Buy Me a Coffee" width={18} height={18} />
                            <span>Buy me a coffee</span>
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Body */}
            <div className="w-full flex justify-between overflow-hidden flex-1">

                <LeftPanel
                    active={active} setActive={setActive}
                    platform={platform} setPlatform={setPlatform}
                    handle={handle} setHandle={setHandle}
                    metrics={metrics}
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
                            metrics={metrics}
                            selectedGradient={selectedGradient}
                            textColor={textColor}
                            selectedFont={selectedFont}
                            alignment={alignment}
                            ratio={ratio}
                            noiseEnabled={noiseEnabled}
                            selectedEmoji={selectedEmoji}
                            emojiPositions={emojiPositions}
                            handle={handle}
                            platform={platform}
                            borderRadius={borderRadius}
                        />
                    </div>
                </div>

                <RightPanel
                    selectedGradient={selectedGradient} setSelectedGradient={setSelectedGradient}
                    textColor={textColor} setTextColor={setTextColor}
                    selectedFont={selectedFont} setSelectedFont={setSelectedFont}
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
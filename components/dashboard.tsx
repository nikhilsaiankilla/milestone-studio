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

// ─── Mobile Drawer Wrapper ────────────────────────────────────────────────────

interface DrawerProps {
    open: boolean
    onClose: () => void
    side: 'left' | 'right'
    children: React.ReactNode
}

const Drawer = ({ open, onClose, side, children }: DrawerProps) => {
    // Trap scroll on body while drawer is open
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const translateClass = side === 'left'
        ? open ? 'translate-x-0' : '-translate-x-full'
        : open ? 'translate-x-0' : 'translate-x-full'

    return (
        <>
            {/* Backdrop */}
            <div
                className={`
                    fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
                    transition-opacity duration-300
                    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`
                    fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} z-50
                    h-full w-[300px] max-w-[85vw]
                    transform transition-transform duration-300 ease-in-out
                    ${translateClass}
                    shadow-2xl
                `}
            >
                {/* Close handle */}
                {
                    open && <button
                        onClick={onClose}
                        className={`
                        absolute top-3 ${side === 'left' ? 'right-[-40px]' : 'left-[-40px]'}
                        z-10 w-9 h-9 flex items-center justify-center
                        bg-zinc-900 border border-zinc-700 rounded-full
                        text-zinc-400 hover:text-white hover:border-zinc-500
                        transition-colors duration-150 shadow-lg
                        md:hidden
                    `}
                        aria-label="Close panel"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                }

                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </>
    )
}

// ─── Mobile FAB Trigger Buttons ───────────────────────────────────────────────

interface PanelFABProps {
    side: 'left' | 'right'
    onClick: () => void
    label: string
}

const PanelFAB = ({ side, onClick, label }: PanelFABProps) => (
    <button
        onClick={onClick}
        aria-label={label}
        className={`
            fixed bottom-5 z-30
            ${side === 'left' ? 'left-4' : 'right-4'}
            flex items-center gap-2
            bg-zinc-900 border border-zinc-700
            text-zinc-300 text-xs font-medium
            px-3 py-2.5 rounded-full
            shadow-lg shadow-black/50
            hover:border-zinc-500 hover:text-white
            active:scale-95
            transition-all duration-150
            lg:hidden
        `}
    >
        {side === 'left' ? (
            <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="2" width="4" height="10" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x="7" y="2" width="6" height="2" rx="0.5" fill="currentColor" />
                    <rect x="7" y="6" width="6" height="2" rx="0.5" fill="currentColor" />
                    <rect x="7" y="10" width="4" height="2" rx="0.5" fill="currentColor" />
                </svg>
                {label}
            </>
        ) : (
            <>
                {label}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="9" y="2" width="4" height="10" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x="1" y="2" width="6" height="2" rx="0.5" fill="currentColor" />
                    <rect x="1" y="6" width="6" height="2" rx="0.5" fill="currentColor" />
                    <rect x="1" y="10" width="4" height="2" rx="0.5" fill="currentColor" />
                </svg>
            </>
        )}
    </button>
)

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {

    const [stars, setStars] = useState<number | null>(null)

    useEffect(() => {
        fetch('https://api.github.com/repos/nikhilsaiankilla/milestone-studio')
            .then(r => r.ok ? r.json() : null)
            .then(d => d && setStars(d.stargazers_count))
            .catch(() => { })
    }, [])

    // ── Mobile drawer state ──
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

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

    const [selectedEmoji, setSelectedEmojiChar] = useState<string | null>(null)
    const [selectedEmojiUrl, setSelectedEmojiUrl] = useState<string | null>(null)
    const [emojiCount, setEmojiCount] = useState(6)

    const [trustMRRData, setTrustMRRData] = useState<TrustMRRStartup | null>(null)
    const [trustMRRTemplate, setTrustMRRTemplate] = useState<TrustMRRCardTemplate | null>(null)
    const [trustMRRStyle, setTrustMRRStyle] = useState<TrustMRRStyle>(DEFAULT_TRUSTMRR_STYLE)

    const updateTrustMRRStyle = (partial: Partial<TrustMRRStyle>) =>
        setTrustMRRStyle(prev => ({ ...prev, ...partial }))

    const handleEmojiSelect = (emoji: string | null, url: string | null) => {
        setSelectedEmojiChar(emoji)
        setSelectedEmojiUrl(url)
    }

    const emojiPositions = useMemo(() => {
        if (!selectedEmoji) return []

        const slots = [
            { x: 6, y: 38, rotation: -20, depth: 1.0 },
            { x: 74, y: 5, rotation: 18, depth: 0.88 },
            { x: 80, y: 72, rotation: -8, depth: 0.60 },
            { x: 52, y: 28, rotation: 22, depth: 0.28 },
            { x: 60, y: 68, rotation: 12, depth: 0.32 },
            { x: 14, y: 75, rotation: -18, depth: 0.38 },
            { x: 38, y: 6, rotation: 14, depth: 0.18 },
            { x: 88, y: 42, rotation: -6, depth: 0.25 },
        ]

        return slots.slice(0, emojiCount).map((s, i) => {
            const size = 10 + s.depth * 42
            const opacity = 0.15 + s.depth * 0.80
            const blur = 0.4 + (1 - s.depth) * 2.1
            return { id: i, x: s.x, y: s.y, rotation: s.rotation, size, opacity, blur }
        })
    }, [selectedEmoji, emojiCount])

    // ── Undo / Redo ──
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

    // ── Shared panel content (avoids duplication) ──
    const leftPanelContent = (
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
    )

    const rightPanelContent = (
        <RightPanel
            selectedGradient={selectedGradient} setSelectedGradient={setSelectedGradient}
            alignment={alignment} setAlignment={setAlignment}
            noiseEnabled={noiseEnabled} setNoiseEnabled={setNoiseEnabled}
            ratio={ratio} setRatio={setRatio}
            onShuffle={shuffleStyle}
        />
    )

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col">
            <DashboardNav stars={stars} />

            <div className="w-full flex overflow-hidden flex-1 relative">

                {/* Left Panel desktop always visible, mobile hidden */}
                <div className="hidden lg:block flex-shrink-0 h-full overflow-y-auto">
                    {leftPanelContent}
                </div>

                {/* Canvas */}
                <div
                    className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-10"
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

                {/* ── Right Panel — desktop always visible, mobile hidden ── */}
                <div className="hidden lg:block flex-shrink-0 h-full overflow-y-auto">
                    {rightPanelContent}
                </div>

            </div>

            {/* Mobile: FAB triggers ── */}
            <PanelFAB side="left" onClick={() => setLeftDrawerOpen(true)} label="Edit" />
            <PanelFAB side="right" onClick={() => setRightDrawerOpen(true)} label="Style" />

            {/* Mobile: Left Drawer */}
            <Drawer side="left" open={leftDrawerOpen} onClose={() => setLeftDrawerOpen(false)}>
                {leftPanelContent}
            </Drawer>

            {/* Mobile: Right Drawer */}
            <Drawer side="right" open={rightDrawerOpen} onClose={() => setRightDrawerOpen(false)}>
                {rightPanelContent}
            </Drawer>

            <SupportDialog
                open={open}
                stars={stars}
                onLater={dismissTemporarily}
                onClose={dismissPermanently}
            />
        </div>
    )
}

export default Dashboard
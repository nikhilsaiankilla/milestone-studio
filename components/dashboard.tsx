'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { useEffect, useMemo, useState } from "react"
import { AlignCenter, AlignLeft, AlignRight, ChevronDown, GripVertical, IdCard, Layout, Plus, Shuffle, ShuffleIcon, Sparkle, Sparkles, TrendingUp, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FONTS, GRADIENT_CATEGORIES, PLATFORMS, PlatformType, TEMPLATES } from "@/types/card"
import { Separator } from "./ui/separator"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

import { toPng } from "html-to-image"
import { useRef } from "react"
import { toast } from "sonner"
import { Kbd, KbdGroup } from "./ui/kbd"

import {
    Heart,
    Eye,
    MessageCircle,
    Share2,
    Star
} from "lucide-react"

const METRIC_ICONS = {
    users: Users,
    growth: TrendingUp,
    likes: Heart,
    views: Eye,
    comments: MessageCircle,
    shares: Share2,
    stars: Star
} as const

type MetricIconKey = keyof typeof METRIC_ICONS

const Dashboard = () => {
    const [stars, setStars] = useState<number | null>(null)
    const [active, setActive] = useState("metrics")

    const [copying, setCopying] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const [metrics, setMetrics] = useState([
        {
            id: crypto.randomUUID(),
            value: "0",
            label: "Followers",
            icon: "users"
        }
    ])

    const [activeMetricIndex, setActiveMetricIndex] = useState(0)

    const handleAddMetric = () => {
        setMetrics((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                value: "0",
                label: "Metric",
                icon: 'users',
            }
        ])
        setActiveMetricIndex(metrics.length) // switch to new one
    }

    const handleRemoveMetric = (index: number) => {
        if (metrics.length <= 1) return;
        setMetrics((prev) => {
            const updated = prev.filter((_, i) => i !== index)

            // fix active index
            if (activeMetricIndex >= updated.length) {
                setActiveMetricIndex(updated.length - 1)
            }

            return updated
        })
    }

    const updateMetric = (
        index: number,
        data: Partial<{ value: string; label: string; icon: MetricIconKey }>
    ) => {
        setMetrics((prev) =>
            prev.map((m, i) =>
                i === index ? { ...m, ...data } : m
            )
        )
    }

    const activeMetric = metrics[activeMetricIndex]

    // state
    const [textColor, setTextColor] = useState("#0f172a")

    const [borderRadius] = useState(24)

    const [noiseEnabled, setNoiseEnabled] = useState(true)
    const [alignment, setAlignment] = useState<"left" | "center" | "right">("center")

    const [ratio, setRatio] = useState<"square" | "landscape" | "portrait">(
        "landscape"
    )

    const [selectedFont, setSelectedFont] = useState(FONTS[0].value)

    const [selectedGradient, setSelectedGradient] = useState(
        Object.values(GRADIENT_CATEGORIES)[0][0]
    );

    const [handle, setHandle] = useState('');
    const [platform, setPlatform] = useState<PlatformType | null>(PLATFORMS[0])

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
    const [emojiCount, setEmojiCount] = useState(6)

    const ratioClass = useMemo(() => {
        switch (ratio) {
            case "landscape":
                return "aspect-[16/9]"
            case "portrait":
                return "aspect-[9/16]"
            default:
                return "aspect-square"
        }
    }, [ratio])

    const alignmentClass = useMemo(() => {
        switch (alignment) {
            case "left":
                return "items-center justify-start text-left"
            case "right":
                return "items-center justify-end text-right"
            default:
                return "items-center justify-center text-center"
        }
    }, [alignment])

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await fetch('https://api.github.com/repos/nikhilsaiankilla/milestone-studio')
                if (response.ok) {
                    const data = await response.json()
                    setStars(data.stargazers_count)
                }
            } catch (error) {
                console.error("Failed to fetch stars:", error)
            }
        }
        fetchStars()
    }, [])

    const cardRef = useRef<HTMLDivElement>(null)


    const captureCard = async () => {
        if (!cardRef.current) return null
        return await toPng(cardRef.current, {
            cacheBust: true,
            pixelRatio: 3,
        })
    }

    const handleDownload = async () => {
        try {
            setDownloading(true)
            const dataUrl = await captureCard()
            if (!dataUrl) return
            const link = document.createElement("a")
            link.download = "milestone-card.png"
            link.href = dataUrl
            link.click()
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong please try again')
        } finally {
            setDownloading(false)
        }
    }

    const handleCopy = async () => {
        try {
            setCopying(true)
            const dataUrl = await captureCard()
            if (!dataUrl) return
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ])
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong please try again')
        } finally {
            setCopying(false)
        }
    }

    const emojiPositions = useMemo(() => {
        if (!selectedEmoji) return []

        // Fixed natural positions mimicking the reference — edges & corners
        const slots = [
            { x: 5, y: 30, size: 52, opacity: 0.95, rotation: -15 },  // left middle - large
            { x: 72, y: 4, size: 38, opacity: 0.90, rotation: 20 },  // top right - large
            { x: 78, y: 68, size: 30, opacity: 0.85, rotation: -10 },  // bottom right - medium
            { x: 55, y: 15, size: 14, opacity: 0.35, rotation: 25 },  // top center - tiny faded
            { x: 62, y: 55, size: 12, opacity: 0.30, rotation: 10 },  // center right - tiny faded
            { x: 20, y: 72, size: 16, opacity: 0.30, rotation: -20 },  // bottom left - tiny faded
            { x: 40, y: 8, size: 11, opacity: 0.25, rotation: 15 },  // top center left - tiny
            { x: 85, y: 40, size: 13, opacity: 0.28, rotation: -5 },  // right middle - tiny
        ]

        return slots.slice(0, emojiCount).map((s, i) => ({ id: i, ...s }))
    }, [selectedEmoji, emojiCount])

    useEffect(() => {
        const history: Array<{
            gradient: string
            textColor: string
            font: string
            alignment: "left" | "center" | "right"
            ratio: "square" | "landscape" | "portrait"
            noise: boolean
            emoji: string | null
            emojiCount: number
        }> = []

        let currentIndex = -1
        let isTraveling = false

        const snapshot = () => ({
            gradient: selectedGradient,
            textColor,
            font: selectedFont,
            alignment,
            ratio,
            noise: noiseEnabled,
            emoji: selectedEmoji,
            emojiCount,
        })

        const push = () => {
            if (isTraveling) return
            history.splice(currentIndex + 1)
            history.push(snapshot())
            currentIndex = history.length - 1
        }

        push()

        const restore = (index: number) => {
            const s = history[index]
            if (!s) return
            isTraveling = true
            setSelectedGradient(s.gradient)
            setTextColor(s.textColor)
            setSelectedFont(s.font)
            setAlignment(s.alignment)
            setRatio(s.ratio)
            setNoiseEnabled(s.noise)
            setSelectedEmoji(s.emoji)
            setEmojiCount(s.emojiCount)
            setTimeout(() => { isTraveling = false }, 50)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const mod = e.ctrlKey || e.metaKey
            if (!mod) return

            if (e.key === "z" && !e.shiftKey) {
                e.preventDefault()
                if (currentIndex > 0) {
                    currentIndex--
                    restore(currentIndex)
                }
            }

            if ((e.key === "y") || (e.key === "z" && e.shiftKey)) {
                e.preventDefault()
                if (currentIndex < history.length - 1) {
                    currentIndex++
                    restore(currentIndex)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [
        selectedGradient, textColor, selectedFont,
        alignment, ratio, noiseEnabled, selectedEmoji, emojiCount
    ])


    const historyRef = useRef<Array<{
        gradient: string
        textColor: string
        font: string
        alignment: "left" | "center" | "right"
        ratio: "square" | "landscape" | "portrait"
        noise: boolean
        emoji: string | null
        emojiCount: number
    }>>([])
    const currentIndexRef = useRef(-1)
    const isTravelingRef = useRef(false)

    // Snapshot pusher — call this whenever state changes
    useEffect(() => {
        if (isTravelingRef.current) return
        const snapshot = {
            gradient: selectedGradient,
            textColor,
            font: selectedFont,
            alignment,
            ratio,
            noise: noiseEnabled,
            emoji: selectedEmoji,
            emojiCount,
        }
        // Trim future on new change
        historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1)
        historyRef.current.push(snapshot)
        currentIndexRef.current = historyRef.current.length - 1
    }, [selectedGradient, textColor, selectedFont, alignment, ratio, noiseEnabled, selectedEmoji, emojiCount])

    // Keyboard handler — separate effect, runs once
    useEffect(() => {
        const restore = (index: number) => {
            const s = historyRef.current[index]
            if (!s) return
            isTravelingRef.current = true
            setSelectedGradient(s.gradient)
            setTextColor(s.textColor)
            setSelectedFont(s.font)
            setAlignment(s.alignment)
            setRatio(s.ratio)
            setNoiseEnabled(s.noise)
            setSelectedEmoji(s.emoji)
            setEmojiCount(s.emojiCount)
            setTimeout(() => { isTravelingRef.current = false }, 100)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const mod = e.ctrlKey || e.metaKey

            if (mod && e.key === "z" && !e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
                if (currentIndexRef.current > 0) {
                    currentIndexRef.current--
                    restore(currentIndexRef.current)
                }
                return
            }

            if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault()
                e.stopPropagation()
                if (currentIndexRef.current < historyRef.current.length - 1) {
                    currentIndexRef.current++
                    restore(currentIndexRef.current)
                }
                return
            }

            if (mod && e.key === "r") {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        window.addEventListener("keydown", handleKeyDown, { capture: true })
        return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
    }, [])


    const getRandom = <T,>(arr: T[]): T => {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    const shuffleStyle = () => {
        // gradients
        const allGradients = Object.values(GRADIENT_CATEGORIES).flat()
        const randomGradient = getRandom(allGradients)

        // fonts
        const randomFont = getRandom(FONTS).value

        // alignment
        const alignments: ("left" | "center" | "right")[] = ["left", "center", "right"]
        const randomAlignment = getRandom(alignments)

        // ratio
        const ratios: ("square" | "landscape" | "portrait")[] = ["square", "landscape", "portrait"]
        const randomRatio = getRandom(ratios)

        // emoji (optional randomness)
        const shouldUseEmoji = Math.random() > 0.5

        // text color logic (THIS IS IMPORTANT)
        const darkText = "#0f172a"
        const lightText = "#ffffff"

        const useLightText = Math.random() > 0.5
        const randomTextColor = useLightText ? lightText : darkText

        // apply all
        setSelectedGradient(randomGradient)
        setSelectedFont(randomFont)
        setAlignment(randomAlignment)
        setRatio(randomRatio)
        setTextColor(randomTextColor)

        setSelectedEmoji(shouldUseEmoji ? selectedEmoji || "🔥" : null)
        setEmojiCount(Math.floor(Math.random() * 8) + 3)

        // optional spice
        setNoiseEnabled(Math.random() > 0.3)
    }

    const inferIconFromLabel = (label: string): MetricIconKey => {
        const l = label.toLowerCase()

        if (l.includes("follower") || l.includes("user")) return "users"
        if (l.includes("like")) return "likes"
        if (l.includes("view")) return "views"
        if (l.includes("comment")) return "comments"
        if (l.includes("share")) return "shares"
        if (l.includes("star")) return "stars"

        return "users"
    }
    return (
        <div className="w-full h-screen overflow-hidden flex flex-col">
            <nav className="bg-card w-full border-b-2 border-white/10 flex items-center justify-between px-5 py-4 shrink-0" >
                <Link href="/" className="flex items-center gap-2 group transition-all">
                    <div className="relative overflow-hidden rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Image
                            src={'/logo.png'}
                            alt="Milestore Studio Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-none">
                        Milestore Studio
                    </h1>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                            <KbdGroup>
                                <Kbd>Ctrl + Z</Kbd>
                                <span>Undo</span>
                                <span className="mx-1">•</span>
                                <Kbd>Ctrl + Y</Kbd>
                                <span>Redo</span>
                            </KbdGroup>
                        </p>
                    </div>

                    {/* GitHub Button */}
                    <Link href="https://github.com/nikhilsaiankilla/milestone-studio" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            <span>GitHub</span>
                            {/* Star Count Badge */}
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

                    {/* Twitter/X Button */}
                    <Link href="https://twitter.com/itzznikhilsai" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                            Twitter
                        </Button>
                    </Link>

                    <Link href="https://www.buymeacoffee.com/nikhilsaiankilla" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                            <Image
                                src={'/buymeacoffee.png'}
                                alt="Buy Me a Coffee"
                                width={18}
                                height={18}
                            />
                            <span>Buy me a coffee</span>
                        </Button>
                    </Link>
                </div>
            </nav >

            <div className="w-full flex justify-between overflow-hidden">
                {/* --- LEFT CONTAINER FIX --- */}
                <div className="bg-card w-[360px] border-r-2 border-white/10 flex flex-col h-full">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scroll">
                        {/* Templates */}
                        <section>
                            <div className="w-full flex items-center gap-2 mb-4">
                                <IdCard size={18} />
                                <h2 className="text-sm font-semibold text-secondary-foreground">Templates</h2>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {TEMPLATES.map((tpl) => (
                                    <div className="w-full flex flex-col gap-2 items-center cursor-pointer" key={tpl.id}>
                                        <button
                                            onClick={() => setActive(tpl.id)}
                                            className={cn(
                                                "relative rounded-xl w-full aspect-square flex items-center justify-center transition-all border cursor-pointer",
                                                active === tpl.id ? "border-primary bg-[#2a2416] shadow-[0_0_0_2px_rgba(234,179,8,0.4)]" : "border-white/10 bg-[#121212] hover:bg-[#121212]/70"
                                            )}
                                        >
                                            <div className={cn("h-8 flex items-center", active === tpl.id ? "text-primary" : "text-white/10")}>
                                                {tpl.skeleton}
                                            </div>
                                        </button>
                                        <span className={cn("text-[10px] font-semibold", active === tpl.id ? "text-primary" : "text-white/60")}>
                                            {tpl.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Separator className="opacity-50" />

                        {/* Main Info */}
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
                                            className={`flex items-center gap-2 p-3 rounded-lg text-sm border transition-all cursor-pointer
                                                ${isActive
                                                    ? "bg-primary text-black border-primary"
                                                    : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <span className={`${isActive ? "text-black" : "text-white/60"}`}>
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
                                    <span className="text-white/60">
                                        {platform?.icon}
                                    </span>

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
                        <div className="space-y-3 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layout size={16} className="text-white/60" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                                        Metrics
                                    </span>
                                </div>
                                {/* ADD BUTTON */}
                                <button
                                    onClick={handleAddMetric}
                                    className="px-3 py-2 border border-dashed border-white/20 rounded-lg text-xs text-white/40 hover:bg-white/5 flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} /> Add metric
                                </button>
                            </div>

                            {/* MAIN INPUT ROW */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden">
                                    {/* ICON SELECT (LEFT) */}

                                    {/* <GripVertical size={16} className="text-white/20" /> */}

                                    <Select
                                        value={activeMetric.icon}
                                        onValueChange={(value: string | null) => {
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

                                    {/* VALUE */}
                                    <input
                                        type="text"
                                        value={activeMetric.value}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (/^\d*$/.test(value)) {
                                                updateMetric(activeMetricIndex, { value })
                                            }
                                        }}
                                        className="w-16 bg-transparent border-r border-white/10 py-2 text-center text-sm focus:outline-none"
                                    />

                                    {/* LABEL */}
                                    <input
                                        value={activeMetric.label}
                                        onChange={(e) => {
                                            const label = e.target.value
                                            updateMetric(activeMetricIndex, {
                                                label,
                                                icon: inferIconFromLabel(label)
                                            })
                                        }}
                                        className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                                        placeholder="Followers"
                                    />

                                    {/* REMOVE */}
                                    <button
                                        onClick={() => handleRemoveMetric(activeMetricIndex)}
                                        className="px-2 text-white/20 hover:text-white/60"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* SECONDARY CONTROLS (clearly separated) */}
                            <div className="space-y-2">
                                {/* PERIOD */}
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select className="w-full appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                            <option>Period</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-white/40" />
                                    </div>

                                    <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
                                        <X size={16} />
                                    </Button>
                                </div>

                                {/* YEAR RANGE */}
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <select className="w-full appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                            <option>Year</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-white/40" />
                                    </div>

                                    <input className="w-16 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-center text-sm" defaultValue="1" />
                                    <span className="text-white/40">-</span>
                                    <input className="w-16 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-center text-sm" defaultValue="2" />
                                </div>
                            </div>

                        </div>

                        <Separator className="opacity-50" />

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">Emoji Scatter</span>
                                </div>
                                {selectedEmoji && (
                                    <button
                                        onClick={() => setSelectedEmoji(null)}
                                        className="text-white/30 hover:text-white/60 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all",
                                    showEmojiPicker
                                        ? "border-primary bg-yellow-500/5 text-white"
                                        : "border-white/10 bg-[#1a1a1a] text-white/50 hover:text-white/80"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {selectedEmoji
                                        ? <><span className="text-xl">{selectedEmoji}</span><span className="text-white/60 text-xs">Selected</span></>
                                        : <span>Choose an emoji</span>
                                    }
                                </span>
                                <ChevronDown size={14} className={cn("transition-transform", showEmojiPicker && "rotate-180")} />
                            </button>

                            {showEmojiPicker && (
                                <div className="w-full">
                                    <EmojiPicker
                                        theme={Theme.DARK}
                                        onEmojiClick={(emojiData: EmojiClickData) => {
                                            setSelectedEmoji(emojiData.emoji)
                                            setShowEmojiPicker(false)
                                        }}
                                        width="100%"
                                        height={350}
                                        previewConfig={{ showPreview: false }}
                                        skinTonesDisabled
                                    />
                                </div>
                            )}

                            {selectedEmoji && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-white/40 font-medium">Count</span>
                                        <span className="text-[11px] text-white/60 font-bold">{emojiCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={2}
                                        max={20}
                                        value={emojiCount}
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

                    {/* Fixed Action Buttons (Pinned to bottom) */}
                    <div className="shrink-0 p-4 border-t border-white/5 bg-white/5 space-y-3">
                        <Button
                            onClick={handleDownload}
                            className="w-full bg-primary cursor-pointer py-5 font-bold rounded-xl"
                        >
                            {
                                downloading ? <>Downloading</> : "Download image"
                            }
                        </Button>
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="w-full py-5 cursor-pointer rounded-xl"
                        >
                            {
                                copying ? "Copying" : 'Copy'
                            }
                        </Button>
                    </div>
                </div>

                {/* CENTER CONTAINER  */}
                <div className="flex-1 min-w-0 overflow-y-auto p-10"
                    style={{
                        backgroundColor: "#000000",
                        backgroundImage: "radial-gradient(rgba(229, 231, 235, 0.15) 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                    }}
                >
                    <div className="w-full max-w-2xl! flex flex-col gap-2 mx-auto">
                        <div
                            ref={cardRef}
                            className={cn(
                                "w-full overflow-hidden flex p-8 relative",
                                ratioClass,
                                alignmentClass
                            )}
                            style={{
                                borderRadius,
                                background: selectedGradient,
                            }}
                        >
                            {noiseEnabled && (
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                        backgroundSize: "200px 200px",
                                        backgroundRepeat: "repeat",
                                        opacity: 1.5,
                                        mixBlendMode: "overlay",
                                    }}
                                />
                            )}

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

                            <p className="absolute right-6 bottom-6 z-10 font-semibold flex items-center gap-1"
                                style={{ color: textColor }}
                            >
                                {
                                    handle && platform?.icon
                                }
                                {handle}
                            </p>

                            {active === "metrics" && (
                                <>
                                    <div
                                        className={cn(
                                            "relative z-10 flex flex-col text-[#1a1a1b]",
                                            alignment === "left" && "items-start",
                                            alignment === "center" && "items-center",
                                            alignment === "right" && "items-end"
                                        )}
                                        style={{ color: textColor, fontFamily: selectedFont }}
                                    >
                                        <div className="flex items-center gap-1.5 font-bold text-xl mb-2">
                                            <TrendingUp size={22} strokeWidth={3} />
                                            <span>+900%</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6">
                                            {metrics.map((m) => {
                                                const Icon = METRIC_ICONS[m.icon as MetricIconKey] || Users

                                                return (
                                                    <div
                                                        key={m.id}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <div className="flex items-center gap-2 text-4xl md:text-5xl font-extrabold tracking-tight">
                                                            <Icon size={40} strokeWidth={2.5} />
                                                            <span>{formatNumber(m.value)}</span>
                                                        </div>

                                                        <div className="text-xs mt-1 uppercase tracking-wider opacity-60">
                                                            {m.label}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                            {active === "milestone" && (() => {
                                const metric = metrics[0]
                                const value = parseValue(metric?.value || "0")

                                const { past, future } = getMilestones(value)

                                return (
                                    <div
                                        className="relative z-10 flex flex-col items-center justify-center"
                                        style={{ color: textColor, fontFamily: selectedFont }}
                                    >
                                        {/* TOP (FUTURE) */}
                                        <div className="text-4xl font-extrabold opacity-30 tracking-wide">
                                            {formatNumber(future)}
                                        </div>

                                        {/* CENTER (CURRENT) */}
                                        <div className="flex flex-col items-center">
                                            <div className="text-7xl md:text-8xl font-extrabold leading-none">
                                                {formatNumber(value)}
                                            </div>
                                            <div className="text-xs mt-2 uppercase tracking-[0.25em] opacity-60">
                                                {metric?.label}
                                            </div>
                                        </div>

                                        {/* BOTTOM (PAST) */}
                                        <div className="text-4xl font-extrabold opacity-30 tracking-wide">
                                            {formatNumber(past)}
                                        </div>
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTAINER */}
                <div className="bg-card w-[360px] shrink-0 border-l-2 border-white/10 flex flex-col h-full">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 w-full overflow-y-auto p-4 space-y-5 custom-scroll">

                        <div className="space-y-6">
                            {Object.entries(GRADIENT_CATEGORIES).map(([category, items]) => (
                                <section key={category} className="space-y-3">
                                    {/* Category Label */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold whitespace-nowrap">
                                            {category}
                                        </span>
                                        <div className="h-[1px] w-full bg-white/5" />
                                    </div>

                                    {/* Gradient Grid */}
                                    <div className="grid grid-cols-6 gap-2">
                                        {items.map((item, i) => (
                                            <button
                                                key={`${category}-${i}`}
                                                onClick={() => setSelectedGradient(item)}
                                                className={cn(
                                                    // Core Layout
                                                    "relative w-full aspect-square rounded-xl border transition-all duration-300 overflow-hidden",
                                                    // Interactive states
                                                    "cursor-pointer group active:scale-95",
                                                    // Selection Logic: High contrast border for selected, subtle for inactive
                                                    selectedGradient === item
                                                        ? "border-white/90 ring-4 ring-white/20 z-10 scale-95"
                                                        : "border-white/10 hover:border-white/40 hover:shadow-lg hover:shadow-black/20"
                                                )}
                                                style={{
                                                    background: item,
                                                    backgroundSize: "cover", // Ensures the mesh fills the square
                                                }}
                                                aria-label={`Select ${category} gradient ${i + 1}`}
                                            >
                                                {/* Inner Gloss/Shadow Overlay to make it look 3D */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-40" />

                                                {/* Subtle Shine on hover */}
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
                                        {FONTS.find(f => f.value === selectedFont)?.label ?? "Select font"}
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
                                {(["left", "center", "right"] as const).map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAlignment(a)}
                                        className={cn(
                                            "flex items-center justify-center py-2 rounded-lg transition-all cursor-pointer",
                                            alignment === a ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                                        )}
                                    >
                                        {a === "left" && <AlignLeft size={15} />}
                                        {a === "center" && <AlignCenter size={15} />}
                                        {a === "right" && <AlignRight size={15} />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <Separator className="opacity-20" />

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

                    </div>

                    {/* Pinned Bottom */}
                    <div className="shrink-0 p-4 border-t border-white/5 bg-white/5 space-y-3">

                        {/* Canvas Size */}
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Canvas Size</span>
                            <div className="w-full grid grid-cols-3 gap-1.5">
                                <Button
                                    onClick={() => setRatio("square")}
                                    variant="ghost"
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 h-auto py-3 rounded-lg cursor-pointer border transition-all",
                                        ratio === "square" ? "border-primary bg-yellow-500/10 text-primary" : "border-white/10 text-white/40 hover:text-white/60"
                                    )}
                                >
                                    <div className={cn("w-6 h-6 rounded-sm border-2", ratio === "square" ? "border-primary" : "border-current")} />
                                    <span className="text-[10px] font-bold">1:1</span>
                                </Button>

                                <Button
                                    onClick={() => setRatio("landscape")}
                                    variant="ghost"
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 h-auto py-3 rounded-lg cursor-pointer border transition-all",
                                        ratio === "landscape" ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/40 hover:text-white/60"
                                    )}
                                >
                                    <div className={cn("w-8 h-[18px] rounded-sm border-2", ratio === "landscape" ? "border-primary" : "border-current")} />
                                    <span className="text-[10px] font-bold">16:9</span>
                                </Button>

                                <Button
                                    onClick={() => setRatio("portrait")}
                                    variant="ghost"
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 h-auto py-3 rounded-lg cursor-pointer border transition-all",
                                        ratio === "portrait" ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/40 hover:text-white/60"
                                    )}
                                >
                                    <div className={cn("w-[18px] h-8 rounded-sm border-2", ratio === "portrait" ? "border-primary" : "border-current")} />
                                    <span className="text-[10px] font-bold">9:16</span>
                                </Button>
                            </div>
                        </div>

                        {/* Randomize */}
                        <Button
                            className="w-full cursor-pointer"
                            variant="outline"
                            onClick={shuffleStyle}
                        >
                            <ShuffleIcon size={14} />
                            <span>Randomize Style</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard

const formatNumber = (value: number | string) => {
    const num = typeof value === "number" ? value : Number(value)
    if (!num) return "0"

    const format = (n: number) =>
        parseFloat(n.toFixed(1)).toString()

    if (num >= 1_000_000_000) return format(num / 1_000_000_000) + "B"
    if (num >= 1_000_000) return format(num / 1_000_000) + "M"
    if (num >= 1_000) return format(num / 1_000) + "K"

    return num.toString()
}

const getMilestones = (value: number) => {
    if (value <= 0) return { past: 0, future: 0 }

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
    const step = magnitude

    const past = Math.floor(value / step) * step
    const future = past + step

    return { past, future }
}

const parseValue = (value: string) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
}
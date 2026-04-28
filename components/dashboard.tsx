'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { useEffect, useMemo, useState } from "react"
import { AlignCenter, AlignLeft, AlignRight, ChevronDown, GripVertical, IdCard, Layout, Plus, Shuffle, ShuffleIcon, TrendingUp, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FONTS, GRADIENTS, PLATFORMS, PlatformType, TEMPLATES } from "@/types/card"
import { Separator } from "./ui/separator"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

import { toPng } from "html-to-image"
import { useRef } from "react"
import { toast } from "sonner"

const Dashboard = () => {
    const [stars, setStars] = useState<number | null>(null)
    const [active, setActive] = useState("metrics")

    const [copying, setCopying] = useState(false)
    const [downloading, setDownloading] = useState(false)

    // state
    const [textColor, setTextColor] = useState("#0f172a")

    const [borderRadius] = useState(24)

    const [noiseEnabled, setNoiseEnabled] = useState(true)
    const [alignment, setAlignment] = useState<"left" | "center" | "right">("center")

    const [ratio, setRatio] = useState<"square" | "landscape" | "portrait">(
        "landscape"
    )

    const [selectedFont, setSelectedFont] = useState(FONTS[0].value)

    const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0])

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

                    <Link href="https://www.buymeacoffee.com/yourusername" target="_blank">
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
                                                active === tpl.id ? "border-yellow-500 bg-[#2a2416] shadow-[0_0_0_2px_rgba(234,179,8,0.4)]" : "border-white/10 bg-[#121212] hover:bg-[#121212]/70"
                                            )}
                                        >
                                            <div className={cn("h-8 flex items-center", active === tpl.id ? "text-orange-500" : "text-white/10")}>
                                                {tpl.skeleton}
                                            </div>
                                        </button>
                                        <span className={cn("text-[10px] font-semibold", active === tpl.id ? "text-yellow-400" : "text-white/60")}>
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
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all
                                                ${isActive
                                                    ? "bg-yellow-500 text-black border-yellow-500"
                                                    : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <span className={`${isActive ? "text-black" : "text-white/60"}`}>
                                                {p.icon}
                                            </span>
                                            {p.label}
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

                            <div className="space-y-2">
                                <Label className="text-[13px] font-medium text-white/70">Heading</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select className="w-full appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                            <option>Period</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-white/40" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-white/40 hover:text-white"><X size={16} /></Button>
                                </div>
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
                        </section>

                        <Separator className="opacity-50" />

                        {/* Metrics */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layout size={16} className="text-white/60" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">Metrics</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 group">
                                <GripVertical size={16} className="text-white/20" />
                                <div className="flex-1 flex items-center bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden">
                                    <input className="w-14 bg-transparent border-r border-white/10 py-2 text-center text-sm focus:outline-none" defaultValue="10" />
                                    <input className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none" placeholder="Followers" />
                                    <button className="px-2 text-white/20 hover:text-white/60"><X size={14} /></button>
                                </div>
                            </div>

                            <button className="w-full py-2 border border-dashed border-white/20 rounded-lg text-xs text-white/40 hover:bg-white/5 flex items-center justify-center gap-2">
                                <Plus size={14} /> Add metric
                            </button>
                        </section>

                        <Separator className="opacity-50" />

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">✨</span>
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
                                        ? "border-yellow-500/50 bg-yellow-500/5 text-white"
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
                                        className="w-full accent-yellow-500 cursor-pointer"
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
                            className="w-full cursor-pointer py-5 from-primary-500 to-primary hover:opacity-90 text-black font-bold rounded-xl"
                        >
                            {
                                downloading ? <>Downloading</> : "Download image"
                            }
                        </Button>
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="w-full py-5 cursor-pointer rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                        >
                            {
                                copying ? "Copying" : 'Copy'
                            }
                        </Button>
                    </div>
                </div>

                {/* CENTER CONTAINER  */}
                <div className="flex-1 min-w-0 overflow-y-auto p-10">
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
                                    }}
                                >
                                    {selectedEmoji}
                                </span>
                            ))}

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

                                        <div className="flex items-center gap-4 text-6xl md:text-7xl font-extrabold tracking-tight">
                                            <Users size={60} strokeWidth={2.5} />
                                            <span>10 Followers</span>
                                        </div>
                                    </div>

                                    <p className="absolute right-6 bottom-6 z-10 font-semibold flex items-center gap-1"
                                        style={{ color: textColor }}
                                    >
                                        {
                                            handle && platform?.icon
                                        }
                                        {handle}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTAINER */}
                <div className="bg-card w-[360px] shrink-0 border-l-2 border-white/10 flex flex-col h-full">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 w-full overflow-y-auto p-4 space-y-5 custom-scroll">

                        {/* Gradients */}
                        <section className="space-y-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Gradients</span>
                            <div className="grid grid-cols-4 gap-2">
                                {GRADIENTS.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedGradient(item)}
                                        className={cn(
                                            "w-full aspect-square rounded-lg border cursor-pointer transition-all",
                                            selectedGradient === item
                                                ? "border-2 border-white/60 scale-95"
                                                : "border-white/10 hover:border-white/30"
                                        )}
                                        style={{ background: item }}
                                    />
                                ))}
                            </div>
                        </section>

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
                                        ratio === "square" ? "border-yellow-500 bg-yellow-500/10 text-yellow-400" : "border-white/10 text-white/40 hover:text-white/60"
                                    )}
                                >
                                    <div className={cn("w-6 h-6 rounded-sm border-2", ratio === "square" ? "border-yellow-400" : "border-current")} />
                                    <span className="text-[10px] font-bold">1:1</span>
                                </Button>

                                <Button
                                    onClick={() => setRatio("landscape")}
                                    variant="ghost"
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 h-auto py-3 rounded-lg cursor-pointer border transition-all",
                                        ratio === "landscape" ? "border-yellow-500 bg-yellow-500/10 text-yellow-400" : "border-white/10 text-white/40 hover:text-white/60"
                                    )}
                                >
                                    <div className={cn("w-8 h-[18px] rounded-sm border-2", ratio === "landscape" ? "border-yellow-400" : "border-current")} />
                                    <span className="text-[10px] font-bold">16:9</span>
                                </Button>

                                <Button
                                    onClick={() => setRatio("portrait")}
                                    variant="ghost"
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 h-auto py-3 rounded-lg cursor-pointer border transition-all",
                                        ratio === "portrait" ? "border-yellow-500 bg-yellow-500/10 text-yellow-400" : "border-white/10 text-white/40 hover:text-white/60"
                                    )}
                                >
                                    <div className={cn("w-[18px] h-8 rounded-sm border-2", ratio === "portrait" ? "border-yellow-400" : "border-current")} />
                                    <span className="text-[10px] font-bold">9:16</span>
                                </Button>
                            </div>
                        </div>

                        {/* Randomize */}
                        <Button className="w-full cursor-pointer" variant="outline">
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


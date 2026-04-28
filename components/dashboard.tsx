'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { ThemeSwitch } from "./theme-switch"
import { useEffect, useMemo, useState } from "react"
import { AlignCenter, AlignLeft, AlignRight, ChevronDown, GripVertical, IdCard, Layout, Plus, Shuffle, ShuffleIcon, TrendingUp, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FONTS, GRADIENTS, TEMPLATES } from "@/types/card"
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

    return (
        <div className="w-full min-h-screen">
            <nav className="w-full flex items-center justify-between px-5 md:px-0 max-w-6xl mx-auto py-4" >
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
                    <ThemeSwitch />

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

            <div className="px-5 md:px-0 max-w-6xl mx-auto w-full h-[calc(100vh-160px)] mt-5 grid grid-cols-3 gap-3">
                {/* --- LEFT CONTAINER FIX --- */}
                <div className="bg-card rounded-2xl col-span-1 border-2 border-white/10 flex flex-col overflow-hidden h-full">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
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

                            <div className="space-y-2">
                                <Label className="text-[13px] font-medium text-white/70">X Handle</Label>
                                <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" onChange={(e) => setHandle(e.target.value)} placeholder="@your_handle" />
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
                    </div>

                    {/* Fixed Action Buttons (Pinned to bottom) */}
                    <div className="p-4 border-t border-white/5 bg-white/5 space-y-3">
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

                {/* Right Area */}
                <div className="col-span-2 w-full flex flex-col gap-2">
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
                                        handle && <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                        </svg>
                                    }
                                    {handle}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Preview Controls */}
                    <div className="space-y-3">
                        {/* Gradient Presets */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold px-1">Gradients</span>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                {GRADIENTS.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedGradient(item)}
                                        className={cn(
                                            "w-10 h-10 rounded-full border shrink-0 cursor-pointer transition-all",
                                            selectedGradient === item
                                                ? "border-white/50 border-2"
                                                : "border-white/10"
                                        )}
                                        style={{ background: item }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Controls Row */}
                        <div className="w-full flex flex-wrap items-end justify-between gap-y-6">
                            <div className="w-full flex items-center justify-between gap-6 flex-wrap">
                                {/* Color Picker / Text Color */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
                                        Text
                                    </span>

                                    <label className="relative w-10 h-10 rounded-xl border border-white/10 shrink-0 cursor-pointer shadow-inner overflow-hidden">
                                        <div
                                            className="absolute inset-0 rounded-xl"
                                            style={{ backgroundColor: textColor }}
                                        />

                                        <input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </label>
                                </div>

                                <span className="border-l border-white/20 h-6" />

                                {/* Font Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Font</span>
                                    <Select value={selectedFont} onValueChange={(val) => { if (val) setSelectedFont(val) }}>
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl min-w-[160px] text-sm">
                                            <SelectValue>
                                                {FONTS.find(f => f.value === selectedFont)?.label ?? "Select font"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FONTS.map((f) => (
                                                <SelectItem
                                                    key={f.value}
                                                    value={f.value}
                                                    style={{ fontFamily: f.value }}
                                                >
                                                    {f.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <span className="border-l border-white/20 h-6" />

                                {/* Alignment Toggle */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
                                        Align
                                    </span>

                                    <div className="flex gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                                        <button
                                            onClick={() => setAlignment("left")}
                                            className={cn(
                                                "p-2 rounded-lg transition-all cursor-pointer",
                                                alignment === "left"
                                                    ? "bg-white/10 opacity-100"
                                                    : "opacity-30 hover:opacity-100"
                                            )}
                                        >
                                            <AlignLeft size={16} />
                                        </button>

                                        <button
                                            onClick={() => setAlignment("center")}
                                            className={cn(
                                                "p-2 rounded-lg transition-all cursor-pointer",
                                                alignment === "center"
                                                    ? "bg-white/10 opacity-100"
                                                    : "opacity-30 hover:opacity-100"
                                            )}
                                        >
                                            <AlignCenter size={16} />
                                        </button>

                                        <button
                                            onClick={() => setAlignment("right")}
                                            className={cn(
                                                "p-2 rounded-lg transition-all cursor-pointer",
                                                alignment === "right"
                                                    ? "bg-white/10 opacity-100"
                                                    : "opacity-30 hover:opacity-100"
                                            )}
                                        >
                                            <AlignRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <span className="border-l border-white/20 h-6" />

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
                                        Noise
                                    </span>
                                    <div className="flex items-center gap-2 group">
                                        <Switch
                                            id="airplane-mode"
                                            checked={noiseEnabled}
                                            onCheckedChange={setNoiseEnabled}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-end justify-between gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Canvas Size</span>
                                    <div className="flex gap-1.5">
                                        <Button
                                            onClick={() => setRatio("square")}
                                            variant={ratio === "square" ? "default" : "outline"}
                                            className="rounded-lg px-5 cursor-pointer"
                                        >
                                            1:1
                                        </Button>

                                        <Button
                                            onClick={() => setRatio("landscape")}
                                            variant={ratio === "landscape" ? "default" : "outline"}
                                            className="rounded-lg px-5 cursor-pointer"
                                        >
                                            16:9
                                        </Button>

                                        <Button
                                            onClick={() => setRatio("portrait")}
                                            variant={ratio === "portrait" ? "default" : "outline"}
                                            className="rounded-lg px-5 cursor-pointer"
                                        >
                                            9:16
                                        </Button>
                                    </div>
                                </div>
                                <span className="border-l border-white/20 h-6" />
                                <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                                    <ShuffleIcon />
                                    <span>Randomize Style</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard
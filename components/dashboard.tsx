'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { ThemeSwitch } from "./theme-switch"
import { useEffect, useState } from "react"
import { AlignCenter, AlignLeft, AlignRight, ChevronDown, GripVertical, IdCard, Layout, Plus, Shuffle, ShuffleIcon, TrendingUp, Users, X } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { cn } from "@/lib/utils"
import { TEMPLATES } from "@/types/card"
import { Separator } from "./ui/separator"
import { Label } from "./ui/label"

const Dashboard = () => {
    const [stars, setStars] = useState<number | null>(null)
    const [active, setActive] = useState("metrics");

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

    return (
        <div className="w-full h-screen">
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
                                <input className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" placeholder="@your_handle" />
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
                                <div className="flex items-center gap-3">
                                    <Label className="flex items-center gap-1 cursor-pointer">
                                        <div className="w-7 h-4 bg-yellow-600 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                                    </Label>
                                    <Label className="flex items-center gap-1 cursor-pointer">
                                        <div className="w-7 h-4 bg-white/10 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/40 rounded-full" /></div>
                                    </Label>
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
                        <Button className="w-full cursor-pointer py-5 from-primary-500 to-primary hover:opacity-90 text-black font-bold rounded-xl">
                            Download image
                        </Button>
                        <Button variant="outline" className="w-full py-5 cursor-pointer rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                            Copy
                        </Button>
                    </div>
                </div>

                {/* Right Area */}
                <div className="col-span-2 w-full flex flex-col gap-2">
                    {/* Main Card Preview */}
                    <div className="flex-1 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl border border-white/10 w-full aspect-video bg-gradient-to-r from-purple-500 to-yellow-500">
                        {/* Noise Overlay */}
                        <div className="absolute inset-0 opacity-[0.15] pointer-events-none brightness-150 contrast-150"
                            style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-[#1a1a1b]">
                            <div className="flex items-center gap-1.5 text-[#00d486] font-bold text-xl mb-2">
                                <TrendingUp size={22} strokeWidth={3} />
                                <span>+900%</span>
                            </div>
                            <div className="flex items-center gap-4 text-6xl md:text-7xl font-extrabold tracking-tight">
                                <Users size={60} strokeWidth={2.5} />
                                <span>10 Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Preview Controls */}
                    <div className="space-y-3">
                        {/* Gradient Presets */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold px-1">Gradients</span>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 shrink-0 cursor-pointer hover:border-white/30 transition-colors"
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-xl border border-dashed border-white/20 flex items-center justify-center shrink-0 text-[10px] text-white/40 bg-white/[0.02]">
                                    +5
                                </div>
                            </div>
                        </div>

                        {/* Controls Row */}
                        <div className="w-full flex flex-wrap items-end justify-between gap-y-6">
                            <div className="w-full flex items-center justify-between gap-6 flex-wrap">
                                {/* Color Picker / Text Color */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Text</span>
                                    <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-white/10 shrink-0 cursor-pointer shadow-inner" />
                                </div>

                                <span className="border-l border-white/20 h-6" />

                                {/* Font Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Font</span>
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/[0.08] cursor-pointer transition-all">
                                        <span>Bricolage Style</span>
                                        <ChevronDown size={14} className="opacity-40" />
                                    </div>
                                </div>

                                <span className="border-l border-white/20 h-6" />

                                {/* Alignment Toggle */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Align</span>
                                    <div className="flex gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                                        <button className="p-2 opacity-30 hover:opacity-100 transition-opacity"><AlignLeft size={16} /></button>
                                        <button className="p-2 bg-white/10 rounded-lg shadow-sm"><AlignCenter size={16} /></button>
                                        <button className="p-2 opacity-30 hover:opacity-100 transition-opacity"><AlignRight size={16} /></button>
                                    </div>
                                </div>

                                <span className="border-l border-white/20 h-6" />

                                <Link href="https://www.buymeacoffee.com/yourusername" target="_blank">
                                    <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                                        <ShuffleIcon />
                                        <span>Randomize Style</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-y-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Canvas Size</span>
                                <div className="flex gap-1.5">
                                    <Button variant="default" className="rounded-lg px-5 cursor-pointer">1:1</Button>
                                    <Button variant="outline" className="rounded-lg px-5 cursor-pointer">1:2</Button>
                                    <Button variant="outline" className="rounded-lg px-5 cursor-pointer">9:4</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
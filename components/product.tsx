'use client'

import { ChevronDown, ExternalLink, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

interface Product {
    name: string
    desc: string
    href: string
    image: string
    tag?: string // optional badge e.g. "New", "Free", "Open Source"
}

// ADD YOUR PRODUCTS HERE
const PRODUCTS: Product[] = [
    {
        name: "ShipInDays",
        desc: "Launch SaaS MVPs faster with production-ready scaffolding",
        href: "https://shipindays.nikhilsai.in?ref=milestonestudio",
        image: "/shipindays.png",
        tag: "Open Source",
    },
    {
        name: "MintConvert",
        desc: "Convert bank statements to CSV, Excel, JSON & more",
        href: "https://mintconvert.com?ref=milestonestudio",
        image: "/mintconvert.png",
        tag: "Free",
    },
    // Add more products below
    // {
    //     name: "Your Product",
    //     desc: "Short one-liner description",
    //     href: "https://yourproduct.com",
    //     image: "/yourproduct.png",
    //     tag: "New",
    // },
]
const Product = () => {
    const [open, setOpen] = useState(false)

    return (
        <div className="pt-2">
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">

                {/* Header toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Sparkles size={12} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-white/80 leading-none">
                                More Products from myside
                            </p>
                            <p className="text-[10px] text-white/30 mt-0.5">
                                {PRODUCTS.length} products
                            </p>
                        </div>
                    </div>

                    <ChevronDown
                        size={14}
                        className={`text-white/30 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Animated list */}
                <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className="px-3 pb-3 pt-1 space-y-2">
                            {PRODUCTS.map((item, index) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-200"
                                    style={{ transitionDelay: open ? `${index * 50}ms` : '0ms' }}
                                >
                                    {/* Product image */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0"
                                    />

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[12px] font-semibold text-white/85 leading-none truncate">
                                                {item.name}
                                            </p>
                                            {item.tag && (
                                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 leading-none shrink-0">
                                                    {item.tag}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-white/35 mt-1 leading-snug line-clamp-1">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ExternalLink
                                        size={12}
                                        className="text-white/20 group-hover:text-white/50 transition-colors shrink-0"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
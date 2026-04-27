"use client"

import { ChevronDown, ExternalLink, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const Product = () => {
    const [showProducts, setShowProducts] = useState(false)

    const products = [
        {
            name: "ShipInDays",
            desc: "Launch SaaS MVPs faster",
            href: "https://shipindays.nikhilsai.in",
            image: "/shipindays.png",
        },
        {
            name: "Mint convert",
            desc: "Convert Bank stateements to CSV for free",
            href: "https://mintconvert.com",
            image: "/mintconvert.png",
        },
    ]
    return (
        < div className="px-3 pb-4 pt-5" >
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                <button
                    onClick={() => setShowProducts(!showProducts)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 cursor-pointer"
                >
                    <div>
                        <p className="text-[11px] font-bold text-white flex items-center gap-2">
                            <Sparkles size={14} />
                            Other Products
                        </p>
                        <p className="text-[10px] text-white/40 mt-0.5">
                            Built by me
                        </p>
                    </div>

                    <div
                        className={`transition-transform duration-300 ${showProducts ? "rotate-180" : "rotate-0"
                            }`}
                    >
                        <ChevronDown size={16} className="text-white/50" />
                    </div>
                </button>

                {/* Animated Content */}
                <div
                    className={`grid transition-all duration-300 ease-in-out ${showProducts
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="px-3 pb-3 space-y-2">
                            {products.map((item, index) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3 hover:bg-white/[0.06] transition-all flex items-center gap-3 translate-y-0"
                                    style={{
                                        transitionDelay: showProducts ? `${index * 60}ms` : "0ms",
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-xl bg-white/5 border border-white/10"
                                    />

                                    <div className="flex items-start justify-between gap-2 w-full">
                                        <div>
                                            <p className="text-[12px] font-semibold text-white">
                                                {item.name}
                                            </p>
                                            <p className="text-[10px] text-white/45 mt-1">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <ExternalLink
                                            size={14}
                                            className="text-white/35 shrink-0 mt-0.5"
                                        />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Product
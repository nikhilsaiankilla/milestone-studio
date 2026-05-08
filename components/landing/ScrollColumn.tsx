"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ScrollColumnProps {
    images: string[];
    reverse?: boolean;
}

export const ScrollColumn = ({ images, reverse = false }: ScrollColumnProps) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // One goes down, the other goes up
    const movement = reverse ? scrollY * 0.1 : -scrollY * 0.1;

    return (
        <div
            className="flex flex-col gap-6 transition-transform duration-150 ease-out"
            style={{ transform: `translateY(${movement}px)` }}
        >
            {images.map((src, i) => (
                <div
                    key={`${src}-${i}`}
                    className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl group"
                >
                    <Image
                        src={src}
                        alt="Milestone Showcase"
                        width={500}
                        height={500}
                        className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-500 block"
                    />
                </div>
            ))}
        </div>
    );
};
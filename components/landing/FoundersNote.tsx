"use client";

import Image from "next/image";
import Link from "next/link";

export default function FoundersNote() {
    return (
        <section className="relative w-full py-24 bg-black text-white flex justify-center px-6">
            <div className="max-w-2xl w-full border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-[32px] p-8 md:p-12">

                {/* Section Label */}
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-8">
                    Founders Note
                </div>

                {/* Note Content */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
                        I built Milestone Studio because I was tired of friction.
                    </h2>

                    <div className="space-y-4 text-white/50 leading-relaxed font-light text-lg">
                        <p>
                            Every time I wanted to celebrate a project milestone on X or LinkedIn, I found myself wrestling with design tools just to make a simple card look professional.
                        </p>
                        <p>
                            I wanted something that didn&apos;t require a login, didn&apos;t have a learning curve, and produced premium results in seconds. Milestone Studio is a tool-first platform no fluff, just utility for builders and creators.
                        </p>
                    </div>
                </div>

                {/* Founder Signature Area */}
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
                    <Link
                        href={'https://nikhilsai.in'}
                        target="_blank"
                        className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                            <Image
                                alt="Nikhil Sai"
                                src="/nikhil.jpeg"
                                width={48}
                                height={48}
                                unoptimized
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="text-sm font-semibold">Nikhil Sai</div>
                            <div className="text-xs text-white/30 tracking-wide uppercase">Software Engineer</div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
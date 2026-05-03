import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Kbd, KbdGroup } from '../ui/kbd'
import { Button } from '../ui/button'

const DashboardNav = ({ stars }: { stars: number | null }) => {
    return (
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

                <Link href="https://www.buymeacoffee.com/nikhilsaiankilla" target="_blank">
                    <Button className="flex items-center gap-2 px-4 py-2 cursor-pointer" variant="outline">
                        <Image src="/buymeacoffee.png" alt="Buy Me a Coffee" width={18} height={18} />
                        <span>Buy me a coffee</span>
                    </Button>
                </Link>

                <Link href="https://twitter.com/itzznikhilsai" target="_blank">
                    <Button className="flex items-center gap-2 p-2 aspect-square cursor-pointer" variant="outline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                    </Button>
                </Link>
            </div>
        </nav>
    )
}

export default DashboardNav
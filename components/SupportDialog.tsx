import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Star, Sparkles, Heart } from "lucide-react"

export function SupportDialog({
    open,
    onClose,
    onLater,
    stars
}: {
    open: boolean
    onClose: () => void
    onLater: () => void
    stars: number | null;
}) {

    return (
        <Dialog open={open} onOpenChange={onLater}>
            <DialogContent className="sm:max-w-[580px] p-10 gap-8"
            >
                <DialogHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 bg-primary/40 rounded-full flex items-center justify-center rotate-3">
                        <Heart className="h-8 w-8 text-primary animate-pulse"/>
                    </div>

                    <DialogTitle className="text-3xl font-bold tracking-tight">
                        Love your milestone cards?
                    </DialogTitle>

                    <DialogDescription className="text-base max-w-[420px] leading-relaxed">
                        Milestone Studio is a labor of love to help you celebrate your wins publicly.
                        If you're finding it useful, follow the journey or consider supporting!
                    </DialogDescription>
                </DialogHeader>

                {/* Main Actions Row */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="https://github.com/nikhilsaiankilla/milestone-studio" target="_blank">
                        <Button className="flex items-center gap-2 px-8 py-6! cursor-pointer" variant="outline">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>GitHub</span>
                            {stars !== null && (
                                <span className="ml-1 border-l pl-2 border-border text-muted-foreground text-xs">
                                    {stars}
                                </span>
                            )}
                        </Button>
                    </Link>

                    <Link href="https://www.buymeacoffee.com/nikhilsaiankilla" target="_blank">
                        <Button className="flex items-center gap-2 px-8 py-6! cursor-pointer" variant="outline">
                            <Image src="/buymeacoffee.png" alt="Buy Me a Coffee" width={18} height={18} />
                            <span>Buy me a coffee</span>
                        </Button>
                    </Link>

                    {/* Twitter / X */}
                    <Link href="https://x.com/itzznikhilsai" target="_blank">
                        <Button className="flex items-center gap-2 px-4 py-2 h-auto cursor-pointer" variant="outline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-semibold">Follow on X</span>
                                <span className="text-[10px] text-muted-foreground leading-none">For latest updates</span>
                            </div>
                        </Button>
                    </Link>
                </div>

                <div className="flex justify-center border-t pt-4">
                    <Button
                        variant="ghost"
                        onClick={onLater}
                        className="text-muted-foreground px-8 py-6 hover:text-foreground text-xs cursor-pointer"
                    >
                        I'll support later, thanks!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
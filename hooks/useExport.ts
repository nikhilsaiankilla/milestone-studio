/**
 * useExport.ts
 * Manages all export state: progress, downloading, copying.
 * Confetti fires only on download, not copy.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import {
    captureCard,
    dataUrlToBlob,
    type QualityPreset,
    QUALITY_SCALE,
    QUALITY_LABELS,
} from '@/lib/export-service'
import { useSupportPrompt } from './useSupportPrompt'

export type { QualityPreset }
export { QUALITY_SCALE, QUALITY_LABELS }

// RAF-based smooth progress animator (same pattern as screenshot-studio)
function createProgressAnimator(setProgress: (v: number) => void) {
    let current = 0
    let target = 0
    let rafId: number | null = null

    const animate = () => {
        const diff = target - current
        if (Math.abs(diff) < 0.5) {
            current = target
            setProgress(Math.round(current))
            rafId = null
            return
        }
        current += diff * 0.15
        setProgress(Math.round(current))
        rafId = requestAnimationFrame(animate)
    }

    return {
        set(value: number) {
            target = value
            if (rafId === null) rafId = requestAnimationFrame(animate)
        },
        snap(value: number) {
            target = value
            current = value
            setProgress(value)
            if (rafId !== null) {
                cancelAnimationFrame(rafId)
                rafId = null
            }
        },
        reset() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId)
                rafId = null
            }
            current = 0
            target = 0
            setProgress(0)
        },
    }
}

export interface UseExportReturn {
    quality: QualityPreset
    setQuality: (q: QualityPreset) => void
    downloading: boolean
    copying: boolean
    downloadProgress: number
    copyProgress: number
    handleDownload: (element: HTMLElement | null) => Promise<void>
    handleCopy: (element: HTMLElement | null) => Promise<void>
}

export function useExport(): UseExportReturn {
    const [quality, setQuality] = useState<QualityPreset>('high')
    const [downloading, setDownloading] = useState(false)
    const [copying, setCopying] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [copyProgress, setCopyProgress] = useState(0)

    const downloadAnimator = useRef(createProgressAnimator(setDownloadProgress))
    const copyAnimator = useRef(createProgressAnimator(setCopyProgress))

    // const { triggerCheck } = useSupportPrompt()

    // Cleanup animators on unmount
    useEffect(() => {
        return () => {
            downloadAnimator.current.reset()
            copyAnimator.current.reset()
        }
    }, [])

    const handleDownload = useCallback(async (element: HTMLElement | null) => {
        if (!element) return
        const anim = downloadAnimator.current
        setDownloading(true)
        anim.snap(0)

        try {
            const dataUrl = await captureCard(element, {
                quality,
                onProgress: (p) => anim.set(p),
            })

            anim.set(95)

            const link = document.createElement('a')
            link.download = 'milestone-card.png'
            link.href = dataUrl
            link.click()

            anim.snap(100)

            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
            })

            toast.success('Image downloaded!', {
                description: `Exported at ${QUALITY_LABELS[quality]} quality`,
            })

            setTimeout(() => anim.reset(), 800)

            // triggerCheck()
        } catch (error) {
            anim.reset()
            toast.error(error instanceof Error ? error.message : 'Download failed')
        } finally {
            setDownloading(false)
        }
    }, [quality])

    const handleCopy = useCallback(async (element: HTMLElement | null) => {
        if (!element) return
        const anim = copyAnimator.current
        setCopying(true)
        anim.snap(0)

        try {
            const dataUrl = await captureCard(element, {
                quality: 'high', // clipboard always high, no need for 4K/6K
                onProgress: (p) => anim.set(p),
            })

            anim.set(92)

            const blob = await dataUrlToBlob(dataUrl)

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ])

            anim.snap(100)

            toast.success('Copied to clipboard!')

            setTimeout(() => anim.reset(), 800)
        } catch (error) {
            anim.reset()
            toast.error(error instanceof Error ? error.message : 'Copy failed')
        } finally {
            setCopying(false)
        }
    }, [])

    return {
        quality,
        setQuality,
        downloading,
        copying,
        downloadProgress,
        copyProgress,
        handleDownload,
        handleCopy,
    }
}
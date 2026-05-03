import { domToPng } from 'modern-screenshot'
import { QUALITY_PRESETS, type QualityPreset, type ExportFormat } from '@/types/export/types'

// Re-export for consumers (LeftPanel, useExport)
export type { QualityPreset, ExportFormat }

export const QUALITY_LABELS: Record<QualityPreset, string> = {
    low: 'Low', medium: 'Med', high: 'High', // '2k': '2K', '4k': '4K', '6k': '6K'
}

export const QUALITY_SCALE = Object.fromEntries(
    Object.entries(QUALITY_PRESETS).map(([k, v]) => [k, v.scale])
) as Record<QualityPreset, number>

export interface CaptureOptions {
    quality: QualityPreset
    format?: ExportFormat
    onProgress?: (percent: number) => void
}

export async function captureCard(
    element: HTMLElement,
    options: CaptureOptions
): Promise<string> {
    const { quality, format = 'png', onProgress } = options
    const report = onProgress ?? (() => { })
    const { scale } = QUALITY_PRESETS[quality]

    report(10)

    // Flush pending React renders
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    report(25)

    // Step 1: Browser capture at scale
    const rawDataUrl = await domToPng(element, { scale })

    report(60)

    // Step 2: Send to Sharp for compression/optimization
    const optimizedDataUrl = await sharpCompress(rawDataUrl, quality, format, (p) => {
        // Map Sharp progress (0-100) into our 60-95 range
        report(60 + Math.round(p * 0.35))
    })

    report(97)

    return optimizedDataUrl
}

async function sharpCompress(
    dataUrl: string,
    quality: QualityPreset,
    format: ExportFormat,
    onProgress?: (p: number) => void
): Promise<string> {

    console.log('inside sharp compress')
    // Convert dataUrl → Blob
    const res = await fetch(dataUrl)
    const blob = await res.blob()

    onProgress?.(20)

    const formData = new FormData()
    formData.append('image', blob, `card.png`)
    formData.append('format', format)
    formData.append('qualityPreset', quality)

    onProgress?.(40)

    const response = await fetch('/api/export', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error ?? 'Sharp compression failed')
    }

    onProgress?.(85)

    // Convert response blob → dataUrl
    const outputBlob = await response.blob()
    return blobToDataUrl(outputBlob)
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read blob'))
        reader.readAsDataURL(blob)
    })
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl)
    return res.blob()
}
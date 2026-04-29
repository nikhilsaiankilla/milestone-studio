/**
 * export-service.ts
 * Handles card capture using modern-screenshot.
 * Returns a data URL string ready for download or clipboard.
 */

import { domToPng } from 'modern-screenshot'

export type QualityPreset = 'low' | 'medium' | 'high' | '2k' | '4k' | '6k'

export const QUALITY_SCALE: Record<QualityPreset, number> = {
    low: 1,
    medium: 2,
    high: 3,
    '2k': 4,
    '4k': 6,
    '6k': 8,
}

export const QUALITY_LABELS: Record<QualityPreset, string> = {
    low: 'Low',
    medium: 'Med',
    high: 'High',
    '2k': '2K',
    '4k': '4K',
    '6k': '6K',
}

export interface CaptureOptions {
    quality: QualityPreset
    onProgress?: (percent: number) => void
}

export async function captureCard(
    element: HTMLElement,
    options: CaptureOptions
): Promise<string> {
    const { quality, onProgress } = options
    const report = onProgress ?? (() => { })
    const scale = QUALITY_SCALE[quality]

    report(10)

    // Let any pending React renders flush before capture
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    report(30)

    const dataUrl = await domToPng(element, { scale })

    report(90)

    return dataUrl
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl)
    return res.blob()
}
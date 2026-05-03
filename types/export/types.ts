export type QualityPreset = 'low' | 'medium' | 'high' | '2k' | '4k' | '6k'
export type ExportFormat = 'png' | 'jpeg' | 'webp'

export interface QualitySettings {
    scale: number           // domToPng pixel scale multiplier
    jpeg: number            // 0-100
    webp: number            // 0-100
    pngCompression: number  // 0-9 (0=none, 9=max)
}

export const QUALITY_PRESETS: Record<QualityPreset, QualitySettings> = {
    low: { scale: 1, jpeg: 60, webp: 60, pngCompression: 9 },
    medium: { scale: 2, jpeg: 75, webp: 75, pngCompression: 7 },
    high: { scale: 3, jpeg: 88, webp: 88, pngCompression: 6 },
    '2k': { scale: 4, jpeg: 92, webp: 92, pngCompression: 4 },
    '4k': { scale: 6, jpeg: 95, webp: 95, pngCompression: 2 },
    '6k': { scale: 8, jpeg: 98, webp: 98, pngCompression: 1 },
}
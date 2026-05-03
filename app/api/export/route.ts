import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { QUALITY_PRESETS, type ExportFormat, type QualityPreset } from '@/types/export/types';

function isValidFormat(format: string): format is ExportFormat {
    return format === 'png' || format === 'jpeg' || format === 'webp';
}

function isValidQualityPreset(preset: string): preset is QualityPreset {
    return ['low', 'medium', 'high', '2k', '4k', '6k'].includes(preset);
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;
        const format = (formData.get('format') as string | null) ?? 'png';
        const qualityPreset = formData.get('qualityPreset') as string | null;

        if (!imageFile) {
            return NextResponse.json({ error: 'Missing image file' }, { status: 400 });
        }

        if (!isValidFormat(format)) {
            return NextResponse.json(
                { error: 'Invalid format. Must be "png", "jpeg", or "webp"' },
                { status: 400 }
            );
        }

        if (!qualityPreset || !isValidQualityPreset(qualityPreset)) {
            return NextResponse.json(
                { error: 'Invalid qualityPreset. Must be one of: low, medium, high, 2k, 4k, 6k' },
                { status: 400 }
            );
        }

        const inputBuffer = Buffer.from(await imageFile.arrayBuffer());
        const qualitySettings = QUALITY_PRESETS[qualityPreset];

        const sharpInstance = sharp(inputBuffer);
        let outputBuffer: Buffer;
        let mimeType: string;

        if (format === 'jpeg') {
            outputBuffer = await sharpInstance
                .flatten({ background: { r: 255, g: 255, b: 255 } })
                .jpeg({
                    quality: qualitySettings.jpeg,
                    mozjpeg: true,
                })
                .toBuffer();
            mimeType = 'image/jpeg';

        } else if (format === 'webp') {
            outputBuffer = await sharpInstance
                .webp({
                    quality: qualitySettings.webp,
                    effort: 4,
                })
                .toBuffer();
            mimeType = 'image/webp';

        } else {
            // PNG — lossless, compression only affects file size not quality
            outputBuffer = await sharpInstance
                .png({
                    compressionLevel: qualitySettings.pngCompression,
                    adaptiveFiltering: true,
                })
                .toBuffer();
            mimeType = 'image/png';
        }

        return new NextResponse(new Uint8Array(outputBuffer), {
            headers: {
                'Content-Type': mimeType,
                'Content-Length': outputBuffer.length.toString(),
                'Cache-Control': 'no-store',
            },
        });

    } catch (error) {
        console.error('Export API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process image' },
            { status: 500 }
        );
    }
}
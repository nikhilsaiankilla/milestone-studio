'use client'

import { forwardRef } from 'react'
import { TrendingUp, Users, DollarSign, Eye, Trophy, Tag, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TrustMRRStartup, TrustMRRCardTemplate, TrustMRRStyle } from '@/types/trustmrr'
import { centsToUSD, formatPercent, formatNumber } from '@/types/trustmrr'

interface TrustMRRCardCanvasProps {
    data: TrustMRRStartup
    template: TrustMRRCardTemplate
    style: TrustMRRStyle
    selectedGradient: string
    alignment: 'left' | 'center' | 'right'
    ratio: 'square' | 'landscape' | 'portrait'
    noiseEnabled: boolean
    borderRadius: number
}

const TrustMRRCardCanvas = forwardRef<HTMLDivElement, TrustMRRCardCanvasProps>(({
    data,
    template,
    style,
    selectedGradient,
    alignment,
    ratio,
    noiseEnabled,
    borderRadius,
}, ref) => {
    const ratioClass =
        ratio === 'landscape' ? 'aspect-[16/9]' :
            ratio === 'portrait' ? 'aspect-[9/16]' :
                'aspect-square'

    const alignClass =
        alignment === 'left' ? 'items-center justify-start text-left' :
            alignment === 'right' ? 'items-center justify-end text-right' :
                'items-center justify-center text-center'

    const isImageBg = /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(selectedGradient) || selectedGradient.startsWith('/')

    return (
        <div
            ref={ref}
            className={cn('w-full overflow-hidden flex relative p-8', ratioClass, alignClass)}
            style={{ borderRadius }}
        >
            {/* Background */}
            {isImageBg ? (
                <img src={selectedGradient} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ borderRadius }} />
            ) : (
                <div className="absolute inset-0 pointer-events-none" style={{ background: selectedGradient, borderRadius }} />
            )}

            {/* Noise */}
            {noiseEnabled && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.18, borderRadius }}>
                    <filter id="tmrr-noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#tmrr-noise)" />
                </svg>
            )}

            {/* Watermark */}
            <p className="absolute z-20 left-4 bottom-3 text-[9px] font-semibold uppercase tracking-widest pointer-events-none"
                style={{ opacity: 0.25, color: style.textColor, letterSpacing: '0.12em', fontFamily: style.fontFamily }}>
                Verified · TrustMRR
            </p>

            {/* Handle */}
            {data.xHandle && (
                <p className="absolute right-6 bottom-5 z-10 font-semibold text-sm flex items-center gap-1"
                    style={{ color: style.textColor, fontFamily: style.fontFamily }}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width={14}
                        height={14}
                        style={
                            {
                                color: style.textColor
                            }
                        }
                    >
                        <path d="M18.244 2H21l-6.56 7.5L22 22h-6.828l-5.35-6.993L3.5 22H1l7.02-8.02L2 2h6.828l4.84 6.33L18.244 2Zm-2.394 18h1.885L8.16 4H6.155l9.695 16Z" />
                    </svg>
                    {data.xHandle}
                </p>
            )}

            {/* Startup icon */}
            {data?.icon && (
                <img
                    src={data?.icon}
                    alt={data?.name}
                    className="absolute top-5 right-6 z-10 rounded-lg object-contain"
                    style={{ width: 32, height: 32, opacity: 0.85 }}
                    crossOrigin="anonymous"
                />
            )}

            {/* Card content */}
            <div className="relative z-10 w-full">
                <CardContent data={data} template={template} style={style} alignment={alignment} />
            </div>
        </div>
    )
})

TrustMRRCardCanvas.displayName = 'TrustMRRCardCanvas'
export default TrustMRRCardCanvas

// Card content
interface ContentProps {
    data: TrustMRRStartup
    template: TrustMRRCardTemplate
    style: TrustMRRStyle
    alignment: 'left' | 'center' | 'right'
}

function CardContent({ data, template, style, alignment }: ContentProps) {
    const { textColor, fontFamily, valueSize, labelSize } = style

    const alignItems =
        alignment === 'left' ? 'items-start' :
            alignment === 'right' ? 'items-end' :
                'items-center'

    const textAlign =
        alignment === 'left' ? 'text-left' :
            alignment === 'right' ? 'text-right' :
                'text-center'

    const Label = ({ children }: { children: React.ReactNode }) => (
        <span
            className={cn('font-bold uppercase opacity-50', textAlign)}
            style={{ color: textColor, fontFamily, fontSize: labelSize, letterSpacing: '0.22em' }}
        >
            {children}
        </span>
    )

    const BigNumber = ({ children }: { children: React.ReactNode }) => (
        <span
            className="font-black leading-none"
            style={{
                color: textColor,
                fontFamily,
                fontSize: valueSize,
                textShadow: `0 0 40px ${textColor}44`,
            }}
        >
            {children}
        </span>
    )

    const Sub = ({ children }: { children: React.ReactNode }) => (
        <span
            className="font-semibold opacity-60"
            style={{ color: textColor, fontFamily, fontSize: Math.max(labelSize + 2, 13) }}
        >
            {children}
        </span>
    )

    const StartupName = () => (
        <p
            className="font-bold opacity-40 uppercase tracking-widest mb-2"
            style={{ color: textColor, fontFamily, fontSize: Math.max(labelSize - 1, 10) }}
        >
            {data.name}
        </p>
    )

    const IconRow = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
        <div className="flex items-center gap-2 opacity-60 mb-1">
            <Icon size={labelSize + 4} style={{ color: textColor }} />
            <Label>{label}</Label>
        </div>
    )

    switch (template) {

        case 'mrr':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={DollarSign} label="Monthly Recurring Revenue" />
                    <BigNumber>{centsToUSD(data.revenue.mrr)}</BigNumber>
                    {data.growthMRR30d !== null && (
                        <Sub>{formatPercent(data.growthMRR30d)} MRR growth this month</Sub>
                    )}
                </div>
            )

        case 'revenue30d':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={BarChart2} label="Revenue · Last 30 Days" />
                    <BigNumber>{centsToUSD(data.revenue.last30Days)}</BigNumber>
                    {data.growth30d !== null && (
                        <Sub>{formatPercent(data.growth30d)} vs previous month</Sub>
                    )}
                </div>
            )

        case 'totalRevenue':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={DollarSign} label="All-Time Revenue" />
                    <BigNumber>{centsToUSD(data.revenue.total)}</BigNumber>
                    {data.foundedDate && (
                        <Sub>Since {new Date(data.foundedDate).getFullYear()}</Sub>
                    )}
                </div>
            )

        case 'customers':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={Users} label="Customers" />
                    <BigNumber>{formatNumber(data.customers)}</BigNumber>
                    <Sub>{formatNumber(data.activeSubscriptions)} active subscriptions</Sub>
                </div>
            )

        case 'growth':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={TrendingUp} label="Revenue Growth" />
                    <BigNumber>{formatPercent(data.growth30d)}</BigNumber>
                    <Sub>Last 30 days · {centsToUSD(data.revenue.last30Days)} revenue</Sub>
                </div>
            )

        case 'visitors':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={Eye} label="Visitors · Last 30 Days" />
                    <BigNumber>{formatNumber(data.visitorsLast30Days ?? 0)}</BigNumber>
                    {data.revenuePerVisitor !== null && (
                        <Sub>${data.revenuePerVisitor.toFixed(2)} revenue per visitor</Sub>
                    )}
                </div>
            )

        case 'rank':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={Trophy} label="TrustMRR Rank" />
                    <BigNumber>#{data.rank}</BigNumber>
                    <Sub>By revenue among all verified startups</Sub>
                </div>
            )

        case 'forSale':
            return (
                <div className={cn('flex flex-col gap-2', alignItems)}>
                    <StartupName />
                    <IconRow icon={Tag} label={`Acquiring ${data.name}`} />
                    <BigNumber>{centsToUSD(data.askingPrice ?? 0)}</BigNumber>
                    {data.multiple !== null && (
                        <Sub>{data.multiple.toFixed(1)}x revenue multiple</Sub>
                    )}
                </div>
            )

        default:
            return null
    }
}
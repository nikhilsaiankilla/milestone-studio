"use client"

import { useCallback, useState } from "react"
import { Sidebar, SidebarContent } from "./ui/sidebar"
import { CATEGORIES, TEMPLATES, TemplateDef, CardConfig, PLATFORMS, Platform } from "@/types/card"
import { isLight, fmtNum } from "@/app/page"
import Product from "./product"

type Props = {
    config: CardConfig
    onChange: (config: CardConfig) => void
    onTemplateChange: (tpl: TemplateDef) => void
    activeTemplateId: string
}

const RightSidebarEditor = ({ config, onChange, onTemplateChange, activeTemplateId }: Props) => {
    const [category, setCategory] = useState("All")

    const applyTemplate = useCallback((tpl: TemplateDef) => {
        const c = tpl.cfg

        // Apply all template cfg fields on top of current config,
        // then seed each dynamic field's default value so inputs aren't blank
        const fieldDefaults: Partial<CardConfig> = {}
        for (const field of tpl.fields) {
            const currentVal = config[field.key]
            // Only seed if the current config doesn't already have a value for this field
            // or if it's still using another template's value
            if (currentVal === undefined || currentVal === null || currentVal === '') {
                if (field.defaultValue !== undefined) {
                    (fieldDefaults as any)[field.key] = field.defaultValue
                }
            }
        }

        onChange({
            ...config,
            // Spread all cfg fields from template
            ...(c.platform !== undefined && { platform: c.platform }),
            ...(c.backgroundValue !== undefined && { backgroundValue: c.backgroundValue }),
            ...(c.noiseOpacity !== undefined && { noiseOpacity: c.noiseOpacity }),
            ...(c.showDivider !== undefined && { showDivider: c.showDivider }),
            ...(c.showPlatformBadge !== undefined && { showPlatformBadge: c.showPlatformBadge }),
            ...(c.cardBorderRadius !== undefined && { cardBorderRadius: c.cardBorderRadius }),
            ...(c.cardMode !== undefined && { cardMode: c.cardMode }),
            ...(c.aspectRatio !== undefined && { aspectRatio: c.aspectRatio }),
            ...(c.accentColor !== undefined && { accentColor: c.accentColor }),
            ...(c.storyProgress !== undefined && { storyProgress: c.storyProgress }),
            ...(c.currencyPrefix !== undefined && { currencyPrefix: c.currencyPrefix }),
            ...(c.autoFormatNumber !== undefined && { autoFormatNumber: c.autoFormatNumber }),
            ...(c.growthLabel !== undefined && { growthLabel: c.growthLabel }),
            ...(c.unit !== undefined && { unit: c.unit }),
            ...(c.milestone !== undefined && { milestone: c.milestone }),
            ...(c.milestoneBefore !== undefined && { milestoneBefore: c.milestoneBefore }),
            ...(c.milestoneGoal !== undefined && { milestoneGoal: c.milestoneGoal }),
            ...(c.goalLabel !== undefined && { goalLabel: c.goalLabel }),
            ...(c.showLiveBadge !== undefined && { showLiveBadge: c.showLiveBadge }),
            ...(c.message !== undefined && { message: c.message }),
            ...(c.mStyle !== undefined && { mStyle: c.mStyle }),
            ...(c.unitStyle !== undefined && { unitStyle: c.unitStyle }),
            ...(c.messageStyle !== undefined && { messageStyle: c.messageStyle }),
            // Seed field defaults (only for missing values)
            ...fieldDefaults,
        })

        onTemplateChange(tpl)
    }, [config, onChange, onTemplateChange])

    const filtered = category === "All" ? TEMPLATES : TEMPLATES.filter(t => t.category === category)

    return (
        <Sidebar
            collapsible="none"
            className="w-[300px] min-w-[300px] max-w-[300px] lg:h-[calc(100vh-56px)] lg:sticky lg:top-14 overflow-y-auto border-l border-white/[0.05]"
            style={{ background: "#0a0c10" }}
        >
            <SidebarContent>
                <Product />
                {/* Header */}
                <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Templates</p>
                    <div className="flex flex-wrap gap-1">
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setCategory(cat)}
                                className="px-2.5 py-1 rounded-full cursor-pointer border-none text-[9px] font-semibold transition-all tracking-wide"
                                style={{
                                    background: category === cat ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                                    color: category === cat ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                                }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="p-3 grid grid-cols-2 gap-2">
                    {filtered.map(tpl => (
                        <MiniCard
                            key={tpl.id}
                            tpl={tpl}
                            active={activeTemplateId === tpl.id}
                            onClick={() => applyTemplate(tpl)}
                        />
                    ))}
                </div>
            </SidebarContent>
        </Sidebar>
    )
}

export default RightSidebarEditor

/* ── MiniCard ── */
function MiniCard({ tpl, active, onClick }: { tpl: TemplateDef; active: boolean; onClick: () => void }) {
    const [hovered, setHovered] = useState(false)
    const c = tpl.cfg
    const light = isLight(c.backgroundValue)
    const sec = light ? "#777" : "#666"
    const pri = light ? "#111" : "#fff"
    const ms = c.mStyle
    const mColor = ms?.color || pri

    const displayVal = c.autoFormatNumber
        ? fmtNum(c.milestone || "10K", true, c.currencyPrefix || "")
        : (c.currencyPrefix || "") + (c.milestone || "10K")

    const mode = c.cardMode || "standard"

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                all: "unset", cursor: "pointer", display: "block", width: "100%",
                borderRadius: 10, overflow: "hidden", position: "relative",
                border: active
                    ? "2px solid rgba(255,255,255,0.35)"
                    : hovered ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(255,255,255,0.05)",
                boxShadow: active
                    ? "0 0 0 3px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.5)"
                    : "0 2px 8px rgba(0,0,0,0.3)",
                transform: active ? "scale(1.03)" : hovered ? "scale(1.01)" : "scale(1)",
                transition: "all 0.18s ease",
            }}>

            {/* Card face */}
            <div style={{
                aspectRatio: "1/1",
                background: c.backgroundValue,
                padding: "11%",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                position: "relative", overflow: "hidden", boxSizing: "border-box",
            }}>
                {/* TikTok duotone */}
                {mode === "tiktokDuotone" && (
                    <>
                        <div style={{ position: "absolute", inset: 0, background: "#fe2c55", opacity: 0.5, transform: "translate(2px,-1px)", mixBlendMode: "screen", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", inset: 0, background: "#25f4ee", opacity: 0.4, transform: "translate(-2px,1px)", mixBlendMode: "screen", pointerEvents: "none" }} />
                    </>
                )}

                {/* Story bar */}
                {mode === "story" && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: "rgba(255,255,255,0.12)" }}>
                        <div style={{ height: "100%", width: `${c.storyProgress || 70}%`, background: c.accentColor || "#00ff87" }} />
                    </div>
                )}

                {/* Slot machine preview */}
                {mode === "slotMachine" ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
                        <div style={{ textAlign: "center", opacity: 0.22, fontSize: Math.min((ms?.size || 56) * 0.12, 11), fontFamily: ms?.family, fontWeight: ms?.weight, color: "#fff", lineHeight: 1.3 }}>
                            {c.milestoneBefore || "8K"}
                        </div>
                        <div style={{ height: 0.5, background: "rgba(255,255,255,0.1)", margin: "2px 0" }} />
                        <div style={{ textAlign: "center", fontSize: Math.min((ms?.size || 56) * 0.19, 22), fontFamily: ms?.family, fontWeight: ms?.weight, color: "#fff", lineHeight: 1 }}>
                            {displayVal}
                        </div>
                        <div style={{ height: 0.5, background: "rgba(255,255,255,0.1)", margin: "2px 0" }} />
                        <div style={{ textAlign: "center", opacity: 0.22, fontSize: Math.min((ms?.size || 56) * 0.12, 11), fontFamily: ms?.family, fontWeight: ms?.weight, color: "#fff", lineHeight: 1.3 }}>
                            {c.milestoneGoal || "15K"}
                        </div>
                    </div>

                ) : mode === "progressTarget" ? (
                    <>
                        <div style={{ fontSize: 6, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.55)", position: "relative", zIndex: 2 }}>
                            {PLATFORMS[(c.platform || "producthunt") as Platform]?.label}
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
                            <div style={{ fontFamily: ms?.family, fontWeight: ms?.weight, fontSize: Math.min((ms?.size || 88) * 0.19, 22), color: mColor, lineHeight: 1 }}>
                                {displayVal}
                            </div>
                            <div style={{ fontSize: 5.5, color: sec, marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>{c.unit || "upvotes"}</div>
                            <div style={{ marginTop: 4, height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1, overflow: "hidden" }}>
                                <div style={{
                                    height: "100%",
                                    width: `${c.milestone && c.milestoneGoal ? Math.min(100, Math.round((parseFloat(c.milestone) / parseFloat(c.milestoneGoal)) * 100)) : 83}%`,
                                    background: "#fff", borderRadius: 1,
                                }} />
                            </div>
                        </div>
                    </>

                ) : (
                    <>
                        {/* Badge */}
                        {c.showPlatformBadge ? (
                            <div style={{ textAlign: ms?.align || "left", position: "relative", zIndex: 2 }}>
                                <div style={{ fontSize: 6, textTransform: "uppercase", letterSpacing: 2, color: sec, opacity: 0.7 }}>
                                    {PLATFORMS[(c.platform || "twitter") as Platform]?.label}
                                </div>
                            </div>
                        ) : <div />}

                        {/* Number */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
                            <div style={{
                                fontFamily: ms?.family, fontWeight: ms?.weight,
                                fontSize: Math.min((ms?.size || 88) * 0.19, 24),
                                letterSpacing: ((ms?.spacing || 0) * 0.22),
                                color: mColor, lineHeight: 1,
                                textAlign: ms?.align || "left",
                            }}>
                                {mode === "beforeAfter" ? `${c.milestoneBefore || "0"} →` : displayVal}
                            </div>
                            <div style={{ fontSize: 5.5, color: sec, marginTop: 2, textTransform: "uppercase", letterSpacing: 1.5, textAlign: ms?.align || "left", opacity: 0.8 }}>
                                {c.unit || "followers"}
                            </div>
                        </div>

                        {/* Bottom */}
                        <div style={{ position: "relative", zIndex: 2 }}>
                            {c.showDivider && <div style={{ height: 1, background: light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", marginBottom: 4 }} />}
                            <div style={{ fontSize: 5, color: sec, opacity: 0.6 }}>@handle</div>
                        </div>
                    </>
                )}
            </div>

            {/* Label overlay */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)",
                padding: "22px 8px 7px",
                display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            }}>
                <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>{tpl.name}</div>
                    <div style={{ fontSize: 6.5, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{tpl.desc}</div>
                </div>
                <span style={{ fontSize: 12 }}>{tpl.emoji}</span>
            </div>

            {/* Active check */}
            {active && (
                <div style={{
                    position: "absolute", top: 6, right: 6,
                    background: "rgba(255,255,255,0.9)", borderRadius: "50%",
                    width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, color: "#000", fontWeight: 900,
                }}>✓</div>
            )}
        </button>
    )
}
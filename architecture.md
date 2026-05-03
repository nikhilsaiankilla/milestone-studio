# Milestone Studio Architecture

> **Last Updated:** May 3, 2026  
> **Version:** 0.1.0  
> **Status:** Production-Ready Client-Side Editor

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Directory Structure](#directory-structure)
4. [System Architecture](#system-architecture)
5. [Component Architecture](#component-architecture)
6. [Data Flow & State Management](#data-flow--state-management)
7. [API Layer & Routes](#api-layer--routes)
8. [Type System](#type-system)
9. [Hooks & Services](#hooks--services)
10. [Styling System](#styling-system)
11. [Export Pipeline](#export-pipeline)
12. [Configuration](#configuration)
13. [Current Constraints](#current-constraints)
14. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

**Milestone Studio** is a real-time, client-side editor for creating shareable milestone cards. Users design custom metric visualizations with multiple templates, typography controls, gradient backgrounds, emoji decorations, and platform branding—then export high-quality PNG files for social sharing.

### Key Capabilities

- **4 Card Templates**: Metrics grid, Milestone (stacked numbers), Progress bar/circle, List view
- **Rich Customization**: Gradients, fonts, alignment, aspect ratios, emoji overlays, noise effects
- **Quality Export**: 6 quality presets (Low–6K) with real-time progress
- **Multi-Format**: Download to file or copy to clipboard
- **Cross-Platform**: Branded with Twitter, LinkedIn, Instagram, GitHub handles
- **UX Enhancements**: Undo/redo, confetti celebration, support prompts, dark mode

### Architecture Type

- **Client-Heavy**: All editing logic runs in the browser (React)
- **No Backend State**: Session-based editing (lost on refresh)
- **Stateless Server**: Next.js server only handles metadata + optional compression API
- **Export Pipeline**: domToPng (client) → Sharp compression (optional server API) → PNG download/clipboard

---

## 🛠️ Technology Stack

### Core Framework

| Package      | Version | Purpose                     |
| ------------ | ------- | --------------------------- |
| `next`       | 16.2.4  | React framework, App Router |
| `react`      | 19.2.4  | UI library                  |
| `react-dom`  | 19.2.4  | React DOM rendering         |
| `typescript` | ^5      | Type safety                 |

### Styling & UI

| Package                    | Version | Purpose                            |
| -------------------------- | ------- | ---------------------------------- |
| `tailwindcss`              | ^4      | Utility-first CSS                  |
| `shadcn`                   | ^4.4.0  | Headless UI components             |
| `class-variance-authority` | ^0.7.1  | Component variant system           |
| `clsx`                     | ^2.1.1  | Conditional class merging          |
| `tailwind-merge`           | ^3.5.0  | Tailwind class conflict resolution |
| `tw-animate-css`           | ^1.4.0  | Animation library                  |

### Export & Capture

| Package             | Version | Purpose                         |
| ------------------- | ------- | ------------------------------- |
| `modern-screenshot` | ^4.7.0  | DOM to PNG capture (`domToPng`) |
| `html2canvas`       | ^1.4.1  | Alternative canvas rendering    |

### UX & Interaction

| Package              | Version  | Purpose                       |
| -------------------- | -------- | ----------------------------- |
| `sonner`             | ^2.0.7   | Toast notifications           |
| `canvas-confetti`    | ^1.9.4   | Confetti animation on success |
| `emoji-picker-react` | ^4.19.1  | Emoji selection UI            |
| `framer-motion`      | ^12.38.0 | Animation framework           |

### Icons & Media

| Package        | Version | Purpose                 |
| -------------- | ------- | ----------------------- |
| `lucide-react` | ^1.9.0  | Icon library            |
| `twemoji`      | ^14.0.2 | Twitter emoji rendering |

### Theming & Analytics

| Package             | Version | Purpose                 |
| ------------------- | ------- | ----------------------- |
| `next-themes`       | ^0.4.6  | Dark/light mode support |
| `@vercel/analytics` | ^2.0.1  | Analytics integration   |

---

## 📂 Directory Structure & File Mapping

```
milestone-studio/
├── 📄 app/                      ← Next.js App Router
│   ├── layout.tsx               ← 🏗️ Root (metadata, fonts, Toaster)
│   ├── page.tsx                 ← 🎯 Home → Dashboard
│   ├── globals.css              ← Global styles + design tokens
│   ├── robots.ts, sitemap.ts     ← SEO configuration
│   └── api/export/route.ts      ← POST /api/export (Sharp compression)
│
├── 📁 components/
│   ├── dashboard.tsx            ← 🎯 ORCHESTRATOR (main state owner)
│   ├── dashboard/
│   │   ├── CardCanvas.tsx       ← 🎨 Card renderer (forwardRef export target)
│   │   ├── LeftPanel.tsx        ← 📝 Controls: templates, metrics, export
│   │   ├── RightPanel.tsx       ← 🎨 Controls: gradient, alignment, noise
│   │   ├── DashboardNav.tsx     ← Top: logo, shortcuts, GitHub
│   │   └── MetricTypographyPanel.tsx ← Per-metric typography
│   └── ui/                       ← shadcn/ui components (12 total)
│
├── 📁 hooks/
│   ├── useExport.ts             ← Export state + download/copy
│   ├── useSupportPrompt.ts      ← Support prompt timing
│   └── use-mobile.ts            ← Responsive detection
│
├── 📁 lib/
│   ├── export-service.ts        ← 🎯 PNG capture + Sharp API
│   └── utils.ts                 ← cn() helper
│
├── 📁 types/
│   ├── index.ts                 ← Core types
│   └── export/types.ts          ← Export types
│
├── 📁 constants/
│   ├── templates.tsx            ← 4 templates
│   ├── gradients-bg.tsx         ← 30+ gradients
│   ├── platforms.tsx            ← Platforms (X, LinkedIn, etc.)
│   ├── fonts.ts, icons.tsx      ← Fonts + Icons
│
├── package.json, tsconfig.json, tailwind.config.mjs
├── ARCHITECTURE.md, AGENTS.md, README.md
└── public/                      ← Static assets
```

---

## 🏛️ System Architecture

### Data Flow (User Action → Export)

```
User Interaction (LeftPanel/RightPanel)
         ↓
Dashboard State Update (setState)
         ↓
Props Passed to CardCanvas + Panels
         ↓
CardCanvas Re-renders (instant preview)
         ↓
User Clicks Export
         ↓
useExport Hook (captureCard)
         ↓
export-service.ts
  1. Double RAF flush
  2. domToPng(element, scale)
  3. Send to /api/export
  4. Sharp compress
  5. Return optimized PNG
         ↓
Download or Copy to Clipboard
         ↓
Confetti + Toast + Support Prompt
```

### State Hierarchy

```
Dashboard (Root State Owner)
├── Template Config
│   ├── active: 'metrics' | 'milestone' | 'progress' | 'list'
│   ├── progressType: 'bar' | 'circle'
│   └── borderRadius: number
├── Content
│   ├── metrics: Metric[]
│   ├── activeMetricIndex: number
│   ├── platform: PlatformType | null
│   ├── handle: string
│   └── handleTextColor: string
├── Styling
│   ├── selectedGradient: string
│   ├── alignment: 'left' | 'center' | 'right'
│   ├── ratio: 'square' | 'landscape' | 'portrait'
│   └── noiseEnabled: boolean
├── Emoji
│   ├── selectedEmoji: string | null
│   ├── selectedEmojiUrl: string | null
│   ├── emojiCount: number
│   └── emojiPositions: EmojiPosition[] (computed)
└── Export (from useExport hook)
    ├── quality: QualityPreset
    ├── downloading: boolean
    ├── downloadProgress: number
    └── copyProgress: number
```

---

## 🎯 Component Architecture
milestone-studio/
├── 📄 ARCHITECTURE.md          ← You are here
├── 📄 AGENTS.md                ← Agent customization rules
├── 📄 CLAUDE.md                ← Claude-specific instructions
├── 📄 ADDING_TEMPLATE.md       ← Guide for adding new templates
├── 📄 package.json             ← Dependencies & scripts
├── 📄 next.config.ts           ← Next.js configuration
├── 📄 tsconfig.json            ← TypeScript configuration
├── 📄 tailwind.config.mjs       ← Tailwind CSS config
├── 📄 postcss.config.mjs        ← PostCSS config
├── 📄 eslint.config.mjs         ← ESLint rules
├── 📄 components.json           ← shadcn UI config
│
├── 📁 app/                      ← Next.js App Router
│   ├── 📄 layout.tsx            ← Root shell (metadata, fonts, Toaster, Analytics)
│   ├── 📄 page.tsx              ← Home route (renders Dashboard)
│   ├── 📄 globals.css           ← Global styles
│   ├── 📄 robots.ts             ← SEO robots.txt
│   ├── 📄 sitemap.ts            ← SEO sitemap
│   └── 📁 api/
│       └── 📁 export/
│           └── 📄 route.ts       ← Export API (future: server-side compression)
│
├── 📁 components/               ← React components
│   ├── 📄 dashboard.tsx         ← 🎯 ORCHESTRATOR (main state owner)
│   ├── 📄 product.tsx           ← Product showcase/CTA
│   ├── 📄 structured-data.tsx    ← SEO structured data
│   ├── 📄 SupportDialog.tsx      ← Feedback/support modal
│   ├── 📄 theme-switch.tsx       ← Dark/light mode toggle
│   │
│   ├── 📁 dashboard/             ← Dashboard sub-components
│   │   ├── 📄 LeftPanel.tsx      ← 🎯 Left controls (templates, metrics, emoji, export)
│   │   ├── 📄 RightPanel.tsx     ← Right controls (gradient, alignment, ratio, noise)
│   │   ├── 📄 CardCanvas.tsx     ← 🎯 Center preview (export target)
│   │   ├── 📄 DashboardNav.tsx   ← Top navigation bar (logo, shortcuts, GitHub)
│   │   ├── 📄 MetricTypographyPanel.tsx ← Per-metric typography editor
│   │
│   └── 📁 ui/                    ← shadcn UI components
│       ├── 📄 button.tsx         ← Reusable button
│       ├── 📄 dialog.tsx         ← Modal dialog
│       ├── 📄 input.tsx          ← Text input
│       ├── 📄 label.tsx          ← Form label
│       ├── 📄 select.tsx         ← Dropdown selector
│       ├── 📄 slider.tsx         ← Range slider
│       ├── 📄 switch.tsx         ← Toggle switch
│       ├── 📄 skeleton.tsx        ← Loading skeleton
│       ├── 📄 sonner.tsx          ← Toast provider
│       ├── 📄 separator.tsx       ← Divider
│       ├── 📄 sheet.tsx           ← Side drawer
│       ├── 📄 tooltip.tsx         ← Tooltip popover
│       └── 📄 kbd.tsx             ← Keyboard key display
│
├── 📁 hooks/                    ← Custom React hooks
│   ├── 📄 useExport.ts          ← 🎯 Export state & actions (download/copy with progress)
│   ├── 📄 useSupportPrompt.ts    ← Support prompt timing logic
│   └── 📄 use-mobile.ts         ← Mobile breakpoint detection
│
├── 📁 lib/                      ← Utilities & services
│   ├── 📄 utils.ts              ← Tailwind class merger (cn function)
│   └── 📄 export-service.ts     ← 🎯 Capture & compression (domToPng + Sharp)
│
├── 📁 types/                    ← TypeScript type definitions
│   ├── 📄 index.ts              ← Core types (Metric, MetricStyle, EmojiPosition, etc.)
│   └── 📁 export/
│       └── 📄 types.ts           ← Export types (QualityPreset, ExportFormat)
│
├── 📁 constants/                ← Static data & configuration
│   ├── 📄 platforms.tsx         ← 7 platform definitions (X, Instagram, LinkedIn, etc.)
│   ├── 📄 templates.tsx         ← 4 template definitions (Metrics, Milestone, Progress, List)
│   ├── 📄 fonts.ts              ← Font configurations
│   ├── 📄 gradients-bg.tsx       ← Gradient color mappings
│   └── 📄 icons.tsx             ← Platform SVG icons
│
└── 📁 public/                   ← Static assets
    ├── 📄 site.webmanifest      ← PWA manifest
    └── 📁 pattern/              ← Background patterns
```

---

### 🎯 `components/dashboard.tsx` — Orchestrator (State Owner)

**Role**: Central state management and coordination

**Key State**:

| State                               | Type                                               | Purpose                   |
| ----------------------------------- | -------------------------------------------------- | ------------------------- |
| `active`                            | `'metrics' \| 'milestone' \| 'progress' \| 'list'` | Template mode             |
| `metrics`                           | `Metric[]`                                         | Array of metric cards     |
| `activeMetricIndex`                 | `number`                                           | Currently editing metric  |
| `platform`                          | `PlatformType \| null`                             | Selected platform         |
| `handle`                            | `string`                                           | Platform handle text      |
| `selectedGradient`                  | `string`                                           | Background gradient       |
| `alignment`                         | `'left' \| 'center' \| 'right'`                    | Text alignment            |
| `ratio`                             | `'square' \| 'landscape' \| 'portrait'`            | Aspect ratio              |
| `noiseEnabled`                      | `boolean`                                          | Noise overlay toggle      |
| `selectedEmoji`, `selectedEmojiUrl` | `string \| null`                                   | Emoji + URL               |
| `emojiCount`                        | `number`                                           | Emoji scatter density     |
| `progressType`                      | `'bar' \| 'circle'`                                | Progress template variant |
| `handleTextColor`                   | `string`                                           | Platform watermark color  |

**Key Methods**:

- `handleAddMetric()` – Add new metric with defaults
- `handleRemoveMetric(index)` – Remove metric
- `updateMetric(index, delta)` – Update metric properties
- `handleEmojiSelect(emoji, url)` – Set emoji + URL (keep in sync)
- Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Y` (redo), `Ctrl+Shift+Z` (randomize)

**Child Components**:

- `LeftPanel` – Data/export controls
- `CardCanvas` – Live preview (forwardRef export target)
- `RightPanel` – Style controls
- `DashboardNav` – Header navigation

### 📝 `components/dashboard/LeftPanel.tsx` — Data & Export Controls

**Sections**:

1. **Template Picker** – 4 buttons (Metrics, Milestone, Progress, List)
2. **Platform & Handle** – Platform dropdown + handle text input + color picker
3. **Metrics Editor** – 
   - Add/Remove buttons
   - Per-metric tabs: icon picker, value, label
   - Inline `MetricTypographyPanel` (font, size, color, style)
4. **Emoji Section** – Emoji picker + density slider
5. **Export Controls** – Quality buttons (Low, Med, High, 2K, 4K, 6K) + Download/Copy with progress

**Events**: Updates trigger `Dashboard` state via props callbacks

---

### 🎨 `components/dashboard/CardCanvas.tsx` — Live Preview

**Role**: Renders card preview + export capture target (forwardRef)

**Templates Supported**:

| Template    | Layout          | Components                        |
| ----------- | --------------- | --------------------------------- |
| `metrics`   | Multi-row grid  | Icon + Value + Label per metric   |
| `milestone` | Stacked numbers | Large primary + secondary + label |
| `progress`  | Bar or circle   | Progress indicator + percentage   |
| `list`      | Flex grid       | Compact metric cells              |

**Layers** (bottom to top):

1. Gradient background
2. Noise overlay (if enabled)
3. Template content (metrics/milestone/progress/list)
4. Emoji scatter (layered by depth)
5. Platform watermark (if handle + platform)

---

### 🎨 `components/dashboard/RightPanel.tsx` — Style Controls

**Sections**:

1. **Noise Toggle** – Enable/disable background noise
2. **Alignment Buttons** – Left, Center, Right
3. **Gradient Palette** – Categorized gradients (click to select)
4. **Ratio Buttons** – Square (1:1), Landscape (16:9), Portrait (9:16)
5. **Randomize Button** – Shuffle all styles

---

### 🧭 `components/dashboard/DashboardNav.tsx` — Header

- Logo + project title
- Undo/Redo buttons + keyboard hints
- GitHub link + live star count
- Support/feedback button

---

### 🔤 `components/dashboard/MetricTypographyPanel.tsx` — Per-Metric Typography

**Controls**:

- Icon size slider (16–64px)
- Value size (24–96px), bold/italic toggles
- Label size (10–28px), bold/italic toggles
- Font family dropdown
- Text color picker
- Text shadow (X, Y, blur)

---

## 📊 Data Flow & State Management

### Unidirectional Flow

```
User Input (LeftPanel/RightPanel)
  ↓
Dashboard Handler (setState)
  ↓
State Updated
  ↓
Props → CardCanvas + Panels
  ↓
Components Re-render
  ↓
Live Preview Updates (instant)
```

### Storage & Persistence

| Data                   | Storage      | Scope         | Persistence     |
| ---------------------- | ------------ | ------------- | --------------- |
| Metrics                | React state  | Session       | Lost on refresh |
| Styles                 | React state  | Session       | Lost on refresh |
| Support prompt cadence | LocalStorage | Cross-session | Remembered      |
| Theme preference       | LocalStorage | Cross-session | Remembered      |

---

## 🔌 API Layer & Routes

### `app/api/export/route.ts` — Image Compression

**Endpoint**: `POST /api/export`

**Purpose**: Server-side PNG optimization (Sharp)

**Request** (FormData):

```
image: File          // PNG blob from domToPng()
format: string       // 'png' | 'jpeg' | 'webp'
qualityPreset: string  // 'low' | 'medium' | 'high' | '2k' | '4k' | '6k'
```

**Response**:

```json
{ "optimized": "data:image/png;base64,..." }
```

**Processing**:

- Reads PNG buffer from request
- Applies quality-specific compression (JPEG quality, PNG compression level)
- Returns optimized base64 data URL

---

## 🔤 Type System

### `types/index.ts` — Core Types

```typescript
// Per-metric styling
interface MetricStyle {
  showIcon: boolean
  iconSize: number        // 16–64px
  valueSize: number       // 24–96px
  valueBold: boolean
  valueItalic: boolean
  labelSize: number       // 10–28px
  labelBold: boolean
  labelItalic: boolean
  fontFamily: string
  textColor: string
  textShadowEnabled: boolean
  textShadowX: number     // -20 to 20
  textShadowY: number
  textShadowBlur: number  // 0 to 40
}

// Single metric card
interface Metric {
  id: string              // UUID
  value: string
  label: string
  icon: MetricIconKey
  style: MetricStyle
  showIcon: boolean
}

// Emoji position in scatter
type EmojiPosition = {
  id: number
  x: number               // 0–100%
  y: number
  size: number            // 16–128px
  opacity: number         // 0–1
  rotation: number        // -180 to 180°
  blur: number            // 0–20px
}
```

### `types/export/types.ts` — Export Types

```typescript
type QualityPreset = 'low' | 'medium' | 'high' | '2k' | '4k' | '6k'
type ExportFormat = 'png' | 'jpeg' | 'webp'

const QUALITY_PRESETS: Record<QualityPreset, QualitySettings> = {
  low:    { scale: 1, jpeg: 60, webp: 60, pngCompression: 9 },
  medium: { scale: 2, jpeg: 75, webp: 75, pngCompression: 7 },
  high:   { scale: 3, jpeg: 88, webp: 88, pngCompression: 6 },
  '2k':   { scale: 4, jpeg: 92, webp: 92, pngCompression: 4 },
  '4k':   { scale: 6, jpeg: 95, webp: 95, pngCompression: 2 },
  '6k':   { scale: 8, jpeg: 98, webp: 98, pngCompression: 1 },
}
```

---

## 🪝 Hooks & Services

### `hooks/useExport.ts` — Export State & Handlers

**State**:

```typescript
quality: QualityPreset            // Current quality preset
downloading: boolean               // Download in progress
copying: boolean                  // Copy in progress
downloadProgress: number          // 0–100
copyProgress: number              // 0–100
```

**Methods**:

- `handleDownload(cardElement)` – Capture → Download → Confetti
- `handleCopy(cardElement)` – Capture → Clipboard → Toast

**Progress Animation**: RAF-based smooth animator (not linear)

---

### `lib/export-service.ts` — PNG Capture & Compression

**captureCard(element, { quality, onProgress })**:

1. Wait for double RAF (render flush)
2. Call `domToPng(element, { scale })`
3. Send PNG to `/api/export`
4. Report progress updates
5. Return optimized data URL

**Quality Presets**:

| Preset | Scale | Use Case          |
| ------ | ----- | ----------------- |
| Low    | 1x    | Quick preview     |
| Medium | 2x    | Twitter/Instagram |
| High   | 3x    | HD quality        |
| 2K     | 4x    | 2K displays       |
| 4K     | 6x    | Ultra HD          |
| 6K     | 8x    | Print/archival    |

---

### `hooks/useSupportPrompt.ts` — Modal Cadence

**Logic**:

- Tracks export count in LocalStorage
- Shows modal every 3rd export
- Supports temporary (session) and permanent (cross-session) dismiss

---

### `hooks/use-mobile.ts` — Responsive Detection

Returns `isMobile: boolean` (true if viewport < 768px)

---

### `lib/utils.ts` — Utilities

`cn(...args)`: Merge Tailwind classes, resolving conflicts (clsx + tailwind-merge)

### 🎯 `hooks/useExport.ts` — Export State & Actions

**Manages**: Export quality, progress animation, download/copy actions

**Key Functions**:

```typescript
export function useExport(): UseExportReturn {
    quality: QualityPreset                      // 'low' | 'medium' | 'high' | '2k' | '4k' | '6k'
    setQuality: (q: QualityPreset) => void
    downloading: boolean                        // True during download
    copying: boolean                            // True during copy
    downloadProgress: number                    // 0-100
    copyProgress: number                        // 0-100
    handleDownload: (element: HTMLElement | null) => Promise<void>
    handleCopy: (element: HTMLElement | null) => Promise<void>
}
```

**Internals**:
- Progress animation via RAF (requestAnimationFrame) for smooth updates
- Confetti fires only on successful download (not copy)
- Triggers `useSupportPrompt` after download
- Toasts on error

---

### `hooks/useSupportPrompt.ts` — Support Prompt Timing

**Purpose**: Show feedback/support dialog at appropriate times

**Logic**: 
- Tracks export count
- Shows prompt after Nth successful download
- Prevents spam by tracking last prompt time

---

### `hooks/use-mobile.ts` — Responsive Detection

**Purpose**: Detect mobile breakpoint for responsive UI

**Exports**: `const isMobile = useMobile()`

---

### 🎯 `lib/export-service.ts` — Capture & Compression

**Key Functions**:

```typescript
export async function captureCard(
    element: HTMLElement,
    options: CaptureOptions
): Promise<string> // Returns data URL
```

**Pipeline**:

```
1. Flush React renders (RAF double-frame)
   ↓
2. Capture DOM to PNG via domToPng (modern-screenshot)
   - Applies scale factor (1x to 6x for different presets)
   ↓
3. Send to backend Sharp compression
   - `/api/export` endpoint
   - Optimize PNG, reduce file size
   ↓
4. Return optimized data URL
   ↓
5. Download or copy to clipboard
```

**Quality Presets**:

| Preset   | Scale | Resolution | Use Case          |
| -------- | ----- | ---------- | ----------------- |
| `low`    | 1x    | 1080p      | Quick preview     |
| `medium` | 1.5x  | 1620p      | Twitter/Instagram |
| `high`   | 2x    | 2160p      | LinkedIn, HD      |
| `2k`     | 2.5x  | 2700p      | 2K displays       |
| `4k`     | 4x    | 4320p      | 4K monitors       |
| `6k`     | 6x    | 6480p      | Print, ultra-HD   |

---

### `lib/utils.ts` — Utilities

```typescript
// Merges Tailwind classes, resolving conflicts
export function cn(...inputs: ClassValue[]): string
```

---

## Export Pipeline

### High-Level Export Flow

```
┌─────────────────────────────────────┐
│  User Action: Download or Copy      │
└────────────────┬────────────────────┘
                 ▼
         useExport hook
                 ↓
        captureCard() [start]
                 ↓
    export-service.ts: domToPng()
         (client-side capture)
                 ↓
         POST /api/export
      (backend Sharp compress)
                 ↓
        Data URL returned
                 ↓
        ┌────────┴────────┐
        ▼                 ▼
   Download          Copy to clipboard
   (trigger)         (navigator.clipboard)
        ↓                 ↓
   confetti()          toast()
   toast()          (no confetti)
        ↓                 ↓
 useSupportPrompt  complete
   check
```

### Quality Scale Factors

- **low** (1x): Default capture size
- **medium** (1.5x): 50% larger
- **high** (2x): Double resolution
- **2k** (2.5x): 2.5x resolution
- **4k** (4x): 4x resolution
- **6k** (6x): 6x resolution

### Backend Compression (`/api/export`)

Currently uses Sharp for PNG optimization:
1. Reduce PNG palette if applicable
2. Apply lossless compression
3. Return optimized data URL

---

## Constants & Configuration

### 🎯 `constants/platforms.tsx` — Platform Definitions

**7 Platforms**:

```typescript
[
  { label: "X (Twitter)", value: "x", placeholder: "@your_handle", icon: ICONS.x },
  { label: "Instagram", value: "instagram", placeholder: "@username", icon: ICONS.instagram },
  { label: "LinkedIn", value: "linkedin", placeholder: "linkedin.com/in/username", icon: ICONS.linkedin },
  { label: "YouTube", value: "youtube", placeholder: "@channel", icon: ICONS.youtube },
  { label: "Product Hunt", value: "producthunt", placeholder: "@username", icon: ICONS.producthunt },
  { label: "GitHub", value: "github", placeholder: "@username", icon: ICONS.github },
  { label: "Medium", value: "medium", placeholder: "@username", icon: ICONS.medium },
]
```

### `constants/templates.tsx` — Template Definitions

**4 Templates**:

```typescript
[
  { id: "metrics", label: "Metrics", isPro: false, skeleton: <...> },
  { id: "milestone", label: "Milestone", isPro: true, skeleton: <...> },
  { id: "progress", label: "Progress", isPro: true, skeleton: <...> },
  { id: "list", label: "List", isPro: true, skeleton: <...> },
]
```

### `constants/gradients-bg.tsx` — Gradient Mappings

Organized by category:
- Vibrant
- Pastel
- Dark
- Sunset
- Neon

Each gradient can be:
- Solid color (hex code)
- CSS gradient (`linear-gradient(...)`)
- Image path (`/path/to/image.png`)

### `constants/fonts.ts` — Font Configuration

Maps Google Fonts to CSS variables:
- Playfair Display
- Space Grotesk
- Syne
- DM Sans
- Roboto
- Inter

### `constants/icons.tsx` — Platform SVG Icons

SVG icons for each platform (7 total)

---

---

## 🎨 Styling System

### `app/globals.css`

**Imports**:

```css
@import "tailwindcss";
@import "@tailwindcss/postcss";
/* shadcn/ui styles */
/* tw-animate-css animations */
```

**Design Tokens**: Colors, fonts, spacing (dark-first with light overrides)

**Font Variables** (from `app/layout.tsx`):
- --font-playfair, --font-space-grotesk, --font-syne, --font-dm-sans, --font-roboto, --font-inter

---

## 📤 Export Pipeline

### Export Sequence

```
User clicks Download/Copy → useExport hook
    ↓
captureCard(cardRef, { quality })
    ↓
1. Double RAF (render flush)
2. domToPng(element, scale) 
3. POST /api/export (Sharp compress)
4. Get optimized PNG data URL
    ↓
Download Path:
  - Create blob, trigger download
  - Toast + Confetti
  - Check support prompt
    OR
Copy Path:
  - Create blob, navigator.clipboard.write()
  - Toast (no confetti)
```

### Quality Presets

| Preset | Scale | Size   | Purpose        |
| ------ | ----- | ------ | -------------- |
| Low    | 1x    | ~50KB  | Preview        |
| Medium | 2x    | ~150KB | Social media   |
| High   | 3x    | ~300KB | Print-ready    |
| 2K     | 4x    | ~500KB | 2K displays    |
| 4K     | 6x    | ~1MB   | 4K monitors    |
| 6K     | 8x    | ~2MB   | Archival/Print |

---

## ⚙️ Configuration

### `tsconfig.json`
- Target: ES2017 | Module: ESNext | Strict: true | Path alias: `@/*` → root

### `eslint.config.mjs`
- Next.js core-web-vitals + TypeScript

### `tailwind.config.ts`
- Tailwind CSS v4 | Dark mode: class | Content: `./app/**/*`, `./components/**/*`

---

## ❌ Current Constraints

1. **No Backend State** – Session lost on refresh
2. **No Template Saving** – Can't save/load designs
3. **Client-Side Export Only** – Browser Canvas API dependency
4. **Single Route** – Only `/` editor route
5. **No SEO** – Editor marked `noindex`

---

## 🚀 Future Roadmap

- User accounts + authentication (Auth0, Clerk)
- Cloud persistence (Firebase, Supabase)
- Template gallery + sharing
- Real-time collaboration
- Mobile app (React Native)
- Advanced filters + effects
- Video export
- Team workspaces

---

**Architecture Last Updated**: May 3, 2026  
**Framework**: Next.js 16.2.4 | **Runtime**: React 19.2.4 | **Language**: TypeScript 5.x
2. `Dashboard` updates centralized React state.
3. State is passed to `CardCanvas` as props; preview rerenders instantly.
4. Export action in `LeftPanel` calls `useExport` handlers with `cardRef.current`.
5. Export service captures rendered DOM node to PNG.
6. Result is downloaded or copied; toast/progress/confetti and support prompt logic run.

## Styling and Design System

- `app/globals.css`
  - Imports Tailwind, animations, and shadcn styles.
  - Defines dark-first design tokens via CSS custom properties.
  - Provides optional light theme overrides with `.light`.
  - Includes custom thin scrollbar treatment.
- Font variables from `app/layout.tsx` are consumed via `FONTS` constants and per-metric typography controls.

## Configuration

- `tsconfig.json`
  - Strict type checking enabled
  - `@/*` path alias mapped to repository root
  - Next TypeScript plugin enabled
- `eslint.config.mjs`
  - Next core-web-vitals + TypeScript lint presets
- `next.config.ts`
  - Currently minimal/default configuration

## Current Constraints and Notes

- No backend persistence: all editing state is in-memory client state.
- No authenticated user system or saved templates.
- Export is fully client-side and depends on browser DOM/canvas APIs.
- Application has one primary route (`/`) and no API routes.


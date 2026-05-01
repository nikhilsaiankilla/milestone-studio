# Milestone Studio Architecture

## Purpose

Milestone Studio is a client-side Next.js application for creating shareable milestone graphics. Users compose metric cards with templates, typography controls, gradients, emoji overlays, and platform handle branding, then export PNG output (download or clipboard).

## Tech Stack

- Framework: Next.js App Router (`next@16.2.4`)
- UI: React (`react@19.2.4`) + TypeScript
- Styling: Tailwind CSS v4 + shadcn UI + `tw-animate-css`
- Capture/export: `modern-screenshot` (`domToPng`)
- Feedback and UX: `sonner` toast + `canvas-confetti`
- Analytics: `@vercel/analytics/next`

## High-Level System View

The app is a single-route UI with a thin server shell and a client-heavy editor.

1. App shell (`app/layout.tsx`) configures metadata, global fonts, global styles, toaster, and analytics.
2. Home route (`app/page.tsx`) renders a single orchestrator component: `components/dashboard.tsx`.
3. Dashboard orchestrates all editor state and delegates rendering and controls to three panels:
   - Left panel: template/data/edit/export controls
   - Center canvas: live card renderer (`CardCanvas`)
   - Right panel: visual style controls (gradient, alignment, ratio, noise)
4. Export pipeline captures the center card DOM and writes PNG to download or clipboard.

## Runtime Boundaries

### Server-rendered shell

- `app/layout.tsx`
  - Defines SEO metadata (OpenGraph, Twitter, robots, canonical).
  - Loads Google fonts and maps them to CSS variables.
  - Mounts shared UI systems: `<Toaster />` and `<Analytics />`.
- `app/page.tsx`
  - Entry route that renders the editor dashboard.

### Client editor

- `components/dashboard.tsx` (`'use client'`)
  - Central state owner for templates, metrics, style, platform, export quality, history, and support prompt behavior.
  - Fetches GitHub star count and passes it to navigation and support components.

## Component Architecture

### Orchestrator

- `components/dashboard.tsx`
  - State domains:
    - Template mode: `metrics | milestone | progress | list`
    - Platform/handle: selected platform icon/placeholder + handle text color
    - Metric list and active metric index
    - Card style: gradient, alignment, ratio, noise, emoji scatter
    - Progress template mode: `bar | circle`
    - Export state from `useExport` hook
    - Undo/redo timeline for style-related controls
  - Behavior:
    - Adds/removes/updates metric rows
    - Randomizes style settings
    - Intercepts keyboard shortcuts (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+Shift+Z`)
    - Triggers support prompt checks after successful download action

### Left controls panel

- `components/dashboard/LeftPanel.tsx`
  - Template picker (Metrics, Milestone, Progress, List)
  - Platform selection and handle input
  - Handle text color picker
  - Metrics editor:
    - Add/remove metrics
    - Per-metric icon/value/label editing
    - Auto icon inference from label text
    - Inline typography panel (`MetricTypographyPanel`)
  - Emoji picker and density control
  - Export controls:
    - Quality presets (`low`, `medium`, `high`, `2k`, `4k`, `6k`)
    - Download and copy actions with progress

### Center render surface

- `components/dashboard/CardCanvas.tsx`
  - `forwardRef` canvas root is the capture target for export.
  - Renders layered visual composition:
    - Gradient background
    - Optional noise overlay
    - Optional emoji scatter overlay
    - Optional platform-handle watermark
  - Supports 4 templates:
    - `metrics`: multi-metric card with icon/value/label rows
    - `milestone`: cinematic stacked-number depth layout
    - `progress`: bar or circular progress against target
    - `list`: responsive metric grid
  - Helper logic:
    - Number compacting (`K`, `M`, `B`)
    - Value parsing
    - Milestone stepping calculation

### Right style panel

- `components/dashboard/RightPanel.tsx`
  - Noise toggle
  - Alignment controls (left/center/right)
  - Gradient palette browser from categorized gradient constants
  - Canvas ratio controls (1:1, 16:9, 9:16)
  - Style randomizer action

### Shared UI and support components

- `components/dashboard/DashboardNav.tsx`: logo, undo/redo hints, social/support links, GitHub stars.
- `components/dashboard/MetricTypographyPanel.tsx`: text color, icon visibility, icon/value/label size, bold/italic, font family.
- `components/SupportDialog.tsx`: support modal shown on export cadence.
- `components/product.tsx`: collapsible promoted products block used in side panels.

## Domain Models and Constants

- `types/card.tsx`
  - Core types: `Metric`, `MetricStyle`, `PlatformType`, `EmojiPosition`, `MetricIconKey`
  - Defaults: `DEFAULT_METRIC_STYLE`
  - UI dictionaries:
    - `METRIC_ICONS`
    - `TEMPLATES`
    - `GRADIENT_CATEGORIES`
    - `FONTS`
    - `PLATFORMS`

## Hooks and Service Layer

### Export flow

- `hooks/useExport.ts`
  - Owns `quality`, `downloading`, `copying`, and smooth progress values.
  - Uses requestAnimationFrame-based progress animator for UX smoothing.
  - `handleDownload(element)`:
    - Captures PNG via service at selected quality
    - Initiates file download
    - Shows success toast and confetti
  - `handleCopy(element)`:
    - Captures PNG at fixed high quality
    - Converts data URL to blob
    - Writes to `navigator.clipboard`
    - Shows success toast

- `lib/export-service.ts`
  - Defines quality presets and quality-to-scale mapping.
  - `captureCard(element, { quality, onProgress })`:
    - Waits for double RAF to ensure render flush
    - Calls `domToPng(element, { scale })`
    - Reports progress checkpoints
  - `dataUrlToBlob(dataUrl)` helper for clipboard path.

### Support prompt logic

- `hooks/useSupportPrompt.ts`
  - LocalStorage-based cadence:
    - increments on trigger
    - opens every third eligible export
    - supports temporary and permanent dismiss states

### Utility hooks and helpers

- `hooks/use-mobile.ts`: viewport breakpoint helper (`< 768px`).
- `lib/utils.ts`: `cn()` helper combining `clsx` + `tailwind-merge`.

## Data and Event Flow

1. User updates controls in `LeftPanel`/`RightPanel`.
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


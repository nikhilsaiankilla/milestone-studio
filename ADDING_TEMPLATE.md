# Adding a New Template to Milestone Studio

Adding a template is a single-file change. No sidebar code rewrites needed.

---

## The system in one sentence

Each template declares its own `fields` array. The left sidebar reads that array and renders the correct inputs automatically when the template is selected.

---

## Step-by-step

### 1. Open `types/card.ts`

All templates live in the `TEMPLATES` array at the bottom of this file.

### 2. Add your template object

```ts
{
    id: "my-template",              // unique, kebab-case
    name: "Platform · Variant",     // shown in the template grid label
    emoji: "🎯",                    // shown in the grid thumbnail
    category: "X / Twitter",        // must match a value in CATEGORIES array
    desc: "Short description",       // shown below the name in the thumbnail

    // ── FIELDS ──────────────────────────────────────────
    // These drive the left sidebar UI. Order matters — they're rendered top-to-bottom.
    fields: [
        {
            key: "handle",          // must be a key of CardConfig
            label: "Your handle",   // label shown above the input
            type: "handle",         // see FieldType below
            placeholder: "@you",
            defaultValue: "@you",
            hint: "Optional helper text shown below the input",
        },
        {
            key: "milestone",
            label: "Count",
            type: "text",
            placeholder: "10K",
            defaultValue: "10K",
        },
        {
            key: "showLiveBadge",
            label: "Show LIVE badge",
            type: "toggle",
            defaultValue: true,
        },
        // Add as many fields as needed. Unsupported keys will be ignored.
    ],

    // ── CONFIG ──────────────────────────────────────────
    // The visual defaults. All keys are optional — unset keys keep the
    // user's current config value.
    cfg: {
        platform: "twitter",
        backgroundValue: "#000000",
        noiseOpacity: 12,
        showPlatformBadge: true,
        showDivider: false,
        cardBorderRadius: 20,
        cardMode: "standard",
        aspectRatio: "1:1",
        milestone: "10K",
        unit: "followers",
        mStyle:       { family: "Helvetica", weight: 900, size: 88, spacing: -4, color: "#ffffff", align: "left", uppercase: false },
        unitStyle:    { family: "Helvetica", weight: 300, size: 12, spacing: 7,  color: "rgba(255,255,255,0.45)", align: "left", uppercase: true },
        messageStyle: { family: "Helvetica", weight: 300, size: 10, spacing: 0,  color: "rgba(255,255,255,0.3)",  align: "left", uppercase: false },
    },
},
```

### 3. Done

No other files need changes. The sidebar, thumbnail, and category filter all pick up the new template automatically.

---

## FieldType reference

| Type       | Renders as          | Notes |
|------------|---------------------|-------|
| `text`     | Single-line input   | General purpose |
| `handle`   | Single-line input   | Semantically for @ handles, same UI as text |
| `number`   | Single-line input   | Still a text input, use for numeric values |
| `textarea` | Multi-line input    | Use for longer text like bios or messages |
| `toggle`   | Checkbox            | For boolean CardConfig fields (`showLiveBadge`, etc.) |
| `color`    | Color picker        | For `accentColor` or similar hex fields |
| `range`    | Slider              | Requires `min`, `max`, `step` |
| `select`   | Dropdown            | Requires `options: [{ label, value }]` |

---

## CardMode reference

| Mode             | Description |
|------------------|-------------|
| `standard`       | Default layout — badge top, number center, handle/message bottom |
| `story`          | Adds a progress bar at the top of the card |
| `beforeAfter`    | Two-column Before → After layout |
| `slotMachine`    | Three stacked rows: past (faded) / current (bold) / goal (faded) |
| `progressTarget` | Large number with a progress bar + goal label at the bottom |
| `rank`           | Large rank number (#1) with a badge label below |
| `tiktokDuotone`  | Standard layout + red/cyan glitch overlay |

To add a **new cardMode**, implement its render branch in `components/CardPreview.tsx` inside the main `if/else` chain.

---

## Adding a new category

If your template needs a new category tab, add the category string to the `CATEGORIES` array in `types/card.ts`:

```ts
export const CATEGORIES = [
    "All", "X / Twitter", "Product Hunt", "GitHub",
    "YouTube", "Newsletter", "SaaS", "Twitch", "TikTok", "LinkedIn",
    "My New Category",   // ← add here
];
```

---

## Tips

- Keep `fields` focused — 3–5 fields is ideal. The left sidebar is for quick personalisation, not full configuration.
- Always set `defaultValue` so inputs are never blank when a template is selected.
- Use `hint` for fields that aren't self-explanatory (e.g. "Raw number, e.g. 12500 → shown as $12.5K").
- The `cfg` values are the *visual* defaults. The `fields` defaults are the *content* defaults. Both matter.
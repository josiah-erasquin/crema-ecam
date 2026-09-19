# Design — Crema

<!-- impeccable:design-schema 1 -->

The visual world of the Crema app, recorded from the shipped build (`index.html`,
`app.js`, `data.js`). Mode: **Operate**. Direction: **brew-guide recipe-card deck**
(seed `3ac8effc`; see `.impeccable/surfaces/index-html.md`).

## World

A barista's brew-guide card deck for one machine. Espresso ink is a structural field
colour — it owns the top bar, the bottom nav, and each recipe's name block — over a
warm bone paper. One caramel-crema accent carries active state and the key spec
numbers. Type is a grotesk (Operate register), with a tabular mono for the measured
spec (base · froth · milk). It deliberately refuses the cream + fashion-serif +
terracotta coffee-app cluster and the flat icon-grid home.

## Color tokens

Locked four-role palette (plus derived support). Defined on `:root`.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F3EEE4` | page ground (warm bone) |
| `--panel` | `#EAE2D3` | spec cells, icon tiles, inline chips |
| `--ink` | `#201813` | structural field: header, nav, name blocks; primary text |
| `--ink-soft` | `#5A4C42` | secondary text on paper |
| `--accent` | `#C8892B` | caramel accent: active state, spec numbers on ink |
| `--accent-ink` | `#8A5717` | caramel for small text/links on paper (contrast-safe) |
| `--line` | `#B9AC97` | hairline rules, borders |
| `--line-soft` | `#D8CFBD` | card borders, dividers |
| `--on-ink` | `#F3EEE4` | text on ink |
| `--on-ink-soft` | `#C9BCA9` | secondary text on ink |
| `--good` | `#3E6E4E` | reserved positive |

Light only — a kitchen tool used under bright/steamy ambient light. No dark theme.

## Type

- Display + UI: **Hanken Grotesk** (400/500/600/700/800). Drink names 800, tight
  tracking (`-.02` to `-.03em`). Section labels: 12px, 700, `.16em`, uppercase.
- Measure / data: **Spline Sans Mono** (500/600) for the spec strip, ratios, and the
  inline `code` chips (`P`, `MAX`, level `A`/`B`, `CLEAN`).
- Body 16px / 1.5. Detail step text 15.5px.

## Spacing & shape

- Radii: cards `14px`, name card / callouts `12–16px`, chips `999px`, icon tiles `10px`.
- Rhythm: section label with rule + count above each group; more space above a heading
  than below. Cards in a 12px vertical deck.
- App column: `max-width 560px`, centered; on desktop it reads as a phone-shaped app.
- Safe-area insets honoured top and bottom (notch / home bar).

## Components

- **Recipe card** — paper panel; name (800), one-line descriptor, optional origin, and a
  three-cell mono spec strip (BASE · FROTH · MILK), MILK keyed in caramel. Whole card taps.
- **Name card (detail)** — espresso-ink panel with soft shadow; drink name, descriptor
  (origin folded in bold), and a three-cell spec split by hairlines.
- **Steps** — numbered circular markers; tap or Enter/Space checks a step off (marker
  fills caramel with a drawn tick, text strikes through). Per-viewer only, not persisted.
- **Stamp** — small outlined mono chip, `OFFICIAL` (caramel) vs `Barista tip` (ink-soft),
  inside a panel callout. Separates machine instruction from opinion.
- **Source row** — link card with a drawn play glyph, title, and short URL.
- **Directory row** (How-to / Care) — drawn line icon in a panel tile, title, descriptor.
- **Chips** — pill category filter; active = filled ink.
- **Bottom nav** — three ink tabs (Recipes · How-to · Care); active tab shows a caramel
  top marker and lit label.
- **Icons** — authored inline SVG line glyphs, single 1.8 stroke weight. No emoji.

## Motion

- List/rows settle with a short staggered rise from an already-visible default; detail
  slides up. Exponential ease-out. All disabled under `prefers-reduced-motion`.

## Browser surfaces

Themed from the palette: text selection (caramel/ink), `caret-color`, custom scrollbar,
and `:focus-visible` ring (`--accent-ink`).

## Platform

Installable PWA: `manifest.webmanifest` (standalone, portrait, theme `#201813`,
background `#F3EEE4`), `sw.js` (offline-first app-shell cache + runtime Google-Fonts
cache), icons in `icons/` (192, 512, maskable 512, apple-touch 180).

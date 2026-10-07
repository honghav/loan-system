---
name: Obsidian Slate
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets technical leads, software engineers, and product managers navigating dense data landscapes and high-velocity workflows. The emotional resonance is focused, crystalline, and decisively modern—stripping away decorative distraction in favor of low-friction spatial clarity, high-contrast legibility, and refined material cues.

The aesthetic fuses contemporary **Glassmorphism** with utilitarian precision. Semi-translucent slate sheets hover over deep obsidian backdrops, establishing structural tiers without solid visual blockage. Crisp micro-borders (`rgba(255, 255, 255, 0.08)`) and controlled neon accents ground the interface, producing an environment tailored for deep technical work, continuous telemetry monitoring, and system management.

## Colors

The palette is tuned specifically for deep dark mode ergonomics, minimizing ocular fatigue over extended working sessions while directing attention through focused, vibrant functional accents.

- **Obsidian Core (`#0B0F17`)**: Primary canvas foundation and window backdrop.
- **Slate Elevate (`#111827`)**: Intermediate background, secondary surface, and inset structure fill.
- **Translucent Slate (`rgba(30, 41, 59, 0.70)`)**: Glassmorphic card surfaces, side sheets, and modal views.
- **Electric Indigo (`#6366F1`)**: Primary action driver, selected states, and brand focal anchors.
- **Cyan Surge (`#06B6D4`)**: Secondary indicators, metric graphs, and interactive telemetry hooks.
- **Emerald Pulse (`#10B981`)**: Success conditions, healthy builds, and stable state telemetry.
- **Amber Alert (`#F59E0B`)**: Warnings, pending syncs, and mid-tier latency states.
- **Rose Impact (`#EF4444`)**: Incidents, destructive buttons, and critical failures.
- **Glass Rim (`rgba(255, 255, 255, 0.08)`)**: Structural borders across all cards, pills, and surface perimeters.

## Typography

The typographic hierarchy couples **Inter** for fluid natural scanning with **Geist** for precise technical labels, microcopy, telemetry displays, and tabular metadata.

- **Headlines & Interface Body (`Inter`)**: Rendered in negative tracking at larger sizes to create tight editorial presence. Used everywhere continuous prose, navigation headings, and descriptions reside.
- **Labels, Telemetry, and Identifiers (`Geist`)**: Used for code blocks, commit hashes, system states, tabular column values, and input labels. The slightly wide spacing in `label-sm` optimizes legibility in micro-badging scenarios.

## Layout & Spacing

The layout is built around a fluid 12-column grid system anchored by strict 8pt rhythm multiples (represented internally via the 0.25rem/4px sub-grid). 

- **Desktop (>= 1280px)**: 12-column layout with 24px (`space-lg` / `gutter`) channels and 32px (`space-xl` / `margin`) outer viewport boundaries.
- **Tablet (768px - 1279px)**: 8-column layout with 16px (`gutter`) channels and 24px (`margin`) margins. Sidebars collapse to icon-only rails.
- **Mobile (< 768px)**: 4-column flow with 12px (`gutter-mobile`) gutters and 16px (`margin-mobile`) side boundaries. Multi-panel analytics collapse to vertically stacked single-column glass cards.
- **Internal Component Spacing**: Inputs and compact containers apply `space-sm` vertically and `space-md` horizontally. Card padding adheres to `space-lg` across desktop and scales down to `space-md` on mobile viewports.

## Elevation & Depth

Visual depth is achieved through layered glassmorphism, micro-borders, and ambient glow fields rather than traditional heavy dropshadows.

- **Level 0 (Canvas Base)**: Deep opaque obsidian (`#0B0F17`). Zero blur, zero borders.
- **Level 1 (Docked/Inset Panels)**: Subtle dark slate tint (`#111827`) with a 1px border (`rgba(255, 255, 255, 0.05)`). Used for static back-rails and inactive code sections.
- **Level 2 (Glass Cards & Modules)**: Translucent slate background (`rgba(30, 41, 59, 0.70)`), backed by a `16px` backdrop-filter blur and framed with a crisp hairline border (`1px solid rgba(255, 255, 255, 0.08)`). Shadow is subtle and wide: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`.
- **Level 3 (Modals, Overlays, Floating Menus)**: Heightened translucent slate (`rgba(30, 41, 59, 0.85)`), backed by a `24px` backdrop blur, a brighter rim (`1px solid rgba(255, 255, 255, 0.15)`), and a directional shadow: `0 20px 48px -8px rgba(0, 0, 0, 0.6)`.
- **Accent Glow State**: Focused inputs, hovering action items, or active indicators cast a diffuse, low-opacity colored halo (e.g., `0 0 16px rgba(99, 102, 241, 0.25)` for Electric Indigo).

## Shapes

The design uses a 12px baseline border radius (`0.75rem`), balancing structural precision with comfortable tactile softness.

- **Cards & Primary Modules**: Fixed at exactly 12px (`0.75rem`) corner rounding, framing internal content without aggressive circular curves.
- **Form Controls & Buttons**: Bound to 8px (`0.5rem`) for compact alignment within tabular rows and toolbars.
- **Pills, Badges & Micro-tags**: Full continuous pill radius (`9999px`) to immediately set status metadata apart from structural containers.
- **Nested Elements**: An inner element nested inside a 12px card adopts an 8px radius, preserving clean concentric border curves.

## Components

- **Buttons**:
  - *Primary*: Filled with Electric Indigo (`#6366F1`), white text (`#FFFFFF`), 8px border radius, subtle indigo ambient shadow on hover (`0 0 12px rgba(99, 102, 241, 0.35)`). Active click scales subtly to `0.98`.
  - *Secondary / Glass*: Background set to `rgba(30, 41, 59, 0.60)` with `rgba(255, 255, 255, 0.08)` border and `backdrop-filter: blur(8px)`. Hover transitions border to `rgba(255, 255, 255, 0.20)`.
  - *Destructive*: Deep rose fill (`rgba(239, 68, 68, 0.15)`) with a rose perimeter (`rgba(239, 68, 68, 0.40)`) and `#EF4444` label text.

- **Cards**:
  - Styled with 12px border radius, `rgba(30, 41, 59, 0.70)` background, `16px` backdrop blur, and `1px solid rgba(255, 255, 255, 0.08)`.
  - Header, content, and footer sections are separated by low-contrast inner lines (`1px solid rgba(255, 255, 255, 0.05)`).

- **Chips & Status Tags**:
  - Full pill curves with `Geist` label font (`label-sm` or `label-md`).
  - Semantics use light translucent fills with vibrant text:
    - *Success*: `rgba(16, 185, 129, 0.12)` fill, `#10B981` text, `1px solid rgba(16, 185, 129, 0.25)`.
    - *Telemetry Alert*: `rgba(245, 158, 11, 0.12)` fill, `#F59E0B` text, `1px solid rgba(245, 158, 11, 0.25)`.
    - *Critical*: `rgba(239, 68, 68, 0.12)` fill, `#EF4444` text, `1px solid rgba(239, 68, 68, 0.25)`.
    - *Info / Cyan*: `rgba(6, 182, 212, 0.12)` fill, `#06B6D4` text, `1px solid rgba(6, 182, 212, 0.25)`.

- **Input Fields**:
  - Background is dark inset obsidian (`#0B0F17`) with an 8px radius and `1px solid rgba(255, 255, 255, 0.08)` border.
  - Active focus transitions the border to `#6366F1` and introduces a low-spread glow ring (`0 0 0 3px rgba(99, 102, 241, 0.20)`). Placeholder typography is set in `#64748B`.

- **Checkboxes & Radios**:
  - Checkbox uses 4px rounding; radio uses full circular curves.
  - Inactive state: `rgba(255, 255, 255, 0.05)` fill with `rgba(255, 255, 255, 0.2)` border.
  - Checked state: Filled with `#6366F1`, rendering a crisp white check or center pip, illuminated by an indigo glow.

- **Data Tables & Lists**:
  - Obsidian/slate striped or single-tone rows bordered with `rgba(255, 255, 255, 0.04)` dividers.
  - Header rows feature `Geist` `label-sm` uppercase text in `#94A3B8`.
  - Row hover introduces an instant wash of `rgba(255, 255, 255, 0.03)` with no layout shift.

- **Code & Telemetry Blocks**:
  - Recessed backgrounds (`#0B0F17`) paired with `Geist` monospace styling, syntax highlighting against Cyan (`#06B6D4`) and Emerald (`#10B981`), and a copy button positioned in the top-right corner using the secondary glass button style.
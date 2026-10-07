---
name: Technical Architecture & API Console
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e79400'
  on-tertiary-container: '#563400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system targets systems architects, platform engineers, and backend developers navigating complex schema definitions, real-time telemetry, and multi-tier API documentation. The tone is uncompromisingly precise, functional, and developer-first—delivering the high information density of a terminal emulator combined with the visual refinement of an enterprise IDE.

The aesthetic fuses **Modern Technical Minimalism** with **Instrument-Grade High-Contrast**:
- Surfaces prioritize signal over noise, relying on structured borders, distinct surface steps, and systematic optical weight instead of heavy skeuomorphism or gratuitous ornamentation.
- Critical code artifacts, DTO properties, and HTTP verb tags provide immediate visual orientation via calibrated chromatic signaling (emerald for state creation, cyan for querying, amber for state mutation and warning thresholds).
- The environment feels calm, deeply focused, and resilient during sustained night sessions and high-cognitive-load debugging workflows.

## Colors

The palette is engineered exclusively for an immersive, low-strain dark viewport. Deep foundation neutrals preserve optical comfort while high-saturation accents pinpoint dynamic technical data.

### Foundation & Surfaces
- **Canvas Base (`#0b0f17`):** The absolute background for root viewports, outer frame gutters, and code-block gutters.
- **Surface Level 1 (`#0f172a`):** Primary panel layer, sidebars, interactive consoles, and inspection cards.
- **Surface Level 2 (`#1e293b`):** Nested structural regions, table headers, hovered controls, and code block containers.
- **Surface Level 3 (`#334155`):** Selected rows, active tab indicators, and contextual dropdown flyouts.

### Structural Delimiters
- **Subtle Stroke (`#1e293b`):** Used for non-interactive structural grid panels, column splits, and list item dividers.
- **Interactive Stroke (`#334155`):** Applied to idle form controls, cards, and interactive boundaries.
- **Focus Stroke (`#06b6d4`):** Crisp 1px outline for active keyboards, active inputs, and focused DTO nodes.

### Functional & Semantic Accents
- **Primary Cyan (`#06b6d4`):** API telemetry curves, primary navigation highlights, GET request tags, and JSON property labels.
- **Secondary Emerald (`#10b981`):** 200 OK statuses, POST methods, successful payload receipts, and schema additions.
- **Warning Amber (`#f59e0b`):** PATCH/PUT actions, deprecation notices, rate-limit thresholds, and payload warnings.
- **Destructive Rose (`#f43f5e`):** DELETE methods, 4xx/5xx HTTP responses, breaking schema diffs, and invalid parameters.

### Text Contrast Tiers
- **Text Primary (`#f8fafc`):** High-clarity white for active headers, keys, and values.
- **Text Secondary (`#94a3b8`):** Muted slate for descriptive documentation copy, non-highlighted syntax, and schema annotations.
- **Text Tertiary (`#64748b`):** Low-emphasis metadata, timestamps, and placeholder tokens.

## Typography

The typographic hierarchy establishes clear segregation between human-readable editorial copy and machine-readable technical artifacts.

- **Geist (Headlines & Body):** Employs strict, geometric grotesque characteristics optimized for high legibility at micro-scales on high-DPI screens. Headings keep neutral tracking and tight line heights, ensuring maximum spatial efficiency in dashboard tiles and multi-pane views.
- **JetBrains Mono (Code, DTOs, Schemas, HTTP Verbs):** Delivers explicit glyph differentiation (`0` vs `O`, `1` vs `l`), enlarged character apertures, and calibrated operator heights. All code blocks, property keys, data types, and method tags must strictly render in JetBrains Mono.
- **Case Conventions:** HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`) and metadata categories use `label-caps` in JetBrains Mono with generous tracking for instantaneous skimming across busy API consoles.

## Layout & Spacing

The layout operates on a compact 4px mathematical grid system, calibrated for complex, multi-pane technical consoles.

### Spatial Architecture
- **Workstation Layout (Desktop ≥ 1280px):** A three-column split view consisting of a fixed navigation tree (260px), a fluid center documentation and spec column, and an interactive sidecar console (400px–480px) for mock testing, DTO inspector trees, and code snippets.
- **Tablet (768px – 1279px):** Two-column split with the console collapsed into a toggleable contextual drawer.
- **Mobile (< 768px):** Single vertical stream with sticky sub-headers for API paths and a horizontal swipe bar for HTTP response tabs.

### Rhythm & Density
- High density is standard: component padding maintains compact vertical heights (`space-xs` and `space-sm`) to allow expansive payloads to fit comfortably within the default viewport without unnecessary scrolling.
- Structural panes use 1px hard boundaries (`#1e293b`) rather than wide gutter separations, maximizing functional screen estate.

## Elevation & Depth

This design system rejects deep drop shadows and skeuomorphic blur gradients, utilizing **Flat Tonal Layering** accompanied by **Subtle Micro-Illumination**:

- **Layer 0 (Canvas Base - `#0b0f17`):** The terminal canvas ground. No shadows or borders.
- **Layer 1 (Card/Section Panes - `#0f172a`):** Defined by a sharp `1px solid #1e293b` perimeter border. Zero elevation blur.
- **Layer 2 (Flyouts, Popovers, & Dropdown Menus - `#1e293b`):** Outlined with `1px solid #334155`. Supported by an ultra-crisp, diffused ambient shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
- **Active Focus & Hover Depth:** Elevation state changes are indicated through border luminosity increases (`#1e293b` transitions to `#334155` or `#06b6d4`), accompanied by a faint 1px inner glow (`inset 0 0 0 1px #06b6d4`) rather than directional shadows.

## Shapes

The design system maintains a **Soft-Edged Precision (`1`)** approach:

- Default structural boundaries (inputs, buttons, API tags, card containers) utilize `0.25rem` (`4px`) corner radii.
- Nested sub-elements within container borders must step down or conform to the `4px` rule to preserve crisp geometric parallelism.
- Flyout modals, large drawer panels, and floating code windows utilize `0.5rem` (`8px`) radii.
- Circular or pill geometries are explicitly reserved for status indicator pings and interactive switch toggles; HTTP verb badges and tags remain strictly boxed with `0.25rem` radii.

## Components

### Buttons
- **Primary:** High-contrast cyan background (`#06b6d4`), deep slate text (`#0b0f17`), font-weight 600. Hover transitions to `#22d3ee`.
- **Secondary / Outline:** Base background transparent, border `1px solid #334155`, text `#f8fafc`. Hover triggers background `#1e293b`.
- **Action / Icon Only:** `32x32px`, border `1px solid transparent`. Hover reveals `1px solid #334155` on `#1e293b`.

### HTTP Method Badges
Monospaced, uppercase, `label-caps` font, structured with a solid `1px` border and 10% opacity tinted fill:
- `GET`: Cyan (`#06b6d4`), border `rgba(6, 182, 212, 0.4)`, background `rgba(6, 182, 212, 0.1)`.
- `POST`: Emerald (`#10b981`), border `rgba(16, 185, 129, 0.4)`, background `rgba(16, 185, 129, 0.1)`.
- `PATCH` / `PUT`: Amber (`#f59e0b`), border `rgba(245, 158, 11, 0.4)`, background `rgba(245, 158, 11, 0.1)`.
- `DELETE`: Rose (`#f43f5e`), border `rgba(244, 63, 94, 0.4)`, background `rgba(244, 63, 94, 0.1)`.

### Input Fields & Search Bars
- Background `#0b0f17`, border `1px solid #1e293b`, font `Geist` or `JetBrains Mono` depending on role.
- Focus: Border snaps to `#06b6d4` with an inner border ring (`inset 0 0 0 1px #06b6d4`).
- Integrated keyboard shortcut tag displayed right-aligned (e.g., `⌘K`) using `#334155` background and `#94a3b8` text.

### Interactive Spec & DTO Tree
- Root items sit in a clean row with collapsible chevron indicators.
- Schema properties render in `code-md`. Keys display in `#f8fafc`, optional/required badges in `#64748b` or `#06b6d4`, and data types (`string`, `uuid`, `boolean`) in `#94a3b8`.
- Nested children display a 1px vertical tree guide (`#1e293b`).

### Code Surfaces & Sandboxes
- Dark terminal shell (`#0b0f17`) framed by `1px solid #1e293b`.
- Header bar includes endpoint path (`JetBrains Mono`), protocol badge, and one-click copy button.
- Syntax highlighting uses calibrated token colors: strings (`#10b981`), keywords (`#06b6d4`), numbers (`#f59e0b`), comments (`#64748b`).

### Cards & Telemetry Tiles
- Background `#0f172a`, border `1px solid #1e293b`.
- Header contains title in `headline-sm` with optional status dot ping (emerald for live, amber for degraded).
- Padding strictly enforced at `space-lg` (`1rem`).
---
name: Aerospace Command Telemetry
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#37393f'
  surface-container-lowest: '#0c0e13'
  surface-container-low: '#191c21'
  surface-container: '#1d2025'
  surface-container-high: '#282a30'
  surface-container-highest: '#33353b'
  on-surface: '#e2e2ea'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e2e2ea'
  inverse-on-surface: '#2e3036'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#c1c6db'
  on-secondary: '#2b3040'
  secondary-container: '#44485a'
  on-secondary-container: '#b3b8cc'
  tertiary: '#dbffde'
  on-tertiary: '#003918'
  tertiary-container: '#34f885'
  on-tertiary-container: '#006e35'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#dee1f7'
  secondary-fixed-dim: '#c1c6db'
  on-secondary-fixed: '#161b2a'
  on-secondary-fixed-variant: '#414657'
  tertiary-fixed: '#62ff96'
  tertiary-fixed-dim: '#00e475'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#111319'
  on-background: '#e2e2ea'
  surface-variant: '#33353b'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.02em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  mono-metrics:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  panel-gap: 12px
---

## Brand & Style
The design system is engineered for high-stakes, high-precision environments, evoking the atmosphere of a next-generation aerospace command center. It targets professional operators and tech-forward users who require rapid data synthesis through an immersive, cinematic interface.

The visual style is a hybrid of **Glassmorphic** depth and **Futuristic/Technical** precision. It prioritizes clarity through high-contrast typography while maintaining a premium feel through realistic light refraction, backdrop-filters, and soft neon illumination. Every element should feel like a projection or a high-density liquid crystal display within a sophisticated cockpit.

## Colors
The palette is rooted in deep space blacks and obsidian tones to minimize eye strain and maximize the impact of data visualization. 

- **Primary (Neon Cyan):** Used for critical actions, active states, and primary data telemetry. It features a soft outer glow to simulate emissive light.
- **Secondary (Slate Blue):** The foundation for glassmorphic surfaces. When used with a 40-60% opacity and `backdrop-filter: blur(12px)`, it creates the signature "command panel" look.
- **Success (Emerald):** Denotes safe parameters, stabilized systems, and confirmed actions.
- **Warning (Electric Orange):** Reserved for alerts, system anomalies, and high-priority notifications.
- **Background (Obsidian):** The absolute foundation. All panels sit above this base to provide maximum contrast for the glass effects.

## Typography
This design system utilizes a dual-font strategy to balance modern aesthetics with technical utility. 

**Outfit** is the display typeface, providing a geometric, futuristic feel for headlines and large data points. It should be used with tighter letter-spacing for large titles to maintain a "machined" look.

**Inter** handles the functional heavy lifting. It is used for all body copy, labels, and terminal outputs. For technical metrics and telemetry data, Inter should be used with increased letter-spacing and bold weights to mimic monospaced readability without sacrificing the modern profile.

All labels should be treated with uppercase styling and tracking (letter-spacing) to enhance the "UI/UX HUD" aesthetic.

## Layout & Spacing
The layout follows a **Rigid Grid System** inspired by technical blueprints. All elements are aligned to a 4px baseline grid to ensure mathematical precision.

- **Desktop:** A 12-column grid with generous margins. Content is housed in modular glass containers that can span multiple columns. 
- **Mobile:** A single-column flow with reduced margins, utilizing "stacked" telemetry cards.
- **Grid Lines:** Subside the UI with a subtle, low-opacity (5%) vector grid overlay in the background to reinforce the aerospace mapping theme.

Spacing between functional panels is kept tight (12px) to simulate a high-density information environment, while internal padding within cards is more generous (24px) to ensure legibility.

## Elevation & Depth
Depth in this design system is achieved through **Optical Refraction** rather than traditional drop shadows.

1.  **Base Layer:** The Obsidian background (#07090e).
2.  **Surface Layer:** Glassmorphic panels using Slate Blue (#101524) at 50% opacity with a heavy background blur (16px to 24px).
3.  **Edge Illumination:** Instead of shadows, use 1px inner borders (strokes) with a linear gradient. The top-left should be a subtle cyan-white highlight; the bottom-right should be a darker slate to simulate light hitting glass.
4.  **Emissive Glow:** Active components (buttons, primary metrics) utilize a `box-shadow` with no spread and a large blur radius (e.g., `0 0 15px #00f0ff88`) to create a neon-lighting effect on the panels below them.

## Shapes
Shapes are disciplined and industrial. We use a **Soft (0.25rem)** base roundedness for standard UI elements like buttons and input fields to keep them feeling modern but structured.

Large telemetry cards and terminal containers should use the `rounded-lg` (0.5rem) or `rounded-xl` (0.75rem) settings to distinguish them as structural containers. Avoid pill-shapes for anything other than status tags; the system relies on "squarer" geometry to maintain a serious, aerospace-grade military feel.

## Components
- **Telemetry Cards:** Semi-transparent containers with a 1px border. They include a "Corner Accent"—a small L-shaped vector in Neon Cyan at the top-left or bottom-right corner to indicate active tracking.
- **Glowing Metrics:** Large-scale numbers in Outfit font. Primary metrics feature a subtle outer glow in the same color as the data (Cyan or Emerald).
- **Terminal Console Blocks:** Components with a 100% opaque Slate Blue background, using a smaller font size and a high-contrast label to simulate real-time log outputs.
- **Buttons:** Primary buttons are solid Neon Cyan with black text. Secondary buttons are transparent with a Cyan border and Cyan text, featuring a hover state that increases the background blur intensity.
- **Smartphone Device Frame:** A sleek, minimal bezel frame with a 10% opacity border, used to preview mobile telemetry.
- **Checkboxes/Radios:** Square-edged with a vibrant Neon Cyan "on" state. When checked, the inner icon should glow slightly.
- **Input Fields:** Bottom-border only or very subtle full border. On focus, the border should animate a gradient from Slate to Cyan.
---
name: Lumina SaaS System
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
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
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system focuses on a **Premium Minimalist** aesthetic, optimized for a high-performance AI Website Audit SaaS. It draws heavy inspiration from the precision of developer tools and the clarity of modern productivity platforms. 

The brand personality is authoritative yet approachable, evoking a sense of "intelligence behind the curtain." The UI utilizes expansive whitespace to reduce cognitive load during complex data analysis. Visual interest is generated through subtle micro-interactions, high-fidelity typography, and an obsessive focus on alignment and proportion rather than decorative elements. The goal is to make the user feel they are using a sophisticated, reliable, and "future-proof" tool.

## Colors
This design system utilizes a high-clarity palette centered on a functional light mode. The primary Blue (`#2563EB`) and Accent Indigo (`#4F46E5`) are reserved for primary actions and brand-specific AI highlights.

State colors (Success, Warning, Danger) use industry-standard hues but are applied with restraint—primarily in status indicators and data visualizations to maintain the minimal aesthetic. The background is a cool-tinted Slate (`#F8FAFC`), which provides enough contrast for white cards to appear elevated without requiring heavy shadows. Border colors are kept extremely subtle to maintain a "borderless" feel while providing structural definition.

## Typography
The system employs a dual-font strategy. **Geist** is used for headlines, titles, and technical labels to provide a precise, modern, and slightly technical feel. **Inter** is used for body copy and paragraphs to ensure maximum legibility at smaller scales.

Headlines should use tight letter spacing to create a "compact" premium look. Use `text-secondary` color for body-md descriptions and `text-primary` for active content. All labels should be set in Geist with a medium weight to emphasize the data-driven nature of the dashboard.

## Layout & Spacing
The layout follows a fluid 12-column grid for desktop with a maximum width of 1440px. On mobile, the system collapses to a single column with 16px side margins.

A "Generous Whitespace" philosophy is applied: sections are separated by `stack-lg` (32px) to prevent the dashboard from feeling cluttered with data. Content within cards uses `stack-md` (16px) for internal padding. Alignment is strictly adhered to the left, with numerical data being the only exception (right-aligned in tables).

## Elevation & Depth
Depth is achieved through **Ambient Shadows** and tonal layering. 
- **Level 0 (Background):** Slate-50 (#F8FAFC) - The canvas.
- **Level 1 (Cards):** White surface with a 1px border (#E2E8F0) and a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.03)).
- **Level 2 (Popovers/Modals):** White surface with a more pronounced shadow (0px 10px 30px rgba(0, 0, 0, 0.08)) and a 1px border.

Avoid using heavy black shadows. Shadows should feel like a subtle lift rather than a drop.

## Shapes
The design system uses a "Rounded" shape language to soften the technical nature of the AI audits. 
- **Cards & Containers:** `rounded-xl` (1.5rem / 24px) to create a modern, friendly container feel.
- **Buttons & Inputs:** `rounded-md` (0.5rem / 8px) for a precise, clickable appearance.
- **Badges/Chips:** Full pill (9999px) to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons use a solid gradient of Primary to Accent. Secondary buttons use a White background with a 1px border. Use ghost buttons for low-priority actions.
- **Input Fields:** Minimal design with a 1px border. On focus, the border transitions to Primary Blue with a 3px soft blue glow (ring).
- **Cards:** The central component. All cards must have 24px internal padding and a 24px corner radius. Group related data points using subtle horizontal separators.
- **AI Insight Chips:** Specialized chips used for AI-generated findings. These use a very subtle Indigo background (5% opacity) with the Accent Indigo text.
- **Progress Bars:** Thin (4px) with rounded caps. Use the Primary color for standard progress and Success/Danger for audit scores.
- **Data Tables:** Borderless rows with a subtle hover state (#F1F5F9). Use `label-sm` for table headers in all caps with increased letter spacing.
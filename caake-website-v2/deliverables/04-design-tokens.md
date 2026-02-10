# C.A.A.K.E. Corporation - Design System & Tokens

## Design Philosophy

**"Royal Intelligence Meets Operational Precision"**

- Dark-first foundation (midnight/cosmic)
- Gold accents for premium signaling
- Strong contrast, high readability
- Purposeful motion that supports meaning

---

## Color System

### Primary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-midnight` | `#0A0A0F` | 10, 10, 15 | Primary background |
| `--color-cosmic` | `#12121A` | 18, 18, 26 | Secondary background |
| `--color-void` | `#1A1A24` | 26, 26, 36 | Card surfaces |
| `--color-gold` | `#D4AF37` | 212, 175, 55 | Primary accent, CTAs |
| `--color-gold-light` | `#F4D03F` | 244, 208, 63 | Hover states |
| `--color-gold-dark` | `#B8960C` | 184, 150, 12 | Active states |

### Secondary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-purple` | `#7C3AED` | Secondary accent |
| `--color-purple-light` | `#A78BFA` | Hover, glows |
| `--color-cyan` | `#06B6D4` | Links, highlights |
| `--color-cyan-light` | `#67E8F9` | Hover states |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#10B981` | Positive metrics |
| `--color-warning` | `#F59E0B` | Alerts, caution |
| `--color-error` | `#EF4444` | Errors, critical |
| `--color-info` | `#3B82F6` | Information |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#FAFAFA` | Headlines, body |
| `--text-secondary` | `#A1A1AA` | Supporting text |
| `--text-muted` | `#71717A` | Meta, captions |
| `--text-gold` | `#D4AF37` | Brand accent text |

---

## Typography System

### Font Families

```css
--font-display: 'Playfair Display', Georgia, serif;  /* Premium headlines */
--font-body: 'Inter', -apple-system, sans-serif;      /* Body, UI */
--font-mono: 'JetBrains Mono', monospace;             /* Code, data */
```

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-hero` | 4.5rem (72px) | 1.1 | 700 | Hero headlines |
| `--text-h1` | 3rem (48px) | 1.2 | 700 | Page titles |
| `--text-h2` | 2.25rem (36px) | 1.2 | 600 | Section headers |
| `--text-h3` | 1.5rem (24px) | 1.3 | 600 | Card titles |
| `--text-h4` | 1.25rem (20px) | 1.4 | 600 | Subsection |
| `--text-body` | 1rem (16px) | 1.6 | 400 | Body text |
| `--text-small` | 0.875rem (14px) | 1.5 | 400 | Captions |
| `--text-xs` | 0.75rem (12px) | 1.5 | 400 | Meta, labels |

### Responsive Type

```css
/* Mobile */
--text-hero: 2.5rem;
--text-h1: 2rem;
--text-h2: 1.5rem;

/* Tablet */
--text-hero: 3.5rem;
--text-h1: 2.5rem;
--text-h2: 2rem;

/* Desktop */
--text-hero: 4.5rem;
--text-h1: 3rem;
--text-h2: 2.25rem;
```

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight gaps |
| `--space-2` | 0.5rem (8px) | Inline spacing |
| `--space-3` | 0.75rem (12px) | Component padding |
| `--space-4` | 1rem (16px) | Standard spacing |
| `--space-6` | 1.5rem (24px) | Section gaps |
| `--space-8` | 2rem (32px) | Card padding |
| `--space-12` | 3rem (48px) | Large sections |
| `--space-16` | 4rem (64px) | Section padding |
| `--space-20` | 5rem (80px) | Hero spacing |
| `--space-24` | 6rem (96px) | Major sections |

### Section Spacing

```css
--section-py: 6rem;      /* Vertical padding */
--section-px: 1.5rem;    /* Horizontal padding (mobile) */
--section-px-lg: 3rem;   /* Horizontal padding (desktop) */
```

---

## Border & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem (4px) | Buttons, inputs |
| `--radius-md` | 0.5rem (8px) | Cards |
| `--radius-lg` | 1rem (16px) | Large cards |
| `--radius-xl` | 1.5rem (24px) | Feature cards |
| `--radius-full` | 9999px | Pills, badges |

### Border Colors

```css
--border-subtle: rgba(255, 255, 255, 0.1);
--border-default: rgba(255, 255, 255, 0.2);
--border-gold: rgba(212, 175, 55, 0.3);
--border-gold-strong: rgba(212, 175, 55, 0.6);
```

---

## Shadows & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.3) | Subtle elevation |
| `--shadow-md` | 0 4px 6px rgba(0,0,0,0.4) | Cards |
| `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.5) | Modals |
| `--shadow-gold` | 0 0 20px rgba(212,175,55,0.3) | Gold glow |
| `--shadow-purple` | 0 0 30px rgba(124,58,237,0.3) | Purple glow |

---

## Animation Tokens

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-normal` | 300ms | Standard transitions |
| `--duration-slow` | 500ms | Page transitions |
| `--duration-slower` | 800ms | Reveal animations |

### Easings

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | Standard |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | Entering |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Exiting |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy |
| `--ease-smooth` | cubic-bezier(0.65, 0, 0.35, 1) | Elegant |

---

## Component Primitives

### Button Variants

**Primary (Gold)**
- Background: `--color-gold`
- Text: `--color-midnight`
- Hover: `--color-gold-light` + lift
- Active: `--color-gold-dark`
- Shadow: `--shadow-gold` on hover

**Secondary (Outline)**
- Background: transparent
- Border: `--border-gold`
- Text: `--color-gold`
- Hover: Gold background, dark text

**Ghost**
- Background: transparent
- Text: `--text-primary`
- Hover: `--color-void` background

### Card Variants

**Default Card**
- Background: `--color-void`
- Border: `--border-subtle`
- Radius: `--radius-lg`
- Shadow: `--shadow-sm`
- Hover: `--shadow-md` + border-gold

**Feature Card**
- Background: gradient (void to cosmic)
- Border: `--border-gold`
- Radius: `--radius-xl`
- Shadow: `--shadow-gold`

---

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 100 | Dropdowns |
| `--z-sticky` | 200 | Sticky nav |
| `--z-modal` | 300 | Modals |
| `--z-popover` | 400 | Popovers |
| `--z-toast` | 500 | Toasts |

# C.A.A.K.E. Corporation - Animation Specification

## Animation Philosophy

**Motion serves meaning. Never distract. Always respect user preferences.**

---

## Library Responsibilities

### GSAP + ScrollTrigger
- Scroll-driven section reveals
- Pinning and timeline choreography
- Parallax effects
- Animated metric counters
- Page transitions

### Anime.js
- Micro-interactions (buttons, icons)
- Hover choreography
- Form field focus states
- Success confirmations
- Nav accents

---

## Global Motion Guidelines

### Performance Constraints
- Target: 60fps on modern devices
- Use `transform` and `opacity` only for animations
- Implement `will-change` strategically
- Defer non-critical animations
- Respect `prefers-reduced-motion`

### Accessibility Requirements
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Page-Specific Animation Specs

### Homepage (`/`)

#### Hero Section
**Crown/Circuit Intro Draw-On**
- Trigger: Page load
- Duration: 1200ms
- Elements:
  - Logo crown strokes draw in (stroke-dashoffset)
  - Circuit lines connect (staggered, 100ms delay each)
  - Gold glow pulses once after completion
- Easing: `ease-out`

**Hero Text Reveal**
- Trigger: After logo animation (or immediately if reduced motion)
- Elements:
  - Headline: Split by word, stagger 100ms
  - Subhead: Fade + slide up, 200ms delay
  - CTA buttons: Fade in, 400ms delay
- Duration: 800ms per element
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring)

**Scroll Indicator**
- Anime.js continuous bounce
- Transform: `translateY(0)` → `translateY(10px)`
- Duration: 1500ms
- Easing: `ease-in-out`
- Loop: infinite

#### Trust Strip
**Logo Stagger Reveal**
- Trigger: Scroll into view (GSAP ScrollTrigger)
- Animation: Fade + scale from 0.8
- Stagger: 80ms between logos
- Duration: 500ms

#### Core Outcomes Section
**Metric Counters**
- Trigger: Scroll into view
- Animation: Number counts up from 0
- Duration: 2000ms
- Easing: `power2.out`
- Format: Include suffix (%, M, x)

**Card Hover (Anime.js)**
- Transform: `translateY(0)` → `translateY(-8px)`
- Shadow: Intensify
- Border: Gold glow
- Duration: 300ms

#### How It Works (Recipe Steps)
**Section Pin**
- Pin duration: 100vh
- Steps reveal as user scrolls:
  - Step 1: 0-20% scroll
  - Step 2: 20-40% scroll
  - Step 3: 40-60% scroll
  - Step 4: 60-80% scroll
  - Step 5: 80-100% scroll

**Step Transition**
- Current step: Full opacity, scale 1
- Previous step: Fade + scale down to 0.9
- Next step: Preview at 0.3 opacity
- Connector lines draw between steps

#### Case Study Preview Cards
**Scroll Reveal**
- Trigger: Each card enters viewport
- Animation: Slide up + fade in
- Stagger: 150ms between cards
- Duration: 600ms

**Metric Bars Animation**
- On hover: Bar fills from 0 to value
- Duration: 800ms
- Easing: `power2.out`

#### Final CTA Block
**Background Pattern**
- Subtle parallax on scroll
- Speed: 0.5x scroll rate
- Continuous circuit line animation

---

### Solutions Page (`/solutions`)

#### Recipe Cards Assemble
**Scroll Trigger**
- Cards "assemble" as user scrolls
- Animation: Each card slides from different direction
  - Card 1: From left
  - Card 2: From bottom
  - Card 3: From right
- Stagger: 200ms
- Duration: 700ms
- Easing: `power3.out`

**Card Hover (Anime.js)**
- Icon: Rotate 360° on first hover
- Title: Color shift to gold
- Arrow: `translateX(0)` → `translateX(8px)`
- Duration: 400ms

#### Service Cards
**Pulse on Hover**
- Subtle scale: 1 → 1.02
- Shadow expansion
- Border color transition to gold
- Duration: 300ms

---

### Platform Page (`/platform`)

#### Pipeline Flow Animation
**Continuous Flow**
- Data particles flow through pipeline diagram
- Path: Input → Orchestration → Output
- Duration per particle: 3000ms
- Spawn rate: Every 800ms
- Particles fade out at end

**Section Reveal**
- Pipeline stages reveal on scroll
- Each stage: Fade in + slide from bottom
- Stagger: 300ms
- Duration: 600ms

---

### Case Studies Page (`/case-studies`)

#### Before/After Metric Bars
**Scroll Trigger**
- Bars animate into place
- "Before" bar: Slide in from left
- "After" bar: Slide in from right
- Percentage numbers count up
- Duration: 1000ms
- Easing: `power2.out`

**Card Hover**
- Image: Slight zoom (scale 1.05)
- Overlay: Fade in "Read Story" text
- Duration: 400ms

---

### Security & Governance Page (`/security-governance`)

#### Layered Shield Reveal
**Scroll Trigger**
- Shield layers build up sequentially
- Layer 1 (outer): Fade in
- Layer 2: Fade in, 200ms delay
- Layer 3: Fade in, 400ms delay
- Layer 4 (inner): Fade in + gold glow pulse
- Duration per layer: 500ms

**Compliance Timeline**
- Horizontal scroll on mobile
- Vertical reveal on desktop
- Checkmarks animate in (scale from 0)
- Stagger: 100ms

---

### Resources Page (`/resources`)

#### Staggered Content Reveal
**Grid Items**
- Items reveal with 3D flip effect
- RotateX from -15° to 0°
- Fade in simultaneously
- Stagger: 80ms
- Duration: 500ms

**Filter Transitions**
- On filter change:
  - Current items: Fade out + scale down
  - New items: Stagger fade in
- Duration: 400ms

---

### About Page (`/about`)

#### Timeline Storytelling
**Scroll-Driven**
- Timeline draws as user scrolls
- Each milestone fades in when line reaches it
- Milestone cards: Slide from alternating sides
- Parallax on milestone images

---

### Contact & Book Call Pages

#### Form Field Focus Choreography
**Anime.js**
- Label: Float up + scale down
- Input border: Color transition to gold
- Underline: Expand from center
- Duration: 200ms

**Success Confirmation**
- Checkmark: Draw on (stroke animation)
- Circle: Scale from 0 + fade in
- Text: Fade in after icon
- Duration: 800ms total

---

## Micro-Interaction Library (Anime.js)

### Button Interactions

**Primary Button Hover**
```javascript
anime({
  targets: '.btn-primary',
  translateY: -2,
  boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)',
  duration: 300,
  easing: 'easeOutCubic'
});
```

**Button Click**
```javascript
anime({
  targets: '.btn:active',
  scale: 0.98,
  duration: 100,
  easing: 'easeOutCubic'
});
```

### Navigation

**Link Hover**
- Underline: Width 0 → 100% from left
- Duration: 250ms

**Mobile Menu Open**
- Menu: Slide from right
- Links: Stagger fade in, 50ms delay each
- Duration: 400ms

### Icons

**Service Icon Hover**
```javascript
anime({
  targets: '.service-icon',
  rotate: '1turn',
  duration: 600,
  easing: 'easeOutCubic'
});
```

---

## Scroll Animation Presets (GSAP)

### Fade Up
```javascript
gsap.from(element, {
  y: 30,
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 80%'
  }
});
```

### Stagger Children
```javascript
gsap.from(children, {
  y: 20,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: parent,
    start: 'top 75%'
  }
});
```

### Parallax
```javascript
gsap.to(element, {
  y: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});
```

---

## Animation Choreography Principles

1. **Direction Matters**: Elements should move in the direction of user attention flow
2. **Timing is Hierarchy**: Important elements animate first or longest
3. **Consistency**: Similar elements should behave similarly
4. **Surprise Sparingly**: Use dramatic animations only for key moments
5. **Exit Gracefully**: Never let elements just disappear

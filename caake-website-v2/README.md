# C.A.A.K.E. Corporation Website v2

The new C.A.A.K.E. Corporation website built with Next.js, TypeScript, Tailwind CSS, GSAP, and Anime.js.

## Overview

- **Entity**: C.A.A.K.E. Corporation (formerly LLC)
- **Acronym**: Cost Avoidance Automation Kingz Enterprise
- **Tagline**: "AI That's Easy as C.A.A.K.E."
- **Secondary**: "The Royal Recipe for Enterprise Automation"

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP + ScrollTrigger, Anime.js
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
caake-website-v2/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── solutions/         # Solutions page
│   ├── platform/          # Platform page
│   ├── case-studies/      # Case studies
│   ├── book-call/         # Booking page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── resources/         # Resources page
│   ├── security-governance/  # Security page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── ai-use-policy/     # AI use policy
├── components/            # React components
│   ├── navigation.tsx     # Main navigation
│   ├── footer.tsx         # Site footer
│   └── metadata.tsx       # SEO schemas
├── lib/                   # Utility functions
│   └── utils.ts
├── styles/               # Additional styles
├── public/               # Static assets
└── deliverables/         # Project documentation
```

## Key Features

- Dark mode-first design with gold accents
- GSAP scroll animations
- Anime.js micro-interactions
- Responsive design
- SEO optimized with JSON-LD schemas
- Accessibility compliant (WCAG 2.2 AA)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, outcomes, recipe process |
| `/solutions` | Use cases by function |
| `/platform` | Technical platform overview |
| `/case-studies` | Client success stories |
| `/book-call` | Strategy call booking |
| `/about` | Company story and values |
| `/contact` | Contact form |
| `/resources` | Content library |
| `/security-governance` | Security and compliance |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/ai-use-policy` | AI ethics policy |

## Design System

### Colors
- Midnight: `#0A0A0F` (primary background)
- Cosmic: `#12121A` (secondary background)
- Void: `#1A1A24` (card surfaces)
- Gold: `#D4AF37` (primary accent)
- Purple: `#7C3AED` (secondary accent)

### Typography
- Display: Playfair Display
- Body: Inter

## License

© 2025 C.A.A.K.E. Corporation. All rights reserved.

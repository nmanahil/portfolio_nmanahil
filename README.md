# Manahil Nawaz — Portfolio

> **ACCESS_CONSOLE** — A cybersecurity/IAM-themed developer portfolio built as a scroll-driven terminal experience.

Live site: _deploy via Vercel (see below)_

---

## Overview

A fully custom portfolio website for Manahil Nawaz, Cloud IAM Engineer at Morgan Stanley. Built with a "secure access console" aesthetic — terminal boot sequence, scrolling system logs, binary rain, glitch effects, and an AI chatbot grounded in resume data.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (custom design tokens) |
| Scroll animation | GSAP + ScrollTrigger |
| UI animation | Framer Motion |
| 3D | React Three Fiber + drei |
| Chatbot backend | Vercel Serverless Function → Anthropic Claude API |
| Chatbot streaming | Server-Sent Events (SSE) |
| Deployment | Vercel |

---

## Features

- **Boot screen** — full-screen terminal sequence with matrix rain canvas, typing boot lines, and a glitchy `ACCESS GRANTED` reveal before the site loads
- **Ambient background** — binary rain columns + static CS commands scattered across the page with glitch animations
- **Scroll-driven sections** — every section animates in via GSAP ScrollTrigger
- **3D access token** — React Three Fiber icosahedron that changes speed/color based on active section
- **Cursor glow** — radial cyan spotlight that follows the mouse
- **Count-up stats** — numbers animate from 0 on scroll into view
- **Timeline draw** — the experience timeline line draws downward as you scroll
- **AI chatbot** — floating widget powered by Claude, grounded strictly in resume data, with SSE streaming and rate limiting
- **Fully responsive** — mobile nav, simplified skill layout on small screens
- **Accessibility** — `prefers-reduced-motion` support, `focus-visible` rings, ARIA labels

---

## Project Structure

```
src/
  components/
    sections/       # Hero, ClearanceCard, SkillNetwork, AuditLog, CaseFiles,
                    # ClearanceTokens, LeadershipStrip, SecureTransmission
    three/          # AccessToken (R3F 3D scene)
    chatbot/        # ChatWidget
    ui/             # StatusBar, Section, BootScreen, AmbientBackground, CursorGlow
  data/
    resume.ts       # Single source of truth — all CV data, typed interfaces
  hooks/
    useScrollProgress.tsx   # GSAP ScrollTrigger context for active section
    useScrollReveal.ts      # Reusable scroll-in animation hook
api/
  chat.ts           # Vercel serverless function — Anthropic API + SSE streaming
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

---

## Chatbot Setup

The AI chatbot requires an Anthropic API key. It is **never** exposed to the browser — it lives only in the serverless function.

**For local development**, create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

**For Vercel deployment**, add it in:
> Vercel Dashboard → Project → Settings → Environment Variables → `ANTHROPIC_API_KEY`

The chatbot uses `claude-sonnet-4-5`, streams responses via SSE, and is rate-limited to 10 requests per IP per 10 minutes.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy — Vercel auto-detects Vite and the `api/` serverless functions

```bash
# Or deploy via CLI
npm i -g vercel
vercel --prod
```

---

## Design Tokens

```js
colors: {
  ink:     '#0A0F14',   // page background
  panel:   '#101922',   // card background
  panel2:  '#141F29',   // secondary card
  line:    '#1E2C38',   // borders
  cyan:    '#4FD1C5',   // primary accent
  cyanDim: '#2C6B67',   // muted accent
  amber:   '#E8A94C',   // warning / highlight
  text:    '#E7EDF0',   // primary text
  muted:   '#7C8A93',   // secondary text
  danger:  '#E4574C',   // error states
}
fonts: IBM Plex Mono (headings, code, UI) + IBM Plex Sans (body)
```

---

## Content Updates

All resume content lives in **`src/data/resume.ts`** — one file, one source of truth. Update it there and every section of the site plus the chatbot system prompt updates automatically.

---

## License

Personal portfolio — all rights reserved. Code structure may be referenced for learning purposes.

# CLAUDE.md

## Project

Hugo static site for racing.pahim.org — Pahim Racing 2027 Tillotson T4 Ireland Championship.

## Commands

```sh
npm install          # install dependencies (first time)
npm run dev          # dev server at localhost:1313 (live reload, drafts enabled)
npm run build        # production build to public/
```

## Directory Layout

- `content/` — page content as front-matter-only Markdown files (content lives in custom layouts)
- `layouts/` — Hugo templates: `_default/baseof.html` is the shell, `index.html` is the homepage
- `layouts/partials/` — reusable components: nav, hero, footer, head, system-status, tier-card
- `layouts/about/single.html` — The Program overview hub (mission, phase cards, timeline, founder)
- `layouts/foundation/single.html` — Phase 1: Foundation (physical, track, BoxBox sections)
- `layouts/competition/single.html` — Phase 2: Competition (campaign, team, telemetry, control env)
- `layouts/partnerships/single.html` — partnership tiers and value proposition
- `assets/css/main.css` — Tailwind source with component classes
- `static/img/` — images served at `/img/` (use this for new images)
- `hugo.toml` — site config, menus, params
- `tailwind.config.js` — custom colors, fonts, plugins

## Design System

### Colors (defined in tailwind.config.js)

- `redhat` (#EE0000) — primary accent
- `obsidian` (#0A0A0A) — page background
- `surface` (#111111) — card/component backgrounds
- `subtle` (#1A1A1A) — borders
- `muted` (#555555) — de-emphasized text
- `slate` (#8A8A8A) — body text

### Fonts

- `font-mono` — JetBrains Mono (headings, labels, code, buttons)
- `font-sans` — Inter (body text)

### Component Classes (defined in assets/css/main.css)

- `btn-primary` / `btn-outline` — call-to-action buttons
- `terminal-window` / `terminal-bar` / `terminal-body` — code terminal mockups
- `status-card` — dashboard metric cards
- `tier-card` / `tier-card.featured` — partnership tier cards
- `section-label` — monospace red uppercase label (e.g., "// The Stack")
- `section-title` — section heading
- `glow-border` — subtle red glow effect

## Site Structure

The site follows a phased campaign narrative:

- **Dashboard** (`/`) — homepage with hero, system status, program summary, telemetry preview, partnerships CTA
- **Foundation** (`/foundation/`) — Phase 1 detail: physical optimization (119→89kg), track development, BoxBox telemetry
- **Competition** (`/competition/`) — Phase 2 detail: T4 championship, Stapleton Motorsport, Alfano 7 telemetry
- **The Program** (`/about/`) — overview hub linking to phase pages, campaign timeline, Phase 3 "what's next", founder
- **Partnerships** (`/partnerships/`) — partnership tiers (Apex, Grid Partner, Supporter)

Nav also includes an external link to [boxbox.pahim.org](https://boxbox.pahim.org).

### Key Distinctions

- **BoxBox** = preparation-phase tool for rental kart telemetry (GoPro/RaceChrono). Lives on the Foundation page, NOT a standalone page
- **Alfano 7** = professional telemetry for T4 competition (Phase 2). Lives on the Competition page
- **Stapleton Motorsport** = racing team for 2027 T4 campaign. Integrated mention, not a separate section

## Brand Voice

- Engineering/systems language — never hobbyist or amateur framing
- "Campaign" not "hobby," "data acquisition" not "practice," "technical partnership" not "sponsorship"
- Target audience: B2B sponsors, tech executives, engineering peers
- Tone: mature, analytical, strategic, disciplined
- Aesthetic: "Technical Premium" — clean, high-contrast, dark mode
- The site is a B2B sales funnel, not a fan site — frame partnerships as strategic alignment, not sponsorship requests

## Hugo Conventions

- Unsafe HTML rendering is enabled in markdown (`markup.goldmark.renderer.unsafe = true`)
- CSS pipeline: `assets/css/main.css` → PostCSS (Tailwind) → minified + fingerprinted in production
- The `@tailwindcss/typography` plugin provides `prose` classes for markdown content
- Menu items are defined in `hugo.toml` under `[menus]`
- Site params (description, author, external URLs) are in `hugo.toml` under `[params]`

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

- `content/` — page content in Markdown (front matter: title, label, subtitle, description)
- `layouts/` — Hugo templates: `_default/baseof.html` is the shell, `index.html` is the homepage
- `layouts/partials/` — reusable components: nav, hero, footer, head, system-status, tier-card
- `layouts/partnerships/single.html` — custom layout for the partnerships page
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

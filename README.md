# Pahim Racing

Source for [racing.pahim.org](https://racing.pahim.org) — the web presence for the Pahim Racing 2027 Tillotson T4 Ireland Championship campaign.

## Tech Stack

- [Hugo](https://gohugo.io/) (extended) — static site generator
- [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS pipeline
- Typography: JetBrains Mono (headings/code) + Inter (body)

## Local Development

Prerequisites: [Hugo extended](https://gohugo.io/installation/), [Node.js](https://nodejs.org/)

```sh
npm install
npm run dev
```

The dev server starts at `http://localhost:1313` with live reload and draft content enabled.

## Build

```sh
npm run build
```

Outputs the production site to `public/` with minified assets.

## Project Structure

```
content/          Page content (Markdown)
layouts/          Hugo templates and partials
assets/css/       Tailwind CSS source (main.css)
static/img/       Images served directly by Hugo
tailwind.config.js
hugo.toml         Hugo configuration
```

## Related

- [boxbox](https://github.com/apahim/boxbox) — custom telemetry pipeline for karting performance analysis ([boxbox.pahim.org](https://boxbox.pahim.org))

## Author

Amador Pahim — Senior Principal Software Engineer, Red Hat

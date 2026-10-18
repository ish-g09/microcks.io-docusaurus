# microcks.io (Docusaurus)

Docusaurus 3 site for microcks.io, deployed on Netlify.

## Commands
- `npm install` then `npm start` — dev server
- `npm run build` runs, in order:
  1. `prebuild` → `scripts/ensure-descriptions.mjs`: adds a derived `description` to any doc/blog page without one (authored ones are never touched; this rewrites frontmatter, so commit the result).
  2. `docusaurus build` (also generates `llms.txt` / `llms-full.txt`, using the `rootContent` from `docusaurus.config.js`).
  3. `scripts/preload-fonts.mjs`: preloads the critical latin fonts in every page (avoids layout shift on font swap).
  4. `scripts/generate-route-markdown.mjs`: Markdown twins of every route (`build/<route>.md`).
  5. `scripts/validate-machine-content.mjs`: fails the build on missing/broken/non-canonical `llms.txt` links or over-long entries.
- `npm test` — unit checks; `npm run check:parity` — compares the live sitemap with the build

## Content
- Docs in `docs/`, blog in `blog/`, home/community data in `src/data/home.js`.
- The one-shot Hugo → Docusaurus migration script was retired at cutover: `docs/` and `blog/` are now the source of truth (the original Hugo content lives in the `microcks/microcks.io` history). Run `npm run optimize-images` after adding images to `static/images`.
- Hugo shortcodes are gone: use plain Markdown images and `<ApiSpec kind="openapi|asyncapi" url="…" />` in `.mdx` files.

## Theming notes
- Colour mode has two states (light/dark), no "system" option.
- Global CSS lives in `src/css/custom.css`; docs sidebar icons in `src/css/sidebar-icons.css` use `mask-size: 100% 100%` (needed for Safari/WebKit).
- The GitHub star counter (`src/components/GithubStar`) falls back to a hard-coded value when the unauthenticated API is rate-limited; update it occasionally.
- The accent blue `#46aaf3` and white-on-blue pairs fail WCAG contrast; kept deliberately for parity with the live site.

## Netlify
- `netlify.toml`, `static/_redirects`, `static/_headers`, and the edge function `netlify/edge-functions/content-negotiation.js` (serves Markdown for `Accept: text/markdown`).
- Analytics (GA, Scarf) load only after cookie consent.

## Cutover checklist (GitHub Pages → Netlify)
1. Deploy preview OK; `npm run check:parity` passes.
2. Verify `/helm/index.yaml`, `/operator/`, `/compose/`, `/schemas/`, `/go-client/`, `/testcontainers-go/`.
3. Lower DNS TTL, switch `microcks.io` to Netlify, re-check the above and the sitemap.
4. Submit the new sitemap; apply for Algolia DocSearch and swap the local search.

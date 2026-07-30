# DPP Radar

A static, single-page site (no build step) aggregating public information about the
EU Digital Product Passport (DPP): scope, ESPR rollout timeline, product categories,
mechanics diagram, a post-scan consumer preview, official-source news, FAQ, and a
contact form.

- `index.html` — all page content and sections
- `assets/css/styles.css` — styling (dark "radar/HUD" visual identity)
- `assets/js/app.js` — timeline/category/phone-mock rendering, filters, contact form
- `assets/img/og-image.png` — social preview image
- `robots.txt`, `sitemap.xml` — crawler access and discovery
- `.github/workflows/deploy-pages.yml` — deploys to GitHub Pages on every push to `main`

Live at: https://maximrotaruwbs.github.io/dpp-radar/

## SEO/GEO is part of every change — not a separate task

Whenever you change this site's content or structure, update SEO (search engines) and
GEO (generative/AI answer engines — ChatGPT, Perplexity, Google AI Overviews, Claude,
etc.) alongside it in the same commit. Do not treat this as optional polish; treat it
as part of the definition of done for any content change. Concretely, on every change:

1. **Static content must not depend on JavaScript.** The timeline track
   (`#timelineTrack`), category grid (`#categoryGrid`), and scan-preview phone mock-up
   (`#phoneScreen` / `#phoneCallouts`) are intentionally baked into `index.html` as real
   HTML *in addition to* being rendered by `assets/js/app.js` on load — most crawlers,
   including AI bots, don't execute JS. If you change the data arrays in `app.js`
   (`timelineEvents`, `categories`, `products`), update the matching static markup in
   `index.html` to match, and vice versa. Don't let these drift apart.

2. **JSON-LD must match visible text.** The `FAQPage` structured data in `<head>` must
   stay word-for-word in sync with the `<details class="faq-item">` entries in the FAQ
   section. If you add/remove/edit an FAQ entry, update both places.

3. **Meta tags reflect the actual current value proposition.** If the hero headline,
   tagline, or core sections change meaningfully, update `<title>`, `<meta
   name="description">`, `og:title`, `og:description`, `twitter:title`,
   `twitter:description` to match — don't leave stale copy in the `<head>`.

4. **Dates need to stay current.** `sitemap.xml`'s `<lastmod>`, the footer's "Content
   last checked" date, and the news section's "last verified" date should be bumped
   whenever you re-verify facts or ship a content change, so both crawlers and readers
   know how fresh the page is.

5. **News stays official-source-only.** Anything added to the News section must link
   to an official `ec.europa.eu` (or equivalent official EU) page — never blogs,
   vendors, or law firm write-ups. This is a trust signal for both readers and AI
   citation.

6. **New sections/pages need discoverability too.** If you add a new route or a
   meaningfully large new section, add/update the `sitemap.xml` entry, consider whether
   a new JSON-LD type is warranted (e.g. `Event`, `ItemList`), and check whether
   `robots.txt` needs adjusting.

7. **Rebrand/redesign → regenerate the OG image.** `assets/img/og-image.png` is a
   screenshot of a small standalone HTML snippet matching the hero's visual style (dark
   background, radar rings, wordmark, tagline). If the brand colors, logo, or tagline
   change, regenerate it (render the snippet at 1200×630 with headless Chromium/
   Playwright) rather than leaving a stale social preview.

8. **Validate before committing.** Confirm both `<script type="application/ld+json">`
   blocks still parse as valid JSON (e.g. `python3 -c "import json,re; ..."` extracting
   and `json.loads`-ing each block) after any edit near them.

## Deployment

Push to `main` (via a merged PR) to trigger `.github/workflows/deploy-pages.yml`,
which deploys straight to GitHub Pages. There is no staging environment — verify
changes locally (e.g. `python3 -m http.server` + headless Chromium screenshots) before
merging.

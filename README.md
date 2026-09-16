# AMEERA Al Hayat Beauty Salon — Website

A lightweight, static, bilingual (English / Arabic) website for AMEERA Al Hayat
Beauty Salon (صالون الأميرة الحياة للتجميل). Built with plain HTML, CSS and
vanilla JavaScript — no build step, no framework, no dependencies.

## Running it locally

You can simply double-click `index.html` to open it in a browser. For best
results (so the Google Font preconnects and relative paths behave exactly as
in production), serve it with any static file server, for example:

```bash
# Python
python -m http.server 8080

# Node (if you have it)
npx serve .
```

Then visit `http://localhost:8080`.

## Deploying

This is a fully static site — drag-and-drop the project folder onto
**Cloudflare Pages**, **Netlify**, or **Vercel** and it will work with zero
build configuration (no build command, output directory = project root).

## What to edit before going live

| What | Where |
|---|---|
| **Logo** | Already wired up — uses `assets/images/logo.jpeg` (compressed to `assets/images/optimized/logo.jpeg`, 512×512) in the header, hero, footer, favicon and social-share (Open Graph) image. Replace `assets/images/logo.jpeg` with a new file of the same name to update it everywhere, then re-run the compression step below. |
| **WhatsApp number** | `js/main.js` → `CONFIG.whatsappNumber` (digits only, with country code, e.g. `"971501234567"`). This single value powers the header "Book Now" button, hero CTA, the floating WhatsApp button, and the WhatsApp icon in Contact/Footer. |
| **Instagram link** | `js/main.js` → `CONFIG.instagramUrl` |
| **Address, email, opening hours** | `js/translations.js` → `UI.en.contact` and `UI.ar.contact` (edit both languages) |
| **Google Map** | `index.html` → the `<iframe src="https://www.google.com/maps?q=...">` inside the Contact section. Replace `Dubai,United+Arab+Emirates` with your exact address or paste an embed URL from Google Maps ("Share" → "Embed a map"). |
| **About text & stats** | `js/translations.js` → `UI.en.about` / `UI.ar.about` |
| **Testimonials** | `js/translations.js` → `TESTIMONIALS` array |
| **Gallery photos** | Uses your real photos only (no external placeholder service) — `js/main.js` → `CONFIG.galleryImages`, each entry `{ file, alt: { en, ar } }` pointing at a file in `assets/images/optimized/`. Add/remove/reorder entries there; drop new originals in `assets/images/` and compress them into `assets/images/optimized/` first (see the compression note below). |
| **Service prices/names** | `js/translations.js` → `SERVICES_DATA`. Everything is grouped by top-level category (Hair, Waxing & Threading, Skin, Nails, Eyelash & Eyebrow, Massage, Moroccan Bath, Henna) and then by subcategory, matching the original price list. Add, remove or re-price items here — the site re-renders from this single source of truth in both languages. |

## How the bilingual system works

- All UI copy and service data lives in `js/translations.js`, split into an
  `en` and `ar` version of every string (no duplicated HTML per language).
- The language toggle (`EN` / `عربي`) in the header calls `setLanguage()` in
  `js/main.js`, which:
  - Sets `lang` and `dir` on `<html>` (`dir="rtl"` flips the entire layout,
    not just the text — CSS handles mirrored paddings, icons and alignment
    via logical properties and a handful of `[dir="rtl"]` overrides).
  - Re-renders all dynamic sections (services, stats, gallery captions,
    testimonials, opening hours) from the translation data.
  - Persists the choice to `localStorage` so it's remembered on the next
    visit.
- Prices automatically render as `AED 40` in English and `40 د.إ` in Arabic.

## Project structure

```
/
├── index.html              Page markup / section structure
├── css/style.css           All styling (responsive, RTL-aware, light/dark)
├── js/translations.js      Bilingual UI strings + full service price list
├── js/main.js              Language switching, RTL, tabs/accordion, search, WhatsApp links
├── assets/images/          Logo + downloaded photos (originals) + optimized/ (web-sized copies actually used by the site)
└── README.md
```

## Photo backgrounds — which file went where

Section/category background photos are wired up in `css/style.css` (the Hero
background) and via CSS attribute selectors keyed to the Services tab id
(`.services-panel[data-cat-panel="…"]`). All of them read from
`assets/images/optimized/`, not the originals, since the originals you
downloaded were 1–5MB each — too heavy to ship directly as backgrounds or
inline gallery images. All seven photos (plus the logo) were resized to a
sensible max dimension (512px for the logo, 1600–2000px on the long edge for
photos) and re-compressed to JPEG quality 78–88, which brought the hero image
alone from 3.8MB down to ~160KB with no visible quality loss at the sizes
they're displayed. The originals are left untouched in `assets/images/` in
case you want to re-crop or re-export them yourself later.

| File used | Mapped to | Notes |
|---|---|---|
| `hair-saloon-1.jpg` | **Hero** background (`#home`) | The more editorial/spacious of the two hair shots — picked for the negative space it leaves for the hero heading. Preloaded via `<link rel="preload">` so it doesn't flash in late. |
| `nail-salon-1.jpg` | **Nails** tab background (Services → Nails) | Even, neutral backdrop behind the manicured hand — reads well tinted pink behind the white subcategory cards. |
| `massage-1.jpg` | **Massage** and **Moroccan Bath** tabs background | Only one spa/massage-style photo was suitable as a full-bleed tab background (the second, `massage-2.jpg`, is black-and-white with a male subject — used in the Gallery instead, see below). Both the Massage and Moroccan Bath tabs currently share this one image; swap in a second photo per tab later if you'd like them visually distinct. |
| `hair-saloon-2.jpg` | **About** section photo frame | The framed portrait image next to the About text. |

Every downloaded photo is now in use somewhere on the site — none are left
sitting unused. The remaining four (`hair-saloon-2.jpg`, `massage-2.jpg`,
`nail-salon-2.jpg`, `nail-salon-3.jpg`) power the **Gallery** grid alongside
the three background photos above; see `CONFIG.galleryImages` in
`js/main.js` to add, remove or reorder them.

**No facial/skincare or henna photos were included** in the downloaded batch,
so the About section and the Henna Design services tab still use their
original solid/gradient backgrounds untouched, per the "leave as-is if no
matching image" rule. Drop a facial/skincare shot in as
`assets/images/facial-1.jpg` and a henna shot as `assets/images/henna-1.jpg`
(then compress them the same way — see below) and I can wire up the same
tinted-photo treatment for those two the next time you ask.

**If you add more/replace these images:** re-run them through a compressor
(e.g. [squoosh.app](https://squoosh.app), target JPEG ~75–80 quality, longest
edge ~1800–2000px for a full-bleed background) before dropping them into
`assets/images/optimized/` — shipping multi-MB originals directly as CSS
backgrounds will noticeably slow the page down, especially on mobile.

## Scroll animations & backgrounds — how it works

- **Hero**: `css/style.css` → `.hero-bg` layers a directional pink gradient
  over `assets/images/optimized/hair-saloon-1.jpg`, `background-size: cover`,
  and `background-attachment: fixed` on desktop (disabled — falls back to
  `scroll` — under 768px, since fixed backgrounds cause scroll jank on
  iOS/Android).
- **Services category backgrounds**: applied per-tab via
  `.services-panel[data-cat-panel="nails|massage|moroccan-bath"]::before` in
  `css/style.css`. Because inactive tab panels stay `display:none` until
  clicked, the browser doesn't fetch an unused category's background image
  until that tab is actually opened — a free form of lazy-loading with no
  extra JS needed.
- **Overlay gradient direction flips in RTL**: both the hero and the services
  backgrounds use `linear-gradient(var(--overlay-dir), …)`, where
  `--overlay-dir` is `to bottom right` by default and flips to
  `to bottom left` under `html[dir="rtl"]` (see `:root` and
  `html[dir="rtl"]` at the top of `css/style.css`). No JS involved — it
  follows the same `dir` attribute the language toggle already sets.
- **Fade-in/scale-in on scroll**: any element with the `.reveal` class (the
  section headings, the about/services/gallery/testimonials/contact content
  blocks) starts at `opacity:0` + a slight `translateY`/`scale`, and
  `initScrollReveal()` in `js/main.js` uses an `IntersectionObserver` to add
  `.in-view` the first time each one enters the viewport, which triggers the
  CSS transition. Respects `prefers-reduced-motion`.
- **Staggered card cascade** (the about-stats boxes, gallery tiles,
  testimonial cards, and the Services subcategory cards): each item carries a
  `.reveal-item` class baked in from the moment it's rendered — it does *not*
  get added right before revealing, because doing both back-to-back lets the
  browser's CSS transition "reversal shortening" collapse the animation to
  near-zero duration. `staggerReveal()` in `js/main.js` sets an incrementing
  `transition-delay` per item, then adds `.in-view`, producing a
  cards-pop-in-one-after-another effect. Triggered once on scroll (via the
  same `IntersectionObserver` pattern) for the about/gallery/testimonials
  grids and the default Services tab; it also **replays every time a
  Services tab is switched** (see the click handler in `bindServiceEvents()`)
  — inspired by the cascading icon/card grids on
  [kuruvaislandresort.com](https://kuruvaislandresort.com/), which use
  WOW.js + animate.css with the same incremental-delay approach.
- **Hover lift**: testimonial cards and the about-stats boxes lift slightly
  on hover (`transform: translateY(-6px)`), matching the interactive card
  feel of the reference site.

## Notes

- The Services section is organized as tabs (top-level categories) containing
  collapsible accordion cards (subcategories) so the ~300-item price list
  stays scannable instead of one long page. The search box filters across
  both languages' service names live.
- A WhatsApp floating button is pinned to the corner on every section for
  one-tap booking.
- Basic SEO meta tags (title, description in both languages, Open Graph) are
  already in place in `index.html` — update the description/OG image once
  real branding assets are in place.

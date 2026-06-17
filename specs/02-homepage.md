# Spec: Homepage

**Status**: Draft  
**Route**: `/`

---

## Purpose

The homepage is the store's front window. It has two jobs: make someone want to buy cookies, and make it effortless to do so. It is not a landing page with marketing copy — it is a curated display, more like a beautiful menu than a sales pitch.

Secondary: it establishes the brand's character on first impression. A visitor who never buys should still leave thinking "that was a beautiful site."

---

## Page Structure

The page is divided into four sections, read top-to-bottom:

1. **Hero** — full-bleed, editorial opening
2. **Product Grid** — the catalog
3. **Feature Callout** — one product or story, told with depth
4. **Footer** — minimal, practical

---

## Section 1: Hero

### Intent
The hero is a poster. One image, one headline, one action. It should stop someone mid-scroll within the first second.

### Layout
- Full viewport height (100svh)
- The cookie photograph fills the entire section — no white padding around it
- Headline text overlaps the bottom-left of the image in massive display type
- A single CTA sits beneath the headline

### Content
- **Image**: A monumental top-down or close 3/4 shot of the hero cookie. Warm, high-contrast. The image bleeds to all edges.
- **Headline**: 3–5 mots. Déclaratif. Exemples : *"Cuits à la commande."* / *"Des cookies qui méritent d'attendre."* — court, confiant, sans point d'interrogation.
- **Subline** (optional): Une courte phrase, corps de texte plus petit, sous le titre. Pourrait être un descripteur permanent. Ex : *"Faits maison à Mont-de-Marsan."*
- **CTA button**: "Découvrir nos cookies" → scrolls to or navigates to the product grid

### Visual Design
- Headline in Fraunces 700, display size (72–96px on desktop, scales down gracefully)
- Headline color: Cream (`#FAF7F2`) — sits on the darker portion of the photograph
- A dark gradient scrim at the bottom-left of the image ensures legibility without obscuring the cookie
- No border, no card, no box around the text — it floats directly on the image
- Header is transparent here (see Header spec)

### Animation
- On page load: image fades in and scales very slightly from 1.02 → 1.0 over 600ms
- Headline slides up 8px and fades in, starting 200ms after the image begins

---

## Section 2: Product Grid

### Intent
The complete cookie catalog. Browsable, filterable, and immediately shoppable. Every item should feel like it deserves to be here.

### Layout
- Section opens with a small heading: "Nos cookies" (Fraunces 500, ~32px, left-aligned)
- Below: a 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- Each item is a **product card** (see below)
- No pagination — the full catalog is visible (expected catalog size: 8–24 cookies)

### Product Card

Each card represents one SKU.

**Content** (top to bottom):
1. **Product image** — square format, fills the top of the card, no border radius or shadow
2. **Category tag** — tiny uppercase label (e.g., "CHOCOLAT", "SANS FRUITS À COQUE") in Instrument Sans, Warm Sand color
3. **Product name** — Fraunces 500, ~22px, Espresso
4. **Price** — Instrument Sans 500, ~14px, Espresso. Format: `12,00 € / douzaine` — prix TTC
5. **Short descriptor** — one line, Lora 15px. Ex : "Chocolat noir, fleur de sel, beurre noisette."
6. **Ajouter au panier** button — text button with underline, not a filled button. Keeps the card feeling editorial rather than e-commerce generic.

**Card states**:
- Default: no background, no border. The card is just the image + text stacked.
- Hover: image lifts 3px (box-shadow), name underlines in Burnt Sienna
- Out of stock: category tag replaced with "ÉPUISÉ" tag. Add to cart button replaced with "Me prévenir" (future feature; for now, just disabled).
- Loading (while fetching from Shopify): skeleton placeholder in Biscuit color, same dimensions

**Card interaction**:
- Clicking the image or name opens the product detail page (`/cookies/[handle]`) — not yet specced
- Clicking "Add to cart" adds the item and opens the cart drawer

### Filtering (optional, phase 2)
Not in the initial build. A simple tag-based filter (e.g., "Tous / Chocolat / Sans fruits à coque / Saison") may be added above the grid later. Reserve horizontal space for it.

---

## Section 3: Feature Callout

### Intent
Give one product — or one story about the craft — space to breathe. This section slows the page down and communicates depth. It is not a sale banner.

### Layout
- Full-width section, two columns on desktop: large image left, text right (or reversed)
- Asymmetric: image takes 60% of the width, text block is offset vertically (not perfectly centered)
- The image may bleed beyond the section boundary vertically

### Content
- **Image**: A close, intimate shot of a single cookie or the baking process. Not a product shot — a photograph.
- **Kicker** (small label): "Le préféré de la semaine" / "Le choix du boulanger" / "Nouveauté"
- **Headline**: Product name, large (Fraunces 600, 48px)
- **Description**: 2–3 phrases sur ce qui rend ce cookie spécifique. Notes de dégustation, ingrédients, pourquoi il existe.
- **CTA**: "Ajouter au panier" or "Voir tous nos cookies" depending on whether it's a specific product

### Visual Design
- Section background: Espresso (`#1A0F0A`) — dark, creates contrast and drama after the light product grid
- Text in Cream on the dark background
- The image is the focal point; text is secondary

---

## Section 4: Footer

### Intent
Practical closure. Not a marketing surface.

### Content
- Left: Wordmark "Simeon Cookies" in Fraunces + address line: "Mont-de-Marsan, Occitanie"
- Center: Navigation links (same as header: Nos cookies, Nos revendeurs, À propos) + legal links: Mentions légales · CGV · Confidentialité
- Right: "© 2026 Simeon Cookies" in small Instrument Sans
- Second row (optional): "Fabriqué avec soin à Mont-de-Marsan, Landes (40)."

### Visual Design
- Background: Espresso (`#1A0F0A`)
- Text: Warm Sand and Cream
- 1px top border in a slightly lighter Espresso tone
- Compact — 80–100px total height on desktop

---

## Page States

| State | Behavior |
|-------|----------|
| Loading (initial Shopify fetch) | Product grid shows skeleton cards; hero and footer render immediately |
| Empty catalog | Show a "no products available" message in place of the grid — copy TBD |
| Shopify error | Show a gentle error state with a retry option; do not show a broken grid |

---

## SEO / Meta

### Balises de base

| Tag | Value |
|-----|-------|
| `<html lang>` | `fr` |
| `<title>` | `Simeon Cookies — Cookies artisanaux à Mont-de-Marsan` |
| `meta description` | `Simeon Cookies propose des cookies artisanaux faits maison à Mont-de-Marsan, Landes. Commandez en ligne ou retrouvez-nous chez nos revendeurs en Occitanie.` |
| OG image | Hero cookie photograph |
| OG locale | `fr_FR` |
| Canonical | `https://[domain]/` |

### SEO local

The store's primary audience is in Mont-de-Marsan and the surrounding Occitanie region. Local signals to include:

- `<title>` and `meta description` mention "Mont-de-Marsan" explicitly
- Footer includes the physical address (required by French law and valuable for local SEO)
- A **LocalBusiness structured data block** (`application/ld+json`) on the homepage:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Simeon Cookies",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[à compléter]",
      "addressLocality": "Mont-de-Marsan",
      "postalCode": "40000",
      "addressRegion": "Landes",
      "addressCountry": "FR"
    },
    "url": "https://[domain]",
    "servesCuisine": "Cookies artisanaux",
    "priceRange": "€€"
  }
  ```
- `hasMap` can be added once a Google Maps listing exists

### Robots

- Homepage: indexable (`index, follow`)
- Sitemap: `sitemap.xml` generated at build time (Nuxt module)

---

## Out of Scope

- Product detail page (separate spec to come)
- Blog / journal section
- Reviews / testimonials section
- Email capture / newsletter popup

# Simeon Cookies — Brand & Design Direction

This document is the foundation for all other specs. Every page and component should align with the direction defined here.

---

## Brand Concept

Simeon Cookies is an artisan cookie atelier. The brand sits at the intersection of serious craftsmanship and everyday pleasure — not a cutesy bakery, not a generic food-delivery app. The feeling is closer to a high-end patisserie that happens to sell online: warm, confident, tactile.

The one thing someone should remember: **this looks like a place that obsesses over cookies the way a sommelier obsesses over wine.**

---

## Visual Tone

**Editorial artisan.** Think a Kinfolk food spread or a Mast Brothers chocolate bar — warm materials, big confident typography, photography that treats the product as art. The design takes itself seriously without being cold.

Avoid: pastel pink/brown clichés, cartoon bakery aesthetics, generic DTC startup minimalism, purple-gradient-on-white AI defaults.

---

## Color Palette

| Role | Token | Name | Value |
|------|-------|------|-------|
| Background | `--ui-bg` | Cream | `#fbf2e9` |
| Primary (CTAs, highlights) | `primary` | Peach | `#e9baa3` |
| Secondary (headings, overlays) | `secondary` | Ink | `#1d2b3b` |
| Neutral chrome | `neutral` | Stone | Tailwind stone scale |
| Error | `error` | — | Tailwind red (default) |
| Success | `success` | — | Tailwind green (default) |

### Theme implementation

Colors are registered in `assets/css/main.css` as `@theme static` custom scales (`peach` and `ink`) and wired up in `app.config.ts`. `--ui-primary` is pinned to shade 400 of the peach scale (the exact `#e9baa3` value). The background override (`--ui-bg: #fbf2e9`) is set in `:root`.

The dominant pair is **Cream + Ink**, with Peach used for action items and focus states. Never use more than two accent colors on a single screen.

---

## Typography

**Display** — Fraunces (variable, wght 300–900, optical size)
- Old-style serif with dramatic thick-thin contrast
- Used for headlines, product names, page titles
- Set large. Crop tight. Let it breathe on one side.

**Body** — Lora (400, 600)
- Warm humanist serif, excellent readability
- Product descriptions, body copy, labels

**UI / Utility** — Instrument Sans (400, 500)
- Clean, neutral, used only for navigation, prices, form labels, metadata
- Never for headlines

### Scale

| Token | Size | Font | Weight | Use |
|-------|------|------|--------|-----|
| `--display` | 72–96px | Fraunces | 700 | Hero headlines |
| `--title-lg` | 48px | Fraunces | 600 | Section titles, product names |
| `--title-md` | 32px | Fraunces | 500 | Subsection headers |
| `--body-lg` | 18px | Lora | 400 | Product descriptions |
| `--body-sm` | 15px | Lora | 400 | Supporting copy |
| `--label` | 13px | Instrument Sans | 500 | Prices, tags, nav items |
| `--caption` | 11px | Instrument Sans | 500 uppercase | Category labels, breadcrumbs |

---

## Layout Principles

- **Asymmetry first.** Centered layouts are a last resort. Content should pull to one side; imagery should bleed or overlap.
- **Grid-breaking elements.** Product images may clip outside their container. Display type may overlap a photograph. A section may shift the baseline grid intentionally.
- **Generous negative space.** Resist the urge to fill. Empty parchment is part of the composition.
- **Full-bleed photography.** Cookie images should feel monumental. On the homepage, the hero image should feel like a poster.
- **Consistent spacing rhythm.** Base unit = 8px. Section padding = 80–120px top/bottom. Component gaps = 24–48px.

---

## Motion

Motion should feel deliberate and unhurried — like watching someone place a tray of cookies on a counter.

- **Page transitions**: Soft fade + 4px upward drift (200ms ease-out)
- **Image reveals**: Fade in with a very slight scale from 1.02 → 1.00 (300ms)
- **Cart additions**: The product image arcs toward the cart icon in the header (CSS transform, 400ms cubic-bezier)
- **Hover states**: Underline slides in; images warm slightly (brightness filter); buttons lift 2px with shadow
- **Never**: Bouncy spring animations, aggressive parallax, scroll-jacking

---

## Imagery

- **Photography style**: Top-down or slight 3/4 angle, warm natural light, linen/marble/wood surfaces. Never white-box product shots.
- **Backgrounds in images**: Warm neutral surfaces that complement the parchment palette.
- **Quantity**: Never more than 3 images visible at once in a layout. Let each image count.

---

## Language & Locale

The site is entirely in **French**. No i18n or language toggle in v1.

- `<html lang="fr">`
- Locale: `fr-FR`
- Currency: Euro, displayed as `12,00 €` (space before €, comma as decimal separator — French typographic convention)
- Date format: `17 juin 2026` (day month year, no ordinal)

---

## Voice & Copy

All copy is written in French. The tone is confident, warm, and direct — the same editorial restraint, just in French.

- **Court. Direct. Confiant.** "Chocolat noir, fleur de sel." Not "Laissez-vous tenter par notre irrésistible cookie au chocolat noir parsemé d'une touche de fleur de sel."
- **Pas de baratin marketing.** No "fait avec amour" or "artisanal et généreux". The design says it; the copy doesn't need to.
- **Prix affichés TTC, clairement.** Always `12,00 €` format. No `.99` pricing. TVA incluse — always stated or inferable.
- **CTA copy**: "Ajouter au panier" (not "Acheter"). "Valider le panier" (not "Passer à la caisse"). "Commander" (not "Finaliser l'achat").

---

## French Legal Requirements

French e-commerce law (Code de la consommation) mandates several elements. These are not optional.

| Requirement | Where |
|-------------|-------|
| **Mentions légales** | Footer link → `/mentions-legales` |
| **CGV** (Conditions Générales de Vente) | Footer link → `/cgv`; also linked at checkout |
| **Politique de confidentialité / RGPD** | Footer link → `/confidentialite` |
| **Droit de rétractation** (14 jours) | Mentioned on the order confirmation page and in CGV |
| **TVA** | Prices always displayed TTC; VAT number in mentions légales |
| **Bandeau cookies RGPD** | Cookie consent banner on first visit (technical sub-spec to come) |

These pages do not need to be beautiful — they need to be complete and legally accurate. Content is out of scope for these specs; consult a lawyer or use a compliant template.

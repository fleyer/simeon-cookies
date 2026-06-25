# Spec: Homepage — Product Grid

**Status**: Draft  
**Parent**: [02-homepage.md](02-homepage.md)

---

## Intent

The complete cookie catalog. Browsable, filterable, and immediately shoppable. Every item should feel like it deserves to be here.

---

## Layout

- Section opens with a small heading: "Nos cookies" (Fraunces 500, ~32px, left-aligned)
- Below: a 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- Each item is a **product card** (see below)
- No pagination — the full catalog is visible (expected catalog size: 8–24 cookies)

---

## Product Card

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

---

## Filtering

Not in the initial build. A simple tag-based filter (e.g., "Tous / Chocolat / Sans fruits à coque / Saison") may be added above the grid later. Reserve horizontal space for it.

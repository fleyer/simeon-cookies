# Spec: Order — Product Catalog

**Status**: Draft
**Route**: `/order`
**Related**: [02-homepage.md](02-homepage.md), [02a-hero-ctas.md](02a-hero-ctas.md), [08-cookie-card.md](08-cookie-card.md), [04-cart.md](04-cart.md)

---

## Intent

The complete cookie catalog, on its own dedicated page. Browsable, filterable, and immediately shoppable. Every item should feel like it deserves to be here.

This used to live as a section on the homepage. It is now a standalone page at `/order`, reached primarily via the hero's Left panel CTA ("C'est ici" — see [02a-hero-ctas.md](02a-hero-ctas.md)). Pulling it off the homepage gives the catalog room to grow (filtering, more SKUs) without competing with the homepage's editorial pacing (Hero → Feature Callout → Footer).

---

## Page Structure

1. **Page heading** — "Nos cookies" (Fraunces 500, ~32px, left-aligned), with room reserved above the grid for the filter row (see Filtering below)
2. **Catalog grid** — the cards themselves
3. Standard header + footer (same as Homepage)

---

## Layout

- Below the heading: a 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- Each item renders via the shared `<ProductCard>` component — see [08-cookie-card.md](08-cookie-card.md) for the card's visual anatomy, props, and states. This spec only covers grid-level concerns (layout, the add-to-cart action, loading/empty states) — not the card's internals.
- No pagination — the full catalog is visible (expected catalog size: 8–24 cookies)

---

## Add to Cart

`<ProductCard>` itself has no built-in CTA — that's this page's responsibility (see [08-cookie-card.md](08-cookie-card.md) "Known Gaps / TODO" and States → Soldout). The grid wraps or extends each card with:

- **"Ajouter au panier"** — text button with underline, not a filled button. Keeps the page feeling editorial rather than e-commerce generic.
- Out of stock (`status="soldout"`): button replaced with "Me prévenir" (future feature; for now, just disabled).
- Clicking "Ajouter au panier" adds the item and opens the cart drawer (see [04-cart.md](04-cart.md)).
- Clicking the card itself (image or title) opens the product detail page (`/cookies/[handle]`) — not yet specced.

---

## Page States

| State | Behavior |
|-------|----------|
| Loading (initial Shopify fetch) | Grid shows `<ProductCard>` skeletons at the same dimensions; heading renders immediately |
| Empty catalog | Show a "no products available" message in place of the grid — copy TBD |
| Shopify error | Show a gentle error state with a retry option; do not show a broken grid |

---

## Filtering

Not in the initial build. A simple tag-based filter (e.g., "Tous / Chocolat / Sans fruits à coque / Saison") may be added above the grid later. Reserve horizontal space for it.

---

## Task List

### 1. Route + page scaffold
- [ ] Create `pages/order/index.vue` at route `/order`
- [ ] Add page heading ("Nos cookies") and reserve horizontal space above the grid for the future filter row
- [ ] Wire standard header/footer (page should look like a natural extension of the site, not a bare shell)

### 2. Catalog grid
- [ ] Build the responsive grid (3-col desktop / 2-col tablet / 1-col mobile), no pagination
- [ ] Render `<ProductCard>` per SKU using props per [08-cookie-card.md](08-cookie-card.md)
- [ ] Wire the Shopify fetch (Storefront API via `composables/useShopify.ts`) to populate the grid

### 3. Add-to-cart wiring
- [ ] Add the "Ajouter au panier" text-underline button per card (outside `<ProductCard>`, per its documented scope)
- [ ] Wire click → add to cart + open cart drawer (see [04-cart.md](04-cart.md))
- [ ] Wire soldout state → "Me prévenir" label, disabled
- [ ] Wire card click-through (image/title) — route to `/cookies/[handle]` once the product detail page exists (stub link until then)

### 4. Page states
- [ ] Loading skeletons (via `<ProductCard>` loading state)
- [ ] Empty-catalog message
- [ ] Shopify error state with retry

### 5. Cross-spec cleanup (unblocks this page, tracked here for visibility)
- [ ] Confirm `/order` route exists so [02a-hero-ctas.md](02a-hero-ctas.md)'s Left panel link resolves (this page *is* that prerequisite)
- [ ] Update [02-homepage.md](02-homepage.md) — product grid is no longer a homepage section (done as part of this rename, see below)

---

## Out of Scope

- Filtering (see Filtering above)
- Product detail page (`/cookies/[handle]`) — separate spec to come
- Cart drawer internals — see [04-cart.md](04-cart.md)
- Wire soldout state → "Me prévenir" label, disabled

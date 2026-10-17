# Spec: Cart — v3 Dedicated Page

**Status**: Implemented — `pages/cart.vue`, `components/cart/CartSummary.vue`; `components/CartDrawer.vue` deleted. Line items are keyed by `variantId ?? id`. The 200ms row fade-out from 04-cart.md is not built
**Route**: `/cart`
**Supersedes**: [04b-cart-v2-ui.md](04b-cart-v2-ui.md) (the drawer UI). The store state layer from [04a-cart-v1-state.md](04a-cart-v1-state.md) is kept as-is.
**Depends on**: [04-cart.md](04-cart.md) (design source of truth for copy, colors, line item behavior)

---

## Goal

Replace the slide-in drawer with a regular page at `/cart`. The cart icon in the header becomes a link to that page. Everything the drawer did (review lines, edit quantity, remove, see subtotal, proceed to checkout) moves onto the page; the drawer, its open/close state, and its overlay behavior are removed.

Why a page: a URL the user can return to or bookmark, native back-button behavior, no focus-trap/overlay/vaul edge cases, and room for a two-column layout on desktop.

---

## Decisions (flagged for review)

1. **Route is `/cart`** (`pages/cart.vue`), not nested under `/order` — `/order` is the catalog.
2. **Adding to cart does not navigate and does not open anything.** The header badge is the only feedback, as is already the case today (auto-open was deferred in 04b). The "auto-open on add" lines in `03-order.md` / `04-cart.md` are dropped from the spec rather than redirecting users to `/cart` after every add, which would break catalog browsing.
3. **"Continuer mes achats" and the empty-state "Voir nos cookies" link both go to `/order`** (they used to just close the drawer).
4. **Cart icon becomes a `NuxtLink` to `/cart`** (keeps `aria-label` "Panier" and the `cart-badge` test id).
5. **Line item product links** keep their current target (`/cookies/[handle]`), minus the `cartStore.close()` call. That route does not exist yet; unchanged by this spec.
6. **`noindex`** on `/cart` — personal, no search value.
7. Still deferred (unchanged from 04b): quantity-removal undo window, "item added" highlight, out-of-stock row state, free-shipping threshold.

---

## Layout

Page content sits below the fixed header (same top padding convention as `pages/order/index.vue`: `pt-[--ui-header-height] sm:pt-40`).

### Desktop (≥ `lg`)

Two columns, max width `max-w-5xl`, centered:

```
Mon panier (3)
──────────────────────────────┬──────────────────────────
[ img ]  Chocolat noir…       │  Sous-total TTC     40,00 €
         12,00 € / douzaine   │  Livraison calculée à
         [ − ] 1 [ + ]   🗑   │  l'étape suivante
─────────────────────────────  │  ─────────────────────────
[ img ]  Beurre noisette…     │  [ Valider le panier ]
         …                    │  Continuer mes achats
```

- Left (~2/3): heading + line item list. Page scrolls normally; no internal scroll area.
- Right (~1/3): summary card, `sticky` below the header so it stays visible while a long list scrolls.

### Mobile / tablet (< `lg`)

Single column: heading, line items, then the summary block below the list. Checkout CTA is part of the summary (not fixed to the viewport bottom) in this pass.

### Surface

- Page background: unchanged site background.
- Summary card: Cream (`#FAF7F2`), 1px Biscuit border, 4px radius, padding 24px.
- Line items keep their 1px Biscuit dividers.

---

## Content and behavior

All copy, typography, and line item behavior are defined in [04-cart.md](04-cart.md) and unchanged, except:

- **Heading** "Mon panier" is now a page `<h1>` (Fraunces 500, ~32px desktop / 28px mobile) with the live item count: "Mon panier (3)".
- **No close (X) button** and no `closeAriaLabel` — there is nothing to close. Remove `closeAriaLabel` from `content/fr/cart.ts`.
- **"Valider le panier"** calls `cartStore.checkout()` as today (loading state, `checkoutError` message). It no longer closes anything.
- **"Continuer mes achats"** is a `NuxtLink` to `/order` (text link, Instrument Sans 13px, Espresso).
- **Empty state**: same copy and icon, rendered in the page body (the two-column layout collapses to the centered empty state). "Voir nos cookies" is a `NuxtLink` to `/order`. Summary and CTAs are hidden.
- **Hydration**: the cart is restored from localStorage after `onNuxtReady`, so on a hard load of `/cart` the first client render has no items. Wrap the item list/summary in `<ClientOnly>` with a neutral fallback (no empty-state flash) — same approach as `pages/order/index.vue`.

---

## Store changes (`stores/cart.ts`)

Remove drawer state: `isOpen`, `open()`, `close()` and their entries in the returned object. No other store changes. (Other pending store work, e.g. the `last-order` snapshot and cart TTL in [06-order-confirmation.md](06-order-confirmation.md), is independent.)

---

## Component structure

```
pages/
  cart.vue                 — NEW: page shell, two-column layout, heading, summary, CTAs
components/
  cart/
    CartLineItem.vue       — kept; drop the cartStore.close() on the product link
    CartEmptyState.vue     — kept; "Voir nos cookies" becomes a NuxtLink to /order
    CartSummary.vue        — NEW (optional): subtotal, shipping note, error, CTAs — extracted so the page stays small
  CartDrawer.vue           — DELETED
```

`AppHeader.vue`: cart `<button>` → `<NuxtLink to="/cart">`, remove `<CartDrawer />` and the `cartStore.open()` call. `layouts/default.vue`: remove the `vaul-drawer-wrapper` attribute **only if** nothing else uses `UDrawer` (the header's mobile nav uses `UHeader` slideover mode, not `UDrawer` — verify before removing).

---

## Content strings (`content/fr/cart.ts`, `content/types.ts`)

- Remove `closeAriaLabel`.
- Add `cart.metaTitle`: "Mon panier — Simeon Cookies".
- Everything else unchanged.

---

## SEO / Meta

- `<title>`: "Mon panier — Simeon Cookies"
- `noindex`
- Not added to the sitemap / prerender-for-SEO list (see [02f-seo.md](02f-seo.md)). With `nuxt generate`, `/cart` is still prerendered as a static shell.

---

## Testing (`tests/cart.spec.ts`)

Rewrite the drawer test as a page test:
- Add items on `/order`, click the header cart link, URL becomes `/cart`, heading shows "Mon panier (2)"
- Increment/decrement updates the line quantity, heading count, and header badge
- Decrement at 1 removes the row; trash button removes the row; last removal shows the empty state and hides summary/CTAs
- Hard-load `/cart` with a seeded localStorage cart: items appear (no empty-state flash)
- "Continuer mes achats" and "Voir nos cookies" navigate to `/order`
- Existing badge/reload test stays unchanged
- Mobile viewport: single column, summary below the list

Replace `page.getByRole('dialog')` scoping with `page.getByRole('main')` (or the page container).

---

## Out of scope

- Everything already deferred in 04 / 04b (see Decisions #7)
- Promo codes, gift wrap, saved carts, cross-sell
- Mini-cart / hover preview in the header

# Spec: Cart

**Status**: v1 state implemented ([04a-cart-v1-state.md](04a-cart-v1-state.md)); drawer UI ([04b-cart-v2-ui.md](04b-cart-v2-ui.md)) was replaced by a dedicated page — see [04c-cart-page.md](04c-cart-page.md) (Implemented). Some deferred items not built  
**Type**: Dedicated page at `/cart` (previously a slide-in drawer)

---

## Purpose

The cart is where intent becomes commitment. It must answer one question without friction: "what am I about to buy, and does it look right?" Then get out of the way.

The cart is a dedicated page (`/cart`) so it has a URL, works with the back button, and has room to breathe. The user can review, adjust, and proceed — or go back to the catalog and keep browsing.

---

## Trigger

The user reaches the cart page by:
- Clicking the cart icon in the header (a link to `/cart`)
- Visiting `/cart` directly

Adding a product does **not** navigate to the cart or open anything; the header badge updates and that is the feedback.

The user leaves the page via:
- The header navigation / logo / browser back button
- "Continuer mes achats" (→ `/order`)
- "Valider le panier" (→ Shopify hosted checkout, see [05-payment.md](05-payment.md))

---

## Layout

Full page below the fixed header. Details (columns, breakpoints, summary card) are in [04c-cart-page.md](04c-cart-page.md).

```
Mon panier (3)
──────────────────────────────┬──────────────────────────
[ img ]  Chocolat noir fleur  │  Sous-total TTC     40,00 €
         12,00 € / douzaine   │  Livraison calculée à l'étape
         [ − ] 1 [ + ]   ✕    │  suivante
                              │  ─────────────────────────
[ img ]  Beurre noisette…     │  [ Valider le panier ]
         14,00 € / douzaine   │  Continuer mes achats
         [ − ] 2 [ + ]   ✕    │
```

- **Desktop (≥ lg)**: two columns — line items left, sticky summary card right
- **Mobile / tablet**: single column — line items, then summary
- **Background**: site background; summary card in Cream (`#FAF7F2`) with a 1px Biscuit border
- The page scrolls normally; there is no internal scroll area

---

## Header Area

- "Mon panier" page heading (`<h1>`) in Fraunces 500, ~32px desktop / 28px mobile
- Item count as a parenthetical: "Mon panier (3)" — updates live
- No close button — it's a page, not an overlay

---

## Cart Line Items

Each line item shows:

1. **Thumbnail** — square, 72×72px, same product image as the card. Rounded 4px.
2. **Product name** — Fraunces 500, 16px, links to the product page
3. **Unit price** — Instrument Sans, 13px, Warm Sand color
4. **Quantity control** — inline: `[ − ] 2 [ + ]` with the count centered. Tapping − at quantity 1 removes the item (with a confirmation moment — see below). Buttons are minimal: just the symbol, no border.
5. **Remove button (✕)** — far right, small, Instrument Sans. Clicking removes the line item immediately, with a brief fade-out animation on the row.

### Quantity removal confirmation
When tapping − at a quantity of 1, the item doesn't disappear immediately. Instead:
- The row enters a "remove?" state
- The remove button becomes a brief "Annuler" label (3 seconds)
- After 3 seconds (or on page interaction), the row disappears
- The "Annuler" window lets users recover from accidental taps

### Line item states
- Default: as described above
- Out of stock (item becomes unavailable after being added): row shows a warning tag "Plus disponible" in Terracotta, quantity controls disabled. User must remove it before proceeding.

---

## Summary Area

Right-hand summary card on desktop (sticky below the header), below the item list on mobile:

- **Sous-total**: Right-aligned, Fraunces 500, 20px. Shows the cart total before shipping. Labeled "Sous-total TTC".
- **Shipping note**: "Livraison calculée à l'étape suivante" in small Lora, Warm Sand. This line disappears if a free shipping threshold is met (future: configurable).
- A 1px Biscuit divider separates items from summary.

---

## CTAs

Two actions, stacked:

1. **"Valider le panier"** — primary action
   - Full-width, filled button
   - Background: Burnt Sienna (`#C4622D`), text in Cream
   - Fraunces 600, 16px
   - Hover: darkens 8% (no animation beyond that)

2. **"Continuer mes achats"** — secondary action
   - Text-only link, centered
   - Instrument Sans, 13px, Espresso
   - Navigates to `/order`

---

## Empty State

When the cart has no items:

- The page body shows a centered empty state:
  - Icon: a minimal outlined bag illustration (SVG)
  - Text: "Votre panier est vide." in Fraunces 400, 20px
  - Subtext: "Allez choisir quelque chose de bon." in Lora 15px
  - A "Voir nos cookies" link (→ `/order`)
- The summary area and CTAs are hidden in the empty state

---

## "Item added" Confirmation

Adding an item from the [order page](03-order.md) or the homepage's Feature Callout does not open or navigate to the cart. The header badge count (with its pop animation) is the confirmation. (Deferred: a highlight on the new row when the user next visits the cart.)

---

## Visual Design

- Clean, uncluttered. This is a functional surface, not a design showcase.
- The aesthetic matches the brand but restraint is the priority — the user is completing a task.
- No decorative elements beyond the brand typography and palette.
- Line items separated by 1px Biscuit dividers.

---

## Animation

| Event | Animation |
|-------|-----------|
| Item removed | Row fades out and collapses in height, 200ms |
| Header badge change | Existing `badge-pop` transition |

No page-level transition beyond Nuxt's default route change.

---

## States

| State | Description |
|-------|-------------|
| Empty | No items, empty state UI shown |
| Has items | Full line item list with summary and CTAs |
| Item unavailable | Warning tag on affected row, proceed blocked |
| Loading (rare) | If cart state is being fetched, show a minimal spinner in the header area |

---

## Out of Scope

- Discount / promo code entry (future — a code input field would appear in the summary area)
- Gift wrapping options
- Saved cart / wishlist
- Cross-sell recommendations ("You might also like…")

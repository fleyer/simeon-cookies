# Spec: Cart

**Status**: Draft  
**Type**: Slide-in drawer (not a separate page)

---

## Purpose

The cart is where intent becomes commitment. It must answer one question without friction: "what am I about to buy, and does it look right?" Then get out of the way.

The cart appears as a drawer so the user never loses their place in the product catalog. They can review, adjust, and proceed — or close and keep browsing.

---

## Trigger

The cart drawer opens when:
- The user clicks the cart icon in the header
- The user clicks "Ajouter au panier" on any product card (opens automatically after adding)

It closes when:
- The user clicks the overlay (the darkened area to the left of the drawer)
- The user clicks a close button (X) inside the drawer
- The user clicks "Valider le panier"

---

## Layout

The drawer slides in from the **right** edge of the viewport.

```
[ X ]                   Mon panier
─────────────────────────────────
[ img ]  Chocolat noir fleur de sel
         12,00 € / douzaine
         [ − ] 1 [ + ]      ✕

[ img ]  Beurre noisette, noix de pécan
         14,00 € / douzaine
         [ − ] 2 [ + ]      ✕
─────────────────────────────────
         Sous-total          40,00 €
         Livraison      calculée à l'étape suivante
─────────────────────────────────
         [ Valider le panier ]
         [ Continuer mes achats ]
```

- **Width**: 420px on desktop, full-width on mobile (< 480px)
- **Height**: Full viewport height
- **Background**: Cream (`#FAF7F2`)
- **Overlay**: Parchment-tinted dark overlay on the page behind (opacity 60%)
- The cart scrolls internally if more items than visible area allows

---

## Header Area

- A small "X" close button, top-right corner of the drawer
- "Mon panier" heading in Fraunces 500, ~24px
- Item count as a parenthetical: "Mon panier (3)" — updates live
- These stay fixed at the top as the item list scrolls

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

Fixed at the bottom of the drawer (does not scroll with items):

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
   - Closes the drawer

---

## Empty State

When the cart has no items:

- The item list area shows a centered empty state:
  - Icon: a minimal outlined bag illustration (SVG)
  - Text: "Votre panier est vide." in Fraunces 400, 20px
  - Subtext: "Allez choisir quelque chose de bon." in Lora 15px
  - A "Voir nos cookies" link (→ closes drawer, no navigation, since the catalog is already behind it)
- The summary area and CTAs are hidden in the empty state

---

## "Item added" Confirmation

When a user adds an item to cart (from the product grid), the cart drawer opens automatically and the newly added item briefly highlights:
- The new row has a 1px Burnt Sienna left border that fades out over 1.5 seconds
- No toast or popup — the drawer itself is the confirmation

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
| Drawer open | Slides in from right, 300ms cubic-bezier(0.16, 1, 0.3, 1) |
| Drawer close | Slides out to right, 250ms ease-in |
| Overlay | Fades in/out with the drawer |
| Item removed | Row fades out and collapses in height, 200ms |
| Item added highlight | Left border in Burnt Sienna fades out, 1.5s |

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

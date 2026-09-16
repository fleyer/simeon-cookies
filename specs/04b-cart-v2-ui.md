# Spec: Cart — v2 Drawer UI

**Status**: Draft
**Depends on**: [04-cart.md](04-cart.md) (full cart UX reference — layout, copy, colors, animation timings all defined there), [04a-cart-v1-state.md](04a-cart-v1-state.md) (store, persistence, header badge — already built)
**Scope**: The cart drawer component itself — open/close, line item list with quantity edit + delete, summary, checkout CTA

---

## Goal

Build the actual drawer UI on top of the v1 state layer. `04-cart.md` is the design source of truth for look, copy, and animation — this spec narrows it to what ships in this pass and calls out the store changes needed to support it.

At the end of v2:
- Clicking the cart icon in the header opens a slide-in drawer showing cart contents.
- **On mobile, the drawer occupies the entire screen** (no visible overlay strip, no partial width — full viewport width and height).
- On desktop it behaves as `04-cart.md` describes: fixed width panel from the right edge with a dimmed overlay over the rest of the page.
- Each line item has working `−`/`+` quantity controls and a delete (✕) action.
- A "Valider le panier" button sits pinned at the bottom of the drawer.

---

## In scope

- Drawer component (`components/CartDrawer.vue`), mounted once in `app.vue` or `AppHeader.vue`, toggled by a shared open/close state
- Header cart button (`AppHeader.vue`) opens the drawer on click
- Overlay + close button (X) + "Continuer mes achats" link all close the drawer
- Line items: thumbnail, title, unit price, `[ − ] qty [ + ]`, delete (✕) — per `04-cart.md`'s Line Items section
- Subtotal in the summary area (compute from `items`, since price is a display string — see Store changes below)
- Empty state (per `04-cart.md`'s Empty State section) — the drawer needs *some* state when `items` is empty, so this ships now rather than as a follow-up gap
- Full-screen behavior on mobile (< 640px, matching the project's existing Tailwind breakpoints)

## Out of scope (deferred)

- Quantity-removal undo window ("Annuler" 3s confirmation on `−` at qty 1) — ship plain removal first, add the confirmation as a follow-up
- "Item added" left-border highlight animation on the new row
- Out-of-stock row state ("Plus disponible" tag) — no stock re-validation exists yet
- Free-shipping threshold logic for the shipping note
- Auto-opening the drawer when "Ajouter au panier" is clicked on the order page (stays closed until the user opens it explicitly, for this pass)

---

## Store changes (`stores/cart.ts`)

Two actions need adding alongside the existing `addItem`:

```ts
function updateQuantity(id: string, quantity: number) {
  const item = items.value.find((i) => i.id === id)
  if (!item) return
  if (quantity <= 0) {
    removeItem(id)
    return
  }
  item.quantity = quantity
}

function removeItem(id: string) {
  items.value = items.value.filter((i) => i.id !== id)
}
```

`−` calls `updateQuantity(id, item.quantity - 1)`, `+` calls `updateQuantity(id, item.quantity + 1)`, ✕ calls `removeItem(id)`.

### Subtotal

`price` is stored as a formatted display string (e.g. `"12,00 €"`), not a number, per the v1 decision to avoid currency math in the store. The drawer needs a numeric subtotal. Two options:

1. Add a numeric `unitPrice: number` field to `CartItem` alongside the existing `price` string, populated from the same source (`CatalogProduct.price`, which is already numeric in `content/fr/order.ts`).
2. Parse `price` back to a number in the component.

Option 1 is cleaner and avoids locale-parsing string prices — add `unitPrice` to `CartItem` and to the `toCartItem` mapper on the order page. Add a `subtotal` computed to the store:

```ts
const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
)
```

Format for display with the existing currency convention used elsewhere in the app.

### Drawer open state

Add `isOpen` state to the cart store (simplest place, since both the header button and the drawer component need to read/write it without prop drilling):

```ts
const isOpen = ref(false)
function open() { isOpen.value = true }
function close() { isOpen.value = false }
```

Return `isOpen`, `open`, `close`, `updateQuantity`, `removeItem`, `subtotal` from the store alongside the existing `items`, `totalCount`, `addItem`.

---

## Component structure

```
components/
  CartDrawer.vue       — drawer shell: overlay, panel, header, scrollable item list, summary, CTAs
  cart/
    CartLineItem.vue    — one row: thumbnail, title, price, qty controls, delete
    CartEmptyState.vue  — empty state illustration + copy + "Voir nos cookies" link
```

Use Nuxt UI's `UDrawer` for the shell (overlay + panel + focus trap + swipe-to-dismiss already handled) — not `USlideover`. `UDrawer` is built on vaul-vue and takes a `direction` prop (`"top" | "bottom" | "left" | "right"`); set `direction="right"` to match the edge-slide behavior in `04-cart.md`, rather than its default bottom-sheet behavior.

For the mobile full-screen requirement, check `UDrawer`'s `ui`/props for sizing the panel to `100vw`/`100dvh` below the `sm` breakpoint — confirm the exact prop/slot names against the installed `@nuxt/ui` version's docs or `.nuxt/ui/drawer.ts` before hand-rolling breakpoint CSS on top of it.

`AppHeader.vue`'s cart button changes from a plain `<button>` to one that calls `cartStore.open()`.

---

## Mobile full-screen behavior

- Below the `sm` breakpoint (640px, the project's existing convention — confirm against `tailwind.config`/`@nuxt/ui` defaults): the drawer panel is `100vw` wide and `100dvh` tall, no rounded corners, no visible overlay (or overlay is moot since there's no page visible behind it).
- At `sm` and above: fixed **420px** width panel per `04-cart.md`, full viewport height, with the dimmed overlay over the remaining page area.

---

## Content strings

Add a `cart` section to `content/fr/header.ts` or a new `content/fr/cart.ts` (follow whichever pattern keeps content colocated with the feature — `cart.ts` is cleaner since this is a distinct component, not part of the header) for:

- `heading`: "Mon panier"
- `emptyTitle`: "Votre panier est vide."
- `emptySubtitle`: "Allez choisir quelque chose de bon."
- `emptyLink`: "Voir nos cookies"
- `subtotalLabel`: "Sous-total TTC"
- `shippingNote`: "Livraison calculée à l'étape suivante"
- `checkoutButton`: "Valider le panier"
- `continueShoppingLink`: "Continuer mes achats"
- `removeAriaLabel`: "Retirer l'article"
- `decreaseAriaLabel`: "Diminuer la quantité"
- `increaseAriaLabel`: "Augmenter la quantité"

---

## Checkout button behavior

"Valider le panier" closes the drawer per `04-cart.md`'s Trigger section. Where it navigates to (payment page, per [05-payment.md](05-payment.md)) is out of scope here — wire the click handler but confirm the actual route/flow before building `05-payment.md`. If that page doesn't exist yet, the button can be disabled or a no-op stub; don't block this spec on it.

---

## Testing

Cover with a Playwright e2e test (`tests/`, per project convention):
- Add an item on `/order`, open the drawer, confirm it appears with quantity 1
- Increment/decrement quantity, confirm the line total and header badge update
- Decrement to 0 removes the row
- Delete (✕) removes the row directly
- Empty cart shows the empty state, hides summary/CTAs
- On a mobile viewport, drawer covers the full screen

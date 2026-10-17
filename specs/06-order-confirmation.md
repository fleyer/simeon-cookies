# Spec: Order Confirmation

**Status**: Draft
**Route**: `/order/confirmation`

---

## Purpose

This page exists for one moment: telling someone their cookies are coming. It should feel like a sigh of relief — calm, warm, definitive. Not a data dump of order details, not an aggressive upsell. Just a clear, satisfying conclusion.

Secondary: where possible, it shows what was ordered so the customer can reference or screenshot it.

---

## Entry Point

The user arrives here via `/checkout/callback` (see `06a-checkout-callback.md`), which forwards Shopify's redirect as:

```
/order/confirmation?order=[order-number]&token=[token]
```

If `order` or `token` is missing, show the invalid state (see States below).

---

## Data Source (important constraint)

This app cannot fetch order details from Shopify after the fact:

- The Storefront API — the only Shopify API this app's client-side code is allowed to call — has no query for looking up an arbitrary guest order by id/token. Order lookup is an **Admin API** capability, and the Admin token cannot be shipped to the browser of a statically-generated site.
- This app also never collects email, shipping address, or payment method itself — checkout (address entry, payment) happens entirely on Shopify's hosted checkout page, outside this app. There is nothing here to fetch even if a query existed.

So order data shown on this page comes from a **client-side snapshot taken before the redirect to checkout**, not a live fetch:

1. When `cartStore.checkout()` (`stores/cart.ts`) obtains a `checkoutUrl` and is about to redirect, it writes the current cart to a new localStorage key, e.g. `last-order`, as:
   ```ts
   {
     items: CartItem[],
     subtotal: number,
     ordered: false,       // flipped to true by the confirmation page, see below
     expiresAt: number,    // Date.now() + TTL, see TTL below
   }
   ```
2. The cart itself (`cart` key) is **not** cleared at this point — the user may abandon Shopify's checkout and come back, and should still see their cart.
3. On this page, on mount: read `last-order` from localStorage.
   - **Missing, unparseable, or `expiresAt` has passed** → treat as the "Order details unavailable" state below; the hero still renders from the URL's `order` number alone. An expired entry is deleted from localStorage on read (no reason to keep dead data around).
   - **Found and unexpired** → render the Order Summary from it.
4. Once this page has validated `order`/`token` are present **and** successfully read an unexpired `last-order` snapshot, it marks that snapshot as consumed: set `ordered: true` and write it back to `last-order`. This is what "marking the data as ordered" means — it flips the snapshot from "a cart that was about to check out" to "a cart that became a confirmed order," and makes the action idempotent (revisiting/refreshing this page doesn't re-trigger the cart-clearing step below a second time; the branch below only runs when `ordered` is still `false`).
5. In that same step (only when `ordered` was `false`, i.e. first successful visit), the confirmation page also clears the `cart` key — the purchase is now considered final. This is the one place the cart is emptied after checkout.

### TTL

`last-order` is written with a 24-hour expiry (`expiresAt: Date.now() + 24 * 60 * 60 * 1000`). Rationale:
- The confirmation page is meant to be seen right after checkout, not as a durable record — Shopify's own confirmation email is that record.
- Bounding its lifetime keeps a stale snapshot from resurfacing weeks later (e.g. same browser, a since-reused or guessed `order`/`token` pair) and means abandoned/failed checkout attempts don't leave data sitting in localStorage indefinitely.
- 24 hours comfortably covers someone closing the tab and coming back the same day, without the value going stale.

Expiry is only checked on read (no background timer) — a normal `localStorage` read-and-compare against `expiresAt`, consistent with the synchronous, no-loading-state design below.

### What this means for the data shown

Because nothing is fetched from Shopify, the following are **not known** to this app and must not be presented as fact:
- Final total including shipping/tax (Shopify computes this on its hosted checkout page)
- Payment method
- Shipping address
- Confirmation email address

Only the following are known, from the pre-redirect snapshot:
- Line items (product, variant, quantity, unit price)
- Cart subtotal at the time of checkout

The page's copy and layout must reflect this honestly rather than implying a full receipt.

---

## Page Structure

Three sections, read top-to-bottom:

1. **Confirmation Hero** — the emotional payoff
2. **Order Summary** — what was ordered, from the local snapshot
3. **What Happens Next** — expectation setting

---

## Section 1: Confirmation Hero

### Intent
This is the emotional beat. The page opens with clarity and warmth before getting into the details.

### Layout
- Top of the page, below the header
- Centered content, generous vertical padding (120px top, 80px bottom)
- No image — typography is the visual

### Content
- **Kicker** (small label): "Commande confirmée" in Instrument Sans uppercase, Burnt Sienna color
- **Headline**: "Vos cookies arrivent." — Fraunces 700, 56px on desktop, 36px on mobile
- **Order number**: "Commande n°[number]" in Instrument Sans 500, 16px, Warm Sand color — from the `order` query param, always available once this section renders
- **Confirmation note**: "Un email de confirmation vous a été envoyé." in Lora 15px — no email address shown, since this app doesn't know it (Shopify sends the confirmation directly)

### Visual Design
- Background: Parchment (`#F5EFE0`) — same as the rest of the site, no special treatment
- The headline in Fraunces at this scale, on the warm parchment background, carries all the visual weight needed
- No confetti, no checkmark animation, no fireworks — the warmth comes from the typography and copy, not from decoration

---

## Section 2: Order Summary

### Intent
Show the customer what they ordered, from the cart snapshot taken just before checkout. This is presented as "here's what you ordered," not as an official receipt — Shopify's own confirmation email is the receipt of record.

### Layout
- Constrained width (max 600px), centered on the page
- Card-like surface in Cream (`#FAF7F2`) with a 1px Biscuit border
- Inside the card: line items, then a divider, then subtotal
- Only rendered when a `last-order` snapshot was found (see States)

### Content

**Line Items**

For each item in the snapshot:
- Thumbnail (48×48px, same product image)
- Product name in Fraunces 500, 16px (+ variant title if present, e.g. "Chocolat noir — Boîte de 12")
- Quantity and unit price: "×2 — 12,00 € / douzaine" in Instrument Sans 13px
- Line total right-aligned

**Subtotal** (below divider)

| Label | Value |
|-------|-------|
| **Sous-total** | **`XX,00 €`** (bold, larger) |

A small note below, Lora 13px, Warm Sand: "Livraison et taxes calculées lors du paiement. Le montant final figure dans votre email de confirmation Shopify." — sets the expectation that this isn't the final charged amount.

No payment method line, no delivery address block — this app doesn't have that data (see Data Source).

### No Loading State

Unlike a live API fetch, reading `localStorage` is synchronous. The hero and summary render together on mount; no skeletons are needed.

---

## Section 3: What Happens Next

### Intent
Remove anxiety. The customer doesn't know what to expect — this section tells them without over-explaining.

### Content
A simple numbered or stepped list, not a wall of text. Three items maximum:

1. **"Vous recevrez un email d'expédition"** — "Nous vous enverrons un lien de suivi dès que votre commande sera expédiée."
2. **"Vos cookies sont préparés frais"** — "Comptez [X jours ouvrés] pour la préparation et la livraison." (Exact timing pulled from store settings or hardcoded if fixed.)
3. **"Une question ?"** — "Écrivez-nous à [email] — nous sommes de vraies personnes." (Email configured in store settings.)

### Visual Design
- Background: Cream (`#FAF7F2`) section, full-width
- Steps as simple text, numbered with Burnt Sienna numerals in Fraunces
- No icons, no cards — just clean editorial text layout

---

## Footer

Standard footer (same as Homepage spec).

---

## States

| State | Condition | Behavior |
|-------|-----------|----------|
| Invalid | `order` or `token` missing/empty from the URL | Show a simple message: "Nous n'avons pas trouvé cette commande. Vérifiez votre email de confirmation ou contactez-nous." with a link to the homepage. Do not show a 404 page — this is a friendly dead-end, not an error. No Order Summary section. |
| Order details unavailable | `order`/`token` present, but no `last-order` snapshot in localStorage | Hero renders normally (order number is in the URL). Order Summary section is replaced with a short note: "Le détail de votre commande n'est plus disponible ici, mais elle a bien été enregistrée — consultez votre email de confirmation." "What Happens Next" still renders. |
| Success | `order`/`token` present and a matching `last-order` snapshot exists | Full page as described |

---

## What This Page Does Not Do

- **No upsell.** No "You might also like…" or "Order again." The moment is the moment.
- **No social sharing prompt.** Customers can share on their own initiative.
- **No account creation prompt.** Don't interrupt the good feeling.
- **No email capture.** They already gave their email at checkout.
- **No claim to authoritative order data.** Everything shown is either from the URL (order number) or a local snapshot of the cart before checkout (line items, subtotal) — never presented as confirmed by Shopify, since it isn't fetched from Shopify.

These may be considered in a future iteration if business needs arise.

---

## SEO / Meta

- `<title>`: "Commande confirmée — Simeon Cookies"
- `<html lang>`: `fr`
- This page should not be indexed (`noindex`) — it contains order-specific data and has no value in search results
- The page requires URL parameters to function; a direct visit with no parameters shows the invalid state

## Droit de rétractation (Legal)

French law (Code de la consommation, art. L221-18) gives consumers 14 days to withdraw from a distance purchase. This must be mentioned somewhere accessible from the confirmation page.

- A discreet line below the "Ce qui se passe ensuite" section: "Vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation. [En savoir plus →](/cgv)" in small Lora, Warm Sand color.
- This is not a prominent design element — it should feel like a footnote, not a warning. But it must be there.

---

## Out of Scope

- Order tracking page (would require shipping integration)
- Order history / account dashboard
- Reorder functionality
- Printable receipt
- Authoritative order data (final total, payment method, shipping address, confirmed email) — would require an Admin-API-backed server component, which this static site doesn't have. Revisit if the project ever adds a backend.

---

## Implementation Note: `stores/cart.ts` changes needed

This spec depends on the following additions to `stores/cart.ts`:

1. In `checkout()`, before `window.location.href = checkoutUrl`, write the snapshot: `localStorage.setItem('last-order', JSON.stringify({ items: items.value, subtotal: subtotal.value, ordered: false, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }))`.
2. This confirmation page (not the cart store) is responsible for clearing the `cart` key, once it has validated `order`/`token` and successfully read an unexpired `last-order` — see Data Source above.
3. **The `cart` key itself also needs a TTL** — today it persists indefinitely (`stores/cart.ts:59-67` writes it on every change with no expiry), so an abandoned cart from months ago would still repopulate someone's cart icon on their next visit. Store it the same shape as `last-order` (`{ items, expiresAt }`), with `expiresAt` refreshed on every write in the existing `watch(items, ...)` handler. On the `onNuxtReady` read, treat a missing/unparseable/expired entry the same as no stored cart (start empty) and remove the stale key. A cart TTL of a few days (e.g. 7) is reasonable — long enough to survive someone browsing and coming back later, short enough that it doesn't linger forever. This changes the existing `STORAGE_KEY` read/write shape, so both the read (hydration) and write (`watch`) sides of `stores/cart.ts` need updating together.

# Spec: Order Confirmation

**Status**: Draft  
**Route**: `/order/confirmation`

---

## Purpose

This page exists for one moment: telling someone their cookies are coming. It should feel like a sigh of relief — calm, warm, definitive. Not a data dump of order details, not an aggressive upsell. Just a clear, satisfying conclusion.

Secondary: it provides enough order information for the customer to reference or screenshot if needed.

---

## Entry Point

The user arrives here after a successful Shopify checkout. Shopify redirects to:

```
/order/confirmation?order=[order-number]&token=[token]
```

The `order` and `token` parameters are used to fetch order details from Shopify's Storefront API.

If the parameters are missing or invalid, show an error state (see States below).

---

## Page Structure

Three sections, read top-to-bottom:

1. **Confirmation Hero** — the emotional payoff
2. **Order Summary** — practical details
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
- **Order number**: "Commande n°[number]" in Instrument Sans 500, 16px, Warm Sand color
- **Email confirmation note**: "Un email de confirmation a été envoyé à [email]." in Lora 15px

### Visual Design
- Background: Parchment (`#F5EFE0`) — same as the rest of the site, no special treatment
- The headline in Fraunces at this scale, on the warm parchment background, carries all the visual weight needed
- No confetti, no checkmark animation, no fireworks — the warmth comes from the typography and copy, not from decoration

---

## Section 2: Order Summary

### Intent
Show the customer exactly what they ordered, at what price, and where it's going. Enough to feel confident; not so much that it feels like a receipt.

### Layout
- Constrained width (max 600px), centered on the page
- Card-like surface in Cream (`#FAF7F2`) with a 1px Biscuit border
- Inside the card: line items, then a divider, then totals

### Content

**Line Items**

For each item in the order:
- Thumbnail (48×48px, same product image)
- Product name in Fraunces 500, 16px
- Quantity and unit price: "×2 — 12,00 € / douzaine" in Instrument Sans 13px
- Line total right-aligned

**Order Totals** (below divider)

| Label | Value |
|-------|-------|
| Sous-total TTC | `XX,00 €` |
| Livraison | `XX,00 €` (or "Offerte") |
| **Total** | **`XX,00 €`** (bold, larger) |
| Moyen de paiement | "Payé par Visa ···· 4242" or "Payé par Apple Pay" |

**Adresse de livraison** (below totals, if applicable)

A compact address block in French format:
```
Marie Dupont
12 rue des Landes
40000 Mont-de-Marsan
France
```
Label: "Livraison à" in small Instrument Sans uppercase.

### Loading State

The order data is fetched client-side via the Storefront API after the page mounts. While loading:
- Skeleton placeholders in Biscuit fill the line items area
- The hero section renders immediately (order number is in the URL)

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

| State | Description |
|-------|-------------|
| Loading | Hero renders with order number; summary shows skeletons |
| Success | Full page as described |
| Invalid / missing order | Show a simple message: "Nous n'avons pas trouvé cette commande. Vérifiez votre email de confirmation ou contactez-nous." with a link to the homepage. Do not show a 404 page — this is a friendly dead-end, not an error. |
| API error | Same as invalid order — show the friendly message, not a technical error |

---

## What This Page Does Not Do

- **No upsell.** No "You might also like…" or "Order again." The moment is the moment.
- **No social sharing prompt.** Customers can share on their own initiative.
- **No account creation prompt.** Don't interrupt the good feeling.
- **No email capture.** They already gave their email at checkout.

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

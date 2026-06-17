# Spec: Payment

**Status**: Draft  
**Route**: Shopify-hosted checkout (external) / or `/checkout` if custom

---

## Approach

Payment is handled by **Shopify's hosted checkout**. When the user clicks "Proceed to checkout" in the cart drawer, they are redirected to Shopify's checkout flow at `[store].myshopify.com/checkouts/...`.

This is the right call because:
- PCI compliance is handled by Shopify entirely
- Shopify checkout handles edge cases (inventory conflicts, shipping calculation, payment failures) that are expensive to rebuild
- The redirect is instantaneous — users recognize and trust checkout flows

**Simeon Cookies does not build a custom payment form.** This spec defines what we control: the checkout entry point, the Shopify checkout configuration, and the return experience after payment.

---

## What Simeon Cookies Controls

### 1. Checkout Entry Points

All paths into checkout:
- Cart drawer → "Proceed to checkout" button
- (Future) Express checkout buttons (Shop Pay, Apple Pay, Google Pay) directly on product cards

The "Proceed to checkout" button is defined in the Cart spec. No duplicate buttons or accelerated checkout shortcuts in v1.

### 2. Shopify Checkout Configuration

These settings are configured in the Shopify admin and affect how the checkout looks and behaves:

| Setting | Decision |
|---------|----------|
| Checkout branding | Custom colors and font to match Simeon Cookies palette (see below) |
| Checkout language | French (`fr`) — configured in Shopify admin |
| Currency | EUR (€) |
| Order notes | Enabled — allows customers to add a gift message ("message cadeau") |
| Tipping | Disabled in v1 |
| Shipping methods | Configured per fulfillment zone in Shopify admin — France only in v1 |
| Payment methods | CB / Visa / Mastercard, Apple Pay, Google Pay, PayPal (see note below) |
| Account requirement | Guest checkout enabled; account optional |
| Tax display | Prices TTC (TVA incluse) throughout — Shopify configured for FR tax rules |
| Legal compliance | CGV link displayed in checkout footer (Shopify checkout extensibility) |

#### Checkout Branding (Shopify's Checkout Extensibility)

Apply Simeon Cookies's brand to Shopify's checkout via the theme editor:

- **Background**: Parchment (`#F5EFE0`)
- **Foreground / text**: Espresso (`#1A0F0A`)
- **Accent / button**: Burnt Sienna (`#C4622D`)
- **Error**: Terracotta (`#B04020`)
- **Font**: Shopify's system font stack is used as a fallback — request Fraunces via Google Fonts in the checkout branding configuration if the plan allows it
- **Logo**: Wordmark "Simeon Cookies" in Fraunces, rendered as an SVG uploaded to the checkout branding settings

The goal: when a user lands on Shopify checkout, the visual transition from Simeon Cookies feels like a step deeper into the same store, not a jarring redirect.

#### Payment Methods (France)

French customers expect the **CB (Carte Bancaire)** network, not just Visa/Mastercard. Shopify's payment gateway handles CB automatically when the store is configured for France. Priority order on the checkout payment screen:

1. Apple Pay / Google Pay (shown first if available — reduces friction significantly on mobile)
2. CB / Visa / Mastercard (card form)
3. PayPal (optional — adds trust for customers wary of entering card details on an unfamiliar site)

Shop Pay is not prioritized for the French market as it has low brand recognition in France compared to the US.

### 3. The Transition Moment

The moment between clicking "Proceed to checkout" and arriving on Shopify's checkout page:

- The "Proceed to checkout" button shows a loading state immediately on click (spinner replaces text, button disabled) to acknowledge the action
- The redirect happens as soon as the Shopify checkout URL is resolved (usually < 500ms)
- No custom loading page or interstitial — the browser's native loading state is sufficient

---

## Checkout Flow (Shopify Standard)

For reference, the Shopify checkout steps the user goes through (not built by Simeon Cookies). All steps are in French (configured in Shopify admin):

1. **Contact** — email ou téléphone (pour les mises à jour de commande)
2. **Livraison** — adresse de livraison (format français : nom, rue, code postal, ville), choix du mode de livraison
3. **Paiement** — coordonnées bancaires ou paiement accéléré (Apple Pay, Google Pay)
4. **Récapitulatif** — résumé de la commande avant validation — a link to the CGV is displayed here (French legal requirement)
5. **Confirmation** — redirects back to Simeon Cookies's order confirmation page

Note on French address format: Shopify will prompt for the French address structure automatically when the country is set to France (street, postal code, city — no state/region field needed).

---

## Return from Checkout

After a successful payment, Shopify redirects back to Simeon Cookies. The destination URL is the order confirmation page:

`/order/confirmation?order=[id]&token=[token]`

This page is specced separately (see `05-order.md`).

On payment failure, Shopify keeps the user in its own checkout with an inline error — Simeon Cookies is not involved.

---

## Error Paths

| Scenario | Who handles it |
|----------|---------------|
| Card declined | Shopify — inline error in the payment step |
| Inventory conflict (item sold out during checkout) | Shopify — inline error before payment |
| Network error during checkout | Shopify — retry prompt |
| Cart tampered / session expired | Shopify — user prompted to return to cart |
| Shopify checkout unavailable | Shopify's status page — Simeon Cookies cannot intercept |

---

## Out of Scope

- Custom payment form (not building this)
- Subscription / recurring payments
- Split payments
- Installments / BNPL (buy now, pay later) — Shopify may surface this automatically based on payment provider; acceptable in v1
- Refunds / order management (handled via Shopify admin)

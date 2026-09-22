# Spec: Checkout Callback

**Status**: Draft
**Route**: `/checkout/callback`

---

## Purpose

Shopify's hosted checkout redirects back to Simeon Cookies after an order completes. This route is the landing point for that redirect — a thin, invisible handoff, not a page anyone is meant to read. Its only job is to take whatever Shopify puts on the query string, validate it, and forward the user to `/order/confirmation` (see `06-order-confirmation.md`) with the params that page expects.

Splitting this out from the confirmation page itself means the confirmation page's contract (`order` + `token`) stays stable even if the exact shape of Shopify's redirect changes.

---

## Why a separate route

`05-payment.md` currently documents the return URL as going straight to `/order/confirmation?order=[id]&token=[token]`. In practice, the return-URL contract is controlled by Shopify (via admin configuration for headless storefronts — see **Open Questions** below), and there's no guarantee its param names match what the confirmation page wants. Putting a dedicated callback route in between means:

- The confirmation page only ever needs to know about `order` and `token` — its param contract from `06-order-confirmation.md` doesn't change.
- If Shopify's redirect shape changes (different param names, extra tracking params, etc.), only this one route needs updating.
- Malformed/incomplete redirects are caught in one place before the confirmation page has to reason about them.

---

## Entry Point

Shopify redirects here after checkout completes:

```
/checkout/callback?order_id=[id]&key=[key]
```

`order_id` and `key` are placeholder names pending confirmation — see **Open Questions**. Any additional query params Shopify appends are ignored.

---

## Behavior

This is a static-generated page (consistent with the rest of the site's `nuxt generate` output) with no meaningful visual content — it does its work client-side on mount, synchronously, then redirects:

1. Read the incoming query params via `useRoute().query`.
2. Validate that the order identifier and token are both present and non-empty.
3. **Valid** → redirect immediately to `/order/confirmation?order=[order_id]&token=[key]`, translating param names as needed.
4. **Missing or empty** → redirect to `/order/confirmation` with no params, letting the confirmation page's existing "Invalid / missing order" state (per `06-order-confirmation.md`) handle it. No separate error UI is built here.
5. Use `navigateTo()` for the redirect (`replace: true`, so this route never sits in browser history).

### Visual State

In the brief moment before the redirect fires, the page shows nothing but the standard page background (Parchment) — no spinner, no message. The redirect should be effectively instantaneous since it's a synchronous param check, not an API call. No loading state is designed for because none should be visible.

### What this page does NOT do

- No Storefront API calls. Existence/validity of the order is the confirmation page's job, not this one's.
- No UI, no copy, no branding moment — this route is never meant to be seen.
- Never linked to internally. No header, footer, or in-app navigation points here — it only exists as a redirect target for Shopify.

---

## SEO / Meta

- `noindex`, excluded from sitemap.
- No `<title>`/meta content needed beyond the site default — the route is never rendered long enough to matter.

---

## Error Paths

| Scenario | Behavior |
|---|---|
| `order_id` or `key` missing | Redirect to `/order/confirmation` (no params) → confirmation page shows its invalid-order state |
| Both present | Redirect to `/order/confirmation?order=[order_id]&token=[key]` |
| Malformed/unexpected query string shape | Treated as missing — redirect to `/order/confirmation` with no params |

---

## Open Questions (must resolve before implementation)

- **Exact param names Shopify sends.** The app currently uses the Storefront **Cart API** (`cartCreate` → `checkoutUrl`, see `stores/cart.ts`), not the legacy Checkout API. Confirm whether/how a custom post-checkout redirect is configured for this setup — likely via the Shopify admin's headless storefront / "Order status page redirect" setting — and get the real query param names from that configuration before wiring this route up.
- **Plan/feature availability.** Confirm the store (`simeon-9513.myshopify.com`) supports configuring a custom return URL for headless checkout on its current Shopify plan.
- Once confirmed, update `05-payment.md`'s "Return from Checkout" section to point at `/checkout/callback` instead of `/order/confirmation` directly, and replace the placeholder `order_id`/`key` names here with the real ones.

---

## Out of Scope

- Fetching or validating the order against the Storefront API (confirmation page's responsibility)
- Any retry or error-recovery UI (falls through to confirmation page's existing invalid state)
- Handling more than a single redirect hop

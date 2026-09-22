# Spec: Product Variants — Selection

**Status**: Implemented — `components/product/VariantSelector.vue`, wired into `pages/order/index.vue`  
**Type**: Data layer + grid-level UI  
**Related**: [10-shopify-catalog.md](10-shopify-catalog.md), [08-cookie-card.md](08-cookie-card.md), [03-order.md](03-order.md), [04-cart.md](04-cart.md)

---

## Intent

Shopify products may have multiple variants (e.g. box size, flavor pairing) defined via one or more options (e.g. "Taille"). Today `useProducts` silently picks the first available variant and there is no way for a shopper to choose. This spec adds variant selection to the `/order` catalog grid so the correct variant — and its price — is the one actually added to the cart.

---

## Data Layer

Extend `CATALOG_QUERY` in `composables/useProducts.ts` to also fetch, per product:

```graphql
options {
  name
  values
}
variants(first: 10) {
  nodes {
    id
    title
    availableForSale
    quantityAvailable
    price { amount currencyCode }
    selectedOptions { name value }
  }
}
```

Extend `CatalogProduct`:

```ts
interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: string        // formatted, e.g. "12,00 €"
  unitPrice: number
  selectedOptions: { name: string; value: string }[]
}

interface CatalogProduct {
  // ...existing fields unchanged...
  options: { name: string; values: string[] }[]
  variants: ProductVariant[]
}
```

`CatalogProduct.price` / `unitPrice` / `variantId` keep their current meaning (first available variant) — they remain the correct values to use whenever a product has exactly one variant, so today's add-to-cart behavior for single-variant products is unchanged.

---

## Selection UI Ownership

Variant selection is a purchase decision, not a display concern — it lives at the `/order` grid level (`pages/order/index.vue`, inside the `<ProductCard>` `#footer` slot), the same place the "Ajouter au panier" button already lives per [03-order.md](03-order.md). `<ProductCard>` itself stays untouched: it has no built-in CTA or interactive purchase controls (see [08-cookie-card.md](08-cookie-card.md)).

A product with exactly one variant (the common case today) renders no selector — identical to current behavior.

The card's displayed `price` reacts to the selection: it shows the product's default (min variant) price until a variant resolves, then switches to that variant's own `price`. This is why the price lives on the page (`:price="resolvedVariant(product)?.price ?? product.price"` passed alongside `<ProductCard>`'s other props), not inside `<ProductCard>` itself — consistent with the same ownership boundary as the CTA.

---

## Component: `VariantSelector`

Location: `components/product/VariantSelector.vue`

Props:

| Prop | Type | Notes |
|------|------|-------|
| `options` | `{ name: string; values: string[] }[]` | From `CatalogProduct.options` |
| `variants` | `ProductVariant[]` | From `CatalogProduct.variants` |

Renders one compact `USelect` per option (e.g. "Taille") inside a `UFieldGroup`. As the shopper picks a value for every option, the component resolves the matching variant from `selectedOptions` and emits it (`v-model:variant`, or `update:variant`) — `undefined` while the combination is incomplete or doesn't resolve to a known variant. Stock is not managed (see [03-order.md](03-order.md)), so nothing here is disabled based on `availableForSale` — a value is only disabled when it doesn't correspond to any real variant combination at all (i.e. it doesn't exist in the product's data, not that it's out of stock).

---

## Add to Cart Gating

- Button disabled until `VariantSelector` resolves a variant (always true immediately for single-variant products, since no selector renders and the default variant is used).
- Stock is not managed — a resolved variant's `availableForSale` does **not** disable the button (see [03-order.md](03-order.md)). Gating is about having a valid variant selected, not about its availability.
- The resolved variant's `id`, `price`, and `unitPrice` — not the product's default — are what gets passed to `cartStore.addItem`.

---

## Cart Line Identity

`CartItem` (`stores/cart.ts`) gains an optional `variantTitle: string | undefined`.

`addItem`'s dedupe lookup changes from `items.value.find(i => i.id === product.id)` to matching on `variantId` when the incoming item has one (falling back to `id` for items without a `variantId`, e.g. any future non-Shopify line). This means two different variants of the same product form two separate cart lines, each incrementing independently.

`components/cart/CartLineItem.vue` renders `item.variantTitle` under the product title when present, so the drawer distinguishes "Chocolat Noir & Sel — Boîte de 12" from "Chocolat Noir & Sel — Boîte de 6".

---

## Task List

- [x] Extend `CATALOG_QUERY`, `CatalogProduct`, and `mapProduct()` in `composables/useProducts.ts`
- [x] Build `components/product/VariantSelector.vue` (auto-imported as `<ProductVariantSelector>`)
- [x] Wire `VariantSelector` into `pages/order/index.vue`'s card footer, gate add-to-cart on resolution + availability
- [x] Add `variantTitle` to `CartItem`; update `addItem`/`updateQuantity`/`removeItem` to key off `variantId ?? id`
- [x] Show `variantTitle` in `components/cart/CartLineItem.vue`

---

## Out of Scope

- Dedicated product detail page (`/cookies/[handle]`) — variant selection ships on the `/order` grid only, per [10-shopify-catalog.md](10-shopify-catalog.md)'s existing scope boundary
- Variant-specific images (swapping the card photo per selected option)
- Per-combination availability beyond the resolved variant (Shopify doesn't expose this without querying every combination)

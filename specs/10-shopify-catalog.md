# Spec: Shopify Catalog Integration

**Status**: Draft  
**Type**: Data layer — composable + mapping  
**Related**: [03-order.md](03-order.md), [04-cart.md](04-cart.md), [07-store-config.md](07-store-config.md), [08-cookie-card.md](08-cookie-card.md)

---

## Intent

Replace the current static/local product data with live product data fetched from the Shopify Storefront API. The catalog grid on `/order` should load products dynamically, map Shopify's response shape to `<ProductCard>` props, and handle all expected async states (loading, error, empty).

`useShopify.ts` already provides the raw Storefront API client. This spec defines what sits on top of it: the GraphQL query, the data mapping, and the `useProducts` composable that the order page calls.

---

## What Comes from Shopify vs. What Doesn't

| Field | Source | Notes |
|-------|--------|-------|
| `title` | Shopify `product.title` | Display name |
| `subtitle` | Shopify metafield `custom.subtitle` | One-line flavor note; falls back to first sentence of description |
| `description` | Shopify `product.description` | Plain text (Shopify strips HTML); truncation handled by `<ProductCard>` |
| `category` | Shopify `product.productType` | Uppercased by the composable before being passed as prop |
| `price` | Shopify `product.priceRange.minVariantPrice` | Formatted as `"12,00 €"` by the composable |
| `image` | Shopify `product.featuredImage.url` | Original URL; `<NuxtImg>` handles resizing and format conversion |
| `imageAlt` | Shopify `product.featuredImage.altText` | Falls back to `title` if blank |
| `status` | Derived — see Status Mapping below | Not a direct Shopify field |
| `rating` | **Out of scope for v1** | No rating source available yet; `rating` prop omitted |
| `link` | Derived: `/cookies/${product.handle}` | Product detail page — not yet built, but the link is pre-wired |

---

## Status Mapping

Shopify has no first-class concept of `new`, `featured`, or `popular`. Use **product tags** as the source of truth. Status is resolved in this priority order:

1. If `product.availableForSale === false` **or** all variants have `quantityAvailable === 0` → `'soldout'`
2. Else if the product has tag `featured` → `'featured'`
3. Else if the product has tag `new` → `'new'`
4. Else if the product has tag `popular` → `'popular'`
5. Else → `undefined` (no badge)

Tags are lowercase strings. The mapping is case-insensitive.

---

## GraphQL Query

```graphql
query CatalogProducts($first: Int!) {
  products(first: $first) {
    nodes {
      id
      handle
      title
      description
      productType
      tags
      availableForSale
      featuredImage {
        url
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          availableForSale
          quantityAvailable
        }
      }
      subtitle: metafield(namespace: "custom", key: "subtitle") {
        value
      }
    }
  }
}
```

Call with `{ first: 50 }` — the full catalog is expected to be under 50 SKUs for v1. No cursor-based pagination needed.

---

## Price Formatting

Shopify returns `amount` as a decimal string (e.g. `"12.00"`) and `currencyCode` as `"EUR"`. Format it to the French locale using `Intl.NumberFormat`:

```ts
function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount))
}
// "12.00", "EUR" → "12,00 €"
```

---

## Composable: `useProducts`

Location: `composables/useProducts.ts`

```ts
// Returns the reactive catalog state for the order page
const { products, pending, error, refresh } = useProducts()
```

Each item in `products` maps directly to `<ProductCard>` props:

```ts
interface CatalogProduct {
  id: string
  handle: string
  // ProductCard props
  title: string
  subtitle: string
  description: string
  category: string         // uppercased productType
  image: string
  imageAlt: string
  price: string            // pre-formatted, e.g. "12,00 €"
  status: ProductStatus | undefined
  link: string             // "/cookies/${handle}"
}
```

Use Nuxt's `useAsyncData` internally so the fetch runs once on the server during SSG and is not repeated on the client. Cache key: `'shopify-catalog'`.

---

## Subtitle Fallback

If the `custom.subtitle` metafield is empty or absent, extract the first sentence of `description`:

```ts
function extractSubtitle(description: string): string {
  return description.split(/[.!?]/)[0]?.trim() ?? ''
}
```

---

## Composable: `useShopify` — No Changes Needed

The existing `composables/useShopify.ts` is not modified. `useProducts` imports and calls it directly:

```ts
const client = useShopify()
const { data } = await client.request(CATALOG_QUERY, { variables: { first: 50 } })
```

---

## Integration with the Order Page

The order page (`pages/order/index.vue`) replaces any local product data with:

```vue
<script setup lang="ts">
const { products, pending, error, refresh } = useProducts()
</script>

<template>
  <!-- Loading state -->
  <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard v-for="i in 6" :key="i" />  <!-- skeleton mode: no props -->
  </div>

  <!-- Error state -->
  <div v-else-if="error">
    <!-- gentle error message + retry button calling refresh() -->
  </div>

  <!-- Empty catalog -->
  <div v-else-if="!products.length">
    <!-- "no products available" message -->
  </div>

  <!-- Catalog grid -->
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      v-bind="product"
    />
  </div>
</template>
```

---

## Development Endpoint

During development, `useShopify.ts` points to `https://mock.shop/api`. The mock store returns a realistic catalog shape — no Shopify account or credentials needed. The `custom.subtitle` metafield will be absent from mock data; the subtitle fallback handles this transparently.

---

## Task List

### 1. `useProducts` composable
- [ ] Create `composables/useProducts.ts`
- [ ] Write the `CATALOG_QUERY` GraphQL string
- [ ] Implement `mapProduct()` — Shopify node → `CatalogProduct` (status mapping, price formatting, subtitle fallback, uppercased category, link derivation)
- [ ] Wrap fetch in `useAsyncData('shopify-catalog', ...)` for SSG-friendly caching
- [ ] Export `{ products, pending, error, refresh }`

### 2. Order page wiring
- [ ] Replace any local/static product data in `pages/order/index.vue` with `useProducts()`
- [ ] Wire loading state → `<ProductCard>` skeletons (no props)
- [ ] Wire error state → message + "Réessayer" button calling `refresh()`
- [ ] Wire empty state → "Aucun cookie disponible pour le moment" (or copy TBD)
- [ ] Wire catalog grid → `v-bind="product"` per item

### 3. `<ProductCard>` skeleton mode
- [ ] Confirm the component renders correctly when called with no props (all optional)
- [ ] If not, add a `loading` boolean prop that activates skeleton mode explicitly (see [08-cookie-card.md](08-cookie-card.md) — skeleton state is specced but the trigger mechanism is not settled)

### 4. Type safety
- [ ] Export `CatalogProduct` interface from `composables/useProducts.ts`
- [ ] Ensure `ProductStatus` import from `content/types` covers the values used in status mapping (`'new' | 'featured' | 'soldout' | 'popular' | undefined`)

---

## Out of Scope

- Product detail page (`/cookies/[handle]`) — separate spec to come; `link` prop is pre-wired but the destination page does not exist yet
- Cursor-based pagination — catalog is expected to stay under 50 SKUs for v1
- Rating / review data — no source available yet; `rating` prop is omitted
- Cart add-to-cart wiring — see [04-cart.md](04-cart.md); the "Ajouter au panier" button is the order page's responsibility per [03-order.md](03-order.md), not this composable's
- Filtering by tag — reserved in [03-order.md](03-order.md); the tag data is fetched here and available when that feature is built

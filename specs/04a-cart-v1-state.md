# Spec: Cart — v1 State Layer

**Status**: Draft  
**Depends on**: [04-cart.md](04-cart.md) (full cart UX, tackled in v2)  
**Scope**: Pinia store · localStorage persistence · "Add to cart" on order page · header badge count

---

## Goal

Wire up the data foundation for the cart without building any cart UI yet.  
At the end of v1:
- Clicking "Ajouter au panier" on a product card adds that product to a persisted cart state.
- The cart icon in the header shows a live badge with the **total number of items** (sum of quantities).
- The state survives a page reload via localStorage.

---

## Dependencies to add

| Package | Version pin | Purpose |
|---------|-------------|---------|
| `pinia` | latest stable | State management |
| `@pinia/nuxt` | latest stable | Nuxt auto-import integration |

Register in `nuxt.config.ts`:
```ts
modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt']
```

No `@pinia-plugin-persistedstate/nuxt` — localStorage persistence is done by hand in the store (see below).

---

## Cart item model

```ts
interface CartItem {
  id: string          // Shopify product ID (e.g. "gid://shopify/Product/123")
  handle: string      // slug, used to build the product link
  title: string
  image: string
  imageAlt: string
  price: string       // formatted string ("12,00 €") — display only
  quantity: number    // ≥ 1
}
```

`id` is the unique key. Adding a product already in the cart increments its `quantity`.

---

## Store: `stores/cart.ts`

```ts
const STORAGE_KEY = 'cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  if (import.meta.client) {
    // Nuxt's Pinia module re-hydrates store state from the SSR payload on
    // mount, which would otherwise clobber a synchronous localStorage read
    // done here. Wait until that hydration pass has settled.
    onNuxtReady(() => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          items.value = JSON.parse(stored)
        } catch {
          // ignore malformed data
        }
      }

      watch(items, (value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      }, { deep: true })
    })
  }

  // Total number of individual items (sum of quantities)
  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return { items, totalCount, addItem }
})
```

Key decisions:
- **Setup store** (function syntax) — consistent with Vue 3 composition API style already used in this project.
- **Manual localStorage persistence** — no `@pinia-plugin-persistedstate/nuxt`. A client-only `watch` on `items` writes to `localStorage` on every change; the read happens once, deferred to `onNuxtReady` so it isn't clobbered by Pinia's SSR-state hydration.
- `price` is stored as a pre-formatted string. The store does **not** do currency math — that is deferred to v2 (subtotal display in the drawer).

---

## Order page changes (`pages/order/index.vue`)

The "Ajouter au panier" button in the `#footer` slot of each `ProductCard` calls `cartStore.addItem(...)`.

The full `CatalogProduct` object is already available inside the `v-for` loop, so the add action needs no extra fetch.

```vue
<template #footer>
  <div class="relative z-10 w-full flex justify-end items-center p-2">
    <UButton
      variant="solid"
      @click="cartStore.addItem(toCartItem(product))"
    >
      {{ order.product.orderButton }}
    </UButton>
  </div>
</template>
```

A small `toCartItem` mapper strips `description`, `category`, `status`, `link` — only what `CartItem` needs is stored.

Stock is unlimited as of today, so there's no sold-out guard on the button — every listed product can always be added. (`CatalogProduct.status` can still be `'soldout'` for display purposes, e.g. an "épuisé" badge on the card itself, but it no longer disables adding to cart.)

The card's `to`/`link` prop renders a stretched link (`absolute inset-0`) over the whole card so the card itself is clickable. The footer wrapper needs `relative z-10` or the add-to-cart button is unreachable — the link overlay renders after it in DOM order and intercepts the click.

---

## Header changes (`components/AppHeader.vue`)

Replace the local `cartCount` ref with the store's computed:

```ts
// before
const cartCount = ref(0)

// after
const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalCount)
```

The badge markup is already in place and unchanged.

---

## Content string

The order button label lives in `content/fr/order.ts`. If it currently reads something generic, update it to "Ajouter au panier" to match the spec.

---

## Out of scope (v1)

- Cart drawer / slide-in panel (→ v2, see [04-cart.md](04-cart.md))
- Quantity controls (increment / decrement) — store already supports it via `quantity`, but no UI yet
- Remove item action
- Subtotal calculation
- Stock re-validation after item is added
- Opening the drawer automatically on add

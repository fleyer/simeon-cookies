# Spec: Shopify Image Loading Skeleton

**Status**: Implemented — `components/ui/ImageWithSkeleton.vue`  
**Type**: Shared UI component  
**Related**: [08-cookie-card.md](08-cookie-card.md), [10-shopify-catalog.md](10-shopify-catalog.md), [04b-cart-v2-ui.md](04b-cart-v2-ui.md)

---

## Intent

Shopify product images are served through the `shopify` NuxtImg provider and can take a noticeable moment to arrive. Today `<ProductCard>` only shows a skeleton while the *product data* is loading (`loading` prop); once data resolves, the image area is blank until the file lands, then pops in. This spec adds a skeleton that covers the image's own load, with a fade-in once it is ready.

---

## Scope

Shopify-sourced images only:

- `components/product/Card.vue` — card photo
- `components/cart/CartLineItem.vue` — line item thumbnail

Local-asset images (`AppHeader`, `HeroLogo`, `triptych/*`) are out of scope.

---

## Component: `ImageWithSkeleton`

Location: `components/ui/ImageWithSkeleton.vue` (auto-imported as `<UiImageWithSkeleton>`)

### Props

| Prop | Type | Notes |
|------|------|-------|
| `src` | `string \| undefined` | Image URL |
| `alt` | `string` | |
| `width` | `number` | Forwarded to `NuxtImg` |
| `provider` | `string \| undefined` | Forwarded to `NuxtImg` |
| `format` | `string \| undefined` | Forwarded to `NuxtImg` |

`class` and `style` apply to the `<img>` (`inheritAttrs: false`, attrs bound to `NuxtImg`) so existing styling, including the soldout `filter` on the card, keeps working. A `wrapperClass` prop styles the outer element, e.g. `rounded` on the cart thumbnail so the skeleton matches the image's corners.

### Structure

```
<div class="relative" :class="wrapperClass">
  <USkeleton v-if="!loaded" class="absolute inset-0 size-full" />
  <NuxtImg ref="img" ... class="transition-opacity duration-300" :class="loaded ? 'opacity-100' : 'opacity-0'" />
</div>
```

The wrapper takes the size of its container (card: the existing `aspect-square` box; cart: `size-[72px] shrink-0`), so there is no layout shift when the image appears.

### Behavior

| Event | Effect |
|-------|--------|
| `@load` on the `<img>` | `loaded = true` — skeleton removed, image fades in |
| `@error` on the `<img>` | `loaded = true` — skeleton must not pulse forever on a broken URL |
| Mounted / `onNuxtReady` with `img.complete && img.naturalWidth > 0` | `loaded = true` — covers images that finished loading before hydration, when `@load` never fires on the client (static generation) |
| `src` changes | `loaded = false` — skeleton returns for the new image |

---

## Integration

### `components/product/Card.vue`

Replace the `NuxtImg` in the header with `<UiImageWithSkeleton>`, passing the same `src`, `alt`, `provider`, `format`, `width`, class and soldout `:style`. The existing `loading` branch (`USkeleton` + text skeleton) is unchanged and takes precedence.

### `components/cart/CartLineItem.vue`

Replace the `NuxtImg` with `<UiImageWithSkeleton>`, with `size-[72px] shrink-0` on the wrapper, `rounded` on the wrapper and `object-cover` on the image.

---

## Acceptance Criteria

- With network throttled (Slow 3G), the card and cart thumbnail show a skeleton, then fade the image in.
- On a warm-cache reload the image is visible; it never stays at `opacity-0`.
- A broken image URL stops the skeleton instead of animating indefinitely.
- No layout shift between skeleton and image.
- The existing Playwright tests (`bun run test`), `bun run typecheck` and `bun run lint` pass.

---

## Task List

- [x] Build `components/ui/ImageWithSkeleton.vue` (load, error, already-complete and `src`-change handling)
- [x] Use it in `components/product/Card.vue`
- [x] Use it in `components/cart/CartLineItem.vue`
- [ ] Manually verify with throttled network and warm cache
- [x] Add the component to the built-components list in `CLAUDE.md`

---

## Out of Scope

- Local-asset images (header, hero, triptych)
- Blur-up / LQIP placeholders generated from Shopify
- Lazy-loading strategy changes (`loading="lazy"`, `fetchpriority`)

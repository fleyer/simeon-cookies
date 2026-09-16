# Simeon Cookies

## Stack

- **Runtime & Package Manager**: Bun
- **Framework**: Nuxt 3 (Vue 3) with TypeScript
- **UI Library**: Nuxt UI v4 (`@nuxt/ui`) — use its components (UButton, UCard, etc.) and Tailwind CSS theming
- **State**: Pinia (`@pinia/nuxt`), setup-store syntax — see `stores/`
- **Rendering**: Static site generation (`nuxt generate`)
- **Shopify**: `@shopify/storefront-api-client` (framework-agnostic Storefront API client)
  - Use `mock.shop` as the Shopify endpoint during development
- **Deployment**: Cloudflare Pages via GitHub Actions (`.github/workflows/deploy.yml` builds with `nuxt generate` then deploys with `cloudflare/pages-action`)

## Rules

- **Dependencies**: Always use pinned versions — no `^` or `~` in `package.json`
- **Git hooks**: Pre-commit runs typecheck (`vue-tsc`) and linting (ESLint)
- **Package manager**: Always use `bun` — never `npm`, `yarn`, or `pnpm`

## Commands

```bash
bun run dev        # Start dev server
bun run generate   # Build static site
bun run typecheck  # Run vue-tsc
bun run lint       # Run ESLint
bun run test       # Run Playwright e2e tests (tests/)
```

## Project Structure

```
/
├── pages/           # Nuxt file-based routing
├── components/      # Vue components
├── composables/     # Shared composables (including Shopify)
├── assets/          # Static assets (CSS, fonts, images)
├── public/          # Files served as-is
└── .github/
    └── workflows/
        └── deploy.yml  # Cloudflare Pages deployment
```

## Implementation Status

### Components
| Component | File | Status | Notes |
|-----------|------|--------|-------|
| Header | `components/AppHeader.vue` | ✅ Built | Fixed, sticky; transparent on homepage hero, solid Cream elsewhere; mobile drawer; cart badge wired to `useCartStore().totalCount` |
| Hero triptych | `components/HeroTriptych.vue` | ✅ Built | Real images from `public/cookies/hero/`; image source (Shopify vs content module) TBD |
| Product card | `components/product/Card.vue` | ✅ Built | Used on `/order`; whole card is a stretched link to the product page — interactive content in slots (e.g. the footer button) needs `relative z-10` to stay clickable above the link overlay |

### Pages
| Page | File | Status |
|------|------|--------|
| Homepage | `pages/index.vue` | ✅ Built — renders HeroTriptych only |
| Order | `pages/order/index.vue` | ✅ Built — catalog grid with "Ajouter au panier" wired to `useCartStore().addItem`; sold-out products disable the button |

### Cart (v1 — state only, see [specs/04a-cart-v1-state.md](specs/04a-cart-v1-state.md))
| Piece | File | Status | Notes |
|-------|------|--------|-------|
| Store | `stores/cart.ts` | ✅ Built | Pinia setup store; persists `items` to `localStorage` manually (no persistedstate plugin) via a client-only `watch`, deferred to `onNuxtReady` to avoid Nuxt/Pinia's SSR-payload hydration clobbering the localStorage read |
| No cart drawer/UI yet | — | Out of scope | Deferred to v2 (`specs/04-cart.md`) |

### Fonts
Loaded via Google Fonts in `nuxt.config.ts` `app.head`. Tailwind classes available: `font-fraunces`, `font-lora`, `font-instrument-sans`.

---

## Shopify

The Storefront API composable lives in `composables/useShopify.ts`.
During development, the endpoint is `https://mock.shop/api` (no credentials needed).
When moving to a real store, set `NUXT_PUBLIC_SHOPIFY_STORE_URL` and `NUXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` in `.env`.

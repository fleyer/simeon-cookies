# Simeon Cookies

## Stack

- **Runtime & Package Manager**: Bun
- **Framework**: Nuxt 3 (Vue 3) with TypeScript
- **Rendering**: Static site generation (`nuxt generate`)
- **Shopify**: `@shopify/storefront-api-client` (framework-agnostic Storefront API client)
  - Use `mock.shop` as the Shopify endpoint during development
- **Deployment**: GitHub Pages via GitHub Actions

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
        └── deploy.yml  # GitHub Pages deployment
```

## Shopify

The Storefront API composable lives in `composables/useShopify.ts`.
During development, the endpoint is `https://mock.shop/api` (no credentials needed).
When moving to a real store, set `NUXT_PUBLIC_SHOPIFY_STORE_URL` and `NUXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` in `.env`.

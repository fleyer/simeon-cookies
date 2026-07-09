# Spec: Content Extraction & i18n-Ready Structure

**Status**: Draft
**Type**: Architecture — cross-cutting
**Related**: [01-header.md](01-header.md), [02a-hero.md](02a-hero.md), [02c-feature-callout.md](02c-feature-callout.md), [07-cookie-card.md](07-cookie-card.md), [06-store-config.md](06-store-config.md)

---

## Intent

Every user-facing string currently lives inline in a `.vue` template or script block (`"Nos revendeurs"`, `"Panier"`, `"Découvrir nos cookies"`, badge labels, aria-labels…). That's fine for a single-language site, but it means copy changes require hunting through components, and there's no seam to add a second language later without a rewrite.

This spec extracts that copy into dedicated, typed content files — one static locale (`fr`) for now, structured so a second locale is a matter of adding files, not restructuring components.

**v1 delivers French only.** No language switcher, no runtime locale detection, no `@nuxtjs/i18n` dependency. The goal is *shape*, not *behavior* — get the seams right now while there's little copy to migrate, so it doesn't become a bigger rewrite later.

---

## Scope

**In scope** — static UI copy that is authored by us and identical for every visitor:
- Navigation labels, buttons, CTAs
- Section headings and static section body copy
- Badge / status labels (`Nouveau`, `Coup de cœur`, `Épuisé`)
- Aria-labels and other accessibility strings
- Templated strings with interpolation (e.g. "Note : 4,5 sur 5")

**Out of scope**:
- **Shopify product data** (title, subtitle, description, price for actual SKUs). This is runtime data owned by Shopify, not static copy — see [06-store-config.md](06-store-config.md) "What Goes Here vs. What Doesn't." Shopify has its own translation tooling (Markets) if the store ever localizes product content; this spec doesn't touch that. Note: the `product` / `product2` mock objects currently hardcoded in `components/section/Featured.vue` fall in this bucket too — they're placeholder Shopify data, not UI chrome, and will disappear once the Storefront API is wired up.
- **Store facts** (email, address, social links, legal text) — those already have a home in [06-store-config.md](06-store-config.md) and stay there. Don't duplicate them here.
- **A language switcher or locale routing.** No `/en/...` routes, no `useSwitchLocalePath`, nothing runtime. That's future work, sketched in [Adding a Second Locale](#adding-a-second-locale-future) purely so today's structure doesn't block it.
- **`@nuxtjs/i18n` as a dependency.** Not needed to serve one language. Revisit only when a second locale is actually being built.

---

## Directory Structure

```
content/
  types.ts               # shared TS interfaces, one per domain
  fr/
    common.ts             # cross-cutting strings (shared aria-labels, generic CTAs)
    header.ts             # AppHeader.vue
    triptych.ts            # components/triptych/Main.vue
    product-card.ts        # components/product/Card.vue
    featured.ts             # components/section/Featured.vue
```

- One file per **component domain**, mirroring the existing `components/` grouping — not one giant `fr.ts`. Keeps diffs small and makes it obvious which file to touch when editing a component's copy.
- `common.ts` is for strings genuinely shared across ≥2 domains (e.g. a generic "Voir plus" if it starts appearing in multiple places). Don't pre-populate it — start empty/minimal and move a string into it only once it's actually duplicated.
- Filenames are kebab-case, matching the spec files' own convention; content **keys** inside are camelCase, matching TS/Vue convention.

**Naming note**: this directory is called `content/`, not `i18n/`, because the existing hero spec already refers to this idea informally as a "content module" (see [02a-hero.md](02a-hero.md), Images section). If `@nuxt/content` (the Markdown CMS module) is ever adopted, that module also expects a `content/` directory — rename this one (e.g. to `copy/`) at that point to avoid the collision. Not a concern today since it isn't installed.

---

## Type Safety Pattern

Each domain gets an interface in `content/types.ts`, and its `fr` file is checked against that interface with `satisfies` (not a type annotation) so literal types are preserved — important for things like badge status keys, which need to stay a literal union, not widen to `string`.

```ts
// content/types.ts
export interface ProductCardContent {
  badges: Record<'new' | 'featured' | 'soldout', string>
  ratingLabel: (rating: string) => string
}
```

```ts
// content/fr/product-card.ts
import type { ProductCardContent } from '../types'

export const productCard = {
  badges: {
    new: 'Nouveau',
    featured: 'Coup de cœur',
    soldout: 'Épuisé',
  },
  ratingLabel: (rating) => `Note : ${rating} sur 5`,
} satisfies ProductCardContent
```

When a second locale is added, its file is checked against the same interface — TypeScript fails the build if a key is missing or a function signature drifts. That's the entire enforcement mechanism; no runtime validation needed.

---

## Interpolated Strings

Plain values for static strings. For copy that needs interpolation (a name, a count, a formatted number), use a function instead of a template placeholder syntax (no `{count}` mini-templating engine — unnecessary for one locale, and the function form is just as easy to translate later since the interpolation logic can differ per-locale, e.g. pluralization).

```ts
// content/fr/header.ts
export const header = {
  cart: {
    ariaLabel: 'Panier',
    countLabel: (count: number) => `${count} article${count > 1 ? 's' : ''} dans le panier`,
  },
} satisfies HeaderContent
```

---

## Component Integration Pattern

Content files hold **only translatable strings** — not routes, not CSS classes, not behavior. Components import the content object and merge it with the non-translatable metadata that stays in the component.

Before (`components/AppHeader.vue`):
```ts
const navItems = [
  { label: 'Nos cookies !', to: '/', class: 'text-peach-600 rounded-full border-solid border-1' },
  { label: 'Nos revendeurs', to: '/' },
  { label: 'À propos', to: '/' },
]
```

After:
```ts
// content/fr/header.ts
export const header = {
  nav: {
    cookies: 'Nos cookies !',
    resellers: 'Nos revendeurs',
    about: 'À propos',
  },
  cart: { ariaLabel: 'Panier' },
  menu: { openAriaLabel: 'Ouvrir le menu', closeAriaLabel: 'Fermer le menu' },
} satisfies HeaderContent
```

```ts
// components/AppHeader.vue
import { header } from '~/content/fr/header'

const navItems = [
  { label: header.nav.cookies, to: '/', class: 'text-peach-600 rounded-full border-solid border-1' },
  { label: header.nav.resellers, to: '/' },
  { label: header.nav.about, to: '/' },
]
```

Plain explicit imports — no auto-import, no `useContent()` composable. There's exactly one locale, so a resolver composable would be indirection with nothing to resolve. Add it when it earns its keep (see below).

---

## Content Audit

Every hardcoded string found in the current codebase, and where it moves. This is the extraction checklist.

### `components/AppHeader.vue` → `content/fr/header.ts`

| Current | Key |
|---|---|
| `'Nos cookies !'` | `nav.cookies` |
| `'Nos revendeurs'` | `nav.resellers` |
| `'À propos'` | `nav.about` |
| `aria-label="Panier"` | `cart.ariaLabel` |
| `aria-label="Ouvrir le menu"` | `menu.openAriaLabel` |

Note: the mobile drawer's close state currently has no distinct aria-label (icon just swaps); add `menu.closeAriaLabel` when that's wired up.

### `components/triptych/Main.vue` → `content/fr/triptych.ts`

| Current | Key |
|---|---|
| `'Les petits cookies sont arrivés !'` | `desktop.title` |
| `'Découvrir nos cookies'` (desktop hover span) | `desktop.cta` |
| `'Le goût des moments partagés !'` (mobile) | `mobile.title` |
| `'Découvrir nos cookies'` (mobile `UButton` label) | `mobile.cta` |

Note: desktop and mobile currently show *different* headlines (`Les petits cookies sont arrivés !` vs. `Le goût des moments partagés !`) — that split is preserved as two keys rather than collapsed into one, since it's presumably intentional (matches [02a-hero.md](02a-hero.md) which also documents a mobile-specific headline). Flag to confirm during extraction.

### `components/product/Card.vue` → `content/fr/product-card.ts`

| Current | Key |
|---|---|
| `'Nouveau'` | `badges.new` |
| `'Coup de cœur'` | `badges.featured` |
| `'Épuisé'` | `badges.soldout` |
| `` `Note : ${formattedRating} sur 5` `` | `ratingLabel(rating)` |

Note: `imageAlt` defaulting to `title`, and the price string itself, are **not** extracted — both are product-specific data passed in via props, not component-owned UI copy.

### `components/section/Featured.vue` → `content/fr/featured.ts`

| Current | Key |
|---|---|
| `title="C'est Nouveau !"` (section) | `title` |
| `title="Ingredients de saison :"` | `seasonalIngredients.title` |
| `"fraise" / "mangue" / "banane"` | `seasonalIngredients.items` (string array) |
| `"Commander ! Promotion ?"` | `promoCard.placeholder` |

Not extracted: `product` / `product2` mock objects (see [Scope](#scope) — Shopify data, will be deleted once real products are wired up, not worth typing today).

### `pages/index.vue`

`"work in progress"` — left as-is. It's a placeholder for an unbuilt page section, same category as the "à compléter" markers in [06-store-config.md](06-store-config.md). Extract once that section has real content.

---

## Adding a Second Locale (future)

Not part of this spec's implementation, but the reason the structure above looks the way it does:

1. Add `content/en/*.ts` mirroring the `fr/` files, each satisfying the same interface from `content/types.ts` — TypeScript enforces parity.
2. Introduce a `useLocale()` composable (or `@nuxtjs/i18n` if routing/SEO needs grow beyond a simple switch) that exposes the active locale.
3. Replace direct `content/fr/header` imports with a resolver, e.g. `content/index.ts` exporting `useContent()` that returns the right locale's objects.
4. Update component imports from `import { header } from '~/content/fr/header'` to `const { header } = useContent()`.

Step 4 is the only component-level change — the content files and their shape don't move. That's the payoff of doing this now.

---

## Out of Scope

- Language switcher UI, locale-prefixed routing, `hreflang` tags
- `@nuxtjs/i18n` module and its config
- Shopify Markets / product translation
- Pluralization/formatting libraries (ICU MessageFormat, etc.) — the interpolation-via-function pattern above covers current needs; revisit if French pluralization rules get genuinely complex
- Runtime locale detection (`Accept-Language`, browser locale, etc.)

---

## Rollout Order

Extraction is mechanical and low-risk; suggested order (smallest blast radius first):

1. `product-card.ts` — most self-contained, already prop-driven
2. `triptych.ts` — confirm the desktop/mobile headline split with the user before extracting (see audit note)
3. `header.ts` — touches the mobile drawer too, test both breakpoints after
4. `featured.ts` — section is still WIP/mock-heavy; extract only the non-mock strings per the audit table

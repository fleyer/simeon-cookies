# Spec: CookieCard Component

**Status**: In Progress — core structure implemented, see [Known Gaps / TODO](#known-gaps--todo)  
**Component file**: `components/product/Card.vue` (auto-imported as `<ProductCard>`)  
**Related**: [02b-product-grid.md](02b-product-grid.md), [00-brand.md](00-brand.md)

---

## Intent

A self-contained card to display a single product SKU — its photo, identity, editorial description, availability status, and customer rating. Used in the product grid and anywhere else a product needs to be surfaced in a compact format.

This is the atomic unit of the catalog. It must look confident and editorial, not like a generic e-commerce product tile.

---

## Props

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `image` | `string` | ✅ | — | Image URL |
| `imageAlt` | `string` | — | `title` value | Alt text for accessibility |
| `title` | `string` | ✅ | — | Product name. e.g. "Chocolat Noir & Sel" |
| `subtitle` | `string` | ✅ | — | One-line flavor note. e.g. "Cœur fondant, note amère" |
| `description` | `string` | ✅ | — | 2–3 sentence tasting description |
| `status` | `'new' \| 'featured' \| 'soldout'` | — | `undefined` | Controls badge and card state |
| `rating` | `number` | — | `undefined` | 0–5 (decimals allowed). Omit to hide the rating row |
| `price` | `string` | — | `undefined` | Pre-formatted price string e.g. `"12,00 €"`. Omit to hide the price line |
| `category` | `string` | — | `undefined` | Uppercase category label e.g. `"CHOCOLAT"`. Omit to hide |
| `link` | `string` | ✅ | — | Route for the product detail page, e.g. `/cookies/chocolat-sel`. Bound as `:to` on the root component |
| `as` | `Component` | — | `UCard` | Root component to render instead of `UCard` — e.g. `UPageCard` when the card is placed inside a `UPageGrid` |

---

## Visual Anatomy

Built on `UCard` by default. The root component can be swapped via the `as` prop (e.g. `UPageCard`, for use inside a `UPageGrid`) — in every case the root component itself is the click target, bound with `:to="link"`, rather than a separate wrapping `NuxtLink`. Four zones stacked vertically.

```
┌─────────────────────────────────┐
│                                 │
│          [IMAGE]                │  ← full-bleed, square, no radius
│                                 │
│                  ┌────────────┐ │
│                  │   BADGE    │ │  ← status badge, top-right overlay
│                  └────────────┘ │
├─────────────────────────────────┤
│  CHOCOLAT                       │  ← category, caption style (optional)
│  Title                          │  ← Fraunces 500 ~22px, Ink
│  Subtitle                       │  ← Lora italic 15px, Ink/60
│                                 │
│  Description copy               │  ← Instrument Sans 14px, Ink/70
│                                 │
│  ★ ★ ★ ★ ☆   4,5 / 5          │  ← star row, hidden if no rating prop
│                                 │
│  12,00 € / douzaine             │  ← price, hidden if no price prop
└─────────────────────────────────┘
```

---

## Zones in Detail

### Click target

The `link` prop is passed as `:to` directly on the root component (`UCard` or the component passed via `as`), which renders as a `NuxtLink` internally. There is no separate wrapping link element.

Hover state on the root component is intended to trigger both the image scale and any lift effect (see [Known Gaps / TODO](#known-gaps--todo) — the scale transition is not currently wired up to a hover trigger).

### Image (UCard `#header` slot)

- Square aspect ratio (`aspect-square`)
- `NuxtImg` with `object-cover object-center`, `format="webp"`
- No border radius (`rounded-none` override on the card header)
- Subtle hover: image scales to `scale-[1.03]`, transition 400ms ease-out
- When `status === 'soldout'`: add `brightness-75 grayscale-[30%]` filter on the image

### Status Badge (overlaid on image)

Positioned `absolute top-3 right-3` inside the image container. Implemented with `UBadge`.

| Status | Label | Color | Variant |
|--------|-------|-------|---------|
| `new` | `Nouveau` | `primary` (peach) | `subtle` |
| `featured` | `Coup de cœur` | `secondary` (ink) | `solid` |
| `soldout` | `Épuisé` | `neutral` | `subtle` |

Badge typography: Instrument Sans, 11px, uppercase, tracking wide (`--caption` scale from brand).  
No badge rendered when `status` is `undefined`.

### Body (UCard default slot)

**Category tag** *(optional)*
- Shown only when `category` prop is provided
- Font: `font-instrument-sans`, 11px uppercase, letter-spacing wide
- Color: `text-ink-400`
- No margin top (first element in the body)

**Title**
- Font: `font-fraunces`, weight 500, ~22px (`text-xl` or `text-2xl`)
- Color: Ink (`text-ink-800`)
- No truncation — allow wrapping to two lines max
- `mt-0.5` from category tag (or none when category is absent)

**Subtitle**
- Font: `font-lora`, italic, 15px (`text-sm`)
- Color: Ink at 60% opacity (`text-ink-600`)
- Single line; truncate with ellipsis if overflow

**Description**
- Font: `font-instrument-sans`, 14px (`text-sm`)
- Color: Ink at 70% opacity (`text-ink-700`)
- Max 3 lines; `-webkit-line-clamp: 3` + `overflow-hidden`
- Spacing: `mt-2` from subtitle

**Rating row** *(optional)*
- Hidden entirely when `rating` prop is `undefined`
- `mt-3` gap from description
- Five `UIcon` stars in a flex row, `gap-0.5`:
  - Filled: `i-heroicons-star-solid`, color `text-peach-500`
  - Empty: `i-heroicons-star`, color `text-ink-200`
  - Half-star: `i-heroicons-star-solid` with `text-peach-300` (lighter color approximation — no SVG clipping)
  - Round `rating` to nearest 0.5 to determine filled/half/empty for each position
- Numeric label: `(4,5 / 5)` in Instrument Sans 11px, `text-ink-500`, `ml-2`

**Price** *(optional)*
- Hidden when `price` prop is `undefined`
- `mt-3` gap from rating row (or description if no rating)
- Font: `font-instrument-sans`, weight 500, 14px
- Color: `text-ink-800`
- Format: value passed by parent, e.g. `"12,00 € / douzaine"` — the card renders it verbatim

---

## States

### Default
Standard card, no badge. All text fully opaque. Image at normal brightness.

### New (`status="new"`)
Peach `Nouveau` badge on image. No other visual change — freshness is celebrated, not alarming.

### Featured (`status="featured"`)
Dark ink `Coup de cœur` badge. Card may optionally add a 1px `ring-ink-300` border to make it stand out in a grid.

### Soldout (`status="soldout"`)
- `Épuisé` badge, neutral color
- Image: `brightness-75 grayscale-[30%]`
- Title and subtitle: `opacity-60`
- Rating row: hidden (irrelevant when unavailable)
- No CTA interaction (CTA is outside this component's scope — see product grid spec)

### Loading / Skeleton
Render skeleton placeholders using the `USkeleton` component at the same dimensions:
- Image: full square block
- Title: 60% width bar
- Subtitle: 40% width bar
- Description: three lines at 90% / 80% / 50%

---

## Nuxt UI Components Used

| Component | Role |
|-----------|------|
| `UCard` | Outer wrapper; `ui.body` padding override to `p-4` |
| `UBadge` | Status indicator on image |
| `UIcon` | Star icons in rating row (`i-heroicons-star-solid`, `i-heroicons-star`) |
| `USkeleton` | Loading state placeholders |

---

## UCard Customization

The default `UCard` radius and shadow should be overridden to match the brand's editorial feel:

```vue
<component
  :is="as ?? UCard"
  :ui="{
    root: 'overflow-hidden rounded-none bg-transparent',
    header: 'p-0 px-0 sm:px-0',
    body: 'p-4 pt-3',
  }"
  :to="link"
>
```

No outer shadow on the card itself — depth comes from the image, not a card box-shadow. The hover lift effect (if used in a grid) should be on the root component, not a nested element.

---

## Accessibility

- `<img>` `alt` defaults to `title` if `imageAlt` is not provided
- Stars use `aria-label` on the container: `aria-label="Note : 4,5 sur 5"`
- Badge text is already visible — no additional `aria-label` needed
- `soldout` state: the card is not `aria-disabled` (it's still informational); the CTA button in the parent grid handles the disabled state
- The root component (link) should have `aria-label` set to the product title if the card contains no other focusable element — not currently set explicitly, see [Known Gaps / TODO](#known-gaps--todo)

---

## Usage Example

```vue
<ProductCard
  image="/cookies/chocolat-sel.jpg"
  title="Chocolat Noir & Sel"
  subtitle="Cœur fondant, note amère"
  description="Un cookie intense et généreux. Le chocolat 72 % répond à une pointe de fleur de sel qui réveille chaque bouchée."
  category="CHOCOLAT"
  status="featured"
  :rating="4.5"
  price="12,00 € / douzaine"
  link="/cookies/chocolat-sel"
/>
```

Rendered as a `UPageCard` inside a `UPageGrid` (e.g. homepage "featured" section):

```vue
<ProductCard
  v-bind="product"
  :as="UPageCard"
  class="bg-white shadow-md col-span-2 md:col-span-1"
/>
```

---

## Known Gaps / TODO

Tracked against the current implementation in `components/product/Card.vue`.

- [ ] **Hover scale is not wired up.** The image has `group-hover/card:scale-[1.03]`, but no ancestor in the template carries a `group/card` class, so the scale transition never triggers. Needs a `group/card` class on the root `<component>`.
- [ ] **No lift effect on hover.** Spec calls for a hover lift on the card/root; not implemented at all yet (box-shadow or translate on hover).
- [ ] **No explicit `aria-label`** on the root link when the card has no other focusable element (e.g. no CTA). Currently relies on `UCard`/`UPageCard`/`NuxtLink` defaults.
- [x] ~~**Featured `ring-ink-300` border not implemented.**~~ Implemented: `status="featured"` now adds `ring-1 ring-ink-300` on the root component, overriding `UCard`'s default `ring-default` color.
- [ ] **`00-brand.md` caption scale not referenced directly** — badge and category typography are hardcoded (`text-[11px] uppercase tracking-widest`) rather than pulled from a shared caption utility/class, so future brand-scale changes require updating them in multiple places.

# Spec: Homepage — Hero Multi-CTA (Left/Right Panels)

**Status**: Ready for implementation — copy finalized, hover fix is in scope; imagery to follow later, implement against current placeholders
**Parent**: [02a-hero.md](02a-hero.md)
**Related**: [02-homepage.md](02-homepage.md), [03-order.md](03-order.md), [09-content-i18n.md](09-content-i18n.md)

---

## Intent

The hero triptych currently gives its side panels no job — they're static decorative images. This spec turns them into the site's second and third calls to action, alongside the center panel's existing "discover products" role, so that on page load a visitor sees all three of the store's primary intents: **discover the products, order, and discover events** — without breaking the triptych's identity as one cohesive brand moment (see [02a-hero.md](02a-hero.md) for the base gallery-wall concept).

Brand identity (`HeroLogo`) stays anchored in the center panel only. It is not repeated per-panel.

---

## Panel → Intent Mapping

| Panel | Component | Intent | Target route | Visual weight |
|---|---|---|---|---|
| Left | `components/triptych/Left.vue` | Order | `/order` *(new route — created ahead of this spec's implementation, not part of it)* | Secondary |
| Center | `components/triptych/Main.vue` | Discover products (brand lives here) | `/#featured` *(existing, unchanged)* | Primary |
| Right | `components/triptych/Right.vue` | Discover events | `/#event` *(anchor on the homepage, not a standalone route)* | Secondary |

Priority order left → right: **Order → Discover → Events**. This follows the existing image assignment (strawberry / cookie-signature / honey-chocolate).

---

## Layout

### Desktop (≥ md)

All three panels already render side by side (`HeroTriptych.vue`). Bring Left/Right up to the same interaction pattern `Main.vue` already has:

- Wrap each panel in a `<NuxtLink>` to its target route (currently they're bare `<NuxtImg>`).
- Add the same `bg-gradient-to-t from-ink-900/50` → `/70` hover treatment used in `Main.vue`.
- Reveal on hover:
  - Short title (Fraunces, matches Main's title styling but smaller — these are secondary panels)
  - Uppercase micro-label, Instrument Sans, 11px, `tracking-[0.3em]` (matching Main's CTA label style): "C'est ici" / "Rejoingnez nous"
- **Implementation note (in scope, must ship with this spec)**: `Main.vue`'s hover states key off `group-hover/triptych`, a group shared across all three panels. If Left/Right adopt the same shared group, hovering any one panel would reveal all three captions at once. Each panel needs its own scoped group (e.g. `group/panel` on the individual `NuxtLink`) so captions reveal independently per panel.

### Mobile (< md)

Left/Right are currently `hidden md:flex` — on mobile, Order and Events have **no presence at all** today. That's the gap this spec closes.

- Side panels stay hidden on mobile (no change — there's no room for three full panels).
- Add a secondary CTA row below the hero image, still inside the `HeroTriptych` section (above `SectionFeatured`):
  - `UButton` variant="outline" or "ghost" (secondary weight) — "C'est ici" → `/order`
  - `UButton` same treatment — "Rejoingnez nous" → `/#event`
  - Laid out side by side, visually subordinate to the existing full-bleed mobile CTA ("Découvrir nos cookies"), which remains the dominant action.

---

## Content

Per [09-content-i18n.md](09-content-i18n.md), new UI strings land in a content module rather than inline in the component — a new `content/fr/hero.ts` (doesn't exist yet; today only `content/fr/header.ts` exists as a copy convention).

Final strings (French):

| Key | Copy | Used |
|---|---|---|
| Left title | "Les commandes sont disponibles" | Desktop hover caption |
| Left CTA label | "C'est ici" | Desktop hover micro-label + mobile button |
| Right title | "Envie de participer ?" | Desktop hover caption |
| Right CTA label | "Rejoingnez nous" | Desktop hover micro-label + mobile button |

Note: "Rejoingnez nous" as given — likely meant "Rejoignez-nous"; flagging in case it's a typo rather than intentional, otherwise using as-is.

---

## Task List

Ship one panel at a time — **Events first, then Order** — so each CTA lands as a complete, independently testable slice (route stub, content, desktop hover, mobile button) rather than one big cross-cutting change.

### 1. Events CTA (Right panel)

- [ ] Add `content/fr/hero.ts` with Right title ("Envie de participer ?") + CTA label ("Rejoingnez nous")
- [ ] Wrap `components/triptych/Right.vue` image in `NuxtLink` to `/#event` (target section doesn't exist yet — ships as a dead anchor until it's built later)
- [ ] Fix the hover group scoping bug as part of this panel's work: give it its own scoped `group/panel` instead of the shared `group-hover/triptych` (see Layout note above)
- [ ] Add hover gradient (`from-ink-900/50` → `/70`) + reveal caption (title + micro-label) using the scoped group
- [ ] Add mobile "Rejoingnez nous" `UButton` in the secondary CTA row, linking to `/#event`

### 2. Order CTA (Left panel)

- [ ] Confirm `/order` route exists (see [03-order.md](03-order.md) — created ahead of this spec, not built here)
- [ ] Add Left title ("Les commandes sont disponibles") + CTA label ("C'est ici") to `content/fr/hero.ts`
- [ ] Wrap `components/triptych/Left.vue` image in `NuxtLink` to `/order`
- [ ] Add hover gradient + reveal caption, scoped to its own `group/panel`
- [ ] Add mobile "C'est ici" `UButton` in the secondary CTA row, linking to `/order`

### 3. Cross-panel polish

- [ ] Verify hover states on all three panels reveal independently (regression check on the shared-group fix)
- [ ] Swap in dedicated Order/Events imagery once provided (see Notes below) — placeholders until then

---

## Notes

- **Images.** Left/Right currently use `cookies-strawberry.jpg` / `cookies-honey-chocolate.jpg` as placeholders. Dedicated Order/Events imagery will be provided later — implement against the current placeholders and swap them in when the final assets land (no component/layout change expected, just the source file).

---

## Out of Scope

- Header/nav links to Order or Events (header currently lists Cookies / Resellers / About — see [01-header.md](01-header.md)). Not addressed here.
- Building the `/order` route itself (prerequisite, done ahead of this spec) and building the homepage section that `#event` anchors to (later work, done after this spec) — this spec only wires up the hero's entry points into them.

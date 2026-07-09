# Spec: Homepage — Hero Multi-CTA (Left/Right Panels)

**Status**: Draft — pending routes, content, and image decisions (see Open Questions)
**Parent**: [02a-hero.md](02a-hero.md)
**Related**: [02-homepage.md](02-homepage.md), [08-content-i18n.md](08-content-i18n.md)

---

## Intent

The hero triptych currently gives its side panels no job — they're static decorative images. This spec turns them into the site's second and third calls to action, alongside the center panel's existing "discover products" role, so that on page load a visitor sees all three of the store's primary intents: **discover the products, order, and discover events** — without breaking the triptych's identity as one cohesive brand moment (see [02a-hero.md](02a-hero.md) for the base gallery-wall concept).

Brand identity (`HeroLogo`) stays anchored in the center panel only. It is not repeated per-panel.

---

## Panel → Intent Mapping

| Panel | Component | Intent | Target route | Visual weight |
|---|---|---|---|---|
| Left | `components/triptych/Left.vue` | Order | `/order` *(new route)* | Secondary |
| Center | `components/triptych/Main.vue` | Discover products (brand lives here) | `/#featured` *(existing, unchanged)* | Primary |
| Right | `components/triptych/Right.vue` | Discover events | `/events` *(new route)* | Secondary |

Priority order left → right: **Order → Discover → Events**. This follows the existing image assignment (strawberry / cookie-signature / honey-chocolate) — confirm this ordering is intentional, or swap Order/Events if events should lead.

---

## Layout

### Desktop (≥ md)

All three panels already render side by side (`HeroTriptych.vue`). Bring Left/Right up to the same interaction pattern `Main.vue` already has:

- Wrap each panel in a `<NuxtLink>` to its target route (currently they're bare `<NuxtImg>`).
- Add the same `bg-gradient-to-t from-ink-900/50` → `/70` hover treatment used in `Main.vue`.
- Reveal on hover:
  - Short title (Fraunces, matches Main's title styling but smaller — these are secondary panels)
  - Uppercase micro-label, Instrument Sans, 11px, `tracking-[0.3em]` (matching Main's CTA label style): "Commander" / "Découvrir nos événements"
- **Implementation note**: `Main.vue`'s hover states key off `group-hover/triptych`, a group shared across all three panels. If Left/Right adopt the same shared group, hovering any one panel would reveal all three captions at once. Each panel needs its own scoped group (e.g. `group/panel` on the individual `NuxtLink`) so captions reveal independently per panel.

### Mobile (< md)

Left/Right are currently `hidden md:flex` — on mobile, Order and Events have **no presence at all** today. That's the gap this spec closes.

- Side panels stay hidden on mobile (no change — there's no room for three full panels).
- Add a secondary CTA row below the hero image, still inside the `HeroTriptych` section (above `SectionFeatured`):
  - `UButton` variant="outline" or "ghost" (secondary weight) — "Commander" → `/order`
  - `UButton` same treatment — "Événements" → `/events`
  - Laid out side by side, visually subordinate to the existing full-bleed mobile CTA ("Découvrir nos cookies"), which remains the dominant action.

---

## Content

No copy for these two panels exists yet. Per [08-content-i18n.md](08-content-i18n.md), new UI strings should land in a content module rather than inline in the component — likely a `content/fr/hero.ts` (doesn't exist yet; today only `content/fr/header.ts` exists as a copy convention).

Needed strings (French, placeholders — final copy TBD):

| Key | Placeholder | Used |
|---|---|---|
| Left title | *TBD* | Desktop hover caption |
| Left CTA label | "Commander" | Desktop hover micro-label + mobile button |
| Right title | *TBD* | Desktop hover caption |
| Right CTA label | "Découvrir nos événements" | Desktop hover micro-label + mobile button |

---

## Open Questions

1. **Routes don't exist yet.** `/order` and `/events` need pages (can start as stubs) before links can go live.
2. **Copy** is entirely unwritten — titles for Left/Right hover captions, mobile headline (if any), button labels are all placeholders above.
3. **Images.** Left/Right currently use `cookies-strawberry.jpg` / `cookies-honey-chocolate.jpg` — product photography, not "order" or "events" imagery. Decide: keep as on-brand decorative images, or source dedicated imagery per intent (e.g. an events/tasting photo for the Right panel).
4. **Hover group scoping bug** (see Implementation note above) must be fixed as part of this work, not left as a follow-up — otherwise all three panels light up together on any hover.
5. **Ordering**: confirm Order (left) / Events (right) placement, or swap.

---

## Out of Scope

- Header/nav links to Order or Events (header currently lists Cookies / Resellers / About — see [01-header.md](01-header.md)). Not addressed here.
- Building out the `/order` or `/events` pages themselves — only the hero's entry points into them.

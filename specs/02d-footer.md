# Spec: Homepage — Footer

**Status**: Implemented — `components/AppFooter.vue`  
**Parent**: [02-homepage.md](02-homepage.md)  
**Scope**: Global — appears on every page (same as [Header](01-header.md))

---

## Intent

Practical closure. Not a marketing surface.

---

## Component

`components/AppFooter.vue`, rendered from `layouts/default.vue` below the page slot, so it appears on every route without each page having to include it.

---

## Content

- Left: Wordmark "Simeon Cookies" in Fraunces + address line: "Mont-de-Marsan, Occitanie"
- Center: Navigation links (same as header: Nos cookies, Nos revendeurs, À propos) + legal links: Mentions légales · CGV · Confidentialité
- Right: "© 2026 Simeon Cookies" in small Instrument Sans
- Second row (optional): "Fabriqué avec soin à Mont-de-Marsan, Landes (40)."

### Links

- **Nos cookies** links to `/order` (same destination as the header)
- **Nos revendeurs** and **À propos** point at pages that don't exist yet — rendered the same way the header already stubs them (visible, not yet wired to a real route)
- **Legal links** (Mentions légales · CGV · Confidentialité) have no pages at all yet — rendered as plain static text, not links, until those pages exist. Do not point them at `#` or an unrelated route.

---

## Visual Design

- Background: Espresso (`#1A0F0A`) — no design-token CSS variable exists for this yet (`assets/css/main.css` only defines the `peach-*` / `ink-*` scales), so it's applied as a Tailwind arbitrary value (`bg-[#1A0F0A]`), matching the convention already used for the header's mobile nav drawer (`components/AppHeader.vue`)
- Text: Warm Sand and Cream
- 1px top border in a slightly lighter Espresso tone
- Compact — 80–100px total height on desktop
- Stacks to a single centered column on mobile

---

## Task List

- [x] Add `FooterContent` type (`content/types.ts`) and French copy (`content/fr/footer.ts`)
- [x] Build `components/AppFooter.vue` per Content/Visual Design above
- [x] Wire `<AppFooter />` into `layouts/default.vue`

---

## Out of Scope

- Legal pages themselves (Mentions légales, CGV, Confidentialité) — this spec only covers the footer surface, not their content
- Newsletter signup, social links — not part of the brand's current scope

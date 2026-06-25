# Spec: Homepage — Hero

**Status**: Implemented (minimal)  
**Parent**: [02-homepage.md](02-homepage.md)

---

## Intent

The hero is a gallery wall. Three photographs of cookies hang side by side like exhibited works — the shop name sits above them as the exhibition title. The visitor arrives and immediately reads: *this is a place that takes cookies seriously.*

---

## Layout

### Desktop
- Full viewport height (`100svh`)
- Shop name ("Simeon") in large Fraunces display type, left-aligned, above the panels
- Three panels side by side below: **25% / 50% / 25%** split
- 3px gap between panels (cream background bleeds through, like a matting edge)
- Panels have uniform padding left/right and bottom (12px/48px)

### Mobile
- Shop name above, same treatment, scaled down
- Only the **center panel** is shown — full width, fills remaining height
- The two side panels are hidden (`hidden md:block`)

---

## Panels

### Side panels (desktop only)
- Static at rest — no text, no overlay
- Very slight scale on hover (`scale-[1.02]`, 700ms ease-out)
- Left panel: `object-left` crop — right panel: `object-right` crop

### Center panel — featured
- Largest panel (50% on desktop, 100% on mobile)
- `object-center` crop

**Desktop interaction (hover):**
- Dark gradient rises from the bottom (`from-ink-900/55`)
- "DÉCOUVRIR NOS COOKIES" appears in cream — Instrument Sans, 11px, `tracking-[0.3em]`, uppercase
- Text slides up 8px and fades in with a 100ms delay
- The CTA has no button frame — it is a typographic element only

**Mobile (always visible):**
- Permanent gradient overlay: `from-ink-900/75` → transparent
- Short catchy headline in Fraunces (`text-peach-50`): *"Des cookies qui méritent d'attendre."*
- `UButton` (primary/solid) below: "Découvrir nos cookies"

---

## Content

- **Shop name**: "Simeon" — not "Simeon Cookies", not a tagline
- **Mobile headline**: *"Des cookies qui méritent d'attendre."* — declarative, no question mark
- **CTA label**: "Découvrir nos cookies" (desktop: text only; mobile: button)
- **CTA target**: scrolls to or navigates to the product grid (not yet wired — pending product section)

---

## Images

Currently stored in `public/cookies/hero/`. Source of truth for these images is TBD — may move to Shopify product media or a content module in a later iteration.

| Panel | File | Notes |
|-------|------|-------|
| Center (featured) | `cookies-landing.png` | Main hero shot |
| Left | `cookies-strawberry.jpg` | Side panel |
| Right | `cookie-honey-chocolate.jpg` | Side panel |

---

## Typography

- Shop name: Fraunces 700, `clamp(3rem, 8vw, 6.5rem)`, `leading-[0.9]`
- Mobile headline: Fraunces 600, `clamp(1.5rem, 6vw, 2rem)`, `leading-tight`
- Desktop CTA text: Instrument Sans 500, 11px, uppercase, `tracking-[0.3em]`

---

## Animation

- Image hover: `scale-[1.02]`, 700ms ease-out
- Desktop CTA reveal: gradient transitions over 500ms; text slides up 8px + fades in over 300ms with 100ms delay

---

## Open questions

- **Image source**: Will product images eventually come from Shopify (Storefront API) or a local content module? Hero images may remain static even if product grid images are API-driven.
- **CTA target**: needs to scroll to / link to the product grid once that section exists.
- **Header overlap**: header spec calls for transparent header on the hero — not yet implemented.

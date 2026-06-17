# Spec: Header

**Status**: Draft  
**Scope**: Global — appears on every page

---

## Purpose

The header is the persistent navigation layer and the store's brand anchor. It orients the user (where they are), enables movement (where they can go), and surfaces the cart state (what they've selected). It should feel lightweight but authoritative — present without dominating the content below.

---

## Layout

The header is a single horizontal bar, pinned to the top of the viewport on scroll (sticky). It spans the full viewport width with constrained inner content.

```
[ Simeon Cookies ]    [ Nos cookies  Nos revendeurs  À propos ]    [ 🛒 3 ]
  (wordmark, left)                  (nav, center)                  (cart, right)
```

Three zones:
1. **Left**: Wordmark / logo
2. **Center**: Primary navigation links
3. **Right**: Cart icon with item count badge

On smaller viewports (< 768px), center nav collapses into a hamburger that opens a full-height drawer (see Mobile section below).

---

## Content

### Wordmark
- Text: "Simeon Cookies"
- Font: Fraunces, weight 700, ~20px
- Renders as styled text, not an image — this ensures it's always crisp and editable
- Links to the homepage

### Navigation Links
- **Nos cookies** — links to the product listing (homepage or `/cookies`)
- **Nos revendeurs** — links to `/revendeurs`, a page listing the other physical points of sale beyond Mont-de-Marsan
- **À propos** — links to `/a-propos` (future page; rendered but grayed out until live)
- Active link: underline in Burnt Sienna, not bold weight
- Hover: underline slides in from left (CSS transition)

### Cart Icon
- Icon: a minimal outlined bag or basket icon (SVG, ~22px)
- Badge: Espresso-colored circle with white number, appears when cart count > 0
- Badge disappears (not shown as "0") when cart is empty
- Clicking opens the cart drawer (see Cart spec)

---

## Visual Design

- **Background**: Cream (`#FAF7F2`) with a 1px bottom border in Biscuit (`#E2D5BF`)
- **Height**: 64px
- No shadow by default. A subtle shadow appears only after the user scrolls past 80px (scroll-dependent depth cue)
- The header does **not** use a blur/glass effect — it stays opaque to keep the parchment aesthetic clean
- On the homepage hero, the header overlays the image with a transparent background that transitions to Cream as the user scrolls

### Hero Transparency State (Homepage only)
- At scroll position 0: header background transparent, wordmark and nav in Cream
- After scrolling 80px: header transitions to Cream background + Biscuit border (300ms transition)
- This only applies on the homepage — all other pages start with the solid Cream header

---

## Interactions

| Trigger | Behavior |
|---------|----------|
| Click wordmark | Navigate to homepage |
| Click nav link | Navigate to target page |
| Click cart icon | Open cart drawer |
| Hover nav link | Underline animates in from left |
| Scroll past 80px (homepage) | Header gains solid background |
| Item added to cart | Badge count increments; brief scale pulse on the icon (150ms) |

---

## Mobile (< 768px)

- Wordmark stays left
- Center nav hidden
- Cart icon stays right
- A hamburger icon (three lines → X on open) appears between wordmark and cart
- Clicking hamburger opens a **full-height left drawer** (slides in from left, 280px wide, dark overlay behind)
  - Drawer background: Espresso (`#1A0F0A`)
  - Nav links in Cream, large type (Fraunces 500, 28px), stacked vertically
  - Drawer closes on: overlay click, X button click, nav link click
- The cart icon remains accessible in the header even when the drawer is open

---

## States

| State | Description |
|-------|-------------|
| Default | Solid Cream header, nav links in Espresso, empty cart (no badge) |
| Homepage hero | Transparent header with Cream text |
| Scrolled | Cream background + subtle shadow |
| Cart has items | Badge visible with count |
| Nav drawer open (mobile) | Overlay + left drawer visible |

---

## Out of Scope (for this spec)

- Search functionality
- Account / login state
- Promotional banner above the header
- Mega-menus or dropdown navigation
- Language switcher (French only in v1)

These may be addressed in sub-specs if needed later.

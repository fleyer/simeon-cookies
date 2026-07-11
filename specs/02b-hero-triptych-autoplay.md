# Spec: Homepage — Hero Triptych Autoplay Reveal

**Status**: Implemented
**Parent**: [02a-hero-ctas.md](02a-hero-ctas.md)
**Related**: [02a-hero.md](02a-hero.md), [02-homepage.md](02-homepage.md)

---

## Intent

With hover-only reveal ([02a-hero-ctas.md](02a-hero-ctas.md)), a visitor who never moves their mouse over a side panel never sees its title or CTA — on load, two of the triptych's three calls to action are effectively invisible. This spec replaces the passive hover-only reveal with an **autoplaying, story-style rotation**: on page load, the triptych automatically cycles through its panels, showing exactly one panel's caption + CTA at a time, with a thin progress bar at the bottom of the active panel indicating how long until it advances to the next one. Hovering a panel takes over the rotation so a visitor can linger on the one they care about.

---

## Scope

**Desktop (≥ md)**: left/right panels remain hidden on mobile (`hidden md:flex`); autoplay progress bar and caption reveal apply to all three panels on desktop only.

**Mobile (< md)**: implemented as a text carousel in `components/triptych/cta/Mobile.vue` — a `UCarousel` (wrapped in `<ClientOnly>` to avoid hydration mismatch) cycling through the three CTAs (Commander / Prochain évènement / Faire une demande) with title + button per slide, looping automatically every 4 s via a manual `setInterval`. Dots navigation included.

---

## Behavior

### Rotation

- All three panels participate: **Left → Main → Right**, looping continuously (matches the existing priority order: Order → Discover → Events).
- Starts automatically on mount, beginning with Left.
- Exactly **one panel is "active" at a time** — only the active panel shows its dark gradient + caption (title, CTA micro-label, and for Main, the arrow icon). Inactive panels sit at rest (base, unrevealed state).
- Each panel stays active for a fixed duration, then the rotation advances to the next panel in sequence. Suggested duration: **4s per panel** (tune once it's on screen).

### Progress bar

- A thin bar pinned to the **bottom edge of the active panel only** (inactive panels show no bar).
- Fills from 0% → 100% over that panel's active duration, then the panel deactivates as the rotation advances.
- Visual: thin (~3px), subtle track (e.g. `bg-peach-50/30`), fill in a brand accent (e.g. `bg-peach-400` or `bg-peach-50`), rounded ends.

### Hover interaction

- Hovering a panel **immediately makes it active** (interrupts the rotation, out of turn if needed) and **pauses** its progress fill at the current position.
- Moving the mouse away **resumes** the fill from where it paused; once it completes, normal rotation continues from the next panel in sequence.
- Clicking a panel still navigates to its target route, unchanged from [02a-hero-ctas.md](02a-hero-ctas.md).

**Hovering a panel that is not the active one:**

- The previously-active panel **deactivates immediately** — its caption and progress bar disappear, and its progress **resets to 0** (it does not resume from where it left off next time it becomes active; it always starts fresh at 0%).
- The newly-hovered panel **becomes active immediately** with its progress bar at **0%**, and it starts **paused** — nothing fills while the mouse remains over it, since there is no prior progress to resume.
- The bar only begins filling once the mouse leaves that panel. Once it completes, normal rotation resumes from the panel *after* it in sequence (Left → Main → Right, looping) — not from wherever the rotation was originally interrupted.

---

## Implementation notes

- The current per-panel `group/panel` hover scoping (fixed in [02a-hero-ctas.md](02a-hero-ctas.md) task 3) stays — but panel "active" visual state should no longer be driven by CSS `:hover`/`group-hover` alone, since it now needs to be triggered programmatically by the autoplay timer too. Expect each panel to take an `active: boolean` (or similar) prop/state and render its gradient + caption based on that, with the hover handler simply calling into the shared rotation state rather than relying on `group-hover/panel:*` utility classes for the reveal itself. (CSS-only affordances like the image `scale-[1.02]` can stay hover-driven.)
- A single shared piece of state (e.g. a composable, `composables/useTriptychAutoplay.ts`) should own: which panel index is active, progress (0–1) for the active panel, advancing on a timer, and pause/resume. `HeroTriptych.vue` orchestrates it and passes state down to `Left.vue` / `Main.vue` / `Right.vue`.
- Respect `prefers-reduced-motion`: consider skipping/slowing the autoplay advance for users who request reduced motion (progress bar and captions can still work, just without the automatic timer-driven cycling) — flagging as a consideration, not blocking.

---

## Task List

### 1. Autoplay engine + progress bar UI

- [x] Add a composable owning autoplay state: active panel index, per-panel progress (0–1), advance-on-timer, `pause()` / `resume()` — `composables/useTriptychAutoplay.ts`
- [x] Add a reusable progress bar element (thin bar pinned to a panel's bottom edge, fills 0→100% while active) — `components/triptych/ProgressBar.vue`
- [x] Wire `HeroTriptych.vue` to instantiate the composable and start the rotation on mount (Left → Main → Right, looping)

### 2. Wire panel reveal to autoplay state

- [x] `TriptychSide.vue` / `TriptychMain.vue` render their gradient + caption (+ arrow, for Main) based on the shared `active` prop instead of `group-hover/panel` alone
- [x] Progress bar renders only on the currently active panel
- [x] Click-through to each panel's target route (`/order`, `/#featured`, `/#event`) unchanged

### 3. Hover pause/resume

- [x] Hovering a panel makes it active immediately (interrupts the rotation) and pauses its progress fill
- [x] Leaving the panel resumes the fill; rotation continues to the next panel once it completes
- [x] Rotation resumes cleanly after repeated hover in/out

### 4. Cross-panel polish

- [x] Exactly one panel is ever active (caption + progress bar) at a time
- [x] Continuous looping (Left → Main → Right → Left …) including after hover interruptions
- [x] Mobile: text carousel (`components/triptych/cta/Mobile.vue`) cycling CTAs every 4 s — independent of desktop autoplay
- [x] `prefers-reduced-motion`: autoplay skipped when reduced motion is preferred

---

## Out of Scope

- Further mobile carousel redesign — current implementation (text + CTA cycling carousel) is sufficient.
- Changing CTA copy, targets, or panel routes — unchanged from [02a-hero-ctas.md](02a-hero-ctas.md).
- Swapping in dedicated Order/Events imagery — still tracked in [02a-hero-ctas.md](02a-hero-ctas.md)'s Notes.
- Exact duration tuning (4s is a starting suggestion) and precise progress bar colors — implement against a reasonable default, revisit once visible on screen.

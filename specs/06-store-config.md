# Spec: Store Configuration

**Status**: Draft  
**Type**: Static data — single source of truth

---

## Purpose

Every piece of store data that appears in more than one place should live in exactly one file. When the store email changes, one edit. When a social link changes, one edit. When a new point de vente opens, one edit.

This spec defines what belongs in that file and why. The technical shape of the file (a Nuxt `app.config.ts`, a composable, a plain TS module) is left to the technical sub-spec.

---

## What Goes Here vs. What Doesn't

**In config** — data that:
- Appears on multiple pages or components
- Changes independently from code (a new address, a new social handle)
- Is needed by the SEO/structured data layer as well as the UI

**Not in config** — data that:
- Is fetched from Shopify at runtime (products, prices, inventory)
- Is environment-specific (API keys, store domain → those go in `.env`)
- Is purely visual/design (colors, fonts → those belong in CSS variables)

---

## Configuration Entries

### Store Identity

```
name           "Simeon Cookies"
legalName      "Simeon Cookies SARL" (or SAS, auto-entrepreneur, etc. — à compléter)
tagline        "Faits maison à Mont-de-Marsan."
```

`name` is the display name used in the header wordmark, footer, page titles, and structured data.
`legalName` is the full legal entity name, used only in mentions légales and CGV — may differ from the brand name.
`tagline` is the short descriptor that appears in the hero subline and footer. Changing it here updates every occurrence.

---

### Contact

```
email          "hello@simeon-cookie.fr"   (customer-facing)
emailLegal     "contact@simeon-cookie.fr" (legal / RGPD contact — may be the same)
phone          "+33 X XX XX XX XX"        (optional — only include if publicly listed)
```

`email` appears in the order confirmation ("Écrivez-nous à…"), the footer, and the mentions légales.
`emailLegal` is the address listed for RGPD requests and legal notices — may be the same mailbox but kept separate so it can be a legal contact without exposing the customer support inbox.

---

### Main Address (Mont-de-Marsan)

```
address:
  street       "12 rue des Landes"    (à compléter)
  postalCode   "40000"
  city         "Mont-de-Marsan"
  department   "Landes"
  region       "Occitanie"
  country      "France"
  countryCode  "FR"
```

Used in:
- Footer ("Fabriqué à Mont-de-Marsan, Landes")
- LocalBusiness JSON-LD structured data on the homepage
- Mentions légales page
- Potentially a Google Maps embed on `/a-propos`

---

### Points de Vente (Resellers)

An array of locations that sell Simeon Cookies products but are not the main store.

Each entry:
```
pointsDeVente:
  - name        "Épicerie du Marché"
    address     "3 place du Marché, 40000 Mont-de-Marsan"
    city        "Mont-de-Marsan"
    hours       "Mar–Sam 8h–13h"       (optional)
    mapUrl      "https://maps.app.goo.gl/..."  (optional Google Maps link)

  - name        "Boutique Tasting Room"
    address     "..."
    city        "..."
    ...
```

Used on the `/revendeurs` page (to be specced). Centralizing here means adding a new reseller only requires one file change — no hunting through components.

---

### Social Links

```
socials:
  instagram    "https://instagram.com/simeon.cookie"
  facebook     "https://facebook.com/simeoncookie"
  tiktok       ""    (empty = not shown)
```

Empty string means the icon is not rendered. No conditional logic needed in components — they just iterate over non-empty values.

Used in: footer, `/a-propos`, Open Graph tags (indirectly).

Add new networks here as the brand grows; no component changes needed.

---

### SEO Defaults

```
seo:
  titleTemplate   "%s — Simeon Cookies"
  defaultTitle    "Simeon Cookies — Cookies artisanaux à Mont-de-Marsan"
  defaultDescription  "Simeon Cookies propose des cookies artisanaux faits maison à Mont-de-Marsan, Landes. Commandez en ligne ou retrouvez-nous chez nos revendeurs en Occitanie."
  defaultOgImage  "/og-default.jpg"
  locale          "fr_FR"
  siteUrl         "https://simeon-cookie.fr"   (no trailing slash)
```

`titleTemplate` is applied by Nuxt's `useHead` — page titles become "Nos cookies — Simeon Cookies", "Commande confirmée — Simeon Cookies", etc. Changing the brand suffix here updates every page title at once.

`siteUrl` is needed to generate absolute canonical URLs and OG image paths. Not a secret — fine to be in config rather than `.env`.

---

### Legal & Compliance

```
legal:
  siret              "XXX XXX XXX XXXXX"
  tvaIntracom        "FR XX XXXXXXXXX"
  rcsCity            "Mont-de-Marsan"     (if applicable)
  directorName       "Prénom Nom"          (gérant — required in mentions légales)
  hostName           "Netlify / GitHub Pages / …"
  hostAddress        "…"
  retractionDays     14                    (droit de rétractation — legally fixed at 14 but centralizing avoids hardcoding)
  cookieConsentVersion  1                  (bump to re-show the consent banner to returning users)
```

`retractionDays` will almost certainly never change (it's set by law), but it appears in both the order confirmation and the CGV — centralizing it avoids two places to update if a future law changes it.

`cookieConsentVersion` is an integer that the cookie banner checks against the stored consent. Bump it here to invalidate all existing consents and re-display the banner (e.g., after adding a new analytics tool).

---

### Commerce Settings

```
commerce:
  currency           "EUR"
  currencySymbol     "€"
  locale             "fr-FR"
  freeShippingThreshold   50.00     (€ — set to null if no free shipping offer)
  orderNotes         true            (enables gift message field at checkout)
```

`freeShippingThreshold` is referenced in:
- The cart drawer shipping note ("Livraison offerte dès 50,00 €")
- Any promotional copy on the homepage
- The checkout configuration reminder in `04-payment.md`

Setting it to `null` removes the free shipping messaging entirely — no component changes needed.

---

### Navigation Structure

```
nav:
  - label   "Nos cookies"
    href    "/cookies"
  - label   "Nos revendeurs"
    href    "/revendeurs"
  - label   "À propos"
    href    "/a-propos"
    disabled  true        (renders but grayed out until the page is live)
```

The header and the mobile drawer both iterate over this array. Adding a nav link, changing a label, or temporarily disabling a link requires one config change — not editing two components.

---

### Legal Pages

```
legalPages:
  mentionsLegales   "/mentions-legales"
  cgv               "/cgv"
  confidentialite   "/confidentialite"
```

Used to generate the footer legal links and the CGV link in the checkout footer. If a slug changes, it updates everywhere.

---

## Things Not to Put Here

| Candidate | Why not |
|-----------|---------|
| Shopify store domain / token | Secrets → `.env` |
| Product data, prices | Runtime → Shopify API |
| Design tokens (colors, spacing) | Belong in CSS variables |
| Page-specific copy (hero headline, product descriptions) | Live in the page/component or Shopify; too volatile for a shared config |
| Analytics IDs (GA, Plausible) | Environment-specific → `.env` or a separate analytics config |

---

## Maintenance Notes

- When the store moves or opens a second location, update `address` and `pointsDeVente`.
- When a social account is created, add it to `socials` — the footer renders it automatically.
- When a new legal requirement adds a mandatory disclosure (e.g., a new EU regulation), add a field to `legal` rather than hardcoding text in a component.
- After any change that affects the JSON-LD structured data (address, name, URL), re-verify with Google's Rich Results Test.

---

## Out of Scope

- The technical implementation (file format, Nuxt config API, composable shape) — to be covered in a technical sub-spec
- Multi-store / multi-locale configuration (v1 is France only)
- CMS-driven configuration (all values are static at build time in v1)

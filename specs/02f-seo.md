# Spec: Homepage — SEO / Meta

**Status**: Draft  
**Parent**: [02-homepage.md](02-homepage.md)

---

## Balises de base

| Tag | Value |
|-----|-------|
| `<html lang>` | `fr` |
| `<title>` | `Simeon Cookies — Cookies artisanaux à Mont-de-Marsan` |
| `meta description` | `Simeon Cookies propose des cookies artisanaux faits maison à Mont-de-Marsan, Landes. Commandez en ligne ou retrouvez-nous chez nos revendeurs en Occitanie.` |
| OG image | Hero cookie photograph |
| OG locale | `fr_FR` |
| Canonical | `https://[domain]/` |

---

## SEO local

The store's primary audience is in Mont-de-Marsan and the surrounding Occitanie region. Local signals to include:

- `<title>` and `meta description` mention "Mont-de-Marsan" explicitly
- Footer includes the physical address (required by French law and valuable for local SEO)
- A **LocalBusiness structured data block** (`application/ld+json`) on the homepage:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Simeon Cookies",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[à compléter]",
      "addressLocality": "Mont-de-Marsan",
      "postalCode": "40000",
      "addressRegion": "Landes",
      "addressCountry": "FR"
    },
    "url": "https://[domain]",
    "servesCuisine": "Cookies artisanaux",
    "priceRange": "€€"
  }
  ```
- `hasMap` can be added once a Google Maps listing exists

---

## Robots

- Homepage: indexable (`index, follow`)
- Sitemap: `sitemap.xml` generated at build time (Nuxt module)

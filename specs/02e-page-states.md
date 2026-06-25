# Spec: Homepage — Page States

**Status**: Draft  
**Parent**: [02-homepage.md](02-homepage.md)

---

| State | Behavior |
|-------|----------|
| Loading (initial Shopify fetch) | Product grid shows skeleton cards; hero and footer render immediately |
| Empty catalog | Show a "no products available" message in place of the grid — copy TBD |
| Shopify error | Show a gentle error state with a retry option; do not show a broken grid |

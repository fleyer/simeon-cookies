# Spec: Homepage — Page States

**Status**: Draft  
**Parent**: [02-homepage.md](02-homepage.md)

---

The homepage no longer hosts the full catalog grid — that page has its own states, see [03-order.md](03-order.md) "Page States." This table covers the homepage's own Shopify dependency: the Feature Callout section's single featured product (see [02c-feature-callout.md](02c-feature-callout.md)).

| State | Behavior |
|-------|----------|
| Loading (initial Shopify fetch) | Feature Callout shows a skeleton placeholder; hero and footer render immediately |
| Featured product unavailable | Fall back to a static/default featured item, or hide the section — TBD |
| Shopify error | Show a gentle error state with a retry option; do not show a broken section |

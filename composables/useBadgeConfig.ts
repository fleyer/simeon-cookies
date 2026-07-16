import { productCard } from "~/content/fr/product-card";
import type { ProductStatus } from "~/content/types";

export interface ProductComposableProps {
  status?: ProductStatus,
  rating?: number
}

export const useProduct = (props : ProductComposableProps ) => ({
  stars: computed(() => {
    if (props.rating === undefined) return []
    const rounded = Math.round(props.rating * 2) / 2
    return Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= rounded) return 'full'
      if (i + 0.5 === rounded) return 'half'
      return 'empty'
    })
  }),

  formattedRating: computed(() => {
    if (props.rating === undefined) return ''
    return props.rating.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
  }),

  badgeConfig : computed(() => {
    if (!props.status) return null
    return {
      new: { label: productCard.badges.new, color: 'primary' as const, variant: 'subtle' as const },
      featured: { label: productCard.badges.featured, color: 'secondary' as const, variant: 'solid' as const },
      soldout: { label: productCard.badges.soldout, color: 'neutral' as const, variant: 'subtle' as const },
      available: { label: productCard.badges.available, color: 'neutral' as const, variant: 'subtle' as const },
      popular: { label: productCard.badges.popular, color: 'neutral' as const, variant: 'subtle' as const },
    }[props.status]
  }),

  isSoldout: computed(() => props.status === 'soldout')
})
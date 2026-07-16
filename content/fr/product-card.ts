import type { ProductCardContent } from '../types'

export const productCard = {
  badges: {
    new: 'Nouveau !',
    featured: 'Coup de coeur',
    soldout: 'Épuisé',
  },
  ratingLabel: (rating) => `Note : ${rating} sur 5`,
} satisfies ProductCardContent

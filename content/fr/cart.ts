import type { CartContent } from '../types'

export const cart = {
  heading: 'Mon panier',
  empty: {
    title: 'Votre panier est vide.',
    subtitle: 'Allez choisir quelque chose de bon.',
    link: 'Voir nos cookies',
  },
  summary: {
    subtotalLabel: 'Sous-total TTC',
    shippingNote: "Livraison calculée à l'étape suivante",
  },
  checkoutButton: 'Valider le panier',
  checkoutError: "Impossible d'accéder au paiement. Veuillez réessayer.",
  continueShoppingLink: 'Continuer mes achats',
  removeAriaLabel: "Retirer l'article",
  decreaseAriaLabel: 'Diminuer la quantité',
  increaseAriaLabel: 'Augmenter la quantité',
  closeAriaLabel: 'Fermer le panier',
} satisfies CartContent

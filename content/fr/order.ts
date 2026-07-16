import type { OrderContent } from '../types'

export const order = {
  heading: 'Nos cookies',

  product: {
    orderButton: "Ajouter"
  },

  catalog: [
    {
      title: "Cookie à la fraise",
      subtitle: "les meilleurs, ils vont vous faire fondre !",
      image: "/products/cookies-strawberry.jpg",
      imageAlt: "cookie à la fraise",
      status: "featured",
      category: "NOUVEAU !",
      description: "Un mélange de couleur",
      link: "/order"
    }
  ]
} satisfies OrderContent

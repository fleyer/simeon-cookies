import type { OrderContent } from '../types'

export const order = {
  heading: 'Nos cookies',

  product: {
    orderButton: "Ajouter"
  },

  currency: "euros",

  catalog: [
  {
      title: "Cookie à la fraise",
      subtitle: "les meilleurs, ils vont vous faire fondre !",
      image: "/products/cookies-strawberry.jpg",
      imageAlt: "cookie à la fraise",
      status: "featured",
      category: "NOUVEAU !",
      description: "Un mélange de couleur",
      link: "/order",
      price: 10
    },
    {
      title: "Cookie au miel et au chocolat",
      subtitle: "Une explosion de saveur",
      image: "/products/cookies-honey-chocolate.jpg",
      imageAlt: "cookie au miel et au chocolat",
      status: "popular",
      description: "Ils l'adorent !",
      link: "/order",
      price: 7.99

    },
    {
      title: "Cookie à la mangue",
      subtitle: "Envie de chaleur tropicale ?",
      image: "/products/cookies-honey-chocolate.jpg",
      imageAlt: "cookie a la mangue",
      status: "soldout",
      description: "Vous allez craquer",
      link: "/order",
      price: 5
    }
]
} satisfies OrderContent

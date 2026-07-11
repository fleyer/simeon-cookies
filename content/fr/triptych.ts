import type { TriptychContent } from '../types'

export const triptych = {
  desktop: {
    title: 'Les petits cookies sont arrivés !',
    cta: 'Découvrir nos cookies',
  },
  mobile: {
    items: [
      {
        title: "Commander",
        ctaLabel: "C'est ici!",
        link: "/order"
      },
      {
        title: "Prochain évènnement",
        ctaLabel: "Voir le calendrier",
        link: "/#events"
      },
      {
        title: "Faire une demande",
        ctaLabel: "C'est facile",
        link: "/#"
      }
    ]
  },
} satisfies TriptychContent

import { order } from '~/content/fr/order'
import type { CatalogProduct } from '~/composables/useProducts'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export const useLocalProducts = () => {
  const products: CatalogProduct[] = order.catalog.map((product, index) => {
    const handle = slugify(product.title)
    return {
      id: `local-${index}-${handle}`,
      handle,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      category: product.category?.toUpperCase() ?? '',
      image: product.image ?? '',
      imageAlt: product.imageAlt,
      price: product.price !== undefined ? formatPrice(product.price) : '',
      status: product.status,
      link: `/cookies/${handle}`,
    }
  })

  return {
    products,
    pending: false,
    error: null,
    refresh: () => {},
  }
}

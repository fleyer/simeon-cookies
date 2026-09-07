import type { ProductStatus } from '~/content/types'

export interface CatalogProduct {
  id: string
  handle: string
  title: string
  subtitle: string
  description: string
  category: string
  image: string
  imageAlt: string
  price: string
  status: ProductStatus | undefined
  link: string
}

const CATALOG_QUERY = `
  query CatalogProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        description
        productType
        tags
        availableForSale
        featuredImage { url altText }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        variants(first: 10) {
          nodes { availableForSale quantityAvailable }
        }
        subtitle: metafield(namespace: "custom", key: "subtitle") { value }
      }
    }
  }
`

function resolveStatus(
  availableForSale: boolean,
  variants: Array<{ availableForSale: boolean; quantityAvailable: number | null }>,
  tags: string[],
): ProductStatus | undefined {
  const allSoldout =
    !availableForSale ||
    variants.every((v) => !v.availableForSale || (v.quantityAvailable ?? 0) === 0)

  if (allSoldout) return 'soldout'

  const lower = tags.map((t) => t.toLowerCase())
  if (lower.includes('featured')) return 'featured'
  if (lower.includes('new')) return 'new'
  if (lower.includes('popular')) return 'popular'

  return undefined
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount))
}

function extractSubtitle(description: string): string {
  return description.split(/[.!?]/)[0]?.trim() ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(node: any): CatalogProduct {
  const { amount, currencyCode } = node.priceRange.minVariantPrice

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    subtitle: node.subtitle?.value || extractSubtitle(node.description),
    description: node.description,
    category: (node.productType as string).toUpperCase(),
    image: node.featuredImage?.url ?? '',
    imageAlt: node.featuredImage?.altText || node.title,
    price: formatPrice(amount, currencyCode),
    status: resolveStatus(node.availableForSale, node.variants.nodes, node.tags),
    link: `/cookies/${node.handle}`,
  }
}

export const useProducts = () => {
  const { data, pending, error, refresh } = useAsyncData('shopify-catalog', async () => {
    const client = useShopify()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result } = await client.request(CATALOG_QUERY, { variables: { first: 50 } }) as any
    return (result.products.nodes as unknown[]).map(mapProduct)
  })

  return {
    products: computed(() => data.value ?? []),
    pending,
    error,
    refresh,
  }
}

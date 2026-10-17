import type { Page } from '@playwright/test'

const CATALOG_RESPONSE = {
  data: {
    products: {
      nodes: [
        {
          id: 'gid://shopify/Product/1',
          handle: 'cookie-one',
          title: 'Cookie One',
          description: 'A test cookie.',
          productType: 'cookie',
          tags: [],
          availableForSale: true,
          featuredImage: { url: 'https://example.com/one.png', altText: 'Cookie One' },
          priceRange: { minVariantPrice: { amount: '3.50', currencyCode: 'EUR' } },
          options: [],
          variants: {
            nodes: [{
              id: 'gid://shopify/ProductVariant/1',
              title: 'Default Title',
              availableForSale: true,
              quantityAvailable: 10,
              price: { amount: '3.50', currencyCode: 'EUR' },
              selectedOptions: [],
            }],
          },
          subtitle: { value: 'Delicious' },
        },
        {
          id: 'gid://shopify/Product/2',
          handle: 'cookie-two',
          title: 'Cookie Two',
          description: 'Another test cookie.',
          productType: 'cookie',
          tags: [],
          availableForSale: true,
          featuredImage: { url: 'https://example.com/two.png', altText: 'Cookie Two' },
          priceRange: { minVariantPrice: { amount: '4.00', currencyCode: 'EUR' } },
          options: [],
          variants: {
            nodes: [{
              id: 'gid://shopify/ProductVariant/2',
              title: 'Default Title',
              availableForSale: true,
              quantityAvailable: 10,
              price: { amount: '4.00', currencyCode: 'EUR' },
              selectedOptions: [],
            }],
          },
          subtitle: { value: 'Tasty' },
        },
      ],
    },
  },
}

export async function mockCatalog(page: Page) {
  await page.route('**/api/*/graphql.json', async (route) => {
    await route.fulfill({ json: CATALOG_RESPONSE })
  })
}

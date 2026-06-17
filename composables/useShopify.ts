import { createStorefrontApiClient } from '@shopify/storefront-api-client'

export const useShopify = () => {
  const config = useRuntimeConfig()

  const client = createStorefrontApiClient({
    storeDomain: config.public.shopifyStoreDomain,
    apiVersion: config.public.shopifyApiVersion,
    publicAccessToken: config.public.shopifyStorefrontToken,
  })

  return client
}

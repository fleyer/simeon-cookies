export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  runtimeConfig: {
    public: {
      shopifyStoreDomain: process.env.NUXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? 'mock.shop',
      shopifyStorefrontToken: process.env.NUXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? 'mock-token',
      shopifyApiVersion: '2025-01',
    },
  },
})
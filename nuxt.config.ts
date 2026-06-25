export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Lora:ital,wght@0,400;0,600;1,400&family=Instrument+Sans:wght@400;500&display=swap',
        },
      ],
    },
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
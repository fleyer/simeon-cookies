export interface CartItem {
  id: string
  handle: string
  title: string
  image: string
  imageAlt: string
  price: string
  quantity: number
}

const STORAGE_KEY = 'cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  if (import.meta.client) {
    // Nuxt's Pinia module re-hydrates store state from the SSR payload on
    // mount, which would otherwise clobber a synchronous localStorage read
    // done here. Wait until that hydration pass has settled.
    onNuxtReady(() => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          items.value = JSON.parse(stored)
        } catch {
          // ignore malformed data
        }
      }

      watch(items, (value) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      }, { deep: true })
    })
  }

  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return { items, totalCount, addItem }
})

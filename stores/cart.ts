export interface CartItem {
  id: string
  handle: string
  title: string
  image: string
  imageAlt: string
  price: string
  unitPrice: number
  quantity: number
}

const STORAGE_KEY = 'cart'

// Cart items persisted before `unitPrice` was introduced (or corrupted in
// some other way) would otherwise carry `unitPrice: undefined` into the
// subtotal sum, turning it into NaN. Recover the number from the formatted
// `price` string when it's missing so old carts don't silently break.
function sanitizeItem(item: CartItem): CartItem {
  if (Number.isFinite(item.unitPrice)) return item
  const parsed = parseFloat(String(item.price).replace(/[^0-9.,]/g, '').replace(',', '.'))
  return { ...item, unitPrice: Number.isFinite(parsed) ? parsed : 0 }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  if (import.meta.client) {
    // Nuxt's Pinia module re-hydrates store state from the SSR payload on
    // mount, which would otherwise clobber a synchronous localStorage read
    // done here. Wait until that hydration pass has settled.
    onNuxtReady(() => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          items.value = (JSON.parse(stored) as CartItem[]).map(sanitizeItem)
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

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  )

  function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    item.quantity = quantity
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    items,
    isOpen,
    totalCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    open,
    close,
  }
})

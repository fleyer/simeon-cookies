export interface CartItem {
  id: string
  handle: string
  title: string
  image: string
  imageAlt: string
  price: string
  unitPrice: number
  quantity: number
  variantId: string | undefined
  variantTitle?: string
}

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`

const STORAGE_KEY = 'cart'

// Two different variants of the same product must form separate cart lines,
// so a line is identified by its variant when it has one, falling back to
// the product id for any line without a variant (e.g. non-Shopify items).
function lineKey(item: Pick<CartItem, 'id' | 'variantId'>): string {
  return item.variantId ?? item.id
}

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
  const isCheckingOut = ref(false)
  const checkoutError = ref(false)

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
    const existing = items.value.find((i) => lineKey(i) === lineKey(product))
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => lineKey(i) === id)
    if (!item) return
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    item.quantity = quantity
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => lineKey(i) !== id)
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  async function checkout() {
    checkoutError.value = false
    isCheckingOut.value = true

    try {
      const client = useShopify()
      const lines = items.value
        .filter((item): item is CartItem & { variantId: string } => Boolean(item.variantId))
        .map((item) => ({ merchandiseId: item.variantId, quantity: item.quantity }))

      const { data, errors } = await client.request(CART_CREATE_MUTATION, {
        variables: { lines },
      })

      const userErrors = data?.cartCreate?.userErrors ?? []
      const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl

      if (errors || userErrors.length || !checkoutUrl) {
        checkoutError.value = true
        isCheckingOut.value = false
        return
      }

      window.location.href = checkoutUrl
    } catch {
      checkoutError.value = true
      isCheckingOut.value = false
    }
  }

  return {
    items,
    isOpen,
    isCheckingOut,
    checkoutError,
    totalCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    open,
    close,
    checkout,
  }
})

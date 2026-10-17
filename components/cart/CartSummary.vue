<script setup lang="ts">
import { cart } from '~/content/fr/cart'

const cartStore = useCartStore()

const formattedSubtotal = computed(() =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cartStore.subtotal),
)
</script>

<template>
  <div
    class="flex flex-col gap-3 p-6 rounded bg-[#FAF7F2] border border-default"
    data-testid="cart-summary"
  >
    <div class="flex items-baseline justify-between">
      <span class="font-instrument-sans text-sm text-ink-600">
        {{ cart.summary.subtotalLabel }}
      </span>
      <span class="font-fraunces font-medium text-xl text-ink-800">
        {{ formattedSubtotal }}
      </span>
    </div>
    <p class="font-lora text-xs text-ink-500">
      {{ cart.summary.shippingNote }}
    </p>
    <p
      v-if="cartStore.checkoutError"
      class="font-instrument-sans text-xs text-error"
    >
      {{ cart.checkoutError }}
    </p>

    <UButton
      :label="cart.checkoutButton"
      color="primary"
      variant="solid"
      block
      size="lg"
      :loading="cartStore.isCheckingOut"
      :disabled="cartStore.isCheckingOut"
      class="font-fraunces font-semibold justify-center mt-2"
      @click="cartStore.checkout()"
    />
    <UButton
      :label="cart.continueShoppingLink"
      to="/order"
      color="neutral"
      variant="link"
      block
      class="font-instrument-sans text-[13px] justify-center"
    />
  </div>
</template>

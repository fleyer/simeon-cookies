<script setup lang="ts">
import { cart } from '~/content/fr/cart'

const cartStore = useCartStore()

const formattedSubtotal = computed(() =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cartStore.subtotal),
)
</script>

<template>
  <UDrawer
    v-model:open="cartStore.isOpen"
    direction="right"
    :dismissible="false"
    :close-on-outside-click="false"
    :handle="false"
    :title="cart.heading"
    :ui="{
      content: 'w-screen h-dvh sm:w-[420px] sm:h-full max-w-none rounded-none sm:rounded-l-lg',
      container: 'w-full h-full flex flex-col p-0 gap-0 overflow-hidden',
      header: 'flex items-center justify-between px-4 py-4 border-b border-default shrink-0',
      body: 'flex-1 overflow-y-auto px-4',
      footer: 'shrink-0 flex flex-col gap-3 px-4 py-4 border-t border-default',
    }"
  >
    <template #header>
      <h2 class="font-fraunces font-medium text-2xl text-ink-800">
        {{ cart.heading }}<span v-if="cartStore.totalCount"> ({{ cartStore.totalCount }})</span>
      </h2>
      <UButton
        icon="i-heroicons-x-mark"
        color="neutral"
        variant="ghost"
        :aria-label="cart.closeAriaLabel"
        @click="cartStore.close()"
      />
    </template>

    <template #body>
      <CartEmptyState v-if="!cartStore.items.length" />
      <div v-else>
        <CartLineItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
        />
      </div>
    </template>

    <template
      v-if="cartStore.items.length"
      #footer
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
        color="neutral"
        variant="link"
        block
        class="font-instrument-sans text-[13px] justify-center"
        @click="cartStore.close()"
      />
    </template>
  </UDrawer>
</template>

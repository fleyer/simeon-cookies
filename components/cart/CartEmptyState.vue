<script setup lang="ts">
import { cart } from '~/content/fr/cart'

const cartStore = useCartStore()
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center text-center gap-2 py-16">
    <UIcon
      name="i-heroicons-shopping-bag"
      class="size-10 text-ink-300 mb-2"
    />
    <p class="font-fraunces text-xl text-ink-800">
      {{ cart.empty.title }}
    </p>
    <p class="font-lora text-[15px] text-ink-500">
      {{ cart.empty.subtitle }}
    </p>
    <UButton
      :label="cart.empty.link"
      variant="link"
      color="primary"
      class="mt-2"
      @click="cartStore.close()"
    />
  </div>
</template>

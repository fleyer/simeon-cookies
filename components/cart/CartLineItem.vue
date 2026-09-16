<script setup lang="ts">
import type { CartItem } from '~/stores/cart'
import { cart } from '~/content/fr/cart'

const props = defineProps<{ item: CartItem }>()

const cartStore = useCartStore()

function decrease() {
  cartStore.updateQuantity(props.item.id, props.item.quantity - 1)
}

function increase() {
  cartStore.updateQuantity(props.item.id, props.item.quantity + 1)
}

function remove() {
  cartStore.removeItem(props.item.id)
}
</script>

<template>
  <div
    class="flex gap-3 py-4 border-b border-default"
    data-testid="cart-line-item"
    :data-item-id="item.id"
  >
    <NuxtImg
      :src="item.image"
      :alt="item.imageAlt"
      class="size-[72px] shrink-0 rounded object-cover"
    />

    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <NuxtLink
        :to="`/cookies/${item.handle}`"
        class="font-fraunces font-medium text-base text-ink-800 truncate"
        @click="cartStore.close()"
      >
        {{ item.title }}
      </NuxtLink>

      <p class="font-instrument-sans text-[13px] text-ink-500">
        {{ item.price }}
      </p>

      <div class="flex gap-3 mt-1">
        <UFieldGroup orientation="horizontal">
          <UButton
            icon="i-heroicons-minus-small"
            color="neutral"
            variant="outline"
            size="sm"
            :aria-label="cart.decreaseAriaLabel"
            @click="decrease"
          />
          <span
            class="w-8 flex items-center justify-center font-instrument-sans text-sm text-ink-800"
            data-testid="cart-line-item-qty"
          >
            {{ item.quantity }}
          </span>
          <UButton
            icon="i-heroicons-plus-small"
            color="neutral"
            variant="outline"
            size="sm"
            :aria-label="cart.increaseAriaLabel"
            @click="increase"
          />
        </UFieldGroup>
      </div>
    </div>

    <UButton
      icon="i-heroicons-trash"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="cart.removeAriaLabel"
      @click="remove"
    />
  </div>
</template>

<script setup lang="ts">
import { cart } from '~/content/fr/cart'

useSeoMeta({
  title: cart.metaTitle,
  robots: 'noindex',
})

const cartStore = useCartStore()
</script>

<template>
  <main class="pt-[--ui-header-height] sm:pt-40 px-4 sm:px-0">
    <!--
      The cart is restored from localStorage after onNuxtReady, so the first
      client render has no items. ClientOnly keeps server and pre-mount markup
      identical (neutral fallback) and avoids flashing the empty state.
    -->
    <ClientOnly>
      <CartEmptyState v-if="!cartStore.items.length" />

      <div
        v-else
        class="max-w-5xl mx-auto grid gap-8 lg:grid-cols-3 lg:items-start"
      >
        <section class="lg:col-span-2">
          <h1 class="font-fraunces font-medium text-[28px] sm:text-[32px] text-ink-800">
            {{ cart.heading }} ({{ cartStore.totalCount }})
          </h1>
          <div class="mt-4 cart-list">
            <CartLineItem
              v-for="item in cartStore.items"
              :key="item.variantId ?? item.id"
              class="cart-item"
              :item="item"
            />
          </div>
        </section>

        <aside class="lg:sticky lg:top-[calc(var(--ui-header-height)+2rem)]">
          <CartSummary />
        </aside>
      </div>

      <template #fallback>
        <div class="min-h-[50vh]" />
      </template>
    </ClientOnly>
  </main>
</template>
<style lang="css" scoped>
.cart-list {
  & > .cart-item {
    border-bottom: 1px solid var(--ui-border);
  }
  
  & .cart-item:last-child {
    border-bottom: none;
  }
}
</style>

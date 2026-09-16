<script setup lang="ts">
import { UPageCard } from '#components'
import { order } from '~/content/fr/order'
import type { CatalogProduct } from '~/composables/useProducts'

const { products, pending, error, refresh } = useProducts()
const cartStore = useCartStore()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toCardProps({ id, handle, ...rest }: CatalogProduct) {
  return rest
}

function toCartItem({ id, handle, title, image, imageAlt, price }: CatalogProduct) {
  return { id, handle, title, image, imageAlt, price }
}

</script>

<template>
  <div class="pt-[--ui-header-height] sm:pt-40">
    <!-- Reserved for the tag-based filter row (see specs/03-order.md, Filtering) -->
    <div class="h-12" />

    <!--
      Product data is only ever fetched client-side (see useProducts: server: false),
      so the pending/error/empty/catalog branch taken on the server (always "pending",
      since the fetch never runs during prerender) can differ from the branch the
      client resolves to on its very first render. ClientOnly renders the same
      fallback on both server and pre-mount client, then swaps to the real content
      after mount, outside of hydration diffing — avoiding the mismatch entirely.
    -->
    <ClientOnly>
      <!-- Error -->
      <div
        v-if="error"
        class="text-center py-16"
      >
        <p class="font-instrument-sans text-ink-600">
          Impossible de charger le catalogue.
        </p>
        <UButton
          variant="outline"
          class="mt-4"
          @click="refresh()"
        >
          Réessayer
        </UButton>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!pending && !products.length"
        class="text-center py-16"
      >
        <p class="font-instrument-sans text-ink-600">
          Aucun cookie disponible pour le moment.
        </p>
      </div>

      <!-- Catalog grid -->
      <UPageGrid
        v-else-if="!pending"
        class="w-full"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          v-bind="toCardProps(product)"
          class="col-span-1 bg-muted"
          :as="UPageCard"
        >
          <template #footer>
            <div class="relative z-10 w-full flex justify-end items-center p-2">
              <UButton
                variant="solid"
                @click="cartStore.addItem(toCartItem(product))"
              >
                {{ order.product.orderButton }}
              </UButton>
            </div>
          </template>
        </ProductCard>
      </UPageGrid>

      <!-- Loading (also used as the ClientOnly fallback, so SSR/pre-mount markup matches) -->
      <UPageGrid
        v-else
        class="w-full"
      >
        <ProductCard
          v-for="i in 6"
          :key="i"
          loading
          class="col-span-1"
          :as="UPageCard"
        />
      </UPageGrid>

      <template #fallback>
        <UPageGrid class="w-full">
          <ProductCard
            v-for="i in 6"
            :key="i"
            loading
            class="col-span-1"
            :as="UPageCard"
          />
        </UPageGrid>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { UPageCard } from '#components'
import { order } from '~/content/fr/order'
import type { CatalogProduct } from '~/composables/useProducts'

const { products, pending, error, refresh } = useProducts()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toCardProps({ id, handle, ...rest }: CatalogProduct) {
  return rest
}
</script>

<template>
  <div class="pt-[--ui-header-height] sm:pt-40">
    <!-- Reserved for the tag-based filter row (see specs/03-order.md, Filtering) -->
    <div class="h-12" />

    <!-- Loading -->
    <UPageGrid
      v-if="pending"
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

    <!-- Error -->
    <div
      v-else-if="error"
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
      v-else-if="!products.length"
      class="text-center py-16"
    >
      <p class="font-instrument-sans text-ink-600">
        Aucun cookie disponible pour le moment.
      </p>
    </div>

    <!-- Catalog grid -->
    <UPageGrid
      v-else
      class="w-full"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        v-bind="toCardProps(product)"
        class="col-span-1"
        :as="UPageCard"
      >
        <template #footer>
          <div class="w-full flex justify-end items-center p-2">
            <UButton variant="solid">
              {{ order.product.orderButton }}
            </UButton>
          </div>
        </template>
      </ProductCard>
    </UPageGrid>
  </div>
</template>

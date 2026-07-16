<script setup lang="ts">
import { UPageCard } from '#components';
import { order } from '~/content/fr/order'
</script>

<template>
  <div class="pt-[--ui-header-height] sm:pt-40">
    <!-- Reserved for the tag-based filter row (see specs/03-order.md, Filtering) -->
    <div class="h-12" />

    <!-- Catalog grid: see specs/03-order.md task 2 -->
    <UPageGrid class="w-full">
      <ProductCard
        v-for="(product,index) in order.catalog"
        :key="index"
        v-bind="product"
        class="col-span-1"
        :as="UPageCard"
      >
        <template #footer>
          <div class="w-full flex justify-end items-center">
            <UButton variant="solid">
              {{ order.product.orderButton }}
            </UButton>
          </div>
        </template>
      </ProductCard>
    </UPageGrid>
  </div>
</template>

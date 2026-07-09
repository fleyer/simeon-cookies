<script setup lang="ts">
import type { ComponentProps } from '#build/types/layouts';
import { UPageCard } from '#components';
import type Card from '../product/Card.vue';

const product = {
    title: "Cookie à la fraise",
    subtitle: "les meilleurs, ils vont vous faire fondre !",
    image: "/products/cookies-strawberry.jpg",
    imageAlt: "cookie à la fraise",
    status: "featured",
    category: "NOUVEAU !",
    description: "Un mélange de couleur",
    link: "/"
} satisfies ComponentProps<typeof Card>

const product2 = {
    title: "Cookie au miel et au chocolat",
    subtitle: "N'attendez pas goutez les",
    image: "/products/cookies-honey-chocolate.jpg",
    imageAlt: "cookie au miel et au chocolat",
    category: "Les classiques",
    description: "Vous ne pourrez plus vous arretez",
    link: "/"
} satisfies ComponentProps<typeof Card>

</script>

<template>
  <UPageSection
    id="featured"
    title="C'est Nouveau !"
  >
    <UPageGrid>
      <UPageCard 
        class="bg-white row-span-2 col-span-2 md:col-span-1"
        title="Ingredients de saison :"
      >
        fraise
        mangue
        banane
      </UPageCard>
      <ProductCard
        v-bind="product"
        class="bg-white shadow-md col-span-2 md:col-span-1"
        :as="UPageCard"
      />

      <ProductCard
        v-bind="product2"
        class="bg-white shadow-md col-span-2 md:col-span-1"
        :as="UPageCard"
      />
      

      <UPageCard class="col-span-2 bg-white">
        Commander ! Promotion ?
      </UPageCard>
    </UPageGrid>
  </UPageSection>
</template>
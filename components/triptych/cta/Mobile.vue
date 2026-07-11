<script setup lang="ts">
import { triptych } from '~/content/fr/triptych'

const { items } = triptych.mobile

</script>

<template>
  <div
    class="md:hidden absolute inset-0 flex flex-col justify-end
        bg-gradient-to-t from-ink-900/75 via-ink-900/20 to-transparent
        px-8 pb-12"
  >
    <ClientOnly>
      <UCarousel
        v-slot="{ item }"
        :autoplay="{ delay: 4000 }"
        loop
        dots
        :items="items"
        class="w-full max-w-xs mx-auto"
      >
        <div>
          <p
            class="font-fraunces text-peach-50 font-semibold leading-tight mb-5"
            style="font-size: clamp(1.5rem, 6vw, 2rem)"
          >
            {{ item.title }}
          </p>
        </div>
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          :label="item.ctaLabel"
          :to="item.link"
          class="self-start"
        />
      </UCarousel>
    </ClientOnly>
  </div>
</template>

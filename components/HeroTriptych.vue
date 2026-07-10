<script setup lang="ts">
import { hero } from '~/content/fr/hero'
</script>

<template>
  <section class="flex flex-col h-svh bg-[#fbf2e9] pt-0 sm:pt-40">
    <div class="flex flex-col flex-1 w-full max-w-6xl mx-auto min-h-0">
      <!-- Triptych -->
      <div class="flex items-center justify-center gap-0 md:gap-10 px-0 md:px-12 pb-0 md:pb-8 md:pb-12 flex-1 min-h-0">
        <TriptychLeft />
        <TriptychMain />
        <TriptychRight />
      </div>

      <!-- Mobile: secondary CTA row (Order / Events) -->
      <div class="md:hidden flex items-center justify-center gap-3 px-6 pb-6">
        <UButton
          color="secondary"
          variant="outline"
          size="md"
          :label="hero.left.cta"
          to="/order"
          class="flex-1 justify-center"
        />
        <UButton
          color="secondary"
          variant="outline"
          size="md"
          :label="hero.right.cta"
          to="/#event"
          class="flex-1 justify-center"
        />
      </div>
    </div>
  </section>
</template>

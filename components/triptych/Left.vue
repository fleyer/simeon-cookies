<script setup lang="ts">
import { hero } from '~/content/fr/hero'
</script>

<template>
  <NuxtLink
    to="/order"
    class="group/panel hidden md:flex relative aspect-[9/19] h-[90%] overflow-hidden cursor-pointer"
  >
    <NuxtImg
      src="/cookies/hero/cookies-strawberry.jpg"
      alt=""
      format="webp"
      sizes="md:33vw"
      class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/panel:scale-[1.02]"
    />

    <div
      class="absolute inset-0 flex flex-col items-center justify-end gap-3 pb-16 px-4
           bg-gradient-to-t from-ink-900/50 group-hover/panel:from-ink-900/70
           transition-all duration-500 ease-out"
    >
      <h3
        class="font-fraunces font-bold text-peach-50 text-center leading-tight text-lg
             opacity-0 group-hover/panel:opacity-100
             transition-opacity duration-300 ease-out"
      >
        {{ hero.left.title }}
      </h3>
      <span
        class="translate-y-2 opacity-0 group-hover/panel:translate-y-0 group-hover/panel:opacity-100
             transition-all duration-300 ease-out delay-100
             text-peach-100 font-instrument-sans text-[11px] uppercase tracking-[0.3em]"
      >
        {{ hero.left.cta }}
      </span>
    </div>
  </NuxtLink>
</template>

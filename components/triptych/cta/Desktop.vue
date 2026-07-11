<script setup lang="ts">
import { triptych } from '~/content/fr/triptych';

const { desktop: { title, cta }} = triptych
defineProps<{ 
  active: boolean,
}>()
</script>
<template>
  <div
    class="hidden md:flex absolute inset-0 flex-col items-center justify-end pb-20 px-0
          bg-gradient-to-t transition-all duration-500 ease-out z-1"
    :class="active ? 'from-ink-900/70' : 'from-ink-900/50'"
  >
    <h2
      class="font-fraunces font-bold text-peach-50 text-center leading-tight text-2xl
            transition-transform duration-500 ease-out"
      :class="active ? 'scale-105' : 'scale-100'"
    >
      {{ title }}
    </h2>
    <div
      class="w-full overflow-hidden transition-[max-height] duration-500 ease-out"
      :class="active ? 'max-h-24' : 'max-h-0'"
    >
      <div class="flex flex-col items-center gap-2 pt-4 pb-2">
        <span
          class="transition-opacity duration-300 ease-out delay-100
                text-peach-100 font-instrument-sans text-[11px] uppercase tracking-[0.3em]"
          :class="active ? 'opacity-100' : 'opacity-0'"
        >
          {{ cta }}
        </span>
        <span
          class="transition-opacity duration-300 delay-200 inline-flex"
          :class="active ? 'opacity-100' : 'opacity-0'"
        >
          <UIcon
            name="i-heroicons-arrow-down"
            class="text-peach-100 size-5 arrow-float"
          />
        </span>
      </div>
    </div>
  </div>

  <div
    :class="active ? 'sm:flex' : ''"
    class="hidden"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  to: string
  image: string
  title: string
  cta: string
  active: boolean
  progress: number
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group/panel hidden h-[95%] self-end md:flex relative aspect-[9/19] overflow-hidden cursor-pointer"
  >
    <NuxtImg
      :src="image"
      alt=""
      format="webp"
      sizes="md:33vw"
      class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/panel:scale-[1.02]"
    />

    <div
      class="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4
           bg-gradient-to-t transition-all duration-500 ease-out"
      :class="active ? 'from-ink-900/70' : 'from-ink-900/50'"
    >
      <h3
        class="font-fraunces font-bold text-peach-50 text-center leading-tight text-lg
             transition-transform duration-500 ease-out"
        :class="active ? 'scale-105' : 'scale-100'"
      >
        {{ title }}
      </h3>
      <div
        class="w-full overflow-hidden transition-[max-height] duration-500 ease-out"
        :class="active ? 'max-h-10' : 'max-h-0'"
      >
        <span
          class="block pt-3 text-center transition-opacity duration-300 ease-out delay-100
               text-peach-100 font-instrument-sans text-[11px] uppercase tracking-[0.3em]"
          :class="active ? 'opacity-100' : 'opacity-0'"
        >
          {{ cta }}
        </span>
      </div>
    </div>

    <TriptychProgressBar
      v-if="active"
      :progress="progress"
    />
  </NuxtLink>
</template>

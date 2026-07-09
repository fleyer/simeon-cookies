<script setup lang="ts">
import type { Component } from 'vue'
import { UCard } from '#components'

interface Props {
  image: string
  imageAlt?: string
  title: string
  subtitle: string
  description: string
  status?: 'new' | 'featured' | 'soldout'
  rating?: number
  price?: string
  category?: string
  link: string
  as?: Component
}

const props = defineProps<Props>()

const isSoldout = computed(() => props.status === 'soldout')

const badgeConfig = computed(() => {
  if (!props.status) return null
  return {
    new: { label: 'Nouveau', color: 'primary' as const, variant: 'subtle' as const },
    featured: { label: 'Coup de cœur', color: 'secondary' as const, variant: 'solid' as const },
    soldout: { label: 'Épuisé', color: 'neutral' as const, variant: 'subtle' as const },
  }[props.status]
})

const stars = computed(() => {
  if (props.rating === undefined) return []
  const rounded = Math.round(props.rating * 2) / 2
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= rounded) return 'full'
    if (i + 0.5 === rounded) return 'half'
    return 'empty'
  })
})

const formattedRating = computed(() => {
  if (props.rating === undefined) return ''
  return props.rating.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
})

const cardUi = computed(() => ({
  root: [
    'overflow-hidden rounded-none bg-transparent',
    props.status === 'featured' ? 'ring-2 ring-peach-300' : '',
  ].join(' '),
  header: 'p-0 px-0 sm:px-0',
  body: 'p-4 pt-3',
}))
</script>

<template>
  <component
    :is="as ?? UCard"
    :ui="cardUi"
    :to="link"
  >
    <template #header>
      <div class="relative aspect-square overflow-hidden">
        <NuxtImg
          :src="image"
          :alt="imageAlt ?? title"
          format="webp"
          class="w-full h-full object-cover object-center transition-transform duration-[400ms] ease-out group-hover/card:scale-[1.03]"
          :style="isSoldout ? { filter: 'brightness(0.75) grayscale(30%)' } : undefined"
        />
        <UBadge
          v-if="badgeConfig"
          :label="badgeConfig.label"
          :color="badgeConfig.color"
          :variant="badgeConfig.variant"
          size="sm"
          class="absolute top-3 right-3 font-instrument-sans uppercase tracking-widest"
        />
      </div>
    </template>

    <p
      v-if="category"
      class="font-instrument-sans text-[11px] uppercase tracking-widest text-ink-400"
    >
      {{ category }}
    </p>

    <h3
      class="font-fraunces font-medium text-xl text-ink-800 transition-opacity duration-300"
      :class="[category ? 'mt-0.5' : '', isSoldout ? 'opacity-60' : '']"
    >
      {{ title }}
    </h3>

    <p
      class="font-lora italic text-sm text-ink-600 truncate transition-opacity duration-300"
      :class="isSoldout ? 'opacity-60' : ''"
    >
      {{ subtitle }}
    </p>

    <p class="font-instrument-sans text-sm text-ink-700 mt-2 line-clamp-3">
      {{ description }}
    </p>

    <div
      v-if="rating !== undefined && !isSoldout"
      class="flex items-center mt-3"
      :aria-label="`Note : ${formattedRating} sur 5`"
    >
      <div class="flex items-center gap-0.5">
        <UIcon
          v-for="(type, i) in stars"
          :key="i"
          :name="type === 'empty' ? 'i-heroicons-star' : 'i-heroicons-star-solid'"
          class="size-4"
          :class="{
            'text-peach-500': type === 'full',
            'text-peach-300': type === 'half',
            'text-ink-200': type === 'empty',
          }"
        />
      </div>
      <span class="font-instrument-sans text-[11px] text-ink-500 ml-2">
        ({{ formattedRating }}&nbsp;/&nbsp;5)
      </span>
    </div>

    <p
      v-if="price"
      class="font-instrument-sans font-medium text-sm text-ink-800 mt-3"
    >
      {{ price }}
    </p>
  </component>
</template>

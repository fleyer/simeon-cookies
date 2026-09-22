<script setup lang="ts">
import type { ProductOption, ProductVariant } from '~/composables/useProducts'

const props = defineProps<{
  options: ProductOption[]
  variants: ProductVariant[]
}>()

const variant = defineModel<ProductVariant | undefined>('variant')

const selected = ref<Record<string, string>>({})

function resolveVariant() {
  const complete = props.options.every((option) => selected.value[option.name])
  if (!complete) {
    variant.value = undefined
    return
  }

  variant.value = props.variants.find((v) =>
    v.selectedOptions.every((opt) => selected.value[opt.name] === opt.value),
  )
}

// Stock is not managed, so this only reflects whether the combination exists
// as a real variant at all — not whether Shopify considers it in stock.
function isValueAvailable(optionName: string, value: string): boolean {
  const otherSelections = Object.entries(selected.value).filter(([name]) => name !== optionName)
  return props.variants.some((v) =>
    v.selectedOptions.some((opt) => opt.name === optionName && opt.value === value) &&
    otherSelections.every(([name, val]) =>
      v.selectedOptions.some((opt) => opt.name === name && opt.value === val),
    ),
  )
}

watch(selected, resolveVariant, { deep: true })
</script>

<template>
  <UFieldGroup
    orientation="horizontal"
    class="w-full"
  >
    <USelect
      v-for="option in options"
      :key="option.name"
      v-model="selected[option.name]"
      :placeholder="option.name"
      :items="option.values.map((value) => ({ label: value, value, disabled: !isValueAvailable(option.name, value) }))"
      size="sm"
      class="min-w-0 flex-1"
    />
  </UFieldGroup>
</template>

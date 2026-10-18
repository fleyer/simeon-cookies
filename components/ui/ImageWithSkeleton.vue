<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src?: string
  alt?: string
  width?: number
  provider?: 'shopify'
  format?: string
  wrapperClass?: string
}>()

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const loaded = ref(false)

function markLoaded() {
  loaded.value = true
}

// Static pages: the <img> can finish loading before hydration, so @load never reaches Vue.
function checkAlreadyLoaded() {
  const img = wrapper.value?.querySelector('img')
  if (img?.complete && img.naturalWidth > 0) markLoaded()
}

onNuxtReady(checkAlreadyLoaded)

watch(() => props.src, () => {
  loaded.value = false
  nextTick(checkAlreadyLoaded)
})
</script>

<template>
  <div
    ref="wrapper"
    class="relative"
    :class="wrapperClass"
  >
    <USkeleton
      v-if="!loaded"
      class="absolute inset-0 size-full"
    />
    <NuxtImg
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      :width="width"
      :provider="provider"
      :format="format"
      class="size-full transition-[opacity,transform]"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="markLoaded"
      @error="markLoaded"
    />
  </div>
</template>

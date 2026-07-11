<script setup lang="ts">
withDefaults(
  defineProps<{
    progress?: number
  }>(),
  { progress: 0 }
)
</script>

<template>
  <div class="absolute bottom-4 left-6 right-6 h-[3px] rounded-full bg-peach-50/30 overflow-hidden z-10">
    <div
      class="h-full rounded-full bg-peach-400"
      :style="{ width: `${progress * 100}%` }"
    />
  </div>
</template>

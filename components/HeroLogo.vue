<script setup lang="ts">
defineProps<{ height?: string }>()
</script>
<template>
  <NuxtImg 
    v-motion-pop
    src="/Simeon-Hero.png" 
    alt="Simeon Cookies"
    format="webp"
    :width="400"
    :height="400"
  />
</template>


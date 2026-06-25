<script setup lang="ts">
defineProps<{ height?: string }>()
</script>
<template>
  <NuxtImg 
    src="/Simeon-Hero.png" 
    format="webp"
    :height="400"
  />
</template>


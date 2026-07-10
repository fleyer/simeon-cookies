<script setup lang="ts">
import { order } from '~/content/fr/order'
</script>

<template>
  <div class="pt-0 sm:pt-40">
    <h1 class="font-fraunces font-medium text-[32px] text-ink-800">
      {{ order.heading }}
    </h1>

    <!-- Reserved for the tag-based filter row (see specs/03-order.md, Filtering) -->
    <div class="h-12" />

    <!-- Catalog grid: see specs/03-order.md task 2 -->
  </div>
</template>

<script setup lang="ts"></script>

<template>
  <section class="flex flex-col h-svh bg-[#fbf2e9] pt-0 sm:pt-40">
    <div class="flex flex-col flex-1 w-full max-w-6xl mx-auto min-h-0">
      <!-- Triptych -->
      <div class="group/triptych flex items-center justify-center gap-0 md:gap-10 px-0 md:px-12 pb-0 md:pb-8 md:pb-12 flex-1 min-h-0">
        <TriptychLeft />
        <TriptychMain />
        <TriptychRight />
      </div>
    </div>
  </section>
</template>

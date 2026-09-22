<script setup lang="ts">
import { footer } from '~/content/fr/footer'

const navItems = [
  { label: footer.nav.cookies, to: '/order' },
  { label: footer.nav.resellers, to: '/' },
  { label: footer.nav.about, to: '/' },
]
</script>

<template>
  <footer class="bg-[#1A0F0A] border-t border-[#2A1D14]">
    <div class="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <p class="font-fraunces font-bold text-xl text-[#FAF7F2]">
          {{ footer.wordmark }}
        </p>
        <p class="font-instrument-sans text-sm text-[#E2D5BF] mt-1">
          {{ footer.address }}
        </p>
      </div>

      <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-instrument-sans text-sm">
        <NuxtLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="text-[#E2D5BF] hover:text-[#FAF7F2] transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span class="hidden md:inline text-[#5A4A3A]">·</span>
        <span
          v-for="(label, i) in footer.legal"
          :key="label"
          class="text-[#8A7561]"
        >
          {{ label }}<span
            v-if="i < footer.legal.length - 1"
            class="mx-2"
          >·</span>
        </span>
      </nav>

      <p class="font-instrument-sans text-xs text-[#8A7561] text-center md:text-right">
        {{ footer.copyright }}
      </p>
    </div>

    <div class="max-w-6xl mx-auto px-6 md:px-12 pb-6">
      <p class="font-instrument-sans text-xs text-[#5A4A3A] text-center md:text-left">
        {{ footer.strapline }}
      </p>
    </div>
  </footer>
</template>

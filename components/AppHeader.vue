<script setup lang="ts">
const scrollY = useScrollY()
const bgOpacity = computed(() => Math.min(scrollY.value / 300, 1))
const isScrolled = computed(() => scrollY.value > 80)

const mobileOpen = ref(false)
const cartCount = ref(0)

const navItems = [
  { label: 'Nos cookies', to: '/cookies' },
  { label: 'Nos revendeurs', to: '/revendeurs' },
  { label: 'À propos', to: '/a-propos', disabled: true },
]

</script>

<template>
  <UHeader
    v-model:open="mobileOpen"
    :toggle="false"
    mode="slideover"
    :menu="{ side: 'left', ui: { content: 'bg-[#1A0F0A] w-[280px] shadow-none sm:shadow-none' } }"
    :class="isScrolled ? 'shadow-sm' : 'shadow-none'"
    :style="{
      '--ui-header-height': isScrolled ? '80px' : '120px',
      backgroundColor: `rgba(250, 247, 242, ${bgOpacity})`,
      borderBottomColor: `rgba(226, 213, 191, ${bgOpacity})`,
    }"
    :ui="{
      root: 'fixed inset-x-0 transition-[height,box-shadow] duration-500',
      container: 'max-w-6xl px-6 md:px-12',
      center: 'hidden md:flex',
      content: 'md:hidden',
      overlay: 'md:hidden',
      body: 'p-8',
    }"
  >
    <template #left>
      <NuxtLink
        to="/"
        class="font-fraunces font-bold text-xl text-ink-800 shrink-0"
      >
        Simeon Cookies
      </NuxtLink>
    </template>

    <!-- Desktop center nav -->
    <UNavigationMenu
      :items="navItems"
      variant="link"
      color="neutral"
    />

    <template #right>
      <!-- Cart -->
      <button
        class="relative text-ink-800"
        aria-label="Panier"
      >
        <UIcon
          name="i-heroicons-shopping-bag"
          class="size-[22px]"
        />
        <Transition name="badge-pop">
          <span
            v-if="cartCount > 0"
            class="absolute -top-1.5 -right-1.5 bg-[#1A0F0A] text-[#FAF7F2] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
          >
            {{ cartCount }}
          </span>
        </Transition>
      </button>

      <!-- Hamburger (mobile) -->
      <button
        class="md:hidden text-ink-800"
        aria-label="Ouvrir le menu"
        @click="mobileOpen = !mobileOpen"
      >
        <UIcon
          :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          class="size-6"
        />
      </button>
    </template>

    <template #body>
      <nav class="flex flex-col gap-8">
        <NuxtLink
          v-for="link in navItems"
          :key="link.to"
          :to="link.to"
          class="font-fraunces font-medium text-ink-800 leading-none text-[28px]"
          :class="link.disabled ? 'opacity-40 pointer-events-none' : ''"
          :aria-disabled="link.disabled || undefined"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </template>
  </UHeader>
</template>

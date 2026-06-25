<script setup lang="ts">
const scrollY = useScrollY()
const bgOpacity = computed(() => Math.min(scrollY.value / 300, 1))
const isScrolled = computed(() => scrollY.value > 80)

const mobileOpen = ref(false)
const cartCount = ref(0)

const navItems = [
  { label: 'Nos cookies !', to: '/', class: 'text-peach-600 rounded-full border-solid border-1' },
  { label: 'Nos revendeurs', to: '/' },
  { label: 'À propos', to: '/' },
]

</script>

<template>
  <UHeader
    v-model:open="mobileOpen"
    :toggle="false"
    mode="slideover"
    title=""
    :menu="{ side: 'left', ui: { content: 'bg-[#1A0F0A] w-[280px] shadow-none sm:shadow-none' } }"
    :class="isScrolled ? 'shadow-sm' : 'shadow-none'"
    :style="{
      '--ui-header-height': isScrolled ? '80px' : '160px',
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
        :class="`font-fraunces font-bold text-xl text-ink-800 shrink-0 duration-200`"
        :style="{ opacity: bgOpacity }"
      >
        <NuxtImg
          src="/Simeon.png"
          height="40"
        />
      </NuxtLink>
    </template>

    <!-- Desktop center nav -->
    <UNavigationMenu
      :items="navItems"
      variant="link"
      color="neutral"
    >
      <template #item-label="{item}">
        <div :class="`font-fraunces transition-[font-size,padding] duration-500 opacity-80 ${isScrolled ? 'text-xl' : 'text-xl p-4'}`">
          {{ item.label }}
        </div>
      </template>
    </UNavigationMenu>

    <template #right>
      <!-- Cart -->
      <button
        class="relative text-ink-800"
        aria-label="Panier"
      >
        <UIcon
          name="i-heroicons-shopping-bag"
          :class="`text-peach-600 transition-[height,width] duration-200 ${isScrolled ? 'size-[30px]' : 'size-[40px]'}`"
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
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </template>
  </UHeader>
</template>

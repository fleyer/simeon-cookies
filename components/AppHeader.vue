<script setup lang="ts">
const scrollY = useScrollY()
const bgOpacity = computed(() => Math.min(scrollY.value / 300, 1))
const isScrolled = computed(() => scrollY.value > 80)
const logoTranslateY = computed(() => Math.max(8 * (1 - scrollY.value / 300), 0))

const mobileOpen = ref(false)
const cartCount = ref(0)

const navItems = [
  { label: 'Nos cookies !', to: '/', class: 'text-peach-600 rounded-full border-solid border-1' },
  { label: 'Nos revendeurs', to: '/' },
  { label: 'À propos', to: '/' },
]

</script>

<template>
  <div 
    :class="['header-host', { scrolling : isScrolled} ]" 
    :style="{
      '--header-bg-opacity': bgOpacity,
      '--header-logo-translate-y': `${logoTranslateY}px`,
    }"
  >
    <UHeader
      v-model:open="mobileOpen"
      :toggle="false"
      mode="slideover"
      title=""
      :menu="{ side: 'left', ui: { content: 'bg-[#1A0F0A] w-[280px] shadow-none sm:shadow-none' } }"
      :class="[isScrolled ? 'shadow-sm' : 'shadow-none']"
      :ui="{
        root: 'app-header fixed inset-x-0 transition-none md:transition-[height,box-shadow] duration-500 backdrop-blur-none md:backdrop-blur-sm',
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
          :class="`font-fraunces header-logo-animation font-bold text-xl text-ink-800 shrink-0 duration-200`"
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
          class="relative group/cart rounded-full p-2 text-ink-800"
          aria-label="Panier"
        >
          <span :class="`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white scale-0 group-hover/cart:scale-100 transition-none md:transition-transform duration-300 ease-out size-[30px] ${isScrolled ? '' : 'md:size-[55px]'}`" />
          <UIcon
            name="i-heroicons-shopping-bag"
            :class="`relative z-10 text-peach-600 transition-[height,width] duration-200 size-[30px] ${isScrolled ? '' : 'md:size-[40px]'}`"
          />
          <Transition name="badge-pop">
            <span
              v-if="cartCount > 0"
              class="absolute z-10 -top-1.5 -right-1.5 bg-[#1A0F0A] text-[#FAF7F2] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
            >
              {{ cartCount }}
            </span>
          </Transition>
        </button>

        <!-- Hamburger (mobile) -->
        <button
          class="md:hidden text-ink-800 ml-4"
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
  </div>
</template>

<style scoped>
.header-host {
  --ui-header-height: 60px;
}

:deep(.app-header) {
  background-color: rgba(250, 247, 242,1);
  border-bottom-color: rgba(226, 213, 191,1);

}

:deep(.header-logo-animation) {
  opacity: var(--header-bg-opacity);
  transform: translateY(var(--header-logo-translate-y));
}

@media (min-width: 768px) {
  .scrolling.header-host {
    --ui-header-height: 80px;
  }
  .header-host {
    --ui-header-height: 160px;
  }

  :deep(.app-header) {
    background-color: rgba(250, 247, 242, var(--header-bg-opacity));
    border-bottom-color: rgba(226, 213, 191, var(--header-bg-opacity));
  }
}
</style>

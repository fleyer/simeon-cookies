<script setup lang="ts">
defineProps<{
  active: boolean
  progress?: number
}>()

const scrollY = useScrollY()
const logoOpacity = computed(() => Math.max(1 - scrollY.value / 100, 0))
</script>

<template>
  <NuxtLink
    to="/#featured"
    class="group/panel relative aspect-auto md:aspect-[9/19] h-full max-h-full cursor-pointer"
  >
    <div
      class="absolute w-[70%] md:w-[80%] h-[460px] md:h-[320px] z-10 pt-40 md:pt-10 left-1/2 -translate-x-1/2 flex justify-center items-center overflow-hidden"
      :style="{ opacity: logoOpacity }"
    >
      <HeroLogo />
    </div>

    <div class="h-full w-full aspect-auto sm:aspect=[9/19] overflow-hidden">
      <NuxtImg
        src="/cookies/hero/cookies-landing.png"
        alt="Cookie signature Simeon"
        format="webp"
        sizes="100vw md:33vw"
        loading="eager"
        class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/panel:scale-[1.02]"
      />
    </div>

    <slot name="cta" />
  </NuxtLink>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(7px); }
}
.arrow-float {
  animation: float 1.6s ease-in-out infinite;
}
</style>

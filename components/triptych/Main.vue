<script setup lang="ts">
import { triptych } from '~/content/fr/triptych'

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


    <!-- Desktop: title (always) + hover CTA -->
    <div
      class="hidden md:flex absolute inset-0 flex-col items-center justify-end gap-4 pb-20 px-6
           bg-gradient-to-t from-ink-900/50 group-hover/panel:from-ink-900/70
           transition-all duration-500 ease-out z-1"
    >
      <h2
        class="font-fraunces font-bold text-peach-50 text-center leading-tight text-2xl"
      >
        {{ triptych.desktop.title }}
      </h2>
      <span
        class="translate-y-2 opacity-0 group-hover/panel:translate-y-0 group-hover/panel:opacity-100
             transition-all duration-300 ease-out delay-100
             text-peach-100 font-instrument-sans text-[11px] uppercase tracking-[0.3em]"
      >
        {{ triptych.desktop.cta }}
      </span>
      <span class="opacity-0 group-hover/panel:opacity-100 transition-opacity duration-300 delay-200 inline-flex">
        <UIcon
          name="i-heroicons-arrow-down"
          class="text-peach-100 size-5 arrow-float"
        />
      </span>
    </div>

    <!-- Mobile: always-visible CTA -->
    <div
      class="md:hidden absolute inset-0 flex flex-col justify-end
           bg-gradient-to-t from-ink-900/75 via-ink-900/20 to-transparent
           px-8 pb-12"
    >
      <p
        class="font-fraunces text-peach-50 font-semibold leading-tight mb-5"
        style="font-size: clamp(1.5rem, 6vw, 2rem)"
      >
        {{ triptych.mobile.title }}
      </p>
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        :label="triptych.mobile.cta"
        class="self-start"
      />
    </div>
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

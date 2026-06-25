<template>
  <section class="flex flex-col h-svh bg-[#fbf2e9] overflow-hidden">
    <div class="flex flex-col flex-1 w-full max-w-6xl mx-auto min-h-0">
    <!-- Gallery title -->
    <div class="flex-none px-8 md:px-12 pt-8 md:pt-10 pb-3 md:pb-5">
      <h1
        class="font-fraunces font-bold leading-[0.9] tracking-tight text-ink-800"
        style="font-size: clamp(3rem, 8vw, 6.5rem)"
      >
        Simeon
      </h1>
    </div>

    <!-- Triptych -->
    <div class="flex items-center justify-center gap-3 md:gap-5 px-8 md:px-12 pb-8 md:pb-12 flex-1 min-h-0">
      <!-- Left panel — desktop only -->
      <div class="hidden md:flex aspect-[9/19] h-full max-h-full overflow-hidden flex-shrink-0">
        <NuxtImg
          src="/cookies/hero/cookies-strawberry.jpg"
          alt=""
          format="webp"
          sizes="md:33vw"
          class="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
        />
      </div>

      <!-- Center panel — featured -->
      <div class="relative aspect-[9/19] h-full max-h-full overflow-hidden group cursor-pointer flex-shrink-0">
        <NuxtImg
          src="/cookies/hero/cookies-landing.png"
          alt="Cookie signature Simeon"
          format="webp"
          sizes="100vw md:33vw"
          loading="eager"
          class="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        <!-- Desktop: title (always) + hover CTA -->
        <div
          class="hidden md:flex absolute inset-0 flex-col items-center justify-end gap-4 pb-20 px-6
                 bg-gradient-to-t from-ink-900/50 group-hover:from-ink-900/70
                 transition-all duration-500 ease-out"
        >
          <h2
            class="font-fraunces font-bold text-peach-50 text-center leading-tight text-2xl"
          >
            Les petits cookies sont arrivés&nbsp;!
          </h2>
          <span
            class="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                   transition-all duration-300 ease-out delay-100
                   text-peach-100 font-instrument-sans text-[11px] uppercase tracking-[0.3em]"
          >
            Découvrir nos cookies
          </span>
          <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 inline-flex">
            <UIcon name="i-heroicons-arrow-down" class="text-peach-100 size-5 arrow-float" />
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
            Des cookies qui méritent d'attendre.
          </p>
          <UButton
            color="primary"
            variant="solid"
            size="lg"
            label="Découvrir nos cookies"
            class="self-start"
          />
        </div>
      </div>

      <!-- Right panel — desktop only -->
      <div class="hidden md:flex aspect-[9/19] h-full max-h-full overflow-hidden flex-shrink-0">
        <NuxtImg
          src="/cookies/hero/cookie-honey-chocolate.jpg"
          alt=""
          format="webp"
          sizes="md:33vw"
          class="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
        />
      </div>
    </div>
    </div>
  </section>
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

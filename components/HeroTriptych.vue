<script setup lang="ts">
import { hero } from '~/content/fr/hero'

const { isActive, progressFor, hoverEnter, hoverLeave } = useTriptychAutoplay()
</script>

<template>
  <section class="flex flex-col h-svh bg-[#fbf2e9] pt-0 sm:pt-40">
    <div class="flex flex-col flex-1 w-full max-w-6xl mx-auto min-h-0">
      <!-- Triptych -->
      <div class="flex items-center justify-center gap-0 md:gap-10 px-0 md:px-12 pb-0 md:pb-8 md:pb-12 flex-1 min-h-0">
        <TriptychSide
          to="/order"
          :image="hero.left.imageSrc"
          :title="hero.left.title"
          :cta="hero.left.cta"
          :active="isActive(0)"
          :progress="progressFor(0)"
          @mouseenter="hoverEnter(0)"
          @mouseleave="hoverLeave(0)"
        />
        <TriptychMain
          :active="isActive(1)"
          :progress="progressFor(1)"
          @mouseenter="hoverEnter(1)"
          @mouseleave="hoverLeave(1)"
        >
          <template #cta>
            <TriptychCtaDesktop :active="isActive(1)">
              <TriptychProgressBar :progress="progressFor(1)" />
            </TriptychCtaDesktop>
            <TriptychCtaMobile />
          </template>
        </TriptychMain>
        <TriptychSide
          to="/#event"
          :image="hero.right.imageSrc"
          :title="hero.right.title"
          :cta="hero.right.cta"
          :active="isActive(2)"
          :progress="progressFor(2)"
          @mouseenter="hoverEnter(2)"
          @mouseleave="hoverLeave(2)"
        />
      </div>
    </div>
  </section>
</template>

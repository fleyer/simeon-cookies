const PANEL_COUNT = 3
const DURATION_MS = 4000

export function useTriptychAutoplay() {
  const activeIndex = ref<number | null>(null)
  const progresses = ref<number[]>(Array(PANEL_COUNT).fill(0))
  const paused = ref(false)
  let reducedMotion = false
  let rafId: number | null = null
  let lastTimestamp: number | null = null

  const tick = (timestamp: number) => {
    if (lastTimestamp === null) lastTimestamp = timestamp
    const delta = timestamp - lastTimestamp
    lastTimestamp = timestamp

    const index = activeIndex.value
    
    if (!paused.value && index !== null) {
      const next = Math.min((progresses.value[index] ?? 0) + delta / DURATION_MS, 1)
      progresses.value[index] = next
      
      if (next >= 1) {
        const nextIndex = (index + 1) % PANEL_COUNT
        if (index === PANEL_COUNT - 1) {
          progresses.value = Array(PANEL_COUNT).fill(0)
        } else {
          progresses.value[nextIndex] = 0
        }
        activeIndex.value = nextIndex
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  const hoverEnter = (index: number) => {
    if (activeIndex.value !== index) {
      if (activeIndex.value !== null) progresses.value[activeIndex.value] = 0
      activeIndex.value = index
      progresses.value[index] = reducedMotion ? 1 : 0
    }
    paused.value = true
  }

  const hoverLeave = (index: number) => {
    if (activeIndex.value === index) paused.value = false
  }

  onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reducedMotion) {
      activeIndex.value = 0
      rafId = requestAnimationFrame(tick)
    }
  })

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return {
    isActive: (index: number) => activeIndex.value === index,
    progressFor: (index: number) => progresses.value[index] ?? 0,
    hoverEnter,
    hoverLeave,
  }
}

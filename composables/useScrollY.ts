export function useScrollY() {
  const scrollY = ref(0)

  const onScroll = () => { scrollY.value = window.scrollY }
  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return scrollY
}

<script setup lang="ts">
useSeoMeta({
  robots: 'noindex',
})

const route = useRoute()

const orderId = route.query.order_id
const key = route.query.key

const orderIdValid = typeof orderId === 'string' && orderId.length > 0
const keyValid = typeof key === 'string' && key.length > 0

if (orderIdValid && keyValid) {
  await navigateTo(
    { path: '/order/confirmation', query: { order: orderId, token: key } },
    { replace: true },
  )
} else {
  await navigateTo(
    { path: '/order/confirmation' },
    { replace: true },
  )
}
</script>

<template>
  <div />
</template>

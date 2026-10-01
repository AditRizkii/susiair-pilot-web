<script setup lang="ts">
import { ArrowLeft, CalendarDays } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
const route = useRoute()
</script>

<template>
  <main class="mobile-page">
    <div class="app-shell placeholder"><NuxtLink to="/schedule" aria-label="Back to schedule"><ArrowLeft :size="20" /></NuxtLink><CalendarDays :size="34" /><p class="eyebrow">{{ route.params.date }}</p><h1 class="page-title">Detail page<br />coming soon.</h1><p class="muted">Duty details will be available here.</p></div>
    <AppBottomNav />
  </main>
</template>

<style scoped lang="scss">
.placeholder { display: grid; min-height: calc(100dvh - 72px); align-content: center; justify-items: start; gap: 14px; > a { position: absolute; top: 26px; color: #0e2138; } > svg { color: #e63758; } .muted { margin: 0; font-size: 14px; } }
</style>

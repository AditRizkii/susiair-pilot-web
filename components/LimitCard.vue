<script setup lang="ts">
defineProps<{ label: string; hours: number; limit: number; period: string }>()
</script>

<template>
  <article class="limit-card">
    <div class="limit-copy"><span>{{ label }}</span><strong>{{ hours.toFixed(1) }} <small>/ {{ limit }} hrs</small></strong></div>
    <div class="progress" :aria-label="`${label}: ${hours.toFixed(1)} of ${limit} hours`"><span :style="{ width: `${Math.min((hours / limit) * 100, 100)}%` }" /></div>
    <small>{{ period }}</small>
  </article>
</template>

<style scoped lang="scss">
.limit-card { min-height: 126px; padding: 16px; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(14, 33, 56, .06); }
.limit-copy { display: grid; gap: 7px; span, > small { color: #6b7280; font-size: 11px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; } strong { font-size: 19px; letter-spacing: -.04em; small { color: #6b7280; font-size: 10px; letter-spacing: 0; } } }
.progress { height: 5px; overflow: hidden; margin: 17px 0 8px; border-radius: 999px; background: #e8ebef; span { display: block; height: 100%; border-radius: inherit; background: #1fbf8f; } }
small { color: #6b7280; font-size: 10px; }
</style>

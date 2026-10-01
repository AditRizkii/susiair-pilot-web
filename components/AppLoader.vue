<template>
  <div class="app-loader" role="status" aria-label="Loading">
    <div class="loader-mark"><img src="/images/susiair-logo.png" width="116" height="30" alt="" /></div>
    <span>Loading operations data…</span>
  </div>
</template>

<style scoped lang="scss">
.app-loader { display: grid; min-height: 180px; place-items: center; align-content: center; gap: 14px; color: #6b7280; font-size: 13px; font-weight: 700; text-align: center; }
.loader-mark { display: grid; width: 68px; height: 68px; place-items: center; border: 3px solid #e8ebef; border-top-color: #e63758; border-radius: 50%; animation: spin 900ms linear infinite; img { width: 54px; height: auto; animation: counter-spin 900ms linear infinite; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes counter-spin { to { transform: rotate(-360deg); } }
@media (prefers-reduced-motion: reduce) { .loader-mark, .loader-mark img { animation: none; } }
</style>

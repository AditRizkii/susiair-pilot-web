<script setup lang="ts">
import type { FlightPoint, FlightSummary, Pilot, PilotDocument } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { request } = useApi()
const ranges = ['1w', '1m', '3m', '6m', '1y'] as const
type Range = typeof ranges[number]
const selectedRange = ref<Range>('1w')
const profile = ref<Pilot>()
const documents = ref<PilotDocument[]>([])
const weekly = ref<FlightSummary>()
const monthly = ref<FlightSummary>()
const annual = ref<FlightSummary>()
const chart = ref<FlightSummary>()
const dailyHours = ref(0)
const isLoading = ref(true)
const errorMessage = ref('')
const chartErrorMessage = ref('')

function todayPoint(summary?: FlightSummary) {
  return summary?.points.find(({ date }) => date === summary.today)?.hours ?? 0
}

const limitCards = computed(() => [
  { label: 'Daily', hours: dailyHours.value, limit: profile.value?.limits.daily ?? 0, period: 'Today' },
  { label: 'Weekly', hours: todayPoint(weekly.value), limit: profile.value?.limits.weekly ?? 0, period: 'Rolling 7 days' },
  { label: 'Monthly', hours: todayPoint(monthly.value), limit: profile.value?.limits.monthly ?? 0, period: 'Rolling 30 days' },
  { label: 'Annual', hours: todayPoint(annual.value), limit: profile.value?.limits.annual ?? 0, period: 'Rolling 365 days' },
])

async function loadHome() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const [pilot, docs, week, month, year] = await Promise.all([
      request<Pilot>('/pilot/me'),
      request<PilotDocument[]>('/documents'),
      request<FlightSummary>('/flight-hours/summary?range=1w'),
      request<FlightSummary>('/flight-hours/summary?range=1m'),
      request<FlightSummary>('/flight-hours/summary?range=1y'),
    ])
    const day = await request<FlightPoint[]>(`/flight-hours?from=${week.today}&to=${week.today}`)
    profile.value = pilot
    documents.value = docs
    dailyHours.value = day.reduce((total, item) => total + item.hours, 0)
    weekly.value = week
    monthly.value = month
    annual.value = year
    chart.value = week
  } catch {
    errorMessage.value = 'We could not load your pilot data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function selectRange(range: Range) {
  selectedRange.value = range
  chartErrorMessage.value = ''
  try {
    chart.value = await request<FlightSummary>(`/flight-hours/summary?range=${range}`)
  } catch {
    chartErrorMessage.value = 'We could not update the chart.'
  }
}

onMounted(loadHome)
function signOut() {
  auth.logout()
  return navigateTo('/')
}
</script>

<template>
  <main class="mobile-page">
    <div class="app-shell">
      <header class="home-header"><div><p class="eyebrow">SUSI AIR · PILOT APP</p><h1 class="page-title">Good morning, {{ profile?.name?.split(' ')[0] ?? 'Pilot' }}.</h1></div><button class="avatar" aria-label="Sign out" @click="signOut"><img v-if="profile" :src="profile.avatarUrl" :alt="profile.name" /></button></header>
      <p v-if="isLoading" class="status">Loading your operations data…</p>
      <p v-else-if="errorMessage" class="status error">{{ errorMessage }} <button @click="loadHome">Try again</button></p>
      <template v-else-if="profile && chart">
        <section class="total-hours"><span>TOTAL FLIGHT HOURS</span><strong>{{ profile.totalFlightHours.toLocaleString('en-US', { minimumFractionDigits: 1 }) }} <small>hrs</small></strong><small>ALL TIME</small></section>
        <section><div class="section-head"><h2>Hours to limit</h2><span>AS OF TODAY</span></div><div class="limit-grid"><LimitCard v-for="card in limitCards" :key="card.label" v-bind="card" /></div></section>
        <section class="chart-card"><div class="section-head"><h2>Flight hours trend</h2><span>{{ chart.windowDays }} DAY WINDOW</span></div><div class="range-control" aria-label="Flight hours range"><button v-for="range in ranges" :key="range" :class="{ active: selectedRange === range }" @click="selectRange(range)">{{ range }}</button></div><p v-if="chartErrorMessage" class="chart-error" role="alert">{{ chartErrorMessage }} <button @click="selectRange(selectedRange)">Try again</button></p><div class="chart-summary"><strong>{{ todayPoint(chart).toFixed(1) }} hrs</strong><span><i /> {{ chart.limit.toLocaleString() }} hrs limit</span></div><ClientOnly><FlightTrendChart :summary="chart" /></ClientOnly></section>
        <section><div class="section-head"><h2>My documents</h2><span>{{ documents.length }} ITEMS</span></div><div class="documents"><article v-for="document in documents" :key="document.id"><div><strong>{{ document.label }}</strong><span>Expires {{ document.expiryDate }}</span></div><b :class="document.status">{{ document.status === 'expired' ? 'Expired' : `${document.daysRemaining} days left` }}</b></article></div></section>
      </template>
    </div>
    <AppBottomNav />
  </main>
</template>

<style scoped lang="scss">
.home-header { display: flex; align-items: start; justify-content: space-between; margin-bottom: 24px; }
.avatar { display: grid; width: 44px; height: 44px; place-items: center; overflow: hidden; border: 0; border-radius: 50%; background: #dce4ec; img { width: 100%; height: 100%; } }
.status { padding: 18px; border-radius: 12px; background: #fff; color: #6b7280; font-size: 14px; &.error { color: #e63758; button { margin-left: 5px; border: 0; background: transparent; color: inherit; font-weight: 800; text-decoration: underline; } } }
.total-hours { display: grid; gap: 4px; margin-bottom: 28px; padding: 20px; border-radius: 14px; background: #0e2138; color: #fff; > span, > small { color: #b6c0cd; font-size: 10px; font-weight: 800; letter-spacing: .07em; } strong { font-size: 30px; letter-spacing: -.05em; small { font-size: 13px; } } }
section { margin-top: 28px; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; h2 { margin: 0; font-size: 17px; letter-spacing: -.03em; } span { color: #6b7280; font-size: 10px; font-weight: 800; letter-spacing: .05em; } }
.limit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.chart-card { padding: 16px; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(14, 33, 56, .06); }
.range-control { display: flex; padding: 3px; border-radius: 10px; background: #f0f2f5; button { flex: 1; min-height: 32px; border: 0; border-radius: 8px; background: transparent; color: #6b7280; font-size: 11px; font-weight: 800; &.active { background: #fff; color: #0e2138; box-shadow: 0 1px 3px rgba(14, 33, 56, .12); } } }
.chart-summary { display: flex; align-items: center; justify-content: space-between; margin-top: 18px; strong { font-size: 18px; } span { color: #6b7280; font-size: 11px; } i { display: inline-block; width: 14px; border-top: 2px dashed #e63758; vertical-align: middle; } }
.chart-error { margin: 12px 0 0; color: #c72746; font-size: 12px; button { border: 0; background: transparent; color: inherit; font-weight: 800; text-decoration: underline; } }
.documents { display: grid; overflow: hidden; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(14, 33, 56, .06); article { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 16px; border-bottom: 1px solid #edf0f2; &:last-child { border-bottom: 0; } strong, span { display: block; } strong { font-size: 13px; } span { margin-top: 4px; color: #6b7280; font-size: 11px; } b { flex: none; border-radius: 999px; padding: 5px 8px; font-size: 10px; &.safe { background: #e7f8f1; color: #168363; } &.soon { background: #fff2db; color: #aa6b00; } &.expired { background: #ffe7ec; color: #c72746; } } } }
</style>

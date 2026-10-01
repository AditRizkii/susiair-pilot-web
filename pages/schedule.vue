<script setup lang="ts">
import { ChevronLeft, ChevronRight, Check } from 'lucide-vue-next'
import type { Pilot, ScheduleEntry, ScheduleResponse } from '~/types/api'

definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const view = ref<{ year: number; month: number }>()
const schedule = ref<ScheduleResponse>()
const isLoading = ref(true)
const errorMessage = ref('')

const title = computed(() => view.value && new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(view.value.year, view.value.month - 1, 1))))
const daysInMonth = computed(() => view.value ? new Date(Date.UTC(view.value.year, view.value.month, 0)).getUTCDate() : 0)
const firstDay = computed(() => view.value ? new Date(Date.UTC(view.value.year, view.value.month - 1, 1)).getUTCDay() : 0)
const duties = computed(() => new Map(schedule.value?.schedules.map((item) => [item.duty_date, item]) ?? []))
const weeks = computed(() => {
  const start = 1 - firstDay.value
  const cells = Array.from({ length: Math.ceil((firstDay.value + daysInMonth.value) / 7) * 7 }, (_, index) => start + index)
  return cells.map((day) => {
    const current = day >= 1 && day <= daysInMonth.value
    const date = current && view.value ? `${view.value.year}-${String(view.value.month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
    return { day, current, date, duty: duties.value.get(date) }
  })
})

async function loadSchedule() {
  if (!view.value) return
  isLoading.value = true
  errorMessage.value = ''
  try {
    schedule.value = await request<ScheduleResponse>(`/schedules?year=${view.value.year}&month=${view.value.month}`)
  } catch {
    errorMessage.value = 'We could not load this schedule.'
  } finally {
    isLoading.value = false
  }
}

function changeMonth(delta: number) {
  if (!view.value) return
  const next = new Date(Date.UTC(view.value.year, view.value.month - 1 + delta, 1))
  view.value = { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 }
  void loadSchedule()
}

function remaining(duty: ScheduleEntry) {
  return Math.max(duty.count_schedules - duty.count_logbooks, 0)
}

function openDate(date: string) {
  if (date) return navigateTo(`/schedule/${date}`)
}

onMounted(async () => {
  try {
    const { today } = await request<Pilot>('/pilot/me')
    const [year, month] = today.split('-').map(Number)
    view.value = { year, month }
    await loadSchedule()
  } catch {
    errorMessage.value = 'We could not load this schedule.'
    isLoading.value = false
  }
})
</script>

<template>
  <main class="mobile-page">
    <div class="app-shell">
      <header><p class="eyebrow">CREW OPERATIONS</p><h1 class="page-title">Schedule</h1><p class="muted">Your duties and availability.</p></header>
      <section class="month-panel">
        <div><p class="eyebrow">MONTHLY VIEW</p><h2>{{ title }}</h2></div>
        <div class="month-actions"><button aria-label="Previous month" @click="changeMonth(-1)"><ChevronLeft :size="19" /></button><button aria-label="Next month" @click="changeMonth(1)"><ChevronRight :size="19" /></button></div>
      </section>
      <AppLoader v-if="isLoading" />
      <p v-else-if="errorMessage" class="status error">{{ errorMessage }} <button @click="loadSchedule">Try again</button></p>
      <template v-else-if="schedule">
        <section class="calendar" aria-label="Monthly schedule">
          <div class="weekdays"><span v-for="(day, index) in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="index">{{ day }}</span></div>
          <button v-for="cell in weeks" :key="cell.current ? cell.date : `blank-${cell.day}`" class="calendar-day" :class="{ outside: !cell.current, today: cell.date === schedule.today, duty: cell.duty }" :style="cell.duty ? { backgroundColor: cell.duty.base_color } : undefined" :disabled="!cell.current" :aria-label="cell.duty ? `${cell.date}, ${cell.duty.duty_type}, ${cell.duty.base_name}` : cell.date" @click="openDate(cell.date)">
            <span>{{ cell.current ? cell.day : '' }}</span>
            <template v-if="cell.duty"><small>{{ cell.duty.base_name }}</small><b v-if="cell.duty.count_logbooks === cell.duty.count_schedules"><Check :size="11" /></b><b v-else>{{ remaining(cell.duty) }}</b></template>
          </button>
        </section>
        <p class="calendar-note"><i /> Today · Select a date to view its duty</p>
        <section class="legend"><div class="section-head"><h2>Duty key</h2></div><div class="legend-grid"><span v-for="item in schedule.legend" :key="item.code"><i :style="{ backgroundColor: item.color }" />{{ item.label }}</span></div></section>
      </template>
    </div>
    <AppBottomNav />
  </main>
</template>

<style scoped lang="scss">
header { margin-bottom: 28px; .muted { margin: 8px 0 0; font-size: 14px; } }
.month-panel { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; h2 { margin: 0; font-size: 20px; letter-spacing: -.035em; } .eyebrow { margin-bottom: 4px; } }
.month-actions { display: flex; gap: 8px; button { display: grid; width: 36px; height: 36px; place-items: center; border: 1px solid #e1e6eb; border-radius: 10px; background: #fff; color: #0e2138; } }
.status { padding: 18px; border-radius: 12px; background: #fff; color: #6b7280; font-size: 14px; &.error { color: #e63758; button { border: 0; background: transparent; color: inherit; font-weight: 800; text-decoration: underline; } } }
.calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; padding: 12px; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(14, 33, 56, .06); }
.weekdays { display: contents; span { padding-bottom: 6px; color: #6b7280; font-size: 10px; font-weight: 800; text-align: center; } }
.calendar-day { position: relative; display: flex; min-height: 54px; flex-direction: column; align-items: start; justify-content: space-between; padding: 6px; border: 0; border-radius: 8px; background: #f5f6f8; color: #0e2138; font-size: 11px; font-weight: 700; &.outside { visibility: hidden; } &.today:not(.duty) { outline: 2px solid #e63758; outline-offset: -2px; } &.duty { color: #fff; small { font-size: 9px; font-weight: 800; } b { position: absolute; right: 5px; bottom: 5px; display: grid; min-width: 15px; min-height: 15px; place-items: center; border-radius: 50%; background: rgba(14, 33, 56, .74); color: #fff; font-size: 9px; } } }
.calendar-note { display: flex; align-items: center; gap: 6px; margin: 12px 0 28px; color: #6b7280; font-size: 11px; i { width: 8px; height: 8px; border: 2px solid #e63758; border-radius: 50%; } }
.section-head h2 { margin: 0 0 12px; font-size: 17px; letter-spacing: -.03em; }
.legend-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 6px; padding: 15px; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(14, 33, 56, .06); span { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; } i { width: 9px; height: 9px; border-radius: 50%; } }
</style>

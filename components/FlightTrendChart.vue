<script setup lang="ts">
import type { FlightSummary } from '~/types/api'

const props = defineProps<{ summary: FlightSummary }>()
const canvas = ref<HTMLCanvasElement>()
let chart: { destroy: () => void } | undefined

const dateLabel = (date: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))

async function draw() {
  if (!canvas.value) return
  chart?.destroy()
  const { default: Chart } = await import('chart.js/auto')
  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: props.summary.points.map(({ date }) => dateLabel(date)),
      datasets: [
        { label: 'Rolling total', data: props.summary.points.map(({ hours }) => hours), borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, .1)', pointRadius: 2, pointHoverRadius: 4, tension: .35, fill: true },
        { label: 'Limit', data: props.summary.points.map(() => props.summary.limit), borderColor: '#E63758', borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
        { label: 'Today', data: props.summary.points.map(({ date, hours }) => date === props.summary.today ? hours : null), borderColor: '#0E2138', backgroundColor: '#0E2138', pointRadius: 5, pointHoverRadius: 6, showLine: false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        y: { beginAtZero: true, max: props.summary.max, ticks: { stepSize: Math.ceil(props.summary.max / 4), color: '#6B7280', font: { size: 10 } }, grid: { color: '#E8EBEF' }, border: { display: false } },
        x: { ticks: { color: '#6B7280', font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 5, callback: (_value: unknown, index: number) => props.summary.points[index]?.date === props.summary.today ? 'Today' : dateLabel(props.summary.points[index]?.date ?? '') }, grid: { display: false }, border: { display: false } },
      },
    },
  })
}

onMounted(draw)
watch(() => props.summary, draw, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template><div class="chart"><canvas ref="canvas" /></div></template>

<style scoped lang="scss">
.chart { height: 220px; }
</style>

<script setup lang="ts">
import { BookOpen, CalendarDays, House, MoreHorizontal } from 'lucide-vue-next'

const route = useRoute()
const items = [
  { label: 'Home', to: '/home', icon: House },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Logbook', to: '/logbook', icon: BookOpen },
  { label: 'More', to: '/more', icon: MoreHorizontal },
]
</script>

<template>
  <nav class="bottom-nav" aria-label="Main navigation">
    <NuxtLink v-for="item in items" :key="item.label" :to="item.to" :class="{ active: route.path === item.to }">
      <component :is="item.icon" :size="20" aria-hidden="true" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

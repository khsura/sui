<template>
  <div class="s_calendar">
    <SCalendarMonthly
      v-if="type === 'month'"
      v-model="focus"
      :events="events"
      :event-color="eventColor"
      @change="$emit('change', $event)"
      @click:date="$emit('click:date', $event)"
      @click:event="$emit('click:event', $event)"
    ></SCalendarMonthly>
  </div>
</template>
<script setup lang="ts">
import { propsCalendar } from '@sui/app/props'
import { useCalendarService } from '@sui/app/services'
import { type CalendarDate, type CalendarEvent } from '@sui/app/types'
import SCalendarMonthly from './sCalendarMonthly.vue'

const props = defineProps(propsCalendar())

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: { start: CalendarDate; end: CalendarDate }): void
  (event: 'click:event', value: { date: CalendarDate; event: CalendarEvent }): void
  (event: 'click:date', value: { date: CalendarDate; events: CalendarEvent[] }): void
}>()

const { focus, next, prev, title } = useCalendarService(props, emit)

defineExpose({
  next,
  prev,
  title,
})
</script>

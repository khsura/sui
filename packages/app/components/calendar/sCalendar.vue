<template>
  <div class="s_calendar">
    <SCalendarMonthly
      v-if="type === 'month'"
      v-bind="monthlyProps"
      @change="$emit('change', $event)"
      @click:date="onClickDate"
      @click:event="$emit('click:event', $event)"
    >
      <template v-if="$slots.event" #event="{ event }">
        <slot name="event" :event="event">
          <div v-html="event?.isStartDate || event?.isWeekStart ? event.name : '&nbsp;'"></div>
        </slot>
      </template>
    </SCalendarMonthly>
    <SCalendarWeekly
      v-else-if="type === 'week'"
      v-bind="weeklyProps"
      @change="$emit('change', $event)"
      @click:date="onClickDate"
      @click:event="$emit('click:event', $event)"
      @click:time="$emit('click:time', $event)"
    ></SCalendarWeekly>
  </div>
</template>
<script setup lang="ts" generic="T extends CalendarEvent = CalendarEvent">
import { computed } from 'vue'
import SCalendarMonthly from './sCalendarMonthly.vue'
import SCalendarWeekly from './sCalendarWeekly.vue'
import { datePickerModelFormats } from '@/app/configs'
import type { PropsCalendar } from '@/app/definitions'
import { getCalendarDate } from '@/app/repositories'
import { useComponentDefaultsService, useCalendarService } from '@/app/services'
import type { CalendarDate, CalendarEmitEvents, CalendarEvent } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

const rawProps = withDefaults(defineProps<PropsCalendar<T>>(), {
  type: 'month',
})

const props = useComponentDefaultsService('SCalendar', rawProps)
const emit = defineEmits<CalendarEmitEvents<T>>()

const focus = defineModel<string>('focus', {
  get: (value) => {
    return dayjs(value).isValid() ? value : dayjs().format(datePickerModelFormats.date)
  },
  set: (value) => {
    const date = dayjs(value || undefined)
    const startDate = props.type === 'week' ? date.startOf('week') : date.startOf('month')
    const endDate = props.type === 'week' ? date.endOf('week') : date.endOf('month')
    const start = getCalendarDate(startDate)
    const end = getCalendarDate(endDate)

    emit('change', { start, end })

    return value
  },
})

const baseProps = computed(() => ({
  events: props.events,
  color: props.color,
  eventColor: props.eventColor,
  tag: props.tag,
}))

const monthlyProps = computed(() => ({
  ...baseProps.value,
  type: 'month' as const,
  focus: focus.value,
}))

const weeklyProps = computed(() => ({
  ...baseProps.value,
  type: 'week' as const,
  focus: focus.value,
  minWeeks: props.minWeeks,
  showWeek: props.showWeek,
  longWeekdays: props.longWeekdays,
  showMonthOnFirst: props.showMonthOnFirst,
  shortMonths: props.shortMonths,
  hideHeader: props.hideHeader,
  eventOverlapMode: props.eventOverlapMode,
  allDayRows: props.allDayRows,
}))

const onClickDate = (value: { date: CalendarDate; events: T[] }) => {
  focus.value = value.date.date
  emit('click:date', value)
}

const { next, prev, title } = useCalendarService(props, focus)

defineExpose({
  next,
  prev,
  title,
})
</script>

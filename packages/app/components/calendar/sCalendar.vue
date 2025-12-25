<template>
  <div class="s_calendar">
    <SCalendarMonthly
      v-if="type === 'month'"
      :type="type"
      :focus="focus"
      :events="events"
      :event-color="eventColor"
      @change="$emit('change', $event)"
      @click:date="$emit('click:date', $event)"
      @click:event="$emit('click:event', $event)"
    ></SCalendarMonthly>
  </div>
</template>
<script setup lang="ts">
import SCalendarMonthly from './sCalendarMonthly.vue'
import { datePickerModelFormats } from '@/app/configs'
import type { PropsCalendar } from '@/app/definitions'
import { getCalendarDate } from '@/app/repositories'
import { useCalendarService } from '@/app/services'
import { type CalendarEmitEvents } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

const props = defineProps<PropsCalendar>()
const emit = defineEmits<CalendarEmitEvents>()

const focus = defineModel<string>('focus', {
  get: (value) => {
    return dayjs(value).isValid() ? value : dayjs().format(datePickerModelFormats.date)
  },
  set: (value) => {
    const start = getCalendarDate(dayjs(value || undefined).startOf('month'))
    const end = getCalendarDate(dayjs(value || undefined).endOf('month'))

    emit('change', { start, end })

    return value
  },
})

const { next, prev, title } = useCalendarService(props, focus)

defineExpose({
  next,
  prev,
  title,
})
</script>

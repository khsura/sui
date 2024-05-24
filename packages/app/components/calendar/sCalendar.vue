<template>
  <div class="s_calendar">
    <SCalendarMonthly
      v-if="type === 'month'"
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
import { datePickerModelFormats } from '@sui/app/configs'
import { propsCalendar } from '@sui/app/props'
import { getCalendarDate } from '@sui/app/repositories'
import { useCalendarService } from '@sui/app/services'
import { type CalendarEmitEvents } from '@sui/app/types'
import dayjs from '@sui/app/vendors/dayjs'
import SCalendarMonthly from './sCalendarMonthly.vue'

const props = defineProps(propsCalendar())
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

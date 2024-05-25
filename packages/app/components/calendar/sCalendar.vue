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
import { datePickerModelFormats } from '@khsura/sui/configs'
import { propsCalendar } from '@khsura/sui/props'
import { getCalendarDate } from '@khsura/sui/repositories'
import { useCalendarService } from '@khsura/sui/services'
import { type CalendarEmitEvents } from '@khsura/sui/types'
import dayjs from '@khsura/sui/vendors/dayjs'
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

<template>
  <div class="s_calendarMonthly">
    <div v-for="(day, id) in days" :key="id" class="s_calendarMonthly__day">{{ day }}</div>
    <div
      v-for="(date, id) in dates"
      :key="id"
      class="s_calendarMonthly__item"
      :class="{
        's_calendarMonthly__item--disabled': !date.isThisMonth,
      }"
    >
      <div class="s_calendarMonthly__grid"></div>
      <div class="s_calendarMonthly__date">
        <slot name="date" :date="date">
          <SButton
            text
            variant="fab"
            size="small"
            :elevation="0"
            :disabled="!date.isThisMonth"
            :class="{
              s_calendarMonthly__dateButton: true,
              's_calendarMonthly__dateButton--today': date.isToday,
              ...dateButtonClasses(date),
            }"
            :style="{
              ...dateButtonStyles(date),
            }"
            @click="onClickDate(getEvents(date))"
          >
            {{ date.value }}
          </SButton>
        </slot>
      </div>
      <div class="s_calendarMonthly__events">
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-for="(event, idSecond) in date.events"
          :key="`${id}-${idSecond}`"
          class="s_calendarMonthly__event"
          :class="{
            's_calendarMonthly__event--start': event?.isStartDate,
            's_calendarMonthly__event--weekStart': event?.isWeekStart,
            's_calendarMonthly__event--weekEnd': event?.isWeekEnd,
            ...event?.class,
          }"
          :style="{ ...event?.style }"
          @click="event ? onClickEvent(getEvent(date, event)) : undefined"
        >
          <slot name="event" :event="event">
            <div v-html="event?.isStartDate || event?.isWeekStart ? event.name : '&nbsp;'"></div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" generic="T extends CalendarEvent">
import SButton from '@/app/components/sButton.vue'
import type { PropsCalendarMonthly } from '@/app/definitions'
import { useCalendarMonthlyService, useColorService, useCalendarEventHandlers } from '@/app/services'
import type { CalendarEmitEvents, CalendarEvent, CalendarEventExtended } from '@/app/types'

const props = defineProps<PropsCalendarMonthly<T>>()
const emit = defineEmits<CalendarEmitEvents<T>>()
const { dates, days, eventPadding } = useCalendarMonthlyService(props)
const { classListColor, styleListColor } = useColorService(props)

const {
  getEvents: getEventsHandler,
  getEvent: getEventHandler,
  onClickEvent,
  onClickDate,
} = useCalendarEventHandlers(emit)

const getEvents = (date: (typeof dates.value)[0]) => {
  return getEventsHandler(date.date, date.events)
}

const getEvent = (date: (typeof dates.value)[0], event: CalendarEventExtended<T>) => {
  return getEventHandler(date.date, event)
}

const dateButtonClasses = (date: (typeof dates.value)[0]) => {
  if (props.focus === date.date.date) {
    return {
      's_calendarMonthly__dateButton--selected': true,
      ...classListColor.value,
    }
  }

  return {}
}

const dateButtonStyles = (date: (typeof dates.value)[0]) => {
  if (props.focus === date.date.date) {
    return {
      ...styleListColor.value,
    }
  }
}
</script>
<style lang="scss">
.s_calendarMonthly {
  @include s_typography('caption');
  position: relative;
  display: flex;
  flex-wrap: wrap;
  background-color: s_getAppColor('card');
  border-right: thin solid s_getAppColor('border');

  &__day,
  &__item {
    flex: 0 0 calc(100% / 7);
    max-width: calc(100% / 7);
  }

  &__day {
    @include s_typography('caption');
    text-align: center;
    border-top: thin solid s_getAppColor('border');
    border-bottom: thin solid s_getAppColor('border');
    border-left: thin solid s_getAppColor('border');

    &:last-of-type {
      border-right: thin solid s_getAppColor('border');
    }
  }

  &__date {
    padding: 4px;
    text-align: center;
  }

  &__dateButton {
    padding: 16px;

    &--today {
      font-weight: 700;
      background-color: transparent;
      border: 1px solid s_getAppColor('border');
    }
  }

  &__item {
    position: relative;

    &--disabled {
      background-color: s_getAppColor('background');
    }
  }

  &__events {
    position: relative;
  }

  &__grid {
    position: absolute;
    width: 100%;
    height: 100%;
    border-bottom: thin solid s_getAppColor('border');
    border-left: thin solid s_getAppColor('border');
  }

  &__event {
    position: relative;
    padding: 0 8px;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ffffff;
    white-space: nowrap;
    cursor: pointer;

    &--start {
      z-index: 1;
      margin-left: v-bind(eventPadding);
      border-radius: $s_spacer;
    }

    &--weekStart {
      z-index: 1;
      border-top-right-radius: $s_spacer;
      border-bottom-right-radius: $s_spacer;
    }

    &--weekEnd {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>

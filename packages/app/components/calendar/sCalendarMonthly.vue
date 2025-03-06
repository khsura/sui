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
        <SButton
          text
          variant="fab"
          size="small"
          elevation="0"
          :disabled="!date.isThisMonth"
          :class="{
            s_calendarMonthly__dateButton: true,
            's_calendarMonthly__dateButton--today': date.isToday,
          }"
          @click="onClickDate(getEvents(date))"
        >
          {{ date.value }}
        </SButton>
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
            <div v-html="event?.isStartDate || event?.isWeekStart ? event.title : '&nbsp;'"></div>
          </slot>
        </div>
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SButton from '@khsura/sui/components/sButton.vue'
import { propsCalendar } from '@khsura/sui/props'
import { useCalendarMonthlyService } from '@khsura/sui/services'
import { type CalendarDate, type CalendarEvent } from '@khsura/sui/types'

const props = defineProps(propsCalendar())

const emit = defineEmits<{
  (event: 'change', value: { start: CalendarDate; end: CalendarDate }): void
  (event: 'click:event', value: { date: CalendarDate; event: CalendarEvent }): void
  (event: 'click:date', value: { date: CalendarDate; events: CalendarEvent[] }): void
}>()

const { dates, days, eventPadding } = useCalendarMonthlyService(props)

const getEvents = (date: (typeof dates.value)[0]) => {
  return {
    date: date.date,
    events: date.events.filter((event) => event) as CalendarEvent[],
  }
}

const getEvent = (date: (typeof dates.value)[0], event: CalendarEvent) => {
  return {
    date: date.date,
    event,
  }
}

const onClickEvent = (value: { date: CalendarDate; event: CalendarEvent }) => {
  emit('click:event', value)
}

const onClickDate = (value: { date: CalendarDate; events: CalendarEvent[] }) => {
  emit('click:date', value)
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

    &Button {
      padding: 16px;

      &--today {
        font-weight: 700;
      }
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

    &:hover {
      opacity: 0.8;
    }

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
  }
}
</style>

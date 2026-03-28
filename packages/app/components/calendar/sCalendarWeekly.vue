<template>
  <div class="s_calendarWeekly">
    <div v-if="!hideHeader" class="s_calendarWeekly__head" role="row">
      <div class="s_calendarWeekly__headTime"></div>
      <div v-if="showWeek" class="s_calendarWeekly__headWeeknumber">
        <div class="s_calendarWeekly__headWeeknumberValue">
          <small v-if="weeks.length > 0">{{ weeks[0].weekNumber }}</small>
        </div>
        <div class="s_calendarWeekly__headWeeknumberDate"></div>
      </div>
      <div
        v-for="(day, index) in todayWeek"
        :key="day.date"
        class="s_calendarWeekly__headWeekday"
        :class="{
          's_calendarWeekly__headWeekday--past': day.past,
          's_calendarWeekly__headWeekday--outside': isOutside(days[index]),
        }"
      >
        <div class="s_calendarWeekly__headWeekdayName">{{ weekdayFormatter(day, longWeekdays) }}</div>
        <div class="s_calendarWeekly__headWeekdayDate">
          <slot name="day-label" :day="days[index]">
            <SButton
              v-if="days[index]"
              text
              variant="fab"
              size="small"
              :elevation="0"
              :class="{
                s_calendarWeekly__dayButton: true,
                's_calendarWeekly__dayButton--active': focus === days[index]?.date.date,
                ...(days[index] ? dateButtonClasses(days[index]) : {}),
              }"
              :style="{
                ...(days[index] ? dateButtonStyles(days[index]) : {}),
              }"
              @click.stop="days[index] ? onClickDate(getEvents(days[index])) : undefined"
            >
              {{ days[index] ? getDayLabel(days[index]) : '' }}
            </SButton>
          </slot>
        </div>
      </div>
    </div>
    <div v-for="week in weeks" :key="week.weekNumber">
      <div
        v-if="hasAllDayEvents(week)"
        class="s_calendarWeekly__allDayRow"
        role="row"
        :style="{ minHeight: `${getAllDayRowHeight(week)}px` }"
      >
        <div class="s_calendarWeekly__allDayTime">
          <div class="s_calendarWeekly__allDayLabel">All day</div>
          <SButton
            v-if="hasMoreAllDayEventsInWeek(week)"
            variant="icon"
            size="small"
            class="s_calendarWeekly__allDayMoreButton"
            @click.stop="toggleAllDayEventsForWeek(week)"
          >
            <SIcon :icon="isAllDayExpandedForWeek(week) ? 'mdi-chevron-up' : 'mdi-chevron-down'"></SIcon>
          </SButton>
        </div>
        <div v-if="showWeek" class="s_calendarWeekly__allDayWeeknumber"></div>
        <div
          v-for="day in week.days"
          :key="`allday-${day.date.date}`"
          class="s_calendarWeekly__allDayColumn"
          :class="{
            's_calendarWeekly__allDayColumn--outside': day.isOutside,
          }"
        >
          <div class="s_calendarWeekly__allDayEvents">
            <div
              v-for="event in getAllDayEventsToDisplay(day, week)"
              :key="`${day.date.date}-allday-${day.allDayEvents.indexOf(event)}`"
              class="s_calendarWeekly__allDayEvent"
              :class="{
                's_calendarWeekly__allDayEvent--start': event.isStartDate,
                's_calendarWeekly__allDayEvent--weekStart': event.isWeekStart,
                's_calendarWeekly__allDayEvent--weekEnd': event.isWeekEnd,
                ...event.class,
              }"
              :style="{
                ...event.style,
                top: `${getAllDayEventRow(day, day.allDayEvents.indexOf(event), week) * 24}px`,
              }"
              @click.stop="event ? onClickEvent(getEvent(day, event)) : undefined"
            >
              <slot name="event" :event="event" :day="day">
                <div v-if="event.isStartDate || event.isWeekStart">{{ event.name }}</div>
                <div v-else>&nbsp;</div>
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div class="s_calendarWeekly__week" role="row">
        <div class="s_calendarWeekly__timeColumn">
          <div v-for="hour in timeSlots" :key="hour" class="s_calendarWeekly__timeSlot">
            <div class="s_calendarWeekly__timeSlotLabel" v-if="hour !== '00:00' && hour !== '24:00'">{{ hour }}</div>
          </div>
        </div>
        <div v-if="showWeek" class="s_calendarWeekly__weeknumber"></div>
        <div
          v-for="day in week.days"
          :key="day.date.date"
          class="s_calendarWeekly__day"
          :class="{
            's_calendarWeekly__day--outside': day.isOutside,
            's_calendarWeekly__day--today': day.isToday,
            's_calendarWeekly__day--past': day.date.past,
            's_calendarWeekly__day--present': day.date.present,
            's_calendarWeekly__day--future': day.date.future,
          }"
          role="cell"
        >
          <div class="s_calendarWeekly__events" @click="(e) => onClickDayArea(e, day)">
            <div
              v-for="(event, eventIndex) in day.events"
              :key="`${day.date.date}-${eventIndex}`"
              class="s_calendarWeekly__event"
              :class="{
                's_calendarWeekly__event--start': event.isStartDate,
                's_calendarWeekly__event--weekStart': event.isWeekStart,
                's_calendarWeekly__event--weekEnd': event.isWeekEnd,
                ...event.class,
              }"
              :style="{
                ...event.style,
                ...getEventPosition(event, day, eventIndex),
              }"
              @click.stop="event ? onClickEvent(getEvent(day, event)) : undefined"
            >
              <slot name="event" :event="event" :day="day">
                <div v-if="event.isStartDate || event.isWeekStart">{{ event.name }}</div>
                <div v-else>&nbsp;</div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" generic="T extends CalendarEvent">
import { ref } from 'vue'
import SButton from '@/app/components/sButton.vue'
import SIcon from '@/app/components/sIcon.vue'
import type { PropsCalendarWeekly } from '@/app/definitions'
import {
  useCalendarWeeklyService,
  useColorService,
  useCalendarEventHandlers,
  useCalendarDateFormatters,
  useCalendarWeeklyEventPositioning,
  useCalendarWeeklyAllDayEvents,
} from '@/app/services'
import type { CalendarEmitEvents, CalendarEvent, CalendarEventExtended } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'
import { getCalendarDate } from '@/app/repositories'

const props = withDefaults(defineProps<PropsCalendarWeekly<T>>(), {
  shortWeekdays: true,
  showMonthOnFirst: true,
  shortMonths: true,
  hideHeader: false,
  showWeek: false,
  minWeeks: 1,
  eventOverlapMode: 'column',
  allDayRows: 7,
})

const emit = defineEmits<CalendarEmitEvents<T>>()
const { todayWeek, days, weeks } = useCalendarWeeklyService(props)
const { classListColor, styleListColor } = useColorService(props)

const {
  getEvents: getEventsHandler,
  getEvent: getEventHandler,
  onClickEvent,
  onClickDate,
} = useCalendarEventHandlers(emit)

const { weekdayFormatter: weekdayFormatterUtil, getDayLabel: getDayLabelUtil } = useCalendarDateFormatters()
const { getAllDayEventRow, getEventPosition } = useCalendarWeeklyEventPositioning(props)

const {
  getAllDayEventsToDisplay: getAllDayEventsToDisplayUtil,
  hasMoreAllDayEvents: hasMoreAllDayEventsUtil,
  getAllDayRowHeight: getAllDayRowHeightUtil,
} = useCalendarWeeklyAllDayEvents(props, getAllDayEventRow)

const expandedAllDayDays = ref<Set<string>>(new Set())

const toggleAllDayEventsForWeek = (week: (typeof weeks.value)[0]) => {
  const isExpanded = isAllDayExpandedForWeek(week)

  for (const day of week.days) {
    if (isExpanded) {
      expandedAllDayDays.value.delete(day.date.date)
    } else {
      expandedAllDayDays.value.add(day.date.date)
    }
  }
}

const isAllDayExpandedForWeek = (week: (typeof weeks.value)[0]) => {
  // Check if all days with events are expanded
  const daysWithEvents = week.days.filter((day) => day.allDayEvents.length > 0)

  if (daysWithEvents.length === 0) {
    return false
  }

  return daysWithEvents.every((day) => expandedAllDayDays.value.has(day.date.date))
}

const hasMoreAllDayEventsInWeek = (week: (typeof weeks.value)[0]) => {
  return week.days.some((day) => hasMoreAllDayEvents(day, week))
}

const isAllDayExpanded = (dayDate: string) => {
  return expandedAllDayDays.value.has(dayDate)
}

const weekdayFormatter = (day: (typeof todayWeek.value)[0], longWeekdays: boolean) => {
  return weekdayFormatterUtil(day, longWeekdays)
}

const getDayLabel = (day: (typeof days.value)[0]) => {
  return getDayLabelUtil(day.date, props.showMonthOnFirst, props.shortMonths)
}

const isOutside = (day: (typeof days.value)[0] | undefined) => {
  return day?.isOutside ?? false
}

const getEvents = (day: (typeof days.value)[0]) => {
  return getEventsHandler(
    day.date,
    [...day.allDayEvents, ...day.events].filter((event) => event),
  )
}

const getEvent = (day: (typeof days.value)[0], event: CalendarEventExtended<T>) => {
  return getEventHandler(day.date, event)
}

const hasMoreAllDayEvents = (day: (typeof days.value)[0], week: (typeof weeks.value)[0]) => {
  return hasMoreAllDayEventsUtil(day, week)
}

const getAllDayEventsToDisplay = (
  day: (typeof days.value)[0],
  week: (typeof weeks.value)[0],
): CalendarEventExtended<T>[] => {
  return getAllDayEventsToDisplayUtil<T>(day, week, isAllDayExpanded)
}

const onClickDayArea = (event: MouseEvent, day: (typeof days.value)[0]) => {
  // Check if click was on an event (event click handlers use @click.stop)
  const target = event.target as HTMLElement

  if (target.closest('.s_calendarWeekly__event')) {
    // Event click will be handled by the event's click handler
    return
  }

  // Calculate time based on click position
  const eventsContainer = event.currentTarget as HTMLElement
  const rect = eventsContainer.getBoundingClientRect()
  const clickY = event.clientY - rect.top
  const pixelsPerHour = 60
  const totalPixels = Math.max(0, Math.min(clickY, 1440))
  const hour = Math.floor(totalPixels / pixelsPerHour)
  const minute = Math.floor((totalPixels % pixelsPerHour) / 10) * 10
  // Create date with clicked time
  const targetDate = dayjs(day.date.date).hour(hour).minute(minute).second(0).millisecond(0)
  const calendarDate = getCalendarDate(targetDate)

  emit('click:time', {
    date: calendarDate,
    events: [],
  })
}

const isSelected = (day: (typeof days.value)[0]) => props.focus === day.date.date

const dateButtonClasses = (day: (typeof days.value)[0]) => {
  return isSelected(day)
    ? {
        's_calendarWeekly__dayButton--selected': true,
        ...classListColor.value,
      }
    : {}
}

const dateButtonStyles = (day: (typeof days.value)[0]) => {
  return isSelected(day) ? styleListColor.value : {}
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`
})

const hasAllDayEvents = (week: (typeof weeks.value)[0]) => {
  return week.days.some((day) => day.allDayEvents.length > 0)
}

const getAllDayRowHeight = (week: (typeof weeks.value)[0]) => {
  return getAllDayRowHeightUtil(week, isAllDayExpanded)
}
</script>
<style lang="scss">
$calendarWeekly__timeColumnWidth: 60px;

.s_calendarWeekly {
  @include s_typography('caption');
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: s_getAppColor('card');
  border-top: thin solid s_getAppColor('border');
  border-left: thin solid s_getAppColor('border');

  &__head {
    display: flex;
    flex-shrink: 0;
    user-select: none;
  }

  &__headTime {
    flex: 0 0 $calendarWeekly__timeColumnWidth;
    border-right: thin solid s_getAppColor('border');
  }

  &__headWeekday {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    user-select: none;
    border-right: thin solid s_getAppColor('border');

    &--past {
      color: s_getAppColor('text', 0.6);
    }

    &--outside {
      color: s_getAppColor('text', 0.6);
      background-color: s_getAppColor('background');
    }
  }

  &__headWeekdayName {
    padding: 4px;
    text-overflow: ellipsis;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
  }

  &__headWeekdayDate {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 4px;
  }

  &__headWeeknumber {
    position: relative;
    display: flex;
    flex: 0 0 24px;
    flex-direction: column;
    background-color: s_getAppColor('card');
    border-right: thin solid s_getAppColor('border');
    border-bottom: thin solid s_getAppColor('border');
  }

  &__headWeeknumberValue {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-bottom: thin solid s_getAppColor('border');

    > small {
      font-size: 11px;
    }
  }

  &__headWeeknumberDate {
    flex: 1;
    min-height: 40px;
  }

  &__allDayRow {
    display: flex;
    flex-shrink: 0;
    border-bottom: thin solid s_getAppColor('border');
  }

  &__allDayTime {
    display: flex;
    flex: 0 0 $calendarWeekly__timeColumnWidth;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 4px;
    background-color: s_getAppColor('card');
    border-right: thin solid s_getAppColor('border');
  }

  &__allDayLabel {
    padding: 4px;
    font-size: 11px;
    color: s_getAppColor('text', 0.6);
  }

  &__allDayMoreButton {
    margin-top: 4px;
    font-size: 12px;
    cursor: pointer;
  }

  &__allDayWeeknumber {
    flex: 0 0 24px;
    background-color: s_getAppColor('card');
    border-right: thin solid s_getAppColor('border');
  }

  &__allDayColumn {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    min-height: 24px;
    border-right: thin solid s_getAppColor('border');

    &--outside {
      background-color: s_getAppColor('background');
    }
  }

  &__allDayEvents {
    position: relative;
    min-height: 24px;
    padding: 2px;
  }

  &__allDayEvent {
    position: absolute;
    right: 2px;
    left: 2px;
    min-height: 20px;
    padding: 2px 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 20px;
    color: #ffffff;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 4px;

    &--start {
      z-index: 1;
      border-radius: 4px;
    }

    &--weekStart {
      z-index: 1;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &--weekEnd {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  &__week {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    align-items: stretch;
    min-height: 1440px;
  }

  &__timeColumn {
    position: relative;
    flex: 0 0 $calendarWeekly__timeColumnWidth;
    background-color: s_getAppColor('card');
    border-right: thin solid s_getAppColor('border');
    border-bottom: thin solid s_getAppColor('border');
  }

  &__timeSlot {
    position: relative;
    height: 60px;
    color: s_getAppColor('text');

    &:not(:last-child)::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      display: block;
      width: 8px;
      height: 1px;
      content: '';
      border-top: thin solid s_getAppColor('border');
    }
  }

  &__timeSlotLabel {
    position: absolute;
    top: -12px;
    width: 100%;
    padding-right: 8px;
    text-align: right;
  }

  &__weeknumber {
    display: flex;
    flex: 0 0 24px;
    height: unset;
    min-height: 0;
    padding-top: 14.5px;
    text-align: center;
    background-color: s_getAppColor('card');
    border-right: thin solid s_getAppColor('border');
    border-bottom: thin solid s_getAppColor('border');

    > small {
      width: 100% !important;
    }
  }

  &__dayButton {
    min-width: 32px;
    min-height: 32px;
    font-size: 12px;
    font-weight: 400;

    &--active {
      font-weight: 700;
    }
  }

  &__day {
    position: relative;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    width: 0;
    min-width: 0;
    overflow: hidden;
    user-select: none;
    border-right: thin solid s_getAppColor('border');
    border-bottom: thin solid s_getAppColor('border');

    &--outside {
      color: s_getAppColor('text', 0.6);
      background-color: s_getAppColor('background');
    }

    &--today {
      .s_calendarWeekly__dayButton {
        font-weight: 700;
      }
    }
  }

  &__day::before {
    position: absolute;
    top: 1px;
    right: 0;
    left: 0;
    z-index: 0;
    display: block;
    height: 100%;
    pointer-events: none;
    content: '';
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent calc($calendarWeekly__timeColumnWidth - 1px),
      s_getAppColor('border') calc($calendarWeekly__timeColumnWidth - 1px),
      s_getAppColor('border') calc($calendarWeekly__timeColumnWidth)
    );
  }

  &__events {
    position: relative;
    flex: 1 1 auto;
    min-height: 1440px;
    overflow: visible;
  }

  &__event {
    position: absolute;
    min-height: 20px;
    max-height: 22px;
    padding: 2px 6px;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 18px;
    color: #ffffff;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 4px;

    &--start {
      z-index: 1;
      border-radius: 4px;
    }

    &--weekStart {
      z-index: 1;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
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

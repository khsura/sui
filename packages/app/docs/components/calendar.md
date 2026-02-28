# SCalendar

**Import:** `import { SCalendar } from '@khsura/sui'`
**Types:** `import type { CalendarEvent, CalendarDate, CalendarComponent } from '@khsura/sui'`

Full-featured calendar with month and week views, events, and navigation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'month' \| 'week'` | `'month'` | Calendar view |
| `focus` | `string` | `''` | Focused date in `'YYYY-MM-DD'` format (use `v-model:focus`) |
| `events` | `CalendarEvent[]` | `[]` | Events to display |
| `eventColor` | `(event: CalendarEvent) => string` | `undefined` | Function returning the color for each event |
| `color` | `string` | `undefined` | Primary color (today highlight, etc.) |
| `tag` | `string` | `'div'` | Root HTML element |
| `hideHeader` | `boolean` | `false` | Hide day-of-week header row |
| `showWeek` | `boolean` | `false` | Show week numbers in month view |
| `longWeekdays` | `boolean` | `false` | Full weekday names instead of abbreviated |
| `showMonthOnFirst` | `boolean` | `false` | Show month name on first day of month (month view) |
| `shortMonths` | `boolean` | `false` | Abbreviated month names |
| `minWeeks` | `number` | `undefined` | Minimum rows to display (month view) |
| `eventOverlapMode` | `'stacked' \| 'column'` | `'stacked'` | How overlapping events are displayed (week view) |
| `allDayRows` | `number` | `undefined` | Number of all-day event rows (week view) |

## Model

`v-model:focus` — focused date string (`'YYYY-MM-DD'`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ start: CalendarDate, end: CalendarDate }` | Visible date range changed (use to load events) |
| `click:date` | `CalendarDate` | A date cell was clicked |
| `click:event` | `CalendarEvent` | An event was clicked |
| `click:time` | `CalendarDate` | A time slot was clicked (week view) |

## Component Methods (via template ref)

```typescript
// Access via ref="calendar"
calendar.value?.prev()   // Navigate to previous month/week
calendar.value?.next()   // Navigate to next month/week
calendar.value?.title    // Current period title (e.g. "February 2026")
```

## CalendarEvent shape

```typescript
type CalendarEvent = {
  name: string       // Event display name
  start: Date        // Start datetime
  end: Date          // End datetime
  color?: string     // Event color
  timed?: boolean    // false = all-day event, true = timed event
}
```

## Usage

```vue
<script setup lang="ts">
import type { CalendarComponent, CalendarDate, CalendarEvent } from '@khsura/sui'
import dayjs from 'dayjs'

const calendar = ref<CalendarComponent | null>(null)
const focus = ref(dayjs().format('YYYY-MM-DD'))
const type = ref<'month' | 'week'>('month')
const events = ref<CalendarEvent[]>([])

// Load events when date range changes
const onRangeChange = async ({ start, end }: { start: CalendarDate; end: CalendarDate }) => {
  events.value = await api.fetchEvents(start.date, end.date)
}
</script>

<template>
  <!-- Navigation toolbar -->
  <SToolbar>
    <SButton variant="icon" @click="calendar?.prev()">
      <SIcon icon="mdi-chevron-left" />
    </SButton>
    <span class="s_text--h6">{{ calendar?.title }}</span>
    <SButton variant="icon" @click="calendar?.next()">
      <SIcon icon="mdi-chevron-right" />
    </SButton>
    <SSpacer />
    <SToggleButtonGroup v-model="type" mandatory>
      <SToggleButton value="month">Month</SToggleButton>
      <SToggleButton value="week">Week</SToggleButton>
    </SToggleButtonGroup>
  </SToolbar>

  <!-- Calendar -->
  <SCalendar
    ref="calendar"
    v-model:focus="focus"
    :type="type"
    :events="events"
    :event-color="event => event.color ?? 'primary'"
    @change="onRangeChange"
    @click:date="date => console.log('date clicked', date)"
    @click:event="event => console.log('event clicked', event)"
  />
</template>
```

### Static events example

```vue
<SCalendar
  type="month"
  :events="[
    {
      name: 'Team Meeting',
      start: new Date('2026-03-10T10:00'),
      end: new Date('2026-03-10T11:00'),
      color: 'primary',
      timed: true,
    },
    {
      name: 'Holiday',
      start: new Date('2026-03-15'),
      end: new Date('2026-03-15'),
      color: 'error',
      timed: false,
    },
  ]"
/>
```

## Notes

- Use `@change` to load events dynamically whenever the user navigates — it fires with the new visible date range.
- Access navigation methods (`prev()`, `next()`, `title`) via a template ref on `SCalendar`.
- `timed: false` renders events as full-day banners; `timed: true` shows them with time blocks (in week view).
- `v-model:focus` controls which date the calendar is centered on — update it programmatically to jump to a date.

# SCalendar

**Import:** `import { SCalendar } from '@khsura/sui'`
**Types:** `import type { CalendarEvent, CalendarDate, CalendarComponent } from '@khsura/sui'`

Calendar with month and week views, events, and navigation. (`SCalendarMonthly` / `SCalendarWeekly` are internal and not exported.)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'month' \| 'week'` | `'month'` | Calendar view. Set it once — `prev`/`next`/`title` keep the type from mount (see Notes) |
| `focus` | `string` | today | Focused date in `'YYYY-MM-DD'` format (use `v-model:focus`). Invalid/empty → today |
| `events` | `CalendarEvent[]` | `undefined` | Events to display |
| `eventColor` | `(event: CalendarEvent) => string` | `undefined` | Function returning the color for each event |
| `color` | `string` | `undefined` | Highlight color |
| `tag` | `string` | — | Typed but ignored (root is always a `div`) |
| `hideHeader` | `boolean` | `false` | *Week view:* hide the weekday header |
| `showWeek` | `boolean` | `false` | *Week view:* show week numbers |
| `longWeekdays` | `boolean` | `false` | *Week view:* full weekday names instead of abbreviated |
| `showMonthOnFirst` | `boolean` | `false` | *Week view:* show month name on the first day of the month |
| `shortMonths` | `boolean` | `false` | *Week view:* abbreviated month names |
| `minWeeks` | `number` | `1` | *Week view:* minimum weeks rendered |
| `eventOverlapMode` | `'stacked' \| 'column'` | `'column'` | *Week view:* how overlapping timed events are displayed |
| `allDayRows` | `number` | `7` | *Week view:* number of all-day event rows |

The week-view props are only passed to the week view; they have no effect when `type="month"`.

## Model

`v-model:focus` — focused date string (`'YYYY-MM-DD'`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:focus` | `string` | Focused date changed |
| `change` | `{ start: CalendarDate, end: CalendarDate }` | Focus changed (navigation or date click); range of the new month/week. Not emitted on mount |
| `click:date` | `{ date: CalendarDate, events: CalendarEvent[] }` | A date cell was clicked (focus also moves there) |
| `click:event` | `{ date: CalendarDate, event: CalendarEvent }` | An event was clicked |
| `click:time` | `{ date: CalendarDate, events: CalendarEvent[] }` | A time slot was clicked (week view) |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `event` | `{ event }` | Month view only — custom event content. `event` also carries `isStartDate`, `isEndDate`, `isWeekStart`, `isWeekEnd` |

## Component Methods (via template ref)

```typescript
// Access via ref="calendar"
calendar.value?.prev(n?)  // Navigate back n months/weeks (default 1)
calendar.value?.next(n?)  // Navigate forward n months/weeks (default 1)
calendar.value?.title     // Current period title, e.g. '2026年3月' (fixed Japanese format)
```

`CalendarComponent` types only the props — `prev`/`next`/`title` are not on it.

## CalendarEvent shape

```typescript
interface CalendarEvent {
  name: string          // Event display name
  start: Date | string  // Start datetime
  end?: Date | string   // End datetime
  color: string         // Event color (required)
  timed: boolean        // false = all-day event, true = timed event (required)
  [key: string]: any
}
```

## CalendarDate shape

```typescript
interface CalendarDate {
  date: string; time: string
  year: number; month: number; day: number; hour: number; minute: number; weekday: number
  past: boolean; present: boolean; future: boolean
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { CalendarDate, CalendarEvent } from '@khsura/sui'

const calendar = ref()
const focus = ref(dayjs().format('YYYY-MM-DD'))
const type = ref<'month' | 'week'>('month')
const events = ref<CalendarEvent[]>([])

// Load events when the visible range changes (`change` does not fire on mount — load the first range yourself)
const onRangeChange = async ({ start, end }: { start: CalendarDate; end: CalendarDate }) => {
  events.value = await api.fetchEvents(start.date, end.date)
}
</script>

<template>
  <!-- Navigation toolbar -->
  <div class="s_display__flex s_align__center">
    <SButton variant="icon" @click="calendar?.prev()">
      <SIcon icon="mdi-chevron-left" />
    </SButton>
    <span class="s_text--h6">{{ calendar?.title }}</span>
    <SButton variant="icon" @click="calendar?.next()">
      <SIcon icon="mdi-chevron-right" />
    </SButton>
    <SSpacer />
    <SButton @click="type = 'month'">Month</SButton>
    <SButton @click="type = 'week'">Week</SButton>
  </div>

  <!-- Calendar: re-mount on type change so prev/next/title follow the new type -->
  <SCalendar
    :key="type"
    ref="calendar"
    v-model:focus="focus"
    :type="type"
    :events="events"
    :event-color="event => event.color ?? 'primary'"
    @change="onRangeChange"
    @click:date="({ date, events }) => openDay(date, events)"
    @click:event="({ event }) => openEvent(event)"
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

- Use `@change` to load events whenever the user navigates — it fires with the new visible date range. It does not fire on first render.
- Click payloads are objects: `click:date` / `click:time` → `{ date, events }`, `click:event` → `{ date, event }`.
- `prev`/`next`/`title` capture `type` when the calendar mounts. To switch views, re-mount with `:key="type"`.
- Access navigation methods (`prev()`, `next()`, `title`) via a template ref on `SCalendar`.
- `timed: false` renders events as full-day banners; `timed: true` shows them with time blocks (in week view).
- `v-model:focus` controls which date the calendar is centered on — update it programmatically to jump to a date.

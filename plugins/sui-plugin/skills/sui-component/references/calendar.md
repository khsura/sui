# SCalendar

**Import:** `import { SCalendar } from '@khsura/sui'`
**Types:** `import type { CalendarEvent, CalendarDate, CalendarComponent } from '@khsura/sui'`

Calendar with month and week views, events, and prev/next navigation. (`SCalendarMonthly` / `SCalendarWeekly` are internal — not exported.)

Types: `node_modules/@khsura/sui/@types/definitions/props/propsCalendar.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'month' \| 'week'` | `'month'` | View. Set it once — see Gotchas |
| `focus` (`v-model:focus`) | `string` (`'YYYY-MM-DD'`) | today | Focused date; invalid/empty → today |
| `events` | `CalendarEvent[]` | `undefined` | Events to display |
| `eventColor` | `(event) => string` | `undefined` | Per-event color (otherwise `event.color`) |
| `color` | `string` | `undefined` | Highlight color of the focused date |
| `theme` / `colorThreshold` | shared color props | `undefined` | Theme override / text-contrast threshold |
| `hideHeader` | `boolean` | `false` | *Week view:* hide the weekday header |
| `showWeek` | `boolean` | `false` | *Week view:* week-number column |
| `longWeekdays` | `boolean` | `false` | *Week view:* full weekday names |
| `showMonthOnFirst` | `boolean` | `false` | *Week view:* month name on the 1st |
| `shortMonths` | `boolean` | `false` | *Week view:* abbreviated month names |
| `minWeeks` | `number` | `1` | *Week view:* minimum weeks rendered |
| `eventOverlapMode` | `'stacked' \| 'column'` | `'column'` | *Week view:* layout of overlapping timed events |
| `allDayRows` | `number` | `7` | *Week view:* all-day rows before "more" |

The week-view props have no effect in month view. `tag` is typed but ignored (root is always a `div`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:focus` | `string` | Focus changed |
| `change` | `{ start: CalendarDate, end: CalendarDate }` | Focus changed (navigation or date click); range of the new month/week. **Not emitted on mount** |
| `click:date` | `{ date: CalendarDate, events: CalendarEvent[] }` | Date clicked (also moves focus there) |
| `click:event` | `{ date: CalendarDate, event: CalendarEvent }` | Event clicked |
| `click:time` | `{ date: CalendarDate, events: CalendarEvent[] }` | Time slot clicked (week view) |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `event` | `{ event }` | **Month view only** — custom event bar content. `event` has extra `isStartDate`, `isEndDate`, `isWeekStart`, `isWeekEnd` |

## Exposed (template ref)

```ts
calendar.value?.prev(n?)   // back n months/weeks (default 1)
calendar.value?.next(n?)   // forward n months/weeks
calendar.value?.title      // e.g. '2026年3月' (Japanese format, not localized)
```

## Types

```ts
interface CalendarEvent {
  name: string
  start: Date | string
  end?: Date | string
  color: string     // required
  timed: boolean    // required — false = all-day
  [key: string]: any
}

interface CalendarDate {
  date: string; time: string
  year: number; month: number; day: number; hour: number; minute: number; weekday: number
  past: boolean; present: boolean; future: boolean
}
```

## Usage

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CalendarDate, CalendarEvent } from '@khsura/sui'

const calendar = ref()
const focus = ref('2026-03-10')
const events = ref<CalendarEvent[]>([])

const loadRange = async ({ start, end }: { start: CalendarDate; end: CalendarDate }) => {
  events.value = await api.fetchEvents(start.date, end.date)
}

onMounted(() => loadInitialMonth()) // `change` does not fire on first render
</script>

<template>
  <SToolbar>
    <SButton variant="icon" @click="calendar?.prev()"><SIcon icon="mdi-chevron-left" /></SButton>
    <span>{{ calendar?.title }}</span>
    <SButton variant="icon" @click="calendar?.next()"><SIcon icon="mdi-chevron-right" /></SButton>
  </SToolbar>

  <SCalendar
    ref="calendar"
    v-model:focus="focus"
    type="month"
    :events="events"
    @change="loadRange"
    @click:event="({ event }) => openEvent(event)"
  />
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| Toggling `:type` on a live calendar | `prev`/`next`/`title` keep the type from mount. Re-mount on switch: `<SCalendar :key="type" :type="type" />` |
| `@click:event="event => …"` | Payload is `{ date, event }` (and `{ date, events }` for `click:date`/`click:time`) |
| Events without `color`/`timed` | Both are required in `CalendarEvent` |
| Untrusted `event.name` in month view | Month view renders `name` as HTML — escape it, or use the `#event` slot |

- `CalendarComponent` types only props — `prev`/`next`/`title` are not on it; type the ref loosely or with your own interface.
- Use `@change` (not `update:focus`) to load events for the visible range; load the initial range yourself.

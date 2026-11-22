# SCalendar

**Import:** `import { SCalendar } from '@khsura/sui'`
**Types:** `import type { CalendarEvent, CalendarDate, CalendarComponent } from '@khsura/sui'`

Calendar with month and week views, events, and prev/next navigation. (`SCalendarMonthly` / `SCalendarWeekly` are internal — not exported.)

Types: `node_modules/@khsura/sui/@types/definitions/props/propsCalendar.d.ts`

<!-- generated:api:start SCalendar -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCalendar props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `allDayRows` | `number` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `eventColor` | `((event: T) => string)` | — | no | — |
| `eventOverlapMode` | `"column" \| "stacked"` | — | no | `column`, `stacked` |
| `events` | `T[]` | — | no | — |
| `focus` | `string` | — | no | — |
| `hideHeader` | `boolean` | — | no | — |
| `longWeekdays` | `boolean` | — | no | — |
| `minWeeks` | `number` | — | no | — |
| `shortMonths` | `boolean` | — | no | — |
| `showMonthOnFirst` | `boolean` | — | no | — |
| `showWeek` | `boolean` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `type` | `"month" \| "week"` | `"month"` | no | `month`, `week` |

**SCalendar slots**

| Slot | Slot props |
| --- | --- |
| `event` | `{ event: CalendarEventExtended<T>; }` |

**SCalendar events**

| Event | Payload |
| --- | --- |
| `change` | `[{ start: CalendarDate; end: CalendarDate; }]` |
| `click:date` | `[{ date: CalendarDate; events: T[]; }]` |
| `click:event` | `[{ date: CalendarDate; event: T; }]` |
| `click:time` | `[{ date: CalendarDate; events: T[]; }]` |
| `update:focus` | `[value: string \| undefined]` |

<!-- generated:api:end SCalendar -->

**SCalendar notes**

- `type`: View. Set it once — see Gotchas
- `focus` (`v-model:focus`): Focused date; invalid/empty → today (default: today)
- `events`: Events to display
- `eventColor`: Per-event color (otherwise `event.color`)
- `color`: Highlight color of the focused date
- `theme` / `colorThreshold`: Theme override / text-contrast threshold
- `hideHeader`: *Week view:* hide the weekday header
- `showWeek`: *Week view:* week-number column
- `longWeekdays`: *Week view:* full weekday names
- `showMonthOnFirst`: *Week view:* month name on the 1st
- `shortMonths`: *Week view:* abbreviated month names
- `minWeeks`: *Week view:* minimum weeks rendered (default: `1`)
- `eventOverlapMode`: *Week view:* layout of overlapping timed events (default: `'column'`)
- `allDayRows`: *Week view:* all-day rows before "more" (default: `7`)
- `update:focus` (event): Focus changed
- `change` (event): Focus changed (navigation or date click); range of the new month/week. **Not emitted on mount**
- `click:date` (event): Date clicked (also moves focus there)
- `click:event` (event): Event clicked
- `click:time` (event): Time slot clicked (week view)
- `event` (slot): **Month view only** — custom event bar content. `event` has extra `isStartDate`, `isEndDate`, `isWeekStart`, `isWeekEnd`

The week-view props have no effect in month view. `tag` is typed but ignored (root is always a `div`).

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

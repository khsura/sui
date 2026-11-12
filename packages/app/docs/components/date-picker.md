# SDatePicker

**Import:** `import { SDatePicker, datePickerModelFormats } from '@khsura/sui'`

Inline date, month or year picker with navigation and min/max constraints.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'month' \| 'year'` | `'date'` | Picker mode — full date, month-only or year-only (typed as required — always pass it) |
| `hideTitle` | `boolean` | `false` | Hide the selected date title area |
| `dateFormat` | `string` | `'MMM D'` | Display format for the date title (e.g. `'DD MMM YYYY'`) |
| `monthFormat` | `string` | `'MMMM'` | Display format for month labels |
| `yearFormat` | `string` | `'YYYY'` | dayjs format for the year in the title, the switch and every item of the year list (e.g. `'YYYY年'`, `'YYYY [он]'`) |
| `today` | `string` | current date | Highlight this date as "today" (`'YYYY-MM-DD'`) |
| `min` | `string` | `undefined` | Minimum selectable date (`'YYYY-MM-DD'`). When unset: Jan 1, 5 years before `today` |
| `max` | `string` | `undefined` | Maximum selectable date (`'YYYY-MM-DD'`). When unset: Dec 31, 5 years after `today` |
| `disabled` | `boolean` | `false` | Disables the **title** buttons only — the date/month/year grid stays selectable |
| `readonly` | `boolean` | `false` | Makes the **title** buttons read-only only — the grid stays selectable |
| `dense` | `boolean` | `false` | Compact layout |
| `color` | `string` | `undefined` | Active/selected color |
| `colorThreshold` | `number` | `undefined` | Light/dark text threshold for the selected color |
| `theme` | `AppThemeType` | `undefined` | Per-component theme |
| `width` / `height` / `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | `string \| number` | `undefined` | Picker size |

## Model

`v-model` — selected date string in `'YYYY-MM-DD'` format (for `type="date"`), `'YYYY-MM'` (for `type="month"`) or `'YYYY'` (for `type="year"`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | A value was selected |
| `change` | — (no payload) | Emitted on selection, just before the model updates — read the `v-model` ref, not the event |

## Slots

None.

## Format constants

```typescript
import { datePickerModelFormats } from '@khsura/sui'

datePickerModelFormats.date   // 'YYYY-MM-DD'
datePickerModelFormats.month  // 'YYYY-MM'
datePickerModelFormats.year   // 'YYYY'
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { datePickerModelFormats } from '@khsura/sui'

const selectedDate = ref(dayjs().format(datePickerModelFormats.date))
const selectedMonth = ref(dayjs().format(datePickerModelFormats.month))
const selectedYear = ref(dayjs().format(datePickerModelFormats.year))

const minDate = dayjs().subtract(1, 'year').format(datePickerModelFormats.date)
const maxDate = dayjs().endOf('year').format(datePickerModelFormats.date)
</script>

<template>
  <!-- Date picker -->
  <SDatePicker
    v-model="selectedDate"
    type="date"
    :min="minDate"
    :max="maxDate"
    color="primary"
  />

  <!-- Month picker -->
  <SDatePicker
    v-model="selectedMonth"
    type="month"
    color="secondary"
  />

  <!-- Year picker -->
  <SDatePicker v-model="selectedYear" type="year" />

  <!-- Compact (dense) -->
  <SDatePicker v-model="selectedDate" type="date" dense />

  <!-- Without title -->
  <SDatePicker v-model="selectedDate" type="date" hide-title />

  <!-- Popup picker: use SDatePickerInput (below) instead of wiring SMenu yourself -->
  <SDatePickerInput v-model="selectedDate" label="Date" :min="minDate" :max="maxDate" />
</template>
```

## Notes

- Model value format is always `'YYYY-MM-DD'` for `type="date"`, `'YYYY-MM'` for `type="month"` and `'YYYY'` for `type="year"`. Changing `type` converts the value to the new format.
- Import `datePickerModelFormats` to use the exact format strings for `dayjs().format(...)`.
- The picker is inline (rendered in an `SCard`). For a popup picker use `SDatePickerInput`.
- `disabled` / `readonly` only affect the title buttons; to lock the value, don't render the picker (or use `SDatePickerInput disabled`).
- The default range is only ±5 years around `today` — pass `min`/`max` for e.g. a birth-date picker.
- `min` and `max` use the same `'YYYY-MM-DD'` format regardless of `type`.
- The year list has no language of its own: it shows each year in `yearFormat`, plain `2026` by default. Pass the suffix your locale needs, e.g. `year-format="YYYY年"` for Japanese or `year-format="YYYY [он]"` for Mongolian (square brackets escape literal text in dayjs). Before 1.15.3 the list ignored `yearFormat` and always showed `2026年`.

---

# SDatePickerInput

**Import:** `import { SDatePickerInput } from '@khsura/sui'`

Text input with a date picker popup. Optionally renders prev/next **carousel** buttons that step the value directly.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'month' \| 'year'` | `'date'` | Picker mode and model format |
| `label` | `string \| null` | `undefined` | Field label |
| `placeholder` | `string \| null` | `undefined` | Input placeholder, defaults to the model format |
| `simple` | `boolean \| null` | `undefined` | Borderless input |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Field size |
| `tile` | `boolean` | `false` | Square corners |
| `block` | `boolean` | `false` | Stretch the field to the width of its container |
| `width` / `maxWidth` / `minWidth` | `string \| number` | `undefined` | Size of the field; the picker it opens stays 280px wide |
| `carousel` | `boolean` | `false` | Render prev/next buttons that step the value |
| `carouselPrevIcon` | `string` | `'mdi-chevron-left'` | Icon of the previous button |
| `carouselNextIcon` | `string` | `'mdi-chevron-right'` | Icon of the next button |
| `carouselPrevAriaLabel` | `string` | `'Previous'` | Accessible label of the previous button |
| `carouselNextAriaLabel` | `string` | `'Next'` | Accessible label of the next button |
| `min` / `max` | `string` | `undefined` | Bounds of the selectable value. When unset, the picker allows 5 years before and after `today` |
| `disabled` / `readonly` | `boolean` | `undefined` | Native input states; also disable the carousel buttons |
| `rules` | `((value) => true \| string)[]` | `undefined` | Validation rules |
| `hideDetails` | `boolean` | `undefined` | Hide the label and error area |
| `hideError` | `boolean` | `undefined` | Hide the error message |
| `id` | `string` | auto-generated | Input id |

`today`, `dateFormat`, `monthFormat`, `yearFormat`, `dense` and `color` are forwarded to the popup `SDatePicker`. `hideTitle`, `colorThreshold` and the picker `height` are accepted but not forwarded (the popup always hides its title and is 280px wide).

## Model

`v-model` — the date string in the format of `type` (`'YYYY-MM-DD'`, `'YYYY-MM'` or `'YYYY'`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| null` | Value changed |
| `change` | `string \| null` | Value committed (typed + Enter/blur, picked, or stepped) |
| `update:error` | `boolean` | Validation state |
| `update:errors` | `string[]` | Error messages |
| `update:dirty` | `boolean` | Dirty state |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { datePickerModelFormats } from '@khsura/sui'

const date = ref(dayjs().format(datePickerModelFormats.date))
const month = ref<string | null>(null)
</script>

<template>
  <!-- Plain input with a picker popup -->
  <SDatePickerInput v-model="date" label="Date" />

  <!-- With carousel buttons -->
  <SDatePickerInput v-model="date" label="Date" carousel />

  <!-- Month field with validation -->
  <SDatePickerInput v-model="month" type="month" label="Month" :rules="[v => !!v || 'Required']" />
</template>
```

## Notes

- The carousel buttons step the value by one unit — one day for `type="date"`, one month for `type="month"`, one year for `type="year"`.
- The buttons are disabled at the `min`/`max` bounds and when the input is `disabled` or `readonly`.
- The model value is always kept in the format of the current `type`. Switching `type` converts the value, so `2026-10-21` becomes `2026-10` for `type="month"` and `2026` for `type="year"`.
- The input reserves the width the value needs, so the last characters are never cut off. The width follows the `size` prop, like `SInput`.
- `block` decides whether the field stretches to the width of its container (`true`) or hugs the value (`false`, the default). `maxWidth` caps a block field. Either way the field never renders narrower than the value.
- The font size never goes below `16px` (`mini` and `small` are the same as `default`), a smaller font size makes the browser zoom in on focus.
- Typed text must match the model format exactly (`YYYY-MM-DD` etc.) and is only format-checked — add a `rules` entry if typed values must respect `min`/`max`.

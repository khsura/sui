# SDatePicker

**Import:** `import { SDatePicker, datePickerModelFormats } from '@khsura/sui'`

Inline date, month or year picker with navigation and min/max constraints.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'month' \| 'year'` | **required** | Picker mode — full date, month-only or year-only |
| `hideTitle` | `boolean` | `false` | Hide the selected date title area |
| `dateFormat` | `string` | `'MMM D'` | Display format for the date title (e.g. `'DD MMM YYYY'`) |
| `monthFormat` | `string` | `'MMMM'` | Display format for month labels |
| `yearFormat` | `string` | `'YYYY'` | dayjs format for the year in the title, the switch and every item of the year list (e.g. `'YYYY年'`, `'YYYY [он]'`) |
| `today` | `string` | `undefined` | Highlight this date as "today" (`'YYYY-MM-DD'`) |
| `min` | `string` | `undefined` | Minimum selectable date (`'YYYY-MM-DD'`) |
| `max` | `string` | `undefined` | Maximum selectable date (`'YYYY-MM-DD'`) |
| `disabled` | `boolean` | `false` | Disable all interaction |
| `readonly` | `boolean` | `false` | Display only, no selection |
| `dense` | `boolean` | `false` | Compact layout |
| `color` | `string` | `undefined` | Active/selected color |
| `colorThreshold` | `number` | `undefined` | Light/dark text threshold for the selected color |
| `width` | `string \| number` | `undefined` | Picker width |
| `height` | `string \| number` | `undefined` | Picker height |

## Model

`v-model` — selected date string in `'YYYY-MM-DD'` format (for `type="date"`), `'YYYY-MM'` (for `type="month"`) or `'YYYY'` (for `type="year"`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | — | Emitted when the selection changes |

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

  <!-- Inside a menu/dialog (common pattern) -->
  <SMenu :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <SInput
        v-model="selectedDate"
        label="Date"
        readonly
        v-on="on"
        v-bind="attrs"
      />
    </template>
    <SDatePicker
      v-model="selectedDate"
      type="date"
      :min="minDate"
      :max="maxDate"
    />
  </SMenu>
</template>
```

## Notes

- Model value format is always `'YYYY-MM-DD'` for `type="date"`, `'YYYY-MM'` for `type="month"` and `'YYYY'` for `type="year"`. Changing `type` converts the value to the new format.
- Import `datePickerModelFormats` to use the exact format strings for `dayjs().format(...)`.
- The picker is inline — wrap in `SMenu` or `SDialog` for a popup date picker.
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
| `label` | `string` | `undefined` | Field label |
| `placeholder` | `string` | `undefined` | Input placeholder, defaults to the model format |
| `simple` | `boolean` | `false` | Borderless input |
| `tile` | `boolean` | `false` | Square corners |
| `block` | `boolean` | `false` | Stretch the field to the width of its container |
| `width` / `maxWidth` / `minWidth` | `string \| number` | `undefined` | Size of the field; the picker it opens stays 280px wide |
| `carousel` | `boolean` | `false` | Render prev/next buttons that step the value |
| `carouselPrevIcon` | `string` | `'mdi-chevron-left'` | Icon of the previous button |
| `carouselNextIcon` | `string` | `'mdi-chevron-right'` | Icon of the next button |
| `carouselPrevAriaLabel` | `string` | `'Previous'` | Accessible label of the previous button |
| `carouselNextAriaLabel` | `string` | `'Next'` | Accessible label of the next button |
| `min` / `max` | `string` | `undefined` | Bounds of the selectable value |
| `disabled` / `readonly` | `boolean` | `false` | Disable all interaction |

All `SDatePicker` props (`dateFormat`, `monthFormat`, `yearFormat`, `today`, `dense`, `color`, `colorThreshold`, …) are supported as well.

## Model

`v-model` — the date string in the format of `type` (`'YYYY-MM-DD'`, `'YYYY-MM'` or `'YYYY'`).

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `string \| null` | Emitted when the value changes |

## Usage

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import { datePickerModelFormats } from '@khsura/sui'

const date = ref(dayjs().format(datePickerModelFormats.date))
</script>

<template>
  <!-- Plain input with a picker popup -->
  <SDatePickerInput v-model="date" label="Date" />

  <!-- With carousel buttons -->
  <SDatePickerInput v-model="date" label="Date" carousel />
</template>
```

## Notes

- The carousel buttons step the value by one unit — one day for `type="date"`, one month for `type="month"`, one year for `type="year"`.
- The buttons are disabled at the `min`/`max` bounds and when the input is `disabled` or `readonly`.
- The model value is always kept in the format of the current `type`. Switching `type` converts the value, so `2026-10-21` becomes `2026-10` for `type="month"` and `2026` for `type="year"`.
- The input reserves the width the value needs, so the last characters are never cut off. The width follows the `size` prop, like `SInput`.
- `block` decides whether the field stretches to the width of its container (`true`) or hugs the value (`false`, the default). `maxWidth` caps a block field. Either way the field never renders narrower than the value.
- The font size never goes below `16px` (`mini` and `small` are the same as `default`), a smaller font size makes the browser zoom in on focus.

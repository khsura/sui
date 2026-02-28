# SDatePicker

**Import:** `import { SDatePicker, datePickerModelFormats } from '@khsura/sui'`

Inline date or month picker with navigation and min/max constraints.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'month'` | **required** | Picker mode — full date or month-only |
| `hideTitle` | `boolean` | `false` | Hide the selected date title area |
| `dateFormat` | `string` | `undefined` | Display format for the date title (e.g. `'DD MMM YYYY'`) |
| `monthFormat` | `string` | `undefined` | Display format for month labels |
| `yearFormat` | `string` | `undefined` | Display format for year labels |
| `today` | `string` | `undefined` | Highlight this date as "today" (`'YYYY-MM-DD'`) |
| `min` | `string` | `undefined` | Minimum selectable date (`'YYYY-MM-DD'`) |
| `max` | `string` | `undefined` | Maximum selectable date (`'YYYY-MM-DD'`) |
| `disabled` | `boolean` | `false` | Disable all interaction |
| `readonly` | `boolean` | `false` | Display only, no selection |
| `dense` | `boolean` | `false` | Compact layout |
| `color` | `string` | `undefined` | Active/selected color |
| `width` | `string \| number` | `undefined` | Picker width |
| `height` | `string \| number` | `undefined` | Picker height |

## Model

`v-model` — selected date string in `'YYYY-MM-DD'` format (for `type="date"`) or `'YYYY-MM'` (for `type="month"`).

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
```

## Usage

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import { datePickerModelFormats } from '@khsura/sui'

const selectedDate = ref(dayjs().format(datePickerModelFormats.date))
const selectedMonth = ref(dayjs().format(datePickerModelFormats.month))

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

- Model value format is always `'YYYY-MM-DD'` for `type="date"` and `'YYYY-MM'` for `type="month"`.
- Import `datePickerModelFormats` to use the exact format strings for `dayjs().format(...)`.
- The picker is inline — wrap in `SMenu` or `SDialog` for a popup date picker.
- `min` and `max` use the same `'YYYY-MM-DD'` format regardless of `type`.

# SDatePicker

**Import:** `import { SDatePicker, datePickerModelFormats } from '@khsura/sui'`

Inline date, month or year picker (rendered in an `SCard`) with min/max bounds.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDatePicker.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'month' \| 'year'` | `'date'` | Picker mode and model format (typed as required — always pass it) |
| `min` | `string` | Jan 1, 5 years before `today` | Earliest selectable value (`'YYYY-MM-DD'`, any `type`) |
| `max` | `string` | Dec 31, 5 years after `today` | Latest selectable value |
| `today` | `string` | current date | Date highlighted as "today" (`'YYYY-MM-DD'`) |
| `hideTitle` | `boolean` | `false` | Hide the title area |
| `dateFormat` | `string` | `'MMM D'` | dayjs format for the date in the title |
| `monthFormat` | `string` | `'MMMM'` | dayjs format for month labels |
| `yearFormat` | `string` | `'YYYY'` | dayjs format for years (title, switch, year list), e.g. `'YYYY年'`, `'YYYY [он]'` |
| `disabled` | `boolean` | `false` | Disables the **title** buttons only (see Gotchas) |
| `readonly` | `boolean` | `false` | Makes the **title** buttons read-only only |
| `dense` | `boolean` | `false` | Compact layout |
| `color` | `string` | `undefined` | Selected-item color |
| `colorThreshold` | `number` | `undefined` | Light/dark text threshold for the selected color |
| `theme` | `AppThemeType` | `undefined` | Per-component theme |
| `width` / `height` / `min*` / `max*` sizes | `string \| number` | `undefined` | Picker size (`minWidth`, `maxHeight`, …) |

## Model

`v-model` — `string | null`: `'YYYY-MM-DD'` (`type="date"`), `'YYYY-MM'` (`month`), `'YYYY'` (`year`). Changing `type` converts the current value.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Value selected |
| `change` | — (no payload) | Emitted on selection, before the model updates — read the `v-model` ref, not the event |

## Slots

None.

## Format constants

```ts
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
const birthDate = ref<string | null>(null)
</script>

<template>
  <SDatePicker v-model="selectedDate" type="date" color="primary" />
  <SDatePicker v-model="selectedMonth" type="month" dense hide-title />

  <!-- Range wider than ±5 years: pass min/max -->
  <SDatePicker v-model="birthDate" type="date" min="1920-01-01" :max="dayjs().format('YYYY-MM-DD')" />
</template>
```

For a popup picker use `SDatePickerInput` (below) rather than wiring `SMenu` yourself.

---

# SDatePickerInput

**Import:** `import { SDatePickerInput } from '@khsura/sui'`

Text field (type a value or pick from a popup `SDatePicker`), with optional prev/next **carousel** buttons that step the value. Registers with a parent `SForm`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDatePickerInput.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'month' \| 'year'` | `'date'` | Picker mode and model format |
| `label` | `string \| null` | `undefined` | Field label |
| `placeholder` | `string \| null` | model format | Input placeholder |
| `min` / `max` | `string` | ±5 years around `today` (picker) | Bounds for the popup and carousel buttons |
| `rules` | `((value) => true \| string)[]` | `undefined` | Validation rules |
| `hideDetails` | `boolean` | `undefined` | Hide label and error area |
| `hideError` | `boolean` | `undefined` | Hide the error message |
| `id` | `string` | auto | Input id |
| `disabled` / `readonly` | `boolean \| null` | `undefined` | Native input states; disable carousel buttons |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Field size (font never below 16px) |
| `simple` | `boolean \| null` | `undefined` | Borderless field |
| `tile` | `boolean` | `false` | Square corners |
| `block` | `boolean` | `false` | Stretch to container width (otherwise hugs the value) |
| `width` / `maxWidth` / `minWidth` | `string \| number` | `undefined` | Field size; the popup stays 280px wide |
| `carousel` | `boolean` | `false` | Prev/next buttons stepping one day / month / year |
| `carouselPrevIcon` / `carouselNextIcon` | `MaterialDesignIcon` | `'mdi-chevron-left'` / `'mdi-chevron-right'` | Button icons |
| `carouselPrevAriaLabel` / `carouselNextAriaLabel` | `string \| null` | `'Previous'` / `'Next'` | Button labels |
| `today`, `dateFormat`, `monthFormat`, `yearFormat`, `dense`, `color` | — | as SDatePicker | Forwarded to the popup picker |

`hideTitle`, `colorThreshold` and the picker `height` are not forwarded (the popup always hides its title).

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
<SDatePickerInput v-model="date" label="Date" :rules="[v => !!v || 'Required']" />
<SDatePickerInput v-model="month" type="month" label="Month" carousel />
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SDatePicker disabled>` to lock the picker | `disabled`/`readonly` only affect the title; hide the picker or use `SDatePickerInput disabled` |
| Birth-date picker with default bounds | Pass `min`/`max` — the default range is only ±5 years around today |
| Trusting typed input to respect `min`/`max` | Typed text is only format-checked; add a `rules` entry for the range |
| `@change="(v) => …"` on `SDatePicker` | `SDatePicker`'s `change` has no payload; use `v-model` / `@update:model-value` |

- Older versions: if omitting `min` or `max` leaves only today selectable, upgrade or pass both bounds explicitly.
- Typed text must match the model format exactly (`YYYY-MM-DD` etc.); invalid text reverts to the last value.

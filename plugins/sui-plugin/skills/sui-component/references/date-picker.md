# SDatePicker

**Import:** `import { SDatePicker, datePickerModelFormats } from '@khsura/sui'`

Inline date, month or year picker (rendered in an `SCard`) with min/max bounds.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsDatePicker.d.ts`

<!-- generated:api:start SDatePicker -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SDatePicker props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `dateFormat` | `string` | `datePickerDisplayFormat.date` | no | — |
| `dense` | `boolean` | — | no | — |
| `disabled` | `boolean` | — | no | — |
| `height` | `string \| number \| null` | — | no | — |
| `hideTitle` | `boolean` | — | no | — |
| `max` | `string` | — | no | — |
| `maxHeight` | `string \| number \| null` | — | no | — |
| `maxWidth` | `string \| number \| null` | — | no | — |
| `min` | `string` | — | no | — |
| `minHeight` | `string \| number \| null` | — | no | — |
| `minWidth` | `string \| number \| null` | — | no | — |
| `modelValue` | `string \| null` | — | no | — |
| `monthFormat` | `string` | `datePickerDisplayFormat.month` | no | — |
| `readonly` | `boolean` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `today` | `string` | `dayjs().format("YYYY-MM-DD")` | no | — |
| `type` | `DatePickerTypeType` | `"date"` | yes | `date`, `month`, `year` |
| `width` | `string \| number \| null` | — | no | — |
| `yearFormat` | `string` | `datePickerDisplayFormat.year` | no | — |

**SDatePicker slots**

None.

**SDatePicker events**

| Event | Payload |
| --- | --- |
| `change` | `[]` |
| `update:modelValue` | `[value: string \| null \| undefined]` |

<!-- generated:api:end SDatePicker -->

**SDatePicker notes**

- `type`: Picker mode and model format (typed as required — always pass it)
- `min`: Earliest selectable value (`'YYYY-MM-DD'`, any `type`) (default: Jan 1, 5 years before `today`)
- `max`: Latest selectable value (default: Dec 31, 5 years after `today`)
- `today`: Date highlighted as "today" (`'YYYY-MM-DD'`)
- `hideTitle`: Hide the title area
- `dateFormat`: dayjs format for the date in the title
- `monthFormat`: dayjs format for month labels
- `yearFormat`: dayjs format for years (title, switch, year list), e.g. `'YYYY年'`, `'YYYY [он]'`
- `disabled`: Disables the **title** buttons only (see Gotchas)
- `readonly`: Makes the **title** buttons read-only only
- `dense`: Compact layout
- `color`: Selected-item color
- `colorThreshold`: Light/dark text threshold for the selected color
- `theme`: Per-component theme
- `width` / `height` / `min*` / `max*` sizes: Picker size (`minWidth`, `maxHeight`, …)
- `update:modelValue` (event): Value selected
- `change` (event): Emitted on selection, before the model updates — read the `v-model` ref, not the event

## Model

`v-model` — `string | null`: `'YYYY-MM-DD'` (`type="date"`), `'YYYY-MM'` (`month`), `'YYYY'` (`year`). Changing `type` converts the current value.

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

<!-- generated:api:start SDatePickerInput -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SDatePickerInput props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `block` | `boolean` | — | no | — | Stretches the field to the width of its container. |
| `carousel` | `boolean` | — | no | — | Renders prev/next buttons that step the model value by one period. |
| `carouselNextAriaLabel` | `string \| null` | `"Next"` | no | — | — |
| `carouselNextIcon` | `string` | `"mdi-chevron-right"` | no | — | — |
| `carouselPrevAriaLabel` | `string \| null` | `"Previous"` | no | — | — |
| `carouselPrevIcon` | `string` | `"mdi-chevron-left"` | no | — | — |
| `color` | `string` | — | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `dateFormat` | `string` | `datePickerDisplayFormat.date` | no | — | — |
| `dense` | `boolean` | — | no | — | — |
| `dirty` | `boolean` | — | no | — | — |
| `disabled` | `boolean` | — | no | — | — |
| `error` | `boolean` | — | no | — | — |
| `height` | `string \| number \| null` | — | no | — | — |
| `hideDetails` | `boolean` | — | no | — | — |
| `hideError` | `boolean` | — | no | — | — |
| `hideTitle` | `boolean` | — | no | — | — |
| `id` | `string` | — | no | — | — |
| `label` | `string \| null` | — | no | — | — |
| `max` | `string` | — | no | — | — |
| `maxHeight` | `string \| number \| null` | — | no | — | — |
| `maxWidth` | `string \| number \| null` | — | no | — | — |
| `min` | `string` | — | no | — | — |
| `minHeight` | `string \| number \| null` | — | no | — | — |
| `minWidth` | `string \| number \| null` | — | no | — | — |
| `modelValue` | `string \| null` | — | no | — | — |
| `monthFormat` | `string` | `datePickerDisplayFormat.month` | no | — | — |
| `placeholder` | `string \| null` | — | no | — | — |
| `readonly` | `boolean` | — | no | — | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — | — |
| `simple` | `boolean \| null` | — | no | — | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `tile` | `boolean` | — | no | — | — |
| `today` | `string` | `dayjs().format("YYYY-MM-DD")` | no | — | — |
| `type` | `DatePickerTypeType` | `"date"` | yes | `date`, `month`, `year` | — |
| `width` | `string \| number \| null` | — | no | — | — |
| `yearFormat` | `string` | `datePickerDisplayFormat.year` | no | — | — |

**SDatePickerInput slots**

None.

**SDatePickerInput events**

| Event | Payload |
| --- | --- |
| `change` | `[string \| null]` |
| `update:dirty` | `[boolean]` |
| `update:error` | `[boolean]` |
| `update:errors` | `[string[]]` |
| `update:modelValue` | `[value: string \| null \| undefined]` |

<!-- generated:api:end SDatePickerInput -->

**SDatePickerInput notes**

- `type`: Picker mode and model format
- `label`: Field label
- `placeholder`: Input placeholder (default: model format)
- `min` / `max`: Bounds for the popup and carousel buttons (default: ±5 years around `today` (picker))
- `rules`: Validation rules
- `hideDetails`: Hide label and error area
- Model: `''` and `null` both mean no date (before 1.20.0 `''` opened the picker on "Invalid date"; use `null` there). The picker stays 8px inside the viewport: above the field near the bottom, shifted left near the right edge
- `hideError`: Hide the error message
- `id`: Input id (default: auto)
- `disabled` / `readonly`: Native input states; disable carousel buttons
- `size`: Field size (font never below 16px)
- `simple`: Borderless field
- `tile`: Square corners
- `block`: Stretch to container width (otherwise hugs the value). Never wider than its container: in a narrow column it shrinks like `SInput`, keeps the calendar button and ends the value in an ellipsis
- `width` / `maxWidth` / `minWidth`: Field size; the popup stays 280px wide
- `carousel`: Prev/next buttons stepping one day / month / year
- `carouselPrevIcon` / `carouselNextIcon`: Button icons (default: `'mdi-chevron-left'` / `'mdi-chevron-right'`)
- `carouselPrevAriaLabel` / `carouselNextAriaLabel`: Button labels (default: `'Previous'` / `'Next'`)
- `today`, `dateFormat`, `monthFormat`, `yearFormat`, `dense`, `color`: Forwarded to the popup picker
- `update:modelValue` (event): Value changed
- `change` (event): Value committed (typed + Enter/blur, picked, or stepped)
- `update:error` (event): Validation state
- `update:errors` (event): Error messages
- `update:dirty` (event): Dirty state

`hideTitle`, `colorThreshold` and the picker `height` are not forwarded (the popup always hides its title).

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

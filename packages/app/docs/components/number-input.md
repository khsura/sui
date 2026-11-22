# SNumberInput

**Import:** `import { SNumberInput } from '@khsura/sui'`

A field for a number: a quantity, an amount of money, a percentage. Its `v-model` is a `number | null` (`null` when the field is empty). It renders a labelled `<input type="text" role="spinbutton">` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, increment and decrement buttons, and the same label, `rules`, `hide-details` and error line as `SInput`, so it lines up with SInput in `SForm` and `SFormRow`.

Prefer it to `SInput type="number"`: it steps with buttons and the arrow keys, keeps `precision` decimals, clamps to `min` / `max` on blur, shows a value below `min` instead of hiding it, and never triggers the browser's own number validation inside `SForm`.

Live examples: [SNumberInput in Storybook](https://sui.surakh.com/?path=/docs/ui-components-form-numberinput--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number \| null` | `null` | The value (`v-model`); `null` while the field is empty |
| `label` | `string` | `undefined` | Text above the field. With `hideDetails` it is hidden and becomes the `aria-label` |
| `placeholder` | `string` | `undefined` | Hint shown while the field is empty |
| `min` | `number \| string` | `undefined` | Lowest value. A lower value is clamped up on blur; the decrement button stops there |
| `max` | `number \| string` | `undefined` | Highest value. A higher value is clamped down on blur; the increment button stops there |
| `step` | `number \| string` | `1` | Amount the buttons and ArrowUp / ArrowDown add or remove |
| `precision` | `number \| null` | `0` | Decimal places the value keeps; `0` refuses `.`, `2` for money, `null` for any. Shown fixed (`5.00`) once the field loses focus. A finer `step` (`0.5`) raises it to the step's decimals |
| `controlVariant` | `'stacked' \| 'split'` | `'stacked'` | `stacked`: both buttons at the end of the field. `split`: minus first, plus last, number centred |
| `hideControls` | `boolean` | `false` | Hides both buttons; the arrow keys still step |
| `prefix` | `string` | `undefined` | Text inside the field before the number (a currency sign) |
| `suffix` | `string` | `undefined` | Text inside the field after the number (`%`, a unit) |
| `textRight` | `boolean` | `false` | Aligns the number to the right, as in a column of amounts |
| `rules` | `FormInputModelValueRule[]` | `undefined` | Validation rules; each receives the `number \| null` value |
| `hideDetails` | `boolean` | `false` | Hides the label and the error line (the label becomes the `aria-label`) |
| `hideError` | `boolean` | `false` | Hides only the error line; the red frame still shows |
| `error` / `dirty` | `boolean` | `undefined` | As on SInput |
| `disabled` / `readonly` | `boolean` | `false` | Both disable the buttons; `readonly` keeps the value selectable |
| `incrementAriaLabel` / `decrementAriaLabel` | `string` | `'Increase'` / `'Decrease'` | Accessible names of the buttons |
| `ariaLabel` / `ariaLabelledby` | `string` | `undefined` | Accessible name when the label is not enough |
| `name`, `id`, `autofocus` | | | Passed to the `<input>` |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Font size, as on SInput |
| `dense` / `tile` | `boolean` | `false` | Smaller padding / square corners |
| `density` | `'default' \| 'comfortable' \| 'compact'` | `undefined` (acts as `'default'`) | Vertical density: `comfortable` / `compact` lower the field by 4 / 8px, matching SButton. Defaults to `defaults.global.density`; see docs/density.md |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number \| null` | The value changed (typing, a button, an arrow key, the clamp on blur) |
| `change` | `number \| null` | Same moment as `update:modelValue`, also on blur |
| `focus` / `blur` | `FocusEvent` | The input gained / lost focus |
| `keydown` | `KeyboardEvent` | A key was pressed in the input |
| `update:error` / `update:errors` / `update:dirty` | | As on SInput |

## Slots

None.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SForm, SFormRow, SButton, SNumberInput } from '@khsura/sui'

const quantity = ref<number | null>(1)
const price = ref<number | null>(null)
const vatRate = ref<number | null>(10)
const atLeastOne = (value?: number | null) => (value ?? 0) >= 1 || 'Enter at least 1'
</script>

<template>
  <SForm>
    <!-- a count: whole numbers, stepping by 1, never below 1 -->
    <SNumberInput v-model="quantity" label="Quantity" :min="1" :rules="[atLeastOne]" control-variant="split" />

    <!-- money: two decimals, right-aligned, currency prefix -->
    <SNumberInput v-model="price" label="Price" prefix="₮" :precision="2" :min="0" text-right />

    <!-- a percentage -->
    <SNumberInput v-model="vatRate" label="VAT rate" suffix="%" :min="0" :max="100" :precision="1" />

    <!-- in a row with a button -->
    <SFormRow>
      <SNumberInput v-model="quantity" label="Qty" :min="1" />
      <SButton>Add</SButton>
    </SFormRow>
  </SForm>
</template>
```

## Accessibility

- The input has `role="spinbutton"` with `aria-valuenow` (left out while empty), `aria-valuemin` and `aria-valuemax`. ArrowUp / ArrowDown step the value, as the WAI-ARIA spinbutton pattern expects.
- The buttons are named (`Increase` / `Decrease`, overridable) and point at the input with `aria-controls`, but are out of the Tab order (`tabindex="-1"`): the arrow keys do the same from the input.
- While a rule fails, the input gets `aria-invalid="true"` and `aria-describedby` pointing at the error message.
- With `hide-details`, the label becomes the input's `aria-label`.

## Notes

- The input is `type="text"` with `inputmode="numeric"` (whole numbers, `min` ≥ 0), `"decimal"` (decimals, `min` ≥ 0) or `"text"` (negatives allowed, because a phone's numeric keypad has no minus sign). Set `:min="0"` to get the number keypad.
- Typing refuses letters, a second `.`, more decimals than `precision`, and `-` unless `min` is negative or unset. Unfinished text such as `1.` stays while typing.
- `min` / `max` are not enforced while typing (so `15` can be typed with `min="10"`); the value is clamped on blur. Use a rule when the user should see a message instead.
- No native `min` / `max` / `step` attributes are rendered, so the browser's validation bubble never covers the SUI error inside `SForm`.
- Don't add `.number` to `v-model`; the value is already a number.
- In `SFormRow`, number fields share the free width equally (a long label doesn't make one wider), so two number fields and a button fit on one line at 375 px. Keep their labels short: a label that wraps pushes its box down.

# SNumberInput

**Import:** `import { SNumberInput } from '@khsura/sui'` (since 1.21.0; on older releases use `SInput type="number"`)

The numeric field: a quantity, an amount of money, a percentage. `v-model` is `number | null` (`null` when empty). It renders a labelled `<input type="text" role="spinbutton">` with increment/decrement buttons (`stacked` at the end, or `split` around the number), steps with ArrowUp/ArrowDown, keeps `precision` decimals and clamps to `min`/`max` on blur. Label, `rules`, `hide-details`, `hide-error` and the error line work as on `SInput`, so it lines up in `SForm` and `SFormRow`.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsNumberInput.d.ts`

Docs: https://sui.surakh.com/?path=/docs/ui-components-form-numberinput--docs

<!-- generated:api:start SNumberInput -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SNumberInput props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | — | no | — | Accessible name when the visible `label` is not enough (or absent); with `hideDetails` the label is used. |
| `ariaLabelledby` | `string` | — | no | — | Id of the element that names the field, instead of `label`. |
| `autofocus` | `boolean \| null` | — | no | — | Focuses the field when it mounts. |
| `controlVariant` | `"split" \| "stacked" \| null` | — | no | `split`, `stacked` | Layout of the buttons: `stacked` (both at the end of the field, default) or `split` (minus first, plus last). |
| `decrementAriaLabel` | `string` | — | no | — | Accessible name of the decrement button. Default `Decrease`. |
| `dense` | `boolean` | — | no | — | Smaller padding, as on SInput. |
| `dirty` | `boolean` | — | no | — | — |
| `disabled` | `boolean \| null` | — | no | — | — |
| `error` | `boolean` | — | no | — | — |
| `hideControls` | `boolean \| null` | — | no | — | Hides the increment and decrement buttons; the arrow keys still step the value. |
| `hideDetails` | `boolean` | — | no | — | — |
| `hideError` | `boolean` | — | no | — | — |
| `id` | `string` | — | no | — | — |
| `incrementAriaLabel` | `string` | — | no | — | Accessible name of the increment button. Default `Increase`. |
| `label` | `string \| null` | — | no | — | Text above the field. With `hideDetails` it is hidden and becomes the field's `aria-label`. |
| `max` | `number \| string \| null` | — | no | — | Highest allowed value. A higher value is clamped down to it on blur, and the increment button stops there. |
| `min` | `number \| string \| null` | — | no | — | Lowest allowed value. A lower value is clamped up to it on blur, and the decrement button stops there. |
| `modelValue` | `number \| null` | `null` | no | — | — |
| `name` | `string` | — | no | — | Name submitted with a native form. |
| `placeholder` | `string \| null` | — | no | — | Hint shown while the field is empty. |
| `precision` | `number \| null` | — | no | — | Decimal places the value keeps. Default `0` (whole numbers; typing `.` is refused). Use `2` for money. `null` allows any number of decimals. The field shows exactly this many decimals once it loses focus. |
| `prefix` | `string \| null` | — | no | — | Text inside the field before the number, such as a currency sign. |
| `readonly` | `boolean \| null` | — | no | — | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `step` | `number \| string \| null` | — | no | — | Amount the buttons and the ArrowUp / ArrowDown keys add or remove. Default `1`. |
| `suffix` | `string \| null` | — | no | — | Text inside the field after the number, such as `%` or a unit. |
| `textRight` | `boolean \| null` | — | no | — | Aligns the number to the right, as in a column of amounts. |
| `tile` | `boolean` | — | no | — | Removes the rounded corners. |

**SNumberInput slots**

None.

**SNumberInput events**

| Event | Payload |
| --- | --- |
| `blur` | `[FocusEvent]` |
| `change` | `[number \| null]` |
| `focus` | `[FocusEvent]` |
| `keydown` | `[KeyboardEvent]` |
| `update:dirty` | `[boolean]` |
| `update:error` | `[boolean]` |
| `update:errors` | `[string[]]` |
| `update:modelValue` | `[value: number \| null]` |

<!-- generated:api:end SNumberInput -->

**SNumberInput notes**

- `precision` defaults to `0` (whole numbers; `.` is refused). `2` for money, `null` for any decimals. A finer `step` (`0.5`) raises it to the step's decimals. Once the field loses focus it shows exactly `precision` decimals (`5.00`).
- `min`/`max` are not enforced while typing; the value is clamped on blur, and the buttons stop at the bounds (disabled there). Use a rule when the user should see a message instead.
- A value below `min` (a `0` default with `:min="1"`) is shown, not hidden, and clamped on blur.
- `inputmode` is automatic: `numeric` / `decimal` when `min` ≥ 0, `text` when negatives are allowed (a phone's number keypad has no minus). Set `:min="0"` for the number keypad.
- No native `min`/`max`/`step` attributes, so the browser's validation bubble never shows inside `SForm`.
- In `SFormRow`, number fields share the free width equally (a long label doesn't make one wider), so two number fields and a button fit on one line at 375 px. Keep their labels short: a label that wraps pushes its box down.

## Usage

```vue
<SForm>
  <SNumberInput v-model="quantity" label="Quantity" :min="1" control-variant="split" :rules="[atLeastOne]" />
  <SNumberInput v-model="price" label="Price" prefix="₮" :precision="2" :min="0" text-right />
  <SNumberInput v-model="vatRate" label="VAT rate" suffix="%" :min="0" :max="100" :precision="1" />
  <SFormRow>
    <SNumberInput v-model="quantity" label="Qty" :min="1" />
    <SButton>Add</SButton>
  </SFormRow>
</SForm>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SInput type="number" v-model="qty" />` (1.21.0+) | `<SNumberInput v-model="qty" :min="0" />` |
| `<SNumberInput v-model.number="qty" />` | `<SNumberInput v-model="qty" />` — the value is already a number |
| `<SNumberInput type="number" />` / `inputmode="decimal"` | No `type` or `inputmode`; it picks the keyboard from `min` and `precision` |
| `<SNumberInput allow-decimal />` (SInput prop) | `<SNumberInput :precision="2" />` |
| `<SNumberInput positive />` (SInput prop) | `<SNumberInput :min="1" />` (or `:min="0"` and a rule) |
| `<SNumberInput step="0.01" />` for money, expecting `5.00` | `<SNumberInput :precision="2" :step="0.01" />` (precision controls the decimals shown) |
| `control-variant="default"` / `"hidden"` (Vuetify) | `control-variant="stacked"` / `"split"`, or `hide-controls` |
| `<SNumberInput :rules="[v => !!v \|\| 'Required']" />` | `v => v !== null \|\| 'Required'` — `0` is falsy but a valid value |
| A row of `SNumberInput` + `SButton` in a plain flex `div` | Wrap them in `SFormRow` so the button lines up with the field box |

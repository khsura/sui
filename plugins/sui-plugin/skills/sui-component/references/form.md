# Form Components

**Import:** `import { SForm, SInput, STextarea, SSelect, SCheckbox, SRadio, SRadioGroup, SSwitch, SFormInputError } from '@khsura/sui'`
**Types:** `import type { FormComponent, SelectItem, FormInputModelValueRule } from '@khsura/sui'`

`SAutocomplete` → see [autocomplete.md](./autocomplete.md). `SDatePickerInput` → see [date-picker.md](./date-picker.md).

Types: `node_modules/@khsura/sui/@types/definitions/props/props{Input,Textarea,Select,Checkbox,RadioGroup,Switch,FormInput}.d.ts`

---

## Validation model (read first)

Shared form-input props (`SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadioGroup`, `SDatePickerInput`):

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rules` | `FormInputModelValueRule[]` | `undefined` | `(value) => true \| string` — a string is the error message |
| `id` | `string` | auto/`undefined` | Element id |
| `disabled` / `readonly` | `boolean \| null` | `undefined` | Disabled inputs show no errors |
| `hideDetails` | `boolean` | `undefined` | Hide the label above the field + error area (`SCheckbox` / `SRadio` keep their own label) |
| `hideError` | `boolean` | `undefined` | Hide only the error message |
| `error` / `dirty` | `boolean` | `undefined` | Typed; `dirty` only syncs the internal flag — neither triggers validation |

Shared events: `update:error` (`boolean`), `update:errors` (`string[]`), `update:dirty` (`boolean`), plus `change` where noted.

- Rules run when the value changes (or the `disabled` prop changes) and when `SForm.validate()` is called. Not on mount.
- Only the **first** error is shown, rendered as HTML — never put user input in a message.
- `SSwitch` and `SAutocomplete` do **not** run rules and do not register with `SForm`.
- `getFormInputModelValueRules({ t })` (exported) builds common rules (`required`, `maxLength`, `numeric`, …) from vue-i18n `formRules.*` messages.

---

## SForm

Renders a native `<form novalidate>` and collects child inputs. Native browser validation is off, so `type="email"` / `required` never show the browser bubble over the SUI error; validate with `rules`. `:novalidate="false"` turns it back on. Before 1.20.0 `SForm` did not add `novalidate`; add it yourself there.

Every validated field reserves one error line under itself. For an action row (field + button: search bar, filter bar) use `SFormRow` (below), never a plain flex `<div>`, where the button lines up with the label. Field labels are inset 16px to line up with the value text inside the field.

| Model | Type | Description |
|-------|------|-------------|
| `v-model` | `boolean` | `true` when there are no errors (updated after validation) |
| `v-model:errors` | `string[]` | All current error messages |
| `v-model:error` | `boolean` | `true` when there are errors |

<!-- generated:api:start SForm -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SForm props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `error` | `boolean` | — | no | — |
| `errors` | `string[]` | `[]` | no | — |
| `modelValue` | `boolean` | — | no | — |

**SForm slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SForm events**

| Event | Payload |
| --- | --- |
| `submit` | `[Event]` |
| `update:error` | `[value: boolean \| undefined]` |
| `update:errors` | `[value: string[]]` |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end SForm -->

**SForm notes**

- `submit` (event): Native submit — **not** prevented; use `@submit.prevent`

Exposed: `validate(): boolean` — **returns `true` when there ARE errors**; `resetValidation()`.

---

## SFormRow

*Since 1.20.0.* A wrapping row of text fields (`SInput`, `SSelect`, `SDatePickerInput`, `SAutocomplete`, `STextarea`) and their buttons. Each button's top and bottom match the field box: with or without a label, while an error shows, and when the row wraps at 375px. No props; slot `default`.

<!-- generated:api:start SFormRow -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SFormRow props**

None.

**SFormRow slots**

| Slot | Slot props | Description |
| --- | --- | --- |
| `default` | `any` | The fields and buttons of the row. |

**SFormRow events**

None.

<!-- generated:api:end SFormRow -->

```vue
<SFormRow>
  <SDatePickerInput v-model="from" label="From" />
  <SSelect v-model="status" label="Status" :items="statuses" />
  <SButton color="primary" @click="apply">Apply</SButton>
</SFormRow>
```

- `SInput` / `STextarea` / `SAutocomplete` (and `grow` `SSelect`, `block` `SDatePickerInput`) share the free width; `SSelect` / `SDatePickerInput` otherwise keep their own width; buttons keep theirs; the row wraps when they don't fit. Each field keeps its error line; buttons reserve the same space, so wrapped lines and the next row keep their gap.
- Don't mix a `simple` field into it (its label is shorter). Before 1.20.0 there is no `SFormRow`: put `hide-details` on the field in a flex row.

---

## SInput

<!-- generated:api:start SInput -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SInput props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `allowDecimal` | `boolean \| null` | — | no | — |
| `appendOuter` | `string \| null` | — | no | — |
| `ariaLabel` | `string` | — | no | — |
| `ariaLabelledby` | `string` | — | no | — |
| `autocapitalize` | `"off" \| "on" \| null` | — | no | `off`, `on` |
| `autocomplete` | `string \| null` | — | no | — |
| `autofocus` | `boolean \| null` | — | no | — |
| `dense` | `boolean` | — | no | — |
| `dirty` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `error` | `boolean` | — | no | — |
| `hideDetails` | `boolean` | — | no | — |
| `hideError` | `boolean` | — | no | — |
| `id` | `string` | — | no | — |
| `inputBackground` | `string \| null` | — | no | — |
| `inputmode` | `InputModeTypeText \| null` | — | no | `decimal`, `email`, `none`, `numeric`, `search`, `tel`, `text`, `url` |
| `isPasteDisabled` | `boolean` | — | no | — |
| `label` | `string \| null` | — | no | — |
| `max` | `number \| string \| null` | — | no | — |
| `maxlength` | `number \| string \| null` | — | no | — |
| `min` | `number \| string \| null` | — | no | — |
| `minlength` | `number \| string \| null` | — | no | — |
| `modelValue` | `T \| null` | — | no | — |
| `name` | `string` | — | no | — |
| `pattern` | `string \| null` | — | no | — |
| `placeholder` | `string \| null` | — | no | — |
| `placeholderBackground` | `string \| null` | — | no | — |
| `positive` | `boolean \| null` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — |
| `simple` | `boolean \| null` | — | no | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` |
| `spellcheck` | `boolean \| null` | — | no | — |
| `suffix` | `string \| null` | — | no | — |
| `textRight` | `boolean \| null` | — | no | — |
| `tile` | `boolean` | — | no | — |
| `type` | `InputTypeText \| null` | — | no | `date`, `datetime-local`, `email`, `number`, `password`, `search`, `tel`, `text`, `time`, `url`, `week` |
| `usePreviousValueWhenExceeded` | `boolean \| null` | — | no | — |

**SInput slots**

| Slot | Slot props |
| --- | --- |
| `appendOuter` | `{}` |
| `suffix` | `{}` |

**SInput events**

| Event | Payload |
| --- | --- |
| `autocomplete` | `[HTMLInputElement \| null]` |
| `blur` | `[Event]` |
| `change` | `[string \| number \| null]` |
| `focus` | `[Event]` |
| `input` | `[Event]` |
| `keydown` | `[KeyboardEvent]` |
| `paste` | `[ClipboardEvent]` |
| `update:dirty` | `[boolean]` |
| `update:error` | `[boolean]` |
| `update:errors` | `[string[]]` |
| `update:modelValue` | `[value: T \| null \| undefined]` |

<!-- generated:api:end SInput -->

**SInput notes**

- `label`: Label above the field
- `placeholder`: Placeholder
- `type`: Input type (default: native (`text`))
- `inputmode`: Mobile keyboard
- `suffix` / `appendOuter`: Text inside / outside the field (or use the slots)
- `simple`: Underline-only style
- `dense` / `tile` / `textRight`: Compact / square / right-aligned
- `min` / `max`: Bounds (enforced for `type="number"`)
- `positive` / `allowDecimal`: Number input: >0 only / accept decimals
- `usePreviousValueWhenExceeded`: Over `max`: keep the previous value instead of clamping
- `minlength` / `maxlength` / `pattern`: Native attributes
- `name`, `autocomplete`, `autocapitalize`, `autofocus`, `spellcheck`, `ariaLabelledby`: Native attributes
- `isPasteDisabled`: Block paste
- `inputBackground` / `placeholderBackground`: Field / placeholder background (preset or CSS color)
- `size`: Preset size

Model: `v-model` — `string | number | null`. Slots: `suffix`, `appendOuter` (no `label` slot). Events: `change`, `input`, `focus`, `blur`, `keydown`, `paste`, `autocomplete` + shared. Exposed: `validate()`.

## STextarea

Props: `label`, `placeholder`, `rows` (default `2`), `cols` (default `20`), **`autogrow`** (not `autoGrow`), `resize` (default off → `resize: none`), **`counter`** (character count at the right of the error line; `12 / 200` with `maxlength`), `simple`, `dense`, `tile`, `minlength`, `maxlength`, `name`, `autocomplete`, `autocapitalize`, `autofocus`, `spellcheck`, `ariaLabelledby`, `inputBackground`, `placeholderBackground`, `size` + shared. Model: `string` (`null` → `''`). Events: `change`, `input`, `blur`, `keydown` + shared. No slots. Exposed: `validate()`.

<!-- generated:api:start STextarea -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**STextarea props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | — | no | — | — |
| `ariaLabelledby` | `string` | — | no | — | — |
| `autocapitalize` | `"off" \| "on"` | — | no | `off`, `on` | — |
| `autocomplete` | `string` | — | no | — | — |
| `autofocus` | `boolean` | — | no | — | — |
| `autogrow` | `boolean` | — | no | — | — |
| `cols` | `number` | `20` | no | — | — |
| `counter` | `boolean` | — | no | — | Shows the character count (`12 / 200` with `maxlength`) at the right of the error line, right under the field. |
| `dense` | `boolean` | — | no | — | — |
| `dirty` | `boolean` | — | no | — | — |
| `disabled` | `boolean \| null` | — | no | — | — |
| `error` | `boolean` | — | no | — | — |
| `hideDetails` | `boolean` | — | no | — | — |
| `hideError` | `boolean` | — | no | — | — |
| `id` | `string` | — | no | — | — |
| `inputBackground` | `string` | — | no | — | — |
| `label` | `string` | — | no | — | — |
| `maxlength` | `number \| string` | — | no | — | — |
| `minlength` | `number \| string` | — | no | — | — |
| `modelValue` | `string` | `""` | no | — | — |
| `name` | `string` | — | no | — | — |
| `placeholder` | `string` | — | no | — | — |
| `placeholderBackground` | `string` | — | no | — | — |
| `readonly` | `boolean \| null` | — | no | — | — |
| `resize` | `boolean` | — | no | — | — |
| `rows` | `number` | `2` | no | — | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — | — |
| `simple` | `boolean` | — | no | — | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `spellcheck` | `boolean` | — | no | — | — |
| `tile` | `boolean` | — | no | — | — |

**STextarea slots**

None.

**STextarea events**

| Event | Payload |
| --- | --- |
| `autocomplete` | `[HTMLInputElement \| null]` |
| `blur` | `[Event]` |
| `change` | `[string]` |
| `focus` | `[Event]` |
| `input` | `[Event]` |
| `keydown` | `[KeyboardEvent]` |
| `paste` | `[ClipboardEvent]` |
| `update:dirty` | `[boolean]` |
| `update:error` | `[boolean]` |
| `update:errors` | `[string[]]` |
| `update:modelValue` | `[value: string]` |

<!-- generated:api:end STextarea -->

## SSelect

Single-value dropdown (no `multiple`, `chips`, `clearable` or `placeholder` — use [SAutocomplete](./autocomplete.md) for those).

<!-- generated:api:start SSelect -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSelect props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `activator` | `string \| ComponentPublicInstance \| HTMLElement \| null` | — | no | — | — |
| `ariaLabel` | `string \| null` | — | no | — | Accessible name when there is no visible `label` (otherwise the label names the field). |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — | — |
| `closeOnClick` | `boolean` | — | no | — | — |
| `closeOnContentClick` | `boolean` | — | no | — | — |
| `closeOnScroll` | `boolean` | — | no | — | — |
| `color` | `string` | — | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — | — |
| `contentStyle` | `StyleValue` | — | no | — | — |
| `dense` | `boolean` | — | no | — | — |
| `dirty` | `boolean` | — | no | — | — |
| `disabled` | `boolean \| null` | — | no | — | — |
| `divided` | `boolean` | — | no | — | — |
| `error` | `boolean` | — | no | — | — |
| `grow` | `boolean` | — | no | — | — |
| `height` | `number \| string \| null` | — | no | — | — |
| `hideDetails` | `boolean` | — | no | — | — |
| `hideError` | `boolean` | — | no | — | — |
| `id` | `string` | — | no | — | — |
| `items` | `(string \| SelectItem \| null \| undefined)[]` | — | no | — | — |
| `label` | `string \| null` | — | no | — | — |
| `location` | `LocationRaw` | — | no | — | — |
| `maxHeight` | `number \| string \| null` | — | no | — | — |
| `maxWidth` | `number \| string \| null` | — | no | — | — |
| `menu` | `boolean` | — | no | — | — |
| `minHeight` | `number \| string \| null` | — | no | — | — |
| `minWidth` | `number \| string \| null` | — | no | — | — |
| `modelValue` | `T \| null` | — | no | — | — |
| `name` | `string \| null` | — | no | — | — |
| `offsetX` | `number \| null` | — | no | — | — |
| `offsetY` | `number \| null` | — | no | — | — |
| `outlined` | `boolean \| null` | `true` | no | — | — |
| `placeholder` | `string \| null` | — | no | — | Text shown in the field while nothing is selected. The label is never repeated inside the field. |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` | — |
| `preventCloseOnClick` | `boolean` | — | no | — | — |
| `readonly` | `boolean \| null` | — | no | — | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — | — |
| `screenPadding` | `number \| null` | — | no | — | — |
| `text` | `boolean` | — | no | — | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `underlined` | `boolean \| null` | — | no | — | — |
| `width` | `number \| string \| null` | — | no | — | — |

**SSelect slots**

| Slot | Slot props |
| --- | --- |
| `activator` | `{ item: SelectItem \| null; value: boolean \| undefined; }` |
| `dropdownIcon` | `{ color: string \| undefined; value: boolean \| undefined; }` |

**SSelect events**

| Event | Payload |
| --- | --- |
| `change` | `[T \| null]` |
| `update:dirty` | `[boolean]` |
| `update:error` | `[boolean]` |
| `update:errors` | `[string[]]` |
| `update:menu` | `[value: boolean \| undefined]` |
| `update:modelValue` | `[value: T \| null \| undefined]` |

<!-- generated:api:end SSelect -->

**SSelect notes**

- `items`: Options
- `label`: Label above the field (never repeated inside it)
- `placeholder`: Text shown in the field while nothing is selected
- Width: as wide as the longest option or placeholder, like a native select; a long selection is clipped with an ellipsis; a long option in the list stays on one line with an ellipsis and its full text in `title`
- `name`: Name of a hidden native `<select>`
- `dense` / `grow` / `text` / `divided`: Compact / full width / text list style / list dividers
- `color`: List color
- `outlined`: default **`true`** (matches `SInput`); `:outlined="false"` for the borderless, shadowed look
- `underlined` / `borderRadius`: Activator border
- `location`, `offsetX`, `offsetY`, …: Dropdown positioning

```ts
interface SelectItem { text: string; value: string | number | null | undefined; disabled?: boolean }
```

Model: `v-model` — `string | number | null`; `v-model:menu` — open state. Slots: `activator` `{ item, value }`, `dropdownIcon` `{ color, value }`. Events: shared only (`change` is not emitted — use `update:modelValue`).

## SCheckbox

Boolean only. Props: `label`, `color` (preset name only), `size` (`'default' | 'large'`), `block`, `bordered` + shared. Model: `boolean`. Events: `change` (`boolean`) + shared. No `value`, `indeterminate` or array/group model. The error line sits under the box; `hideDetails` removes only the error area, never the label.

<!-- generated:api:start SCheckbox -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCheckbox props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `block` | `boolean` | — | no | — |
| `bordered` | `boolean` | — | no | — |
| `color` | `PresetColor` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `dirty` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `error` | `boolean` | — | no | — |
| `hideDetails` | `boolean` | — | no | — |
| `hideError` | `boolean` | — | no | — |
| `id` | `string` | — | no | — |
| `label` | `string` | — | no | — |
| `modelValue` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — |
| `size` | `"default" \| "large"` | — | no | `default`, `large` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SCheckbox slots**

None.

**SCheckbox events**

| Event | Payload |
| --- | --- |
| `change` | `[value: boolean]` |
| `update:dirty` | `[value: boolean]` |
| `update:error` | `[value: boolean]` |
| `update:errors` | `[value: string[]]` |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end SCheckbox -->

## SRadioGroup / SRadio

Options are **`SRadio` children** — there is no `items` prop. Long option labels wrap; the group's `hideDetails` removes only its error area (labels stay). Options have no background (before 1.20.0 a group with no value showed grey chips behind its options).

`SRadioGroup` props: `name`, `column`, `grow`, `color` (preset name), `mandatory`, `outlined` / `underlined` / `borderRadius` + shared. Model: `string | number | boolean`. Events: `change` + shared.

`SRadio` props: `value` (falls back to `:key`), `label`, `id`, `name`, `disabled`, `readonly`, `outlined`, `type` (button type). Slot `label` `{ attrs }`. Event `update:checked` (`boolean`).

<!-- generated:api:start SRadioGroup -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SRadioGroup props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `color` | `string \| null` | — | no | — |
| `column` | `boolean \| null` | — | no | — |
| `continuous` | `boolean` | — | no | — |
| `dirty` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `error` | `boolean` | — | no | — |
| `grow` | `boolean \| null` | — | no | — |
| `hideDetails` | `boolean` | — | no | — |
| `hideError` | `boolean` | — | no | — |
| `id` | `string` | — | no | — |
| `mandatory` | `boolean` | — | no | — |
| `modelValue` | `GroupItemValue` | — | no | — |
| `name` | `string` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — |
| `underlined` | `boolean \| null` | — | no | — |

**SRadioGroup slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SRadioGroup events**

| Event | Payload |
| --- | --- |
| `change` | `[value: GroupItemValue \| null]` |
| `update:dirty` | `[value: boolean]` |
| `update:error` | `[value: boolean]` |
| `update:errors` | `[value: string[]]` |
| `update:menu` | `[value: boolean \| null \| undefined]` |
| `update:modelValue` | `[value: GroupItemValue \| undefined]` |

<!-- generated:api:end SRadioGroup -->

<!-- generated:api:start SRadio -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SRadio props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — | — |
| `ariaLabel` | `string \| null` | — | no | — | Accessible name for a radio without a visible `label` (for example an icon-only option). |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — | — |
| `disabled` | `boolean \| null` | — | no | — | — |
| `id` | `string` | — | no | — | — |
| `label` | `string \| null` | — | no | — | — |
| `name` | `string \| null` | — | no | — | — |
| `outlined` | `boolean \| null` | — | no | — | — |
| `readonly` | `boolean \| null` | — | no | — | — |
| `selected` | `boolean` | — | no | — | — |
| `type` | `ButtonTypeType` | — | no | `button`, `reset`, `submit` | — |
| `underlined` | `boolean \| null` | — | no | — | — |
| `value` | `boolean \| number \| string` | — | no | — | — |

**SRadio slots**

| Slot | Slot props |
| --- | --- |
| `label` | `{ attrs: { class: { s_radio__label: boolean; 's_radio__label--checked': boolean; }; }; }` |

**SRadio events**

| Event | Payload |
| --- | --- |
| `update:checked` | `[value: boolean]` |

<!-- generated:api:end SRadio -->

## SSwitch

Props: `label`, `color`, `id`, `disabled`, `readonly`. Model: `boolean`. Slot: `label`. Rules/`hideDetails` are typed but ignored — no error display, not registered with `SForm`.

<!-- generated:api:start SSwitch -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSwitch props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `dirty` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `error` | `boolean` | — | no | — |
| `hideDetails` | `boolean` | — | no | — |
| `hideError` | `boolean` | — | no | — |
| `id` | `string` | — | no | — |
| `label` | `string \| null` | — | no | — |
| `modelValue` | `boolean` | — | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `rules` | `FormInputModelValueRule[]` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SSwitch slots**

| Slot | Slot props |
| --- | --- |
| `label` | `{}` |

**SSwitch events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: boolean \| undefined]` |

<!-- generated:api:end SSwitch -->

## SFormInputError

Props: `errors: string[]` (shows the first, as HTML), `simple: boolean`. For custom inputs.

<!-- generated:api:start SFormInputError -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SFormInputError props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `errors` | `string[]` | `[]` | no | — |
| `simple` | `boolean \| null` | `false` | no | — |

**SFormInputError slots**

None.

**SFormInputError events**

None.

<!-- generated:api:end SFormInputError -->

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormComponent } from '@khsura/sui'

const formRef = ref<FormComponent | null>(null)
const valid = ref(false)
const model = ref({ name: '', email: '', country: null, agree: false, plan: 'free', notify: true })
const required = (v: unknown) => !!v || 'Required'

const submit = () => {
  const hasErrors = formRef.value?.validate()
  if (hasErrors) return
  save(model.value)
}
</script>

<template>
  <SForm ref="formRef" v-model="valid" @submit.prevent="submit">
    <SInput v-model="model.name" label="Name" :rules="[required]" />
    <SInput v-model="model.email" label="Email" type="text" inputmode="email" autocomplete="email" :rules="[required, v => /.+@.+/.test(String(v)) || 'Invalid email']" />
    <SSelect
      v-model="model.country"
      label="Country"
      :items="[{ text: 'Canada', value: 'ca' }, { text: 'Japan', value: 'jp' }]"
      :rules="[required]"
    />
    <SCheckbox v-model="model.agree" label="I agree" :rules="[v => !!v || 'You must agree']" />
    <SRadioGroup v-model="model.plan" mandatory>
      <SRadio value="free" label="Free" />
      <SRadio value="pro" label="Pro" />
    </SRadioGroup>
    <SSwitch v-model="model.notify" label="Email notifications" />
    <SButton type="submit" color="primary">Save</SButton>
  </SForm>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `if (form.validate()) submit()` | `validate()` returns `true` when there **are** errors: `if (!form.validate()) submit()` |
| `<SForm @submit="…">` | `@submit.prevent` — otherwise the page reloads |
| `:dirty="true"` to show errors | Call `formRef.validate()` (or change the value) |
| `{ title: 'Canada', value: 'ca' }` | `{ text: 'Canada', value: 'ca' }` |
| `<SRadioGroup :items="…">` | `SRadio` children |
| `<STextarea auto-grow>` | `<STextarea autogrow>` |
| `<SInput><template #label>` | No `label` slot — use the `label` prop |
| `<SCheckbox size="small">` | Only `'default' \| 'large'` |
| `rules` on `SSwitch` / `SAutocomplete` | Validate those values yourself |

- `SRadioGroup` without `mandatory`: clicking the selected radio clears the value.
- `SSelect` validates when its menu opens, so a required error can appear on first open.
- `SSelect` / `SAutocomplete` / `SDatePickerInput` dropdowns flip or shift to stay 8px inside the viewport — no wrapper, padding or `location` workaround needed for fields at the bottom or right edge.

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
| `hideDetails` | `boolean` | `undefined` | Hide label + error area |
| `hideError` | `boolean` | `undefined` | Hide only the error message |
| `error` / `dirty` | `boolean` | `undefined` | Typed; `dirty` only syncs the internal flag — neither triggers validation |

Shared events: `update:error` (`boolean`), `update:errors` (`string[]`), `update:dirty` (`boolean`), plus `change` where noted.

- Rules run when the value changes (or the `disabled` prop changes) and when `SForm.validate()` is called. Not on mount.
- Only the **first** error is shown, rendered as HTML — never put user input in a message.
- `SSwitch` and `SAutocomplete` do **not** run rules and do not register with `SForm`.
- `getFormInputModelValueRules({ t })` (exported) builds common rules (`required`, `maxLength`, `numeric`, …) from vue-i18n `formRules.*` messages.

---

## SForm

Renders a native `<form>` and collects child inputs.

| Model | Type | Description |
|-------|------|-------------|
| `v-model` | `boolean` | `true` when there are no errors (updated after validation) |
| `v-model:errors` | `string[]` | All current error messages |
| `v-model:error` | `boolean` | `true` when there are errors |

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `Event` | Native submit — **not** prevented; use `@submit.prevent` |

Exposed: `validate(): boolean` — **returns `true` when there ARE errors**; `resetValidation()`.

---

## SInput

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `undefined` | Label above the field |
| `placeholder` | `string \| null` | `undefined` | Placeholder |
| `type` | `'text' \| 'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'date' \| 'datetime-local' \| 'time' \| 'week'` | native (`text`) | Input type |
| `inputmode` | `'none' \| 'text' \| 'numeric' \| 'decimal' \| 'email' \| 'tel' \| 'url' \| 'search'` | `undefined` | Mobile keyboard |
| `suffix` / `appendOuter` | `string \| null` | `undefined` | Text inside / outside the field (or use the slots) |
| `simple` | `boolean \| null` | `undefined` | Underline-only style |
| `dense` / `tile` / `textRight` | `boolean` | `undefined` | Compact / square / right-aligned |
| `min` / `max` | `string \| number \| null` | `undefined` | Bounds (enforced for `type="number"`) |
| `positive` / `allowDecimal` | `boolean \| null` | `undefined` | Number input: >0 only / accept decimals |
| `usePreviousValueWhenExceeded` | `boolean \| null` | `undefined` | Over `max`: keep the previous value instead of clamping |
| `minlength` / `maxlength` / `pattern` | — | `undefined` | Native attributes |
| `name`, `autocomplete`, `autocapitalize`, `autofocus`, `spellcheck`, `ariaLabelledby` | — | `undefined` | Native attributes |
| `isPasteDisabled` | `boolean` | `undefined` | Block paste |
| `inputBackground` / `placeholderBackground` | `string \| null` | `undefined` | Field / placeholder background (preset or CSS color) |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |

Model: `v-model` — `string | number | null`. Slots: `suffix`, `appendOuter` (no `label` slot). Events: `change`, `input`, `focus`, `blur`, `keydown`, `paste`, `autocomplete` + shared. Exposed: `validate()`.

## STextarea

Props: `label`, `placeholder`, `rows` (default `2`), `cols` (default `20`), **`autogrow`** (not `autoGrow`), `resize` (default off → `resize: none`), `simple`, `dense`, `tile`, `minlength`, `maxlength`, `name`, `autocomplete`, `autocapitalize`, `autofocus`, `spellcheck`, `ariaLabelledby`, `inputBackground`, `placeholderBackground`, `size` + shared. Model: `string` (`null` → `''`). Events: `change`, `input`, `blur`, `keydown` + shared. No slots. Exposed: `validate()`.

## SSelect

Single-value dropdown (no `multiple`, `chips`, `clearable` or `placeholder` — use [SAutocomplete](./autocomplete.md) for those).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<SelectItem \| string \| null \| undefined>` | `undefined` | Options |
| `label` | `string \| null` | `undefined` | Label above, **and** the text shown while nothing is selected |
| `name` | `string \| null` | `undefined` | Name of a hidden native `<select>` |
| `dense` / `grow` / `text` / `divided` | `boolean` | `undefined` | Compact / full width / text list style / list dividers |
| `color` | `string` | `undefined` | List color |
| `outlined` / `underlined` / `borderRadius` | border props | `undefined` | Activator border |
| `location`, `offsetX`, `offsetY`, … | menu props | `undefined` | Dropdown positioning |

```ts
interface SelectItem { text: string; value: string | number | null | undefined; disabled?: boolean }
```

Model: `v-model` — `string | number | null`; `v-model:menu` — open state. Slots: `activator` `{ item, value }`, `dropdownIcon` `{ color, value }`. Events: shared only (`change` is not emitted — use `update:modelValue`).

## SCheckbox

Boolean only. Props: `label`, `color` (preset name only), `size` (`'default' | 'large'`), `block`, `bordered` + shared. Model: `boolean`. Events: `change` (`boolean`) + shared. No `value`, `indeterminate` or array/group model.

## SRadioGroup / SRadio

Options are **`SRadio` children** — there is no `items` prop.

`SRadioGroup` props: `name`, `column`, `grow`, `color` (preset name), `mandatory`, `outlined` / `underlined` / `borderRadius` + shared. Model: `string | number | boolean`. Events: `change` + shared.

`SRadio` props: `value` (falls back to `:key`), `label`, `id`, `name`, `disabled`, `readonly`, `outlined`, `type` (button type). Slot `label` `{ attrs }`. Event `update:checked` (`boolean`).

## SSwitch

Props: `label`, `color`, `id`, `disabled`, `readonly`. Model: `boolean`. Slot: `label`. Rules/`hideDetails` are typed but ignored — no error display, not registered with `SForm`.

## SFormInputError

Props: `errors: string[]` (shows the first, as HTML), `simple: boolean`. For custom inputs.

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
    <SInput v-model="model.email" label="Email" type="email" :rules="[required, v => /.+@.+/.test(String(v)) || 'Invalid email']" />
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

# Form Components

**Import:** `import { SForm, SInput, STextarea, SSelect, SAutocomplete, SCheckbox, SRadio, SRadioGroup, SSwitch, SFormInputError } from '@khsura/sui'`

**Types:** `import type { FormComponent, SelectItem, FormInputModelValueRule } from '@khsura/sui'`

---

## Common Form Input Props

`SInput`, `STextarea`, `SSelect`, `SCheckbox` and `SRadioGroup` share these base props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `undefined` | Input element id |
| `disabled` | `boolean \| null` | `undefined` | Disable the input (a disabled input shows no errors) |
| `readonly` | `boolean \| null` | `undefined` | Read-only |
| `rules` | `FormInputModelValueRule[]` | `undefined` | Validation rules array |
| `hideDetails` | `boolean` | `undefined` | Hide label and error message area |
| `hideError` | `boolean` | `undefined` | Hide only the error message |
| `error` | `boolean` | `undefined` | Typed; does not trigger validation |
| `dirty` | `boolean` | `undefined` | Syncs the internal dirty flag; does not trigger validation |

Shared events: `update:error` (`boolean`), `update:errors` (`string[]`), `update:dirty` (`boolean`).

### Validation Rule signature

```typescript
type FormInputModelValueRule = (value: unknown) => true | string
// Return `true` to pass, or an error message string to fail
```

- Rules run when the value changes (or `disabled` changes) and when `SForm`'s `validate()` is called — not on mount, and not because of `dirty`.
- Only the first error is shown, and it is rendered as HTML — never put user input in a message.
- `SSwitch` and `SAutocomplete` do **not** run rules and do not register with `SForm`.

---

## SForm

Renders a native `<form>` and coordinates validation across child inputs.

### Model

| Model | Type | Description |
|-------|------|-------------|
| `v-model` | `boolean` | `true` when there are no errors (updated after validation) |
| `v-model:errors` | `string[]` | All current error messages |
| `v-model:error` | `boolean` | `true` when there are errors |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Form inputs |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `Event` | Native form submit — **not** prevented; use `@submit.prevent` |

### Exposed methods

- `validate(): boolean` — runs every registered input's rules. **Returns `true` when there ARE errors.**
- `resetValidation()` — clears every input's validation state.

---

## SInput

Single-line text input field.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `undefined` | Label above the field |
| `placeholder` | `string \| null` | `undefined` | Placeholder text |
| `type` | `InputTypeText` | `undefined` (native `text`) | Input type: `text`, `password`, `email`, `number`, `tel`, `url`, `search`, `date`, `datetime-local`, `time`, `week` |
| `inputmode` | `InputModeTypeText` | `undefined` | Mobile keyboard hint: `numeric`, `decimal`, `email`, `tel`, etc. |
| `suffix` | `string \| null` | `undefined` | Static text appended inside the input |
| `appendOuter` | `string \| null` | `undefined` | Text appended outside the input |
| `simple` | `boolean \| null` | `undefined` | Minimal (underline-only) styling |
| `dense` | `boolean` | `undefined` | Compact height |
| `tile` | `boolean` | `undefined` | No border radius |
| `textRight` | `boolean \| null` | `undefined` | Right-align text |
| `max` / `min` | `string \| number \| null` | `undefined` | Bounds (enforced for `type="number"`) |
| `usePreviousValueWhenExceeded` | `boolean \| null` | `undefined` | Over `max`: keep the previous value instead of clamping |
| `maxlength` / `minlength` | `string \| number \| null` | `undefined` | Character limits |
| `pattern` | `string \| null` | `undefined` | HTML validation pattern |
| `autocomplete` | `string \| null` | `undefined` | Browser autocomplete hint |
| `autocapitalize` | `'on' \| 'off' \| null` | `undefined` | Native attribute |
| `autofocus` | `boolean \| null` | `undefined` | Auto-focus on mount |
| `spellcheck` | `boolean \| null` | `undefined` | Enable spellcheck |
| `ariaLabelledby` | `string` | `undefined` | Native `aria-labelledby` |
| `isPasteDisabled` | `boolean` | `undefined` | Block paste events |
| `positive` | `boolean \| null` | `undefined` | Restrict to positive numbers |
| `allowDecimal` | `boolean \| null` | `undefined` | Accept decimals with `type="number"` (`min` / `positive` are enforced on blur) |
| `inputBackground` / `placeholderBackground` | `string \| null` | `undefined` | Field / placeholder background (preset or CSS color) |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `name` | `string` | `undefined` | Input name for forms |

### Model

`v-model` — the input's current value (`string | number | null`).

### Events

`change`, `input`, `focus`, `blur`, `keydown`, `paste`, `autocomplete`, plus the shared events.

### Slots

| Slot | Description |
|------|-------------|
| `suffix` | Custom suffix content |
| `appendOuter` | Custom append-outer content |

There is no `label` slot — use the `label` prop.

---

## STextarea

Multi-line text input.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Label above the field |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `rows` | `number` | `2` | Number of visible rows |
| `cols` | `number` | `20` | Number of visible columns |
| `autogrow` | `boolean` | `undefined` | Auto-resize height (note: `autogrow`, not `autoGrow`) |
| `resize` | `boolean` | `undefined` | Allow manual resize (off → `resize: none`) |
| `simple` / `dense` / `tile` | `boolean` | `undefined` | Same as `SInput` |
| `minlength` / `maxlength` | `string \| number` | `undefined` | Character limits |
| `name`, `autocomplete`, `autocapitalize`, `autofocus`, `spellcheck`, `ariaLabelledby` | — | `undefined` | Native attributes |
| `inputBackground` / `placeholderBackground` | `string` | `undefined` | Field / placeholder background |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |

### Model

`v-model` — `string` (`null` becomes `''`).

---

## SSelect

Single-value dropdown selection input. It has no `multiple`, `chips`, `clearable` or `placeholder` props — use `SAutocomplete` for those.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<SelectItem \| string \| null \| undefined>` | `undefined` | Dropdown options |
| `label` | `string \| null` | `undefined` | Label above the field, and the text shown while nothing is selected |
| `name` | `string \| null` | `undefined` | Name of a hidden native `<select>` |
| `dense` | `boolean` | `undefined` | Compact height |
| `grow` | `boolean` | `undefined` | Full width |
| `text` | `boolean` | `undefined` | Text list style |
| `divided` | `boolean` | `undefined` | Dividers between list items |
| `color` | `string` | `undefined` | List color |
| `outlined` / `underlined` / `borderRadius` | border props | `undefined` | Activator border |
| `location` / `offsetX` / `offsetY` | menu props | `undefined` | Dropdown positioning |

### SelectItem shape

```typescript
interface SelectItem {
  text: string                               // Display label
  value: string | number | null | undefined  // Stored value
  disabled?: boolean
}
// Or a plain string (text === value)
```

### Model

`v-model` — selected value; `v-model:menu` — dropdown open state.

### Slots

| Slot | Description |
|------|-------------|
| `activator` | Custom activator — receives `{ item, value }` |
| `dropdownIcon` | Custom dropdown icon — receives `{ color, value }` |

---

## SAutocomplete

Searchable select with filtering, multiple selection and chips. Full reference: [autocomplete.md](./autocomplete.md).

### Props (selection)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filter` | `(item, queryText) => boolean` | `undefined` | Custom filter function |
| `filterMode` | `'start' \| 'contains' \| 'exact' \| 'none'` | `'contains'` | Built-in filter mode |
| `debounce` | `number` | `500` | Delay (ms) before `searchItem` is emitted |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `chips` | `boolean` | `false` | Show selections as chips |
| `closableChips` | `boolean` | `false` | Allow removing selected items |
| `allowUnlisted` | `boolean` | `false` | Allow typed values not in `items`; emits `createItem` |
| `divided` | `boolean` | `false` | Dividers in dropdown list |
| `loading` | `boolean` | `false` | Loading spinner |
| `delimiter` | `string \| string[] \| RegExp` | `undefined` | Keys that commit the typed text |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `searchItem` (`@search-item`) | `string` | Search text, debounced (for async filtering) |
| `createItem` (`@create-item`) | `SelectItem` | An unlisted value was added |

---

## SCheckbox

Boolean checkbox input.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Checkbox label |
| `color` | `PresetColor` | `undefined` | Check color (preset name) |
| `size` | `'default' \| 'large'` | `undefined` | Checkbox size |
| `block` | `boolean` | `undefined` | Full-width block |
| `bordered` | `boolean` | `undefined` | Bordered style |

There is no `value` or `indeterminate` prop, and no array/group model.

### Model

`v-model` — `boolean`.

---

## SRadio / SRadioGroup

Radio button group. Options are `SRadio` children — there is no `items` prop.

### SRadioGroup Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `column` | `boolean \| null` | `undefined` | Stack vertically |
| `grow` | `boolean \| null` | `undefined` | Stretch radios to fill the row |
| `color` | `string \| null` | `undefined` | Active color |
| `name` | `string` | `undefined` | Native name for the radios |
| `mandatory` | `boolean` | `undefined` | Prevent deselecting the selected radio |
| `outlined` / `underlined` / `borderRadius` | border props | `undefined` | Border styles |

`SRadio` props: `value` (falls back to the vnode `key`), `label`, `id`, `name`, `disabled`, `readonly`, `outlined`, `type`. Slot `label` receives `{ attrs }`.

### Model

`v-model` — selected radio value (`string | number | boolean`). Without `mandatory`, clicking the selected radio clears it.

---

## SSwitch

Toggle switch (on/off). `rules` / `hideDetails` are typed but ignored: no error display, and it does not register with `SForm`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `undefined` | Switch label |
| `color` | `string` | `undefined` | Active track color |
| `id` | `string` | `undefined` | Input id |
| `disabled` / `readonly` | `boolean` | `undefined` | Disable / read-only |

### Model

`v-model` — `boolean`.

### Slots

| Slot | Description |
|------|-------------|
| `label` | Custom label content |

---

## SFormInputError

Error message line for custom inputs. Props: `errors: string[]` (shows the first one, **rendered as HTML**), `simple: boolean`.

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { FormComponent } from '@khsura/sui'

const formRef = ref<FormComponent | null>(null)
const valid = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  country: null,
  tags: [],
  agree: false,
  gender: null,
  notifications: true,
})

const rules = {
  required: (v: unknown) => !!v || 'Required',
  email: (v: unknown) => /.+@.+\..+/.test(String(v)) || 'Invalid email',
  minLength: (n: number) => (v: unknown) => String(v ?? '').length >= n || `Min ${n} characters`,
}

const submit = () => {
  const hasErrors = formRef.value?.validate()
  if (hasErrors) return
  save(form.value)
}
</script>

<template>
  <SForm ref="formRef" v-model="valid" @submit.prevent="submit">
    <!-- Text input with validation -->
    <SInput
      v-model="form.name"
      label="Full Name"
      placeholder="Enter your name"
      :rules="[rules.required]"
    />

    <!-- Email -->
    <SInput
      v-model="form.email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
    />

    <!-- Password -->
    <SInput
      v-model="form.password"
      label="Password"
      type="password"
      :rules="[rules.required, rules.minLength(8)]"
    />

    <!-- Select -->
    <SSelect
      v-model="form.country"
      label="Country"
      :items="[
        { text: 'United States', value: 'us' },
        { text: 'Canada', value: 'ca' },
        { text: 'United Kingdom', value: 'uk' },
      ]"
      :rules="[rules.required]"
    />

    <!-- Autocomplete (searchable, no rules support) -->
    <SAutocomplete
      v-model="form.tags"
      label="Tags"
      :items="availableTags"
      multiple
      chips
      closable-chips
      filter-mode="contains"
    />

    <!-- Checkbox -->
    <SCheckbox
      v-model="form.agree"
      label="I agree to the terms"
      :rules="[v => !!v || 'You must agree']"
    />

    <!-- Radio group -->
    <SRadioGroup v-model="form.gender" mandatory>
      <SRadio value="male" label="Male" />
      <SRadio value="female" label="Female" />
      <SRadio value="other" label="Other" />
    </SRadioGroup>

    <!-- Switch -->
    <SSwitch
      v-model="form.notifications"
      label="Email notifications"
      color="primary"
    />

    <!-- Submit -->
    <SButton type="submit" color="primary" block>Register</SButton>
  </SForm>
</template>
```

## Async Autocomplete (server-side search)

```vue
<SAutocomplete
  v-model="selected"
  :items="searchResults"
  :loading="isSearching"
  filter-mode="none"
  :debounce="300"
  placeholder="Search users..."
  @search-item="onSearch"
/>
```

```typescript
// `searchItem` is already debounced by the `debounce` prop
const onSearch = async (query: string) => {
  isSearching.value = true
  searchResults.value = await api.searchUsers(query) // map to { text, value }
  isSearching.value = false
}
```

## Notes

- `rules` array functions receive the current model value and must return `true` or an error string.
- `hideDetails` prevents the label and error area from rendering — use only when you're handling errors externally.
- `SForm` does NOT validate on mount and does NOT prevent submit; use `@submit.prevent` and call `validate()` on the form ref. `if (!formRef.value.validate()) submit()` — it returns `true` when there are errors.
- `SSelect` validates when its menu opens, so a required error can appear on first open.
- For number inputs, combine `type="number"` with `inputmode="numeric"` for best mobile UX (`inputmode="decimal"` together with `allowDecimal`).

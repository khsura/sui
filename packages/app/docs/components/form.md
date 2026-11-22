# Form Components

**Import:** `import { SForm, SFormRow, SInput, STextarea, SSelect, SAutocomplete, SCheckbox, SRadio, SRadioGroup, SSwitch, SFormInputError } from '@khsura/sui'`

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
| `hideDetails` | `boolean` | `undefined` | Hide the label above the field and the error message area. `SCheckbox` and `SRadio` keep their own label |
| `hideError` | `boolean` | `undefined` | Hide only the error message |
| `error` | `boolean` | `undefined` | Typed; does not trigger validation |
| `dirty` | `boolean` | `undefined` | Syncs the internal dirty flag; does not trigger validation |

### Field layout

The text fields (`SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SDatePickerInput`) share one look: a 1px outlined box on the card background (also while empty), a 16px font (never smaller, so iOS does not zoom on focus) and the same height. The label sits above the field, inset 16px so it lines up with the value text inside the field, not with the field edge.

Under every validated field one line is reserved for its error message, so fields don't jump when errors appear and a form keeps an even rhythm. For an action row (a field next to a button: a search bar, a filter bar), put the fields and buttons in an [`SFormRow`](#sformrow): each button lines up with the field box, not with the label above it or the error line under it. Do not build that row from a plain flex `<div>`: there the button lines up with the label.

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

Renders a native `<form novalidate>` and coordinates validation across child inputs. Native browser validation is off, so `type="email"`, `required` or `pattern` on an input never show the browser's own bubble on top of the SUI error: validate with `rules`. Pass `:novalidate="false"` to turn native validation back on.

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

## SFormRow

*Since 1.20.0.* A wrapping row of text fields (`SInput`, `SSelect`, `SDatePickerInput`, `SAutocomplete`, `STextarea`) and the buttons that act on them. Each button's top and bottom match the field box next to it, with or without a label, while an error shows, and when the row wraps on a phone. Stacked fields outside an `SFormRow` are unchanged.

- No props. `SInput`, `STextarea`, `SAutocomplete`, a `grow` `SSelect` and a `block` `SDatePickerInput` share the free width; `SSelect` and `SDatePickerInput` otherwise keep their own width (as wide as their value), buttons keep theirs, and the row wraps when they don't fit.
- Once any field in the row shows a `label`, the buttons and unlabelled fields start one label height lower, at the top of the field boxes.
- Each field keeps its reserved error line; a button reserves the same space, so wrapped lines and the next row keep their gap. A row whose fields all use `hide-details` adds that gap below itself.
- Aligns the default (outlined) fields and default-size buttons. A `simple` field's label is shorter, so do not mix it into an `SFormRow`.
- Before 1.20.0 there is no `SFormRow`: put `hide-details` on the field in a flex row so its label and error line are not rendered.

| Slot | Description |
|------|-------------|
| `default` | The fields and buttons of the row |

```vue
<SForm ref="formRef" @submit.prevent="search">
  <SFormRow>
    <SInput v-model="query" label="Search" :rules="[required]" />
    <SButton type="submit" color="primary">Search</SButton>
  </SFormRow>
  <SFormRow>
    <SDatePickerInput v-model="from" label="From" />
    <SSelect v-model="status" label="Status" :items="statuses" />
    <SButton color="primary" @click="apply">Apply</SButton>
  </SFormRow>
</SForm>
```

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
| `counter` | `boolean` | `undefined` | Show the character count (`12 / 200` with `maxlength`) at the right of the error line, right under the field |
| `name`, `autocomplete`, `autocapitalize`, `autofocus`, `spellcheck`, `ariaLabelledby` | — | `undefined` | Native attributes |
| `inputBackground` / `placeholderBackground` | `string` | `undefined` | Field / placeholder background |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |

### Model

`v-model` — `string` (`null` becomes `''`).

---

## SSelect

Single-value dropdown selection input. It has no `multiple`, `chips` or `clearable` props — use `SAutocomplete` for those.

It is outlined by default, like `SInput` (`:outlined="false"` for the borderless, shadowed look), and as wide as its longest option or placeholder, like a native select (`grow` for full width). A long selected text is clipped with an ellipsis. In the list, a long option stays on one line and ends in an ellipsis, with its full text in a `title` tooltip (as in `SAutocomplete`).

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<SelectItem \| string \| null \| undefined>` | `undefined` | Dropdown options |
| `label` | `string \| null` | `undefined` | Label above the field. It is not repeated inside the field |
| `placeholder` | `string \| null` | `undefined` | Text shown in the field while nothing is selected |
| `name` | `string \| null` | `undefined` | Name of a hidden native `<select>` |
| `dense` | `boolean` | `undefined` | Compact height |
| `grow` | `boolean` | `undefined` | Full width |
| `text` | `boolean` | `undefined` | Text list style |
| `divided` | `boolean` | `undefined` | Dividers between list items |
| `color` | `string` | `undefined` | List color |
| `outlined` | `boolean \| null` | `true` | Outlined field, like `SInput` |
| `underlined` / `borderRadius` | border props | `undefined` | Activator border |
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

Boolean checkbox input. Its error message sits under the box and reserves the same line as under the other fields. While that error line is shown it also keeps an 8px gap above the box, as a text field's label does, so the error of the field above never touches it. `hideDetails` removes only that error area (and the gap): the label is the checkbox's own text and always shows.

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

Radio button group. Options are `SRadio` children — there is no `items` prop. A long option label wraps inside the group width. `hideDetails` on the group removes only its error area; the option labels always show. Options have no background of their own, in light and dark themes (before 1.20.0 every option of a group with no value yet sat on a grey chip).

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
      type="text"
      inputmode="email"
      autocomplete="email"
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
- `hideDetails` prevents the label above a field and the error area from rendering — use only when you're handling errors externally. `SCheckbox` and `SRadio` keep their labels.
- `SForm` does NOT validate on mount and does NOT prevent submit; use `@submit.prevent` and call `validate()` on the form ref. `if (!formRef.value.validate()) submit()` — it returns `true` when there are errors.
- `SSelect` validates when its menu opens, so a required error can appear on first open.
- The `SSelect`, `SAutocomplete` and `SDatePickerInput` dropdowns stay inside the viewport with an 8px gutter: they flip to the other side of the field or shift (left near the right edge), like `SMenu`. Fields at the bottom or right edge of the screen need no workaround.
- For number inputs, combine `type="number"` with `inputmode="numeric"` for best mobile UX (`inputmode="decimal"` together with `allowDecimal`).

## Accessibility

- Every field ties its `label` to the control and generates an `id` when none is passed. With `hideDetails` the hidden label becomes the control's `aria-label`; a field without any label takes `ariaLabel` (SInput, STextarea, SSelect, SAutocomplete) or, per radio, `aria-label` on SRadio.
- An invalid field gets `aria-invalid="true"` and `aria-describedby` pointing at its error message (a polite live region). SRadioGroup is a `role="radiogroup"` and carries both on the group.
- SSelect is a select-only combobox: Enter, Space, Down or Up opens it; Down/Up/Home/End move the highlighted option; Enter or Space picks; Esc closes. See `docs/a11y.md` for the keyboard checklist.

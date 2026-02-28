# Form Components

**Import:** `import { SForm, SInput, STextarea, SSelect, SAutocomplete, SCheckbox, SRadio, SRadioGroup, SSwitch, SFormInputError } from '@khsura/sui'`

---

## Common Form Input Props

All form inputs share these base props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `undefined` | Input element id |
| `disabled` | `boolean` | `false` | Disable the input |
| `rules` | `FormInputModelValueRule[]` | `undefined` | Validation rules array |
| `hideDetails` | `boolean` | `false` | Hide error message area |
| `error` | `boolean` | `false` | Force error state |
| `dirty` | `boolean` | `false` | Mark as dirty (touched) |

### Validation Rule signature

```typescript
type FormInputModelValueRule = (value: unknown) => true | string
// Return `true` to pass, or an error message string to fail
```

---

## SForm

Wrapper that coordinates validation across child inputs.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Form inputs |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `Event` | Native form submit |

---

## SInput

Single-line text input field.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `undefined` | Floating label |
| `placeholder` | `string \| null` | `undefined` | Placeholder text |
| `type` | `InputTypeText` | `'text'` | Input type: `text`, `password`, `email`, `number`, `tel`, `url`, `search`, `date`, etc. |
| `inputmode` | `InputModeTypeText` | `undefined` | Mobile keyboard hint: `numeric`, `decimal`, `email`, `tel`, etc. |
| `suffix` | `string \| null` | `undefined` | Static text appended inside the input |
| `appendOuter` | `string \| null` | `undefined` | Text/icon appended outside the input |
| `simple` | `boolean` | `false` | Minimal styling (no underline/border) |
| `dense` | `boolean` | `false` | Compact height |
| `tile` | `boolean` | `false` | No border radius |
| `textRight` | `boolean` | `false` | Right-align text |
| `max` / `min` | `string \| number` | `undefined` | For number/date inputs |
| `maxlength` / `minlength` | `string \| number` | `undefined` | Character limits |
| `pattern` | `string` | `undefined` | HTML validation pattern |
| `autocomplete` | `string` | `undefined` | Browser autocomplete hint |
| `autofocus` | `boolean` | `false` | Auto-focus on mount |
| `spellcheck` | `boolean` | `undefined` | Enable spellcheck |
| `readonly` | `boolean` | `false` | Read-only (not disabled) |
| `isPasteDisabled` | `boolean` | `false` | Block paste events |
| `positive` | `boolean` | `false` | Restrict to positive numbers |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `name` | `string` | `undefined` | Input name for forms |

### Model

`v-model` — the input's current value.

### Slots

| Slot | Description |
|------|-------------|
| `label` | Custom label content |
| `suffix` | Custom suffix content |
| `appendOuter` | Custom append-outer content |

---

## STextarea

Multi-line text input.

### Props

Extends `SInput` props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `undefined` | Number of visible rows |
| `autoGrow` | `boolean` | `false` | Auto-resize height |

---

## SSelect

Dropdown selection input.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SelectItem[] \| string[]` | `[]` | Dropdown options |
| `label` | `string` | `undefined` | Floating label |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `chips` | `boolean` | `false` | Show selections as chips |
| `clearable` | `boolean` | `false` | Show clear button |
| `dense` | `boolean` | `false` | Compact height |

### SelectItem shape

```typescript
type SelectItem = {
  title: string   // Display label
  value: any      // Stored value
}
// Or a plain string (title === value)
```

---

## SAutocomplete

Searchable select with filtering.

### Props (extends SSelect props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filter` | `(item, queryText) => boolean` | `undefined` | Custom filter function |
| `filterMode` | `'start' \| 'contains' \| 'exact' \| 'none'` | `'contains'` | Built-in filter mode |
| `debounce` | `number` | `undefined` | Debounce delay for filter (ms) |
| `closableChips` | `boolean` | `false` | Allow removing chips |
| `divided` | `boolean` | `false` | Dividers in dropdown list |
| `loading` | `boolean` | `false` | Loading spinner |
| `delimiter` | `string \| string[] \| RegExp` | `undefined` | Delimiter to split tags |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:search-input` | `string` | Search text changed (for async filtering) |

---

## SCheckbox

Boolean checkbox input.

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Checkbox label |
| `color` | `string` | `undefined` | Check color |
| `value` | `any` | `undefined` | Value when used in a group |
| `indeterminate` | `boolean` | `false` | Indeterminate state |

### Model

`v-model` — `boolean` (single) or `any[]` (group).

---

## SRadio / SRadioGroup

Radio button group.

### SRadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `RadioItem[]` | `[]` | Radio options |
| `column` | `boolean` | `true` | Stack vertically |
| `inline` | `boolean` | `false` | Display inline |
| `color` | `string` | `undefined` | Active color |

### Model

`v-model` — selected radio value.

---

## SSwitch

Toggle switch (on/off).

### Props (extends common form props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `undefined` | Switch label |
| `color` | `string` | `undefined` | Active track color |

### Model

`v-model` — `boolean`.

### Slots

| Slot | Description |
|------|-------------|
| `label` | Custom label content |

---

## Usage

```vue
<script setup lang="ts">
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
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
  minLength: (n: number) => (v: string) => v.length >= n || `Min ${n} characters`,
}
</script>

<template>
  <SForm @submit.prevent="submit">
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
        { title: 'United States', value: 'us' },
        { title: 'Canada', value: 'ca' },
        { title: 'United Kingdom', value: 'uk' },
      ]"
      :rules="[rules.required]"
    />

    <!-- Autocomplete (searchable) -->
    <SAutocomplete
      v-model="form.tags"
      label="Tags"
      :items="availableTags"
      multiple
      chips
      closable-chips
      :filter-mode="'contains'"
    />

    <!-- Checkbox -->
    <SCheckbox
      v-model="form.agree"
      label="I agree to the terms"
      :rules="[v => !!v || 'You must agree']"
    />

    <!-- Radio group -->
    <SRadioGroup
      v-model="form.gender"
      :items="[
        { title: 'Male', value: 'male' },
        { title: 'Female', value: 'female' },
        { title: 'Other', value: 'other' },
      ]"
      inline
    />

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
  placeholder="Search users..."
  @update:search-input="onSearch"
/>
```

```typescript
const onSearch = debounce(async (query: string) => {
  isSearching.value = true
  searchResults.value = await api.searchUsers(query)
  isSearching.value = false
}, 300)
```

## Notes

- `rules` array functions receive the current model value and must return `true` or an error string.
- `hideDetails` prevents the error message area from rendering — use only when you're handling errors externally.
- `SForm` does NOT auto-validate on mount; call `validate()` on form ref or listen to `@submit`.
- For number inputs, combine `type="number"` with `inputmode="numeric"` for best mobile UX.

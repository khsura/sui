---
name: sui-form
description: Build a validated form using SUI form components (SInput, SSelect, SCheckbox, etc.). Use when the user wants to create a form, data entry UI, or needs form validation with @khsura/sui.
argument-hint: [describe the form fields and purpose]
---

Build a SUI form for: $ARGUMENTS

Ask the user the following if not already clear from $ARGUMENTS:
1. What fields are needed? (text, email, password, select, checkbox, radio, switch, textarea)
2. What validation rules apply to each field?
3. What happens on submit? (API call, emit, router push, etc.)
4. Any layout preferences? (single column, two columns, inside a card, etc.)

Then generate a complete Vue SFC using these rules:

**Form rules:**
- Wrap everything in `<SForm @submit.prevent="submit">`
- Use `SInput` for text/email/password/number — always include `label` and `v-model`
- Use `STextarea` for multi-line text (add `auto-grow` if height should expand)
- Use `SSelect` for dropdowns — `items` must be `SelectItem[]` or `string[]`. Type `SelectItem` from `@khsura/sui` (`text`, `value`, optional `disabled`).
- Use `SAutocomplete` for searchable/multi-select — same `items` shape (`SelectItem[]` or `string[]`), add `multiple chips closable-chips` for multi-select
- Use `SCheckbox` for boolean — `label` prop, not slot
- Use `SRadioGroup` with `<SRadio value="..." label="...">` children (slot-based); use `column` for vertical layout
- Use `SSwitch` for on/off toggles
- Submit: `<SButton type="submit" color="primary" :loading="submitting">Submit</SButton>`
- `:loading` on `SButton` implicitly disables it — do not also set `:disabled`

**Validation rules signature:** `(value: unknown) => true | string`
- Return `true` to pass, return an error string to fail
- Pass arrays to `:rules="[rule1, rule2]"`

---

## Predefined form rules (app)

**`getFormInputModelValueRules(i18n)`** is exported from `@khsura/sui`. Use it when the form should use i18n for error messages. Predefined message strings for these rules (e.g. `required`, `maxLength`, `numeric`) live in **`i18nMessages`** from `@khsura/sui`. Import `i18nMessages` and merge it with your app's i18n messages so validation errors use the same copy; see **sui-getting-started** for a full example. Each rule returns a `FormInputModelValueRule` and takes an `options` object.

**Setup:**
```typescript
import { useI18n } from 'vue-i18n'
import { getFormInputModelValueRules } from '@khsura/sui'

const { t } = useI18n()
const rules = getFormInputModelValueRules({ t })
// Then use e.g. rules.required({ target: 'Email' })
```

| Rule | Options | Use when |
|------|---------|----------|
| `required` | `{ target: string }` | Field must not be empty |
| `maxLength` | `{ target: string; maxLength: number }` | String length ≤ maxLength |
| `length` | `{ target: string; length: number }` | String length must equal length |
| `lengthNumeric` | `{ target: string; length: number }` | Numeric string length must equal length |
| `match` | `{ target: string; comparator: string; matchTo: RegExp }` | Value must match regex |
| `maxUnit` | `{ target: string; multiplier?: number; max: number; unit?: string }` | Numeric value × multiplier ≤ max (e.g. yen to man) |
| `max` | `{ target: string; multiplier?: number; max: number }` | Numeric value × multiplier ≤ max |
| `step` | `{ target: string; multiplier?: number; step: number; unit: string }` | Value must be a multiple of step |
| `select` | `{ target: string }` | A selection must be chosen (select/autocomplete) |
| `shouldFix` | `{ target: string; pattern: RegExp }` | Value must match pattern (fix hint) |
| `badInput` | `{ target: string; pattern: RegExp }` | Value must match pattern (bad input message) |
| `matchPattern` | `{ target: string; pattern: RegExp }` | Value must match regex |
| `numeric` | `{ target: string }` | Value must be a valid number |
| `integer` | `{ target: string }` | Value must be an integer |

**Example with predefined rules:**
```typescript
const rules = getFormInputModelValueRules({ t })
// In template:
:SInput v-model="form.name" label="Name" :rules="[rules.required({ target: t('labels.name') })]"
:SInput v-model="form.age" label="Age" :rules="[rules.required({ target: t('labels.age') }), rules.integer({ target: t('labels.age') })]"
:SSelect v-model="form.role" label="Role" :items="roles" :rules="[rules.select({ target: t('labels.role') })]"
```

**Common inline rule patterns** (when not using app rules):
```typescript
const required = (v: unknown) => !!v || 'Required'
const email = (v: string) => /.+@.+\..+/.test(v) || 'Invalid email'
const minLength = (n: number) => (v: string) => v.length >= n || `Min ${n} characters`
const maxLength = (n: number) => (v: string) => v.length <= n || `Max ${n} characters`
const numeric = (v: string) => /^\d+$/.test(v) || 'Must be a number'
```

---

## Form component props (quick reference)

Use this to choose the right component and props for each field.

**Common to all form inputs:** `label`, `rules`, `disabled`, `hideDetails`, `error`, `dirty`, `id`

| Component | v-model | Key props | When to use |
|-----------|---------|-----------|-------------|
| **SInput** | `string \| number` | `label`, `type` (`text` \| `email` \| `password` \| `number` \| `tel` \| `url` \| `search`), `placeholder`, `suffix`, `dense`, `readonly`, `max`/`min`, `maxlength`/`minlength`, `inputmode` (`numeric` \| `decimal` \| `email` \| `tel`), `positive` (numbers), `size` | Single-line text, email, password, number |
| **STextarea** | `string` | Same as SInput + `rows`, `autoGrow` | Multi-line text |
| **SSelect** | `any` or `any[]` | `items`: `SelectItem[]` or `string[]` (type from `@khsura/sui`: `text`, `value`, optional `disabled`). Also `label`, `placeholder`, `multiple`, `chips`, `clearable`, `dense` | Dropdown, single or multi select |
| **SAutocomplete** | `any` or `any[]` | Same `items` as SSelect; + `filter`, `filterMode`, `debounce`, `closableChips`, `loading`, `@update:search-input` (async) | Searchable select, async options |
| **SCheckbox** | `boolean` or `any[]` | `label`, `value` (in groups), `color`, `indeterminate` | Boolean or multi-checkbox group |
| **SRadioGroup** | `any` | Slot content: `<SRadio value="..." label="...">` children. Props: `column`, `color` | Single choice from list |
| **SSwitch** | `boolean` | `label`, `color` | On/off toggle |

**SelectItem** (SSelect, SAutocomplete): from `@khsura/sui` — `{ text: string, value: string | number | null | undefined, disabled?: boolean }` or plain `string`. Use `text` and `value`, not `title` or `label`.

**Imports:** form components and `getFormInputModelValueRules` from `@khsura/sui`.

For full props, slots, and events per component, see **`docs/components/form.md`**.

**Reference template:**

```vue
<template>
  <SCard :max-width="480">
    <SCardTitle>Form Title</SCardTitle>
    <SCardText>
      <SForm @submit.prevent="submit">
        <SInput
          v-model="form.name"
          label="Full Name"
          :rules="[required]"
        />

        <SInput
          v-model="form.email"
          label="Email"
          type="email"
          :rules="[required, email]"
        />

        <SInput
          v-model="form.password"
          label="Password"
          type="password"
          :rules="[required, minLength(8)]"
        />

        <SSelect
          v-model="form.role"
          label="Role"
          :items="roles"
          :rules="[required]"
        />

        <SCheckbox
          v-model="form.agree"
          label="I agree to the terms"
          :rules="[(v) => !!v || 'You must agree']"
        />

        <SButton type="submit" color="primary" block :loading="submitting">
          Submit
        </SButton>
      </SForm>
    </SCardText>
  </SCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type SelectItem, SCard, SCardTitle, SCardText, SForm, SInput, SSelect, SCheckbox, SButton } from '@khsura/sui'

const submitting = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: null as string | null,
  agree: false,
})

const roles: SelectItem[] = [
  { text: 'Admin', value: 'admin' },
  { text: 'User', value: 'user' },
]

const required = (v: unknown) => !!v || 'Required'
const email = (v: string) => /.+@.+\..+/.test(v) || 'Invalid email'
const minLength = (n: number) => (v: string) => v.length >= n || `Min ${n} characters`

const submit = async () => {
  submitting.value = true
  try {
    // TODO: handle submit (API call, emit, etc.)
  } finally {
    submitting.value = false
  }
}
</script>
```

Adapt to match the user's fields, validation, submit logic, and layout.

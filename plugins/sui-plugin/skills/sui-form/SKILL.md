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

- Wrap everything in `<SForm ref="formRef" @submit.prevent="submit">` and validate in `submit` (see **SForm.validate()** below — its return value is inverted from what you'd expect)
- Use `SInput` for text/email/password/number — always include `label` and `v-model`
- Use `STextarea` for multi-line text (add `autogrow` if height should expand — all lowercase, not `auto-grow`)
- Use `SSelect` for a plain single-value dropdown — `items` must be `SelectItem[]` or `string[]`. Type `SelectItem` from `@khsura/sui` (`text`, `value`, optional `disabled`). **SSelect has no `multiple`, `chips`, `clearable` or `placeholder`** — when you need any of those, use `SAutocomplete`.
- Use `SAutocomplete` for searchable, clearable or multi-select — same `items` shape, add `multiple chips closable-chips` for multi-select
- Use `SCheckbox` for a single boolean — `label` prop, not slot. It has no `value`/`indeterminate`, so build checkbox groups from several boolean models
- Use `SRadioGroup` with `<SRadio value="..." label="...">` children (slot-based); use `column` for vertical layout
- Use `SSwitch` for on/off toggles
- Submit: `<SButton type="submit" color="primary" :loading="submitting">Submit</SButton>`
- `:loading` on `SButton` implicitly disables it — do not also set `:disabled`

**Validation rules signature:** `(value: unknown) => true | string`

- Return `true` to pass, return an error string to fail. Returning `false` does **not** show an error (non-string results are dropped) — always return a message string
- Pass arrays to `:rules="[rule1, rule2]"`
- Rules run on input/change. Inside `SForm` the form runs them; a standalone input (no `SForm`) runs its own rules — note that before the fix in PR #109, standalone inputs silently never ran their rules, so wrap inputs in `SForm` on older versions

---

## SForm.validate() returns `true` when the form is INVALID

`validate()` returns **whether there are errors**, not whether the form is valid. This is the most common SUI form bug.

```typescript
const formRef = ref<InstanceType<typeof SForm> | null>(null)

// ❌ Wrong — submits invalid forms and blocks valid ones
if (!formRef.value?.validate()) return

// ✅ Correct
const hasErrors = formRef.value?.validate()
if (hasErrors) return
```

`SForm` also exposes its state as models, updated whenever an input validates:

- `v-model="isValid"` — `true` when there are no errors
- `v-model:error="hasError"` — `true` while any input has an error
- `v-model:errors="messages"` — all current error strings

Use them to disable the submit button; `resetValidation()` (exposed) clears every input's errors.

---

## `hideDetails` vs `hideError`

| Prop | Hides the label | Hides the error message | Red error frame |
|---|---|---|---|
| _(neither)_ | no | no | shown (since PR #109) |
| `hideError` | no | **yes** | shown |
| `hideDetails` | **yes** | **yes** | shown |

- Use **`hideError`** when you only want to drop the message line (dense tables, inline filters) but keep the label.
- Use **`hideDetails`** only when the field should have no label either — it is not a "compact" switch.
- Since PR #109, the field frame turns red on error even with either flag set (`SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadioGroup`, `SDatePickerInput`), so users can still see which field is invalid. Don't add your own `:deep()` error border.

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

| Rule            | Options                                                               | Use when                                           |
| --------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| `required`      | `{ target: string }`                                                  | Field must not be empty                            |
| `maxLength`     | `{ target: string; maxLength: number }`                               | String length ≤ maxLength                          |
| `length`        | `{ target: string; length: number }`                                  | String length must equal length                    |
| `lengthNumeric` | `{ target: string; length: number }`                                  | Numeric string length must equal length            |
| `match`         | `{ target: string; comparator: string; matchTo: RegExp }`             | Value must match regex                             |
| `maxUnit`       | `{ target: string; multiplier?: number; max: number; unit?: string }` | Numeric value × multiplier ≤ max (e.g. yen to man) |
| `max`           | `{ target: string; multiplier?: number; max: number }`                | Numeric value × multiplier ≤ max                   |
| `step`          | `{ target: string; multiplier?: number; step: number; unit: string }` | Value must be a multiple of step                   |
| `select`        | `{ target: string }`                                                  | A selection must be chosen (select/autocomplete)   |
| `shouldFix`     | `{ target: string; pattern: RegExp }`                                 | Value must match pattern (fix hint)                |
| `badInput`      | `{ target: string; pattern: RegExp }`                                 | Value must match pattern (bad input message)       |
| `matchPattern`  | `{ target: string; pattern: RegExp }`                                 | Value must match regex                             |
| `numeric`       | `{ target: string }`                                                  | Value must be a valid number                       |
| `integer`       | `{ target: string }`                                                  | Value must be an integer                           |

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

**Common to all form inputs:** `label`, `rules`, `disabled`, `hideDetails`, `hideError`, `error`, `dirty`, `id`

| Component         | v-model              | Key props                                                                                                                                                                                                                                                               | When to use                               |
| ----------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **SInput**        | `string \| number`   | `label`, `type` (`text` \| `email` \| `password` \| `number` \| `tel` \| `url` \| `search`), `placeholder`, `suffix`, `dense`, `readonly`, `max`/`min`, `maxlength`/`minlength`, `inputmode` (`numeric` \| `decimal` \| `email` \| `tel`), `positive` (numbers), `size` | Single-line text, email, password, number |
| **STextarea**     | `string`             | `label`, `placeholder`, `rows`, `cols`, `autogrow`, `resize`, `dense`, `tile`, `maxlength`/`minlength`, `readonly`                                                                                                                                                      | Multi-line text                           |
| **SSelect**       | `string \| number`   | `items`: `SelectItem[]` or `string[]` (type from `@khsura/sui`: `text`, `value`, optional `disabled`). Also `label`, `dense`, `grow`, `text`, `divided`, `color`, `outlined`/`underlined`/`borderRadius`. **No** `multiple`/`chips`/`clearable`/`placeholder`        | Single-value dropdown                     |
| **SAutocomplete** | `any` or `any[]`     | Same `items` as SSelect; + `multiple`, `chips`, `closableChips`, `clearable`, `placeholder`, `filter`, `filterMode`, `debounce`, `loading`, `allowUnlisted`, `delimiter`. Events: **`@search-item`** (search text, for async options), **`@create-item`** (with `allowUnlisted`) | Searchable / multi / async select         |
| **SCheckbox**     | `boolean`            | `label`, `color`, `size`, `block`, `bordered`, `readonly`                                                                                                                                                                                                               | Single boolean                            |
| **SRadioGroup**   | `any`                | Slot content: `<SRadio value="..." label="...">` children (no `items` prop). Props: `column`, `grow`, `color`, `name`                                                                                                                                                   | Single choice from list                   |
| **SSwitch**       | `boolean`            | `label`, `color`                                                                                                                                                                                                                                                        | On/off toggle                             |

**SelectItem** (SSelect, SAutocomplete): from `@khsura/sui` — `{ text: string, value: string | number | null | undefined, disabled?: boolean }` or plain `string`. Use `text` and `value`, not `title` or `label`.

**SAutocomplete async search:** listen to `@search-item`, not `@update:search-input` (that name is accepted by the typings but never emitted).

**SInput `type="number"`:** bind a plain `v-model` — SInput already writes a `number | null` to the model, so `.number` is unnecessary. Use `min`/`max`/`positive` when the value should be clamped while typing; use a rule when the user should see a message instead.

**Imports:** form components and `getFormInputModelValueRules` from `@khsura/sui`.

For full props, slots, and events per component, see **`docs/components/form.md`**.

**Reference template:**

```vue
<template>
  <SCard :max-width="480">
    <SCardTitle>Form Title</SCardTitle>
    <SCardText>
      <SForm ref="formRef" @submit.prevent="submit">
        <SInput v-model="form.name" label="Full Name" :rules="[required]" />

        <SInput v-model="form.email" label="Email" type="email" :rules="[required, email]" />

        <SInput v-model="form.password" label="Password" type="password" :rules="[required, minLength(8)]" />

        <SSelect v-model="form.role" label="Role" :items="roles" :rules="[required]" />

        <SCheckbox v-model="form.agree" label="I agree to the terms" :rules="[(v) => !!v || 'You must agree']" />

        <SButton type="submit" color="primary" block :loading="submitting"> Submit </SButton>
      </SForm>
    </SCardText>
  </SCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type SelectItem, SCard, SCardTitle, SCardText, SForm, SInput, SSelect, SCheckbox, SButton } from '@khsura/sui'

const formRef = ref<InstanceType<typeof SForm> | null>(null)
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
  // validate() returns true when there ARE errors
  const hasErrors = formRef.value?.validate()
  if (hasErrors) return

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

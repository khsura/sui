---
title: Validated form
whenToUse: A data-entry form whose fields validate with rules and that only submits when every field passes.
components: SForm, SInput, SSelect, SDatePickerInput, SCheckbox, SButton, SCard, SCardTitle, SCardText
---

- `formRef.value.validate()` returns `true` when the form **has errors**. Write `if (hasErrors) return`, not `if (!validate()) return`.
- A rule is `(value: unknown) => true | string`. Return an error string to fail; returning `false` shows no message.
- Put inputs with `rules` inside `SForm` so `validate()` checks them. `SAutocomplete` and `SSwitch` never run rules; check them yourself in `submit`.
- `SSelect` items are `SelectItem[]` (`{ text, value }`) or `string[]`. It has no `multiple`/`clearable`/`placeholder`; use `SAutocomplete` for those.
- Do not put `type="email"`, `url` or `number` on an input inside `SForm`: the browser then validates on submit, its bubble covers SUI's error text and the submit handler never runs. Use `type="text"` with `inputmode="email"` and `autocomplete="email"` and check the format with a rule. For a number field keep `type="number"` (SInput then writes a number) and add `novalidate` to the `SForm`.
- `SDatePickerInput type="date"` writes `'YYYY-MM-DD'`. Start an empty date as `null`, never `''`: `''` opens the picker on "Invalid date". Add `block` to it and `grow` to `SSelect` so they fill the form width like `SInput`.
- `hide-details` hides the `label` too (on `SCheckbox` it is the only text). Use `hide-error` to drop just the error line.
- `:loading` on the submit `SButton` disables it; do not also bind `:disabled`.
- For translated messages use `getFormInputModelValueRules({ t })` from `@khsura/sui` instead of inline rules.

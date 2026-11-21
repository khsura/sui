---
title: Validated form
whenToUse: A data-entry form whose fields validate with rules and that only submits when every field passes.
components: SForm, SInput, SSelect, SDatePickerInput, SCheckbox, SButton, SCard, SCardTitle, SCardText
---

- `formRef.value.validate()` returns `true` when the form **has errors**. Write `if (hasErrors) return`, not `if (!validate()) return`.
- A rule is `(value: unknown) => true | string`. Return an error string to fail; returning `false` shows no message.
- Put inputs with `rules` inside `SForm` so `validate()` checks them. `SAutocomplete` and `SSwitch` never run rules; check them yourself in `submit`.
- `SSelect` items are `SelectItem[]` (`{ text, value }`) or `string[]`. It has no `multiple`/`clearable`/`placeholder`; use `SAutocomplete` for those.
- `SDatePickerInput type="date"` writes `'YYYY-MM-DD'`. Add `block` to it and `grow` to `SSelect` so they fill the form width like `SInput`.
- `:loading` on the submit `SButton` disables it; do not also bind `:disabled`.
- For translated messages use `getFormInputModelValueRules({ t })` from `@khsura/sui` instead of inline rules.

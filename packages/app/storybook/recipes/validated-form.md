---
title: Validated form
whenToUse: A data-entry form whose fields validate with rules and that only submits when every field passes.
components: SForm, SInput, SSelect, SDatePickerInput, SCheckbox, SButton, SCard, SCardTitle, SCardText
---

- `formRef.value.validate()` returns `true` when the form **has errors**. Write `if (hasErrors) return`, not `if (!validate()) return`.
- A rule is `(value: unknown) => true | string`. Return an error string to fail; returning `false` shows no message.
- Put inputs with `rules` inside `SForm` so `validate()` checks them. `SAutocomplete` and `SSwitch` never run rules; check them yourself in `submit`.
- `SSelect` items are `SelectItem[]` (`{ text, value }`) or `string[]`. It has no `multiple`/`clearable`/`placeholder`; use `SAutocomplete` for those.
- `SForm` renders `<form novalidate>`, so `type="email"`, `url` or `number` on an input never shows the browser's own bubble over SUI's error text: check the format with a rule. Add `inputmode` and `autocomplete` (e.g. `autocomplete="email"`) for the mobile keyboard and autofill. Before 1.20.0 `SForm` did not add `novalidate`: there the browser validated on submit and blocked the submit handler, so add `novalidate` to the `SForm` yourself.
- `SDatePickerInput type="date"` writes `'YYYY-MM-DD'`. Start an empty date as `null`; `''` also means no date (before 1.20.0 `''` opened the picker on "Invalid date", so keep `null` if you support older versions). Add `block` to it and `grow` to `SSelect` so they fill the form width like `SInput`.
- `hide-details` hides a text field's label above the field and its error line; `SCheckbox` keeps its own label. Use `hide-error` to drop just the error line. Before 1.20.0 `hide-details` also hid the `SCheckbox` label (its only text), so use `hide-error` there.
- `:loading` on the submit `SButton` disables it; do not also bind `:disabled`.
- Give the submit button `class="s_mt__2"`: a field's error line ends right where the next element starts, so without it the last error message sits on the button.
- For translated messages use `getFormInputModelValueRules({ t })` from `@khsura/sui` instead of inline rules.

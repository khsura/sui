---
title: Filter bar
whenToUse: A search field with its button, or a row of filter fields (date, select) with an Apply button above a list or table.
components: SFormRow, SForm, SInput, SDatePickerInput, SSelect, SButton, SCard, SCardText
---

- Put fields and the buttons that act on them in an `SFormRow` (since 1.20.0), never a plain flex `<div>`. A field is a label, its box and a reserved error line, so in a plain flex row the button lines up with the label or floats above the fields; `SFormRow` lines each button up with the field box, with or without a label and while an error shows.
- `SFormRow` wraps on a phone: `SInput` takes the free width, `SSelect` and `SDatePickerInput` keep their own width (add `grow` / `block` to stretch them), buttons keep theirs. Do not add `block` to a button in the row.
- Keep the fields' error lines (no `hide-details`): the row and the button use them as the gap to the next row. A row whose fields all use `hide-details` adds the same gap below itself.
- Before 1.20.0 there is no `SFormRow`: put `hide-details` on the field in a flex row so it renders no label or error line, and give it a `placeholder` or `aria-label` instead.
- A search runs on submit: make the button `type="submit"` inside an `SForm`, so Enter in the field searches too.

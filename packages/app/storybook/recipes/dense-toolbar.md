---
title: Dense toolbar / filter bar
whenToUse: A compact action toolbar or filter bar (above a table or list, in a sidebar) where every button and field should be smaller than the rest of the page, without repeating size or dense on each component.
components: SDefaultsProvider, SFormRow, SForm, SInput, SSelect, SButton, SCard, SCardText
---

- Wrap the region in one `<SDefaultsProvider :defaults="…">` (since 1.22.0) instead of writing `size="small"` on every button and input. `defaults` is typed like `createSUI({ defaults })`: `global` for the styling props many components share, plus per-component entries (`SButton: { variant: 'text' }`).
- `global.size` reaches every component that takes the preset size scale (`SButton`, `SInput`, `SChip`, `SAutocomplete`, `SDatePickerInput`, `SPagination`, …). `SSelect` has no `size`: make the fields line up with `SInput: { dense: true }, SSelect: { dense: true }`.
- The provider merges onto the layer above it (an outer provider, else `createSUI({ defaults })`), per component and per prop: an inner `{ SButton: { size: 'mini' } }` keeps an outer `SButton.variant`. An explicit prop on a component (`<SButton size="default">`) still wins over every layer.
- It renders no element, so it adds no layout box and takes no `class` or `style`: put the flex row or `SFormRow` inside it.
- The filter fields follow the `filter-bar` recipe: they sit in an `SFormRow` with the buttons that act on them, never in a plain flex `<div>`. Here they use `hide-details` with a `placeholder` that names the field, because a dense bar has no room for labels and error lines.
- Keep small targets usable: `size: 'small'` buttons are 28px tall (above the 24px WCAG 2.5.8 minimum); avoid `mini` for icon-only buttons.

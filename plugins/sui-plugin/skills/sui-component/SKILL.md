---
name: sui-component
description: Look up and use any component from @khsura/sui (SButton, SCard, SDialog, SMenu, STooltip, STable, SList, STabs, SStepper, SCarousel, SExpansionPanels, SDatePicker, SCalendar, SToggleButtonGroup, SSlideGroup, SToolbar, SSplitView, SDroppable, SBadge, SChip, SIcon, SImage, SAlert, SOverlay, …) in a Vue or Nuxt app. Use when writing or fixing template code with an S-prefixed component, choosing props/slots/events, debugging a SUI component that renders wrong or ignores a prop, or styling SUI components with theme colors. Loads one per-family reference file with the verified props table, slots, events, example and gotchas.
argument-hint: [component name or description of what you need]
---

Help the user use this SUI component: $ARGUMENTS

1. Find the component in the **Reference index** below and read **only** that reference file.
2. Give the import, the props you use, and a complete working example built from the reference.
3. If a prop isn't in the reference, check `node_modules/@khsura/sui/@types/definitions/props/props<Component>.d.ts` before using it. Never guess — unknown props are silently ignored.

All components import from `@khsura/sui`. App setup (registry, `SApp`, styles, `@mdi/font`): **sui-getting-started**.

---

## Reference index

| Component(s) | Reference |
|---|---|
| `SAlert` | [references/alert.md](references/alert.md) |
| `SAutocomplete` | [references/autocomplete.md](references/autocomplete.md) |
| `SBadge` | [references/badge.md](references/badge.md) |
| `SBreadcrumbs` | [references/breadcrumbs.md](references/breadcrumbs.md) |
| `SButton` | [references/button.md](references/button.md) |
| `SCalendar` | [references/calendar.md](references/calendar.md) |
| `SCard`, `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions` | [references/cards.md](references/cards.md) |
| `SCarousel`, `SCarouselItem` | [references/carousel.md](references/carousel.md) |
| `SChip` | [references/chip.md](references/chip.md) |
| `SDatePicker`, `SDatePickerInput` | [references/date-picker.md](references/date-picker.md) |
| `SDialog` | [references/dialog.md](references/dialog.md) |
| `SDivider` | [references/divider.md](references/divider.md) |
| `SDroppable` | [references/droppable.md](references/droppable.md) |
| `SExpansionPanels`, `SExpansionPanel`, `SExpansionPanelHeader`, `SExpansionPanelContent` | [references/expansion-panels.md](references/expansion-panels.md) |
| `SForm`, `SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadioGroup`, `SRadio`, `SSwitch` | [references/form.md](references/form.md) (and the **sui-form** skill) |
| `SIcon` | [references/icon.md](references/icon.md) |
| `SImage` | [references/image.md](references/image.md) |
| `SApp`, `SLayout`, `SAppBar`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`, `SContainer`, `SRow`, `SColumn`, `SSpacer` | [references/layout.md](references/layout.md) (and the **sui-layout** skill) |
| `SList`, `SListItem`, `SListItemIcon`, `SListItemContent`, `SListItemTitle`, `SListItemSubtitle`, `SListItemAction`, `SListItemGroup` | [references/list.md](references/list.md) |
| `SMenu` | [references/menu.md](references/menu.md) |
| `SOverlay` | [references/overlay.md](references/overlay.md) |
| `SProgressLinear`, `SProgressCircular` | [references/progress.md](references/progress.md) |
| `SSheet` | [references/sheet.md](references/sheet.md) |
| `SSlideGroup`, `SSlideItem` | [references/slide-group.md](references/slide-group.md) |
| `SSnackbar` | [references/snackbar.md](references/snackbar.md) |
| `SSplitView`, `SSplitViewItem` | [references/split-view.md](references/split-view.md) |
| `SStepper`, `SStepperStep` | [references/stepper.md](references/stepper.md) |
| `STable`, `STableHeadCell`, `STableBodyCell` | [references/table.md](references/table.md) |
| `STabs`, `STab` | [references/tabs.md](references/tabs.md) |
| `SToggleButtonGroup`, `SToggleButton` | [references/toggle-button-group.md](references/toggle-button-group.md) |
| `SToolbar`, `SToolbarTitle`, `SToolbarItem` | [references/toolbar.md](references/toolbar.md) |
| `STooltip` | [references/tooltip.md](references/tooltip.md) |
| `SWindow`, `SWindowItem` (exported since `@khsura/sui` 1.18) | [references/window.md](references/window.md) |

---

## Components that do NOT exist

| ❌ Name | ✅ Use instead |
|---|---|
| `SSkeletonLoader` | `SProgressCircular indeterminate` in a centered div |
| `STextField` | `SInput` (single line) or `STextarea` (multi-line) |
| `SCol` | `SColumn` |
| `STablePagination` (not exported) | `STable`'s built-in pagination |
| `SNavigationDrawer` inside a feature component | App shell only — use `<SDialog location="end">` for feature slide-in panels |

---

## Activator slot

**SDialog, SMenu, SSnackbar** — bind **both** `v-on="on"` and `v-bind="attrs"`:

```vue
<SMenu location="bottom">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open</SButton>
  </template>
  …
</SMenu>
```

**STooltip** passes no slot scope — put the trigger in `#activator` as is; see [references/tooltip.md](references/tooltip.md).

Popups teleport into the container rendered by `<SApp>` — without `SApp` at the app root they never show.

---

## Unknown props are silent no-ops

| ❌ Does nothing | ✅ Do this instead |
|---|---|
| `<SDialog title="...">` | Heading inside the content: `<SCard><SCardTitle>…</SCardTitle>…</SCard>` |
| `<SSelect clearable / chips / multiple / placeholder>` | `SAutocomplete` |
| `<SInput persistent-hint hint="...">` | Render helper text yourself |
| `app` on `SMain` / `SFooter` / `SAppBar` | Remove it; placement comes from `SLayout` |
| `<SCheckbox indeterminate>` / `:value` | `SCheckbox` is a single boolean `v-model` |
| `<SToggleButton value="...">` | Buttons are identified by index / `key`; see [references/toggle-button-group.md](references/toggle-button-group.md) |
| `<SButton variant="outlined">` | `variant` is `fab` \| `text` \| `icon` only; use `outlined` boolean prop or `color` |

---

## Linking: `to` for a route, `href` for a URL

`SButton`, `SCard` and `SListItem` take both; pass **one**, never both.

| Prop | Renders | For |
|---|---|---|
| `to` | `router-link` | internal route |
| `href` | `<a>` | external URL (`target`, `rel` go with it) |
| neither | `div` or `tag` | not a link |

Navigating from `@click` renders a `div` — no middle-click, "copy link", or link semantics. Prefer `to` / `href`.

---

## SCSS colors — use the helpers, not invented CSS variables

`@use '@khsura/sui/helpers.scss' as *;` then:

| ❌ Invalid | ✅ Correct |
|---|---|
| `var(--s-color-on-surface)` | `s_getAppColor('text')` |
| `rgba(var(--s-color-on-surface), 0.6)` | `color-mix(in srgb, #{s_getAppColor('text')} 60%, transparent)` |
| `rgb(var(--s-color-primary))` (it's a hex, not RGB channels) | `s_getPresetColor('primary')` |
| `rgba(var(--s-color-warning), 0.1)` | `color-mix(in srgb, #{s_getPresetColor('warning')} 10%, transparent)` |
| `var(--s-color-outline)` | `s_getAppColor('border')` |
| `var(--s-color-on-primary)` | `s_getPresetColor('primary', true)` |
| `var(--s-color-surface-variant)` | `color-mix(in srgb, #{s_getAppColor('text')} 8%, transparent)` |

- **`s_getPresetColor` keys:** `primary`, `secondary`, `success`, `info`, `warning`, `important`, `error` (+ any you add in `createSUI({ themes })`)
- **`s_getAppColor` keys:** `appBar`, `title`, `text`, `secondaryText`, `anchor`, `background`, `card`, `button`, `switch`, `border`, `disabled`, `snackbar`, `inputPlaceholderShown`, `textErrorHover`

The variables are set on `<SApp>`, so they only resolve inside it. More helpers: **sui-utilities**.

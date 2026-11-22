---
name: sui-component
description: Look up and use any component from @khsura/sui (SButton, SCard, SDialog, SMenu, STooltip, STable, SList, STabs, SStepper, SCarousel, SExpansionPanels, SDatePicker, SNumberInput, SCalendar, SToggleButtonGroup, SSlideGroup, SToolbar, SSplitView, SDroppable, SBadge, SChip, SAvatar, SPagination, SEmptyState, SSkeletonLoader, SFileInput, SIcon, SImage, SAlert, SOverlay, …) in a Vue or Nuxt app. Use when writing or fixing template code with an S-prefixed component, choosing props/slots/events, debugging a SUI component that renders wrong or ignores a prop, or styling SUI components with theme colors. Loads one per-family reference file with the verified props table, slots, events, example and gotchas.
argument-hint: [component name or description of what you need]
---

Help the user use this SUI component: $ARGUMENTS

1. Find the component in the **Reference index** below and read **only** that reference file.
2. Give the import, the props you use, and a complete working example built from the reference.
3. If a prop isn't in the reference, check `node_modules/@khsura/sui/@types/definitions/props/props<Component>.d.ts` before using it. Never guess — unknown props are silently ignored.

In each reference, the props / slots / events tables between `generated:api` markers are generated from the package's `sui-api.json`, so they list every prop with its exact type. The **notes** list under each table and the prose around it explain behaviour and gotchas.

All components import from `@khsura/sui`. App setup (registry, `SApp`, styles, `@mdi/font`): **sui-getting-started**.

---

## Reference index

| Component(s) | Reference |
|---|---|
| `SAlert` | [references/alert.md](references/alert.md) |
| `SAutocomplete` | [references/autocomplete.md](references/autocomplete.md) |
| `SAvatar` | [references/avatar.md](references/avatar.md) |
| `SAvatarGroup` | [references/avatar-group.md](references/avatar-group.md) |
| `SBadge` | [references/badge.md](references/badge.md) |
| `SBreadcrumbs` | [references/breadcrumbs.md](references/breadcrumbs.md) |
| `SButton` | [references/button.md](references/button.md) |
| `SCalendar` | [references/calendar.md](references/calendar.md) |
| `SCard`, `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions` | [references/cards.md](references/cards.md) |
| `SCarousel`, `SCarouselItem` | [references/carousel.md](references/carousel.md) |
| `SChip` | [references/chip.md](references/chip.md) |
| `SDatePicker`, `SDatePickerInput` | [references/date-picker.md](references/date-picker.md) |
| `SDefaultsProvider` (since 1.22.0) | [references/defaults-provider.md](references/defaults-provider.md) |
| `SDialog` | [references/dialog.md](references/dialog.md) |
| `SDivider` | [references/divider.md](references/divider.md) |
| `SDroppable` | [references/droppable.md](references/droppable.md) |
| `SEmptyState` | [references/empty-state.md](references/empty-state.md) |
| `SExpansionPanels`, `SExpansionPanel`, `SExpansionPanelHeader`, `SExpansionPanelContent` | [references/expansion-panels.md](references/expansion-panels.md) |
| `SFileInput` | [references/file-input.md](references/file-input.md) |
| `SForm`, `SFormRow`, `SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadioGroup`, `SRadio`, `SSwitch` | [references/form.md](references/form.md) (and the **sui-form** skill) |
| `SIcon` | [references/icon.md](references/icon.md) |
| `SImage` | [references/image.md](references/image.md) |
| `SApp`, `SLayout`, `SAppBar`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`, `SContainer`, `SRow`, `SColumn`, `SSpacer` | [references/layout.md](references/layout.md) (and the **sui-layout** skill) |
| `SList`, `SListItem`, `SListItemIcon`, `SListItemContent`, `SListItemTitle`, `SListItemSubtitle`, `SListItemAction`, `SListItemGroup` | [references/list.md](references/list.md) |
| `SMenu` | [references/menu.md](references/menu.md) |
| `SNumberInput` (since 1.21.0) | [references/number-input.md](references/number-input.md) (numbers: quantities, money, percentages) |
| `SOverlay` | [references/overlay.md](references/overlay.md) |
| `SPagination` | [references/pagination.md](references/pagination.md) |
| `SProgressLinear`, `SProgressCircular` | [references/progress.md](references/progress.md) |
| `SSheet` | [references/sheet.md](references/sheet.md) |
| `SSkeletonLoader` | [references/skeleton-loader.md](references/skeleton-loader.md) |
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
| `STextField` | `SInput` (single line) or `STextarea` (multi-line) |
| `SFileUpload` / `<SInput type="file">` | `SFileInput` (`variant="dropzone"` for a drop area) |
| `SCol` | `SColumn` |
| `STablePagination` (not exported) | `STable`'s built-in pagination, or `SPagination` for a standalone pager |
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

## Same prop on every instance? Set it once

If the app repeats the same styling prop at every call site (`size="small"` on each `SButton`, `SChip`, `SIcon`…), set it once in `createSUI` and drop it from the templates:

```typescript
createSUI({ defaults: { global: { size: 'small' }, SButton: { elevation: 0 } } })
```

Order: prop on the element > `defaults.SButton` > `defaults.global` > built-in. `global` covers `size`, `borderRadius`, `rounded`, `elevation`, `color`, `density`, and only reaches components with that prop on the same scale. For a compact admin look use `global: { density: 'compact' }` (fields, buttons, chips, list and table rows, toolbars shrink together) instead of per-component heights or paddings. Details: **sui-getting-started** → *Component defaults*.

---

## Linking: `to` for a route, `href` for a URL

`SButton`, `SCard` and `SListItem` take both; pass **one**, never both.

| Prop | Renders | For |
|---|---|---|
| `to` | `router-link` (plain `<a href>` without vue-router) | internal route |
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
- **`s_getAppColor` keys:** `appBar`, `title`, `text`, `secondaryText`, `anchor`, `background`, `card`, `button`, `switch`, `border`, `disabled`, `snackbar`, `inputPlaceholderShown`, `textErrorHover`, `textError`, `focusRing`

The variables are set on `<SApp>`, so they only resolve inside it. More helpers: **sui-utilities**.

## Accessibility

- **Icon-only buttons need `aria-label`:** `<SButton variant="icon" aria-label="Close"><SIcon icon="mdi-close" /></SButton>`. Without it the button has no name (axe `button-name`, critical). The same goes for a link that wraps only an image.
- **Text on a colour is picked by WCAG contrast** (light or dark theme text, whichever contrasts more). Don't hard-code `color: white` on `color="success"` chips; the default `success` (`#2e7d32`) and light `secondary` (`#cc4125`) already reach 4.5:1 with their text. Passing `colorThreshold` switches back to the old YIQ brightness rule. A preset used as text (`color` on a text button, an outlined chip, `s_textColor__<name>`) is drawn with `--s-color-<name>--readable`, adjusted to 4.5:1 on the background and cards.
- **Keyboard:** SSelect and SAutocomplete are comboboxes (arrow keys move the highlighted option, Enter picks, Esc closes), STabs uses arrow keys / Home / End with one Tab stop, SRadioGroup uses native radio arrow keys, editable SStepper steps are buttons. Don't add your own `@keydown` handlers or `tabindex` for these.
- **Focus ring:** components draw a 2px `focusRing` outline under `:focus-visible`. Don't remove it with `outline: none`; for your own focusable element use `@include s_focusRing();`.
- SProgressCircular / SProgressLinear are named `Loading` by default; pass `aria-label` to say what loads. Full checklist: `docs/a11y.md` in the package and https://sui.surakh.com/.

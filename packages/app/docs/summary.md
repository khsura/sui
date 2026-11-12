# SUI Component Summary

Quick reference for all components in the `@khsura/sui` package.

---

## Basic UI

| Component(s) | Import | Doc |
|---|---|---|
| `SButton` | `import { SButton } from '@khsura/sui'` | [button.md](./components/button.md) |
| `SIcon` | `import { SIcon } from '@khsura/sui'` | [icon.md](./components/icon.md) |
| `SChip` | `import { SChip } from '@khsura/sui'` | [chip.md](./components/chip.md) |
| `SBadge` | `import { SBadge } from '@khsura/sui'` | [badge.md](./components/badge.md) |
| `SDivider` | `import { SDivider } from '@khsura/sui'` | [divider.md](./components/divider.md) |
| `SImage` | `import { SImage } from '@khsura/sui'` | [image.md](./components/image.md) |

---

## Cards & Surfaces

| Component(s) | Import | Doc |
|---|---|---|
| `SCard`, `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions` | `import { SCard, SCardTitle, SCardSubtitle, SCardText, SCardActions } from '@khsura/sui'` | [cards.md](./components/cards.md) |
| `SSheet` | `import { SSheet } from '@khsura/sui'` | [sheet.md](./components/sheet.md) |
| `SOverlay` | `import { SOverlay } from '@khsura/sui'` | [overlay.md](./components/overlay.md) |

---

## Navigation

| Component(s) | Import | Doc |
|---|---|---|
| `SBreadcrumbs` | `import { SBreadcrumbs } from '@khsura/sui'` | [breadcrumbs.md](./components/breadcrumbs.md) |
| `STabs`, `STab` | `import { STabs, STab } from '@khsura/sui'` | [tabs.md](./components/tabs.md) |
| `SToolbar`, `SToolbarTitle`, `SToolbarItem` | `import { SToolbar, SToolbarTitle, SToolbarItem } from '@khsura/sui'` | [toolbar.md](./components/toolbar.md) |
| `SSlideGroup`, `SSlideItem` | `import { SSlideGroup, SSlideItem } from '@khsura/sui'` | [slide-group.md](./components/slide-group.md) |
| `SToggleButtonGroup`, `SToggleButton` | `import { SToggleButtonGroup, SToggleButton } from '@khsura/sui'` | [toggle-button-group.md](./components/toggle-button-group.md) |

---

## Popups & Overlays

| Component(s) | Import | Doc |
|---|---|---|
| `SDialog` | `import { SDialog } from '@khsura/sui'` | [dialog.md](./components/dialog.md) |
| `SMenu` | `import { SMenu } from '@khsura/sui'` | [menu.md](./components/menu.md) |
| `STooltip` | `import { STooltip } from '@khsura/sui'` | [tooltip.md](./components/tooltip.md) |
| `SSnackbar` | `import { SSnackbar } from '@khsura/sui'` | [snackbar.md](./components/snackbar.md) |

---

## Forms

| Component(s) | Import | Doc |
|---|---|---|
| `SForm`, `SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadio`, `SRadioGroup`, `SSwitch`, `SFormInputError` | `import { SForm, SInput, STextarea, SSelect, SCheckbox, SRadio, SRadioGroup, SSwitch } from '@khsura/sui'` | [form.md](./components/form.md) |
| `SAutocomplete` | `import { SAutocomplete } from '@khsura/sui'` | [autocomplete.md](./components/autocomplete.md) |

---

## Data Display

| Component(s) | Import | Doc |
|---|---|---|
| `SList`, `SListItem`, `SListItemTitle`, `SListItemSubtitle`, `SListItemIcon`, `SListItemAction`, `SListItemContent`, `SListItemGroup` | `import { SList, SListItem, ... } from '@khsura/sui'` | [list.md](./components/list.md) |
| `STable`, `STableBodyCell`, `STableHeadCell` | `import { STable } from '@khsura/sui'` | [table.md](./components/table.md) |
| `SProgressLinear`, `SProgressCircular` | `import { SProgressLinear, SProgressCircular } from '@khsura/sui'` | [progress.md](./components/progress.md) |

---

## Content Panels

| Component(s) | Import | Doc |
|---|---|---|
| `SExpansionPanels`, `SExpansionPanel`, `SExpansionPanelHeader`, `SExpansionPanelContent` | `import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent } from '@khsura/sui'` | [expansion-panels.md](./components/expansion-panels.md) |
| `SCarousel`, `SCarouselItem` | `import { SCarousel, SCarouselItem } from '@khsura/sui'` | [carousel.md](./components/carousel.md) |
| `SWindow`, `SWindowItem` | `import { SWindow, SWindowItem } from '@khsura/sui'` | [window.md](./components/window.md) |
| `SStepper`, `SStepperStep` | `import { SStepper, SStepperStep } from '@khsura/sui'` | [stepper.md](./components/stepper.md) |
| `SSplitView`, `SSplitViewItem` | `import { SSplitView, SSplitViewItem } from '@khsura/sui'` | [split-view.md](./components/split-view.md) |

---

## Date & Time

| Component(s) | Import | Doc |
|---|---|---|
| `SDatePicker`, `SDatePickerInput`, `datePickerModelFormats` | `import { SDatePicker, SDatePickerInput, datePickerModelFormats } from '@khsura/sui'` | [date-picker.md](./components/date-picker.md) |
| `SCalendar` | `import { SCalendar } from '@khsura/sui'` | [calendar.md](./components/calendar.md) |

---

## Layout

| Component(s) | Import | Doc |
|---|---|---|
| `SLayout`, `SAppBar`, `SAppBarTitle`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`, `SContainer`, `SRow`, `SColumn`, `SSpacer` | `import { SLayout, SAppBar, ... } from '@khsura/sui'` | [layout.md](./components/layout.md) |

---

## Input / Upload

| Component(s) | Import | Doc |
|---|---|---|
| `SDroppable` | `import { SDroppable } from '@khsura/sui'` | [droppable.md](./components/droppable.md) |

---

## Shared Props (available on many components)

| Prop | Type | Description |
|------|------|-------------|
| `color` | `string` | Background/primary color. Presets: `primary`, `secondary`, `error`, `warning`, `info`, `success`, `important` (plus app colors `background`, `card`) |
| `elevation` | `0–24` | Box shadow depth |
| `disabled` | `boolean` | Disable all interaction |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | Preset size (buttons, icons, chips) |
| `outlined` | `boolean` | Border style, transparent background |
| `underlined` | `boolean` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | Border radius override |
| `width` / `height` | `string \| number` | Explicit dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | Min dimensions |
| `tag` | `string` | Override root HTML element |
| `href` | `string \| null` | Render as `<a>` tag with href |
| `to` | `RouteLocationRaw` | Vue Router link destination |
| `colorThreshold` | `number` | Auto text-color contrast threshold against `color` |

---

## Activator Pattern

SDialog, SMenu and SSnackbar support an `#activator` slot that passes `{ on, attrs }`:

```vue
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open</SButton>
  </template>
  <!-- popup content -->
</SMenu>
```

**Always bind both `v-on="on"` and `v-bind="attrs"`.**

`STooltip` also has an `#activator` slot, but it passes no `on` / `attrs` — the tooltip wraps the slot content and listens for hover itself, so just put the element in the slot.

---

## v-model Reference

| Component | v-model type |
|-----------|-------------|
| `SDialog`, `SMenu`, `STooltip`, `SSnackbar`, `SNavigationDrawer` | `boolean` |
| `SInput`, `STextarea`, `SSelect`, `SSwitch`, `SCheckbox` | value type |
| `SAutocomplete` | value or `value[]` (when `multiple`) |
| `STabs` | `string \| number` (the active `STab`'s `tab` value) |
| `SExpansionPanels` | `number[]` (the `index` prop of each open panel) |
| `SCarousel`, `SWindow` | single item value |
| `SSlideGroup`, `SToggleButtonGroup` | always an array of item identifiers (`index` or vnode `key`) |
| `SDatePicker`, `SDatePickerInput` | `string` — `'YYYY-MM-DD'`, `'YYYY-MM'` or `'YYYY'` |
| `SCalendar` | `v-model:focus` → `string` (focused date `'YYYY-MM-DD'`) |
| `SStepper` | `number` (the active step's `step` value) |
| `SForm` | `boolean` (`true` when valid); also `v-model:errors` (`string[]`) and `v-model:error` (`boolean`) |

---

## Further Reading

- [Utility Classes →](./classes.md)
- [SCSS Helpers (mixins & functions) →](./helpers.md)
- [Directives →](./directives.md)
- [Full Component Index →](./components/index.md)

# SUI Component Documentation Index

This directory contains per-component documentation optimized for Claude AI coding assistance.

**Package:** `@khsura/sui`
**Framework:** Vue 3 + TypeScript

---

## Component Files

### Basic UI
| File | Components |
|------|-----------|
| [button.md](./button.md) | `SButton` |
| [icon.md](./icon.md) | `SIcon` |
| [chip.md](./chip.md) | `SChip` |
| [badge.md](./badge.md) | `SBadge` |
| [divider.md](./divider.md) | `SDivider` |
| [image.md](./image.md) | `SImage` |

### Cards & Surfaces
| File | Components |
|------|-----------|
| [cards.md](./cards.md) | `SCard`, `SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions` |
| [sheet.md](./sheet.md) | `SSheet` |
| [overlay.md](./overlay.md) | `SOverlay` |

### Navigation
| File | Components |
|------|-----------|
| [breadcrumbs.md](./breadcrumbs.md) | `SBreadcrumbs` |
| [tabs.md](./tabs.md) | `STabs`, `STab` |
| [toolbar.md](./toolbar.md) | `SToolbar`, `SToolbarTitle`, `SToolbarItem` |
| [slide-group.md](./slide-group.md) | `SSlideGroup`, `SSlideItem` |
| [toggle-button-group.md](./toggle-button-group.md) | `SToggleButtonGroup`, `SToggleButton` |

### Popups & Overlays
| File | Components |
|------|-----------|
| [dialog.md](./dialog.md) | `SDialog` |
| [menu.md](./menu.md) | `SMenu` |
| [tooltip.md](./tooltip.md) | `STooltip` |
| [snackbar.md](./snackbar.md) | `SSnackbar` |

### Forms
| File | Components |
|------|-----------|
| [form.md](./form.md) | `SForm`, `SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadio`, `SRadioGroup`, `SSwitch`, `SFormInputError` |
| [autocomplete.md](./autocomplete.md) | `SAutocomplete` |

### Data Display
| File | Components |
|------|-----------|
| [list.md](./list.md) | `SList`, `SListItem`, `SListItemTitle`, `SListItemSubtitle`, `SListItemIcon`, `SListItemAction`, `SListItemContent`, `SListItemGroup` |
| [table.md](./table.md) | `STable`, `STableBodyCell`, `STableHeadCell` |
| [progress.md](./progress.md) | `SProgressLinear`, `SProgressCircular` |

### Content Panels
| File | Components |
|------|-----------|
| [expansion-panels.md](./expansion-panels.md) | `SExpansionPanels`, `SExpansionPanel`, `SExpansionPanelHeader`, `SExpansionPanelContent` |
| [carousel.md](./carousel.md) | `SCarousel`, `SCarouselItem` |
| [window.md](./window.md) | `SWindow`, `SWindowItem` |
| [stepper.md](./stepper.md) | `SStepper`, `SStepperStep` |
| [split-view.md](./split-view.md) | `SSplitView`, `SSplitViewItem` |

### Date & Time
| File | Components |
|------|-----------|
| [date-picker.md](./date-picker.md) | `SDatePicker`, `SDatePickerInput`, `datePickerModelFormats` |
| [calendar.md](./calendar.md) | `SCalendar` |

### Layout
| File | Components |
|------|-----------|
| [layout.md](./layout.md) | `SLayout`, `SAppBar`, `SAppBarTitle`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation`, `SContainer`, `SRow`, `SColumn`, `SSpacer` |

### Input / Upload
| File | Components |
|------|-----------|
| [droppable.md](./droppable.md) | `SDroppable` |

---

## Quick Reference: Common Patterns

### Shared Props (available on many components)

| Prop | Type | Description |
|------|------|-------------|
| `color` | `string` | Background/primary color — preset (`'primary'`, `'secondary'`, `'error'`, `'warning'`, `'info'`, `'success'`, `'important'`) or CSS color |
| `elevation` | `0–24` | Box shadow depth |
| `disabled` | `boolean` | Disable interaction |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | Preset size (buttons, icons, chips) |
| `outlined` | `boolean` | Border style, transparent background |
| `underlined` | `boolean` | Bottom border only |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | Border radius override |
| `width` / `height` | `string \| number` | Explicit dimensions |
| `maxWidth` / `maxHeight` | `string \| number` | Max dimensions |
| `minWidth` / `minHeight` | `string \| number` | Min dimensions |
| `tag` | `string` | Override root HTML element |
| `href` | `string \| null` | Render as `<a>` tag |
| `to` | `RouteLocationRaw` | Vue Router link |
| `colorThreshold` | `number` | Auto text contrast threshold against `color` |

### Activator Pattern (Dialog, Menu, Snackbar)

These components pass `{ on, attrs }` to their `#activator` slot:

```vue
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open</SButton>
  </template>
  <!-- popup content -->
</SMenu>
```

Always bind **both** `v-on="on"` and `v-bind="attrs"`.

`STooltip`'s `#activator` slot passes no `on` / `attrs` — the tooltip wraps the slot content and handles hover itself.

### v-model Patterns

| Component | v-model type |
|-----------|-------------|
| `SDialog`, `SMenu`, `STooltip`, `SSnackbar` | `boolean` |
| `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SSwitch`, `SCheckbox` | value type |
| `STabs` | `string \| number` (the active `STab`'s `tab` value) |
| `SExpansionPanels` | `number[]` (the `index` prop of each open panel) |
| `SCarousel`, `SWindow` | single item value |
| `SSlideGroup`, `SToggleButtonGroup` | always an array of item identifiers (`index` or vnode `key`) |
| `SStepper` | `number` (the active step's `step` value) |
| `SForm` | `boolean` (`true` when valid); also `v-model:errors`, `v-model:error` |
| `SDatePicker`, `SDatePickerInput` | `string` (`'YYYY-MM-DD'`, `'YYYY-MM'` or `'YYYY'`) |
| `SNavigationDrawer` | `boolean` |
| `SCalendar` | `v-model:focus` — `string` (focused date) |

### Preset Color Names

```
primary  secondary  error  warning  info  success  important
```

App colors `background` and `card` are also exposed.

CSS colors and hex values are also accepted.

### Size Presets

```
mini  small  default  large  extra
```

---

## Further Reading

- [Summary (all components at a glance) →](../summary.md)
- [Utility Classes →](../classes.md)
- [SCSS Helpers (mixins & functions) →](../helpers.md)
- [Directives →](../directives.md)

---

## Project Setup Reference

```typescript
// main.ts
import { createApp } from 'vue'
import { createSUI } from '@khsura/sui'
import '@khsura/sui/base.css'

const app = createApp(App)
app.use(createSUI())
app.mount('#app')
```

```typescript
// Per-component import
import { SButton, SInput, SCard } from '@khsura/sui'
```

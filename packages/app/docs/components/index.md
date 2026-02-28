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
| [form.md](./form.md) | `SForm`, `SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadio`, `SRadioGroup`, `SSwitch` |
| [autocomplete.md](./autocomplete.md) | `SAutocomplete` |

### Data Display
| File | Components |
|------|-----------|
| [list.md](./list.md) | `SList`, `SListItem`, `SListItemTitle`, `SListItemSubtitle`, `SListItemIcon`, `SListItemAction`, `SListItemContent`, `SListItemGroup` |
| [table.md](./table.md) | `STable`, `STableBodyCell`, `STableHeadCell`, `STablePagination` |
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
| [date-picker.md](./date-picker.md) | `SDatePicker`, `datePickerModelFormats` |
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
| `color` | `string` | Background/primary color — preset (`'primary'`, `'secondary'`, `'error'`, `'success'`, `'warning'`) or CSS color |
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

### Activator Pattern (Dialog, Menu, Tooltip, Snackbar)

Components with popup behavior use the `#activator` slot:

```vue
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open</SButton>
  </template>
  <!-- popup content -->
</SMenu>
```

Always bind **both** `v-on="on"` and `v-bind="attrs"`.

### v-model Patterns

| Component | v-model type |
|-----------|-------------|
| `SDialog`, `SMenu`, `STooltip`, `SSnackbar` | `boolean` |
| `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SSwitch`, `SCheckbox` | value type |
| `STabs` | `string \| number` (active tab) |
| `SExpansionPanels` | `number[]` (open panel indexes) |
| `SCarousel`, `SWindow`, `SSlideGroup`, `SToggleButtonGroup` | item value or `any[]` |
| `SDatePicker` | `string` (`'YYYY-MM-DD'` or `'YYYY-MM'`) |
| `SNavigationDrawer` | `boolean` |
| `SCalendar` | `v-model:focus` — `string` (focused date) |

### Preset Color Names

```
primary  secondary  error  success  warning
surface  background  on-surface  on-background
```

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

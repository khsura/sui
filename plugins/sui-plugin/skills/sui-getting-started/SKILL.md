---
name: sui-getting-started
description: SUI framework getting started for @khsura/sui — installation, setup, app config, predefined i18n, components, patterns, composables, and conventions. Use when setting up the library, configuring the app, or looking up shared props, component lists, or common mistakes.
---

# SUI Framework — Getting Started

This project uses **`@khsura/sui`**, a Vue 3 + TypeScript component library.
All components are prefixed with `S` (e.g. `SButton`, `SCard`, `SInput`).

---

## Installation

### Vue (standalone)

```bash
yarn add @khsura/sui
```

### Nuxt

```bash
yarn add @khsura/sui @khsura/sui-nuxt
```

Then in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@khsura/sui-nuxt'],
  sui: {
    // optional: AppStateOptions passed to createSUI()
  },
})
```

The Nuxt module:

- Registers all SUI components globally
- Adds composables: `useDisplay`, `useTheme`, `STransition`
- Adds type imports: `GroupItemValue`, `SForm`, `SFormInputModelValueRule`, `SInput`, `SSelect`, `TableHeader`, `TableItem`, `MaterialDesignIcon`
- Injects `suiFormRules` via `getFormInputModelValueRules($i18n)` (use `useNuxtApp().$suiFormRules` in components)
- Loads `@khsura/sui/style.scss` and `@khsura/sui/style.css`

---

## Setup

### Vue (manual)

```typescript
// main.ts
import { createApp } from 'vue'
import { createSUI } from '@khsura/sui'
import '@khsura/sui/base.css'

const app = createApp(App)
app.use(createSUI())
app.mount('#app')
```

### Imports (Vue; Nuxt auto-imports components)

```typescript
import { SButton, SCard, SInput } from '@khsura/sui'
```

### App config (options)

Options passed to `createSUI(options)` (or the Nuxt `sui` config) are merged with the default app config. Type: `AppStateOptions`.

**Vue:**

```typescript
import { createSUI, defaultAppConfig } from '@khsura/sui'

// Options are merged with default; pass partial overrides or spread defaultAppConfig
app.use(createSUI({ theme: 'dark' }))
app.use(createSUI({ ...defaultAppConfig, themes: { light: { presetColors: { primary: '#custom' } } } }))
```

**Options shape:**

| Option    | Type                                                        | Description                              |
| --------- | ----------------------------------------------------------- | ---------------------------------------- |
| `theme`   | `'light' \| 'dark'`                                         | Initial theme                            |
| `display` | `{ thresholds?, scrollBarWidth? }`                          | Breakpoints and scrollbar width          |
| `themes`  | `{ light?: ThemeConfigOptions, dark?: ThemeConfigOptions }` | Per-theme `appColors` and `presetColors` |

The default config (theme, display thresholds, `appColors`, `presetColors` for light/dark) is defined in `configs/app.ts`. Pass partial options to override; they are merged with these defaults.

### Predefined i18n (form rules)

**`i18nMessages`** is exported from `@khsura/sui` (from `constants/i18n.ts`). It provides message strings for table and form rules in `en`, `ja`, and `mn`. Use it with **`getFormInputModelValueRules(i18n)`** so validation errors use these messages. You can merge `i18nMessages` with your app's i18n and combine the predefined rules with your own.

```typescript
import { createI18n } from 'vue-i18n'
import { i18nMessages, getFormInputModelValueRules } from '@khsura/sui'

// Merge SUI messages with your app messages
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      ...i18nMessages.en,
      myApp: { greeting: 'Hello' },
    },
    ja: {
      ...i18nMessages.ja,
      myApp: { greeting: 'こんにちは' },
    },
  },
})

// Rules use the predefined form rule messages (e.g. required, maxLength, numeric)
const rules = getFormInputModelValueRules(i18n.global)
// Use rules.required({ target: 'Email' }), rules.integer({ target: 'Age' }), etc.
```

Shape of `i18nMessages`: `{ [locale]: { table: { itemsPerPage }, formRules: { required, maxLength, length, ... } } }`. Combine with your app's messages per locale as needed.

---

## Critical Patterns

### Activator Slot (Dialog, Menu, Tooltip, Snackbar)

Always bind **both** `v-on="on"` and `v-bind="attrs"`:

```vue
<SMenu>
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open</SButton>
  </template>
  <!-- content -->
</SMenu>
```

### Named Layout System

Layout children are linked to `SLayout` via matching `name`/`for`:

```vue
<SLayout name="app">
  <SAppBar for="app" color="primary" />
  <SNavigationDrawer for="app" v-model="drawer" />
  <SMain for="app">
    <SContainer><router-view /></SContainer>
  </SMain>
  <SFooter for="app" />
</SLayout>
```

All children **must** use the same string for `name`/`for`.

### Validation Rules

```typescript
type FormInputModelValueRule = (value: unknown) => true | string
// Return true = pass, return string = error message

const rules = {
  required: (v: unknown) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
  minLength: (n: number) => (v: string) => v.length >= n || `Min ${n} chars`,
}
```

---

## Shared Props

Available on most components:

| Prop                    | Type                                                   | Description                                                                 |
| ----------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `color`                 | `string`                                               | Preset (`primary`, `secondary`, `error`, `success`, `warning`) or CSS color |
| `elevation`             | `0–24`                                                 | Box shadow depth                                                            |
| `size`                  | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | Preset size                                                                 |
| `outlined`              | `boolean`                                              | Border style, transparent background                                        |
| `disabled`              | `boolean`                                              | Disable interaction                                                         |
| `width` / `height`      | `string \| number`                                     | Explicit dimensions                                                         |
| `maxWidth` / `minWidth` | `string \| number`                                     | Width constraints                                                           |
| `borderRadius`          | `'tile' \| 'rounded' \| number \| string`              | Border radius                                                               |
| `tag`                   | `string`                                               | Override root HTML element                                                  |
| `href`                  | `string`                                               | Render as `<a>`                                                             |
| `to`                    | `RouteLocationRaw`                                     | Vue Router link                                                             |

---

## Components

### Layout

| Component           | Import        | Description                                               |
| ------------------- | ------------- | --------------------------------------------------------- |
| `SLayout`           | `@khsura/sui` | Root layout orchestrator (`name` prop)                    |
| `SAppBar`           | `@khsura/sui` | Top app bar (`for` prop)                                  |
| `SAppBarTitle`      | `@khsura/sui` | Title inside app bar                                      |
| `SNavigationDrawer` | `@khsura/sui` | Side drawer (`for`, `v-model: boolean`)                   |
| `SMain`             | `@khsura/sui` | Main content area (`for` prop)                            |
| `SFooter`           | `@khsura/sui` | Bottom footer (`for` prop)                                |
| `SBottomNavigation` | `@khsura/sui` | Mobile bottom nav (`for`, `v-model: any`)                 |
| `SContainer`        | `@khsura/sui` | Content container (`fluid`, `narrow`, `wide`)             |
| `SRow`              | `@khsura/sui` | 12-col grid row (`align`, `justify`, `noGutters`)         |
| `SColumn`           | `@khsura/sui` | Grid column (`cols`, `sm`, `md`, `lg` — 1–12 or `'auto'`) |
| `SSpacer`           | `@khsura/sui` | Flex spacer (pushes siblings apart)                       |

### Basic UI

| Component  | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `SButton`  | Button (`variant: 'fab' \| 'text' \| 'icon'`, `loading`, `block`, `rounded`) |
| `SIcon`    | Icon (`icon` = MDI icon name, `size`)                                        |
| `SChip`    | Chip/tag (`color`, `outlined`, `closable`)                                   |
| `SBadge`   | Badge wrapper (`content`, `color`, `dot`)                                    |
| `SDivider` | Horizontal or vertical divider                                               |
| `SImage`   | Image with aspect ratio (`src`, `aspectRatio`, `cover`)                      |

### Cards & Surfaces

| Component       | Description                                         |
| --------------- | --------------------------------------------------- |
| `SCard`         | Card container (`elevation`, `outlined`)            |
| `SCardTitle`    | Card title                                          |
| `SCardSubtitle` | Card subtitle                                       |
| `SCardText`     | Card body text                                      |
| `SCardActions`  | Card action buttons area                            |
| `SSheet`        | Elevation surface (`color`, `elevation`, `rounded`) |
| `SOverlay`      | Full-screen overlay (`v-model: boolean`, `opacity`) |

### Forms

All form inputs share: `disabled`, `rules`, `hideDetails`, `hideError`, `error`, `dirty`, `label`.

| Component       | v-model            | Key Props                                                         |
| --------------- | ------------------ | ----------------------------------------------------------------- |
| `SForm`         | —                  | `@submit` event                                                   |
| `SInput`        | `string \| number` | `type`, `placeholder`, `suffix`, `dense`, `readonly`, `autofocus` |
| `STextarea`     | `string`           | `rows`, `autoGrow`                                                |
| `SSelect`       | `any \| any[]`     | `items: [{title, value}]`, `multiple`, `chips`, `clearable`       |
| `SAutocomplete` | `any \| any[]`     | `items`, `filterMode`, `debounce`, `@update:search-input`         |
| `SCheckbox`     | `boolean \| any[]` | `label`, `value`, `indeterminate`                                 |
| `SRadioGroup`   | `any`              | `items: [{title, value}]`, `inline`, `column`                     |
| `SSwitch`       | `boolean`          | `label`, `color`                                                  |

`SelectItem` shape: `{ title: string, value: any }` or plain string.

### Navigation

| Component            | Description                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `SBreadcrumbs`       | Breadcrumb nav (`items: [{text, to, disabled}]`)                                             |
| `STabs`              | Tab bar (`v-model: string \| number` = active tab)                                           |
| `STab`               | Individual tab (`value`)                                                                     |
| `SToolbar`           | Toolbar container (`color`, `density: 'default' \| 'comfortable' \| 'compact'`)              |
| `SToolbarTitle`      | Toolbar title                                                                                |
| `SToolbarItem`       | Toolbar action item                                                                          |
| `SSlideGroup`        | Horizontal scrolling group (`v-model`)                                                       |
| `SSlideItem`         | Slide group item                                                                             |
| `SToggleButtonGroup` | Toggle button group (`v-model` array, `multiple`, `mandatory`)                               |
| `SToggleButton`      | Toggle button — uses **index** as primary identifier, `key` as fallback; **no `value` prop** |

### Popups & Overlays

| Component   | v-model   | Notes                                                          |
| ----------- | --------- | -------------------------------------------------------------- |
| `SDialog`   | `boolean` | `persistent`, `fullscreen`, `location: 'bottom'`, `scrollable` |
| `SMenu`     | `boolean` | `location`, `origin`                                           |
| `STooltip`  | `boolean` | `text`, `location`                                             |
| `SSnackbar` | `boolean` | `text`, `timeout`, `location`                                  |

All support `#activator="{ on, attrs }"` slot.

### Data Display

| Component           | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `SList`             | List container                                                 |
| `SListItem`         | List item (`link`, `:to`, `disabled`)                          |
| `SListItemTitle`    | Item title                                                     |
| `SListItemSubtitle` | Item subtitle                                                  |
| `SListItemIcon`     | Icon slot in list item                                         |
| `SListItemContent`  | Content wrapper                                                |
| `SListItemAction`   | Action slot                                                    |
| `SListItemGroup`    | Grouped list items                                             |
| `STable`            | Data table (`headers`, `items`, `loading`, `sortable`)         |
| `STableHeadCell`    | Table header cell                                              |
| `STableBodyCell`    | Table body cell                                                |
| `STablePagination`  | Pagination control                                             |
| `SProgressLinear`   | Linear progress bar (`v-model: number`, `indeterminate`)       |
| `SProgressCircular` | Circular progress (`v-model: number`, `indeterminate`, `size`) |

### Content Panels

| Component                | v-model    | Description                                |
| ------------------------ | ---------- | ------------------------------------------ |
| `SExpansionPanels`       | `number[]` | Accordion panels                           |
| `SExpansionPanel`        | —          | Individual panel                           |
| `SExpansionPanelHeader`  | —          | Panel header                               |
| `SExpansionPanelContent` | —          | Panel content                              |
| `SCarousel`              | `number`   | Image carousel (`cycle`, `interval`)       |
| `SCarouselItem`          | —          | Carousel slide                             |
| `SWindow`                | `any`      | Manual slide window                        |
| `SWindowItem`            | —          | Window slide (`value`)                     |
| `SStepper`               | `number`   | Multi-step flow                            |
| `SStepperStep`           | —          | Step item (`step`, `complete`, `editable`) |
| `SSplitView`             | —          | Resizable split panes                      |
| `SSplitViewItem`         | —          | Split pane                                 |

### Date & Time

| Component     | v-model  | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `SDatePicker` | `string` | `type: 'date' \| 'month'`, `min`, `max`, `range` |
| `SCalendar`   | —        | `v-model:focus` = focused date string, `events`  |

DatePicker format: `'YYYY-MM-DD'` (date) or `'YYYY-MM'` (month).
Import `datePickerModelFormats` for the exact format strings.

### Input / Upload

| Component    | Description                                               |
| ------------ | --------------------------------------------------------- |
| `SDroppable` | Drag-and-drop upload zone (`@drop`, `accept`, `multiple`) |

---

## Services & Composables

```typescript
import { useTheme, useDisplay, useScroll, useClickOutside } from '@khsura/sui'

// Theme
const { theme, setTheme, toggleTheme } = useTheme()

// Responsive breakpoints
const { isMobile, isTablet, isDesktop, smAndUp, mdAndUp, lgAndUp } = useDisplay()

// Scroll position
const { scrollX, scrollY, scrollTo } = useScroll()

// Click outside detection
const elRef = ref<HTMLElement>()
useClickOutside(elRef, () => {
  /* callback */
})
```

---

## Directives

```vue
<div v-scroll="onScroll">...</div>
<div v-resize="onResize">...</div>
```

Directives are auto-registered by `createSUI()`.

---

## Utility Classes

- Spacing: `s_ml__3`, `s_mr__2`, `s_pa__4`, `s_pt__2`
- Typography: `s_text--h5`, `s_text--body1`, `s_text--caption`
- Colors: `s_color--primary`, `s_color--error`

Import utility classes: `import '@khsura/sui/helpers.scss'`

---

## Common Mistakes to Avoid

- **Activator**: always bind both `v-on="on"` AND `v-bind="attrs"` — missing either breaks popup behavior
- **Layout**: `SMain`, `SAppBar`, `SNavigationDrawer` etc. must have matching `for` = `SLayout`'s `name`
- **SSelect/SAutocomplete items**: must be `{ title, value }` objects or plain strings — not `{ label, id }`
- **Validation rules**: return `true` to pass (not `null`/`undefined`) and a `string` to fail
- **`loading` on SButton**: implicitly disables it — don't set `disabled` separately
- **SForm**: does not auto-validate on mount — call `.validate()` on a ref or use `@submit`
- **SDatePicker**: model value must be a string in the correct format, not a Date object

---

## Related Skills

Use these skills in the same `claude/skills/` folder for focused tasks:

- **sui-getting-started** (this skill) — installation, setup, app config, predefined i18n, component list, patterns
- **sui-layout** — scaffold an app layout (app bar, drawer, grid)
- **sui-form** — build a validated form with SUI form components
- **sui-component** — look up and use a specific SUI component with examples

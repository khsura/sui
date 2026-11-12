---
name: sui-getting-started
description: Set up and configure @khsura/sui in a Vue 3 or Nuxt app. Use when installing @khsura/sui (GitHub Packages registry, .npmrc / .yarnrc.yml, read:packages token, CI auth), wiring createSUI and the SApp root, importing the stylesheets and @mdi/font icons, adding @khsura/sui-nuxt, overriding theme colors or switching dark mode with useTheme, setting app-wide component defaults, setting up vue-i18n for SUI messages and form rules, importing SUI TypeScript types, or looking up shared props, the component list, composables and common mistakes.
---

# SUI — Getting Started in a consumer app

**`@khsura/sui`** is a Vue 3 + TypeScript component library. Every component is prefixed with `S` (`SButton`, `SCard`, `SInput`).

---

## 1. Install (GitHub Packages, not npmjs.com)

`@khsura/sui` is published to **`https://npm.pkg.github.com`**. A plain `yarn add @khsura/sui` / `npm i @khsura/sui` fails (404 / 401) until the `@khsura` scope points at that registry **and** a token is supplied.

**Token:** a GitHub personal access token (classic) with the **`read:packages`** scope. Keep it in an environment variable (`NPM_GITHUB_TOKEN` below) — never commit it.

### Yarn 4 (Berry) — `.yarnrc.yml`

```yaml
npmScopes:
  khsura:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAlwaysAuth: true
    npmAuthToken: "${NPM_GITHUB_TOKEN}"

# optional: read the token from a git-ignored file instead of the shell
injectEnvironmentFiles:
  - .env.yarn?
```

`.env.yarn` (add it to `.gitignore`): `NPM_GITHUB_TOKEN=ghp_xxx`

### npm / pnpm — project `.npmrc`

```ini
@khsura:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_GITHUB_TOKEN}
```

The `.npmrc` with the `${...}` placeholder is safe to commit; the token itself is not.

### CI

Expose the token as an env var from a secret — the config files above read it:

```yaml
# GitHub Actions
- run: yarn install --immutable   # or npm ci / pnpm install --frozen-lockfile
  env:
    NPM_GITHUB_TOKEN: ${{ secrets.NPM_GITHUB_TOKEN }}
```

Then install:

```bash
yarn add @khsura/sui @mdi/font      # or: npm i / pnpm add
```

`vue`, `vue-i18n` and `dayjs` come in as dependencies of `@khsura/sui`. `@mdi/font` is **not** included — install it yourself (see step 3).

---

## 2. Register the plugin and wrap the app in `SApp`

```typescript
// main.ts
import { createApp } from 'vue'
import { createSUI } from '@khsura/sui'
import '@khsura/sui/base.css'   // reset, typography, s_* utility classes
import '@khsura/sui/style.css'  // component styles
import '@mdi/font/css/materialdesignicons.css' // icons for SIcon / icon props
import App from './App.vue'

createApp(App).use(createSUI()).mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <SApp>
    <router-view />
  </SApp>
</template>

<script setup lang="ts">
import { SApp } from '@khsura/sui'
</script>
```

**`SApp` is required at the root.** It sets the theme CSS variables (`--s-color-*`, `--s-app-color-*`) that every component's colors read, and renders the container that `SDialog`, `SMenu`, `STooltip`, `SSnackbar`, `SOverlay` and the select popups teleport into. Without it colors are missing and popups don't appear.

`createSUI()` also registers the `v-scroll` and `v-resize` directives.

Import components where you use them (Vue): `import { SButton, SCard } from '@khsura/sui'`.

---

## 3. Styles and icons

| Import | Contains | Needed |
|---|---|---|
| `@khsura/sui/base.css` | Reset, typography, `s_*` utility classes | Yes |
| `@khsura/sui/style.css` | Styles of the components themselves | Yes |
| `@khsura/sui/style.scss` | SCSS source of `base.css` (alternative to `base.css`) | Optional |
| `@khsura/sui/helpers.scss` | SCSS functions / mixins only, emits no CSS | For your own SCSS: `@use '@khsura/sui/helpers.scss' as *;` |
| `@mdi/font/css/materialdesignicons.css` | Material Design Icons font | Yes, if you use any icon |

`SIcon` (and every `icon` / `prependIcon` / `appendIcon` prop) renders an MDI **class name** (`icon="mdi-home"`). Without the `@mdi/font` stylesheet it renders an empty box — no error.

---

## 4. Nuxt — `@khsura/sui-nuxt`

`@khsura/sui-nuxt` is a Nuxt module (Nuxt ≥ 4) published to the **same GitHub Packages registry**, so the registry/token setup above covers it.

```bash
yarn add @khsura/sui @khsura/sui-nuxt @mdi/font
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@khsura/sui-nuxt'],
  css: ['@mdi/font/css/materialdesignicons.css'],
  sui: {
    // AppStateOptions passed to createSUI(): theme, themes, display, components
  },
})
```

The module:

- calls `createSUI(sui options)` for you
- loads `@khsura/sui/style.css` and `@khsura/sui/style.scss` (you don't import them, but you **do** add `@mdi/font` to `css`)
- auto-imports `useDisplay`, `useTheme`, `STransition`, and the types `GroupItemValue`, `SInput`, `SSelect`, `SForm`, `TableHeader`, `TableItem`, `MaterialDesignIcon`
- provides `useNuxtApp().$suiFormRules` = `getFormInputModelValueRules(nuxtApp.$i18n)` — this needs `@nuxtjs/i18n` installed, or the rules throw when they try to build a message
- auto-registers most components, but **not** `SLayout`, `SBottomNavigation`, `SCarousel`, `SCarouselItem`, `SSplitView`, `SSplitViewItem`, `SToolbarItem`, `STableHeadCell`, `STableBodyCell`, `SDroppable` — import these explicitly from `@khsura/sui`

You still need `<SApp>` at the root (e.g. in `app.vue` or your layout).

---

## 5. App options — `createSUI(options)`

Options (type `AppStateOptions`) are deep-merged with the built-in defaults (exported as `defaultAppConfig`), so pass only what you change. In Nuxt put the same object under `sui`.

| Option | Type | Description |
|---|---|---|
| `theme` | `'light' \| 'dark'` | Initial theme (default `'light'`) |
| `themes` | `{ light?: ThemeConfigOptions, dark?: ThemeConfigOptions }` | Per-theme `presetColors` and `appColors` |
| `display` | `{ thresholds?, scrollBarWidth? }` | Breakpoints and scrollbar width |
| `components` | `{ [ComponentName]: Record<string, unknown> }` | App-wide default props per component |

### Theme colors

```typescript
app.use(
  createSUI({
    themes: {
      light: { presetColors: { primary: '#6200ee', secondary: '#03dac6' } },
      dark: {
        presetColors: { primary: '#bb86fc' },
        appColors: { background: '#121212', card: '#1e1e1e' },
      },
    },
  }),
)
```

- **`presetColors` keys:** `primary`, `secondary`, `success`, `info`, `warning`, `important`, `error` — usable as `color="..."` on components. Extra keys you add become usable too.
- **`appColors` keys:** `appBar`, `title`, `text`, `secondaryText`, `anchor`, `background`, `card`, `button`, `switch`, `border`, `disabled`, `snackbar`, `inputPlaceholderShown`, `textErrorHover`.
- Use **opaque hex** values (`#ffc107`). An alpha hex (`#ffc10799`) looks washed out everywhere; for translucency use `color-mix(in srgb, #{s_getPresetColor('warning')} 60%, transparent)` in SCSS.

### Dark mode — `useTheme()`

```typescript
import { useTheme } from '@khsura/sui'

const { theme, setTheme } = useTheme()   // theme: ComputedRef<'light' | 'dark'>

setTheme('dark')
setTheme(theme.value === 'dark' ? 'light' : 'dark') // toggle — there is no toggleTheme()
setTheme(null)                                       // follow the OS setting
```

Call it inside a component below `app.use(createSUI())`; it throws if the plugin isn't installed.

### Component defaults — `components`

Set a prop once for every instance instead of repeating it (or overriding classes with `:deep(.s_*)`):

```typescript
app.use(
  createSUI({
    components: {
      SSelect: { outlined: true },
      SButton: { color: 'primary', size: 'small' },
      SInput: { dense: true },
    },
  }),
)
```

Priority: **prop on the element > `components` default > built-in default**. Keys are component names (`SButton`, `SInput`, …).

---

## 6. vue-i18n — SUI messages and form rules

SUI ships messages in **`en`, `mn`, `ja`** for `STable` (`table.itemsPerPage`, `table.noData`) and the predefined form rules (`formRules.*`). `STable` reads them through the global `$t`, so register vue-i18n with the SUI messages merged in. `i18nConfig` (exported) is a ready config: `{ availableLocales: ['en', 'mn', 'ja'], locale: 'en', fallbackLocale: 'en', messages: i18nMessages }`.

```typescript
import { createI18n } from 'vue-i18n'
import { i18nConfig, i18nMessages, getFormInputModelValueRules } from '@khsura/sui'

export const i18n = createI18n({
  ...i18nConfig,
  locale: 'ja',
  messages: {
    en: { ...i18nMessages.en, ...appMessages.en },
    mn: { ...i18nMessages.mn, ...appMessages.mn },
    ja: { ...i18nMessages.ja, ...appMessages.ja },
  },
})

app.use(i18n)

// Predefined rules with localized messages
const rules = getFormInputModelValueRules(i18n.global)
// rules.required({ target: 'Email' }), rules.maxLength({ target: 'Name', maxLength: 50 }), …
```

Inside a component: `getFormInputModelValueRules(useI18n())`. In Nuxt use `@nuxtjs/i18n` and merge `i18nMessages` into its messages; `useNuxtApp().$suiFormRules` is prebuilt. Rule list: **sui-form**.

---

## 7. TypeScript types

All exported from `@khsura/sui` (`import type { … } from '@khsura/sui'`):

| Type | Use |
|---|---|
| `TableHeader`, `TableItem`, `TableSortOrder` | `STable` headers (`{ text, value, … }`) and rows |
| `SelectItem` | `SSelect` / `SAutocomplete` items (`{ text, value, disabled? }`) |
| `FormInputModelValueRule` | A validation rule `(value) => true \| string` |
| `FormComponent`, `InputComponent`, `SelectComponent` | Template-ref types (`ref<FormComponent>()`) |
| `AppStateOptions`, `ThemeConfigOptions`, `AppThemeType` | `createSUI` options |
| `MaterialDesignIcon`, `GroupItemValue`, `BreadcrumbsItem`, `CalendarEvent` | Icon names, group values, breadcrumb items, calendar events |

Prop types for every component ship in `node_modules/@khsura/sui/@types/definitions/props/props<Component>.d.ts` — check there before using a prop you're unsure of.

---

## Critical patterns

### Activator slot (SDialog, SMenu, SSnackbar)

Bind **both** `v-on="on"` and `v-bind="attrs"`:

```vue
<SMenu location="bottom">
  <template #activator="{ on, attrs }">
    <SButton v-on="on" v-bind="attrs">Open</SButton>
  </template>
  <!-- content -->
</SMenu>
```

`STooltip` is different: its activator slot passes **no** scope — put the trigger in `#activator` without `v-on`/`v-bind`; the tooltip's own wrapper handles hover. See the `sui-component` references.

### Named layouts

`SLayout name="app"` + children with `for="app"`. Once `SLayout` has a `name`, every child needs the matching `for`. Details: **sui-layout**.

### Validation rules

```typescript
type FormInputModelValueRule = (value: unknown) => true | string
// true = pass, string = error message (false/null show nothing)
```

---

## Shared props

Available on most components (check the component's reference when unsure):

| Prop | Type | Description |
|---|---|---|
| `color` | `string` | Preset name (`primary`, `error`, …) or CSS color |
| `elevation` | `0–24` | Box shadow depth |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | Preset size |
| `outlined` / `underlined` / `borderRadius` | `boolean` / `boolean` / `string \| number` | Border styles |
| `disabled` | `boolean` | Disable interaction |
| `width` / `height` / `maxWidth` / `minWidth` | `string \| number` | Dimensions |
| `tag` | `string` | Override root element |
| `href` / `to` | `string` / `RouteLocationRaw` | Render as `<a>` / `router-link` |

---

## Components

| Family | Components | Reference |
|---|---|---|
| App shell | `SApp`, `SLayout`, `SAppBar`, `SAppBarTitle`, `SNavigationDrawer`, `SMain`, `SFooter`, `SBottomNavigation` | **sui-layout** |
| Grid | `SContainer`, `SRow`, `SColumn` (there is no `SCol`), `SSpacer` | **sui-layout** |
| Forms | `SForm`, `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SCheckbox`, `SRadioGroup` + `SRadio`, `SSwitch`, `SDatePickerInput` | **sui-form** |
| Everything else | Buttons, cards, lists, tables, dialogs, menus, tabs, steppers, carousels, date pickers, … | **sui-component** (one reference file per family) |

---

## Composables

```typescript
import { useTheme, useDisplay, useScroll, useClickOutside } from '@khsura/sui'

const { theme, setTheme } = useTheme()

// Breakpoints (refs): xs, sm, md, lg, xl, xxl, smAndUp, smAndDown, mdAndUp, mdAndDown,
// lgAndUp, lgAndDown, mobile, name, width, height, isTouchDevice
const { mdAndUp, mobile } = useDisplay()

// Scroll helpers
const { smoothScrollTo, scrollIntoView, smoothElementScroll, hasScrollFeature } = useScroll()

// Click outside: register/unregister yourself
const el = ref<HTMLElement | null>(null)
const { register, unregister } = useClickOutside().onClick(el, ({ isOutside }) => {
  if (isOutside) close()
})
onMounted(register)
onBeforeUnmount(unregister)
```

Directives (`v-scroll`, `v-resize`) and utility classes: **sui-utilities**.

---

## Common mistakes

| ❌ | ✅ |
|---|---|
| `yarn add @khsura/sui` with no registry config → 404/401 | Point `@khsura` at `https://npm.pkg.github.com` and supply a `read:packages` token (step 1) |
| Token pasted into a committed `.npmrc` / `.yarnrc.yml` | `${NPM_GITHUB_TOKEN}` placeholder + env var / CI secret |
| Icons render as empty boxes | Load `@mdi/font` — `import '@mdi/font/css/materialdesignicons.css'` (Vue) or `css: ['@mdi/font/css/materialdesignicons.css']` (Nuxt) |
| Only `style.css` (or only `base.css`) imported | Import both in plain Vue; the Nuxt module loads them |
| No `<SApp>` root → no colors, dialogs/menus never show | Wrap the app in `<SApp>` |
| `const { toggleTheme, isMobile } = …` | They don't exist: `setTheme(...)`; `useDisplay().mobile` / `mdAndUp` |
| Nuxt: `<SLayout>` / `<SCarousel>` "failed to resolve component" | Import them from `@khsura/sui` — the module doesn't auto-register them |
| Birth-date picker without `min` → years older than 5 years can't be picked | Without `min`/`max`, `SDatePicker` / `SDatePickerInput` allow Jan 1 five years before `today` to Dec 31 five years after — pass `min` / `max` for wider ranges |
| `SDatePicker` model as a `Date` | A string: `'YYYY-MM-DD'`, `'YYYY-MM'` or `'YYYY'` by `type` |
| Popup activator binds only `v-on="on"` | Bind `v-on="on"` **and** `v-bind="attrs"` (SDialog, SMenu, SSnackbar) |
| `SMenu` without `location` opens on top of its button | `location="bottom"` |
| Named `SLayout` with un-`for`ed children | `for` on every child, or `name`/`for` on none |
| Items as `{ title, value }` / `{ label, id }` | `{ text, value }` or plain strings |
| `SSelect multiple / chips / clearable / placeholder` | `SAutocomplete` |
| Rule returns `false` | Return a message string |
| `if (!formRef.value.validate()) return` | `validate()` returns `true` when there **are** errors |
| `hideDetails` to hide just the error | `hideError` (`hideDetails` hides the label too) |
| Unknown props (`SDialog title`, `persistent-hint`, `app`) | Silently ignored — check `@types/definitions/props` |
| `:deep(.s_*) { … !important }` | A prop, a `createSUI({ components })` default, or theme colors |
| `alpha` hex in `presetColors` | Opaque hex + `color-mix()` where you need translucency |

---

## Related skills

Use the installed plugin rather than copying these files into a project (`.claude/skills/`) — copies go stale when SUI updates.

- **sui-layout** — app shell (app bar, drawer, footer, grid)
- **sui-form** — validated forms and rules
- **sui-component** — any component: props, slots, events, examples (per-family references)
- **sui-utilities** — utility classes, directives, SCSS helpers

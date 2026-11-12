# Layout Components

**Import:**
```ts
import {
  SApp, SLayout, SMain,
  SAppBar, SAppBarTitle,
  SNavigationDrawer, SFooter, SBottomNavigation,
  SContainer, SRow, SColumn, SSpacer,
} from '@khsura/sui'
```

Layout parts register with a parent layout. That layout tracks app-bar height, drawer widths, and footer/bottom-nav height, and `SMain` offsets itself by them.

Types: `node_modules/@khsura/sui/@types/definitions/props/props<AppBar|NavigationDrawer|Main|Footer|BottomNavigation|Layout|Container|Row|Column>.d.ts`

---

## How layouts are linked (read this first)

- **`SApp`** is the root. It provides the app state and is itself an *app-level* layout. Wrap the whole app in it (after installing the `createSUI()` plugin).
- **`SLayout`** creates a layout scope. Children find it by name:
  - SLayout without `name` → children **without `for`** join it as the **app-level** layout (inside `SApp`).
  - SLayout with `name="x"` → **every** child needs `for="x"`. A child without `for` joins the app-level layout instead, so offsets silently break.
- **App-level vs nested.** A layout is app-level when its name equals the plugin name (`'sui'` by default, so: no `name`) or when it has the `app` prop. A named layout (`name="x"` with no `app` prop on it and its children) is a *nested* layout:
  - `SNavigationDrawer` is `position: absolute` inside the layout (not fixed), and `permanent` has **no effect**.
  - `SFooter` ignores `position`. `SBottomNavigation` is not fixed unless you set `position="fixed"`.
  - `SMain` renders `<section>` with `min-height: 100%` instead of `<main>` with `100vh`.
- Without `SApp`, an unnamed `SLayout` and its children do **not** link up.
- Below the `md` breakpoint (or with `forceMobile`), a drawer becomes a mobile overlay. It does not push `SMain`, opens by swiping in from the screen edge, and closes on an outside click.

```vue
<!-- Recommended: app-level layout -->
<SApp>
  <SLayout>
    <SAppBar position="fixed" />
    <SNavigationDrawer v-model="drawer" />
    <SMain><RouterView /></SMain>
  </SLayout>
</SApp>
```

---

## SApp / SLayout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | plugin name (`'sui'`) | Layout name. Children link with `for` |
| `app` | `boolean` | `true` on SApp, `false` on SLayout | Treat as the app-level layout |
| `width` / `height` / `min*` / `max*` | `string \| number` | — | SLayout only: dimensions |

Slot: `default`. SLayout is a flex column, `position: relative`.

---

## SAppBar

Built on SToolbar. It renders a `<header>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | — | Layout link (see above) |
| `position` | `'fixed' \| 'absolute' \| 'static' \| 'relative' \| 'sticky'` | `undefined` (in flow) | `SMain` adds a top margin only when `fixed` |
| `elevateOnScroll` | `boolean` | `false` | Shadow after scrolling (needs `fixed`/`absolute`) |
| `hideOnScroll` | `boolean` | `false` | Hide on scroll down, show on scroll up |
| `scrollTarget` / `scrollThreshold` | `string \| HTMLElement` / `number` | window / `64` | Scroll source and threshold |
| `height` | `number \| string` | `64` | Bar height |
| `density` | `'default' \| 'comfortable' \| 'compact'` | — | Height preset |
| `extended` | `boolean` | auto (`true` when `#extension` is used) | Show the extension row |
| `extensionHeight` | `number \| string` | `48` | Extension height |
| `fixedExtension` | `boolean` | `false` | Keep only the extension visible (fixed) |
| `title` | `string` | — | Title text |
| `color` | `string` | `'appBar'` | Background |
| `elevation`, `outlined`, `underlined`, `borderRadius`, `tag` | — | `tag: 'header'` | Shared props |

**Slots:** `default`, `extension`. SAppBar does **not** forward `prepend`/`append`, so put everything in `default` and use `SSpacer`.

## SAppBarTitle

Props: `text`, `color`, `tag`. Slots: `default` (or `text`).

---

## SNavigationDrawer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | — | Layout link |
| `v-model` | `boolean` | closed until first resize check | Open state. On desktop it auto-opens and on mobile it auto-closes (unless `persistent`) |
| `location` | `'left' \| 'right' \| 'bottom'` | `'left'` | Side. `bottom` is always mobile-style |
| `permanent` | `boolean` | `false` | Always open on desktop (**app-level layout only**) |
| `persistent` | `boolean` | `false` | Desktop: ignore outside clicks and resizes |
| `miniVariant` | `boolean` | `false` | Collapsed width (`v-model:mini-variant`) |
| `miniVariantWidth` | `string \| number` | `256` when not numeric | Mini width (set it, e.g. `56`) |
| `expandOnHover` | `boolean` | `false` | Mini until hovered |
| `forceMobile` | `boolean` | `false` | Use mobile behaviour on desktop |
| `touchless` | `boolean` | `false` | Disable swipe and hover handlers |
| `activator` | `string \| HTMLElement \| component` | — | Only **excluded from click-outside**. It does **not** toggle the drawer |
| `width` | `string \| number` | `256` | Width. Use `v-model:width` with `resizable` |
| `resizable` | `boolean` | `false` | Drag handle on the inner edge (desktop, not mini). Arrow keys resize by 16px |
| `minWidth` / `maxWidth` | `number` | `200` / `720` | Resize limits |
| `height` | `string \| number` | `100vh` when app-level, else `100%` | Height. App-level = the drawer has `app`, or its `for` is the app's name |
| `position`, `elevation` | — | — | Shared props |
| `tag` | `'nav' \| 'div' \| 'section'` | `nav` when app-level, else `aside` | Root element |
| `hideOverlay` | `boolean` | `false` | Declared. The scrim is not rendered in the current version |

**Slots:** `prepend`, `default` (scope `{ on }`: `click`, `transitionend`, `mouseenter`, `mouseleave` handlers), `append`.
**Events:** `update:modelValue`, `update:width` (resize end), `update:miniVariant`, `transitionend`.

A left and a right drawer can share one layout. Each one offsets its own side of `SMain`:

```vue
<SNavigationDrawer v-model="isNavOpen" />
<SNavigationDrawer v-model="isChatOpen" v-model:width="chatWidth" location="right"
  persistent resizable :min-width="320" :max-width="640" />
```

---

## SMain

Props: `for`, `app`, `tag` (default `main` at app level, `section` otherwise). Slot: `default`. Margins follow the drawers (left/right), a `fixed` app bar (top), and the bottom navigation (app level) or footer (nested).

## SFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | — | — | Layout link |
| `position` | `'fixed' \| 'absolute' \| …` | — | Applied only in an app-level layout |
| `inset` / `padless` | `boolean` | `false` | Inset / no padding |
| `color`, `elevation`, `height`, `width`, `min*`/`max*` | — | — | Shared props |
| `tag` | `'footer' \| 'div'` | `'footer'` | Root element |

Slot: `default`. Its width tracks the drawers.

## SBottomNavigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `string \| number \| …` | — | `value` of the selected child `SButton` |
| `height` | `string \| number` | — | **Set it.** Without it the bar collapses and SMain gets no bottom offset |
| `activeClass` | `string` | — | Class added to the selected button. **There is no active styling without it** |
| `mandatory` | `boolean` | `false` | Always keep one selected |
| `grow` / `shift` / `horizontal` / `dense` / `bordered` | `boolean` | `false` | Layout variants |
| `hideOnScroll` | `boolean` | `false` | Hide on scroll. It also overwrites `v-model` with a boolean, so avoid combining it with selection |
| `position` | — | fixed at app level | Set `fixed` in a nested layout |
| `for` / `app`, `tag`, `width`, border props | — | — | Shared props |

Slot: `default`. Use `SButton`s with a `value`.

```vue
<SBottomNavigation v-model="tab" :height="56" active-class="s_textColor__primary" grow>
  <SButton value="home"><SIcon icon="mdi-home" /><span>Home</span></SButton>
  <SButton value="search"><SIcon icon="mdi-magnify" /><span>Search</span></SButton>
</SBottomNavigation>
```

---

## Grid: SContainer / SRow / SColumn / SSpacer

The column component is **`SColumn`**. There is no `SCol`.

**SContainer:** `fluid`, `narrow`, `wide`, `padless`, `fill` (color applies to the outer box), `color`, `tag`. Slot `default`.

**SRow:**

| Prop | Type | Description |
|------|------|-------------|
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | Cross-axis |
| `justify` | `'start' \| 'center' \| 'end' \| 'spaceBetween' \| 'spaceAround'` | Main-axis (**camelCase**) |
| `noGutters` / `noOuterGutters` / `dense` / `fillHeight` | `boolean` | Gutters / height |
| `gap` | `number \| string` | Custom gap (replaces gutters) |
| `contentClass` / `contentStyle` | — | Inner wrapper class/style |

**SColumn:** `cols`, `sm`, `md`, `lg` (`1`–`12 \| 'auto' \| 'grow'`), `order` (number), `alignSelf`, `contentClass`/`contentStyle`. There is no `xl`.

**SSpacer:** `flex-grow: 1`, with no props.

```vue
<SContainer>
  <SRow justify="spaceBetween" align="center">
    <SColumn :cols="12" :md="6">Left</SColumn>
    <SColumn :cols="12" :md="6">Right</SColumn>
  </SRow>
</SContainer>
```

---

## Full example

```vue
<SApp>
  <SLayout>
    <SAppBar position="fixed" elevate-on-scroll>
      <SButton variant="icon" @click="drawer = !drawer"><SIcon icon="mdi-menu" /></SButton>
      <SAppBarTitle>My App</SAppBarTitle>
      <SSpacer />
      <SButton variant="icon"><SIcon icon="mdi-account" /></SButton>
    </SAppBar>
    <SNavigationDrawer v-model="drawer">
      <SList dense>
        <SListItem :to="{ name: 'home' }">
          <SListItemContent><SListItemTitle>Home</SListItemTitle></SListItemContent>
        </SListItem>
      </SList>
    </SNavigationDrawer>
    <SMain><SContainer><RouterView /></SContainer></SMain>
  </SLayout>
</SApp>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SLayout name="app">` + `<SMain>` (no `for`) | Add `for="app"` to every child, or drop `name` |
| `<SNavigationDrawer permanent>` in a named layout | `permanent` works only at app level (no `name`, or `app` on the layout and its children) |
| `<SNavigationDrawer activator="#btn">` with no `v-model` | Bind `v-model` and toggle it from the button |
| `<SAppBar><template #prepend>…` | Not forwarded. Put content in `default` |
| `<SRow justify="space-between">` | `justify="spaceBetween"` |
| `<SCol>` | `<SColumn>` |
| `<SBottomNavigation v-model="tab">` with no `height`/`active-class` | Set `:height` and `active-class` |
| `<SAppBar elevate-on-scroll>` with no position | Add `position="fixed"` |

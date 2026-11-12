# Layout Components

**Import:**
```typescript
import {
  SApp,
  SAppBar, SAppBarTitle,
  SLayout,
  SMain,
  SNavigationDrawer,
  SFooter,
  SBottomNavigation,
  SContainer,
  SRow,
  SColumn,
  SSpacer,
} from '@khsura/sui'
```

SUI uses a named layout system — layout parts register with a parent layout, which tracks app-bar height, drawer widths and footer/bottom-navigation height so that `SMain` can offset itself.

---

## Layout System Overview

```
SApp
  └── SLayout                    ← app-level layout (no `name`)
        ├── SAppBar
        ├── SNavigationDrawer
        ├── SMain                ← main content area
        ├── SFooter
        └── SBottomNavigation
```

- **`SApp`** is the root. It provides the app state and is itself an app-level layout. Wrap the whole app in it (after installing the `createSUI()` plugin). `SLayout` throws if no app state is found.
- **`SLayout` without `name`** → children **without `for`** join it as the **app-level** layout.
- **`SLayout name="x"`** → **every** child needs `for="x"`. A child without `for` joins the app-level layout instead, so offsets silently break.
- **App-level vs nested.** A layout is app-level when its name equals the plugin name (`'sui'` by default, i.e. no `name`) or when it has the `app` prop. A named layout is *nested*:
  - `SNavigationDrawer` is `position: absolute` inside the layout (not fixed), and `permanent` has no effect.
  - `SFooter` ignores `position`. `SBottomNavigation` is not fixed unless you set `position="fixed"`.
  - `SMain` renders `<section>` with `min-height: 100%` instead of `<main>` with `100vh`.
- Below the `md` breakpoint (or with `forceMobile`), a drawer becomes a mobile drawer: it does not push `SMain`, opens by swiping in from the screen edge, and closes on an outside click.

---

## SApp / SLayout

Root layout orchestrators. `SLayout` is a flex column with `position: relative`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | plugin name (`'sui'`) | Layout identifier — children use `for` to match this |
| `app` | `boolean` | `true` on `SApp`, `false` on `SLayout` | Treat this layout as the app-level layout |
| `width` / `height` / `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | `string \| number` | `undefined` | `SLayout` only: dimensions |

### Slots

| Slot | Description |
|------|-------------|
| `default` | All layout children |

---

## SAppBar

Top application bar, built on `SToolbar`. Renders a `<header>`.

### Props (extends SToolbar props, plus)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | `undefined` | Layout link (see overview) |
| `position` | `'fixed' \| 'absolute' \| …` | `undefined` (in flow) | CSS position. Pass `position="fixed"` for a fixed bar — `SMain` adds a top margin only when the bar is `fixed` |
| `elevateOnScroll` | `boolean` | `false` | Add shadow when the page is scrolled (needs `fixed`/`absolute`) |
| `hideOnScroll` | `boolean` | `false` | Hide bar on scroll down, show on scroll up |
| `scrollTarget` | `string \| HTMLElement` | window | Scroll source |
| `scrollThreshold` | `number` | `64` | Scroll distance before scroll effects apply |
| `fixedExtension` | `boolean` | `false` | Keep only the extension visible (fixed) when scrolled |
| `height` | `number \| string` | `64` | Bar height |
| `color` | `string` | `'appBar'` | Background color |
| `elevation` | `0–24` | `undefined` | Shadow depth |
| `density` | `'default' \| 'comfortable' \| 'compact'` | `undefined` | Height preset |
| `extended` | `boolean` | auto (`true` when `#extension` is used) | Show the extension area |
| `extensionHeight` | `number \| string` | `48` | Extension height |
| `tag` | `string` | `'header'` | Root element |

### Slots

| Slot | Description |
|------|-------------|
| `default` | App bar content — put everything here and use `SSpacer` to push items apart |
| `extension` | Extension area below main bar |

`SAppBar` has **no** `prepend` / `append` slots.

---

## SAppBarTitle

Title text inside an app bar.

**Props:** `text` (`string`), `color`, `tag`.
**Slots:** `default` — title content (or `text`).

---

## SNavigationDrawer

Side drawer/sidebar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | `undefined` | Layout link (see overview) |
| `modelValue` | `boolean \| null` | `undefined` | Open/closed state (`v-model`). On resize it auto-opens on desktop and auto-closes on mobile (unless `persistent`) |
| `activator` | `string \| HTMLElement \| component` | `undefined` | Element excluded from the drawer's click-outside handling. It does **not** toggle the drawer — toggle `v-model` yourself |
| `permanent` | `boolean` | `false` | Always open on desktop (app-level layout only) |
| `miniVariant` | `boolean` | `false` | Collapsed (icon-only) mode (`v-model:mini-variant`) |
| `miniVariantWidth` | `string \| number` | `256` when not numeric | Width in mini mode — set it (e.g. `56`) |
| `expandOnHover` | `boolean` | `false` | Mini until hovered |
| `forceMobile` | `boolean` | `false` | Force mobile behavior on desktop |
| `hideOverlay` | `boolean` | `false` | Declared but has no effect — the drawer never renders a scrim |
| `touchless` | `boolean` | `false` | Disable swipe gestures and hover handlers |
| `location` | `string` | `'left'` | Side: `'left'`, `'right'` or `'bottom'`. `'bottom'` always behaves as mobile |
| `position` | `'fixed' \| 'absolute' \| …` | `undefined` | CSS position |
| `elevation` | `0–24` | `undefined` | Shadow |
| `persistent` | `boolean` | `false` | Desktop: ignore outside clicks and window resizes, so only `v-model` opens/closes it. Still closes when switching to mobile |
| `resizable` | `boolean` | `false` | Show a drag handle on the inner edge (desktop only, not in mini mode). Arrow keys resize (16px steps) when the handle is focused |
| `minWidth` | `number` | `200` | Smallest width when resizing (px) |
| `maxWidth` | `number` | `720` | Largest width when resizing (px) |
| `width` | `string \| number` | `256` | Drawer width (px). Use `v-model:width` with `resizable` to keep the dragged width |
| `height` | `string \| number` | `'100%'` (`'100vh'` with the `app` prop) | Drawer height |
| `tag` | `'nav' \| 'div' \| 'section'` | `'aside'` (`'nav'` with the `app` prop) | Root element |

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `prepend` | — | Above the content |
| `default` | `{ on }` | Drawer content |
| `append` | — | Below the content |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Open state changed |
| `update:width` | `number` | Fired when a resize ends (pointer release or arrow key) |
| `update:miniVariant` | `boolean` | Mini state changed |
| `transitionend` | `Event` | Open/close transition finished |

### Two drawers (navigation + side panel)

A left and a right drawer can share one layout; each offsets its own side of `SMain`. A typical AI chat side panel:

```vue
<SApp>
  <SLayout>
    <SAppBar position="fixed" />
    <SNavigationDrawer v-model="isNavOpen" />
    <SNavigationDrawer
      v-model="isChatOpen"
      v-model:width="chatWidth"
      location="right"
      persistent
      resizable
      :min-width="320"
      :max-width="640"
    >
      <!-- chat panel -->
    </SNavigationDrawer>
    <SMain />
  </SLayout>
</SApp>
```

On mobile both drawers slide in over the content.

---

## SMain

Primary content area. Its margins follow the drawers (left/right), a `fixed` app bar (top), and the bottom navigation (app level) or footer (nested).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | `undefined` | Layout link (see overview) |
| `tag` | `string` | `'main'` (app level) / `'section'` | Root element |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Page content |

---

## SFooter

Bottom footer bar. Its width tracks the drawers.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | `undefined` | Layout link |
| `position` | `'fixed' \| 'absolute' \| …` | `undefined` | CSS position — applied only in an app-level layout |
| `inset` | `boolean` | `false` | Inset footer |
| `padless` | `boolean` | `false` | Remove padding |
| `color` | `string` | `undefined` | Background color |
| `elevation` | `0–24` | `undefined` | Shadow |
| `height` / `width` / `min*` / `max*` | `string \| number` | `undefined` | Dimensions |
| `tag` | `'footer' \| 'div'` | `'footer'` | Root element |

---

## SBottomNavigation

Mobile bottom navigation bar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` / `app` | `string` / `boolean` | `undefined` | Layout link |
| `modelValue` | `string \| number \| boolean` | `undefined` | `value` of the active child `SButton` (`v-model`) |
| `height` | `string \| number` | `undefined` | **Set it.** Without it the bar collapses and `SMain` gets no bottom offset |
| `activeClass` | `string` | `undefined` | CSS class for the active button. **There is no active styling without it** |
| `mandatory` | `boolean` | `false` | Always keep one button selected |
| `hideOnScroll` | `boolean` | `false` | Hide on scroll down. It also overwrites `v-model` with a boolean — don't combine it with selection |
| `horizontal` | `boolean` | `false` | Horizontal button layout |
| `shift` | `boolean` | `false` | Hide labels when inactive |
| `grow` | `boolean` | `false` | Buttons stretch to fill width |
| `dense` | `boolean` | `false` | Compact height |
| `bordered` | `boolean` | `false` | Top border |
| `position` | `'fixed' \| 'absolute' \| …` | fixed at app level | Set `position="fixed"` in a nested layout |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SButton` components with `value` props |

---

## Grid: SContainer / SRow / SColumn

12-column responsive grid. The column component is **`SColumn`** — there is no `SCol`.

### SContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fluid` | `boolean` | `false` | Full-width (no max-width) |
| `fill` | `boolean` | `false` | Fill parent height |
| `narrow` | `boolean` | `false` | Narrower max-width |
| `wide` | `boolean` | `false` | Wider max-width |
| `padless` | `boolean` | `false` | Remove horizontal padding |
| `color` | `string` | `undefined` | Background color |
| `tag` | `string` | `'div'` | Root element |

### SRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `noGutters` | `boolean` | `false` | Remove column gutters |
| `noOuterGutters` | `boolean` | `false` | Remove outer padding only |
| `align` | `GridAlignPropertyType` | `undefined` | Cross-axis alignment: `'start'`, `'center'`, `'end'`, `'stretch'`, `'baseline'` |
| `justify` | `GridJustifyPropertyType` | `undefined` | Main-axis justify (**camelCase**): `'start'`, `'center'`, `'end'`, `'spaceBetween'`, `'spaceAround'` |
| `fillHeight` | `boolean` | `false` | Fill parent height |
| `dense` | `boolean` | `false` | Reduced gutters |
| `gap` | `number \| string` | `undefined` | Custom gap |
| `contentClass` / `contentStyle` | class / style | `undefined` | Inner wrapper class / style |

### SColumn Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span (all breakpoints) |
| `sm` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span at `sm` breakpoint |
| `md` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span at `md` breakpoint |
| `lg` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span at `lg` breakpoint |
| `order` | `number` | `undefined` | Flexbox order |
| `alignSelf` | `string` | `undefined` | Individual cross-axis alignment (CSS `align-self` value) |
| `contentClass` / `contentStyle` | class / style | `undefined` | Inner wrapper class / style |

There is no `xl` prop.

---

## SSpacer

Flexible space element (`flex-grow: 1`) that pushes siblings apart in flex containers.

No props.

---

## Usage

### Full Application Layout

```vue
<template>
  <SApp>
    <SLayout>
      <!-- App Bar -->
      <SAppBar position="fixed" elevate-on-scroll>
        <SButton variant="icon" @click="drawer = !drawer">
          <SIcon icon="mdi-menu" />
        </SButton>
        <SAppBarTitle>My App</SAppBarTitle>
        <SSpacer />
        <SButton variant="icon">
          <SIcon icon="mdi-account" />
        </SButton>
      </SAppBar>

      <!-- Navigation Drawer -->
      <SNavigationDrawer v-model="drawer">
        <SList>
          <SListItem :to="{ name: 'home' }" link>
            <SListItemIcon><SIcon icon="mdi-home" /></SListItemIcon>
            <SListItemContent><SListItemTitle>Home</SListItemTitle></SListItemContent>
          </SListItem>
          <SListItem :to="{ name: 'settings' }" link>
            <SListItemIcon><SIcon icon="mdi-cog" /></SListItemIcon>
            <SListItemContent><SListItemTitle>Settings</SListItemTitle></SListItemContent>
          </SListItem>
        </SList>
      </SNavigationDrawer>

      <!-- Main Content -->
      <SMain>
        <SContainer>
          <router-view />
        </SContainer>
      </SMain>

      <!-- Footer -->
      <SFooter>
        <SContainer>
          <span class="s_text--caption">© 2026 My App</span>
        </SContainer>
      </SFooter>
    </SLayout>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### Named (nested) layout

```vue
<!-- Every child needs for="admin" -->
<SLayout name="admin">
  <SAppBar for="admin" position="fixed" />
  <SNavigationDrawer for="admin" v-model="adminDrawer" />
  <SMain for="admin">…</SMain>
</SLayout>
```

### Grid System

```vue
<!-- Basic 2-column layout -->
<SContainer>
  <SRow>
    <SColumn :cols="12" :md="6">Left column</SColumn>
    <SColumn :cols="12" :md="6">Right column</SColumn>
  </SRow>
</SContainer>

<!-- 3-column responsive -->
<SContainer>
  <SRow>
    <SColumn v-for="item in items" :key="item.id" :cols="12" :sm="6" :md="4">
      <SCard>{{ item.title }}</SCard>
    </SColumn>
  </SRow>
</SContainer>

<!-- Centered content -->
<SRow justify="center" align="center">
  <SColumn :cols="8">Centered</SColumn>
</SRow>

<!-- Space between (camelCase) -->
<SRow justify="spaceBetween">
  <SColumn cols="auto">Left</SColumn>
  <SColumn cols="auto">Right</SColumn>
</SRow>

<!-- Push elements apart -->
<SRow>
  <SColumn cols="auto">Left</SColumn>
  <SSpacer />
  <SColumn cols="auto">Right</SColumn>
</SRow>
```

### Bottom Navigation (mobile)

```vue
<SApp>
  <SLayout>
    <SMain>Content</SMain>
    <SBottomNavigation v-model="activeNav" :height="56" active-class="is-active" grow>
      <SButton value="home">
        <SIcon icon="mdi-home" />
        <span>Home</span>
      </SButton>
      <SButton value="search">
        <SIcon icon="mdi-magnify" />
        <span>Search</span>
      </SButton>
      <SButton value="profile">
        <SIcon icon="mdi-account" />
        <span>Profile</span>
      </SButton>
    </SBottomNavigation>
  </SLayout>
</SApp>
```

`is-active` is your own CSS class — the component adds it to the selected button.

### App Bar button that toggles the drawer

```vue
<!-- `activator` does not toggle the drawer: bind v-model and toggle it from the button -->
<SAppBar position="fixed">
  <SButton id="nav-toggle" variant="icon" @click="drawer = !drawer">
    <SIcon icon="mdi-menu" />
  </SButton>
  <SAppBarTitle>Title</SAppBarTitle>
</SAppBar>

<!-- activator only keeps a click on the button from counting as an outside click -->
<SNavigationDrawer v-model="drawer" activator="#nav-toggle">
  <!-- drawer content -->
</SNavigationDrawer>
```

## Notes

- In a named layout, all children **must** share the same `name`/`for` value for offset calculation to work.
- `SMain` margins auto-adjust for drawers, a `fixed` `SAppBar`, and the bottom navigation (app level) or footer (nested).
- `SAppBar` `position` defaults to `undefined` (in flow) — pass `position="fixed"` for a fixed bar.
- For multiple independent layouts on the same page, use different `name` values.
- `SColumn cols="auto"` sizes to content width; `cols="grow"` fills remaining space.
- `SSpacer` is a `flex-grow: 1` element — use it inside `SRow` or `SAppBar` to push items apart.

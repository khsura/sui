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

SUI uses a named layout system — components are linked together via a shared `name`/`for` prop.

---

## Layout System Overview

```
SLayout (name="app")
  ├── SAppBar (for="app")
  ├── SNavigationDrawer (for="app")
  ├── SMain (for="app")          ← main content area
  ├── SFooter (for="app")
  └── SBottomNavigation (for="app")
```

Each layout child uses `:for="layoutName"` to register itself with the parent `SLayout`. The layout automatically calculates offsets so content doesn't overlap app bars or navigation drawers.

---

## SLayout

Root layout orchestrator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `'sui'` | Layout identifier — all children use `:for` to match this |

### Slots

| Slot | Description |
|------|-------------|
| `default` | All layout children |

---

## SAppBar

Fixed or static top application bar.

### Props (extends SToolbar props, plus)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | `'sui'` | Layout name to register with |
| `elevateOnScroll` | `boolean` | `false` | Add shadow when page is scrolled |
| `hideOnScroll` | `boolean` | `false` | Hide bar on scroll down, show on scroll up |
| `fixedExtension` | `boolean` | `false` | Keep extension fixed (doesn't collapse) |
| `position` | `'fixed' \| 'absolute'` | `'fixed'` | CSS position |
| `color` | `string` | `undefined` | Background color |
| `elevation` | `0–24` | `undefined` | Shadow depth |
| `density` | `ToolbarDensityType` | `'default'` | Height: `'default'`, `'comfortable'`, `'compact'` |
| `extended` | `boolean` | `false` | Enable extension area |

### Slots

| Slot | Description |
|------|-------------|
| `default` | App bar content |
| `prepend` | Left area |
| `append` | Right area |
| `extension` | Extension area below main bar |

---

## SAppBarTitle

Title text inside an app bar.

**Slot:** `default` — title content.

---

## SNavigationDrawer

Side drawer/sidebar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | `'sui'` | Layout name |
| `modelValue` | `boolean \| null` | `null` | Open/closed state (`v-model`) |
| `activator` | `string \| HTMLElement` | `undefined` | CSS selector or element that toggles the drawer |
| `permanent` | `boolean` | `false` | Always visible (ignores model) |
| `miniVariant` | `boolean` | `false` | Collapsed (icon-only) mode |
| `miniVariantWidth` | `string \| number` | `undefined` | Width in mini mode |
| `expandOnHover` | `boolean` | `false` | Expand from mini on hover |
| `forceMobile` | `boolean` | `false` | Force mobile overlay behavior |
| `hideOverlay` | `boolean` | `false` | No scrim overlay on mobile |
| `touchless` | `boolean` | `false` | Disable swipe gestures |
| `location` | `string` | `'left'` | Side: `'left'` or `'right'` |
| `position` | `'fixed' \| 'absolute'` | `'fixed'` | CSS position |
| `elevation` | `0–24` | `undefined` | Shadow |
| `width` | `string \| number` | `undefined` | Drawer width |
| `height` | `string \| number` | `undefined` | Drawer height |
| `tag` | `'nav' \| 'div' \| 'section'` | `'nav'` | Root element |

---

## SMain

Primary content area. Automatically adjusts padding for app bars/drawers.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | `'sui'` | Layout name |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Page content |

---

## SFooter

Bottom footer bar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | `'sui'` | Layout name |
| `position` | `'fixed' \| 'absolute'` | `undefined` | CSS position |
| `color` | `string` | `undefined` | Background color |
| `elevation` | `0–24` | `undefined` | Shadow |
| `height` | `string \| number` | `undefined` | Height |

---

## SBottomNavigation

Mobile bottom navigation bar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | `'sui'` | Layout name |
| `activeClass` | `string` | `undefined` | CSS class for active button |
| `hideOnScroll` | `boolean` | `false` | Hide on scroll down |
| `horizontal` | `boolean` | `false` | Horizontal button layout |
| `shift` | `boolean` | `false` | Hide labels when inactive |
| `grow` | `boolean` | `false` | Buttons stretch to fill width |
| `dense` | `boolean` | `false` | Compact height |
| `bordered` | `boolean` | `false` | Top border |
| `modelValue` | `any` | `undefined` | Active button value |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SButton` components with `value` props |

---

## Grid: SContainer / SRow / SColumn

12-column responsive grid.

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
| `justify` | `GridJustifyPropertyType` | `undefined` | Main-axis justify: `'start'`, `'center'`, `'end'`, `'space-between'`, `'space-around'` |
| `fillHeight` | `boolean` | `false` | Fill parent height |
| `dense` | `boolean` | `false` | Reduced gutters |
| `gap` | `number \| string` | `undefined` | Custom gap |

### SColumn Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span (all breakpoints) |
| `sm` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span at `sm` breakpoint |
| `md` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span at `md` breakpoint |
| `lg` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Column span at `lg` breakpoint |
| `order` | `number` | `undefined` | Flexbox order |
| `alignSelf` | `string` | `undefined` | Individual cross-axis alignment |

---

## SSpacer

Flexible space element (pushes siblings apart in flex containers).

No props. No slots (besides `default` which is typically empty).

---

## Usage

### Full Application Layout

```vue
<template>
  <SLayout name="app">
    <!-- App Bar -->
    <SAppBar for="app" color="primary" elevate-on-scroll>
      <template #prepend>
        <SButton variant="icon" @click="drawer = !drawer">
          <SIcon icon="mdi-menu" />
        </SButton>
      </template>
      <SAppBarTitle>My App</SAppBarTitle>
      <template #append>
        <SButton variant="icon">
          <SIcon icon="mdi-account" />
        </SButton>
      </template>
    </SAppBar>

    <!-- Navigation Drawer -->
    <SNavigationDrawer for="app" v-model="drawer">
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
    <SMain for="app">
      <SContainer>
        <router-view />
      </SContainer>
    </SMain>

    <!-- Footer -->
    <SFooter for="app">
      <SContainer>
        <span class="s_text--caption">© 2026 My App</span>
      </SContainer>
    </SFooter>
  </SLayout>
</template>

<script setup lang="ts">
const drawer = ref(false)
</script>
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

<!-- Push elements apart -->
<SRow>
  <SColumn cols="auto">Left</SColumn>
  <SSpacer />
  <SColumn cols="auto">Right</SColumn>
</SRow>
```

### Bottom Navigation (mobile)

```vue
<SLayout name="mobile">
  <SMain for="mobile">Content</SMain>
  <SBottomNavigation for="mobile" v-model="activeNav" grow>
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
```

### App Bar with Activator (toggles drawer)

```vue
<!-- The activator approach: no v-model needed -->
<SAppBar for="app">
  <SButton variant="icon" id="nav-toggle">
    <SIcon icon="mdi-menu" />
  </SButton>
  <SAppBarTitle>Title</SAppBarTitle>
</SAppBar>

<SNavigationDrawer for="app" activator="#nav-toggle">
  <!-- drawer content -->
</SNavigationDrawer>
```

## Notes

- All layout children **must** share the same `name`/`for` value for automatic offset calculation to work.
- `SMain` content padding auto-adjusts when `SAppBar`, `SNavigationDrawer`, or `SFooter` are registered.
- For multiple independent layouts on the same page, use different `name` values.
- `SColumn cols="auto"` sizes to content width; `cols="grow"` fills remaining space.
- `SSpacer` is a flex `flex: 1` element — use it inside `SRow` or `SAppBar` to push items apart.

---
name: sui-layout
description: Scaffold the app shell and page grid of a Vue or Nuxt app with @khsura/sui — SApp root, SLayout with SAppBar, SNavigationDrawer (left nav, right resizable panel), SMain, SFooter, SBottomNavigation, and the SContainer/SRow/SColumn grid. Use when creating an app layout, admin dashboard shell, sidebar/nav drawer, top bar, mobile bottom navigation, responsive grid, or fixing content hidden under the app bar/drawer or a drawer that doesn't attach.
argument-hint: [description of the layout you need]
---

Scaffold a SUI layout for: $ARGUMENTS

Ask the user the following if not already clear from $ARGUMENTS:
1. Which sections are needed? (app bar, navigation drawer, footer, bottom navigation, or just a content grid)
2. What goes in each section? (title, nav links, route slots, etc.)
3. Any color preferences?

Then generate a complete Vue SFC using these rules:

**Layout rules:**
- The app root is `<SApp>` (it provides theme colors and the popup container); `SLayout name="app"` goes inside it, at the app-shell level
- In Nuxt, `SLayout` and `SBottomNavigation` are **not** auto-registered by `@khsura/sui-nuxt` — import them from `@khsura/sui`
- All layout children must use `for="app"` to match the layout name. (`name`/`for` can be omitted together — everything then uses the app's default layout name — but never set `name` and leave `for` off: that child will not attach.)
- Do not add Vuetify's `app` prop to `SAppBar`/`SMain`/`SFooter` — it doesn't exist; `SLayout` handles placement
- `SAppBar for="app" position="fixed"` — top bar. Everything goes in the **default slot** (it has only `default` and `extension` slots — no `#prepend`/`#append`); order hamburger, title, `SSpacer`, actions. Without `position="fixed"` it scrolls away with the page and `elevate-on-scroll` does nothing
- `SNavigationDrawer for="app" v-model="drawer"` — sidebar
- Right-side panel (AI chat, details, inspector): a second `SNavigationDrawer for="app" location="right" persistent resizable v-model:width="panelWidth"`. A left and a right drawer share one layout and `SMain` makes room for both. `persistent` keeps it open when the user clicks in the content; `resizable` adds a drag handle (desktop only, clamped by `minWidth`/`maxWidth`, defaults 200/720)
- `SMain for="app"` — wraps all page content
- `SFooter for="app"` — optional bottom bar
- `SBottomNavigation for="app" v-model="activeNav" :height="56" active-class="…"` — mobile bottom tabs. Set `height` (it collapses without one) and `active-class` (there is no active styling otherwise)
- Below the `md` breakpoint the drawer becomes a mobile overlay; toggle it with `v-model`
- Keep one app-level `SLayout`. A nested/secondary `SLayout` does not offset its `SMain` for a drawer and `permanent` has no effect there — use the grid or `SSplitView` inside pages instead
- `SDivider` in a flex column collapses to zero width (it's an `<hr>` with auto margins) — give it `width: 100%` / `align-self: stretch`
- Use `SSpacer` inside `SAppBar` to push items right
- Use `SButton variant="icon"` + `SIcon` for toolbar icon buttons

**Grid rules:**
- `SContainer > SRow > SColumn` for responsive grids
- `SColumn` props: `:cols` (default), `:sm`, `:md`, `:lg` — values 1–12, `'auto'`, or `'grow'`
- `SRow` props: `align`, `justify`, `noGutters`, `fillHeight`, `dense`, `gap`

**Allowed prop values (use these, not CSS/flex names like flexEnd):**

| Component | Prop | Allowed values |
|-----------|------|----------------|
| **SRow** | `align` | `'start'` \| `'center'` \| `'end'` \| `'stretch'` \| `'baseline'` |
| **SRow** | `justify` | `'start'` \| `'center'` \| `'end'` \| `'spaceAround'` \| `'spaceBetween'` |
| **SColumn** | `cols`, `sm`, `md`, `lg` | `1`–`12` \| `'auto'` \| `'grow'` |
| **SColumn** | `alignSelf` | `'auto'` \| `'start'` \| `'center'` \| `'end'` \| `'stretch'` \| `'baseline'` \| etc. (CSS align-self values) |

Do **not** use `flexStart`, `flexEnd`, or `space-between` (kebab) — use `start`, `end`, and `spaceAround` / `spaceBetween` (camelCase).

**Imports:** all from `@khsura/sui`. Full props, slots and gotchas: [layout.md](../sui-component/references/layout.md). Icons (`mdi-*`) need `@mdi/font` loaded — see **sui-getting-started**.

**Reference template:**

```vue
<!-- App.vue (Vue) or layouts/default.vue (Nuxt) -->
<template>
  <SApp>
  <SLayout name="app">
    <SAppBar for="app" position="fixed" color="primary" elevate-on-scroll>
      <SButton variant="icon" @click="drawer = !drawer">
        <SIcon icon="mdi-menu" />
      </SButton>
      <SAppBarTitle>My App</SAppBarTitle>
      <SSpacer />
      <SButton variant="icon">
        <SIcon icon="mdi-account" />
      </SButton>
    </SAppBar>

    <SNavigationDrawer for="app" v-model="drawer">
      <SList>
        <SListItem
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          link
        >
          <SListItemIcon><SIcon :icon="item.icon" /></SListItemIcon>
          <SListItemContent>
            <SListItemTitle>{{ item.title }}</SListItemTitle>
          </SListItemContent>
        </SListItem>
      </SList>
    </SNavigationDrawer>

    <SMain for="app">
      <SContainer>
        <router-view />
      </SContainer>
    </SMain>
  </SLayout>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SApp, SLayout, SAppBar, SAppBarTitle, SNavigationDrawer, SMain,
  SContainer, SList, SListItem, SListItemIcon, SListItemContent,
  SListItemTitle, SIcon, SButton, SSpacer,
} from '@khsura/sui'

const drawer = ref(false)

const navItems = [
  { title: 'Home', icon: 'mdi-home', to: '/' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
]
</script>
```

Adapt this to match the user's requirements. Replace placeholder content, nav links, and colors with actual values.

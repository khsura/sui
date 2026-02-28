---
name: sui-layout
description: Scaffold a SUI app layout (app bar, navigation drawer, footer, grid). Use when the user asks to create a page layout, app shell, or wants help structuring a Vue app using @khsura/sui.
argument-hint: [description of the layout you need]
---

Scaffold a SUI layout for: $ARGUMENTS

Ask the user the following if not already clear from $ARGUMENTS:
1. Which sections are needed? (app bar, navigation drawer, footer, bottom navigation, or just a content grid)
2. What goes in each section? (title, nav links, route slots, etc.)
3. Any color preferences?

Then generate a complete Vue SFC using these rules:

**Layout rules:**
- `SLayout name="app"` is always the root
- All layout children must use `for="app"` to match the layout name
- `SAppBar for="app"` — top bar (use `#prepend` for hamburger, `#append` for right-side actions)
- `SNavigationDrawer for="app" v-model="drawer"` — sidebar
- `SMain for="app"` — wraps all page content
- `SFooter for="app"` — optional bottom bar
- `SBottomNavigation for="app" v-model="activeNav"` — mobile-only bottom tabs
- Use `SSpacer` inside `SAppBar` to push items right
- Use `SButton variant="icon"` + `SIcon` for toolbar icon buttons

**Grid rules:**
- `SContainer > SRow > SColumn` for responsive grids
- `SColumn` props: `:cols` (default), `:sm`, `:md`, `:lg` — values 1–12, `'auto'`, or `'grow'`
- `SRow` props: `align`, `justify`, `noGutters`

**Imports:** all from `@khsura/sui`

**Reference template:**

```vue
<template>
  <SLayout name="app">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SLayout, SAppBar, SAppBarTitle, SNavigationDrawer, SMain,
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

<template>
  <SLayout name="shell" height="100vh">
    <SAppBar for="shell" position="fixed" :elevation="2">
      <SButton
        id="shell-menu-button"
        variant="icon"
        aria-label="Toggle navigation"
        @click="isDrawerOpen = !isDrawerOpen"
      >
        <SIcon icon="mdi-menu" />
      </SButton>
      <SAppBarTitle>My App</SAppBarTitle>
      <SSpacer />
      <SButton variant="icon" aria-label="Account">
        <SIcon icon="mdi-account-circle" />
      </SButton>
    </SAppBar>

    <SNavigationDrawer v-model="isDrawerOpen" for="shell" activator="#shell-menu-button" :elevation="1">
      <SList>
        <SListItem v-for="page in pages" :key="page.title" link @click="currentPage = page.title">
          <SListItemIcon>
            <SIcon :icon="page.icon" />
          </SListItemIcon>
          <SListItemContent>
            <SListItemTitle>{{ page.title }}</SListItemTitle>
          </SListItemContent>
        </SListItem>
      </SList>
    </SNavigationDrawer>

    <SMain for="shell">
      <SContainer>
        <h1 class="s_text--h5 s_mb__2">{{ currentPage }}</h1>
        <p class="s_text--body__1">
          Page content goes here. On desktop the drawer sits beside this area; below the md breakpoint it slides in over
          the content and closes on an outside click.
        </p>
      </SContainer>
    </SMain>

    <SFooter for="shell">
      <SContainer>
        <span class="s_text--caption">© 2026 My App</span>
      </SContainer>
    </SFooter>
  </SLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SAppBar,
  SAppBarTitle,
  SButton,
  SContainer,
  SFooter,
  SIcon,
  SLayout,
  SList,
  SListItem,
  SListItemContent,
  SListItemIcon,
  SListItemTitle,
  SMain,
  SNavigationDrawer,
  SSpacer,
  useDisplay,
} from '@khsura/sui'

interface ShellPage {
  title: string
  icon: string
}

const pages: ShellPage[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Projects', icon: 'mdi-folder' },
  { title: 'Settings', icon: 'mdi-cog' },
]

const { mdAndUp } = useDisplay()
// Open beside the content on desktop, closed (temporary, over the content) on mobile.
const isDrawerOpen = ref(mdAndUp.value)
const currentPage = ref('Dashboard')
</script>

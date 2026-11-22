import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import {
  type TableHeader,
  SAppBar,
  SAppBarTitle,
  SBottomNavigation,
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
  STable,
} from '@/app/index'

/**
 * Stress cases for the layout shell, screenshotted by the visual harness (docs/visual-testing.md).
 * Every story renders the components with the library defaults: no app-level component defaults are relied on.
 */
const layoutStress: Meta = {
  title: 'UI Components/Layout/Stress',
  parameters: {
    layout: 'fullscreen',
  },
}

export default layoutStress

const LONG_TITLE = 'Quarterly operations dashboard for the northern region warehouses and depots'
const NAV_ITEM_COUNT = 30
const TABLE_ROW_COUNT = 6
const TABLE_COLUMN_COUNT = 10
// Keeps Drawer Variants within one 800px viewport at desktop width. Chromium captures a taller page with
// `captureBeyondViewport`, which resizes the window to 1x1 for a moment: the `md` breakpoint flips, and the
// persistent drawers close for good (docs/visual-testing.md, "Flaky captures").
const NESTED_LAYOUT_HEIGHT = 240
const RAIL_WIDTH = 56
const navIcons = ['mdi-view-dashboard', 'mdi-folder', 'mdi-account-group', 'mdi-chart-bar', 'mdi-cog']

const navItems = Array.from({ length: NAV_ITEM_COUNT }, (_, index) => ({
  title: `Navigation item ${index + 1}`,
  icon: navIcons[index % navIcons.length],
}))

const tableHeaders: TableHeader[] = Array.from({ length: TABLE_COLUMN_COUNT }, (_, index) => ({
  text: `Column ${index + 1}`,
  value: `column${index + 1}`,
}))

const tableItems = Array.from({ length: TABLE_ROW_COUNT }, (_, rowIndex) =>
  Object.fromEntries(tableHeaders.map((header) => [header.value, `Row ${rowIndex + 1} value`])),
)

const layoutComponents = {
  SAppBar,
  SAppBarTitle,
  SBottomNavigation,
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
  STable,
}

const navListTemplate = `
  <SList>
    <SListItem v-for="item in navItems" :key="item.title" link>
      <SListItemIcon><SIcon :icon="item.icon" /></SListItemIcon>
      <SListItemContent><SListItemTitle>{{ item.title }}</SListItemTitle></SListItemContent>
    </SListItem>
  </SList>
`

/**
 * The app-level shell as an AI writes it from the docs: the drawer model starts `false` and relies on the drawer
 * opening itself on desktop. A fixed app bar with a long title and several actions, a long drawer list, a table
 * wider than the phone, and a footer.
 */
export const AppShell = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: layoutComponents,
      setup: () => ({
        isDrawerOpen: ref(false),
        navItems,
        tableHeaders,
        tableItems,
        LONG_TITLE,
      }),
      template: `
        <SLayout>
          <SAppBar position="fixed">
            <SButton id="stress-menu" variant="icon" aria-label="Toggle navigation" @click="isDrawerOpen = !isDrawerOpen">
              <SIcon icon="mdi-menu" />
            </SButton>
            <SAppBarTitle>{{ LONG_TITLE }}</SAppBarTitle>
            <SButton variant="icon" aria-label="Search"><SIcon icon="mdi-magnify" /></SButton>
            <SButton variant="icon" aria-label="Notifications"><SIcon icon="mdi-bell" /></SButton>
            <SButton variant="icon" aria-label="Help"><SIcon icon="mdi-help-circle" /></SButton>
            <SButton variant="icon" aria-label="Account"><SIcon icon="mdi-account-circle" /></SButton>
          </SAppBar>
          <SNavigationDrawer v-model="isDrawerOpen" activator="#stress-menu">
            ${navListTemplate}
          </SNavigationDrawer>
          <SMain>
            <SContainer>
              <h1 class="s_text--h5">Orders</h1>
              <STable :headers="tableHeaders" :items="tableItems" outlined />
            </SContainer>
          </SMain>
          <SFooter>
            <SContainer><span class="s_text--caption">© 2026 Stress Co.</span></SContainer>
          </SFooter>
        </SLayout>
      `,
    }),
} satisfies StoryObj

/**
 * The `app-shell` recipe pattern (a named layout of the viewport height) with its mobile drawer open:
 * the page behind it is dimmed and the long list scrolls inside the drawer.
 */
export const MobileDrawerOpen = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: layoutComponents,
      setup: () => ({ isDrawerOpen: ref(true), navItems }),
      template: `
        <SLayout name="stressMobile" height="100vh">
          <SAppBar for="stressMobile" position="fixed">
            <SButton variant="icon" aria-label="Toggle navigation" @click="isDrawerOpen = !isDrawerOpen">
              <SIcon icon="mdi-menu" />
            </SButton>
            <SAppBarTitle>Mobile drawer</SAppBarTitle>
          </SAppBar>
          <SNavigationDrawer v-model="isDrawerOpen" for="stressMobile" force-mobile persistent>
            ${navListTemplate}
          </SNavigationDrawer>
          <SMain for="stressMobile">
            <SContainer><p>The page behind an open mobile drawer is dimmed.</p></SContainer>
          </SMain>
        </SLayout>
      `,
    }),
} satisfies StoryObj

/**
 * Drawer variants in nested, named layouts on one page: left and right drawers, a rail with a trailing app bar text,
 * and a resizable drawer with a footer.
 */
export const DrawerVariants = {
  tags: ['visual'],
  render: () =>
    defineComponent({
      components: layoutComponents,
      setup: () => ({
        isLeftOpen: ref(true),
        isRightOpen: ref(true),
        isRailOpen: ref(true),
        isResizableOpen: ref(true),
        navItems: navItems.slice(0, navIcons.length),
        NESTED_LAYOUT_HEIGHT,
        RAIL_WIDTH,
      }),
      template: `
        <div style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; padding: 16px;">
          <SLayout name="stressBoth" :height="NESTED_LAYOUT_HEIGHT" style="border: 1px solid currentColor;">
            <SAppBar for="stressBoth"><SAppBarTitle>Left and right drawers</SAppBarTitle></SAppBar>
            <SNavigationDrawer v-model="isLeftOpen" for="stressBoth" persistent>${navListTemplate}</SNavigationDrawer>
            <SNavigationDrawer v-model="isRightOpen" for="stressBoth" location="right" persistent>
              <div class="s_pa__4">Side panel</div>
            </SNavigationDrawer>
            <SMain for="stressBoth"><SContainer>Main content between two drawers.</SContainer></SMain>
          </SLayout>

          <SLayout name="stressRail" :height="NESTED_LAYOUT_HEIGHT" style="border: 1px solid currentColor;">
            <SAppBar for="stressRail">
              <SAppBarTitle>Rail (mini variant)</SAppBarTitle>
              <SSpacer />
              <span>128 items</span>
            </SAppBar>
            <SNavigationDrawer v-model="isRailOpen" for="stressRail" mini-variant :mini-variant-width="RAIL_WIDTH" persistent>
              ${navListTemplate}
            </SNavigationDrawer>
            <SMain for="stressRail"><SContainer>Main content beside a rail.</SContainer></SMain>
          </SLayout>

          <SLayout name="stressResize" :height="NESTED_LAYOUT_HEIGHT" style="border: 1px solid currentColor;">
            <SAppBar for="stressResize"><SAppBarTitle>Resizable drawer and footer</SAppBarTitle></SAppBar>
            <SNavigationDrawer v-model="isResizableOpen" for="stressResize" resizable persistent>${navListTemplate}</SNavigationDrawer>
            <SMain for="stressResize"><SContainer>Main content above a footer.</SContainer></SMain>
            <SFooter for="stressResize"><SContainer><span class="s_text--caption">Footer</span></SContainer></SFooter>
          </SLayout>
        </div>
      `,
    }),
} satisfies StoryObj

/**
 * A page shorter than the viewport, rendered straight inside SApp (no Storybook SMain around it): the app
 * background and the named layout's drawer reach the bottom of the viewport. This is the AI eval dashboard's
 * shape: a named layout with no height.
 */
export const ShortPage = {
  tags: ['visual'],
  parameters: {
    appDecorator: { main: false },
  },
  render: () =>
    defineComponent({
      components: layoutComponents,
      setup: () => ({ isDrawerOpen: ref(false), navItems: navItems.slice(0, navIcons.length) }),
      template: `
        <SLayout name="stressShort">
          <SAppBar for="stressShort" position="fixed">
            <SButton variant="icon" aria-label="Toggle navigation" @click="isDrawerOpen = !isDrawerOpen">
              <SIcon icon="mdi-menu" />
            </SButton>
            <SAppBarTitle>Short page</SAppBarTitle>
          </SAppBar>
          <SNavigationDrawer v-model="isDrawerOpen" for="stressShort">${navListTemplate}</SNavigationDrawer>
          <SMain for="stressShort">
            <SContainer><p>One line of content.</p></SContainer>
          </SMain>
        </SLayout>
      `,
    }),
} satisfies StoryObj

/** A short app-level page with a bottom navigation, straight inside SApp: the navigation sits at the viewport bottom. */
export const ShortPageBottomNavigation = {
  tags: ['visual'],
  parameters: {
    appDecorator: { main: false },
  },
  render: () =>
    defineComponent({
      components: layoutComponents,
      setup: () => ({ currentTab: ref('recent') }),
      template: `
        <SLayout>
          <SAppBar position="fixed"><SAppBarTitle>Bottom navigation</SAppBarTitle></SAppBar>
          <SMain>
            <SContainer><p>One line of content.</p></SContainer>
          </SMain>
          <SBottomNavigation v-model="currentTab" :height="56">
            <SButton value="recent"><SIcon icon="mdi-history" /><span>Recent</span></SButton>
            <SButton value="favorites"><SIcon icon="mdi-heart" /><span>Favorites</span></SButton>
            <SButton value="nearby"><SIcon icon="mdi-map-marker" /><span>Nearby</span></SButton>
          </SBottomNavigation>
        </SLayout>
      `,
    }),
} satisfies StoryObj
